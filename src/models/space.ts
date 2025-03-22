import Area from './area';
import Commons from '../types/commons';
import { ResizableCustomStyle } from '../styles/resizable-area-style';
import DrawableArea from './drawable-area';
import { AreaEvents, DrawableAreaEvents, DrawableSetupOptions, ResizableSetupOptions } from '../types/area-types';
import { DrawableCustomStyle } from '../styles/drawable-area-style';

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

  private _drawableCustomStyle: DrawableCustomStyle;

  private _boundedMouseMove:  (e: MouseEvent)=>void
  private _boundedMouseUp:  (e: MouseEvent)=>void
  private _boundedMouseDonw:  (e: MouseEvent)=>void
  private _boundedMouseLeave:  (e: MouseEvent)=>void
  private _boundedPreventDragging: (e: Event)=>void
  

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
    this._drawableAreas = this._drawableAreas.filter(a => !a.getState().prunable);
  }

  /**
   * Creates a new area in this space
   * @returns The newly created area
   */
  public createResizableArea(customStyle?: ResizableCustomStyle, options?: ResizableSetupOptions): Area {
    this._totalAreaCreatedInSpace++;
    const area = new Area(this, customStyle,options);
    this._areas.push(area);
    return area;
  }

  public createDrawableArea(options: DrawableSetupOptions): DrawableArea {
    this._totalAreaCreatedInSpace++;
    const drawableArea = new DrawableArea(this, options, this._drawableCustomStyle);
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

  public getDefaultDrawableCustomStyle() {
    return this._drawableCustomStyle;
  }

  /**
   * set custom style
   */
  public setDefaultDrawablebleStyle(customStyle: DrawableCustomStyle) {
    this._drawableCustomStyle = customStyle;
  }

  public remove(){
    this._container.removeEventListener('mousedown',this._boundedMouseMove)
    this._container.removeEventListener('mousemove',this._boundedMouseMove)
    this._container.removeEventListener('mouseup',this._boundedMouseUp)
    this._container.removeEventListener('mouseleave',this._boundedMouseLeave)
    this._container.removeEventListener('dragstart',this._boundedPreventDragging)
  }


  /**
   * Finds the currently selected area, if any
   * @returns The selected area or undefined if none is selected
   */

  // TODO aggiustare la distinzione tra selectedArea e active Area
  // le aree selezionate possono essere n
  //  l'area attiva è una !
  private _findActiveResizable(): Area | undefined {
    return this._areas.find(a => a.getState().isActive);
  }

  /**
   * Finds the currently selected area, if any
   * @returns The selected area or undefined if none is selected
   */
  private _findActivedDrawable(): DrawableArea | undefined {
    return this._drawableAreas.find(a => a.getState().isActive);
  }

  /**
   * Sets up event listeners for the space container
   */
  private _createSpace(): void {

     this._boundedMouseMove = this._mouseMove.bind(this)
     this._boundedMouseUp=  this._mouseUp.bind(this)
     this._boundedMouseDonw =this._mouseDown.bind(this)   
     this._boundedMouseLeave = this._mouseLeave.bind(this)
     this._boundedPreventDragging = this._preventDragging.bind(this)
  

    this._container.addEventListener('mousemove', this._boundedMouseMove );
    this._container.addEventListener('mousedown',  this._boundedMouseDonw);
    this._container.addEventListener('mouseup',  this._boundedMouseUp);
    this._container.addEventListener('mouseleave' , this._boundedMouseLeave )
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

  private _mouseLeave(e: MouseEvent): void {
    const mode = this._createMode;
    if (mode == CreateMode.drawableArea) this._drawAreaMouseLeave();
    // else if (mode == CreateMode.drawableArea) this._drawAreaMouseDown(e);
  }

  private _resizeAreaMouseMove(e: MouseEvent) {
    const area = this._findActiveResizable();

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
      if (position.isRightEdge) {
        newWidth = Math.max(Commons.RESIZE_OFFSET * 2, state.startWidth + deltaX);
        style.width = newWidth + 'px';
      } else if (position.isLeftEdge) {
        newWidth = Math.max(Commons.RESIZE_OFFSET * 2, state.startWidth - deltaX);
        newLeft = state.startLeft + state.startWidth - newWidth;
        style.width = newWidth + 'px';
        style.left = newLeft + 'px';
      }

      // vertical resize
      if (position.isBottomEdge) {
        newHeight = Math.max(Commons.RESIZE_OFFSET * 2, state.startHeight + deltaY);
        style.height = newHeight + 'px';
      } else if (position.isTopEdge) {
        newHeight = Math.max(Commons.RESIZE_OFFSET * 2, state.startHeight - deltaY);
        newTop = state.startTop + state.startHeight - newHeight;
        style.height = newHeight + 'px';
        style.top = newTop + 'px';
      }

      state.left = newLeft;
      state.top = newTop;
      state.width = newWidth;
      state.height = newHeight;

      area._executeListeners(AreaEvents.Resize);
    } else if (state.enableMovement) {
      // Movement mode
      newLeft = state.startLeft + (e.clientX - state.startClientX);
      newTop = state.startTop + (e.clientY - state.startClientY);

      style.left = newLeft + 'px';
      style.top = newTop + 'px';

      state.left = newLeft;
      state.top = newTop;
      state.width = newWidth;
      state.height = newHeight;
      area._executeListeners(AreaEvents.Move);
    }
  }

  private _resizeAreaMouseDown(e: MouseEvent) {
    const area = this._findActiveResizable();
    if (!area) return;

    const state = area.getState();

    if (state.position.isLeftEdge || state.position.isRightEdge || state.position.isTopEdge || state.position.isBottomEdge) {
      state.isResizing = true;
    } else {
      state.enableMovement = true;
    }

    e.preventDefault();
  }

  private _resizeAreaMouseUp(e: MouseEvent) {
    const area = this._findActiveResizable();
    if (!area) return;

    area.deselect();
  }

  _preventDragging(e: Event){
    e.preventDefault();
    e.stopPropagation()
  }
  // _resizeAreaMouseLeave(){
  //   const resizable = this._findActiveResizable()
  //   const options = resizable.getSetupOptions()
  //   resizable._executeListeners(AreaEvents.AreaLeave)
  //   if(options.deleteOnLeave) resizable.remove()
  // }

  private _drawAreaMouseDown(e: MouseEvent) {
    this._container.addEventListener('dragstart',this._boundedPreventDragging)
    const containerRect = this._container.getBoundingClientRect();
    const drawable = this._findActivedDrawable();
    if (!drawable) return; // Protezione contro nullable

    const style = drawable.getStyle();
    const state = drawable.getState();
    state.isMouseDown = true;
  

    // Considera lo scroll del contenitore
    const scrollLeft = this._container.scrollLeft || 0;
    const scrollTop = this._container.scrollTop || 0;

    // Calcola le coordinate relative al container con l'offset e compensazione scroll
    const relativeX = e.clientX - containerRect.left + scrollLeft;
    const relativeY = e.clientY - containerRect.top + scrollTop

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

    state.left = relativeX;
    state.top = relativeY;
    state.width = 0;
    state.height = 0;

    drawable._executeListeners(DrawableAreaEvents.drawStart);
  }

  private _drawAreaMouseMove(e: MouseEvent) {
    if (e.button != 0) return;

    const drawable = this._findActivedDrawable();
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
    state.left = +state.left.valueOf;
    state.top = +state.top.valueOf;
    drawable._executeListeners(DrawableAreaEvents.drawing);
  }

  private _drawAreamouseUp(e: MouseEvent) {
    this._container.removeEventListener('dragstart',this._boundedPreventDragging)
    const drawable = this._findActivedDrawable();
    if (!drawable) return;

    const state = drawable.getState();
    if (!state.isMouseDown) return; // Non fare nulla se non era in disegno

    state.isMouseDown = false;
    drawable._endDrawing();

    const options = drawable.getSetupOptions();
    if(options.removeOnMouseUp) drawable.remove()
    else state.isPersisted = true;
    
    drawable._executeListeners(DrawableAreaEvents.drawEnd);
  
  }


  _drawAreaMouseLeave(){
    const drawable = this._findActivedDrawable()
    if(! drawable) return
    const options = drawable.getSetupOptions()
    drawable._executeListeners(DrawableAreaEvents.DrawLeave)
    if(options.removeOnMouseLeave) drawable.remove()
    if(options.removeOnMouseLeave) this.setCreateMode(CreateMode.none)
  }
}
