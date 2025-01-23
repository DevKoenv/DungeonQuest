// @ts-ignore
import keypress from "keypress";

export type Direction = "up" | "down" | "left" | "right";
export type GameAction = "inventory" | "options" | "quit" | "toggleLineOfSight";

export interface InputHandlers {
  onMove: (direction: Direction) => void;
  onAction: (action: GameAction) => void;
}

export class InputManager {
  private pressedKeys: { [key: string]: boolean } = {};

  constructor(private handlers: InputHandlers) {
    this.setupKeyHandling();
  }

  private setupKeyHandling(): void {
    keypress(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on("keypress", this.handleKeyPress.bind(this));
    process.stdin.on("data", this.handleKeyRelease.bind(this));
  }

  private handleKeyPress(_ch: any, key: any): void {
    if (!key) return;
    if (key.ctrl && key.name === "c") {
      this.cleanup();
      process.exit();
    }

    const keyName = key.name?.toLowerCase();
    if (!keyName) return;

    switch (keyName) {
      case "t":
        return this.handlers.onAction("toggleLineOfSight");
      case "i":
        return this.handlers.onAction("inventory");
      case "o":
        return this.handlers.onAction("options");
      case "q":
        return this.handlers.onAction("quit");
    }

    if (["w", "a", "s", "d"].includes(keyName)) {
      if (!this.pressedKeys[keyName]) {
        this.pressedKeys[keyName] = true;
        this.processMovement();
      }
    }
  }

  private handleKeyRelease(data: Buffer): void {
    const key = data.toString().toLowerCase();
    if (["w", "a", "s", "d"].includes(key)) {
      delete this.pressedKeys[key];
    }
  }

  private processMovement(): void {
    if (this.pressedKeys["w"]) this.handlers.onMove("up");
    if (this.pressedKeys["s"]) this.handlers.onMove("down");
    if (this.pressedKeys["a"]) this.handlers.onMove("left");
    if (this.pressedKeys["d"]) this.handlers.onMove("right");
  }

  public cleanup(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
}
