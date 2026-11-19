'use strict';

// Terrestrial even-toed and odd-toed ungulates in the current catalogue.
// The independent lookup also catches taxa filed under a legacy display group.
const generaByFamily = {
  Antilocapridae: 'Antilocapra',
  Bovidae: 'Addax Aepyceros Alcelaphus Ammotragus Antidorcas Antilope Bison Bos Boselaphus Bubalus Budorcas Capra Capricornis Cephalophus Connochaetes Damaliscus Eudorcas Gazella Hemitragus Hippotragus Kobus Litocranius Madoqua Oreamnos Oryx Ovibos Ovis Pantholops Philantomba Procapra Pseudois Rupicapra Saiga Syncerus Taurotragus Tragelaphus',
  Camelidae: 'Camelus Lama Vicugna',
  Cervidae: 'Alces Axis Blastocerus Capreolus Cervus Dama Elaphurus Hippocamelus Hydropotes Mazama Muntiacus Odocoileus Ozotoceros Pudu Pudella Rangifer Rusa',
  Equidae: 'Equus',
  Giraffidae: 'Giraffa Okapia',
  Hippopotamidae: 'Choeropsis Hippopotamus',
  Moschidae: 'Moschus',
  Rhinocerotidae: 'Ceratotherium Dicerorhinus Diceros Rhinoceros',
  Suidae: 'Babyrousa Phacochoerus Potamochoerus Sus',
  Tapiridae: 'Tapirus',
  Tayassuidae: 'Dicotyles Pecari Tayassu',
  Tragulidae: 'Hyemoschus Moschiola Tragulus'
};

const familyByGenus = new Map(Object.entries(generaByFamily).flatMap(([family, genera]) =>
  genera.split(' ').map(genus => [genus, family])));

function ungulateFamily(latin, catalogFamily) {
  return familyByGenus.get(latin.split(' ')[0]) ||
    (Object.hasOwn(generaByFamily, catalogFamily) ? catalogFamily : null);
}

module.exports = { ungulateFamily };
