import { FormEvent, useState } from 'react'
import '../../Styles/fa.scss'

type prop = {
    user_id?: Number
    handleSetKey: Function
    handleSetPIN: Function
    handleSetMail: Function
    lang: any
}

function RenderSelectedForm(props:any) 
{
    function switchTo(num:Number)
    {
        const el = document.getElementById(`PIN[${num}]`);
        if(el)
        {
            el.focus();
        }
    }

    if(props.selected===1) return(
    <label>
        <h3>{props.lang.PIN}</h3>
        <div>
            <input type="tel" name="PIN[0]" id="PIN[0]" required maxLength={1} onKeyUp={()=>switchTo(1)}/>
            <input type="tel" name="PIN[1]" id="PIN[1]" required maxLength={1} onKeyUp={()=>switchTo(2)}/>
            <input type="tel" name="PIN[2]" id="PIN[2]" required maxLength={1} onKeyUp={()=>switchTo(3)}/>
            <input type="tel" name="PIN[3]" id="PIN[3]" required maxLength={1} />
            
        </div>
        <input type="submit" className="submitButton" value={props.lang.submit} onClick={ev=>props.handleSetPin(ev)} />
    </label>)

    if(props.selected===2) return(
    <label>
        <h3>{props.lang.email }</h3>
        <i className="lni lni-envelope" ></i>
        <input type="email" name="email" id="email" placeholder={props.lang.email} defaultValue={""}required/>
        <div className="btn_container">
            <input type="reset" value={'Reset'}/>
            <input type="submit" value={props.lang.submit} onClick={ev=>props.handleSetMail(ev)} />
        </div>
        
    </label> )

    if(props.selected===3) return(
    <label>
        <h3>{props.lang.u2f }</h3>
        <div><i className="lni lni-key button_i" onClick={ev=>props.handleSetKey(ev)}></i></div>
    </label>)
   

    return(<></>)
}

export default function TwoFAForm(props:prop)
{
    const [select,setSelect] = useState(-1)
    

    function choose(ev:FormEvent)
    {
        const twoFaSelect = document.getElementById('select-2fa') as HTMLInputElement
        if(twoFaSelect)
        {
            const temp = parseInt(twoFaSelect.value);
            setSelect(temp)
        }
    }
    if(props.lang)
    {
        return (<div className="form-container">
        <form id="2FAForm" className='fa_form' onSubmit={ev=>ev.preventDefault()}>
        <h1><i className="lni lni-key"></i></h1>
            <h1>{props.lang.header}</h1>
            <select name="2fa-choose" onInput={ev=>choose(ev)} id="select-2fa">
                <option value={0} defaultValue={0} >---</option>
                <option value={1}>{props.lang.PIN}</option>
                <option value={2}>{props.lang.email}</option>
                <option value={3}>{props.lang.u2f}</option>
            </select>
            <div className="twoFa_container">
                <RenderSelectedForm selected={select} lang={props.lang} handleSetKey={(ev:Event)=>props.handleSetKey(ev)} handleSetMail={(ev:Event)=>props.handleSetMail(ev)} handleSetPIN={(ev:Event)=>props.handleSetPIN(ev)} />
            </div>
        </form>
    </div>)
    }
    else return (<></>)
    
}

