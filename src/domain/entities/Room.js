export class Room {
  constructor({ id, name, isPrivate = false, ownerId }) {
    this.id = id;
    this.name = name;
    this.isPrivate = isPrivate;
    this.ownerId = ownerId;
  }
}
