i18ncsv2json
============

i18n csv file to json convetor.

Expect one or more csv file with following structure:

key   | en         | de 
------|------------|------------
about | about here | etwa hier
home  | homepage   | Startseite 

Execute following command:

    i18ncsv2json tools.csv

Then will generate 2 files, one is `tools.en.json`:

    {
      "about": "about here",
      "home": "homepage"
    }

And one is `tools.de.json`:

    {
      "about": "etwa hier",
      "home": "Startseite"
    }

### Working with multiple files

Multiple files can be provided as arguments.

Execute following command:
 
    i18ncsv2json tools.csv file.csv
 
Will generate 4 files:
- `tools.en.json`
- `tools.de.json`
- `file.en.json`
- `file.de.json`

Wildcard can also be used in path

    i18ncsv2json *.csv

Output for the same language can be merge together into a single file with the `merge` option.
 
Execute following command:
 
    i18ncsv2json tools.csv file.csv --merge
 
Will generate 2 files:
- `en.json`
- `de.json`

### Field delimiter
 
 If you are working with English locale, the field delimiter in csv files is the `,` character. But for other locales (e.g. french) the `;` character is used. You can adapt the csv field delimiter with the `fieldDelimiter` option.

 Example command to use semicolon:

     i18ncsv2json directory -f ";"

### Encoding
 
 It is possible to choose the encodings (for source csv files and output json files). This can typically be usefull when managing the csv files via excel which by default saves the file in windows specific encoding and not utf-8. Default output encoding is utf8.
 
 Example command to use read csv file with Windows encoding and output it in utf16 :
 
     i18ncsv2json directory -r latin1 -w utf16
 
Usage
-----

    i18ncsv2json [options] <files  ...>

Options: 

|Short flag|Flag                      |Description                                                             |
|----------|--------------------------|------------------------------------------------------------------------|
|-h        |--help                    |output usage information                                                |
|-V        |--version                 |output the version number                                               |
|-p        |--path [value]            |output path                                                             |
|-d        |--delimeter [value]       |delimeter between filename and lang                                     |
|-t        |--transpose               |transpose input csv file                                                |
|-f        |--fieldDelimiter [value]  |delimiter between fields                                                |
|-r        |--readEncoding [value]    |encoding to use to read files                                           |
|-w        |--writeEncoding [value]   |encoding to use to write files                                          |
|-m        |--merge                   |merge all csv files into a single json file                             |
