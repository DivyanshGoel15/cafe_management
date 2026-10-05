let activeCallId = null;
let callTimerInterval = null;
let callSeconds = 0;
let currentAgent = null;

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  loadSystemHealth();
  loadAgentSettings();
  loadCalls();
  loadAnalytics();

  document.getElementById("btnInboundCall").addEventListener("click", () => startCall("incoming"));
  document.getElementById("btnOutboundCall").addEventListener("click", () => startCall("outgoing"));
  document.getElementById("btnHangup").addEventListener("click", endCall);
});

// TAB SWITCHING
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const targetPane = document.getElementById(btn.getAttribute("data-tab"));
      if (targetPane) targetPane.classList.add("active");

      // Tab specific refresh
      if (btn.getAttribute("data-tab") === "tabCalls") loadCalls();
      if (btn.getAttribute("data-tab") === "tabAnalytics") loadAnalytics();
    });
  });
}

// SYSTEM HEALTH & BADGES
async function loadSystemHealth() {
  try {
    const res = await fetch("/health");
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById("tagTel").innerText = data.providers?.telephony || "Mock";
    document.getElementById("tagStt").innerText = data.providers?.stt || "Mock";
    document.getElementById("tagLlm").innerText = data.providers?.llm || "Mock";
    document.getElementById("tagTts").innerText = data.providers?.tts || "Mock";

    const badge = document.getElementById("mockBadge");
    if (data.mock_mode) {
      badge.innerHTML = '<span class="dot pulse"></span> MOCK MODE: ACTIVE';
    } else {
      badge.innerHTML = '<span class="dot pulse" style="background:#10b981;"></span> LIVE PROVIDERS';
    }
  } catch (err) {
    console.error("Health check failed", err);
  }
}

// CALL CONTROL
async function startCall(direction) {
  const phone = document.getElementById("callerPhone").value.trim() || "+15551234567";
  const name = document.getElementById("callerName").value.trim() || "Sarah Connor";

  // Reset feed
  document.getElementById("transcriptFeed").innerHTML = "";
  document.getElementById("toolCallsFeed").innerHTML = '<p class="placeholder-text">Listening...</p>';

  try {
    const res = await fetch("/simulation/call/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caller_number: phone,
        customer_name: name,
        direction: direction,
      }),
    });
    const data = await res.json();
    activeCallId = data.call_id;

    // UI Updates
    setCallActiveUI(true, direction);
    document.getElementById("activeCallId").innerText = activeCallId;
    document.getElementById("activeDirection").innerText = direction.toUpperCase();
    document.getElementById("activeStatusPill").innerText = "CONNECTED";
    document.getElementById("activeBookingId").innerText = "—";
    document.getElementById("activeEscalation").innerText = "None";

    // Initial greeting
    appendTranscriptBubble("ai", data.greeting);
    triggerVoicePulse(1200);

  } catch (err) {
    alert("Failed to start call: " + err);
  }
}

function setCallActiveUI(isActive, direction = "incoming") {
  const dot = document.getElementById("callStatusDot");
  const statusText = document.getElementById("callStatusText");
  const input = document.getElementById("customerInput");
  const btnSend = document.getElementById("btnSend");
  const btnHangup = document.getElementById("btnHangup");
  const btnInbound = document.getElementById("btnInboundCall");
  const btnOutbound = document.getElementById("btnOutboundCall");

  if (isActive) {
    dot.classList.add("active");
    statusText.innerText = direction === "incoming" ? "Call Connected (Inbound)" : "Call Connected (Outbound)";
    input.disabled = false;
    btnSend.disabled = false;
    btnHangup.disabled = false;
    btnInbound.disabled = true;
    btnOutbound.disabled = true;
    input.focus();
    startTimer();
  } else {
    dot.classList.remove("active");
    statusText.innerText = "No Active Call";
    input.disabled = true;
    btnSend.disabled = true;
    btnHangup.disabled = true;
    btnInbound.disabled = false;
    btnOutbound.disabled = false;
    stopTimer();
    document.getElementById("visualizer").classList.remove("speaking");
  }
}

function startTimer() {
  stopTimer();
  callSeconds = 0;
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, "0");
    const secs = String(callSeconds % 60).padStart(2, "0");
    document.getElementById("callTimer").innerText = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  if (callTimerInterval) clearInterval(callTimerInterval);
}

// SEND TURN
async function sendCustomerTurn(e) {
  e.preventDefault();
  if (!activeCallId) return;

  const input = document.getElementById("customerInput");
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  appendTranscriptBubble("customer", message);

  try {
    const res = await fetch("/simulation/call/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        call_id: activeCallId,
        customer_message: message,
      }),
    });
    const data = await res.json();

    // AI Response
    triggerVoicePulse(1500);
    appendTranscriptBubble("ai", data.ai_response);

    // Update Tools Inspector
    if (data.tool_executions && data.tool_executions.length > 0) {
      renderToolExecutions(data.tool_executions);
    }

    // Update Booking Badge
    if (data.booking_id) {
      document.getElementById("activeBookingId").innerText = data.booking_id;
    }

    // Update Escalation Badge
    if (data.escalated) {
      document.getElementById("activeEscalation").innerHTML = `<span style="color:#ef4444;font-weight:700;">Transferred: ${data.escalation_reason || "Staff requested"}</span>`;
      document.getElementById("activeStatusPill").innerText = "ESCALATED";
    }

  } catch (err) {
    console.error("Step turn error", err);
  }
}

// END CALL
async function endCall() {
  if (!activeCallId) return;

  try {
    const res = await fetch("/simulation/call/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_id: activeCallId }),
    });
    const data = await res.json();

    appendTranscriptBubble("ai", `[Call Ended. Summary: ${data.ai_summary || "Call completed."}]`);
    setCallActiveUI(false);
    activeCallId = null;
    loadCalls();
    loadAnalytics();
  } catch (err) {
    console.error("End call failed", err);
  }
}

// QUICK FILL CHIP
function quickFill(text) {
  const input = document.getElementById("customerInput");
  if (!input.disabled) {
    input.value = text;
    input.focus();
  }
}

// TRANSCRIPT BUBBLES
function appendTranscriptBubble(speaker, text) {
  const feed = document.getElementById("transcriptFeed");
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble bubble-${speaker}`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const label = speaker === "ai" ? "Bella (AI Host)" : "Customer";

  bubble.innerHTML = `
    <div class="bubble-meta">
      <span><strong>${label}</strong></span>
      <span>${timeStr}</span>
    </div>
    <div class="bubble-content">${escapeHtml(text)}</div>
  `;
  feed.appendChild(bubble);
  feed.scrollTop = feed.scrollHeight;
}

function renderToolExecutions(tools) {
  const feed = document.getElementById("toolCallsFeed");
  if (feed.querySelector(".placeholder-text")) {
    feed.innerHTML = "";
  }
  tools.forEach(t => {
    const card = document.createElement("div");
    card.className = "tool-card";
    card.innerHTML = `
      <div class="tool-name">⚡ ${escapeHtml(t.tool || "tool")}</div>
      <div class="tool-data">${escapeHtml(JSON.stringify(t.result || {}, null, 2))}</div>
    `;
    feed.appendChild(card);
  });
  feed.scrollTop = feed.scrollHeight;
}

function triggerVoicePulse(ms) {
  const viz = document.getElementById("visualizer");
  viz.classList.add("speaking");
  setTimeout(() => viz.classList.remove("speaking"), ms);
}

// PRE-BUILT SCENARIO RUNNER
async function runScenario(scenarioName) {
  document.getElementById("transcriptFeed").innerHTML = `<div class="empty-state"><p>Running scenario '${scenarioName}'...</p></div>`;
  document.getElementById("toolCallsFeed").innerHTML = '<p class="placeholder-text">Running automated turns...</p>';

  try {
    const res = await fetch(`/simulation/scenarios/${scenarioName}`, { method: "POST" });
    const data = await res.json();

    document.getElementById("transcriptFeed").innerHTML = "";
    activeCallId = data.call_id;
    document.getElementById("activeCallId").innerText = data.call_id;
    document.getElementById("activeDirection").innerText = "INCOMING";
    document.getElementById("activeStatusPill").innerText = data.final_status.toUpperCase();
    if (data.booking_id) document.getElementById("activeBookingId").innerText = data.booking_id;

    // Greeting
    appendTranscriptBubble("ai", data.initial_greeting);

    // Replay turns with delay
    for (let i = 0; i < data.turns.length; i++) {
      const turn = data.turns[i];
      appendTranscriptBubble("customer", turn.customer_text);
      appendTranscriptBubble("ai", turn.ai_response);
      if (turn.tool_executions && turn.tool_executions.length > 0) {
        renderToolExecutions(turn.tool_executions);
      }
      if (turn.booking_id) {
        document.getElementById("activeBookingId").innerText = turn.booking_id;
      }
      if (turn.escalated) {
        document.getElementById("activeEscalation").innerHTML = `<span style="color:#ef4444;font-weight:700;">Transferred</span>`;
      }
    }

    appendTranscriptBubble("ai", `[Call Concluded. Summary: ${data.ai_summary}]`);
    setCallActiveUI(false);
    activeCallId = null;
    loadCalls();
    loadAnalytics();

  } catch (err) {
    alert("Scenario failed: " + err);
  }
}

// CALL HISTORY TABLE
async function loadCalls() {
  const tbody = document.getElementById("callsTableBody");
  try {
    const res = await fetch("/calls?limit=50");
    const data = await res.json();
    if (!data.calls || data.calls.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">No call records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.calls.map(c => {
      const statusColor = c.status === "Completed" ? "#10b981" : c.status === "Escalated" ? "#ef4444" : "#f59e0b";
      return `
        <tr>
          <td><code>${c.id}</code></td>
          <td>${c.caller_number}</td>
          <td><span class="tag">${c.direction}</span></td>
          <td><span style="color:${statusColor};font-weight:600;">${c.status}</span></td>
          <td>${c.duration}s</td>
          <td>${c.outcome || "—"}</td>
          <td>${c.booking_id ? `<strong style="color:#10b981">${c.booking_id}</strong>` : "—"}</td>
          <td>
            <button class="btn btn-secondary" style="padding:0.25rem 0.6rem;font-size:0.75rem;" onclick="viewTranscript('${c.id}')">
              Transcript
            </button>
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    console.error("Failed to load calls", err);
  }
}

// TRANSCRIPT MODAL
async function viewTranscript(callId) {
  try {
    const res = await fetch(`/call-transcripts/${callId}`);
    if (!res.ok) return;
    const data = await res.json();

    document.getElementById("modalTitle").innerText = `Transcript — ${data.call_id}`;
    document.getElementById("modalSummary").innerHTML = `<strong>AI Summary:</strong> ${escapeHtml(data.summary || "No summary recorded.")}`;

    const body = document.getElementById("modalTranscriptBody");
    body.innerHTML = data.transcripts.map(t => `
      <div class="chat-bubble bubble-${t.speaker}" style="max-width:90%">
        <div class="bubble-meta">
          <strong>${t.speaker.toUpperCase()}</strong>
          <span>${new Date(t.timestamp).toLocaleTimeString()}</span>
        </div>
        <div>${escapeHtml(t.message)}</div>
      </div>
    `).join("");

    document.getElementById("transcriptModal").style.display = "flex";
  } catch (err) {
    alert("Could not load transcript: " + err);
  }
}

function closeModal() {
  document.getElementById("transcriptModal").style.display = "none";
}

// ANALYTICS
async function loadAnalytics() {
  try {
    const res = await fetch("/call-statistics");
    const data = await res.json();
    document.getElementById("statTotal").innerText = data.total_calls;
    document.getElementById("statCompletion").innerText = `${data.completion_rate_percent}%`;
    document.getElementById("statEscalation").innerText = `${data.escalation_rate_percent}%`;
    document.getElementById("statDuration").innerText = `${data.average_duration_seconds}s`;
    document.getElementById("statBookings").innerText = data.bookings_created;
  } catch (err) {
    console.error("Failed to load analytics", err);
  }
}

// AGENT CONFIGURATION
async function loadAgentSettings() {
  try {
    const res = await fetch("/agents");
    const agents = await res.json();
    if (agents && agents.length > 0) {
      currentAgent = agents[0];
      document.getElementById("agentName").value = currentAgent.name;
      document.getElementById("agentRole").value = currentAgent.role;
      document.getElementById("agentTone").value = currentAgent.tone;
      document.getElementById("agentPrompt").value = currentAgent.system_prompt;
    }
  } catch (err) {
    console.error("Failed to load agent", err);
  }
}

async function saveAgentSettings() {
  if (!currentAgent) return;
  const updates = {
    name: document.getElementById("agentName").value,
    role: document.getElementById("agentRole").value,
    tone: document.getElementById("agentTone").value,
    system_prompt: document.getElementById("agentPrompt").value,
  };

  try {
    const res = await fetch(`/agents/${currentAgent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      alert("AI Agent configuration updated successfully!");
    } else {
      alert("Failed to update agent settings.");
    }
  } catch (err) {
    alert("Error updating agent: " + err);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
