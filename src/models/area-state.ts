/**
 * Represents the state of an Area
 * Manages selection, movement, and resize states
 */
export class AreaState {
  private _prunable: boolean = false;
  private _isThisAreaSelected: boolean = false;
  private _enableMovement: boolean = false;
  private _isResizing: boolean = false;
  private _offsetX: number = 0;
  private _offsetY: number = 0;
  private _startClientX: number = 0;
  private _startClientY: number = 0;
  private _startWidth: number = 0;
  private _startHeight: number = 0;
  private _startLeft: number = 0;
  private _startTop: number = 0;
  private _position: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  } = {
    left: false,
    right: false,
    top: false,
    bottom: false,
  };

  // Getters
  get prunable(): boolean {
    return this._prunable;
  }

  get isThisAreaSelected(): boolean {
    return this._isThisAreaSelected;
  }

  get enableMovement(): boolean {
    return this._enableMovement;
  }

  get isResizing(): boolean {
    return this._isResizing;
  }

  get offsetX(): number {
    return this._offsetX;
  }

  get offsetY(): number {
    return this._offsetY;
  }

  get startClientX(): number {
    return this._startClientX;
  }

  get startClientY(): number {
    return this._startClientY;
  }

  get startWidth(): number {
    return this._startWidth;
  }

  get startHeight(): number {
    return this._startHeight;
  }

  get startLeft(): number {
    return this._startLeft;
  }

  get startTop(): number {
    return this._startTop;
  }

  get position(): { left: boolean; right: boolean; top: boolean; bottom: boolean } {
    return this._position;
  }

  // Setters
  set prunable(value: boolean) {
    this._prunable = value;
  }

  set isThisAreaSelected(value: boolean) {
    this._isThisAreaSelected = value;
  }

  set enableMovement(value: boolean) {
    this._enableMovement = value;
  }

  set isResizing(value: boolean) {
    this._isResizing = value;
  }

  set offsetX(value: number) {
    this._offsetX = value;
  }

  set offsetY(value: number) {
    this._offsetY = value;
  }

  set startClientX(value: number) {
    this._startClientX = value;
  }

  set startClientY(value: number) {
    this._startClientY = value;
  }

  set startWidth(value: number) {
    this._startWidth = value;
  }

  set startHeight(value: number) {
    this._startHeight = value;
  }

  set startLeft(value: number) {
    this._startLeft = value;
  }

  set startTop(value: number) {
    this._startTop = value;
  }

  /**
   * Resets all the position properties in state object
   */
  resetPosition(): void {
    this._position.left = false;
    this._position.right = false;
    this._position.top = false;
    this._position.bottom = false;
  }

  /**
   * Updates position flags based on mouse coordinates
   * @param x X coordinate relative to the element
   * @param y Y coordinate relative to the element
   * @param width Element width
   * @param height Element height
   * @param resizeOffset Offset from the border to detect resize
   */
  updatePosition(x: number, y: number, width: number, height: number, resizeOffset: number): void {
    this.resetPosition();
    
    if (x < resizeOffset) this._position.left = true;
    else if (x > width - resizeOffset) this._position.right = true;

    if (y < resizeOffset) this._position.top = true;
    else if (y > height - resizeOffset) this._position.bottom = true;
  }

  /**
   * Resets all movement and resize states
   */
  reset(): void {
    this._isThisAreaSelected = false;
    this._enableMovement = false;
    this._isResizing = false;
    this.resetPosition();
  }
}