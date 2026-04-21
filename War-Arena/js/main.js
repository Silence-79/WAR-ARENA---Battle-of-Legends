import { Warrior } from './characters/Warrior.js';
import { Mage }    from './characters/Mage.js';
import { Archer }  from './characters/Archer.js';
import { Player }  from './Player.js';
import { Game }    from './Game.js';
import {
  initSprites,
  playAttackPose,
  playDamagedPose,
  updateHealthBarColor,
  colorizeLastLog,
} from './sprites.js';

let game;

const uiCallbacks = {
  updateHealthBar(playerIndex, current, max) {
    const i   = playerIndex + 1;
    const pct = (current / max) * 100;
    const bar  = document.getElementById(`player${i}-health-bar`);
    const text = document.getElementById(`player${i}-health-text`);
    bar.style.width = `${pct}%`;
    bar.setAttribute('aria-valuenow', pct);
    text.textContent = current;
    updateHealthBarColor(playerIndex, pct);
  },

  appendLog(message, type = 'neutral') {
    const log = document.getElementById('game-log');
    const p   = document.createElement('p');
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
    colorizeLastLog(type);
  },

  updateTurnIndicator(playerName) {
    document.getElementById('turn-indicator').textContent = `${playerName}'s Turn`;
  },

  showWinner(message) {
    const indicator = document.getElementById('turn-indicator');
    indicator.textContent = message;
    indicator.classList.add('winner');
  },

  setButtonsEnabled(playerIndex, enabled) {
    const i = playerIndex + 1;
    document.getElementById(`player${i}-attack-btn`).disabled  = !enabled;
    document.getElementById(`player${i}-heal-btn`).disabled    = !enabled;
    document.getElementById(`player${i}-special-btn`).disabled = !enabled;
  },

  disableSpecial(playerIndex) {
    document.getElementById(`player${playerIndex + 1}-special-btn`).disabled = true;
  },

  triggerAnimation(characterClass, attackerIndex) {
    const defenderIndex = 1 - attackerIndex;

    // Sprite pose changes
    playAttackPose(attackerIndex);
    setTimeout(() => playDamagedPose(defenderIndex), 300);

    // All effects go inside .sprite-stage (position:relative)
    const stage = document.querySelector('.sprite-stage');
    const stageRect = stage.getBoundingClientRect();

    // Helper: get sprite center relative to stage
    function spritePos(idx) {
      const el = document.getElementById(`player${idx + 1}-sprite`);
      const r  = el.getBoundingClientRect();
      return {
        x: r.left - stageRect.left + r.width  / 2,
        y: r.top  - stageRect.top  + r.height / 2,
      };
    }

    const attackerPos = spritePos(attackerIndex);
    const defenderPos = spritePos(defenderIndex);

    if (characterClass === 'Warrior') {
      // Panel lunge animation
      const panel = document.getElementById(`player${attackerIndex + 1}-panel`);
      panel.classList.add('power-strike');
      panel.addEventListener('animationend', () => panel.classList.remove('power-strike'), { once: true });

      // Slash appears on the defender sprite
      const slash = document.createElement('div');
      slash.classList.add('sword-slash');
      slash.style.left = `${defenderPos.x - 48}px`;
      slash.style.top  = `${defenderPos.y - 32}px`;
      stage.appendChild(slash);
      slash.addEventListener('animationend', () => slash.remove(), { once: true });

    } else if (characterClass === 'Mage') {
      const div = document.createElement('div');
      div.classList.add('fireball');
      // Start at attacker, fly toward defender
      div.style.left = `${attackerPos.x}px`;
      div.style.top  = `${attackerPos.y - 16}px`;
      if (attackerIndex === 1) div.classList.add('reverse');
      stage.appendChild(div);
      div.addEventListener('animationend', () => div.remove(), { once: true });

    } else if (characterClass === 'Archer') {
      const div = document.createElement('div');
      div.classList.add('arrow');
      div.style.left = `${attackerPos.x}px`;
      div.style.top  = `${attackerPos.y - 8}px`;
      if (attackerIndex === 1) div.classList.add('reverse');
      stage.appendChild(div);
      div.addEventListener('animationend', () => div.remove(), { once: true });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-btn').addEventListener('click', () => {
    const val1 = document.getElementById('player1-select').value;
    const val2 = document.getElementById('player2-select').value;
    const validationMsg = document.getElementById('validation-message');

    if (!val1 || !val2) {
      validationMsg.textContent = 'Please select a character for both players.';
      return;
    }
    validationMsg.textContent = '';

    const charMap = { Warrior, Mage, Archer };
    const char1 = new charMap[val1]();
    const char2 = new charMap[val2]();

    const player1 = new Player('Player 1', char1);
    const player2 = new Player('Player 2', char2);

    document.getElementById('player1-name').textContent  = 'Player 1';
    document.getElementById('player2-name').textContent  = 'Player 2';
    document.getElementById('player1-class').textContent = char1.constructor.name;
    document.getElementById('player2-class').textContent = char2.constructor.name;

    // Init arena sprites
    initSprites(val1, val2);

    document.getElementById('selection-screen').hidden = true;
    document.getElementById('game-screen').removeAttribute('hidden');

    game = new Game(player1, player2, uiCallbacks);
    game.start();

    // Each button passes its own player index (0 or 1) — Game.js validates the turn
    document.getElementById('player1-attack-btn').addEventListener('click', () => game.playerAction('attack', 0));
    document.getElementById('player1-heal-btn').addEventListener('click',   () => game.playerAction('heal',   0));
    document.getElementById('player1-special-btn').addEventListener('click',() => game.playerAction('special',0));
    document.getElementById('player2-attack-btn').addEventListener('click', () => game.playerAction('attack', 1));
    document.getElementById('player2-heal-btn').addEventListener('click',   () => game.playerAction('heal',   1));
    document.getElementById('player2-special-btn').addEventListener('click',() => game.playerAction('special',1));
  });
});
