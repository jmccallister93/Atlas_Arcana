class TitanPositionManager {
  constructor() {
    this.titanPositions = new Map();
  }
  initializeTitanPositions(titansWithPositions) {
    titansWithPositions.forEach((titan) => {
      this.titanPositions.set(titan.name, { x: titan.x, y: titan.y });
    });
  }
  getTitanPositions() {
    let positions = [];
    this.titanPositions.forEach((position, titanName) => {
      positions.push({ titanName, ...position });
    });
    return positions;
  }
}

module.exports = TitanPositionManager;
