import { DungeonGenerator, type DungeonState } from "@/dungeon/Generator";
import { ScreenManager } from "@/utils/ScreenManager";
import { InputManager } from "@/utils/InputManager";
import { UIState } from "@/core/UIState";

export class Game {
  private dungeon!: DungeonState;
  private screen: ScreenManager;
  private input: InputManager;
  private ui: UIState;

  constructor() {
    const { columns, rows } = process.stdout;
    this.screen = new ScreenManager(columns, rows);
    this.ui = new UIState();

    this.input = new InputManager({
      onMove: (direction) => {
        this.dungeon.movePlayer(direction);
        this.render();
      },
      onAction: (action) => {
        switch (action) {
          case "inventory":
            this.ui.setState(
              this.ui.getState() === "INVENTORY" ? "PLAYING" : "INVENTORY",
            );
            break;
          case "options":
            this.ui.setState(
              this.ui.getState() === "OPTIONS" ? "PLAYING" : "OPTIONS",
            );
            break;
          case "toggleLineOfSight":
            this.dungeon.toggleLineOfSight();
            break;
          case "quit":
            this.input.cleanup();
            process.exit();
        }
        this.render();
      },
    });

    this.updateViewport();
    process.stdout.on("resize", () => this.updateViewport());
  }

  private updateViewport(): void {
    const viewport = this.screen.getViewportDimensions();
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

    this.dungeon = generator.generate();
    this.render();
  }

  private render(): void {
    this.screen.renderFrame(
      this.dungeon.getViewport(),
      this.ui.renderSidePanel(),
      this.ui.renderBottomPanel(),
    );
  }

  public start(): void {
    this.render();
  }
}
