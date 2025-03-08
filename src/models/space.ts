import Area from './area';
import Commons from '../types/commons';
import { AreaEvents } from '../types/area-events';
import { CustomStyle } from '../styles/area-style';

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

  private _customSyle: CustomStyle  = {}

  /**
   * Creates a new Space with the given container
   * @param container HTML element that will contain the areas
   */
  constructor(container: HTMLElement, customStyle :CustomStyle = {} ) {
    this._container = container;
    this._createSpace();
    this._customSyle = customStyle
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


  public getCustomStyle(){
    return this._customSyle

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
   * set custom style
   */
  public setDefaultStyle(customStyle : CustomStyle){
    this._customSyle = customStyle
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

    const state = area.getState();
    const style = area.getStyle();

    let newWidth = state.startWidth
    let newHeight = state.startHeight
    let newLeft = state.offsetX
    let newTop = state.offsetY

    if (area.getState().isResizing) {
      area._executeListeners(AreaEvents.Resize)
      // Resize mode
      const deltaX = e.clientX - area.getState().startClientX;
      const deltaY = e.clientY - area.getState().startClientY;
      const position = area.getState().position
      
    
      // Horizontal resize
      if (position.right) {
        newWidth = Math.max(Commons.RESIZE_OFFSET * 2, state.startWidth + deltaX);
        style.width = newWidth + 'px';
      } else if (position.left) {
        newWidth = Math.max(Commons.RESIZE_OFFSET * 2, state.startWidth - deltaX);
        newLeft = state.startLeft + state.startWidth - newWidth;
        style.width = newWidth + 'px';
        style.left = newLeft + 'px';
      }
      
      // vertical resize
      if (position.bottom) {
        newHeight = Math.max(Commons.RESIZE_OFFSET * 2, state.startHeight + deltaY);
        style.height = newHeight + 'px';
      } else if (position.top) {
        newHeight = Math.max(Commons.RESIZE_OFFSET * 2, state.startHeight - deltaY);
        newTop = state.startTop + state.startHeight - newHeight;
        style.height = newHeight + 'px';
        style.top = newTop + 'px';
      }

       
      area._executeListeners(AreaEvents.Resize, newLeft, newTop, newWidth, newHeight)

    } else if (state.enableMovement) {
    
      // Movement mode
      newLeft = state.startLeft + (e.clientX - state.startClientX);
      newTop = state.startTop + (e.clientY - state.startClientY);

      style.left = newLeft + 'px';
      style.top = newTop + 'px';
      area._executeListeners(AreaEvents.Move, newLeft, newTop, newWidth, newHeight)
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
