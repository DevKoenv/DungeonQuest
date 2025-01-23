/**
 * Manages terminal screen rendering and layout
 * Handles viewport calculations, frame buffering, and UI layout
 */
import { cursorTo, clearScreenDown } from "readline";

export class ScreenManager {
  /** Width of the side panel in characters */
  private readonly SIDE_PANEL_WIDTH = 30;
  
  /** Padding between main viewport and side panel */
  private readonly UI_PADDING = 3;
  
  /** Cache of the last rendered frame for change detection */
  private lastRender: string = "";
  
  /** Timestamp of last frame render for frame limiting */
  private lastRenderTime: number = 0;
  
  /** Target frame time in ms (144 FPS) */
  private readonly FRAME_TIME = 1000 / 144;

  /**
   * Initialize screen manager with terminal dimensions
   * Sets up cursor handling and cleanup
   * @param columns - Terminal width in characters
   * @param rows - Terminal height in characters
   */
  constructor(
    private columns: number,
    private rows: number,
  ) {
    // Hide cursor during game rendering
    process.stdout.write("\x1B[?25l");

    // Restore cursor visibility on exit
    process.on("exit", () => {
      process.stdout.write("\x1B[?25h");
    });
  }

  /**
   * Calculate available viewport dimensions
   * Accounts for side panel width and UI padding
   */
  public getViewportDimensions() {
    return {
      width: this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING,
      height: this.rows - 2, // Reserve 2 rows for bottom panel
    };
  }

  /**
   * Render a new frame with main content, side panel and bottom panel
   * Implements frame rate limiting and change detection
   * @param content - 2D array of characters for main viewport
   * @param sidePanel - Array of strings for side panel
   * @param bottomPanel - Array of strings for bottom panel
   */
  public renderFrame(
    content: string[][],
    sidePanel: string[],
    bottomPanel: string[],
  ): void {
    // Skip render if within frame time limit
    const now = Date.now();
    if (now - this.lastRenderTime < this.FRAME_TIME) {
      return;
    }
    this.lastRenderTime = now;

    const lines: string[] = [];

    // Combine main content and side panel
    for (let i = 0; i < Math.max(content.length, sidePanel.length); i++) {
      // Pad content line to full width if missing
      const contentLine =
        content[i]?.join("") ||
        " ".repeat(this.columns - this.SIDE_PANEL_WIDTH - this.UI_PADDING);
      
      // Pad side panel line if missing
      const infoLine = sidePanel[i] || " ".repeat(this.SIDE_PANEL_WIDTH);
      
      // Join with separator
      lines.push(`${contentLine} │ ${infoLine}`);
    }

    // Add separator line and bottom panel
    lines.push("─".repeat(this.columns));
    lines.push(...bottomPanel);

    const frame = lines.join("\n");

    // Skip render if content hasn't changed
    if (frame === this.lastRender) {
      return;
    }

    // Clear screen and render new frame
    cursorTo(process.stdout, 0, 0);
    clearScreenDown(process.stdout);
    process.stdout.write(frame);
    this.lastRender = frame;
  }
}