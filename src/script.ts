

// import Area from './models/area';
// import Space from './models/space';

// const execute = () => {
//   const container = document.querySelector('#mainDiv') as HTMLElement;
//   const button = document.querySelector('#newDiv');

//   console.log('Space importato:', Space);
//   console.log('Tipo di Space:', typeof Space);
//   console.log('Container:', container);

//   const space = new Space(container);
//   console.log('new space created')

//   button.addEventListener('click', () => {
//     const area = space.createArea();
//     console.log('new area clicked')

//     // // select test 
//     area.on('select', e => {
//       const area = e.target as Area;
//       const resizableEl = area.getResizable() 
//       resizableEl.style.backgroundColor = 'blue';
//     });
//     area.on('deselect', e => {
//       const area = e.target as Area;
//       const resizableEl = area.getResizable() 
//       resizableEl.style.backgroundColor = 'red';
//     });

//     // delete test
//     area.on('before-delete', ()=>{
//       console.log('before delete')
//     })
//     area.on('after-delete', ()=>{
//       console.log('afterdelete')
//     })

//     // resize test
//     area.on('resize', (e)=>{
//       console.log('resize', e)
//     })
//     area.on('resize-start', (e)=>{
//       console.log('resize-start', e)
//     })
//     area.on('resize-end', (e)=>{
//       console.log('resize-end', e)
//     })

//     area.on('move', (e)=>{
//       console.log('move', e)
//     })



//   });


// };

// export default execute;
