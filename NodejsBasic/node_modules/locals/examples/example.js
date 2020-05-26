var locals = require('../index.js')({
	localsdir: "../locals",
	baselanguage: "en"
});
locals.init(function() {
	locals.local('es');
	var translatedText = locals.translate("Hello World");

	console.log("Translation:", translatedText);

	locals.local('de');
	var translatedText = locals.translate("Hello World");

	console.log("Translation 2:", translatedText);
});