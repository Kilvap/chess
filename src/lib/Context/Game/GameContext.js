import { createContext, useContext, useReducer } from "react";
import { reducer } from "./GameContextReducer";
import initialState from "./GameContextState";

export const GameContext = createContext({gameContext: null, setGameContext: () => {} });

export function GameContextProvider(props) {
    let [gameContext, setGameContext] = useReducer(reducer, initialState);

    return (
        <GameContext.Provider value={{gameContext, setGameContext}}>
            { props.children }
        </GameContext.Provider>
    );
}

// Convience wrapper
export function useGameContext() {
    return useContext(GameContext);
}
