(function(root){const data={
  "version": "3.34.0",
  "sourceNames": 3,
  "newSpecies": 2,
  "reusedSpecies": 1,
  "species": {
    "abisal_esp_pseudoliparis_swirei": {
      "name": "Pez caracol de las Marianas",
      "latin": "Pseudoliparis swirei",
      "sourceScientific": "Pseudoliparis swirei",
      "sourceCommon": "Pez caracol de gran profundidad",
      "sourceSpeciesIds": [
        "ESP-0446"
      ],
      "origin": "abyssal3340",
      "kind": "mariana_snailfish",
      "artProfile": "mariana_snailfish",
      "color": "#c5b2b1",
      "family": "Liparidae",
      "taxonomy": {
        "className": "Actinopterygii",
        "subClass": "Peces óseos"
      },
      "gameGroup": "Pez",
      "rare": "Muy rara",
      "habitats": [
        "hadal_marianas"
      ],
      "times": [
        "amanecer",
        "dia",
        "atardecer",
        "noche"
      ],
      "seasons": [
        "primavera",
        "verano",
        "otono",
        "invierno"
      ],
      "special": [],
      "dimorphism": false,
      "bioluminescence": "",
      "plateNote": "Reconstrucción de muestra; piel pálida gelatinosa, ojos pequeños, aletas continuas y disco pélvico. Sin luz biológica.",
      "ecologyNote": "Marianas: subárea restringida a las capturas de la descripción de 2017. Ventana de capturas verificadas de Gerringer et al. 2017; no se extrapola a otras fosas ni a imágenes sin ejemplar."
    },
    "abisal_esp_pseudoliparis_kermadecensis": {
      "name": "Pez caracol de Kermadec",
      "latin": "Pseudoliparis kermadecensis",
      "sourceScientific": "Notoliparis kermadecensis",
      "sourceCommon": "Pez caracol de gran profundidad",
      "sourceSpeciesIds": [
        "ESP-0362"
      ],
      "origin": "abyssal3340",
      "kind": "kermadec_snailfish",
      "artProfile": "kermadec_snailfish",
      "color": "#c5b2b1",
      "family": "Liparidae",
      "taxonomy": {
        "className": "Actinopterygii",
        "subClass": "Peces óseos"
      },
      "gameGroup": "Pez",
      "rare": "Muy rara",
      "habitats": [
        "hadal_kermadec"
      ],
      "times": [
        "amanecer",
        "dia",
        "atardecer",
        "noche"
      ],
      "seasons": [
        "primavera",
        "verano",
        "otono",
        "invierno"
      ],
      "special": [],
      "dimorphism": false,
      "bioluminescence": "",
      "plateNote": "Reconstrucción de muestra; piel pálida gelatinosa, ojos pequeños, aletas continuas y disco pélvico. Sin luz biológica.",
      "ecologyNote": "Kermadec: subárea restringida al entorno de la localidad tipo. Ventana conservadora de la localidad tipo según Eschmeyer; no pretende abarcar todos los registros posteriores."
    }
  },
  "regions": [
    {
      "id": "abisal_fosa_oceanica_occidental",
      "name": "Fosa oceánica occidental",
      "code": "HX-08-02",
      "sourceHexId": "HX-08-02",
      "continent": "Océanos",
      "depthTier": "abisal",
      "unlock": {
        "prestige": 475
      },
      "habitats": [
        "llanura_abisal_periferica",
        "hadal_marianas"
      ],
      "species": [
        "deep_esp_bathypterois_grallator",
        "abisal_esp_pseudoliparis_swirei"
      ]
    },
    {
      "id": "abisal_fosa_oceanica_oriental",
      "name": "Fosa oceánica oriental",
      "code": "HX-09-14",
      "sourceHexId": "HX-09-14",
      "continent": "Océanos",
      "depthTier": "abisal",
      "unlock": {
        "prestige": 485
      },
      "habitats": [
        "hadal_kermadec"
      ],
      "species": [
        "abisal_esp_pseudoliparis_kermadecensis"
      ]
    }
  ],
  "presences": [
    {
      "regionId": "abisal_fosa_oceanica_occidental",
      "speciesId": "deep_esp_bathypterois_grallator",
      "sourceSheet": "Fauna",
      "sourceRow": 1322,
      "sourceHexId": "HX-08-02",
      "sourceSpeciesId": "ESP-1028",
      "sourceScientific": "Bathypterois grallator",
      "effectiveScientific": "Bathypterois grallator",
      "sourceCommon": "Pez trípode",
      "sourceRarity": "Raro",
      "sourceBiome": "Llanura abisal y fosa oceánica",
      "habitats": [
        "llanura_abisal_periferica"
      ],
      "times": [
        "amanecer",
        "dia",
        "atardecer",
        "noche"
      ],
      "seasons": [
        "primavera",
        "verano",
        "otono",
        "invierno"
      ],
      "methods": [
        "muestreo",
        "extraordinario"
      ],
      "depthMeters": [
        4000,
        4720
      ],
      "depthBasis": "Intervalo lúdico conservador dentro del rango documentado 878–4720 m.",
      "geographicScope": "Pacífico centro-occidental; planicie abisal de aproximación, no interior hadal ni localidad certificada de Marianas.",
      "evidenceNote": "Muestra de fondo periférico y diagnóstico del pez trípode; no vive aquí a más de 6000 m."
    },
    {
      "regionId": "abisal_fosa_oceanica_occidental",
      "speciesId": "abisal_esp_pseudoliparis_swirei",
      "sourceSheet": "Fauna",
      "sourceRow": 1323,
      "sourceHexId": "HX-08-02",
      "sourceSpeciesId": "ESP-0446",
      "sourceScientific": "Pseudoliparis swirei",
      "effectiveScientific": "Pseudoliparis swirei",
      "sourceCommon": "Pez caracol de gran profundidad",
      "sourceRarity": "Muy raro",
      "sourceBiome": "Llanura abisal y fosa oceánica",
      "habitats": [
        "hadal_marianas"
      ],
      "times": [
        "amanecer",
        "dia",
        "atardecer",
        "noche"
      ],
      "seasons": [
        "primavera",
        "verano",
        "otono",
        "invierno"
      ],
      "methods": [
        "extraordinario"
      ],
      "depthMeters": [
        6898,
        7966
      ],
      "depthBasis": "Ventana de capturas verificadas de Gerringer et al. 2017; no se extrapola a otras fosas ni a imágenes sin ejemplar.",
      "geographicScope": "Marianas: subárea restringida a las capturas de la descripción de 2017.",
      "evidenceNote": "Examen de muestra diagnóstica y reconstrucción científica del sector de Marianas; no observación directa desde cubierta."
    },
    {
      "regionId": "abisal_fosa_oceanica_oriental",
      "speciesId": "abisal_esp_pseudoliparis_kermadecensis",
      "sourceSheet": "Fauna",
      "sourceRow": 1485,
      "sourceHexId": "HX-09-14",
      "sourceSpeciesId": "ESP-0362",
      "sourceScientific": "Notoliparis kermadecensis",
      "effectiveScientific": "Pseudoliparis kermadecensis",
      "sourceCommon": "Pez caracol de gran profundidad",
      "sourceRarity": "Muy raro",
      "sourceBiome": "Llanura abisal y fosa oceánica",
      "habitats": [
        "hadal_kermadec"
      ],
      "times": [
        "amanecer",
        "dia",
        "atardecer",
        "noche"
      ],
      "seasons": [
        "primavera",
        "verano",
        "otono",
        "invierno"
      ],
      "methods": [
        "extraordinario"
      ],
      "depthMeters": [
        6660,
        6770
      ],
      "depthBasis": "Ventana conservadora de la localidad tipo según Eschmeyer; no pretende abarcar todos los registros posteriores.",
      "geographicScope": "Kermadec: subárea restringida al entorno de la localidad tipo.",
      "evidenceNote": "Examen de muestra diagnóstica del sector Kermadec; nombre fuente Notoliparis conservado, combinación actual Pseudoliparis."
    }
  ],
  "ids": {
    "Bathypterois grallator": "deep_esp_bathypterois_grallator",
    "Pseudoliparis swirei": "abisal_esp_pseudoliparis_swirei",
    "Pseudoliparis kermadecensis": "abisal_esp_pseudoliparis_kermadecensis",
    "Notoliparis kermadecensis": "abisal_esp_pseudoliparis_kermadecensis"
  },
  "corrections": {
    "Notoliparis kermadecensis": "Pseudoliparis kermadecensis"
  }
};root.AtlasAbyssal3340=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);
