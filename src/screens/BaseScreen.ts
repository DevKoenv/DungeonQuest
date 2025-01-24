import { Widgets } from "blessed";

export abstract class BaseScreen {
  protected elements: Map<string, Widgets.BoxElement> = new Map();

  constructor(protected parentScreen: Widgets.Screen) {}

  abstract init(): void;
  
  public show(): void {
    this.elements.forEach(element => element.show());
    this.focus();
  }

  public hide(): void {
    this.elements.forEach(element => element.hide());
  }

  protected abstract focus(): void;
}