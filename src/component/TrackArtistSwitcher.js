import React from 'react';
import './TrackArtistSwitcher.css';

class TrackSwitcherContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current: 'artists'
        };

        this.changetracks = this.changetracks.bind(this);
    }

    changetracks() {
        if(this.state.current === 'tracks') {
            this.setState({
                current: 'artists'
            });
        } else {
            this.setState({
                current: 'tracks'
            });
        };
    }

    render() {
        if(this.state.current === 'artists') {
            return (
            <div onClick={this.changetracks}>
                <div className='title'>Top Artists{' '}
                    <span className='hide'>Tracks </span>
                </div>
            </div>)
        } else {
            return (
            <div onClick={this.changetracks}>
                <div className='title'>Top{' '}
                    <span className='hide'>Artists </span>
                    {' '}Tracks
                </div>

            </div>
            )
        }
    }
}

export default TrackSwitcherContainer;
