import { observable } from 'mobx';
import { State } from './State';

export { State } from './State';
export const provider = observable.box<State>(new State());
