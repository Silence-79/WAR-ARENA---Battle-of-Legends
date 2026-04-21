/**
 * sprites.js
 * Handles all pixel-art sprite display and pose switching in the arena.
 * Runs after main.js sets up the game.
 */

const SPRITE_CLASS = {
  Warrior: 'warrior-sprite',
  Mage:    'mage-sprite',
  Archer:  'archer-sprite',
};

// Map character class → sprite sheet frame offsets (px)
const POSE = {
  idle:    '0px',
  attack:  '-64px',
  damaged: '-128px',
};

/**
 * Set the sprite class and idle pose for both arena sprites
 * and the selection-screen previews.
 */
export function initSprites(char1ClassName, char2ClassName) {
  const s1 = document.getElementById('player1-sprite');
  const s2 = document.getElementById('player2-sprite');

  // Clear old classes
  s1.className = 'sprite-display';
  s2.className = 'sprite-display';

  s1.classList.add(SPRITE_CLASS[char1ClassName], 'pose-idle');
  s2.classList.add(SPRITE_CLASS[char2ClassName], 'pose-idle');
}

/**
 * Briefly show the attack pose then return to idle.
 * @param {number} playerIndex  0 or 1
 */
export function playAttackPose(playerIndex) {
  const id = `player${playerIndex + 1}-sprite`;
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.remove('pose-idle', 'pose-damaged');
  el.classList.add('pose-attack');

  setTimeout(() => {
    el.classList.remove('pose-attack');
    el.classList.add('pose-idle');
  }, 500);
}

/**
 * Briefly show the damaged pose + shake, then return to idle.
 * @param {number} playerIndex  0 or 1
 */
export function playDamagedPose(playerIndex) {
  const spriteId  = `player${playerIndex + 1}-sprite`;
  const wrapperId = `sprite${playerIndex + 1}-wrapper`;
  const sprite  = document.getElementById(spriteId);
  const wrapper = document.getElementById(wrapperId);
  if (!sprite) return;

  sprite.classList.remove('pose-idle', 'pose-attack');
  sprite.classList.add('pose-damaged');

  // Shake the wrapper
  if (wrapper) {
    wrapper.classList.add('sprite-shake');
    wrapper.addEventListener('animationend', () => {
      wrapper.classList.remove('sprite-shake');
    }, { once: true });
  }

  setTimeout(() => {
    sprite.classList.remove('pose-damaged');
    sprite.classList.add('pose-idle');
  }, 600);
}

// ── Selection screen previews ─────────────────────────────────────────────────
function setupPreview(selectId, spriteId, nameId) {
  const sel    = document.getElementById(selectId);
  const sprite = document.getElementById(spriteId);
  const name   = document.getElementById(nameId);
  if (!sel || !sprite) return;

  sel.addEventListener('change', () => {
    const val = sel.value;
    sprite.className = 'char-preview-sprite';
    if (val && SPRITE_CLASS[val]) {
      sprite.classList.add(SPRITE_CLASS[val]);
      name.textContent = val.toUpperCase();
    } else {
      name.textContent = '?';
    }
  });
}

setupPreview('player1-select', 'player1-preview-sprite', 'player1-preview-name');
setupPreview('player2-select', 'player2-preview-sprite', 'player2-preview-name');

// ── Health bar color update ───────────────────────────────────────────────────
export function updateHealthBarColor(playerIndex, pct) {
  const bar = document.getElementById(`player${playerIndex + 1}-health-bar`);
  if (!bar) return;
  bar.classList.remove('medium', 'low');
  if (pct <= 25)      bar.classList.add('low');
  else if (pct <= 50) bar.classList.add('medium');
}

// ── Log entry color coding ────────────────────────────────────────────────────
export function colorizeLastLog(type) {
  const log = document.getElementById('game-log');
  if (!log) return;
  const last = log.lastElementChild;
  if (!last) return;
  if (type === 'attack')  last.classList.add('log-attack');
  if (type === 'heal')    last.classList.add('log-heal');
  if (type === 'special') last.classList.add('log-special');
}
