# Locals
![Locals](https://raw.githubusercontent.com/active9/locals/master/locals.png)

A Localization Middleware For NodeJS

#Installing
```bash
npm install locals --save
```

#LOCALS
Locals currently only supports translations but in the future will support many more features. (see TODO).

#USING
To use locals within your application or module you can use the following javascript example:
```javascript
var locals = require('locals')({
	localsdir: "../locals",
	baselanguage: "en"
});
locals.init(function() {
	locals.local('es');
	var translatedText = locals.translate("Hello World");
	console.log("Translation:", translatedText);
});
```

#Introduction
Locals utilizes a Folder and Json based hierarchy for loading and translating locale data. Locale data can then be used to translate text from a given language to any other given language. Locals uses the 2 digit ISO standard for language designation. All locals are created manually by the author as only a basic local demonstration set has been added to this release.

#Locals Structure
Locals uses folders to load locale data. The follow folder structure is used in creation of a base language to translate from:
```bash
./locals/en
./locals/de
./locals/fr
```
Where each language folder is a 2 digit ISO representation of the main language to translate from.

Each locale folder may contain any other 2 digit ISO representation of a secondary language to translate to represented as a json file:
```bash
./locals/en/de.json
./locals/en/en.json
./locals/en/es.json
```
Where each json file represents the locale to translate to from the parent folders locale.

For direct reference see the examples folder within the package or on github.

#TODO

- Distance Lookups
- Geo Targeting
- Planetary Data Locations
- Triangulation
- Currency Conversions

#CONTRIBUTING

We encourage forking. Feel free to fork & pull your new additions, or bug fixes.

##LICENSE
MIT

