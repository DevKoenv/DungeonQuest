import { cursorTo, clearScreenDown } from 'readline';

export class ScreenManager {
  private readonly SIDE_PANEL_WIDTH = 30;
  private readonly UI_PADDING = 3;
  private lastRender: string = '';
  private lastRenderTime: number = 0;
  private readonly FRAME_TIME = 1000 / 144;

  constructor(private columns: number, private rows: number) {
    // Hide cursor
    process.stdout.write('\x1B[?25l');
    
    // Restore cursor on exit
    process.on('exit', () => {
      process.stdout.write('\x1B[?25h');
    });
  }

  public getViewportDimensions() {
    return {
      width: this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING,
      height: this.rows - 2
    };
  }

  public renderFrame(content: string[][], sidePanel: string[], bottomPanel: string[]): void {
    // Frame limiting
    const now = Date.now();
    if (now - this.lastRenderTime < this.FRAME_TIME) {
      return;
    }
    this.lastRenderTime = now;

    const lines: string[] = [];
    
    // Build frame content
    for (let i = 0; i < Math.max(content.length, sidePanel.length); i++) {
      const contentLine = content[i]?.join('') || ' '.repeat(this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING);
      const infoLine = sidePanel[i] || ' '.repeat(this.SIDE_PANEL_WIDTH);
      lines.push(`${contentLine} │ ${infoLine}`);
    }

    lines.push('─'.repeat(this.columns));
    lines.push(...bottomPanel);

    const frame = lines.join('\n');

    // Only render if content changed
    if (frame === this.lastRender) {
      return;
    }

    // Move cursor to top-left and clear screen
    cursorTo(process.stdout, 0, 0);
    clearScreenDown(process.stdout);

    // Write new frame
    process.stdout.write(frame);
    this.lastRender = frame;
  }
}