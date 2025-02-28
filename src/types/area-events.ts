import Area from "../models/area";

export const enum AreaEvents {
  ResizeStart = 'resize-start',
  Resize = 'resize',
  ResizeEnd = 'resize-end',
  MoveStart = 'move-start',
  Move = 'move',
  MoveEnd = 'move-end',
  Select = 'select',
  Deselect = 'deselect',
  BeforeDelete = 'before-delete',
  AfterDelete = ' after-delete'
}

export interface BaseAreaEvent {
  type: AreaEvents;
  target: Area;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  side?: 'top' | 'bottom' | 'left' | 'right' | null;
}