import { Space, Area, DrawableArea, ResizableCustomStyle, DrawableSetupOptions } from '@__pali__/elastic-box';

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
  private statusLog: HTMLUListElement;
  private detectionResults: HTMLDivElement;
  
  // Elastic Box components
  private space: Space;
  private resizableAreas: Area[] = [];
  private drawableAreas: DrawableArea[] = [];
  
  // State management
  private eventsEnabled: boolean = true;
  private isDrawing: boolean = false;
  
  // Custom styling for resizable areas
  private customStyle: ResizableCustomStyle = {
    resizable: {
      backgroundColor: 'rgba(105, 110, 255, 0.5)',
      border: '2px solid white',
      height: '200px',
      width: '300px',
      minHeight: '100px',
      minWidth: '100px'
    }
  };
  
  // Configuration for drawable areas
  private drawableOptions: DrawableSetupOptions = {
    turnInResizableArea: true
  };
  
  /**
   * Constructor - Initialize the demo
   */
  constructor() {
    this.initializeDOMElements();
    this.initializeSpace();
    this.setupEventListeners();
    
    // Add keyboard shortcut (Escape) to cancel drawing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isDrawing) {
        this.cancelDrawing();
        this.logStatus('Drawing canceled with Escape key');
      }
    });
    
    this.logStatus('Elastic Box Demo initialized');
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
    this.statusLog = document.querySelector('#statusLog') as HTMLUListElement;
    this.detectionResults = document.querySelector('#detectionResults') as HTMLDivElement;
    
    // Validate required elements exist
    if (!this.container) throw new Error('Container element #mainDiv not found');
    if (!this.createResizableBtn) throw new Error('Button element #createResizable not found');
    if (!this.getElementsBtn) throw new Error('Button element #getElements not found');
    if (!this.createDrawableBtn) throw new Error('Button element #createDrawable not found');
    if (!this.toggleEventsBtn) throw new Error('Button element #toggleEvents not found');
    if (!this.statusLog) throw new Error('Status log element #statusLog not found');
    if (!this.detectionResults) throw new Error('Detection results element #detectionResults not found');
  }
  
  /**
   * Initialize the elastic-box Space with custom styling
   */
  private initializeSpace(): void {
    this.space = new Space(this.container, this.customStyle);
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
    this.logStatus('New resizable area created');
    
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
      this.logStatus('Please complete the current drawing first');
      return;
    }
    
    this.isDrawing = true;
    this.createDrawableBtn.textContent = 'Drawing in progress...';
    this.createDrawableBtn.classList.add('active');
    this.createDrawableBtn.disabled = true; // Disable the button while drawing
    
    const drawableArea = this.space.createDrawableArea(this.drawableOptions);
    this.drawableAreas.push(drawableArea);
    this.logStatus('New drawable area created - Draw your shape now');
    
    // If we have the option to convert to resizable area, we need to capture
    // when the drawing is complete and the resizable area is created
    if (this.drawableOptions.turnInResizableArea) {
      const checkForResizable = setInterval(() => {
        // Check if a resizable element has been created from the drawable
        try {
          const resizableArea = drawableArea.getResizable();
          if (resizableArea) {
            // Clear the interval now that we have the resizable area
            clearInterval(checkForResizable);
            
            // Add the resizable area to our tracked areas
            this.resizableAreas.push(resizableArea);
            
            // Attach events if enabled
            if (this.eventsEnabled) {
              this.attachResizableEvents(resizableArea);
            }
            
            // Reset drawing state
            this.isDrawing = false;
            this.createDrawableBtn.textContent = 'Create Drawable Area';
            this.createDrawableBtn.classList.remove('active');
            this.createDrawableBtn.disabled = false; // Re-enable the button
            
            this.logStatus('Drawing complete - Converted to resizable area');
          }
        } catch (error) {
          // If we get an error, it might mean the drawable was already released
          // Let's check if the drawable is still valid
          try {
            // Try to access a property of drawableArea to see if it throws
            const test = drawableArea.getResizable;
            // If we're here, the drawable is still valid but not yet converted
          } catch (err) {
            // If we get here, the drawable is no longer valid
            clearInterval(checkForResizable);
            
            // Reset drawing state
            this.isDrawing = false;
            this.createDrawableBtn.textContent = 'Create Drawable Area';
            this.createDrawableBtn.classList.remove('active');
            this.createDrawableBtn.disabled = false; // Re-enable the button
            
            this.logStatus('Drawing abandoned - Reset drawable state');
          }
        }
      }, 500);
      
      // Set a timeout to stop checking after a reasonable period
      setTimeout(() => {
        clearInterval(checkForResizable);
        if (this.isDrawing) {
          this.isDrawing = false;
          this.createDrawableBtn.textContent = 'Create Drawable Area';
          this.createDrawableBtn.classList.remove('active');
          this.createDrawableBtn.disabled = false; // Re-enable the button
          this.logStatus('Drawing timeout - Reset drawable state');
        }
      }, 60000); // 1 minute timeout
    }
  }
  
  /**
   * Detect elements under the most recently created resizable area
   * Uses an improved detection algorithm with precision control
   * and displays results in the UI
   */
  private detectElementsUnderArea(): void {
    if (this.resizableAreas.length === 0) {
      this.logStatus('No resizable areas created yet');
      this.displayDetectionResults([]);
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
    
    // Display results in the UI
    this.displayDetectionResults(elementsUnder);
    
    if (elementsUnder && elementsUnder.length > 0) {
      this.logStatus(`Found ${elementsUnder.length} elements under the LAST created resizable area`);
      console.log('Elements detected:', elementsUnder);
    } else {
      this.logStatus('No elements found under the LAST created resizable area');
    }
  }
  
  /**
   * Display detection results in the UI
   * @param results - Array of detected elements with hit counts
   */
  private displayDetectionResults(results: any[]): void {
    // Clear previous results
    this.detectionResults.innerHTML = '';
    
    if (!results || results.length === 0) {
      const noResults = document.createElement('p');
      noResults.className = 'no-results';
      noResults.textContent = 'No elements detected under the last created resizable area.';
      this.detectionResults.appendChild(noResults);
      return;
    }
    
    // Add a header with info about the detection
    const header = document.createElement('div');
    header.className = 'no-results';
    header.style.backgroundColor = '#e7f5ff';
    header.style.marginBottom = '10px';
    header.style.color = '#0056b3';
    header.textContent = `Detected ${results.length} element(s) under the last created resizable area`;
    this.detectionResults.appendChild(header);
    
    // Create result elements for each detected element
    results.forEach((result, index) => {
      const resultElement = document.createElement('div');
      resultElement.className = 'element-result';
      
      // Get element info
      const element = result.element;
      let elementInfo = '';
      
      // Get class or id for element identification
      if (element.className) {
        elementInfo = `Class: ${element.className}`;
      } else if (element.id) {
        elementInfo = `ID: ${element.id}`;
      } else {
        elementInfo = `Element: ${element.tagName.toLowerCase()}`;
      }
      
      // Add background color information if available
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      let colorInfo = '';
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        colorInfo = ` [${bgColor}]`;
        
        // Apply a subtle background color to match the element
        resultElement.style.borderLeftColor = bgColor;
      }
      
      // Create the result HTML
      resultElement.innerHTML = `
        <span class="element-info">${index + 1}. ${elementInfo}${colorInfo}</span>
        <span class="element-hits">${result.hits} hits</span>
      `;
      
      this.detectionResults.appendChild(resultElement);
    });
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
      { x: movableRect.left, y: movableRect.bottom } // Bottom-left corner
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
    this.toggleEventsBtn.textContent = this.eventsEnabled ? 'Disable Events' : 'Enable Events';
    this.toggleEventsBtn.classList.toggle('active', this.eventsEnabled);
    
    this.resizableAreas.forEach(area => {
      if (this.eventsEnabled) {
        this.attachResizableEvents(area);
      } else {
        this.detachResizableEvents(area);
      }
    });
    
    this.logStatus(`Events ${this.eventsEnabled ? 'enabled' : 'disabled'} for all resizable areas (drawable areas have no events)`);
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
  
  /**
   * Add a log entry to the status panel
   * @param message - The message to log
   */
  private logStatus(message: string): void {
    const logItem = document.createElement('li');
    logItem.textContent = message;
    
    // Add timestamp to the log
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    logItem.setAttribute('data-time', timestamp);
    logItem.innerHTML = `<span style="color: #666; font-size: 11px;">[${timestamp}]</span> ${message}`;
    
    // Add to DOM
    this.statusLog.prepend(logItem);
    
    // Also log to console
    console.log(`[${timestamp}] ${message}`);
    
    // Limit the number of log entries (keep the last 20)
    while (this.statusLog.children.length > 20) {
      this.statusLog.removeChild(this.statusLog.lastChild as Node);
    }
  }
  
  // Event handlers
  private handleSelect = (e: any): void => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
    this.logStatus('Area selected');
  };
  
  private handleDeselect = (e: any): void => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    this.logStatus('Area deselected');
  };
  
  private handleBeforeDelete = (): void => {
    this.logStatus('Before delete event triggered');
  };
  
  private handleAfterDelete = (): void => {
    this.logStatus('After delete event triggered');
  };
  
  private handleResize = (e: any): void => {
    this.logStatus('Resize event triggered');
  };
  
  private handleResizeStart = (e: any): void => {
    this.logStatus('Resize start event triggered');
  };
  
  private handleResizeEnd = (e: any): void => {
    this.logStatus('Resize end event triggered');
  };
  
  private handleMove = (e: any): void => {
    this.logStatus('Move event triggered');
  };
}

// Initialize the demo when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const demo = new ElasticBoxDemo();
  
  // Make demo instance available globally for debugging
  (window as any).elasticBoxDemo = demo;
});