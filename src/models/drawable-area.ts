import { BaseAreaEvent, DrawableAreaEvents, DrawableSetupOptions } from '../types/area-types';
import Area from './area';
import DrawableAreaState from './drawable-area-state';
import Space, { CreateMode } from './space';
import createDrawableStyles from '../styles/drawable-area-style';
import { createEventHandler, EventsHandler } from './events-handler';
import { DrawableCustomStyle } from '@__pali__/elastic-box';

export default class DrawableArea {
  private _drawable: HTMLDivElement = document.createElement('div');
  private _setupOtions: DrawableSetupOptions = {
    persist: false,
    turnInResizableArea: false,
  };
  private _space: Space;
  private _state: DrawableAreaState = new DrawableAreaState();
  private _container: HTMLElement;
  private _resizable: Area;
  private _customStyle: any;
  private _eventsHandler: EventsHandler;

  constructor(space: Space, options?: DrawableSetupOptions, customStyle ?: DrawableCustomStyle) {
    const style = customStyle ? customStyle: this._space.getDefaultDrawableCustomStyle()
    if(customStyle) this._customStyle = createDrawableStyles(customStyle);
    else this._customStyle = createDrawableStyles()
    this._space = space;
    this._eventsHandler = createEventHandler()
    this._container = space.getContainer();
    if (options) this._setupOtions = options;
    this._state.isActive = true;
    this._space.setCreateMode(CreateMode.drawableArea); // this enable space to create a drawable area !
    this._createNewDrawableDiv();
  }

  on(event: DrawableAreaEvents | string, callback: (e: BaseAreaEvent) => void) {
    this._eventsHandler.on(event, callback);
  }

  off(event: DrawableAreaEvents | string, callback: (e: BaseAreaEvent) => void) {
    this._eventsHandler.off(event, callback);
  }

  remove(){
    this._container.removeChild(this._drawable)
    this._state.prunable =true;
    this._space.prune();
  }

  getSetupOptions() {
    return this._setupOtions;
  }
  getStyle() {
    return this._drawable.style;
  }
  getState() {
    return this._state;
  }

  getDrawable() {
    return this._drawable;
  }

  getResizable() {
    return this._resizable;
  }

  setResizable(val: Area) {
    return this._resizable = val;
  }

  startDraw() {
    // this._space.setCreateMode(CreateMode.drawableArea)
  }

  drawing() {
    const state = this._state;
    state.isDrawing = true;
  }

  endDrawing() {
    this._space.setCreateMode(CreateMode.none);
    this._state.isActive = false;
    this._state.prunable = true;
    this._space.prune();
  }

  _mouseDown(event: MouseEvent) {}

  _createNewDrawableDiv() {
    const drawableStyle = this._customStyle.elements.drawable;

    this._drawable.classList.add('drawable');
    this._drawable.classList.add(drawableStyle.class);

    this._container.appendChild(this._drawable);
  }

  // prettier-ignore
  _createEvent(eventName: DrawableAreaEvents): BaseAreaEvent {
        const event: BaseAreaEvent = {
          type: eventName,
          target: this,
          x: +this._drawable.style.left.valueOf,
          y: +this._drawable.style.top.valueOf,
          height: +this._drawable.style.height.valueOf,
          width: +this._drawable.style.width.valueOf
        }
        return event;
      }

  _executeListeners(eventname: DrawableAreaEvents) {
    const event = this._createEvent(eventname);
    const allListeners = this._eventsHandler.getlisteners();
    const listeners = allListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }
  }
}
