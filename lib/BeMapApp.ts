import { provide } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { configure } from 'mobx';
import { bootstrapBeMapApp } from '../src/app/bootstrapBeMapApp';
import { BeApp } from '../src/components/BeApp';
import { stateLitCtx } from '../src/components/stateLitCtx';
import { State } from '../src/state';

configure({ enforceActions: 'never' });

@customElement('be-map-app')
export class BeMapApp extends BeApp {
	@provide({ context: stateLitCtx })
	@property({ attribute: false })
	protected _state!: State;

	constructor() {
		super();
		bootstrapBeMapApp().then(state => {
			console.log('HERE?', state);
			this.state = state;
			this._state = state!;
		});
	}
}
