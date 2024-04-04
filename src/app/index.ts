import { html, render } from 'lit';
import './bootstrapBeApp';

render(
	html`
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossorigin="anonymous"
		/>
		<link
			href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i"
			rel="stylesheet"
		/>
	`,
	document.head
);
