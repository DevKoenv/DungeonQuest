// @ts-ignore
import keypress from "keypress";

export type Direction = "up" | "down" | "left" | "right";
export type GameAction = "inventory" | "options" | "quit" | "toggleLineOfSight";

export interface InputHandlers {
  onMove: (direction: Direction) => void;
  onAction: (action: GameAction) => void;
}

export class InputManager {
  constructor(private handlers: InputHandlers) {
    this.setupKeyHandling();
  }

  private setupKeyHandling(): void {
    keypress(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on("keypress", this.handleKeyPress.bind(this));
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
      // Debugging
      case "t":
        return this.handlers.onAction("toggleLineOfSight");

      // Actions
      case "i":
        return this.handlers.onAction("inventory");
      case "o":
        return this.handlers.onAction("options");
      case "q":
        return this.handlers.onAction("quit");

      // Movement
      case "w":
        return this.handlers.onMove("up");
      case "s":
        return this.handlers.onMove("down");
      case "a":
        return this.handlers.onMove("left");
      case "d":
        return this.handlers.onMove("right");
    }
  }

  public cleanup(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }
}
