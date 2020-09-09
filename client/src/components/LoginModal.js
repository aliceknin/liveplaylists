import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {Link} from 'react-router-dom';
import "../styles/Modal.scss";

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "",
            login: ""
        }
    }

    render() {
        return (
            <ReactModal isOpen={this.props.isOpen}
                        contentLabel="Login Modal"
                        onRequestClose={this.props.onHide}
                        className="modal"
                        closeTimeoutMS={200}>
                <h2>Login with Spotify</h2>
                Before I actually put interesting stuff in here, I'm putting random drivel just to make sure the basic stuff works.
                <button onClick={this.props.onHide}>Nevermind</button>
                <button onClick={this.props.onHide}>
                    <Link to='user'>User Settings Placeholder</Link>
                </button>
                <button>
                    <a href='/auth/spotify'>Test Login Link?</a>
                </button>
                <h3>{this.state.test}</h3>
                <h4>{this.state.login}</h4>
            </ReactModal>
        )
    }
}

export default LoginModal;