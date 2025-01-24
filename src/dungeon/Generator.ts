/**
 * Procedural Dungeon Generator
 *
 * Generates roguelike dungeons using:
 * - Random room placement
 * - Minimum spanning tree corridors
 * - Line of sight calculations
 * - Viewport management
 */

/** Cell types that make up the dungeon layout */
enum CellType {
  WALL = "\u2588", // Solid wall block
  EMPTY = "\u00A0", // Empty floor space
  DOT = "\u00b7", // Previously seen empty space
  PLAYER = "@", // Player character
  START = "S", // Starting position
  FINISH = "F", // Exit/finish position
}

/** Configuration options for dungeon generation */
interface DungeonConfig {
  rows?: number; // Total dungeon height
  cols?: number; // Total dungeon width
  maxRoomSize?: number; // Largest possible room dimension
  minRoomSize?: number; // Smallest possible room dimension
  padding?: number; // Space between rooms
  maxAttempts?: number; // Max tries to place rooms
  rooms?: number; // Target number of rooms
  viewportWidth?: number; // Player's view width
  viewportHeight?: number; // Player's view height
  lineOfSight?: boolean; // Enable fog of war
}

/** Room structure */
interface Room {
  h: number; // height
  w: number; // width
  row: number; // top-left row position
  col: number; // top-left column position
}

/** Player data */
interface Player {
  row: number;
  col: number;
  char: string;
}

/** Viewport settings */
interface ViewportConfig {
  width: number;
  height: number;
}

/** Edge between two rooms */
interface Edge {
  room1: Room;
  room2: Room;
  distance: number;
}

/** Complete dungeon state */
export interface DungeonState {
  map: string[][];
  rooms: Room[];
  config: Required<DungeonConfig>;
  player: Player;
  viewport: ViewportConfig;
  getViewport: () => string[][];
  movePlayer: (direction: "up" | "down" | "left" | "right") => boolean;
  getFullMap: () => string[][];
  toggleLineOfSight: () => void;
  visited: boolean[][];
}

/**
 * Main dungeon generator class
 * Uses procedural generation with minimum spanning tree room connections
 */
export class DungeonGenerator {
  private readonly config: Required<DungeonConfig>;
  private map: string[][] = [];
  private rooms: Room[] = [];
  private readonly FONT_ASPECT_RATIO = 2; // Terminal fonts are typically 2:1 (height:width)
  private lineOfSightEnabled: boolean;
  private visited: boolean[][] = []; // Tracks explored cells

  /**
   * Creates a new dungeon generator with specified configuration
   */
  constructor(config: DungeonConfig = {}) {
    this.config = {
      rows: config.rows ?? 100,
      cols: config.cols ?? 160,
      maxRoomSize: config.maxRoomSize ?? 15,
      minRoomSize: config.minRoomSize ?? 7,
      padding: config.padding ?? 2,
      maxAttempts: config.maxAttempts ?? 500,
      rooms: config.rooms ?? 25,
      viewportWidth: config.viewportWidth ?? 40,
      viewportHeight: config.viewportHeight ?? 20,
      lineOfSight: config.lineOfSight ?? true,
    };
    this.lineOfSightEnabled = this.config.lineOfSight;

    // Initialize map in constructor
    this.initializeMap();
  }

  /**
   * Safely sets a cell value in the map with bounds checking
   */
  private setCell(row: number, col: number, value: CellType): boolean {
    if (!this.isInBounds(row, col)) return false;
    if (!this.map[row])
      this.map[row] = Array(this.config.cols).fill(CellType.WALL);
    this.map[row][col] = value;
    return true;
  }

  /**
   * Checks if a room placement is valid
   */
  private isValidRoomPlacement(room: Room): boolean {
    if (
      room.row < 0 ||
      room.col < 0 ||
      room.row + room.h >= this.config.rows ||
      room.col + room.w >= this.config.cols
    ) {
      return false;
    }

    // Check for overlap including padding
    for (let i = room.row - 1; i < room.row + room.h + 1; i++) {
      for (let j = room.col - 1; j < room.col + room.w + 1; j++) {
        if (this.map[i]?.[j] === CellType.EMPTY) return false;
      }
    }
    return true;
  }

  /**
   * Creates a corridor between two points with improved bounds checking
   */
  private createCorridor(
    start: { row: number; col: number },
    end: { row: number; col: number }
  ): void {
    if (!this.map || !this.map.length) {
      this.initializeMap();
    }

    let { row, col } = start;
    const destRow = end.row;
    const destCol = end.col;

    // Validate start and end points
    if (!this.isInBounds(row, col) || !this.isInBounds(destRow, destCol)) {
      return;
    }

    while (row !== destRow || col !== destCol) {
      // Move row first, then column
      if (row !== destRow) {
        row += row < destRow ? 1 : -1;
      } else if (col !== destCol) {
        col += col < destCol ? 1 : -1;
      }

      // Use safe cell setting method
      this.setCell(row, col, CellType.EMPTY);
      this.setCell(row, col + 1, CellType.EMPTY);
    }
  }

  /**
   * Checks if coordinates are within map bounds
   */
  private isInBounds(row: number, col: number): boolean {
    return (
      row >= 0 && row < this.config.rows && col >= 0 && col < this.config.cols
    );
  }

  /**
   * Generates a random room with square dimensions
   */
  private generateRoom(): Room | undefined {
    for (let i = 0; i < 10; i++) {
      // Generate base size first
      const baseSize = this.randomEven(
        this.config.minRoomSize,
        this.config.maxRoomSize
      );

      // Generate height normally
      const h = this.randomEven(
        Math.max(baseSize - 2, this.config.minRoomSize),
        Math.min(baseSize + 2, this.config.maxRoomSize)
      );

      // Double width to compensate for font aspect ratio
      const w = this.randomEven(
        Math.max(baseSize * 2 - 2, this.config.minRoomSize * 2),
        Math.min(baseSize * 2 + 2, this.config.maxRoomSize * 2)
      );

      // Aspect ratio check considering font metrics
      const visualRatio = w / this.FONT_ASPECT_RATIO / h;
      if (Math.abs(visualRatio - 1) > 0.2) continue;

      const room: Room = {
        h,
        w,
        row: this.randomEven(
          this.config.padding,
          this.config.rows - h - this.config.padding
        ),
        col: this.randomEven(
          this.config.padding,
          this.config.cols - w - this.config.padding
        ),
      };

      if (this.isValidRoomPlacement(room)) {
        this.carveRoom(room);
        return room;
      }
    }
    return undefined;
  }

  /**
   * Carves out a room in the map
   */
  private carveRoom(room: Room): void {
    for (let i = room.row; i < room.row + room.h; i++) {
      for (let j = room.col; j < room.col + room.w; j++) {
        this.map[i][j] = CellType.EMPTY;
      }
    }
  }

  /**
   * Generates a random even number between min and max
   */
  private randomEven(min: number, max: number): number {
    return min + Math.floor(Math.random() * Math.floor((max - min) / 2)) * 2;
  }

  /**
   * Calculates distance between rooms
   */
  private distanceBetweenRooms(a: Room, b: Room): number {
    const centerA = { row: a.row + a.h / 2, col: a.col + a.w / 2 };
    const centerB = { row: b.row + b.h / 2, col: b.col + b.w / 2 };
    return Math.sqrt(
      Math.pow(centerB.row - centerA.row, 2) +
        Math.pow(centerB.col - centerA.col, 2)
    );
  }

  /**
   * Generates a complete dungeon using the following steps:
   * 1. Place random rooms
   * 2. Connect rooms with minimum spanning tree
   * 3. Setup player and viewport
   * 4. Initialize fog of war
   */
  public generate(): DungeonState {
    // Initialize empty map
    this.initializeMap();

    // Generate rooms
    for (
      let i = 0;
      i < this.config.maxAttempts && this.rooms.length < this.config.rooms;
      i++
    ) {
      const room = this.generateRoom();
      if (room) this.rooms.push(room);
    }

    // Create all possible edges between rooms
    const edges: Edge[] = [];
    for (let i = 0; i < this.rooms.length; i++) {
      for (let j = i + 1; j < this.rooms.length; j++) {
        edges.push({
          room1: this.rooms[i],
          room2: this.rooms[j],
          distance: this.distanceBetweenRooms(this.rooms[i], this.rooms[j]),
        });
      }
    }

    // Sort edges by distance
    edges.sort((a, b) => a.distance - b.distance);

    // Track connected rooms
    const connected = new Set<Room>();
    connected.add(this.rooms[0]);

    // Connect rooms using minimum spanning tree
    while (connected.size < this.rooms.length) {
      // Find the shortest edge that connects a connected room to an unconnected one
      const edge = edges.find(
        (e) =>
          (connected.has(e.room1) && !connected.has(e.room2)) ||
          (connected.has(e.room2) && !connected.has(e.room1))
      );

      if (!edge) break;

      // Create corridor between rooms
      const room1Center = {
        row: edge.room1.row + Math.floor(edge.room1.h / 2),
        col: edge.room1.col + Math.floor(edge.room1.w / 2),
      };
      const room2Center = {
        row: edge.room2.row + Math.floor(edge.room2.h / 2),
        col: edge.room2.col + Math.floor(edge.room2.w / 2),
      };

      this.createCorridor(room1Center, room2Center);
      connected.add(edge.room1);
      connected.add(edge.room2);
    }

    // Setup start and finish positions
    const startRoom = this.rooms[0];
    const finishRoom = this.rooms[this.rooms.length - 1];

    // Place start marker
    const startPos = {
      row: startRoom.row + Math.floor(startRoom.h / 2),
      col: startRoom.col + Math.floor(startRoom.w / 2),
    };
    this.map[startPos.row][startPos.col] = CellType.START;

    // Place finish marker in last room
    const finishPos = {
      row: finishRoom.row + Math.floor(finishRoom.h / 2),
      col: finishRoom.col + Math.floor(finishRoom.w / 2),
    };
    this.map[finishPos.row][finishPos.col] = CellType.FINISH;

    // Initialize player at start position
    const player: Player = {
      row: startPos.row,
      col: startPos.col,
      char: CellType.PLAYER,
    };

    const viewport: ViewportConfig = {
      width: this.config.viewportWidth,
      height: this.config.viewportHeight,
    };

    return {
      map: this.map,
      rooms: this.rooms,
      config: this.config,
      player,
      viewport,
      visited: this.visited,
      getViewport: this.createViewportGetter(player, viewport),
      movePlayer: this.createMoveFunction(player),
      getFullMap: () => {
        const fullMap = this.map.map((row) => [...row]);
        fullMap[player.row][player.col] = player.char;
        return fullMap;
      },
      toggleLineOfSight: () => {
        this.lineOfSightEnabled = !this.lineOfSightEnabled;
      },
    };
  }

  /**
   * Initializes the map with walls
   */
  private initializeMap(): void {
    this.map = Array(this.config.rows)
      .fill(null)
      .map(() => Array(this.config.cols).fill(CellType.WALL));

    this.visited = Array(this.config.rows)
      .fill(null)
      .map(() => Array(this.config.cols).fill(false));
  }

  /**
   * Determines if a point is visible from player position using ray casting
   */
  private isVisible(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean {
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    const sx = fromCol < toCol ? 1 : -1;
    const sy = fromRow < toRow ? 1 : -1;
    let err = dx - dy;

    let x = fromCol;
    let y = fromRow;

    while (true) {
      if (x === toCol && y === toRow) return true;
      if (this.map[y][x] === CellType.WALL) return false;

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

  /**
   * Creates the viewport getter function with line of sight
   */
  private createViewportGetter(player: Player, viewport: ViewportConfig) {
    return () => {
      // Center viewport on player
      const startRow = Math.max(
        0,
        player.row - Math.floor(viewport.height / 2)
      );
      const startCol = Math.max(0, player.col - Math.floor(viewport.width / 2));
      const endRow = Math.min(this.config.rows, startRow + viewport.height);
      const endCol = Math.min(this.config.cols, startCol + viewport.width);

      // Create full-size viewport filled with walls
      const view = Array(viewport.height)
        .fill(null)
        .map(() => Array(viewport.width).fill(CellType.WALL));

      // Calculate offsets if map edge is reached
      const offsetX = Math.max(0, Math.floor(viewport.width / 2) - player.col);
      const offsetY = Math.max(0, Math.floor(viewport.height / 2) - player.row);

      // Update visited cells and render viewport
      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const viewY = row - startRow + offsetY;
          const viewX = col - startCol + offsetX;

          if (
            viewY >= 0 &&
            viewY < viewport.height &&
            viewX >= 0 &&
            viewX < viewport.width
          ) {
            const isCurrentlyVisible =
              !this.lineOfSightEnabled ||
              this.isVisible(player.row, player.col, row, col);

            if (isCurrentlyVisible) {
              this.visited[row][col] = true;
              view[viewY][viewX] = this.map[row][col];
            } else if (this.visited[row][col]) {
              view[viewY][viewX] =
                this.map[row][col] === CellType.WALL
                  ? CellType.WALL
                  : CellType.DOT;
            }
          }
        }
      }

      // Add player
      const playerViewY = Math.floor(viewport.height / 2);
      const playerViewX = Math.floor(viewport.width / 2);
      view[playerViewY][playerViewX] = CellType.PLAYER;

      return view;
    };
  }

  /**
   * Creates the player movement function
   */
  private createMoveFunction(player: Player) {
    return (direction: "up" | "down" | "left" | "right"): boolean => {
      const newPos = {
        row:
          player.row + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
        col:
          player.col +
          (direction === "right" ? 1 : direction === "left" ? -1 : 0),
      };

      if (
        newPos.row >= 0 &&
        newPos.row < this.config.rows &&
        newPos.col >= 0 &&
        newPos.col < this.config.cols &&
        (this.map[newPos.row][newPos.col] === CellType.EMPTY ||
          this.map[newPos.row][newPos.col] === CellType.FINISH)
      ) {
        const reachedFinish =
          this.map[newPos.row][newPos.col] === CellType.FINISH;
        player.row = newPos.row;
        player.col = newPos.col;

        return reachedFinish ? false : true; // Return false to indicate level complete
      }
      return false;
    };
  }
}

/*
// Example usage:
const generator = new DungeonGenerator({
  maxRoomSize: 15,
  minRoomSize: 7,
  padding: 2,
  rooms: 25,
  rows: 100,
  cols: 160,
  viewportWidth: 40,
  viewportHeight: 20,
  lineOfSight: true
});

const dungeon = generator.generate();

// Display full map with player
console.log('Full map with player:\n');
console.log(dungeon.getFullMap().map(row => row.join('')).join('\n'));
console.log('\n----------------------------------\n');

// Display player viewport
console.log('Player viewport:\n');
console.log(dungeon.getViewport().map(row => row.join('')).join('\n'));
console.log('\n----------------------------------\n');

// Toggle line of sight
dungeon.toggleLineOfSight();
console.log('Line of sight disabled:\n');
console.log(dungeon.getViewport().map(row => row.join('')).join('\n'));
*/
