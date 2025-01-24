import { TargetType } from "@/skills/base/Skill";
import { SlashSkill } from "@/skills/combat/SlashSkill";
import { FireballSkill } from "@/skills/combat/FireballSkill";
import { HealSkill } from "@/skills/healing/HealSkill";
import type { Skill } from "@/skills/base/Skill";
import { WhirlwindSkill } from "@/skills/combat/WhirlwindSkill";

export interface GameClass {
  name: string;
  baseHealth: number;
  baseAttackPower: number;
  basePower: number;
  maxPower: number;
  baseSkills: Skill[];
  powerType: "mana" | "rage";
}

const WARRIOR_SKILLS = [
  new SlashSkill(),
  new WhirlwindSkill()
];

const MAGICIAN_SKILLS = [
  new FireballSkill(),
  new HealSkill()
];

export class Warrior implements GameClass {
  name = "Warrior";
  baseHealth = 100;
  baseAttackPower = 15;
  basePower = 0;
  maxPower = 100;
  baseSkills = WARRIOR_SKILLS;
  powerType = "rage" as const;
}

export class Magician implements GameClass {
  name = "Magician";
  baseHealth = 70;
  baseAttackPower = 8;
  basePower = 100;
  maxPower = 100;
  baseSkills = MAGICIAN_SKILLS;
  powerType = "mana" as const;
}