import React from 'react';
import * as logic from './logic.js';
import 'bootstrap/dist/css/bootstrap.css';
import './ArtistTable.css';
/*
class LoginButton extends React.Component {
    handleClick() {
        window.location.replace("/login");
    }
    render() {
        return(
            <button 
                type="button"
                class="btn btn-outline-primary"
                onClick={() => this.handleClick()}
            > Login </button>
        );
    }
}*/

function Prev(props) {
    return (
        <button className="btn btn-link" onClick={props.toggle} disabled={props.active}>PREV</button>
    );
}

function Next(props) {
    return (
        <button className="btn btn-link" onClick={props.toggle} disabled={props.active}>NEXT</button>
    );
}

class ArtistTableContainer extends React.Component {
    constructor(props) {
        super(props);

        // Label all the artists
        var counter = 1;
        this.props.artists.forEach((artist) => {
            artist.counter = counter;
            counter += 1;
        });

        this.state = {
            page: 0,
            range_start: 0,
            next_disabled: false,
            prev_disabled: true,
            artists: props.artists,
            page_artists: this.props.artists.slice(0, 10)
        };
    }
 
    forwardPage() {
        let page = this.state.page + 1;
        let next_disabled = (page === 4);
        let page_artists = this.state.artists.slice(page * 10, (page + 1) * 10)
        this.setState({
            page: page,
            page_artists : page_artists,
            prev_disabled : false, 
            next_disabled: next_disabled});
        
    }

    backPage() {
        let page = this.state.page - 1;
        let prev_disabled = (page === 0);
        let page_artists = this.state.artists.slice(page * 10, (page + 1) * 10)
        this.setState({
            page: page,
            page_artists : page_artists,
            prev_disabled : prev_disabled, 
            next_disabled: false});
    }

    render() {
        const next_disabled = this.state.next_disabled;
        const prev_disabled = this.state.prev_disabled;
        return (
            <div className="d-flex flex-column">
                <p> {this.props.label} </p>
                    {/*
                    <div className='col-md-6'>
                        <Prev toggle={(e) => this.backPage(e)} active={prev_disabled} />
                        <Next toggle={(e) => this.forwardPage(e)} active={next_disabled} />
                    </div>
                    */}
                <hr />
                <SortedArtistTable 
                    artists={this.state.page_artists.slice(0,5)} />
            </div>
        )
    }
    
}

class SortedArtistTable extends React.Component {
    render() {
        const rows = [];
        var key = 1;
        //console.log("bah artists:");
        //console.log(this.props.artists);
        this.props.artists.forEach((artist) => {
            rows.push(
                <ArtistRow artist={artist} key={key} />
            );
            key += 1;
        });
      //  console.log("paged:");
      //  console.log(rows);
        
        return (
            <table>
                <tbody>{rows}</tbody>
            </table>
        )
    }

}

class ArtistRow extends React.Component {
    
    handleClick() {
        window.location.replace(this.props.artist.uri);
    }
    /*
    render() {
        return (
            <tr
            onClick={() => this.handleClick()}
            >
                <td className="w-5">{this.props.artist.counter}</td>
                <td className="w-25"><ArtistImage artist={this.props.artist}/></td>
                <td className="w-70">{this.props.artist.name}</td>
            </tr>
        );
    }*/

    render() {
        return (
            <tr
            onClick={() => this.handleClick()}
            >
                <td className="align-left">{this.props.artist.counter}</td>
                <td className="align-left">{this.props.artist.name}</td>
            </tr>
        );
    }

}

class ArtistImage extends React.Component {
    
    render() {
        var url = "";
        var width = "0";
        var height = "0";
        var image = this.props.artist.images.pop();
        if (image !== undefined) {
            url = image.url;
            width = 80;
            height = 80;
        } 
        return <img src={url} 
                    width={width}
                    height={height}
                    alt={this.props.artist.name}/>;
    }
}/*
const ARTISTS = [
    {pic: 'oi', name: 'gregy', rank: 1, url: 'oi'},
    {pic: 'oi', name: 'greggy', rank: 2, url: 'oi'},
    {pic: 'oi', name: 'gregggy', rank: 3, url: 'oi'},
    {pic: 'oi', name: 'greggggy', rank: 4, url: 'oi'},
]*/

// ========================================
/*
ReactDOM.render(
    <App />,
  document.getElementById('root')
);*/

export default ArtistTableContainer;
