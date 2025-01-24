import * as blessed from "blessed";
import { Widgets } from "blessed";
import { EventEmitter } from 'events';

export class ScreenManager extends EventEmitter {
  private screen: Widgets.Screen;
  
  // Menu Components  
  private menuContainer: Widgets.BoxElement;
  private menuList: Widgets.ListElement;
  
  // Game Components
  private gameViewport: Widgets.BoxElement;
  private gameStats: Widgets.BoxElement;

  constructor() {
    super();
    this.screen = blessed.screen({
      smartCSR: true,
      title: "DungeonQuest",
    });

    // Initialize Menu Components
    this.menuContainer = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '40%',
      tags: true,
      hidden: true
    });

    this.menuList = blessed.list({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '30%',
      height: '30%',
      items: [
        'New Game',
        'Continue Game', 
        'View Rules',
        'Quit'
      ],
      style: {
        selected: {
          bg: 'white',
          fg: 'black'
        }
      },
      keys: true,
      vi: true,
      hidden: true
    });

    // Initialize Game Components
    this.gameViewport = blessed.box({
      parent: this.screen,
      left: 0,
      top: 0,
      width: "85%",
      height: "100%",
      tags: true,
      border: { type: "line" },
      hidden: true
    });

    this.gameStats = blessed.box({
      parent: this.screen,
      label: "Stats",
      left: "85%",
      top: 0,
      width: "15%",
      height: "100%",
      tags: true,
      border: { type: "line" },
      hidden: true
    });

    // Menu selection handler
    this.menuList.on('select', (item, index) => {
      switch(index) {
        case 0: // New Game
          this.hideMenu();
          this.showGame();
          this.emit('newGame');
          break;
        case 1: // Continue Game
          this.showError('Save/Load feature not implemented yet');
          break;
        case 2: // View Rules
          this.showRules();
          break;
        case 3: // Quit
          this.screen.destroy();
          process.exit(0);
          break;
      }
    });

    // Show menu initially
    this.showMenu();
  }

  public showMenu(): void {
    this.hideGame();
    this.menuContainer.show();
    this.menuList.show();
    this.menuList.focus();
    this.screen.render();
  }

  public hideMenu(): void {
    this.menuContainer.hide();
    this.menuList.hide();
    this.screen.render();
  }

  public showGame(): void {
    this.gameViewport.show();
    this.gameStats.show();
    this.screen.render();
  }

  public hideGame(): void {
    this.gameViewport.hide();
    this.gameStats.hide();
    this.screen.render();
  }

  public showError(message: string): void {
    const errorBox = blessed.box({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '20%',
      content: message,
      border: { type: 'line' },
      style: { border: { fg: 'red' } }
    });
    
    this.screen.render();
    errorBox.key(['escape', 'enter'], () => {
      errorBox.destroy();
      this.screen.render();
    });
  }

  public showRules(): void {
    const rulesBox = blessed.box({
      parent: this.screen,
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

    rulesBox.key(['escape', 'q'], () => {
      rulesBox.destroy();
      this.screen.render();
    });
    this.screen.render();
  }

  public renderFrame(
    viewportContent: string[][],
    statsContent: string[]
  ): void {
    this.gameViewport.setContent(
      viewportContent.map(row => row.join('')).join('\n')
    );
    this.gameStats.setContent(statsContent.join('\n'));
    this.screen.render();
  }

  public getViewportDimensions() {
    return {
      width: Math.floor(Number(this.screen.width) * 0.85),
      height: Math.floor(Number(this.screen.height))
    };
  }

  public getMainViewportDimensions() {
    const remove = 2;
    return {
      width: Number(this.gameViewport.width) - remove,
      height: Number(this.gameViewport.height) - remove
    };
  }
}
