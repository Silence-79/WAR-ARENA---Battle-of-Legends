import { Character } from './Character.js';

export class Warrior extends Character {
  constructor() {
    super("Warrior", 120, 15);
  }

  attack() {
    return this.attackPower;
  }

  specialAbility() {
    if (this.specialUsesLeft === 0) return null;
    this.specialUsesLeft -= 1;
    return { damage: 30, message: "Power Strike!" };
  }
}
