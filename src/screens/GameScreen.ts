import { Widgets } from "blessed";
import * as blessed from "blessed";
import { BaseScreen } from "@/screens/BaseScreen";
import { Dungeon } from "@/dungeon/Dungeon";
import { DungeonGenerator, type GeneratedDungeon } from "@/dungeon/Generator";
import type { ViewportConfig } from "@/types/ViewportConfig";
import type { Player } from "@/entities/Player";
import type { DungeonState } from "@/types/DungeonState";

export class GameScreen extends BaseScreen {
  private viewport!: Widgets.BoxElement;
  private stats!: Widgets.BoxElement;
  private dungeon!: DungeonState;
  private generatedDungeon!: GeneratedDungeon;

  constructor(parentScreen: Widgets.Screen) {
    super(parentScreen);
    this.init();
  }

  public init(): void {
    this.viewport = blessed.box({
      parent: this.parentScreen,
      left: 0,
      top: 0,
      width: "85%",
      height: "100%",
      tags: true,
      border: { type: "line" },
      hidden: true
    });

    this.stats = blessed.box({
      parent: this.parentScreen,
      label: "Stats", 
      left: "85%",
      top: 0,
      width: "15%",
      height: "100%",
      tags: true,
      border: { type: "line" },
      hidden: true
    });

    this.elements.set('viewport', this.viewport);
    this.elements.set('stats', this.stats);

    // Generate dungeon based on viewport size
    const dimensions = this.getViewportDimensions();
    const generator = new DungeonGenerator({
      maxRoomSize: 15,
      minRoomSize: 7,
      padding: 2,
      rooms: 25,
      rows: 100,
      cols: Math.max(160, dimensions.width * 2),
      viewportWidth: dimensions.width,
      viewportHeight: dimensions.height,
      lineOfSight: true,
    });

    this.generatedDungeon = generator.generate();
  }

  public createDungeon(player: Player): DungeonState {
    this.dungeon = new Dungeon(this.generatedDungeon, player);
    return this.dungeon;
  }

  public getDungeon(): DungeonState {
    return this.dungeon;
  }

  public getGeneratedDungeon(): GeneratedDungeon {
    return this.generatedDungeon;
  }

  public getViewportDimensions() {
    const borderOffset = 2;
    return {
      // width: Math.floor(Number(this.viewport.width) - borderOffset),
      // height: Math.floor(Number(this.viewport.height))
      width: Number(this.viewport.width) - borderOffset,
      height: Number(this.viewport.height)
    };
  }

  public getViewportConfig(): ViewportConfig {
    return {
      width: this.getViewportDimensions().width,
      height: this.getViewportDimensions().height
    };
  }

  protected focus(): void {
    this.viewport.focus();
  }

  public render(viewportContent: string[][], statsContent: string[]): void {
    this.viewport.setContent(viewportContent.map(row => row.join('')).join('\n'));
    this.stats.setContent(statsContent.join('\n'));
    this.parentScreen.render();
  }
}