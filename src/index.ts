import { DungeonGenerator, type DungeonState } from "@/dungeon/Generator";
// @ts-ignore
import keypress from "keypress";

class Game {
  private dungeon!: DungeonState;
  private pressedKeys: { [key: string]: boolean } = {};
  private readonly SIDE_PANEL_WIDTH = 30;
  private readonly UI_PADDING = 3;
  private gameState: "PLAYING" | "INVENTORY" | "OPTIONS" = "PLAYING";

  constructor() {
    this.updateViewport();
    this.setupKeyHandling();
    process.stdout.on("resize", () => this.updateViewport());
  }

  private updateViewport(): void {
    const { columns, rows } = process.stdout;
    const viewportWidth = columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING;
    const viewportHeight = rows - 3;

    const generator = new DungeonGenerator({
      maxRoomSize: 15,
      minRoomSize: 7,
      padding: 2,
      rooms: 25,
      rows: 100,
      cols: Math.max(160, viewportWidth * 2), // Double width to account for terminal chars
      viewportWidth,
      viewportHeight,
      lineOfSight: true,
    });

    this.dungeon = generator.generate();
    this.render();
  }

  private setupKeyHandling(): void {
    keypress(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on("keypress", (_ch, key) => {
      if (!key) return;

      if (key.ctrl && key.name === "c") {
        this.cleanup();
        process.exit();
      }

      const keyName = key.name?.toLowerCase();
      if (!keyName) return;

      if (keyName === "t") {
        this.dungeon.toggleLineOfSight();
        this.render();
        return;
      }

      if (keyName === "i") {
        this.gameState =
          this.gameState === "INVENTORY" ? "PLAYING" : "INVENTORY";
        this.render();
        return;
      }

      if (keyName === "o") {
        this.gameState = this.gameState === "OPTIONS" ? "PLAYING" : "OPTIONS";
        this.render();
        return;
      }

      if (["w", "a", "s", "d"].includes(keyName)) {
        if (!this.pressedKeys[keyName]) {
          this.pressedKeys[keyName] = true;
          this.processMovement();
        }
      }

      if (keyName === "q") {
        this.cleanup();
        process.exit();
      }
    });

    process.stdin.on("data", (data) => {
      const key = data.toString().toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        delete this.pressedKeys[key];
      }
    });
  }

  private cleanup(): void {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  }

  private renderInventory(): string[] {
    return ["=== Inventory ===", "No items", "", "Press I to close"];
  }

  private renderOptions(): string[] {
    return [
      "=== Options ===",
      "No current actions available",
      "",
      "Press O to close",
    ];
  }

  private renderUI(): string[] {
    const { columns } = process.stdout;
    const lines: string[] = [];
    const mapLines = this.dungeon.getViewport().map((row) => row.join(""));

    // Side panel content
    const sidePanel =
      this.gameState === "INVENTORY"
        ? this.renderInventory()
        : ["=== Player Info ===", "Health: 100/100", "Level: 1", "XP: 0/100"];

    // Combine map and side panel
    for (let i = 0; i < Math.max(mapLines.length, sidePanel.length); i++) {
      const mapLine =
        mapLines[i] ||
        " ".repeat(columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING);
      const infoLine = sidePanel[i] || " ".repeat(this.SIDE_PANEL_WIDTH);
      lines.push(`${mapLine} │ ${infoLine}`);
    }

    // Add bottom panel
    lines.push("─".repeat(columns));

    if (this.gameState === "OPTIONS") {
      lines.push(...this.renderOptions());
    } else {
      lines.push("[I] Inventory  [O] Options  [Q] Quit");
    }

    return lines;
  }

  private render(): void {
    console.clear();
    console.log(this.renderUI().join("\n"));
  }

  private processMovement(): void {
    if (this.pressedKeys["w"]) this.dungeon.movePlayer("up");
    if (this.pressedKeys["s"]) this.dungeon.movePlayer("down");
    if (this.pressedKeys["a"]) this.dungeon.movePlayer("left");
    if (this.pressedKeys["d"]) this.dungeon.movePlayer("right");
    this.render();
  }

  public async start(): Promise<void> {
    this.render();
  }
}

// Start the game
const game = new Game();
game.start().catch(console.error);
