// @ts-nocheck
import { style, keyframes } from 'typestyle';

// Definizione delle interfacce per gli stili personalizzabili
export interface DrawableCustomStyle {
  drawable?: Partial<DrawableStyle>;
}

// Interfaccia semplificata per lo stile dell'area disegnabile
interface DrawableStyle {
  border?: string;
  backgroundColor?: string;
  borderRadius?: string;
  opacity?: string;
  zIndex?: string;
}

// Definizione delle animazioni
const creationAnimation = keyframes({
  '0%': { opacity: '0.2' },
  '100%': { opacity: '0.6' },
});

export default function createDrawableStyles(customTheme: DrawableCustomStyle = {}) {
  // Stile di base per l'area disegnabile
  const drawableStyle = {
    position: 'absolute', // Questo è fisso, non personalizzabile
    border: customTheme.drawable?.border ||  '2px dashed ',
    backgroundColor: customTheme.drawable?.backgroundColor || 'rgba(52, 152, 219, 0.2)',
    borderRadius: customTheme.drawable?.borderRadius || '0px',
    opacity: customTheme.drawable?.opacity || '0.6',
    zIndex: customTheme.drawable?.zIndex || '100',
    transition: 'opacity 0.2s ease',
    animationName: creationAnimation,
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-out',
    boxSizing: 'border-box',
    // Le proprietà di dimensione e posizione non sono incluse qui
    // perché vengono gestite dinamicamente dal codice di disegno
  };

  // Return solo lo stile di base, senza elementi aggiuntivi
  return {
    elements: {
      drawable: {
        style: drawableStyle,
        class: style(drawableStyle),
      }
    },
  };
}