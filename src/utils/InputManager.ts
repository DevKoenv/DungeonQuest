/**
 * Handles keyboard input for the game
 * Manages raw terminal input and converts keystrokes to game actions
 */

// @ts-ignore
import keypress from "keypress";

/** Possible movement directions in the game */
export type Direction = "up" | "down" | "left" | "right";

/** Available game actions that can be triggered by input */
export type GameAction = "inventory" | "options" | "quit" | "toggleLineOfSight";

/** Interface defining callback handlers for movement and actions */
export interface InputHandlers {
  onMove: (direction: Direction) => void;
  onAction: (action: GameAction) => void;
}

/**
 * Manages keyboard input and converts it to game actions
 * Uses raw terminal mode for immediate keypress detection
 */
export class InputManager {
  /**
   * Creates an input manager with the specified handlers
   * @param handlers - Callbacks for movement and actions
   */
  constructor(private handlers: InputHandlers) {
    this.setupKeyHandling();
  }

  /**
   * Sets up raw terminal input mode and keypress listeners
   * Enables immediate keypress detection without requiring Enter
   */
  private setupKeyHandling(): void {
    keypress(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true); // Enable raw mode for immediate input
    }

    process.stdin.on("keypress", this.handleKeyPress.bind(this));
  }

  /**
   * Processes individual keypress events and triggers appropriate handlers
   * @param _ch - Character (unused)
   * @param key - Key event containing name and modifiers
   */
  private handleKeyPress(_ch: any, key: any): void {
    if (!key) return;
    // Handle Ctrl+C for clean exit
    if (key.ctrl && key.name === "c") {
      this.cleanup();
      process.exit();
    }

    const keyName = key.name?.toLowerCase();
    if (!keyName) return;

    switch (keyName) {
      // Debugging controls
      case "t":
        return this.handlers.onAction("toggleLineOfSight");

      // Menu actions
      case "i":
        return this.handlers.onAction("inventory");
      case "o":
        return this.handlers.onAction("options");
      case "q":
        return this.handlers.onAction("quit");

      // WASD movement controls
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

  /**
   * Cleanup method to restore normal terminal input mode
   * Called before exiting to ensure terminal remains usable
   */
  public cleanup(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false); // Restore normal terminal mode
    }
  }
}
