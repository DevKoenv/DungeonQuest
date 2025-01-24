import { Skill, TargetType } from "@/skills/base/Skill";
import type { Entity } from "@/entities/Entity";

export class SlashSkill extends Skill {
  constructor() {
    super(
      "Slash",
      "A powerful slash attack",
      25, // power cost
      30, // damage
      TargetType.SINGLE
    );
  }

  use(caster: Entity, target: Entity): void {
    if (Array.isArray(target)) return; // Single target only
    target.takeDamage(this.damage);
  }
}
