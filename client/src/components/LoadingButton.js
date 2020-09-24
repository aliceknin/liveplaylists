import React from 'react';
import '../styles/LoadingButton.scss';

const LoadingButton = (props) => {

    function handleClick(e) {
        if (props.loading) return;
        props.onClick(e);
    }

    return (
        <button onClick={handleClick}
                className={props.loading ? 'btn-loading' : ''}
                type={props.type}>
            {props.children}
            {props.loading && 
            <p className="loading"><span>.</span><span>.</span><span>.</span></p>}
        </button>
    );
}

export default LoadingButton;