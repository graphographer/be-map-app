import { customElement } from 'lit/decorators.js';
import { BeApp } from '../src/components/BeApp';
import { bootstrapBeMapApp } from '../src/app/bootstrapBeMapApp';

@customElement('be-map-app')
export class BeMapApp extends BeApp {
	protected async scheduleUpdate(): Promise<void> {
		await bootstrapBeMapApp();
		super.scheduleUpdate();
	}
}
