#!/usr/bin/env node

var program = require('commander');


program
  .version('0.0.1')
  .usage('[options] <paths ...>')
  .option('-p, --path [value]', 'output path, default: out', 'out')
  .option('-d, --delimeter [value]', 'delimeter between filename and lang', '.')
  .option('-e, --extension [value]', 'extension of files to take in account when specifying a directory path')
  .option('-f, --fieldDelimiter [value]', 'delimiter between fields', ',')
  .option('-m, --merge ', 'merge all csv files into a single json file')
  .option('-t, --transpose', 'transpose input csv file')
  .option('-r, --readEncoding [value]', 'encoding to use to read files')
  .option('-w, --writeEncoding [value]', 'encoding to use to write files')
  .parse(process.argv);

if (program.args.length === 0) {
  console.error('No path provided as argument!');
  process.exit(1);
}


var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');
var objectPath = require('object-path');
var merge = require('lodash.merge');

let previousLangData = {};

const parseOptions = { 'delimiter': program.fieldDelimiter || ',' };

const readOptions = (program.readEncoding ? { 'encoding': program.readEncoding } : null);
const writeOptions = (program.writeEncoding ? { 'encoding': program.writeEncoding } : null);

program.args.forEach((argPath) => {
  let pathFiles;
  try {
    pathFiles = fs.readdirSync(argPath)
      .filter((fileName) => !program.extension || new RegExp(program.extension + '$').test(fileName))
      .map((fileName) => path.join(argPath, fileName));
  } catch (err) {
    pathFiles = [argPath];
  }
  if (pathFiles.length === 0) {
    console.error('No file in path: ', argPath);
    process.exit(1);
  }
  pathFiles.forEach((file) => {
    let content;
    try {
      content = fs.readFileSync(file, readOptions);

    } catch (err) {
      console.error('File ' + file + ' is not readable!', err);
      process.exit(1);
    }
    parse(content, parseOptions, (err, trans) => {
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

      while (entry = trans.shift()) {
        key = entry.shift();

        langs = o_langs.slice();
        while (v = entry.shift(), lang = langs.shift()) {
          lang = lang.toLowerCase();
          objectPath.set(buffer[lang], key, v);
        }
      }

      var p = path.join(program.path);

      require('mkdirp')(p);

      var target_file = '';
      var target = '';

      langs = o_langs.slice();
      while (lang = langs.shift()) {
        lang = lang.toLowerCase();
        if (program.merge) {
          target = lang;
        } else {
          var title = file.split('.').slice(0, -1).join('.');
          target = [title, lang].join(program.delimeter);
        }
        target = [target, 'json'].join('.');

        target_file = path.join(p, path.basename(target));

        let currentFileLang = buffer[lang];
        if (program.merge) {
          try {
            if (!previousLangData[lang]) {
              console.log(target_file);
              previousLangData[lang] = {};
            }
            currentFileLang = merge(currentFileLang, previousLangData[lang]);
            previousLangData[lang] = currentFileLang;
          } catch (err) { /* Do nothing  */ }
        } else {
          console.log(target_file)
        }
        fs.writeFileSync(target_file, JSON.stringify(currentFileLang, null, 2), writeOptions);
      }
    });
  });
});