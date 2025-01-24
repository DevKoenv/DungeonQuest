import type { DungeonState } from "@/types/DungeonState";
import { ScreenManager } from "@/screens/ScreenManager";
import { InputManager } from "@/utils/InputManager";
import { UIState } from "@/core/UIState";
import { Warrior, Magician } from "@/classes/GameClass";
import { Player } from "@/entities/Player";
import { Dungeon } from "@/dungeon/Dungeon";
import { DungeonGenerator } from "@/dungeon/Generator";

export class GameManager {
  private dungeon!: DungeonState;
  private screen: ScreenManager;
  private input: InputManager;
  private ui: UIState;
  private gameState: 'MENU' | 'PLAYING' = 'MENU';
  private player?: Player;

  constructor() {
    // Initialize UI components
    this.screen = new ScreenManager(() => {
      this.startNewGame();
    });
    
    this.ui = new UIState();

    // Initialize input handling
    this.input = new InputManager({
      onMove: this.handleMove.bind(this),
      onAction: this.handleAction.bind(this)
    });

    // Show initial menu
    this.screen.showMenu();
  }

  private handleMove(direction: "up" | "down" | "left" | "right"): void {
    if (this.gameState !== 'PLAYING') return;
    this.dungeon.movePlayer(direction);
    this.render();
  }

  private handleAction(action: "inventory" | "options" | "quit" | "toggleLineOfSight"): void {
    if (this.gameState !== 'PLAYING') return;

    switch (action) {
      case "inventory":
        this.ui.setState(
          this.ui.getState() === "INVENTORY" ? "PLAYING" : "INVENTORY"
        );
        break;
      case "options":
        this.ui.setState(
          this.ui.getState() === "OPTIONS" ? "PLAYING" : "OPTIONS"
        );
        break;
      case "toggleLineOfSight":
        this.dungeon.toggleLineOfSight();
        break;
      case "quit":
        this.endGame();
        return;
    }
    this.render();
  }

  public startGame(): void {
    this.screen.showMenu();
  }

  private startNewGame(): void {
    const gameScreen = this.screen.getGameScreen();
    const generatedDungeon = gameScreen.getGeneratedDungeon();
    const viewport = gameScreen.getViewportConfig();
    
    this.player = new Player(
      "Hero",
      new Warrior(),
      generatedDungeon.startPosition,
      viewport
    );

    this.dungeon = gameScreen.createDungeon(this.player);
    this.gameState = 'PLAYING';
    this.render();
  }

  public saveGame(): void {
    throw new Error("Save game not implemented yet");
  }

  public loadGame(): void {
    throw new Error("Load game not implemented yet");
  }

  public endGame(): void {
    this.gameState = 'MENU';
    this.screen.showMenu();
  }

  private render(): void {
    if (this.gameState === 'PLAYING') {
      this.screen.renderFrame(
        this.dungeon.getViewport(),
        this.ui.renderSidePanel()
      );
    }
  }
}