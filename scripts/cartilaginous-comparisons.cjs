'use strict';

module.exports = {
  lamnids: {
    label: 'Lámnidos · hocico y pedúnculo caudal',
    cartilaginous: [
      ['Carcharodon carcharias', 'Cuerpo robusto, hocico cónico y aleta caudal en media luna.'],
      ['Isurus oxyrinchus', 'Cuerpo fusiforme, hocico muy puntiagudo y pectorales cortas.'],
      ['Lamna ditropis', 'Hocico corto, quilla caudal secundaria y manchas oscuras ventrales en adultos.']
    ]
  },
  requiem: {
    label: 'Carcarínidos · aletas y extremos',
    cartilaginous: [
      ['Carcharhinus longimanus', 'Pectorales anchas, largas y redondeadas con ápices blancos.'],
      ['Carcharhinus melanopterus', 'Mancha negra bien delimitada en la primera dorsal, con banda pálida debajo.'],
      ['Prionace glauca', 'Cuerpo delgado, pectorales largas y estrechas y primera dorsal retrasada.']
    ]
  },
  'open-ocean': {
    label: 'Tiburones pelágicos · cabeza, cola y filtración',
    cartilaginous: [
      ['Alopias vulpinus', 'Lóbulo superior de la cola muy largo.'],
      ['Sphyrna lewini', 'Cabeza expandida con borde frontal festoneado y ojos laterales.'],
      ['Rhincodon typus', 'Hocico ancho, boca terminal y patrón dorsal de puntos y bandas.'],
      ['Cetorhinus maximus', 'Grandes hendiduras branquiales y boca amplia de filtración.']
    ]
  },
  deep: {
    label: 'Aguas profundas, abiertas y polares · formas de nado',
    cartilaginous: [
      ['Chlamydoselachus anguineus', 'Cuerpo anguiliforme con seis pares de hendiduras branquiales.'],
      ['Mitsukurina owstoni', 'Rostro aplanado y alargado, mandíbula corta y cola asimétrica.'],
      ['Somniosus microcephalus', 'Cuerpo pesado, ojos pequeños y dorsales bajas.'],
      ['Isistius brasiliensis', 'Cuerpo cilíndrico, collar oscuro y dorsales próximas a la cola.']
    ]
  },
  mobulids: {
    label: 'Mobúlidos · mantas y raya diablo',
    cartilaginous: [
      ['Mobula birostris', 'Alas anchas, boca terminal y marcas dorsales de hombro angulosas.'],
      ['Mobula alfredi', 'Manchas de hombro con curvas más suaves y boca terminal.'],
      ['Mobula mobular', 'Lóbulos cefálicos largos y estrechos, boca inferior y cola fina.']
    ]
  },
  'eagle-ray': {
    label: 'Raya águila y mantas · disco, rostro y cola',
    cartilaginous: [
      ['Aetobatus ocellatus', 'Rostro saliente, dorso moteado y cola larga en látigo.'],
      ['Mobula birostris', 'Disco pelágico con dos lóbulos que flanquean los lados de la boca.'],
      ['Mobula alfredi', 'Disco ancho, boca terminal y lóbulos cefálicos curvos.']
    ]
  },
  'white-shark-pigment': {
    label: 'Tiburón blanco · normal, albino y melánico',
    cartilaginous: [
      ['Carcharodon carcharias', 'Dorso gris y vientre claro.'],
      ['Carcharodon carcharias', 'Pigmentación reducida en dorso y ojos.', 'albino'],
      ['Carcharodon carcharias', 'Pigmentación oscura extendida en los flancos.', 'melanico']
    ]
  },
  'manta-pigment': {
    label: 'Manta gigante · normal y melánica',
    cartilaginous: [
      ['Mobula birostris', 'Manchas claras en los hombros.'],
      ['Mobula birostris', 'Dorso intensamente oscuro, con la silueta y los lóbulos cefálicos definidos.', 'melanico']
    ]
  }
};
