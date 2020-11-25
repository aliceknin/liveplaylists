import React from 'react';

const SkipSeek = (props) => {

    return (
        <div className="skip-seek">
            <button className="skip previous"
                    name="Previous Track"
                    alt="Previous Track"
                    id="prev"
                    value="-1"
                    onClick={props.onClick}>
                <i className="fa fa-step-backward"></i>
            </button>
            <div className="seek"></div>
            <button className="skip next"
                    name="Next Track"
                    id="next"
                    value="1"
                    alt="Next Track"
                    onClick={props.onClick}>
                <i className="fa fa-step-forward"></i>
            </button>
            <div className="time-remaining"></div>
        </div>
    );
}

export default SkipSeek;