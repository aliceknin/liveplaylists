import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {Link} from 'react-router-dom';
import "./Modal.scss";

class LoginModal extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         showModal:false
    //     }
    //     this.handleOpenModal.bind(this);
    //     this.handleCloseModal.bind(this);
    // }



    render() {
        return (
            <ReactModal isOpen={this.props.isOpen}
                        contentLabel="Login Modal"
                        onRequestClose={this.props.onHide}
                        className="modal">
                <h2>Login with Spotify</h2>
                Before I actually put interesting stuff in here, I'm putting random drivel just to make sure the basic stuff works.
                <button onClick={this.props.onHide}>Nevermind</button>
                <button onClick={this.props.onHide}>
                    <Link to='user'>User Settings Placeholder</Link>
                </button>
            </ReactModal>
        )
    }
}

export default LoginModal;