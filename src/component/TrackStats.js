import React from 'react';
import * as logic from './logic.js';
//import 'bootstrap/dist/css/bootstrap.css';

class TrackStatsContainer extends React.Component {
    

    componentDidMount() {

    }

    render() {
        return (
            <div className='TrackStatsContainer'>
                <TrackStatsTable tracks={this.props.tracks} />
            </div>

        )
    }
}

class TrackStatsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            genre_track_count_map: null,
            rows: null
        }
    }

    componentDidMount() {
        var genre_map = new Map();
        this.props.tracks.forEach((track) => {
            track.genres.forEach((genre) => {
                if(!genre_map.has(genre)) {
                    genre_map.set(genre, 0);
                }
                genre_map.set(genre, genre_map.get(genre) + 1);
            })
        })

        console.log(genre_map);
        //this.state.genre_track_count_map = genre_map;
        var arrayed = Array.from(genre_map);
        arrayed.sort(function(a,b) {
            return a[1] < b[1] ? 1 : -1;
        });
        
        var rows = [];
        /*
        function insertRow(value, key) {
            rows.push(
                <TrackStatsRow genre={key} count={value} />
            );
        }

        genre_map.forEach(insertRow);
        */

        arrayed.forEach((row) => {
            rows.push(
                <TrackStatsRow genre={row[0]} count={row[1]}/>
            )
        });

        this.setState({
            genre_track_count_map : genre_map,
            rows: rows
        })

    }

    render() {
        return (
            <table className='table table-hover'>
                <tbody>{this.state.rows}</tbody>
            </table>
        )
    }


}

class TrackStatsRow extends React.Component {
    render() {
        return (
            <tr>
                <td> {this.props.genre} </td>
                <td> {this.props.count} </td>
            </tr>

        )
    }
}

export default TrackStatsContainer;
