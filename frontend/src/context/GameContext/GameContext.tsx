import React, { createContext, useContext, useReducer } from 'react';
import { GameSessionInfo } from '../../components/GameComponents/Interfaces';

interface GameContextType {
    gameState: GameSessionInfo;
    updateGameState: (newState: Partial<GameSessionInfo>) => void;
}

const GameContext = createContext<GameContextType>(null!);

const initialState: GameSessionInfo = {
    sessionId: '',
    gameState: {
        // ... Initialize all fields of your gameState
    },
    players: []
};

function gameReducer(state: GameSessionInfo, action: { type: string, payload: any }): GameSessionInfo {
    switch (action.type) {
        case 'UPDATE_GAME_STATE':
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export const GameProvider: React.FC = ({  }) => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    const updateGameState = (newState: Partial<GameSessionInfo>) => {
        dispatch({ type: 'UPDATE_GAME_STATE', payload: newState });
    };

    return (
        <GameContext.Provider value={{ gameState, updateGameState }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};
