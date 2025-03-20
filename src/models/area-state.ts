/**
 * Represents the state of an Area
 * Manages selection, movement, and resize states
 */
export class AreaState {
  private _prunable: boolean = false;
  private _isActive: boolean = false;
  private _isConfirmed = false
  private _isDeleted = false
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
  private _left: number;
  private _top: number;
  private _width: number;
  private _height: number;
  private _side: string;

  private _position: {
    isLeftEdge: boolean;
    isRightEdge: boolean;
    isTopEdge: boolean;
    isBottomEdge: boolean;
  } = {
    isLeftEdge: false,
    isRightEdge: false,
    isTopEdge: false,
    isBottomEdge: false,
  };

  // Getters
  get prunable(): boolean {
    return this._prunable;
  }

  get isActive(): boolean {
    return this._isActive;
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

  get left(): number {
    return this._left;
  }

  get top(): number {
    return this._top;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get side(): string {
    return this._side;
  }

  get position(): { isLeftEdge: boolean; isRightEdge: boolean; isTopEdge: boolean; isBottomEdge: boolean } {
    return this._position;
  }

  // Setters
  set prunable(value: boolean) {
    this._prunable = value;
  }

  set isActive(value: boolean) {
    this._isActive = value;
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

  set left(value: number) {
    this._left = value;
  }

  set top(value: number) {
    this._top = value;
  }

  set width(value: number) {
    this._width = value;
  }

  set height(value: number) {
    this._height = value;
  }

  set side(value: string) {
    this._side = value;
  }

  set isDeleted(val:boolean){
    this._isDeleted = val
  }

  get isDeleted(){
    return this._isDeleted
  }

  set isConfirmed(val : boolean){
    this._isConfirmed  = val
  }
  
  get isConfirmed (){
    return this._isConfirmed;
  }

  /**
   * Resets all the position properties in state object
   */
  resetPosition(): void {
    this._position.isLeftEdge = false;
    this._position.isRightEdge = false;
    this._position.isTopEdge = false;
    this._position.isBottomEdge = false;
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

    if (x < resizeOffset) this._position.isLeftEdge = true;
    else if (x > width - resizeOffset) this._position.isRightEdge = true;

    if (y < resizeOffset) this._position.isTopEdge = true;
    else if (y > height - resizeOffset) this._position.isBottomEdge = true;
  }

  /**
   * Resets all movement and resize states
   */
  reset(): void {
    this._isActive = false;
    this._enableMovement = false;
    this._isResizing = false;
    this.resetPosition();
  }
}