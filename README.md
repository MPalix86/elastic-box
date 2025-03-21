# Elastic-Box

Elastic-Box is a JavaScript/TypeScript library for creating dynamic layouts with resizable and movable areas inside a container.

## Installation


```bash
npm install @__pali__/elastic-box
```


## Example Image

![Example Image](https://github.com/MPalix86/elastic-box/raw/main/documentation/elastic-box.gif?raw=true)


## Basic Usage

```typescript
import { Space, Area } from '@__pali__/elastic-box';

// Initialize a space within a container
const container = document.querySelector('#mainDiv');
const space = new Space(container);

// Create a new area within the space
const createNewArea = () => {
  const area = space.createArea();
  
  // Configure event listeners for the area...
  setupAreaListeners(area);
  
  return area;
};

// Add a button to create new areas
const button = document.querySelector('#newDiv');
button.addEventListener('click', () => {
  createNewArea();
});
```

## Customizing Styles

You can customize the appearance of resizable areas by providing a custom style configuration:

```typescript
import { Space, ResizableCustomStyle } from '@__pali__/elastic-box';

const customStyle: ResizableCustomStyle = {
  resizable: {
    backgroundColor: 'transparent',
    border: '2px solid white',
    height: '200px',
    width: '300px',
    minHeight: '100px',
    minWidth: '100px'
  }
};

const space = new Space(container, customStyle);
```

## Creating Different Types of Areas

Elastic-Box supports different types of areas:

### Resizable Areas

```typescript
// Create a standard resizable area
const area = space.createResizableArea();
```

#### Resizable Area Events

Resizable areas emit various events that you can listen to for interaction:

| Event | Description |
|--------|-------------|
| `select` | Emitted when the area is selected |
| `deselect` | Emitted when the area is deselected |
| `before-delete` | Emitted before the area is deleted |
| `after-delete` | Emitted after the area has been deleted |
| `resize-start` | Emitted at the beginning of a resize operation |
| `resize` | Emitted continuously during resizing |
| `resize-end` | Emitted at the end of a resize operation |
| `move` | Emitted during area movement |

All resizable area events return an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `type` | `AreaEvents` | The type of event that was triggered |
| `target` | `Area` | Reference to the Area instance that triggered the event |
| `x` | `number` | X position (optional, available in move and resize events) |
| `y` | `number` | Y position (optional, available in move and resize events) |
| `width` | `number` | Width (optional, available in resize events) |
| `height` | `number` | Height (optional, available in resize events) |
| `side` | `string` | Side being resized (optional, available in resize events) |

#### Element Detection for Resizable Areas

Resizable areas can detect elements underneath them:

```typescript
// Detect elements under a resizable area matching a specific CSS selector
const elements = area.detectElementsUnderArea('default', '.wrapper');
console.log(elements);

// If no selector is specified, it will detect any visible element at the position
// (uses the underlying detectPoint functionality)
const visibleElements = area.detectElementsUnderArea('default');
console.log(visibleElements);
```

### Drawable Areas

```typescript
import { DrawableSetupOptions } from '@__pali__/elastic-box';

const options: DrawableSetupOptions = {
  turnInResizableArea: true,  // Convert to resizable area after drawing
  persist: false  // When true, fixes the drawn area without converting it to resizable
};

// Create an area by drawing it
const drawableArea = space.createDrawableArea(options);
```

You can use either `turnInResizableArea` or `persist`:
- When `turnInResizableArea` is `true`, the drawn area becomes resizable after drawing
- When `persist` is `true`, the drawn area remains fixed in place without becoming resizable
- Both options can be `false` to create a temporary drawable area

> **Note:** Event support for drawable areas is coming soon in future versions.

## Example: Setting Up Resizable Area Event Listeners

```typescript
// Function to set up all available listeners on a resizable area
function setupAreaListeners(area) {
  // Selection events
  area.on('select', e => {
    const selectedArea = e.target as Area;
    const resizableEl = selectedArea.getResizable();
    resizableEl.style.backgroundColor = 'blue';
    console.log('Area selected:', selectedArea);
  });
  
  area.on('deselect', e => {
    const deselectedArea = e.target as Area;
    const resizableEl = deselectedArea.getResizable();
    resizableEl.style.backgroundColor = 'red';
    console.log('Area deselected:', deselectedArea);
  });
  
  // Deletion events
  area.on('before-delete', () => {
    console.log('Before area deletion');
    // You can perform cleanup operations or ask for confirmation
  });
  
  area.on('after-delete', () => {
    console.log('Area successfully deleted');
    // Update UI or perform other post-deletion actions
  });
  
  // Resize events
  area.on('resize-start', (e) => {
    console.log('Resize started', e);
    // e.target contains the area, e.detail may contain resize information
  });
  
  area.on('resize', (e) => {
    console.log('During resize', e);
    // Called continuously during resizing
  });
  
  area.on('resize-end', (e) => {
    console.log('Resize ended', e);
    // Called once when resizing is complete
  });
  
  // Movement events
  area.on('move', (e) => {
    console.log('Area moving', e);
    // Called during area movement
  });
}
```

## Advanced Example

Here's a complete example demonstrating custom styles, drawable areas, and element detection:

```typescript
import {Space, Area, ResizableCustomStyle, DrawableSetupOptions} from '@__pali__/elastic-box';

// Select DOM elements with existence check
const container = document.querySelector('#mainDiv') as HTMLDivElement;
const button = document.querySelector('#newDiv');
const getEls = document.querySelector('#getElements');
const draw = document.querySelector('#newDraw');

// Verify elements exist
if (!container) throw new Error('Container element #mainDiv not found');
if (!button) throw new Error('Button element #newDiv not found');
if (!getEls) throw new Error('Get elements button not found');

// Define custom style
const customStyle: ResizableCustomStyle = {
  resizable: {
    backgroundColor: 'transparent',
    border: '2px solid white',
    height: '200px',
    width: '300px',
    minHeight: '100px',
    minWidth: '100px'
  }
};

// Initialize space with custom style
const space = new Space(container, customStyle);

// Configure drawable area options
const options: DrawableSetupOptions = {
  turnInResizableArea: true,
  persist: false  // When set to true, the area will be fixed after drawing without becoming resizable
};

// Create drawable area on button click
draw.addEventListener('click', () => {
  const area = space.createDrawableArea(options);
});

// Variables for area management
let area: Area;
let select;

// Element detection feature
getEls.addEventListener('click', () => {
  const els = area.detectElementsUnderArea('default', '.wrapper');
  console.log(els);
});

// Create new resizable area on button click
button.addEventListener('click', () => {
  area = space.createResizableArea();
  
  // Setup event handlers
  select = e => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'blue';
  };

  // Set up all event listeners
  area.on('select', select);
  area.on('deselect', e => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'red';
  });
  
  area.on('before-delete', () => {
    console.log('before delete');
  });
  area.on('after-delete', () => {
    console.log('afterdelete');
  });
  
  area.on('resize', e => {
    console.log('resize', e);
  });
  area.on('resize-start', e => {
    console.log('resize-start', e);
  });
  area.on('resize-end', e => {
    console.log('resize-end', e);
  });
  
  area.on('move', e => {
    console.log('move', e);
  });
});
```

## Main Methods

### Space
- `createResizableArea()`: Creates a new resizable area within the space
- `createDrawableArea(options)`: Creates a new area by drawing it with mouse

### Area
- `getResizable()`: Returns the resizable DOM element of the area
- `on(event, callback)`: Adds a listener for the specified event
- `off(event, callback)`: Removes a listener for the specified event (not implemented yet)

### Resizable Area
- `detectElementsUnderArea(mode, selector)`: Detects elements under the resizable area matching the selector. If no selector is specified, it will detect any visible element at that position.

### Drawable Area
Note: Additional methods and events for drawable areas are coming soon in future versions.
