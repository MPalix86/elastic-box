import commons from "./commons";

// Type definitions for Area class
interface AreaState {
  prunable: boolean;
  isThisAreaSelected: boolean;
  enableMovement: boolean;
  isResizing: boolean;
  offsetX: number;
  offsetY: number;
  startClientX: number;
  startClientY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  position: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

// Definizione dell'interfaccia per Space
interface Space {
  getContainer(): HTMLElement;
  getTotalAreas(): number;
  prune(): void;
}

/**
 * Area class represents a resizable and draggable area within a container
 */
export default class Area {
  private _container: HTMLElement;
  private _resizable: HTMLDivElement = document.createElement('div');
  private _areaOptions: HTMLDivElement = document.createElement('div');
  private _deleteButton: HTMLButtonElement = document.createElement('button');
  private _id: string;
  private _space: Space;

  // Internal state of the area, tracks selection, movement, and resize states
  private _state: AreaState = {
    prunable: false,
    isThisAreaSelected: false,
    enableMovement: false,
    isResizing: false,
    offsetX: 0,
    offsetY: 0,
    startClientX: 0,
    startClientY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    position: {
      left: false,
      right: false,
      top: false,
      bottom: false,
    },
  };

  /**
   * Creates a new Area instance
   * @param space The parent Space object that contains this area
   */
  constructor(space: Space) {
    this._container = space.getContainer();
    this._id = `${space.getTotalAreas()}}`;
    this._createNewResizableDiv();
    this._space = space;
    console.log('created area with id', this._id);
  }

  /**
   * Returns the current state of the area
   */
  public getState(): AreaState {
    return this._state;
  }

  public getResizable(): HTMLDivElement {
    return this._resizable;
  }

  public getStyle(): CSSStyleDeclaration {
    return this._resizable.style;
  }

  /**
   * Deselects this area, canceling any active movement or resize operation
   */
  public deselect(): void {
    this._mouseUp();
  }

  /**
   * Creates the resizable div with handle and delete button
   */
  private _createNewResizableDiv(): void {
    this._resizable.classList.add('resizable');

    this._resizable.style.width = '400px';
    this._resizable.style.height = '200px';
    this._resizable.style.top = '0px';
    this._resizable.style.left = '0px';
    this._resizable.style.position = 'absolute';
    this._resizable.style.border = '1px solid #ccc';
    this._resizable.style.backgroundColor = '#f0f0f0';

    // Crea la barra di gestione
    this._areaOptions = document.createElement('div');
    this._areaOptions.textContent = 'Drag';
    this._areaOptions.style.top = '-22px';
    this._areaOptions.style.left = '0';
    this._areaOptions.style.position = 'absolute';
    this._areaOptions.style.backgroundColor = 'red';
    this._areaOptions.style.height = '22px';
    this._areaOptions.style.width = '100px';
    this._areaOptions.style.cursor = 'move';
    this._areaOptions.style.userSelect = 'none';
    this._areaOptions.style.display = 'flex';
    this._areaOptions.style.alignItems = 'center';
    this._areaOptions.style.paddingLeft = '10px';

    this._deleteButton.textContent = 'X';
    this._deleteButton.style.position = 'absolute';
    this._deleteButton.style.right = '2px';
    this._deleteButton.style.top = '0px';
    this._deleteButton.style.width = '20px';
    this._deleteButton.style.height = '20px';
    this._deleteButton.style.backgroundColor = '#ff3333';
    this._deleteButton.style.color = 'white';
    this._deleteButton.style.border = 'none';
    this._deleteButton.style.borderRadius = '3px';
    this._deleteButton.style.cursor = 'pointer';
    this._deleteButton.style.fontSize = '12px';
    this._deleteButton.style.lineHeight = '12px';
    this._deleteButton.style.padding = '0';

    this._areaOptions.appendChild(this._deleteButton);
    this._resizable.appendChild(this._areaOptions);
    this._container.appendChild(this._resizable);

    this._resizable.addEventListener('mousemove', this._mouseMove.bind(this));
    this._resizable.addEventListener('mousedown', this._mouseDown.bind(this));
    this._resizable.addEventListener('mouseup', this._mouseUp.bind(this));
    this._deleteButton.addEventListener('click', this._delete.bind(this));
  }

  /**
   * Handles the deletion of this area
   * Removes event listeners and marks the area as prunable
   */
  private _delete(): void {
    console.log('cliccato');
    this._resizable.removeEventListener('mousemove', this._mouseDown);
    this._resizable.removeEventListener('mouseup', this._mouseUp);
    this._resizable.removeEventListener('mousedown', this._mouseMove);
    this._deleteButton.removeEventListener('click', this._delete);
    this._state.prunable = true;
    this._container.removeChild(this._resizable);
    this._space.prune();
  }

  /**
   * Handles mouse down events on the area
   * Determines if the user is resizing or moving the area
   */
  private _mouseDown(e: MouseEvent): void {
    if (this._state.prunable) return;
    // console.log('mousedonw in area ', this._id);
    this._state.isThisAreaSelected = true;
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
    if (x < commons.RESIZE_OFFSET) this._state.position.left = true;
    else if (x > rect.width - commons.RESIZE_OFFSET) this._state.position.right = true;

    if (y < commons.RESIZE_OFFSET) this._state.position.top = true;
    else if (y > rect.height - commons.RESIZE_OFFSET) this._state.position.bottom = true;

    if (this._state.position.bottom || this._state.position.top || this._state.position.left || this._state.position.right) {
      // Salva i valori iniziali
      this._state.isResizing = true;
      this._state.enableMovement = false; // Corretto dal JS originale
    } else {
      this._state.enableMovement = true;
      this._state.isResizing = false;
    }
  }

  /**
   * Handles mouse move events on the area
   * Updates cursor style based on position near borders
   */
  private _mouseMove(e: MouseEvent): void {
    if (this._state.prunable) return;
    // console.log('mousemove in area ', this._id);
    if (!this._state.isResizing && !this._state.enableMovement) {
      // Reset delle posizioni
      this._resetPosition()
      const rect = this._resizable.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < commons.RESIZE_OFFSET) this._state.position.left = true;
      else if (x > rect.width - commons.RESIZE_OFFSET) this._state.position.right = true;

      if (y < commons.RESIZE_OFFSET) this._state.position.top = true;
      else if (y > rect.height - commons.RESIZE_OFFSET) this._state.position.bottom = true;

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
    this._state.isThisAreaSelected = false;
    this._state.enableMovement = false;
    this._state.isResizing = false;
    this._resizable.style.cursor = commons.cursors.DEFAULT;
    // Corretta l'impostazione dell'isThisAreaSelected (nel JS originale era sbagliata)
    this._state.isThisAreaSelected = false;
  }

  _resetPosition() {
    for (const prop in this._state.position) {
      // @ts-ignore
      this._state.position[prop] = false
    }
  }
}
