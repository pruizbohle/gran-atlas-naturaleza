'use strict';

// Technical families for the remaining aquatic taxa. These names never
// replace the catalog's gameplay group, assignment or label.
const genera = {
  Acanthuridae: 'Paracanthurus',
  Acipenseridae: 'Acipenser',
  Aetobatidae: 'Aetobatus',
  Alestidae: 'Hydrocynus',
  Alloposidae: 'Haliphron',
  Alopiidae: 'Alopias',
  Anoplogastridae: 'Anoplogaster',
  Arapaimidae: 'Arapaima',
  Architeuthidae: 'Architeuthis',
  Atherinopsidae: 'Odontesthes',
  Balistidae: 'Balistoides',
  Bryconidae: 'Salminus',
  Carangidae: 'Trachurus',
  Carcharhinidae: 'Carcharhinus Prionace',
  Ceratiidae: 'Ceratias',
  Cetorhinidae: 'Cetorhinus',
  Chaetodontidae: 'Chaetodon',
  Channichthyidae: 'Chaenocephalus',
  Channidae: 'Channa',
  Characidae: 'Paracheirodon',
  Chlamydoselachidae: 'Chlamydoselachus',
  Cichlidae: 'Oreochromis Symphysodon',
  Clupeidae: 'Clupea Sardina',
  Cranchiidae: 'Mesonychoteuthis',
  Cyprinidae: 'Barbus Cyprinus',
  Dalatiidae: 'Isistius',
  Enteroctopodidae: 'Enteroctopus',
  Epinephelidae: 'Epinephelus',
  Esocidae: 'Esox',
  Eurypharyngidae: 'Eurypharynx',
  Exocoetidae: 'Exocoetus',
  Gadidae: 'Gadus',
  Gonatidae: 'Gonatus',
  Grimpoteuthidae: 'Grimpoteuthis',
  Gymnotidae: 'Electrophorus',
  Histioteuthidae: 'Histioteuthis',
  Ipnopidae: 'Bathypterois',
  Istiophoridae: 'Istiophorus',
  Labridae: 'Bolbometopon Cheilinus',
  Lamnidae: 'Carcharodon Isurus Lamna',
  Latidae: 'Lates',
  Liparidae: 'Pseudoliparis',
  Loliginidae: 'Loligo Sepioteuthis',
  Mitsukurinidae: 'Mitsukurina',
  Mobulidae: 'Mobula',
  Molidae: 'Mola',
  Myctophidae: 'Benthosema',
  Nototheniidae: 'Dissostichus',
  Octopodidae: 'Amphioctopus Hapalochlaena Octopus',
  Ommastrephidae: 'Dosidicus',
  Onychoteuthidae: 'Moroteuthopsis',
  Opisthoproctidae: 'Macropinna',
  Pantodontidae: 'Pantodon',
  Percidae: 'Perca',
  Pimelodidae: 'Pseudoplatystoma',
  Pomacanthidae: 'Pomacanthus',
  Pomacentridae: 'Amphiprion',
  Rhincodontidae: 'Rhincodon',
  Salmonidae: 'Oncorhynchus Salmo Salvelinus',
  Scombridae: 'Scomber Thunnus',
  Scorpaenidae: 'Pterois',
  Serrasalmidae: 'Colossoma Pygocentrus',
  Sinipercidae: 'Siniperca',
  Somniosidae: 'Somniosus',
  Sphyrnidae: 'Sphyrna',
  Sternoptychidae: 'Argyropelecus',
  Stomiidae: 'Chauliodus Idiacanthus Stomias',
  Synanceiidae: 'Synanceia',
  Syngnathidae: 'Hippocampus',
  Thysanoteuthidae: 'Thysanoteuthis',
  Tincidae: 'Tinca',
  Tremoctopodidae: 'Tremoctopus',
  Vampyroteuthidae: 'Vampyroteuthis',
  Xiphiidae: 'Xiphias'
};

const families = new Map(Object.entries(genera).flatMap(([family, names]) =>
  names.split(' ').map(genus => [genus, family])));
const salmon = new Set(['Oncorhynchus', 'Salmo', 'Salvelinus']);
const deep = habitat => /^(columna|fondo|hadal)_/.test(habitat);

function aquaticPlateTaxon(latin, className, habitats) {
  const genus = latin.split(' ')[0];
  const family = families.get(genus);
  if (!family) throw Error('Especie acuática sin familia revisada: ' + latin);
  if (className === 'Chondrichthyes') return { family, lot: 'condrictios' };
  if (className === 'Cephalopoda') return { family, lot: 'cefalopodos' };
  if (className !== 'Actinopterygii') throw Error('Clase fuera del plan acuático: ' + className);
  if (salmon.has(genus)) return { family, lot: 'salmonidos' };
  if (habitats.some(deep)) return { family, lot: 'profundos' };
  if (habitats.some(habitat => habitat === 'rio' || habitat === 'humedal')) return { family, lot: 'dulceacuicolas' };
  return { family, lot: habitats.includes('arrecife') ? 'arrecife' : 'marinos' };
}

module.exports = aquaticPlateTaxon;
