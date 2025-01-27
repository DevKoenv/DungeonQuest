# Game Flow Acceptance Test

## 1. Rules Display
- Click "View Rules" in main menu
- **Verify**:
  - Rules screen appears
  - Shows WASD movement controls
  - Shows @ as player character
  - Shows F as finish marker
  - Shows ESC/Q to return to menu
  - Shows dungeon exploration instructions
- Press ESC
- **Verify**: Returns to main menu

## 2. Continue Game Option
- Click "Continue Game" in main menu
- **Verify**:
  - Error popup appears
  - Message states "Save/Load feature not implemented yet"
  - Popup closes when pressing Enter or ESC
  - Returns to main menu

## 3. New Game Flow
- Click "New Game" in main menu
- **Verify Initial Dungeon State**:
  - Game screen appears
  - Player character (@) appears on spawn point (S)
  - Limited visibility around player
  - Walls (█) are visible within line of sight
  - Previously seen areas show dots (·) for empty space
  - Cannot see through walls

## 4. Movement and Exploration
- Press W (move up)
- Press A (move left)
- Press S (move down)
- Press D (move right)
- **Verify**:
  - Player moves in correct direction for each key
  - Cannot move through walls
  - Fog of war reveals new areas
  - Previously explored areas show dots
  - Current position always shows clear terrain/walls

## 5. Dungeon Completion
- Explore until finding 'F' marker
- Move onto 'F' marker
- **Verify**:
  - Victory popup appears
  - Shows completion message
  - Returns to main menu when closed

## 6. New Dungeon Generation
- Start new game again
- **Verify**:
  - New dungeon layout is different from previous
  - All basic mechanics still work:
    - Movement
    - Fog of war
    - Wall collision
    - Spawn point (S)
    - Finish point (F)