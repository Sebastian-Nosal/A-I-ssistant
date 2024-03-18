import React from "react";
import '../../Styles/form.scss';
import { useNavigate } from "react-router-dom";

type RegisterProps = 
{
    lang: {
        login: string;
        password: string;
        email:string,
        password_repeat: string;
        button_login: string;
        button_submit: string;
        password_forgot: string;
        password_incorrect: string;
        wrong_chars: string;
        too_short: string;
    }
    submit:Function
    problems?: any[]
}


function RegisterForm(props:RegisterProps)
{
    const navigate = useNavigate()
    if(props.lang) 
        return (
        <div className="form-container">
            <form id="loginForm" onSubmit={ev=>props.submit(ev)}>
                <h1><i className="lni lni-users"></i></h1>
                <label>
                <i className="lni lni-user"></i>
                <input type="text" name="login" id="login"required />
                    <span>{props.lang.login}</span>
                </label>
                {props.problems&&props.problems[1]? (<span color="red">{props.lang.wrong_chars}</span>):(<></>)}
                <label>
                <i className="lni lni-envelope"></i>
                <input type="text" name="email" id="email" required />
                    <span>{props.lang.email}</span>
                </label>
                {props.problems&&props.problems[2]? (<span color="red">{props.lang.wrong_chars}</span>):(<></>)}
                <label>
                <i className="lni lni-key"></i>
                <input type="password" name="password" id="password" required />
                    <span>{props.lang.password}</span>
                </label>
                {props.problems&&props.problems[3]? (<span color="red">{props.lang.password_incorrect}</span>):(<></>)}

                <label>
                <i className="lni lni-key"></i>
                <input type="password" name="password2" id="password2" required  />
                    <span>{props.lang.password_repeat}</span>
                </label>
                {props.problems&&props.problems[0]? (<span color="red">{props.lang.password_repeat}</span>):(<></>)}

                <a href="/forget">{props.lang.password_forgot}</a>
                <div className="button_container">
                    <input type="button" value={props.lang.button_login} onClick={()=>navigate('/login')}/>
                    <input type="submit" value={props.lang.button_submit} />
                </div>
            </form>
        </div>
    );
    else return (<></>)
}

export default RegisterForm;