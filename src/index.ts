


// Nel file index.js della tua libreria
import Space from './models/space';
import Area from './models/area';
import { ResizableCustomStyle } from './styles/resizable-area-style';
import { DrawableSetupOptions, ResizabelSetupOptions } from './types/area-types';
import { DrawableCustomStyle } from './styles/drawable-area-style';
import DrawableArea from "./models/drawable-area"
import { DrawableAreaEvents } from './types/area-types';
import { AreaEvents } from './types/area-types';

// Esportazione corretta per evitare l'oggetto default annidato
export { Space, Area , ResizableCustomStyle, DrawableSetupOptions, DrawableCustomStyle, DrawableArea, DrawableAreaEvents, AreaEvents, ResizabelSetupOptions};
