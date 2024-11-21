import { MobxLitElement } from '@adobe/lit-mobx';
import { consume } from '@lit/context';
import { CSSResult } from 'lit';
import { stateLitCtx } from './stateLitCtx';
import { shadowDom } from './styles';
import { State } from '../state';

export class AppBase extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	static styles: CSSResult[] = [shadowDom];

	@consume({ context: stateLitCtx })
	state: State = new State();

	disconnectedCallback(): void {
		this.disposers.forEach(dispose => dispose());
	}
}
