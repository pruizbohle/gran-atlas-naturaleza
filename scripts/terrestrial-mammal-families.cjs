'use strict';

// Taxonomy for the illustration inventory. The game's historical groups stay intact.
const orders = {
  Rodentia: {
    group: 'Roedores',
    families: {
      Castoridae: 'Castor',
      Caviidae: 'Dolichotis Hydrochoerus',
      Chinchillidae: 'Chinchilla Lagidium Lagostomus',
      Cricetidae: 'Chionomys Dicrostonyx Lemmus Microtus Myodes',
      Cuniculidae: 'Cuniculus',
      Dipodidae: 'Euchoreutes Jaculus',
      Echimyidae: 'Myocastor',
      Erethizontidae: 'Erethizon',
      Gliridae: 'Eliomys Glis Muscardinus',
      Heteromyidae: 'Dipodomys',
      Hystricidae: 'Hystrix',
      Octodontidae: 'Octodon',
      Sciuridae: 'Cynomys Geosciurus Marmota Petaurista Pteromys Sciurus Spermophilus',
      Spalacidae: 'Tachyoryctes'
    }
  },
  Lagomorpha: {
    group: 'Lagomorfos',
    families: { Leporidae: 'Brachylagus Lepus Oryctolagus Pentalagus Sylvilagus', Ochotonidae: 'Ochotona' }
  },
  Chiroptera: {
    group: 'Murciélagos',
    families: {
      Noctilionidae: 'Noctilio',
      Pteropodidae: 'Pteropus',
      Rhinolophidae: 'Rhinolophus',
      Vespertilionidae: 'Eptesicus Pipistrellus'
    }
  },
  Eulipotyphla: {
    group: 'Eulipotiflos',
    families: {
      Erinaceidae: 'Atelerix Erinaceus',
      Solenodontidae: 'Solenodon',
      Soricidae: 'Sorex Suncus',
      Talpidae: 'Desmana Galemys Talpa'
    }
  },
  Cingulata: {
    group: 'Armadillos',
    families: { Chlamyphoridae: 'Chaetophractus Euphractus Priodontes Tolypeutes', Dasypodidae: 'Dasypus' }
  },
  Pilosa: {
    group: 'Perezosos y osos hormigueros',
    families: {
      Bradypodidae: 'Bradypus',
      Choloepodidae: 'Choloepus',
      Cyclopedidae: 'Cyclopes',
      Myrmecophagidae: 'Myrmecophaga Tamandua'
    }
  },
  Pholidota: {
    group: 'Pangolines',
    families: { Manidae: 'Manis Phataginus Smutsia' }
  },
  Proboscidea: {
    group: 'Elefantes',
    families: { Elephantidae: 'Elephas Loxodonta' }
  },
  Hyracoidea: {
    group: 'Damanes',
    families: { Procaviidae: 'Procavia' }
  },
  Tubulidentata: {
    group: 'Tubulidentados',
    families: { Orycteropodidae: 'Orycteropus' }
  },
  Afrosoricida: {
    group: 'Afrosorícidos',
    families: { Tenrecidae: 'Tenrec' }
  }
};

const terrestrialByGenus = new Map(Object.entries(orders).flatMap(([order, { group, families }]) =>
  Object.entries(families).flatMap(([family, genera]) =>
    genera.split(' ').map(genus => [genus, { order, family, group }]))));

const aquaticFamilies = {
  Cetacea: {
    Balaenidae: 'Balaena Eubalaena',
    Balaenopteridae: 'Balaenoptera Megaptera',
    Delphinidae: 'Cephalorhynchus Delphinus Globicephala Grampus Lagenorhynchus Orcinus Pseudorca Sousa Stenella Tursiops',
    Eschrichtiidae: 'Eschrichtius',
    Iniidae: 'Inia',
    Monodontidae: 'Delphinapterus Monodon',
    Phocoenidae: 'Phocoena',
    Physeteridae: 'Physeter',
    Ziphiidae: 'Ziphius'
  },
  Sirenia: { Dugongidae: 'Dugong', Trichechidae: 'Trichechus' },
  Pinnipedia: {
    Odobenidae: 'Odobenus',
    Otariidae: 'Arctocephalus Eumetopias Otaria Zalophus',
    Phocidae: 'Erignathus Halichoerus Hydrurga Leptonychotes Lobodon Mirounga Ommatophoca Pagophilus Phoca Pusa'
  },
  'Nutria marina': { Mustelidae: 'Enhydra' }
};
const aquaticByGenus = new Map(Object.entries(aquaticFamilies).flatMap(([group, families]) =>
  Object.entries(families).flatMap(([family, genera]) =>
    genera.split(' ').map(genus => [genus, { group, family }]))));

function terrestrialMammal(latin) {
  return terrestrialByGenus.get(latin.split(' ')[0]);
}

function aquaticMammal(latin) {
  return aquaticByGenus.get(latin.split(' ')[0]);
}

module.exports = { terrestrialMammal, aquaticMammal };
