import { memo } from 'react';
import Square from './Square.js';

import styles from './Board.module.scss';
import BoardPromotionSelection from './BoardPromotionSelection';
import { Move } from '../Game/GameActions';
import { DeselectAction, ShowPromotionDialog } from '../UI/UIActions';

function getBoardClassName(props) {
    let classes = [styles.board];

    if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
        classes.push(styles.flipped);
    }

    // add additional class if a piece is selected
    if (!!props.selection) {
        classes.push(styles.dragging);
    }

    return classes.join(" ");
}

function move(props, source, destination, animate) {
            
    let validMoves = props.gameLogic.getValidMoves(props.board, props.pieces, source);

    for (var i = 0; i < validMoves.length; i++) {
        let validMove = validMoves[i];
        let validMoveDestination = validMove.payload.destination;

        if (!(destination[0] === validMoveDestination[0] && destination[1] === validMoveDestination[1])) {
            continue;
        }

        if (validMove.type === "promote") {
            props.updateUIState(ShowPromotionDialog(validMove.payload.source, validMove.payload.destination, destination[0], destination[1]));
            return false; // return the piece back into original position incase we cancel out of promotion
        }
        else {
            if (animate) {
                props.players[props.turn].move(Move.animated(validMove));
            } else {
                props.players[props.turn].move(Move.unanimated(validMove));
            }   
    
            props.updateUIState(DeselectAction());
        }

        return true;
    }

    return false;
}

function performDragMove(props) { 
    return (source, destination) => {
        return move(props, source, destination, false);
    };
}

function performClickMove(props) { 
    return (destination) => {
        let source = props.selection;
        let moveResult = move(props, source, destination, true);
        
        props.updateUIState(DeselectAction());
        
        return moveResult;
    };
}

function Board(props) {

    let rows = [];

    // ** NOTE: this function overwrites the multiple 'promote' move actions on a 'promotion' square destination for pawns.
    let squareToValidMove = {};
    for (var i = 0; i < props.validMoves.length; i++) {
        let validMove = props.validMoves[i];
        let destination = validMove.payload.destination;
        squareToValidMove[destination] = validMove;
    }
 
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            let position = [row, col];
            let highlight = !!squareToValidMove[position];

            rows.push(
                <Square key={row+","+col}
                        row={row}
                        col={col}
                        highlight={highlight}
                        performDragMove={performDragMove(props)}
                        performClickMove={performClickMove(props)}
                        animate={props.animate}
                        {...props}
                />
            );
        }
    }

    return (
        <div className={styles.boardContainer}>
            
            {props.promotionDialog.visible && 
                <BoardPromotionSelection 
                    perspective={props.perspective}
                    promotionDialog={props.promotionDialog} 
                    meta={props.meta}
                    turn={props.turn} 
                    updateGameState={props.updateGameState}
                    updateUIState={props.updateUIState}
                /> 
            }
            
            <div className={getBoardClassName(props)}>
                { rows }
            </div>
        
        </div>
    )
}

export default memo(Board);
