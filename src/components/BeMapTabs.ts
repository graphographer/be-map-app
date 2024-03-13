import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { TemplateResult, css, html } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { action, makeObservable, observable } from 'mobx';
import { classMap } from 'lit/directives/class-map.js';

@customElement('be-map-tabs')
export class BeMapTabs extends StateProvider {
	static styles = [
		...super.styles,
		css`
			nav {
				margin-bottom: 2rem;
			}
		`
	];

	constructor() {
		super();

		makeObservable(this, {
			activeTab: observable,
			config: observable.ref,
			handleClick: action
		});
	}

	config: {
		route: string;
		title: string;
		template: () => TemplateResult<1>;
	}[] = [];
	activeTab: string = '';

	render() {
		return html`
			<nav class="tabs is-full" @click=${this.handleClick.bind(this)}>
				${this.config.map(({ route, title }) => {
					return html`<a
						href="#${route}"
						class="${classMap({
							active: this.activeTab === route
						})}"
						>${title}</a
					>`;
				})}
			</nav>
			<div class="content">
				${choose(
					this.activeTab,
					this.config.map(config => {
						return [config.route, config.template];
					})
				)}
			</div>
		`;
	}

	handleClick(e: PointerEvent & { target: HTMLAnchorElement }) {
		e.stopPropagation();
		const { hash } = new URL(e.target.href);
		this.activeTab = hash.slice(1);
	}
}
