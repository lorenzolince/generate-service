import { Form } from "react-bootstrap";

const DropDown = ({ controlName, label, data, register, errorsValidation }) => {

    if(data === undefined) return null
    if(Object.keys(data).length === 0 && data.constructor === Object) return null;    

    return (<>
        <Form.Group>
            {
                label &&
                <Form.Label htmlFor={ controlName } >{ label }</Form.Label>
            }
            <Form.Control name={ controlName } ref={ register } id={ controlName } className={`form-control ${ errorsValidation ? 'is-invalid' : ''}`} as="select">
                {                           
                    data.map((item) =>
                        <option key={ item.id } value={ item.id }> { item.description } </option>
                    )                                                    
                } 
            </Form.Control>  
            <div className="invalid-feedback">{ errorsValidation?.message}</div>                   
        </Form.Group>
    </>) 
  
}

export default DropDown;