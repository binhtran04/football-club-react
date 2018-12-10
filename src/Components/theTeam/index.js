import React, { Component } from 'react';
import PlayerCard from '../ui/playerCard';
import Fade from 'react-reveal/Fade';

import Stripes from '../../Resources/images/stripes.png';
import { firebasePlayers, firebase } from '../../firebase';
import { firebaseLooper } from '../ui/misc';
import { Promise } from 'core-js';
// import { resolve } from 'path';
// import { isNonNullObject } from '@firebase/util';

class TheTeam extends Component {

    state = {
        loading: true,
        players: []
    }

    componentDidMount() {
        // get all players and their image urls
        firebasePlayers.once('value')
            .then(snapshot => {
                const players = firebaseLooper(snapshot);
                let promises = [];

                players.forEach(player => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            firebase.storage().ref('players').child(player.image).getDownloadURL()
                            .then( url => {
                                player.url = url;
                                resolve();
                            }).catch((error) => {
                                player.url = null;
                                resolve()
                            })
                        })
                    )
                })
            Promise.all(promises).then(() => {
                this.setState({
                    loading: false,
                    players
                })
            })
        })
    }

    showPlayersByCategory(category) {
        return this.state.players ?
            this.state.players.map((player, i) => {
                return player.position === category ?
                    <Fade left delay={i*20} key={i}>
                        <div className="item" >
                            <PlayerCard 
                                number={player.number}
                                name={player.name}
                                lastName={player.lastname}
                                bck={player.url}
                            />
                        </div>
                    </Fade>
                : null;
            })
            : null;
    }

    render() {
        console.log(this.state)
        return (
            <div className="the_team_container"
                style={{
                    background: `url(${Stripes}) repeat`
                }}
            >
                { !this.state.loading ?
                    <div>
                        <div className="team_category_wrapper">
                            <div className="title">Keepers</div>
                            <div className="team_cards">
                                {this.showPlayersByCategory('Keeper')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Defence</div>
                            <div className="team_cards">
                                {this.showPlayersByCategory('Defence')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Midfield</div>
                            <div className="team_cards">
                                {this.showPlayersByCategory('Midfield')}
                            </div>
                        </div>

                        <div className="team_category_wrapper">
                            <div className="title">Strikers</div>
                            <div className="team_cards">
                                {this.showPlayersByCategory('Striker')}
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

export default TheTeam;