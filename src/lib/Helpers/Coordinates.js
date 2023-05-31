import constants from "./Constants";

const coordinateMap = {
    // perspective
    [constants.WHITE]: {
        
        screenToBoardRow: {
            0: 8,
            1: 7,
            2: 6,
            3: 5,
            4: 4,
            5: 3,
            6: 2,
            7: 1,
        },

        boardToScreenRow: {
            8: 0,
            7: 1,
            6: 2,
            5: 3,
            4: 4,
            3: 5,
            2: 6,
            1: 7,
        },

        screenToBoardCol: {
            0: 'a',
            1: 'b',
            2: 'c',
            3: 'd',
            4: 'e',
            5: 'f',
            6: 'g',
            7: 'h',
        },

        boardToScreenCol: {
            'a': 0,
            'b': 1,
            'c': 2,
            'd': 3,
            'e': 4,
            'f': 5,
            'g': 6,
            'h': 7
        }
    },

    // perspective
    [constants.BLACK]: {
        
        screenToBoardRow: {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 7,
            7: 8,
        },
        
        boardToScreenRow: {
            8: 7,
            7: 6,
            6: 5,
            5: 4,
            4: 3,
            3: 2,
            2: 1,
            1: 0,
        },
        
        screenToBoardCol: {
            0: 'h',
            1: 'g',
            2: 'f',
            3: 'e',
            4: 'd',
            5: 'c',
            6: 'b',
            7: 'a'
        },
        
        boardToScreenCol: {
            'a': 7,
            'b': 6,
            'c': 5,
            'd': 4,
            'e': 3,
            'f': 2,
            'g': 1,
            'h': 0
        }
    }
}

export default class Coordinates {

    // [0,0] -> a8
    static screenToBoard(perspective, coordinate) {
        let [row, col] = coordinate;

        let boardRow = coordinateMap[perspective].screenToBoardRow[row];
        let boardCol = coordinateMap[perspective].screenToBoardCol[col];

        return `${boardCol}${boardRow}`;
    }

    // a8 -> [0,0]
    static boardToScreen(perspective, boardCoordinate) {
        let col = boardCoordinate[0];
        let row = boardCoordinate[1];

        let screenRow = coordinateMap[perspective].boardToScreenRow[row];
        let screenCol = coordinateMap[perspective].boardToScreenCol[col];

        return [screenRow, screenCol];
    }

    static screenToBoardCol(perspective, col) {
        return coordinateMap[perspective].screenToBoardCol[col];
    }

    static screenToBoardRow(perspective, row) {
        return coordinateMap[perspective].screenToBoardRow[row];
    }
}

