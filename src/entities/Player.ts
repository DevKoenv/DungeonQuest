import { Entity } from "./Entity";
import type { Skill } from "@/skills/base/Skill";
import type { GameClass } from "@/classes/GameClass";
import type { ViewportConfig } from "@/types/ViewportConfig";
// import type { Item } from "@/items/Item";

export class Player extends Entity {
  readonly gameClass: GameClass;
  power: number;
  gold: number;
  inventory: never[]; // Item[]
  experience: number;
  level: number;
  row: number;
  col: number;
  readonly char: string = "@";
  viewport: ViewportConfig;
  
  constructor(
    name: string, 
    gameClass: GameClass,
    startPosition: { row: number; col: number },
    viewport: ViewportConfig
  ) {
    super(
      name,
      gameClass.baseHealth,
      gameClass.baseHealth,
      gameClass.baseAttackPower,
      [...gameClass.baseSkills]
    );
    
    this.gameClass = gameClass;
    this.power = gameClass.basePower;
    this.gold = 0;
    this.inventory = [];
    this.experience = 0;
    this.level = 1;
    this.row = startPosition.row;
    this.col = startPosition.col;
    this.viewport = viewport;
  }

  attack(target: Entity): void {
    target.takeDamage(this.attackPower);
    if (this.gameClass.powerType === "rage") {
      this.power = Math.min(this.power + 10, this.gameClass.maxPower);
    }
  }

  useSkill(skill: Skill, target: Entity): void {
    if (this.power >= skill.powerCost) {
      skill.use(this, target);
      this.power -= skill.powerCost;
    }
  }

  levelUp(): void {
    this.level++;
    this.maxHealth += 10;
    this.health = this.maxHealth;
    this.attackPower += 2;
  }

  gainExperience(amount: number): void {
    this.experience += amount;
    while (this.experience >= this.level * 100) {
      this.experience -= this.level * 100;
      this.levelUp();
    }
  }

  move(direction: "up" | "down" | "left" | "right", map: string[][]): boolean {
    const newPos = {
      row: this.row + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
      col: this.col + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
    };

    if (
      newPos.row >= 0 &&
      newPos.row < map.length &&
      newPos.col >= 0 &&
      newPos.col < map[0].length &&
      (map[newPos.row][newPos.col] === " " || // Empty space
       map[newPos.row][newPos.col] === "F")   // Finish marker
    ) {
      const reachedFinish = map[newPos.row][newPos.col] === "F";
      this.row = newPos.row;
      this.col = newPos.col;
      return !reachedFinish; // Return false when reached finish
    }
    return false;
  }

  getViewportPosition(): { startRow: number; startCol: number; endRow: number; endCol: number } {
    const startRow = Math.max(0, this.row - Math.floor(this.viewport.height / 2));
    const startCol = Math.max(0, this.col - Math.floor(this.viewport.width / 2));
    const endRow = startRow + this.viewport.height;
    const endCol = startCol + this.viewport.width;
    
    return { startRow, startCol, endRow, endCol };
  }
}