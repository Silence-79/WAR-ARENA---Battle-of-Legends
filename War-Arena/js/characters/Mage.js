import { Character } from './Character.js';

export class Mage extends Character {
  constructor() {
    super("Mage", 90, 20);
  }

  attack() {
    return this.attackPower;
  }

  specialAbility() {
    if (this.specialUsesLeft === 0) return null;
    this.specialUsesLeft -= 1;
    return { damage: 40, message: "Fireball!" };
  }
}
