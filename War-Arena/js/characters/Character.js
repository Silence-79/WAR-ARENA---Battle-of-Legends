export class Character {
  constructor(name, health, attackPower) {
    this.name = name;
    this._health = health;
    this._maxHealth = health;
    this.attackPower = attackPower;
    this.specialUsesLeft = 2;
  }

  takeDamage(amount) {
    this._health = Math.max(0, this._health - amount);
  }

  heal(amount) {
    const previous = this._health;
    this._health = Math.min(this._maxHealth, this._health + amount);
    return this._health - previous;
  }

  getHealth() {
    return this._health;
  }

  getMaxHealth() {
    return this._maxHealth;
  }

  // Abstract stub — subclasses must override
  attack() {
    return 0;
  }

  // Abstract stub — subclasses must override
  specialAbility() {
    return null;
  }
}
