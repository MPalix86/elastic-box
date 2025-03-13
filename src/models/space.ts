import Area from './area';
import Commons from '../types/commons';
import { AreaEvents, DrawableSetupOptions } from '../types/area-types';
import { ResizableCustomStyle } from '../styles/resizable-area-style';
import DrawableArea from './drawable-area';
import { cloneDeep } from 'lodash';

export enum CreateMode {
  resizableArea = 'resizableArea',
  drawableArea = 'drawableArea',
  none = 'noe',
}

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
  private _id?: string;

  // Counter for total areas created in this space
  private _totalAreaCreatedInSpace = 0;

  private _resizableCustomSyle: ResizableCustomStyle = {};

  private _drawableAreas: DrawableArea[] = [];

  private _createMode: CreateMode;

  /**
   * Creates a new Space with the given container
   * @param container HTML element that will contain the areas
   */
  constructor(container: HTMLElement, resizableCustomStyle: ResizableCustomStyle = {}) {
    this._container = container;
    this._createSpace();
    this._resizableCustomSyle = resizableCustomStyle;
  }

  /**
   * Removes areas marked as prunable from the space
   */
  public prune(): void {
    this._areas = this._areas.filter(a => !a.getState().prunable);
    this._drawableAreas = this._drawableAreas.filter(a => !a.getState().prunable);
    console.log('areas ', this._areas);
  }

  /**
   * Creates a new area in this space
   * @returns The newly created area
   */
  public createResizableArea(customStyle?: ResizableCustomStyle): Area {
    let style: ResizableCustomStyle;
    this._totalAreaCreatedInSpace++;
    if (customStyle) style = customStyle;
    const area = new Area(this, style);
    this._areas.push(area);
    return area;
  }

  public createDrawableArea(options: DrawableSetupOptions): DrawableArea {
    this._totalAreaCreatedInSpace++;
    const drawableArea = new DrawableArea(this, options);
    this._drawableAreas.push(drawableArea);
    return drawableArea;
  }

  public setCreateMode(val: CreateMode) {
    this._createMode = val;
  }

  public getResizableCustomStyle() {
    return this._resizableCustomSyle;
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
  public setDefaultResizableStyle(customStyle: ResizableCustomStyle) {
    this._resizableCustomSyle = customStyle;
  }

  /**
   * Finds the currently selected area, if any
   * @returns The selected area or undefined if none is selected
   */

  // TODO aggiustare la distinzione tra selectedArea e active Area
  // le aree selezionate possono essere n
  //  l'area attiva è una !
  private _findSelectedArea(): Area | undefined {
    return this._areas.find(a => a.getState().isThisAreaSelected);
  }

  /**
   * Finds the currently selected area, if any
   * @returns The selected area or undefined if none is selected
   */
  private _findActivedDrawableArea(): DrawableArea | undefined {
    return this._drawableAreas.find(a => a.getState().isActive);
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
    const mode = this._createMode;
    if (mode == CreateMode.resizableArea) this._resizeAreaMouseMove(e);
    else if (mode == CreateMode.drawableArea) this._drawAreaMouseMove(e);
    return;
  }

  /**
   * Handles mouse down events in the space
   * Sets appropriate resize or movement flags for the selected area
   */
  private _mouseDown(e: MouseEvent): void {
    const mode = this._createMode;
    if (mode == CreateMode.resizableArea) this._resizeAreaMouseDown(e);
    else if (mode == CreateMode.drawableArea) this._drawAreaMouseDown(e);
  }

  /**
   * Handles mouse up events in the space
   * Deselects the current area
   */
  private _mouseUp(e: MouseEvent): void {
    const mode = this._createMode;
    if (mode == CreateMode.resizableArea) this._resizeAreaMouseUp(e);
    else if (mode == CreateMode.drawableArea) this._drawAreamouseUp(e);
  }

  private _resizeAreaMouseMove(e: MouseEvent) {
    const area = this._findSelectedArea();

    if (!area) return;

    const state = area.getState();
    const style = area.getStyle();

    let newWidth = state.startWidth;
    let newHeight = state.startHeight;
    let newLeft = state.offsetX;
    let newTop = state.offsetY;

    if (area.getState().isResizing) {
      area._executeListeners(AreaEvents.Resize);
      // Resize mode
      const deltaX = e.clientX - area.getState().startClientX;
      const deltaY = e.clientY - area.getState().startClientY;
      const position = area.getState().position;

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

      area._executeListeners(AreaEvents.Resize, newLeft, newTop, newWidth, newHeight);
    } else if (state.enableMovement) {
      // Movement mode
      newLeft = state.startLeft + (e.clientX - state.startClientX);
      newTop = state.startTop + (e.clientY - state.startClientY);

      style.left = newLeft + 'px';
      style.top = newTop + 'px';
      area._executeListeners(AreaEvents.Move, newLeft, newTop, newWidth, newHeight);
    }
  }

  private _resizeAreaMouseDown(e: MouseEvent) {
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

  private _resizeAreaMouseUp(e: MouseEvent) {
    const area = this._findSelectedArea();
    if (!area) return;

    area.deselect();
  }
  private _drawAreaMouseDown(e: MouseEvent) {
    const containerRect = this._container.getBoundingClientRect();
    const drawable = this._findActivedDrawableArea();
    if (!drawable) return; // Protezione contro nullable

    const style = drawable.getStyle();
    const state = drawable.getState();
    state.isMouseDown = true;
    drawable.startDraw();

    // Considera lo scroll del contenitore
    const scrollLeft = this._container.scrollLeft || 0;
    const scrollTop = this._container.scrollTop || 0;

    // Calcola le coordinate relative al container con l'offset e compensazione scroll
    const relativeX = e.clientX - containerRect.left - state.dinstanceFromPointer + scrollLeft;
    const relativeY = e.clientY - containerRect.top - state.dinstanceFromPointer + scrollTop;

    // Salva i valori iniziali
    state.startX = relativeX;
    state.startY = relativeY;

    // Salva le coordinate client iniziali
    state.startClientX = e.clientX;
    state.startClientY = e.clientY;

    // Posiziona l'elemento drawable con l'offset
    style.left = `${relativeX}px`;
    style.top = `${relativeY}px`;
    style.width = '0px'; // Inizia con larghezza zero
    style.height = '0px'; // Inizia con altezza zero

    console.log('Drawable area state on mouse down:', state);
  }

  private _drawAreaMouseMove(e: MouseEvent) {
    if (e.button != 0) return;

    const drawable = this._findActivedDrawableArea();
    if (!drawable) return;

    const style = drawable.getStyle();
    const state = drawable.getState();
    if (!state.isMouseDown) return;

    // Usa clientX/Y per coerenza con mouseDown
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Considera gli offset nel calcolo delle dimensioni
    let width = Math.abs(currentX - state.startClientX);
    let height = Math.abs(currentY - state.startClientY);

    // Gestisci il disegno in qualsiasi direzione considerando gli offset
    if (currentX < state.startClientX) {
      style.left = `${state.startX - width}px`;
    } else {
      style.left = `${state.startX}px`;
    }

    if (currentY < state.startClientY) {
      style.top = `${state.startY - height}px`;
    } else {
      style.top = `${state.startY}px`;
    }

    // Aggiorna lo stato e lo stile
    state.width = width;
    state.height = height;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  private _drawAreamouseUp(e: MouseEvent) {
    const drawable = this._findActivedDrawableArea();
    if (!drawable) return;

    const state = drawable.getState();
    if (!state.isMouseDown) return; // Non fare nulla se non era in disegno

    state.isMouseDown = false;
    drawable.endDrawing();

    // Ottieni la posizione e dimensione correnti dallo stile
    const style = drawable.getStyle();
    const left = parseInt(style.left, 10) || state.startX;
    const top = parseInt(style.top, 10) || state.startY;
    const width = parseInt(style.width, 10) || 0;
    const height = parseInt(style.height, 10) || 0;

    // Ignora se troppo piccolo
    if (width < 5 || height < 5) {
      const options = drawable.getSetupOptions();
      if (!options.persist) this._container.removeChild(drawable.getDrawable());
      return;
    }

    const options = drawable.getSetupOptions();
    if (!options.persist) this._container.removeChild(drawable.getDrawable());
    if (options.turnInResizableArea) {
      const resizableStyle = structuredClone(this._resizableCustomSyle);
      resizableStyle.resizable = resizableStyle.resizable || {};
      resizableStyle.resizable.width = `${width}px`;
      resizableStyle.resizable.height = `${height}px`;
      resizableStyle.resizable.left = `${left}px`;
      resizableStyle.resizable.top = `${top}px`;
      const area = this.createResizableArea(resizableStyle);
      drawable.setResizable(area);
    }
  }
}
