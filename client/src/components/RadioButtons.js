import React from 'react';

const RadioButtons = (props) => {
    return (
        <fieldset>
            {props.options.map((option) => 
                <div className="form-group"
                     key={option.value}>
                    <input type="radio" id={option.value} 
                                        name={option.value} 
                                        value={option.value} 
                                        checked={props.checkedValue === option.value} 
                                        onChange={props.onChange}/>
                    <label htmlFor={option.value}>{option.displayName}</label>
                </div>
            )}
        </fieldset>
    );
}

export default RadioButtons;