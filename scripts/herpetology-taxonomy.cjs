'use strict';

// Family names follow The Reptile Database and Amphibian Species of the
// World. The runtime display groups and scientific names are retained.
const classification = {
  Squamata: {
    Agamidae: 'Agama Chlamydosaurus Draco Intellagama Moloch Phrynocephalus Pogona Uromastyx',
    Anguidae: 'Anguis Pseudopus',
    Boidae: 'Boa Epicrates Eunectes Sanzinia',
    Chamaeleonidae: 'Calumma Chamaeleo Furcifer Trioceros',
    Colubridae: 'Lampropeltis Leptophis',
    Corytophanidae: 'Basiliscus',
    Elapidae: 'Acanthophis Bungarus Dendroaspis Laticauda Micrurus Naja Notechis Ophiophagus Oxyuranus',
    Gekkonidae: 'Gekko Pachydactylus Phelsuma Stenodactylus Uroplatus',
    Helodermatidae: 'Heloderma',
    Iguanidae: 'Amblyrhynchus Conolophus Ctenosaura Cyclura Iguana',
    Lacertidae: 'Timon',
    Liolaemidae: 'Liolaemus',
    Natricidae: 'Natrix',
    Phrynosomatidae: 'Phrynosoma',
    Pythonidae: 'Malayopython Morelia Python',
    Scincidae: 'Tiliqua',
    Teiidae: 'Salvator',
    Tropiduridae: 'Microlophus',
    Varanidae: 'Varanus',
    Viperidae: 'Bitis Bothrops Cerastes Crotalus Daboia Vipera'
  },
  Testudines: {
    Cheloniidae: 'Chelonia Eretmochelys',
    Dermochelyidae: 'Dermochelys',
    Emydidae: 'Chrysemys Terrapene',
    Geoemydidae: 'Mauremys',
    Testudinidae: 'Aldabrachelys Astrochelys Chelonoidis Gopherus Testudo'
  },
  Crocodylia: {
    Alligatoridae: 'Alligator Caiman Melanosuchus',
    Crocodylidae: 'Crocodylus Mecistops Osteolaemus'
  },
  Rhynchocephalia: { Sphenodontidae: 'Sphenodon' },
  Anura: {
    Brachycephalidae: 'Brachycephalus',
    Brevicipitidae: 'Breviceps',
    Bufonidae: 'Epidalea Incilius Rhinella Schismaderma Sclerophrys Strauchbufo',
    Centrolenidae: 'Hyalinobatrachium',
    Ceratophryidae: 'Ceratophrys',
    Conrauidae: 'Conraua',
    Dendrobatidae: 'Dendrobates Phyllobates',
    Hemiphractidae: 'Gastrotheca',
    Myobatrachidae: 'Assa Pseudophryne',
    Pelodryadidae: 'Ranoidea',
    Phyllomedusidae: 'Agalychnis',
    Pipidae: 'Xenopus',
    Ranidae: 'Lithobates Rana',
    Rhinodermatidae: 'Rhinoderma'
  },
  Caudata: {
    Ambystomatidae: 'Ambystoma Dicamptodon',
    Cryptobranchidae: 'Andrias',
    Hynobiidae: 'Salamandrella',
    Salamandridae: 'Ichthyosaura Lissotriton Salamandra Triturus'
  }
};

const snakeFamilies = new Set(['Boidae', 'Colubridae', 'Elapidae', 'Natricidae', 'Pythonidae', 'Viperidae']);
const otherReptiles = { Testudines: 'Tortugas', Crocodylia: 'Crocodilianos', Rhynchocephalia: 'Rincocéfalos' };
const taxa = new Map(Object.entries(classification).flatMap(([order, families]) => {
  const amphibian = order === 'Anura' || order === 'Caudata';
  const edition = amphibian ? '4.8.2' : order === 'Squamata' ? '4.8.0' : '4.8.1';
  return Object.entries(families).flatMap(([family, genera]) => {
    const group = order === 'Squamata' ? (snakeFamilies.has(family) ? 'Serpientes' : 'Lagartos') :
      otherReptiles[order] || (order === 'Anura' ? 'Ranas y sapos' : 'Salamandras y tritones');
    return genera.split(' ').map(genus => [genus, { order, family, edition, group, className: amphibian ? 'Amphibia' : 'Reptilia' }]);
  });
}));

module.exports = latin => taxa.get(latin.split(' ')[0]);
