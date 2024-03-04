import { MobxLitElement } from '@adobe/lit-mobx';
import { provider } from '../state';
import { computed, makeObservable } from 'mobx';
import { CSSResult } from 'lit';
import { shadowDom } from './styles';

export class StateProvider extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	static styles: CSSResult[] = [shadowDom];

	constructor() {
		super();

		makeObservable(this, { state: computed });
	}

	get state() {
		return provider.get();
	}

	disconnectedCallback(): void {
		this.disposers.forEach(dispose => dispose());
	}
}
