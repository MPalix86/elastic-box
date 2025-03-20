import { AreaEvents, BaseAreaEvent, ResizabelSetupOptions } from '../types/area-types';
import commons from '../types/commons';
import { AreaState } from './area-state.js';
import Space from './space';
import { CreateMode } from './space';
import createResizableStyles, { ResizableCustomStyle } from '../styles/resizable-area-style';
import transitions from '../styles/transitions';
import { createEventHandler, EventsHandler } from './events-handler';

/**
 * Area class represents a resizable and draggable area within a container
 */
export default class Area {
  private _resizable: HTMLDivElement = document.createElement('div');
  private _buttonsPanel: HTMLDivElement = document.createElement('div');
  private _deleteButton: HTMLButtonElement = document.createElement('button');
  private _confirmButton: HTMLButtonElement = document.createElement('button');
  private _customStyle: any;
  private _eventHandler: EventsHandler;
  // @ts-ignore
  protected _id: string;
  protected _space: Space;
  protected _state: AreaState = new AreaState();

  private _setupOptions: ResizabelSetupOptions = {
    deleteOnLeave: false,
    showAreaOptions: true,
  };

  protected _container: HTMLElement;

  private _boundMouseMove: (e: MouseEvent) => void;
  private _boundMouseDown: (e: MouseEvent) => void;
  private _boundMouseUp: (e: MouseEvent) => void;
  private _boundDelete: (e: MouseEvent) => void;
  private _boundConfirm: (e: MouseEvent) => void;

  /**
   * Creates a new Area instance
   * @param space The parent Space object that contains this area
   */
  constructor(space: Space, style?: ResizableCustomStyle, setupOptions ?: ResizabelSetupOptions) {
    if(setupOptions) this._setupOptions =  setupOptions
    this._space = space;
    this._eventHandler = createEventHandler();
    if (style) this._customStyle = createResizableStyles(style);
    else this._customStyle = createResizableStyles(this._space.getResizableCustomStyle());
    this._container = space.getContainer();
    this._id = `${space.getTotalAreas()}}`;
    this._space.setCreateMode(CreateMode.resizableArea); // this enable the global listeners on space to listen for resize of area
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

  getSetupOptions() : ResizabelSetupOptions{
    return this._setupOptions;
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
    this._eventHandler.on(eventName, callback);
  }

  /**
   * Remove event listener
   */
  off(eventName: string, callback: (e: BaseAreaEvent) => void) {
    this._eventHandler.off(eventName, callback);
  }

  detectElementsUnderArea(precision?: number | 'default' | 'corner', selector?: string) {
    const movableRect = this._resizable.getBoundingClientRect();
    const container = this._container.getBoundingClientRect();

    const height = movableRect.height;
    const width = movableRect.width;

    // Set precision with proper defaults
    if (precision === undefined || precision === 'default') {
      precision = 0.25;
    } else if (precision === 'corner') {
      precision = -1;
    } else {
      precision = 1 / Math.abs(precision);
    }

    // Add corner points first
    const testPoints = [
      { x: movableRect.left, y: movableRect.top }, // Top-left corner
      { x: movableRect.right, y: movableRect.top }, // Top-right corner
      { x: movableRect.right, y: movableRect.bottom }, // Bottom-right corner
      { x: movableRect.left, y: movableRect.bottom }, // Bottom-left corner
    ];

    if (typeof precision === 'number' && precision > 0) {
      // Calculate the step size based on precision and dimensions
      const stepX = width * precision;
      const stepY = height * precision;

      // Limit the maximum number of points to prevent browser freezing
      const maxPointsPerDimension = 20;
      const actualStepX = Math.max(stepX, width / maxPointsPerDimension);
      const actualStepY = Math.max(stepY, height / maxPointsPerDimension);

      // Add more points for greater accuracy, but with a reasonable limit
      for (let i = 0; i <= width; i += actualStepX) {
        for (let j = 0; j <= height; j += actualStepY) {
          // Skip the very first point (0,0) as it's already in the corners array
          if (i === 0 && j === 0) continue;

          const x = movableRect.left + i;
          const y = movableRect.top + j;

          const relativeX = x - container.left;
          const relativeY = y - container.top;

          testPoints.push({ x: relativeX, y: relativeY });
        }
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

        if (selector) {
          searched = element.closest(selector);
        } else {
          searched = element;
        }

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

  createResizableArea() {
    this._createNewResizableDiv();
  }

  _executeListeners(eventname: AreaEvents) {
    const event = this._createEvent(eventname);
    const listeners = this._eventHandler.getlisteners().get(event.type);
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
  _createEvent(eventName: AreaEvents): BaseAreaEvent {
    const event: BaseAreaEvent = {
      type: eventName,
      target: this,
      x: +this._resizable.style.left,
      y: +this._resizable.style.top,
      width: +this._resizable.style.width,
      height: +this._resizable.style.height,
      side: this._getPositionString(this._state.position)
    }
    return event;
  }

  /**
   * Creates the resizable div with handle and delete button
   */
  private _createNewResizableDiv(): void {
    /**
     * .bind(this) returns a new function with this object bound correctly.
     * Therefore, we need to save the function to unbind it properly in the future.
     */
    this._boundMouseMove = this._mouseMove.bind(this);
    this._boundMouseDown = this._mouseDown.bind(this);
    this._boundMouseUp = this._mouseUp.bind(this);
    this._boundDelete = this._delete.bind(this);
    this._boundConfirm = this._confirm.bind(this);

    this._container.appendChild(this._resizable);

    if (this._setupOptions.showAreaOptions) {
      const areaOptionsStyle = this._customStyle.elements.areaOptions;
      const deleteButtonStyle = this._customStyle.elements.deleteButton;
      const confirmButtonStyle = this._customStyle.elements.confirmButton;

      this._buttonsPanel.classList.add(areaOptionsStyle.class);
      this._deleteButton.classList.add(deleteButtonStyle.class);
      this._confirmButton.classList.add(confirmButtonStyle.class);
      this._deleteButton.textContent = deleteButtonStyle.textContent;
      this._confirmButton.textContent = confirmButtonStyle.textContent;

      this._buttonsPanel.addEventListener('mousemove', this._preventAreaOptionTrigger);
      this._buttonsPanel.addEventListener('mousedown', this._preventAreaOptionTrigger);
      this._buttonsPanel.addEventListener('mouseup', this._preventAreaOptionTrigger);

      this._deleteButton.addEventListener('click', this._boundDelete);
      this._confirmButton.addEventListener('click', this._boundConfirm);

      this._buttonsPanel.appendChild(this._deleteButton);
      this._buttonsPanel.appendChild(this._confirmButton);
      this._resizable.appendChild(this._buttonsPanel);
    }



    const resizableStyles = this._customStyle.elements.resizable;

    this._resizable.classList.add(resizableStyles.class);

    // Aggiungi gli event listener usando i riferimenti salvati
    this._resizable.addEventListener('mousemove', this._boundMouseMove);
    this._resizable.addEventListener('mousedown', this._boundMouseDown);
    this._resizable.addEventListener('mouseup', this._boundMouseUp);

    /**
     * we need to store left and top property directly into the elment style
     * because all next calculation are based on this property!
     */

    const containerScrollLeft = this._container.scrollLeft.valueOf();
    const containerScrollTop = this._container.scrollTop.valueOf();
    const scrollLeft = +resizableStyles.style.left.split(`px`)[0] + containerScrollLeft;
    const scrollTop = +resizableStyles.style.top.split(`px`)[0] + containerScrollTop;

    this._resizable.style.left = scrollLeft + `px`;
    this._resizable.style.top = scrollTop + `px`;

    this._resizable.classList.add('resizable');
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
    this._buttonsPanel.removeEventListener('mousemove', this._preventAreaOptionTrigger)
    this._buttonsPanel.removeEventListener('mousedown', this._preventAreaOptionTrigger)
    this._buttonsPanel.removeEventListener('mouseup', this._preventAreaOptionTrigger)
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
    this._resizable.addEventListener(
      'animationend',
      () => {
        this._container.removeChild(this._resizable);
        this._space.prune(); // TODO aggiustre il discorso dei prune
        this._executeListeners(AreaEvents.AfterDelete);
        this._space.setCreateMode(CreateMode.none);
      },
      { once: true }
    );
  }

  private _confirm() {
    this._executeListeners(AreaEvents.Confirmed);

    this._resizable.classList.add(transitions.confirmKeyframe);

    // Attendi che l'animazione sia completata prima di rimuovere l'elemento
    this._resizable.addEventListener(
      'animationend',
      () => {
        this._unboundlisteners();
        this._resizable.removeChild(this._buttonsPanel);
        this._resizable.style.cursor = 'default';
      },
      { once: true }
    );
  }

  /**
   * Handles mouse down events on the area
   * Determines if the user is resizing or moving the area
   */
  private _mouseDown(e: MouseEvent): void {
    if (this._state.prunable) return;
    // console.log('mousedonw in area ', this._id);
    this._state.isActive = true;
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

    if (this._state.position.isBottomEdge || this._state.position.isTopEdge || this._state.position.isLeftEdge || this._state.position.isRightEdge) {
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
