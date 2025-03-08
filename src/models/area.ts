import { AreaEvents, BaseAreaEvent } from '../types/area-events';
import commons from '../types/commons';
import { AreaState } from './area-state.js';
import Space from './space';
import createAreaStyle from '../styles/area-style';
import transitions from '../styles/transitions';


/**
 * Area class represents a resizable and draggable area within a container
 */
export default class Area {
  private _container: HTMLElement;
  private _resizable: HTMLDivElement = document.createElement('div');
  private _areaOptions: HTMLDivElement = document.createElement('div');
  private _deleteButton: HTMLButtonElement = document.createElement('button');
  private _confirmButton: HTMLButtonElement = document.createElement('button');
  // @ts-ignore
  private _id: string;
  private _space: Space;
  private _state: AreaState = new AreaState();
  private _eventListeners: Map<AreaEvents | string, Set<(event: BaseAreaEvent) => void>> = new Map();

  private _boundMouseMove: (e: MouseEvent) => void;
  private _boundMouseDown: (e: MouseEvent) => void;
  private _boundMouseUp: (e: MouseEvent) => void;
  private _boundDelete: (e: MouseEvent) => void;
  private _boundConfirm: (e: MouseEvent) => void;

  /**
   * Creates a new Area instance
   * @param space The parent Space object that contains this area
   */
  constructor(space: Space) {
    this._space = space;
    this._container = space.getContainer();
    this._id = `${space.getTotalAreas()}}`;
    this._createNewResizableDiv();
  }

  /**
   * Returns the current state of the area
   */
  getState(): AreaState {
    return this._state;
  }

  getResizable(): HTMLDivElement {
    return this._resizable;
  }

  getStyle(): CSSStyleDeclaration {
    return this._resizable.style;
  }

  /**
   * Deselects this area, canceling any active movement or resize operation
   */
  deselect(): void {
    this._mouseUp();
  }

  /**
   * remove area from space.
   */
  remove() {
    this._delete();
  }

  /**
   * Add event listeners
   */
  on(eventName: AreaEvents | string, callback: (e: BaseAreaEvent) => void) {
    if (!this._eventListeners.has(eventName)) this._eventListeners.set(eventName, new Set());
    const set = this._eventListeners.get(eventName);
    set.add(callback);
    console.log(this._eventListeners);
  }

  /**
   * Remove event listener
   */
  off(eventName: string, callback: (e: BaseAreaEvent) => void) {
    const set = this._eventListeners.get(eventName);
    if (set.delete(callback)) console.log('evento elminato');
  }


  detectElementsUnderArea(precision?: number | 'default', selector ?:string, ) {

    const movableRect = this._resizable.getBoundingClientRect();
    const container = this._container.getBoundingClientRect();
    
    const height = movableRect.height;
    const width = movableRect.width;
  
    
    if (precision == undefined) precision = 0.25;
    else if(precision == 'default') precision = 0.25
    else precision = 1 / Math.abs(precision)

    const testPoints = []
    
    // Add more points for greater accuracy
    for (let i = 0; i <= width; i += width * precision) {
      for(let j = 0; j <= height ; j+= height * precision){
        const x = movableRect.left + i
        const y = movableRect.top  + j

        const relativeX = x - container.left
        const relativeY = y - container.top
        testPoints.push({x:relativeX , y:relativeY})
        
      }
    }
    
    
    // Map to count how many test points are inside each wrapper
    const elementHits = new Map();
    
    // Use elementFromPoint for each test point
    testPoints.forEach(point => {
      // Get the element at the current position
      const element = document.elementFromPoint(point.x, point.y);
      
      if (element) {
        // Find the nearest wrapper by traversing up the DOM
        let searched = null;
        
        if(selector) searched = element.closest(selector)
        else searched = element

        
        // If we found a wrapper, increment the count
        if (searched) {
          const hits = elementHits.get(searched) || 0;
          elementHits.set(searched, hits + 1);
        }
      }
    });
    
    // Convert the map to an array of elements
    const elementsUnder = Array.from(elementHits.entries())
      .filter(([_, hits]) => hits > 0) // Remove elements without hits
      .sort((a, b) => b[1] - a[1]) // Sort by number of hits (highest to lowest)
      .map(([element, hits]) => ({
        element,
        hits,
      }));
    
    return elementsUnder;
  }

  _executeListeners(eventname: AreaEvents, x?: Number, y?: number, width?: number, height?: number, side?: string) {
    const event = this._createEvent(eventname, x, y, width, height, side);
    const listeners = this._eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }

  _getPositionString(val: any): string {
    // Check for null or undefined
    if (!val) return null;

    // Handle corner positions (combinations)
    if (val.top && val.left) return 'top-left';
    if (val.top && val.right) return 'top-right';
    if (val.bottom && val.left) return 'bottom-left';
    if (val.bottom && val.right) return 'bottom-right';

    // Handle single positions
    if (val.left) return 'left';
    if (val.right) return 'right';
    if (val.top) return 'top';
    if (val.bottom) return 'bottom';

    // If no recognized position
    return null;
  }

  // prettier-ignore
  _createEvent(eventName: AreaEvents, x?: Number, y?: number, width?: number, height?: number, side?: string): BaseAreaEvent {
    const event: BaseAreaEvent = {
      type: eventName,
      target: this,
      x: x || this._state.offsetX || null,
      y: y || this._state.offsetY || null,
      width: width || this._state.startWidth || null,
      height: height || this._state.startHeight || null,
      side: side || this._getPositionString(this._state.position)
    }
    return event;
  }

  /**
   * Creates the resizable div with handle and delete button
   */
  private _createNewResizableDiv(): void {
    this._resizable.classList.add('resizable');
    console.log(this._space)
    const customStyle = this._space.getCustomStyle()
    const style = createAreaStyle(customStyle)

    const resizableStyles = style.elements.resizable;
    const areaOptionsStyle =style.elements.areaOptions;
    const deleteButtonStyle = style.elements.deleteButton;
    const confirmButtonStyle = style.elements.confirmButton;

    this._resizable.classList.add(resizableStyles.style);
    this._areaOptions.classList.add(areaOptionsStyle.style);
    this._deleteButton.classList.add(deleteButtonStyle.style);
    this._confirmButton.classList.add(confirmButtonStyle.style);

    this._deleteButton.textContent = deleteButtonStyle.textContent;
    this._confirmButton.textContent = confirmButtonStyle.textContent;

    this._areaOptions.appendChild(this._deleteButton);
    this._areaOptions.appendChild(this._confirmButton);
    this._resizable.appendChild(this._areaOptions);
    this._container.appendChild(this._resizable);

    /**
     * .bind(this) returns a new function with this object bound correctly.
     * Therefore, we need to save the function to unbind it properly in the future.
     */
    this._boundMouseMove = this._mouseMove.bind(this);
    this._boundMouseDown = this._mouseDown.bind(this);
    this._boundMouseUp = this._mouseUp.bind(this);
    this._boundDelete = this._delete.bind(this);
    this._boundConfirm = this._confirm.bind(this);

    // Aggiungi gli event listener usando i riferimenti salvati
    this._resizable.addEventListener('mousemove', this._boundMouseMove);
    this._resizable.addEventListener('mousedown', this._boundMouseDown);
    this._resizable.addEventListener('mouseup', this._boundMouseUp);

    this._areaOptions.addEventListener('mousemove', this._preventAreaOptionTrigger);
    this._areaOptions.addEventListener('mousedown', this._preventAreaOptionTrigger);
    this._areaOptions.addEventListener('mouseup', this._preventAreaOptionTrigger);

    this._deleteButton.addEventListener('click', this._boundDelete);
    this._confirmButton.addEventListener('click', this._boundConfirm);
  }

  _preventAreaOptionTrigger(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Removes all event listeners
   */
  _unboundlisteners() {
    this._resizable.removeEventListener('mousemove', this._boundMouseMove);
    this._resizable.removeEventListener('mouseup', this._boundMouseUp);
    this._resizable.removeEventListener('mousedown', this._boundMouseDown);
    this._deleteButton.removeEventListener('click', this._boundDelete);
    this._confirmButton.removeEventListener('click', this._boundConfirm);
  }
  /**
   * Handles the deletion of this area
   * Removes event listeners and marks the area as prunable
   */
  private _delete() {
    this._unboundlisteners();
    this._state.prunable = true;
    this._resizable.classList.add(transitions.shrinkKeyframe);
  
    // Attendi che l'animazione sia completata prima di rimuovere l'elemento
    this._resizable.addEventListener('animationend', () => {
      this._container.removeChild(this._resizable);
      this._space.prune(); // TODO aggiustre il discorso dei prune
      this._executeListeners(AreaEvents.AfterDelete);
    }, { once: true });
  }

  private _confirm() {

    this._executeListeners(AreaEvents.Confirmed);

    this._resizable.classList.add(transitions.confirmKeyframe);

    // Attendi che l'animazione sia completata prima di rimuovere l'elemento
    this._resizable.addEventListener('animationend', () => {
        this._unboundlisteners();
      this._resizable.removeChild(this._areaOptions);
      this._resizable.style.cursor ='default'
    }, { once: true });
  }

  /**
   * Handles mouse down events on the area
   * Determines if the user is resizing or moving the area
   */
  private _mouseDown(e: MouseEvent): void {
    if (this._state.prunable) return;
    // console.log('mousedonw in area ', this._id);
    this._state.isThisAreaSelected = true;
    this._executeListeners(AreaEvents.Select);

    // Reset delle posizioni
    const rect = this._resizable.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this._state.startClientX = e.clientX;
    this._state.startClientY = e.clientY;
    this._state.startWidth = this._resizable.offsetWidth;
    this._state.startHeight = this._resizable.offsetHeight;
    this._state.startLeft = parseInt(this._resizable.style.left, 10) || 0;
    this._state.startTop = parseInt(this._resizable.style.top, 10) || 0;
    this._state.offsetX = x;
    this._state.offsetY = y;

    // Determina dove è stato il click rispetto ai bordi
    this._state.updatePosition(x, y, rect.width, rect.height, commons.RESIZE_OFFSET);

    if (this._state.position.bottom || this._state.position.top || this._state.position.left || this._state.position.right) {
      // Salva i valori iniziali
      this._state.isResizing = true;
      this._state.enableMovement = false; // Corretto dal JS originale
      this._executeListeners(AreaEvents.ResizeStart);
    } else {
      this._state.enableMovement = true;
      this._state.isResizing = false;
    }

    e.preventDefault();
  }

  /**
   * Handles mouse move events on the area
   * Updates cursor style based on position near borders
   */
  private _mouseMove(e: MouseEvent): void {
    if (this._state.prunable) return;
    if (!this._state.isResizing && !this._state.enableMovement) {
      const rect = this._resizable.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this._state.updatePosition(x, y, rect.width, rect.height, commons.RESIZE_OFFSET);
      commons.updateCursor(this._resizable, this._state);
    }
  }

  /**
   * Handles mouse up events
   * Resets all movement and resize states
   */
  private _mouseUp(): void {
    if (this._state.prunable) return;
    // console.log('mouseup in area ', this._id);
    this._state.reset();
    this._resizable.style.cursor = commons.cursors.DEFAULT;
    this._executeListeners(AreaEvents.Deselect);
  }
}
