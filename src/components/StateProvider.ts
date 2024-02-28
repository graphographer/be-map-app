import { MobxLitElement } from '@adobe/lit-mobx';
import { computed } from 'mobx';
import { provider } from '../state';

export class StateProvider extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	@computed
	get state() {
		return provider.get();
	}

	disconnectedCallback(): void {
		this.disposers.forEach(dispose => dispose());
	}
}
