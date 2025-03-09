import Area from '../models/area';
import { DrawableCustomStyle } from '../styles/drawable-area-style';

export const enum AreaEvents {
  ResizeStart = 'resize-start',
  Resize = 'resize',
  ResizeEnd = 'resize-end',
  Move = 'move',
  Select = 'select',
  Deselect = 'deselect',
  BeforeDelete = 'before-delete',
  AfterDelete = 'after-delete',
  Confirmed = 'confirmed',
}

export interface BaseAreaEvent {
  type: AreaEvents;
  target: Area;
  x?: number | Number;
  y?: number;
  width?: number;
  height?: number;
  side?: string;
}


export interface DrawableSetupOptions{
  persist ?: boolean,
  turnInResizableArea ?: boolean,
  customStyle ?: DrawableCustomStyle
  
}