export class Game {
  #switchTurn() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    this.uiCallbacks.updateTurnIndicator(this.players[this.currentPlayerIndex].name);
    this.uiCallbacks.setButtonsEnabled(this.currentPlayerIndex, true);
    this.uiCallbacks.setButtonsEnabled(1 - this.currentPlayerIndex, false);
  }

  #checkWinCondition() {
    const p1Health = this.players[0].character.getHealth();
    const p2Health = this.players[1].character.getHealth();
    if (p1Health <= 0 && p2Health <= 0) return 'draw';
    if (p1Health <= 0) return 'p2';
    if (p2Health <= 0) return 'p1';
    return null;
  }

  #endGame(result) {
    this.gameOver = true;
    if (result === 'draw') {
      this.uiCallbacks.showWinner("It's a draw!");
    } else if (result === 'p1') {
      this.uiCallbacks.showWinner(`${this.players[0].name} wins!`);
    } else if (result === 'p2') {
      this.uiCallbacks.showWinner(`${this.players[1].name} wins!`);
    }
    this.uiCallbacks.setButtonsEnabled(0, false);
    this.uiCallbacks.setButtonsEnabled(1, false);
  }

  constructor(player1, player2, uiCallbacks) {
    this.players = [player1, player2];
    this.uiCallbacks = uiCallbacks;
    this.gameOver = false;
    this.currentPlayerIndex = 0;
  }

  start() {
    this.currentPlayerIndex = 0;
    const [p1, p2] = this.players;
    this.uiCallbacks.updateHealthBar(0, p1.character.getHealth(), p1.character.getMaxHealth());
    this.uiCallbacks.updateHealthBar(1, p2.character.getHealth(), p2.character.getMaxHealth());
    this.uiCallbacks.updateTurnIndicator(this.players[0].name);
    this.uiCallbacks.setButtonsEnabled(0, true);
    this.uiCallbacks.setButtonsEnabled(1, false);
  }

  playerAction(type, playerIndex) {
    if (this.gameOver) return;

    // Reject if it's not this player's turn
    if (playerIndex !== this.currentPlayerIndex) return;

    const active   = this.players[this.currentPlayerIndex];
    const opponent = this.players[1 - this.currentPlayerIndex];

    if (type === 'attack') {
      const damage = active.character.attack();
      opponent.character.takeDamage(damage);
      this.uiCallbacks.appendLog(`${active.name} attacks for ${damage} damage!`, 'attack');
      this.uiCallbacks.triggerAnimation(active.character.constructor.name, this.currentPlayerIndex);
    } else if (type === 'heal') {
      const healed = active.character.heal(20);
      this.uiCallbacks.appendLog(`${active.name} heals for ${healed} HP!`, 'heal');
    } else if (type === 'special') {
      const result = active.character.specialAbility();
      if (result === null) {
        this.uiCallbacks.appendLog(`${active.name}'s special: No uses left`, 'neutral');
        this.uiCallbacks.disableSpecial(this.currentPlayerIndex);
        return;
      }
      opponent.character.takeDamage(result.damage);
      this.uiCallbacks.appendLog(`${active.name} uses ${result.message} for ${result.damage} damage!`, 'special');
      this.uiCallbacks.triggerAnimation(active.character.constructor.name, this.currentPlayerIndex);
    }

    this.uiCallbacks.updateHealthBar(0, this.players[0].character.getHealth(), this.players[0].character.getMaxHealth());
    this.uiCallbacks.updateHealthBar(1, this.players[1].character.getHealth(), this.players[1].character.getMaxHealth());

    const winResult = this.#checkWinCondition();
    if (winResult) {
      this.#endGame(winResult);
      return;
    }

    this.#switchTurn();
  }
}
