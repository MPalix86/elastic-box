// @ts-nocheck
import { style, keyframes } from 'typestyle';

// Definizione delle interfacce per gli stili personalizzabili
export interface ResizableCustomStyle {
  resizable?: Partial<ResizableStyle>;
  areaOptions?: Partial<AreaOptionsStyle>;
  deleteButton?: Partial<ButtonStyle>;
  confirmButton?: Partial<ButtonStyle>;
}

interface ResizableStyle {
  width?: string;
  height?: string;
  position?: string;
  border?: string;
  backgroundColor?: string;
  borderRadius?: string;
  minHeight?: string;
  minWidth?: string;
  left?: string;
  top?: string;
}

interface AreaOptionsStyle {
  position?: 'vertical' | 'horizontal';
  backgroundColor?: string;
  border?: string;
  cursor?: string;
}

interface ButtonStyle {
  position?: string;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  color?: string;
  border?: string;
  borderRadius?: string;
  cursor?: string;
  fontSize?: string;
  fontWeight?: string;
  textContent?: string;
}

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

export default function createResizableStyles(customTheme: ResizableCustomStyle = {}): any {
  // Imposta il valore predefinito per position se non è definito
  const optionsPosition = customTheme.areaOptions?.position || 'horizontal';

  // Resizable component styles
  const resizableStyle = {
    width: customTheme.resizable?.width || '400px',
    height: customTheme.resizable?.height || '200px',
    top: customTheme.resizable?.top || '0px',
    left: customTheme.resizable?.left || '0px',
    position: customTheme.resizable?.position || 'absolute',
    border: customTheme.resizable?.border || '3px solid red',
    backgroundColor: customTheme.resizable?.backgroundColor || 'transparent',
    borderRadius: customTheme.resizable?.borderRadius || '0px',
    minHeight: customTheme.resizable?.minHeight || '20px',
    minWidth: customTheme.resizable?.minWidth || '20px',
  };

  // Area options styles
  const horizontalAreaOptionsStyle = {
    top: '-30px',
    left: '0',
    position: 'absolute',
    backgroundColor: customTheme.areaOptions?.backgroundColor || 'transparent',
    border: customTheme.areaOptions?.border || '0px',
    height: '22px',
    width: '100px',
    cursor: customTheme.areaOptions?.cursor || 'default',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
  };

  const verticalAreaOptionsStyle = {
    top: '0',
    right: '-40px', // Posiziona l'area di opzioni a destra dell'elemento
    position: 'absolute',
    backgroundColor: customTheme.areaOptions?.backgroundColor || 'transparent',
    border: customTheme.areaOptions?.border || '0px',
    height: '100%', // Altezza al 100% per coprire tutta l'altezza dell'area
    width: '30px', // Larghezza ridotta per ospitare solo i pulsanti
    cursor: customTheme.areaOptions?.cursor || 'default',
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'column', // Disposizione verticale degli elementi
    alignItems: 'center',
    justifyContent: 'flex-start', // Inizia dall'alto
    paddingTop: '10px', // Padding superiore invece che a sinistra
  };

  // Seleziona lo stile dell'area opzioni in base alla posizione
  const areaOptionsStyle = optionsPosition === 'vertical' 
    ? verticalAreaOptionsStyle 
    : horizontalAreaOptionsStyle;

  // Stili dei pulsanti in base all'orientamento
  // Per layout orizzontale, i pulsanti sono uno accanto all'altro
  // Per layout verticale, i pulsanti sono uno sotto l'altro
  const deleteButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: customTheme.deleteButton?.backgroundColor || '#ff3333',
    color: customTheme.deleteButton?.color || 'white',
    border: customTheme.deleteButton?.border || 'none',
    borderRadius: customTheme.deleteButton?.borderRadius || '4px',
    fontSize: customTheme.deleteButton?.fontSize || '14px',
    width: customTheme.deleteButton?.width || '24px',
    height: customTheme.deleteButton?.height || '24px',
    // Posizionamento condizionale in base all'orientamento
    ...(optionsPosition === 'vertical' 
      ? { 
          left: customTheme.deleteButton?.left || '3px',
          top: customTheme.deleteButton?.top || '5px'
        }
      : { 
          left: customTheme.deleteButton?.left || '2px',
          top: customTheme.deleteButton?.top || '0px'
        }
    ),
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
  };

  // Confirm button styles
  const confirmButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: customTheme.confirmButton?.backgroundColor || '#2ecc71',
    color: customTheme.confirmButton?.color || 'white',
    border: customTheme.confirmButton?.border || 'none',
    borderRadius: customTheme.confirmButton?.borderRadius || '4px',
    fontSize: customTheme.confirmButton?.fontSize || '14px',
    width: customTheme.confirmButton?.width || '24px',
    height: customTheme.confirmButton?.height || '24px',
    // Posizionamento condizionale in base all'orientamento
    ...(optionsPosition === 'vertical' 
      ? { 
          left: customTheme.confirmButton?.left || '3px',
          top: customTheme.confirmButton?.top || '34px'
        }
      : { 
          left: customTheme.confirmButton?.left || '30px',
          top: customTheme.confirmButton?.top || '0px'
        }
    ),
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
  };

  // Return the final object with separated style object and style function
  return {
    elements: {
      resizable: {
        style: resizableStyle,
        class: style(resizableStyle),
      },
      
      areaOptions: {
        textContent: customTheme.areaOptions?.textContent || 'Drag',
        style: areaOptionsStyle,
        class: style(areaOptionsStyle),
      },

      deleteButton: {
        textContent: customTheme.deleteButton?.textContent || 'X',
        style: deleteButtonStyle,
        class: style(deleteButtonStyle),
      },

      confirmButton: {
        textContent: customTheme.confirmButton?.textContent || '✓',
        style: confirmButtonStyle,
        class: style(confirmButtonStyle),
      },
    },
  };
}