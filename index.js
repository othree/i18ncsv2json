#!/usr/bin/env node

var program = require('commander');


program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-p, --path [value]', 'output path, default: out', 'out')
  .option('-d, --delimeter [value]', 'delimeter between filename and lang', '.')
  .option('-t, --transpose', 'transpose input csv file')
  .option('-r, --readEncoding [value]', 'encoding to use to read files')
  .option('-w, --writeEncoding [value]', 'encoding to use to write files')
  .parse(process.argv);

var file = program.args[0];

if (!file) {
   console.error('no csv file is given!');
   process.exit(1);
}

var title = file.split('.').slice(0, -1).join('.');

var fs = require('fs');
var parse = require('csv-parse');

const readOptions = (program.readEncoding ? { 'encoding': program.readEncoding } : null);
const writeOptions = (program.writeEncoding ? { 'encoding': program.writeEncoding } : null);

fs.readFile(file, readOptions, function (err, content) {
  if (err) {
     console.error('file is not readable!');
     process.exit(1);
  }

  parse(content, function (err, trans) {
    if (program.transpose) {
      trans = require("lodash-transpose").transpose(trans);
    }

    var o_langs = trans.shift();
    o_langs.shift();

    var langs = o_langs.slice();
    var lang = '';

    var buffer = {};

    while (lang = langs.shift()) {
      lang = lang.toLowerCase();
      buffer[lang] = {};
    }

    var entry = [];
    var key = '';

    var objectPath = require('object-path');

    while (entry = trans.shift()) {
      key = entry.shift();

      langs = o_langs.slice();
      while (v = entry.shift(), lang = langs.shift()) {
        lang = lang.toLowerCase();
        objectPath.set(buffer[lang], key, v);
      }
    }

    var path = require('path')
    var p = path.join(program.path);

    require('mkdirp')(p);

    var target_file = '';
    var target = '';

    langs = o_langs.slice();
    while (lang = langs.shift()) {
      lang = lang.toLowerCase();
      target = [title, lang].join(program.delimeter);
      target = [target, 'json'].join('.');

      target_file = path.join(p, target);

      console.log(target_file)
      fs.writeFile(target_file, JSON.stringify(buffer[lang], null, 2), writeOptions);
    }

  });
});
