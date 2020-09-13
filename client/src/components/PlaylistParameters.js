import React, {Component} from 'react';
import '../styles/PlaylistParameters.scss';
import LocationSearch from './LocationSearch';

class PlaylistParameters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location:{},
            dateRange:null
        }
        this.setLocation = this.setLocation.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setLocation(location) {
        this.setState({location});
    }

    setDateRange(evt) {
        // figure this out
    }
    
    //TODO: fix date range and genre setting methods

    handleSubmit() {
        switch (this.props.buttonText) {
            case "Create Playlist":
                this.createPlaylistFromParameters();
                break;
            case "Save Playlist Parameters":
                this.savePlaylistParameters();
                break;
            default:
                console.log("you entered something weird for the button text" + 
                    " on a playlist parameters component. check that out.");
        }
        
        console.log(this.state.zipCode, this.state.mileRadius);
    }

    createPlaylistFromParameters() {
        // create playlist with spotify and bandsintown APIs
        // (which will probably be separated out into multiple 
        // separate methods when I figure out what I'm doing)
        console.log("creating playlist... (not really)");
        this.props.receivePlaylist("7GOJYqyQqCUz4fyfvHb13L");
    }

    savePlaylistParameters() {
        // save the user's playlist settings to the database,
        // will be used on the user settings page
        console.log("saving playlist parameters... (not really)");
    }

    render() {
        return (
            <div className="playlist-parameters">
                <div className="container">
                    <LocationSearch setLocation={this.setLocation}/>
                    {/* <div className="form-group">
                        <label htmlFor="date-range">Date Range</label>
                        <input id="date-range"
                            type="text"
                            value=""
                            onChange={this.setDateRange}/>
                    </div> */}
                </div>
                <button onClick={this.handleSubmit}>{this.props.buttonText}</button>
            </div>
        )
    }
}

export default PlaylistParameters;