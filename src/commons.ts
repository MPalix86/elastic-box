

// Definition of interfaces and types
export interface Position {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface State {
  position: Position;
  [key: string]: any; // Per altre proprietà di state che potrebbero essere necessarie
}

export type CursorType = 'default' | 'pointer' | 'text' | 'wait' | 'help' | 'move' | 'crosshair' | 'not-allowed' | 'none' | 'progress' | 'cell' | 'context-menu' | 'alias' | 'copy' | 'grab' | 'grabbing' | 'zoom-in' | 'zoom-out' | 'col-resize' | 'row-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' | 'n-resize' | 's-resize' | 'e-resize' | 'w-resize' | 'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'vertical-text' | 'all-scroll' | 'no-drop';

export interface Cursors {
  readonly DEFAULT: CursorType;
  readonly POINTER: CursorType;
  readonly TEXT: CursorType;
  readonly WAIT: CursorType;
  readonly HELP: CursorType;
  readonly MOVE: CursorType;
  readonly CROSSHAIR: CursorType;
  readonly NOT_ALLOWED: CursorType;
  readonly NONE: CursorType;
  readonly PROGRESS: CursorType;
  readonly CELL: CursorType;
  readonly CONTEXT_MENU: CursorType;
  readonly ALIAS: CursorType;
  readonly COPY: CursorType;
  readonly GRAB: CursorType;
  readonly GRABBING: CursorType;
  readonly ZOOM_IN: CursorType;
  readonly ZOOM_OUT: CursorType;
  readonly COL_RESIZE: CursorType;
  readonly ROW_RESIZE: CursorType;
  readonly EW_RESIZE: CursorType;
  readonly NS_RESIZE: CursorType;
  readonly NESW_RESIZE: CursorType;
  readonly NWSE_RESIZE: CursorType;
  readonly N_RESIZE: CursorType;
  readonly S_RESIZE: CursorType;
  readonly E_RESIZE: CursorType;
  readonly W_RESIZE: CursorType;
  readonly NE_RESIZE: CursorType;
  readonly NW_RESIZE: CursorType;
  readonly SE_RESIZE: CursorType;
  readonly SW_RESIZE: CursorType;
  readonly VERTICAL_TEXT: CursorType;
  readonly ALL_SCROLL: CursorType;
  readonly NO_DROP: CursorType;
}

// Constants
const RESIZE_OFFSET: number = 10;

// Cursors object with defined types
const cursors: Cursors = Object.freeze({
  DEFAULT: 'default', // Default pointer (arrow)
  POINTER: 'pointer', // Hand for links or clickable elements
  TEXT: 'text', // Selectable text (I-cursor)
  WAIT: 'wait', // Waiting icon (hourglass or circle)
  HELP: 'help', // Question mark for help
  MOVE: 'move', // Crossed arrows for movement
  CROSSHAIR: 'crosshair', // Crosshair/target
  NOT_ALLOWED: 'not-allowed', // Action not allowed (prohibition symbol)
  NONE: 'none', // No cursor
  PROGRESS: 'progress', // Action in progress (but still clickable)
  CELL: 'cell', // Table cell symbol
  CONTEXT_MENU: 'context-menu', // Context menu
  ALIAS: 'alias', // Cursor for alias or shortcut
  COPY: 'copy', // Copy cursor
  GRAB: 'grab', // Grab cursor
  GRABBING: 'grabbing', // Active dragging cursor
  ZOOM_IN: 'zoom-in', // Zoom in cursor
  ZOOM_OUT: 'zoom-out', // Zoom out cursor

  // Resize cursors
  COL_RESIZE: 'col-resize', // Column resize
  ROW_RESIZE: 'row-resize', // Row resize
  EW_RESIZE: 'ew-resize', // Horizontal resize (east-west)
  NS_RESIZE: 'ns-resize', // Vertical resize (north-south)
  NESW_RESIZE: 'nesw-resize', // Diagonal resize ↘
  NWSE_RESIZE: 'nwse-resize', // Diagonal resize ↙
  N_RESIZE: 'n-resize', // Resize northward (up)
  S_RESIZE: 's-resize', // Resize southward (down)
  E_RESIZE: 'e-resize', // Resize eastward (right)
  W_RESIZE: 'w-resize', // Resize westward (left)
  NE_RESIZE: 'ne-resize', // Resize northeast ↗
  NW_RESIZE: 'nw-resize', // Resize northwest ↖
  SE_RESIZE: 'se-resize', // Resize southeast ↘
  SW_RESIZE: 'sw-resize', // Resize southwest ↙

  // Additional cursors
  VERTICAL_TEXT: 'vertical-text', // Vertical text
  ALL_SCROLL: 'all-scroll', // Crossed arrows in all directions
  NO_DROP: 'no-drop', // Drop not allowed
} as Cursors);

/**
 * Waits until a specific condition is satisfied
 * @param condition Function that returns a boolean, the condition to check
 * @param controlRate Interval in ms between checks
 * @param maxSecondToWait Maximum waiting time in ms
 * @param returnConditionSatisfied Value to return if the condition is satisfied
 * @param returnConditionNotSatisfied Value to return if the condition is not satisfied
 * @param callback Optional callback function
 * @returns Promise with the value set based on the result
 */
const waitUntilCondition = <T, U>(condition: () => boolean, controlRate: number, maxSecondToWait: number, returnConditionSatisfied: T = (true as unknown) as T, returnConditionNotSatisfied: U = (false as unknown) as U, callback: () => void = () => {}): Promise<T | U> => {
  return new Promise(resolve => {
    let isResolved = false;
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        isResolved = true;

        resolve(returnConditionSatisfied);
      } else {
      }
    }, controlRate);

    setTimeout(() => {
      if (!isResolved) {
        clearInterval(interval);
        callback();
        resolve(returnConditionNotSatisfied);
      }
    }, maxSecondToWait);
  });
};

/**
 * Updates the cursor based on position
 * @param element HTML element on which to set the cursor
 * @param state State containing position information
 */
const updateCursor = (element: HTMLElement, state: State): void => {
  const { left, right, top, bottom } = state.position;

  // determines cursor type based on position
  if (top && right) {
    element.style.cursor = cursors.NE_RESIZE;
  } else if (top && left) {
    element.style.cursor = cursors.NW_RESIZE;
  } else if (bottom && right) {
    element.style.cursor = cursors.SE_RESIZE;
  } else if (bottom && left) {
    element.style.cursor = cursors.SW_RESIZE;
  } else if (bottom) {
    element.style.cursor = cursors.S_RESIZE;
  } else if (right) {
    element.style.cursor = cursors.E_RESIZE;
  } else if (left) {
    element.style.cursor = cursors.W_RESIZE;
  } else if (top) {
    element.style.cursor = cursors.N_RESIZE;
  } else {
    element.style.cursor = cursors.MOVE;
  }
};



const commons = {
  cursors,
  RESIZE_OFFSET,
  updateCursor,
  waitUntilCondition,
};

export default commons;
