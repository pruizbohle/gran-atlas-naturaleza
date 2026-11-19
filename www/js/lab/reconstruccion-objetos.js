(() => {
  'use strict';

  const phases = [
    {name:'Excavación inicial', percent:0},
    {name:'Componentes en preparación', percent:34},
    {name:'Reconstrucción parcial', percent:67},
    {name:'Montaje terminado', percent:100}
  ];

  function reconstruction({mount, phase, living, byId, node, art}) {
    const entry = byId.get(mount.id);
    const card = node('article', '', 'fossil-workbench');
    card.append(node('h2', mount.name), node('p', mount.anatomy), node('small', entry.context));
    const layout = node('div', '', 'fossil-layout');
    const parts = node('section', '', 'fossil-parts');
    parts.append(node('h3', 'Componentes de la receta'));
    const list = node('ul', '', 'fossil-components');
    for (const [id, required] of Object.entries(entry.recipe)) {
      const component = byId.get(id);
      const count = Math.floor(required * phases[phase].percent / 100);
      const item = node('li', '', 'fossil-component');
      item.append(art(component), node('strong', component.name),
        node('small', count + ' de ' + required + ' disponibles'),
        node('small', 'Faltan ' + (required - count)));
      list.append(item);
    }
    parts.append(list);
    const stage = node('section', '', 'fossil-display');
    stage.append(node('h3', phases[phase].name));
    const indicator = node('progress');
    indicator.max = 100;
    indicator.value = phases[phase].percent;
    indicator.setAttribute('aria-label', 'Progreso de reconstrucción');
    const picture = art(living ? byId.get(mount.living) : entry);
    const image = picture.querySelector('img');
    if (!living && image) image.style.clipPath = 'inset(0 ' + (100 - phases[phase].percent) + '% 0 0)';
    stage.append(indicator, picture, node('p', living ? 'Interpretación hipotética en vida' : 'Montaje esquelético'));
    layout.append(parts, stage);
    card.append(layout);
    return card;
  }

  globalThis.AtlasReconstruccionObjetos = {phases, reconstruction};
})();
