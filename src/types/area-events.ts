import Area from '../models/area';

export const enum AreaEvents {
  ResizeStart = 'resize-start',
  Resize = 'resize',
  ResizeEnd = 'resize-end',
  Move = 'move',
  Select = 'select',
  Deselect = 'deselect',
  BeforeDelete = 'before-delete',
  AfterDelete = 'after-delete',
}

export interface BaseAreaEvent {
  type: AreaEvents;
  target: Area;
  x?: number | Number;
  y?: number;
  width?: number;
  height?: number;
  side?:

    | string;
}
