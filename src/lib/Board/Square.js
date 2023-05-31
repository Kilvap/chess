import Piece from '../Piece/Piece';
import PieceSelector from '../Helpers/PieceSelector';
import styles from './Square.module.scss';
import Coordinates from '../Helpers/Coordinates';
import BoardSelector from '../Helpers/BoardSelector';


const borderStyles = { "0,0": styles.topLeftSquare,
                       "0,7": styles.topRightSquare,
                       "7,0": styles.bottomLeftSquare,
                       "7,7": styles.bottomRightSquare };

// Allow empty square or enemy piece square clicks to move the current selection
function SquareClick(props) {
    return (e) => {
        e.stopPropagation();

        let piece = PieceSelector.getPiece(props.board, props.pieces, [props.row, props.col]);

        // we clicked on our own piece, ignore it as a move, mousedown will handle it
        if (!!piece && piece.owner === props.turn) {
            return;
        }

        props.performClickMove([props.row, props.col]);
    };
}

function getStyle(props) {

    // determines whether we are black or white colored square (default class)
    let rowStyle = (props.row % 2 === 0) ? styles.evenRowSquare : styles.oddRowSquare;
    let classes = [rowStyle];
    
    // highlight us if we are selected
    if (!!props.selection && props.selection[0] === props.row && props.selection[1] === props.col) {
        classes.push(styles.highlightSourceSquare);
    }

    // highlight us if we're a source or destination in the last move
    if (props.moves.length > 0) {
        
        let { source: lastMoveSource, destination: lastMoveDestination } = props.moves[props.moves.length-1];
        
        if (props.row === lastMoveSource[0] && props.col === lastMoveSource[1]) {
            classes.push(styles.highlightSourceSquare);
        }
        
        if (props.row === lastMoveDestination[0] && props.col === lastMoveDestination[1]) {
            classes.push(styles.highlightDestinationSquare);
        }
    }

    // highlight us if our piece is animating
    if (props.animate !== null && props.animate.move.payload.source[0] === props.row && props.animate.move.payload.source[1] === props.col) {
        classes.push(styles.highlightSourceSquare);
    }

    // // add additional class if a piece is selected
    // if (!!props.selection) {
    //     classes.push(styles.dragging);
    // }

    if (props.status.checked === true) {
        let kingPositions = PieceSelector.getKingPositions(props.board, props.pieces);
        if (kingPositions[props.turn][0] === props.row && kingPositions[props.turn][1] === props.col) {
            classes.push(styles.checked);
        }
    }

    let borderStyleKey = [props.row, props.col];
    if (borderStyles[borderStyleKey]) {
        classes.push(borderStyles[borderStyleKey]);
    }
    
    return classes.join(" ");
}

function getSquareChild(props) {
    let pieceId = props.board[props.row][props.col];

    // we have a piece on us
    if (pieceId) {
        return  <Piece pieceId={pieceId} {...props} />;
    }
 
    // check if we're a destination highlight
    if (props.highlight) {
        return ( 
            <div className={styles.destinationHighlightContainer}>
                <div className={styles.destinationHighlightRow}>
                    <div className={styles.destinationHighlightCircle}></div>
                </div>
            </div>
        );
    }
}

function CoordinateRow(props) {

    let classes = [styles.coordinateRow];

    if (BoardSelector.originalPerspective(props.meta) !== props.perspective) {
        classes.push(styles.flippedCoordinate);
    }

    return (
        <div className={classes.join(" ")}> { Coordinates.screenToBoardRow(BoardSelector.originalPerspective(props.meta), props.row) } </div>
    );
}

function CoordinateCol(props) {

    let classes = [styles.coordinateCol];

    if (BoardSelector.originalPerspective(props.meta) !== props.perspective) {
        classes.push(styles.flippedCoordinate);
    }

    return (
        <div className={classes.join(" ")}> { Coordinates.screenToBoardCol(BoardSelector.originalPerspective(props.meta), props.col) }</div>
    );
}

export default function Square(props) {

    let style = getStyle(props);

    return (
        <div className={style} 
            onClick={SquareClick(props)}
            data-row={props.row}
            data-col={props.col}
            data-square={true}
        >

            { getSquareChild(props) }

            { props.col === 0 && <CoordinateRow {...props} /> }
            { props.row === 7 && <CoordinateCol {...props} /> }
        </div>
    )
}
