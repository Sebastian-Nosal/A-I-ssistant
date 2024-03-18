import React, { useEffect, useState } from "react";
import type Bot from './Chat'
import { url } from "../config";
import axios from "axios";

type prop = {
    setBot: Function
}

export default function LeftColumn(props:prop)
{
    const [bots,setBot] = useState(Array<{bot_id:0,api_url:"",bot_name:""}>)
    useEffect( ()=>{
        const resp = axios.get(url+'bot/')
        resp.then(res=>res.data)
        .then(data=>setBot(data))
        document.querySelector('.active')?.classList.remove('active')
        document.querySelector('.bot_plate')?.classList.add('active')
    },[])

    useEffect(()=>{
        document.querySelector('.active')?.classList.remove('active')
        document.querySelector('.bot_plate')?.classList.add('active')

    },[bots])

    function handleSelect(ev:any,el:any)
    {
        props.setBot({address:el.api_url,botName:el.bot_name})
        document.querySelector('.active')?.classList.remove('active')
        ev.target.parentElement.classList.add('active');
    }

    return (<div className="left_col">
        <aside>
            {bots.map(el=>(<div className="bot_plate" onClick={(ev)=>handleSelect(ev,el)} key={el.bot_id}><p>Bot {el.bot_name}</p></div>))}
        </aside>
    </div>)

}