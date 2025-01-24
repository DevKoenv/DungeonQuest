import type { Skill } from "@/skills/base/Skill";

export abstract class Entity {
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  skills: Skill[];

  constructor(
    name: string,
    health: number,
    maxHealth: number,
    attackPower: number,
    skills: Skill[]
  ) {
    this.name = name;
    this.health = health;
    this.maxHealth = maxHealth;
    this.attackPower = attackPower;
    this.skills = skills;
  }

  abstract attack(target: Entity): void;

  abstract useSkill(skill: Skill, target: Entity): void;

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}
