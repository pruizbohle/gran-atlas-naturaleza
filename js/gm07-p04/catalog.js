(function (root) {
  'use strict';

  const seasons = ['primavera', 'verano', 'otono', 'invierno'];
  const records = {
    asia_esp_craseonycteris_thonglongyai: {
      name: 'Murciélago abejorro',
      latin: 'Craseonycteris thonglongyai',
      region: 'HX-06-17',
      locality: 'Tailandia occidental y sudeste de Myanmar',
      taxonomy: { className: 'Mammalia', subClass: 'Murciélagos', order: 'Chiroptera', family: 'Craseonycteridae' },
      species: {
        rare: 'Muy rara',
        kind: 'small',
        color: '#725546',
        habitats: ['bosque'],
        times: ['amanecer', 'atardecer'],
        seasons,
        special: ['Notable'],
        dimorphism: false
      },
      paragraphs: [
        'Este murciélago diminuto se refugia en cuevas calcáreas de Tailandia occidental y el sudeste de Myanmar. Tiene un hocico porcino, orejas grandes, pelaje pardo y una membrana entre las patas sin cola externa.',
        'Sale a cazar insectos en los bosques cercanos a las cuevas en periodos breves al amanecer y al anochecer. La ficha de Campo lo sitúa en bosque, el hábitat existente que representa esas áreas de alimentación.'
      ],
      reference: {
        text: 'Bat Conservation International · Craseonycteris thonglongyai',
        url: 'https://www.batcon.org/bat/craseonycteris-thonglongyai-2/'
      }
    },
    sa_esp_chlamyphorus_truncatus: {
      name: 'Pichiciego menor',
      latin: 'Chlamyphorus truncatus',
      region: 'sa_pampas',
      locality: 'Centro de Argentina',
      taxonomy: { className: 'Mammalia', subClass: 'Armadillos', order: 'Cingulata', family: 'Chlamyphoridae' },
      species: {
        rare: 'Muy rara',
        kind: 'small',
        color: '#af786e',
        habitats: ['pradera'],
        times: ['atardecer', 'noche'],
        seasons,
        special: ['Notable'],
        dimorphism: false
      },
      paragraphs: [
        'El armadillo más pequeño vive en terrenos arenosos, pastizales secos y matorrales semiáridos del centro de Argentina. Su caparazón rosado cubre el dorso y contrasta con el pelaje claro de los flancos.',
        'Las grandes uñas delanteras le permiten excavar en la arena. La placa posterior termina de forma abrupta y la cola estrecha, aplanada, queda cerca del suelo. En Campo se puede encontrar en los sectores secos de la pradera pampeana.'
      ],
      reference: {
        text: 'Parques Nacionales de Argentina · Chlamyphorus truncatus',
        url: 'https://sib.gob.ar/index.php/especies/chlamyphorus-truncatus'
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = { records };
  else root.AtlasGM07P04 = Object.freeze({ records });
})(globalThis);
