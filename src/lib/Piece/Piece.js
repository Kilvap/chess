import styles from './Piece.module.scss';
import { useEffect, useRef } from 'react';
import constants from '../Helpers/Constants';
import { EndMoveAnimation, SelectAction } from '../UI/UIActions';
import { STATE_COMPLETED } from '../Helpers/GameStatus';

const pieceClasses = {
    [constants.BLACK]: 
        {   [constants.KING]: styles.blackKing, 
            [constants.QUEEN]: styles.blackQueen,
            [constants.ROOK]: styles.blackRook,
            [constants.BISHOP]: styles.blackBishop,
            [constants.KNIGHT]: styles.blackKnight,
            [constants.PAWN]: styles.blackPawn 
        },

    [constants.WHITE]: 
        {   [constants.KING]: styles.whiteKing, 
            [constants.QUEEN]: styles.whiteQueen,
            [constants.ROOK]: styles.whiteRook,
            [constants.BISHOP]: styles.whiteBishop,
            [constants.KNIGHT]: styles.whiteKnight,
            [constants.PAWN]: styles.whitePawn 
        }
};

let DropPiece = (props) => {
    return (element) => (e) => {
        element.classList.remove(styles.dragging);

        document.onmousemove = null;
        document.onmouseup = null;
        document.ontouchmove = null;
        document.ontouchend = null;

        let bounds = element.getBoundingClientRect();
        let x = bounds.left + (bounds.width / 2);
        let y = bounds.top + (bounds.height / 2);

        let destinationElements = document.elementsFromPoint(x, y);
        let destinationSquares = destinationElements.filter((item) => {
            return item.hasAttribute("data-square");
        });

        // Dragged somewhere off the board
        if (destinationSquares.length === 0) {
            // Move element back to initial position
            element.style.top = "0px";
            element.style.left = "0px";
            return;
        }
        
        // Attempt to move to destination
        let destinationSquare = destinationSquares[0];
        let destinationRow = parseInt(destinationSquare.getAttribute("data-row"));
        let destinationCol = parseInt(destinationSquare.getAttribute("data-col"));

        let validMove = props.performDragMove([props.row, props.col], [destinationRow, destinationCol]);

        // Not a valid move
        if (!validMove) {
            // Move element back to initial position
            element.style.top = "0px";
            element.style.left = "0px";
        }
    };
};

function DragPiece(props) {
    return (element, initialX, initialY) => (e) => {

        // calculate the new cursor position:
        let X = initialX - clientX(e);
        let Y = initialY - clientY(e);
        initialX = clientX(e);
        initialY = clientY(e);

        // set the element's new position:
        if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
            element.style.top = (element.offsetTop + Y) + "px";
            element.style.left = (element.offsetLeft + X) + "px";
        } else {
            element.style.top = (element.offsetTop - Y) + "px";
            element.style.left = (element.offsetLeft - X) + "px";
        }

        // TODO: need to add destination highlights here instead of relying only on css??
    }
};

function PickUpPiece(props, drag, drop) {
    return (e) => {

        // don't allow picking up pieces once game is complete
        if (props.status.state === STATE_COMPLETED) {
            return;
        }

        // don't allow picking up opponents pieces
        let boardPiece = props.pieces[props.pieceId];
        if (boardPiece.owner !== props.turn) {
            return;
        }

        // Update selection
        props.updateUIState(SelectAction([props.row, props.col]));
        
        let element = e.target;
        element.classList.add(styles.dragging);

        // get the mouse cursor position at startup:
        let initialX = clientX(e);
        let initialY = clientY(e);

        // center the piece to the mouse cursor
        let bounds = element.getBoundingClientRect();
        let originX = bounds.left + (bounds.width / 2);
        let originY = bounds.top + (bounds.height / 2);

        if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
            // Flipped orientation
            element.style.top = (element.offsetTop - (clientY(e) - originY)) + "px";
            element.style.left = (element.offsetLeft - (clientX(e) - originX)) + "px";
        } else {
            element.style.top = (element.offsetTop + (clientY(e) - originY)) + "px";
            element.style.left = (element.offsetLeft + (clientX(e)- originX)) + "px";
        }

        document.onmousemove = drag(element, initialX, initialY);
        document.onmouseup = drop(element);

        document.ontouchmove = drag(element, initialX, initialY);
        document.ontouchend = drop(element);
    };
}

function clientX(e) {
    return e.clientX || e.touches[0].clientX;
}

function clientY(e) {
    return e.clientY || e.touches[0].clientY;
}

function getPieceClass(pieceId, props) {
    let piece = props.pieces[pieceId];
    let color = props.meta.players[piece.owner].side;

    // default class
    let classes = [styles.piece];

    // the piece image
    if (pieceClasses[color] !== undefined && pieceClasses[color][piece.type] !== undefined) {
        classes.push(pieceClasses[color][piece.type]);
    }

    // if a piece is selected and it's not us we want to know
    if (props.selection && !(props.selection[0] === props.row && props.selection[1] === props.col) && props.turn !== piece.owner) {
        classes.push(styles.dragActive);
    }

    if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
        classes.push(styles.flipped);
    }

    if (props.highlight) {
        classes.push(styles.highlight);
    }

    return classes.join(" ");
}

export default function Piece(props) {
    let pieceRef = useRef();
    let style = getPieceClass(props.pieceId, props);

    // create drag and drop functions
    let drop = DropPiece(props);
    let drag = DragPiece(props);
    let pickupPiece = PickUpPiece(props, drag, drop);

    useEffect(() => {

        if (props.animate === null) {
            return;
        }

        let { move, complete } = props.animate;
        if (move.payload.source[0] === props.row && move.payload.source[1] === props.col) {

            pieceRef.current.classList.add(styles.animate);

            let deltaRow = move.payload.destination[0] - move.payload.source[0];
            let deltaCol = move.payload.destination[1] - move.payload.source[1];

            pieceRef.current.style.left = `${deltaCol * 100}%`;
            pieceRef.current.style.top = `${deltaRow * 100}%`;

            setTimeout(() => {
                pieceRef.current.classList.remove(styles.animate);
                props.updateUIState(EndMoveAnimation());
                complete();
            }, 250);
        }

    }, [props]);

    return (
        <div ref={pieceRef} className={style} onMouseDown={pickupPiece} />
    );
}
