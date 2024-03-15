import { customElement } from 'lit/decorators.js';
import { StateProvider } from './StateProvider';
import { TemplateResult, css, html } from 'lit';
import { choose } from 'lit/directives/choose.js';
import { action, makeObservable, observable } from 'mobx';
import { classMap } from 'lit/directives/class-map.js';

function goodMod(i: number, mod: number) {
	return ((i % mod) + mod) % mod;
}

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
			focusedTab: observable,
			config: observable.ref,
			handleClick: action
		});
	}

	config: {
		route: string;
		title: string;
		template: () => TemplateResult<1>;
		disabled?: () => boolean;
	}[] = [];
	activeTab: string = '';
	focusedTab = 0;

	render() {
		return html`
			<nav
				class="tabs is-full"
				@click=${this.handleClick.bind(this)}
				@keydown=${this.handleKeydown.bind(this)}
			>
				${this.config.map(({ route, title, disabled }) => {
					return html`<button
						role="tab"
						aria-controls="tab-panel"
						aria-selected=${route === this.activeTab}
						tabindex=${route === this.activeTab ? 0 : -1}
						data-route=${route}
						class="${classMap({
							active: this.activeTab === route
						})}"
						?disabled=${disabled?.()}
					>
						${title}
					</button> `;
				})}
			</nav>
			<div class="content" id="tab-panel">
				${choose(
					this.activeTab,
					this.config.map(config => {
						return [config.route, config.template];
					})
				)}
			</div>
		`;
	}

	updated() {
		if (
			this.shadowRoot
				?.querySelector(`nav button[data-route="${this.activeTab}"]`)
				?.hasAttribute('disabled')
		) {
			this.activeTab =
				(
					this.shadowRoot?.querySelector(
						'nav button:not([disabled])'
					) as HTMLButtonElement
				)?.dataset.route || '';
		}
	}

	handleKeydown(e: KeyboardEvent) {
		const nodeList = this.shadowRoot?.querySelectorAll(
			'nav button:not([disabled])'
		);

		if (!nodeList) return;

		const tabs = [...nodeList] as HTMLButtonElement[];
		const focusedTab = this.shadowRoot?.querySelector(
			'nav button:focus'
		) as HTMLButtonElement;
		const i = [...tabs].indexOf(focusedTab);

		if (!focusedTab) return;

		if (e.key === 'ArrowRight') {
			const n = goodMod(i + 1, tabs.length);
			tabs[n].focus();
			tabs[n].scrollIntoView({ block: 'nearest' });
		} else if (e.key === 'ArrowLeft') {
			const n = goodMod(i - 1, tabs.length);
			tabs[n].focus();
			tabs[n].scrollIntoView({ block: 'nearest' });
		}
	}

	handleClick(e: PointerEvent & { target: HTMLAnchorElement }) {
		e.stopPropagation();

		if (e.target.hasAttribute('disabled')) {
			return;
		}

		const { route } = e.target.dataset;

		this.activeTab = route!;
	}
}
