import type { GeneratedDungeon } from "./Generator";
import type { Player } from "@/entities/Player";
import type { ViewportConfig } from "@/types/ViewportConfig";
import type { DungeonState } from "@/types/DungeonState";

export class Dungeon implements DungeonState {
  private map: string[][];
  private visited: boolean[][];
  private lineOfSightEnabled: boolean;
  private player: Player;
  private viewport: ViewportConfig;

  constructor(generatedDungeon: GeneratedDungeon, player: Player) {
    this.map = generatedDungeon.map;
    this.visited = generatedDungeon.visited;
    this.lineOfSightEnabled = generatedDungeon.config.lineOfSight;
    this.player = player;
    this.viewport = player.viewport;

    // Initialize player position
    this.player.row = generatedDungeon.startPosition.row;
    this.player.col = generatedDungeon.startPosition.col;
  }

  public movePlayer(direction: "up" | "down" | "left" | "right"): boolean {
    const delta = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 }
    };

    const newRow = this.player.row + delta[direction].row;
    const newCol = this.player.col + delta[direction].col;

    if (this.isValidMove(newRow, newCol)) {
      this.player.row = newRow;
      this.player.col = newCol;
      return true;
    }
    return false;
  }

  private isValidMove(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.map.length &&
      col >= 0 &&
      col < this.map[0].length &&
      this.map[row][col] !== "█"
    );
  }

  public toggleLineOfSight(): void {
    this.lineOfSightEnabled = !this.lineOfSightEnabled;
  }

  public getViewport(): string[][] {
    const { width, height } = this.viewport;
    const halfHeight = Math.floor(height / 2);
    const halfWidth = Math.floor(width / 2);

    const startRow = Math.max(0, this.player.row - halfHeight);
    const startCol = Math.max(0, this.player.col - halfWidth);
    const viewportMap = Array(height).fill(0).map(() => Array(width).fill("█"));

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mapRow = startRow + y;
        const mapCol = startCol + x;

        if (mapRow >= 0 && mapRow < this.map.length && 
            mapCol >= 0 && mapCol < this.map[0].length) {
          if (!this.lineOfSightEnabled || this.isVisible(mapRow, mapCol)) {
            viewportMap[y][x] = this.map[mapRow][mapCol];
            this.visited[mapRow][mapCol] = true;
          } else if (this.visited[mapRow][mapCol]) {
            viewportMap[y][x] = this.map[mapRow][mapCol] === "█" ? "█" : "·";
          }
        }
      }
    }

    // Add player at center of viewport
    const playerY = this.player.row - startRow;
    const playerX = this.player.col - startCol;
    if (playerY >= 0 && playerY < height && playerX >= 0 && playerX < width) {
      viewportMap[playerY][playerX] = "@";
    }

    return viewportMap;
  }

  private isVisible(toRow: number, toCol: number): boolean {
    if (!this.lineOfSightEnabled) return true;
    
    const dx = Math.abs(toCol - this.player.col);
    const dy = Math.abs(toRow - this.player.row);
    const sx = this.player.col < toCol ? 1 : -1;
    const sy = this.player.row < toRow ? 1 : -1;
    let err = dx - dy;
    let x = this.player.col;
    let y = this.player.row;

    while (true) {
      if (x === toCol && y === toRow) return true;
      if (this.map[y][x] === "█") return false;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  }

  // Check if player has reached the exit
  public hasPlayerReachedExit(): boolean {
    const playerPos = {
      row: this.player.row,
      col: this.player.col
    };
  
    return this.map[playerPos.row][playerPos.col] === 'F';
  }
}