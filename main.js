
const mainDiv = document.querySelector('#mainDiv');
const btn = document.querySelector('#newDiv');

// Enum per i tipi di cursore
const Cursors = {
  DEFAULT: 'default',
  MOVE: 'move',
  N_RESIZE: 'n-resize',
  S_RESIZE: 's-resize',
  E_RESIZE: 'e-resize',
  W_RESIZE: 'w-resize',
  NE_RESIZE: 'ne-resize',
  NW_RESIZE: 'nw-resize',
  SE_RESIZE: 'se-resize',
  SW_RESIZE: 'sw-resize'
};

// Costanti
const RESIZE_OFFSET = 10;

btn.addEventListener('click', createNewResizableDiv);

function createNewResizableDiv() {
  const resizable = document.createElement('div');
  resizable.classList.add('resizable');

  resizable.style.width = '400px';
  resizable.style.height = '200px';
  resizable.style.top = '0px';
  resizable.style.left = '0px';
  resizable.style.position = 'absolute';
  resizable.style.border = '1px solid #ccc';
  resizable.style.backgroundColor = '#f0f0f0';

  // Crea la barra di gestione
  const handle = document.createElement('div');
  handle.textContent = 'Drag';
  handle.style.top = '-22px';
  handle.style.left = '0';
  handle.style.position = 'absolute';
  handle.style.backgroundColor = 'red';
  handle.style.height = '22px';
  handle.style.width = '100px';
  handle.style.cursor = 'move';
  handle.style.userSelect = 'none';
  handle.style.display = 'flex';
  handle.style.alignItems = 'center';
  handle.style.paddingLeft = '10px';
  
  // Crea il pulsante di eliminazione
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.style.position = 'absolute';
  deleteButton.style.right = '2px';
  deleteButton.style.top = '0px';
  deleteButton.style.width = '20px';
  deleteButton.style.height = '20px';
  deleteButton.style.backgroundColor = '#ff3333';
  deleteButton.style.color = 'white';
  deleteButton.style.border = 'none';
  deleteButton.style.borderRadius = '3px';
  deleteButton.style.cursor = 'pointer';
  deleteButton.style.fontSize = '12px';
  deleteButton.style.lineHeight = '12px';
  deleteButton.style.padding = '0';
  
  // Aggiungi event listener per eliminare il div
  // deleteButton.addEventListener('click', (e) => {
  //   console.log('rimuovo l\'elemento')
  //   e.stopPropagation(); // Evita che l'evento si propaghi al parent
  //   if (element.cleanup) element.cleanup(); // Pulisci gli event listeners
  //   element.remove(); // Rimuovi l'elemento dal DOM
  //   console.log('rimosso')
  // });
  
  handle.appendChild(deleteButton);
  resizable.appendChild(handle);
  mainDiv.appendChild(resizable);

  attachListeners(resizable);
}

function attachListeners(element) {
  // Stato dell'elemento
  const state = {
    enableMovement: false,
    enableResize: false,
    isResizing: false,
    offsetX: 0,
    offsetY: 0,
    startClientX: 0,
    startClientY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    position: {
      left: false,
      right: false,
      top: false,
      bottom: false
    }
  };

  // Funzioni di manipolazione dell'elemento
  function handleMouseDown(e) {
    // Reset delle posizioni
    Object.keys(state.position).forEach(key => state.position[key] = false);

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determina dove è stato il click rispetto ai bordi
    if (x < RESIZE_OFFSET) state.position.left = true;
    else if (x > rect.width - RESIZE_OFFSET) state.position.right = true;

    if (y < RESIZE_OFFSET) state.position.top = true;
    else if (y > rect.height - RESIZE_OFFSET) state.position.bottom = true;

    // Salva i valori iniziali
    state.startClientX = e.clientX;
    state.startClientY = e.clientY;
    state.startWidth = element.offsetWidth;
    state.startHeight = element.offsetHeight;
    state.startLeft = parseInt(element.style.left, 10) || 0;
    state.startTop = parseInt(element.style.top, 10) || 0;
    state.offsetX = x;
    state.offsetY = y;

    if (state.position.left || state.position.right || 
        state.position.top || state.position.bottom) {
      state.enableResize = true;
      state.isResizing = true;
    } else {
      state.enableMovement = true;
    }

    // Previene selezione testo durante drag
    e.preventDefault();
  }

  function handleMouseMove(e) {
    const rect = element.getBoundingClientRect();
    
    if (state.isResizing) {
      // In modalità resize
      const deltaX = e.clientX - state.startClientX;
      const deltaY = e.clientY - state.startClientY;
      
      // Resize orizzontale
      if (state.position.right) {
        const newWidth = Math.max(RESIZE_OFFSET * 2, state.startWidth + deltaX);
        element.style.width = newWidth + 'px';
      } else if (state.position.left) {
        const newWidth = Math.max(RESIZE_OFFSET * 2, state.startWidth - deltaX);
        const newLeft = state.startLeft + state.startWidth - newWidth;
        element.style.width = newWidth + 'px';
        element.style.left = newLeft + 'px';
      }
      
      // Resize verticale
      if (state.position.bottom) {
        const newHeight = Math.max(RESIZE_OFFSET * 2, state.startHeight + deltaY);
        element.style.height = newHeight + 'px';
      } else if (state.position.top) {
        const newHeight = Math.max(RESIZE_OFFSET * 2, state.startHeight - deltaY);
        const newTop = state.startTop + state.startHeight - newHeight;
        element.style.height = newHeight + 'px';
        element.style.top = newTop + 'px';
      }
    } else if (state.enableMovement) {
      // In modalità movimento
      const newLeft = state.startLeft + (e.clientX - state.startClientX);
      const newTop = state.startTop + (e.clientY - state.startClientY);
      
      element.style.left = newLeft + 'px';
      element.style.top = newTop + 'px';
    } else {
      // Hovering - Determina posizione per cambiare il cursore
      if (!state.isResizing && !state.enableMovement) {
        // Reset delle posizioni
        Object.keys(state.position).forEach(key => state.position[key] = false);
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x < RESIZE_OFFSET) state.position.left = true;
        else if (x > rect.width - RESIZE_OFFSET) state.position.right = true;
        
        if (y < RESIZE_OFFSET) state.position.top = true;
        else if (y > rect.height - RESIZE_OFFSET) state.position.bottom = true;
        
        updateCursor();
      }
    }
  }

  function handleMouseUp() {
    state.enableMovement = false;
    state.enableResize = false;
    state.isResizing = false;
    element.style.cursor = Cursors.DEFAULT;
  }

  function updateCursor() {
    const { left, right, top, bottom } = state.position;
    
    // Determina il tipo di cursore in base alla posizione
    if (top && right) {
      element.style.cursor = Cursors.NE_RESIZE;
    } else if (top && left) {
      element.style.cursor = Cursors.NW_RESIZE;
    } else if (bottom && right) {
      element.style.cursor = Cursors.SE_RESIZE;
    } else if (bottom && left) {
      element.style.cursor = Cursors.SW_RESIZE;
    } else if (bottom) {
      element.style.cursor = Cursors.S_RESIZE;
    } else if (right) {
      element.style.cursor = Cursors.E_RESIZE;
    } else if (left) {
      element.style.cursor = Cursors.W_RESIZE;
    } else if (top) {
      element.style.cursor = Cursors.N_RESIZE;
    } else {
      element.style.cursor = Cursors.MOVE;
    }
  }

  // Registra eventi
  element.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Pulisci gli event listener quando l'elemento viene rimosso
  element.cleanup = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
}