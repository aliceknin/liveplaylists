import React, {Component} from 'react';
import ReactModal from 'react-modal';
import "../styles/Modal.scss";
import '../styles/SavePlaylistModal.scss';

class SavePlaylistModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistTitle: "",
            playlistDescription: "",
            playlistType: "public"
        }
        this.setPlaylistTitle = this.setPlaylistTitle.bind(this);
        this.setPlaylistDescription = this.setPlaylistDescription.bind(this);
        this.setPlaylistType = this.setPlaylistType.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setPlaylistTitle(evt) {
        this.setState({playlistTitle: evt.target.value})
    }

    setPlaylistDescription(evt) {
        this.setState({playlistDescription: evt.target.value})
    }

    setPlaylistType(evt) {
        this.setState({playlistType: evt.target.value})
    }

    handleSubmit(evt) {
        evt.preventDefault();
        // (create the playlist with the spotify api).then
        console.log(this.state.playlistTitle);
        console.log(this.state.playlistDescription);
        this.props.onHide();
    }

    render() {
        return (
            <ReactModal isOpen={this.props.isOpen}
                        contentLabel="Save Playlist Modal"
                        onRequestClose={this.props.onHide}
                        className="modal"
                        closeTimeoutMS={200}>
                <h2>Save Playlist</h2>
                <form onSubmit={this.handleSubmit} className="form-container">
                    <input placeholder="Title"
                        value={this.state.playlistTitle}
                        onChange={this.setPlaylistTitle}/>
                    <textarea placeholder="Description"
                              value={this.state.playlistDescription}
                              onChange={this.setPlaylistDescription}/>
                    <fieldset>
                        <div className="form-group">
                            <input type="radio" id="public" name="public" value="public" 
                                   checked={this.state.playlistType === "public"} onChange={this.setPlaylistType}/>
                            <label htmlFor="public">Public</label>
                        </div>
                        <div className="form-group">
                            <input type="radio" id="private" name="private" value="private"
                                   checked={this.state.playlistType === "private"} onChange={this.setPlaylistType}/>
                            <label htmlFor="private">Private</label>
                        </div>
                        <div className="form-group">
                            <input type="radio" id="collab" name="collab" value="collab"
                                   checked={this.state.playlistType === "collab"} onChange={this.setPlaylistType}/>
                            <label htmlFor="collab">Collaborative</label>
                        </div>
                        <i className="fas fa-info-circle"></i>
                    </fieldset>
                    <div className="buttons-container">
                        <button className="button-light" onClick={this.props.onHide}>Cancel</button>
                        <button type="submit">Save Playlist</button>
                    </div>
                </form>
            </ReactModal>
        )
    }
}

export default SavePlaylistModal;