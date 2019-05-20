import React from 'react';

class Intro extends React.Component {

    render() {
        return (
            <div>
                <div className='title'>Better Spotify Statistics</div>
                <div>
                    <div className='textspacer' />
                    <p className='introtext'> {"Hello! This site really only works if\
                        you use the save/like feature a lot. Eventually I will get\
                        around to making it so that it deals with playlists..."}
                    </p>
                </div>
            </div>
        )
    }
}

export default Intro;
