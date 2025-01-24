import { Skill, TargetType } from "@/skills/base/Skill";
import type { Entity } from "@/entities/Entity";

export class HealSkill extends Skill {
  constructor() {
    super(
      "Heal",
      "Restore health",
      40, // power cost
      25, // healing amount
      TargetType.SELF
    );
  }

  use(caster: Entity, target: Entity): void {
    if (Array.isArray(target)) return; // Single target only
    target.health = Math.min(target.maxHealth, target.health + this.damage);
  }
}