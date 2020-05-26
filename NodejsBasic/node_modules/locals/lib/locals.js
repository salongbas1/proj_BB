/*
 * locals - A Locals Middleware
 * LICENSE: MIT
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Active 9 LLC.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 */

var fs = require("fs"),
    path = require("path");

function locals(options) {
	this.localsdir = "";
	this.baselanguage = "";
	this.resultlanguage = "";
	this.localize = [];
	this.languages = [];
	this.translations = [];

	if (options.localsdir) this.localsdir = options.localsdir;
	if (options.baselanguage) this.baselanguage = options.baselanguage;
	if (options.resultlanguage) this.resultlanguage = options.resultlanguage;

	this.init = function(fn,localdir) {
		if(typeof localdir !="undefined") {
			this.loadcals(localdir);
		} else {
			this.loadcals(options.localsdir);
		}
		fn();
	};

	this.loadcals = function(localdir) {
		var files = fs.readdirSync(path.resolve(localdir));

			files.map(function (file) {
				return path.join(localdir, file);
			}).filter(function (file) {
				return fs.statSync(file).isDirectory();
			}).forEach(function (file) {
				var lang = path.basename(file);
				this.languages.push(lang);
				var lfiles = fs.readdirSync(path.resolve(localdir +'/'+ lang));

					lfiles.map(function (lfile) {
						return path.join(localdir +'/'+ lang, lfile);
					}).filter(function (lfile) {
						return fs.statSync(lfile).isFile();
					}).forEach(function (lfile) {
						lfile = path.basename(lfile);
						var dialect = ""+lfile+"";
						dialect = dialect.replace('.json','');
						var translation = require(localdir +'/'+ lang +'/'+ lfile);
						if (typeof this.translations[lang] =="undefined") {
							this.translations[lang] = {};
						}
						if (typeof this.translations[lang][dialect] =="undefined") {
							this.translations[lang][dialect] = {};
						}
						this.translations[lang][dialect] = translation;
						this.localize[this.languages] = this.translations;
					});
			});

	};

	this.local = function(lang) {
		this.resultlanguage = lang;
	};

	this.translate = function (data, toLanguage) {
		if (typeof toLanguage =="undefined") {
			toLanguage = this.resultlanguage;
		}
		if (typeof this.translations[this.baselanguage][toLanguage] !="undefined") {
			return this.translations[this.baselanguage][toLanguage][data];
		} else {
			return data;
		}
	};

	return this;
}

module.exports = locals;