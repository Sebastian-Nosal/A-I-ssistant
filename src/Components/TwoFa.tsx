import { useLocation, useNavigate } from "react-router-dom"
import Key from "./presentation/Key"
import Mail from "./presentation/Mail"
import PIN from "./presentation/PIN"
import TwoFAForm from "./presentation/TwoFAForm"
import { useContext, useEffect, useState } from "react"
import { AppContext } from "./App"
import axios from "axios"
import { url } from "../config"
import {startRegistration, startAuthentication} from '@simplewebauthn/browser';

export default function TwoFA(props:any)
{
    const [lang,setLang] = useState()
    const {language,token} = useContext(AppContext);
    const [userId, setUserId] = useState(-1)
    const [fa,setFa] = useState(-1)
    const location = useLocation()
    const nav = useNavigate();

    useEffect(()=>{
        if(!token) {
            if(props.fa)
            {
                //@ts-ignore
                setFa(props.fa)
            }
            else if(location.state&&location.state.fa)
            {
                setFa(location.state.fa )
            }
    
            if(props.userId)
            {
                //@ts-ignore
                setUserId(props.userId)
            }
            if(location.state&&location.state.userId)
            {
                setUserId(location.state.userId )
            }
        }
    },[])

    function handleSetPin(ev:Event)
    {
        ev.preventDefault()
    }

    function handleSetMail(ev:Event)
    {
        ev.preventDefault()
    }

    async function handleSetKey(ev:Event)
    {
        ev.preventDefault()
        try
        {
            const reqOpt = (await axios.get(url+'2fa/register/u2f',{
                    headers:{
                        token: token
                    }
                }))
            const At = await startRegistration(reqOpt.data);
            const response = await axios.post(url+'2fa/register/u2f',At,{headers:{token:token}})
            if(response.status===200) nav('/');
            
        }
        catch (error:any) {
            console.log(error);
        }
        
    }

    async function handleUsePin(ev:Event)
    {
        ev.preventDefault()
        let digits= ""
        for(let i=0;i<4;i++)
        {
            const el:any = document.getElementById(`PIN[${i}]`);
            if(el!==null) digits+=el.value;
        }

        if(digits.length>0)
        {
            try
            {
                const resp = await axios.post(url+'2fa/login/PIN',{
                    user_id: userId,
                    pin: digits
                })

                if(resp.data)
                {
                    if(resp.data.jwt)
                    {
                        props.setToken(resp.data.jwt);
                        nav('/');
                    }
                    else
                    {
                        throw Error("Token Error");
                    }
                }
                
            }
            catch(e)
            {
                for(let i=0;i<4;i++)
                {
                    const el:any = document.getElementById(`PIN[${i}]`);
                    el.value="";
                    el.style.borderColor = "red";
                }
            }
           
        }
        
    }

    function handleUseMail(ev:Event)
    {
        ev.preventDefault()

    }

    async function handleUseKey(ev:Event)
    {
        ev.preventDefault()

        const logOpt = (await axios.get(url+'2fa/login/u2f',{
            headers:{
                user_id: userId
            }
        })).data
        let resp;
        try {
           
            resp = await startAuthentication(logOpt);
            const res = await axios.post(url+'2fa/login/u2f',{
                userId: userId,
                response: resp
            })
            props.setToken(res.data);
            nav('/')
          } 
          catch (error) 
          {
            console.log(error)
          }
          
    }

    if(userId) 
    {
        if(fa)
        {
    
            if(fa===1)
            {//@ts-ignore
                return(<PIN user_id={userId} lang={language['2fa']} handleUsePin={(ev:Event)=>handleUsePin(ev)} />)
            }
    
            if(fa===2)
            {//@ts-ignore
                return(<Mail user_id={userId} lang={language['2fa']} handleUseMail={(ev:Event)=>handleUseMail(ev)} />)
            }
    
            if(fa===3)
            {//@ts-ignore
                return(<Key user_id={userId} lang={language['2fa']} handleUseKey={(ev:Event)=>handleUseKey(ev)}/>)
            }
        }
        else return (<TwoFAForm 
            user_id={userId} 
            //@ts-ignore
            lang={language['2fa']}
            handleSetKey={handleSetKey} 
            handleSetMail={handleSetMail} 
            handleSetPIN={handleSetPin} />)
    }
    if(token) return (<TwoFAForm 
            //@ts-ignore
            lang={language['2fa']}
            handleSetKey={handleSetKey} 
            handleSetMail={handleSetMail} 
            handleSetPIN={handleSetPin} />)
    return <></>
    
}

