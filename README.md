# Elastic-Box

Elastic-Box is a JavaScript/TypeScript library for creating dynamic layouts with resizable and drawable areas inside a container

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

// Create a new resizable area within the space
const createNewArea = () => {
  const area = space.createResizableArea();
  
  // Configure event listeners for the area
  setupAreaListeners(area);
  
  return area;
};

// Add a button to create new areas
const button = document.querySelector('#createResizable');
button.addEventListener('click', () => {
  createNewArea();
});
```

## Core Components

### Space

The `Space` class is the main container that manages all areas. It handles global mouse events and coordinates interactions between areas.

```typescript
// Create a space in your container element
const container = document.querySelector('#container');
const space = new Space(container);

// Configure default styles for resizable areas
space.setDefaultResizableStyle({
  resizable: {
    backgroundColor: 'rgba(105, 110, 255, 0.5)',
    border: '2px solid white',
    height: '200px',
    width: '300px'
  }
});

// Configure default styles for drawable areas
space.setDefaultDrawablebleStyle({
  drawable: {
    backgroundColor: 'black'
  }
});

// Create areas
const resizableArea = space.createResizableArea();
const drawableArea = space.createDrawableArea({
  removeOnMouseUp: false,
  removeOnMouseLeave: true
});
```

### Area

The `Area` class represents a resizable and draggable area within a container.

```typescript
// Create through the space
const area = space.createResizableArea();

// Listen for events
area.on('resize', (event) => {
  console.log(`Area resized to ${event.width}x${event.height}`);
});

// Fix the area (prevents further resizing/moving)
area.fix();

// Delete the area
area.remove();
```

### DrawableArea

The `DrawableArea` class allows users to draw areas by clicking and dragging.

```typescript
const drawableArea = space.createDrawableArea({
  removeOnMouseLeave: true,
  removeOnMouseUp: true
});

drawableArea.on('draw-end', () => {
  console.log('Drawing completed');
  
  // Convert to a resizable area
  const resizableArea = drawableArea.turnInresizable();
});
```

## Customizing Styles

You can customize the appearance of areas by providing style configurations:

### Resizable Area Styling

```typescript
import { Space, ResizableCustomStyle } from '@__pali__/elastic-box';

const customStyle: ResizableCustomStyle = {
  resizable: {
    backgroundColor: 'rgba(255, 99, 71, 0.5)',
    border: '2px dashed #333',
    height: '150px',
    width: '250px',
    minHeight: '80px',
    minWidth: '80px'
  },
  areaOptions: {
    position: 'horizontal' // or 'vertical'
  },
  deleteButton: {
    textContent: '×'
  },
  confirmButton: {
    textContent: '✓'
  }
};

const area = space.createResizableArea(customStyle);
```

### Drawable Area Styling

```typescript
import { Space, DrawableCustomStyle } from '@__pali__/elastic-box';

const drawableStyle: DrawableCustomStyle = {
  drawable: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px dotted white'
  }
};

space.setDefaultDrawablebleStyle(drawableStyle);
```

## Events

### Area Events

Resizable areas emit various events that you can listen to:

| Event | Description |
|--------|-------------|
| `select` | Emitted when the area is selected |
| `deselect` | Emitted when the area is deselected |
| `deleted` | Emitted when the area is deleted |
| `confirmed` | Emitted when the confirm button is clicked |
| `resize-start` | Emitted at the beginning of a resize operation |
| `resize` | Emitted continuously during resizing |
| `move` | Emitted during area movement |
| `area-leave` | Emitted when mouse leaves the area |

Example of setting up event listeners:

```typescript
// Function to set up listeners on a resizable area
function setupAreaListeners(area) {
  // Selection events
  area.on('select', e => {
    const selectedArea = e.target;
    const resizableEl = selectedArea.getResizable();
    resizableEl.style.backgroundColor = 'blue';
    console.log('Area selected:', selectedArea);
  });
  
  area.on('deselect', e => {
    const deselectedArea = e.target;
    const resizableEl = deselectedArea.getResizable();
    resizableEl.style.backgroundColor = 'red';
    console.log('Area deselected:', deselectedArea);
  });
  
  // Deletion event
  area.on('deleted', () => {
    console.log('Area deleted');
  });
  
  // Confirmation event
  area.on('confirmed', async () => {
    console.log('Area confirmed');
    await area.animateBlink();
    area.fix();
  });
  
  // Resize events
  area.on('resize-start', (e) => {
    console.log('Resize started', e);
  });
  
  area.on('resize', (e) => {
    console.log('During resize', e);
    console.log(`New dimensions: ${e.width}x${e.height}`);
  });
  
  // Movement event
  area.on('move', (e) => {
    console.log('Area moving', e);
    console.log(`New position: ${e.x},${e.y}`);
  });
}
```

All area events return an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `type` | `AreaEvents` | The type of event that was triggered |
| `target` | `Area` | Reference to the Area instance that triggered the event |
| `x` | `number` | X position (available in move events) |
| `y` | `number` | Y position (available in move events) |
| `width` | `number` | Width (available in resize events) |
| `height` | `number` | Height (available in resize events) |
| `side` | `string` | Side being resized (available in resize events) |

### DrawableArea Events

Drawable areas emit the following events:

| Event | Description |
|--------|-------------|
| `draw-start` | Emitted when drawing begins |
| `drawing` | Emitted continuously during drawing |
| `draw-end` | Emitted when drawing ends |
| `turned-in-resizable` | Emitted when converted to a resizable area |
| `draw-leave` | Emitted when mouse leaves the container during drawing |

```typescript
const drawableArea = space.createDrawableArea(options);

drawableArea.on('draw-start', (e) => {
  console.log('Drawing started at', e.x, e.y);
});

drawableArea.on('drawing', (e) => {
  console.log(`Current dimensions: ${e.width}x${e.height}`);
});

drawableArea.on('draw-end', (e) => {
  console.log('Drawing completed');
});

drawableArea.on('turned-in-resizable', (e) => {
  console.log('Converted to resizable area');
});
```

## Configuration Options

### DrawableSetupOptions

```typescript
interface DrawableSetupOptions {
  removeOnMouseUp?: boolean;    // Remove drawable when mouse is released
  removeOnMouseLeave?: boolean; // Remove drawable when mouse leaves container
}
```

### ResizableSetupOptions

```typescript
interface ResizableSetupOptions {
  showAreaOptions?: boolean;    // Whether to show delete/confirm buttons
}
```

## Advanced Features

### Element Detection

Resizable areas can detect elements underneath them:

```typescript
// Detect elements under a resizable area
// precision can be: 'default', 'corner', or a number
const elementsUnder = area.detectElementsUnderArea('corner', 'div.content');
console.log(elementsUnder); // Array of elements with hit counts

// If no selector is specified, it will detect any visible element
const visibleElements = area.detectElementsUnderArea('default');
console.log(visibleElements);
```

### Animations

Apply built-in animations to areas:

```typescript
// Blink animation for confirmation
await area.animateBlink();

// Shake animation for errors or invalid states
await area.animateShake();
```

### Fixed Areas

Lock an area to prevent further modification:

```typescript
area.fix(); // Locks the area, removing resize/move capabilities and buttons
```

## Complete Example

Here's a comprehensive example demonstrating the main features:

```typescript
import { 
  Space, 
  Area, 
  DrawableArea, 
  ResizableCustomStyle, 
  DrawableSetupOptions, 
  AreaEvents, 
  DrawableAreaEvents 
} from '@__pali__/elastic-box';

class ElasticBoxDemo {
  private container: HTMLDivElement;
  private space: Space;
  private resizableAreas: Area[] = [];
  
  constructor() {
    // Initialize container
    this.container = document.querySelector('#mainDiv') as HTMLDivElement;
    if (!this.container) throw new Error('Container element #mainDiv not found');
    
    // Create buttons
    const createResizableBtn = document.querySelector('#createResizable') as HTMLButtonElement;
    const createDrawableBtn = document.querySelector('#createDrawable') as HTMLButtonElement;
    const detectElementsBtn = document.querySelector('#getElements') as HTMLButtonElement;
    
    // Initialize space with custom styles
    this.space = new Space(this.container);
    this.space.setDefaultResizableStyle({
      resizable: {
        backgroundColor: 'rgba(105, 110, 255, 0.5)',
        border: '2px solid white',
        height: '200px',
        width: '300px'
      },
      areaOptions: {
        position: 'vertical'
      }
    });
    
    this.space.setDefaultDrawablebleStyle({
      drawable: {
        backgroundColor: 'black'
      }
    });
    
    // Setup button event listeners
    createResizableBtn.addEventListener('click', () => this.createResizableArea());
    createDrawableBtn.addEventListener('click', () => this.createDrawableArea());
    detectElementsBtn.addEventListener('click', () => this.detectElementsUnderArea());
  }
  
  private createResizableArea(): void {
    const newArea = this.space.createResizableArea();
    this.resizableAreas.push(newArea);
    console.log('New resizable area created');
    
    // Set up event listeners
    newArea.on(AreaEvents.Select, (e) => {
      console.log('Area selected', e);
    });
    
    newArea.on(AreaEvents.Resize, (e) => {
      console.log(`Resizing: ${e.width}x${e.height}`);
    });
    
    newArea.on(AreaEvents.Confirmed, async () => {
      console.log('Area confirmed');
      await newArea.animateBlink();
      newArea.fix();
    });
  }
  
  private createDrawableArea(): void {
    const drawableOptions: DrawableSetupOptions = {
      removeOnMouseLeave: true,
      removeOnMouseUp: false
    };
    
    const drawableArea = this.space.createDrawableArea(drawableOptions);
    
    drawableArea.on(DrawableAreaEvents.drawStart, () => {
      console.log('Drawing started');
    });
    
    drawableArea.on(DrawableAreaEvents.drawEnd, () => {
      console.log('Drawing ended');
      const resizable = drawableArea.turnInresizable();
      
      resizable.on(AreaEvents.Confirmed, async () => {
        console.log('Resizable confirmed');
        await resizable.animateShake();
        resizable.fix();
      });
    });
  }
  
  private detectElementsUnderArea(): void {
    if (this.resizableAreas.length === 0) {
      console.log('No resizable areas created yet');
      return;
    }
    
    this.resizableAreas.forEach((area, index) => {
      const elementsUnder = area.detectElementsUnderArea('corner');
      console.log(`Area ${index + 1}: Found ${elementsUnder.length} elements`, elementsUnder);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ElasticBoxDemo();
});
```

## Main Methods

### Space
- `createResizableArea(customStyle?, options?)`: Creates a new resizable area within the space
- `createDrawableArea(options)`: Creates a new area by drawing it with mouse
- `setDefaultResizableStyle(customStyle)`: Sets default styles for resizable areas
- `setDefaultDrawablebleStyle(customStyle)`: Sets default styles for drawable areas
- `prune()`: Removes areas marked as prunable from the space

### Area
- `getResizable()`: Returns the resizable DOM element of the area
- `getState()`: Returns the current state of the area
- `getStyle()`: Returns the style of the area
- `on(event, callback)`: Adds a listener for the specified event
- `off(event, callback)`: Removes a listener for the specified event
- `fix()`: Locks the area, preventing further modifications
- `remove()`: Removes the area from the space
- `animateBlink()`: Plays a blink animation on the area
- `animateShake()`: Plays a shake animation on the area
- `detectElementsUnderArea(precision?, selector?)`: Detects elements under the area

### DrawableArea
- `getDrawable()`: Returns the drawable DOM element
- `getState()`: Returns the current state of the drawable area
- `getStyle()`: Returns the style of the drawable area
- `on(event, callback)`: Adds a listener for the specified event
- `off(event, callback)`: Removes a listener for the specified event
- `turnInresizable(customStyle?, options?)`: Converts the drawable area to a resizable area
- `remove()`: Removes the drawable area from the space
