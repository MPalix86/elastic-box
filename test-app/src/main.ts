import { Space, Area, ResizableCustomStyle, DrawableSetupOptions } from '@__pali__/elastic-box';

// Seleziona gli elementi DOM con controllo di esistenza
const container = document.querySelector('#container') as HTMLDivElement;
const createResizableBtn = document.querySelector('#createResizable');
const detectElementsBtn = document.querySelector('#detectElements');
const createDrawableBtn = document.querySelector('#createDrawable');
const toggleEventsBtn = document.querySelector('#toggleEvents') as HTMLButtonElement;
const clearSelectionsBtn = document.querySelector('#clearSelections') as HTMLButtonElement;
const toggleStyleBtn = document.querySelector('#toggleStyle');

// Verifica che gli elementi esistano
if (!container) throw new Error('Container element #container not found');
if (!createResizableBtn) throw new Error('Button element #createResizable not found');
if (!detectElementsBtn) throw new Error('Button element #detectElements not found');
if (!createDrawableBtn) throw new Error('Button element #createDrawable not found');
if (!toggleEventsBtn) throw new Error('Button element #toggleEvents not found');
if (!clearSelectionsBtn) throw new Error('Button element #clearSelections not found');
if (!toggleStyleBtn) throw new Error('Button element #toggleStyle not found');

// Stili personalizzati per le aree ridimensionabili
const defaultStyle: ResizableCustomStyle = {
  resizable: {
    backgroundColor: 'rgba(105, 110, 255, 0.3)',
    border: '2px solid #4a4dff',
    height: '200px',
    width: '300px',
    minHeight: '100px',
    minWidth: '100px'
  }
};

const alternativeStyle: ResizableCustomStyle = {
  resizable: {
    backgroundColor: 'rgba(255, 105, 180, 0.3)',
    border: '2px dashed #ff1493',
    height: '250px',
    width: '350px',
    minHeight: '120px',
    minWidth: '120px'
  }
};

// Stile corrente (inizia con il default)
let currentStyle = defaultStyle;

// Inizializzazione dello spazio
const space = new Space(container, currentStyle);
console.log('ElasticBox space initialized');

// Opzioni per le aree disegnabili
const drawableOptions: DrawableSetupOptions = {
  turnInResizableArea: true
}

// Variabili per tenere traccia delle aree e dello stato dei listener
let currentArea: Area ;
let eventsEnabled = true;
let selectedElements: HTMLElement[] = [];

// Funzione per evidenziare gli elementi selezionati
function highlightElements(elements: HTMLElement[]) {
  // Prima rimuovi l'evidenziazione precedente
  clearHighlights();
  
  if (!elements || elements.length === 0) {
    console.log('No elements to highlight');
    return;
  }
  
  // Aggiungi la nuova evidenziazione
  selectedElements = elements;
  elements.forEach(el => {
    if (el) {
      // Salva lo stile originale
      el.dataset.originalBorder = el.style.border;
      el.dataset.originalBoxShadow = el.style.boxShadow;
      
      // Applica l'evidenziazione
      el.style.border = '2px dashed #ff5722';
      el.style.boxShadow = '0 0 10px rgba(255, 87, 34, 0.7)';
    }
  });
  
  console.log(`Highlighted ${elements.length} elements`);
}

// Funzione per rimuovere l'evidenziazione
function clearHighlights() {
  if (selectedElements && selectedElements.length > 0) {
    selectedElements.forEach(el => {
      if (el) {
        // Ripristina lo stile originale
        el.style.border = el.dataset.originalBorder || '';
        el.style.boxShadow = el.dataset.originalBoxShadow || '';
        delete el.dataset.originalBorder;
        delete el.dataset.originalBoxShadow;
      }
    });
  }
  selectedElements = [];
}

// Funzione per abilitare/disabilitare gli eventi
function toggleEvents() {
  if (!currentArea) return;
  
  eventsEnabled = !eventsEnabled;
  
  if (eventsEnabled) {
    // Riattiva tutti gli eventi
    attachEventListeners(currentArea);
    toggleEventsBtn.textContent = 'Disable Events';
    toggleEventsBtn.classList.remove('disabled');
  } else {
    // Disattiva tutti gli eventi
    detachEventListeners(currentArea);
    toggleEventsBtn.textContent = 'Enable Events';
    toggleEventsBtn.classList.add('disabled');
  }
  
  console.log(`Events ${eventsEnabled ? 'enabled' : 'disabled'}`);
}

// Funzione per allegare tutti i listener degli eventi
function attachEventListeners(area: Area) {
  // Eventi di selezione
  area.on('select', handleSelect);
  area.on('deselect', handleDeselect);
  
  // Eventi di eliminazione
  area.on('before-delete', handleBeforeDelete);
  area.on('after-delete', handleAfterDelete);
  
  // Eventi di ridimensionamento
  area.on('resize', handleResize);
  area.on('resize-start', handleResizeStart);
  area.on('resize-end', handleResizeEnd);
  
  // Eventi di movimento
  area.on('move', handleMove);
}

// Funzione per rimuovere tutti i listener degli eventi
function detachEventListeners(area: Area) {
  // Eventi di selezione
  area.off('select', handleSelect);
  area.off('deselect', handleDeselect);
  
  // Eventi di eliminazione
  area.off('before-delete', handleBeforeDelete);
  area.off('after-delete', handleAfterDelete);
  
  // Eventi di ridimensionamento
  area.off('resize', handleResize);
  area.off('resize-start', handleResizeStart);
  area.off('resize-end', handleResizeEnd);
  
  // Eventi di movimento
  area.off('move', handleMove);
}

// Gestore eventi di selezione
function handleSelect(e: any) {
  const area = e.target;
  const resizableEl = area.getResizable();
  resizableEl.style.backgroundColor = 'rgba(65, 105, 225, 0.5)';
  console.log('Area selected');
}

// Gestore eventi di deselezione
function handleDeselect(e: any) {
  const area = e.target;
  const resizableEl = area.getResizable();
  resizableEl.style.backgroundColor = 'rgba(105, 110, 255, 0.3)';
  console.log('Area deselected');
}

// Gestori eventi di eliminazione
function handleBeforeDelete() {
  console.log('Area about to be deleted');
}

function handleAfterDelete() {
  console.log('Area has been deleted');
  toggleEventsBtn.disabled = true;
  toggleEventsBtn.textContent = 'Enable Events (No Area)';
}

// Gestori eventi di ridimensionamento
function handleResize(e: any) {
  console.log('Resizing', { width: e.width, height: e.height });
}

function handleResizeStart(e: any) {
  console.log('Resize started', e);
}

function handleResizeEnd(e: any) {
  console.log('Resize ended', e);
}

// Gestore eventi di movimento
function handleMove(e: any) {
  console.log('Moving', { x: e.x, y: e.y });
}

// Listener per creare una nuova area ridimensionabile
createResizableBtn.addEventListener('click', () => {
  // Crea una nuova area ridimensionabile
  currentArea = space.createResizableArea();
  console.log('New resizable area created');
  
  // Aggiungi i listener degli eventi
  if (eventsEnabled) {
    attachEventListeners(currentArea);
  }
  
  // Abilita il pulsante di toggle eventi
  toggleEventsBtn.disabled = false;
  if (eventsEnabled) {
    toggleEventsBtn.textContent = 'Disable Events';
    toggleEventsBtn.classList.remove('disabled');
  } else {
    toggleEventsBtn.textContent = 'Enable Events';
    toggleEventsBtn.classList.add('disabled');
  }
});

// Listener per rilevare elementi sotto l'area
detectElementsBtn.addEventListener('click', () => {
  if (!currentArea) {
    alert('Create a resizable area first!');
    return;
  }
  
  try {
    // @ts-ignore
    const elements = currentArea.detectElementsUnderArea('default', '.wrapper') as HTMLElement[];
    console.log('Elements detected under area:', elements);
    
    if (elements && elements.length > 0) {
      // Evidenzia gli elementi trovati
      highlightElements(elements);
    } else {
      alert('No elements found under the area');
      console.log('No elements found under the area');
    }
  } catch (error) {
    console.error('Error detecting elements:', error);
    alert('Error detecting elements. Check console for details.');
  }
});

// Listener per creare un'area disegnabile
createDrawableBtn.addEventListener('click', () => {
  
  currentArea = space.createDrawableArea(drawableOptions);
  console.log('New drawable area created - Click and drag to draw');
  
  // Aggiungi i listener degli eventi
  if (eventsEnabled) {
    attachEventListeners(currentArea);
  }
  
  // Abilita il pulsante di toggle eventi
  toggleEventsBtn.disabled = false;
  if (eventsEnabled) {
    toggleEventsBtn.textContent = 'Disable Events';
    toggleEventsBtn.classList.remove('disabled');
  } else {
    toggleEventsBtn.textContent = 'Enable Events';
    toggleEventsBtn.classList.add('disabled');
  }
});

// Listener per abilitare/disabilitare gli eventi
toggleEventsBtn.addEventListener('click', toggleEvents);

// Listener per rimuovere l'evidenziazione
clearSelectionsBtn.addEventListener('click', clearHighlights);

// Funzione per alternare tra stili diversi
function toggleStyle() {
  // Alterna tra stili
  currentStyle = currentStyle === defaultStyle ? alternativeStyle : defaultStyle;
  
  // Aggiorna lo stile nello spazio
  space.setDefaultResizableStyle(currentStyle);
  
  // Aggiorna il testo del pulsante
  // @ts-ignore
  toggleStyleBtn.textContent = currentStyle === defaultStyle 
    ? 'Switch to Pink Style' 
    : 'Switch to Blue Style';
    
  console.log('Style updated to:', currentStyle === defaultStyle ? 'Default Blue' : 'Alternative Pink');
}

// Imposta il testo iniziale del pulsante di stile
toggleStyleBtn.textContent = 'Switch to Pink Style';

// Listener per cambiare lo stile
toggleStyleBtn.addEventListener('click', toggleStyle);