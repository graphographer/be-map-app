import '@material/web/icon/icon';
import '@material/web/tabs/primary-tab';
import '@material/web/tabs/tabs';
import './BeMap';

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { observable } from 'mobx';
import { StateProvider } from './StateProvider';
import { shadowDom } from './styles';

@customElement('be-map-app')
export class BeMapApp extends StateProvider {
	static styles = [
		shadowDom,
		css`
			:host {
				--md-ref-typeface-brand: 'Source Sans Pro', sans-serif;
				--md-ref-typeface-plain: 'Source Sans Pro', sans-serif;
				--md-sys-color: var(--rich-black);
				--md-sys-color-primary: var(--web-blue);
				--md-sys-color-surface: var(--light-gray);
			}
		`
	];

	@observable
	selectedTab: string = 'videos';

	render() {
		return html` 
			<main>
				<h1>BE Map Refresh</h1>

				<section>
					<be-map></be-map>
				</section>

				<section>
					<md-tabs aria-label="Content to view" @change=${(e: any) =>
						console.log(e.target.activeTabIndex)}>
						<md-primary-tab id="photos-tab" aria-controls="photos-panel">
							Data View A
						</md-primary-tab>
						<md-primary-tab id="videos-tab" aria-controls="videos-panel">
							Data View B
						</md-primary-tab>
						<md-primary-tab id="music-tab" aria-controls="music-panel">
							Data View C
						</md-primary-tab>
					</md-tabs>
				</section>

				<section>
					<pre></code>${JSON.stringify(this.state.data, null, 2)}</code></pre>
				</section>
			</main>`;
	}
}
