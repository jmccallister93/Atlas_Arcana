// stateManager.js

class StateManager {
  constructor() {
    this.currentState = {};
  }

  updateState(newState) {
    this.currentState = newState;
    this.broadcastState();
  }

  broadcastState() {
    // Broadcasting the state to all connected clients
    io.emit("stateUpdate", this.currentState);
  }
}

module.exports = StateManager;
