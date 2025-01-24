import { DungeonGenerator, type DungeonState } from "@/dungeon/Generator";
import { ScreenManager } from "@/utils/ScreenManager";
import { InputManager } from "@/utils/InputManager";
import { UIState } from "@/core/UIState";

export class Game {
  private dungeon!: DungeonState; // The current state of the dungeon
  private screen: ScreenManager; // Manages the screen rendering
  private input: InputManager; // Manages user input
  private ui: UIState; // Manages the UI state

  constructor() {
    const { columns, rows } = process.stdout; // Get terminal dimensions
    this.screen = new ScreenManager(columns, rows); // Initialize screen manager with terminal dimensions
    this.ui = new UIState(); // Initialize UI state

    // Initialize input manager with callbacks for different actions
    this.input = new InputManager({
      onMove: (direction) => {
        this.dungeon.movePlayer(direction); // Move player in the dungeon
        this.render(); // Re-render the screen
      },
      onAction: (action) => {
        switch (action) {
          case "inventory":
            // Toggle inventory state
            this.ui.setState(
              this.ui.getState() === "INVENTORY" ? "PLAYING" : "INVENTORY"
            );
            break;
          case "options":
            // Toggle options state
            this.ui.setState(
              this.ui.getState() === "OPTIONS" ? "PLAYING" : "OPTIONS"
            );
            break;
          case "toggleLineOfSight":
            this.dungeon.toggleLineOfSight(); // Toggle line of sight in the dungeon
            break;
          case "quit":
            this.input.cleanup(); // Cleanup input manager
            process.exit(); // Exit the game
        }
        this.render(); // Re-render the screen
      },
    });

    this.updateViewport(); // Initialize the viewport
    process.stdout.on("resize", () => this.updateViewport()); // Update viewport on terminal resize
  }

  // Update the viewport dimensions and generate a new dungeon
  private updateViewport(): void {
    const viewport = this.screen.getViewportDimensions(); // Get current viewport dimensions
    const generator = new DungeonGenerator({
      maxRoomSize: 15,
      minRoomSize: 7,
      padding: 2,
      rooms: 25,
      rows: 100,
      cols: Math.max(160, viewport.width * 2),
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      lineOfSight: true,
    });

    this.dungeon = generator.generate(); // Generate a new dungeon
    this.render(); // Render the screen
  }

  // Render the current state of the game
  private render(): void {
    this.screen.renderFrame(
      this.dungeon.getViewport(), // Render the dungeon viewport
      this.ui.renderSidePanel(), // Render the side panel
      this.ui.renderBottomPanel() // Render the bottom panel
    );
  }

  // Start the game by rendering the initial state
  public start(): void {
    this.render();
  }
}
