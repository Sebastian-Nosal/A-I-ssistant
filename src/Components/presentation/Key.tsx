import '../../Styles/fa.scss'


type prop = {
    user_id: Number
    handleUseKey: Function
    lang: any
}

export default function Key(props:prop)
{
    return (
    <div className="form-container">
        <form id="PinForm" className="fa_form" method='POST' onSubmit={ev=>props.handleUseKey(ev)}>
            <h1><i className="lni lni-key"></i></h1>
            <h3>{props.lang.u2f }</h3>
            <h1>{props.lang.u2f}</h1>
            <label>
            <i className="lni lni-key scale2" onClick={ev=>props.handleUseKey(ev)}></i>
            </label>
        </form> 
    </div>
    )   
}

