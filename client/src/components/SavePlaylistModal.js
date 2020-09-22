import React, { useState, useRef } from 'react';
import ReactModal from 'react-modal';
import "../styles/Modal.scss";
import '../styles/SavePlaylistModal.scss';
import RadioButtons from './RadioButtons';
import axios from 'axios';

const SavePlaylistModal = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("public");

    const descriptionInput = useRef(null);

    function handleTitleChange(evt) {
        setTitle(evt.target.value);
    }

    function handleDescriptionChange(evt) {
        setDescription(evt.target.value);
    }

    function handleTypeChange(evt) {
        setType(evt.target.value);
    }

    function handleEnter(evt, el) {
        if (evt.key === 'Enter') {
            switch (el) {
                case "title":
                    evt.preventDefault();
                    descriptionInput.current.focus();
                    break;
                case "public":
                case "private":
                case "collab":
                    evt.preventDefault();
                    setType(el);
                    break;
                case "cancel":
                    evt.preventDefault();
                    props.onHide();
                    break;
                default:
                    return;
            }
        }
    }

  async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            console.log("saving playlist", props.playlistID);
            const res = await axios.get('/playlist/save', {
                params: {
                    playlistID: props.playlistID,
                    name: title,
                    description: description,
                    type: type
                }
            })
            let playlistCopyID = res.data;
            console.log("saved copy of playist!", playlistCopyID)
            props.onHide();
            return playlistCopyID;
        } catch (err) {
            console.log("couldn't save copy of playlist", err);
        }
    }

    const options = [
        { displayName: "Public", value: "public"},
        { displayName: "Private", value: "private"},
        { displayName: "Collaborative", value: "collab"}
    ]

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
                    onChange={handleTitleChange}
                    onKeyPress={(e) => handleEnter(e, "title")}/>
                <textarea ref={descriptionInput}
                    aria-label="Description"
                    placeholder="Description"
                    value={description}
                    onChange={handleDescriptionChange}/>
                <RadioButtons options={options} 
                    checkedValue={type}
                    onChange={handleTypeChange}
                    onEnter={handleEnter}/>
                <i className="fas fa-info-circle"></i>
                <div className="buttons-container">
                    <button type="button"
                            className="button-light" 
                            onClick={props.onHide}
                            onKeyPress={(e) => handleEnter(e, "cancel")}>Cancel</button>
                    <button type="submit">Save Playlist</button>
                </div>
            </form>
        </ReactModal>
    );
}

export default SavePlaylistModal;