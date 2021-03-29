import React, { useState, useRef } from 'react';
import ReactModal from 'react-modal';
import '../styles/Modal.scss';
import '../styles/SavePlaylistModal.scss';
import RadioButtons from './RadioButtons';
import LoadingButton from './LoadingButton';
import axios from 'axios';
import BannerAlert from './BannerAlert';

const SavePlaylistModal = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("public");
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

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
        if (loading) return;
        evt.preventDefault();
        try {
            setLoading(true);
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
            console.log("saved copy of playlist!", playlistCopyID)
            setSucceeded(true);
            return playlistCopyID;
        } catch (err) {
            setFailed(true);
            console.log("couldn't save copy of playlist", err);
        } finally {
            setLoading(false);
            props.onHide();
        }
    }

    const options = [
        { displayName: "Public", value: "public"},
        { displayName: "Private", value: "private"},
        { displayName: "Collaborative", value: "collab"}
    ]

    return (
        <>
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
                <div className="info-popup-group info-popup-cue" tabIndex="0">
                    <i className="fas fa-info-circle"></i>
                    <aside className="info-popup">
                        <p><strong>Public</strong> playlists show up in public searches and on your public profile, unlike <strong>private</strong> playlists.</p>
                        <p><strong>Collaborative</strong> are private, and can be edited by those you share them with.</p>
                    </aside>
                </div>
                <div className="buttons-container">
                    <button type="button"
                            className="button-light" 
                            onClick={props.onHide}
                            onKeyPress={(e) => handleEnter(e, "cancel")}>Cancel</button>
                    <LoadingButton type="submit" loading={loading}>Save Playlist</LoadingButton>
                </div>
            </form>
        </ReactModal>
        {succeeded && 
            <BannerAlert onClose={()=>setSucceeded(false)} className="success">
                Playlist saved!
            </BannerAlert>
        }
        {failed && 
            <BannerAlert onClose={()=>setFailed(false)} duration="5000" className="error">
                Something went wrong saving your playlist.
            </BannerAlert>
        }
        </>
    );
}

export default SavePlaylistModal;