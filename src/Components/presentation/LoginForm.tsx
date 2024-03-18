import '../../Styles/form.scss';
import {useNavigate } from "react-router-dom";


type LoginFormProp = {
    lang:{
        login:string,
        password: string,
        button_register:string,
        button_submit:string,
        password_forgot:string,
        password_incorrect:string,
        wrong_chars:string
    },
    submit:Function
    problems?: []
}

function LoginForm(props:LoginFormProp)
{
    const navigate = useNavigate();
    if(props.lang) 
        return (
        <div className="form-container">
            <form id="loginForm" onSubmit={ev=>props.submit(ev)}>
                <h1><i className="lni lni-users"></i></h1>
                <div>
                    <label>
                    <i className="lni lni-user"></i>
                    <input type="text" name="login" id="login"required/>
                        <span>{props.lang.login}</span>
                    </label>
                    <label>
                    <i className="lni lni-key"></i>
                    <input type="password" name="password" id="password" required/>
                        <span>{props.lang.password}</span>
                    </label>
                </div>
                <br/>
                <br/>
                <a href="/forget">{props.lang.password_forgot}</a>
                <br/>
                <div className="button_container">
                    <input type="button" value={props.lang.button_register} onClick={()=>navigate('/register')}/>
                    <input type="submit" value={props.lang.button_submit} />
                </div>
            </form>
        </div>
    );
    else return (<></>)
}

export default LoginForm;