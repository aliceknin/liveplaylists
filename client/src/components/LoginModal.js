import React from 'react';
import ReactModal from 'react-modal';
import "../styles/Modal.scss";

const LoginModal = (props) => {
    return (
        <ReactModal isOpen={props.isOpen}
                    contentLabel="Login Modal"
                    onRequestClose={props.onHide}
                    className="modal"
                    closeTimeoutMS={200}>
            <h2>Login with Spotify</h2>
            <p>Hey, you gotta have some creds before you can do that.</p>
            <div className="buttons-container">
                <button onClick={props.onHide} 
                        className="button-light">Nevermind</button>
                <a href='/auth/spotify'>
                    <button>Login with Spotify</button>
                </a>
            </div>
        </ReactModal>
    );
}

export default LoginModal;