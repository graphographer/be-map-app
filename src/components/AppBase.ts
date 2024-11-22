import { MobxLitElement } from '@adobe/lit-mobx';
import { consume } from '@lit/context';
import { CSSResult, html } from 'lit';
import { State } from '../state';
import { stateLitCtx } from './stateLitCtx';
import { shadowDom } from './styles';

export class AppBase extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	static styles: CSSResult[] = [shadowDom];

	@consume({ context: stateLitCtx, subscribe: true })
	state?: State;

	disconnectedCallback(): void {
		this.disposers.forEach(dispose => dispose());
	}
}
