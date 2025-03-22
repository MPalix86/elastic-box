// @ts-nocheck
import { style, keyframes } from 'typestyle';

// ----- CONFIRM ANIMATION -----

// Animazione keyframe per la conferma
const confirmAnimation = keyframes({
  '0%': {
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
    transform: 'scale(1)',
  },
  '50%': {
    boxShadow: '0 0 15px rgba(100, 100, 100, 0.5)',
    transform: 'scale(1.02)',
  },
  '100%': {
    boxShadow: '0 0 2px rgba(80, 80, 80, 0.3)',
    transform: 'scale(1)',
  },
});

// Definizione dell'animazione di shake
const shakeAnimation = keyframes({
  '0%': { transform: 'translateX(0)' },
  '10%': { transform: 'translateX(-10px)' },
  '20%': { transform: 'translateX(10px)' },
  '30%': { transform: 'translateX(-8px)' },
  '40%': { transform: 'translateX(8px)' },
  '50%': { transform: 'translateX(-5px)' },
  '60%': { transform: 'translateX(5px)' },
  '70%': { transform: 'translateX(-3px)' },
  '80%': { transform: 'translateX(3px)' },
  '90%': { transform: 'translateX(-1px)' },
  '100%': { transform: 'translateX(0)' }
});

// Classe per l'animazione di shake con bordo rosso
const errorShakeKeyframeClass = style({
  animation: `${shakeAnimation} 0.8s ease-in-out`,
  animationIterationCount: '1',
  border: '3px solid #ff3333 !important',
});

// Classe per conferma con transizione
const confirmClass = style({
  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
});

// Stato attivo della transizione
const confirmActiveClass = style({
  boxShadow: '0 0 2px rgba(80, 80, 80, 0.3)',
});

// Animazione keyframe per la conferma
const confirmKeyframeClass = style({
  animation: `${confirmAnimation} 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards`,
});

// ----- FADE OUT ANIMATION -----
// Crea l'animazione di fade out
const fadeOutAnimation = keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(1)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(0.8)',
  },
});

// Classe base con proprietà iniziali e definizione della transizione
const fadeOutClass = style({
  opacity: 1,
  transform: 'scale(1)',
  transition: 'opacity 0.1s ease-out, transform 0.3s ease-out',
});

// Classe per l'animazione attiva - questa viene applicata per attivare la transizione
const fadeOutActiveClass = style({
  opacity: 0,
  transform: 'scale(0.8)',
});

// Classe per l'animazione usando keyframes
const fadeOutKeyframeClass = style({
  animation: `${fadeOutAnimation} 0.1s ease-out forwards`,
});

// ----- SHRINK ANIMATION -----
// Crea l'animazione di shrink
const shrinkAnimation = keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(1)',
    maxHeight: '500px',
    margin: '10px',
  },
  '70%': {
    opacity: 0.3,
    maxHeight: '0px',
    margin: '0px',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(0)',
    maxHeight: '0px',
    margin: '0px',
  },
});

// Classe base per shrink
const shrinkClass = style({
  overflow: 'hidden',
  transformOrigin: 'center',
  opacity: 1,
  transform: 'scale(1)',
  maxHeight: '500px',
  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
});

// Classe attiva per shrink
const shrinkActiveClass = style({
  opacity: 0,
  transform: 'scale(0)',
  maxHeight: '0px',
  padding: '0px',
  margin: '0px',
});

// Classe per l'animazione usando keyframes
const shrinkKeyframeClass = style({
  animation: `${shrinkAnimation} 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`,
});

// Definisci l'oggetto transitions con tutti i tipi di animazione
const transitions = {
  // La transizione di fade out
  fadeOut: {
    base: fadeOutClass,
    active: fadeOutActiveClass,
  },
  fadeOutKeyframe: fadeOutKeyframeClass,

  // La transizione di shrink
  shrink: {
    base: shrinkClass,
    active: shrinkActiveClass,
  },
  shrinkKeyframe: shrinkKeyframeClass,
  
  // La transizione di conferma
  confirm: {
    base: confirmClass,
    active: confirmActiveClass,
  },
  confirmKeyframe: confirmKeyframeClass,
  
  // Animazione di errore (shake)
  errorShakeKeyframe: errorShakeKeyframeClass,
};

export default transitions;