import PlayerInfo from '../PlayerInfo/PlayerInfo.js';
import PlayerSelector from '../Helpers/PlayerSelector.js';
import Header from './Header';

import styles from './Layout.module.scss';
import MoveList from '../MoveList/MoveList.js';
import Controls from '../Controls/Controls.js';

import { DeselectAction } from '../UI/UIActions';

// Layout click deselect for convienence
function HandleLayoutClick(ui, updateUI) {
    return () => {
        if (!!ui.selection) {
            updateUI(DeselectAction());
        }
    };
}

function getClassName(game, ui) {
    let classes = [styles.container];

    // If board is flipped
    if (game.meta.players[game.meta.userIndex].side !== ui.perspective) {
        classes.push(styles.flipped);
    }

    return classes.join(" ");
}

export default function Layout(props) {

    // Obtain state from props
    let { game, ui, updateGameState, updateUI } = props;

    return (
        <div className={getClassName(game, ui)} onClick={HandleLayoutClick(ui, updateUI)}>

            {/* <div className={styles.header}>
                <Header />
            </div> */}

            <div className={styles.playerTop}>
                <PlayerInfo 
                    playerIndex={PlayerSelector.opponentIndex(game)} 
                    players={game.meta.players} 
                    status={game.status} 
                    turn={game.turn} 
                    time={game.meta.time}

                    updateGameState={updateGameState}
                />
            </div>

            <div className={styles.board}>
                { props.children }
            </div>

            <div className={styles.playerBottom}>
                <PlayerInfo 
                    playerIndex={PlayerSelector.userIndex(game)} 
                    players={game.meta.players} 
                    status={game.status} 
                    turn={game.turn}
                    time={game.meta.time}

                    updateGameState={updateGameState}
                />
            </div>

            <div className={styles.controls}>
                <Controls ui={ui} updateUI={updateUI} />
            </div>

            {/* <div className={styles.moveList}>
                <MoveList perspective={ui.perspective} moves={game.moves} />
            </div> */}

        </div>
    )
}
