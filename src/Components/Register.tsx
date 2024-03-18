import React, { useContext, useEffect, useState } from "react";
import App, { AppContext } from "./App";
import axios, { AxiosError } from "axios";
import { url } from "../config.js";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import RegisterForm from "./presentation/RegisterForm";

export const PASSWORD_REGEX: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
export const LOGIN_REGEX: RegExp = /^[a-zA-Z0-9_-]{3,16}$/;
export const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Register(props:any)
{
    const {language,token} = useContext(AppContext);
    const [loginLaguage,setLoginLanguage] = useState({
        login: "",
        email:"",
        password: "",
        password_repeat: "",
        button_login: "",
        button_submit: "",
        password_forgot: "",
        password_incorrect: "",
        wrong_chars: "",
        too_short: "",
    })
    const [problems,setProblems] = useState([false]);

    async function handleSubmit(ev:Event)
    {
        ev.preventDefault();
        const loginInput = document.getElementById('login') as HTMLInputElement | null;
        const emailInput = document.getElementById('email') as HTMLInputElement | null;
        const passwordInput = document.getElementById('password') as HTMLInputElement | null;
        const repeatPasswordInput = document.getElementById('password2') as HTMLInputElement | null;

        if(loginInput&&passwordInput&&repeatPasswordInput&&emailInput)
        {
            const login = loginInput.value
            const password = passwordInput.value
            const email = emailInput.value
            const repeat = repeatPasswordInput.value
            let flag = false;
            const temp = []
            if(passwordInput.value!==repeatPasswordInput.value)
            {
                temp[0] = true
                flag = true
            }

            if(!login.match(LOGIN_REGEX))
            {
                temp[1] = true
                flag = true
            }

            if(!password.match(PASSWORD_REGEX))
            {
                temp[2] = true
                flag = true
            }

            if(!email.match(EMAIL_REGEX))
            {
                temp[3] = true
                flag = true
            }

            if(!flag)
            {
                try
                {
                    const result = await axios.post(url + "account/register",{
                        username: login,
                        password: password,
                        email: emailInput.value
                    })
                    Cookies.set("token",result.data.jwt)
                    props.setToken(result.data.jwt);
                }
                catch(err:any)
                {
                    if(err.response.status===400)
                    {
                        temp[4] = true
                        flag = true
                    }
                }
                
            }
            
            if(flag) setProblems(temp)      
        }
    }

    useEffect(()=>{
        //@ts-ignore
        setLoginLanguage(language.register)
    },[language])

    if(token=="") return  <RegisterForm lang={loginLaguage} submit={handleSubmit} problems={problems}/>
    else return <Navigate replace={true} to='/' />
}

export default Register;