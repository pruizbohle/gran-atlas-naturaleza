'use strict';

const fs = require('node:fs');
const path = require('node:path');

const output = process.argv[2];
if (!output) throw Error('Indica el directorio de salida del laboratorio');
const copy = relative => {
  const target = path.join(output, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(path.join('www', relative), target, { recursive: true });
};
require('../www/scientific-illustration/specimens.js');
const { species } = globalThis.AtlasScientificMarsupials;
copy('scientific-illustration');
for (const stylesheet of ['field-v3210', 'journal-v3250', 'bestiary-v3260', 'museum-v3270', 'naturalist-art-v400']) {
  copy('css/' + stylesheet + '.css');
}
for (const script of ['naturalist-art-v400', 'field-ui-v3210', 'journal-ui-v3250', 'bestiary-ui-v3260', 'museum-ui-v3270']) {
  copy('js/' + script + '.js');
}
for (const record of species.flatMap(item => item.variants)) {
  for (const subdir of ['', '64/', '128/', '256/']) {
    copy('naturalist-art/plates/' + subdir + record.name);
  }
}
copy('naturalist-art/landscapes');
fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./scientific-illustration/">
<title>El Gran Atlas · Laboratorio de ilustración científica</title></head>
<body><a href="./scientific-illustration/">Abrir el laboratorio experimental</a></body></html>
`);
