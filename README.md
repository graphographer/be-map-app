## Support for Basic Education: Interactive Map

The interactive map is a self-contained application built as a web component.

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

## Deploying

It assumes that the `Source Sans Pro` font face is specified in the document head, with 300, 400, and 600 font weights; and with regular and italic styles.

Building the app as above will emit the IIFE `bootstrapBeApp.js` and an `assets` directory will all the necessary bits and pieces. The IIFE asynchronously fetches various data sources and modules, and finally registers the custom element `be-app`.

Therefore, it should only be necessary to make the contents of the `dist` directory public, relative to the root of the rendering html document. Something like the following should work.

Fun fact! A custom element used in an HTML document will lazily render as soon as the corresponding custom element name has been registered to a web component.

html```

<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Basic Education Support</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300i,400,400i,600,600i" rel="stylesheet" />

  <script src="./bootstrapBeApp.js"></script>
</head>

<body>
  <be-app></be-app>
</body>

</html>
```
