/* ART-CAMP-02. El catálogo gráfico no forma parte del estado del juego. */
(function (root) {
  'use strict';
  const base = root.document?.currentScript?.src;
  const url = file => base ? new URL(file, base).href : './art-camp-02/' + file;
  const backdrop = {file:'../img/campamento-fondo.webp', status:'provisional'};
  const zones = [
    {id:'shipyard', name:'Astillero', x:6, y:31, width:39, stages:['Embarcadero','Muelle','Astillero','Dársena','Puerto científico']},
    {id:'caravan', name:'Caravana', x:59, y:35, width:36, stages:['Carreta','Caravana equipada','Convoy','Estación comercial','Central comercial']},
    {id:'workshop', name:'Taller', x:10, y:60, width:34, stages:['Mesa de trabajo','Taller artesanal','Taller científico','Taller especializado','Laboratorio']},
    {id:'excavations', name:'Excavaciones', x:57, y:55, width:39, stages:['Pozo exploratorio','Excavación','Yacimiento','Complejo paleontológico','Instituto paleontológico']},
    {id:'surveys', name:'Prospecciones', x:10, y:90, width:32, stages:['Reconocimiento','Estación de reconocimiento','Estación topográfica','Centro de estudios','Centro de prospección']},
    {id:'central-camp', name:'Campamento central', x:56, y:87, width:39, stages:['Fogón','Refugio','Campamento organizado','Base de expediciones','Sede de la expedición']}
  ];
  const artwork = {
    "caravan-5": "caravan-5",
    "workshop-1": "workshop-1",
    "workshop-2": "workshop-2",
    "workshop-3": "workshop-3",
    "workshop-4": "workshop-4",
    "workshop-5": "workshop-5",
    "excavations-1": "excavations-1",
    "excavations-2": "excavations-2",
    "excavations-3": "excavations-3",
    "excavations-4": "excavations-4",
    "excavations-5": "excavations-5",
    "surveys-1": "surveys-1",
    "surveys-2": "surveys-2",
    "surveys-3": "surveys-3",
    "surveys-4": "surveys-4",
    "surveys-5": "surveys-5",
    "central-camp-1": "central-camp-1",
    "central-camp-2": "central-camp-2",
    "central-camp-3": "central-camp-3",
    "central-camp-4": "central-camp-4",
    "central-camp-5": "central-camp-5"
  };
  const entries = Object.fromEntries(zones.flatMap(zone => zone.stages.map((name,index) => {
    const level = index + 1;
    const id = zone.id + '-' + level;
    const awaiting = zone.id === 'shipyard' || (zone.id === 'caravan' && level < 5);
    return [id, {id, level, name, sector:zone.id, file:artwork[id] || null,
      status:artwork[id] ? 'Disponible' : awaiting ? 'Falta el original' : 'Pendiente de ilustración'}];
  })));
  const stage = (sector, level) => entries[sector + '-' + level];
  const src = (entry, resolution = 768) => entry?.file ? url('arte/' + entry.file + '-' + resolution + '.webp') : '';
  const picture = entry => entry?.file ? '<img src="' + src(entry,384) + '" srcset="' + src(entry,768) + ' 2x" alt="" loading="lazy" decoding="async">' : '';
  const files = [
    new URL(backdrop.file,'https://assets.invalid/art-camp-02/').pathname.slice(1),
    ...Object.values(artwork).flatMap(file => [384,768].map(size=>'art-camp-02/arte/' + file + '-' + size + '.webp'))
  ];
  const placement = zone => '--x:' + zone.x + '%;--y:' + zone.y + '%;--w:' + zone.width + '%';
  root.AtlasCampArt = Object.freeze({backdrop, zones, entries, stage, src, picture, files, placement, url});
})(globalThis);
