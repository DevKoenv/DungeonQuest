/** Represents possible game UI states */
export type GameState = "PLAYING" | "INVENTORY" | "OPTIONS";

/**
 * Manages the game's UI state and renders UI panels
 * Handles state transitions between playing, inventory and options views
 */
export class UIState {
  /** Current UI state - defaults to PLAYING */
  private state: GameState = "PLAYING";

  /**
   * Updates the current UI state
   * @param state - New state to transition to
   */
  public setState(state: GameState): void {
    this.state = state;
  }

  /**
   * Retrieves the current UI state
   * @returns Current GameState
   */
  public getState(): GameState {
    return this.state;
  }

  /**
   * Renders the side panel content based on current state
   * Shows inventory when in INVENTORY state, otherwise shows player stats
   * @returns Array of strings representing panel content
   */
  public renderSidePanel(): string[] {
    // Show inventory panel if in inventory state
    if (this.state === "INVENTORY") {
      return ["=== Inventory ===", "No items", "", "Press I to close"];
    }

    // Default view shows player stats
    return ["=== Player Info ===", "Health: 100/100", "Level: 1", "XP: 0/100"];
  }

  /**
   * Renders the bottom panel content based on current state
   * Shows options when in OPTIONS state, otherwise shows available commands
   * @returns Array of strings representing panel content
   */
  public renderBottomPanel(): string[] {
    // Show options panel if in options state
    if (this.state === "OPTIONS") {
      return [
        "=== Options ===",
        "No current actions available",
        "",
        "Press O to close",
      ];
    }

    // Default view shows available commands
    return ["[I] Inventory  [O] Options  [Q] Quit"];
  }
}
