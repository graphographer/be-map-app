import { createContext } from '@lit/context';
import { State } from '../state';

export const stateLitCtx = createContext<State>('state');
