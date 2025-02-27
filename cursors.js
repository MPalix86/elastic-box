const Cursors = Object.freeze({
  DEFAULT: 'default', // Puntatore predefinito (freccia)
  POINTER: 'pointer', // Mano per link o elementi cliccabili
  TEXT: 'text', // Testo selezionabile (I-cursor)
  WAIT: 'wait', // Icona di attesa (clessidra o cerchio)
  HELP: 'help', // Punto interrogativo per indicazioni
  MOVE: 'move', // Frecce incrociate per movimento
  CROSSHAIR: 'crosshair', // Mirino
  NOT_ALLOWED: 'not-allowed', // Azione non permessa (simbolo di divieto)
  NONE: 'none', // Nessun cursore
  PROGRESS: 'progress', // Azione in corso (ma ancora cliccabile)
  CELL: 'cell', // Simbolo di cella di tabella
  CONTEXT_MENU: 'context-menu', // Menu contestuale
  ALIAS: 'alias', // Cursore per alias o collegamento
  COPY: 'copy', // Cursore di copia
  GRAB: 'grab', // Cursore per presa
  GRABBING: 'grabbing', // Cursore per trascinamento attivo
  ZOOM_IN: 'zoom-in', // Cursore per ingrandire
  ZOOM_OUT: 'zoom-out', // Cursore per ridurre

  // Cursori di resize
  COL_RESIZE: 'col-resize', // Ridimensionamento colonne
  ROW_RESIZE: 'row-resize', // Ridimensionamento righe
  EW_RESIZE: 'ew-resize', // Ridimensionamento orizzontale (sinistra-destra)
  NS_RESIZE: 'ns-resize', // Ridimensionamento verticale (alto-basso)
  NESW_RESIZE: 'nesw-resize', // Ridimensionamento diagonale ↘
  NWSE_RESIZE: 'nwse-resize', // Ridimensionamento diagonale ↙
  N_RESIZE: 'n-resize', // Ridimensionamento verso nord (su)
  S_RESIZE: 's-resize', // Ridimensionamento verso sud (giù)
  E_RESIZE: 'e-resize', // Ridimensionamento verso est (destra)
  W_RESIZE: 'w-resize', // Ridimensionamento verso ovest (sinistra)
  NE_RESIZE: 'ne-resize', // Ridimensionamento verso nord-est ↗
  NW_RESIZE: 'nw-resize', // Ridimensionamento verso nord-ovest ↖
  SE_RESIZE: 'se-resize', // Ridimensionamento verso sud-est ↘
  SW_RESIZE: 'sw-resize', // Ridimensionamento verso sud-ovest ↙

  // Cursori aggiuntivi
  VERTICAL_TEXT: 'vertical-text', // Testo verticale
  ALL_SCROLL: 'all-scroll', // Frecce incrociate in tutte le direzioni
  NO_DROP: 'no-drop', // Azione di rilascio non consentita
  NOT_ALLOWED: 'not-allowed' // Divieto
});

let blockCursor = false;

function changeCursor(c) {
  if (Object.values(Cursors).includes(c)) {
    if (!blockCursor) document.body.style.cursor = c;
  } else {
    console.warn(`Valore non valido per il cursore: ${c}`);
  }
}
