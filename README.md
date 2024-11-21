## Support for Basic Education: Interactive Map

The interactive map is a self-contained application built as a web component.

## Deploying

In order to simplify the deployment process, the app is completely self-contained with respect to its dependencies and data. This makes it a pretty hefty 1.2MB gzipped. But then, it is an interactive map and data visualization, so this is to be expected.

To use it, it should only be necessary to link to distribution format of your choice (ES, UMD, IIFE) in your document, and use the custom tagname, `be-map-app`.

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Basic Education Support</title>

		<script defer src="./BeMapApp.umd.js"></script>
	</head>

	<body>
		<be-map-app></be-map-app>
	</body>
</html>
```

Fun fact! A custom element used in an HTML document will lazily render as soon as the corresponding custom element name has been registered to a web component.

## To Develop

```
> npm i [this only needs to be done once after cloning, or if node_modules has been removed or otherwise sullied]
> npm run dev
```

## Building

The app must first be built:

```
> npm i
> npm run build
```

The output is written to `dist`.

## To Do

Externalize dependencies (such as Lit and MobX) only for the ES build. The reasoning is that modules are more appropriately for use in a more complex application toolchain, and so bundling and minifying are best left to the developer.
