import { DrawableSetupOptions } from '../types/area-types';
import Area from './area';
import DrawableAreaState from './drawable-area-state';
import Space, { CreateMode } from './space';
import createDrawableStyles, { DrawableCustomStyle } from '../styles/drawable-area-style';

export default class DrawableArea {

  private _drawable: HTMLDivElement = document.createElement('div');
  private _setupOtions : DrawableSetupOptions = {
    persist: false,
    turnInResizableArea: false,
    customStyle: {}
  }
  private _space : Space
  private _state : DrawableAreaState = new DrawableAreaState();
  private _container : HTMLElement
  private _resizable : Area;
  private _customStyle : any;



  constructor(space: Space, options ?: DrawableSetupOptions) {
    this._customStyle = createDrawableStyles(options.customStyle)
    this._space = space
    this._container = space.getContainer()
    if(options) this._setupOtions = options
    this._state.isActive = true;
    this._space.setCreateMode(CreateMode.drawableArea) // this enable space to create a drawable area !
    this._createNewDrawableDiv();

  }


  
  getSetupOptions(){
    return this._setupOtions;
  }
  getStyle(){
    return this._drawable.style
  }
  getState() {
    return this._state;
  }

  getDrawable(){
    return this._drawable
  }

  getResizable(){
    return this._resizable
  }

  setResizable(val :Area){
    return this._resizable;
  }

  startDraw(){
    // this._space.setCreateMode(CreateMode.drawableArea)
  }

  drawing(){
    const state = this._state
    state.isDrawing = true;

  }

  endDrawing(){
    this._space.setCreateMode(CreateMode.none)
    this._state.isActive = false
    this._state.prunable = true
    this._space.prune();
  }

  _mouseDown(event: MouseEvent) {}

  _createNewDrawableDiv(){

    const drawableStyle = this._customStyle.elements.drawable

    this._drawable.classList.add('drawable');
    this._drawable.classList.add(drawableStyle.class);
    
    this._container.appendChild(this._drawable);

  }



}
