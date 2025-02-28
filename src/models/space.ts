import Area from './area';
import Commons from '../types/commons';

/**
 * The Space class manages a container of resizable and movable areas
 * It handles mouse events and coordinates interactions between areas
 */
export default class Space {

  // Array of all areas in this space
  private _areas: Area[] = [];

  // HTML container element for this space
  private _container: HTMLElement;

  // Unique identifier for this space
  // @ts-expect-error: id non utilizzato ma mantenuto per futura implementazione
  private _id?: string;

  // Counter for total areas created in this space
  private _totalAreaCreatedInSpace = 0;

  /**
   * Creates a new Space with the given container
   * @param container HTML element that will contain the areas
   */
  constructor(container: HTMLElement) {
    this._container = container;
    this._createSpace();
  }

  /**
   * Removes areas marked as prunable from the space
   */
  public prune(): void {
    this._areas = this._areas.filter(a => !a.getState().prunable);
    console.log('areas ', this._areas);
  }

  /**
   * Creates a new area in this space
   * @returns The newly created area
   */
  public createArea(): Area {
    this._totalAreaCreatedInSpace++;
    const area = new Area(this);
    this._areas.push(area);
    return area;
  }

  /**
   * Returns the total number of areas created in this space
   */
  public getTotalAreas(): number {
    return this._totalAreaCreatedInSpace;
  }

  /**
   * Returns the HTML container element for this space
   */
  public getContainer(): HTMLElement {
    return this._container;
  }

  /**
   * Finds the currently selected area, if any
   * @returns The selected area or undefined if none is selected
   */
  private _findSelectedArea(): Area | undefined {
    return this._areas.find(a => a.getState().isThisAreaSelected);
  }

  /**
   * Sets up event listeners for the space container
   */
  private _createSpace(): void {
    this._container.addEventListener('mousemove', this._mouseMove.bind(this));
    this._container.addEventListener('mousedown', this._mouseDown.bind(this));
    this._container.addEventListener('mouseup', this._mouseUp.bind(this));
  }

  /**
   * Handles mouse move events for the entire space
   * Manages resizing and movement of the selected area
   */
  private async _mouseMove(e: MouseEvent): Promise<void> {
    const area = this._findSelectedArea();
    if (!area) return;

    if (area.getState().isResizing) {
      // Resize mode
      const deltaX = e.clientX - area.getState().startClientX;
      const deltaY = e.clientY - area.getState().startClientY;

      // Horizontal resize
      if (area.getState().position.right) {
        const newWidth = Math.max(Commons.RESIZE_OFFSET * 2, area.getState().startWidth + deltaX);
        area.getStyle().width = newWidth + 'px';
      } else if (area.getState().position.left) {
        const newWidth = Math.max(Commons.RESIZE_OFFSET * 2, area.getState().startWidth - deltaX);
        const newLeft = area.getState().startLeft + area.getState().startWidth - newWidth;
        area.getStyle().width = newWidth + 'px';
        area.getStyle().left = newLeft + 'px';
      }

      // Vertical resize
      if (area.getState().position.bottom) {
        const newHeight = Math.max(Commons.RESIZE_OFFSET * 2, area.getState().startHeight + deltaY);
        area.getStyle().height = newHeight + 'px';
      } else if (area.getState().position.top) {
        const newHeight = Math.max(Commons.RESIZE_OFFSET * 2, area.getState().startHeight - deltaY);
        const newTop = area.getState().startTop + area.getState().startHeight - newHeight;
        area.getStyle().height = newHeight + 'px';
        area.getStyle().top = newTop + 'px';
      }
    } else if (area.getState().enableMovement) {
      // Movement mode
      const newLeft = area.getState().startLeft + (e.clientX - area.getState().startClientX);
      const newTop = area.getState().startTop + (e.clientY - area.getState().startClientY);

      area.getStyle().left = newLeft + 'px';
      area.getStyle().top = newTop + 'px';
    }
  }

  /**
   * Handles mouse down events in the space
   * Sets appropriate resize or movement flags for the selected area
   */
  private _mouseDown(e: MouseEvent): void {
    const area = this._findSelectedArea();
    if (!area) return;

    const state = area.getState();

    if (state.position.left || state.position.right || state.position.top || state.position.bottom) {
      state.isResizing = true;
    } else {
      state.enableMovement = true;
    }

    e.preventDefault();
  }

  /**
   * Handles mouse up events in the space
   * Deselects the current area
   */
  private _mouseUp(): void {
    const area = this._findSelectedArea();
    if (!area) return;

    area.deselect();
  }
}
