import { Space, Area, DrawableArea, ResizableCustomStyle, DrawableSetupOptions, DrawableCustomStyle } from '@__pali__/elastic-box';
import { BaseAreaEvent, DrawableAreaEvents } from '@__pali__/elastic-box/dist/types/area-types';

/**
 * ElasticBoxDemo - A demonstration of the elastic-box library
 * This class handles the creation and management of resizable and drawable areas
 */
class ElasticBoxDemo {
  // DOM Elements
  private container: HTMLDivElement;
  private createResizableBtn: HTMLButtonElement;
  private getElementsBtn: HTMLButtonElement;
  private createDrawableBtn: HTMLButtonElement;
  private toggleEventsBtn: HTMLButtonElement;

  // Elastic Box components
  private space: Space;
  private resizableAreas: Area[] = [];
  private drawableAreas: DrawableArea[] = [];

  // State management
  private eventsEnabled: boolean = true;
  private isDrawing: boolean = false;

  // Custom styling for resizable areas
  private resizableCustomStyle: ResizableCustomStyle = {
    resizable: {
      backgroundColor: 'rgba(105, 110, 255, 0.5)',
      border: '2px solid white',
      height: '200px',
      width: '300px',
      minHeight: '100px',
      minWidth: '100px',
    },
    areaOptions: {
      position: 'vertical',
    },
  };

  // Configuration for drawable areas
  private drawableOptions: DrawableSetupOptions = {
    turnInResizableArea: true,
    persist: false,
    deleteOnLeave : true
  };

  private drawableCustomStyle: DrawableCustomStyle = {
    drawable: {
      backgroundColor: 'black'
    }
  }

  /**
   * Constructor - Initialize the demo
   */
  constructor() {
    this.initializeDOMElements();
    this.initializeSpace();
    this.setupEventListeners();

    // Add keyboard shortcut (Escape) to cancel drawing
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isDrawing) {
        this.cancelDrawing();
        console.log('Drawing canceled with Escape key');
      }
    });

    console.log('Elastic Box Demo initialized');
  }

  /**
   * Cancel the current drawing operation and reset state
   */
  private cancelDrawing(): void {
    this.isDrawing = false;
    this.createDrawableBtn.textContent = 'Create Drawable Area';
    this.createDrawableBtn.classList.remove('active');
    this.createDrawableBtn.disabled = false;
  }

  /**
   * Initialize DOM element references
   * Throws error if required elements are not found
   */
  private initializeDOMElements(): void {
    this.container = document.querySelector('#mainDiv') as HTMLDivElement;
    this.createResizableBtn = document.querySelector('#createResizable') as HTMLButtonElement;
    this.getElementsBtn = document.querySelector('#getElements') as HTMLButtonElement;
    this.createDrawableBtn = document.querySelector('#createDrawable') as HTMLButtonElement;
    this.toggleEventsBtn = document.querySelector('#toggleEvents') as HTMLButtonElement;

    // Validate required elements exist
    if (!this.container) throw new Error('Container element #mainDiv not found');
    if (!this.createResizableBtn) throw new Error('Button element #createResizable not found');
    if (!this.getElementsBtn) throw new Error('Button element #getElements not found');
    if (!this.createDrawableBtn) throw new Error('Button element #createDrawable not found');
    if (!this.toggleEventsBtn) throw new Error('Button element #toggleEvents not found');
  }

  /**
   * Initialize the elastic-box Space with custom styling
   */
  private initializeSpace(): void {
    this.space = new Space(this.container);
    this.space.setDefaultDrawablebleStyle(this.drawableCustomStyle);
    this.space.setDefaultResizableStyle(this.resizableCustomStyle);
    console.log('Elastic Box space initialized');
  }

  /**
   * Setup event listeners for all control buttons
   */
  private setupEventListeners(): void {
    // Create resizable area button
    this.createResizableBtn.addEventListener('click', () => this.createResizableArea());

    // Get elements under area button
    this.getElementsBtn.addEventListener('click', () => this.detectElementsUnderArea());

    // Create drawable area button
    this.createDrawableBtn.addEventListener('click', () => this.createDrawableArea());

    // Toggle events button (for resizable areas only)
    this.toggleEventsBtn.addEventListener('click', () => this.toggleEvents());
  }

  /**
   * Create a new resizable area and attach event handlers
   */
  private createResizableArea(): void {
    const newArea = this.space.createResizableArea();
    this.resizableAreas.push(newArea);
    console.log('New resizable area created');

    // Attach event handlers if events are enabled
    if (this.eventsEnabled) {
      this.attachResizableEvents(newArea);
    }
  }

  /**
   * Create a new drawable area
   * When the drawing is complete, the drawable will be converted to a resizable area if turnInResizableArea is true
   */
  private createDrawableArea(): void {
    // Prevent creating multiple drawable areas simultaneously
    if (this.isDrawing) {
      console.log('Please complete the current drawing first');
      return;
    }

    this.isDrawing = true;
    this.createDrawableBtn.textContent = 'Drawing in progress...';
    this.createDrawableBtn.classList.add('active');

    const drawableArea = this.space.createDrawableArea(this.drawableOptions);
    this.drawableAreas.push(drawableArea);
    
    drawableArea.on('draw-start', () => {
      console.log(`draw-start`);
    });
    
    drawableArea.on('draw-end', () => {
      console.log(`draw-end`);
      this.isDrawing = false;
      this.createDrawableBtn.textContent = 'Create Drawable Area';
      this.createDrawableBtn.classList.remove('active');
    });
    
    drawableArea.on('drawing', () => {
      console.log(`drawing`);
    });

    

    drawableArea.on('turned-in-resizable', () => {
      const area = drawableArea.getResizable();
      console.log(`turned in resizable`);
      
      area.on('confirmed', () => {
        console.log(`drawed area turned in resizable confirmed`);
      });
      
      // Add to resizable areas array to track it
      if (area) {
        this.resizableAreas.push(area);
        
        // Attach events if needed
        if (this.eventsEnabled) {
          this.attachResizableEvents(area);
        }
      }
    });
  }

  /**
   * Detect elements under the most recently created resizable area
   */
  private detectElementsUnderArea(): void {
    if (this.resizableAreas.length === 0) {
      console.log('No resizable areas created yet');
      return;
    }

    const latestArea = this.resizableAreas[this.resizableAreas.length - 1];

    // Highlight the latest area to indicate which one is being detected
    const resizableEl = latestArea.getResizable();
    const originalBorderColor = resizableEl.style.borderColor;

    // Visual feedback - flash border to show which area is being detected
    resizableEl.style.borderColor = '#ffcc00';
    setTimeout(() => {
      resizableEl.style.borderColor = originalBorderColor;
    }, 1000);

    // Using the enhanced detection method
    const elementsUnder = this.enhancedDetectElementsUnder(latestArea, 'default', '.wrapper');

    if (elementsUnder && elementsUnder.length > 0) {
      console.log(`Found ${elementsUnder.length} elements under the resizable area`, elementsUnder);
    } else {
      console.log('No elements found under the resizable area');
    }
  }

  /**
   * Enhanced detection of elements under a resizable area
   * @param area - The resizable area to check under
   * @param precision - Precision level for detection points (higher = more accurate but slower)
   * @param selector - CSS selector to filter elements (e.g. '.wrapper')
   * @returns An array of elements found under the area, sorted by hit count
   */
  private enhancedDetectElementsUnder(area: Area, precision?: number | 'default', selector?: string): any[] {
    const resizableEl = area.getResizable();
    const movableRect = resizableEl.getBoundingClientRect();
    const container = this.container.getBoundingClientRect();

    const height = movableRect.height;
    const width = movableRect.width;

    // Set precision level (lower value = more test points)
    if (precision === undefined) precision = 0.25;
    else if (precision === 'default') precision = 0.25;
    else precision = 1 / Math.abs(precision as number);

    // Start with corners as test points
    const testPoints = [
      { x: movableRect.left, y: movableRect.top }, // Top-left corner
      { x: movableRect.right, y: movableRect.top }, // Top-right corner
      { x: movableRect.right, y: movableRect.bottom }, // Bottom-right corner
      { x: movableRect.left, y: movableRect.bottom }, // Bottom-left corner
    ];

    // Add additional test points based on precision
    for (let i = 0; i <= width; i += width * precision) {
      for (let j = 0; j <= height; j += height * precision) {
        const x = movableRect.left + i;
        const y = movableRect.top + j;
        testPoints.push({ x, y });
      }
    }

    // Map to count how many test points are inside each element
    const elementHits = new Map();

    // Use elementFromPoint for each test point
    testPoints.forEach(point => {
      // Get the element at the current position
      const element = document.elementFromPoint(point.x, point.y);

      if (element) {
        // Find the target element using closest() for better performance
        // If selector is provided, find the closest matching ancestor
        // Otherwise, use the element itself
        const targetElement = selector ? element.closest(selector) : element;

        // If we found a matching element, increment the hit count
        if (targetElement) {
          const hits = elementHits.get(targetElement) || 0;
          elementHits.set(targetElement, hits + 1);
        }
      }
    });

    // Convert the map to an array of elements
    const elementsUnder = Array.from(elementHits.entries())
      .filter(([_, hits]) => hits > 0) // Remove elements without hits
      .sort((a, b) => b[1] - a[1]) // Sort by number of hits (highest to lowest)
      .map(([element, hits]) => ({
        element,
        hits,
      }));

    return elementsUnder;
  }

  /**
   * Toggle events on/off for all resizable areas
   */
  private toggleEvents(): void {
    this.eventsEnabled = !this.eventsEnabled;
    this.toggleEventsBtn.textContent = this.eventsEnabled ? 'Disable Resizable Events' : 'Enable Resizable Events';
    this.toggleEventsBtn.classList.toggle('active', this.eventsEnabled);

    this.resizableAreas.forEach(area => {
      if (this.eventsEnabled) {
        this.attachResizableEvents(area);
      } else {
        this.detachResizableEvents(area);
      }
    });

    console.log(`Events ${this.eventsEnabled ? 'enabled' : 'disabled'} for all resizable areas`);
  }

  /**
   * Attach all event handlers to a resizable area
   * @param area - The resizable area to attach events to
   */
  private attachResizableEvents(area: Area): void {
    // Selection events
    area.on('select', this.handleSelect);
    area.on('deselect', this.handleDeselect);

    // Deletion events
    area.on('before-delete', this.handleBeforeDelete);
    area.on('after-delete', this.handleAfterDelete);

    // Resize events
    area.on('resize', this.handleResize);
    area.on('resize-start', this.handleResizeStart);
    area.on('resize-end', this.handleResizeEnd);

    // Movement events
    area.on('move', this.handleMove);

    area.on('confirmed', () => {
      console.log('Area confirmed');
    });
  }

  /**
   * Detach all event handlers from a resizable area
   * @param area - The resizable area to detach events from
   */
  private detachResizableEvents(area: Area): void {
    // Selection events
    area.off('select', this.handleSelect);
    area.off('deselect', this.handleDeselect);

    // Deletion events
    area.off('before-delete', this.handleBeforeDelete);
    area.off('after-delete', this.handleAfterDelete);

    // Resize events
    area.off('resize', this.handleResize);
    area.off('resize-start', this.handleResizeStart);
    area.off('resize-end', this.handleResizeEnd);

    // Movement events
    area.off('move', this.handleMove);
  }

  // Event handlers
  private handleSelect = (e: any): void => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
    console.log('Area selected');
  };

  private handleDeselect = (e: any): void => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    console.log('Area deselected');
  };

  private handleBeforeDelete = (): void => {
    console.log('Before delete event triggered');
  };

  private handleAfterDelete = (): void => {
    console.log('After delete event triggered');
  };

  private handleResize = (e: any): void => {
    console.log('Resize event triggered');
  };

  private handleResizeStart = (e: any): void => {
    console.log('Resize start event triggered');
  };

  private handleResizeEnd = (e: any): void => {
    console.log('Resize end event triggered');
  };

  private handleMove = (e: any): void => {
    console.log('Move event triggered');
  };
}

// Initialize the demo when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const demo = new ElasticBoxDemo();

  // Make demo instance available globally for debugging
  (window as any).elasticBoxDemo = demo;
});