import { FormEvent, useEffect, useState } from "react";

const grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | [LOTS MORE COLOURS] ;'
export default function ChatInput(props:any)
{
        const [isRecording,setIsRecording] = useState(false)

        const SpeechRecognition = window.SpeechRecognition ||  window.webkitSpeechRecognition
        const SpeechGrammarList = window.SpeechGrammarList ||  window.webkitSpeechGrammarList

        const recognition = new SpeechRecognition();
        const speechRecognitionList = new SpeechGrammarList();
        recognition.interimResults = true;

        useEffect(()=>{
          speechRecognitionList.addFromString(grammar, 1);
          recognition.onresult = function(event) {
            var color = event.results[0][0].transcript;
            //@ts-ignore
            document.getElementById('chat_input').value = color;
          }
        },[]) 

        const toggleRecording =  () =>{
          if(!isRecording)
          {
           recognition.start()
          }
          else 
          {
            recognition.stop()
          }
          setIsRecording(prev=>!prev);
        }

        const adjustHeight = (event:FormEvent) =>{
          const target = event.target as HTMLElement
          target.style.height="auto"
          target.style.height = (target.scrollHeight-7) + "px";
          if(target.scrollHeight-7>335)
          {
            target.style.overflowY = "visible";
          }
        }
              
        return (
          <div className="text-input">
            <textarea id="chat_input" name="chat_input" onInput={(ev)=>adjustHeight(ev)} rows={1} cols={30}></textarea>
            <button onClick={toggleRecording}>{isRecording ? (<i className="lni lni-mic in_use"></i>) : (<i className="lni lni-mic"></i>)}</button>
            <button onClick={props.handleSubmit}><i className="lni lni-chevron-up-circle"></i></button>
          </div>
        );
} 