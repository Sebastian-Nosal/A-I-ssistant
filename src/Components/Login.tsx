import React, { useContext, useEffect, useState } from "react";
import LoginForm from "./presentation/LoginForm";
import axios from "axios";
import App, { AppContext } from "./App";
import { url } from "../config.js";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

function Login(props:any)
{
    const nav = useNavigate();
    async function handleSubmit(ev:Event)
    {
        ev.preventDefault();
        const loginInput = document.getElementById('login') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;

        if(loginInput&&passwordInput)
        {
            const login = loginInput.value
            const password = passwordInput.value

            try
            {
                const result = await axios.post(url + "account/login",{
                    username: login,
                    password: password
                })
                if(result.data.jwt)
                {
                    Cookies.set("token",result.data.jwt)
                    props.setToken(result.data.jwt);
                }
                else
                {
                  nav('/2fa', {state:{
                    userId: result.data.user_id,
                    fa: result.data.fa
                  }});  
                }
                
            }
            catch(err)
            {
                console.log(err)
            }
            
        }
    }

    const {language,token} = useContext(AppContext);
    const [loginLaguage,setLoginLanguage] = useState({
        login:"",
        password: "",
        button_register:"",
        button_submit:"",
        password_forgot:"",
        password_incorrect:"",
        wrong_chars:""
    })

    useEffect(()=>{
        //@ts-ignore
        setLoginLanguage(language.login)
    },[language])

    if(token==="") return  <LoginForm lang={loginLaguage} submit={handleSubmit}/>
    else return <Navigate replace={true} to='/' />
  
}

export default Login;