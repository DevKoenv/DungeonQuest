import { Skill, TargetType } from "@/skills/base/Skill";
import type { Entity } from "@/entities/Entity";

export class WhirlwindSkill extends Skill {
  constructor() {
    super(
      "Whirlwind",
      "Spin to hit all enemies",
      50,  // power cost
      20,  // damage
      TargetType.ALL
    );
  }

  use(caster: Entity, targets: Entity | Entity[]): void {
    if (!Array.isArray(targets)) return; // AOE only
    targets.forEach(target => target.takeDamage(this.damage));
  }
}