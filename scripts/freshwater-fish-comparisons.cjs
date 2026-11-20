'use strict';

module.exports = {
  tigerfish: {
    label: 'Peces tigre africanos',
    freshwater: [
      ['Hydrocynus goliath', 'Cabeza y mandíbula más robustas, con grandes dientes cónicos entrelazados.'],
      ['Hydrocynus vittatus', 'Cuerpo esbelto, franjas longitudinales y lóbulo caudal inferior rojizo.']
    ]
  },
  perch: {
    label: 'Percas y pez mandarín chino',
    freshwater: [
      ['Perca flavescens', 'Flanco amarillo con barras oscuras, boca pequeña y dos aletas dorsales.'],
      ['Perca fluviatilis', 'Dorso más alto, aletas inferiores rojizas y marca oscura en la primera dorsal.'],
      ['Siniperca chuatsi', 'Patrón de manchas irregulares, boca oblicua y perfil espinoso de la aleta dorsal.']
    ]
  },
  'deep-bodied': {
    label: 'Peces de cuerpo alto',
    freshwater: [
      ['Colossoma macropomum', 'Cuerpo profundo, boca pequeña y vientre oscuro.'],
      ['Pygocentrus nattereri', 'Mandíbula prominente, flanco punteado y vientre anaranjado.'],
      ['Symphysodon aequifasciatus', 'Perfil discoidal con aletas dorsal y anal siguiendo el borde.'],
      ['Oreochromis niloticus', 'Dorsal continua y franjas verticales en la aleta caudal.']
    ]
  },
  elongated: {
    label: 'Peces de cuerpo alargado',
    freshwater: [
      ['Electrophorus electricus', 'Cuerpo cilíndrico, aleta anal en cinta y extremo caudal sin aleta separada.'],
      ['Esox lucius', 'Hocico aplanado y aletas dorsal y anal próximas a la cola.'],
      ['Channa argus', 'Cabeza aplanada cubierta de escamas, dorsal larga y manchas oscuras.'],
      ['Arapaima gigas', 'Escamas grandes y aletas dorsal y anal concentradas en la parte posterior.']
    ]
  },
  cyprinids: {
    label: 'Carpa, barbo y tenca',
    freshwater: [
      ['Cyprinus carpio', 'Dorso arqueado, aleta dorsal larga y dos pares de barbillones.'],
      ['Barbus barbus', 'Boca inferior, perfil alargado y dos pares de barbillones.'],
      ['Tinca tinca', 'Dos barbillones cortos, escamas pequeñas y aletas redondeadas.']
    ]
  },
  albino: {
    label: 'Albinos · escudos, escamas y aletas',
    freshwater: [
      ['Acipenser baerii', 'Hileras de escudos y cola con un lóbulo superior más largo.', 'albino'],
      ['Arapaima gigas', 'Escamas amplias con tonos cálidos en la parte posterior.', 'albino'],
      ['Pantodon buchholzi', 'Pectorales anchas y extendidas con radios finos.', 'albino'],
      ['Hydrocynus goliath', 'Mandíbula fuerte y dentición visible sobre la pigmentación clara.', 'albino']
    ]
  },
  melanico: {
    label: 'Melánicos · bandas, barbillones y manchas',
    freshwater: [
      ['Barbus barbus', 'Hocico descendente y barbillones alrededor de la boca.', 'melanico'],
      ['Channa argus', 'Grandes manchas y aletas longitudinales sobre fondo oscuro.', 'melanico'],
      ['Perca fluviatilis', 'Bandas verticales y dos dorsales bien definidas.', 'melanico'],
      ['Siniperca chuatsi', 'Manchas irregulares y mandíbula prominente.', 'melanico'],
      ['Tinca tinca', 'Aletas redondeadas y reflejos sutiles sobre escamas finas.', 'melanico']
    ]
  }
};
