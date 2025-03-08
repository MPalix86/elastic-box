// @ts-nocheck
import { style, keyframes } from 'typestyle';

// Definizione delle interfacce per gli stili personalizzabili
export interface CustomStyle {
  resizable?: Partial<ResizableStyle>;
  areaOptions?: Partial<AreaOptionsStyle>;
  deleteButton?: Partial<ButtonStyle>;
  confirmButton?: Partial<ButtonStyle>;
}

interface ResizableStyle {
  width?: string;
  height?: string;
  top?: string;
  left?: string;
  position?: string;
  border?: string;
  backgroundColor?: string;
  borderRadius?: string;
  minHeight?: string
  minWidth?: string
}

interface AreaOptionsStyle {
  top?: string;
  left?: string;
  position?: string;
  backgroundColor?: string;
  border?: string;
  height?: string;
  width?: string;
  cursor?: string;
  textContent?: string;
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

export default function createStyles(customTheme: CustomStyle = {}) {
  // Stili specifici per ogni elemento con personalizzazione
  return {
    elements: {
      resizable: {
        style: style({
          width: customTheme.resizable?.width || '400px',
          height: customTheme.resizable?.height || '200px',
          top: customTheme.resizable?.top || '0px',
          left: customTheme.resizable?.left || '0px',
          position: customTheme.resizable?.position || 'absolute',
          border: customTheme.resizable?.border || '1px solid #ccc',
          backgroundColor: customTheme.resizable?.backgroundColor || '#f0f0f0',
          borderRadius: customTheme.resizable?.borderRadius || '0px',
          minHeight: customTheme.resizable?.minHeight || '20px',
          minWidth?: customTheme.resizable?.minWidth || '20px'
          // Altre proprietà personalizzabili qui
        }),
      },

      areaOptions: {
        textContent: customTheme.areaOptions?.textContent || 'Drag',
        style: style({
          top: customTheme.areaOptions?.top || '-30px',
          left: customTheme.areaOptions?.left || '0',
          position: customTheme.areaOptions?.position || 'absolute',
          backgroundColor: customTheme.areaOptions?.backgroundColor || 'transparent',
          border: customTheme.areaOptions?.border || '0px',
          height: customTheme.areaOptions?.height || '22px',
          width: customTheme.areaOptions?.width || '100px',
          cursor: customTheme.areaOptions?.cursor || 'default',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '10px',
        }),
      },

      deleteButton: {
        textContent: customTheme.deleteButton?.textContent || 'X',
        style: style({
          ...baseButtonStyle,
          left: customTheme.deleteButton?.left || '2px',
          top: customTheme.deleteButton?.top || '0px',
          width: customTheme.deleteButton?.width || '24px',
          height: customTheme.deleteButton?.height || '24px',
          backgroundColor: customTheme.deleteButton?.backgroundColor || '#ff3333',
          color: customTheme.deleteButton?.color || 'white',
          border: customTheme.deleteButton?.border || 'none',
          borderRadius: customTheme.deleteButton?.borderRadius || '4px',
          fontSize: customTheme.deleteButton?.fontSize || '14px',
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

      confirmButton: {
        textContent: customTheme.confirmButton?.textContent || '✓',
        style: style({
          ...baseButtonStyle,
          left: customTheme.confirmButton?.left || '30px',
          top: customTheme.confirmButton?.top || '0px',
          width: customTheme.confirmButton?.width || '24px',
          height: customTheme.confirmButton?.height || '24px',
          backgroundColor: customTheme.confirmButton?.backgroundColor || '#2ecc71',
          color: customTheme.confirmButton?.color || 'white',
          border: customTheme.confirmButton?.border || 'none',
          borderRadius: customTheme.confirmButton?.borderRadius || '4px',
          fontSize: customTheme.confirmButton?.fontSize || '14px',
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
}
