export class ScreenManager {
  private readonly SIDE_PANEL_WIDTH = 30;
  private readonly UI_PADDING = 3;

  constructor(private columns: number, private rows: number) {}

  public getViewportDimensions() {
    return {
      width: this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING,
      height: this.rows - 3
    };
  }

  public renderFrame(content: string[][], sidePanel: string[], bottomPanel: string[]): void {
    const lines: string[] = [];
    
    // Combine map and side panel
    for (let i = 0; i < Math.max(content.length, sidePanel.length); i++) {
      const contentLine = content[i]?.join('') || ' '.repeat(this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING);
      const infoLine = sidePanel[i] || ' '.repeat(this.SIDE_PANEL_WIDTH);
      lines.push(`${contentLine} │ ${infoLine}`);
    }

    // Add bottom panel
    lines.push('─'.repeat(this.columns));
    lines.push(...bottomPanel);

    console.clear();
    console.log(lines.join('\n'));
  }
}