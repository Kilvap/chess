
import { useEffect, useState, memo } from 'react';
import styles from './EvaluationBar.module.scss';

import FEN from '../GameLogic/FEN';

function getPercentageFromEvaluation(evaluation) {

    let min = -10;
    let max = 10;

    // clamp value between -10 and 10
    let value = Math.min(Math.max(evaluation, min), max);

    // convert value to percentage
    let percentage = parseInt(((value - (min)) / (max - min)) * 100);

    // cap height percentage to range [5-95]
    return Math.max(5, Math.min(95, 100 - percentage));
}

function EvaluationBar(props) {

    let { gameState, engine } = props;

    const [evaluation, setEvaluation] = useState(0.0);
    const [percentage, setPercentage] = useState(50);

    useEffect(() => {

        console.log("Getting eval...");

        let fenString = FEN.getString(gameState);
        engine.postMessage(`position fen ${fenString}`);
        engine.postMessage(`eval`);

        engine.onmessage = (message) => {
            const messageWords = message.data.split(' ');

            console.log("Response", message);

            // Parse stockfish response for evaluation
            if (messageWords[0] === 'Total' && messageWords[1] === 'evaluation:') {

                console.log("Evaluation:", messageWords[2]);

                setEvaluation(messageWords[2]);
                setPercentage(getPercentageFromEvaluation(parseFloat(messageWords[2])));
            }
        }

    }, [gameState])

    return ( 
        <div className={styles.container}>
            <div className={styles.eval} style={{ height: `${percentage}%`}}> { evaluation } </div>
        </div>
    );
}

export default memo(EvaluationBar);
