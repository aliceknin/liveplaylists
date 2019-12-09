import React, {Component} from 'react';
import ReactModal from 'react-modal';
import {Link} from 'react-router-dom';
import "./Modal.scss";
import UserService from '../services/UserService';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: ""
        }
        this.handleProof = this.handleProof.bind(this);
        this.userService = new UserService();
    }

    handleProof(evt) {
        this.userService.getProof()
        .then(proof => this.setState({test: proof.test}));
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
                <button onClick={this.handleProof}>
                    Test Server Connection
                </button>
                <h3>{this.state.test}</h3>
            </ReactModal>
        )
    }
}

export default LoginModal;