import * as blessed from "blessed";
import { MainMenuScreen } from "@/screens/MainMenuScreen";
import { GameScreen } from "@/screens/GameScreen";
import type { BaseScreen } from "@/screens/BaseScreen";

export class ScreenManager {
  private screen: blessed.Widgets.Screen;
  private mainMenu: MainMenuScreen;
  private gameScreen: GameScreen;
  private currentScreen?: BaseScreen;
  private onNewGame?: () => void;

  constructor(onNewGame?: () => void) {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "DungeonQuest",
    });
    
    this.onNewGame = onNewGame;

    this.mainMenu = new MainMenuScreen(
      this.screen,
      () => {
        this.showGame();
        this.onNewGame?.();
      },
      () => this.quit()
    );
    
    this.gameScreen = new GameScreen(
      this.screen,
      () => this.showMenu()  // Pass showMenu as the callback
    );
    this.showMenu();
  }

  public showMenu(): void {
    this.currentScreen?.hide();
    this.currentScreen = this.mainMenu;
    this.mainMenu.show();
    this.screen.render();
  }

  public showGame(): void {
    this.currentScreen?.hide();
    this.currentScreen = this.gameScreen;
    this.gameScreen.show();
    this.screen.render();
  }

  public renderFrame(viewportContent: string[][], statsContent: string[]): void {
    if (this.currentScreen === this.gameScreen) {
      this.gameScreen.render(viewportContent, statsContent);
    }
  }

  private quit(): void {
    this.screen.destroy();
    process.exit(0);
  }

  public getViewportDimensions() {
    return {
      width: Math.floor(Number(this.screen.width) * 0.85),
      height: Math.floor(Number(this.screen.height))
    };
  }

  public getGameScreen(): GameScreen {
    return this.gameScreen;
  }
}