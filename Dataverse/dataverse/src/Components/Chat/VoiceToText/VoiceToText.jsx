import React from 'react';
import "./voiceToText.css";
import mic from "../../../assets/microphone2.png";
import stop from "../../../assets/stop.png";
import reset from "../../../assets/reset.png";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const VoiceToText = (props) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    props.showToast("Your browser doesn't support speech recognition", "error");
    return null;
  }

  const handleCancel = () => {
    resetTranscript();
    props.setTrigger(false);
  };

  const handleSend = () => {
    props.setTrigger(false);
    props.setVoicePrompt(transcript); 
  };

  return (
    props.trigger ? (
      <div className='VTT'>
        <h1 className='title-t'>{listening ? 'Listening......' : 'Click to start Talking'}</h1>
        <div>
        <button onClick={SpeechRecognition.startListening}>
          <div className={listening ? 'outer-circle-lis' : 'outer-circle'}>
            <div className='inner-circle'>
              <img className='mic' src={mic} alt="mic" />
            </div>
          </div>
        </button>
        </div>
  
        <div>
        {listening ? (
          <>
            <button onClick={SpeechRecognition.stopListening}> <img className='mic' src={stop} alt="stop" /></button>
            <button onClick={resetTranscript}> <img className='mic' src={reset} alt="reset" /></button>
          </>
        ) : null}
        </div>
        
        
        <p className='trans'>{transcript}</p>
        
        <button onClick={handleSend} className='save-button7'>Done</button>
        <button onClick={handleCancel} className='save-button7'>Cancel</button>
      </div>
    ) : null
  );
}

export default VoiceToText;
