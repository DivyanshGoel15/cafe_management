from voice.telephony import MockTelephonyProvider, TwilioTelephonyProvider
from voice.stt import MockSpeechToTextProvider, WhisperSpeechToTextProvider
from voice.tts import MockTextToSpeechProvider, OpenAITTSProvider, ElevenLabsTTSProvider
from voice.audio import AudioProcessor
from llm import MockLLMProvider, OpenAILLMProvider, LLMMessage


def test_mock_telephony_provider():
    provider = MockTelephonyProvider()
    call = provider.make_call("+15559990000", "agent-bella-01", "Reservation Confirmation")
    assert call.call_sid.startswith("mock-call-")
    assert call.status == "Connected"

    twiml = provider.generate_twiml_or_response("Welcome!")
    assert "<Response>" in twiml
    assert provider.hangup_call(call.call_sid) is True


def test_twilio_fallback_to_mock_when_no_credentials():
    provider = TwilioTelephonyProvider(account_sid=None, auth_token=None)
    call = provider.make_call("+15559990000", "agent-bella-01", "Test")
    assert call.call_sid.startswith("mock-call-")


def test_mock_stt_provider():
    provider = MockSpeechToTextProvider()
    # Direct text bytes
    transcript = provider.transcribe(b"I want to reserve a table for 4.")
    assert transcript == "I want to reserve a table for 4."

    # Whisper fallback
    whisper_fallback = WhisperSpeechToTextProvider(api_key=None)
    res = whisper_fallback.transcribe(b"What are your hours?")
    assert res == "What are your hours?"


def test_mock_tts_provider_synthesizes_valid_wav():
    provider = MockTextToSpeechProvider()
    audio = provider.synthesize("Hello from Bella Vista Bistro!")
    assert len(audio) > 44
    assert AudioProcessor.is_valid_wav_header(audio) is True

    # OpenAI TTS fallback
    openai_tts = OpenAITTSProvider(api_key=None)
    fallback_audio = openai_tts.synthesize("Welcome!")
    assert AudioProcessor.is_valid_wav_header(fallback_audio) is True

    # ElevenLabs TTS fallback
    eleven_tts = ElevenLabsTTSProvider(api_key=None)
    el_audio = eleven_tts.synthesize("Welcome!")
    assert AudioProcessor.is_valid_wav_header(el_audio) is True


def test_mock_llm_provider_conversational_response():
    provider = MockLLMProvider()
    messages = [
        LLMMessage(role="system", content="You are the cafe host."),
        LLMMessage(role="user", content="Hello, what is your address?"),
    ]
    res = provider.generate(messages)
    assert res.content is not None or res.tool_calls is not None
