export default class DrawableAreaState {

  private _startX: number;
  private _startY: number;
  private _startScreenX: number;
  private _startScreenY: number;
  private _width: number;
  private _height: number;
  private _startClientX: number;
  private _startClientY: number;

  private _top: number;
  private _left: number;
  private _dinstanceFromPointer = 5;
  private _isMouseDown: boolean;
  private _isDrawing: boolean;
  private _prunable = false;
  private _isPersisted = false;
  private _isTurnedInResizable = true;
  private _isActive = false;
  private _isSelected = false;

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    this._isActive = value;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
  }

  get startX(): number {
    return this._startX;
  }

  set startX(value: number) {
    this._startX = value;
  }

  get startY(): number {
    return this._startY;
  }

  set startY(value: number) {
    this._startY = value;
  }

  get startScreenX(): number {
    return this._startScreenX;
  }

  set startScreenX(value: number) {
    this._startScreenX = value;
  }

  get startScreenY(): number {
    return this._startScreenY;
  }

  set startScreenY(value: number) {
    this._startScreenY = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get startClientX(): number {
    return this._startClientX;
  }

  set startClientX(value: number) {
    this._startClientX = value;
  }

  get startClientY(): number {
    return this._startClientY;
  }

  set startClientY(value: number) {
    this._startClientY = value;
  }

  get top(): number {
    return this._top;
  }

  set top(value: number) {
    this._top = value;
  }

  get left(): number {
    return this._left;
  }

  set left(value: number) {
    this._left = value;
  }

  get dinstanceFromPointer(): number {
    return this._dinstanceFromPointer;
  }

  set dinstanceFromPointer(value: number) {
    this._dinstanceFromPointer = value;
  }

  get isMouseDown(): boolean {
    return this._isMouseDown;
  }

  set isMouseDown(value: boolean) {
    this._isMouseDown = value;
  }

  get isDrawing(): boolean {
    return this._isDrawing;
  }

  set isDrawing(value: boolean) {
    this._isDrawing = value;
  }

  get prunable(): boolean {
    return this._prunable;
  }

  set prunable(value: boolean) {
    this._prunable = value;
  }

  get isPersisted(): boolean {
    return this._isPersisted;
  }

  set isPersisted(value: boolean) {
    this._isPersisted = value;
  }

  get isTurnedInResizable(): boolean {
    return this._isTurnedInResizable;
  }

  set isTurnedInResizable(value: boolean) {
    this._isTurnedInResizable = value;
  }
}