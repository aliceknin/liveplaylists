import React, {Component} from 'react';
import ReactModal from 'react-modal';

class SavePlaylistModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistTitle: "",
            playlistDescription: ""
        }
        this.setPlaylistTitle = this.setPlaylistTitle.bind(this);
        this.setPlaylistDescription = this.setPlaylistDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setPlaylistTitle(evt) {
        this.setState({playlistTitle: evt.target.value})
    }

    setPlaylistDescription(evt) {
        this.setState({playlistDescription: evt.target.value})
    }

    handleSubmit() {
        // (create the playlist with the spotify api).then
        console.log(this.state.playlistTitle);
        console.log(this.state.playlistDescription);
        this.props.onHide();
    }

    render() {
        return (
            <ReactModal isOpen={this.props.isOpen}
                        contentLabel="Save Playlist Modal">
                <h2>Save Playlist</h2>
                <input placeholder="Title"
                       value={this.playlistTitle}
                       onChange={this.setPlaylistTitle}/>
                <textarea placeholder="Description"
                          value={this.playlistDescription}
                          onChange={this.setPlaylistDescription}/>
                <button onClick={this.props.onHide}>Cancel</button>
                <button onClick={this.handleSubmit}>Save Playlist</button>
            </ReactModal>
        )
    }
}

export default SavePlaylistModal;