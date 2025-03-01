# Elastic-Box

Elastic-Box is a JavaScript/TypeScript library for creating dynamic layouts with resizable and movable areas inside a container.

## Installation

You need to setup your packag.json in order to use GitHub Packages as repository

```bash
npm install @mpalix86/elastic-box
```

## Basic Usage

```typescript
import { Space, Area } from '@mpalix86/elastic-box';

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


Areas emit various events that you can listen to for interaction. Here's a complete example of all available listeners:


## Complete Events Reference

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


## Example

```typescript
// Function to set up all available listeners on an area
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



## Main Methods

### Space
- `createArea()`: Creates a new area within the space

### Area
- `getResizable()`: Returns the resizable DOM element of the area
- `on(event, callback)`: Adds a listener for the specified event
- `off(event, callback)`: Removes a listener for the specified event (not implemented yet )
