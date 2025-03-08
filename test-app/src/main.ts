
import {Space, Area, CustomStyle} from '@MPalix86/elastic-box';

// Seleziona gli elementi DOM con controllo di esistenza
const container = document.querySelector('#mainDiv');
const button = document.querySelector('#newDiv');
const getEls = document.querySelector('#getElements');

// Verifica che gli elementi esistano
if (!container) throw new Error('Container element #mainDiv not found');
if (!button) throw new Error('Button element #newDiv not found');
if (!getEls) throw new Error('Remove button element #remove not found');

console.dir( Space);
console.dir('Tipo di Space:', typeof Space);
console.log('Container:', container);

// Dichiarazione delle variabili
let area : Area;
let select;

const customStyle : CustomStyle = {
  resizable : {
    backgroundColor : 'transparent',
    border : '2px solid white',
    height : '200px',
    width : '300px',
    minHeight: '100px',
    minWidth: '100px'
  }
}

// Inizializzazione dello spazio
// @ts-ignore
const space = new Space(container, customStyle);
console.log('new space created');


getEls.addEventListener('click', () => {
  const els = area.detectElementsUnderArea('default','.wrapper');
  console.log(els)
});

// Listener per creare una nuova area
button.addEventListener('click', () => {

  area = space.createArea();
  console.log('new area created');

  // // Handler per l'evento select
  // select = e => {
  //   const area = e.target;
  //   const resizableEl = area.getResizable();
  //   resizableEl.style.backgroundColor = 'blue';
  // };


  // // Eventi di selezione
  // area.on('select', select);
  // area.on('deselect', e => {
  //   const area = e.target;
  //   const resizableEl = area.getResizable();
  //   resizableEl.style.backgroundColor = 'red';
  // });


  // // Eventi di eliminazione
  // area.on('before-delete', () => {
  //   console.log('before delete');
  // });
  // area.on('after-delete', () => {
  //   console.log('afterdelete');
  // });


  // // Eventi di ridimensionamento
  // area.on('resize', e => {
  //   console.log('resize', e);
  // });
  // area.on('resize-start', e => {
  //   console.log('resize-start', e);
  // });
  // area.on('resize-end', e => {
  //   console.log('resize-end', e);
  // });


  // // Eventi di movimento
  // area.on('move', e => {
  //   console.log('move', e);
  // });
});