/* Generated from app.js; run node scripts/build-dimorphism-lab.cjs. No game bootstrap. */
(function(){
const STORAGE_KEY='gran_atlas_v05';
const MAX_OFFLINE_MS=8*60*60*1000;
const MAX_AUTOMATIC_SIGHTINGS_PER_SPECIES_PER_HOUR=100;
const THRESHOLDS=[10,50,100,200,500];
const SPECIES_KNOWLEDGE_COSTS=[100,500,1000,5000,10000];
const SPECIES_MONEY_COSTS=[10,50,100,500,1000];
const STAGE_LABELS=[
  'Conocer la zona donde vive',
  'Identificar su nombre científico',
  'Documentar actividad y conducta',
  'Estudiar alimentación o dimorfismo',
  'Completar monografía'
];

const REGIONS=[
  {
    "id": "HX-01-09",
    "name": "Islas Británicas",
    "code": "HX-01-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 0
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "cisne_vulgar",
      "frailecillo_atlantico",
      "eu_esp_0654",
      "eu_esp_0649",
      "eu_esp_0636",
      "eu_esp_0631",
      "eu_esp_0629",
      "eu_esp_0628",
      "eu_esp_0637",
      "buho_comun",
      "eu_esp_0643",
      "eu_esp_0646",
      "zorro_rojo",
      "erizo_europeo",
      "nutria_europea",
      "tejon_europeo",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0614",
      "eu_esp_0612",
      "eu_esp_0613",
      "eu_esp_0611",
      "eu_esp_0604",
      "eu_esp_0606",
      "ardilla_roja",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0669",
      "eu_esp_0661",
      "eu_esp_0660",
      "eu_esp_0656",
      "eu_esp_0655"
    ]
  },
  {
    "id": "HX-01-11",
    "name": "Escandinavia",
    "code": "HX-01-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 1
    },
    "habitats": [
      "bosque",
      "tundra"
    ],
    "species": [
      "eu_esp_0654",
      "eu_esp_0640",
      "eu_esp_0267",
      "eu_esp_0639",
      "urogallo_comun",
      "lobo_gris",
      "zorro_artico",
      "lince_boreal",
      "gloton",
      "eu_esp_0621",
      "eu_esp_0618",
      "oso_pardo",
      "eu_esp_0610",
      "eu_esp_0604",
      "alce",
      "reno",
      "eu_esp_0669",
      "eu_esp_0660"
    ]
  },
  {
    "id": "HX-02-09",
    "name": "Alpes",
    "code": "HX-02-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 2
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0642",
      "perdiz_nival",
      "aguila_real",
      "quebrantahuesos",
      "lince_boreal",
      "eu_esp_0609",
      "liebre_variable",
      "marmota_alpina",
      "ibice_alpino",
      "rebeco_alpino",
      "eu_esp_0657",
      "salamandra_alpina",
      "vibora_aspid"
    ]
  },
  {
    "id": "HX-02-10",
    "name": "Europa Occidental",
    "code": "HX-02-10",
    "continent": "Europa",
    "unlock": {
      "prestige": 3
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "eu_esp_0652",
      "eu_esp_0650",
      "eu_esp_0653",
      "eu_esp_0631",
      "petirrojo",
      "eu_esp_0629",
      "eu_esp_0632",
      "eu_esp_0630",
      "eu_esp_0628",
      "eu_esp_0637",
      "eu_esp_0644",
      "eu_esp_0645",
      "buho_real",
      "eu_esp_0643",
      "milano_real",
      "eu_esp_0646",
      "zorro_rojo",
      "gato_montes",
      "eu_esp_0615",
      "eu_esp_0620",
      "eu_esp_0621",
      "tejon_europeo",
      "eu_esp_0618",
      "eu_esp_0622",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0614",
      "eu_esp_0616",
      "eu_esp_0612",
      "eu_esp_0613",
      "jabali",
      "eu_esp_0611",
      "eu_esp_0601",
      "eu_esp_0602",
      "eu_esp_0604",
      "eu_esp_0603",
      "eu_esp_0606",
      "eu_esp_0605",
      "ardilla_roja",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0668",
      "eu_esp_0667",
      "eu_esp_0661",
      "eu_esp_0659",
      "eu_esp_0660",
      "eu_esp_0656",
      "salamandra_comun",
      "eu_esp_0655",
      "eu_esp_0666",
      "eu_esp_0665",
      "vibora_aspid"
    ]
  },
  {
    "id": "HX-02-11",
    "name": "Europa Central",
    "code": "HX-02-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 4
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "cisne_vulgar",
      "eu_esp_0652",
      "eu_esp_0629",
      "eu_esp_0632",
      "eu_esp_0638",
      "eu_esp_0630",
      "eu_esp_0628",
      "eu_esp_0637",
      "eu_esp_0644",
      "eu_esp_0643",
      "lobo_gris",
      "gato_montes",
      "lince_boreal",
      "eu_esp_0159",
      "eu_esp_0615",
      "nutria_europea",
      "eu_esp_0620",
      "eu_esp_0621",
      "tejon_europeo",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0612",
      "jabali",
      "eu_esp_0611",
      "castor_europeo",
      "eu_esp_0602",
      "eu_esp_0603",
      "eu_esp_0605",
      "eu_esp_0608",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0668",
      "eu_esp_0669",
      "eu_esp_0667",
      "eu_esp_0657",
      "eu_esp_0655",
      "eu_esp_0665"
    ]
  },
  {
    "id": "HX-02-12",
    "name": "Península Ibérica",
    "code": "HX-02-12",
    "continent": "Europa",
    "unlock": {
      "prestige": 5
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0653",
      "eu_esp_0641",
      "eu_esp_0633",
      "eu_esp_0635",
      "eu_esp_0634",
      "aguila_imperial_iberica",
      "eu_esp_0645",
      "eu_esp_0647",
      "buitre_leonado",
      "milano_real",
      "eu_esp_0646",
      "lobo_gris",
      "lince_iberico",
      "eu_esp_0623",
      "eu_esp_0219",
      "eu_esp_0620",
      "eu_esp_0614",
      "eu_esp_0616",
      "jabali",
      "eu_esp_0601",
      "eu_esp_0607",
      "conejo_europeo",
      "cabra_montes_iberica",
      "ciervo_rojo",
      "eu_esp_0626",
      "eu_esp_0116",
      "lagarto_ocelado",
      "eu_esp_0659",
      "eu_esp_0666"
    ]
  },
  {
    "id": "HX-03-09",
    "name": "Europa Oriental",
    "code": "HX-03-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 6
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0636",
      "eu_esp_0029",
      "lobo_gris",
      "zorro_rojo",
      "lince_boreal",
      "eu_esp_0624",
      "eu_esp_0622",
      "jabali",
      "eu_esp_0625",
      "castor_europeo",
      "liebre_europea",
      "eu_esp_0603",
      "eu_esp_0608",
      "alce",
      "bisonte_europeo",
      "ciervo_rojo",
      "eu_esp_0670"
    ]
  },
  {
    "id": "HX-03-10",
    "name": "Península Itálica",
    "code": "HX-03-10",
    "continent": "Europa",
    "unlock": {
      "prestige": 7
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0641",
      "eu_esp_0635",
      "eu_esp_0634",
      "eu_esp_0647",
      "eu_esp_0204",
      "lobo_gris",
      "zorro_rojo",
      "gato_montes",
      "eu_esp_0253",
      "jabali",
      "oso_pardo",
      "eu_esp_0602",
      "corzo_europeo",
      "eu_esp_0627",
      "vibora_aspid",
      "eu_esp_0506"
    ]
  },
  {
    "id": "HX-03-11",
    "name": "Región del mar Báltico",
    "code": "HX-03-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 8
    },
    "habitats": [
      "bosque",
      "rio"
    ],
    "species": [
      "ciguena_negra",
      "eu_esp_0144",
      "eu_esp_0654",
      "eu_esp_0650",
      "eu_esp_0649",
      "eu_esp_0640",
      "eu_esp_0630",
      "eu_esp_0639",
      "eu_esp_0644",
      "eu_esp_0232",
      "lobo_gris",
      "lince_boreal",
      "nutria_europea",
      "eu_esp_0618",
      "castor_europeo",
      "eu_esp_0605",
      "alce",
      "corzo_europeo",
      "eu_esp_0670",
      "eu_esp_0665"
    ]
  },
  {
    "id": "HX-03-12",
    "name": "Balcanes",
    "code": "HX-03-12",
    "continent": "Europa",
    "unlock": {
      "prestige": 9
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "eu_esp_0642",
      "eu_esp_0632",
      "eu_esp_0638",
      "eu_esp_0634",
      "aguila_real",
      "buitre_leonado",
      "lobo_gris",
      "gato_montes",
      "lince_boreal",
      "jabali",
      "oso_pardo",
      "eu_esp_0625",
      "eu_esp_0609",
      "eu_esp_0627",
      "rebeco_alpino",
      "eu_esp_0505"
    ]
  },
  {
    "id": "HX-03-13",
    "name": "Cáucaso",
    "code": "HX-03-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 10
    },
    "habitats": [
      "bosque",
      "montana",
      "pradera"
    ],
    "species": [
      "aguila_real",
      "quebrantahuesos",
      "lobo_gris",
      "lince_boreal",
      "asia_esp_0401",
      "jabali",
      "oso_pardo",
      "asia_esp_0081",
      "asia_esp_0149",
      "asia_esp_0903"
    ]
  },
  {
    "id": "HX-03-15",
    "name": "Anatolia",
    "code": "HX-03-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 12
    },
    "habitats": [
      "bosque",
      "pradera",
      "montana",
      "estepa"
    ],
    "species": [
      "aguila_real",
      "lobo_gris",
      "asia_esp_0088",
      "gato_montes",
      "lince_boreal",
      "jabali",
      "oso_pardo",
      "asia_esp_0080",
      "asia_esp_0903",
      "eu_esp_0505"
    ]
  },
  {
    "id": "HX-02-13",
    "name": "Siberia Occidental",
    "code": "HX-02-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 14
    },
    "habitats": [
      "bosque",
      "rio",
      "tundra",
      "pradera"
    ],
    "species": [
      "asia_esp_0287",
      "asia_esp_0880",
      "asia_esp_0861",
      "asia_esp_0886",
      "lobo_gris",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "castor_europeo",
      "alce",
      "reno",
      "asia_esp_0914"
    ]
  },
  {
    "id": "HX-03-14",
    "name": "Siberia Central",
    "code": "HX-03-14",
    "continent": "Asia",
    "unlock": {
      "prestige": 16
    },
    "habitats": [
      "bosque",
      "tundra",
      "rio",
      "pradera"
    ],
    "species": [
      "asia_esp_0880",
      "asia_esp_0861",
      "urogallo_comun",
      "asia_esp_0886",
      "lobo_gris",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "liebre_variable",
      "alce",
      "reno",
      "asia_esp_0914",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-04-13",
    "name": "Mongolia",
    "code": "HX-04-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 18
    },
    "habitats": [
      "estepa",
      "pradera",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0020",
      "asia_esp_0030",
      "asia_esp_0887",
      "lobo_gris",
      "asia_esp_0533",
      "asia_esp_0387",
      "asia_esp_0323",
      "asia_esp_0184",
      "asia_esp_0441",
      "asia_esp_0898"
    ]
  },
  {
    "id": "HX-02-15",
    "name": "Montes Urales",
    "code": "HX-02-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 20
    },
    "habitats": [
      "bosque",
      "montana",
      "pradera",
      "rio"
    ],
    "species": [
      "urogallo_comun",
      "lobo_gris",
      "zorro_rojo",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "oso_pardo",
      "alce"
    ]
  },
  {
    "id": "HX-03-16",
    "name": "Siberia Oriental",
    "code": "HX-03-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 22
    },
    "habitats": [
      "bosque",
      "tundra",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0861",
      "lobo_gris",
      "lince_boreal",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "asia_esp_0086",
      "asia_esp_0344",
      "reno",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-03-18",
    "name": "Kamchatka",
    "code": "HX-03-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 24
    },
    "habitats": [
      "tundra",
      "costa",
      "rio",
      "bosque"
    ],
    "species": [
      "asia_esp_0209",
      "asia_esp_0203",
      "asia_esp_0234",
      "zorro_rojo",
      "asia_esp_0177",
      "oso_pardo",
      "reno",
      "asia_esp_0369",
      "asia_esp_0371",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-04-14",
    "name": "Desierto de Gobi",
    "code": "HX-04-14",
    "continent": "Asia",
    "unlock": {
      "prestige": 26
    },
    "habitats": [
      "desierto",
      "estepa",
      "pradera",
      "montana"
    ],
    "species": [
      "asia_esp_0881",
      "aguila_real",
      "asia_esp_0533",
      "oso_pardo",
      "asia_esp_0194",
      "asia_esp_0073",
      "asia_esp_0441",
      "asia_esp_0431",
      "asia_esp_0898"
    ]
  },
  {
    "id": "HX-04-15",
    "name": "Himalaya",
    "code": "HX-04-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 28
    },
    "habitats": [
      "montana",
      "pradera",
      "bosque",
      "rio"
    ],
    "species": [
      "asia_esp_0863",
      "asia_esp_0294",
      "asia_esp_0864",
      "asia_esp_0503",
      "asia_esp_0865",
      "aguila_real",
      "lobo_gris",
      "asia_esp_0820",
      "asia_esp_0403",
      "asia_esp_0007",
      "asia_esp_0855",
      "asia_esp_0850",
      "asia_esp_0844",
      "asia_esp_0523",
      "asia_esp_0062",
      "asia_esp_0821",
      "asia_esp_0240",
      "asia_esp_0445"
    ]
  },
  {
    "id": "HX-03-17",
    "name": "Península Arábiga",
    "code": "HX-03-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 30
    },
    "habitats": [
      "desierto",
      "estepa",
      "pradera",
      "montana"
    ],
    "species": [
      "lobo_gris",
      "asia_esp_0538",
      "asia_esp_0088",
      "asia_esp_0206",
      "asia_esp_0214",
      "asia_esp_0383",
      "asia_esp_0519",
      "asia_esp_0102"
    ]
  },
  {
    "id": "HX-04-12",
    "name": "Mesopotamia",
    "code": "HX-04-12",
    "continent": "Asia",
    "unlock": {
      "prestige": 32
    },
    "habitats": [
      "humedal",
      "rio",
      "estepa",
      "pradera"
    ],
    "species": [
      "garza_real",
      "pelicano_cenudo",
      "flamenco_comun",
      "zorro_rojo",
      "asia_esp_0205",
      "asia_esp_0300",
      "jabali",
      "asia_esp_0065",
      "asia_esp_0910",
      "asia_esp_0327"
    ]
  },
  {
    "id": "HX-04-16",
    "name": "Meseta de Irán",
    "code": "HX-04-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 34
    },
    "habitats": [
      "estepa",
      "desierto",
      "pradera",
      "montana"
    ],
    "species": [
      "asia_esp_0873",
      "asia_esp_0881",
      "lobo_gris",
      "asia_esp_0088",
      "asia_esp_0206",
      "asia_esp_0401",
      "asia_esp_0246",
      "oso_pardo",
      "asia_esp_0080",
      "asia_esp_0182",
      "asia_esp_0218"
    ]
  },
  {
    "id": "HX-04-17",
    "name": "Meseta del Tíbet",
    "code": "HX-04-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 36
    },
    "habitats": [
      "montana",
      "tundra",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0227",
      "asia_esp_0534",
      "asia_esp_0403",
      "asia_esp_0321",
      "asia_esp_0062",
      "asia_esp_0821",
      "asia_esp_0183",
      "asia_esp_0404",
      "asia_esp_0442",
      "asia_esp_0445"
    ]
  },
  {
    "id": "HX-04-18",
    "name": "Estepas de Asia Central",
    "code": "HX-04-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 38
    },
    "habitats": [
      "estepa",
      "pradera",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0030",
      "asia_esp_0887",
      "lobo_gris",
      "asia_esp_0533",
      "asia_esp_0347",
      "asia_esp_0194",
      "asia_esp_0319",
      "asia_esp_0184",
      "asia_esp_0441",
      "asia_esp_0468"
    ]
  },
  {
    "id": "HX-05-15",
    "name": "China Septentrional",
    "code": "HX-05-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 40
    },
    "habitats": [
      "bosque",
      "estepa",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0878",
      "asia_esp_0422",
      "lobo_gris",
      "zorro_rojo",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0842",
      "jabali",
      "asia_esp_0086",
      "asia_esp_0824",
      "asia_esp_0344",
      "asia_esp_0915",
      "asia_esp_0910",
      "asia_esp_0911"
    ]
  },
  {
    "id": "HX-05-16",
    "name": "Subcontinente Indio",
    "code": "HX-05-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 42
    },
    "habitats": [
      "bosque",
      "sabana",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0888",
      "asia_esp_0868",
      "asia_esp_0872",
      "asia_esp_0873",
      "asia_esp_0410",
      "asia_esp_0874",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0816",
      "asia_esp_0176",
      "asia_esp_0855",
      "asia_esp_0852",
      "asia_esp_0336",
      "asia_esp_0860",
      "asia_esp_0853",
      "asia_esp_0476",
      "asia_esp_0833",
      "asia_esp_0050",
      "asia_esp_0061",
      "asia_esp_0063",
      "asia_esp_0830",
      "asia_esp_0465",
      "asia_esp_0825",
      "asia_esp_0900",
      "asia_esp_0136",
      "asia_esp_0906",
      "asia_esp_0905",
      "asia_esp_0351"
    ]
  },
  {
    "id": "HX-05-17",
    "name": "China Meridional",
    "code": "HX-05-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 44
    },
    "habitats": [
      "bosque",
      "selva",
      "rio",
      "montana"
    ],
    "species": [
      "asia_esp_0124",
      "asia_esp_0864",
      "asia_esp_0296",
      "asia_esp_0096",
      "asia_esp_0355",
      "asia_esp_0006",
      "asia_esp_0842",
      "asia_esp_0318",
      "asia_esp_0854",
      "asia_esp_0395",
      "asia_esp_0856",
      "asia_esp_0523",
      "asia_esp_0310",
      "asia_esp_0821",
      "asia_esp_0345",
      "asia_esp_0910",
      "asia_esp_0911",
      "asia_esp_0902",
      "asia_esp_0016"
    ]
  },
  {
    "id": "HX-06-16",
    "name": "Península de Corea",
    "code": "HX-06-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 46
    },
    "habitats": [
      "bosque",
      "pradera",
      "rio",
      "costa"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0878",
      "asia_esp_0433",
      "zorro_rojo",
      "asia_esp_0440",
      "asia_esp_0333",
      "jabali",
      "asia_esp_0523",
      "asia_esp_0111",
      "asia_esp_0249",
      "asia_esp_0915"
    ]
  },
  {
    "id": "HX-06-17",
    "name": "Sudeste Asiático",
    "code": "HX-06-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 48
    },
    "habitats": [
      "selva",
      "bosque",
      "rio",
      "humedal"
    ],
    "species": [
      "asia_esp_0888",
      "asia_esp_0868",
      "asia_esp_0067",
      "asia_esp_0867",
      "asia_esp_0869",
      "asia_esp_0883",
      "asia_esp_0820",
      "asia_esp_0355",
      "asia_esp_0402",
      "asia_esp_0816",
      "asia_esp_0849",
      "asia_esp_0858",
      "asia_esp_0176",
      "asia_esp_0238",
      "asia_esp_0857",
      "asia_esp_0317",
      "asia_esp_0850",
      "asia_esp_0854",
      "asia_esp_0860",
      "asia_esp_0844",
      "asia_esp_0853",
      "asia_esp_0859",
      "asia_esp_0251",
      "asia_esp_0352",
      "asia_esp_0436",
      "asia_esp_0491",
      "asia_esp_0165",
      "asia_esp_0825",
      "asia_esp_0834",
      "asia_esp_0498",
      "asia_esp_0901",
      "asia_esp_0902",
      "asia_esp_0527",
      "asia_esp_0316",
      "asia_esp_0373"
    ]
  },
  {
    "id": "HX-06-18",
    "name": "Archipiélago Japonés",
    "code": "HX-06-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 50
    },
    "habitats": [
      "bosque",
      "montana",
      "costa",
      "rio"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0877",
      "asia_esp_0494",
      "asia_esp_0886",
      "asia_esp_0363",
      "asia_esp_0440",
      "asia_esp_0414",
      "asia_esp_0523",
      "asia_esp_0308",
      "asia_esp_0087",
      "asia_esp_0111",
      "asia_esp_0017"
    ]
  }
];

// v3.4: tres regiones iniciales de África, sin modificar las anteriores.
REGIONS.push(...[{"id":"HX-06-09","name":"Magreb","code":"HX-06-09","continent":"África","unlock":{"prestige":53},"habitats":["desierto","estepa","costa","pradera"],"species":["af_fenec","af_dromedario","af_gacela_dorcas","af_chacal_dorado","af_ibis_eremita","af_serval","af_cobra_egipcia","af_arrui"]},{"id":"HX-07-10","name":"Sabana de África oriental","code":"HX-07-10","continent":"África","unlock":{"prestige":56},"habitats":["pradera","estepa","rio","humedal"],"species":["af_leon","af_elefante_sabana","af_rinoceronte_blanco","af_bufalo_cafre","af_licaon","af_cocodrilo_nilo","af_aguila_pescadora","af_piton_africana","af_serval"]},{"id":"HX-08-11","name":"Cuenca del Congo","code":"HX-08-11","continent":"África","unlock":{"prestige":59},"habitats":["bosque","humedal","rio","pradera"],"species":["af_gorila_occidental","af_chimpance","af_pangolin_gigante","af_leopardo","af_elefante_bosque","af_loro_gris","af_colobo","af_cocodrilo_hocico"]}]);
// v3.5 · nuevas zonas de África, sin modificar los registros anteriores.
REGIONS.push(...[{"id":"HX-06-11","name":"Valle del Nilo","code":"HX-06-11","continent":"África","unlock":{"prestige":62},"habitats":["rio","humedal","estepa"],"species":["af_hipopotamo","af_cocodrilo_nilo","af_ibis_sagrado","af_garza_goliat","af_abejaruco_carmin","af_avestruz","af_cobra_egipcia"]},{"id":"HX-07-08","name":"Sahel occidental","code":"HX-07-08","continent":"África","unlock":{"prestige":65},"habitats":["estepa","desierto","pradera"],"species":["af_orix","af_zorro_palido","af_gacela_dorcas","af_chacal_dorado","af_arrui","af_jirafa","af_avestruz"]},{"id":"HX-08-08","name":"Bosques de África occidental","code":"HX-08-08","continent":"África","unlock":{"prestige":68},"habitats":["bosque","humedal","rio"],"species":["af_antilope_bongo","af_duiker_azul","af_civeta","af_mandril","af_turaco","af_chimpance","af_loro_gris","af_leopardo"]},{"id":"HX-09-11","name":"Grandes Lagos africanos","code":"HX-09-11","continent":"África","unlock":{"prestige":71},"habitats":["bosque","pradera","humedal"],"species":["af_gorila_montana","af_galago","af_babuino_oliva","af_grulla_coronada","af_bufalo_cafre","af_hipopotamo","af_cocodrilo_nilo","af_leopardo"]},{"id":"HX-10-10","name":"Kalahari y sabana austral","code":"HX-10-10","continent":"África","unlock":{"prestige":74},"habitats":["desierto","estepa","pradera"],"species":["af_suricata","af_caracal","af_springbok","af_guepardo","af_orix","af_hiena_manchada","af_nu_azul","af_cebra_llanura","af_avestruz"]},{"id":"HX-11-11","name":"Costa del Cabo","code":"HX-11-11","continent":"África","unlock":{"prestige":77},"habitats":["costa","pradera","estepa"],"species":["af_pinguino_africano","af_lobo_marino_cabo","af_tiburon_blanco","af_tortuga_laúd","af_eland","af_secretario","af_babuino_oliva"]},{"id":"HX-09-14","name":"Madagascar","code":"HX-09-14","continent":"África","unlock":{"prestige":80},"habitats":["bosque","pradera","costa"],"species":["af_lemur_colaanillada","af_sifaka","af_fosa","af_camaleon_pantera","af_gecko_diurno","af_tenrec","af_indri","af_tortuga_radiada","af_fosa_ave"]}]);
// Beta 3.7: tres regiones nuevas de África.
REGIONS.push(...[{"id":"HX-07-12","name":"Cuerno de África","code":"HX-07-12","continent":"África","unlock":{"prestige":83},"habitats":["estepa","desierto","pradera"],"species":["af_asno_somali","af_gerenuc","af_dikdik_guenther","af_babuino_hamadryas","af_gacela_dorcas","af_avestruz","af_caracal","af_hiena_manchada","af_orix"]},{"id":"HX-10-09","name":"Delta del Okavango","code":"HX-10-09","continent":"África","unlock":{"prestige":86},"habitats":["humedal","rio","pradera"],"species":["af_lechwe_rojo","af_jacana_africana","af_sitatunga","af_hipopotamo","af_cocodrilo_nilo","af_elefante_sabana","af_bufalo_cafre","af_grulla_coronada","af_aguila_pescadora","af_abejaruco_carmin"]},{"id":"HX-08-10","name":"Bosques de Gabón","code":"HX-08-10","continent":"África","unlock":{"prestige":89},"habitats":["bosque","humedal","rio"],"species":["af_potamoquero","af_mono_brazza","af_picatartes_gris","af_gorila_occidental","af_mandril","af_elefante_bosque","af_pangolin_gigante","af_antilope_bongo","af_loro_gris","af_duiker_azul"]}]);
// Beta 3.8: ampliación gradual de África, sin modificar códigos existentes.
REGIONS.push(...[{"id":"HX-07-13","name":"Tierras altas de Etiopía","code":"HX-07-13","continent":"África","unlock":{"prestige":92},"habitats":["montana","pradera","humedal","rio"],"species":["af_lobo_etiope","af_gelada","af_ibice_walia","af_quebrantahuesos","af_nyala_montana","af_ganso_alas_azules","af_babuino_oliva","af_ibis_sagrado"]},{"id":"HX-11-08","name":"Desierto del Namib","code":"HX-11-08","continent":"África","unlock":{"prestige":95},"habitats":["desierto","estepa","costa","pradera"],"species":["af_zorro_cabo","af_hiena_parda","af_camaleon_namaqua","af_geco_patas_palmeadas","af_orix","af_springbok","af_suricata","af_avestruz","af_caracal"]}]);
// v3.9: nuevas zonas africanas, sin editar identificadores ni regiones anteriores.
REGIONS.push(...[{"id":"HX-06-08","name":"Montañas del Atlas","code":"HX-06-08","continent":"África","unlock":{"prestige":98},"habitats":["montana","bosque","estepa","desierto"],"species":["af_macaco_berberia","af_gato_montes_africano","af_ciervo_berberia","af_zorro_ruppell","af_arrui","af_fenec","af_chacal_dorado","af_gacela_dorcas","af_cobra_egipcia"]},{"id":"HX-09-09","name":"Bosques de miombo","code":"HX-09-09","continent":"África","unlock":{"prestige":101},"habitats":["bosque","pradera","estepa"],"species":["af_antilope_sable","af_calao_terrestre","af_pangolin_temminck","af_inseparable_lilian","af_elefante_sabana","af_licaon","af_leopardo","af_babuino_oliva","af_guepardo"]},{"id":"HX-10-12","name":"Costa de Mozambique","code":"HX-10-12","continent":"África","unlock":{"prestige":104},"habitats":["costa","rio","humedal"],"species":["af_dugongo","af_manta_gigante","af_delfin_jorobado_indico","af_martin_malaquita","af_tortuga_laúd","af_tiburon_blanco","af_cocodrilo_nilo","af_hipopotamo","af_garza_goliat","af_aguila_pescadora"]}]);
// Beta 3.10: dos áreas africanas, sin modificar los IDs previos.
REGIONS.push(...[{"id":"HX-08-12","name":"Lagos del Rift","code":"HX-08-12","continent":"África","unlock":{"prestige":107},"habitats":["humedal","rio","pradera","estepa"],"species":["af_flamenco_enano","af_pelicano_blanco","af_jirafa_rothschild","af_gran_kudu","af_hipopotamo","af_leon","af_bufalo_cafre","af_aguila_pescadora","af_guepardo"]},{"id":"HX-07-14","name":"Islas Seychelles y Aldabra","code":"HX-07-14","continent":"África","unlock":{"prestige":110},"habitats":["costa","bosque","pradera"],"species":["af_tortuga_aldabra","af_loro_negro_seychelles","af_cernicalo_seychelles","af_tiburon_puntas_negras","af_tortuga_laúd","af_manta_gigante","af_dugongo","af_delfin_jorobado_indico"]}]);
// Beta 3.12: humedales de Bangweulu y Lowveld (meta africana 24 zonas).
REGIONS.push(...[{"id":"HX-09-12","name":"Humedales de Bangweulu","code":"HX-09-12","continent":"África","unlock":{"prestige":113},"habitats":["humedal","rio","pradera","bosque"],"species":["af_picozapato","af_lechwe_negro","af_grulla_carunculada","af_puku","af_sitatunga","af_hipopotamo","af_jacana_africana","af_pelicano_blanco","af_grulla_coronada","af_aguila_pescadora"]},{"id":"HX-11-10","name":"Lowveld y Kruger","code":"HX-11-10","continent":"África","unlock":{"prestige":116},"habitats":["pradera","bosque","estepa","rio"],"species":["af_impala","af_nyala_comun","af_mangosta_enana","af_calao_trompetero","af_rinoceronte_blanco","af_elefante_sabana","af_leopardo","af_leon","af_bufalo_cafre","af_calao_terrestre","af_antilope_sable"]}]);
// Beta 3.13: dos hexágonos africanos nuevos; los ID históricos permanecen intactos.
REGIONS.push(...[{"id":"HX-06-07","name":"Desierto del Sáhara","continent":"África","unlock":{"prestige":119},"habitats":["desierto","estepa"],"species":["af_xlsx_sahara_buitre","af_fenec","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_gacela_dorcas","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"code":"HX-06-07"},{"id":"HX-07-11","name":"Sahel oriental","continent":"África","unlock":{"prestige":122},"habitats":["estepa","pradera","desierto"],"species":["af_abejaruco_carmin","af_avestruz","af_xlsx_sahara_buitre","af_licaon","af_guepardo","af_hiena_manchada","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_gacela_dorcas","af_xlsx_orix_cimitarra","af_facoquero"],"code":"HX-07-11"}]);
// Apertura inicial de Norteamérica, según Excel base: Alaska y Columbia Británica.
REGIONS.push(...[{"id":"HX-01-05","name":"Alaska","code":"HX-01-05","continent":"Norteamérica","unlock":{"prestige":125},"habitats":["bosque","tundra","montana","rio"],"species":["na_esp_anser_caerulescens","na_esp_corvus_corax","aguila_real","na_esp_bubo_scandiacus","na_esp_falco_peregrinus","lobo_gris","zorro_rojo","na_esp_dicrostonyx_groenlandicus","gloton","na_esp_lemmus_trimucronatus","na_esp_ursus_americanus","oso_pardo","na_esp_castor_canadensis","alce","na_esp_ovibos_moschatus","na_esp_ovis_dalli","reno"]},{"id":"HX-02-02","name":"Columbia Británica","code":"HX-02-02","continent":"Norteamérica","unlock":{"prestige":128},"habitats":["bosque","rio","costa","montana"],"species":["na_esp_dryocopus_pileatus","na_esp_haliaeetus_leucocephalus","lobo_gris","na_esp_puma_concolor","na_esp_lontra_canadensis","na_esp_ursus_americanus","oso_pardo","na_esp_castor_canadensis","na_esp_marmota_vancouverensis","na_esp_odocoileus_hemionus","na_esp_oncorhynchus_mykiss"]}]);
const SPECIES={
  "asia_esp_0287":{"name": "Grulla siberiana", "latin": "Leucogeranus leucogeranus", "rare": "Muy rara", "kind": "stork", "color": "#e8e5df", "habitats": ["rio", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0880":{"name": "Gallo lira", "latin": "Lyrurus tetrix", "rare": "Común", "kind": "forestbird", "color": "#292f36", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0861":{"name": "Arrendajo de Siberia", "latin": "Perisoreus infaustus", "rare": "Común", "kind": "songbird", "color": "#9c765c", "habitats": ["bosque"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0886":{"name": "Azor común", "latin": "Accipiter gentilis", "rare": "Raro", "kind": "raptor", "color": "#81654a", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0326":{"name": "Marta cibelina", "latin": "Martes zibellina", "rare": "Común", "kind": "mustelid", "color": "#5c4939", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0843":{"name": "Ardilla voladora siberiana", "latin": "Pteromys volans", "rare": "Poco común", "kind": "small", "color": "#8d7660", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0914":{"name": "Esturión siberiano", "latin": "Acipenser baerii", "rare": "Común", "kind": "fish", "color": "#6d8184", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Albino"], "dimorphism": false},
  "asia_esp_0899":{"name": "Salamandra siberiana", "latin": "Salamandrella keyserlingii", "rare": "Muy rara", "kind": "salamander", "color": "#706a52", "habitats": ["bosque", "tundra", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucística", "Notable"], "dimorphism": false},
  "asia_esp_0020":{"name": "Grulla damisela", "latin": "Anthropoides virgo", "rare": "Común", "kind": "stork", "color": "#a2a6ab", "habitats": ["estepa", "pradera", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0030":{"name": "Águila esteparia", "latin": "Aquila nipalensis", "rare": "Común", "kind": "raptor", "color": "#705139", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0887":{"name": "Halcón sacre", "latin": "Falco cherrug", "rare": "Raro", "kind": "raptor", "color": "#9b775a", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0533":{"name": "Zorro corsac", "latin": "Vulpes corsac", "rare": "Poco común", "kind": "canid", "color": "#c1a278", "habitats": ["estepa", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0387":{"name": "Manul", "latin": "Otocolobus manul", "rare": "Común", "kind": "cat", "color": "#9c9b91", "habitats": ["estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0323":{"name": "Marmota siberiana", "latin": "Marmota sibirica", "rare": "Común", "kind": "small", "color": "#aa8a65", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0184":{"name": "Caballo de Przewalski", "latin": "Equus przewalskii", "rare": "Poco común", "kind": "deer", "color": "#b9936d", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0441":{"name": "Gacela de Mongolia", "latin": "Procapra gutturosa", "rare": "Poco común", "kind": "deer", "color": "#ba9b71", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": true},
  "asia_esp_0898":{"name": "Sapo mongol", "latin": "Strauchbufo raddei", "rare": "Raro", "kind": "reptile", "color": "#8b9370", "habitats": ["estepa", "pradera", "rio"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico"], "dimorphism": false},
  zorro_rojo:{name:'Zorro rojo', latin:'Vulpes vulpes', rare:'Común', kind:'canid', color:'#d66a2c', habitats:['bosque','pradera'], times:['amanecer','atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Melánico','Leucístico','Notable'], dimorphism:false},
  tejon_europeo:{name:'Tejón europeo', latin:'Meles meles', rare:'Raro', kind:'mustelid', color:'#a58f76', habitats:['bosque'], times:['noche'], seasons:['primavera','verano','otono'], special:['Leucístico'], dimorphism:false},
  erizo_europeo:{name:'Erizo europeo', latin:'Erinaceus europaeus', rare:'Común', kind:'small', color:'#8f6e53', habitats:['bosque','pradera'], times:['atardecer','noche'], seasons:['primavera','verano','otono'], special:['Albino'], dimorphism:false},
  ciervo_rojo:{name:'Ciervo rojo', latin:'Cervus elaphus', rare:'Común', kind:'deer', color:'#a76b3b', habitats:['bosque','pradera'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Notable'], dimorphism:true},
  nutria_europea:{name:'Nutria europea', latin:'Lutra lutra', rare:'Común', kind:'otter', color:'#7b5b39', habitats:['rio'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Leucístico','Melánico','Notable'], dimorphism:false},
  ardilla_roja:{name:'Ardilla roja', latin:'Sciurus vulgaris', rare:'Común', kind:'small', color:'#c76a2f', habitats:['bosque'], times:['amanecer','dia'], seasons:['primavera','verano','otono'], special:['Melánica'], dimorphism:false},
  frailecillo_atlantico:{name:'Frailecillo atlántico', latin:'Fratercula arctica', rare:'Muy rara', kind:'seabird', color:'#232323', habitats:['costa'], times:['dia','atardecer'], seasons:['primavera','verano'], special:['Notable'], dimorphism:false},
  buho_comun:{name:'Búho común', latin:'Asio otus', rare:'Poco común', kind:'owl', color:'#8d6a40', habitats:['bosque'], times:['atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Leucístico'], dimorphism:false},
  corzo_europeo:{name:'Corzo europeo', latin:'Capreolus capreolus', rare:'Poco común', kind:'deer', color:'#bf8b47', habitats:['bosque','pradera'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Albino'], dimorphism:true},

  alce:{name:'Alce', latin:'Alces alces', rare:'Poco común', kind:'deer', color:'#6c5540', habitats:['bosque','rio'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono'], special:['Notable'], dimorphism:true},
  reno:{name:'Reno', latin:'Rangifer tarandus', rare:'Común', kind:'deer', color:'#907156', habitats:['tundra','montana'], times:['dia','atardecer'], seasons:['otono','invierno'], special:['Albino'], dimorphism:true},
  lince_boreal:{name:'Lince boreal', latin:'Lynx lynx', rare:'Raro', kind:'cat', color:'#c29a62', habitats:['bosque','montana'], times:['atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Melánico'], dimorphism:false},
  gloton:{name:'Glotón', latin:'Gulo gulo', rare:'Raro', kind:'mustelid', color:'#5f4737', habitats:['montana','tundra'], times:['atardecer','noche'], seasons:['otono','invierno'], special:['Leucístico'], dimorphism:false},
  oso_pardo:{name:'Oso pardo', latin:'Ursus arctos', rare:'Poco común', kind:'bear', color:'#7d5840', habitats:['bosque','montana'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono'], special:['Notable'], dimorphism:false},
  zorro_artico:{name:'Zorro ártico', latin:'Vulpes lagopus', rare:'Raro', kind:'canid', color:'#d9dfe5', habitats:['tundra'], times:['dia','atardecer'], seasons:['invierno','otono'], special:['Melánico','Notable'], dimorphism:false},
  urogallo_comun:{name:'Urogallo común', latin:'Tetrao urogallus', rare:'Poco común', kind:'forestbird', color:'#4d3428', habitats:['bosque'], times:['amanecer','dia'], seasons:['primavera','verano'], special:['Leucístico','Melánico','Notable'], dimorphism:true},
  perdiz_nival:{name:'Perdiz nival', latin:'Lagopus muta', rare:'Poco común', kind:'forestbird', color:'#ebeef0', habitats:['montana','tundra'], times:['dia'], seasons:['invierno'], special:['Melánica','Notable'], dimorphism:false},
  lobo_gris:{name:'Lobo gris', latin:'Canis lupus', rare:'Raro', kind:'canid', color:'#8d8c8f', habitats:['bosque','montana'], times:['noche','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Notable'], dimorphism:false},

  ibice_alpino:{name:'Íbice alpino', latin:'Capra ibex', rare:'Poco común',kind:'deer',color:'#806646',habitats:['montana'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:true},
  rebeco_alpino:{name:'Rebeco alpino',latin:'Rupicapra rupicapra',rare:'Común',kind:'deer',color:'#a7794c',habitats:['montana','pradera'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:true},
  marmota_alpina:{name:'Marmota alpina',latin:'Marmota marmota',rare:'Común',kind:'small',color:'#99744d',habitats:['montana','pradera'],times:['dia'],seasons:['primavera','verano','otono'],special:['Albino'],dimorphism:false},
  aguila_real:{name:'Águila real',latin:'Aquila chrysaetos',rare:'Común',kind:'forestbird',color:'#816039',habitats:['montana'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  quebrantahuesos:{name:'Quebrantahuesos',latin:'Gypaetus barbatus',rare:'Raro',kind:'forestbird',color:'#b48a60',habitats:['montana'],times:['dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  liebre_variable:{name:'Liebre variable',latin:'Lepus timidus',rare:'Muy rara',kind:'small',color:'#e4e0d5',habitats:['montana','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  salamandra_alpina:{name:'Salamandra alpina',latin:'Salamandra atra',rare:'Poco común',kind:'mustelid',color:'#383e41',habitats:['montana','bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono'],special:['Leucística'],dimorphism:false},
  jabali:{name:'Jabalí',latin:'Sus scrofa',rare:'Común',kind:'boar',color:'#71533c',habitats:['bosque','pradera'],times:['amanecer','atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico','Notable'],dimorphism:false},
  gato_montes:{name:'Gato montés europeo',latin:'Felis silvestris',rare:'Común',kind:'cat',color:'#a39a83',habitats:['bosque'],times:['amanecer','atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  buho_real:{name:'Búho real',latin:'Bubo bubo',rare:'Poco común',kind:'owl',color:'#926841',habitats:['bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  salamandra_comun:{name:'Salamandra común',latin:'Salamandra salamandra',rare:'Común',kind:'salamander',color:'#232b25',habitats:['bosque','rio'],times:['noche','atardecer'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  petirrojo:{name:'Petirrojo europeo',latin:'Erithacus rubecula',rare:'Común',kind:'songbird',color:'#a67545',habitats:['bosque','pradera'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  lince_iberico:{name:'Lince ibérico',latin:'Lynx pardinus',rare:'Muy rara',kind:'cat',color:'#c38e4d',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  cabra_montes_iberica:{name:'Cabra montés ibérica',latin:'Capra pyrenaica',rare:'Poco común',kind:'deer',color:'#8b6a48',habitats:['montana'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:true},
  buitre_leonado:{name:'Buitre leonado',latin:'Gyps fulvus',rare:'Poco común',kind:'raptor',color:'#ad8a5e',habitats:['montana','costa'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  aguila_imperial_iberica:{name:'Águila imperial ibérica',latin:'Aquila adalberti',rare:'Raro',kind:'raptor',color:'#715233',habitats:['montana','bosque'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  lagarto_ocelado:{name:'Lagarto ocelado',latin:'Timon lepidus',rare:'Común',kind:'reptile',color:'#4e9159',habitats:['pradera','bosque'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  meloncillo:{name:'Meloncillo',latin:'Herpestes ichneumon',rare:'Raro',kind:'mustelid',color:'#7a6646',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  conejo_europeo:{name:'Conejo europeo',latin:'Oryctolagus cuniculus',rare:'Común',kind:'rabbit',color:'#a68567',habitats:['pradera','bosque'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Albino'],dimorphism:false},
  flamenco_comun:{name:'Flamenco común',latin:'Phoenicopterus roseus',rare:'Poco común',kind:'wader',color:'#d39b95',habitats:['costa'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  bisonte_europeo:{name:'Bisonte europeo',latin:'Bison bonasus',rare:'Muy rara',kind:'bison',color:'#6f543e',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Albino','Notable'],dimorphism:true},
  ciguena_negra:{name:'Cigüeña negra',latin:'Ciconia nigra',rare:'Raro',kind:'stork',color:'#2c2b2d',habitats:['rio','pradera'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  vibora_aspid:{name:'Víbora áspid',latin:'Vipera aspis',rare:'Raro',kind:'snake',color:'#8f7a5e',habitats:['pradera','montana'],times:['dia','atardecer'],seasons:['primavera','verano','otono'],special:['Melánica'],dimorphism:false},
  chacal_dorado:{name:'Chacal dorado',latin:'Canis aureus',rare:'Poco común',kind:'canid',color:'#c0914d',habitats:['pradera','bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  castor_europeo:{name:'Castor europeo',latin:'Castor fiber',rare:'Poco común',kind:'beaver',color:'#8b6a48',habitats:['rio'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  pelicano_cenudo:{name:'Pelícano ceñudo',latin:'Pelecanus crispus',rare:'Raro',kind:'pelican',color:'#d8d4c7',habitats:['costa','rio'],times:['dia'],seasons:['primavera','verano','otono'],special:['Notable'],dimorphism:false},
  ciguena_blanca:{name:'Cigüeña blanca',latin:'Ciconia ciconia',rare:'Poco común',kind:'stork',color:'#f5f2e9',habitats:['pradera','rio'],times:['dia'],seasons:['primavera','verano','otono'],special:['Melánica','Notable'],dimorphism:false},
  milano_real:{name:'Milano real',latin:'Milvus milvus',rare:'Raro',kind:'raptor',color:'#8f5e3c',habitats:['pradera','bosque'],times:['dia','atardecer'],seasons:['primavera','verano','otono'],special:['Leucístico','Melánico'],dimorphism:false},
  liebre_europea:{name:'Liebre europea',latin:'Lepus europaeus',rare:'Poco común',kind:'hare',color:'#b78853',habitats:['pradera','bosque'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánica','Notable'],dimorphism:false},
  garza_real:{name:'Garza real',latin:'Ardea cinerea',rare:'Poco común',kind:'heron',color:'#a4adb6',habitats:['rio'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucística'],dimorphism:false},
  cisne_vulgar:{name:'Cisne vulgar',latin:'Cygnus olor',rare:'Poco común',kind:'swan',color:'#f5f4ef',habitats:['rio'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  martin_pescador:{name:'Martín pescador común',latin:'Alcedo atthis',rare:'Raro',kind:'kingfisher',color:'#2687b8',habitats:['rio'],times:['amanecer','dia'],seasons:['primavera','verano','otono'],special:['Melánico','Notable'],dimorphism:false}
,
  "eu_esp_0654":{"name": "Cormorán grande", "latin": "Phalacrocorax carbo", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0649":{"name": "Pato cuchara europeo", "latin": "Spatula clypeata", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0636":{"name": "Alondra común", "latin": "Alauda arvensis", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0631":{"name": "Herrerillo común", "latin": "Cyanistes caeruleus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0629":{"name": "Pinzón vulgar", "latin": "Fringilla coelebs", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0628":{"name": "Mirlo común", "latin": "Turdus merula", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0637":{"name": "Zorzal común", "latin": "Turdus philomelos", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0643":{"name": "Busardo ratonero", "latin": "Buteo buteo", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0646":{"name": "Lechuza común", "latin": "Tyto alba", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0617":{"name": "Comadreja común", "latin": "Mustela nivalis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0619":{"name": "Turón europeo", "latin": "Mustela putorius", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0614":{"name": "Murciélago común", "latin": "Pipistrellus pipistrellus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0612":{"name": "Musaraña común", "latin": "Sorex araneus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0613":{"name": "Musaraña enana", "latin": "Sorex minutus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0611":{"name": "Topo europeo", "latin": "Talpa europaea", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0604":{"name": "Topillo agreste", "latin": "Microtus agrestis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0606":{"name": "Lirón avellano", "latin": "Muscardinus avellanarius", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0669":{"name": "Trucha común", "latin": "Salmo trutta", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0661":{"name": "Lución europeo", "latin": "Anguis fragilis", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0660":{"name": "Rana bermeja", "latin": "Rana temporaria", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0656":{"name": "Tritón palmeado", "latin": "Lissotriton helveticus", "rare": "Común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0655":{"name": "Tritón crestado", "latin": "Triturus cristatus", "rare": "Poco común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0640":{"name": "Ampelis europeo", "latin": "Bombycilla garrulus", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0267":{"name": "Perdiz nival", "latin": "Lagopus lagopus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": true},
  "eu_esp_0639":{"name": "Camachuelo común", "latin": "Pyrrhula pyrrhula", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0621":{"name": "Marta europea", "latin": "Martes martes", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0618":{"name": "Armiño", "latin": "Mustela erminea", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0610":{"name": "Lemming noruego", "latin": "Lemmus lemmus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0642":{"name": "Perdiz griega", "latin": "Alectoris graeca", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0609":{"name": "Topillo nival", "latin": "Chionomys nivalis", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "eu_esp_0657":{"name": "Tritón alpino", "latin": "Ichthyosaura alpestris", "rare": "Poco común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0652":{"name": "Focha común", "latin": "Fulica atra", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0650":{"name": "Somormujo lavanco", "latin": "Podiceps cristatus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0653":{"name": "Zampullín común", "latin": "Tachybaptus ruficollis", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0632":{"name": "Arrendajo euroasiático", "latin": "Garrulus glandarius", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0630":{"name": "Carbonero común", "latin": "Parus major", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0644":{"name": "Gavilán común", "latin": "Accipiter nisus", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0645":{"name": "Mochuelo europeo", "latin": "Athene noctua", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0615":{"name": "Murciélago hortelano", "latin": "Eptesicus serotinus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0620":{"name": "Garduña", "latin": "Martes foina", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0622":{"name": "Visón europeo", "latin": "Mustela lutreola", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0616":{"name": "Murciélago de herradura grande", "latin": "Rhinolophus ferrumequinum", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0601":{"name": "Lirón careto", "latin": "Eliomys quercinus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0602":{"name": "Lirón gris", "latin": "Glis glis", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0603":{"name": "Topillo común", "latin": "Microtus arvalis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0605":{"name": "Topillo rojo", "latin": "Myodes glareolus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0668":{"name": "Barbo común", "latin": "Barbus barbus", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0667":{"name": "Tenca", "latin": "Tinca tinca", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0659":{"name": "Sapo corredor", "latin": "Epidalea calamita", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0666":{"name": "Culebra viperina", "latin": "Natrix maura", "rare": "Común", "kind": "snake", "color": "#967959", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0665":{"name": "Culebra de collar", "latin": "Natrix natrix", "rare": "Común", "kind": "snake", "color": "#967959", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0638":{"name": "Oropéndola europea", "latin": "Oriolus oriolus", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0159":{"name": "Pico picapinos", "latin": "Dendrocopos major", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0608":{"name": "Ardilla terrestre europea", "latin": "Spermophilus citellus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0641":{"name": "Perdiz roja", "latin": "Alectoris rufa", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0633":{"name": "Rabilargo ibérico", "latin": "Cyanopica cooki", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0635":{"name": "Abejaruco europeo", "latin": "Merops apiaster", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0634":{"name": "Abubilla europea", "latin": "Upupa epops", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0647":{"name": "Halcón de Eleonor", "latin": "Falco eleonorae", "rare": "Raro", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0623":{"name": "Desmán ibérico", "latin": "Galemys pyrenaicus", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0219":{"name": "Gineta", "latin": "Genetta genetta", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0607":{"name": "Liebre ibérica", "latin": "Lepus granatensis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0626":{"name": "Rebeco pirenaico", "latin": "Rupicapra pyrenaica", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0116":{"name": "Camaleón común", "latin": "Chamaeleo chamaeleon", "rare": "Poco común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0029":{"name": "Águila imperial oriental", "latin": "Aquila heliaca", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0624":{"name": "Desmán ruso", "latin": "Desmana moschata", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0625":{"name": "Gato almizclero europeo", "latin": "Vormela peregusna", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0670":{"name": "Perca europea", "latin": "Perca fluviatilis", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0204":{"name": "Cernícalo vulgar", "latin": "Falco tinnunculus", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0253":{"name": "Puercoespín crestado", "latin": "Hystrix cristata", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0627":{"name": "Muflón europeo", "latin": "Ovis gmelini", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0506":{"name": "Tortuga mediterránea", "latin": "Testudo hermanni", "rare": "Poco común", "kind": "tortoise", "color": "#a0a8a1", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0144":{"name": "Cisne cantor", "latin": "Cygnus cygnus", "rare": "Común", "kind": "swan", "color": "#a0a8a1", "habitats": ["rio", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0232":{"name": "Águila marina europea", "latin": "Haliaeetus albicilla", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["rio", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0505":{"name": "Tortuga griega", "latin": "Testudo graeca", "rare": "Común", "kind": "tortoise", "color": "#a0a8a1", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0401":{"name": "Leopardo persa", "latin": "Panthera pardus", "rare": "Común", "kind": "cat", "color": "#cf9b61", "habitats": ["bosque", "montana", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0081":{"name": "Tur del Cáucaso oriental", "latin": "Capra cylindricornis", "rare": "Común", "kind": "deer", "color": "#98734c", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0149":{"name": "Gamo", "latin": "Dama dama", "rare": "Común", "kind": "deer", "color": "#b68854", "habitats": ["bosque", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0903":{"name": "Lagarto de cristal oriental", "latin": "Pseudopus apodus", "rare": "Común", "kind": "reptile", "color": "#8d8960", "habitats": ["pradera", "montana", "estepa"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0088":{"name": "Caracal", "latin": "Caracal caracal", "rare": "Poco común", "kind": "cat", "color": "#cb8b53", "habitats": ["pradera", "estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0080":{"name": "Cabra salvaje", "latin": "Capra aegagrus", "rare": "Poco común", "kind": "deer", "color": "#ae8054", "habitats": ["montana", "pradera", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0402":{"name": "Tigre siberiano", "latin": "Panthera tigris", "rare": "Raro", "kind": "cat", "color": "#c68346", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0086":{"name": "Corzo siberiano", "latin": "Capreolus pygargus", "rare": "Común", "kind": "deer", "color": "#ac8c65", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0344":{"name": "Ciervo almizclero siberiano", "latin": "Moschus moschiferus", "rare": "Poco común", "kind": "deer", "color": "#9b7351", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0209":{"name": "Frailecillo corniculado", "latin": "Fratercula corniculata", "rare": "Común", "kind": "seabird", "color": "#31383b", "habitats": ["costa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0203":{"name": "Halcón gerifalte", "latin": "Falco rusticolus", "rare": "Común", "kind": "raptor", "color": "#94959a", "habitats": ["pradera", "montana", "tundra", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0234":{"name": "Águila marina de Steller", "latin": "Haliaeetus pelagicus", "rare": "Raro", "kind": "raptor", "color": "#614d3f", "habitats": ["pradera", "montana", "tundra", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0177":{"name": "Nutria marina", "latin": "Enhydra lutris", "rare": "Poco común", "kind": "otter", "color": "#8e7261", "habitats": ["costa", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0369":{"name": "Salmón rosado", "latin": "Oncorhynchus gorbuscha", "rare": "Poco común", "kind": "fish", "color": "#d48d9f", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0371":{"name": "Salmón rojo", "latin": "Oncorhynchus nerka", "rare": "Poco común", "kind": "fish", "color": "#b84f57", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0881":{"name": "Collalba del desierto", "latin": "Oenanthe deserti", "rare": "Común", "kind": "songbird", "color": "#ccb59b", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0194":{"name": "Jerbo de orejas largas", "latin": "Euchoreutes naso", "rare": "Común", "kind": "small", "color": "#bfaa8a", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0073":{"name": "Camello bactriano salvaje", "latin": "Camelus ferus", "rare": "Muy rara", "kind": "camel", "color": "#b89966", "habitats": ["desierto", "estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0431":{"name": "Lagarto cabeza de sapo", "latin": "Phrynocephalus versicolor", "rare": "Raro", "kind": "lizard", "color": "#a38a5b", "habitats": ["desierto", "estepa", "pradera", "montana"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0863":{"name": "Perdiz de las nieves del Himalaya", "latin": "Lerwa lerwa", "rare": "Poco común", "kind": "forestbird", "color": "#b0a795", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0294":{"name": "Monal del Himalaya", "latin": "Lophophorus impejanus", "rare": "Raro", "kind": "forestbird", "color": "#437a83", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0864":{"name": "Faisán monal chino", "latin": "Lophophorus lhuysii", "rare": "Raro", "kind": "forestbird", "color": "#547f8a", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0503":{"name": "Mosquero del paraíso asiático", "latin": "Terpsiphone paradisi", "rare": "Común", "kind": "songbird", "color": "#d6cbb5", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0865":{"name": "Tragopán sátiro", "latin": "Tragopan satyra", "rare": "Común", "kind": "forestbird", "color": "#b45846", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0820":{"name": "Cuón", "latin": "Cuon alpinus", "rare": "Raro", "kind": "canid", "color": "#ae6944", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0403":{"name": "Leopardo de las nieves", "latin": "Panthera uncia", "rare": "Muy rara", "kind": "cat", "color": "#c8c4ba", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0007":{"name": "Panda rojo", "latin": "Ailurus fulgens", "rare": "Común", "kind": "small", "color": "#bb7142", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0855":{"name": "Macaco rhesus", "latin": "Macaca mulatta", "rare": "Común", "kind": "primate", "color": "#aa907a", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0850":{"name": "Marta de garganta amarilla", "latin": "Martes flavigula", "rare": "Común", "kind": "mustelid", "color": "#a07a49", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0844":{"name": "Ardilla voladora gigante roja", "latin": "Petaurista petaurista", "rare": "Poco común", "kind": "small", "color": "#9b5343", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0523":{"name": "Oso negro asiático", "latin": "Ursus thibetanus", "rare": "Poco común", "kind": "bear", "color": "#28282b", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0062":{"name": "Yak salvaje", "latin": "Bos mutus", "rare": "Raro", "kind": "bison", "color": "#514037", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0821":{"name": "Takin", "latin": "Budorcas taxicolor", "rare": "Poco común", "kind": "bison", "color": "#907357", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0240":{"name": "Tahr del Himalaya", "latin": "Hemitragus jemlahicus", "rare": "Común", "kind": "deer", "color": "#a38c6c", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0445":{"name": "Bharal", "latin": "Pseudois nayaur", "rare": "Común", "kind": "deer", "color": "#8793a6", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0538":{"name": "Zorro de Rüppell", "latin": "Vulpes rueppellii", "rare": "Común", "kind": "canid", "color": "#b18a65", "habitats": ["desierto"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0206":{"name": "Gato de las arenas", "latin": "Felis margarita", "rare": "Poco común", "kind": "cat", "color": "#ac966c", "habitats": ["montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0214":{"name": "Gacela de Arabia", "latin": "Gazella arabica", "rare": "Poco común", "kind": "deer", "color": "#c0a079", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0383":{"name": "Órix árabe", "latin": "Oryx leucoryx", "rare": "Raro", "kind": "deer", "color": "#e7d9b8", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0519":{"name": "Lagarto egipcio de cola espinosa", "latin": "Uromastyx aegyptia", "rare": "Poco común", "kind": "lizard", "color": "#7c976b", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0102":{"name": "Víbora cornuda árabe", "latin": "Cerastes gasperettii", "rare": "Común", "kind": "snake", "color": "#a88b67", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0205":{"name": "Gato de la jungla", "latin": "Felis chaus", "rare": "Común", "kind": "cat", "color": "#ac966c", "habitats": ["humedal"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0300":{"name": "Nutria lisa", "latin": "Lutrogale perspicillata", "rare": "Común", "kind": "otter", "color": "#796b55", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0065":{"name": "Búfalo de agua", "latin": "Bubalus bubalis", "rare": "Raro", "kind": "bison", "color": "#584a3d", "habitats": ["humedal"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0910":{"name": "Carpa común", "latin": "Cyprinus carpio", "rare": "Raro", "kind": "fish", "color": "#8c8870", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0327":{"name": "Galápago caspio", "latin": "Mauremys caspica", "rare": "Común", "kind": "tortoise", "color": "#a89070", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0873":{"name": "Abejaruco verde", "latin": "Merops orientalis", "rare": "Común", "kind": "songbird", "color": "#5b9e74", "habitats": ["estepa", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0246":{"name": "Hiena rayada", "latin": "Hyaena hyaena", "rare": "Común", "kind": "canid", "color": "#8b8068", "habitats": ["estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0182":{"name": "Onagro", "latin": "Equus hemionus", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["estepa", "desierto"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0218":{"name": "Gacela persa", "latin": "Gazella subgutturosa", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["estepa", "desierto"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0227":{"name": "Grulla de cuello negro", "latin": "Grus nigricollis", "rare": "Común", "kind": "stork", "color": "#bdc7ca", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0534":{"name": "Zorro tibetano", "latin": "Vulpes ferrilata", "rare": "Común", "kind": "canid", "color": "#b18a65", "habitats": ["montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0321":{"name": "Marmota del Himalaya", "latin": "Marmota himalayana", "rare": "Común", "kind": "small", "color": "#b29b76", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0183":{"name": "Kiang", "latin": "Equus kiang", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0404":{"name": "Antílope tibetano", "latin": "Pantholops hodgsonii", "rare": "Muy rara", "kind": "deer", "color": "#a98b69", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0442":{"name": "Gacela tibetana", "latin": "Procapra picticaudata", "rare": "Común", "kind": "deer", "color": "#c0a079", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0347":{"name": "Turón estepario", "latin": "Mustela eversmanii", "rare": "Común", "kind": "mustelid", "color": "#826953", "habitats": ["estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0319":{"name": "Marmota bobak", "latin": "Marmota bobak", "rare": "Poco común", "kind": "small", "color": "#b29b76", "habitats": ["estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0468":{"name": "Antílope saiga", "latin": "Saiga tatarica", "rare": "Muy rara", "kind": "deer", "color": "#c3ad88", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0891":{"name": "Pato mandarín", "latin": "Aix galericulata", "rare": "Común", "kind": "swan", "color": "#aa714d", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0890":{"name": "Cigüeña blanca oriental", "latin": "Ciconia boyciana", "rare": "Raro", "kind": "stork", "color": "#e6ddcf", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0226":{"name": "Grulla de coronilla roja", "latin": "Grus japonensis", "rare": "Común", "kind": "stork", "color": "#bdc7ca", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0878":{"name": "Urraca de pico azul", "latin": "Cyanopica cyanus", "rare": "Poco común", "kind": "songbird", "color": "#3b5f92", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0422":{"name": "Faisán común", "latin": "Phasianus colchicus", "rare": "Común", "kind": "forestbird", "color": "#936d4e", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0842":{"name": "Liebre china", "latin": "Lepus sinensis", "rare": "Poco común", "kind": "hare", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0824":{"name": "Ciervo del padre David", "latin": "Elaphurus davidianus", "rare": "Raro", "kind": "deer", "color": "#a67d55", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0915":{"name": "Pez cabeza de serpiente del norte", "latin": "Channa argus", "rare": "Poco común", "kind": "fish", "color": "#637e81", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0911":{"name": "Pez mandarín chino", "latin": "Siniperca chuatsi", "rare": "Poco común", "kind": "fish", "color": "#637e81", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0888":{"name": "Pelícano blanco oriental", "latin": "Pelecanus philippensis", "rare": "Común", "kind": "pelican", "color": "#a89070", "habitats": ["rio", "humedal"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0868":{"name": "Cálao bicorne", "latin": "Buceros bicornis", "rare": "Común", "kind": "forestbird", "color": "#4d4641", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0872":{"name": "Carraca india", "latin": "Coracias benghalensis", "rare": "Poco común", "kind": "forestbird", "color": "#bc915c", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0410":{"name": "Pavo real común", "latin": "Pavo cristatus", "rare": "Raro", "kind": "forestbird", "color": "#267b8a", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0874":{"name": "Bubul", "latin": "Pycnonotus cafer", "rare": "Poco común", "kind": "songbird", "color": "#547e79", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0816":{"name": "Gato pescador", "latin": "Prionailurus viverrinus", "rare": "Raro", "kind": "cat", "color": "#ac966c", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0176":{"name": "Elefante asiático", "latin": "Elephas maximus", "rare": "Raro", "kind": "elephant", "color": "#90999b", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0852":{"name": "Pangolín indio", "latin": "Manis crassicaudata", "rare": "Raro", "kind": "pangolin", "color": "#a99675", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0336":{"name": "Oso bezudo", "latin": "Melursus ursinus", "rare": "Común", "kind": "small", "color": "#6f6658", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0860":{"name": "Loris lento de Bengala", "latin": "Nycticebus bengalensis", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0853":{"name": "Musaraña almizclera", "latin": "Suncus murinus", "rare": "Poco común", "kind": "small", "color": "#ac9374", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0476":{"name": "Langur gris", "latin": "Semnopithecus entellus", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0833":{"name": "Antílope negro", "latin": "Antilope cervicapra", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0050":{"name": "Ciervo chital", "latin": "Axis axis", "rare": "Poco común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0061":{"name": "Gaur", "latin": "Bos gaurus", "rare": "Poco común", "kind": "bison", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0063":{"name": "Nilgó", "latin": "Boselaphus tragocamelus", "rare": "Muy rara", "kind": "bison", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0830":{"name": "Búfalo salvaje asiático", "latin": "Bubalus arnee", "rare": "Raro", "kind": "bison", "color": "#584a3d", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0465":{"name": "Rinoceronte indio", "latin": "Rhinoceros unicornis", "rare": "Poco común", "kind": "rhino", "color": "#868f8a", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0825":{"name": "Ciervo sambar", "latin": "Rusa unicolor", "rare": "Raro", "kind": "deer", "color": "#a67d55", "habitats": ["pradera", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0900":{"name": "Varano de Bengala", "latin": "Varanus bengalensis", "rare": "Común", "kind": "lizard", "color": "#657559", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0136":{"name": "Cocodrilo de las marismas", "latin": "Crocodylus palustris", "rare": "Común", "kind": "crocodile", "color": "#58735b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0906":{"name": "Krait común", "latin": "Bungarus caeruleus", "rare": "Común", "kind": "snake", "color": "#454e5b", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0905":{"name": "Víbora de Russell", "latin": "Daboia russelii", "rare": "Común", "kind": "snake", "color": "#a88b67", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0351":{"name": "Cobra india", "latin": "Naja naja", "rare": "Común", "kind": "snake", "color": "#69654a", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0124":{"name": "Faisán dorado", "latin": "Chrysolophus pictus", "rare": "Común", "kind": "forestbird", "color": "#e3a439", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0296":{"name": "Faisán plateado", "latin": "Lophura nycthemera", "rare": "Común", "kind": "forestbird", "color": "#dad9cd", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0096":{"name": "Gato dorado asiático", "latin": "Catopuma temminckii", "rare": "Raro", "kind": "cat", "color": "#ac966c", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0355":{"name": "Leopardo nublado", "latin": "Neofelis nebulosa", "rare": "Común", "kind": "cat", "color": "#998c73", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0006":{"name": "Panda gigante", "latin": "Ailuropoda melanoleuca", "rare": "Muy rara", "kind": "bear", "color": "#eceae1", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0318":{"name": "Pangolín chino", "latin": "Manis pentadactyla", "rare": "Común", "kind": "pangolin", "color": "#a99675", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0854":{"name": "Gibón de cresta negra", "latin": "Nomascus concolor", "rare": "Raro", "kind": "primate", "color": "#53463c", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0395":{"name": "Civeta de las palmeras enmascarada", "latin": "Paguma larvata", "rare": "Poco común", "kind": "mustelid", "color": "#826953", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0856":{"name": "Mono de nariz chata dorado", "latin": "Rhinopithecus roxellana", "rare": "Raro", "kind": "primate", "color": "#be984a", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0310":{"name": "Macaco tibetano", "latin": "Macaca thibetana", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0345":{"name": "Muntíaco de Reeves", "latin": "Muntiacus reevesi", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0902":{"name": "Gecko tokay", "latin": "Gekko gecko", "rare": "Común", "kind": "lizard", "color": "#648f79", "habitats": ["montana", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0016":{"name": "Salamandra gigante china", "latin": "Andrias davidianus", "rare": "Raro", "kind": "salamander", "color": "#4a5145", "habitats": ["rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0433":{"name": "Urraca oriental", "latin": "Pica serica", "rare": "Raro", "kind": "songbird", "color": "#3b5f92", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0440":{"name": "Gato leopardo", "latin": "Prionailurus bengalensis", "rare": "Poco común", "kind": "cat", "color": "#998c73", "habitats": ["bosque", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0333":{"name": "Tejón asiático", "latin": "Meles leucurus", "rare": "Común", "kind": "mustelid", "color": "#826953", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0111":{"name": "Ciervo sika", "latin": "Cervus nippon", "rare": "Poco común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0249":{"name": "Ciervo acuático chino", "latin": "Hydropotes inermis", "rare": "Común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0067":{"name": "Cálao rinoceronte", "latin": "Buceros rhinoceros", "rare": "Común", "kind": "rhino", "color": "#868f8a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0867":{"name": "Pavo verde", "latin": "Pavo muticus", "rare": "Raro", "kind": "forestbird", "color": "#376b81", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0869":{"name": "Cálao de casco", "latin": "Rhinoplax vigil", "rare": "Raro", "kind": "forestbird", "color": "#4d4641", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0883":{"name": "Águila de las Filipinas", "latin": "Pithecophaga jefferyi", "rare": "Muy rara", "kind": "raptor", "color": "#a89070", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0849":{"name": "Binturong", "latin": "Arctictis binturong", "rare": "Poco común", "kind": "mustelid", "color": "#826953", "habitats": ["selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0858":{"name": "Tarsio filipino", "latin": "Carlito syrichta", "rare": "Raro", "kind": "small", "color": "#8d7b66", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0238":{"name": "Oso malayo", "latin": "Helarctos malayanus", "rare": "Raro", "kind": "small", "color": "#6f6658", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0857":{"name": "Macaco de cola de cerdo", "latin": "Macaca nemestrina", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0317":{"name": "Pangolín malayo", "latin": "Manis javanica", "rare": "Común", "kind": "pangolin", "color": "#a99675", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0859":{"name": "Tarsio de espectro", "latin": "Tarsius tarsier", "rare": "Raro", "kind": "small", "color": "#ac9374", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0251":{"name": "Gibón de manos blancas", "latin": "Hylobates lar", "rare": "Poco común", "kind": "primate", "color": "#53463c", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0352":{"name": "Mono narigudo", "latin": "Nasalis larvatus", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0436":{"name": "Orangután de Borneo", "latin": "Pongo pygmaeus", "rare": "Raro", "kind": "small", "color": "#8d7b66", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0491":{"name": "Gibón siamango", "latin": "Symphalangus syndactylus", "rare": "Poco común", "kind": "primate", "color": "#53463c", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0165":{"name": "Rinoceronte de Sumatra", "latin": "Dicerorhinus sumatrensis", "rare": "Muy rara", "kind": "rhino", "color": "#868f8a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0834":{"name": "Jabalí barbudo", "latin": "Sus barbatus", "rare": "Poco común", "kind": "deer", "color": "#c9ad7d", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0498":{"name": "Tapir malayo", "latin": "Tapirus indicus", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0901":{"name": "Dragón volador común", "latin": "Draco volans", "rare": "Raro", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0527":{"name": "Dragón de Komodo", "latin": "Varanus komodoensis", "rare": "Común", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0316":{"name": "Pitón reticulada", "latin": "Malayopython reticulatus", "rare": "Común", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0373":{"name": "Cobra real", "latin": "Ophiophagus hannah", "rare": "Común", "kind": "snake", "color": "#69654a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0877":{"name": "Petirrojo japonés", "latin": "Larvivora akahige", "rare": "Común", "kind": "forestbird", "color": "#786b53", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0494":{"name": "Faisán cobrizo", "latin": "Syrmaticus soemmerringii", "rare": "Poco común", "kind": "forestbird", "color": "#bc915c", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0363":{"name": "Tanuki", "latin": "Nyctereutes procyonoides", "rare": "Poco común", "kind": "small", "color": "#ac9374", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0414":{"name": "Conejo de Amami", "latin": "Pentalagus furnessi", "rare": "Común", "kind": "small", "color": "#8d7b66", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0308":{"name": "Macaco japonés", "latin": "Macaca fuscata", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0087":{"name": "Serau japonés", "latin": "Capricornis crispus", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0017":{"name": "Salamandra gigante japonesa", "latin": "Andrias japonicus", "rare": "Poco común", "kind": "salamander", "color": "#4a5145", "habitats": ["costa", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false}
};




// Ajustes finos v1.9.1: colores, tipos y variantes especiales
Object.assign(SPECIES.salamandra_comun,{special:['Leucístico','Notable']});
Object.assign(SPECIES.salamandra_alpina,{kind:'salamander',special:['Leucística','Notable']});
if(SPECIES.perdiz_nival) SPECIES.perdiz_nival.special=['Notable'];
const SPRITE_TUNING={
  eu_esp_0604:{color:'#9a7b54'}, // Topillo agreste
  eu_esp_0603:{color:'#8e7e63'}, // Topillo común
  eu_esp_0609:{color:'#c8beb0', special:['Leucístico','Notable']}, // Topillo nival
  eu_esp_0605:{color:'#a35e3f'}, // Topillo rojo
  eu_esp_0631:{color:'#6a8eb3'}, // Herrerillo común
  eu_esp_0636:{color:'#aa845b'}, // Alondra común
  eu_esp_0629:{color:'#b16d58'}, // Pinzón vulgar
  eu_esp_0628:{color:'#4a4139'}, // Mirlo común
  eu_esp_0637:{color:'#8b7254'}, // Zorzal común
  eu_esp_0654:{color:'#3f4244'}, // Cormorán grande
  eu_esp_0649:{color:'#835c42'}, // Pato cuchara europeo
  eu_esp_0630:{color:'#d9b85b'}, // Carbonero común
  eu_esp_0639:{color:'#ad665d'}, // Camachuelo común
  eu_esp_0638:{color:'#dfba45'}, // Oropéndola europea
  eu_esp_0640:{color:'#ae816b'}, // Ampelis europeo
  eu_esp_0632:{color:'#aa7758'}, // Arrendajo euroasiático
  eu_esp_0159:{color:'#303438'}, // Pico picapinos
  eu_esp_0652:{color:'#303438'}, // Focha común
  eu_esp_0650:{color:'#6a6558'}, // Somormujo lavanco
  eu_esp_0653:{color:'#5a4c46'}, // Zampullín común
  eu_esp_0643:{color:'#8a6c4c'}, // Busardo ratonero
  eu_esp_0646:{color:'#c5a886'}, // Lechuza común
  eu_esp_0644:{color:'#777a7d'}, // Gavilán común
  eu_esp_0645:{color:'#aa8963'}, // Mochuelo europeo
  eu_esp_0617:{color:'#8b613f'}, // Comadreja común
  eu_esp_0618:{color:'#e0d8ca'}, // Armiño invernal
  eu_esp_0619:{color:'#675349'}, // Turón europeo
  eu_esp_0621:{color:'#765b41'}, // Marta europea
  eu_esp_0606:{color:'#ab865a'}, // Lirón avellano
  eu_esp_0601:{color:'#aaa18e'}, // Lirón careto
  eu_esp_0602:{color:'#b2a99c'}, // Lirón gris
  eu_esp_0610:{color:'#a0805f'}, // Lemming noruego
  eu_esp_0253:{color:'#866f4a'}, // Puercoespín crestado
  eu_esp_0608:{color:'#ae895a'}, // Ardilla terrestre europea
  eu_esp_0633:{color:'#4b5560'}, // Rabilargo ibérico
  eu_esp_0641:{color:'#ab6957'}, // Perdiz roja
  eu_esp_0642:{color:'#aa926d'}  // Perdiz griega
};
Object.entries(SPRITE_TUNING).forEach(([id,patch])=>{ if(SPECIES[id]) Object.assign(SPECIES[id],patch); });

Object.assign(SPRITE_TUNING,{
  gato_montes:{color:'#8c876f'},
  lince_iberico:{color:'#c99657'},
  zorro_rojo:{color:'#d96d30'},
  zorro_artico:{color:'#dfe4ea'},
  jabali:{color:'#6f523e'},
  conejo_europeo:{color:'#9d8668'},
  liebre_europea:{color:'#b88454'},
  liebre_variable:{color:'#dddcd5'},
  frailecillo_atlantico:{color:'#252628'},
  erizo_europeo:{color:'#8d6b4a'},
  eu_esp_0623:{color:'#8b755b'},
  asia_esp_0067:{color:'#232425'}
});



// Fauna inicial de África con familias de sprites existentes.
Object.assign(SPECIES,{"af_fenec":{"name":"Fénec","latin":"Vulpes zerda","rare":"Poco común","kind":"canid","color":"#e9bb79","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_dromedario":{"name":"Dromedario","latin":"Camelus dromedarius","rare":"Común","kind":"camel","color":"#bc9970","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gacela_dorcas":{"name":"Gacela dorcas","latin":"Gazella dorcas","rare":"Poco común","kind":"deer","color":"#c8a66d","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_chacal_dorado":{"name":"Chacal dorado","latin":"Canis aureus","rare":"Común","kind":"canid","color":"#ad9060","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_ibis_eremita":{"name":"Ibis eremita","latin":"Geronticus eremita","rare":"Muy rara","kind":"stork","color":"#43433b","habitats":["costa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_serval":{"name":"Serval","latin":"Leptailurus serval","rare":"Raro","kind":"cat","color":"#c4a25b","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cobra_egipcia":{"name":"Cobra egipcia","latin":"Naja haje","rare":"Raro","kind":"snake","color":"#8c7453","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_arrui":{"name":"Arruí","latin":"Ammotragus lervia","rare":"Poco común","kind":"deer","color":"#b69c7a","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_leon":{"name":"León africano","latin":"Panthera leo","rare":"Raro","kind":"cat","color":"#cba35e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_elefante_sabana":{"name":"Elefante africano de sabana","latin":"Loxodonta africana","rare":"Raro","kind":"elephant","color":"#99978f","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_rinoceronte_blanco":{"name":"Rinoceronte blanco","latin":"Ceratotherium simum","rare":"Muy rara","kind":"rhino","color":"#a49d91","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_bufalo_cafre":{"name":"Búfalo cafre","latin":"Syncerus caffer","rare":"Poco común","kind":"bison","color":"#5b4e42","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_licaon":{"name":"Licaón","latin":"Lycaon pictus","rare":"Raro","kind":"canid","color":"#af8559","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cocodrilo_nilo":{"name":"Cocodrilo del Nilo","latin":"Crocodylus niloticus","rare":"Raro","kind":"crocodile","color":"#718162","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_aguila_pescadora":{"name":"Pigargo vocinglero","latin":"Icthyophaga vocifer","rare":"Poco común","kind":"raptor","color":"#e0e3d5","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_piton_africana":{"name":"Pitón de Seba","latin":"Python sebae","rare":"Raro","kind":"snake","color":"#83765d","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gorila_occidental":{"name":"Gorila occidental","latin":"Gorilla gorilla","rare":"Muy rara","kind":"primate","color":"#484840","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_chimpance":{"name":"Chimpancé común","latin":"Pan troglodytes","rare":"Raro","kind":"primate","color":"#594e44","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_pangolin_gigante":{"name":"Pangolín gigante","latin":"Smutsia gigantea","rare":"Muy rara","kind":"pangolin","color":"#8a6f51","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_leopardo":{"name":"Leopardo africano","latin":"Panthera pardus","rare":"Raro","kind":"cat","color":"#b89a65","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_elefante_bosque":{"name":"Elefante africano de bosque","latin":"Loxodonta cyclotis","rare":"Muy rara","kind":"elephant","color":"#797d77","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_loro_gris":{"name":"Loro gris africano","latin":"Psittacus erithacus","rare":"Poco común","kind":"songbird","color":"#8c8f8d","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_colobo":{"name":"Colobo blanco y negro","latin":"Colobus guereza","rare":"Raro","kind":"primate","color":"#2b3432","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cocodrilo_hocico":{"name":"Cocodrilo de hocico estrecho","latin":"Mecistops cataphractus","rare":"Muy rara","kind":"crocodile","color":"#60765b","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false}});

// v3.5 · fauna adicional de las nuevas regiones africanas.
Object.assign(SPECIES,{"af_hipopotamo":{"name":"Hipopótamo común","latin":"Hippopotamus amphibius","rare":"Poco común","kind":"hippo","color":"#8c7774","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_avestruz":{"name":"Avestruz común","latin":"Struthio camelus","rare":"Común","kind":"ostrich","color":"#4c433b","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_ibis_sagrado":{"name":"Ibis sagrado africano","latin":"Threskiornis aethiopicus","rare":"Común","kind":"stork","color":"#e9e5d4","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_garza_goliat":{"name":"Garza goliat","latin":"Ardea goliath","rare":"Poco común","kind":"heron","color":"#a17e66","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_abejaruco_carmin":{"name":"Abejaruco carmín","latin":"Merops nubicus","rare":"Poco común","kind":"songbird","color":"#b54d42","habitats":["rio","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_jirafa":{"name":"Jirafa","latin":"Giraffa camelopardalis","rare":"Poco común","kind":"giraffe","color":"#c9a16c","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cebra_llanura":{"name":"Cebra de llanura","latin":"Equus quagga","rare":"Común","kind":"zebra","color":"#e4dfd0","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_facoquero":{"name":"Facóquero común","latin":"Phacochoerus africanus","rare":"Común","kind":"boar","color":"#9b7859","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_nu_azul":{"name":"Ñu azul","latin":"Connochaetes taurinus","rare":"Común","kind":"bison","color":"#6e5c50","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_grulla_coronada":{"name":"Grulla coronada gris","latin":"Balearica regulorum","rare":"Poco común","kind":"stork","color":"#82786b","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_hiena_manchada":{"name":"Hiena manchada","latin":"Crocuta crocuta","rare":"Raro","kind":"canid","color":"#a18a65","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_orix":{"name":"Órix del Cabo","latin":"Oryx gazella","rare":"Poco común","kind":"deer","color":"#b79b7e","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_zorro_palido":{"name":"Zorro pálido","latin":"Vulpes pallida","rare":"Poco común","kind":"canid","color":"#d0ad77","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_antilope_bongo":{"name":"Bongo","latin":"Tragelaphus eurycerus","rare":"Raro","kind":"deer","color":"#b66b4d","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_duiker_azul":{"name":"Duíquer azul","latin":"Philantomba monticola","rare":"Poco común","kind":"deer","color":"#827463","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_civeta":{"name":"Civeta africana","latin":"Civettictis civetta","rare":"Raro","kind":"cat","color":"#998872","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_mandril":{"name":"Mandril","latin":"Mandrillus sphinx","rare":"Raro","kind":"primate","color":"#68594e","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_turaco":{"name":"Turaco verde","latin":"Tauraco persa","rare":"Poco común","kind":"songbird","color":"#477b56","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_okapi":{"name":"Okapi","latin":"Okapia johnstoni","rare":"Muy rara","kind":"giraffe","color":"#8b6348","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gorila_montana":{"name":"Gorila de montaña","latin":"Gorilla beringei beringei","rare":"Muy rara","kind":"primate","color":"#444540","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_galago":{"name":"Gálago senegalés","latin":"Galago senegalensis","rare":"Poco común","kind":"primate","color":"#9b826e","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_babuino_oliva":{"name":"Babuino oliva","latin":"Papio anubis","rare":"Común","kind":"primate","color":"#8c7a62","habitats":["pradera","bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_caracal":{"name":"Caracal","latin":"Caracal caracal","rare":"Raro","kind":"cat","color":"#b08b68","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_suricata":{"name":"Suricata","latin":"Suricata suricatta","rare":"Común","kind":"mustelid","color":"#b99c73","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_springbok":{"name":"Springbok","latin":"Antidorcas marsupialis","rare":"Común","kind":"deer","color":"#bd9a6e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_guepardo":{"name":"Guepardo","latin":"Acinonyx jubatus","rare":"Raro","kind":"cat","color":"#d3aa6e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_pinguino_africano":{"name":"Pingüino africano","latin":"Spheniscus demersus","rare":"Raro","kind":"seabird","color":"#292c2c","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_lobo_marino_cabo":{"name":"Lobo marino del Cabo","latin":"Arctocephalus pusillus","rare":"Poco común","kind":"otter","color":"#736052","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tiburon_blanco":{"name":"Tiburón blanco","latin":"Carcharodon carcharias","rare":"Muy rara","kind":"fish","color":"#a1b4b6","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tortuga_laúd":{"name":"Tortuga laúd","latin":"Dermochelys coriacea","rare":"Raro","kind":"tortoise","color":"#555c66","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_eland":{"name":"Eland común","latin":"Taurotragus oryx","rare":"Poco común","kind":"deer","color":"#b29370","habitats":["pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_secretario":{"name":"Ave secretaria","latin":"Sagittarius serpentarius","rare":"Raro","kind":"raptor","color":"#b5b4ad","habitats":["pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_lemur_colaanillada":{"name":"Lémur de cola anillada","latin":"Lemur catta","rare":"Común","kind":"lemur","color":"#adb2ae","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_sifaka":{"name":"Sifaca de Verreaux","latin":"Propithecus verreauxi","rare":"Raro","kind":"lemur","color":"#f1e9dd","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_fosa":{"name":"Fosa","latin":"Cryptoprocta ferox","rare":"Raro","kind":"cat","color":"#a87a5a","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_camaleon_pantera":{"name":"Camaleón pantera","latin":"Furcifer pardalis","rare":"Poco común","kind":"lizard","color":"#5e9a68","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gecko_diurno":{"name":"Geco diurno de Madagascar","latin":"Phelsuma madagascariensis","rare":"Común","kind":"lizard","color":"#48a26c","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tenrec":{"name":"Tenrec común","latin":"Tenrec ecaudatus","rare":"Poco común","kind":"small","color":"#9e7c63","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_indri":{"name":"Indri","latin":"Indri indri","rare":"Muy rara","kind":"lemur","color":"#393e3c","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tortuga_radiada":{"name":"Tortuga radiada","latin":"Astrochelys radiata","rare":"Raro","kind":"tortoise","color":"#8b7753","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_fosa_ave":{"name":"Águila pescadora de Madagascar","latin":"Haliaeetus vociferoides","rare":"Muy rara","kind":"raptor","color":"#7a5b48","habitats":["costa","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false}});
// Solo especies con dimorfismo sexual notorio y representable con sprites distintos.
const SEXUAL_DIMORPHISM={
  af_leon:{type:'mane'},
  af_mandril:{type:'face'},
  af_babuino_hamadryas:{type:'mantle'},
  af_gelada:{type:'mantle'},
  asia_esp_0294:{type:'monal'},
  asia_esp_0864:{type:'monal'},
  asia_esp_0865:{type:'tragopan'},
  af_avestruz:{type:'ostrich'},
  asia_esp_0880:{type:'capercaillie'},
  asia_esp_0441:{type:'gazelle'},
  ciervo_rojo:{type:'antlers'},
  corzo_europeo:{type:'antlers'},
  alce:{type:'antlers'},
  reno:{type:'reindeer'},
  ibice_alpino:{type:'ibex'},
  cabra_montes_iberica:{type:'ibex'},
  urogallo_comun:{type:'capercaillie'},
  eu_esp_0649:{type:'shoveler'},
  eu_esp_0629:{type:'finch'},
  eu_esp_0628:{type:'blackbird'},
  eu_esp_0639:{type:'bullfinch'},
  eu_esp_0638:{type:'oriole'},
  asia_esp_0081:{type:'ibex'},
  asia_esp_0149:{type:'antlers'},
  asia_esp_0080:{type:'ibex'},
  asia_esp_0410:{type:'peafowl'},
  asia_esp_0891:{type:'mandarinduck'},
  asia_esp_0422:{type:'pheasant'},
  asia_esp_0124:{type:'pheasant'},
  asia_esp_0296:{type:'pheasant'},
  asia_esp_0833:{type:'blackbuck'},
  asia_esp_0111:{type:'antlers'}
};
Object.entries(SPECIES).forEach(([id,sp])=>{sp.dimorphism=!!SEXUAL_DIMORPHISM[id];});

// Beta 3.7: diez especies nuevas, sin modificar las anteriores.
Object.assign(SPECIES,{"af_asno_somali":{"name":"Asno salvaje somalí","latin":"Equus africanus somaliensis","rare":"Muy rara","kind":"zebra","color":"#b7a990","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_gerenuc":{"name":"Gerenuc","latin":"Litocranius walleri","rare":"Poco común","kind":"deer","color":"#bd8a55","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_dikdik_guenther":{"name":"Dicdic de Günther","latin":"Madoqua guentheri","rare":"Poco común","kind":"deer","color":"#a78368","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_babuino_hamadryas":{"name":"Babuino hamadríade","latin":"Papio hamadryas","rare":"Raro","kind":"primate","color":"#b7afa0","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_lechwe_rojo":{"name":"Lechwe rojo","latin":"Kobus leche","rare":"Poco común","kind":"deer","color":"#bd7855","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_jacana_africana":{"name":"Jacana africana","latin":"Actophilornis africanus","rare":"Común","kind":"wader","color":"#966e4f","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_sitatunga":{"name":"Sitatunga","latin":"Tragelaphus spekii","rare":"Raro","kind":"deer","color":"#886e52","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_potamoquero":{"name":"Potamóquero rojo","latin":"Potamochoerus porcus","rare":"Poco común","kind":"boar","color":"#b25735","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable","Melánico"],"dimorphism":false},"af_mono_brazza":{"name":"Mono de De Brazza","latin":"Cercopithecus neglectus","rare":"Raro","kind":"primate","color":"#757c71","habitats":["bosque","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_picatartes_gris":{"name":"Picatartes de cuello gris","latin":"Picathartes oreas","rare":"Muy rara","kind":"songbird","color":"#817769","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false}});
// Beta 3.8: fauna endémica y característica de las nuevas zonas africanas.
Object.assign(SPECIES,{"af_lobo_etiope":{"name":"Lobo etíope","latin":"Canis simensis","rare":"Muy rara","kind":"canid","color":"#b75f40","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_gelada":{"name":"Gelada","latin":"Theropithecus gelada","rare":"Poco común","kind":"primate","color":"#8c7062","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_ibice_walia":{"name":"Íbice de Walia","latin":"Capra walie","rare":"Muy rara","kind":"deer","color":"#96734f","habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_quebrantahuesos":{"name":"Quebrantahuesos","latin":"Gypaetus barbatus","rare":"Raro","kind":"raptor","color":"#bb8c5d","habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_nyala_montana":{"name":"Nyala de montaña","latin":"Tragelaphus buxtoni","rare":"Muy rara","kind":"deer","color":"#90715f","habitats":["montana","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_ganso_alas_azules":{"name":"Ganso de alas azules","latin":"Cyanochen cyanoptera","rare":"Poco común","kind":"swan","color":"#807c72","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_zorro_cabo":{"name":"Zorro del Cabo","latin":"Vulpes chama","rare":"Común","kind":"canid","color":"#a99875","habitats":["desierto","estepa","pradera"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_hiena_parda":{"name":"Hiena parda","latin":"Parahyaena brunnea","rare":"Raro","kind":"canid","color":"#67503e","habitats":["desierto","estepa","pradera"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_camaleon_namaqua":{"name":"Camaleón de Namaqua","latin":"Chamaeleo namaquensis","rare":"Poco común","kind":"lizard","color":"#b3a16d","habitats":["desierto","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_geco_patas_palmeadas":{"name":"Geco de patas palmeadas","latin":"Pachydactylus rangei","rare":"Poco común","kind":"lizard","color":"#e6be94","habitats":["desierto"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// v3.9: fauna africana adicional, IDs nuevos para conservar registros existentes.
Object.assign(SPECIES,{"af_macaco_berberia":{"name":"Macaco de Berbería","latin":"Macaca sylvanus","rare":"Raro","kind":"primate","color":"#ae987f","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_gato_montes_africano":{"name":"Gato montés africano","latin":"Felis lybica","rare":"Poco común","kind":"cat","color":"#b99a79","habitats":["desierto","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_ciervo_berberia":{"name":"Ciervo de Berbería","latin":"Cervus elaphus barbarus","rare":"Raro","kind":"deer","color":"#8a6747","habitats":["bosque","montana"],"times":["amanecer","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_zorro_ruppell":{"name":"Zorro de Rüppell","latin":"Vulpes rueppellii","rare":"Poco común","kind":"canid","color":"#d7b78b","habitats":["desierto","estepa"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_antilope_sable":{"name":"Antílope sable","latin":"Hippotragus niger","rare":"Raro","kind":"deer","color":"#46392d","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_calao_terrestre":{"name":"Cálao terrestre sureño","latin":"Bucorvus leadbeateri","rare":"Raro","kind":"raptor","color":"#302c2d","habitats":["pradera","bosque"],"times":["amanecer","dia"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_pangolin_temminck":{"name":"Pangolín terrestre","latin":"Smutsia temminckii","rare":"Muy rara","kind":"pangolin","color":"#9f8061","habitats":["bosque","estepa"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_inseparable_lilian":{"name":"Inseparable de Lilian","latin":"Agapornis lilianae","rare":"Poco común","kind":"songbird","color":"#65a460","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_dugongo":{"name":"Dugongo","latin":"Dugong dugon","rare":"Muy rara","kind":"sirenian","color":"#9caeac","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_manta_gigante":{"name":"Manta gigante","latin":"Mobula birostris","rare":"Raro","kind":"ray","color":"#334e59","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_delfin_jorobado_indico":{"name":"Delfín jorobado del Índico","latin":"Sousa plumbea","rare":"Raro","kind":"cetacean","color":"#859aab","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_martin_malaquita":{"name":"Martín pescador malaquita","latin":"Corythornis cristatus","rare":"Poco común","kind":"kingfisher","color":"#277c9b","habitats":["rio","humedal"],"times":["amanecer","dia"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// Beta 3.10: ocho especies de los lagos del Rift y Seychelles/Aldabra.
Object.assign(SPECIES,{"af_flamenco_enano":{"name":"Flamenco enano","latin":"Phoeniconaias minor","rare":"Poco común","kind":"wader","color":"#dd7e96","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_pelicano_blanco":{"name":"Pelícano blanco","latin":"Pelecanus onocrotalus","rare":"Poco común","kind":"pelican","color":"#ded9c8","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_jirafa_rothschild":{"name":"Jirafa de Rothschild","latin":"Giraffa camelopardalis rothschildi","rare":"Raro","kind":"giraffe","color":"#c49b61","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_gran_kudu":{"name":"Gran kudú","latin":"Tragelaphus strepsiceros","rare":"Raro","kind":"deer","color":"#9f8870","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_tortuga_aldabra":{"name":"Tortuga gigante de Aldabra","latin":"Aldabrachelys gigantea","rare":"Muy rara","kind":"tortoise","color":"#78845d","habitats":["pradera","bosque","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_loro_negro_seychelles":{"name":"Loro negro de Seychelles","latin":"Coracopsis barklyi","rare":"Raro","kind":"forestbird","color":"#635e5a","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_cernicalo_seychelles":{"name":"Cernícalo de Seychelles","latin":"Falco araeus","rare":"Raro","kind":"raptor","color":"#a88b6d","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_tiburon_puntas_negras":{"name":"Tiburón de puntas negras de arrecife","latin":"Carcharhinus melanopterus","rare":"Poco común","kind":"fish","color":"#71868d","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false}});
// Beta 3.12: ocho especies originales de las dos regiones africanas.
Object.assign(SPECIES,{"af_picozapato":{"name":"Picozapato","latin":"Balaeniceps rex","rare":"Muy rara","kind":"stork","color":"#868d87","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_lechwe_negro":{"name":"Lechwe negro","latin":"Kobus leche smithemani","rare":"Raro","kind":"deer","color":"#46352a","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_grulla_carunculada":{"name":"Grulla carunculada","latin":"Grus carunculata","rare":"Raro","kind":"wader","color":"#b6a99a","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_puku":{"name":"Puku","latin":"Kobus vardonii","rare":"Poco común","kind":"deer","color":"#b99562","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_impala":{"name":"Impala","latin":"Aepyceros melampus","rare":"Común","kind":"deer","color":"#a87d50","habitats":["pradera","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_nyala_comun":{"name":"Niala común","latin":"Tragelaphus angasii","rare":"Poco común","kind":"deer","color":"#7d6350","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_mangosta_enana":{"name":"Mangosta enana africana","latin":"Helogale parvula","rare":"Poco común","kind":"small","color":"#947a62","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_calao_trompetero":{"name":"Cálao trompetero","latin":"Bycanistes bucinator","rare":"Raro","kind":"forestbird","color":"#42474b","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const GLOBAL_BIOMES_FULL=['bosque','pradera','rio','costa','tundra','montana','humedal','mar_abierto','estepa','mediterraneo','desierto','selva','sabana'];
const REGION_BIOMES={
  'HX-02-13':["bosque", "rio", "tundra", "pradera"],
  'HX-03-14':["bosque", "tundra", "rio", "pradera"],
  'HX-04-13':["estepa", "pradera", "montana", "rio"],
  'HX-01-09':['bosque','pradera','rio','costa'],
  'HX-01-11':['bosque','tundra','rio','costa'],
  'HX-02-09':['montana','bosque','pradera','rio'],
  'HX-02-10':['bosque','pradera','rio','costa'],
  'HX-02-11':['bosque','pradera','rio','montana'],
  'HX-02-12':['bosque','pradera','costa','montana'],
  'HX-03-09':['bosque','pradera','rio','montana'],
  'HX-03-10':['bosque','pradera','costa','montana'],
  'HX-03-11':['bosque','rio','costa','pradera'],
  'HX-03-12':['bosque','pradera','rio','montana'],
  'HX-03-13':['bosque','montana','pradera'],
  'HX-03-15':['bosque','pradera','montana','estepa'],
  "HX-02-15":["bosque", "montana", "pradera", "rio"],
  "HX-03-16":["bosque", "tundra", "montana", "rio"],
  "HX-03-18":["tundra", "costa", "rio", "bosque"],
  "HX-04-14":["desierto", "estepa", "pradera", "montana"],
  "HX-04-15":["montana", "pradera", "bosque", "rio"]
};
function setEco(sp, habitats, times, seasons){sp.habitats=habitats; sp.times=times; sp.seasons=seasons;}
function hasWords(name, parts){return parts.some(p=>name.includes(p));}
function normalizeEcology(){
  for(const [id,sp] of Object.entries(SPECIES)){
    const n=sp.name.toLowerCase();
    const k=sp.kind;
    let habitats=['bosque'], times=['amanecer','dia','atardecer'], seasons=['primavera','verano','otono','invierno'];
    if(k==='canid') setEco(sp,['bosque','pradera'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='deer') setEco(sp,['bosque','pradera'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='mustelid') setEco(sp,['bosque','rio'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='small') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='otter') setEco(sp,['rio','costa'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='seabird') setEco(sp,['costa'],['amanecer','dia','atardecer'],['primavera','verano']);
    else if(k==='owl') setEco(sp,['bosque','pradera'],['atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='cat') setEco(sp,['bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='bear') setEco(sp,['bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono']);
    else if(k==='forestbird') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='raptor') setEco(sp,['pradera','montana','costa'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='songbird') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='stork' || k==='heron' || k==='swan' || k==='pelican' || k==='kingfisher') setEco(sp,['rio','costa','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='wader') setEco(sp,['costa','rio','pradera'],['amanecer','dia','atardecer'],['primavera','verano']);
    else if(k==='reptile') setEco(sp,['pradera','montana','bosque'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='salamander') setEco(sp,['rio','bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono']);
    else if(k==='snake') setEco(sp,['pradera','rio','bosque'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='tortoise') setEco(sp,['pradera','montana','costa'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='fish') setEco(sp,['rio','costa'],['amanecer','dia','atardecer'],['primavera','verano','otono','invierno']);
    else if(k==='rabbit' || k==='hare') setEco(sp,['pradera','bosque'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='boar') setEco(sp,['bosque','pradera'],['atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='bison') setEco(sp,['pradera','bosque'],['amanecer','dia','atardecer'],['primavera','verano','otono','invierno']);
    else if(k==='beaver') setEco(sp,['rio'],['atardecer','noche'],['primavera','verano','otono','invierno']);

    if(hasWords(n,['tritón','triton','rana','sapo'])) sp.habitats=['rio','pradera','bosque'];
    if(hasWords(n,['cisne','garza','martín pescador','martin pescador','cigüeña','ciguena','pelícano','pelicano','flamenco'])) sp.habitats=['rio','costa','pradera'];
    if(hasWords(n,['cormorán','cormoran','frailecillo'])) sp.habitats=['costa','rio'];
    if(hasWords(n,['búho','buho','lechuza','mochuelo'])) sp.times=['atardecer','noche'];
    if(hasWords(n,['alondra','pinzón','pinzon','mirlo','petirrojo','curruca','oropéndola','herrerillo'])) sp.times=['amanecer','dia','atardecer'];
    if(hasWords(n,['murciélago','murcielago','erizo','tejón','tejon','turón','turon','lirón','liron','topo'])) sp.times=['atardecer','noche'];
    if(hasWords(n,['nutria','castor'])) sp.habitats=['rio','costa'];
    if(hasWords(n,['alce','reno','urogallo','zorro ártico','zorro artico'])){ sp.habitats=[...new Set([...sp.habitats,'tundra'])]; sp.seasons=['verano','otono','invierno']; }
    if(hasWords(n,['íbice','ibice','rebeco','quebrantahuesos','águila','aguila','buitre','lince','oso','víbora','vibora','cabra montés','cabra montes','marmota'])) sp.habitats=[...new Set([...sp.habitats,'montana'])];
    if(hasWords(n,['camaleón','camaleon','lagarto'])) sp.habitats=['pradera','montana','costa'];
    if(hasWords(n,['liebre variable','perdiz nival'])){ sp.seasons=['invierno','otono','primavera']; sp.habitats=[...new Set([...sp.habitats,'montana','tundra'])]; }
    if(hasWords(n,['frailecillo','golondrina de mar','somormujo'])) sp.seasons=['primavera','verano'];
    if(hasWords(n,['trucha','barbo','tenca','perca'])) sp.habitats=['rio'];
  }
  REGIONS.forEach(r=>{r.habitats=(REGION_BIOMES[r.id]||r.habitats).slice(0,4);});
}

const ASIA_V23_TAXONOMY={"asia_esp_0538":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0206":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0214":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0383":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0519":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0102":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0205":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0300":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0065":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0910":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0327":{"className":"Reptilia","subClass":"Tortugas"},"asia_esp_0873":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0246":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0182":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0218":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0227":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0534":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0321":{"className":"Mammalia","subClass":"Roedores y lagomorfos"},"asia_esp_0183":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0404":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0442":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0347":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0319":{"className":"Mammalia","subClass":"Roedores y lagomorfos"},"asia_esp_0468":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0891":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0890":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0226":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0878":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0422":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0842":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0824":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0915":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0911":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0888":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0868":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0872":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0410":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0874":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0816":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0176":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0852":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0336":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0860":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0853":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0476":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0833":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0050":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0061":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0063":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0830":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0465":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0825":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0900":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0136":{"className":"Reptilia","subClass":"Otros reptiles"},"asia_esp_0906":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0905":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0351":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0124":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0296":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0096":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0355":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0006":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0318":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0854":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0395":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0856":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0310":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0345":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0902":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0016":{"className":"Amphibia","subClass":"Salamandras"},"asia_esp_0433":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0440":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0333":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0111":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0249":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0067":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0867":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0869":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0883":{"className":"Aves","subClass":"Rapaces"},"asia_esp_0849":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0858":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0238":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0857":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0317":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0859":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0251":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0352":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0436":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0491":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0165":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0834":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0498":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0901":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0527":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0316":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0373":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0877":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0494":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0363":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0414":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0308":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0087":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0017":{"className":"Amphibia","subClass":"Salamandras"}};
// Beta 3.15.4: clases y grupos uniformes para cuaderno, bestiario e investigación.
function taxonomyInfo(id){
 const sp=SPECIES[id];if(!sp)return {className:'Animalia',subClass:'Sin clasificar'};
 const kind=sp.kind,latin=sp.latin||'',name=sp.name.toLocaleLowerCase('es');
 const genus=latin.split(' ')[0],g=(className,subClass)=>({className,subClass});
 if(kind==='amphibian'||/^(Rana|Epidalea|Strauchbufo|Conraua|Xenopus|Sclerophrys|Breviceps|Schismaderma)$/.test(genus))
  return g('Amphibia','Ranas y sapos');
 if(kind==='salamander')return g('Amphibia','Salamandras y tritones');
 if(kind==='ray')return g('Chondrichthyes','Rayas');
 if(kind==='fish')return g('Actinopterygii','Peces óseos');
 if(kind==='crocodile')return g('Reptilia','Cocodrilianos');
 if(kind==='tortoise')return g('Reptilia','Tortugas');
 if(kind==='snake')return g('Reptilia','Serpientes');
 if(kind==='lizard'||kind==='reptile')return g('Reptilia','Lagartos');
 if(kind==='raptor')return g('Aves','Aves rapaces');
 if(kind==='owl')return g('Aves','Búhos y lechuzas');
 if(kind==='seabird')return g('Aves','Aves marinas');
 if(['heron','stork','wader','pelican','kingfisher'].includes(kind))return g('Aves','Aves acuáticas y ribereñas');
 if(kind==='swan')return g('Aves','Anátidas');
 if(kind==='ostrich')return g('Aves','Ratites');
 if(genus==='Lagopus'||/perdiz|faisán|faisan|urogallo|codorniz/.test(name))return g('Aves','Galliformes');
 if(/cálao|calao/.test(name)||genus==='Buceros')return g('Aves','Cálaos');
 if(kind==='forestbird'||kind==='songbird')return g('Aves','Aves terrestres');
 if(kind==='cat')return g('Mammalia','Felinos');
 if(kind==='canid')return g('Mammalia','Cánidos');
 if(kind==='bear')return g('Mammalia','Úrsidos');
 if(kind==='mustelid'||kind==='otter')return g('Mammalia','Mustélidos');
 if(kind==='rabbit'||kind==='hare'||genus==='Lepus')return g('Mammalia','Lagomorfos');
 if(kind==='primate')return g('Mammalia','Primates');
 if(kind==='lemur')return g('Mammalia','Lémures');
 if(kind==='elephant')return g('Mammalia','Elefantes');
 if(kind==='rhino')return g('Mammalia','Rinocerontes');
 if(kind==='hippo')return g('Mammalia','Hipopótamos');
 if(kind==='pangolin')return g('Mammalia','Pangolines');
 if(kind==='giraffe')return g('Mammalia','Jirafas y afines');
 if(kind==='cetacean')return g('Mammalia','Cetáceos');
 if(kind==='sirenian')return g('Mammalia','Sirénidos');
 if(kind==='beaver'||kind==='small'){
  if(/murciélago|murcielago/.test(name))return g('Mammalia','Murciélagos');
  if(/desmán|desman|musaraña|musarana|topo/.test(name))return g('Mammalia','Insectívoros');
  return g('Mammalia','Roedores y pequeños mamíferos');
 }
 if(kind==='deer'||kind==='bison')return g('Mammalia','Ungulados');
 if(kind==='zebra')return g('Mammalia','Équidos');
 if(kind==='camel')return g('Mammalia','Camélidos');
 if(kind==='boar')return g('Mammalia','Suidos');
 return g('Mammalia','Otros mamíferos');
}
function taxonomyText(id){
  const st=stage(id); const t=taxonomyInfo(id);
  if(st<2) return 'Clasificación: por estudiar';
  if(st<3) return `Clase: ${t.className}`;
  return `Clase: ${t.className} · Grupo: ${t.subClass}`;
}
// Beta 3.10.1: preservar la ecología explícita de las dos regiones nuevas.
// normalizeEcology() aplica perfiles por familia al catálogo global y puede
// sobrescribir la ecología africana (p. ej., león/guepardo pasan a bosque).
// Capturamos únicamente las fichas de Rift y Seychelles antes de normalizar:
// sin tocar guardados, regiones previas ni sus ID.
const V310_NEW_REGIONS=['HX-08-12','HX-07-14','HX-09-12','HX-11-10'];
const V310_PRESERVED_ECO=Object.fromEntries(
 [...new Set(REGIONS.filter(r=>V310_NEW_REGIONS.includes(r.id)).flatMap(r=>r.species))]
 .filter(id=>!!SPECIES[id]).map(id=>[id,{
  habitats:[...SPECIES[id].habitats],times:[...SPECIES[id].times],seasons:[...SPECIES[id].seasons]
 }])
);
normalizeEcology();
for(const [id,eco] of Object.entries(V310_PRESERVED_ECO))Object.assign(SPECIES[id],eco);

// Beta 3.13: regularización África ↔ Atlas_Fauna_Hexagonal_209_900_Especies.xlsx.
// Los ID af_xlsx_* son persistentes; no se reescriben identificadores históricos.
Object.assign(SPECIES,{"af_xlsx_sahara_buitre":{"name":"Buitre orejudo","latin":"Torgos tracheliotos","rare":"Raro","kind":"raptor","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_jerbo":{"name":"Jerbo egipcio","latin":"Jaculus jaculus","rare":"Común","kind":"small","color":"#9d9478","habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_addax":{"name":"Addax","latin":"Addax nasomaculatus","rare":"Muy rara","kind":"deer","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_geco_desierto":{"name":"Geco del desierto","latin":"Stenodactylus sthenodactylus","rare":"Poco común","kind":"lizard","color":"#9d9478","habitats":["desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_vibora_cornuda":{"name":"Víbora cornuda","latin":"Cerastes cerastes","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_alcefalo":{"name":"Alcéfalo común","latin":"Alcelaphus buselaphus","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_frente_roja":{"name":"Gacela de frente roja","latin":"Eudorcas rufifrons","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_orix_cimitarra":{"name":"Órix de cuernos de cimitarra","latin":"Oryx dammah","rare":"Muy rara","kind":"deer","color":"#9d9478","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_cuvier":{"name":"Gacela de Cuvier","latin":"Gazella cuvieri","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["montana","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_garceta":{"name":"Garceta común","latin":"Egretta garzetta","rare":"Común","kind":"heron","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_tilapia":{"name":"Tilapia del Nilo","latin":"Oreochromis niloticus","rare":"Común","kind":"fish","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_varano_nilo":{"name":"Varano del Nilo","latin":"Varanus niloticus","rare":"Poco común","kind":"lizard","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_martin_pio":{"name":"Martín pescador pío","latin":"Ceryle rudis","rare":"Poco común","kind":"kingfisher","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_bonobo":{"name":"Bonobo","latin":"Pan paniscus","rare":"Muy rara","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_cocodrilo_enano":{"name":"Cocodrilo enano africano","latin":"Osteolaemus tetraspis","rare":"Raro","kind":"crocodile","color":"#9d9478","habitats":["rio","humedal","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_pez_tigre_goliat":{"name":"Pez tigre goliat","latin":"Hydrocynus goliath","rare":"Muy rara","kind":"fish","color":"#9d9478","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_piton_bola":{"name":"Pitón bola","latin":"Python regius","rare":"Poco común","kind":"snake","color":"#9d9478","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rana_goliat":{"name":"Rana goliat","latin":"Conraua goliath","rare":"Muy rara","kind":"salamander","color":"#9d9478","habitats":["rio","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_hipopotamo_pigmeo":{"name":"Hipopótamo pigmeo","latin":"Choeropsis liberiensis","rare":"Muy rara","kind":"hippo","color":"#9d9478","habitats":["bosque","humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gato_dorado":{"name":"Gato dorado africano","latin":"Caracal aurata","rare":"Raro","kind":"cat","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_ayeaye":{"name":"Aye-aye","latin":"Daubentonia madagascariensis","rare":"Muy rara","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_raton":{"name":"Lémur ratón gris","latin":"Microcebus murinus","rare":"Poco común","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_rufo":{"name":"Lémur rufo rojo","latin":"Varecia rubra","rare":"Raro","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_vanga_azul":{"name":"Vanga azul","latin":"Cyanolanius madagascarinus","rare":"Raro","kind":"songbird","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_camaleon_parson":{"name":"Camaleón de Parson","latin":"Calumma parsonii","rare":"Muy rara","kind":"lizard","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gecko_hoja":{"name":"Geco cola de hoja satánico","latin":"Uroplatus phantasticus","rare":"Raro","kind":"lizard","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_boa_madagascar":{"name":"Boa de Madagascar","latin":"Sanzinia madagascariensis","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rinoceronte_negro":{"name":"Rinoceronte negro","latin":"Diceros bicornis","rare":"Muy rara","kind":"rhino","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_cerdo_hormiguero":{"name":"Cerdo hormiguero","latin":"Orycteropus afer","rare":"Poco común","kind":"small","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_mamba_negra":{"name":"Mamba negra","latin":"Dendroaspis polylepis","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_thomson":{"name":"Gacela de Thomson","latin":"Eudorcas thomsonii","rare":"Común","kind":"deer","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_topi":{"name":"Topi","latin":"Damaliscus lunatus","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_avestruz_somali":{"name":"Avestruz somalí","latin":"Struthio molybdophanes","rare":"Raro","kind":"ostrich","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_speke":{"name":"Gacela de Speke","latin":"Gazella spekei","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_jirafa_reticulada":{"name":"Jirafa reticulada","latin":"Giraffa reticulata","rare":"Raro","kind":"giraffe","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_orix_beisa":{"name":"Órix beisa","latin":"Oryx beisa","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rata_topo":{"name":"Rata topo gigante","latin":"Tachyoryctes macrocephalus","rare":"Raro","kind":"small","color":"#9d9478","habitats":["montana","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_etc":{"name":"Rana de uñas africana","latin":"Xenopus laevis","rare":"Poco común","kind":"salamander","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const AFRICA_EXCEL_HEX={"HX-06-07":"HX-04-09","HX-07-11":"HX-05-12","HX-06-09":"HX-04-10","HX-06-11":"HX-04-11","HX-08-11":"HX-06-10","HX-07-12":"HX-05-11","HX-09-14":"HX-08-11","HX-09-11":"HX-07-12","HX-07-13":"HX-06-12","HX-07-08":"HX-05-10","HX-07-10":"HX-06-11"};
const AFRICA_V313_ASSIGN={"HX-06-07":["af_xlsx_sahara_buitre","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"HX-07-11":["af_xlsx_sahara_buitre","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_xlsx_orix_cimitarra"],"HX-07-10":["af_xlsx_alcefalo","af_xlsx_cerdo_hormiguero","af_xlsx_mamba_negra","af_xlsx_gacela_thomson","af_xlsx_topi","af_facoquero"],"HX-11-10":["af_xlsx_alcefalo","af_xlsx_rinoceronte_negro","af_xlsx_cerdo_hormiguero","af_xlsx_mamba_negra","af_xlsx_lemur_etc","af_facoquero"],"HX-06-09":["eu_esp_0219","eu_esp_0505","af_xlsx_gacela_cuvier"],"HX-06-08":["af_xlsx_gacela_cuvier"],"HX-06-11":["af_xlsx_garceta","af_xlsx_tilapia","af_xlsx_varano_nilo","af_xlsx_martin_pio"],"HX-09-11":["af_xlsx_tilapia","af_xlsx_varano_nilo"],"HX-08-11":["af_xlsx_bonobo","af_xlsx_cocodrilo_enano","af_xlsx_pez_tigre_goliat","af_xlsx_gato_dorado","af_okapi"],"HX-08-10":["af_xlsx_cocodrilo_enano"],"HX-08-08":["af_xlsx_piton_bola","af_xlsx_rana_goliat","af_xlsx_hipopotamo_pigmeo","af_xlsx_gato_dorado"],"HX-07-08":["af_xlsx_piton_bola","af_facoquero"],"HX-09-14":["af_xlsx_ayeaye","af_xlsx_lemur_raton","af_xlsx_lemur_rufo","af_xlsx_vanga_azul","af_xlsx_camaleon_parson","af_xlsx_gecko_hoja","af_xlsx_boa_madagascar"],"HX-07-12":["af_xlsx_avestruz_somali","af_xlsx_gacela_speke","af_xlsx_jirafa_reticulada","af_xlsx_orix_beisa"],"HX-07-13":["af_xlsx_rata_topo"]};
for(const region of REGIONS.filter(r=>r.continent==='África')){
 region.excelHex=AFRICA_EXCEL_HEX[region.id]||null;
 for(const id of AFRICA_V313_ASSIGN[region.id]||[]){
  if(!SPECIES[id])continue;
  if(!region.species.includes(id))region.species.push(id);
 }
}
// Asegura que ninguna especie asignada quede inaccesible por un bioma incompatible.
for(const region of REGIONS.filter(r=>r.continent==='África')){
 for(const id of region.species){
  const sp=SPECIES[id];if(!sp)continue;
  if(!sp.habitats.some(h=>region.habitats.includes(h)))sp.habitats=[...new Set([...sp.habitats,region.habitats[0]])];
 }
}

// Beta 3.13.1 · conciliación completa de fauna africana según Excel base (14 hexágonos).
// La tabla usa nombres científicos; chimpancé y gorila se enlazan a fichas de subespecie preexistentes.
Object.assign(SPECIES,{"af_xlsx_131_aquila_fasciata":{"name":"Águila perdicera","latin":"Aquila fasciata","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["montana","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_circaetus_gallicus":{"name":"Águila culebrera","latin":"Circaetus gallicus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["estepa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_neophron_percnopterus":{"name":"Alimoche común","latin":"Neophron percnopterus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["desierto","estepa","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_atelerix_algirus":{"name":"Erizo argelino","latin":"Atelerix algirus","rare":"Poco común","kind":"small","color":"#9b8d70","habitats":["estepa","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_pandion_haliaetus":{"name":"Águila pescadora","latin":"Pandion haliaetus","rare":"Poco común","kind":"raptor","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_sclerophrys_regularis":{"name":"Sapo común africano","latin":"Sclerophrys regularis","rare":"Común","kind":"salamander","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_ceratogymna_atrata":{"name":"Cálao de casquete negro","latin":"Ceratogymna atrata","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_musophaga_violacea":{"name":"Turaco violeta","latin":"Musophaga violacea","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_ploceus_cucullatus":{"name":"Tejedor común","latin":"Ploceus cucullatus","rare":"Común","kind":"songbird","color":"#9b8d70","habitats":["bosque","humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_chlorocebus_sabaeus":{"name":"Mono verde","latin":"Chlorocebus sabaeus","rare":"Común","kind":"primate","color":"#9b8d70","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_phataginus_tricuspis":{"name":"Pangolín arborícola","latin":"Phataginus tricuspis","rare":"Raro","kind":"pangolin","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_cercopithecus_diana":{"name":"Mono diana","latin":"Cercopithecus diana","rare":"Raro","kind":"primate","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_colobus_polykomos":{"name":"Colobo occidental blanco y negro","latin":"Colobus polykomos","rare":"Raro","kind":"primate","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_cephalophus_zebra":{"name":"Duíquer cebra","latin":"Cephalophus zebra","rare":"Raro","kind":"deer","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_pantodon_buchholzi":{"name":"Pez mariposa africano","latin":"Pantodon buchholzi","rare":"Raro","kind":"fish","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_agama_agama":{"name":"Agama común","latin":"Agama agama","rare":"Común","kind":"lizard","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_gyps_africanus":{"name":"Buitre dorsiblanco africano","latin":"Gyps africanus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lepus_capensis":{"name":"Liebre del Cabo","latin":"Lepus capensis","rare":"Común","kind":"hare","color":"#9b8d70","habitats":["desierto","estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hippotragus_equinus":{"name":"Antílope ruano","latin":"Hippotragus equinus","rare":"Poco común","kind":"deer","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_bitis_arietans":{"name":"Víbora bufadora","latin":"Bitis arietans","rare":"Raro","kind":"snake","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_equus_africanus":{"name":"Asno salvaje africano","latin":"Equus africanus","rare":"Raro","kind":"deer","color":"#9b8d70","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_madoqua_saltiana":{"name":"Dicdic de Salt","latin":"Madoqua saltiana","rare":"Poco común","kind":"deer","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_corythaeola_cristata":{"name":"Turaco gigante","latin":"Corythaeola cristata","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_coracias_caudatus":{"name":"Carraca lila","latin":"Coracias caudatus","rare":"Común","kind":"forestbird","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_polemaetus_bellicosus":{"name":"Águila marcial","latin":"Polemaetus bellicosus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lupulella_mesomelas":{"name":"Chacal de lomo negro","latin":"Lupulella mesomelas","rare":"Común","kind":"canid","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_mungos_mungo":{"name":"Mangosta rayada","latin":"Mungos mungo","rare":"Común","kind":"mustelid","color":"#9b8d70","habitats":["pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lepus_fagani":{"name":"Liebre etíope","latin":"Lepus fagani","rare":"Poco común","kind":"hare","color":"#9b8d70","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_otocyon_megalotis":{"name":"Zorro orejudo","latin":"Otocyon megalotis","rare":"Común","kind":"canid","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_geosciurus_inauris":{"name":"Ardilla terrestre del Cabo","latin":"Geosciurus inauris","rare":"Común","kind":"small","color":"#9b8d70","habitats":["desierto","estepa","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hystrix_africaeaustralis":{"name":"Puercoespín sudafricano","latin":"Hystrix africaeaustralis","rare":"Poco común","kind":"small","color":"#9b8d70","habitats":["estepa","bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_mellivora_capensis":{"name":"Tejón melero","latin":"Mellivora capensis","rare":"Raro","kind":"mustelid","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_breviceps_macrops":{"name":"Rana de lluvia del desierto","latin":"Breviceps macrops","rare":"Raro","kind":"salamander","color":"#9b8d70","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_schismaderma_carens":{"name":"Sapo de vientre rojo","latin":"Schismaderma carens","rare":"Poco común","kind":"salamander","color":"#9b8d70","habitats":["rio","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_naja_mossambica":{"name":"Cobra escupidora de Mozambique","latin":"Naja mossambica","rare":"Raro","kind":"snake","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hydrictis_maculicollis":{"name":"Nutria de cuello manchado","latin":"Hydrictis maculicollis","rare":"Raro","kind":"otter","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hydrocynus_vittatus":{"name":"Pez tigre africano","latin":"Hydrocynus vittatus","rare":"Poco común","kind":"fish","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_trioceros_jacksonii":{"name":"Camaleón de Jackson","latin":"Trioceros jacksonii","rare":"Poco común","kind":"lizard","color":"#9b8d70","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_phelsuma_grandis":{"name":"Geco diurno gigante","latin":"Phelsuma grandis","rare":"Común","kind":"lizard","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const AFRICA_V3131_EXCEL_REFERENCE={"HX-04-09":{"gameRegion":"HX-06-07","latin":["Torgos tracheliotos","Vulpes zerda","Felis margarita","Jaculus jaculus","Addax nasomaculatus","Gazella dorcas","Stenodactylus sthenodactylus","Cerastes cerastes"]},"HX-04-10":{"gameRegion":"HX-06-09","latin":["Geronticus eremita","Aquila fasciata","Circaetus gallicus","Neophron percnopterus","Canis aureus","Vulpes vulpes","Atelerix algirus","Genetta genetta","Sus scrofa","Macaca sylvanus","Gazella cuvieri","Testudo graeca"]},"HX-04-11":{"gameRegion":"HX-06-11","latin":["Ardea goliath","Egretta garzetta","Pelecanus onocrotalus","Threskiornis aethiopicus","Merops nubicus","Neophron percnopterus","Pandion haliaetus","Ceryle rudis","Hippopotamus amphibius","Oreochromis niloticus","Varanus niloticus","Crocodylus niloticus","Sclerophrys regularis"]},"HX-05-09":{"gameRegion":"HX-08-08","latin":["Ceratogymna atrata","Musophaga violacea","Ploceus cucullatus","Tauraco persa","Caracal aurata","Panthera pardus","Chlorocebus sabaeus","Choeropsis liberiensis","Civettictis civetta","Mandrillus sphinx","Phataginus tricuspis","Cercopithecus diana","Colobus polykomos","Pan troglodytes","Cephalophus zebra","Loxodonta cyclotis","Pantodon buchholzi","Agama agama","Conraua goliath","Python regius","Python sebae"]},"HX-05-10":{"gameRegion":"HX-07-08","latin":["Struthio camelus","Gyps africanus","Vulpes pallida","Caracal caracal","Chlorocebus sabaeus","Galago senegalensis","Hyaena hyaena","Lepus capensis","Gazella dorcas","Hippotragus equinus","Phacochoerus africanus","Agama agama","Bitis arietans","Python regius"]},"HX-05-11":{"gameRegion":"HX-07-12","latin":["Struthio molybdophanes","Caracal caracal","Crocuta crocuta","Papio hamadryas","Equus africanus","Gazella spekei","Giraffa reticulata","Litocranius walleri","Madoqua saltiana","Oryx beisa"]},"HX-05-12":{"gameRegion":"HX-07-11","latin":["Merops nubicus","Struthio camelus","Torgos tracheliotos","Lycaon pictus","Acinonyx jubatus","Crocuta crocuta","Alcelaphus buselaphus","Eudorcas rufifrons","Gazella dorcas","Oryx dammah","Phacochoerus africanus"]},"HX-06-10":{"gameRegion":"HX-08-11","latin":["Corythaeola cristata","Caracal aurata","Panthera pardus","Civettictis civetta","Mandrillus sphinx","Osteolaemus tetraspis","Smutsia gigantea","Cercopithecus neglectus","Gorilla gorilla","Pan paniscus","Pan troglodytes","Loxodonta cyclotis","Okapia johnstoni","Philantomba monticola","Tragelaphus eurycerus","Hydrocynus goliath","Pantodon buchholzi","Python sebae"]},"HX-06-11":{"gameRegion":"HX-07-10","latin":["Phoeniconaias minor","Bucorvus leadbeateri","Coracias caudatus","Sagittarius serpentarius","Struthio camelus","Polemaetus bellicosus","Lupulella mesomelas","Acinonyx jubatus","Leptailurus serval","Panthera leo","Panthera pardus","Crocuta crocuta","Galago senegalensis","Helogale parvula","Mungos mungo","Orycteropus afer","Papio anubis","Alcelaphus buselaphus","Connochaetes taurinus","Damaliscus lunatus","Equus quagga","Eudorcas thomsonii","Giraffa camelopardalis","Hippopotamus amphibius","Loxodonta africana","Phacochoerus africanus","Syncerus caffer","Taurotragus oryx","Bitis arietans","Dendroaspis polylepis"]},"HX-06-12":{"gameRegion":"HX-07-13","latin":["Aquila chrysaetos","Gypaetus barbatus","Canis simensis","Tachyoryctes macrocephalus","Theropithecus gelada","Lepus fagani","Capra walie","Tragelaphus buxtoni"]},"HX-07-10":{"gameRegion":"HX-10-10","latin":["Struthio camelus","Otocyon megalotis","Panthera leo","Geosciurus inauris","Hystrix africaeaustralis","Mellivora capensis","Parahyaena brunnea","Smutsia temminckii","Suricata suricatta","Oryx gazella"]},"HX-07-11":{"gameRegion":"HX-11-10","latin":["Bucorvus leadbeateri","Coracias caudatus","Sagittarius serpentarius","Polemaetus bellicosus","Lupulella mesomelas","Lycaon pictus","Panthera leo","Panthera pardus","Ceratotherium simum","Crocuta crocuta","Geosciurus inauris","Hystrix africaeaustralis","Mungos mungo","Orycteropus afer","Suricata suricatta","Aepyceros melampus","Diceros bicornis","Equus quagga","Giraffa camelopardalis","Hippotragus niger","Loxodonta africana","Syncerus caffer","Taurotragus oryx","Tragelaphus strepsiceros","Breviceps macrops","Schismaderma carens","Xenopus laevis","Bitis arietans","Dendroaspis polylepis","Naja mossambica"]},"HX-07-12":{"gameRegion":"HX-09-11","latin":["Ardea goliath","Balaeniceps rex","Balearica regulorum","Pelecanus onocrotalus","Phoeniconaias minor","Ploceus cucullatus","Leptailurus serval","Hydrictis maculicollis","Papio anubis","Gorilla beringei","Pan troglodytes","Hippopotamus amphibius","Hippotragus equinus","Hippotragus niger","Loxodonta africana","Syncerus caffer","Hydrocynus vittatus","Oreochromis niloticus","Trioceros jacksonii","Crocodylus niloticus"]},"HX-08-11":{"gameRegion":"HX-09-14","latin":["Cyanolanius madagascarinus","Cryptoprocta ferox","Microcebus murinus","Tenrec ecaudatus","Daubentonia madagascariensis","Indri indri","Lemur catta","Propithecus verreauxi","Varecia rubra","Calumma parsonii","Furcifer pardalis","Phelsuma grandis","Uroplatus phantasticus","Sanzinia madagascariensis","Astrochelys radiata"]}};
const AFRICA_V3131_ASSIGNED={"HX-06-07":["af_xlsx_sahara_buitre","af_fenec","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_gacela_dorcas","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"HX-06-09":["af_ibis_eremita","af_xlsx_131_aquila_fasciata","af_xlsx_131_circaetus_gallicus","af_xlsx_131_neophron_percnopterus","af_chacal_dorado","zorro_rojo","af_xlsx_131_atelerix_algirus","eu_esp_0219","jabali","af_macaco_berberia","af_xlsx_gacela_cuvier","eu_esp_0505"],"HX-06-11":["af_garza_goliat","af_xlsx_garceta","af_pelicano_blanco","af_ibis_sagrado","af_abejaruco_carmin","af_xlsx_131_neophron_percnopterus","af_xlsx_131_pandion_haliaetus","af_xlsx_martin_pio","af_hipopotamo","af_xlsx_tilapia","af_xlsx_varano_nilo","af_cocodrilo_nilo","af_xlsx_131_sclerophrys_regularis"],"HX-08-08":["af_xlsx_131_ceratogymna_atrata","af_xlsx_131_musophaga_violacea","af_xlsx_131_ploceus_cucullatus","af_turaco","af_xlsx_gato_dorado","af_leopardo","af_xlsx_131_chlorocebus_sabaeus","af_xlsx_hipopotamo_pigmeo","af_civeta","af_mandril","af_xlsx_131_phataginus_tricuspis","af_xlsx_131_cercopithecus_diana","af_xlsx_131_colobus_polykomos","af_chimpance","af_xlsx_131_cephalophus_zebra","af_elefante_bosque","af_xlsx_131_pantodon_buchholzi","af_xlsx_131_agama_agama","af_xlsx_rana_goliat","af_xlsx_piton_bola","af_piton_africana"],"HX-07-08":["af_avestruz","af_xlsx_131_gyps_africanus","af_zorro_palido","af_caracal","af_xlsx_131_chlorocebus_sabaeus","af_galago","asia_esp_0246","af_xlsx_131_lepus_capensis","af_gacela_dorcas","af_xlsx_131_hippotragus_equinus","af_facoquero","af_xlsx_131_agama_agama","af_xlsx_131_bitis_arietans","af_xlsx_piton_bola"],"HX-07-12":["af_xlsx_avestruz_somali","af_caracal","af_hiena_manchada","af_babuino_hamadryas","af_xlsx_131_equus_africanus","af_xlsx_gacela_speke","af_xlsx_jirafa_reticulada","af_gerenuc","af_xlsx_131_madoqua_saltiana","af_xlsx_orix_beisa"],"HX-07-11":["af_abejaruco_carmin","af_avestruz","af_xlsx_sahara_buitre","af_licaon","af_guepardo","af_hiena_manchada","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_gacela_dorcas","af_xlsx_orix_cimitarra","af_facoquero"],"HX-08-11":["af_xlsx_131_corythaeola_cristata","af_xlsx_gato_dorado","af_leopardo","af_civeta","af_mandril","af_xlsx_cocodrilo_enano","af_pangolin_gigante","af_mono_brazza","af_gorila_occidental","af_xlsx_bonobo","af_chimpance","af_elefante_bosque","af_okapi","af_duiker_azul","af_antilope_bongo","af_xlsx_pez_tigre_goliat","af_xlsx_131_pantodon_buchholzi","af_piton_africana"],"HX-07-10":["af_flamenco_enano","af_calao_terrestre","af_xlsx_131_coracias_caudatus","af_secretario","af_avestruz","af_xlsx_131_polemaetus_bellicosus","af_xlsx_131_lupulella_mesomelas","af_guepardo","af_serval","af_leon","af_leopardo","af_hiena_manchada","af_galago","af_mangosta_enana","af_xlsx_131_mungos_mungo","af_xlsx_cerdo_hormiguero","af_babuino_oliva","af_xlsx_alcefalo","af_nu_azul","af_xlsx_topi","af_cebra_llanura","af_xlsx_gacela_thomson","af_jirafa","af_hipopotamo","af_elefante_sabana","af_facoquero","af_bufalo_cafre","af_eland","af_xlsx_131_bitis_arietans","af_xlsx_mamba_negra"],"HX-07-13":["aguila_real","af_quebrantahuesos","af_lobo_etiope","af_xlsx_rata_topo","af_gelada","af_xlsx_131_lepus_fagani","af_ibice_walia","af_nyala_montana"],"HX-10-10":["af_avestruz","af_xlsx_131_otocyon_megalotis","af_leon","af_xlsx_131_geosciurus_inauris","af_xlsx_131_hystrix_africaeaustralis","af_xlsx_131_mellivora_capensis","af_hiena_parda","af_pangolin_temminck","af_suricata","af_orix"],"HX-11-10":["af_calao_terrestre","af_xlsx_131_coracias_caudatus","af_secretario","af_xlsx_131_polemaetus_bellicosus","af_xlsx_131_lupulella_mesomelas","af_licaon","af_leon","af_leopardo","af_rinoceronte_blanco","af_hiena_manchada","af_xlsx_131_geosciurus_inauris","af_xlsx_131_hystrix_africaeaustralis","af_xlsx_131_mungos_mungo","af_xlsx_cerdo_hormiguero","af_suricata","af_impala","af_xlsx_rinoceronte_negro","af_cebra_llanura","af_jirafa","af_antilope_sable","af_elefante_sabana","af_bufalo_cafre","af_eland","af_gran_kudu","af_xlsx_131_breviceps_macrops","af_xlsx_131_schismaderma_carens","af_xlsx_lemur_etc","af_xlsx_131_bitis_arietans","af_xlsx_mamba_negra","af_xlsx_131_naja_mossambica"],"HX-09-11":["af_garza_goliat","af_picozapato","af_grulla_coronada","af_pelicano_blanco","af_flamenco_enano","af_xlsx_131_ploceus_cucullatus","af_serval","af_xlsx_131_hydrictis_maculicollis","af_babuino_oliva","af_gorila_montana","af_chimpance","af_hipopotamo","af_xlsx_131_hippotragus_equinus","af_antilope_sable","af_elefante_sabana","af_bufalo_cafre","af_xlsx_131_hydrocynus_vittatus","af_xlsx_tilapia","af_xlsx_131_trioceros_jacksonii","af_cocodrilo_nilo"],"HX-09-14":["af_xlsx_vanga_azul","af_fosa","af_xlsx_lemur_raton","af_tenrec","af_xlsx_ayeaye","af_indri","af_lemur_colaanillada","af_sifaka","af_xlsx_lemur_rufo","af_xlsx_camaleon_parson","af_camaleon_pantera","af_xlsx_131_phelsuma_grandis","af_xlsx_gecko_hoja","af_xlsx_boa_madagascar","af_tortuga_radiada"]};
for(const region of REGIONS.filter(r=>r.continent==='África')){
 const incoming=AFRICA_V3131_ASSIGNED[region.id]||[];
 for(const id of incoming){
  if(!SPECIES[id]||region.species.includes(id))continue;
  region.species.push(id);
  const profile=SPECIES[id];
  if(!profile.habitats.some(h=>region.habitats.includes(h)))
   profile.habitats=[...new Set([...profile.habitats,region.habitats[0]])];
 }
}
// Garantizar observabilidad de perfiles preexistentes que comparten taxón entre continentes.
// Colores de caparazón diferenciados: especies terrestres europeas.
if(SPECIES['eu_esp_0505'])SPECIES['eu_esp_0505'].color='#997950';
if(SPECIES['eu_esp_0506'])SPECIES['eu_esp_0506'].color='#a4a16f';
// v2.2: preservar ecología de fauna asiática y evitar animales inaccesibles por bioma.
const ASIA_V22_ECO={"asia_esp_0402":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0086":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0344":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0209":{"habitats":["costa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano"]},"asia_esp_0203":{"habitats":["pradera","montana","tundra","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0234":{"habitats":["pradera","montana","tundra","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0177":{"habitats":["costa","rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0369":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0371":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0881":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0194":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0073":{"habitats":["desierto","estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0431":{"habitats":["desierto","estepa","pradera","montana"],"times":["dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0863":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0294":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0864":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0503":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0865":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0820":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0403":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0007":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0855":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0850":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0844":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0523":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0062":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0821":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0240":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0445":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]}};
Object.entries(ASIA_V22_ECO).forEach(([id,eco])=>{
 const sp=SPECIES[id]; if(!sp)return;
 sp.habitats=eco.habitats.slice();sp.times=eco.times.slice();sp.seasons=eco.seasons.slice();
});
REGIONS.filter(r=>r.continent==='Asia').forEach(r=>{
 // Los nuevos hexágonos nunca superan cuatro biomas.
 r.habitats=(REGION_BIOMES[r.id]||r.habitats).slice(0,4);
 for(const id of r.species){
   const sp=SPECIES[id];if(!sp)continue;
   if(!sp.habitats.some(h=>r.habitats.includes(h))){
     // Una especie compartida sigue observándose en al menos un bioma de su nuevo hexágono.
     const preferred=r.habitats.includes('montana') && /águila|aguila|oso|lince|cabra|buitre|leopardo/i.test(sp.name)?'montana':r.habitats[0];
     sp.habitats=[...new Set([...sp.habitats,preferred])];
   }
 }
});

Object.assign(SPECIES["asia_esp_0287"],{"habitats": ["rio", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0880"],{"habitats": ["bosque", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0861"],{"habitats": ["bosque"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0886"],{"habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0326"],{"habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0843"],{"habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0914"],{"habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0899"],{"habitats": ["bosque", "tundra", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0020"],{"habitats": ["estepa", "pradera", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0030"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0887"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0533"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0387"],{"habitats": ["estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0323"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0184"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0441"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0898"],{"habitats": ["estepa", "pradera", "rio"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
// Fauna nueva: patrones ecológicos concretos, independientes de las especies europeas.
Object.assign(SPECIES["asia_esp_0401"],{habitats:["bosque", "montana", "pradera"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0081"],{habitats:["montana", "pradera"],times:["amanecer", "dia", "atardecer"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0149"],{habitats:["bosque", "pradera"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0903"],{habitats:["pradera", "montana", "estepa"],times:["dia", "atardecer"],seasons:["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0088"],{habitats:["pradera", "estepa", "montana"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0080"],{habitats:["montana", "pradera", "estepa"],times:["amanecer", "dia", "atardecer"],seasons:["primavera", "verano", "otono", "invierno"]});


// v2.3: hábitats de las 103 especies nuevas, conservando faunas comunes.
const ASIA_V23_ECO={"asia_esp_0538":{"habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0206":{"habitats":["montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0214":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0383":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0519":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0102":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0205":{"habitats":["humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0300":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0065":{"habitats":["humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0910":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0327":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0873":{"habitats":["estepa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0246":{"habitats":["estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0182":{"habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0218":{"habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0227":{"habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0534":{"habitats":["montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0321":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0183":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0404":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0442":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0347":{"habitats":["estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0319":{"habitats":["estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0468":{"habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0891":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0890":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0226":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0878":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0422":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0842":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0824":{"habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0915":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0911":{"habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0888":{"habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0868":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0872":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0410":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0874":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0816":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0176":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0852":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0336":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0860":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0853":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0476":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0833":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0050":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0061":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0063":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0830":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0465":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0825":{"habitats":["pradera","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0900":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0136":{"habitats":["rio","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0906":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0905":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0351":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0124":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0296":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0096":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0355":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0006":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0318":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0854":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0395":{"habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0856":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0310":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0345":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0902":{"habitats":["montana","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0016":{"habitats":["rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono"]},"asia_esp_0433":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0440":{"habitats":["bosque","montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0333":{"habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0111":{"habitats":["pradera","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0249":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0067":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0867":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0869":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0883":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0849":{"habitats":["selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0858":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0238":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0857":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0317":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0859":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0251":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0352":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0436":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0491":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0165":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0834":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0498":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0901":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0527":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0316":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0373":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0877":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0494":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0363":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0414":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0308":{"habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0087":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0017":{"habitats":["costa","rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono"]}};
Object.entries(ASIA_V23_ECO).forEach(([id,eco])=>{if(SPECIES[id])Object.assign(SPECIES[id],eco);});
// Corrección biogeográfica: Felis margarita (gato de las arenas) es desértico, también en Sáhara.
if(SPECIES.asia_esp_0206)SPECIES.asia_esp_0206.habitats=['desierto','estepa'];

// Fauna norteamericana específica; las especies cosmopolitas reutilizan IDs globales.
Object.assign(SPECIES,{"na_esp_anser_caerulescens":{"name":"Ánsar nival","latin":"Anser caerulescens","rare":"Raro","kind":"swan","color":"#98907c","habitats":["tundra","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_corvus_corax":{"name":"Cuervo común","latin":"Corvus corax","rare":"Poco común","kind":"songbird","color":"#98907c","habitats":["bosque","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_bubo_scandiacus":{"name":"Búho nival","latin":"Bubo scandiacus","rare":"Poco común","kind":"owl","color":"#98907c","habitats":["tundra","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_falco_peregrinus":{"name":"Halcón peregrino","latin":"Falco peregrinus","rare":"Raro","kind":"raptor","color":"#98907c","habitats":["montana","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_dicrostonyx_groenlandicus":{"name":"Lemming de collar ártico","latin":"Dicrostonyx groenlandicus","rare":"Común","kind":"small","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_lemmus_trimucronatus":{"name":"Lemming pardo","latin":"Lemmus trimucronatus","rare":"Poco común","kind":"small","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ursus_americanus":{"name":"Oso negro americano","latin":"Ursus americanus","rare":"Común","kind":"bear","color":"#98907c","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_castor_canadensis":{"name":"Castor canadiense","latin":"Castor canadensis","rare":"Común","kind":"beaver","color":"#98907c","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ovibos_moschatus":{"name":"Buey almizclero","latin":"Ovibos moschatus","rare":"Poco común","kind":"bison","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ovis_dalli":{"name":"Borrego de Dall","latin":"Ovis dalli","rare":"Poco común","kind":"deer","color":"#98907c","habitats":["montana","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_dryocopus_pileatus":{"name":"Píleo","latin":"Dryocopus pileatus","rare":"Común","kind":"forestbird","color":"#98907c","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_haliaeetus_leucocephalus":{"name":"Águila calva","latin":"Haliaeetus leucocephalus","rare":"Común","kind":"raptor","color":"#98907c","habitats":["rio","costa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_puma_concolor":{"name":"Puma","latin":"Puma concolor","rare":"Común","kind":"cat","color":"#98907c","habitats":["bosque","montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_lontra_canadensis":{"name":"Nutria de río norteamericana","latin":"Lontra canadensis","rare":"Muy rara","kind":"otter","color":"#98907c","habitats":["rio","costa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_marmota_vancouverensis":{"name":"Marmota de Vancouver","latin":"Marmota vancouverensis","rare":"Común","kind":"small","color":"#98907c","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_odocoileus_hemionus":{"name":"Ciervo mulo","latin":"Odocoileus hemionus","rare":"Común","kind":"deer","color":"#98907c","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_oncorhynchus_mykiss":{"name":"Trucha arcoíris","latin":"Oncorhynchus mykiss","rare":"Poco común","kind":"fish","color":"#98907c","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// Fauna costera del Cabo y Namib: endémicos regionales en lugar de igualar zonas artificialmente.
Object.assign(SPECIES,{"af_alcatraz_cabo":{"name":"Alcatraz del Cabo","latin":"Morus capensis","rare":"Poco común","kind":"seabird","color":"#e4e0d2","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_cormoran_cabo":{"name":"Cormorán del Cabo","latin":"Phalacrocorax capensis","rare":"Común","kind":"seabird","color":"#393f43","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_ostrero_africano":{"name":"Ostrero africano","latin":"Haematopus moquini","rare":"Raro","kind":"wader","color":"#38342f","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
for(const r of REGIONS.filter(x=>['HX-11-11','HX-11-08'].includes(x.id))){
 const speciesIds=r.id==='HX-11-11'?['af_alcatraz_cabo','af_cormoran_cabo','af_ostrero_africano']:['af_cormoran_cabo','af_ostrero_africano'];
 for(const id of speciesIds)if(!r.species.includes(id))r.species.push(id);
}
// Ajuste ecológico de África: ampliar únicamente zonas poco pobladas con especies compartidas plausibles.
// Nunca recortar las regiones naturalmente ricas ni introducir animales por una cuota fija.
const AFRICA_ECO_REBALANCE={"HX-11-11":["af_pinguino_africano","af_lobo_marino_cabo","af_tiburon_blanco"],"HX-10-09":["af_jacana_africana","af_abejaruco_carmin","af_sitatunga","af_lechwe_rojo","af_hipopotamo","af_cocodrilo_nilo","af_pelicano_blanco","af_garza_goliat"],"HX-08-10":["af_okapi","af_civeta","af_xlsx_131_ceratogymna_atrata","af_xlsx_131_corythaeola_cristata","af_xlsx_131_pantodon_buchholzi","af_xlsx_131_colobus_polykomos","af_gorila_occidental","af_loro_gris"],"HX-11-08":["af_zorro_cabo","af_hiena_parda","af_camaleon_namaqua","af_geco_patas_palmeadas","af_suricata","af_orix","af_springbok","af_caracal","af_avestruz","af_xlsx_131_otocyon_megalotis"],"HX-09-09":["af_antilope_sable","af_calao_terrestre","af_pangolin_temminck","af_inseparable_lilian","af_elefante_sabana","af_licaon","af_leopardo","af_babuino_oliva","af_guepardo","af_facoquero","af_xlsx_131_mellivora_capensis","af_xlsx_131_mungos_mungo"],"HX-10-12":["af_dugongo","af_manta_gigante","af_delfin_jorobado_indico","af_martin_malaquita","af_tiburon_blanco","af_cocodrilo_nilo","af_hipopotamo","af_garza_goliat","af_aguila_pescadora","af_xlsx_131_pandion_haliaetus"],"HX-08-12":["af_flamenco_enano","af_pelicano_blanco","af_jirafa_rothschild","af_gran_kudu","af_hipopotamo","af_leon","af_bufalo_cafre","af_aguila_pescadora","af_guepardo","af_jacana_africana","af_cocodrilo_nilo","af_grulla_coronada"],"HX-09-12":["af_picozapato","af_lechwe_negro","af_grulla_carunculada","af_puku","af_sitatunga","af_hipopotamo","af_jacana_africana","af_pelicano_blanco","af_grulla_coronada","af_aguila_pescadora","af_cocodrilo_nilo","af_bufalo_cafre"],"HX-06-08":["af_macaco_berberia","af_gato_montes_africano","af_ciervo_berberia","af_zorro_ruppell","af_arrui","af_fenec","af_chacal_dorado","af_gacela_dorcas","af_cobra_egipcia","af_xlsx_gacela_cuvier","eu_esp_0505"]};
for(const [rid,ids] of Object.entries(AFRICA_ECO_REBALANCE)){
 const region=REGIONS.find(r=>r.id===rid);
 if(!region)continue;
 for(const id of ids){
  const species=SPECIES[id];
  if(!species||region.species.includes(id))continue;
  // Las especies que aparecen en varios biomas solo se añaden si son observables en este hexágono.
  if(!species.habitats.some(h=>region.habitats.includes(h)))continue;
  region.species.push(id);
 }
}

// Beta 3.15.3: un único taxón Gypaetus barbatus en las regiones europeas, asiáticas y africanas.
// El ID europeo original se conserva para que los registros y las monografías previas sigan siendo válidos.
for(const region of REGIONS){
 region.species=[...new Set(region.species.map(id=>id==='af_quebrantahuesos'?'quebrantahuesos':id))];
}
delete SPECIES.af_quebrantahuesos;
// Beta 3.15.4: fauna compartida, registros huérfanos y clasificación corregida.
const V3154_SPECIES_ALIASES={asia_esp_0088:'af_caracal',asia_esp_0538:'af_zorro_ruppell'};
for(const region of REGIONS){
 region.species=[...new Set(region.species.map(id=>V3154_SPECIES_ALIASES[id]||id))];
}
for(const alias of Object.keys(V3154_SPECIES_ALIASES))delete SPECIES[alias];
// África posee Canis lupaster, distinto de Canis aureus euroasiático.
Object.assign(SPECIES.af_chacal_dorado,{name:'Lobo dorado africano',latin:'Canis lupaster'});
// El leopardo persa y el africano conservan sus fichas como subespecies.
SPECIES.asia_esp_0401.latin='Panthera pardus tulliana';
SPECIES.af_leopardo.latin='Panthera pardus pardus';
SPECIES.eu_esp_0267.name='Lagópodo común'; // Lagopus lagopus; no confundir con Lagopus muta.
SPECIES.asia_esp_0067.kind='forestbird'; // Cálao rinoceronte es un ave.
SPECIES.eu_esp_0623.habitats=['rio','bosque'];
SPECIES.eu_esp_0623.times=['amanecer','atardecer','noche'];
for(const id of ['asia_esp_0898','eu_esp_0660','eu_esp_0659','af_xlsx_rana_goliat',
 'af_xlsx_lemur_etc','af_xlsx_131_sclerophrys_regularis',
 'af_xlsx_131_breviceps_macrops','af_xlsx_131_schismaderma_carens']){
 if(SPECIES[id])SPECIES[id].kind='amphibian';
}
const V3154_REGION_SPECIES={
 'HX-02-12':['meloncillo','ciguena_blanca','martin_pescador'],
 'HX-02-11':['ciguena_blanca'],
 'HX-01-09':['martin_pescador'],
 'HX-03-09':['chacal_dorado']
};
for(const [rid,ids] of Object.entries(V3154_REGION_SPECIES)){
 const region=REGIONS.find(r=>r.id===rid);
 if(!region)throw Error('Región inexistente: '+rid);
 for(const id of ids){
  if(!SPECIES[id])throw Error('Especie inexistente: '+id);
  if(!region.species.includes(id))region.species.push(id);
  if(!SPECIES[id].habitats.some(h=>region.habitats.includes(h)))
   SPECIES[id].habitats=[...new Set([...SPECIES[id].habitats,region.habitats[0]])];
 }
}
const V3154_NA_COLORS={
 na_esp_anser_caerulescens:'#e0e5e5',na_esp_corvus_corax:'#30383c',
 na_esp_bubo_scandiacus:'#e8e8db',na_esp_falco_peregrinus:'#6f7882',
 na_esp_dicrostonyx_groenlandicus:'#b8a88b',na_esp_lemmus_trimucronatus:'#9d8065',
 na_esp_ursus_americanus:'#37332f',na_esp_castor_canadensis:'#80583e',
 na_esp_ovibos_moschatus:'#4f4237',na_esp_ovis_dalli:'#e4d6bb',
 na_esp_dryocopus_pileatus:'#292e31',na_esp_haliaeetus_leucocephalus:'#654f3c',
 na_esp_puma_concolor:'#b79069',na_esp_lontra_canadensis:'#715942',
 na_esp_marmota_vancouverensis:'#8f7659',na_esp_odocoileus_hemionus:'#a68061',
 na_esp_oncorhynchus_mykiss:'#728d89'
};
for(const [id,color] of Object.entries(V3154_NA_COLORS))if(SPECIES[id])SPECIES[id].color=color;

// Una antigua especie se había marcado como mustélido: clasificarla correctamente como anfibio.
if(SPECIES.salamandra_alpina)SPECIES.salamandra_alpina.kind='salamander';

// Reconcile eligibility only after all catalog extensions; never touches observations.
Object.entries(SPECIES).forEach(([id,sp])=>{sp.dimorphism=!!SEXUAL_DIMORPHISM[id];});

// v3.19.6: nomenclatura del juego; no implica equivalencia biológica.
function specialVariantName(value){
 const key=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/^(albino|albina|leucistico|leucistica)$/.test(key))return 'Albino';
 if(/^melanic[oa]$/.test(key))return 'Melánico';
 if(key==='notable')return 'Notable';
 return value;
}
// Presentation eligibility is deliberately independent of base rarity and catalog records.
const SPECIMEN_LEVELS={Notable:{skin:'alfa',color:'#b57949',rate:.01},'Épico':{skin:'epico',color:'#aab9c7',rate:.002},Excepcional:{skin:'excepcional',color:'#d1ad45',rate:.0004},Legendario:{skin:'legendario',color:'#8cafa2',rate:.0001}};
const LEGENDARY_SPECIMENS=[
 ['silverback','af_gorila_montana','Silverback','Un adulto de espalda plateada, mirada serena y cresta pronunciada.'],
 ['ambar','asia_esp_0402','Ámbar','Rayas anchas y un pelaje invernal denso en una pausa vigilante.'],
 ['niebla','asia_esp_0403','Niebla','Rosetas abiertas y una larga cola que acompaña el borde de la roca.'],
 ['fenrir','lobo_gris','Fenrir','Un lobo de manto gris, pecho claro y perfil atento.'],
 ['atlas','af_elefante_sabana','Atlas','Orejas desplegadas y colmillos asimétricos de crecimiento natural.'],
 ['centinela','aguila_real','Centinela','La nuca dorada destaca sobre las alas recogidas de este vigilante.'],
 ['basalto','asia_esp_0527','Basalto','Escamas oscuras y patas robustas sostienen una silueta rasante.'],
 ['seda','asia_esp_0373','Seda','Una cobra de capucha estrecha se eleva entre sus propios anillos.'],
 ['junco','af_cocodrilo_nilo','Junco','Escudos dorsales irregulares y un hocico surcado por viejas cicatrices.'],
 ['ancora','af_tortuga_aldabra','Áncora','Caparazón de anillos marcados y cuello extendido sobre patas columnares.'],
 ['ascua','zorro_rojo','Ascua','Un zorro de pecho marfil se sienta envuelto en su cola rojiza.'],
 ['remonte','asia_esp_0369','Remonte','Un salmón de dorso moteado y mandíbula curva en plena remontada.']
].map(([id,speciesId,name,description])=>({id,speciesId,name,description}));
const SPECIMEN_SELECTION={
 epico:['zorro_rojo','lobo_gris','aguila_real','reno','buho_real','jabali','af_gran_kudu','af_pangolin_gigante','af_gorila_montana','af_elefante_sabana','af_cocodrilo_nilo','af_tortuga_aldabra','asia_esp_0402','asia_esp_0403','asia_esp_0527','asia_esp_0373','asia_esp_0369','af_hipopotamo','af_jirafa','af_leon','af_suricata','af_secretario','af_picozapato','af_piton_africana'],
 excepcional:['zorro_rojo','lobo_gris','aguila_real','af_gran_kudu','af_pangolin_gigante','af_gorila_montana','af_elefante_sabana','af_cocodrilo_nilo','af_tortuga_aldabra','asia_esp_0402','asia_esp_0403','asia_esp_0527','asia_esp_0373','asia_esp_0369']
};
function canonicalTaxon(id){return (SPECIES[id]?.latin||'').toLowerCase().trim().split(/\s+/).slice(0,2).join(' ');}
function legendaryForSpecies(id){return LEGENDARY_SPECIMENS.find(l=>SPECIES[l.speciesId]&&canonicalTaxon(id)&&canonicalTaxon(l.speciesId)===canonicalTaxon(id));}
const SPECIMEN_CATEGORIES=Object.fromEntries(Object.keys(SPECIES).map(id=>{
 const categories=[];
 if(SPECIES[id].special.some(v=>specialVariantName(v)==='Notable'))categories.push('Notable');
 if(SPECIMEN_SELECTION.epico.includes(id)||legendaryForSpecies(id))categories.push('Épico');
 if(SPECIMEN_SELECTION.excepcional.includes(id)||legendaryForSpecies(id))categories.push('Excepcional');
 if(legendaryForSpecies(id))categories.push('Legendario');
 return [id,categories];
}));
function configuredSpecials(sp){
 const id=Object.keys(SPECIES).find(id=>SPECIES[id]===sp);
 return [...new Set([...(sp.special||[]).map(specialVariantName),...(SPECIMEN_CATEGORIES[id]||[])])];
}
// Keep the v3.19.6 array intact: its length defines each pigmentation probability.
Object.values(SPECIES).forEach(sp=>{sp.special=[...new Set((sp.special||[]).map(specialVariantName))];});
function specimenRates(id,ethology=0){
 const multiplier=ethology>=2?1.5:1;
 return Object.fromEntries((SPECIMEN_CATEGORIES[id]||[]).map(c=>[c,SPECIMEN_LEVELS[c].rate*multiplier]));
}
function rollSpecimen(id,snapshot,rng=Math.random){
 const sp=SPECIES[id],oldRate=.01+(snapshot.upgrades?.ethology>=2?.005:0);
 // An independent interval per historical pigment keeps exactly oldRate / old array length.
 let pigment='',cursor=0,draw=rng();
 for(const label of sp.special){if(label!=='Albino'&&label!=='Melánico')continue;
  cursor+=oldRate/sp.special.length;if(draw<cursor){pigment=label;break;}}
 let category='';cursor=0;draw=rng();
 for(const [label,rate] of Object.entries(specimenRates(id,snapshot.upgrades?.ethology))){
  const legendary=label==='Legendario'?legendaryForSpecies(id):null;
  if(legendary&&snapshot.legendaryFound?.[legendary.id])continue;
  cursor+=rate;if(draw<cursor){category=label;break;}
 }
 return {pigment,category};
}
function recordSpecimen(id,result,snapshot){
 const labels=[result.pigment,result.category].filter(label=>label&&(label!=='Legendario'||!snapshot.legendaryFound?.[legendaryForSpecies(id)?.id]));if(!labels.length)return;
 snapshot.specialSeen=snapshot.specialSeen||{};snapshot.specialSeen[id]=(snapshot.specialSeen[id]||0)+1;
 snapshot.specialFound=snapshot.specialFound||{};snapshot.specialFound[id]=snapshot.specialFound[id]||{};
 snapshot.specialCounts=snapshot.specialCounts||{};snapshot.specialCounts[id]=snapshot.specialCounts[id]||{};
 for(const label of labels){
  if(label==='Legendario'){
   const l=legendaryForSpecies(id);snapshot.legendaryFound=snapshot.legendaryFound||{};
   if(l&&!snapshot.legendaryFound[l.id])snapshot.legendaryFound[l.id]={id:l.id,speciesId:l.speciesId};
  }else{snapshot.specialFound[id][label]=true;snapshot.specialCounts[id][label]=(snapshot.specialCounts[id][label]||0)+1;}
 }
}
function specimenMarkup(id,variant='',category='',sex=null){
 if(category==='Legendario'||variant==='Legendario')return getSpriteMarkup(id,'legendario');
 const svg=getSpriteMarkup(id,variantToSkin(variant),!variant?sex:null);
 return category&&SPECIMEN_LEVELS[category]&&variantToSkin(variant)!==SPECIMEN_LEVELS[category].skin?decorateSpecimen(svg,category):svg;
}
function decorateSpecimen(svg,category){
 const level=SPECIMEN_LEVELS[category];if(!level)return svg;
 return svg.replace('>',` data-specimen-category="${category}">`+specimenHalo(category));
}
function specimenHalo(category){
 const color=SPECIMEN_LEVELS[category]?.color;if(!color)return '';
 return `<g data-specimen-halo="${category}" fill="none" stroke="${color}" stroke-width="1.5"><circle cx="50" cy="50" r="46" opacity=".6"/>${category==='Notable'?'':`<path d="M78 17l-2-7 5 3 3-5 3 5 5-3-2 7z" fill="${color}" stroke-width=".7"/>`}</g>`;
}

function normalizeSpecialDiscoveries(snapshot){
 if(!snapshot||typeof snapshot!=='object')return snapshot;
 snapshot.collectionId=snapshot.collectionId||('atlas-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 snapshot.legendaryFound={...(snapshot.legendaryFound||{})};
 snapshot.specialCounts=Object.fromEntries(Object.entries(snapshot.specialCounts||{}).map(([id,counts])=>[id,{...counts}]));
 // Copy nested records: importing must not mutate the supplied backup or rollback state.
 if(snapshot.specialFound&&typeof snapshot.specialFound==='object'){
  const records={};
  for(const [id,found] of Object.entries(snapshot.specialFound)){
   if(!found||typeof found!=='object'||Array.isArray(found)){records[id]=found;continue;}
   const unified={};
   for(const [label,seen] of Object.entries(found)){
    const name=specialVariantName(label);
    unified[name]=Object.prototype.hasOwnProperty.call(unified,name)?!!unified[name]||!!seen:seen;
   }
   records[id]=unified;
  }
  snapshot.specialFound=records;
 }
 // Historical diary text and last encounter must not expose a second category.
 const text=value=>typeof value==='string'?value.replace(/leucístic[oa]/gi,'Albino'):value;
 if(Array.isArray(snapshot.log))snapshot.log=snapshot.log.map(text);
 if(snapshot.lastEncounter&&typeof snapshot.lastEncounter==='object'){
  const encounter={...snapshot.lastEncounter};
  encounter.title=text(encounter.title);encounter.subtitle=text(encounter.subtitle);
  if(encounter.variant)encounter.variant=specialVariantName(encounter.variant);
  if(Array.isArray(encounter.entries))encounter.entries=encounter.entries.map(entry=>({...entry,
   ...(entry.variant?{variant:specialVariantName(entry.variant)}:{}),
   ...(Array.isArray(entry.note)?{note:entry.note.map(text)}:{})}));
  snapshot.lastEncounter=encounter;
 }
 return snapshot;
}


function sexSpriteMarkup(id,sex){
  const spec=SEXUAL_DIMORPHISM[id];
  if(!spec) return null;
  const bird3193=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_BIRD_ART_V3193==='function') ? globalThis.ATLAS_BIRD_ART_V3193(SPECIES[id],SPECIES[id].color,'normal',sex) : null;
  if(bird3193)return bird3193;
  const mammal3194=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_MAMMAL_ART_V3194==='function') ? globalThis.ATLAS_MAMMAL_ART_V3194(SPECIES[id],SPECIES[id].color,'normal',sex,id) : null;
  if(mammal3194)return mammal3194;
  const male=sex==='male';
  const color=SPECIES[id].color;
  const dark=shade(color,-25);
  const line='#362f28';
  const legs='<path d="M36 71v14m18-14v14" stroke="#45352a" stroke-width="3.5" stroke-linecap="round"/>';
  if(['antlers','reindeer','ibex'].includes(spec.type)){
    const body=male?color:shade(color,18);
    let horns='';
    if(spec.type==='antlers' && male){
      horns=`<path d="M60 34L54 15m6 19l-11-7m11 7l-2-12m14 12l7-19m-7 19l10-7m-10 7l2-12" stroke="#715940" stroke-width="3.1" fill="none" stroke-linecap="round"/>`;
    }
    if(spec.type==='reindeer'){
      horns=male?'<path d="M60 34L53 13m7 21l-12-7m12 7l-4-14m16 14l8-22m-8 22l12-8m-12 8l3-15" stroke="#70543b" stroke-width="3.4" fill="none" stroke-linecap="round"/>':'<path d="M60 36l-3-11m3 11l-6-5m16 4l4-10m-4 10l6-4" stroke="#866649" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    }
    if(spec.type==='ibex'){
      horns=male?'<path d="M60 35Q49 22 58 8m12 27Q83 23 75 8" stroke="#78583c" stroke-width="4.5" fill="none" stroke-linecap="round"/>':'<path d="M60 35Q56 29 58 21m12 14q5-5 4-13" stroke="#7c5c40" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }
    // Preserve the configured sexes while distinguishing moose palms and roe tines.
    if(spec.type==='antlers' && male && id==='alce')horns='<path d="M60 34L49 23L43 12L42 25L34 18L39 31L54 38M72 34L82 23L87 12L88 25L95 18L91 32L76 38" fill="#a48c69" stroke="#715940" stroke-width="2.5" stroke-linejoin="round"/>';
    if(spec.type==='antlers' && male && id==='corzo_europeo')horns='<path d="M60 34L57 19m2 9-6-4m4-3 4-5m11 18 4-15m-2 10 6-5m-4-3-3-5" fill="none" stroke="#715940" stroke-width="2.8" stroke-linecap="round"/>';
    const ears='<path d="M58 40l-10-8 2 11m22-3 10-8-2 12" fill="'+body+'" stroke="'+line+'" stroke-width="2.2"/>';
    const chest=male?'#e0cba8':'#e8dac6';
    return svgWrap(`<ellipse cx="43" cy="61" rx="${male?24:22}" ry="${male?17:14}" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="40" cy="57" rx="11" ry="5" fill="${shade(body,12)}"/><circle cx="66" cy="46" r="11" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="73" cy="53" rx="7" ry="4" fill="${chest}"/>${ears}${horns}<circle cx="69" cy="43" r="1.8" fill="#251c18"/>${legs}<path d="M21 58l-5-8" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`);
  }
  // Distinctive bird silhouettes and plumage, with the same proportions as the other mini-sprites.
  const bird=(opts={})=>{
    const body=opts.body||color, wing=opts.wing||dark, head=opts.head||body;
    const chest=opts.chest||'#e0c7a1',tail=opts.tail||wing, beak=opts.beak||'#c28c43';
    const marks=opts.marks||'', crest=opts.crest||'';
    return svgWrap(`<path d="M32 59L15 44 22 73 37 68" fill="${tail}" stroke="${line}" stroke-width="2.5"/><ellipse cx="47" cy="60" rx="21" ry="15" fill="${body}" stroke="${line}" stroke-width="3"/><path d="M33 56q14-8 23 6q-14 13-24 3z" fill="${wing}" stroke="${line}" stroke-width="2.2"/><ellipse cx="56" cy="65" rx="8" ry="7" fill="${chest}"/><circle cx="65" cy="46" r="10" fill="${head}" stroke="${line}" stroke-width="3"/>${crest}<path d="M73 49l13-3-11 9z" fill="${beak}" stroke="${line}" stroke-width="2"/><circle cx="68" cy="44" r="1.9" fill="#201c1a"/>${marks}<path d="M42 73l-4 13m13-13l4 13" stroke="#795b38" stroke-width="3" stroke-linecap="round"/>`);
  };
  if(spec.type==='peafowl'){
    if(male)return svgWrap(`<path d="M44 64Q7 22 24 11L42 31L52 9L62 31L80 13Q94 35 59 64Z" fill="#4f947f" stroke="${line}" stroke-width="3"/><circle cx="27" cy="31" r="5" fill="#d3b863"/><circle cx="50" cy="24" r="5" fill="#d3b863"/><circle cx="73" cy="31" r="5" fill="#d3b863"/><ellipse cx="51" cy="66" rx="12" ry="17" fill="#3578a4" stroke="${line}" stroke-width="3"/><circle cx="53" cy="41" r="10" fill="#3b76a2" stroke="${line}" stroke-width="2.6"/><circle cx="57" cy="38" r="2" fill="#f6e2b3"/><path d="M63 43l11-2-10 7Z" fill="#b78b47"/>${legs}`);
    return bird({body:'#897961',head:'#8f826b',wing:'#6c6457',tail:'#786d5d',chest:'#d9c7a7',marks:'<path d="M32 60l11 5m5-10 9 8m-18 10 11 0" stroke="#c5ae88" stroke-width="2.4"/>'});
  }
  if(spec.type==='mandarinduck'){
    return male?bird({body:'#be814a',head:'#4f866f',wing:'#a9543d',tail:'#d4a05a',chest:'#f0d6aa',crest:'<path d="M62 35l-7-10 16 8" fill="#c66d44"/>',marks:'<path d="M35 60q8-12 16-5" stroke="#e6c175" stroke-width="5"/>'}):bird({body:'#9d917d',head:'#92836f',wing:'#756c60',tail:'#7d7367',chest:'#d1c5b0',marks:'<path d="M37 58l6 5m6-8 6 7" stroke="#bcb09a" stroke-width="2.4"/>'});
  }
  if(spec.type==='pheasant'){
    return male?bird({body:color,head:shade(color,-18),wing:shade(color,-28),chest:'#c6a16e',tail:'#735845',crest:'<path d="M63 36l-7-13 14 8" fill="#b05d3b"/>',marks:'<circle cx="40" cy="60" r="3" fill="#dfbf8b"/><circle cx="50" cy="64" r="2.5" fill="#dfbf8b"/>'}):bird({body:'#a18e72',head:'#947e65',wing:'#776953',chest:'#c6b79c',tail:'#84705d',marks:'<path d="M34 59l9 5m5-9 8 8" stroke="#d3c3a7" stroke-width="2.4"/>'});
  }
  if(spec.type==='capercaillie'){
    if(male)return svgWrap(`<path d="M29 58Q13 39 18 26Q36 26 40 48L38 67Z" fill="#35393c" stroke="${line}" stroke-width="3"/><path d="M20 39l-7-9m14 9l-1-15m10 19l7-15" stroke="#46494a" stroke-width="4" stroke-linecap="round"/><ellipse cx="47" cy="61" rx="23" ry="18" fill="#353d42" stroke="${line}" stroke-width="3"/><ellipse cx="49" cy="65" rx="11" ry="9" fill="#4b5e4d"/><circle cx="66" cy="46" r="11" fill="#333b40" stroke="${line}" stroke-width="3"/><circle cx="69" cy="45" r="1.8" fill="#f4e9cf"/><circle cx="73" cy="44" r="3" fill="#cb3e37"/><path d="M74 49l10 2-10 5z" fill="#dfb65e" stroke="${line}" stroke-width="2"/><path d="M42 78l-3 8m12-8l4 8" stroke="#73583c" stroke-width="3" stroke-linecap="round"/>`);
    return bird({body:'#a98a6c',head:'#96745d',wing:'#775846',chest:'#d8c5a4',tail:'#9b785c',marks:'<path d="M33 57l11 6m-5-11l8 8m1 9l11-4" stroke="#dbbf9a" stroke-width="2"/>'});
  }
  if(spec.type==='shoveler'){
    const body=male?'#d7c09a':'#a78c6e';
    const head=male?'#36785d':'#9c7d5b';
    return svgWrap(`<ellipse cx="46" cy="61" rx="25" ry="16" fill="${body}" stroke="${line}" stroke-width="3"/><path d="M29 58q13-5 24 7q-10 10-25 0z" fill="${male?'#aa8659':'#81664d'}"/><circle cx="67" cy="46" r="11" fill="${head}" stroke="${line}" stroke-width="3"/><path d="M75 49q17-4 19 3q-2 8-20 5" fill="${male?'#c7a95c':'#bda985'}" stroke="${line}" stroke-width="2.8"/><circle cx="70" cy="44" r="1.7" fill="#1f2019"/><path d="M26 59l-8-9m22 25l-3 11m17-11l2 11" stroke="#79563a" stroke-width="3" stroke-linecap="round"/>${male?'':'<path d="M32 61l8 5m2-13l10 8" stroke="#d6bd99" stroke-width="2.4"/>'}`);
  }
  if(spec.type==='finch')return male?bird({body:'#b98278',head:'#69768d',chest:'#c66c65',wing:'#3d506a',tail:'#343e4b'}):bird({body:'#9f9480',head:'#a99e8a',chest:'#d3b9a1',wing:'#7c7e6e',tail:'#696c60'});
  if(spec.type==='blackbird')return male?bird({body:'#292b31',head:'#25272b',chest:'#34363c',wing:'#22252a',beak:'#ebbd4d'}):bird({body:'#6b5647',head:'#785f4e',chest:'#aa8e71',wing:'#554638',beak:'#b48e57',marks:'<path d="M52 64l-3 3m9-5l-3 4" stroke="#735944" stroke-width="2"/>'});
  if(spec.type==='bullfinch')return male?bird({body:'#65666b',head:'#25272b',chest:'#cd6a70',wing:'#313339',tail:'#22262a'}):bird({body:'#827b74',head:'#55544f',chest:'#a79a86',wing:'#686663',tail:'#4c4c49'});
  if(spec.type==='oriole')return male?bird({body:'#e0ba43',head:'#e4c14a',chest:'#e9cd59',wing:'#2c3234',tail:'#303536',beak:'#b17142'}):bird({body:'#96a36f',head:'#879967',chest:'#d2d5a6',wing:'#687b61',tail:'#5b7054',beak:'#a8794a'});
  return null;
}

const spriteCache=new Map();
function getSpriteMarkup(id, skin='normal', sex=null){
  const category=Object.keys(SPECIMEN_LEVELS).find(c=>SPECIMEN_LEVELS[c].skin===skin);
  if(category){
   const l=legendaryForSpecies(id);
   const base=category==='Legendario'&&l&&globalThis.ATLAS_LEGENDARY_ART?globalThis.ATLAS_LEGENDARY_ART.render(l.id):getSpriteMarkup(id,'normal');
   return decorateSpecimen(base,category);
  }
  const validSex=(skin==='normal' && SEXUAL_DIMORPHISM[id] && (sex==='male'||sex==='female'))?sex:null;
  const key=id+':'+skin+':'+(validSex||'base');
  if(spriteCache.has(key))return spriteCache.get(key);
  const sp=SPECIES[id];
  // Pigment variants always start from the unmodified production illustration.
  // Specialized engines receive normal exactly once; anatomy and markings are shared.
  const pigment=skin==='albino'||skin==='melanico';
  const baseSvg=pigment?getSpriteMarkup(id,'normal'):
    (validSex?sexSpriteMarkup(id,validSex):null)||spriteFor(sp.kind,sp.color,skin,id);
  const svg=skin==='melanico'?enforceMelanicColors(baseSvg):
    skin==='albino'?enforcePaleColors(baseSvg):baseSvg;
  spriteCache.set(key,svg);
  return svg;
}
function applySkin(base, skin){
  if(skin==='albino') return '#f2f3f4';
  if(skin==='melanico') return '#0c0f12';
  return base;
}
// Single lightweight paint pass: continuous values preserve shadows and patterns.
function enforcePaleColors(svg){return transformPigmentation(svg,'albino');}
function enforceMelanicColors(svg){return transformPigmentation(svg,'melanico');}
function transformPigmentation(svg,skin){
 if(/data-pigmentation=/.test(svg))return svg;
 const pale=skin==='albino';
 const morph=(svg.match(/data-mammal-morph="([^"]+)"/)||[])[1]||'';
 const hex=rgb=>'#'+rgb.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
 const rgb=value=>{
  let h=value.trim().toLowerCase();
  if(/^#[0-9a-f]{3}$/.test(h))h='#'+[...h.slice(1)].map(c=>c+c).join('');
  if(/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/.test(h))return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const hsl=h.match(/^hsla?\(\s*([-\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
  if(hsl){
   const hue=((Number(hsl[1])%360)+360)%360/30,saturation=Number(hsl[2])/100,light=Number(hsl[3])/100;
   const amplitude=saturation*Math.min(light,1-light);
   return [0,8,4].map(offset=>{const k=(offset+hue)%12;return 255*(light-amplitude*Math.max(-1,Math.min(k-3,9-k,1)));});
  }
  const named={white:'#ffffff',black:'#000000',red:'#ff0000',orange:'#ffa500',gray:'#808080',grey:'#808080'};
  if(named[h])return rgb(named[h]);
  const m=h.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
  if(m)return m.slice(1,4).map(Number);
  return null;
 };
 const paint=(value,stroke,eye,highlight,coatPattern=false)=>{
  if(/^(none|transparent|inherit|currentColor)$|^url\(/i.test(value.trim()))return value;
  if(eye)return pale?'#ad858d':'#c3ac71';
  if(highlight)return pale?'#faf4eb':'#8d969c';
  const channels=rgb(value);if(!channels)return value;
  const lum=(channels[0]*.2126+channels[1]*.7152+channels[2]*.0722)/255;
  // Keratin retains a separate warm value: horns and antlers cannot merge into fur.
  if(/^#a39881$/i.test(value))return pale?'#b0a38d':'#817967';
  if(pale&&/^#(?:bc9d87|b07861|d7b389|c85f6c)$/i.test(value))return '#d7b9b8';
  // Felid coat marks use pigment values, independently from the outer contour.
  // Rosettes remain ghost patterns; tiger stripes remain stripes on the same paths.
  if(coatPattern)return pale?hex([207+lum*39,202+lum*39,199+lum*39]):hex([19+lum*43,25+lum*43,33+lum*43]);
  const out=stroke?(pale?hex([131+lum*30,125+lum*30,127+lum*30]):hex([65+lum*22,75+lum*22,84+lum*22])):
   pale?hex([207+lum*39,202+lum*39,199+lum*39]):hex([23+lum*57,29+lum*57,37+lum*57]);
  // Preserve alpha in literal rgba paints; SVG opacity attributes are never touched.
  if(/^#[0-9a-f]{8}$/i.test(value))return out+value.slice(7);
  const alpha=value.match(/^(?:rgba|hsla)\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)$/i);
  return alpha?'rgba('+rgb(out).join(',')+','+alpha[1]+')':out;
 };
 const output=svg.replace(/<[a-z][^>]*>/gi,tag=>{
  // Normal eye inks are deliberately distinct from species pattern paints.
  const small=/^<circle\b/i.test(tag)&&/\br=["'](?:[0-2](?:\.\d+)?|3(?:\.0+)?)["']/.test(tag);
  const eye=small&&/\bfill=["']#(?:302e26|23352d|202d29|18272d|1d1a17|c85f6c|d8c46b|e2cb78)["']/i.test(tag);
  const highlight=small&&/\br=["']0?\.[0-9]+["']/.test(tag);
  const coatPattern=(/leopard|snowcat/.test(morph)&&/stroke-width="1\.[67]"/.test(tag))||(morph==='tiger'&&/stroke="#39382f"/.test(tag)&&/stroke-width="3\.2"/.test(tag));
  return tag.replace(/\b(fill|stroke|stop-color|color)\s*=\s*(["'])(.*?)\2/gi,
   (_,attr,quote,value)=>attr+'='+quote+paint(value,attr.toLowerCase()==='stroke',eye&&attr==='fill',highlight&&attr==='fill',coatPattern&&attr==='stroke')+quote)
   .replace(/\bstyle\s*=\s*(["'])(.*?)\1/gi,(_,quote,style)=>'style='+quote+
    style.replace(/(^|;)\s*(fill|stroke|stop-color|color)\s*:\s*([^;]+)/gi,
     (_,sep,attr,value)=>sep+attr+':'+paint(value,attr.toLowerCase()==='stroke',false,false))+quote);
 });
 return output.replace(/<svg\b[^>]*>/,tag=>tag.slice(0,-1)+' data-pigmentation="'+skin+'">');
}
function shade(hex, amt){
  const h=hex.replace('#','');
  const r=parseInt(h.substring(0,2),16), g=parseInt(h.substring(2,4),16), b=parseInt(h.substring(4,6),16);
  const clamp=x=>Math.max(0,Math.min(255,x));
  return '#'+[clamp(r+amt),clamp(g+amt),clamp(b+amt)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function svgWrap(content, glow=''){ return `<svg viewBox="0 0 100 100" aria-hidden="true">${glow}${content}</svg>`; }
function alphaGlow(skin){return '';} // Category presentation is composed outside the zoological SVG.
function eyeColor(skin){ if(skin==='albino') return '#c85f6c'; if(skin==='melanico') return '#d8c46b'; return '#1d1a17'; }
function legSet(x1,x2,y=71){ return `<line x1="${x1}" y1="${y}" x2="${x1-1}" y2="86" stroke="#3a3026" stroke-width="3.3" stroke-linecap="round"/><line x1="${x2}" y1="${y}" x2="${x2+1}" y2="86" stroke="#3a3026" stroke-width="3.3" stroke-linecap="round"/>`; }
function premiumSpeciesSprite(name,kind,body,skin,id){
 const n=name.toLocaleLowerCase('es');
 const ink='#342f29';
 const dark=shade(body,-24);
 const light=shade(body,19);
 const eye=eyeColor(skin);
 const isMel=skin==='melanico';
 const belly=isMel?'#626a73':'#e7dcc5';
 const outline=(shape)=>svgWrap(shape,alphaGlow(skin));
 const legs=(a=43,b=52)=>`<path d="M${a} 73l-2 12 M${b} 73l2 12" fill="none" stroke="#765b3b" stroke-width="3" stroke-linecap="round"/>`;
 const featherTail=`<path d="M35 63L16 77L29 55Z" fill="${dark}" stroke="${ink}" stroke-width="2.5"/>`;
 const eyeDot=(x=67,y=46)=>`<circle cx="${x}" cy="${y}" r="1.9" fill="${eye}"/>`;
 const bird=(opts={})=>{
   const wing=opts.wing||dark;
   const chest=opts.chest||belly;
   const cap=opts.cap||body;
   const beak=opts.beak||'#c38b42';
   const crest=opts.crest||'';
   const dots=opts.dots||'';
   return outline(`${featherTail}<ellipse cx="47" cy="60" rx="19" ry="14" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 55Q45 50 52 61Q45 69 34 66Z" fill="${wing}" stroke="${ink}" stroke-width="2"/><ellipse cx="53" cy="63" rx="9" ry="8" fill="${chest}"/><circle cx="65" cy="47" r="10" fill="${cap}" stroke="${ink}" stroke-width="3"/>${crest}<path d="M73 49l12-3-10 8z" fill="${beak}" stroke="${ink}" stroke-width="2"/>${eyeDot()}${dots}${legs()}`);
 };

 if(/cálao rinoceronte|calao rinoceronte/i.test(n)) return outline(`<path d="M25 63L12 78L26 58Z" fill="#18191b" stroke="${ink}" stroke-width="2.6"/><path d="M31 59Q43 50 54 60Q45 69 31 66Z" fill="#0f1112" stroke="${ink}" stroke-width="2"/><ellipse cx="48" cy="61" rx="20" ry="14" fill="#121416" stroke="${ink}" stroke-width="3"/><ellipse cx="54" cy="64" rx="8" ry="7" fill="#eef0e8"/><circle cx="66" cy="46" r="10" fill="#111315" stroke="${ink}" stroke-width="3"/><path d="M61 37Q72 22 80 34Q73 43 62 41Z" fill="#e0d2a1" stroke="${ink}" stroke-width="2.4"/><path d="M73 45Q98 39 95 55Q84 64 72 52Z" fill="#e2b553" stroke="${ink}" stroke-width="2.6"/><path d="M74 45Q84 32 90 38Q87 43 79 45Z" fill="#c94f35" stroke="${ink}" stroke-width="2.2"/><circle cx="68" cy="44" r="1.9" fill="${eye}"/><path d="M43 73l-3 13m12-13l4 13" stroke="#755b38" stroke-width="3" stroke-linecap="round"/>`);
 if(/desmán ibérico|desman iberico/i.test(n)) return outline(`<path d="M19 66Q28 52 45 53Q62 55 69 62Q72 74 57 78Q38 83 24 76Q18 72 19 66Z" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="64" cy="59" rx="12" ry="9" fill="${light}" stroke="${ink}" stroke-width="3"/><path d="M74 59Q89 57 94 63Q86 68 73 66Z" fill="#d7b389" stroke="${ink}" stroke-width="2.3"/><circle cx="65" cy="55" r="1.7" fill="${eye}"/><path d="M23 67Q9 63 8 48" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/><path d="M33 76l-6 10m15-10l-3 10m14-10l3 10" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M72 61l10 4m-11 1 9 7" stroke="#a98256" stroke-width="1.8" stroke-linecap="round"/>`);
 if(/frailecillo atlántico|frailecillo atlantico/i.test(n)) return outline(`<path d="M33 61L14 46 22 75 37 69Z" fill="#232528" stroke="${ink}" stroke-width="2.6"/><ellipse cx="48" cy="61" rx="18" ry="15" fill="#25282b" stroke="${ink}" stroke-width="3"/><path d="M34 56q13-8 22 7q-14 13-24 2z" fill="#111214" stroke="${ink}" stroke-width="2.1"/><ellipse cx="54" cy="65" rx="8" ry="8" fill="#f5f2ea"/><circle cx="66" cy="47" r="10" fill="#111214" stroke="${ink}" stroke-width="3"/><ellipse cx="67" cy="48" rx="6.5" ry="8" fill="#f7f4ef"/><path d="M74 50Q89 44 91 50Q83 58 73 59Z" fill="#e08f32" stroke="${ink}" stroke-width="2.3"/><path d="M74 50Q82 48 86 53" fill="none" stroke="#ecd772" stroke-width="2.1"/><path d="M61 40l3-7 4 7m3 0l3-5 2 5" stroke="#e5ce71" stroke-width="1.9" stroke-linecap="round"/><circle cx="69" cy="45" r="1.6" fill="${eye}"/><path d="M43 75l-4 12m13-12l4 12" stroke="#8a6438" stroke-width="3" stroke-linecap="round"/>`);
 if(/erizo/i.test(n)) return outline(`<path d="M20 68Q26 48 44 47Q63 46 73 58Q81 70 70 78Q58 85 37 82Q23 79 20 68Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M23 60l4-12 6 12 5-14 7 14 7-14 6 12 5-10 3 12" fill="none" stroke="${dark}" stroke-width="4.2" stroke-linecap="round"/><ellipse cx="66" cy="62" rx="9" ry="8" fill="${belly}" stroke="${ink}" stroke-width="2.5"/><circle cx="68" cy="58" r="1.6" fill="${eye}"/><path d="M72 63q10 2 12 8q-9 1-12-1" fill="${belly}" stroke="${ink}" stroke-width="2"/>`);

 // Rock-solid distinctions for Europe’s small songbirds and corvids.
 if(/herrerillo/i.test(n)) return bird({wing:'#37639b',cap:'#2c6cae',chest:'#efd05e',crest:'<path d="M60 43Q66 39 73 43" fill="none" stroke="#e6eff2" stroke-width="3"/>'});
 if(/carbonero/i.test(n)) return bird({wing:'#415d4c',cap:'#262b2f',chest:'#e5c64e',dots:'<path d="M52 61v10" stroke="#303237" stroke-width="3"/>'});
 if(/pinzón|pinzon/i.test(n)) return bird({wing:'#424f6b',cap:'#667388',chest:'#c97564',dots:'<path d="M35 60l12 4" stroke="#e8ddc6" stroke-width="2.5"/>'});
 if(/alondra/i.test(n)) return bird({wing:'#7f684d',chest:'#d4bb8c',cap:'#9c815b',crest:`<path d="M62 36l-4-8 9 6" fill="${body}" stroke="${ink}" stroke-width="2"/>`,dots:'<path d="M52 63l-4-3m8 9l-3-3" stroke="#7f654b" stroke-width="2"/>'});
 if(/mirlo/i.test(n)) return bird({wing:'#222930',cap:'#272b2f',chest:'#323438',beak:'#e7b04a'});
 if(/zorzal/i.test(n)) return bird({wing:'#826a55',cap:'#856f57',chest:'#dfc8a8',dots:'<path d="M50 63l-2 4m8-4l-2 4m1 3l-1 2" stroke="#72513a" stroke-width="2.4"/>'});
 if(/camachuelo/i.test(n)) return bird({wing:'#343b40',cap:'#252a2c',chest:'#c77779',beak:'#26282a'});
 if(/oropéndola|oropendola/i.test(n)) return bird({wing:'#2b343a',cap:'#d8ba43',chest:'#ebcf58',beak:'#a35e40'});
 if(/ampelis/i.test(n)) return bird({wing:'#7f665b',cap:'#a97c69',chest:'#ba9680',crest:`<path d="M60 40l-2-13 11 9" fill="${body}" stroke="${ink}" stroke-width="2"/>`,dots:'<path d="M30 57l11 7" stroke="#e6c75a" stroke-width="3"/>'});
 if(/arrendajo/i.test(n)) return bird({wing:'#337fab',cap:'#ba8061',chest:'#cfb29a',dots:'<path d="M33 58l10 3m-8 4l9 1" stroke="#e5eced" stroke-width="2.3"/>'});
 if(/rabilargo/i.test(n)) return bird({wing:'#4d8baa',cap:'#252c37',chest:'#e1d7ca',beak:'#2e3030',dots:'<path d="M30 64L10 85" stroke="#4b7e9e" stroke-width="4"/>'});
 if(/pico picapinos/i.test(n)) return bird({wing:'#24282e',cap:'#a54640',chest:'#e9e4d9',beak:'#555b5c',dots:'<path d="M33 59l12 3m-10 4l10-1" stroke="#e9e5dc" stroke-width="3"/>'});
 if(/pato cuchara/i.test(n)) return outline(`<path d="M20 67q0-18 25-21q20-1 23 16q-9 16-29 15q-19-1-19-10z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M25 53l-8-10 15 5" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="68" cy="49" r="10" fill="#4b805c" stroke="${ink}" stroke-width="3"/><path d="M76 49q14-3 16 3q-2 7-18 4" fill="#b59b69" stroke="${ink}" stroke-width="2.8"/>${eyeDot(70,46)}<path d="M37 56q10 3 14 13" stroke="#ded5be" stroke-width="3" fill="none"/>${legs(42,53)}`);
 if(/cormorán|cormoran/i.test(n)) return outline(`<ellipse cx="43" cy="65" rx="21" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M54 61Q61 46 63 28" fill="none" stroke="${body}" stroke-width="10" stroke-linecap="round"/><path d="M54 61Q61 46 63 28" fill="none" stroke="${ink}" stroke-width="2.5"/><circle cx="64" cy="26" r="7" fill="${body}" stroke="${ink}" stroke-width="2.5"/><path d="M70 27l18 3-18 3" fill="#ad9a74" stroke="${ink}" stroke-width="2"/>${eyeDot(65,24)}<path d="M27 63L13 52l11 20" fill="${dark}" stroke="${ink}" stroke-width="2"/>${legs(40,48)}`);
 if(/focha/i.test(n)) return outline(`<ellipse cx="46" cy="64" rx="23" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="65" cy="49" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M69 40l5-10 5 4-4 15" fill="#e6e5dc" stroke="${ink}" stroke-width="2"/><path d="M75 48l14-1-14 7" fill="#e9e7df" stroke="${ink}" stroke-width="2"/>${eyeDot(66,46)}${legs()}`);
 if(/somormujo|zampullín|zampullin/i.test(n)) return outline(`<ellipse cx="46" cy="65" rx="22" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M55 55Q59 40 63 32" fill="none" stroke="${body}" stroke-width="9"/><circle cx="64" cy="31" r="9" fill="${body}" stroke="${ink}" stroke-width="2.5"/><path d="M55 33l-5-11 12 7m7 0l8-10" fill="none" stroke="#ac8660" stroke-width="4" stroke-linecap="round"/><path d="M72 32l16-3-15 8" fill="#b68e58" stroke="${ink}" stroke-width="2"/>${eyeDot(65,29)}${legs(42,53)}`);
 if(/perdiz roja|perdiz griega/i.test(n)) return outline(`<ellipse cx="46" cy="65" rx="24" ry="17" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="45" cy="70" rx="11" ry="8" fill="${belly}"/><path d="M26 61l-12-10 7 20" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="65" cy="51" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M56 47q12-10 18 3" fill="none" stroke="#7e3b39" stroke-width="3.5"/><path d="M72 54l15-1-13 5" fill="#b17a39" stroke="${ink}" stroke-width="2"/>${eyeDot(68,49)}${legs()}`);
 if(/lechuza/i.test(n)) return outline(`<ellipse cx="49" cy="58" rx="23" ry="28" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M49 44q-14-19-20-2q-5 16 20 29q24-13 21-29q-5-17-21 2z" fill="#e8deca" stroke="${ink}" stroke-width="2.5"/><circle cx="41" cy="49" r="3.5" fill="#3a302c"/><circle cx="57" cy="49" r="3.5" fill="#3a302c"/><polygon points="49,54 45,61 54,61" fill="#c99b50"/>${legs(43,54)}`);
 if(/mochuelo/i.test(n)) return outline(`<ellipse cx="49" cy="60" rx="23" ry="22" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="41" cy="54" r="7" fill="#dfcbb0"/><circle cx="57" cy="54" r="7" fill="#dfcbb0"/><circle cx="41" cy="54" r="2.6" fill="${eye}"/><circle cx="57" cy="54" r="2.6" fill="${eye}"/><polygon points="49,59 45,64 53,64" fill="#c89b52"/>${legs(44,55)}`);
 if(/gavilán|gavilan|halcón|halcon|cernícalo|cernicalo|busardo/i.test(n)) return outline(`<ellipse cx="50" cy="63" rx="20" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M28 58Q19 44 16 33Q33 41 41 49" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M60 52Q76 39 88 41Q81 56 64 62" fill="${light}" stroke="${ink}" stroke-width="3"/><circle cx="61" cy="48" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M66 55l13-8-14 3" fill="#d4a14d" stroke="${ink}" stroke-width="2"/><circle cx="63" cy="46" r="2.3" fill="${eye}"/><path d="M29 57l11 7m-9 0l9 6" stroke="#d0b48e" stroke-width="2.5" fill="none"/>${legs(45,53)}`);
 // Field rodents: different tail shape, ear size, dorsal tone and belly.
 if(/topillo/i.test(n)){
   const snowy=/nival/i.test(n);
   const russet=/rojo/i.test(n);
   const head=snowy?'#c9c6c3':russet?'#a45a3e':body;
   const chest=snowy?'#eeeae3':russet?'#dfb694':'#d8c7a6';
   const back=russet?'#874b38':snowy?'#aaa9aa':dark;
   return outline(`<path d="M28 67q-11 3-13 10" stroke="${back}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="49" cy="65" rx="21" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 57q13-10 27 1" fill="none" stroke="${back}" stroke-width="4"/><ellipse cx="49" cy="70" rx="11" ry="6" fill="${chest}"/><circle cx="66" cy="57" r="10.5" fill="${head}" stroke="${ink}" stroke-width="3"/><circle cx="60" cy="49" r="4" fill="${head}" stroke="${ink}" stroke-width="2.5"/><circle cx="69" cy="53" r="1.7" fill="${eye}"/><path d="M73 60l8 2" stroke="#5d4a3d" stroke-width="2"/>${legs(44,55)}`);
 }
 if(/lirón|liron/i.test(n)) return outline(`<path d="M27 59q-17-13-12-24q16-6 24 20" fill="${dark}" stroke="${ink}" stroke-width="4"/><ellipse cx="46" cy="65" rx="22" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="50" cy="69" rx="10" ry="7" fill="${belly}"/><circle cx="65" cy="54" r="12" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="67" cy="52" rx="7" ry="4" fill="${dark}"/><circle cx="70" cy="52" r="2" fill="${eye}"/><circle cx="60" cy="46" r="4" fill="${light}" stroke="${ink}" stroke-width="2"/>${legs()}`);
 if(/musaraña|musarana|desmán|desman/i.test(n)) return outline(`<ellipse cx="45" cy="66" rx="21" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="64" cy="58" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M70 59q12 3 18 9q-11 3-18-1" fill="${light}" stroke="${ink}" stroke-width="2"/><circle cx="64" cy="54" r="1.6" fill="${eye}"/><path d="M25 62q-12-8-12-20" fill="none" stroke="${dark}" stroke-width="3"/>${legs()}`);
 if(/lemming/i.test(n)) return outline(`<ellipse cx="48" cy="65" rx="24" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M37 50q12-8 23 0" stroke="#8b6c4f" stroke-width="4" fill="none"/><ellipse cx="56" cy="72" rx="8" ry="5" fill="${belly}"/><circle cx="66" cy="56" r="10" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="69" cy="53" r="1.7" fill="${eye}"/>${legs()}`);
 if(/puercoespín|puercoespin/i.test(n)) return outline(`<path d="M18 70L15 52L21 56L22 42L29 49L35 32L42 46L51 33L57 48L65 41L74 57Q83 68 71 76Q56 84 34 78Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M23 59l15-17m-9 25l14-20m-5 25l16-27m-7 29l16-24" stroke="#eee4cc" stroke-width="3" fill="none"/><circle cx="70" cy="63" r="8" fill="${body}" stroke="${ink}" stroke-width="2.5"/><circle cx="73" cy="60" r="1.7" fill="${eye}"/>${legs()}`);
 if(/marta|garduña|garduna|armiño|armino|comadreja|turón|turon|visón|vison/i.test(n)){
   const alb=/armiño|armino/.test(n), masked=/turón|turon|visón|vison/.test(n);
   return outline(`<path d="M13 69q7-8 19-6q14-12 32-8q17 2 20 11q-10 10-23 6q-19 6-38 2z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M28 67q-7 7-18 13" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><ellipse cx="48" cy="70" rx="15" ry="5" fill="${alb?'#ece9df':belly}"/><circle cx="69" cy="56" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/>${masked?'<path d="M61 57q8-8 16-1" fill="none" stroke="#393532" stroke-width="4"/>':''}<circle cx="73" cy="52" r="1.8" fill="${eye}"/><path d="M40 72l-3 10m19-10l3 10" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`);
 }
 if(/rana|sapo/i.test(n)) return outline(`<ellipse cx="48" cy="63" rx="22" ry="16" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="38" cy="50" r="6" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="62" cy="50" r="6" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="38" cy="50" r="2" fill="${eye}"/><circle cx="62" cy="50" r="2" fill="${eye}"/><path d="M32 73L19 83m29-2l-6 8m11-8l6 8m13-16l12 10" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`);
 if(/culebra|víbora|vibora|lución|lucion/i.test(n)){
   const collar=/collar/i.test(n); const viper=/viperina|vibora|víbora/i.test(n);
   const markings=collar ? '<path d="M72 47l-2 10" stroke="#dfc786" stroke-width="4" fill="none"/>'
      : viper ? '<path d="M24 64l8-5 8 6 8-7 8 6 7-8" stroke="#604f36" stroke-width="4" fill="none"/>'
      : '<path d="M24 65q12-5 20 0t18-2" stroke="#aa906a" stroke-width="2.5" fill="none"/>';
   return outline(`<path d="M12 73Q20 54 34 58Q45 62 52 55Q65 43 75 51Q86 61 76 73Q70 79 61 76Q55 73 51 75" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M12 73Q20 54 34 58Q45 62 52 55Q65 43 75 51Q86 61 76 73Q70 79 61 76Q55 73 51 75" fill="none" stroke="${body}" stroke-width="9" stroke-linecap="round"/>${markings}<ellipse cx="77" cy="51" rx="8" ry="6" fill="${body}" stroke="${ink}" stroke-width="2.5"/><circle cx="80" cy="49" r="1.9" fill="${eye}"/><path d="M84 53l8 2" stroke="#ae5f5e" stroke-width="2" stroke-linecap="round"/>`);
 }
 if(/trucha|barbo|tenca|perca/i.test(n)){
   const stripy=/perca/i.test(n), dotted=/trucha/i.test(n), whiskered=/barbo/i.test(n);
   const decor=stripy?'<path d="M36 49l-2 16m9-17l-2 18m9-18l-2 17" stroke="#655c3a" stroke-width="2.8" fill="none"/>'
      : dotted?'<circle cx="35" cy="52" r="2" fill="#8d423b"/><circle cx="45" cy="58" r="2" fill="#8d423b"/><circle cx="54" cy="50" r="2" fill="#8d423b"/>'
      :'<path d="M34 53q10-4 20 0" stroke="#d0b47d" stroke-width="2.5" fill="none"/>';
   return outline(`<path d="M24 56l-16-14v28z" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M24 56Q32 42 53 43Q71 43 78 56Q67 72 50 70Q31 69 24 56Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M41 45l8-10 5 10" fill="${dark}" stroke="${ink}" stroke-width="2.3"/>${decor}<circle cx="68" cy="54" r="2" fill="${eye}"/>${whiskered?'<path d="M76 61l9 5m-8-5l8 0" stroke="#7c6348" stroke-width="2" fill="none"/>':''}`);
 }
 if(/águila|aguila|buitre|quebrantahuesos/i.test(n)){
   const vulture=/buitre|quebrantahuesos/.test(n);
   return outline(`<path d="M26 58Q10 42 6 25Q31 34 44 47" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M61 50Q80 30 96 24Q93 49 66 62" fill="${light}" stroke="${ink}" stroke-width="3"/><ellipse cx="48" cy="62" rx="21" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 57q14 3 23 12" stroke="${dark}" stroke-width="4" fill="none"/><circle cx="61" cy="43" r="12" fill="${vulture?'#d5c4a3':body}" stroke="${ink}" stroke-width="3"/><path d="M70 46l17-3-14 12-6-4" fill="#c99a47" stroke="${ink}" stroke-width="2"/><circle cx="64" cy="40" r="2.4" fill="${eye}"/><path d="M39 76l-6 9m15-9l3 9" fill="none" stroke="#715632" stroke-width="3" stroke-linecap="round"/>`);
 }
 if(/tortuga/i.test(n)) return outline(`<path d="M28 62q2-23 23-23q20 0 23 23l-8 17H35z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M35 59l15-11 16 11-8 14H41z" fill="${dark}" opacity=".48"/><path d="M42 72l-9 9m23-8l8 11" stroke="${ink}" stroke-width="3"/><circle cx="76" cy="58" r="9" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="79" cy="55" r="1.8" fill="${eye}"/>`);
 return null;
}


// v2.0: siluetas por especie para la primera fauna asiática.
// SVG 100x100: compatibles con Cuaderno, Bestiario, Museo y variantes raras.
// Sprites asiáticos de v2.1: una silueta propia para cada especie incorporada.
// Todos comparten viewBox 100x100, dimensiones y soporte de variantes raras.
function asianExpansionSprite(id,skin){
 const sp=SPECIES[id];
 if(!sp||!id.startsWith('asia_esp_'))return null;
 const c=applySkin(sp.color,skin),d=shade(c,-22),l=shade(c,17);
 const mel=skin==='melanico',ink='#382f27',eye=eyeColor(skin),g=alphaGlow(skin);
 const belly=mel?'#444a52':'#f1e5d3';
 const wrap=shapes=>svgWrap(shapes,g);
 const legs=(a=42,b=54,y=73)=>`<path d="M${a} ${y}l-2 12m${b-a+2} -12l2 12" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
 const wing=(shape)=>`<path d="${shape}" fill="${d}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
 const head=(x=66,y=48,r=10)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="${x+3}" cy="${y-2}" r="1.8" fill="${eye}"/>`;
 const bill=(x=72,y=51)=>`<polygon points="${x},${y} ${x+14},${y-3} ${x+1},${y+6}" fill="#cd9948" stroke="${ink}" stroke-width="2"/>`;
 switch(id){
  case 'asia_esp_0287': // grulla siberiana, cuello y patas altos
   return wrap(`<ellipse cx="47" cy="59" rx="19" ry="13" fill="${mel?c:'#eceae4'}" stroke="${ink}" stroke-width="3"/>${wing('M33 54Q20 44 16 35Q29 37 44 49')}<path d="M57 54q-4-20 7-31" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>${head(66,25,6)}<path d="M64 21l10-2" stroke="#d96a54" stroke-width="4"/><polygon points="72,25 91,22 73,30" fill="#cc7954" stroke="${ink}" stroke-width="2"/><path d="M43 71l-4 18m13-18l3 18" stroke="#c68a5b" stroke-width="3" stroke-linecap="round"/>`);
  case 'asia_esp_0880': // gallo lira, cola en lira y pecho negro
   return wrap(`<path d="M23 60q-13-12-13-28m13 28Q37 42 36 32" fill="none" stroke="${d}" stroke-width="5" stroke-linecap="round"/><ellipse cx="47" cy="62" rx="21" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(65,47,9)}${wing('M33 60q4-11 20-9q-3 17-20 14')}${bill(72,50)}<circle cx="65" cy="43" r="3" fill="#c63d4c"/>${legs()}`);
  case 'asia_esp_0861': // arrendajo siberiano, cola larga
   return wrap(`<path d="M33 62l-17 15 3-19" fill="${d}" stroke="${ink}" stroke-width="3"/><ellipse cx="48" cy="60" rx="18" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M37 58q6-10 20-3l-11 15-9-6')}${head(63,47,9)}<path d="M57 40q8-5 14-1" stroke="#443729" stroke-width="3"/>${bill(69,50)}${legs(44,52,73)}`);
  case 'asia_esp_0886': // azor común, alas anchas pecho barrado
   return wrap(`<ellipse cx="47" cy="60" rx="18" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M31 58Q18 43 15 30Q32 37 43 48')}${wing('M57 52Q75 36 86 32Q84 49 66 62')}${head(59,43,10)}<path d="M43 58h15m-14 7h15m-13 6h10" stroke="${mel?'#444b53':'#cbb9a0'}" stroke-width="2.3"/>${bill(66,46)}${legs(43,54,76)}`);
  case 'asia_esp_0326': // marta cibelina, cuerpo largo y cola larga
   return wrap(`<path d="M27 67q-14-5-21 11" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/><ellipse cx="46" cy="63" rx="27" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(72,53,9)}<ellipse cx="68" cy="60" rx="8" ry="4" fill="${belly}"/><circle cx="67" cy="45" r="3" fill="${d}" stroke="${ink}" stroke-width="2"/>${legs(39,55,71)}`);
  case 'asia_esp_0843': // ardilla voladora, membranas extendidas
   return wrap(`<path d="M17 51q16 3 29-13q11 18 37 9l-12 19q-14 14-26 12q-20 2-28-27z" fill="${l}" stroke="${ink}" stroke-width="3"/><ellipse cx="49" cy="58" rx="14" ry="20" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(58,40,10)}<circle cx="51" cy="32" r="4" fill="${d}"/><path d="M39 74q-17 7-24-4" fill="none" stroke="${d}" stroke-width="4"/>`);
  case 'asia_esp_0914': // esturión: hocico puntiagudo, escudos dorsales
   return wrap(`<path d="M17 57l-14-16 2 31 12-13q22-19 48-14l26 12-25 8q-25 14-49-8z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M33 44l4-6 4 5 5-7 4 7 5-6 4 8" fill="${d}" stroke="${ink}" stroke-width="2"/><path d="M68 60l-9 12m-11-5l-5 10" stroke="${ink}" stroke-width="3"/><circle cx="72" cy="54" r="2" fill="${eye}"/><path d="M74 65l-4 7m10-13l1 8" stroke="#d8b99b" stroke-width="2"/>`);
  case 'asia_esp_0899': // salamandra siberiana, patas cortas y manchas
   return wrap(`<path d="M15 65Q29 53 45 58Q58 54 69 53Q83 52 84 65Q81 78 62 75Q43 82 27 78Q13 76 15 65Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M23 59l11 8m9-12l10 8m10-9l8 9" stroke="${mel?'#48515b':'#b9a27a'}" stroke-width="3" stroke-linecap="round"/>${head(77,60,7)}<path d="M18 65Q8 61 6 53m25 17l-6 11m25-10l-3 11m16-18l-2-13" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`);
  case 'asia_esp_0020': // grulla damisela, cuello largo con penachos
   return wrap(`<ellipse cx="46" cy="59" rx="18" ry="13" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M33 55Q21 47 18 37Q32 42 43 51')}<path d="M58 55q-2-21 7-34" stroke="${ink}" stroke-width="4" fill="none"/>${head(66,24,7)}<path d="M57 22q-8 3-9 12m15-14q5-12 12-11" stroke="${belly}" stroke-width="3" fill="none"/>${bill(72,27)}<path d="M42 71v18m10-18v18" stroke="#9b735d" stroke-width="3"/>`);
  case 'asia_esp_0030': // águila esteparia, envergadura amplia
   return wrap(`<ellipse cx="48" cy="60" rx="19" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M30 60Q12 47 10 28Q29 38 43 50')}${wing('M56 49Q72 34 88 29Q86 49 65 61')}${head(60,44,10)}${bill(67,48)}<path d="M45 66h12" stroke="${belly}" stroke-width="3"/>${legs(44,52,76)}`);
  case 'asia_esp_0887': // halcón sacre, alas largas puntiagudas
   return wrap(`<ellipse cx="48" cy="60" rx="17" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M31 58L12 26Q37 36 42 50')}${wing('M56 51L89 28Q80 51 65 60')}${head(61,44,9)}<path d="M57 49l4 7" stroke="${d}" stroke-width="3"/>${bill(68,47)}${legs(44,52,75)}`);
  case 'asia_esp_0533': // zorro corsac, orejas muy grandes
   return wrap(`<ellipse cx="45" cy="62" rx="22" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M22 61q-17 0-17 17q10 3 21-6" fill="${l}" stroke="${ink}" stroke-width="3"/>${head(66,47,11)}<polygon points="58,40 59,20 70,40" fill="${d}" stroke="${ink}" stroke-width="2.5"/><polygon points="67,39 84,23 78,44" fill="${d}" stroke="${ink}" stroke-width="2.5"/><path d="M67 51l13 7-14-1" fill="${belly}"/>${legs(39,53,72)}`);
  case 'asia_esp_0387': // manul: gato redondo, cara achatada, orejas bajas
   return wrap(`<ellipse cx="43" cy="66" rx="25" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="64" cy="47" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="51" cy="34" r="6" fill="${d}"/><circle cx="77" cy="33" r="6" fill="${d}"/><circle cx="58" cy="46" r="2.5" fill="${eye}"/><circle cx="70" cy="46" r="2.5" fill="${eye}"/><path d="M57 54q7 6 14 0m-7-2l1 4" stroke="${ink}" stroke-width="2" fill="none"/><path d="M37 81v7m16-6v7" stroke="${ink}" stroke-width="4"/><path d="M20 68q-10 1-13 11" stroke="${d}" stroke-width="6" fill="none"/>`);
  case 'asia_esp_0323': // marmota siberiana, bípeda compacta
   return wrap(`<ellipse cx="49" cy="66" rx="22" ry="19" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(61,44,13)}<ellipse cx="62" cy="55" rx="7" ry="6" fill="${belly}"/><path d="M35 77v9m17-7v8" stroke="${ink}" stroke-width="4"/><path d="M29 72q-12 3-15 12" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/>`);
  case 'asia_esp_0184': // caballo de Przewalski, melena corta erguida
   return wrap(`<ellipse cx="43" cy="60" rx="25" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M58 59L59 35l12-1 6 14-8 9" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M58 37l-6-5 8-4-4-6 9 3 2 8" fill="${d}" stroke="${ink}" stroke-width="2"/>${head(70,44,8)}<path d="M74 48l11 4-11 6" fill="${belly}"/><path d="M18 55q-10 0-11 11" fill="none" stroke="${d}" stroke-width="5"/>${legs(33,53,73)}`);
  case 'asia_esp_0441': // gacela mongola, cuerpo esbelto, cuernos curvos
   return wrap(`<ellipse cx="44" cy="63" rx="22" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M60 63L60 41l11-3 6 11" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(71,42,8)}<path d="M66 37q-10-13 2-25m7 27q11-13 3-25" stroke="#80603f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M43 69q7 4 15-1" stroke="${belly}" stroke-width="3" fill="none"/>${legs(33,52,72)}`);
  case 'asia_esp_0898': // sapo mongol, ojos prominentes
   return wrap(`<ellipse cx="50" cy="64" rx="26" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="39" cy="49" r="7" fill="${c}" stroke="${ink}" stroke-width="2.5"/><circle cx="61" cy="49" r="7" fill="${c}" stroke="${ink}" stroke-width="2.5"/><circle cx="39" cy="48" r="2" fill="${eye}"/><circle cx="61" cy="48" r="2" fill="${eye}"/><path d="M33 72l-11 10m20-4l-5 10m21-10l7 10m5-16l11 10" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/><circle cx="47" cy="60" r="2.5" fill="${l}"/><circle cx="58" cy="67" r="2.5" fill="${d}"/>`);
 }
 return null;
}

function asianSpeciesSprite(id,skin){
  const newSvg=asianExpansionSprite(id,skin); if(newSvg)return newSvg;
  const sp=SPECIES[id];
  if(!sp)return null;
  const c=applySkin(sp.color,skin), dark=shade(c,-22), light=shade(c,20);
  const edge='#352b23', eye=eyeColor(skin), glow=alphaGlow(skin);
  const tail=`<path d="M26 61q-13 3-14 15" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if(id==='asia_esp_0401'){
    const rosettes=skin==='melanico'?'#333943':'#8a6039';
    return svgWrap(`<ellipse cx="46" cy="61" rx="25" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="67" cy="48" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="59" cy="39" r="4" fill="${dark}" stroke="${edge}" stroke-width="2"/><circle cx="74" cy="39" r="4" fill="${dark}" stroke="${edge}" stroke-width="2"/><ellipse cx="70" cy="53" rx="6" ry="4.5" fill="${skin==='melanico'?'#3e4650':'#f0d8b5'}"/><circle cx="71" cy="46" r="1.8" fill="${eye}"/><path d="M21 59Q10 65 12 76" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><path d="M16 71l5 5" stroke="${edge}" stroke-width="2"/><circle cx="31" cy="56" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="43" cy="66" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="52" cy="53" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="60" cy="63" r="2.6" fill="none" stroke="${rosettes}" stroke-width="2"/><path d="M37 71l-1 13m18-13l2 13" stroke="${edge}" stroke-width="3.5" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0088'){
    return svgWrap(`<ellipse cx="45" cy="63" rx="22" ry="14" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="66" cy="47" r="12" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M59 39l-3-17 8 9m9 8l8-17-2 18" fill="${dark}" stroke="${edge}" stroke-width="2.5"/><path d="M56 22l-3-8m28 8l4-8" stroke="#24201d" stroke-width="2.5" stroke-linecap="round"/><path d="M68 52q5 3 8 5q-5 3-11 0" fill="${skin==='melanico'?'#454d57':'#efcfaa'}"/><circle cx="70" cy="44" r="1.8" fill="${eye}"/>${tail}<path d="M36 72l-1 13m18-13l2 13" stroke="${edge}" stroke-width="3.4" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0081' || id==='asia_esp_0080'){
    const tur=id==='asia_esp_0081';
    const horns=tur?'<path d="M60 35Q45 24 55 11m17 25Q86 24 76 11" fill="none" stroke="#68543c" stroke-width="4.4" stroke-linecap="round"/>':'<path d="M59 34Q52 19 58 11m12 24Q80 19 74 12" fill="none" stroke="#594832" stroke-width="3.6" stroke-linecap="round"/>';
    return svgWrap(`<ellipse cx="43" cy="61" rx="23" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><ellipse cx="40" cy="57" rx="10" ry="5" fill="${light}" opacity=".45"/><circle cx="65" cy="47" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/>${horns}<path d="M69 49q8 2 9 8q-6 2-11-2" fill="${skin==='melanico'?'#414951':'#e4c69c'}"/><circle cx="68" cy="45" r="1.8" fill="${eye}"/>${tur?'<path d="M68 56q1 7 5 9" stroke="#4e3b2c" stroke-width="3" stroke-linecap="round"/>':'<path d="M69 56q2 7 6 9" stroke="#51402b" stroke-width="2.8" stroke-linecap="round"/>'}<path d="M36 72v14m18-14v14" stroke="${edge}" stroke-width="3.7" stroke-linecap="round"/><path d="M21 60l-8-5" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0149'){
    const spots=skin==='melanico'?'#4b515b':'#f2d9ac';
    return svgWrap(`<ellipse cx="43" cy="61" rx="24" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="66" cy="47" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M59 31L56 15m3 16l-9-8m9 8l4-11m7 11l5-16m-5 16l9-8" stroke="#70553b" stroke-width="3" stroke-linecap="round"/><path d="M53 22q-11-7-11-1q9 7 12 7m21-7q10-6 10 0q-7 8-12 7" fill="#b89368" stroke="#70553b" stroke-width="2"/><circle cx="69" cy="44" r="1.7" fill="${eye}"/><circle cx="33" cy="56" r="2.1" fill="${spots}"/><circle cx="43" cy="61" r="2.1" fill="${spots}"/><circle cx="53" cy="56" r="2.1" fill="${spots}"/><path d="M36 72v14m18-14v14" stroke="${edge}" stroke-width="3.5" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0903'){
    return svgWrap(`<path d="M10 69Q22 54 41 60Q52 67 63 58Q74 48 84 56Q90 63 85 69Q80 75 69 70Q54 75 43 77Q24 82 13 74Z" fill="${c}" stroke="#353629" stroke-width="3"/><path d="M16 69Q10 63 8 58" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="83" cy="60" r="6.5" fill="${light}" stroke="#353629" stroke-width="2.5"/><circle cx="85" cy="58" r="1.5" fill="${eye}"/><path d="M29 69l9-3m2 8l11-3m5-9l9-2" stroke="${dark}" stroke-width="2.3" stroke-linecap="round"/><path d="M38 58q12-2 17 3" stroke="#efddb4" stroke-width="2" fill="none" opacity=".65"/>`,glow);
  }
  if(id==='eu_esp_0505'){
    return svgWrap(`<path d="M25 63Q26 43 48 42Q70 44 72 62Q68 78 48 78Q29 79 25 63Z" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M36 47l10 10-8 10m12-10l12-9m-11 11l10 12" stroke="${dark}" stroke-width="2.5" fill="none"/><circle cx="73" cy="58" r="8" fill="${light}" stroke="${edge}" stroke-width="2.8"/><circle cx="76" cy="56" r="1.5" fill="${eye}"/><path d="M30 73l-5 7m17-3l-4 9m18-9l3 9m14-15l7 5" stroke="${edge}" stroke-width="3" stroke-linecap="round"/>`,glow);
  }
  return null;
}


// v2.2 — Herpetofauna dibujada por morfología y especie (no reutiliza aves ni roedores).
function detailedHerpSprite(id,skin){
 const sp=SPECIES[id]; if(!sp)return null;
 const n=sp.name.toLocaleLowerCase('es');
 const c=applySkin(sp.color,skin),light=shade(c,19),dark=shade(c,-27),edge='#344033',eye=eyeColor(skin);
 const black=skin==='melanico',bone=black?'#5d6872':'#e6d6b5',g=alphaGlow(skin);
 const wrap=shape=>svgWrap(shape,g);
 const isTurtle=/tortuga|galápago|galapago|terrapin/.test(n) || /^(Testudo|Emys|Mauremys)\b/i.test(sp.latin) || sp.kind==='tortoise';
 const isLizard=/lagarto|lagartija|geco|gecko|eslizón|eslizon|salamanquesa|camaleón|camaleon|lagarto de cristal/.test(n)||sp.kind==='lizard';
 const isSalamander=/salamandra|tritón|triton/.test(n)||sp.kind==='salamander';
 const isToad=/sapo|rana|escuerzo/.test(n)||sp.kind==='amphibian';
 if(isTurtle){
   const tiles=black?'#303843':id==='eu_esp_0505'?'#594d36':id==='eu_esp_0506'?'#6c713f':dark;
   return wrap(`<ellipse cx="47" cy="65" rx="29" ry="19" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
    <ellipse cx="47" cy="57" rx="26" ry="19" fill="${light}" stroke="${edge}" stroke-width="3.5"/>
    <path d="M47 39L38 49L42 62L55 62L59 49ZM22 53L38 49L42 62L28 68ZM59 49L73 54L66 69L55 62ZM42 62L47 75L55 62" fill="${tiles}" opacity=".64" stroke="${edge}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M23 68l-10 8m27 3l-6 9m23-9l7 10m9-19l9 6" stroke="${edge}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="76" cy="62" r="11" fill="${light}" stroke="${edge}" stroke-width="3"/><circle cx="79" cy="59" r="2" fill="${eye}"/><path d="M82 65q3 2 5-1" fill="none" stroke="${edge}" stroke-width="1.6"/>`);
 }
 if(isLizard){
   const limbless=/cristal|anguis|ophisaurus|lución|lucion/.test(n+' '+sp.latin.toLowerCase());
   if(limbless)return wrap(`<path d="M9 73Q18 63 34 65Q49 73 55 55Q63 36 76 47Q87 55 78 65Q67 72 55 67Q43 64 36 78" fill="none" stroke="${edge}" stroke-width="13" stroke-linecap="round"/>
      <path d="M9 73Q18 63 34 65Q49 73 55 55Q63 36 76 47Q87 55 78 65Q67 72 55 67Q43 64 36 78" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
      <path d="M39 64q7-2 11-5m7-10q4-4 9-5m-9 22q7 2 11 0" fill="none" stroke="${dark}" stroke-width="3"/>
      <circle cx="79" cy="53" r="2" fill="${eye}"/>`);
   const isGecko=/geco|gecko|salamanquesa/.test(n);
   const toadHead=/cabeza de sapo/.test(n);
   const dots=toadHead?`<circle cx="40" cy="61" r="4" fill="${dark}"/><circle cx="54" cy="63" r="4" fill="${dark}"/>`:
      `<circle cx="32" cy="62" r="3" fill="${dark}"/><circle cx="44" cy="55" r="3" fill="${dark}"/><circle cx="53" cy="69" r="3" fill="${dark}"/>`;
   return wrap(`<path d="M9 65Q18 57 29 56L41 52Q56 52 66 49L78 48Q89 50 89 61Q87 73 75 75L60 69Q49 78 33 76Q19 71 9 65Z" fill="${c}" stroke="${edge}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 63Q6 66 4 79" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M35 69l-9 12m19-9l-3 13m13-17l5 14m5-24l7-7" fill="none" stroke="${edge}" stroke-width="4" stroke-linecap="round"/>
    ${dots}<circle cx="80" cy="56" r="${toadHead?4.2:isGecko?4:2.5}" fill="${bone}"/><circle cx="81" cy="56" r="1.6" fill="${eye}"/>
    <path d="M81 64q4 3 7 0" fill="none" stroke="${edge}" stroke-width="1.7"/>`);
 }
 if(isSalamander){
   const siberian=/siberian|siberiana|salamandrella/.test(n+' '+sp.latin.toLowerCase());
   const alpine=/alpina|atra/.test(n+' '+sp.latin.toLowerCase());
   const triton=/tritón|triton/.test(n);
   const markings=siberian?`<path d="M28 56q18-9 35-2M27 69q18 6 35 0" stroke="${black?'#576472':'#bca16a'}" stroke-width="3" fill="none" stroke-linecap="round"/>`:
     alpine?`<path d="M32 57q15-8 27 0" stroke="${light}" opacity=".3" stroke-width="3" fill="none"/>`:
      `<circle cx="31" cy="58" r="4" fill="${black?'#46505b':'#e4bd38'}"/><circle cx="43" cy="69" r="4" fill="${black?'#46505b':'#e4bd38'}"/><circle cx="58" cy="55" r="3.5" fill="${black?'#46505b':'#e4bd38'}"/>`;
   return wrap(`<path d="M11 65Q25 55 38 57Q51 60 61 51Q70 46 79 53Q88 60 82 70Q74 78 61 73Q46 81 34 77Q21 77 11 65Z" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
     <path d="M13 66Q4 69 3 78" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
     ${triton?`<path d="M29 55l3-10 5 9 4-9 4 10" fill="${dark}" stroke="${edge}" stroke-width="1"/>`:''}
     ${markings}<circle cx="81" cy="60" r="2" fill="${eye}"/><path d="M28 67l-9 11m23-6l-3 12m19-16l3 14m10-24l6-8" stroke="${edge}" stroke-width="3.6" stroke-linecap="round"/>`);
 }
 if(isToad){
   const frog=/rana/.test(n);
   const marks=frog?`<path d="M37 64q9-4 18 0" fill="none" stroke="${light}" stroke-width="3"/>`:
     `<circle cx="35" cy="60" r="3" fill="${dark}"/><circle cx="50" cy="67" r="3" fill="${dark}"/><circle cx="60" cy="57" r="2.5" fill="${dark}"/>`;
   return wrap(`<ellipse cx="50" cy="66" rx="25" ry="18" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
    <ellipse cx="39" cy="50" rx="7" ry="7" fill="${light}" stroke="${edge}" stroke-width="2.5"/>
    <ellipse cx="61" cy="50" rx="7" ry="7" fill="${light}" stroke="${edge}" stroke-width="2.5"/>
    <circle cx="39" cy="49" r="2.8" fill="${eye}"/><circle cx="61" cy="49" r="2.8" fill="${eye}"/>
    ${marks}<path d="M29 70l-13 10 8 4m51-14l13 10-8 4" fill="none" stroke="${edge}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M45 76q5 3 10 0" fill="none" stroke="${edge}" stroke-width="1.8"/>`);
 }
 return null;
}

// Sprites asiáticos v2.2: animales clave con siluetas, patrones o proporciones propias.
function asiaV22Sprite(id,skin){
 const sp=SPECIES[id]; if(!sp || !ASIA_V22_IDS.has(id))return null;
 const c=applySkin(sp.color,skin),dark=shade(c,-28),light=shade(c,20),g=alphaGlow(skin);
 const ink='#342d27',eye=eyeColor(skin),mel=skin==='melanico',cream=mel?'#515964':'#f0e0c4';
 const wrap=shapes=>svgWrap(shapes,g);
 const legs=`<path d="M37 72l-2 13m20-13l2 13" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
 const head=(x=68,y=46)=>`<circle cx="${x}" cy="${y}" r="11" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="${x+3}" cy="${y-2}" r="2" fill="${eye}"/>`;
 const bird=(crest='',belly='',tail='')=>wrap(`<ellipse cx="47" cy="59" rx="18" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <path d="M29 58Q16 42 13 36Q29 36 41 50" fill="${dark}" stroke="${ink}" stroke-width="3"/>${head(62,46)}
   ${crest}${belly}${tail}<polygon points="71,48 84,45 72,53" fill="${mel?'#363d43':'#d3a04c'}" stroke="${ink}" stroke-width="2"/>
   <path d="M43 74l-3 12m10-12l3 12" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>`);
 const quadruped=(horns='',spots='',tail='')=>wrap(`<ellipse cx="45" cy="60" rx="25" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <path d="M35 56q12-5 22 0" fill="none" stroke="${light}" stroke-width="3" opacity=".6"/>
   ${head(68,46)}${horns}${spots}${tail}${legs}`);
 const cats=(pattern='')=>wrap(`<ellipse cx="45" cy="61" rx="26" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(68,46)}
   <path d="M60 38l3-12 7 11m0-1 9-10 2 13" fill="${dark}" stroke="${ink}" stroke-width="2.6"/>
   <ellipse cx="70" cy="54" rx="6" ry="4" fill="${cream}"/>
   <path d="M21 60q-11 5-11 17" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
   ${pattern}${legs}`);
 switch(id){
 case 'asia_esp_0402':return cats(`<path d="M29 48l5 10m10-14 3 15m13-13-4 13m-23 6 3 10m14-11 4 10" stroke="${mel?'#262d34':'#3c3025'}" stroke-width="3.3" stroke-linecap="round"/>`);
 case 'asia_esp_0403':return cats(`<circle cx="31" cy="58" r="3.6" fill="none" stroke="${dark}" stroke-width="2.6"/><circle cx="44" cy="66" r="4" fill="none" stroke="${dark}" stroke-width="2.6"/><circle cx="55" cy="54" r="3.4" fill="none" stroke="${dark}" stroke-width="2.4"/><path d="M13 76l-3 7" stroke="${ink}" stroke-width="4"/>`);
 case 'asia_esp_0073':return wrap(`<path d="M21 63Q21 49 30 45Q34 26 42 27Q49 29 51 43Q56 28 64 29Q72 33 70 51Q83 55 77 69Q61 78 38 71Z" fill="${c}" stroke="${ink}" stroke-width="3"/>
   ${head(74,46)}<path d="M75 56q5 10 8 16" fill="none" stroke="${ink}" stroke-width="4"/>${legs}<path d="M22 62q-10 2-11 9" stroke="${dark}" fill="none" stroke-width="4"/>`);
 case 'asia_esp_0062':return wrap(`<ellipse cx="45" cy="61" rx="26" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M27 55q1-20 15-19q14 2 17 17" fill="${dark}" stroke="${ink}" stroke-width="3"/>${head(70,48)}<path d="M62 38q-4-11-9-7m20 6q8-10 12-6" fill="none" stroke="${cream}" stroke-width="3.5" stroke-linecap="round"/>${legs}<path d="M27 73l-3 13m14-10l-2 11" stroke="${dark}" stroke-width="4"/>`);
 case 'asia_esp_0821':return quadruped(`<path d="M60 36q-5-13-12-12m24 12q7-13 14-12" fill="none" stroke="${cream}" stroke-width="3.5"/>`,`<path d="M23 55q9-10 19-7" fill="none" stroke="${dark}" stroke-width="6"/>`);
 case 'asia_esp_0240':case 'asia_esp_0445':case 'asia_esp_0086':case 'asia_esp_0344':
   return quadruped(`<path d="M61 35q-7-14-4-21m14 21q6-14 4-21" fill="none" stroke="${mel?'#373f46':'#6b5236'}" stroke-width="3.6" stroke-linecap="round"/>`,id==='asia_esp_0344'?`<path d="M70 56l-2 7" stroke="${cream}" stroke-width="3.2"/>`:``);
 case 'asia_esp_0007':return wrap(`<ellipse cx="44" cy="61" rx="23" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(67,48)}<path d="M62 42l-3-9m13 10 5-9" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><ellipse cx="68" cy="54" rx="8" ry="5" fill="${cream}"/><path d="M26 64q-18 3-17 16q12 4 23-3" fill="none" stroke="${dark}" stroke-width="8" stroke-linecap="round"/><path d="M19 77l10 2" stroke="${cream}" stroke-width="3"/>${legs}`);
 case 'asia_esp_0855':return wrap(`<ellipse cx="47" cy="60" rx="21" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="65" cy="42" r="14" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="68" cy="48" rx="9" ry="8" fill="${cream}"/><circle cx="57" cy="41" r="5" fill="${dark}"/><circle cx="72" cy="40" r="2" fill="${eye}"/><path d="M26 62Q12 51 13 37" stroke="${dark}" stroke-width="5" fill="none"/>${legs}`);
 case 'asia_esp_0194':return wrap(`<ellipse cx="48" cy="66" rx="16" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="62" cy="52" r="10" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M59 45l-8-19q9-8 14 13m1 3 8-20q8-4 5 6l-3 18" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="65" cy="51" r="2" fill="${eye}"/><path d="M35 72l-11 15m28-13 10 13" stroke="${ink}" stroke-width="3.4"/>`);
 case 'asia_esp_0844':return wrap(`<ellipse cx="46" cy="60" rx="22" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(65,47)}<path d="M26 55q-13-15-10-29" stroke="${dark}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M33 56l-9 12 24-4" fill="${light}" stroke="${ink}" stroke-width="2"/>${legs}`);
 case 'asia_esp_0177':return wrap(`<ellipse cx="45" cy="62" rx="25" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(69,52)}<ellipse cx="70" cy="58" rx="7" ry="4" fill="${cream}"/><path d="M21 61q-11 1-14 12" stroke="${dark}" fill="none" stroke-width="6" stroke-linecap="round"/><path d="M39 75l-7 8m16-8 7 7" stroke="${ink}" stroke-width="3.2"/>`);
 case 'asia_esp_0369':case 'asia_esp_0371':return wrap(`<path d="M22 57L10 42V72Z" fill="${dark}" stroke="${ink}" stroke-width="3"/><ellipse cx="49" cy="57" rx="28" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M44 43l8-10 5 11" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="69" cy="53" r="2" fill="${eye}"/><path d="M31 65q18 6 34 1" fill="none" stroke="${light}" stroke-width="3"/>`);
 case 'asia_esp_0209':return bird(`<path d="M57 37l-5-12 10 6" fill="${dark}"/>`, `<ellipse cx="51" cy="66" rx="9" ry="9" fill="${cream}"/>`);
 case 'asia_esp_0234':case 'asia_esp_0203':return wrap(`<ellipse cx="47" cy="58" rx="18" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M29 57Q14 41 13 27Q29 32 40 48" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M58 51Q75 36 88 32Q83 49 64 63" fill="${light}" stroke="${ink}" stroke-width="3"/>${head(61,43)}<polygon points="70,46 87,44 71,53" fill="${cream}" stroke="${ink}" stroke-width="2"/>${legs}`);
 case 'asia_esp_0881':case 'asia_esp_0503':return bird('', `<ellipse cx="48" cy="62" rx="7" ry="6" fill="${cream}"/>`,`<path d="M29 59q-12 3-17 17" stroke="${dark}" stroke-width="4" fill="none"/>`);
 case 'asia_esp_0294':case 'asia_esp_0864':case 'asia_esp_0865':
   return bird(`<path d="M55 38l-5-15 10 6-1-11 10 9" fill="${light}" stroke="${ink}" stroke-width="2.5"/>`,
     `<path d="M45 49q8-7 17 0m-23 12q12 9 23 2" fill="none" stroke="${mel?'#404b55':id==='asia_esp_0865'?'#d1a047':'#61aeb0'}" stroke-width="4"/>`,
     `<path d="M30 65q-16 7-15 18" stroke="${dark}" stroke-width="4" fill="none"/>`);
 case 'asia_esp_0863':return bird('',`<ellipse cx="50" cy="64" rx="12" ry="8" fill="${cream}" opacity=".8"/>`);
 case 'asia_esp_0820':return quadruped(`<path d="M60 38l3-13 8 12m3-1 8-13" fill="${dark}" stroke="${ink}" stroke-width="2.5"/>`,``,`<path d="M21 62q-13-1-16-10" stroke="${dark}" stroke-width="5" fill="none"/>`);
 case 'asia_esp_0850':return wrap(`<ellipse cx="44" cy="63" rx="26" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(71,54)}<path d="M30 59q12 8 28 4" fill="none" stroke="${cream}" stroke-width="7"/><path d="M19 60Q9 64 8 75" stroke="${dark}" fill="none" stroke-width="5"/>${legs}`);
 case 'asia_esp_0523':return wrap(`<ellipse cx="45" cy="61" rx="25" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(69,46)}<circle cx="61" cy="36" r="4" fill="${dark}" stroke="${ink}" stroke-width="2"/><circle cx="77" cy="36" r="4" fill="${dark}" stroke="${ink}" stroke-width="2"/><path d="M67 54q8 4 12-1" fill="${cream}"/><path d="M38 57q12-3 18 0" stroke="${cream}" stroke-width="3"/>${legs}`);
 }
 return quadruped();
}
const ASIA_V22_IDS=new Set(["asia_esp_0402", "asia_esp_0086", "asia_esp_0344", "asia_esp_0209", "asia_esp_0203", "asia_esp_0234", "asia_esp_0177", "asia_esp_0369", "asia_esp_0371", "asia_esp_0881", "asia_esp_0194", "asia_esp_0073", "asia_esp_0431", "asia_esp_0863", "asia_esp_0294", "asia_esp_0864", "asia_esp_0503", "asia_esp_0865", "asia_esp_0820", "asia_esp_0403", "asia_esp_0007", "asia_esp_0855", "asia_esp_0850", "asia_esp_0844", "asia_esp_0523", "asia_esp_0062", "asia_esp_0821", "asia_esp_0240", "asia_esp_0445"]);

// v2.3 · Sprites vectoriales de Asia restante. Siluetas animales y patrones compartidos
// por familia; cada especie conserva su color y la compatibilidad con variantes.
const ASIA_V23_IDS=new Set(["asia_esp_0538", "asia_esp_0206", "asia_esp_0214", "asia_esp_0383", "asia_esp_0519", "asia_esp_0102", "asia_esp_0205", "asia_esp_0300", "asia_esp_0065", "asia_esp_0910", "asia_esp_0327", "asia_esp_0873", "asia_esp_0246", "asia_esp_0182", "asia_esp_0218", "asia_esp_0227", "asia_esp_0534", "asia_esp_0321", "asia_esp_0183", "asia_esp_0404", "asia_esp_0442", "asia_esp_0347", "asia_esp_0319", "asia_esp_0468", "asia_esp_0891", "asia_esp_0890", "asia_esp_0226", "asia_esp_0878", "asia_esp_0422", "asia_esp_0842", "asia_esp_0824", "asia_esp_0915", "asia_esp_0911", "asia_esp_0888", "asia_esp_0868", "asia_esp_0872", "asia_esp_0410", "asia_esp_0874", "asia_esp_0816", "asia_esp_0176", "asia_esp_0852", "asia_esp_0336", "asia_esp_0860", "asia_esp_0853", "asia_esp_0476", "asia_esp_0833", "asia_esp_0050", "asia_esp_0061", "asia_esp_0063", "asia_esp_0830", "asia_esp_0465", "asia_esp_0825", "asia_esp_0900", "asia_esp_0136", "asia_esp_0906", "asia_esp_0905", "asia_esp_0351", "asia_esp_0124", "asia_esp_0296", "asia_esp_0096", "asia_esp_0355", "asia_esp_0006", "asia_esp_0318", "asia_esp_0854", "asia_esp_0395", "asia_esp_0856", "asia_esp_0310", "asia_esp_0345", "asia_esp_0902", "asia_esp_0016", "asia_esp_0433", "asia_esp_0440", "asia_esp_0333", "asia_esp_0111", "asia_esp_0249", "asia_esp_0067", "asia_esp_0867", "asia_esp_0869", "asia_esp_0883", "asia_esp_0849", "asia_esp_0858", "asia_esp_0238", "asia_esp_0857", "asia_esp_0317", "asia_esp_0859", "asia_esp_0251", "asia_esp_0352", "asia_esp_0436", "asia_esp_0491", "asia_esp_0165", "asia_esp_0834", "asia_esp_0498", "asia_esp_0901", "asia_esp_0527", "asia_esp_0316", "asia_esp_0373", "asia_esp_0877", "asia_esp_0494", "asia_esp_0363", "asia_esp_0414", "asia_esp_0308", "asia_esp_0087", "asia_esp_0017"]);
function asiaV23Sprite(id,skin){
 if(!ASIA_V23_IDS.has(id))return null;
 const sp=SPECIES[id], n=sp.name.toLocaleLowerCase('es');
 const c=skin==='albino'?'#e9e3d6':applySkin(sp.color,skin);
 const d=shade(c,-28),l=shade(c,18),cream=skin==='albino'?'#fff8ed':'#e8d7b8',ink='#352e28',eye=eyeColor(skin),glow=alphaGlow(skin);
 const wrap=x=>svgWrap(x,glow);
 const legs='<path d="M35 74l-3 12m22-12 3 12" stroke="#604b37" stroke-width="4" stroke-linecap="round"/>';
 const face=(x=68,y=47)=>`<circle cx="${x}" cy="${y}" r="2.2" fill="${eye}"/>`;
 const spots=(x=35)=>`<circle cx="${x}" cy="55" r="3.3" fill="${d}"/><circle cx="${x+12}" cy="63" r="2.7" fill="${d}"/><circle cx="${x+20}" cy="52" r="3" fill="${d}"/>`;
 const body=(extras='',marks='')=>wrap(`<ellipse cx="46" cy="61" rx="25" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="64" cy="46" rx="12" ry="11" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="71" cy="53" rx="7" ry="4" fill="${cream}"/>${face(67,43)}${legs}<path d="M21 59l-10-8" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>${marks}${extras}`);
 const bird=(marks='',tail='',crest='',beak='')=>wrap(`<path d="M28 58L12 43L20 78L36 68Z" fill="${d}" stroke="${ink}" stroke-width="2.6"/><ellipse cx="46" cy="61" rx="21" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M35 55q13-5 23 8q-12 10-23 1z" fill="${d}" stroke="${ink}" stroke-width="2"/><circle cx="66" cy="45" r="11" fill="${c}" stroke="${ink}" stroke-width="3"/>${face(69,42)}${beak||`<polygon points="74,49 89,46 75,55" fill="#cba05e" stroke="${ink}" stroke-width="2"/>`}${crest}${marks}${tail}<path d="M40 74l-4 12m16-12 3 12" stroke="${ink}" stroke-width="3"/>`);
 if(/elefante/i.test(n))return wrap(`<ellipse cx="43" cy="58" rx="28" ry="19" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="66" cy="48" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="56" cy="51" rx="12" ry="15" fill="${l}" stroke="${ink}" stroke-width="2.6"/><path d="M79 52q9 6 7 18q-2 11-10 8" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M78 59l8 9" fill="none" stroke="${cream}" stroke-width="3"/>${face(72,43)}<path d="M28 70v17m23-16v17" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`);
 if(/rinoceronte/i.test(n))return body(`<path d="M73 43l15-15-7 25" fill="${cream}" stroke="${ink}" stroke-width="2.4"/><path d="M59 35l7-6" stroke="${ink}" stroke-width="4"/>`,`<path d="M29 57q13-9 27-5" fill="none" stroke="${d}" stroke-width="4"/>`);
 if(/cocodrilo/i.test(n))return wrap(`<path d="M8 63Q23 48 42 54L74 52Q86 48 91 58Q94 68 82 72L47 70Q23 80 8 63Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M17 60l9-8 6 7 7-9 7 8 8-8 7 8" stroke="${d}" stroke-width="5" fill="none"/><path d="M70 66q10 7 22-2" stroke="${ink}" stroke-width="2" fill="none"/>${face(81,54)}<path d="M28 71l-8 12m33-11 8 11" stroke="${ink}" stroke-width="5"/>`);
 if(/pitón|piton/i.test(n))return wrap(`<path d="M11 76Q20 54 36 61Q52 70 59 52Q70 34 82 47Q91 59 81 69Q71 76 58 72Q45 67 35 79" fill="none" stroke="${ink}" stroke-width="17" stroke-linecap="round"/><path d="M11 76Q20 54 36 61Q52 70 59 52Q70 34 82 47Q91 59 81 69Q71 76 58 72Q45 67 35 79" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/><path d="M24 63l9 5 8-3 9 4 9-6 9 4 8-6" fill="none" stroke="${d}" stroke-width="3.2"/>${face(83,50)}`);
 if(/dragón de komodo|dragon de komodo/i.test(n))return wrap(`<path d="M18 62Q33 45 54 53Q66 44 80 49Q92 53 88 65Q82 77 66 72Q49 83 31 73Z" fill="${c}" stroke="${ink}" stroke-width="3.5"/><path d="M25 69Q12 76 4 87" fill="none" stroke="${d}" stroke-width="7" stroke-linecap="round"/><path d="M33 69l-13 13m26-11-7 16m19-18 6 15m12-25 12-8" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>${spots(35)}${face(79,55)}<path d="M83 63l10 2" stroke="${ink}" stroke-width="2"/>`);
 if(/dragón volador|dragon volador/i.test(n))return wrap(`<path d="M34 55Q19 32 10 39Q12 58 32 69M61 53Q82 30 91 40Q90 58 67 70" fill="${l}" stroke="${ink}" stroke-width="3"/><path d="M16 43l19 19m48-18-18 18" stroke="${d}" stroke-width="2.4"/><path d="M17 66Q38 46 63 57Q82 47 87 61Q88 71 69 73Q43 84 24 72Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M20 69Q9 75 5 87" stroke="${d}" stroke-width="4" fill="none"/><path d="M34 71l-9 12m29-10 8 11m12-23 10-9" stroke="${ink}" stroke-width="3.5"/>${face(81,58)}`);
 if(/cobra|krait/i.test(n))return wrap(`<path d="M10 80Q19 61 36 70Q56 81 62 60Q66 41 64 29Q49 17 51 36Q55 51 68 52Q85 54 86 33Q80 18 69 29" stroke="${ink}" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M10 80Q19 61 36 70Q56 81 62 60Q66 41 64 29Q49 17 51 36Q55 51 68 52Q85 54 86 33Q80 18 69 29" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M61 32q9-14 21-1q-7 21-19 17" fill="${d}" stroke="${ink}" stroke-width="2.6"/>${face(72,35)}`);
 if(/panda gigante/i.test(n))return wrap(`<ellipse cx="42" cy="62" rx="24" ry="19" fill="#f1eee7" stroke="${ink}" stroke-width="3"/><circle cx="67" cy="44" r="16" fill="#f4f1e9" stroke="${ink}" stroke-width="3"/><circle cx="56" cy="31" r="7" fill="${d}"/><circle cx="76" cy="30" r="7" fill="${d}"/><ellipse cx="61" cy="43" rx="6" ry="8" fill="${d}"/><ellipse cx="74" cy="43" rx="6" ry="8" fill="${d}"/>${face(62,43)}${face(73,43)}<ellipse cx="69" cy="54" rx="7" ry="5" fill="${d}"/><path d="M28 71l-7 11m28-11 6 11" stroke="${d}" stroke-width="9" stroke-linecap="round"/>`);
 if(/pangolín|pangolin/i.test(n))return wrap(`<path d="M15 67Q27 38 57 43Q78 48 77 68Q59 81 33 73Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M23 65l7-16 8 20 7-22 8 22 7-19 7 16" fill="none" stroke="${d}" stroke-width="4"/><path d="M22 72Q6 79 12 89Q25 88 35 78" stroke="${d}" stroke-width="7" fill="none"/><path d="M66 52l22-3-12 14" fill="${c}" stroke="${ink}" stroke-width="2.6"/>${face(77,53)}${legs}`);
 if(/pavo real/i.test(n))return wrap(`<path d="M45 61Q14 31 25 12L45 28 51 8 58 27 78 12Q86 36 58 61Z" fill="#548b79" stroke="${ink}" stroke-width="3"/><circle cx="25" cy="31" r="5" fill="#c8a86c"/><circle cx="45" cy="24" r="5" fill="#c8a86c"/><circle cx="65" cy="33" r="5" fill="#c8a86c"/><path d="M48 42q-8 2-8 20q1 14 13 17" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/><circle cx="50" cy="42" r="9" fill="${c}" stroke="${ink}" stroke-width="2.5"/>${face(54,39)}<path d="M56 44l12-3-9 8Z" fill="#c79d5b"/>${legs}`);
 if(/cálao|calao/i.test(n))return bird(`<path d="M63 32Q80 18 89 35L76 37" fill="${cream}" stroke="${ink}" stroke-width="2.7"/>`,`<path d="M24 73L13 88" stroke="${d}" stroke-width="5"/>`,'',`<path d="M75 42Q97 36 95 52Q83 61 73 50Z" fill="#d9b55e" stroke="${ink}" stroke-width="2.5"/>`);
 if(/pelícano|pelicano/i.test(n))return bird('',`<path d="M19 75l-6 12" stroke="${d}" stroke-width="4"/>`,'',`<path d="M74 46Q95 42 95 50Q92 68 77 63Q84 60 78 51Z" fill="#e4bb68" stroke="${ink}" stroke-width="2.7"/>`);
 if(/grulla|cigüeña|ciguena/i.test(n))return wrap(`<path d="M37 64Q22 44 37 41Q50 38 57 51L69 23Q72 13 78 22L70 55" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M68 24l21-2-18 10" fill="#bd9860"/><ellipse cx="44" cy="62" rx="20" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M36 72l-9 18m22-19 2 20" stroke="${ink}" stroke-width="3"/>${face(75,22)}`);
 if(/faisán|faisan|pato mandarín|pato mandarin/i.test(n))return bird(spots(35),`<path d="M23 66Q9 74 7 90" fill="none" stroke="${d}" stroke-width="7"/>`,`<path d="M60 33l-7-10 15 6" fill="${l}" stroke="${ink}" stroke-width="2"/>`);
 if(/urraca|carraca|abejaruco|bubul|bulbul/i.test(n))return bird(`<path d="M43 54l13 11" stroke="${l}" stroke-width="3"/>`,`<path d="M22 65L7 88" stroke="${d}" stroke-width="7"/>`);
 if(/antílope saiga|antilope saiga/i.test(n))return body(`<path d="M62 35Q49 15 56 13m14 22q12-20 8-25" fill="none" stroke="${ink}" stroke-width="4"/><ellipse cx="78" cy="57" rx="8" ry="9" fill="${l}" stroke="${ink}" stroke-width="2"/>`);
 if(/órix|orix|antílope|antilope|gacela|kiang|onagro|caballo|búfalo|bufalo|gaur|nilgó|nilgo|ciervo|muntíaco|muntiaco/i.test(n))return body(`<path d="M58 34Q52 19 49 11m24 23q3-14 8-22" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`,/chital|sika|gacela/i.test(n)?spots():'');
 if(/hiena/i.test(n))return body(`<path d="M22 48l8-18 7 18 6-16 6 18" fill="${d}" stroke="${ink}" stroke-width="2.5"/>`);
 if(/gato|leopardo|tigre|pantera|lince/i.test(n))return body(`<path d="M57 39l2-12 8 8 7-10 5 15" fill="${d}" stroke="${ink}" stroke-width="2.5"/>`,/leopardo|gato leopardo|nublado/i.test(n)?spots():`<path d="M33 52l5 13m13-11l4 12" stroke="${d}" stroke-width="4"/>`);
 if(/macaco|mono|langur|gibón|gibon|loris/i.test(n))return wrap(`<ellipse cx="42" cy="64" rx="20" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="59" cy="42" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="61" cy="49" rx="12" ry="10" fill="${cream}"/><circle cx="57" cy="42" r="2" fill="${eye}"/><circle cx="68" cy="42" r="2" fill="${eye}"/><path d="M23 65Q6 57 14 43" fill="none" stroke="${d}" stroke-width="6"/><path d="M28 71L16 86m37-11L70 86" stroke="${ink}" stroke-width="4"/>`);
 if(/pez|carpa/i.test(n))return wrap(`<path d="M27 55L9 38V72Z" fill="${d}" stroke="${ink}" stroke-width="2.5"/><path d="M23 54Q45 36 70 46Q86 55 74 68Q49 78 23 54Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M44 45l8-12 6 12" fill="${d}" stroke="${ink}" stroke-width="2"/>${face(70,53)}<path d="M38 58q15 7 27-1" fill="none" stroke="${l}" stroke-width="3"/>`);
 if(/varano|gecko|lagarto|galápago|galapago|salamandra|víbora|vibora/i.test(n))return null; // Dibujo herpetológico existente
 if(/marmota|musaraña|liebre|tejón|tejon|turón|turon|ardilla|civeta|nutria/i.test(n))return body('',`<path d="M27 63q15-8 27 0" fill="none" stroke="${l}" stroke-width="4"/>`);
 if(/oso/i.test(n))return body(`<path d="M56 36l-3-7m18 5 5-8" stroke="${d}" stroke-width="5"/>`);
 return sp.kind==='forestbird'||sp.kind==='songbird'||sp.kind==='raptor'||sp.kind==='seabird'||sp.kind==='stork'?bird():body();
}

// Beta 3.6.1: presentation only. Shared 100×100 geometry; no species/save mutations.
function polishedSpeciesSprite(id,skin){
 const sp=SPECIES[id]; if(!sp)return null;
 const n=sp.name.toLocaleLowerCase('es'),kind=sp.kind;
 const c=applySkin(sp.color,skin),d=skin==='melanico'?'#39434f':shade(c,-36);
 const l=skin==='melanico'?'#687582':shade(c,23),ink='#39332e';
 const pale=skin==='melanico'?'#77818b':'#f1e7d4',eye=eyeColor(skin);
 const path=(a,fill=c,width=2.8)=>`<path d="${a}" fill="${fill}" stroke="${ink}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
 const line=(a,color=ink,width=3)=>`<path d="${a}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const ellipse=(x,y,rx,ry,fill=c,width=2.8)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${ink}" stroke-width="${width}"/>`;
 const dot=(x,y,r=2,fill=eye)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const wrap=a=>svgWrap(a,alphaGlow(skin));
 const feet=(y=73)=>line(`M30 ${y}l-2 14m12-14v14m17-14l-1 14m12-16l3 16`,ink,3.8);
 const spots=(rosettes=false)=>[[32,56],[44,62],[53,53],[58,67],[35,68]].map(([x,y])=>rosettes?ellipse(x,y,2.6,2.1,c,1.9):dot(x,y,2.1,d)).join('');
 if(kind==='crocodile'){
   const narrow=id==='af_cocodrilo_hocico';
   return wrap(path('M36 62Q16 57 6 72Q20 68 29 75',d)+path('M24 62Q38 49 60 57L69 54L94 '+(narrow?'60':'57')+'L94 67L66 70Q45 81 25 73Z')+
     line('M33 57l4-6 6 5 6-6 6 6 6-4',d,3.5)+line('M31 73l-7 10 11-1m18-8 6 9 8-1',ink,4)+line('M70 64h22',d,2.5)+dot(68,57,2.3)+dot(90,60,1.4,d)+line('M77 65l2 3m7-3 2 3',pale,2));
 }
 if(kind==='elephant'){
   const forest=id==='af_elefante_bosque',africa=id.startsWith('af_');
   return wrap(line('M24 56Q15 57 13 70',d,3)+feet()+ellipse(45,57,27,22)+
     path('M60 38Q82 28 88 47L88 70Q95 73 94 62L97 63Q99 84 83 81L78 56Z')+
     ellipse(africa?62:64,49,forest?14:africa?17:10,africa?20:14,l)+
     path('M80 59Q88 65 94 54Q91 72 79 66Z',pale,1.8)+dot(81,45,2.2)+line('M32 85h7m18 0h7',l,2));
 }
 if(kind==='rhino'){
   const white=id==='af_rinoceronte_blanco',indian=/indio/.test(n);
   return wrap(feet()+ellipse(43,59,28,21)+path('M60 46L76 45L88 59L89 72L63 74L54 60Z')+
     path('M78 58Q86 48 86 '+(white?'33':'39')+'L92 62Z',pale)+(!indian?path('M71 53l3-12 6 16Z',l,2):'')+
     path('M63 47l-1-13 9 9m2 2 6-10 1 13',c,2.4)+dot(77,55)+line('M78 69h8',d,2.2)+
     (indian?line('M34 40l-4 32m22-32 4 35',d,3):''));
 }
 if(kind==='hippo')return wrap(feet(76)+ellipse(43,60,28,23)+ellipse(72,59,19,19)+ellipse(78,68,17,11,l)+ellipse(61,42,4,5)+ellipse(78,41,4,5)+dot(66,52,2.4)+dot(79,51,2.4)+dot(73,65,2,d)+dot(85,65,2,d)+line('M68 74q9 3 18-1',d,2));
 if(kind==='giraffe'){
   const okapi=id==='af_okapi';
   return wrap(line('M24 57L14 72',d,3)+feet()+ellipse(44,60,23,14)+path(okapi?'M56 56L61 33L70 31L74 61Z':'M55 57L63 19L72 18L71 60Z')+
     ellipse(75,okapi?33:22,12,7)+path(okapi?'M65 29l-7-9 11 4m9 3 5-9 2 12':'M65 18l-6-8 10 4m8 2 8-7-3 11',l,2)+
     line(okapi?'M69 26v-7m8 7 1-7':'M68 16V9m8 7V8',d,3)+dot(80,okapi?31:20)+
     (okapi?line('M26 67l12 4m-10 4 11 3m17-10 13 1m-12 6 13 1',pale,3):line('M29 53l7 4m5-6 8 4m-14 8 7 4m8-8 6 4m7-25 6 2m-5-12 6 2m-8 20 6 2',d,4)));
 }
 if(kind==='zebra')return wrap(feet()+line('M23 58L12 74',d,3)+ellipse(44,58,25,17)+path('M57 52L65 28L76 24L85 40L77 49L68 63Z')+
   path('M65 29l-3-12 7 7m4 1 3-13 5 13',c,2)+line('M61 47l4-18',d,5)+
   line('M25 49l6 19m3-25 6 29m4-30 5 31m4-28 5 26m6-37 10 7m-12 2 12 6',d,3.5)+ellipse(80,43,6,5,d,2)+dot(77,34));
 if(id==='af_hiena_manchada')return wrap(line('M25 57L12 67',d,5)+feet()+path('M22 55Q39 35 62 47L76 57L65 73L31 72Z')+
   line('M35 47l5-7 6 5 5-5',d,4)+ellipse(72,47,13,12)+ellipse(63,35,5,6)+ellipse(77,34,5,6)+ellipse(81,53,9,6,l)+spots()+dot(76,44)+dot(88,52,2.6,ink));
 if(kind==='cat' && id.startsWith('af_')){
   const lion=id==='af_leon',cheetah=id==='af_guepardo',serval=id==='af_serval',caracal=id==='af_caracal',fosa=id==='af_fosa',civet=id==='af_civeta';
   const tail=fosa?'M25 61Q3 79 8 39':serval?'M24 63Q12 62 13 73':'M25 62Q9 62 12 78Q18 84 24 77';
   return wrap(line(tail,d,fosa?5:4)+feet(cheetah||serval?68:73)+ellipse(45,58,cheetah?25:23,cheetah?12:16)+
     (lion?ellipse(69,45,18,20,d):'')+
     ((cheetah||serval||civet)?spots():id==='af_leopardo'?spots(true):'')+
     (serval?ellipse(61,30,6,10)+ellipse(75,29,6,10):path('M59 40l2-13 10 10 8-9 2 15',c,2.5))+
     ellipse(70,45,12,11)+ellipse(75,51,8,5,pale,1.5)+dot(75,42)+dot(82,49,2,ink)+
     (caracal?line('M61 28l-3-9m20 9 4-9',ink,3):'')+
     (cheetah?line('M75 44l3 5',ink,2.4):'')+(civet?line('M63 43l14-1',d,4):'')+
     (lion?dot(22,78,4,d):''));
 }
 if(kind==='canid'){
   const fenec=id==='af_fenec',dog=id==='af_licaon',fox=/zorro|fénec/.test(n),arctic=/ártico/.test(n);
   const coat=arctic&&skin==='normal'?'#dae1e7':c;
   return wrap(path(fox?'M28 59Q10 44 8 61Q7 81 31 73Z':'M25 60Q9 54 10 68L27 73Z',d)+
     (fox?path('M10 59Q6 75 20 76L17 67Z',pale,1.5):'')+feet()+ellipse(45,59,24,15,coat)+
     (dog?path('M26 51l14-4 2 17-12 7Z',ink,1.5)+path('M49 49l10 5-5 16-10-4Z',pale,1.5):'')+
     (dog?ellipse(60,30,7,8,d)+ellipse(77,30,7,8,d):path(fenec?'M57 42L52 12L68 34L79 13L82 43Z':fox?'M58 40l2-17 11 13 9-13 2 19Z':'M58 40l2-13 11 9 8-11 2 17Z',coat))+
     ellipse(69,45,12,11,coat)+path('M70 46L90 51L78 58L65 53Z',pale,2)+dot(73,43)+dot(89,51,2.3,ink)+
     (dog?line('M13 65l8 4',pale,5):''));
 }
 if(id.startsWith('af_')&&(kind==='deer'||kind==='bison')){
   const oryx=id==='af_orix',bongo=id==='af_antilope_bongo',duiker=id==='af_duiker_azul',buffalo=id==='af_bufalo_cafre',gnu=id==='af_nu_azul',eland=id==='af_eland',arrui=id==='af_arrui';
   const horns=duiker?'M65 34l-1-7m9 7 2-7':oryx?'M64 33L49 9m24 24L67 8':buffalo?'M65 37Q48 21 52 43Q60 48 67 39M70 38Q88 23 86 43Q80 49 70 38':gnu?'M62 36Q46 37 51 23m21 13q15 0 10-13':arrui?'M63 34Q45 13 56 14M72 34Q88 17 77 13':bongo||eland?'M64 33l-5-8 3-7-5-8m16 24-1-10 4-6-3-8':'M64 34Q53 19 60 12m13 22q9-14 2-22';
   return wrap(feet()+line('M23 57L12 70',d,3)+ellipse(44,58,25,buffalo||gnu||eland?19:14)+path('M57 53l4-20 15 1 9 17-9 10-13 4Z')+
     path('M61 36l-10-6 4 9m20-2 12-7-5 12',l,2)+line(horns,d,buffalo?4.5:3.2)+
     (gnu||arrui?path('M64 58l3 16 8-13',d,2):'')+
     (bongo?line('M29 48l2 20m8-24 2 26m8-24 2 24m7-20 1 14',pale,2.5):!buffalo&&!gnu?line('M28 63h29',pale,4):'')+
     (oryx?line('M69 39l9 13',d,3):'')+dot(77,43)+ellipse(81,53,5,4,d,1.5));
 }
 // Bird family helper: species supply the head, bill, tail and bold plumage blocks.
 const bird=(head=c,wing=d,marks='',bill='M76 37l14 3-14 5Z',tail='M32 58L13 72L20 53Z')=>wrap(
   path(tail,d)+line('M43 74l-3 13h-5m19-13 3 13h5',ink,2.8)+ellipse(48,59,20,17)+
   path('M34 52Q48 48 57 64L34 69Z',wing,2)+ellipse(67,37,11,11,head)+path(bill,'#c99b48',2)+marks+dot(71,35));
 if(id==='af_aguila_pescadora'||id==='af_fosa_ave')return bird(pale,'#302e2c',
   path('M58 41L74 44L66 58L54 53Z',pale,1.5)+line('M35 59l11 8m-12-1 9 7',l,2.6),
   'M76 35Q91 32 87 43L82 46L82 40L76 42Z','M32 61L20 82L41 78Z');
 if(id==='af_secretario')return wrap(line('M42 62l-4 27h-7m24-27 4 27h7',ink,3.4)+path('M34 55L17 79L36 70Z',d)+ellipse(48,50,18,14)+path('M56 47L60 22L69 22L67 49Z')+ellipse(66,21,9,8)+line('M59 17L48 12m11 8-12-2m12 6-12 1',ink,2.5)+path('M73 21l13 2-9 7-3-3Z',pale,2)+dot(70,20)+path('M35 45l14 2 3 14-16-4Z',d,2));
 if(id==='af_avestruz')return wrap(line('M36 67l-4 22h-7m30-22 5 22h8',ink,3.5)+path('M28 44l-14-1 10 11Z',pale,2)+ellipse(45,51,23,18)+path('M59 45Q72 34 66 17L73 16Q81 39 65 56Z',l)+ellipse(69,15,8,6,l,2)+path('M77 15l12 3-12 3Z',pale,1.8)+path('M31 48q12-9 24 7l-21 8Z',pale,2)+dot(72,14));
 if(id==='af_ibis_sagrado'||id==='af_ibis_eremita'||id==='af_garza_goliat'||id==='af_grulla_coronada'){
   const ibis=/ibis/.test(id),crown=id==='af_grulla_coronada';
   return wrap(line('M39 64l-3 24h-6m23-24 5 24h6',ink,2.8)+ellipse(45,53,23,15)+path('M55 47Q69 43 60 26Q58 17 68 17L72 24Q64 29 72 39L64 55Z',ibis?d:c)+ellipse(67,21,8,7,ibis?d:c,2.4)+
     (ibis?line('M74 22Q91 24 89 44',d,3):path('M74 21L94 26L75 27Z',l,2))+
     path('M28 48q12-6 23 9l-22 6Z',d,2)+
     (crown?line('M61 14l-6-6m10 5-2-8m7 8 3-8m0 11 8-7','#c8a64d',3):'')+dot(70,20,1.8,ibis?'#d8c46b':eye));
 }
 if(['af_loro_gris','af_turaco','af_abejaruco_carmin'].includes(id)){
   if(id==='af_loro_gris')return bird(c,d,path('M27 64l-8 11 15-2Z','#ba5147',2),'M76 36Q89 33 84 47L79 42L75 43Z');
   if(id==='af_turaco')return bird(c,d,path('M59 28l-1-14 7 5 5-7 5 17Z',l,2)+line('M62 38l12 1',pale,2),'M77 37l9 4-10 4Z','M32 58L18 87L39 72Z');
   return bird('#4d9e9c',d,line('M59 35l15 1',ink,3),'M76 36l18 4-18 3Z','M32 58L13 83L24 63L20 87L40 68Z');
 }
 if(id==='af_tortuga_laúd')return wrap(path('M36 52L15 36L23 61L15 78L40 69Z',d)+path('M62 51L81 38L73 65L85 78L62 70Z',d)+ellipse(50,59,20,26)+ellipse(73,43,8,7)+line('M40 39Q30 58 41 79m8-44q-8 24 1 48m8-46q5 22 0 42',l,2.3)+dot(77,42));
 if(id==='af_tortuga_radiada')return wrap(line('M30 71l-8 12m20-9-2 11m20-11 5 11m6-17 9 10',ink,5)+ellipse(74,59,10,8)+path('M21 70Q21 36 46 36Q69 36 71 70Z',d)+[32,49,62].map((x,i)=>line(`M${x} 57l-7-12m7 12 7-13m-7 13-7 10m7-10 7 11`,pale,2)).join('')+dot(79,57));
 if(id==='af_suricata')return wrap(line('M40 75Q23 85 16 77',d,4)+ellipse(49,63,12,22)+ellipse(51,34,12,10)+ellipse(40,30,4,5)+ellipse(61,29,4,5)+line('M44 79l-3 9m17-9 5 9m-24-38 6 12m16-12-6 12',ink,3)+line('M43 34h4m9 0h4',d,4)+dot(46,33,1.5)+dot(58,33,1.5)+dot(54,40,2,d));
 if(id==='af_tenrec')return wrap(path('M18 70L20 49L27 53L31 39L39 49L47 38L54 49L64 45L74 59L86 69L74 76L31 78Z')+line('M27 58l7-10m3 17 8-15m4 17 8-13',pale,2.4)+dot(72,62)+dot(84,69,2,ink)+line('M32 77l-3 8m29-8 5 8',ink,3));
 return null;
}


/**
 * Beta 3.9: retratos propios para animales nuevos de África.
 * SVG 100x100; variantes claras/oscuras se pintan en getSpriteMarkup.
 */

function africaV310Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const c=applySkin(sp.color,skin),dark=shade(c,-27),light=shade(c,25);
 const ink='#36342f',eye=eyeColor(skin);
 const wrap=part=>svgWrap(part,alphaGlow(skin));
 if(id==='af_picozapato')return wrap(
  '<path d="M21 65L8 78L30 71Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="44" cy="60" rx="23" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M57 57Q64 48 63 35Q62 22 71 20Q84 17 85 34L76 55Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M80 30L97 28L97 46L78 52L73 39Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M33 73l-8 17m25-15-3 16" stroke="'+ink+'" stroke-width="4" fill="none"/>'+
  '<path d="M34 55Q41 44 58 57L52 68Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="76" cy="29" r="2" fill="'+eye+'"/>');
 if(id==='af_lechwe_negro')return wrap(
  '<path d="M23 63L11 68" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="43" cy="57" rx="25" ry="15" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M29 67l-4 23m20-20-1 21m18-22 2 20" stroke="'+ink+'" stroke-width="4"/>'+
  '<path d="M60 54L67 34L80 36L89 56L75 66L65 61Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M68 35Q49 13 57 9M75 35Q90 15 85 10" fill="none" stroke="'+dark+'" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M74 61L86 62" stroke="'+light+'" stroke-width="3"/>'+
  '<circle cx="81" cy="48" r="2" fill="'+eye+'"/>');
 if(id==='af_calao_trompetero')return wrap(
  '<path d="M23 64L9 85L30 76Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="46" cy="57" rx="23" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M31 52Q48 42 59 62L43 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="68" cy="42" r="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M77 44Q92 32 97 48Q94 61 78 55Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M75 30L89 20L95 33L80 39Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M40 72l-4 16m16-16 4 16" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="72" cy="39" r="2" fill="'+eye+'"/>');

 if(id==='af_flamenco_enano')return wrap(
  '<path d="M34 67Q29 57 43 49Q59 44 63 56Q62 70 45 73Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M35 59Q46 49 54 62L44 71Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M61 53Q79 43 73 30Q66 19 76 17Q86 15 84 27" fill="none" stroke="'+c+'" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M61 53Q79 43 73 30Q66 19 76 17Q86 15 84 27" fill="none" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M84 26Q98 29 91 39L84 34Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M42 71l-6 19 8-4m9-15-2 18 8 1" fill="none" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M29 59L15 69L30 67" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="82" cy="23" r="1.5" fill="'+eye+'"/>');
 if(id==='af_pelicano_blanco')return wrap(
  '<path d="M26 66L10 79L29 71" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<ellipse cx="46" cy="60" rx="25" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M31 55Q45 50 60 61Q46 70 30 67Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M60 55Q69 46 64 30Q62 18 75 18Q85 19 82 32L77 54Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M80 30L97 35L83 47Q92 58 79 60L72 45Z" fill="#c6a36d" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M40 76l-5 12m18-12 2 12" fill="none" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="77" cy="27" r="1.8" fill="'+eye+'"/>');
 if(id==='af_tortuga_aldabra')return wrap(
  '<path d="M20 68l-7 16m26-7-4 13m23-13 4 13m11-22 7 16" fill="none" stroke="'+ink+'" stroke-width="8" stroke-linecap="round"/>'+
  '<path d="M18 68Q19 34 48 34Q76 37 77 69Q52 84 22 74Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M34 41L45 54L30 67M48 36l-3 18 17 14m6-25-6 25m-32-1 15 9 17-8" fill="none" stroke="'+dark+'" stroke-width="3"/>'+
  '<path d="M72 59Q82 49 91 56Q97 67 84 71L73 66Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="87" cy="59" r="1.8" fill="'+eye+'"/>');
 if(id==='af_loro_negro_seychelles')return wrap(
  '<path d="M30 66L18 89L37 73" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="47" cy="58" rx="20" ry="18" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M35 52Q48 46 57 60Q51 70 37 68Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="67" cy="41" r="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M76 43Q92 40 85 55L76 52Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M40 74l-4 12m16-12 3 12" stroke="'+ink+'" stroke-width="3" fill="none"/>'+
  '<circle cx="72" cy="38" r="2.1" fill="'+eye+'"/>');
 if(id==='af_tiburon_puntas_negras')return wrap(
  '<path d="M12 64Q31 43 56 47Q78 47 92 60L77 70Q51 79 25 68L12 64Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M45 49L53 24L68 48Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M18 63L4 46L11 63L3 84L23 70" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M52 68L43 81L68 72" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M63 55l6 12m-4-14 7 11" fill="none" stroke="'+dark+'" stroke-width="2"/>'+
  '<path d="M86 60l11-1-9 6" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="81" cy="56" r="1.6" fill="'+eye+'"/>');
 return null;
}

function africaV39Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const c=applySkin(sp.color,skin),ink='#35342e',dark=shade(c,-28),light=shade(c,25);
 const eye=eyeColor(skin);
 const wrap=shapes=>svgWrap(shapes,alphaGlow(skin));
 const dot=(x,y,r=2)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+eye+'"/>';
 if(id==='af_dugongo')return wrap(
   '<path d="M19 64Q8 74 13 81L28 73Q44 85 61 75Q80 79 90 64Q82 58 70 61Q55 42 31 48Q16 50 19 64Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M32 66Q40 75 53 69L43 82Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M79 64Q91 49 97 59L87 72L98 78Q83 82 79 71Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M17 62Q12 56 22 54m-6 15q9 6 19 0" fill="none" stroke="'+ink+'" stroke-width="2"/>'+dot(27,58));
 if(id==='af_manta_gigante')return wrap(
   '<path d="M49 38Q35 40 6 25Q10 64 35 69L48 76L61 69Q91 62 96 25Q72 42 57 38Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M47 70Q46 88 48 96" fill="none" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M37 40L25 26m36 13 15-13" fill="none" stroke="'+light+'" stroke-width="4"/>'+
   '<path d="M41 53q8 8 16 0" fill="none" stroke="'+dark+'" stroke-width="3"/>'+dot(40,48,1.8)+dot(58,48,1.8));
 if(id==='af_delfin_jorobado_indico')return wrap(
   '<path d="M12 65Q26 43 53 48L64 39L69 51Q86 57 91 63L77 68Q54 79 35 69L20 78Q23 69 12 65Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M45 49L52 25L61 48Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M17 62L5 53L10 70L5 82L23 72" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M51 67L40 80L63 70" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M80 65q8 0 14-5" stroke="'+ink+'" stroke-width="2" fill="none"/>'+dot(78,60,1.5));
 if(id==='af_calao_terrestre')return wrap(
   '<path d="M24 64L10 79L32 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<ellipse cx="47" cy="57" rx="23" ry="18" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M35 53q12-9 21 6l-16 12" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M54 47Q57 28 66 28Q81 26 81 43L73 52Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M78 39Q98 37 94 53L77 56L84 47Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2.7"/>'+
   '<path d="M57 77l-4 12m16-12 2 12" stroke="'+ink+'" stroke-width="4"/>'+dot(71,40));
 if(id==='af_macaco_berberia')return wrap(
   '<path d="M20 60Q9 67 12 82" stroke="'+dark+'" stroke-width="5" stroke-linecap="round" fill="none"/>'+
   '<ellipse cx="46" cy="60" rx="24" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M28 68l-6 18m30-12 1 14m12-31 13 19" stroke="'+ink+'" stroke-width="5" fill="none" stroke-linecap="round"/>'+
   '<circle cx="67" cy="43" r="16" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<circle cx="51" cy="39" r="7" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<ellipse cx="69" cy="49" rx="10" ry="9" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M64 56q7 4 13-2" stroke="'+ink+'" stroke-width="2" fill="none"/>'+dot(65,43,1.7)+dot(75,43,1.7));
 if(id==='af_antilope_sable')return wrap(
   '<path d="M24 65L11 72" stroke="'+ink+'" stroke-width="3"/>'+
   '<ellipse cx="42" cy="59" rx="23" ry="15" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M32 70l-2 18m19-18 2 18m12-16 1 16" stroke="'+ink+'" stroke-width="4"/>'+
   '<path d="M56 58L63 36L75 38L84 55L69 67Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M64 38Q50 17 58 6M73 40Q92 16 83 5" fill="none" stroke="'+dark+'" stroke-width="5" stroke-linecap="round"/>'+
   '<path d="M66 55l15 8" fill="none" stroke="'+light+'" stroke-width="4"/>'+dot(76,48,1.8));
 if(id==='af_pangolin_temminck')return wrap(
   '<path d="M20 68Q9 72 6 89Q22 90 29 77" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M22 66Q20 42 46 40Q72 43 76 65L65 78Q41 83 22 66Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   [30,43,56,68].map(x=>'<path d="M'+x+' 49l-5 10 7 8-7 8" fill="none" stroke="'+dark+'" stroke-width="3"/>').join('')+
   '<path d="M70 58Q85 52 93 65L82 70L72 68" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M32 78l-4 9m20-7-2 9m17-13 2 10" stroke="'+ink+'" stroke-width="3"/>'+dot(82,60,1.7));
 if(id==='af_martin_malaquita')return wrap(
   '<path d="M30 63L10 85L39 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<ellipse cx="48" cy="62" rx="19" ry="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M34 56q16-10 24 7q-10 12-22 5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<circle cx="63" cy="43" r="11" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M70 46L96 42L71 51Z" fill="#be8b4a" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M44 73l-3 13m14-13 3 13" stroke="'+ink+'" stroke-width="3"/>'+dot(67,40,1.5));
 return null;
}

// Beta 3.15.3 · Identidad visual por familia zoológica.
// Una base gráfica común preserva el estilo; siluetas, máscaras y colas distinguen especies.
function unifiedFamilySprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const latin=sp.latin||'',name=sp.name.toLocaleLowerCase('es');
 const pangolin=/^(Manis|Phataginus|Smutsia)\b/i.test(latin)||/pangol[ií]n/.test(name);
 const mustelid=/^(Lutra|Lontra|Enhydra|Lutrogale|Hydrictis|Meles|Martes|Mustela|Gulo|Mellivora|Aonyx|Neovison|Pekania)\b/i.test(latin);
 if(!pangolin&&!mustelid)return null;
 const c=applySkin(sp.color,skin);
 const ink='#39332c',dark=shade(c,-30),mid=shade(c,-13),light=shade(c,25);
 const pale=skin==='melanico'?'#647078':'#e8d7b7',eye=eyeColor(skin);
 const shape=(d,fill=c,stroke=ink,w=2.8)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
 const line=(d,col=ink,w=3)=>shape(d,'none',col,w);
 const dot=(x,y,r=2,col=eye)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'"/>';
 const wrap=content=>svgWrap(content,alphaGlow(skin));
 if(pangolin){
  const giant=/gigante|gigante|gigante/i.test(name)||/giganteus/i.test(latin);
  const tree=/arb[oó]r|tr[eé]boles|tricusp|tetradactyl/i.test(name+' '+latin);
  // Escamas superpuestas: todas usan la misma retícula, con proporciones y colas diferenciadas.
  const armor=giant?'M22 65Q20 37 47 34Q68 35 74 58Q70 76 43 76Q28 75 22 65Z'
   :tree?'M24 68Q17 45 43 40Q66 39 74 61Q70 76 45 76Q31 75 24 68Z'
   :'M23 66Q21 41 48 38Q69 40 77 60Q71 78 44 77Q29 75 23 66Z';
  const tail=tree
   ?shape('M24 65Q13 71 11 84Q7 94 17 94Q25 94 33 77L36 70Z',dark)
   :giant?shape('M28 68Q15 70 5 84L15 86Q31 81 36 74Z',dark)
   :shape('M27 68Q12 76 9 87L23 89Q36 79 37 72Z',dark);
  const scales=[];
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){
    const x=27+col*11+(row%2?5:0),y=47+row*9;
    if(x>70)continue;
    scales.push(shape('M'+x+' '+y+'q5-5 10 0l-4 8z',row%2?mid:light,dark,1.4));
  }
  return wrap(tail+shape('M36 71l-6 15m30-14 0 14', 'none',ink,4)
   +shape(armor,c)+scales.join('')
   +shape('M68 55Q78 50 91 61Q83 68 76 69L71 65Z',light)
   +shape('M88 63l7 2-7 3z',pale,ink,1.8)+dot(79,59,1.8));
 }
 const otter=/^(Lutra|Lontra|Enhydra|Lutrogale|Hydrictis|Aonyx)\b/i.test(latin);
 const badger=/^(Meles|Mellivora)\b/i.test(latin);
 const wolverine=/^Gulo\b/i.test(latin);
 const marten=/^(Martes|Pekania)\b/i.test(latin);
 const weasel=/^(Mustela|Neovison)\b/i.test(latin);
 const tail=otter?shape('M31 65Q17 65 7 82Q4 87 11 89Q23 79 37 75Z',dark)
  :marten?shape('M31 66Q12 67 9 81Q10 89 19 87Q26 81 35 75Z',dark)
  :badger?shape('M28 67Q15 69 13 76L28 78Z',dark)
  :wolverine?shape('M27 65Q10 64 8 76Q9 86 20 84L32 74Z',dark)
  :shape('M30 66Q14 65 10 79Q12 84 18 84Q23 77 36 73Z',dark);
 const body=badger?'M23 67Q23 47 46 44Q63 45 74 63Q75 77 47 78Q26 78 23 67Z'
  :wolverine?'M22 64Q21 44 43 42Q68 42 76 59Q79 75 56 78Q30 80 22 64Z'
  :otter?'M20 66Q25 49 49 50Q66 47 76 60Q73 73 45 76Q25 77 20 66Z'
  :marten?'M25 64Q26 47 49 47Q66 49 73 61Q70 72 49 75Q30 75 25 64Z'
  :'M25 64Q24 51 49 51Q69 51 75 62Q73 72 45 73Q30 72 25 64Z';
 const head=badger?'M60 47Q73 40 86 54Q91 63 82 69Q73 73 65 64Z'
  :otter?'M65 52Q77 42 88 54Q94 62 84 68Q73 69 66 62Z'
  :wolverine?'M61 47Q79 38 89 53Q95 65 84 69Q72 72 65 62Z'
  :'M64 50Q76 42 88 52Q94 60 84 67Q72 69 65 62Z';
 const ears=otter?'<circle cx="73" cy="49" r="4.5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'
  :badger?'<circle cx="73" cy="47" r="5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'
  :'<path d="M70 49l1-9 8 6m2 1 6-8 2 12" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>';
 const pattern=badger
   ?shape('M67 49L76 43L87 54L86 65L79 65L77 54L71 66L66 60Z',pale,ink,1.2)
   :wolverine?shape('M30 59Q44 49 62 54L72 60Q48 58 32 70Z',light,dark,1.5)
   :marten?shape('M62 61Q70 67 80 63Q68 76 57 67Z',pale,ink,1.2)
   :weasel?shape('M30 67Q51 70 68 62L69 68Q50 78 30 71Z',pale,dark,1.2)
   :shape('M30 68Q50 74 71 61Q66 75 46 75Z',light,dark,1.2);
 const legs=badger||wolverine?line('M36 73l-2 12m21-11 0 11m21-15 1 13',ink,4.8)
  :line('M37 72l-2 12m18-12 1 12m20-18 0 15',ink,3.5);
 const whiskers=otter?line('M81 65l10 1M81 63l10-4M78 66l5 9',ink,1.2):'';
 return wrap(tail+shape(body,c)+pattern+legs+shape(head,c)+ears
   +shape('M80 61Q88 61 93 62L88 68L82 67Z',pale,ink,1.5)
   +whiskers+dot(81,55,1.9)+dot(91,63,1.7,dark));
}

// Beta 3.15.4 · Sprites por taxón antes de los renderizadores genéricos.
function familyV3154Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const latin=sp.latin||'',name=sp.name.toLowerCase(),body=applySkin(sp.color,skin);
 const ink='#36302c',dark=shade(body,-25),light=shade(body,22),eye=eyeColor(skin),glow=alphaGlow(skin);
 if(latin==='Buceros rhinoceros'||latin==='Galemys pyrenaicus')
  return premiumSpeciesSprite(sp.name,sp.kind,body,skin,id);
 if(/^(Naja|Ophiophagus)\b/.test(latin)){
  const king=latin.startsWith('Ophiophagus'),indian=latin==='Naja naja',mozambique=latin==='Naja mossambica';
  const hood=king?20:indian?17:mozambique?15:16;
  const marking=indian
   ?`<ellipse cx="56" cy="36" rx="7" ry="6" fill="none" stroke="${light}" stroke-width="2.5"/><circle cx="56" cy="36" r="2" fill="${dark}"/>`
   :king
    ?`<path d="M40 42l28 0m-25 8l22 0m-18 8l17 0" stroke="${light}" stroke-width="2.4" fill="none"/>`
    :mozambique
     ?`<path d="M42 49q10 8 24 0m-22 7q8 6 18 0" stroke="${dark}" stroke-width="2.5" fill="none"/>`
     :`<path d="M45 48l19 0m-17 8l15 0" stroke="${light}" stroke-width="2.2" fill="none"/>`;
  return svgWrap(`<g data-family="cobra">
    <path d="M10 79Q20 64 34 74Q45 86 64 74Q77 64 70 55" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/>
    <path d="M10 79Q20 64 34 74Q45 86 64 74Q77 64 70 55" fill="none" stroke="${body}" stroke-width="11" stroke-linecap="round"/>
    <path d="M56 67Q${56-hood} 59 ${56-hood} 40Q${56-hood} 19 56 19Q${56+hood} 19 ${56+hood} 40Q${56+hood} 59 56 67Z" fill="${body}" stroke="${ink}" stroke-width="3"/>
    <path d="M50 31Q56 26 62 31L65 62Q56 68 47 62Z" fill="${light}" opacity=".65"/>
    ${marking}<ellipse cx="56" cy="38" rx="9" ry="8" fill="${body}" stroke="${ink}" stroke-width="2.6"/>
    <circle cx="51" cy="36" r="2.2" fill="${eye}"/><circle cx="61" cy="36" r="2.2" fill="${eye}"/>
    <path d="M56 45l0 8m0 0l-5 3m5-3l5 3" stroke="#9d4a49" fill="none" stroke-width="1.7"/></g>`,glow);
 }
 if(/^Lepus\b/.test(latin)||sp.kind==='hare'){
  const winter=/variable|nival/.test(name),fur=(winter&&skin==='normal')?'#e1ddd5':body;
  const ear=skin==='melanico'?'#5c5557':'#e7bcab';
  return svgWrap(`<g data-family="hare">
   <path d="M19 66Q9 61 10 51" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
   <ellipse cx="46" cy="64" rx="25" ry="15" fill="${fur}" stroke="${ink}" stroke-width="3"/>
   <path d="M32 74l-10 13m18-11l-3 12m18-14l7 13" stroke="${ink}" stroke-width="4" fill="none"/>
   <circle cx="67" cy="51" r="11" fill="${fur}" stroke="${ink}" stroke-width="3"/>
   <ellipse cx="61" cy="30" rx="5" ry="18" transform="rotate(-12 61 30)" fill="${fur}" stroke="${ink}" stroke-width="2.8"/>
   <ellipse cx="73" cy="30" rx="5" ry="19" transform="rotate(10 73 30)" fill="${fur}" stroke="${ink}" stroke-width="2.8"/>
   <ellipse cx="61" cy="30" rx="2" ry="12" transform="rotate(-12 61 30)" fill="${ear}"/>
   <ellipse cx="73" cy="30" rx="2" ry="12" transform="rotate(10 73 30)" fill="${ear}"/>
   <ellipse cx="69" cy="55" rx="7" ry="4" fill="${light}" opacity=".8"/>
   <circle cx="70" cy="48" r="1.8" fill="${eye}"/>
   <path d="M74 55l10 2m-10 1l8 6" stroke="${dark}" stroke-width="1.5"/></g>`,glow);
 }
 return null;
}

function spriteFor(kind,color,skin,id){
 const mammal3194=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_MAMMAL_ART_V3194==='function') ? globalThis.ATLAS_MAMMAL_ART_V3194(SPECIES[id],color,skin,null,id) : null; if(mammal3194)return mammal3194;
 const bird3193=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_BIRD_ART_V3193==='function') ? globalThis.ATLAS_BIRD_ART_V3193(SPECIES[id],color,skin) : null; if(bird3193)return bird3193;
 const fish3191=(typeof window!=='undefined' && typeof window.ATLAS_FISH_ART_V3191==='function') ? window.ATLAS_FISH_ART_V3191(SPECIES[id],color,skin) : null; if(fish3191)return fish3191;
 const herp3192=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_HERP_ART_V3192==='function') ? globalThis.ATLAS_HERP_ART_V3192(SPECIES[id],color,skin) : null; if(herp3192)return herp3192;
 const special3154=familyV3154Sprite(id,skin);if(special3154)return special3154;
 const unified=unifiedFamilySprite(id,skin);if(unified)return unified;
 const af310=africaV310Sprite(id,skin);if(af310)return af310;
 const af39=africaV39Sprite(id,skin);if(af39)return af39;
 const polished=polishedSpeciesSprite(id,skin);if(polished)return polished;
 const newAsia=asiaV23Sprite(id,skin);if(newAsia)return newAsia;
 const herp=detailedHerpSprite(id,skin);if(herp)return herp;
 const v22=asiaV22Sprite(id,skin);if(v22)return v22;
 const asian=asianSpeciesSprite(id,skin);
 if(asian)return asian;
 const name=(SPECIES[id]&&SPECIES[id].name)||'';
 const premium=premiumSpeciesSprite(name,kind,color,skin,id);
 if(premium) return premium;
 const outline='#3a3026';
 const familyName=name.toLocaleLowerCase('es');
 const body=color;
 const light=skin==='melanico' ? '#424951' : shade(body,20);
 const dark=skin==='melanico' ? '#08090b' : shade(body,-22);
 const deep=skin==='melanico' ? '#000000' : shade(body,-34);
 const cream=skin==='melanico' ? '#7b858f' : (skin==='albino'?'#ece7dd':'#efe4d2');
 const pale=skin==='melanico' ? '#9ca6ae' : (skin==='albino'?'#f7f5ef':'#f4efe4');
 const accent=skin==='melanico' ? '#2a3037' : shade(body,-6);
 const eye=eyeColor(skin);
 const glow=alphaGlow(skin);
 const legs=(x1,x2,y=72)=>legSet(x1,x2,y);
 const birdLegs=(x1,x2,y=73,c='#7e5b35')=>`<path d="M${x1} ${y}l-3 12m${x2-x1+3} -12l3 12" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
 const wing=(d,fill=dark)=>`<path d="${d}" fill="${fill}" stroke="${outline}" stroke-width="3"/>`;
 const facePatch=(x,y,w,h,fill=cream)=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${fill}"/>`;


 if(kind==='giraffe') return svgWrap('<ellipse cx="46" cy="65" rx="22" ry="13" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M57 62L64 20Q70 15 75 20L72 61Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M64 22l-2-8m10 7 2-8" stroke="'+dark+'" stroke-width="3"/><ellipse cx="75" cy="23" rx="12" ry="7" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M31 72v17m13-16v16m11-16v16m8-20v18" stroke="'+outline+'" stroke-width="3"/><path d="M30 58l9 5m-2-13 8 6m2 4 8 4m8-34 7 2m-8 8 9 2m-11 6 9 1" stroke="'+dark+'" stroke-width="5"/><circle cx="81" cy="20" r="2" fill="'+eye+'"/>',glow);
 if(kind==='zebra') return svgWrap('<ellipse cx="46" cy="62" rx="26" ry="16" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M61 52l8-22 10-1 6 10-12 8-6 18" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M22 55l7 13m5-22 9 27m0-26 6 28m0-26 8 25m6-40 8 10m1-16 6 11" stroke="'+deep+'" stroke-width="5"/><path d="M30 73v16m13-15v16m15-15v16m9-21v19" stroke="'+outline+'" stroke-width="3"/><path d="M20 59l-10 10" stroke="'+deep+'" stroke-width="4"/><circle cx="78" cy="37" r="2" fill="'+eye+'"/>',glow);
 if(kind==='hippo') return svgWrap('<ellipse cx="47" cy="65" rx="29" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="70" cy="59" rx="20" ry="17" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M56 48l1-8 10 3m9 1 7-5 3 10" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="78" cy="68" rx="12" ry="9" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="67" cy="52" r="2.5" fill="'+eye+'"/><circle cx="75" cy="65" r="2" fill="'+deep+'"/><circle cx="85" cy="65" r="2" fill="'+deep+'"/><path d="M29 80v9m18-8v8m16-10v10" stroke="'+outline+'" stroke-width="4"/>',glow);
 if(kind==='ostrich') return svgWrap('<ellipse cx="44" cy="58" rx="22" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M58 53Q72 36 66 18" stroke="'+light+'" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="66" cy="17" r="7" fill="'+light+'" stroke="'+outline+'" stroke-width="2"/><path d="M70 17l11 2-11 4" fill="#d8b77d" stroke="'+outline+'" stroke-width="1.5"/><path d="M39 75l-3 15m18-16 5 16m-26 0 11 0m10 0h12" fill="none" stroke="'+dark+'" stroke-width="3"/><path d="M28 57l-12-6m13 12-13 1" stroke="'+deep+'" stroke-width="5"/><circle cx="68" cy="15" r="2" fill="'+eye+'"/>',glow);
 if(kind==='lemur') return svgWrap('<path d="M28 63Q11 63 12 39Q14 19 24 18" fill="none" stroke="'+dark+'" stroke-width="10" stroke-linecap="round"/><path d="M21 23l-8 7m8 7-9 7m8 9-8 4" stroke="'+pale+'" stroke-width="5"/><ellipse cx="50" cy="67" rx="19" ry="18" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="56" cy="39" r="16" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M42 30l-2-16 12 9m11 1 10-11-1 22" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="56" cy="45" rx="12" ry="9" fill="'+pale+'"/><circle cx="50" cy="39" r="3" fill="'+eye+'"/><circle cx="62" cy="39" r="3" fill="'+eye+'"/><path d="M48 79v11m13-11v11" stroke="'+outline+'" stroke-width="3"/>',glow);

 if(kind==='cat'){
   const lynx=/lince/i.test(familyName);
   const tail=lynx?`<path d="M24 64q-9 1-13 6q9 4 16 2" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>`:`<path d="M22 63q-10 4-13 12q10 3 17-1q5-3 9-7" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/>`;
   const ears=lynx?`<polygon points="59,40 63,28 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,28 78,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><path d="M63 28l-2-4m12 4l2-4" stroke="${cream}" stroke-width="2" stroke-linecap="round"/>`:`<polygon points="59,41 63,30 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,30 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>`;
   const pattern=lynx?`<circle cx="39" cy="58" r="2" fill="${dark}"/><circle cx="50" cy="65" r="2" fill="${dark}"/><circle cx="45" cy="53" r="1.8" fill="${dark}"/>`:`<path d="M36 55l6 8m6-10 4 10m-16 12 7-4m12-2 6-3" stroke="${dark}" stroke-width="2.2" stroke-linecap="round"/>`;
   return svgWrap(`<ellipse cx="46" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.42"/>${pattern}<ellipse cx="48" cy="67" rx="12" ry="7" fill="${cream}"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/>${ears}<ellipse cx="69" cy="52" rx="8" ry="5" fill="${cream}"/><circle cx="70" cy="45" r="1.8" fill="${eye}"/>${tail}${legs(38,53,71)}`,glow);
 }
 if(kind==='boar' || /jabal/i.test(familyName)){
   return svgWrap(`<ellipse cx="45" cy="62" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M29 51Q42 38 57 49" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><path d="M25 54l7-12m5 10l4-11m10 10l4-10" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="68" cy="50" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="76" cy="55" rx="8" ry="6" fill="#b89471" stroke="${outline}" stroke-width="2.5"/><path d="M72 46q2-5 6-5m-10 6q-2-5-6-5" stroke="${cream}" stroke-width="2.3" stroke-linecap="round"/><path d="M76 57l-4 4m8-3l5 2" stroke="#f4ead5" stroke-width="2.4" stroke-linecap="round"/><path d="M23 60q-7 0-11 6" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(kind==='hare' || kind==='rabbit' || /liebre|conejo/.test(familyName)){
   const hare = kind==='hare' || /liebre/.test(familyName);
   const winter = /variable/.test(familyName) || /nival/.test(familyName);
   const inner = winter?'#e7dfe0':'#efcaa8';
   const bodyFill = winter && skin!=='melanico' ? '#dddcd6' : body;
   const tail = hare?`<path d="M22 64q-8 3-10 10" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`:`<circle cx="23" cy="63" r="4" fill="${cream}" stroke="${outline}" stroke-width="2"/>`;
   return svgWrap(`<ellipse cx="46" cy="62" rx="22" ry="15" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><ellipse cx="50" cy="67" rx="11" ry="7" fill="${cream}" opacity="0.95"/><circle cx="66" cy="49" r="11" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><ellipse cx="60" cy="30" rx="5" ry="16" transform="rotate(-10 60 30)" fill="${bodyFill}" stroke="${outline}" stroke-width="2.6"/><ellipse cx="72" cy="31" rx="5" ry="18" transform="rotate(10 72 31)" fill="${bodyFill}" stroke="${outline}" stroke-width="2.6"/><ellipse cx="60" cy="31" rx="2" ry="11" transform="rotate(-10 60 31)" fill="${inner}"/><ellipse cx="72" cy="32" rx="2" ry="12" transform="rotate(10 72 32)" fill="${inner}"/><circle cx="69" cy="47" r="1.6" fill="${eye}"/>${tail}<path d="M34 58l5 6m10-7 4 8" stroke="${dark}" stroke-width="2.1" stroke-linecap="round"/>${legs(39,52,72)}`,glow);
 }
 if(kind==='canid' && /zorro/.test(familyName)){
   const arctic=/ártico|artico/.test(familyName);
   const bodyFill=arctic && skin!=='melanico' ? '#dfe4ea' : body;
   const flank=arctic && skin!=='melanico' ? '#f4f7fb' : '#f2eee5';
   const earFill=arctic && skin!=='melanico' ? '#c8cfd8' : '#2f2c2a';
   return svgWrap(`<path d="M18 61Q11 49 12 38Q26 45 36 56" fill="${dark}" stroke="${outline}" stroke-width="3"/><ellipse cx="47" cy="60" rx="24" ry="16" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><path d="M34 56q13-7 26 7q-14 13-24 4z" fill="${light}" stroke="${outline}" stroke-width="2"/><ellipse cx="49" cy="67" rx="12" ry="7" fill="${flank}"/><circle cx="67" cy="45" r="12" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><polygon points="58,37 63,24 69,37" fill="${earFill}" stroke="${outline}" stroke-width="2.4"/><polygon points="69,37 78,25 80,39" fill="${earFill}" stroke="${outline}" stroke-width="2.4"/><ellipse cx="72" cy="52" rx="8" ry="5" fill="${flank}"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M21 58q-11 2-14 12q12 5 22 1q8-4 15-9" fill="none" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }

 if(id==='salamandra_comun' || id==='salamandra_alpina'){
   const spot=id==='salamandra_comun' ? '<circle cx="29" cy="64" r="3" fill="#f0c93f"/><circle cx="44" cy="70" r="3" fill="#f0c93f"/><circle cx="59" cy="62" r="3" fill="#f0c93f"/><circle cx="54" cy="53" r="2.3" fill="#f0c93f"/>' : '';
   return svgWrap(`<path d="M15 66Q28 51 42 58Q50 61 58 55Q68 49 77 56Q84 64 78 73Q70 81 55 77Q40 84 28 79Q17 75 15 66Z" fill="${body}" stroke="#2f2922" stroke-width="3"/>${spot}<circle cx="79" cy="61" r="7" fill="${accent}" stroke="#2f2922" stroke-width="3"/><circle cx="82" cy="59" r="1.7" fill="${eye}"/><path d="M18 65l-9-6m24 14l-8 10m17-11l-4 12m17-18l-2-10" stroke="#2f2922" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='lagarto_ocelado'){
   return svgWrap(`<path d="M13 66Q28 54 43 58Q55 59 63 53Q73 47 83 53Q90 61 83 70Q74 80 59 76Q41 82 25 78Q14 75 13 66Z" fill="${body}" stroke="#2d3a24" stroke-width="3"/><circle cx="30" cy="65" r="2.6" fill="#82c38b"/><circle cx="45" cy="70" r="2.6" fill="#82c38b"/><circle cx="58" cy="61" r="2.6" fill="#82c38b"/><circle cx="53" cy="54" r="2.2" fill="#82c38b"/><circle cx="82" cy="57" r="7" fill="${accent}" stroke="#2d3a24" stroke-width="3"/><circle cx="84" cy="55" r="1.6" fill="${eye}"/><path d="M12 66Q4 67 3 74" fill="none" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/><path d="M24 66l-7 9m18-4l-4 10m14-10l-3 10m18-17l2-10" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='vibora_aspid'){
   return svgWrap(`<path d="M17 69Q29 55 40 57Q52 60 61 53Q70 46 79 50Q88 54 84 65Q81 74 68 72Q56 71 49 75Q38 81 28 78Q17 75 17 69Z" fill="${body}" stroke="#3c3329" stroke-width="3"/><path d="M18 69Q10 70 8 76" fill="none" stroke="#3c3329" stroke-width="3" stroke-linecap="round"/><circle cx="82" cy="58" r="6" fill="${accent}" stroke="#3c3329" stroke-width="3"/><circle cx="84" cy="57" r="1.5" fill="${eye}"/><path d="M30 67q7-4 14 0m8-3q7-4 13 0m-29 8q8-3 15 0m7-3q6-3 12 0" stroke="#6a5541" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,glow);
 }
 if(id==='jabali'){
   return svgWrap(`<ellipse cx="45" cy="61" rx="24" ry="16" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="41" cy="57" rx="11" ry="6" fill="rgba(255,255,255,.11)"/><circle cx="67" cy="50" r="12" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="76" cy="54" rx="8" ry="6" fill="#b89471" stroke="#342c24" stroke-width="2.5"/><path d="M74 57l-4 4m8-4l5 3" stroke="#f4ead5" stroke-width="2.6" stroke-linecap="round"/><polygon points="59,43 62,34 67,42" fill="#4b3b2e" stroke="#342c24" stroke-width="2.3"/><circle cx="70" cy="47" r="1.7" fill="${eye}"/><path d="M29 57q-8-7-10-17" fill="none" stroke="#4b3b2e" stroke-width="4" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(id==='aguila_real' || id==='aguila_imperial_iberica'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="19" ry="18" fill="${body}" stroke="#342b24" stroke-width="3"/>${wing('M29 58Q17 45 15 33Q29 35 41 48',dark)}${wing('M57 51Q70 38 85 35Q83 49 67 62',light)}<circle cx="56" cy="46" r="10" fill="${accent}" stroke="#342b24" stroke-width="3"/><polygon points="64,49 82,45 66,56" fill="#d2a246" stroke="#342b24" stroke-width="2"/><circle cx="58" cy="45" r="1.8" fill="${eye}"/>${birdLegs(43,53,77)}`,glow);
 }
 if(id==='quebrantahuesos' || id==='buitre_leonado'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="20" ry="17" fill="${body}" stroke="#372e25" stroke-width="3"/>${wing('M28 56Q16 47 12 36Q28 39 39 48',dark)}${wing('M58 51Q71 41 85 39Q82 52 66 61',light)}<circle cx="57" cy="46" r="10" fill="${pale}" stroke="#372e25" stroke-width="3"/><polygon points="65,49 83,47 66,57" fill="#d2a046" stroke="#372e25" stroke-width="2"/><circle cx="59" cy="45" r="1.8" fill="${eye}"/>${birdLegs(44,54,77)}`,glow);
 }
 if(id==='buho_real' || id==='buho_comun'){
   const tufts=id==='buho_real' ? '<path d="M38 32l-5 8m28-8l5 8" stroke="#3a3026" stroke-width="3.4" stroke-linecap="round"/>' : '<path d="M41 35l-3 5m21-5l3 5" stroke="#3a3026" stroke-width="3" stroke-linecap="round"/>';
   return svgWrap(`<ellipse cx="50" cy="58" rx="${id==='buho_real'?'23':'21'}" ry="25" fill="${body}" stroke="#3a3026" stroke-width="3"/><ellipse cx="50" cy="65" rx="10" ry="8" fill="rgba(255,255,255,.12)"/><circle cx="42" cy="51" r="6.5" fill="${pale}"/><circle cx="58" cy="51" r="6.5" fill="${pale}"/><circle cx="42" cy="51" r="2.1" fill="${eye}"/><circle cx="58" cy="51" r="2.1" fill="${eye}"/><polygon points="50,57 46,63 54,63" fill="#d89438"/>${tufts}`,glow);
 }
 if(id==='milano_real'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="18" ry="17" fill="${body}" stroke="#372f27" stroke-width="3"/>${wing('M29 58Q17 45 15 34Q27 37 40 49',dark)}${wing('M57 52Q72 40 85 38Q83 51 68 62',light)}<circle cx="57" cy="46" r="9" fill="${accent}" stroke="#372f27" stroke-width="3"/><polygon points="64,49 80,46 66,55" fill="#d6a14a" stroke="#372f27" stroke-width="2"/><path d="M39 77l8 5 8-5" fill="none" stroke="#6f4b31" stroke-width="3" stroke-linecap="round"/>${birdLegs(44,52,76)}`,glow);
 }
 if(id==='urogallo_comun'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="21" ry="16" fill="${body}" stroke="#3a2f26" stroke-width="3"/><circle cx="64" cy="49" r="9" fill="${body}" stroke="#3a2f26" stroke-width="3"/>${wing('M26 58Q14 48 17 35Q28 38 36 49',dark)}<path d="M20 55Q10 48 9 39" fill="none" stroke="#3a2f26" stroke-width="2.6" stroke-linecap="round"/><circle cx="68" cy="47" r="1.7" fill="${eye}"/><circle cx="71" cy="45" r="2.5" fill="#c74033"/><polygon points="70,51 80,49 71,56" fill="#d5a03b" stroke="#3a2f26" stroke-width="2"/>${birdLegs(44,54,75)}`,glow);
 }
 if(id==='perdiz_nival'){
   return svgWrap(`<ellipse cx="49" cy="60" rx="21" ry="16" fill="${body}" stroke="#3d352d" stroke-width="3"/><circle cx="64" cy="49" r="9" fill="${body}" stroke="#3d352d" stroke-width="3"/>${wing('M27 58Q18 50 18 43Q25 46 34 53',accent)}<circle cx="68" cy="47" r="1.7" fill="${eye}"/><polygon points="70,51 80,49 71,56" fill="#d7a443" stroke="#3d352d" stroke-width="2"/><path d="M35 68q11 5 23 0" stroke="rgba(0,0,0,.10)" stroke-width="3" fill="none"/>${birdLegs(44,54,75,'#8c6e4b')}`,glow);
 }
 if(id==='bisonte_europeo'){
   return svgWrap(`<ellipse cx="44" cy="61" rx="24" ry="17" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="64" cy="50" r="11" fill="${accent}" stroke="#342b23" stroke-width="3"/><path d="M31 49Q31 34 43 34Q56 35 57 49" fill="${deep}" stroke="#342b23" stroke-width="3"/><path d="M58 46q8-6 16-2m-18 2q-7-7-15-4" fill="none" stroke="#eadbc1" stroke-width="2.8" stroke-linecap="round"/><circle cx="68" cy="48" r="1.7" fill="${eye}"/>${legs(38,53,73)}<path d="M21 62q-8 3-8 10" fill="none" stroke="#342b23" stroke-width="4" stroke-linecap="round"/>`,glow);
 }
 if(id==='ciguena_negra' || id==='ciguena_blanca'){
   const beak=id==='ciguena_negra' ? '#b74634' : '#cc6f3e';
   const wingFill=id==='ciguena_negra' ? dark : '#2a2a2a';
   const bodyFill=id==='ciguena_blanca' && skin==='normal' ? '#f3efe7' : body;
   return svgWrap(`<ellipse cx="47" cy="60" rx="16" ry="12" fill="${bodyFill}" stroke="#372f29" stroke-width="3"/><circle cx="61" cy="43" r="7" fill="${bodyFill}" stroke="#372f29" stroke-width="3"/><path d="M57 45Q53 28 60 21" fill="none" stroke="#372f29" stroke-width="3" stroke-linecap="round"/><polygon points="66,43 85,41 67,48" fill="${beak}" stroke="#372f29" stroke-width="2"/><path d="M43 71v17m9-17v17" stroke="${beak}" stroke-width="3" stroke-linecap="round"/>${wing('M35 54Q22 45 19 35Q31 38 41 49',wingFill)}`,glow);
 }
 if(id==='alce'){
   return svgWrap(`<ellipse cx="43" cy="61" rx="24" ry="16" fill="${body}" stroke="#3a3027" stroke-width="3"/><circle cx="66" cy="48" r="10" fill="${body}" stroke="#3a3027" stroke-width="3"/><path d="M58 31l-4-11m4 11l-8-5m8 5l-1-8m13 5l7-11m-7 11l7-6m-7 6v-8" stroke="#6a523b" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="69" cy="46" r="1.6" fill="${eye}"/>${legs(37,53,73)}`,glow);
 }
 if(id==='reno'){
   return svgWrap(`<ellipse cx="44" cy="61" rx="23" ry="15" fill="${body}" stroke="#3b3027" stroke-width="3"/><circle cx="66" cy="48" r="10" fill="${body}" stroke="#3b3027" stroke-width="3"/><path d="M58 31l-4-10m4 10l-7-5m7 5l-1-7m14 0l6-10m-6 10l7-5m-7 5l1-8" stroke="#71573d" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M47 66q11 5 17 0" stroke="${cream}" stroke-width="4" fill="none"/>${legs(38,53,73)}`,glow);
 }
 if(id==='oso_pardo'){
   return svgWrap(`<ellipse cx="47" cy="61" rx="24" ry="18" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="66" cy="48" r="12" fill="${accent}" stroke="#342b23" stroke-width="3"/><circle cx="58" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><circle cx="74" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><path d="M69 50q6 2 8 6q-6 2-10 0" fill="${cream}"/>${legs(39,53,74)}`,glow);
 }
 if(id==='castor_europeo'){
   return svgWrap(`<ellipse cx="46" cy="63" rx="21" ry="14" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="64" cy="54" r="10" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="68" cy="52" r="1.5" fill="${eye}"/><path d="M23 68q-10 1-12 9q9 6 19 2" fill="#75563b" stroke="#3a3026" stroke-width="3"/><path d="M66 58h4" stroke="#f0e7d2" stroke-width="2.3"/>${legs(41,53,73)}`,glow);
 }
 if(id==='pelicano_cenudo'){
   return svgWrap(`<ellipse cx="47" cy="60" rx="18" ry="13" fill="${body}" stroke="#40362f" stroke-width="3"/><circle cx="61" cy="46" r="8" fill="${body}" stroke="#40362f" stroke-width="3"/><path d="M65 48 85 47 71 57 61 55Z" fill="#d39a47" stroke="#40362f" stroke-width="2"/>${birdLegs(46,54,71,'#8e7351')}${wing('M31 56Q20 48 17 37Q30 40 39 49',dark)}`,glow);
 }
 if(id==='petirrojo'){
   return svgWrap(`<ellipse cx="49" cy="61" rx="17" ry="13" fill="${body}" stroke="#392f27" stroke-width="3"/><circle cx="63" cy="49" r="9" fill="${body}" stroke="#392f27" stroke-width="3"/><ellipse cx="56" cy="57" rx="8" ry="9" fill="#d56d47"/><polygon points="70,50 80,47 71,55" fill="#d39b3f" stroke="#392f27" stroke-width="2"/><circle cx="65" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,52,74)}`,glow);
 }
 if(id==='flamenco_comun'){
   return svgWrap(`<ellipse cx="50" cy="60" rx="18" ry="14" fill="${body}" stroke="#433027" stroke-width="3"/><circle cx="63" cy="45" r="7" fill="${body}" stroke="#433027" stroke-width="3"/><path d="M57 46Q55 28 66 22" fill="none" stroke="#433027" stroke-width="3" stroke-linecap="round"/><polygon points="69,45 82,43 70,50" fill="#1d1d1d" stroke="#433027" stroke-width="2"/><path d="M46 72v15m8-15v15" stroke="#cf8097" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='conejo_europeo' || id==='liebre_variable'){
   const head=id==='liebre_variable'?12:10, bodyW=id==='liebre_variable'?24:21;
   const ears=id==='liebre_variable'
   ? '<path d="M64 46l-4-30q10-8 14 25m0 3l8-27q9-6 8 3l-8 25" fill="'+body+'" stroke="#3c3328" stroke-width="2.5"/>'
   : '<path d="M63 47l-3-18q7-8 11 15m5 2l6-16q8-4 5 6l-5 15" fill="'+body+'" stroke="#3c3328" stroke-width="2.5"/>';
   return svgWrap(`<ellipse cx="47" cy="${id==='liebre_variable'?'67':'66'}" rx="${bodyW}" ry="14" fill="${body}" stroke="#3c3328" stroke-width="3"/><circle cx="${id==='liebre_variable'?'69':'67'}" cy="${id==='liebre_variable'?'57':'56'}" r="${head}" fill="${body}" stroke="#3c3328" stroke-width="3"/>${ears}<circle cx="${id==='liebre_variable'?'73':'71'}" cy="${id==='liebre_variable'?'56':'55'}" r="1.8" fill="${eye}"/>${legs(44,54,74)}`,glow);
 }
 if(id==='ardilla_roja'){
   return svgWrap(`<ellipse cx="53" cy="65" rx="19" ry="17" fill="${body}" stroke="#3c3028" stroke-width="3"/><circle cx="65" cy="46" r="12" fill="${body}" stroke="#3c3028" stroke-width="3"/><path d="M39 64Q13 54 21 30Q30 17 37 29Q28 43 39 47" fill="${body}" stroke="#3c3028" stroke-width="6"/><circle cx="69" cy="44" r="2" fill="${eye}"/><path d="M62 73v13m-11-11v11" stroke="#3c3028" stroke-width="3"/>`,glow);
 }
 if(id==='erizo_europeo'){
   return svgWrap(`<path d="M17 66L20 53L14 48L24 44L21 35L32 39L36 28L44 37L55 30L62 44Q79 43 84 56Q87 70 74 76Q62 82 47 80Q34 81 24 76Q16 72 17 66Z" fill="${body}" stroke="#3a3128" stroke-width="3"/><circle cx="71" cy="59" r="8" fill="${cream}" stroke="#3a3128" stroke-width="3"/><circle cx="74" cy="57" r="1.5" fill="${eye}"/><polygon points="79,61 85,60 80,64" fill="#3a3128"/>`,glow);
 }
 if(id==='martin_pescador'){
   return svgWrap(`<ellipse cx="47" cy="61" rx="16" ry="12" fill="${body}" stroke="#3b3128" stroke-width="3"/><circle cx="61" cy="49" r="8" fill="${body}" stroke="#3b3128" stroke-width="3"/><ellipse cx="53" cy="62" rx="8" ry="5.5" fill="#e18a42"/>${wing('M33 56Q22 48 18 39Q30 42 40 50','#1e7ca6')}<polygon points="67,49 84,46 68,54" fill="#262421" stroke="#3b3128" stroke-width="2"/><circle cx="63" cy="47" r="1.6" fill="${eye}"/>${birdLegs(45,50,74)}`,glow);
 }
 if(id==='foca_monje'){
   return svgWrap(`<ellipse cx="48" cy="62" rx="26" ry="16" fill="${body}" stroke="#33403e" stroke-width="3"/><circle cx="69" cy="55" r="10" fill="${accent}" stroke="#33403e" stroke-width="3"/><ellipse cx="72" cy="58" rx="5" ry="4" fill="${cream}"/><circle cx="71" cy="53" r="1.6" fill="${eye}"/><path d="M22 66q-10 5-13 14q10 2 19-3" fill="none" stroke="#33403e" stroke-width="4.5" stroke-linecap="round"/>`,glow);
 }
 if(id==='abubilla'){
   return svgWrap(`<ellipse cx="48" cy="61" rx="16" ry="12" fill="${body}" stroke="#3f342a" stroke-width="3"/><circle cx="62" cy="49" r="8" fill="${body}" stroke="#3f342a" stroke-width="3"/><path d="M58 39l-2-10m5 10l3-11m1 11l7-9" stroke="#d2a36b" stroke-width="2.8" stroke-linecap="round"/>${wing('M30 57Q20 48 18 39Q28 42 38 50',accent)}<polygon points="67,50 81,47 68,55" fill="#252321" stroke="#3f342a" stroke-width="2"/><circle cx="64" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,50,74,'#815f38')}`,glow);
 }
 if(id==='abejaruco_europeo'){
   return svgWrap(`<ellipse cx="48" cy="61" rx="17" ry="12" fill="${body}" stroke="#3a3027" stroke-width="3"/><circle cx="62" cy="49" r="8" fill="${body}" stroke="#3a3027" stroke-width="3"/><ellipse cx="51" cy="62" rx="8" ry="5" fill="#d4c056"/>${wing('M31 56Q21 48 18 39Q28 42 39 50','#7ac0ca')}<polygon points="67,50 82,47 68,55" fill="#2b2723" stroke="#3a3027" stroke-width="2"/><circle cx="64" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,50,74,'#7f5a35')}`,glow);
 }
 if(id==='tortuga_mora'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="20" ry="15" fill="${body}" stroke="#3c3329" stroke-width="3"/><path d="M33 51q14-10 29 0v19q-14 10-29 0z" fill="${shade(body,-10)}" opacity="0.55"/><circle cx="65" cy="56" r="7" fill="${light}" stroke="#3c3329" stroke-width="3"/><circle cx="67" cy="55" r="1.4" fill="${eye}"/><path d="M30 69l-6 6m14 0l-4 8m18-1l4 8m12-18l6 6" stroke="#3c3329" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='zorro_rojo' || id==='lobo_gris' || id==='chacal_dorado'){
   const tailStroke=id==='lobo_gris'?dark:accent;
   const muzzle=id==='chacal_dorado' ? '#dac39b' : cream;
   return svgWrap(`<ellipse cx="46" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="43" cy="56" rx="11" ry="6" fill="${light}" opacity="0.6"/><ellipse cx="48" cy="66" rx="11" ry="7" fill="${muzzle}" opacity="0.95"/><circle cx="67" cy="45" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M68 50q5 1 8 6q-5 2-10 0" fill="${muzzle}"/><polygon points="58,37 62,24 68,37" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="69,36 78,25 80,39" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M23 57q-9 2-13 12q10 3 17-1q6-4 10-7" fill="none" stroke="${tailStroke}" stroke-width="6" stroke-linecap="round"/><path d="M24 58q-9 2-12 10q8 1 14-2" fill="none" stroke="${light}" stroke-width="2.2" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(id==='gato_montes' || id==='lince_boreal' || id==='lince_iberico'){
   const tufts=/lince/.test(id)?'<path d="M58 39l-2-6m18 6l2-6" stroke="#3a3026" stroke-width="2.5" stroke-linecap="round"/>':'';
   const tail=/lince/.test(id)?'<path d="M23 63q-6 2-9 8" stroke="'+dark+'" stroke-width="4.5" fill="none" stroke-linecap="round"/>':'<path d="M23 63q-7 3-10 10" stroke="'+dark+'" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
   return svgWrap(`<ellipse cx="47" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.5"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="59,40 63,29 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,29 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>${tufts}<circle cx="70" cy="45" r="1.8" fill="${eye}"/>${tail}${legs(39,53,70)}`,glow);
 }
 if(id==='nutria_europea'){
   return svgWrap(`<ellipse cx="46" cy="61" rx="27" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="45" cy="63" rx="12" ry="5" fill="${light}" opacity="0.55"/><circle cx="72" cy="54" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M74 55q5 2 7 6q-5 2-9 0" fill="${cream}"/><circle cx="75" cy="51" r="1.6" fill="${eye}"/><path d="M18 61q-7 4-10 12" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>${legs(40,54,69)}`,glow);
 }
 if(id==='garza_real'){
   return svgWrap(`<ellipse cx="47" cy="60" rx="15" ry="12" fill="${body}" stroke="#3c332c" stroke-width="3"/><circle cx="61" cy="43" r="7" fill="${body}" stroke="#3c332c" stroke-width="3"/><path d="M57 44Q53 28 59 22" fill="none" stroke="#3c332c" stroke-width="3" stroke-linecap="round"/><polygon points="66,43 84,41 67,47" fill="#d7a44a" stroke="#3c332c" stroke-width="2"/><path d="M44 71v17m8-17v17" stroke="#7f6a4c" stroke-width="3" stroke-linecap="round"/>${wing('M35 54Q23 45 20 35Q31 39 40 49',dark)}`,glow);
 }
 if(id==='cisne_vulgar'){
   return svgWrap(`<ellipse cx="49" cy="61" rx="19" ry="14" fill="${skin==='normal'?'#f3f2ed':body}" stroke="#3c332c" stroke-width="3"/><circle cx="61" cy="46" r="8" fill="${skin==='normal'?'#f3f2ed':body}" stroke="#3c332c" stroke-width="3"/><path d="M56 47Q55 31 62 24" fill="none" stroke="#3c332c" stroke-width="3" stroke-linecap="round"/><polygon points="67,46 81,44 68,50" fill="#d39839" stroke="#3c332c" stroke-width="2"/>${birdLegs(44,52,73,'#7f5d39')}`,glow);
 }
 // Generic families
 if(kind==='canid') return svgWrap(`<ellipse cx="46" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="43" cy="56" rx="11" ry="6" fill="${light}" opacity="0.6"/><ellipse cx="48" cy="66" rx="11" ry="7" fill="${cream}" opacity="0.95"/><circle cx="67" cy="45" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M68 50q5 1 8 6q-5 2-10 0" fill="${cream}"/><polygon points="58,37 62,24 68,37" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="69,36 78,25 80,39" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M23 57q-9 2-13 12q10 3 17-1q6-4 10-7" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 if(kind==='deer'){
   const antlers=/reno/i.test(name)
   ? '<path d="M58 26l-7-12m7 12l-10-6m10 6l-1-10m0 10l-6 8m15 0l8-14m-8 14l10-6m-10 6l1-10m0 10l7 8" stroke="#6b523f" stroke-width="3" stroke-linecap="round" fill="none"/>'
   : /alce/i.test(name)
   ? '<path d="M56 27l-5-10l-7 8m12 2l-10-3m24 3l6-12l8 9m-13 3l11-3" stroke="#6b523f" stroke-width="4" stroke-linecap="round" fill="none"/>'
   : /corzo|ciervo/i.test(name)
   ? '<path d="M58 26l-5-11m5 11l-8-6m8 6l-2-8m14 8l8-13m-8 13l9-7m-9 7l1-9" stroke="#6b523f" stroke-width="3" stroke-linecap="round" fill="none"/>'
   : /cabra|íbice|ibice|rebeco/i.test(name)
   ? '<path d="M61 32q-8-12 0-18m8 20q8-12 2-18" stroke="#6b523f" stroke-width="3.4" stroke-linecap="round" fill="none"/>'
   : '';
   return svgWrap(`<ellipse cx="44" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="42" cy="57" rx="10" ry="5" fill="${light}" opacity="0.55"/><circle cx="66" cy="46" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M70 46q8 4 9 10q-7 2-13-2" fill="${cream}"/>${antlers}<circle cx="70" cy="43" r="1.8" fill="${eye}"/>${legs(37,53,72)}`,glow);
 }
 if(kind==='mustelid' || kind==='otter') return svgWrap(`<ellipse cx="46" cy="61" rx="27" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="45" cy="63" rx="12" ry="5" fill="${light}" opacity="0.55"/><circle cx="72" cy="54" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M74 55q5 2 7 6q-5 2-9 0" fill="${cream}"/><circle cx="75" cy="51" r="1.6" fill="${eye}"/><path d="M18 61q-7 4-10 12" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>${legs(40,54,69)}`,glow);
 if(kind==='small'){
   if(/murciélago|murcielago/i.test(name)) return svgWrap(`<path d="M15 58q12-16 25-5q8-9 20 0q12-10 25 5q-5 4-12 3q-6-1-13-6q-5 10-10 10q-5 0-10-10q-7 5-13 6q-7 1-12-3z" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="50" cy="52" r="7" fill="${accent}" stroke="${outline}" stroke-width="2.5"/><circle cx="48" cy="51" r="1.2" fill="${eye}"/><circle cx="53" cy="51" r="1.2" fill="${eye}"/>`,glow);
   if(/topo/i.test(name)) return svgWrap(`<ellipse cx="48" cy="62" rx="20" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="66" cy="58" r="9" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="72" cy="60" rx="4" ry="3" fill="#d7b796"/><path d="M34 74l-6 6m17-4l-4 8m16-8l4 8" stroke="#8b7b61" stroke-width="3" stroke-linecap="round"/><circle cx="68" cy="56" r="1.4" fill="${eye}"/>`,glow);
   if(/musaraña|ratón|raton|topillo|lirón|liron|rata/i.test(name)) return svgWrap(`<ellipse cx="49" cy="63" rx="18" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="62" cy="53" r="9" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="58" cy="46" r="3.5" fill="${light}" stroke="${outline}" stroke-width="2"/><circle cx="66" cy="47" r="3.5" fill="${light}" stroke="${outline}" stroke-width="2"/><circle cx="65" cy="51" r="1.4" fill="${eye}"/><path d="M28 61q-13-12-6-28" fill="none" stroke="${light}" stroke-width="3" stroke-linecap="round"/>${legs(46,56,72)}`,glow);
   if(/erizo/i.test(name)) return svgWrap(`<ellipse cx="48" cy="61" rx="20" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M30 54l6-10m2 10l4-12m4 12l2-12m7 12l5-11m0 12l7-10" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="56" r="8" fill="${cream}" stroke="${outline}" stroke-width="3"/><circle cx="67" cy="54" r="1.4" fill="${eye}"/>`,glow);
   if(/ardilla/i.test(name)) return svgWrap(`<ellipse cx="53" cy="65" rx="19" ry="17" fill="${body}" stroke="#3c3028" stroke-width="3"/><circle cx="65" cy="46" r="12" fill="${body}" stroke="#3c3028" stroke-width="3"/><path d="M39 64Q13 54 21 30Q30 17 37 29Q28 43 39 47" fill="${body}" stroke="#3c3028" stroke-width="6"/><circle cx="69" cy="44" r="2" fill="${eye}"/><path d="M62 73v13m-11-11v11" stroke="#3c3028" stroke-width="3"/>`,glow);
   return svgWrap(`<ellipse cx="50" cy="62" rx="18" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="62" cy="49" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="66" cy="46" r="1.8" fill="${eye}"/><ellipse cx="51" cy="67" rx="9" ry="6" fill="${cream}" opacity="0.9"/>${legs(45,55,71)}`,glow);
 }
 if(kind==='seabird') return svgWrap(`<ellipse cx="49" cy="58" rx="19" ry="24" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="50" cy="66" rx="11" ry="12" fill="${pale}"/><polygon points="65,58 84,53 66,65" fill="#ea8b2f" stroke="${outline}" stroke-width="3"/><circle cx="58" cy="48" r="1.5" fill="${eye}"/>${birdLegs(43,52,81,'#c3722d')}`,glow);
 if(kind==='owl') return svgWrap(`<ellipse cx="50" cy="58" rx="22" ry="25" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="42" cy="52" r="6" fill="${pale}"/><circle cx="58" cy="52" r="6" fill="${pale}"/><circle cx="42" cy="52" r="2" fill="${eye}"/><circle cx="58" cy="52" r="2" fill="${eye}"/><polygon points="50,58 46,63 54,63" fill="#d89438"/><path d="M41 32l-4 6m22-6l4 6" stroke="${outline}" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='cat') return svgWrap(`<ellipse cx="47" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.5"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="59,40 63,29 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,29 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="70" cy="45" r="1.8" fill="${eye}"/><path d="M23 63q-7 3-10 10" stroke="${dark}" stroke-width="4.5" fill="none" stroke-linecap="round"/>${legs(39,53,70)}`,glow);
 if(kind==='bear') return svgWrap(`<ellipse cx="47" cy="61" rx="24" ry="18" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="66" cy="48" r="12" fill="${accent}" stroke="#342b23" stroke-width="3"/><circle cx="58" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><circle cx="74" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><path d="M69 50q6 2 8 6q-6 2-10 0" fill="${cream}"/>${legs(39,53,74)}`,glow);
 if(kind==='forestbird' || kind==='songbird') return svgWrap(`<ellipse cx="48" cy="61" rx="16" ry="12" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="61" cy="50" r="8" fill="${body}" stroke="${outline}" stroke-width="3"/>${wing('M30 57Q20 49 18 39Q28 42 39 50',accent)}<polygon points="67,51 79,48 68,56" fill="#d08c3b" stroke="${outline}" stroke-width="2"/><circle cx="63" cy="48" r="1.4" fill="${eye}"/>${birdLegs(45,50,74)}`,glow);
 if(kind==='raptor') return svgWrap(`<ellipse cx="48" cy="60" rx="19" ry="18" fill="${body}" stroke="${outline}" stroke-width="3"/>${wing('M29 58Q17 45 15 33Q29 35 41 48',dark)}${wing('M57 51Q70 38 85 35Q83 49 67 62',light)}<circle cx="56" cy="46" r="10" fill="${accent}" stroke="${outline}" stroke-width="3"/><polygon points="64,49 82,45 66,56" fill="#d2a246" stroke="${outline}" stroke-width="2"/><circle cx="58" cy="45" r="1.8" fill="${eye}"/>${birdLegs(43,53,77)}`,glow);
 if(kind==='reptile') return svgWrap(`<path d="M13 66Q28 54 43 58Q55 59 63 53Q72 47 82 53Q90 60 83 69Q74 80 59 76Q40 82 25 77Q14 74 13 66Z" fill="${body}" stroke="#2d3a24" stroke-width="3"/><circle cx="81" cy="57" r="7" fill="${accent}" stroke="#2d3a24" stroke-width="3"/><circle cx="84" cy="55" r="1.6" fill="${eye}"/><path d="M12 66Q4 67 3 74" fill="none" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/><path d="M23 66l-6 9m17-4l-4 10m14-10l-3 10m18-17l2-10" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='salamander') return svgWrap(`<path d="M16 65Q28 51 42 58Q50 61 58 55Q67 50 76 57Q83 65 77 72Q69 80 54 77Q39 84 27 79Q17 75 16 65Z" fill="${body}" stroke="#2f2922" stroke-width="3"/><circle cx="77" cy="61" r="7" fill="${accent}" stroke="#2f2922" stroke-width="3"/><circle cx="80" cy="59" r="1.8" fill="${eye}"/><path d="M19 64l-9-6m23 14l-7 10m16-11l-4 12m8-19l-2-10" stroke="#2f2922" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='fish') return svgWrap(`<ellipse cx="45" cy="55" rx="18" ry="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="25,55 8,43 8,67" fill="${dark}" stroke="${outline}" stroke-width="3"/><path d="M46 44l7-9m-4 17l8 8" stroke="${outline}" stroke-width="2.5" stroke-linecap="round"/><circle cx="57" cy="53" r="1.5" fill="${eye}"/><path d="M35 58q7 4 14 0" fill="none" stroke="#ffffff55" stroke-width="2"/>`,glow);
 if(kind==='rabbit' || kind==='hare') return svgWrap(`<ellipse cx="47" cy="66" rx="21" ry="13" fill="${body}" stroke="#3c3328" stroke-width="3"/><circle cx="67" cy="56" r="10" fill="${body}" stroke="#3c3328" stroke-width="3"/><path d="M63 47l-3-18q7-8 11 15m5 2l6-16q8-4 5 6l-5 15" fill="${body}" stroke="#3c3328" stroke-width="2.5"/><circle cx="71" cy="55" r="1.7" fill="${eye}"/>${legs(44,54,74)}`,glow);
 if(kind==='boar') return svgWrap(`<ellipse cx="46" cy="61" rx="24" ry="16" fill="${body}" stroke="#342c24" stroke-width="3"/><circle cx="68" cy="50" r="12" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="76" cy="54" rx="8" ry="6" fill="#b89471" stroke="#342c24" stroke-width="2.5"/><path d="M74 57l-4 4m8-4l5 3" stroke="#f4ead5" stroke-width="2.6" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 if(kind==='bison') return svgWrap(`<ellipse cx="44" cy="61" rx="24" ry="17" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="64" cy="50" r="11" fill="${accent}" stroke="#342b23" stroke-width="3"/><path d="M31 49Q31 34 43 34Q56 35 57 49" fill="${deep}" stroke="#342b23" stroke-width="3"/>${legs(38,53,73)}`,glow);
 if(kind==='beaver') return svgWrap(`<ellipse cx="46" cy="63" rx="21" ry="14" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="64" cy="54" r="10" fill="${body}" stroke="#3a3026" stroke-width="3"/><path d="M23 68q-10 1-12 9q9 6 19 2" fill="#75563b" stroke="#3a3026" stroke-width="3"/>${legs(41,53,73)}`,glow);
 if(kind==='stork' || kind==='heron' || kind==='pelican' || kind==='swan' || kind==='wader' || kind==='kingfisher' || kind==='tortoise') return svgWrap(`<ellipse cx="50" cy="60" rx="18" ry="14" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="64" cy="48" r="8" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M58 50q0-13 8-20" fill="none" stroke="${outline}" stroke-width="3" stroke-linecap="round"/><polygon points="71,49 85,46 72,54" fill="#d2a046" stroke="${outline}" stroke-width="2"/>${birdLegs(44,53,74)}`,glow);
 // Ninguna especie debe degradarse a un círculo vacío: familias sin retrato
 // específico utilizan una silueta reconocible, conservando SVG y variantes.
 if(kind==='snake')return svgWrap('<path d="M11 78Q8 55 29 59Q47 63 41 43Q36 25 57 30Q72 34 70 51Q69 64 84 57Q94 54 93 45" fill="none" stroke="'+outline+'" stroke-width="14" stroke-linecap="round"/><path d="M11 78Q8 55 29 59Q47 63 41 43Q36 25 57 30Q72 34 70 51Q69 64 84 57Q94 54 93 45" fill="none" stroke="'+body+'" stroke-width="9" stroke-linecap="round"/><path d="M89 42l8-8m-8 8 8 2" fill="none" stroke="'+dark+'" stroke-width="2"/><circle cx="91" cy="40" r="1.6" fill="'+eye+'"/>',glow);
 if(kind==='lizard')return svgWrap('<path d="M31 64Q15 70 7 84" fill="none" stroke="'+dark+'" stroke-width="7" stroke-linecap="round"/><ellipse cx="45" cy="60" rx="23" ry="12" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M62 55Q80 44 91 51L91 61Q78 69 62 65Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M33 68l-15 13m30-11-10 14m13-30 3-13m17 15 8-14" fill="none" stroke="'+outline+'" stroke-width="3"/><circle cx="84" cy="53" r="2" fill="'+eye+'"/>',glow);
 if(kind==='pangolin')return svgWrap('<path d="M18 66Q9 72 5 89Q19 90 29 73" fill="'+dark+'" stroke="'+outline+'" stroke-width="3"/><path d="M23 67Q23 41 48 39Q66 40 73 65L62 77Q42 82 23 67Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/>'+[31,43,55,67].map(x=>'<path d="M'+x+' 46l-6 10 7 9-6 10" fill="none" stroke="'+dark+'" stroke-width="3"/>').join('')+'<path d="M67 60Q82 53 94 66L80 70Z" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M32 77l-5 10m25-10-3 10" stroke="'+outline+'" stroke-width="4"/><circle cx="83" cy="62" r="1.6" fill="'+eye+'"/>',glow);
 if(kind==='primate')return svgWrap('<path d="M19 64Q9 70 14 83" fill="none" stroke="'+dark+'" stroke-width="5"/><ellipse cx="46" cy="60" rx="23" ry="17" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M28 70l-8 16m31-12 0 14m15-30 15 17" fill="none" stroke="'+outline+'" stroke-width="5"/><circle cx="67" cy="43" r="15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="52" cy="41" r="6" fill="'+dark+'" stroke="'+outline+'" stroke-width="2"/><ellipse cx="69" cy="49" rx="9" ry="8" fill="'+cream+'"/><circle cx="65" cy="43" r="2" fill="'+eye+'"/><circle cx="75" cy="43" r="2" fill="'+eye+'"/>',glow);
 if(kind==='camel')return svgWrap('<path d="M19 64Q22 45 33 47Q36 26 43 33L50 46Q59 27 66 36L72 54L82 39L87 45L89 62Q70 71 45 69Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M26 67l-2 22m19-22 1 22m21-21-1 21" stroke="'+outline+'" stroke-width="4"/><path d="M84 40l7-8 4 15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="89" cy="42" r="1.8" fill="'+eye+'"/>',glow);
 if(kind==='elephant')return svgWrap('<ellipse cx="44" cy="58" rx="27" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M29 72l-2 16m22-16 1 16" stroke="'+outline+'" stroke-width="7"/><ellipse cx="64" cy="50" rx="15" ry="20" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M72 43Q91 36 89 60Q86 80 97 81" stroke="'+body+'" stroke-width="11" fill="none"/><path d="M72 43Q91 36 89 60Q86 80 97 81" stroke="'+outline+'" stroke-width="2" fill="none"/><circle cx="79" cy="44" r="2" fill="'+eye+'"/>',glow);
 if(kind==='rhino')return svgWrap('<ellipse cx="43" cy="61" rx="28" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M30 74l-2 14m25-14 3 14" stroke="'+outline+'" stroke-width="7"/><path d="M60 48L83 44L93 59L85 75L63 73Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M81 50L88 29L93 57Z" fill="'+pale+'" stroke="'+outline+'" stroke-width="2"/><circle cx="77" cy="53" r="2" fill="'+eye+'"/>',glow);
 if(kind==='crocodile')return svgWrap('<path d="M28 58Q14 54 5 72Q20 68 30 75L70 75L96 65L94 55L70 54Q46 42 28 58Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M28 56l5-9 5 7 5-8 6 8 6-7 6 8" fill="none" stroke="'+dark+'" stroke-width="3"/><path d="M38 73l-9 11m28-11 6 11" stroke="'+outline+'" stroke-width="4"/><path d="M75 65h18" stroke="'+dark+'" stroke-width="2"/><circle cx="79" cy="56" r="2" fill="'+eye+'"/>',glow);
 if(kind==='sirenian'||kind==='cetacean'||kind==='ray'){
  if(kind==='ray')return svgWrap('<path d="M49 35Q27 41 6 28Q11 65 41 72L49 79L60 72Q90 65 96 28Q73 42 49 35Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M49 75l-1 21" stroke="'+outline+'" stroke-width="3"/><circle cx="41" cy="48" r="2" fill="'+eye+'"/><circle cx="58" cy="48" r="2" fill="'+eye+'"/>',glow);
  return svgWrap('<path d="M13 64Q29 41 55 48L65 39L69 51Q89 57 94 65L74 73Q51 80 33 70L17 76Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M46 49l7-21 9 22Z" fill="'+dark+'" stroke="'+outline+'" stroke-width="2"/><path d="M17 63L7 51L9 68L5 82L24 72" fill="'+light+'" stroke="'+outline+'" stroke-width="2"/><circle cx="79" cy="61" r="2" fill="'+eye+'"/>',glow);
 }
 // Última defensa visual para futuros kinds: mamífero de perfil, no círculo.
 return svgWrap('<path d="M18 65L8 75" stroke="'+dark+'" stroke-width="4" fill="none"/><ellipse cx="43" cy="60" rx="24" ry="15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M30 70l-3 18m23-17 2 17" stroke="'+outline+'" stroke-width="4"/><path d="M61 54L65 34L82 39L92 56L83 66L65 64Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M65 37l-7-10m18 12 8-10" stroke="'+dark+'" stroke-width="3"/><circle cx="78" cy="48" r="2" fill="'+eye+'"/>',glow);
}


globalThis.ATLAS_DIMORPHISM_LAB={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,SPECIMEN_LEVELS,SPECIMEN_CATEGORIES,LEGENDARY_SPECIMENS,configuredSpecials,specimenRates,rollSpecimen,recordSpecimen,legendaryForSpecies};
})();
