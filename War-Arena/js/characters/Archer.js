import { Character } from './Character.js';

export class Archer extends Character {
  constructor() {
    super("Archer", 100, 18);
  }

  attack() {
    return this.attackPower;
  }

  specialAbility() {
    if (this.specialUsesLeft === 0) return null;
    this.specialUsesLeft -= 1;
    return { damage: 35, message: "Rapid Shot!" };
  }
}
