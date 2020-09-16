import React from 'react';
import ReactModal from 'react-modal';

const AlertModal = (props) => {
    return (
        <ReactModal isOpen={props.isOpen}
                    contentLabel={props.label}
                    onRequestClose={props.onHide}
                    className="modal alert"
                    closeTimeoutMS={200}>
            <p>{props.message}</p>
            <div className="buttons-container">
                <button onClick={props.onHide} 
                        className="button-light">close</button>
            </div>
        </ReactModal>
    );
}

export default AlertModal;