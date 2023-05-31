
export class PerformedMove {
    static create(piece, move) {
        let { type, payload: { source, destination } } = move;
        return { type, pieceType: piece.type, source, destination };
    }
}
