/* ART-CAMP-03. El catálogo gráfico no forma parte del estado del juego. */
(function (root) {
  'use strict';
  const base = root.document?.currentScript?.src;
  const url = file => base ? new URL(file, base).href : './art-camp-02/' + file;
  const backdrop = {file:'../img/campamento-art-camp-03.webp', status:'definitivo'};
  // Inicio de medidas auditadas.
  const layout = {
    "sceneWidth": 900,
    "pixelsPerMetre": 14.5,
    "zones": {
      "shipyard": {
        "x": 42,
        "y": 32,
        "depth": 0.94,
        "pinX": 0.88,
        "pinY": 0.83,
        "pins": [
          [
            0.74,
            0.8
          ],
          [
            0.8,
            0.82
          ],
          [
            0.86,
            0.81
          ],
          [
            0.92,
            0.89
          ],
          [
            0.96,
            0.83
          ]
        ]
      },
      "caravan": {
        "x": 75,
        "y": 32,
        "depth": 0.94
      },
      "workshop": {
        "x": 24,
        "y": 59,
        "depth": 1
      },
      "excavations": {
        "x": 76,
        "y": 59,
        "depth": 1
      },
      "surveys": {
        "x": 23.5,
        "y": 87,
        "depth": 1.06
      },
      "central-camp": {
        "x": 75,
        "y": 87,
        "depth": 1.06
      }
    },
    "measures": {
      "workshop-1": {
        "label": "Altura del banco abierto junto al tornillo",
        "pixels": 65.0,
        "metres": 0.88,
        "bounds": [
          0.25,
          0.53903,
          0.75,
          0.98141
        ]
      },
      "workshop-2": {
        "label": "Altura del banco bajo el torno",
        "pixels": 43.0,
        "metres": 0.88,
        "bounds": [
          0.19271,
          0.35688,
          0.80469,
          0.98141
        ]
      },
      "workshop-3": {
        "label": "Altura del banco del microscopio",
        "pixels": 42.0,
        "metres": 0.88,
        "bounds": [
          0.13021,
          0.26022,
          0.86979,
          0.98141
        ]
      },
      "workshop-4": {
        "label": "Altura de la mesa de precisión frontal",
        "pixels": 47.0,
        "metres": 0.9,
        "bounds": [
          0.07292,
          0.24535,
          0.92708,
          0.98141
        ]
      },
      "workshop-5": {
        "label": "Altura de la puerta de madera",
        "pixels": 62.0,
        "metres": 2.02,
        "bounds": [
          0.01823,
          0.06691,
          0.97917,
          0.98141
        ]
      },
      "excavations-1": {
        "label": "Altura proyectada de la pala inclinada",
        "pixels": 53.0,
        "metres": 1.05,
        "bounds": [
          0.25,
          0.63941,
          0.75,
          0.9777
        ]
      },
      "excavations-2": {
        "label": "Desnivel vertical de la escalera",
        "pixels": 65.0,
        "metres": 1.65,
        "bounds": [
          0.1875,
          0.54647,
          0.8125,
          0.98141
        ]
      },
      "excavations-3": {
        "label": "Desnivel del tramo superior de la escalera",
        "pixels": 43.0,
        "metres": 1.3,
        "bounds": [
          0.13021,
          0.36803,
          0.86979,
          0.98141
        ]
      },
      "excavations-4": {
        "label": "Luz vertical del primer vano del cobertizo",
        "pixels": 45.0,
        "metres": 2.05,
        "bounds": [
          0.07292,
          0.28625,
          0.92708,
          0.98141
        ]
      },
      "excavations-5": {
        "label": "Altura de la puerta frontal del pabellón",
        "pixels": 36.0,
        "metres": 2.07,
        "bounds": [
          0.01823,
          0.30483,
          0.97917,
          0.98141
        ]
      },
      "surveys-1": {
        "label": "Altura del trípode hasta la brújula",
        "pixels": 101.0,
        "metres": 1.43,
        "bounds": [
          0.29688,
          0.48327,
          0.70052,
          0.98141
        ]
      },
      "surveys-2": {
        "label": "Altura del trípode hasta la brújula",
        "pixels": 104.0,
        "metres": 1.43,
        "bounds": [
          0.1875,
          0.35688,
          0.8125,
          0.98141
        ]
      },
      "surveys-3": {
        "label": "Altura del teodolito sobre trípode",
        "pixels": 152.0,
        "metres": 1.6,
        "bounds": [
          0.22656,
          0.24164,
          0.77344,
          0.98141
        ]
      },
      "surveys-4": {
        "label": "Altura del trípode hasta el eje del instrumento",
        "pixels": 134.0,
        "metres": 1.6,
        "bounds": [
          0.13542,
          0.12639,
          0.86198,
          0.98141
        ]
      },
      "surveys-5": {
        "label": "Altura de la puerta de madera de la estación",
        "pixels": 67.0,
        "metres": 2.02,
        "bounds": [
          0.01823,
          0.36431,
          0.97917,
          0.98141
        ]
      },
      "central-camp-1": {
        "label": "Diámetro mayor del aro de piedra",
        "pixels": 85.0,
        "metres": 1.23,
        "bounds": [
          0.25,
          0.76952,
          0.75,
          0.98141
        ]
      },
      "central-camp-2": {
        "label": "Altura libre del poste delantero bajo la cubierta",
        "pixels": 89.0,
        "metres": 1.8,
        "bounds": [
          0.1875,
          0.43866,
          0.8125,
          0.98141
        ]
      },
      "central-camp-3": {
        "label": "Altura libre bajo el alero del comedor",
        "pixels": 72.0,
        "metres": 1.86,
        "bounds": [
          0.13021,
          0.46468,
          0.86979,
          0.98141
        ]
      },
      "central-camp-4": {
        "label": "Altura de la puerta de entrada",
        "pixels": 61.0,
        "metres": 2.05,
        "bounds": [
          0.07292,
          0.25279,
          0.92708,
          0.98141
        ]
      },
      "central-camp-5": {
        "label": "Altura de la puerta bajo el hastial",
        "pixels": 60.0,
        "metres": 2.1,
        "bounds": [
          0.01823,
          0.20074,
          0.97917,
          0.98141
        ]
      },
      "shipyard-1": {
        "label": "Eslora proyectada del bote de remos",
        "pixels": 49.0,
        "metres": 2.8,
        "bounds": [
          0.25,
          0.71747,
          0.75,
          0.98141
        ]
      },
      "shipyard-2": {
        "label": "Altura de la barandilla trasera del muelle",
        "pixels": 18.0,
        "metres": 0.95,
        "bounds": [
          0.1875,
          0.49071,
          0.8125,
          0.98141
        ]
      },
      "shipyard-3": {
        "label": "Luz vertical del vano del cobertizo naval",
        "pixels": 72.0,
        "metres": 3.25,
        "bounds": [
          0.13021,
          0.36803,
          0.86979,
          0.98141
        ]
      },
      "shipyard-4": {
        "label": "Altura de la puerta del almacén",
        "pixels": 50.0,
        "metres": 2.05,
        "bounds": [
          0.07292,
          0.23048,
          0.92708,
          0.98141
        ]
      },
      "shipyard-5": {
        "label": "Altura de la puerta de capitanía",
        "pixels": 42.0,
        "metres": 2.06,
        "bounds": [
          0.01823,
          0.35688,
          0.97917,
          0.98141
        ]
      },
      "caravan-1": {
        "label": "Diámetro vertical de la rueda delantera",
        "pixels": 49.0,
        "metres": 1.13,
        "bounds": [
          0.25,
          0.5539,
          0.75,
          0.98141
        ]
      },
      "caravan-2": {
        "label": "Diámetro vertical de la rueda delantera",
        "pixels": 58.0,
        "metres": 1.15,
        "bounds": [
          0.20052,
          0.35688,
          0.79948,
          0.98141
        ]
      },
      "caravan-3": {
        "label": "Diámetro vertical de la rueda del carro abierto",
        "pixels": 40.0,
        "metres": 1.12,
        "bounds": [
          0.13021,
          0.2974,
          0.86979,
          0.98141
        ]
      },
      "caravan-4": {
        "label": "Altura de la puerta del depósito",
        "pixels": 77.0,
        "metres": 2.05,
        "bounds": [
          0.07292,
          0.24907,
          0.92708,
          0.98141
        ]
      },
      "caravan-5": {
        "label": "Altura de la puerta de la casa mercantil",
        "pixels": 62.0,
        "metres": 2.05,
        "bounds": [
          0.01823,
          0.07435,
          0.97917,
          0.98141
        ]
      }
    }
  };
  // Fin de medidas auditadas.
  const zones = [
    {id:'shipyard', name:'Astillero', x:6, y:31, width:39, stages:['Embarcadero','Muelle','Astillero','Dársena','Puerto científico']},
    {id:'caravan', name:'Caravana', x:59, y:35, width:36, stages:['Carreta','Caravana equipada','Convoy','Estación comercial','Central comercial']},
    {id:'workshop', name:'Taller', x:10, y:60, width:34, stages:['Mesa de trabajo','Taller artesanal','Taller científico','Taller especializado','Laboratorio']},
    {id:'excavations', name:'Excavaciones', x:57, y:55, width:39, stages:['Pozo exploratorio','Excavación','Yacimiento','Complejo paleontológico','Instituto paleontológico']},
    {id:'surveys', name:'Prospecciones', x:10, y:90, width:32, stages:['Reconocimiento','Estación de reconocimiento','Estación topográfica','Centro de estudios','Centro de prospección']},
    {id:'central-camp', name:'Campamento central', x:56, y:87, width:39, stages:['Fogón','Refugio','Campamento organizado','Base de expediciones','Sede de la expedición']}
  ];
  const artwork = {
    "caravan-1": "caravan-1",
    "caravan-2": "caravan-2",
    "caravan-3": "caravan-3",
    "caravan-4": "caravan-4",
    "shipyard-1": "shipyard-1",
    "shipyard-2": "shipyard-2",
    "shipyard-3": "shipyard-3",
    "shipyard-4": "shipyard-4",
    "shipyard-5": "shipyard-5",
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
    return [id, {id, level, name, sector:zone.id, file:artwork[id] || null,
      status:artwork[id] ? 'Disponible' : 'Pendiente de ilustración'}];
  })));
  const stage = (sector, level) => entries[sector + '-' + level];
  const src = (entry, resolution = 768) => entry?.file ? url('arte/' + entry.file + '-' + resolution + '.webp') : '';
  const picture = entry => entry?.file ? '<img src="' + src(entry,384) + '" srcset="' + src(entry,768) + ' 2x" alt="" loading="lazy" decoding="async">' : '';
  const files = [
    new URL(backdrop.file,'https://assets.invalid/art-camp-02/').pathname.slice(1),
    ...Object.values(artwork).flatMap(file => [384,768].map(size=>'art-camp-02/arte/' + file + '-' + size + '.webp'))
  ];
  function frame(zone, entry) {
    const measure = layout.measures[entry?.id];
    const anchor = layout.zones[zone.id];
    if (!measure) return {left:zone.x, top:zone.y - zone.width * .7 * 2 / 3, width:zone.width, height:zone.width * .7 * 2 / 3};
    const width = 100 * 384 * measure.metres / measure.pixels * layout.pixelsPerMetre * anchor.depth / layout.sceneWidth;
    const height = width * (269 / 384) * 2 / 3;
    const [pinX, pinY] = anchor.pins?.[entry.level - 1] ?? [.5,.98];
    return {left:anchor.x - width * pinX, top:anchor.y - height * pinY, width, height};
  }
  const placement = (zone,entry) => {
    const {left,top,width,height} = frame(zone,entry);
    return '--x:' + left + '%;--y:' + (top + height) + '%;--w:' + width + '%';
  };
  function footprint(zone,entry) {
    const f = frame(zone,entry);
    const [left,top,right,bottom] = layout.measures[entry.id].bounds;
    return {left:f.left + f.width * left, top:f.top + f.height * top,
      right:f.left + f.width * right, bottom:f.top + f.height * bottom};
  }
  root.AtlasCampArt = Object.freeze({backdrop, zones, entries, stage, src, picture, files, frame, footprint, layout, placement, url});
})(globalThis);
