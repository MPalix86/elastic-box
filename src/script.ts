
import Space from './models/space';

const execute = () => {
  const container = document.querySelector('#mainDiv') as HTMLElement;
  const button = document.querySelector('#newDiv');

  console.log('Space importato:', Space);
  console.log('Tipo di Space:', typeof Space);
  console.log('Container:', container);

  const space = new Space(container);
  console.log('new space created')

  button.addEventListener('click', () => {
    space.createArea();
    console.log('new area clicked')
    // area.on('select', e => {
    //   const area = e.target as Area;
    //   const resizableEl = area.getResizable() 
    //   resizableEl.style.backgroundColor = 'blue';
    // });


    // area.on('deselect', e => {
    //   const area = e.target as Area;
    //   const resizableEl = area.getResizable() 
    //   resizableEl.style.backgroundColor = 'red';
    // });


    // area.on('before-delete', ()=>{
    //   console.log('before delete')
    // })


    // area.on('after-delete', ()=>{
    //   console.log('after delete')
    // })

  });


};

export default execute;
