import React, { useContext, useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import { url } from "../config";
import { AppContext } from "./App";
import TextEncoding from 'text-encoding'
import parse from 'html-react-parser'; 

type propType = {
    botName?:string,
    address?:string
}

type cloud = {
    isResponse: boolean,
    content: string
}

export default function MainColumn(props:propType)
{
    const [clouds,setClouds] = useState(Array<cloud>)
    const {token} = useContext(AppContext)

    function addCloud(newCloud:cloud)
    {
        setClouds(prev=>{
             prev.push(newCloud)
             return [...prev]
        })
    }

    async function handleSubmit() {
        const area = document.querySelector('#chat_input') as HTMLTextAreaElement;
      
        if (area) {
            const content = area.value;
            area.value = "";
            addCloud({isResponse:false,content:content})
            addCloud({isResponse:true,content:""})
            try {
                const response = await fetch(url + 'bot' + props.address, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    },
                    body: JSON.stringify({ content: content })
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
    
                const stream = response.body;
    
                if (stream) {
                    const reader = stream.getReader();
                    const decoder = new TextEncoding.TextDecoder()
                    let responseBody = ""
                    while (true) {
                        const { done, value } = await reader.read();
    
                        if (done) {
                            break;
                        }
                        let str = decoder.decode(value.buffer).toString();

                        responseBody+=str;

                        // eslint-disable-next-line no-loop-func
                        setClouds(prev=>{
                            const tmp = [...prev]
                            tmp[tmp.length-1].content = responseBody;
                            return tmp
                        })
                    }
                } else {
                    console.log('Response stream is not available.');
                }
            } catch (error) {
                console.error('Error occurred while fetching:', error);
            }
        }
    }

    function generateSpeech(content:string)
    {
        const message = new SpeechSynthesisUtterance(content);
        message.rate = 1
        message.lang = 'en-GB';
        message.volume= 100;
        window.speechSynthesis.speak(message)
    }
    
    return (<div className="chat_container" id="chat_container">
        <div className="cloud_container">
            
            {clouds.map((cloud:cloud,idx:number)=> 
                cloud.isResponse===true ? (<><li className="response"key={idx}>{cloud.content.includes("```")?cloud.content:parse(cloud.content)} </li><div className="speaker" onClick={()=>generateSpeech(cloud.content)}><i className="lni lni-volume-high"></i></div></>) :(<li className="request" key={idx}>{cloud.content}</li> ))
            }
        </div>
        <ChatInput handleSubmit={handleSubmit}/>
    </div>)
}