import { Skill, TargetType } from "@/skills/base/Skill";
import type { Entity } from "@/entities/Entity";

export class FireballSkill extends Skill {
  constructor() {
    super(
      "Fireball",
      "Launch a ball of fire",
      30, // power cost
      35, // damage
      TargetType.SINGLE
    );
  }

  use(caster: Entity, target: Entity): void {
    if (Array.isArray(target)) return; // Single target only
    target.takeDamage(this.damage);
    // Could add burn effect later
  }
}