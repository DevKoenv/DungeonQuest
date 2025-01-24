export interface DungeonState {
  getViewport(): string[][];
  movePlayer(direction: "up" | "down" | "left" | "right"): boolean;
  toggleLineOfSight(): void;
  hasPlayerReachedExit(): boolean;
}