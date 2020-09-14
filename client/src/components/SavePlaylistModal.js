import React, { useState } from 'react';
import ReactModal from 'react-modal';
import "../styles/Modal.scss";
import '../styles/SavePlaylistModal.scss';

const SavePlaylistModal = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("public");

    function handleTitleChange(evt) {
        setTitle(evt.target.value);
    }

    function handleDescriptionChange(evt) {
        setDescription(evt.target.value);
    }

    function handleTypeChange(evt) {
        setType(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        // (create the playlist with the spotify api).then
        console.log(title);
        console.log(description);
        props.onHide();
    }

    return (
        <ReactModal isOpen={props.isOpen}
                    contentLabel="Save Playlist Modal"
                    onRequestClose={props.onHide}
                    className="modal"
                    closeTimeoutMS={200}>
            <h2>Save Playlist</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input aria-label="Title"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}/>
                <textarea aria-label="Description"
                            placeholder="Description"
                            value={description}
                            onChange={handleDescriptionChange}/>
                <fieldset>
                    <div className="form-group">
                        <input type="radio" id="public" name="public" value="public" 
                                checked={type === "public"} onChange={handleTypeChange}/>
                        <label htmlFor="public">Public</label>
                    </div>
                    <div className="form-group">
                        <input type="radio" id="private" name="private" value="private"
                                checked={type === "private"} onChange={handleTypeChange}/>
                        <label htmlFor="private">Private</label>
                    </div>
                    <div className="form-group">
                        <input type="radio" id="collab" name="collab" value="collab"
                                checked={type === "collab"} onChange={handleTypeChange}/>
                        <label htmlFor="collab">Collaborative</label>
                    </div>
                    <i className="fas fa-info-circle"></i>
                </fieldset>
                <div className="buttons-container">
                    <button className="button-light" onClick={props.onHide}>Cancel</button>
                    <button type="submit">Save Playlist</button>
                </div>
            </form>
        </ReactModal>
    );
}

export default SavePlaylistModal;