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
  nutria_europea:{name:'Nutria europea', latin:'Lutra lutra', rare:'Común', kind:'otter', color:'#7b5b39', habitats:['rio'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:[], dimorphism:false},
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



// Solo especies con dimorfismo sexual notorio y representable con sprites distintos.
const SEXUAL_DIMORPHISM={
  asia_esp_0880:{type:'capercaillie'},
  asia_esp_0441:{type:'ibex'},
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
  asia_esp_0833:{type:'ibex'},
  asia_esp_0111:{type:'antlers'}
};
Object.entries(SPECIES).forEach(([id,sp])=>{sp.dimorphism=!!SEXUAL_DIMORPHISM[id];});

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
function taxonomyInfo(id){
  if(ASIA_V23_TAXONOMY[id])return ASIA_V23_TAXONOMY[id];
  const special=SPECIES[id];
  if(special?.kind==='lizard')return {className:'Reptilia',subClass:'Lagartos'};
  if(special?.kind==='amphibian')return {className:'Amphibia',subClass:'Anuros'};
  if(special?.kind==='camel')return {className:'Mammalia',subClass:'Camélidos'};
  if(special?.kind==='primate')return {className:'Mammalia',subClass:'Primates'};
  if(id==='asia_esp_0899')return {className:'Amphibia',subClass:'Salamandras'};
  if(id==='asia_esp_0898')return {className:'Amphibia',subClass:'Sapos'};
  if(id==='asia_esp_0914')return {className:'Actinopterygii',subClass:'Esturiones'};
  if(id==='asia_esp_0903')return {className:'Reptilia',subClass:'Lagartos ápodos'};
  const sp=SPECIES[id];
  const k=sp.kind;
  const table={
    canid:['Mammalia','Cánidos'], deer:['Mammalia','Cérvidos y bóvidos'], mustelid:['Mammalia','Mustélidos'],
    small:['Mammalia','Pequeños mamíferos'], otter:['Mammalia','Mustélidos acuáticos'], cat:['Mammalia','Felinos'],
    bear:['Mammalia','Úrsidos'], boar:['Mammalia','Suidos'], rabbit:['Mammalia','Lagomorfos'], hare:['Mammalia','Lagomorfos'],
    beaver:['Mammalia','Roedores'], bison:['Mammalia','Bóvidos'], forestbird:['Aves','Aves terrestres'],
    raptor:['Aves','Rapaces'], owl:['Aves','Estrigiformes'], seabird:['Aves','Aves marinas'], songbird:['Aves','Paseriformes'],
    stork:['Aves','Ciconiiformes'], swan:['Aves','Anátidas'], heron:['Aves','Ardeidas'], pelican:['Aves','Pelecaniformes'],
    kingfisher:['Aves','Coraciiformes'], wader:['Aves','Zancudas'], reptile:['Reptilia','Lagartos y anuros'],
    salamander:['Amphibia','Urodelos y anfibios'], snake:['Reptilia','Serpientes'], tortoise:['Reptilia','Quelonios'],
    fish:['Actinopterygii','Peces óseos']
  };
  return {className:(table[k]||['Animalia','Vertebrados'])[0], subClass:(table[k]||['Animalia','Vertebrados'])[1]};
}
function taxonomyText(id){
  const st=stage(id); const t=taxonomyInfo(id);
  if(st<2) return 'Clasificación: por estudiar';
  if(st<3) return `Clase: ${t.className}`;
  return `Clase: ${t.className} · Grupo: ${t.subClass}`;
}
normalizeEcology();
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

const RESEARCH_NODES=[
  {id:'prismaticos_1', name:'Prismáticos de latón', desc:'+12% probabilidad de encuentro manual', money:25, knowledge:20, once:true, effect(s){s.upgrades.prism=1;}},
  {id:'prismaticos_2', name:'Lentes calibrados', desc:'+12% adicional de encuentro manual', money:50, knowledge:35, req:'prismaticos_1', once:true, effect(s){s.upgrades.prism=2;}},
  {id:'cuaderno_1', name:'Cuaderno ilustrado', desc:'+25% conocimiento por observación', money:20, knowledge:20, once:true, effect(s){s.upgrades.journal=1;}},
  {id:'metodo_1', name:'Método de rastreo I', desc:'Búsqueda automática cada 3 s', money:55, knowledge:40, once:true, effect(s){s.upgrades.autoTier=1;}},
  {id:'metodo_2', name:'Método de rastreo II', desc:'Búsqueda automática cada 2 s', money:90, knowledge:70, req:'metodo_1', once:true, effect(s){s.upgrades.autoTier=2;}},
  {id:'metodo_3', name:'Método de rastreo III', desc:'Búsqueda automática cada 1 s', money:140, knowledge:120, req:'metodo_2', once:true, effect(s){s.upgrades.autoTier=3;}},
  {id:'metodo_4', name:'Método de rastreo IV', desc:'Búsqueda automática cada 0,5 s', money:220, knowledge:180, req:'metodo_3', once:true, effect(s){s.upgrades.autoTier=4;}},
  {id:'novato', name:'Contratar ayudante novato', desc:'Añade un ayudante al equipo (+bono leve a búsquedas automáticas)', money:45, knowledge:10, repeat:true, max:10, effect(s){s.helpers+=1;}},
  {id:'capacitacion_1', name:'Capacitación profesional I', desc:'Mayor rendimiento del equipo automático', money:65, knowledge:55, once:true, effect(s){s.upgrades.training=1;}},
  {id:'capacitacion_2', name:'Capacitación profesional II', desc:'Mayor rendimiento del equipo automático', money:110, knowledge:90, req:'capacitacion_1', once:true, effect(s){s.upgrades.training=2;}},
  {id:'astillero', name:'Astillero básico', desc:'Desbloquea expediciones', money:150, knowledge:90, req:'capacitacion_1', once:true, effect(s){s.upgrades.shipyard=1;}},
  {id:'sociedad_1', name:'Gestión de subvenciones', desc:'+25% libras al solicitar subvención', money:130, knowledge:110, req:'cuaderno_1', once:true, effect(s){s.upgrades.grantBonus=0.25;}},
  {id:'sociedad_2', name:'Catálogo de notas', desc:'+50% libras al canjear notas de campo', money:220, knowledge:180, req:'sociedad_1', once:true, effect(s){s.upgrades.noteBonus=0.5;}},
  {id:'rutas_1', name:'Cartografía naval I', desc:'Desbloquea nuevas rutas de expedición', money:180, knowledge:150, req:'astillero', once:true, effect(s){s.upgrades.routeTier=1;}},
  {id:'rutas_2', name:'Cartografía naval II', desc:'Desbloquea rutas avanzadas', money:320, knowledge:260, req:'rutas_1', once:true, effect(s){s.upgrades.routeTier=2;}},
  {id:'casco_1', name:'Casco aligerado', desc:'Reduce 15% el tiempo de viaje', money:200, knowledge:170, req:'astillero', once:true, effect(s){s.upgrades.voyageTime=0.85;}},
  {id:'flota_1', name:'Segundo destacamento', desc:'Permite una expedición adicional simultánea', money:260, knowledge:220, req:'rutas_1', once:true, effect(s){s.upgrades.fleet=1;}},
  {id:'gabinete_1', name:'Gabinete de especímenes', desc:'Los animales pueden dejar coleccionables raros', money:520, knowledge:460, req:'sociedad_1', once:true, effect(s){s.upgrades.specimenDrops=1;}},
  {id:'asia_1', name:'Cartografía de Asia', desc:'Desbloquea el acceso a Asia; cada región exige un prestigio mínimo acumulado, sin consumirlo', money:800, knowledge:650, req:'rutas_2', reqItem:'asia_map', reqItemQty:1, once:true, effect(s){s.upgrades.asiaUnlocked=1;}}
];

function initialState(){
  const region=REGIONS[0].id;
  return {
    money:420, knowledge:0, prestige:0, helpers:0, books:0,
    asiaPricingVersion:3, currentRegion:region, habitat:'bosque', time:'amanecer', season:'primavera',
    discovered:{}, sightings:{}, stages:{}, feedObs:{}, dimorphism:{}, sexSeen:{}, specialSeen:{}, specialFound:{}, published:{},
    log:['Bienvenido al Gran Atlas. Tu primera misión es estudiar las Islas Británicas.','💷 Fondo inicial de prueba: £420. En Corona puedes simular más libras.'],
    upgrades:{prism:0,journal:0,autoTier:0,training:0,shipyard:0,grantBonus:0,noteBonus:0,voyageTime:1,fleet:0,routeTier:0,specimenDrops:0,asiaUnlocked:0}, purchases:{},
    regionUnlocked:{[REGIONS[0].id]:true}, inventoryView:'equipo', atlasView:'Europa', museumView:'exhibitions', societyView:'grants', publicationView:'monographs', bestiarySort:'alpha', crownCoins:0, lastEncounter:null,
    lastTick:Date.now(), lastGrant:0, autoHourly:{}, voyages:[], voyageSeq:0, inventory:{},equipment:{instrument:null,hat:null,necklace:null}
  };
}

let state=load();
const REGION_ALIASES={"hx0109": "HX-01-09", "hx0111": "HX-01-11", "hx0209": "HX-02-09", "hx0210": "HX-02-10", "hx0211": "HX-02-12", "hx0212": "HX-02-11", "hx0213": "HX-03-12", "hx0214": "HX-02-11", "eu_danube": "HX-03-09", "hx0215": "HX-03-10"};
if(REGION_ALIASES[state.currentRegion]) state.currentRegion=REGION_ALIASES[state.currentRegion];
if(!REGIONS.some(r=>r.id===state.currentRegion)) state.currentRegion='HX-01-09';
state.regionUnlocked=state.regionUnlocked||{};
let tab='field';
state.museum = state.museum || {wing:1, exhibits:{}};
state.books=state.books||0;
state.autoHourly=state.autoHourly||{};state.voyages=state.voyages||[];state.voyageSeq=state.voyageSeq||0;state.inventory=state.inventory||{};state.equipment=state.equipment||{instrument:null,hat:null,necklace:null};state.specialFound=state.specialFound||{};state.upgrades.asiaUnlocked=(state.upgrades.asiaUnlocked||state.purchases.asia_1)?1:0;state.atlasView=state.atlasView||'Europa';state.museumView=state.museumView||'exhibitions';state.societyView=state.societyView||'grants';state.publicationView=state.publicationView||'monographs';state.bestiarySort=state.bestiarySort||'alpha';state.crownCoins=state.crownCoins||0;
// Migración v2.1->v2.2: zonas asiáticas previamente habilitadas conservan su acceso.
if((state.asiaPricingVersion||2)<3){
  if(state.upgrades.asiaUnlocked){
    const priorMin={'HX-03-13':1,'HX-03-15':2,'HX-02-13':3,'HX-03-14':4,'HX-04-13':5};
    Object.entries(priorMin).forEach(([rid,min])=>{
      if(state.prestige>=min)state.regionUnlocked[rid]=true;
    });
  }
  state.asiaPricingVersion=3;
}

// Asia requiere cartografía y prestigio mínimo; el prestigio no se gasta.
// Respeta regiones ya accesibles en partidas anteriores.
if(state.upgrades.asiaUnlocked && REGIONS.find(r=>r.id===state.currentRegion)?.continent==='Asia')state.regionUnlocked[state.currentRegion]=true;
if(REGIONS.find(r=>r.id===state.currentRegion)?.continent==='Asia'&&!state.upgrades.asiaUnlocked)state.currentRegion='HX-01-09';
state.regionUnlocked[state.currentRegion]=true;
// Migración reversible para progreso anterior: los dimorfismos completos no se pierden.
state.sexSeen=state.sexSeen||{};
Object.keys(SEXUAL_DIMORPHISM).forEach(id=>{
  if(!state.sexSeen[id] && state.dimorphism?.[id]) state.sexSeen[id]={male:true,female:true};
  else if(state.sexSeen[id]) state.dimorphism[id]=!!(state.sexSeen[id].male && state.sexSeen[id].female);
});
try{if(!localStorage.getItem('gran_atlas_v07_backup_before_v08'))localStorage.setItem('gran_atlas_v07_backup_before_v08',JSON.stringify(state));}catch(e){}
let autoAccum=0;
let lastDisplayRefresh=0;
let batchingOffline=false;
let diaryDirty=false;
let lastPanelSignature='';
let currentAutoNotice='';
// Estado visual del catálogo, no forma parte de la partida.
let journalRailQuery='';
let journalSortMode='catalog';
let journalRailScrollTop=0;
let atlasMapScrollLeft=0;
let journalSheetScrollTop=0;

let autoDiaryBuffer={searches:0,hits:0,knowledge:0};
let lastAutoDiaryFlush=0;
const panel=document.getElementById('panel');
const $=id=>document.getElementById(id);

function load(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    const base=initialState();
    if(!raw) return base;
    const saved=JSON.parse(raw);
    const merged={...base,...saved};
    merged.upgrades={...base.upgrades,...(saved.upgrades||{})};
    merged.purchases={...base.purchases,...(saved.purchases||{})};
    merged.regionUnlocked={...base.regionUnlocked,...(saved.regionUnlocked||{})};
    if(!Object.prototype.hasOwnProperty.call(saved,'asiaPricingVersion') && (saved.upgrades?.asiaUnlocked || saved.purchases?.asia_1)){
      merged.regionUnlocked['HX-03-13']=true;
      merged.regionUnlocked['HX-03-15']=true;
    }
    merged.asiaPricingVersion=Math.max(2, saved.asiaPricingVersion||2);
    merged.lastTick=Number.isFinite(saved.lastTick)?saved.lastTick:Date.now();
    return merged;
  }catch(e){return initialState();}
}
function persist(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
function esc(x){return String(x).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function fmt(n){return Math.floor(n).toLocaleString('es-CL')}
function currentRegion(){return REGIONS.find(r=>r.id===state.currentRegion)||REGIONS[0]}
function totalSightings(){return Object.values(state.sightings).reduce((a,b)=>a+b,0)}
function monographCount(){return Object.values(state.published).filter(Boolean).length}
function autoInterval(){return [5,3,2,1,0.5][state.upgrades.autoTier]}
function manualEncounterBonus(){return 1 + state.upgrades.prism*0.12+(state.equipment.instrument==='binoculars'?0.12:0)}
function knowledgeBonus(){return 1 + state.upgrades.journal*0.25+(state.equipment.hat==='field_hat'?0.10:0)}
function helperBonus(){return 1 + Math.min(0.45, state.helpers*0.03 + state.upgrades.training*0.08)+(state.equipment.necklace==='amulet'?0.08:0)}

function sight(id){return state.sightings[id]||0}
function stage(id){return state.stages[id]||0}
function feed(id){return state.feedObs[id]||0}
function specials(id){return state.specialSeen[id]||0}
function dimorphismProgress(id){
  const sexes=state.sexSeen?.[id]||{};
  return (sexes.male?1:0)+(sexes.female?1:0);
}
function hasDimorphism(id){return !!SEXUAL_DIMORPHISM[id] && dimorphismProgress(id)===2;}
function recordSexObservation(id, manual){
  if(!SEXUAL_DIMORPHISM[id]) return null;
  // No todas las observaciones permiten distinguir el sexo desde lejos.
  if(Math.random() >= (manual?0.18:0.12)) return null;
  const sex=Math.random()<0.5?'male':'female';
  const found=state.sexSeen[id]||(state.sexSeen[id]={male:false,female:false});
  const isNew=!found[sex];
  found[sex]=true;
  if(hasDimorphism(id)) state.dimorphism[id]=true;
  return {sex,isNew,complete:hasDimorphism(id)};
}
function visibleName(id){return stage(id)>=1?SPECIES[id].name:'No identificado'}
function visibleLatin(id){return stage(id)>=2?SPECIES[id].latin:'por identificar'}
function identifiedCount(){return Object.keys(SPECIES).filter(id=>stage(id)>=1).length}
function regionIdentifiedCount(regionId){const ids=(REGIONS.find(r=>r.id===regionId)||REGIONS[0]).species;return ids.filter(id=>stage(id)>=1).length}
function maxVoyages(){return 2+(state.upgrades.fleet||0)}
function voyageDuration(seconds){return Math.max(30, Math.round(seconds*(state.upgrades.voyageTime||1)))}
function rarityClass(r){return ({'Común':'rarity-common','Poco común':'rarity-uncommon','Raro':'rarity-rare','Muy rara':'rarity-legendary'}[r]||'')}
function rarityBadge(r){return `<span class="badge ${rarityClass(r)}">${r}</span>`}
function specialBadges(id){const sp=SPECIES[id]; if(!sp.special.length) return '<div class="small">sin variantes configuradas</div>'; const found=state.specialFound[id]||{}; return `<div class="special-grid">`+sp.special.map(v=>{const seen=!!found[v]; return `<div class="variant-card ${seen?'seen':'unknown'}"><div class="sprite-wrap">${seen?getSpriteMarkup(id,variantToSkin(v)):'<div class=\"qmark\">?</div>'}</div><div class="small">${seen?v:'?'}</div></div>`;}).join('')+`</div>`;}


// Comparación en el Cuaderno: se revela cada sexo solo al observarlo.
function renderSexComparison(id){
  if(!SEXUAL_DIMORPHISM[id]) return '';
  const found=state.sexSeen[id]||{};
  const cards=[['male','♂ Macho'],['female','♀ Hembra']].map(([sex,label])=>{
    const seen=!!found[sex];
    return `<div class="sex-card ${seen?'':'sex-hidden'}">
      <div class="sex-label">${label}</div>
      <div class="sex-sprite sprite-wrap">${seen?getSpriteMarkup(id,'normal',sex):'<div class="qmark">?</div>'}</div>
      <div class="small">${seen?'Observado':'Sin observar'}</div>
    </div>`;
  }).join('');
  return `<div class="req sex-section"><strong>Dimorfismo sexual · ${dimorphismProgress(id)}/2</strong>
     <div class="small">Registra macho y hembra por separado durante las exploraciones.</div>
     <div class="sex-grid">${cards}</div>
     ${hasDimorphism(id)?'<div class="small">✅ Comparación completa</div>':''}
   </div>`;
}

function regionLandscape(regionId){
  const V22_SCENES={
    'HX-02-15':['#bed1c5','#e5e9d7','#879e86','🌲  🪨  🌲  ⛰️  🍃'],
    'HX-03-16':['#cbd8df','#e5ede9','#8c9e94','🌲  ❄️  🐅  🌲  🏔️'],
    'HX-03-18':['#c2d6df','#eaf0e8','#8fa9a1','🌊  🌋  🦅  🌲  ❄️'],
    'HX-04-14':['#e9d8b9','#f5e5bf','#ae946c','🏜️  ☀️  🦎  🐪  🪨'],
    'HX-04-15':['#c7d5d9','#e4e8df','#8fa19b','🏔️  ❄️  🐆  🌲  ⛰️']
  };
  if(V22_SCENES[regionId])return V22_SCENES[regionId];

  if(regionId==='HX-02-13')return ['#bcd0cc','#e1ebde','#8b9d81','🌲  🐿️  🌊  ❄️  🌲'];
  if(regionId==='HX-03-14')return ['#bdc9ce','#e3e7de','#919b81','🌲  ❄️  🪶  🌲  🏔️'];
  if(regionId==='HX-04-13')return ['#dbd4b7','#eee4cb','#a9a178','🐎  🌾  🐈  ⛰️  🌾'];
  if(regionId==='HX-03-13')return ['#becfc3','#e4e5d5','#8f9f80','⛰️  🪨  🌲  🦅  🌄'];
  if(regionId==='HX-03-15')return ['#e4d4b2','#f3e5c8','#b3a17e','🌿  🐈  🌾  ⛰️  ☀️'];

  const map={
    'HX-01-09':['#bad6c3','#dbe6c5','#7fa179','🌳  🌊  🌿  🌾  🪶'],
    'HX-01-11':['#d9e1e8','#edf3f6','#9db5c0','🌲  ❄️  🦌  🌨️  🌲'],
    'HX-02-09':['#d8dee5','#ecece1','#98a08f','🏔️  🪨  🌲  ❄️  ⛰️'],
    'HX-02-10':['#bcd0d9','#e4eadb','#89a077','🌳  🌾  🌊  🌲  🪶'],
    'HX-02-11':['#c9d8cb','#e8eedf','#90a67d','🌲  🌿  🌊  🦌  🌾'],
    'HX-02-12':['#d4d8c5','#ebe0c5','#a08e68','🌞  🌵  ⛰️  🌾  🦅'],
    'HX-03-09':['#c9d3cc','#e7e6d9','#97a384','🌲  🌾  🌊  🦬  🌲'],
    'HX-03-10':['#cfd8d0','#efe4cf','#9dad86','🌞  🌿  🌊  🪨  🌲'],
    'HX-03-11':['#cfdae2','#eef4f5','#92a9b0','🌊  🌲  🦢  reeds  🌫️'],
    'HX-03-12':['#d4d2c4','#ece6d1','#9a987d','⛰️  🌲  🪨  🌿  🦅']
  };
  return map[regionId] || ['#c9d8e2','#e8edf1','#9fb0b7','🌲  ⛰️  ❄️  🌊  🌲'];
}

function rarityWeight(r){return ({'Común':12,'Poco común':6,'Raro':2.5,'Muy rara':0.7}[r]||5)}

function eligibleSpecies(regionId, habitat, time, season){
  const region=REGIONS.find(r=>r.id===regionId);
  return region.species.filter(id=>{
    const sp=SPECIES[id];
    return sp.habitats.includes(habitat) && sp.times.includes(time) && sp.seasons.includes(season);
  });
}

function encounter(source='manual', at=Date.now()){
  // Hourly buckets are stored in the save; manual sightings never consume the automatic quota.
  const hour=Math.floor(at/3600000);
  const bucket=state.autoHourly;
  for(const key of Object.keys(bucket)){if(Number(key.split(':')[0])<hour-8)delete bucket[key];}
  const choices=eligibleSpecies(state.currentRegion,state.habitat,state.time,state.season)
    .filter(id=>source!=='auto'||(bucket[hour+':'+id]||0)<MAX_AUTOMATIC_SIGHTINGS_PER_SPECIES_PER_HOUR);
  const manual=source==='manual';
  let chanceBase=manual?0.50:0.38;
  chanceBase*=manual?manualEncounterBonus():helperBonus();
  chanceBase=Math.min(0.96,chanceBase);

  if(!choices.length && !manual){
    currentAutoNotice='Cupo automático de la hora alcanzado o sin especies disponibles en estas condiciones. La búsqueda manual continúa disponible.';
    return;
  }
  currentAutoNotice='';
  if(!choices.length || Math.random()>chanceBase){
    const k=Math.round((manual?3:1.5)*knowledgeBonus());
    state.knowledge+=k;
    if(manual)state.lastEncounter={title:'Sin avistamiento', subtitle:`Se encontraron rastros. +${k} conocimiento`, sprite:null};
    if(manual)pushLog(`🔭 Búsqueda sin avistamiento · +${k} conocimiento.`);
    if(!batchingOffline){renderCounters();updateFieldOutput();}
    return;
  }

  const totalW=choices.reduce((sum,id)=>sum+rarityWeight(SPECIES[id].rare),0);
  let roll=Math.random()*totalW, chosen=choices[0];
  for(const id of choices){ roll-=rarityWeight(SPECIES[id].rare); if(roll<=0){chosen=id;break;}}
  const sp=SPECIES[chosen];
  const first=!state.discovered[chosen];
  state.discovered[chosen]=true;
  state.sightings[chosen]=sight(chosen)+1;
  if(source==='auto'){const key=hour+':'+chosen;bucket[key]=(bucket[key]||0)+1;}
  const knowledgeGain=Math.round((manual?5:3)*knowledgeBonus());
  state.knowledge+=knowledgeGain;
  if(first){ state.money += 15; pushLog(`🪙 Descubrimiento de ${visibleName(chosen)}: la Sociedad entrega £15.`); }

  // behaviors and special observations
  let note=[];
  if(Math.random()<0.12){ state.feedObs[chosen]=feed(chosen)+1; note.push('comiendo'); }
  const sexObservation=recordSexObservation(chosen,manual);
  if(sexObservation){
    const sexLabel=sexObservation.sex==='male'?'macho':'hembra';
    if(sexObservation.isNew) note.push(`primera observación de ${sexLabel}`);
    if(sexObservation.complete && sexObservation.isNew) note.push('dimorfismo documentado (2/2)');
  }
  let variant='';
  if(sp.special.length && Math.random()<0.01){
    state.specialSeen[chosen]=specials(chosen)+1;
    variant=sp.special[Math.floor(Math.random()*sp.special.length)];
    state.specialFound[chosen]=state.specialFound[chosen]||{};
    state.specialFound[chosen][variant]=true;
    note.push(`espécimen especial: ${variant}`);
  }
  const speciesDrop=maybeSpeciesDrop(chosen, manual);
  if(speciesDrop) note.push(`muestra obtenida: ${ITEMS[speciesDrop].name}`);

  if(manual || source==='auto') state.lastEncounter={
    species:chosen,
    title:`${first?'¡Nueva especie! ':'Avistamiento: '}${visibleName(chosen)}`,
    subtitle:`${sp.rare}${variant?` · ${variant}`:''} · ${fmt(sight(chosen))} avistamientos · +${knowledgeGain} conocimiento${first?' · +£15':''}${note.length?' · '+note.join(', '):''}`,
    sprite:variant?getSpriteMarkup(chosen,variantToSkin(variant)) : (sexObservation?getSpriteMarkup(chosen,'normal',sexObservation.sex):getSpriteMarkup(chosen))
  };
  if(manual) pushLog(`🔭 ${visibleName(chosen)} · ${fmt(sight(chosen))} avistamientos${note.length?' · '+note.join(', '):''}.`);
  if(!batchingOffline){renderCounters();updateFieldOutput();}
}
function variantToSkin(variant){
  if(/albino|leuc/i.test(variant)) return 'albino';
  if(/melan/i.test(variant)) return 'melanico';
  if(/notable/i.test(variant)) return 'alfa';
  return 'normal';
}

function pushLog(txt){
 const last=state.log[0];
 if(last && last===txt){state.logRepeated=(state.logRepeated||0)+1; return;}
 state.logRepeated=0; state.log.unshift(txt); state.log=state.log.slice(0,8);diaryDirty=true;
}

function stageRequirements(id, nextIndex){
  const sp=SPECIES[id];
  const needSight=THRESHOLDS[nextIndex];
  const money=SPECIES_MONEY_COSTS[nextIndex];
  const knowledge=SPECIES_KNOWLEDGE_COSTS[nextIndex];
  const req={needSight,money,knowledge,label:STAGE_LABELS[nextIndex], extra:'Ninguno'};
  if(nextIndex===3){ // stage 4 / index 3
    req.extra = sp.dimorphism ? `Requiere 10 observaciones comiendo o registrar macho y hembra.` : `Requiere 10 observaciones comiendo.`;
    req.extraOk = feed(id)>=10 || (sp.dimorphism && hasDimorphism(id));
  } else if(nextIndex===4){
    req.extra = `Requiere al menos 1 espécimen especial.`;
    req.extraOk = specials(id)>=1;
  } else req.extraOk=true;
  req.sightOk = sight(id)>=needSight;
  req.moneyOk = state.money>=money;
  req.knowledgeOk = state.knowledge>=knowledge;
  req.allOk = req.sightOk && req.moneyOk && req.knowledgeOk && req.extraOk;
  return req;
}
function advanceSpecies(id){
  const current=stage(id);
  if(current>=5) return;
  const req=stageRequirements(id,current);
  if(!req.allOk) return;
  state.money-=req.money;
  state.knowledge-=req.knowledge;
  state.stages[id]=current+1;
  pushLog(`📖 ${SPECIES[id].name} avanzó a ${state.stages[id]}/5.`);
  render();
}
function publishMonograph(id){
  if(stage(id)<5 || state.published[id]) return;
  state.published[id]=true;
  state.prestige+=1;
  state.money+=90;
  if(state.prestige>=2) state.regionUnlocked[REGIONS[2].id]=true;
  pushLog(`🏅 Monografía publicada: ${SPECIES[id].name}. +1 prestigio, +£90.`);
  render();
}

function requestGrant(){
  const now=Date.now();
  if(now-state.lastGrant < 60000) return;
  const discovered=Object.keys(state.discovered).length;
  if(discovered===0) return;
  const grant=Math.round((35+discovered*5)*(1+(state.upgrades.grantBonus||0)));
  state.money+=grant;
  state.lastGrant=now;
  pushLog(`🏛️ La Sociedad concede una subvención de £${grant}.`);
  render();
}
function exchangeNotes(){
  if(state.knowledge<40) return;
  state.knowledge-=40;
  const reward=Math.round(25*(1+(state.upgrades.noteBonus||0)));
  state.money+=reward;
  pushLog(`🪙 Notas de campo canjeadas: -40 conocimiento, +£${reward}.`);
  render();
}
function craftTome(){
  if(state.knowledge<10000) return;
  state.knowledge-=10000;
  state.books+=1;
  pushLog('📚 Has compilado un Tomo de historia natural.');
  render();
}
function unlockRegion(id){
  const region=REGIONS.find(r=>r.id===id);
  if(state.regionUnlocked[id]) return;
  if(state.prestige >= region.unlock.prestige){ state.regionUnlocked[id]=true; render(); }
}
function regionAccessible(r){
  if(!r) return false;
  return !!state.regionUnlocked[r.id] || r.id===state.currentRegion;
}

function setRegion(id){
  const dest=REGIONS.find(r=>r.id===id);
  if(!dest || !(state.regionUnlocked[id] || id===state.currentRegion)) return;
  state.currentRegion=id;
  if(!dest.habitats.includes(state.habitat))state.habitat=dest.habitats[0];
  if(!eligibleSpecies(id,state.habitat,state.time,state.season).length){
    const prefs=['amanecer','dia','atardecer','noche'];
    let found=false;
    for(const habitat of dest.habitats){
      for(const time of [state.time,...prefs]){
        if(eligibleSpecies(id,habitat,time,state.season).length){state.habitat=habitat;state.time=time;found=true;break;}
      }
      if(found)break;
    }
  }
  state.lastEncounter=null;
  currentAutoNotice='';
  pushLog(`🧭 Expedición terrestre: llegada a ${dest.name}.`);
  render();
}

function canBuy(node){
  if(node.once && state.purchases[node.id]) return false;
  if(node.max && (state.purchases[node.id]||0)>=node.max) return false;
  if(node.req && !state.purchases[node.req]) return false;
  if(node.reqItem && (state.inventory[node.reqItem]||0)<(node.reqItemQty||1)) return false;
  return state.money>=node.money && state.knowledge>=node.knowledge;
}
function buyNode(id){
  const node=RESEARCH_NODES.find(n=>n.id===id); if(!node) return;
  if(node.once && state.purchases[id]) return;
  if(node.max && (state.purchases[id]||0)>=node.max) return;
  if(node.req && !state.purchases[node.req]) return;
  if(node.reqItem && (state.inventory[node.reqItem]||0)<(node.reqItemQty||1)) return;
  if(state.money<node.money || state.knowledge<node.knowledge) return;
  state.money-=node.money; state.knowledge-=node.knowledge;
  if(node.reqItem) state.inventory[node.reqItem]=(state.inventory[node.reqItem]||0)-(node.reqItemQty||1);
  state.purchases[id]=(state.purchases[id]||0)+1;
  node.effect(state);
  pushLog(`🔬 Investigación completada: ${node.name}.`);
  render();
}

function renderCounters(){
  $('statKnowledge').textContent=fmt(state.knowledge);
  $('statMoney').textContent='£'+fmt(state.money);
  $('statPrestige').textContent=fmt(state.prestige);
  $('statHelpers').textContent=fmt(state.helpers);
  $('statBooks').textContent=fmt(state.books);
  $('statSightings').textContent=fmt(totalSightings());
  $('statMonographs').textContent=fmt(monographCount());
  const region=currentRegion();
  $('regionPill').textContent=`${region.name} · ${region.code}`;
}

function renderIfOpen(tabs){ if(tabs.includes(tab)) renderPanel(); }
function updateFieldOutput(){
 if(tab!=='field')return;
 const last=state.lastEncounter;
 const result=document.getElementById('fieldResult');
 if(result){const signature=(last?.title||'')+'|'+(last?.subtitle||'');if(signature!==lastPanelSignature){result.innerHTML=encounterCardMarkup(last);result.classList.remove('encounter-reveal');void result.offsetWidth;result.classList.add('encounter-reveal');lastPanelSignature=signature;}}
 const autoNoticeEl=document.getElementById('autoNotice'); if(autoNoticeEl) autoNoticeEl.textContent=currentAutoNotice||'Sin actividad automática reciente.';
 const log=document.getElementById('fieldLog');
 if(log && diaryDirty && Date.now()-lastDisplayRefresh>800){log.innerHTML=state.log.map(x=>`<div class="log">${esc(x)}</div>`).join('');lastDisplayRefresh=Date.now();diaryDirty=false;}
}
function render(){ renderCounters(); renderPanel(); persist(); }
function renderCrown(){
  const coins=Math.floor(Math.max(0,state.crownCoins||0));
  return `<section class="card crown-card stack trial-crown">
    <div class="big">👑</div><h3 class="section">Corona inglesa · Laboratorio</h3>
    <div class="small">Esta es una herramienta de pruebas: las coronas son gratuitas, no hay compras reales ni pagos.</div>
    <div class="req"><strong>Coronas disponibles: ${fmt(coins)}</strong><div class="small">Equivalencia de prueba: 1 corona = £1</div></div>
    <div class="crown-quick-actions">
      <button class="btn gold" data-action="buy-crown" data-id="100">+100 coronas</button>
      <button class="btn gold" data-action="buy-crown" data-id="500">+500 coronas</button>
      <button class="btn gold" data-action="buy-crown" data-id="1000">+1.000 coronas</button>
    </div>
    <div class="crown-quick-actions">
      <button class="btn" data-action="exchange-crown" data-id="100" ${coins<100?'disabled':''}>Canjear 100 → £100</button>
      <button class="btn" data-action="exchange-crown" data-id="500" ${coins<500?'disabled':''}>Canjear 500 → £500</button>
      <button class="btn alt" data-action="exchange-crown" data-id="all" ${coins<1?'disabled':''}>Canjear todas → £${fmt(coins)}</button>
    </div>
    <div class="small">El canje consume coronas y añade la misma cantidad de libras. Tus datos existentes no se reinician.</div>
  </section>`;
}

function filterJournalRail(){
  const rail=panel.querySelector('#journalSpeciesRail');
  if(!rail)return;
  const q=journalRailQuery.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  let count=0;
  rail.querySelectorAll('[data-action="select-journal"]').forEach(button=>{
    const name=visibleName(button.dataset.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    button.hidden=!!q&&!name.includes(q);
    if(!button.hidden)count++;
  });
  const counter=panel.querySelector('#journalRailCount');
  if(counter)counter.textContent=count===0?'Sin resultados':count+' especies';
}
function renderPanel(){
  lastPanelSignature='';diaryDirty=true;
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  // Renderizar solo el módulo activo: un error en otra pestaña no bloquea todas.
  const renderers={
    atlas: renderAtlas, field: renderField, journal: renderJournal,
    research: renderResearch, society: renderSociety, bestiary: renderBestiary,
    museum: renderMuseum, expeditions: renderExpeditions,
    objects: renderObjects, crown: renderCrown
  };
  try{ panel.innerHTML=(renderers[tab]||renderField)(); }
  catch(err){
    console.error('El Gran Atlas: error en el módulo '+tab,err);
    panel.innerHTML='<section class="card stack"><h3>⚠️ No se pudo abrir este módulo</h3><p class="small">Puedes utilizar otra pestaña. Si el problema persiste, informa el nombre de la sección.</p></section>';
  }
  bindPanel();
  if(tab==='atlas'){
    const map=panel.querySelector('.atlas-v32-map-scroll');
    if(map)map.scrollLeft=atlasMapScrollLeft;
  }
  if(tab==='journal'){
    const rail=panel.querySelector('#journalSpeciesRail');
    const sheet=panel.querySelector('.journal-v311 .journal-sheet');
    if(rail)rail.scrollTop=journalRailScrollTop;
    if(sheet)sheet.scrollTop=journalSheetScrollTop;
  }
}

const ATLAS_CONTINENTS=[
  {id:'Europa',label:'Europa',icon:'🇪🇺',implemented:true},
  {id:'Asia',label:'Asia',icon:'🌏',implemented:true},
  {id:'África',label:'África',icon:'🌍',implemented:false},
  {id:'Norteamérica',label:'Norteamérica',icon:'🦬',implemented:false},
  {id:'Sudamérica',label:'Sudamérica',icon:'🦜',implemented:false},
  {id:'Oceanía',label:'Oceanía',icon:'🪃',implemented:false},
  {id:'Polos',label:'Polos',icon:'🧊',implemented:false},
  {id:'Océanos',label:'Océanos',icon:'🌊',implemented:false}
];
function regionRequirementsMet(r){
  if(!r) return false;
  if(r.continent==='Asia') return !!(state.upgrades.asiaUnlocked && state.prestige>=r.unlock.prestige);
  return state.prestige>=r.unlock.prestige;
}
function continentStatus(continent){
  if(continent==='Europa') return 'available';
  if(continent==='Asia') return state.upgrades.asiaUnlocked?'available':'unlockable';
  return 'locked';
}
function unlockRegion(id){
  const r=REGIONS.find(x=>x.id===id); if(!r || !regionRequirementsMet(r)) return;
  state.regionUnlocked[id]=true; pushLog('🗝️ Región desbloqueada: '+r.name+'.'); render();
}
function travelToRegion(id){ setRegion(id); tab='field'; renderPanel(); persist(); }
function fieldAid(kind){
  if(kind==='knowledge'){ state.knowledge+=150; pushLog('📜 Ayuda de campo: +150 conocimiento.'); render(); return; }
  const runs = kind==='sightings'? 10 : 5;
  batchingOffline=true;
  try{ for(let i=0;i<runs;i++) encounter('manual'); } finally { batchingOffline=false; }
  if(kind==='sightings'){ state.knowledge+=20; pushLog('🔭 Apoyo de observación: varias búsquedas aceleradas.'); }
  else { state.knowledge+=60; pushLog('🧭 Sesión guiada de campo completada.'); }
  renderCounters(); updateFieldOutput(); persist();
}
function spendMoneyForKnowledge(){
  const cost=100, gain=70;
  if(state.money<cost) return;
  state.money-=cost; state.knowledge+=gain; pushLog('📚 La Sociedad transforma £'+cost+' en '+gain+' conocimiento.'); render();
}
function compileAtlas(){
  const total=Object.keys(state.published).length;
  if(total<20 || state.knowledge<500) return;
  state.knowledge-=500; state.prestige+=1; pushLog('📘 Atlas general compilado: +1 prestigio.'); render();
}
function removeExhibit(id){
  if(!state.museum.exhibits[id]) return;
  delete state.museum.exhibits[id]; pushLog('🏛️ Se retiró de la sala: '+SPECIES[id].name); render();
}
function buyCrownPack(amount){
  if(!Number.isSafeInteger(amount) || amount<=0 || amount>1000) return;
  state.crownCoins=(state.crownCoins||0)+amount;
  pushLog('👑 Prueba: +'+amount+' coronas sin costo real.');render();
}
function exchangeTrialCrowns(amount){
  if(!Number.isSafeInteger(amount)||amount<=0) return;
  const available=Math.floor(Math.max(0,state.crownCoins||0));
  if(amount>available) return;
  state.crownCoins=available-amount;
  state.money=(Number(state.money)||0)+amount;
  pushLog('💷 Conversión de prueba: '+amount+' coronas → £'+amount+'.');render();
}

function bestiaryTypeBucket(id){
  const c=taxonomyInfo(id).className;
  if(c==='Mammalia') return 'Mamífero';
  if(c==='Aves') return 'Ave';
  if(c==='Actinopterygii') return 'Pez';
  return 'Reptil/Anfibio';
}
// v3.2: mapa hexagonal esquemático: posiciones basadas en códigos HX, no geografía exacta.
function renderAtlas(){
  const selected=ATLAS_CONTINENTS.some(c=>c.id===state.atlasView)?state.atlasView:'Europa';
  const continent=ATLAS_CONTINENTS.find(c=>c.id===selected)||ATLAS_CONTINENTS[0];
  const regions=REGIONS.filter(r=>r.continent===selected);
  const chosen=regions.find(r=>r.id===state.atlasSelectedRegion)
    ||regions.find(r=>r.id===state.currentRegion)||regions[0];
  const tabs=ATLAS_CONTINENTS.map(c=>'<button type="button" class="subtab '+(selected===c.id?'active ':'')+(!c.implemented?'muted':'')+'" data-action="atlas-tab" data-id="'+c.id+'">'+c.icon+' '+c.label+(!c.implemented?' 🔒':'')+'</button>').join('');
  const countReady=regions.filter(r=>!!state.regionUnlocked[r.id]||r.id===state.currentRegion).length;
  if(!continent.implemented)return '<section class="atlas-v32 stack"><header class="atlas-v32-title"><span>🗺️ Atlas de expediciones</span><small>Cartografía del naturalista · 1842</small></header><div class="subtabs atlas-v32-continents">'+tabs+'</div><div class="card atlas-v32-future"><div class="big-lock">🔒</div><h3>'+continent.icon+' '+continent.label+'</h3><p class="small">Continente reservado para una futura expedición. Europa y Asia están disponibles en la versión actual.</p></div></section>';
  const xs=regions.map(r=>Number(r.code.split('-')[2]));
  const ys=regions.map(r=>Number(r.code.split('-')[1]));
  const minCol=Math.min(...xs),maxCol=Math.max(...xs),minRow=Math.min(...ys),maxRow=Math.max(...ys);
  const w=164+(maxCol-minCol)*88, h=144+(maxRow-minRow)*77;
  const coords=r=>{
    const parts=r.code.split('-'); const row=Number(parts[1]),col=Number(parts[2]);
    return {x:79+(col-minCol)*88+(row%2?39:0),y:68+(row-minRow)*77};
  };
  const tiles=regions.map(r=>{
    const {x,y}=coords(r);
    const active=r.id===state.currentRegion, chosenTile=r.id===chosen?.id;
    const unlocked=!!state.regionUnlocked[r.id]||active, ready=!unlocked&&regionRequirementsMet(r);
    const status=active?'actual':unlocked?'abierta':ready?'disponible':'bloqueada';
    const label=r.name.length>17?r.name.slice(0,16)+'…':r.name;
    const points=[[-41,0],[-21,-36],[21,-36],[41,0],[21,36],[-21,36]].map(([dx,dy])=>(x+dx)+','+(y+dy)).join(' ');
    const count=r.species.filter(id=>stage(id)>=1).length;
    return '<g class="atlas-v32-hex atlas-v32-'+status+(chosenTile?' atlas-v32-selected':'')+'" role="button" tabindex="0" data-action="atlas-select-region" data-id="'+r.id+'" aria-label="'+esc(r.name)+'. '+count+' de '+r.species.length+' especies identificadas. '+status+'"><polygon points="'+points+'"/><text class="atlas-v32-hex-symbol" x="'+x+'" y="'+(y-11)+'" text-anchor="middle">'+(active?'📍':unlocked?'✓':ready?'🗝':'🔒')+'</text><text class="atlas-v32-hex-name" x="'+x+'" y="'+(y+7)+'" text-anchor="middle">'+esc(label)+'</text><text class="atlas-v32-hex-code" x="'+x+'" y="'+(y+23)+'" text-anchor="middle">'+count+'/'+r.species.length+'</text></g>';
  }).join('');
  const r=chosen;
  const active=r.id===state.currentRegion;
  const unlocked=!!state.regionUnlocked[r.id]||active;
  const ready=regionRequirementsMet(r);
  const identified=r.species.filter(id=>stage(id)>=1).length;
  const progress=Math.round(100*identified/Math.max(1,r.species.length));
  const status=active?'📍 Zona actual':unlocked?'✅ Ruta habilitada':ready?'🗝️ Puedes desbloquear esta zona':'🔒 Región bloqueada';
  const condition=r.continent==='Asia'
    ? (state.upgrades.asiaUnlocked?'✓ Cartografía de Asia':'✕ Necesitas investigar Cartografía de Asia')+' · '+r.unlock.prestige+' prestigio mínimo'
    : r.unlock.prestige+' prestigio mínimo';
  const action=active?'<button class="btn gold" disabled>Explorando aquí</button>'
    :unlocked?'<button class="btn gold" data-action="travel-region" data-id="'+r.id+'">🧭 Viajar a Campo</button>'
    :ready?'<button class="btn gold" data-action="unlock-region" data-id="'+r.id+'">🗝️ Desbloquear zona</button>'
    :'<button class="btn alt" disabled>🔒 Requisitos pendientes</button>';
  const areas=r.habitats.map(x=>'<span class="atlas-v32-chip">'+esc(x.charAt(0).toUpperCase()+x.slice(1))+'</span>').join('');
  return '<section class="atlas-v32 stack"><header class="atlas-v32-title"><span>🗺️ Atlas de expediciones</span><small>Cartografía del naturalista · 1842</small></header>'
    +'<div class="subtabs atlas-v32-continents">'+tabs+'</div>'
    +'<div class="atlas-v32-legend"><span>'+continent.icon+' '+continent.label+' · '+regions.length+' zonas</span><span>✅ '+countReady+' habilitadas</span></div>'
    +'<div class="atlas-v32-layout">'
    +'<section class="atlas-v32-map-card" aria-label="Mapa hexagonal de '+continent.label+'"><div class="atlas-v32-map-scroll"><svg class="atlas-v32-svg" style="--atlas-board-width:'+w+'px" viewBox="0 0 '+w+' '+h+'" aria-label="Selecciona una región en el mapa"><defs><linearGradient id="atlasMapPaper" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f2e7ce"/><stop offset="1" stop-color="#d9c6a1"/></linearGradient><pattern id="atlasGrid" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M18 0H0V18" fill="none" stroke="#b19e7d" stroke-opacity=".16"/></pattern></defs><rect width="'+w+'" height="'+h+'" rx="13" fill="url(#atlasMapPaper)"/><rect width="'+w+'" height="'+h+'" rx="13" fill="url(#atlasGrid)"/><path d="M7 '+(h-42)+' Q'+Math.round(w*.23)+' '+Math.round(h*.34)+' '+Math.round(w*.45)+' '+(h-38)+' T'+(w-9)+' '+Math.round(h*.42)+'" fill="none" stroke="#b9ab87" stroke-width="2" stroke-dasharray="7 9" opacity=".44"/>'+tiles+'</svg></div><div class="atlas-v32-map-foot"><span><i class="atlas-dot atlas-dot-active"></i> Actual</span><span><i class="atlas-dot atlas-dot-open"></i> Accesible</span><span><i class="atlas-dot atlas-dot-ready"></i> Desbloquear</span><span><i class="atlas-dot atlas-dot-locked"></i> Bloqueada</span></div></section>'
    +'<section class="card atlas-v32-details" aria-live="polite"><div class="atlas-v32-eyebrow">FICHA DE REGIÓN · '+r.code+'</div><h3>'+esc(r.name)+'</h3><div class="atlas-v32-state">'+status+'</div><div class="atlas-v32-count">'+identified+' <small>/ '+r.species.length+' especies identificadas</small></div><div class="progress"><div style="width:'+progress+'%"></div></div><div class="atlas-v32-req">'+esc(condition)+'</div><div class="atlas-v32-subtitle">Hábitats registrados</div><div class="atlas-v32-chips">'+areas+'</div><div class="atlas-v32-action">'+action+'</div><div class="small">El prestigio acumulado no se consume al desbloquear una región.</div></section></div>'
    +'<div class="atlas-v32-note">Toca un hexágono para inspeccionarlo. Desliza el mapa horizontalmente si necesitas ver más zonas. Las coordenadas HX corresponden al esquema del juego, no a un mapa geográfico a escala.</div></section>';
}

// v3.1: escenografía SVG ligera; no afecta encuentros, especies, guardados ni economía.
function fieldBackdropMarkup(habitat){
  const trees=habitat==='bosque'||habitat==='mediterraneo'||habitat==='humedal';
  const wet=habitat==='rio'||habitat==='costa'||habitat==='humedal';
  const arid=habitat==='desierto'||habitat==='estepa';
  const peaks=habitat==='montana'||habitat==='tundra';
  return `<svg class="field-backdrop" viewBox="0 0 640 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs><linearGradient id="fieldSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--biome-sky)"/><stop offset="1" stop-color="var(--biome-haze)"/></linearGradient></defs>
    <rect width="640" height="280" fill="url(#fieldSky)"/>
    <circle class="field-sun" cx="502" cy="57" r="26" fill="#fce4a7" opacity=".78"/>
    <path d="M0 171 Q72 119 146 159 T315 156 T490 148 T640 166 V280 H0Z" fill="var(--biome-far)" opacity=".85"/>
    ${peaks?`<path d="M0 185 L97 65 188 177 306 70 415 191 513 82 640 179 V280 H0Z" fill="#667e81" opacity=".8"/><path d="M66 106 97 65 126 112 103 104 94 117Z M271 110 306 70 347 122 318 111 302 123Z M478 123 513 82 540 119 515 111 502 126Z" fill="#f0e9dd" opacity=".94"/>`:''}
    ${arid?`<path d="M0 210 Q94 169 204 200 T415 207 T640 191 V280 H0Z" fill="#b99e6e" opacity=".75"/><path d="M0 239 Q146 193 292 224 T640 210 V280 H0Z" fill="#b09567"/>`:''}
    ${trees?`<g fill="var(--biome-tree)" opacity=".86"><path d="M20 207 V137 L-8 160 22 104 45 151 24 139 24 207Z"/><path d="M88 205 V143 L64 157 88 92 113 159 91 143 91 205Z"/><path d="M558 201 V138 L528 153 558 91 588 161 561 141 561 201Z"/><path d="M628 213 V128 L595 147 628 71 662 155 632 134 632 213Z"/><circle cx="148" cy="166" r="38"/><circle cx="480" cy="155" r="35"/></g><g stroke="#756b4e" stroke-width="6"><path d="M149 167v55 M480 160v60"/></g>`:''}
    <path d="M0 211 Q110 183 217 209 T436 209 T640 199 V280 H0Z" fill="var(--biome-ground)"/>
    ${wet?`<path d="M0 229 Q120 217 222 231 T434 228 T640 225 V280 H0Z" fill="#7cbbc1" opacity=".86"/><g fill="none" stroke="#e7f2e8" stroke-width="2" opacity=".62"><path d="M28 248q40-6 74 0 M252 261q35-5 75 0 M461 244q44-6 85 0"/></g>`:arid?`<path d="M0 260 Q165 223 312 251 T640 242V280H0Z" fill="#c8b080"/>`:`<g fill="var(--biome-grass)" opacity=".9"><path d="M0 245q115-18 207-3t240-9 193 3v44H0Z"/></g>`}
    <g stroke="var(--biome-detail)" stroke-width="2.2" stroke-linecap="round" opacity=".8"><path d="M62 263l-6-14m6 14 7-12 M206 276l-4-17m4 17 8-12 M423 268l-3-16m3 16 6-9 M591 265l-5-16m5 16 7-12"/></g>
  </svg>`;
}
function encounterCardMarkup(last){
  const hasAnimal=!!last?.species;
  const title=last?.title||'Aún sin avistamientos';
  const detail=last?.subtitle||'Busca animales para comenzar tu registro de campo.';
  return `<div class="encounter-art ${hasAnimal?'animal-found':'empty-encounter'}"><div class="sprite-wrap">${last?.sprite || '<span class="field-binoculars" aria-hidden="true">🔭</span>'}</div></div>
    <div class="encounter-copy"><strong>${title}</strong><div class="small subtitle">${detail}</div></div>`;
}
function renderField(){
  const region=currentRegion();
  const scene=regionLandscape(region.id);
  const habitat=state.habitat;
  const validBiomes=['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal'];
  const biome=validBiomes.includes(habitat)?habitat:'bosque';
  const lights=['amanecer','dia','atardecer','noche'];
  const light=lights.includes(state.time)?state.time:'dia';
  return `<div class="field-v31 grid-2">
    <section class="card field-expedition">
      <div class="field-heading"><div><span class="field-eyebrow">CUADERNO DE CAMPO · ${region.code}</span><h3 class="section">${region.name}</h3></div><span class="field-compass" aria-hidden="true">✦</span></div>
      <div class="field-condition-line" aria-label="Condiciones de búsqueda"><span>${habitatLabel(habitat)}</span><span>${timeLabel(state.time)}</span><span>${seasonLabel(state.season)}</span></div>
      <div class="scene biome-${biome} light-${light}" id="fieldScene" role="group" aria-label="Paisaje de ${habitatLabel(habitat)}">
        ${fieldBackdropMarkup(habitat)}
        <div class="scene-top"><span class="scene-locale">✦ ${scene[3].replace(/[^\p{Extended_Pictographic}\s]/gu,'').trim()||'NATURALEZA'}</span><span class="scene-survey">OBSERVACIÓN Nº ${fmt(totalSightings()+1)}</span></div>
        <div class="result-card" id="fieldResult" aria-live="polite">${encounterCardMarkup(state.lastEncounter)}</div>
        <div class="scene-bottom"><span>El mundo natural espera ser documentado</span><span>1842 · ${region.code}</span></div>
      </div>
      <button class="big-action field-observe" data-action="search-manual" type="button"><span aria-hidden="true">⌕</span> Observar fauna <span aria-hidden="true">✦</span></button>
      <div class="field-filter-block ${state.fieldFiltersOpen?'field-filter-open':''}">
        <button class="field-filter-toggle" type="button" data-action="toggle-field-filters" aria-expanded="${!!state.fieldFiltersOpen}"><span>⚙️ Condiciones de exploración</span><span class="field-filter-summary">${habitatLabel(habitat)} · ${timeLabel(state.time)} · ${seasonLabel(state.season)}</span><span aria-hidden="true">${state.fieldFiltersOpen?'▴':'▾'}</span></button>
        <div class="field-filter-controls">
          <div><div class="small field-choice-label">HÁBITAT</div><div class="choice-row">${region.habitats.map(h=>`<button class="choice ${state.habitat===h?'active':''}" data-action="set-habitat" data-id="${h}">${habitatLabel(h)}</button>`).join('')}</div></div>
          <div><div class="small field-choice-label">HORARIO</div><div class="choice-row">${['amanecer','dia','atardecer','noche'].map(t=>`<button class="choice ${state.time===t?'active':''}" data-action="set-time" data-id="${t}">${timeLabel(t)}</button>`).join('')}</div></div>
          <div><div class="small field-choice-label">ESTACIÓN</div><div class="choice-row">${['primavera','verano','otono','invierno'].map(t=>`<button class="choice ${state.season===t?'active':''}" data-action="set-season" data-id="${t}">${seasonLabel(t)}</button>`).join('')}</div></div>
        </div>
      </div>
      <details class="field-toolkit"><summary><span>🎒 Herramientas del naturalista</span><span>Ayudas de prueba · desplegar</span></summary>
        <div class="helper-row"><button class="btn gold" data-action="field-aid" data-id="knowledge">+ conocimiento</button><button class="btn gold" data-action="field-aid" data-id="sightings">+ avistamientos</button><button class="btn alt" data-action="field-aid" data-id="guided">Sesión guiada</button></div>
      </details>
    </section>
    <section class="card field-diary"><div class="field-diary-head"><h3 class="section">✒️ Diario de expedición</h3><span class="field-diary-seal">REGISTRO</span></div>
      <div class="small" id="autoNotice">${currentAutoNotice||'Sin actividad automática reciente.'}</div>
      <div class="list" id="fieldLog">${state.log.map(x=>`<div class="log">${esc(x)}</div>`).join('')}</div>
    </section>
  </div>`;
}
function renderJournal(){
  const ids=currentRegion().species;
  if(!ids.includes(state.selectedJournal)) state.selectedJournal=ids.find(sid=>stage(sid)>=1)||ids[0];
  const id=state.selectedJournal || ids[0];
  const sp=SPECIES[id];
  const st=stage(id);
  const next=st<5?stageRequirements(id,st):null;
  const isKnown=!!state.discovered[id];
  const stamps=['I','II','III','IV','V'].map((mark,i)=>`<div class="journal-stamp ${i<st?'earned':''}" aria-label="Etapa ${i+1} ${i<st?'alcanzada':'pendiente'}"><span>${i<st?'✦':mark}</span><small>${['Vista','Nombre','Conducta','Hábitos','Estudio'][i]}</small></div>`).join('');
  const railIds=journalSortMode==='sightings'
    ? [...ids].sort((a,b)=>sight(b)-sight(a)||ids.indexOf(a)-ids.indexOf(b))
    : ids;
  return `<div class="journal-v31 journal-v311">
    <div class="journal-index journal-v311-heading"><span>📖 Cuaderno de campo</span><span class="small">${currentRegion().name} · ${regionIdentifiedCount(state.currentRegion)}/${ids.length} identificadas</span></div>
    <div class="journal-grid journal-v311-layout">
      <aside class="journal-v311-directory" aria-label="Catálogo de especies de la región">
        <div class="journal-v311-filters">
          <label for="journalRailSearch" class="sr-only">Buscar especie en esta región</label>
          <input id="journalRailSearch" type="search" placeholder="⌕ Buscar especie" autocomplete="off" value="${esc(journalRailQuery).replace(/"/g,'&quot;')}" aria-label="Buscar especie" />
          <label for="journalRailSort" class="sr-only">Ordenar especies</label>
          <select id="journalRailSort" aria-label="Ordenar especies"><option value="catalog" ${journalSortMode==='catalog'?'selected':''}>Orden del catálogo</option><option value="sightings" ${journalSortMode==='sightings'?'selected':''}>Más avistadas</option></select>
          <div class="journal-v311-count" id="journalRailCount" aria-live="polite">${ids.length} especies</div>
        </div>
        <nav class="journal-v311-rail" id="journalSpeciesRail" aria-label="Lista de especies, desplazamiento independiente">
          ${railIds.map(sid=>{
            const known=!!state.discovered[sid];
            const selected=sid===id;
            const name=visibleName(sid);
            return `<button type="button" class="journal-v311-animal ${selected?'selected':''}" data-action="select-journal" data-id="${sid}" ${selected?'aria-current="true"':''} aria-label="${esc(name).replace(/"/g,'&quot;')}, ${fmt(sight(sid))} avistamientos, etapa ${stage(sid)} de 5">
              <span class="journal-v311-avatar">${known?getSpriteMarkup(sid,'normal'):'<span class="journal-v311-unknown" aria-hidden="true">?</span>'}</span>
              <span class="journal-v311-animal-name">${esc(name)}</span>
              <span class="journal-v311-sightings" aria-label="${fmt(sight(sid))} avistamientos">👁 <b>${fmt(sight(sid))}</b></span>
              <span class="journal-v311-progress">${stage(sid)}/5</span>
            </button>`;
          }).join('')}
        </nav>
      </aside>
      <section class="card journal-detail journal-sheet">
        <div class="journal-sheet-top"><span>ARCHIVO DEL NATURALISTA</span><span>FOLIO ${String(ids.indexOf(id)+1).padStart(3,'0')}</span></div>
        <div class="journal-cover"><div class="journal-portrait"><div class="sprite-wrap">${isKnown?getSpriteMarkup(id,'normal'):'<div class="qmark">?</div>'}</div><span>ILUSTRACIÓN DE CAMPO</span></div><div class="journal-identity"><div class="journal-rarity">${rarityBadge(sp.rare)}</div><h2>${visibleName(id)}</h2><em>${visibleLatin(id)}</em><div class="journal-stage-label">Investigación · ${st} de 5 etapas</div></div></div>
        <section class="journal-research"><div class="journal-block-heading"><strong>✦ Progreso científico</strong><span>${Math.round(st/5*100)}%</span></div><div class="journal-stamps">${stamps}</div><div class="journal-track"><span style="width:${st/5*100}%"></span></div></section>
        <div class="journal-facts"><div><span>AVISTAMIENTOS</span><strong>${fmt(sight(id))}</strong></div><div><span>ALIMENTACIÓN</span><strong>${fmt(feed(id))}/10</strong></div><div><span>ESPECIALES</span><strong>${fmt(specials(id))}</strong></div><div><span>DIMORFISMO</span><strong>${sp.dimorphism?dimorphismProgress(id)+'/2':'—'}</strong></div></div>
        <section class="journal-collection"><div class="journal-block-heading"><strong>◈ Variantes observadas</strong></div><div class="journal-variants">${specialBadges(id)}</div></section>
        ${SEXUAL_DIMORPHISM[id]?`<section class="journal-collection"><div class="journal-block-heading"><strong>⚤ Dimorfismo sexual</strong><span>${dimorphismProgress(id)}/2</span></div>${renderSexComparison(id)}</section>`:''}
        <section class="journal-milestone ${next?.allOk?'milestone-ready':''}">
          ${next?`<div class="journal-block-heading"><strong>✒️ Próximo estudio · ${next.label}</strong><span>${st+1}/5</span></div>
          <div class="journal-milestone-meter"><span style="width:${Math.min(100,sight(id)/Math.max(1,next.needSight)*100)}%"></span></div>
          <p>Se necesitan <b>${next.needSight} avistamientos</b>, £${next.money} y ${next.knowledge} puntos de conocimiento.</p><p class="small">${next.extra}</p>
          <button class="btn ${next.allOk?'':'alt'}" data-action="advance-species" data-id="${id}" ${next.allOk?'':'disabled'}>${next.allOk?'✦ Investigar etapa '+(st+1):'Estudio aún no disponible'}</button>`:
          `<div class="journal-block-heading"><strong>🏛️ Monografía completa</strong><span>Sello V</span></div><p>La especie puede publicarse en Sociedad si aún no lo has hecho.</p>`}
        </section>
        <details class="journal-reference"><summary><span>▤ Clasificación científica</span><span>Consultar ficha</span></summary><div class="journal-reference-content">${taxonomyText(id)}</div></details>
        <details class="journal-reference"><summary><span>⌁ Ecología y condiciones conocidas</span><span>Consultar ficha</span></summary><div class="journal-reference-content mini-conditions"><div><b>Hábitats:</b> ${st>=1?sp.habitats.map(habitatLabel).join(', '):'desconocidos'}</div><div><b>Horarios:</b> ${st>=3?sp.times.map(timeLabel).join(', '):'por estudiar'}</div><div><b>Estaciones:</b> ${st>=4?sp.seasons.map(seasonLabel).join(', '):'pendientes de estudio'}</div></div></details>
        <div class="journal-folio-bottom">EL GRAN ATLAS · ARCHIVO CIENTÍFICO · 1842</div>
      </section>
    </div>
  </div>`;
}

function renderResearch(){
  const layout={
    prismaticos_1:[1,1],prismaticos_2:[2,1],cuaderno_1:[1,2],sociedad_1:[2,2],sociedad_2:[3,2],gabinete_1:[4,2],
    metodo_1:[1,3],metodo_2:[2,3],metodo_3:[3,3],metodo_4:[4,3],
    novato:[1,4],capacitacion_1:[2,4],capacitacion_2:[3,4],astillero:[4,4],
    rutas_1:[5,4],rutas_2:[6,4],casco_1:[5,5],flota_1:[6,5],asia_1:[7,4]
  };
  const nodeMap=Object.fromEntries(RESEARCH_NODES.map(n=>[n.id,n]));
  const nodes=RESEARCH_NODES.map(node=>{
    const [col,row]=layout[node.id]||[1,1];
    const bought=state.purchases[node.id]||0;
    const maxed=(node.once && bought) || (node.repeat && node.max && bought>=node.max);
    const disabled=!canBuy(node) && !maxed;
    return `<div class="skill-node ${maxed?'done':''} ${disabled?'locked':''}" style="grid-column:${col};grid-row:${row}" data-id="${node.id}">
      <div class="skill-star">${maxed?'⭐':'✦'}</div>
      <strong>${node.name}</strong>
      <div class="small">${node.desc}</div>
      <div class="tiny">£${node.money} · ${node.knowledge} conocimiento${node.reqItem?` · ${ITEMS[node.reqItem].name} ×${node.reqItemQty||1}`:''}${node.repeat?` · ${bought}/${node.max||'∞'}`:''}</div>
      <button class="btn ${maxed?'gold':'alt'}" data-action="buy-node" data-id="${node.id}" ${disabled?'disabled':''}>${maxed?'Adquirido':'Investigar'}</button>
    </div>`;
  }).join('');
  const links=RESEARCH_NODES.filter(n=>n.req).map(n=>{
    const [c1,r1]=layout[n.req]||[1,1], [c2,r2]=layout[n.id]||[1,1];
    return `<div class="skill-link" style="grid-column:${Math.min(c1,c2)}/${Math.max(c1,c2)+1};grid-row:${Math.min(r1,r2)}/${Math.max(r1,r2)+1}"></div>`;
  }).join('');
  return `<div class="grid-2 research-wrap">
    <section class="card stack">
      <h3 class="section">🔬 Investigación</h3>
      <div class="small">El sistema ahora se muestra como un árbol de habilidades: observación, sociedad, automatización y cartografía.</div>
      <div class="skill-tree"><div class="skill-tree-grid">${links}${nodes}</div></div>
    </section>
    <section class="card stack">
      <h3 class="section">📐 Estado de desarrollo</h3>
      <div class="req"><strong>Prismáticos</strong><div class="small">Nivel: ${state.upgrades.prism}</div></div>
      <div class="req"><strong>Cuaderno</strong><div class="small">Mejora activa: ${state.upgrades.journal? 'Sí':'No'}</div></div>
      <div class="req"><strong>Método de rastreo</strong><div class="small">Nivel: ${state.upgrades.autoTier} · intervalo actual: ${autoInterval()} s</div></div>
      <div class="req"><strong>Capacitación</strong><div class="small">Nivel: ${state.upgrades.training}</div></div>
      <div class="req"><strong>Astillero</strong><div class="small">${state.upgrades.shipyard?'Preparado para expediciones':'Aún no construido'}</div></div>
      <div class="req"><strong>Sociedad</strong><div class="small">Subvención +${Math.round((state.upgrades.grantBonus||0)*100)}% · canje de notas +${Math.round((state.upgrades.noteBonus||0)*100)}%</div></div>
      <div class="req"><strong>Expediciones</strong><div class="small">Rutas navales ${state.upgrades.routeTier||0} · tiempo ×${(state.upgrades.voyageTime||1).toFixed(2)} · destacamentos simultáneos ${maxVoyages()}</div></div>
      <div class="req"><strong>Asia</strong><div class="small">${state.upgrades.asiaUnlocked?'Cartografía completada.':'Aún bloqueada. Requiere el Mapa de Asia y la investigación final.'}</div></div>
    </section>
  </div>`;
}

function renderSociety(){
  const publishable=Object.keys(state.discovered).filter(id=>stage(id)>=5 && !state.published[id]);
  const identified=Object.keys(state.discovered).length;
  const publications=Object.keys(state.published).filter(id=>state.published[id]).length;
  const continentStats=[...new Set(REGIONS.map(r=>r.continent))].map(cont=>{
    const ids=[...new Set(REGIONS.filter(r=>r.continent===cont).flatMap(r=>r.species))];
    const completed=ids.filter(id=>state.published[id]).length;
    const discovered=ids.filter(id=>state.discovered[id]).length;
    return `<div class="req"><strong>${cont}</strong><div class="small">${discovered}/${ids.length} especies registradas · ${completed}/${ids.length} monografías publicadas</div></div>`;
  }).join('');
  const grants=`
    <div class="choice-row">
      <button class="btn gold" data-action="grant" ${Date.now()-state.lastGrant<60000 || !identified?'disabled':''}>Solicitar subvención</button>
      <button class="btn alt" data-action="exchange-notes" ${state.knowledge<40?'disabled':''}>Notas → Libras</button>
      <button class="btn alt" data-action="money-to-knowledge" ${state.money<100?'disabled':''}>£100 → 70 conocimiento</button>
    </div>
    <div class="small">Subvención disponible cada 60 s · Intercambio de libras por conocimiento para financiar estudios.</div>
    <div class="req"><strong>Fondos disponibles</strong><div class="small">£${fmt(state.money)} · ${fmt(state.knowledge)} conocimiento</div></div>
    <div class="req"><strong>Bonos de la Sociedad</strong><div class="small">Subvenciones +${Math.round((state.upgrades.grantBonus||0)*100)}% · canje +${Math.round((state.upgrades.noteBonus||0)*100)}%</div></div>`;
  let pubContent='';
  if(state.publicationView==='monographs'){
    pubContent=`<div class="req"><strong>Monografías publicadas</strong><div class="small">${publications} de ${Object.keys(SPECIES).length}</div></div><div class="list">${publishable.map(id=>`<div class="atlas-region"><div><strong>${visibleName(id)}</strong><div class="small">5/5 · lista para publicar</div></div><button class="btn" data-action="publish" data-id="${id}">Publicar</button></div>`).join('')||'<div class="small">Aún no hay nuevas monografías listas. Investiga una especie hasta 5/5.</div>'}</div>`;
  } else if(state.publicationView==='codex'){
    pubContent=`<div class="small">Códex: compilación de las monografías de cada continente.</div>${continentStats}`;
  } else {
    pubContent=`<div class="req"><strong>Atlas mundial</strong><div class="small">${publications} / ${Object.keys(SPECIES).length} monografías publicadas.</div><div class="progress"><div style="width:${Math.round(100*publications/Object.keys(SPECIES).length)}%"></div></div></div><div class="small">El atlas total recopila todas las especies conocidas; los continentes pendientes se incorporarán en versiones posteriores.</div>`;
  }
  const publicationsPane=`<div class="subtabs compact">${[['monographs','📜 Monografías'],['codex','📚 Códex'],['atlas','🌐 Atlas total']].map(([id,label])=>`<button class="subtab ${state.publicationView===id?'active':''}" data-action="publication-tab" data-id="${id}">${label}</button>`).join('')}</div>${pubContent}`;
  const missions=`<div class="locked-panel"><div class="big-lock">🔒</div><div><strong>Misiones</strong><div class="small">Próximamente: encargos de investigación y objetivos científicos.</div></div></div>`;
  return `<div class="grid-2">
    <section class="card stack">
      <h3 class="section">🏛️ Real Sociedad de Historia Natural</h3>
      <div class="subtabs">${[['grants','💷 Subvenciones'],['publications','📚 Publicaciones'],['missions','🎯 Misiones']].map(([id,label])=>`<button class="subtab ${state.societyView===id?'active':''}" data-action="society-tab" data-id="${id}">${label}</button>`).join('')}</div>
      ${state.societyView==='grants'?grants:state.societyView==='publications'?publicationsPane:missions}
    </section>
    <section class="card stack">
      <h3 class="section">📊 Registro científico</h3>
      <div class="req"><strong>Prestigio acumulado</strong><div class="small">${fmt(state.prestige)} · no se consume al viajar.</div></div>
      <div class="req"><strong>Monografías</strong><div class="small">${publications} publicadas</div></div>
      <div class="req"><strong>Descubrimientos</strong><div class="small">${identified} / ${Object.keys(SPECIES).length} especies</div></div>
      <div class="req"><strong>Tomos existentes</strong><div class="small">${state.books} · legados del sistema anterior</div></div>
    </section>
  </div>`;
}

const MUSEUM_WINGS = [
  {level:1,name:'Galería de fauna',cost:0,prestige:0},
  {level:2,name:'Sala de historia natural',cost:300,prestige:2},
  {level:3,name:'Gran galería zoológica',cost:900,prestige:5}
];
function exhibitPrice(id){return ({'Común':45,'Poco común':70,'Raro':105,'Muy rara':150}[SPECIES[id].rare]||60);}
function exhibitIncome(id){return ({'Común':0.16,'Poco común':0.24,'Raro':0.34,'Muy rara':0.5}[SPECIES[id].rare]||0.2);}
function museumRate(){return Object.keys(state.museum.exhibits||{}).reduce((total,id)=>total+exhibitIncome(id),0);}
function museumCapacity(){return [0,3,7,12][state.museum.wing] || 12;}
function expandMuseum(){
 const next=MUSEUM_WINGS[state.museum.wing];
 if(!next || state.prestige<next.prestige || state.money<next.cost)return;
 state.money-=next.cost;state.museum.wing++;pushLog('🏛️ Museo ampliado: '+next.name);render();
}
function exhibitAnimal(id){
 if(stage(id)!==5 || !state.published[id] || state.museum.exhibits[id] || Object.keys(state.museum.exhibits).length>=museumCapacity())return;
 const price=exhibitPrice(id);if(state.money<price)return;
 state.money-=price;state.museum.exhibits[id]=true;
 pushLog('🏛️ Exposición inaugurada: '+SPECIES[id].name);render();
}
function renderMuseum(){
 const exhibits=state.museum.exhibits||{};
 const exhibitIds=Object.keys(exhibits);
 const count=exhibitIds.length;
 const next=MUSEUM_WINGS[state.museum.wing];
 const publishedIds=Object.keys(SPECIES).filter(id=>state.published[id] || exhibits[id]);
 return `<div class="grid-2">
 <section class="card stack"><h3 class="section">🏛️ Museo de Historia Natural</h3>
  <div class="subtabs">${[['exhibitions','🖼️ Exposiciones'],['fossils','🦴 Fósiles'],['relicts','🗿 Relictos']].map(([id,label])=>`<button class="subtab ${state.museumView===id?'active':''}" data-action="museum-tab" data-id="${id}">${label}</button>`).join('')}</div>
  ${state.museumView==='exhibitions' ? `
    <div class="small">Expón especies investigadas 5/5 y con monografía para producir libras automáticamente.</div>
    <div class="req"><strong>Galería nivel ${state.museum.wing}</strong>
      <div class="small">Capacidad: ${count}/${museumCapacity()} exposiciones</div>
      <div class="small">Ingresos: £${museumRate().toFixed(2)} por segundo (hasta 8 h offline)</div>
    </div>
    ${next?`<button class="btn" data-action="expand-museum" ${state.prestige<next.prestige||state.money<next.cost?'disabled':''}>Ampliar: ${next.name} · £${next.cost} y ${next.prestige} prestigio</button>`:`<div class="badge">Nivel máximo del prototipo</div>`}
    <div class="showcase-grid">${exhibitIds.length?exhibitIds.map(id=>`<div class="showpiece"><div class="sprite-wrap">${getSpriteMarkup(id)}</div><strong>${SPECIES[id].name}</strong><div class="small">${SPECIES[id].rare}</div><div class="badge">£${exhibitIncome(id).toFixed(2)}/s</div><button class="btn alt" data-action="remove-exhibit" data-id="${id}">Cambiar especie</button></div>`).join(''):`<div class="small">Aún no has montado exposiciones.</div>`}</div>
    <div class="divider"></div><h3 class="section">🐾 Animales con monografía</h3>
    <div class="list">${publishedIds.map(id=>{ const owned=!!exhibits[id],complete=stage(id)===5 && !!state.published[id],price=exhibitPrice(id); return `<div class="atlas-region"><div class="head" style="display:flex;gap:8px;align-items:center"><div class="sprite-wrap">${getSpriteMarkup(id)}</div><div><strong>${visibleName(id)}</strong><div class="small">${stage(id)}/5 · ${owned?'Expuesto · £'+exhibitIncome(id).toFixed(2)+'/s':complete?'Elegible para exponer':'Investigación incompleta'}</div></div></div>${owned?'<span class="badge">En sala</span>':`<button class="btn" data-action="exhibit" data-id="${id}" ${!complete || count>=museumCapacity() || state.money<price?'disabled':''}>Exponer · £${price} · +£${exhibitIncome(id).toFixed(2)}/s</button>`}</div>`; }).join('')||'<div class="small">Publica monografías desde Sociedad para habilitar animales en el museo.</div>'}</div>
  ` : state.museumView==='fossils' ? `<div class="locked-panel"><div class="big-lock">🦴</div><div><strong>Fósiles</strong><div class="small">Aquí aparecerán las piezas paleontológicas y futuras salas temáticas.</div></div></div>` : `<div class="locked-panel"><div class="big-lock">🗿</div><div><strong>Relictos</strong><div class="small">Espacio reservado para hallazgos raros y piezas únicas de expedición.</div></div></div>`}
 </section><section class="card stack"><h3 class="section">📊 Resumen del museo</h3>
   <div class="req"><strong>Exposiciones activas</strong><div class="small">${count}</div></div>
   <div class="req"><strong>Capacidad total</strong><div class="small">${museumCapacity()}</div></div>
   <div class="req"><strong>Ingreso pasivo</strong><div class="small">£${museumRate().toFixed(2)} / segundo</div></div>
   <div class="req"><strong>Notas</strong><div class="small">Usa “Cambiar especie” para retirar una exhibición y abrir espacio a otra.</div></div>
 </section></div>`;
}
const VOYAGES=[
 {id:'coast',name:'Reconocimiento costero',seconds:90,cost:35,knowledge:10,prize:65,notes:25,required:0},
 {id:'north',name:'Cartografía del mar del Norte',seconds:180,cost:90,knowledge:35,prize:150,notes:70,required:1},
 {id:'alps',name:'Misión a los Alpes',seconds:300,cost:180,knowledge:75,prize:260,notes:125,required:2},
 {id:'carpathians',name:'Ruta científica a los Cárpatos',seconds:420,cost:260,knowledge:110,prize:380,notes:180,required:4,routeReq:1},
 {id:'balkans',name:'Ruta científica a los Balcanes',seconds:520,cost:340,knowledge:150,prize:500,notes:250,required:6,routeReq:2}
];
const ITEMS={
 binoculars:{name:'Prismáticos de viaje',emoji:'🔭',slot:'instrument',bonus:'+12% encuentros manuales',kind:'equip'},
 brass_compass:{name:'Brújula de latón',emoji:'🧭',slot:'instrument',bonus:'+4% conocimiento por expedición',kind:'equip'},
 sturdy_pack:{name:'Morral reforzado',emoji:'🎒',slot:'instrument',bonus:'+3% objetos en expediciones',kind:'equip'},
 field_hat:{name:'Sombrero de naturalista',emoji:'🎩',slot:'hat',bonus:'+10% conocimiento',kind:'equip'},
 feather_cap:{name:'Gorro emplumado',emoji:'🪶',slot:'hat',bonus:'+6% probabilidad de objetos',kind:'equip'},
 rain_hood:{name:'Capucha impermeable',emoji:'🧥',slot:'hat',bonus:'+5% búsquedas automáticas',kind:'equip'},
 amulet:{name:'Colgante del explorador',emoji:'📿',slot:'necklace',bonus:'+8% rendimiento del equipo',kind:'equip'},
 amber_charm:{name:'Amuleto de ámbar',emoji:'🟠',slot:'necklace',bonus:'+5% subvenciones',kind:'equip'},
 shell_necklace:{name:'Collar de conchas',emoji:'🐚',slot:'necklace',bonus:'+5% valor de viaje',kind:'equip'},
 fossil_fragment:{name:'Fragmento fósil',emoji:'🦴',slot:null,bonus:'Hallazgo de expedición',kind:'voyage'},
 animal_trace:{name:'Muestra de huellas',emoji:'🐾',slot:null,bonus:'Hallazgo de expedición',kind:'voyage'},
 pressed_flower:{name:'Flor prensada',emoji:'🌼',slot:null,bonus:'Hallazgo de expedición',kind:'voyage'},
 ancient_coin:{name:'Moneda antigua',emoji:'🪙',slot:null,bonus:'Hallazgo de expedición',kind:'voyage'},
 map_fragment:{name:'Fragmento de mapa',emoji:'🗺️',slot:null,bonus:'Hallazgo de expedición',kind:'voyage'},
 asia_map_piece:{name:'Parte de mapa de Asia',emoji:'🧭',slot:null,bonus:'Fragmento raro de expedición',kind:'voyage'},
 asia_map:{name:'Mapa de Asia',emoji:'🗺️',slot:null,bonus:'Mapa ensamblado para futuras exploraciones',kind:'voyage'},
 africa_map_piece:{name:'Parte de mapa de África',emoji:'🧩',slot:null,bonus:'Fragmento cartográfico de expedición',kind:'voyage'},
 africa_map:{name:'Mapa de África',emoji:'🗺️',slot:null,bonus:'Mapa ensamblado · África llegará en el futuro',kind:'voyage'},
 parchment_scrap:{name:'Pergamino antiguo',emoji:'📜',slot:null,bonus:'Material de viaje',kind:'voyage'},
 river_pebble:{name:'Piedra de río pulida',emoji:'🪨',slot:null,bonus:'Material de viaje',kind:'voyage'},
 heron_feather:{name:'Pluma de garza',emoji:'🪶',slot:null,bonus:'Material animal',kind:'animal'},
 polished_lens:{name:'Lente pulida',emoji:'🔍',slot:null,bonus:'Material de fabricación',kind:'voyage'},
 wolf_tooth:{name:'Diente de lobo',emoji:'🦷',slot:null,bonus:'Trofeo de animal',kind:'animal'},
 owl_feather:{name:'Pluma de rapaz',emoji:'🪶',slot:null,bonus:'Trofeo de animal',kind:'animal'},
 antler_fragment:{name:'Fragmento de cornamenta',emoji:'🦌',slot:null,bonus:'Trofeo de animal',kind:'animal'},
 otter_whisker:{name:'Bigote de nutria',emoji:'〰️',slot:null,bonus:'Trofeo de animal',kind:'animal'},
 boar_tusk:{name:'Colmillo de jabalí',emoji:'🦷',slot:null,bonus:'Trofeo de animal',kind:'animal'},
 beaver_tail_scale:{name:'Escama de cola de castor',emoji:'🪵',slot:null,bonus:'Trofeo de animal',kind:'animal'}
};
const SPECIES_DROPS={
 lobo_gris:'wolf_tooth',
 buho_real:'owl_feather',
 buho_comun:'owl_feather',
 aguila_real:'owl_feather',
 milano_real:'owl_feather',
 ciervo_rojo:'antler_fragment',
 corzo_europeo:'antler_fragment',
 nutria_europea:'otter_whisker',
 jabali:'boar_tusk',
 castor_europeo:'beaver_tail_scale',
 garza_real:'heron_feather',
 lince_boreal:'owl_feather'
};
const RECIPES={
 brass_compass:{requires:{ancient_coin:1,map_fragment:1}},
 feather_cap:{requires:{owl_feather:2,pressed_flower:1}},
 amulet:{requires:{ancient_coin:1,otter_whisker:1}},
 amber_charm:{requires:{pressed_flower:1,wolf_tooth:1}},
 sturdy_pack:{requires:{animal_trace:2,beaver_tail_scale:1}},
 shell_necklace:{requires:{ancient_coin:1,fossil_fragment:1}},
 rain_hood:{requires:{pressed_flower:1,animal_trace:1}},
 binoculars:{requires:{polished_lens:2,map_fragment:1}},
 asia_map:{requires:{asia_map_piece:10}},
 africa_map:{requires:{africa_map_piece:10}}
};
function rollLoot(){
  const chance=0.35 + ((state.equipment.hat==='feather_cap')?0.06:0) + ((state.equipment.instrument==='sturdy_pack')?0.03:0);
  if(Math.random()>=chance)return null;
  const ids=Object.keys(ITEMS).filter(id=>(ITEMS[id].kind==='voyage' || ITEMS[id].kind==='equip') && id!=='asia_map' && id!=='africa_map');
  ids.push('asia_map_piece','africa_map_piece','africa_map_piece');
  return ids[Math.floor(Math.random()*ids.length)];
}
function addInventory(id, qty=1){state.inventory[id]=(state.inventory[id]||0)+qty;}
function maybeSpeciesDrop(id, manual){
  if(!state.upgrades.specimenDrops) return null;
  const item=SPECIES_DROPS[id];
  if(!item) return null;
  const chance=manual?0.02:0.005;
  if(Math.random()>=chance) return null;
  addInventory(item,1);
  return item;
}
function availableVoyages(){return VOYAGES.filter(v=>!v.routeReq || (state.upgrades.routeTier||0)>=v.routeReq)}
function canCraft(id){
  const recipe=RECIPES[id]; if(!recipe) return false;
  return Object.entries(recipe.requires).every(([rid,qty])=>(state.inventory[rid]||0)>=qty);
}
function craftItem(id){
  const item=ITEMS[id], recipe=RECIPES[id];
  if(!item || !recipe || !canCraft(id)) return;
  Object.entries(recipe.requires).forEach(([rid,qty])=>{state.inventory[rid]=(state.inventory[rid]||0)-qty;});
  addInventory(id,1);
  pushLog('🛠️ Fabricado: '+item.name);
  render();
}
function equipItem(id){const item=ITEMS[id];if(!item||!item.slot||!(state.inventory[id]||0))return;state.equipment[item.slot]=state.equipment[item.slot]===id?null:id;pushLog('🎒 Equipo actualizado: '+item.name);render();}
// v2.3: cuatro subpestañas internas; el Inventario mantiene su botón principal.
function renderObjects(){
 const sections=[['equipo','🎽 Equipo'],['animales','🐾 Animales'],['expedicion','🧭 Expedición'],['coleccionables','🏛️ Coleccionables']];
 const selected=sections.some(([id])=>id===state.inventoryView)?state.inventoryView:'equipo';
 const equippedNames={instrument:'Instrumento',hat:'Gorro',necklace:'Collar'};
 const slots=Object.entries(equippedNames).map(([slot,label])=>{
   const itemId=state.equipment[slot];const item=itemId&&ITEMS[itemId];
   return `<div class="inventory-slot"><div class="inventory-slot-label">${label}</div><div class="inventory-slot-icon">${item?item.emoji:{instrument:'🔭',hat:'🎩',necklace:'📿'}[slot]}</div><strong>${item?item.name:'Vacío'}</strong><div class="small">${item?item.bonus:'Sin bonificación'}</div>${item?`<button class="btn alt" data-action="equip-item" data-id="${itemId}">Quitar</button>`:''}</div>`;
 }).join('');
 const card=(id,item)=>`<div class="inventory-item"><span class="inventory-icon">${item.emoji}</span><div class="inventory-item-body"><strong>${item.name}</strong><div class="small">${item.bonus}</div><div class="inventory-item-bottom"><span class="badge inv-count">× ${state.inventory[id]||0}</span>${item.slot?`<button class="btn ${state.equipment[item.slot]===id?'gold':'alt'}" data-action="equip-item" data-id="${id}" ${(state.inventory[id]||0)?'':'disabled'}>${state.equipment[item.slot]===id?'Quitar':'Equipar'}</button>`:''}</div></div></div>`;
 const recipeCard=(id,recipe)=>{const item=ITEMS[id];return `<div class="inventory-item"><span class="inventory-icon">${item.emoji}</span><div class="inventory-item-body"><strong>${item.name}</strong><div class="small">${Object.entries(recipe.requires).map(([rid,qty])=>`${ITEMS[rid].emoji} ${ITEMS[rid].name} ${state.inventory[rid]||0}/${qty}`).join(' · ')}</div><div class="inventory-item-bottom"><span class="badge">En bolsa: ${state.inventory[id]||0}</span><button class="btn" data-action="craft-item" data-id="${id}" ${canCraft(id)?'':'disabled'}>Fabricar</button></div></div></div>`;};
 const all=Object.entries(ITEMS);
 const collectIds=new Set(['asia_map','africa_map','fossil_fragment']);
 let content='';
 if(selected==='equipo'){
   content=`<div class="inventory-equipment-layout"><section class="inventory-block"><h4>🎽 Slots de equipamiento</h4><div class="small">Un objeto por ranura. El equipo anterior permanece en tu inventario.</div><div class="inventory-slots">${slots}</div></section><section class="inventory-block"><h4>Equipo disponible</h4><div class="inventory-items">${all.filter(([,i])=>i.kind==='equip').map(([id,i])=>card(id,i)).join('')}</div></section></div><section class="inventory-block"><h4>🛠️ Fabricación de equipo</h4><div class="inventory-items">${Object.entries(RECIPES).filter(([id])=>ITEMS[id]?.kind==='equip').map(([id,recipe])=>recipeCard(id,recipe)).join('')}</div></section>`;
 }else if(selected==='animales'){
   content=`<section class="inventory-block"><h4>🐾 Materiales de animales</h4><div class="small">Hallazgos acumulables obtenidos mediante avistamientos. No ocupan slots.</div><div class="inventory-items">${all.filter(([,i])=>i.kind==='animal').map(([id,i])=>card(id,i)).join('')}</div></section>`;
 }else if(selected==='expedicion'){
   content=`<section class="inventory-block"><h4>🧭 Botín de expedición</h4><div class="small">Materiales, herramientas y fragmentos de mapa encontrados en viajes.</div><div class="inventory-items">${all.filter(([id,i])=>i.kind==='voyage'&&!collectIds.has(id)).map(([id,i])=>card(id,i)).join('')}</div></section>`;
 }else{
   const asia=state.inventory.asia_map_piece||0,africa=state.inventory.africa_map_piece||0;
   content=`<section class="inventory-block"><h4>🏛️ Coleccionables y cartografía</h4><div class="small">Mapas fabricados, fósiles y piezas singulares. No ocupan slots de equipo.</div><div class="inventory-items">${all.filter(([id])=>collectIds.has(id)).map(([id,i])=>card(id,i)).join('')}</div><div class="divider"></div><h4>🗺️ Fabricación de mapas</h4><div class="inventory-items">${['asia_map','africa_map'].map(id=>recipeCard(id,RECIPES[id])).join('')}</div><div class="small">Mapa de Asia: ${Math.min(10,asia)}/10 fragmentos disponibles · Mapa de África: ${Math.min(10,africa)}/10. El mapa de África aún no desbloquea regiones.</div></section>`;
 }
 return `<section class="card stack inventory-main"><h3 class="section">🎒 Inventario</h3><p class="small">Organiza tus hallazgos en cuatro pestañas. Solo el Equipo utiliza los tres slots activos.</p><div class="inventory-subtabs" role="tablist" aria-label="Secciones del inventario">${sections.map(([id,label])=>`<button type="button" role="tab" aria-selected="${selected===id?'true':'false'}" class="inventory-subtab ${selected===id?'active':''}" data-action="inventory-tab" data-id="${id}">${label}</button>`).join('')}</div>${content}</section>`;
}


function sail(voyageId){
 const v=VOYAGES.find(x=>x.id===voyageId);
 if(!v||!state.upgrades.shipyard||state.voyages.length>=maxVoyages()||state.prestige<v.required||state.money<v.cost||state.knowledge<v.knowledge)return;
 if(v.routeReq && (state.upgrades.routeTier||0)<v.routeReq) return;
 state.money-=v.cost;state.knowledge-=v.knowledge;
 state.voyageSeq++;state.voyages.push({id:state.voyageSeq,type:v.id,endAt:Date.now()+voyageDuration(v.seconds)*1000});
 pushLog('⛵ Zarpó una expedición: '+v.name);render();
}
function resolveVoyageReward(job){
  const v=VOYAGES.find(x=>x.id===job.type);
  if(!v) return false;
  let notes=v.notes + ((state.equipment.instrument==='brass_compass')?Math.round(v.notes*0.04):0);
  state.money+=v.prize;state.knowledge+=notes;
  const loot=rollLoot();
  if(loot){addInventory(loot,1); pushLog('🎒 Hallazgo: '+ITEMS[loot].name);}
  pushLog('⛵ Regresó '+v.name+': +£'+v.prize+' y +'+notes+' conocimiento.');
  return true;
}
function processVoyages(now){
 let count=0;
 state.voyages=state.voyages.filter(job=>{
  if(job.endAt>now)return true;
  if(resolveVoyageReward(job)) count++;
  return false;
 });
 return count;
}
function finishVoyage(jobId){
 const idx=state.voyages.findIndex(v=>String(v.id)===String(jobId));
 if(idx<0) return;
 const [job]=state.voyages.splice(idx,1);
 resolveVoyageReward(job);
 render();
}

function renderExpeditions(){
 const active=state.voyages||[];
 const shown=availableVoyages();
 return `<div class="grid-2"><section class="card stack"><h3 class="section">⛵ Expediciones y astillero</h3>
 <div class="small">Los viajes consumen libras y conocimiento, y regresan con financiación, apuntes científicos y objetos. No generan avistamientos ilimitados.</div>
 <div class="req"><strong>⚒️ Astillero</strong><div class="small">${state.upgrades.shipyard?'Construido. Capacidad actual: '+maxVoyages()+' expediciones simultáneas.':'Bloqueado. Desbloquéalo desde Investigación → Astillero básico.'}</div></div>
 ${shown.map(v=>`<div class="atlas-region"><div><strong>${v.name}</strong><div class="small">${Math.round(voyageDuration(v.seconds)/6)/10} min · Coste £${v.cost} + ${v.knowledge} conocimiento</div><div class="small">Regreso: £${v.prize} + ${v.notes} conocimiento · prestigio requerido ${v.required}${v.routeReq?` · cartografía ${v.routeReq}`:''}</div></div><button class="btn" data-action="sail" data-id="${v.id}" ${!state.upgrades.shipyard||active.length>=maxVoyages()||state.prestige<v.required||state.money<v.cost||state.knowledge<v.knowledge?'disabled':''}>Enviar</button></div>`).join('')}
 </section><section class="card"><h3 class="section">🧭 Viajes en curso</h3>
 ${active.length?active.map(job=>{const v=VOYAGES.find(x=>x.id===job.type);return `<div class="req"><strong>${v.name}</strong><div class="small">Regresa en aprox. ${Math.max(0,Math.ceil((job.endAt-Date.now())/1000))} segundos.</div><button class="btn alt" data-action="finish-voyage" data-id="${job.id}">Finalizar ahora</button></div>`}).join(''):'<div class="small">No hay expediciones activas.</div>'}
 <div class="divider"></div><div class="small">Las expediciones continúan durante tu ausencia hasta un máximo de ocho horas contabilizadas.</div></section></div>`;
}

function renderBestiary(){
  let ids=Object.keys(SPECIES);
  const sort=state.bestiarySort||'alpha';
  if(sort==='alpha') ids.sort((a,b)=>SPECIES[a].name.localeCompare(SPECIES[b].name,'es'));
  if(sort==='rarity') ids.sort((a,b)=>({ 'Común':1,'Poco común':2,'Raro':3,'Muy rara':4 }[SPECIES[a].rare]-{ 'Común':1,'Poco común':2,'Raro':3,'Muy rara':4 }[SPECIES[b].rare] || SPECIES[a].name.localeCompare(SPECIES[b].name,'es')));
  if(sort==='type') ids.sort((a,b)=>bestiaryTypeBucket(a).localeCompare(bestiaryTypeBucket(b),'es') || SPECIES[a].name.localeCompare(SPECIES[b].name,'es'));
  return `<section class="card">
    <div class="bestiary-head"><h3 class="section">🦉 Bestiario</h3><div class="badge">Identificadas ${identifiedCount()}/${ids.length}</div></div>
    <div class="small">Listado de especies descubiertas y pendientes. Ahora puedes ordenarlo por abecedario, rareza o tipo general.</div>
    <div class="subtabs compact">${[['alpha','Abecedario'],['rarity','Rareza'],['type','Tipo']].map(([id,label])=>`<button class="subtab ${sort===id?'active':''}" data-action="bestiary-sort" data-id="${id}">${label}</button>`).join('')}</div>
    <div class="species-grid" style="margin-top:10px">${ids.map(id=>speciesCard(id,false,true)).join('')}</div>
  </section>`;
}

function habitatLabel(h){return ({bosque:'🌳 Bosque',pradera:'🌾 Pradera',rio:'🌊 Río',costa:'⛵ Costa',tundra:'❄️ Tundra',montana:'⛰️ Montaña',estepa:'🌾 Estepa',mediterraneo:'🌿 Mediterráneo',desierto:'🏜️ Desierto',humedal:'🪷 Humedal'}[h]||h)}
function timeLabel(t){return ({amanecer:'🌅 Amanecer',dia:'☀️ Día',atardecer:'🌇 Tarde',noche:'🌙 Noche'}[t]||t)}
function seasonLabel(s){return ({primavera:'🌱 Primavera',verano:'☀️ Verano',otono:'🍂 Otoño',invierno:'❄️ Invierno'}[s]||s)}

function speciesCard(id, selected=false, bestiary=false){
  const sp=SPECIES[id];
  const discovered=!!state.discovered[id];
  const st=stage(id);
  const knownName=st>=1;
  return `<button class="species-card ${selected?'selected':''}" ${bestiary?'':'data-action="select-journal"'} data-id="${id}">
    <div class="head">
      <div class="sprite-wrap">${discovered?getSpriteMarkup(id,'normal'):'<div style="font-size:30px">❔</div>'}</div>
      <div class="head-info">
        <div class="titleline"><strong>${knownName?sp.name:'No identificado'}</strong> ${rarityBadge(sp.rare)}</div>
        <div class="small">${knownName?visibleLatin(id):(discovered?'sin identificar':'sin descubrir')}</div>
        ${bestiary?`<div class="small tax-line">${knownName?taxonomyText(id):'Clasificación: desconocida'}</div>`:''}
      </div>
    </div>
    <div class="small" style="margin-top:6px">${fmt(sight(id))} avistamientos · etapa ${st}/5</div>
    <div class="stages">${Array.from({length:5},(_,i)=>`<div class="stage ${i<st?'done':''}"></div>`).join('')}</div>
  </button>`;
}

function researchNodeCard(node){
  const bought=state.purchases[node.id]||0;
  const blocked = node.req && !state.purchases[node.req];
  const maxed = (node.once && bought) || (node.max && bought>=node.max);
  const disabled = blocked || maxed || !canBuy(node);
  return `<div class="atlas-region"><div><strong>${node.name}${node.repeat?` (${bought}${node.max?`/${node.max}`:''})`:''}</strong><div class="small">${node.desc}</div><div class="small">Costo: £${node.money} + ${node.knowledge} conocimiento${node.req?` · requiere ${RESEARCH_NODES.find(n=>n.id===node.req).name}`:''}${node.reqItem?` · requiere ${ITEMS[node.reqItem].name} ×${node.reqItemQty||1}`:''}</div></div><button class="btn ${disabled?'alt':''}" data-action="buy-node" data-id="${node.id}" ${disabled?'disabled':''}>${maxed?'Adquirido':'Investigar'}</button></div>`;
}

function bindPanel(){
  const atlasMap=panel.querySelector('.atlas-v32-map-scroll');
  atlasMap?.addEventListener('scroll',()=>{atlasMapScrollLeft=atlasMap.scrollLeft;},{passive:true});
  const rail=panel.querySelector('#journalSpeciesRail');
  const sheet=panel.querySelector('.journal-v311 .journal-sheet');
  rail?.addEventListener('scroll',()=>{journalRailScrollTop=rail.scrollTop;},{passive:true});
  sheet?.addEventListener('scroll',()=>{journalSheetScrollTop=sheet.scrollTop;},{passive:true});
  panel.querySelector('#journalRailSearch')?.addEventListener('input',e=>{
    journalRailQuery=e.target.value;
    journalRailScrollTop=0;
    if(rail)rail.scrollTop=0;
    filterJournalRail();
  });
  panel.querySelector('#journalRailSort')?.addEventListener('change',e=>{
    journalSortMode=e.target.value==='sightings'?'sightings':'catalog';
    journalRailScrollTop=0;
    renderPanel();
  });
  filterJournalRail();
  panel.querySelectorAll('.atlas-v32-hex').forEach(el=>el.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
  }));
  panel.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click', e=>{
    const act=e.currentTarget.dataset.action; const id=e.currentTarget.dataset.id;
    if(act==='set-region') setRegion(id);
    if(act==='travel-region') travelToRegion(id);
    if(act==='unlock-region') unlockRegion(id);
    if(act==='atlas-tab'){state.atlasView=id; atlasMapScrollLeft=0; renderPanel(); persist();}
    if(act==='atlas-select-region'){if(REGIONS.some(r=>r.id===id&&r.continent===state.atlasView)){state.atlasSelectedRegion=id;renderPanel();persist();}}

    if(act==='toggle-field-filters'){state.fieldFiltersOpen=!state.fieldFiltersOpen;renderPanel();persist();}
    if(act==='set-habitat'){ state.habitat=id; renderPanel(); persist(); }
    if(act==='set-time'){ state.time=id; renderPanel(); persist(); }
    if(act==='set-season'){ state.season=id; renderPanel(); persist(); }
    if(act==='search-manual') { encounter('manual'); persist(); }
    if(act==='field-aid'){ fieldAid(id); }
    if(act==='select-journal'){ if(!currentRegion().species.includes(id))return; state.selectedJournal=id; journalSheetScrollTop=0; renderPanel(); persist(); }
    if(act==='advance-species'){ advanceSpecies(id); }
    if(act==='buy-node'){ buyNode(id); }
    if(act==='publish'){ publishMonograph(id); }
    if(act==='society-tab'){state.societyView=id; renderPanel(); persist();}
    if(act==='publication-tab'){state.publicationView=id; renderPanel(); persist();}
    if(act==='money-to-knowledge'){spendMoneyForKnowledge();}
    if(act==='compile-atlas'){compileAtlas();}
    if(act==='grant'){ requestGrant(); }
    if(act==='exchange-notes'){ exchangeNotes(); }
    if(act==='craft-tome'){ craftTome(); }
    if(act==='expand-museum'){ expandMuseum(); }
    if(act==='museum-tab'){state.museumView=id; renderPanel(); persist();}
    if(act==='remove-exhibit'){removeExhibit(id);}
    if(act==='exhibit'){ exhibitAnimal(id); }
    if(act==='sail'){sail(id);}
    if(act==='equip-item'){equipItem(id);}
    if(act==='inventory-tab' && ['equipo','animales','expedicion','coleccionables'].includes(id)){state.inventoryView=id;renderPanel();persist();}
    if(act==='craft-item'){craftItem(id);}
    if(act==='finish-voyage'){finishVoyage(id);}
    if(act==='bestiary-sort'){state.bestiarySort=id; renderPanel(); persist();}
    if(act==='buy-crown'){buyCrownPack(Number(id)||0);}
    if(act==='exchange-crown'){exchangeTrialCrowns(id==='all'?Math.floor(Math.max(0,state.crownCoins||0)):Number(id));}
  }));
}

document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{ tab=b.dataset.tab; renderPanel(); }));

function tick(){
 const now=Date.now();
 const previous=Number.isFinite(state.lastTick)?state.lastTick:now;
 const elapsed=Math.min(MAX_OFFLINE_MS,Math.max(0,now-previous));
 const startAt=now-elapsed;
 state.lastTick=now;
 if(state.helpers>0 && elapsed>0){
   autoAccum+=elapsed;
   const interval=autoInterval()*1000;
   const actualSearches=Math.floor(autoAccum/interval);
   autoAccum-=actualSearches*interval;
   const searches=Math.min(500,actualSearches);
   if(searches>0){
     const k0=state.knowledge, s0=totalSightings();
     batchingOffline=true;
     try{for(let i=0;i<searches;i++)encounter('auto',startAt+elapsed*((i+.5)/searches));}finally{batchingOffline=false;}
     const gainK=Math.max(0, Math.floor(state.knowledge-k0));
     const gainS=Math.max(0, Math.floor(totalSightings()-s0));
     autoDiaryBuffer.searches+=searches;
     autoDiaryBuffer.hits+=gainS;
     autoDiaryBuffer.knowledge+=gainK;
     currentAutoNotice=`Equipo automático: ${searches} búsquedas · ${gainS} avistamientos · +${gainK} conocimiento.`;
   }
   if(autoDiaryBuffer.searches>0 && (now-lastAutoDiaryFlush>5000 || autoDiaryBuffer.hits>0)){
     pushLog(`👨‍🔬 Equipo automático · ${autoDiaryBuffer.searches} búsquedas · ${autoDiaryBuffer.hits} avistamientos · +${autoDiaryBuffer.knowledge} conocimiento.`);
     autoDiaryBuffer={searches:0,hits:0,knowledge:0};



     lastAutoDiaryFlush=now;
   }
 }
 if(museumRate()>0){state.money+=museumRate()*(elapsed/1000);}
 const returns=processVoyages(now);
 renderCounters();
 updateFieldOutput();
 if(returns && tab==='expeditions')renderPanel();
 persist();
}
setInterval(tick,1000);


// Sprites simplificados para ejemplares macho y hembra. No son variantes raras.
function sexSpriteMarkup(id,sex){
  const spec=SEXUAL_DIMORPHISM[id];
  if(!spec) return null;
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
    const chest=male?'#e0cba8':'#e8dac6';
    return svgWrap(`<ellipse cx="43" cy="61" rx="24" ry="16" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="40" cy="57" rx="11" ry="5" fill="${shade(body,12)}"/><circle cx="66" cy="46" r="11" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="73" cy="53" rx="7" ry="4" fill="${chest}"/>${horns}<circle cx="69" cy="43" r="1.8" fill="#251c18"/>${legs}<path d="M21 58l-5-8" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`);
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
  const validSex=(skin==='normal' && SEXUAL_DIMORPHISM[id] && (sex==='male'||sex==='female'))?sex:null;
  const key=id+':'+skin+':'+(validSex||'base');
  if(spriteCache.has(key))return spriteCache.get(key);
  const sp=SPECIES[id];
  const baseSvg=(validSex?sexSpriteMarkup(id,validSex):null)||spriteFor(sp.kind,applySkin(sp.color,skin),skin,id);
  // All SVG paint values (even fixed feather/ear colors) must respect melanism.
  const svg=skin==='melanico' ? enforceMelanicColors(baseSvg) : baseSvg;
  spriteCache.set(key,svg);
  return svg;
}
function applySkin(base, skin){
  if(skin==='albino') return '#f2f3f4';
  if(skin==='melanico') return '#0c0f12';
  return base;
}
function enforceMelanicColors(svg){
  // Re-map *all* shape fills and strokes: individual species sometimes use
  // literal pink, orange or beige colors instead of the shared 'body' palette.
  // Eyes remain amber so silhouettes stay readable at icon size.
  const ink=(hex,stroke)=>{
    const h=hex.slice(1).toLowerCase();
    if(h==='d8c46b'||h==='e2cb78') return '#d8c46b';
    if(h.length!==6) return hex;
    const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    const lum=0.2126*r+0.7152*g+0.0722*b;
    if(stroke) return lum>175?'#262c33':lum>95?'#15191e':'#050709';
    return lum>210?'#505963':lum>150?'#383f49':lum>80?'#262d35':lum>35?'#171c23':'#0c1015';
  };
  return svg.replace(/(fill|stroke)="(#[0-9a-fA-F]{6})"/g,(_,attr,hex)=>`${attr}="${ink(hex,attr==='stroke')}"`)
    .replace(/(fill|stroke)="rgba?\([^"]*\)"/g,(_,attr,value)=>`${attr}="${attr==='fill'?'#232931':'#0a0c0f'}"`);
}
function shade(hex, amt){
  const h=hex.replace('#','');
  const r=parseInt(h.substring(0,2),16), g=parseInt(h.substring(2,4),16), b=parseInt(h.substring(4,6),16);
  const clamp=x=>Math.max(0,Math.min(255,x));
  return '#'+[clamp(r+amt),clamp(g+amt),clamp(b+amt)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function svgWrap(content, glow=''){ return `<svg viewBox="0 0 100 100" aria-hidden="true">${glow}${content}</svg>`; }
function alphaGlow(skin){ if(skin==='alfa') return '<circle cx="50" cy="50" r="42" fill="#f6df86" opacity="0.20"/><path d="M20 18l6 8 10 2-7 6 1 9-8-5-8 5 1-9-7-6 10-2z" fill="#ffe9a3" opacity="0.75"/><path d="M82 64l5 7 8 2-6 5 1 8-8-4-7 4 1-8-6-5 8-2z" fill="#ffe9a3" opacity="0.65"/>'; if(skin==='melanico') return '';  return ''; }
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
 const isTurtle=/tortuga|galápago|galapago|terrapin|testudo|emys|mauremys/.test(n+' '+sp.latin.toLowerCase()) || sp.kind==='tortoise';
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

function spriteFor(kind,color,skin,id){
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
 return svgWrap(`<circle cx="50" cy="50" r="24" fill="${body}" stroke="#3a3026" stroke-width="3"/>`,glow);
}

// initial unlock checks and migration
if(state.prestige>=2) state.regionUnlocked[REGIONS[2].id]=true;
render();
})();
