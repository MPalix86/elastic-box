// @ts-nocheck
import { style, keyframes } from 'typestyle';

// Definizione delle animazioni
const deleteGlowAnimation = keyframes({
  '0%': { boxShadow: '0 0 5px rgba(255, 51, 51, 0.5)' },
  '50%': { boxShadow: '0 0 15px rgba(255, 51, 51, 0.8)' },
  '100%': { boxShadow: '0 0 5px rgba(255, 51, 51, 0.5)' },
});

const confirmGlowAnimation = keyframes({
  '0%': { boxShadow: '0 0 5px rgba(46, 204, 113, 0.5)' },
  '50%': { boxShadow: '0 0 15px rgba(46, 204, 113, 0.8)' },
  '100%': { boxShadow: '0 0 5px rgba(46, 204, 113, 0.5)' },
});

// Stili di base per elementi riutilizzabili
const baseButtonStyle = {
  position: 'absolute',
  top: '0px',
  width: '24px',
  height: '24px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

// Stili specifici per ogni elemento
const styles = {
  elements: {
    resizable: {
      style: style({
        width: '400px',
        height: '200px',
        top: '0px',
        left: '0px',
        position: 'absolute',
        border: '1px solid #ccc',
        backgroundColor: '#f0f0f0',
      }),
    },

    areaOptions: {
      textContent: 'Drag',
      style: style({
        top: '-30px',
        left: '0',
        position: 'absolute',
        backgroundColor: 'transparent',
        border: '0px',
        height: '22px',
        width: '100px',
        cursor: 'default',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px',
      }),
    },

    deleteButton: {
      textContent: 'X',
      style: style({
        ...baseButtonStyle,
        left: '2px',
        backgroundColor: '#ff3333',
        color: 'white',
        $nest: {
          '&:hover': {
            backgroundColor: '#ff5555',
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
          },
          '&:active': {
            backgroundColor: '#cc0000',
            transform: 'translateY(1px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            animationName: deleteGlowAnimation,
            animationDuration: '0.3s',
            animationTimingFunction: 'ease',
          },
        },
      }),
    },

    //
    confirmButton: {
      textContent: '✓',
      style: style({
        ...baseButtonStyle,
        left: '30px', // Corretto il valore mancante e aggiunto spazio tra i pulsanti
        backgroundColor: '#2ecc71',
        color: 'white',
        $nest: {
          '&:hover': {
            backgroundColor: '#3ee686',
            transform: 'translateY(-1px)',
            boxShadow: '0 3px 5px rgba(0, 0, 0, 0.3)',
          },
          '&:active': {
            backgroundColor: '#27ae60',
            transform: 'translateY(1px)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            animationName: confirmGlowAnimation,
            animationDuration: '0.3s',
            animationTimingFunction: 'ease',
          },
        },
      }),
    },
  },
};

export default styles;
