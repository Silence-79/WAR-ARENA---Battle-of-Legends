export class Player {
  #name;
  #character;

  constructor(name, character) {
    this.#name = name;
    this.#character = character;
  }

  get name() {
    return this.#name;
  }

  get character() {
    return this.#character;
  }
}
