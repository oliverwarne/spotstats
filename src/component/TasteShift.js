import React from 'react';
import Chart from 'chart.js';
import * as logic from './logic.js';
import './TasteShift.css';

class TasteShiftContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tracks: props.tracks,
            loaded: true
        };
    }

    render() {
        if(this.state.loaded) {
            return(
                <div className='tasteshiftcontainer'>
                    <TasteShiftLineChart 
                        data={logic.getGenreGraphList('indie rock')}/>
                </div>
            );
        } else {
            return (
            <div className='tasteshiftcontainer'>
                <div className='title'> loading... </div>
            </div>
            );

        }
    }
}

class TasteShiftLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }

    charRef = React.createRef();

    componentDidMount() {
        const myChartRef = this.charRef.current.getContext('2d');;

        new Chart(myChartRef, {
            type: 'line',
            data: {
                data: this.state.data
            },
            options: {

            }
        });
    }

    render() {
        return (
            <div className='linechart'>
                <canvas id='mechart'
                    ref={this.charRef}
                />
            </div>
        )
    }
}

export default TasteShiftContainer;
