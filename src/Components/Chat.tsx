import React, { useContext, useEffect, useState } from "react";
import LeftColumn from "./LeftColumn";
import MainColumn from "./MainColumn";
import RightColumn from "./RightColumn";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./App";

export type Bot = {
   botName:string,
   address:string
}


function Chat()
{
   const nav = useNavigate()
   const {token} = useContext(AppContext)
   const [bot,setBot] = useState({
      botName: "TOMASZ",
      address:"/TOMASZ"
   })

   useEffect(()=>{
      if(!token)
      {
         nav('/login')
      }
   },[token])




   return (<div className="container">
   <LeftColumn setBot={setBot}/>
   <MainColumn botName={bot.botName} address={bot.address}/>
   <RightColumn/>
   </div>)
}

export default Chat;