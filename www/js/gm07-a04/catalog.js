(function (root) {
  'use strict';

  const records = {
    ...root.AtlasGM07P04?.records,
    sa_esp_scelorchilus_rubecula: {
      name: 'Chucao',
      latin: 'Scelorchilus rubecula',
      region: 'gm06_bosques',
      taxonomy: { className: 'Aves', subClass: 'Aves terrestres', order: 'Passeriformes', family: 'Rhinocryptidae' },
      paragraphs: [
        'Vive en el sotobosque denso de los bosques templados húmedos del centro-sur de Chile y del oeste de la Patagonia argentina. El dorso pardo y la cola corta que suele levantar contrastan con la garganta y el pecho rojizos.',
        'Se desplaza entre raíces y hojarasca, donde busca insectos y otros invertebrados. También come frutos y semillas. Su canto potente, súbito y repetido suele delatarlo antes de que se vea el ave entre los matorrales.'
      ],
      reference: {
        text: 'Ministerio del Medio Ambiente de Chile · Ficha de Scelorchilus rubecula',
        url: 'https://clasificacionespecies.mma.gob.cl/wp-content/uploads/2019/10/Scerlochilus_rubecula_14RCE_FINAL.pdf'
      }
    },
    sa_esp_brachycephalus_pulex: {
      name: 'Sapo pulga',
      latin: 'Brachycephalus pulex',
      region: 'sa_cerrado_brasileno',
      locality: 'Serra Bonita, Bahía, Brasil',
      taxonomy: { className: 'Amphibia', subClass: 'Ranas y sapos', order: 'Anura', family: 'Brachycephalidae' },
      species: {
        rare: 'Muy rara',
        kind: 'amphibian',
        color: '#79543c',
        habitats: ['bosque'],
        times: ['dia', 'atardecer'],
        seasons: ['primavera', 'verano', 'otono', 'invierno'],
        special: ['Notable'],
        dimorphism: false
      },
      paragraphs: [
        'Este anuro pardo y de dedos reducidos habita la hojarasca del bosque atlántico de Serra Bonita, en el sur de Bahía, Brasil. La hojarasca húmeda le ofrece refugio y camuflaje.',
        'Bolaños, Dias y Solé midieron un macho adulto de 6,45 mm desde el hocico hasta la cloaca. La investigación de 2024 lo reconoce como el anfibio más pequeño conocido. La lámina amplía al animal para hacer visibles sus rasgos.'
      ],
      reference: {
        text: 'Bolaños, Dias y Solé (2024) · Zoologica Scripta 53, 414–418 · DOI 10.1111/zsc.12654',
        url: 'https://doi.org/10.1111/zsc.12654'
      },
      zoologicalRecord: { trait: 'longitud hocico-cloaca adulta', minimumMm: 6.45, year: 2024 }
    }
  };

  function apply(species, regions, categories) {
    for (const [id, record] of Object.entries(records)) {
      const existing = species[id];
      const region = regions.find(item => item.id === record.region);
      const habitats = existing?.habitats || record.species?.habitats;
      if (!region || !habitats?.some(habitat => region.habitats.includes(habitat))) {
        throw Error('Hábitat o región de catálogo incompatible: ' + id);
      }
      if ((existing && existing.latin !== record.latin) ||
          Object.entries(species).some(([otherId, item]) => otherId !== id && item.latin.toLowerCase() === record.latin.toLowerCase())) {
        throw Error('Identidad de catálogo duplicada: ' + id);
      }
      if (!existing) {
        species[id] = { ...record.species, name: record.name, latin: record.latin, family: record.taxonomy.family };
        categories[id] = [...record.species.special];
      }
      if (!region.species.includes(id)) region.species.push(id);
    }
  }

  const escape = value => value.replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);

  function monograph(id) {
    if (!Object.hasOwn(records, id)) return '';
    const record = records[id];
    return '<details class="req species-monograph"><summary>Monografía · ' + escape(record.name) + '</summary>' +
      record.paragraphs.map(paragraph => '<p>' + escape(paragraph) + '</p>').join('') +
      '<p><a href="' + escape(record.reference.url) + '" target="_blank" rel="noopener noreferrer">' +
      escape(record.reference.text) + '</a></p></details>';
  }

  const api = Object.freeze({ records, apply, monograph });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AtlasGM07A04 = api;
})(globalThis);
