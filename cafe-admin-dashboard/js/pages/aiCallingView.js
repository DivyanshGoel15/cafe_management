/* ══════════════════════════════════════════════════════════════
   BREW & CO — AI VOICE CALLING MANAGEMENT VIEW CONTROLLER
   Call history, interactive transcripts, voice configuration & analytics
   ══════════════════════════════════════════════════════════════ */

import { store } from '../store.js';
import { toast } from '../components/toast.js';
import { modal } from '../components/modal.js';

let aiCallTab = 'logs'; // 'logs' or 'config'

export function renderAiCalling() {
  const state = store.getState();
  const el = document.getElementById('view-ai-calling');
  if (!el) return;

  const ai = state.aiCalls;

  el.innerHTML = `
    <!-- AI Calling Status Banner -->
    <div style="background:var(--card); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-bottom:18px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg, #7C3AED, #4F46E5); display:flex; align-items:center; justify-content:center; color:#fff; font-size:22px; box-shadow:0 3px 10px rgba(124,58,237,0.3);">
            🎙️
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:16px; font-weight:700; color:var(--text);">${ai.agent.name}</span>
              <span class="badge badge-green">${ai.agent.status}</span>
            </div>
            <div style="font-size:12px; color:var(--muted); margin-top:2px;">
              Direct Inbound Number: <strong>${ai.agent.phone}</strong> &middot; ${ai.agent.provider}
            </div>
          </div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="window.testAiCallSimulation()">📞 Simulate Incoming Test Call</button>
          <button class="btn btn-primary btn-sm" onclick="window.switchAiCallTab('config')">⚙️ Configure Agent</button>
        </div>
      </div>
    </div>

    <!-- AI Call Metrics -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Calls Handled Today</div>
        <div class="stat-value">${ai.stats.totalCallsToday}</div>
        <div class="stat-delta up">384 calls this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Booking Conversions</div>
        <div class="stat-value">${ai.stats.bookingConversions}%</div>
        <div class="stat-delta up">+14 confirmed bookings generated</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Call Duration</div>
        <div class="stat-value">${ai.stats.avgCallDuration}</div>
        <div class="stat-delta neutral">Target: Under 2 mins</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Human Staff Escalations</div>
        <div class="stat-value">3 calls</div>
        <div class="stat-delta up">92.8% fully automated</div>
      </div>
    </div>

    <!-- Controls Header -->
    <div class="section-header">
      <div class="filter-tabs">
        <button class="ftab ${aiCallTab === 'logs' ? 'active' : ''}" onclick="window.switchAiCallTab('logs')">📞 Recent Inbound Calls &amp; Transcripts (${ai.calls.length})</button>
        <button class="ftab ${aiCallTab === 'config' ? 'active' : ''}" onclick="window.switchAiCallTab('config')">⚙️ Voice Agent Configuration</button>
      </div>
    </div>

    <!-- Tab 1: Call Logs -->
    ${aiCallTab === 'logs' ? `
      <div class="table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Caller</th>
                <th>Phone Number</th>
                <th>Date &amp; Time</th>
                <th>Duration</th>
                <th>Purpose / Intent</th>
                <th>Result</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${ai.calls.map(c => `
                <tr>
                  <td class="td-mono td-bold">${c.id}</td>
                  <td class="td-bold">${c.caller}</td>
                  <td class="td-muted">${c.phone}</td>
                  <td>${c.time}</td>
                  <td>${c.duration}</td>
                  <td><span class="badge badge-purple">${c.intent}</span></td>
                  <td>${c.result}</td>
                  <td>
                    <span class="badge ${c.status === 'Successful' ? 'badge-green' : 'badge-yellow'}">${c.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="window.openCallTranscript('${c.id}')">Transcript</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    ` : `
      <!-- Tab 2: Agent Configuration Form -->
      <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:24px; max-width:820px;">
        <form onsubmit="window.saveAiAgentConfig(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Voice Agent Display Name *</label>
              <input type="text" class="form-input" id="cfg-agent-name" required value="${ai.agent.name}">
            </div>
            <div class="form-group">
              <label class="form-label">Voice Model &amp; Tone *</label>
              <select class="form-select" id="cfg-voice-model">
                <option value="Aadhya" ${ai.agent.voice.includes('Aadhya') ? 'selected' : ''}>Aadhya (Warm Indian English / Hindi Female)</option>
                <option value="Kabir" ${ai.agent.voice.includes('Kabir') ? 'selected' : ''}>Kabir (Friendly Deep Indian Male)</option>
                <option value="Priya" ${ai.agent.voice.includes('Priya') ? 'selected' : ''}>Priya (Energetic Urban English Female)</option>
                <option value="Rohan" ${ai.agent.voice.includes('Rohan') ? 'selected' : ''}>Rohan (Casual English/Hindi Male)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Opening Greeting Phrase *</label>
            <textarea class="form-textarea" id="cfg-greeting" required>${ai.agent.greeting}</textarea>
            <div class="form-hint">Played immediately when the customer call connects.</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Operating Active Hours</label>
              <input type="text" class="form-input" id="cfg-hours" value="${ai.agent.operatingHours}">
            </div>
            <div class="form-group">
              <label class="form-label">Language Mode</label>
              <select class="form-select" id="cfg-lang">
                <option value="Bilingual" selected>Bilingual (Hinglish + Indian English)</option>
                <option value="English">Pure English</option>
                <option value="Hindi">Pure Hindi</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Escalation / Human Handover Rule</label>
            <input type="text" class="form-input" id="cfg-escalate" value="${ai.agent.escalationRule}">
          </div>

          <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
            <button type="submit" class="btn btn-primary btn-sm">Save Voice Configuration</button>
          </div>
        </form>
      </div>
    `}

    <!-- Call Transcript Modal -->
    <div class="modal-backdrop" id="modal-call-transcript">
      <div class="modal-box modal-lg">
        <div class="modal-header">
          <div>
            <div class="modal-title" id="transcript-modal-title">Call Recording &amp; Transcript</div>
            <div style="font-size:11.5px; color:var(--muted); margin-top:2px;" id="transcript-modal-sub"></div>
          </div>
          <button class="modal-close-btn" onclick="window.modal.close('modal-call-transcript')">✕</button>
        </div>
        <div class="modal-body">
          <!-- Audio Playback Simulator -->
          <div style="background:#FAFAF9; border:1px solid var(--border); border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; gap:14px;">
            <button class="btn btn-primary btn-sm" id="btn-audio-play" onclick="window.toggleAudioSimulation()">▶ Play Audio</button>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--muted); margin-bottom:4px;">
                <span>00:14 / 01:45</span>
                <span>Stereo 16kHz MP3</span>
              </div>
              <div style="height:6px; background:#D5D2CD; border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:28%; background:var(--accent); border-radius:3px;"></div>
              </div>
            </div>
          </div>

          <!-- Transcript Lines -->
          <div style="font-size:12px; font-weight:700; color:var(--muted); text-transform:uppercase; margin-bottom:8px;">Full Audio Transcript</div>
          <div style="background:#FFFFFF; border:1px solid var(--border); border-radius:8px; padding:14px; font-family:inherit; font-size:13px; line-height:1.6; white-space:pre-line;" id="transcript-modal-content"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost btn-sm" onclick="window.modal.close('modal-call-transcript')">Close</button>
        </div>
      </div>
    </div>
  `;
}

window.switchAiCallTab = (tab) => {
  aiCallTab = tab;
  renderAiCalling();
};

window.openCallTranscript = (callId) => {
  const state = store.getState();
  const call = state.aiCalls.calls.find(c => c.id === callId);
  if (!call) return;

  document.getElementById('transcript-modal-title').textContent = `${call.id} — ${call.caller} (${call.intent})`;
  document.getElementById('transcript-modal-sub').textContent = `${call.phone} &middot; ${call.time} &middot; Duration: ${call.duration}`;
  document.getElementById('transcript-modal-content').textContent = call.transcript;

  modal.open('modal-call-transcript');
};

window.toggleAudioSimulation = () => {
  const btn = document.getElementById('btn-audio-play');
  if (btn.textContent.includes('Play')) {
    btn.textContent = '⏸ Pause';
    toast.info('Simulating audio playback from cloud storage...');
  } else {
    btn.textContent = '▶ Play Audio';
  }
};

window.testAiCallSimulation = () => {
  toast.success('Triggering simulated test call to +91 80 4000 1234...');
  setTimeout(() => {
    toast.info('Aadhya AI Agent answered call: "Namaste! Welcome to Brew & Co..."');
  }, 1000);
};

window.saveAiAgentConfig = (e) => {
  e.preventDefault();
  const name = document.getElementById('cfg-agent-name').value.trim();
  const voice = document.getElementById('cfg-voice-model').value;
  const greeting = document.getElementById('cfg-greeting').value.trim();
  const operatingHours = document.getElementById('cfg-hours').value.trim();
  const escalationRule = document.getElementById('cfg-escalate').value.trim();

  store.updateAiAgentConfig({
    name,
    voice,
    greeting,
    operatingHours,
    escalationRule
  });

  toast.success('AI Voice Agent configuration saved and deployed to telephony endpoint!');
  renderAiCalling();
};
