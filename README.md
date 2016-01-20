i18ncsv2json
============

i18n csv file to json convetor.

Expect one csv file `tools.csv`, with following structure:

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

Usage
-----

    Usage: i18ncsv2json [options] <file ...>

    Options:

      -h, --help               output usage information
      -V, --version            output the version number
      -p, --path [value]       output path
      -d, --delimeter [value]  delimeter between filename and lang

