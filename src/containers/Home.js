import React, {Component} from 'react';
import LoginModal from '../components/LoginModal';
import SavePlaylistModal from '../components/SavePlaylistModal';
import PlaylistParameters from '../components/PlaylistParameters';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen:false,
            savePlaylistModalOpen:false
        }
        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.openSavePlaylistModal = this.openSavePlaylistModal.bind(this);
        this.closeSavePlaylistModal = this.closeSavePlaylistModal.bind(this);
    }

    openLoginModal() {
        this.setState({loginModalOpen:true});
    }

    closeLoginModal() {
        this.setState({loginModalOpen:false});
    }

    openSavePlaylistModal() {
        this.setState({savePlaylistModalOpen:true});
    }

    closeSavePlaylistModal() {
        this.setState({savePlaylistModalOpen:false});
    }

    render() {
        return (
            <div className="home">
                <div className="hero">
                    <h1>Live Playlists</h1>
                    <h2>some kind of description that has some chance of getting a user to want to check this thing out</h2>
                </div>
                <button onClick={this.openLoginModal}>Login with Spotify</button>
                <LoginModal isOpen={this.state.loginModalOpen}
                            onHide={this.closeLoginModal}/>
                <PlaylistParameters buttonText="Create Playlist"/>
                <button onClick={this.openSavePlaylistModal}>Save Playlist</button>
                <SavePlaylistModal isOpen={this.state.savePlaylistModalOpen}
                                   onHide={this.closeSavePlaylistModal}/>
            </div>
        )
    }
}

export default Home;