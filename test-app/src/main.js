import {Space, Area} from '@MPalix86/elastic-box';

// Seleziona gli elementi DOM con controllo di esistenza
const container = document.querySelector('#mainDiv');
const button = document.querySelector('#newDiv');
const remove = document.querySelector('#remove');

// Verifica che gli elementi esistano
if (!container) throw new Error('Container element #mainDiv not found');
if (!button) throw new Error('Button element #newDiv not found');
if (!remove) throw new Error('Remove button element #remove not found');

console.dir( Space);
console.dir('Tipo di Space:', typeof Space);
console.log('Container:', container);

// Dichiarazione delle variabili
let area;
let select;

// Inizializzazione dello spazio
const space = new Space(container);
console.log('new space created');

// Listener per rimuovere l'evento 'select'
remove.addEventListener('click', () => {
  console.log('cliccato-remove');
  if (area) {
    area.off('select', select);
    console.log('Evento select rimosso');
  } else {
    console.log('Nessuna area disponibile');
  }
});

// Listener per creare una nuova area
button.addEventListener('click', () => {
  console.log('click');
  area = space.createArea();
  console.log('new area created');

  // Handler per l'evento select
  select = e => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'blue';
  };

  // Eventi di selezione
  area.on('select', select);
  area.on('deselect', e => {
    const area = e.target;
    const resizableEl = area.getResizable();
    resizableEl.style.backgroundColor = 'red';
  });

  // Eventi di eliminazione
  area.on('before-delete', () => {
    console.log('before delete');
  });
  area.on('after-delete', () => {
    console.log('afterdelete');
  });

  // Eventi di ridimensionamento
  area.on('resize', e => {
    console.log('resize', e);
  });
  area.on('resize-start', e => {
    console.log('resize-start', e);
  });
  area.on('resize-end', e => {
    console.log('resize-end', e);
  });

  // Eventi di movimento
  area.on('move', e => {
    console.log('move', e);
  });
});