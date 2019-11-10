import React from 'react';
import ReactDOM from 'react-dom';
import ArtistTableContainer from './ArtistTable.js';
import TrackStatsContainer from './TrackStats.js';
import TrackSwitcherContainer from './TrackArtistSwitcher.js';
import Intro from './Intro.js';
import { authEndpoint, clientId, redirectUri, scopes } from "./settings.js";
import TasteShift from './TasteShift.js';
import * as logic from './logic.js';
import "./App.css";
import "./ArtistTable.css";


class App extends React.Component {
    constructor(props) {
        super(props);

        /*
        this.token = logic.getToken();
        if(this.token !== null && this.token !== undefined) {
            this.state = {
                is_logged_in: true,
            }
        } else {
            this.state = {
                is_logged_in: false,
            }
        }*/
        this.state = {
            is_logged_in: false,
            is_loaded:    false,
            token: null
        }

    }

    async login() {
        var logged_in = await logic.isLoggedIn();
        this.setState({
            is_logged_in: logged_in
        })
    }

    async load_data() {
    
        //console.log("polling for data");
        var x = await logic.getUserSavedTracks();
        x = await logic.getTopArtists();
        x = await logic.getGenreAnalysisOfTracks();
        logic.getMonthsTrackMap();
        logic.getTopGenres();
        //logic.getGenreGraphList("catstep");

        //console.log("loading from storage");
        //console.log(localStorage.getItem("top_artists_long_term"));
        var top_artists_long_term = JSON.parse(
            localStorage.getItem("top_artists_long_term"));
        //console.log(top_artists_long_term);

        var top_artists_medium_term = JSON.parse(
            localStorage.getItem("top_artists_medium_term"));

        var top_artists_short_term = JSON.parse(
            localStorage.getItem("top_artists_short_term"));

        //console.log(top_artists_medium_term);

        var saved_track_list = JSON.parse(localStorage.getItem("saved_track_list"));


        //console.log(saved_track_list);

        //console.log("loaded, checking to see if null");
        if(top_artists_long_term !== null && 
            top_artists_medium_term !== null &&
            saved_track_list !== null
            && top_artists_short_term !== null) {
                this.setState({
                    is_loaded: true,
                    top_artists_short_term: top_artists_short_term,
                    top_artists_long_term: top_artists_long_term,
                    top_artists_medium_term: top_artists_medium_term,
                    saved_track_list: saved_track_list
                }
            );
        }
    }

    componentDidMount() {
        console.log("mounted");
        this.login();
        this.load_data();
    }

    render() {
        if(!this.state.is_logged_in) {
             return ( <div> <div className='titlespacer' />
                      <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a> </div>)
        } else if(!this.state.is_loaded) {
            return ( <div> <div className='titlespacer'/> 
                     <h1> Not loaded :/ </h1> </div> )
        } else {
            //console.log(this.state.saved_track_list);
            return (
            <div className='container-fluid'>
                {/*<div className='row'>
                    <div className='titlespacer' />
                    <div className="title"> Loaded :) </div>
                </div>*/}
                <div className='row'>
                </div>

                {/* Intro */}
                <Intro />

                {/* Top Artists */}
                <TrackSwitcherContainer />
                <div className='top-artists'>
                        <div className='textspacer' />
                        <ArtistTableContainer artists =
                            {this.state.top_artists_short_term.items} 
                            label='4 Weeks'/>
                         <ArtistTableContainer artists =
                            {this.state.top_artists_medium_term.items} 
                            label='6 Months'/>
                        <ArtistTableContainer artists = 
                            {this.state.top_artists_long_term.items} 
                            label='All Time'/>
                </div>


                <TrackStatsContainer tracks = {this.state.saved_track_list} />

                {/* Taste Shift */}
                <div className='title'>Taste Shift</div>
                <div className='tasteshift'> 
                    <div className='textspace' />
                    <TasteShift />
                    
                </div>


                
            </div>
            )
        }
    }
}

export default App;
