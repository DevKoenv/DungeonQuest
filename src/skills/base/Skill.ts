import type { Entity } from "@/entities/Entity";

export enum TargetType {
  SELF = "Self",
  SINGLE = "Single Enemy",
  ALL = "All Enemies",
}

export abstract class Skill {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly powerCost: number,
    public readonly damage: number,
    public readonly targetType: TargetType
  ) {}

  abstract use(caster: Entity, target: Entity | Entity[]): void;
}
