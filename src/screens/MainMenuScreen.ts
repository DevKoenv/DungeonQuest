import { Widgets } from "blessed";
import { BaseScreen } from "./BaseScreen";
import * as blessed from "blessed";

export class MainMenuScreen extends BaseScreen {
  private menuList!: Widgets.ListElement;
  private rulesBox?: Widgets.BoxElement;

  constructor(
    parentScreen: Widgets.Screen, 
    private onNewGame: () => void,
    private onQuit: () => void
  ) {
    super(parentScreen);
    this.init();
  }

  public init(): void {
    const container = blessed.box({
      parent: this.parentScreen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '40%',
      tags: true,
      hidden: true
    });

    this.menuList = blessed.list({
      parent: this.parentScreen,
      top: 'center',
      left: 'center',
      width: '30%',
      height: '30%',
      items: ['New Game', 'Continue Game', 'View Rules', 'Quit'],
      style: { selected: { bg: 'white', fg: 'black' } },
      keys: true,
      vi: true,
      hidden: true
    });

    this.menuList.on('select', (_item, index) => {
      switch(index) {
        case 0: // New Game
          this.onNewGame();
          break;
        case 2: // View Rules
          this.showRules();
          break;
        case 3: // Quit
          this.onQuit();
          break;
      }
    });

    this.elements.set('container', container);
    this.elements.set('menuList', this.menuList);
  }

  private showRules(): void {
    // Remove existing rules box if it exists
    this.rulesBox?.destroy();

    this.rulesBox = blessed.box({
      parent: this.parentScreen,
      top: 'center',
      left: 'center',
      width: '70%',
      height: '70%',
      content: `
        DungeonQuest Rules:
        
        - Use WASD keys to move your character (@)
        - Explore the dungeon and find treasures
        - Avoid or fight monsters
        - Press ESC to return to menu
        - Press Q to quit game
      `,
      border: { type: 'line' },
      scrollable: true,
      keys: true,
      vi: true
    });

    this.rulesBox.key(['escape', 'q'], () => {
      if (this.rulesBox) {
        this.rulesBox.destroy();
        this.rulesBox = undefined;
        this.menuList.focus();
      }
      this.parentScreen.render();
    });

    this.rulesBox.focus();
    this.parentScreen.render();
  }

  protected focus(): void {
    this.menuList.focus();
  }
}