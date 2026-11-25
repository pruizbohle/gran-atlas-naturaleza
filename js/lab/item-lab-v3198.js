'use strict';
const ITEM_LAB_CATALOG=[
  {
    "id": "binoculars",
    "name": "Prismáticos de viaje",
    "emoji": "🔭",
    "category": "Equipamiento"
  },
  {
    "id": "brass_compass",
    "name": "Brújula de latón",
    "emoji": "🧭",
    "category": "Equipamiento"
  },
  {
    "id": "sturdy_pack",
    "name": "Morral reforzado",
    "emoji": "🎒",
    "category": "Equipamiento"
  },
  {
    "id": "field_hat",
    "name": "Sombrero de naturalista",
    "emoji": "🎩",
    "category": "Equipamiento"
  },
  {
    "id": "feather_cap",
    "name": "Gorro emplumado",
    "emoji": "🪶",
    "category": "Equipamiento"
  },
  {
    "id": "rain_hood",
    "name": "Capucha impermeable",
    "emoji": "🧥",
    "category": "Equipamiento"
  },
  {
    "id": "amulet",
    "name": "Colgante del explorador",
    "emoji": "📿",
    "category": "Equipamiento"
  },
  {
    "id": "amber_charm",
    "name": "Amuleto de ámbar",
    "emoji": "🟠",
    "category": "Equipamiento"
  },
  {
    "id": "shell_necklace",
    "name": "Collar de conchas",
    "emoji": "🐚",
    "category": "Equipamiento"
  },
  {
    "id": "fossil_fragment",
    "name": "Fragmento fósil",
    "emoji": "🦴",
    "category": "Expedición"
  },
  {
    "id": "fossil_skull",
    "name": "Cráneo fósil",
    "emoji": "💀",
    "category": "Fósiles"
  },
  {
    "id": "fossil_tooth",
    "name": "Diente fósil",
    "emoji": "🦷",
    "category": "Fósiles"
  },
  {
    "id": "bone_short",
    "name": "Hueso corto",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "bone_long",
    "name": "Hueso largo",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "carnivore_skull",
    "name": "Cráneo carnívoro",
    "emoji": "💀",
    "category": "Fósiles"
  },
  {
    "id": "herbivore_skull",
    "name": "Cráneo herbívoro",
    "emoji": "💀",
    "category": "Fósiles"
  },
  {
    "id": "fossil_plate",
    "name": "Placa fósil dorsal",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "fossil_sail",
    "name": "Espina de vela fósil",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "animal_trace",
    "name": "Muestra de huellas",
    "emoji": "🐾",
    "category": "Expedición"
  },
  {
    "id": "pressed_flower",
    "name": "Flor prensada",
    "emoji": "🌼",
    "category": "Expedición"
  },
  {
    "id": "ancient_coin",
    "name": "Moneda antigua",
    "emoji": "🪙",
    "category": "Expedición"
  },
  {
    "id": "map_fragment",
    "name": "Fragmento de mapa",
    "emoji": "🗺️",
    "category": "Expedición"
  },
  {
    "id": "asia_map_piece",
    "name": "Parte de mapa de Asia",
    "emoji": "🧭",
    "category": "Expedición"
  },
  {
    "id": "asia_map",
    "name": "Mapa de Asia",
    "emoji": "🗺️",
    "category": "Expedición"
  },
  {
    "id": "africa_map_piece",
    "name": "Parte de mapa de África",
    "emoji": "🧩",
    "category": "Expedición"
  },
  {
    "id": "africa_map",
    "name": "Mapa de África",
    "emoji": "🗺️",
    "category": "Expedición"
  },
  {
    "id": "north_america_map_piece",
    "name": "Parte de mapa de Norteamérica",
    "emoji": "🧩",
    "category": "Expedición"
  },
  {
    "id": "north_america_map",
    "name": "Mapa de Norteamérica",
    "emoji": "🗺️",
    "category": "Expedición"
  },
  {
    "id": "oceanic_quadrant",
    "name": "Cuadrante transatlántico",
    "emoji": "🧭",
    "category": "Materiales históricos"
  },
  {
    "id": "parchment_scrap",
    "name": "Pergamino antiguo",
    "emoji": "📜",
    "category": "Expedición"
  },
  {
    "id": "river_pebble",
    "name": "Piedra de río pulida",
    "emoji": "🪨",
    "category": "Expedición"
  },
  {
    "id": "heron_feather",
    "name": "Pluma de garza",
    "emoji": "🪶",
    "category": "Materiales animales"
  },
  {
    "id": "polished_lens",
    "name": "Lente pulida",
    "emoji": "🔍",
    "category": "Expedición"
  },
  {
    "id": "brass_shard",
    "name": "Pieza de latón antiguo",
    "emoji": "⚙️",
    "category": "Materiales históricos"
  },
  {
    "id": "old_ink",
    "name": "Tintero antiguo",
    "emoji": "🖋️",
    "category": "Materiales históricos"
  },
  {
    "id": "carved_wood",
    "name": "Madera tallada",
    "emoji": "🪵",
    "category": "Materiales históricos"
  },
  {
    "id": "wolf_tooth",
    "name": "Diente de lobo",
    "emoji": "🦷",
    "category": "Materiales animales"
  },
  {
    "id": "owl_feather",
    "name": "Pluma de rapaz",
    "emoji": "🪶",
    "category": "Materiales animales"
  },
  {
    "id": "antler_fragment",
    "name": "Fragmento de cornamenta",
    "emoji": "🦌",
    "category": "Materiales animales"
  },
  {
    "id": "otter_whisker",
    "name": "Bigote de nutria",
    "emoji": "〰️",
    "category": "Materiales animales"
  },
  {
    "id": "boar_tusk",
    "name": "Colmillo de jabalí",
    "emoji": "🦷",
    "category": "Materiales animales"
  },
  {
    "id": "beaver_tail_scale",
    "name": "Escama de cola de castor",
    "emoji": "🪵",
    "category": "Materiales animales"
  },
  {
    "id": "field_telescope",
    "name": "Catalejo de precisión",
    "emoji": "🔭",
    "category": "Equipamiento"
  },
  {
    "id": "scholar_hat",
    "name": "Sombrero académico",
    "emoji": "🎓",
    "category": "Equipamiento"
  },
  {
    "id": "museum_medallion",
    "name": "Medallón de ámbar",
    "emoji": "🏅",
    "category": "Equipamiento"
  },
  {
    "id": "fossil_amber",
    "name": "Ámbar fósil",
    "emoji": "🟠",
    "category": "Objetos raros"
  },
  {
    "id": "river_pearl",
    "name": "Perla fluvial",
    "emoji": "⚪",
    "category": "Objetos raros"
  },
  {
    "id": "fossil_track",
    "name": "Huella fosilizada",
    "emoji": "🐾",
    "category": "Fósiles"
  },
  {
    "id": "fossil_claw",
    "name": "Garra fósil",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "fossil_rib",
    "name": "Costilla fósil",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "fossil_horn",
    "name": "Cuerno fósil",
    "emoji": "🦴",
    "category": "Fósiles"
  },
  {
    "id": "hard_bone",
    "name": "Hueso duro",
    "emoji": "🪨",
    "category": "Fósiles"
  },
  {
    "id": "study:herbarium",
    "name": "Herbario de campo",
    "emoji": "🌿",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:tracking",
    "name": "Archivo de rastros",
    "emoji": "🐾",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:travel_notes",
    "name": "Informe cartográfico",
    "emoji": "📜",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:timber",
    "name": "Donación de materiales",
    "emoji": "🏛️",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:fossil_report",
    "name": "Informe paleontológico",
    "emoji": "🦴",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:ornithology",
    "name": "Catálogo de plumajes",
    "emoji": "🪶",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:mammalogy",
    "name": "Cuaderno de mamíferos",
    "emoji": "🦊",
    "category": "Proyectos del Taller"
  },
  {
    "id": "study:river_mammals",
    "name": "Análisis de humedales",
    "emoji": "🦦",
    "category": "Proyectos del Taller"
  }
];
(function(){
const $=id=>document.getElementById(id),art=globalThis.AtlasItemArt;
for(const group of new Set(ITEM_LAB_CATALOG.map(x=>x.category))){const option=document.createElement('option');option.value=option.textContent=group;$('category').append(option);}
function render(){
 const query=$('search').value.toLocaleLowerCase('es'),group=$('category').value;
 const rows=ITEM_LAB_CATALOG.filter(x=>(!group||x.category===group)&&(x.name+' '+x.id).toLocaleLowerCase('es').includes(query));
 $('gallery').style.setProperty('--plate-size',$('size').value+'px');
 $('gallery').classList.toggle('dark',$('background').value==='dark');
 $('gallery').classList.toggle('silhouette',$('silhouette').checked);
 $('gallery').classList.toggle('compare',$('compare').checked);
 $('gallery').replaceChildren();
 for(const category of new Set(rows.map(x=>x.category))){
  const section=document.createElement('section'),title=document.createElement('h2'),grid=document.createElement('div');title.textContent=category;grid.className='plates';section.append(title,grid);
  for(const row of rows.filter(x=>x.category===category)){
   const card=document.createElement('article');card.className='plate';card.dataset.id=row.id;
   const svg=art.renderItemArt(row.id);
   const picture=document.createElement('div');picture.className='comparison';picture.innerHTML='<span class="old" aria-label="Emoji anterior">'+row.emoji+'</span><span class="drawing">'+svg+'</span>';
   const name=document.createElement('h3'),id=document.createElement('code'),status=document.createElement('small');name.textContent=row.name;id.textContent=row.id;status.textContent=svg?'Lámina completa':'Pendiente';card.append(picture,name,id,status);grid.append(card);
  }$('gallery').append(section);
 }
 const complete=ITEM_LAB_CATALOG.filter(x=>art.renderItemArt(x.id)).length;
 $('count').textContent=complete+'/60 ilustraciones completas · '+(60-complete)+' pendientes · '+rows.length+' visibles';
}
for(const id of ['search','category','size','background','silhouette','compare'])$(id).addEventListener('input',render);
render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();
