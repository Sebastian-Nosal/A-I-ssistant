import '../../Styles/fa.scss'

type prop = {
    user_id: Number
    handleUsePin: Function
    lang: any
}

export default function PIN(props:prop)
{
    function switchTo(num:Number)
    {
        const el = document.getElementById(`PIN[${num}]`);
        if(el)
        {
            el.focus();
        }
    }

    return (
    <div className="form-container">
        <form id="PinForm" className="PIN_form" method='POST' onSubmit={ev=>props.handleUsePin(ev)}>
            <h1><i className="lni lni-key"></i></h1>
            <h1>{props.lang.PIN}</h1>
            <label>
                <input type="tel" name="PIN[0]" id="PIN[0]" required maxLength={1} onKeyUp={()=>switchTo(1)}/>
                <input type="tel" name="PIN[1]" id="PIN[1]" required maxLength={1} onKeyUp={()=>switchTo(2)}/>
                <input type="tel" name="PIN[2]" id="PIN[2]" required maxLength={1} onKeyUp={()=>switchTo(3)}/>
                <input type="tel" name="PIN[3]" id="PIN[3]" required maxLength={1} />
            </label>
            <div className="button_container">
                    <input type="reset" value="Reset" />
                    <input type="submit" />
                </div>
        </form> 
    </div>
    )   
}

