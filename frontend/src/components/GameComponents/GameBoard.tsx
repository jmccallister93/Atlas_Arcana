import React from 'react';
import './styles.module.scss';

const GameBoard = () => {
  // Example logic to render cells on the board
  const renderCells = () => {
    // Create an array of dummy cell elements
    const cells = [];
    for (let i = 0; i < 10; i++) {
      cells.push(<div key={i} className="cell">Cell {i}</div>);
    }
    return cells;
  };

  return (
    <div className="game-board">
      {renderCells()}
    </div>
  );
};

export default GameBoard;
