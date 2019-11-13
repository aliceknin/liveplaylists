import React, {Component} from 'react';
import ReactModal from 'react-modal';

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
                        contentLabel="Login Modal">
                Before I actually put interesting stuff in here, I'm putting random drivel just to make sure the basic stuff works.
                <button onClick={this.props.onHide}>Nevermind</button>
            </ReactModal>
        )
    }
}

export default LoginModal;