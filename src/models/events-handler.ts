import { AreaEvents, BaseAreaEvent, DrawableAreaEvents } from "../types/area-types";
import Area from "./area";
import { AreaState } from "./area-state";
import DrawableArea from "./drawable-area";
import DrawableAreaState from "./drawable-area-state";

export class EventsHandler{

  constructor(){}

  private _eventListeners: Map<AreaEvents | DrawableAreaEvents | string, Set<(event: BaseAreaEvent) => void>> = new Map();

  /**
   * Add event listeners
   */
  on(eventName: DrawableAreaEvents | AreaEvents | string, callback: (e: BaseAreaEvent) => void) {
    if (!this._eventListeners.has(eventName)) this._eventListeners.set(eventName, new Set());
    const set = this._eventListeners.get(eventName);
    set.add(callback);
  }

  /**
   * Remove event listener
   */
  off(eventName: string, callback: (e: BaseAreaEvent) => void) {     
    const set = this._eventListeners.get(eventName);
  }

  getlisteners(){
    return this._eventListeners
  }
  
  
}

export function createEventHandler(){
  return new EventsHandler();
}

  



