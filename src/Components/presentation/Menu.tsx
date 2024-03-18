import React from "react";

function Menu(props:any)
{
    return (
        <div className="form-container">
            <form id="loginForm">
                <label>
                   {props.lang.login}
                    <input type="text" name="login" />
                </label>
                <label>
                   {props.lang.password}
                    <input type="password" name="password" />
                </label>
            </form>
        </div>
    );
}

export default Menu;