// move is a Move instance found below
export function ApplyMoveAction(move) {
    return {type: "applyMove", payload: move};
}

export function SetStatusAction(status) {
    return {type: "setStatus", payload: status};
}

export class Move {
    static move(source, destination) {
        return { type: "move", payload: {source, destination} };
    }

    static castleLeft(source, destination) {
        return { type: "castleLeft", payload: {source, destination} };
    }

    static castleRight(source, destination) {
        return { type: "castleRight", payload: {source, destination} };
    }

    static castleLong(source, destination) {
        return { type: "castleLong", payload: {source, destination} };
    }

    static castleShort(source, destination) {
        return { type: "castleShort", payload: {source, destination} };
    }

    static enpassant(source, destination, target) {
        return { type: "enpassant", payload: {source, destination, target} };
    }

    static promote(source, destination, pieceType) {
        return { type: "promote", payload: {source, destination, pieceType} };
    }

    static isEqual(move1, move2) {
        // quick and dirty - order of keys must remain same in the objects
        return JSON.stringify(move1) === JSON.stringify(move2);
    }
    
    static destinationsEqual(move1, move2) {
        return move1.payload.destination[0] === move2.payload.destination[0] &&
               move1.payload.destination[1] === move2.payload.destination[1];
    }

    // Wraps a move and adds animate property
    static animated(move) {
        return { payload: move, animate: true };
    }

    static unanimated(move) {
        return { payload: move, animate: false };
    }
}
