import React, {Component} from 'react';
import './PlaylistParameters.scss';

class PlaylistParameters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zipCode:"",
            mileRadius:25,
            dateRange:null,
            genres:[]
        }
        this.setZipCode = this.setZipCode.bind(this);
        this.setMileRadius = this.setMileRadius.bind(this);
        this.setDateRange = this.setDateRange.bind(this);
        this.setGenres = this.setGenres.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setZipCode(evt) {
        this.setState({zipCode: evt.target.value});
    }

    setMileRadius(evt) {
        this.setState({mileRadius: evt.target.value});
    }

    setDateRange(evt) {
        // figure this out
    }

    setGenres(evt) {
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
                    <div className="form-group">
                        <label htmlFor="zip-code">ZIP code</label>
                        <input id="zip-code"
                            type="text"
                            value={this.state.zipCode}
                            onChange={this.setZipCode}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mile-radius">Mile Radius</label>
                        <input id="mile-radius"
                            type="number"
                            value={this.state.mileRadius}
                            onChange={this.setMileRadius}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date-range">Date Range</label>
                        <input id="date-range"
                            type="text"
                            value=""
                            onChange={this.setDateRange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="genres">Genres</label>
                        <input id="genres"
                            type="text"
                            value=""
                            onChange={this.setGenres}/>
                    </div>
                </div>
                <button onClick={this.handleSubmit}>{this.props.buttonText}</button>
            </div>
        )
    }
}

export default PlaylistParameters;