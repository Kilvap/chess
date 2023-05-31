import { memo, useRef, useEffect } from 'react';
import Coordinates from '../Helpers/Coordinates';

import styles from './MoveList.module.scss';

function getMoveStyle(last) {
    let classes = [styles.move];

    if (last) {
        classes.push(styles.current);
    }

    return classes.join(" ");
}

function getMoves(perspective, moves) {

    let results = moves.map((item, index) => {
        var current = index === (moves.length - 1);
        return <div className={getMoveStyle(current)}> { `${item.pieceType[0]}${Coordinates.screenToBoard(perspective, item.destination)}` } </div>
    });

    return results;
}

function MoveList(props) {

    let ref = useRef();
    let { perspective, moves } = props;

    useEffect(() => {
        ref.current.scrollLeft = ref.current.scrollWidth;
    });

    return (
        <div ref={ref} className={styles.container}>
            { getMoves(perspective, moves) }
        </div>
    );
}

export default memo(MoveList);
