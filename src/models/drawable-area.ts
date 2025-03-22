import { BaseAreaEvent, DrawableAreaEvents, DrawableSetupOptions, ResizableSetupOptions } from '../types/area-types';
import Area from './area';
import DrawableAreaState from './drawable-area-state';
import Space, { CreateMode } from './space';
import createDrawableStyles, { DrawableCustomStyle } from '../styles/drawable-area-style';
import { createEventHandler, EventsHandler } from './events-handler';
import { ResizableCustomStyle } from '../styles/resizable-area-style';

export default class DrawableArea {
  private _drawable: HTMLDivElement = document.createElement('div');
  private _setupOptions: DrawableSetupOptions = {
    removeOnMouseLeave : true,
    removeOnMouseUp : true
  };
  private _space: Space;
  private _state: DrawableAreaState = new DrawableAreaState();
  private _container: HTMLElement;
  private _resizable: Area;
  private _customStyle: any;
  private _eventsHandler: EventsHandler;

  constructor(space: Space, options?: DrawableSetupOptions, customStyle ?: DrawableCustomStyle) {
    if(customStyle) this._customStyle = createDrawableStyles(customStyle);
    else this._customStyle = createDrawableStyles()
    this._space = space;
    this._eventsHandler = createEventHandler()
    this._container = space.getContainer();
    this._setupOptions = { ...this._setupOptions, ...options };
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
    if(this._container.contains(this._drawable)) this._container.removeChild(this._drawable)
    this._state.prunable =true;
    this._space.prune();
    this._space.setCreateMode(CreateMode.none)
  }

  getSetupOptions() {
    return this._setupOptions;
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


  turnInresizable(customStyle ?: ResizableCustomStyle, options ?: ResizableSetupOptions): Area{
    const left = parseInt(this.getStyle().left);
    const top = parseInt(this.getStyle().top);
    const width = parseInt(this.getStyle().width);
    const height = parseInt(this.getStyle().height);
          // Utilizziamo direttamente la posizione del drawable
      // senza alcuna trasformazione di coordinate
      const resizableStyle = structuredClone(this._space.getResizableCustomStyle());
      resizableStyle.resizable = resizableStyle.resizable || {};
      resizableStyle.resizable.width = `${width}px`;
      resizableStyle.resizable.height = `${height}px`;
      resizableStyle.resizable.left = `${left}px`;
      resizableStyle.resizable.top = `${top}px`;

      let finalStyle : ResizableCustomStyle = resizableStyle
      if(customStyle) finalStyle = {...resizableStyle, ...customStyle}

      // Crea un'area resizable con le stesse coordinate esatte
      const area = this._space.createResizableArea(finalStyle,options);

      // Forza le stesse coordinate anche dopo la creazione per sicurezza
      const resizableElement = area.getResizable();
      if (resizableElement) {
        resizableElement.style.position = 'absolute';
        resizableElement.style.left = `${left}px`;
        resizableElement.style.top = `${top}px`;
        resizableElement.style.width = `${width}px`;
        resizableElement.style.height = `${height}px`;

      }

      this.setResizable(area);
      this._state.isTurnedInResizable = true;

      // Rimuovi il drawable solo dopo aver confermato che il resizable è correttamente posizionato
      this.remove()
      this._executeListeners(DrawableAreaEvents.TurnedInResizable);
      this._space.setCreateMode(CreateMode.resizableArea)
      return this._resizable;
  }
  

   _endDrawing() {
    this._state.isActive = false;
    this._state.prunable = true;
    this._space.prune();
    this._space.setCreateMode(CreateMode.none)
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
