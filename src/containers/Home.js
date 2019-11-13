import React, {Component} from 'react';
import LoginModal from '../components/LoginModal';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen:false
        }
        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
    }

    openLoginModal() {
        this.setState({loginModalOpen:true});
    }

    closeLoginModal() {
        this.setState({loginModalOpen:false});
    }

    render() {
        return (
            <div className="home">
                <div className="hero">
                    <h1>Playlists Live</h1>
                    <h2>some kind of description that has some chance of getting a user to want to check this thing out</h2>
                </div>
                <button onClick={this.openLoginModal}>Login</button>
                <LoginModal isOpen={this.state.loginModalOpen}
                            onHide={this.closeLoginModal}/>
            </div>
        )
    }
}

export default Home;