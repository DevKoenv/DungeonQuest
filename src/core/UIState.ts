export type GameState = 'PLAYING' | 'INVENTORY' | 'OPTIONS';

export class UIState {
  private state: GameState = 'PLAYING';

  public setState(state: GameState): void {
    this.state = state;
  }

  public getState(): GameState {
    return this.state;
  }

  public renderSidePanel(): string[] {
    if (this.state === 'INVENTORY') {
      return [
        '=== Inventory ===',
        'No items',
        '',
        'Press I to close'
      ];
    }

    return [
      '=== Player Info ===',
      'Health: 100/100',
      'Level: 1',
      'XP: 0/100'
    ];
  }

  public renderBottomPanel(): string[] {
    if (this.state === 'OPTIONS') {
      return [
        '=== Options ===',
        'No current actions available',
        '',
        'Press O to close'
      ];
    }

    return ['[I] Inventory  [O] Options  [Q] Quit'];
  }
}