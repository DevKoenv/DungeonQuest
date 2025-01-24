# **1. Game Basics**

- _As a player, I want to start a new game, so I can begin my dungeon adventure._
  - **Acceptance Criteria**: Players are presented with a main menu to start or load a game.
- _As a player, I want to view the rules and instructions, so I understand how to play._
  - **Acceptance Criteria**: The game provides a clear command to display gameplay rules.
- _As a player, I want to save my progress, so I can resume the game later._
  - **Acceptance Criteria**: The game saves progress to a JSON file.

# **2. Classes**

- _As a player, I want to choose between Warrior or Magician, so I can customize my playstyle._
  - **Acceptance Criteria**:
    - **Warrior**: High health, physical attacks, and armor.
    - **Magician**: Low health, magic spells, and mana pool.
- _As a player, I want each class to have unique abilities, so I can use different strategies._
  - **Acceptance Criteria**: Warriors have skills like “Slash” and “Block,” while Magicians have “Fireball” and “Heal.”

# **3. Enemies**

- _As a player, I want to encounter different enemies, so each fight feels unique._
  - **Acceptance Criteria**: At least five enemy types, such as:
    - Goblin (low health, quick attacks)
    - Skeleton (balanced stats)
    - Slime (resilient but slow)
    - Vampire Bat (high dodge chance)
    - Dungeon Boss (challenging end-stage enemy).
- _As a player, I want each enemy to have unique stats and abilities, so battles are dynamic._
  - **Acceptance Criteria**: Enemy stats and skills are defined in the code.

# **4. Shop System**

- _As a player, I want to buy items at the shop before entering the dungeon, so I can prepare for battles._
  - **Acceptance Criteria**: Players can purchase:
    - Health potions.
    - Mana potions.
    - Weapons or gear upgrades.
- _As a player, I want to sell unused items at the shop, so I can earn currency for better gear._
  - **Acceptance Criteria**: Players can sell inventory items for gold.

# **5. Dungeon-Clearing Gameplay**

- _As a player, I want to explore a dungeon with multiple rooms, so I can progress through the game._
  - **Acceptance Criteria**:
    - Rooms are randomly generated.
- _As a player, I want to heal and restock after clearing the dungeon, so I can prepare for the next run._
  - **Acceptance Criteria**: Players return to the shop between dungeon levels.

# **6. Combat and Progression**

- _As a player, I want turn-based combat, so I can strategize my attacks._
  - **Acceptance Criteria**: Combat involves player actions (attack, use skill, flee) and enemy counterattacks.
- _As a player, I want to gain experience from battles, so I can level up my character._
  - **Acceptance Criteria**: Leveling up increases stats and unlocks new abilities.
- _As a player, I want a final challenge in each dungeon, so I can test my skills._
  - **Acceptance Criteria**: Each dungeon ends with a boss fight.
