'use strict';

module.exports = {
  pacific: {
    label: 'Salmones del Pacífico',
    salmonids: [
      ['Oncorhynchus gorbuscha', 'Cuerpo esbelto, pedúnculo estrecho y manchas ovales en ambos lóbulos de la cola.'],
      ['Oncorhynchus keta', 'Cola casi sin manchas y barras verticales en la coloración nupcial.'],
      ['Oncorhynchus nerka', 'Cuerpo rojo y cabeza olivácea en fase nupcial, con cola sin manchas grandes.'],
      ['Oncorhynchus tshawytscha', 'Cabeza y cuerpo robustos, encías oscuras y manchas en ambos lóbulos caudales.']
    ]
  },
  'atlantic-and-trout': {
    label: 'Salmón atlántico y truchas',
    salmonids: [
      ['Salmo salar', 'Pedúnculo delgado, cola suavemente ahorquillada y manchas en X hacia el dorso.'],
      ['Salmo trutta', 'Mandíbula más larga, cola menos hendida y puntos rojos con halo claro.'],
      ['Oncorhynchus mykiss', 'Franja lateral rosada, motas finas en el dorso y cola moteada.'],
      ['Salvelinus fontinalis', 'Vermiculaciones dorsales, puntos rojizos y bordes anteriores blancos en las aletas inferiores.']
    ]
  },
  albino: {
    label: 'Salmones y truchas albinos',
    salmonids: [
      ['Oncorhynchus gorbuscha', 'Aletas claras y pedúnculo fino con cola bifurcada.', 'albino'],
      ['Oncorhynchus nerka', 'Cuerpo comprimido y ojos rosados.', 'albino'],
      ['Oncorhynchus mykiss', 'Franja lateral rosa tenue sobre flancos dorados.', 'albino'],
      ['Salvelinus fontinalis', 'Puntos anaranjados, cola casi recta y bordes de aletas claros.', 'albino']
    ]
  },
  melanico: {
    label: 'Salmones y truchas melánicos',
    salmonids: [
      ['Oncorhynchus gorbuscha', 'Manchas dorsales y caudales visibles sobre gris oscuro.', 'melanico'],
      ['Oncorhynchus nerka', 'Perfil comprimido y dorso oscuro con ciertas zonas de reflejo cobrizo.', 'melanico'],
      ['Salmo trutta', 'Cola relativamente recta, mandíbula robusta y marcas oscuras contrastantes.', 'melanico']
    ]
  },
  remonte: {
    label: 'Salmón rosado y Remonte',
    salmonids: [
      ['Oncorhynchus gorbuscha', 'Adulto plateado de fase marina, sin joroba y con maxilar corto.'],
      ['Oncorhynchus gorbuscha', 'Macho de fase nupcial con joroba, mandíbulas ganchudas y dorso moteado.', 'legendario']
    ]
  }
};
