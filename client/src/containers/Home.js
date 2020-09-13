import React, {Component} from 'react';
import '../styles/Home.scss';
import LoginModal from '../components/LoginModal';
import SavePlaylistModal from '../components/SavePlaylistModal';
import PlaylistParameters from '../components/PlaylistParameters';
import FloatingUser from '../components/FloatingUser';
import SpotifyEmbed from '../components/SpotifyEmbed';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen:false,
            savePlaylistModalOpen:false,
            playlistID:""
        }
        this.openLoginModal = this.openLoginModal.bind(this);
        this.closeLoginModal = this.closeLoginModal.bind(this);
        this.openSavePlaylistModal = this.openSavePlaylistModal.bind(this);
        this.closeSavePlaylistModal = this.closeSavePlaylistModal.bind(this);
        this.receivePlaylist = this.receivePlaylist.bind(this);
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

    receivePlaylist(playlistID) {
        this.setState({playlistID});
    }

    render() {
        return (
            <div className="home">
                <section className="hero">
                    <FloatingUser/>
                    <div className="inner">
                        <h1>Live Playlists</h1>
                            <h2>some kind of description that has some chance of getting a user to want to check this thing out</h2>
                            <a href='/auth/spotify'><button className="button-callout">Login with Spotify</button></a>
                            <LoginModal isOpen={this.state.loginModalOpen}
                                        onHide={this.closeLoginModal}/>
                    </div>
                </section>
                <main>
                    <div className="inner">
                        {this.state.playlistID ? 
                            <>
                            <SpotifyEmbed playlistID={this.state.playlistID}/>
                            <div className="buttons-container">
                                <button onClick={()=> this.setState({playlistID: ""})}>Create New Playlist</button>
                                <button onClick={this.openSavePlaylistModal}>Save Playlist</button>
                            </div>
                            <SavePlaylistModal isOpen={this.state.savePlaylistModalOpen}
                                        onHide={this.closeSavePlaylistModal}/>
                            </>
                            :
                            <PlaylistParameters buttonText="Create Playlist" 
                                receivePlaylist={this.receivePlaylist}/>
                        }

                    </div>
                </main>
            </div>
        )
    }
}

export default Home;