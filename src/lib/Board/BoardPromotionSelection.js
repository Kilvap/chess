import constants from '../Helpers/Constants';
import styles from './BoardPromotionSelection.module.scss';
import { ApplyMoveAction, Move } from '../Game/GameActions';
import { HidePromotionDialog } from '../UI/UIActions';

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

const pieceTypeToAction = {
    [constants.QUEEN]: promoteQueenAction,
    [constants.ROOK]: promoteRookAction,
    [constants.BISHOP]: promoteBishopAction,
    [constants.KNIGHT]: promoteKnightAction,
};

function getColumnClassName(props) {
    let classes = [styles.col];

    if (props.visible) {
        classes.push(styles.visible);
    }

    return classes.join(" ");
}

function getPieceClassName(props) {
    let classes = [styles.item];
    
    if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
        classes.push(styles.flipped);
    }

    classes.push(pieceClasses[props.side][props.pieceType]);

    return classes.join(" ");
}

function Piece(props) {
    
    let onClick = (props) => () => {
        if(props.visible) {
            let move = pieceTypeToAction[props.pieceType](props);
            props.updateGameState(move);
        }

        props.updateUIState(HidePromotionDialog());
    }
    
    return (
        <div className={getPieceClassName(props)} onClick={onClick(props)}></div>
    )
}

function promoteQueenAction(props) {
    return ApplyMoveAction(Move.promote(props.promotionDialog.source, props.promotionDialog.destination, constants.QUEEN));
}

function promoteRookAction(props) {
    return ApplyMoveAction(Move.promote(props.promotionDialog.source, props.promotionDialog.destination, constants.ROOK));
}

function promoteBishopAction(props) {
    return ApplyMoveAction(Move.promote(props.promotionDialog.source, props.promotionDialog.destination, constants.BISHOP));
}

function promoteKnightAction(props) {
    return ApplyMoveAction(Move.promote(props.promotionDialog.source, props.promotionDialog.destination, constants.KNIGHT));
}

function PromotionColumnUser(props) {
    return (
        <div className={getColumnClassName(props)}>
            <Piece {...props} pieceType={constants.QUEEN} />
            <Piece {...props} pieceType={constants.ROOK} />
            <Piece {...props} pieceType={constants.BISHOP} />
            <Piece {...props} pieceType={constants.KNIGHT} />
        </div>
    );
}

function PromotionColumnOpponent(props) {
    return (
        <div className={getColumnClassName(props)}>
            <Piece {...props} pieceType={constants.KNIGHT} />
            <Piece {...props} pieceType={constants.BISHOP} />
            <Piece {...props} pieceType={constants.ROOK} />
            <Piece {...props} pieceType={constants.QUEEN} />
        </div>
    );
}

function getGridClass(props) {
    let classes = [styles.grid];

    if (props.perspective !== props.meta.players[props.meta.userIndex].side) {
        classes.push(styles.flipped);
    }

    return classes.join(" ");
}

export default function BoardPromotionSelection (props) {
    let side = props.meta.players[props.turn].side;

    // Our promotion dialog grid only has two rows.
    let row = props.promotionDialog.row > 0 ? 1 : 0;
    let col = props.promotionDialog.col;

    let rows = [];
    for (var r = 0; r < 2; r++) {
        for (var c = 0; c < 8; c++) {
            let visible = (r === row && c === col);
            let column = <PromotionColumnUser {...props} key={r+","+c} visible={visible} side={side} />;
            if (r % 2 === 1) {
                column = <PromotionColumnOpponent {...props} key={r+","+c} visible={visible} side={side} />;
            }

            rows.push(column);
        }
    }

    return (
        <div className={getGridClass(props)}>
            { rows }
        </div>
    )
}
