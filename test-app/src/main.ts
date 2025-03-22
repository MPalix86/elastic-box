import { Space, Area, DrawableArea, ResizableCustomStyle, DrawableSetupOptions, DrawableCustomStyle, ResizableSetupOptions, DrawableAreaEvents } from '@__pali__/elastic-box';

/**
 * ElasticBoxDemo - A simplified demonstration of the elastic-box library
 */
class ElasticBoxDemo {
  // DOM Elements
  private container: HTMLDivElement;
  private createResizableBtn: HTMLButtonElement;
  private createDrawableBtn: HTMLButtonElement;
  private detectElementsBtn: HTMLButtonElement;

  // Elastic Box components
  private space: Space;
  private resizableAreas: Area[] = [];
  private drawableAreas: DrawableArea[] = [];

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
    removeOnMouseLeave: true,
    removeOnMouseUp:true
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
    console.log('Elastic Box Demo initialized');
  }

  /**
   * Initialize DOM element references
   */
  private initializeDOMElements(): void {
    this.container = document.querySelector('#mainDiv') as HTMLDivElement;
    this.createResizableBtn = document.querySelector('#createResizable') as HTMLButtonElement;
    this.createDrawableBtn = document.querySelector('#createDrawable') as HTMLButtonElement;
    this.detectElementsBtn = document.querySelector('#getElements') as HTMLButtonElement;

    // Validate required elements exist
    if (!this.container) throw new Error('Container element #mainDiv not found');
    if (!this.createResizableBtn) throw new Error('Button element #createResizable not found');
    if (!this.createDrawableBtn) throw new Error('Button element #createDrawable not found');
    if (!this.detectElementsBtn) throw new Error('Button element #detectElements not found');
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
   * Setup event listeners for control buttons
   */
  private setupEventListeners(): void {
    this.createResizableBtn.addEventListener('click', () => this.createResizableArea());
    this.createDrawableBtn.addEventListener('click', () => this.createDrawableArea());
    this.detectElementsBtn.addEventListener('click', () => this.detectElementsUnderArea());
  }

  /**
   * Create a new resizable area
   */
  private createResizableArea(): void {
    const newArea = this.space.createResizableArea( undefined);
    this.resizableAreas.push(newArea);
    console.log('New resizable area created');
  }

  /**
   * Create a new drawable area
   */
  private createDrawableArea(): void {
    const drawableArea = this.space.createDrawableArea(this.drawableOptions);
    this.drawableAreas.push(drawableArea);
    console.log('New drawable area created');
    let resizable : Area
    // Basic events for logging
    drawableArea.on('draw-end', () => {
      resizable = drawableArea.turnInresizable(undefined)

      resizable.on('confirmed', async ()=>{
        console.log('resizable confirmed')
        // await resizable.animateBlink()
        await resizable.animateShake()
        resizable.fix()
      })
    });



    
  }

  /**
   * Detect elements under all resizable areas
   */
  private detectElementsUnderArea(): void {
    if (this.resizableAreas.length === 0) {
      console.log('No resizable areas created yet');
      return;
    }

    this.resizableAreas.forEach((area, index) => {
      const elementsUnder = area.detectElementsUnderArea('corner');
      
      if (elementsUnder && elementsUnder.length > 0) {
        console.log(`Area ${index + 1}: Found ${elementsUnder.length} elements`, elementsUnder);
      } else {
        console.log(`Area ${index + 1}: No elements found`);
      }
    });
  }
}

// Initialize the demo when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const demo = new ElasticBoxDemo();

  // Make demo instance available globally for debugging
  (window as any).elasticBoxDemo = demo;
});