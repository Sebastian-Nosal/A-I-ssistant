import React, { useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import Settings from './Settings';
import '../Styles/app.scss';
import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import NoMatch from './presentation/NoMatch';
import TwoFA from './TwoFa';

export const AppContext = createContext({token: "", language:{}});

function App(props:any) {
  const [token, setToken] = useState("");
  const [language_code,setLanguageCode] = useState('pl')
  const [language,setLanguage] = useState({})

  useEffect(()=>{

    if(Cookies.get('lang'))
    {
      //@ts-ignore
      setLanguageCode(Cookies.get('lang')||"pl")
    }
  },[])

  useEffect(()=>{
    const data = axios.get(`https://localhost:3443/language/${language_code}`);
        
    data.then(res=> {
        setLanguage(res.data)
    })
  },[language_code])

  useEffect(()=>{
    if(Cookies.get('token'))
    {
        setToken(Cookies.get('token')||'')      
    }
  },[Cookies.get('token')])

  useEffect(()=>{
    if(token!=='') Cookies.set('token',token)
  },[token])


  return (
    <AppContext.Provider value={{token:token, language:language}}>
    <Header/>
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={ (t:string)=>setToken(t)} />}/>
        <Route path="/register" element={ <Register setToken={(t:string)=> setToken(t)}/>}/>
        <Route path="/" element={<Chat/>}/>
        <Route path="/app" element={<Chat/>}/>
        <Route path="/settings" element={<Settings lang={language_code}/>}/>
        <Route path="*" element={<NoMatch/>}/>
        <Route path="/2fa" element={<TwoFA setToken={(t:string)=>setToken(t)} />}/>
      </Routes>
    </Router>
    <Footer/>
    </AppContext.Provider>
  );
}

export default App;
