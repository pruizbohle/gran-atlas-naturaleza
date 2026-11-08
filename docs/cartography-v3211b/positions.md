# Auditoría de posiciones · 3.21.1b

La malla anterior derivaba sus centros de los códigos heredados. La nueva usa anclajes geográficos y coordenadas axiales independientes. Los identificadores heredados se conservan solamente como referencias técnicas y de guardado.

| Región | Continente | Centro anterior | Axial nuevo (q,r) | Centro nuevo | Celda | Justificación |
| --- | --- | --- | --- | --- | --- | --- |
| Islas Británicas | Europa | 118, 68 | 3, 4 | 261.186, 384.000 | europa-5-4 | Islas al noroeste de Francia, separadas del continente. |
| Escandinavia | Europa | 294, 68 | 9, 2 | 659.558, 246.000 | europa-10-2 | Península septentrional, al norte de Europa central y del Báltico. |
| Alpes | Europa | 79, 145 | 7, 7 | 699.395, 591.000 | europa-10-7 | Arco montañoso al norte de Italia y al sur de Europa central. |
| Europa Occidental | Europa | 167, 145 | 5, 6 | 500.209, 522.000 | europa-8-6 | Francia y su entorno, al este de las islas y al norte de Iberia. |
| Europa Central | Europa | 255, 145 | 8, 6 | 739.232, 522.000 | europa-11-6 | Al este de Francia, al norte de los Alpes y al oeste de Europa oriental. |
| Península Ibérica | Europa | 343, 145 | 2, 8 | 340.860, 660.000 | europa-6-8 | Península suroccidental, al sur de Francia. |
| Europa Oriental | Europa | 118, 222 | 12, 6 | 1057.929, 522.000 | europa-15-6 | Llanuras orientales, al este de Europa central. |
| Península Itálica | Europa | 206, 222 | 6, 8 | 659.558, 660.000 | europa-10-8 | Península mediterránea bajo los Alpes, al oeste de los Balcanes. |
| Región del mar Báltico | Europa | 294, 222 | 10, 4 | 818.906, 384.000 | europa-12-4 | Cuenca al este de Escandinavia y al noreste de Europa central. |
| Balcanes | Europa | 382, 222 | 9, 8 | 898.581, 660.000 | europa-13-8 | Sureste europeo, al este de Italia y al sur de Europa oriental. |
| Cáucaso | Asia | 206, 145 | 0, 5 | 301.023, 453.000 | asia-2-5 | Entre mar Negro y Caspio, al noreste de Anatolia. |
| Anatolia | Asia | 382, 145 | -2, 6 | 181.512, 522.000 | asia-1-6 | Extremo occidental de Asia, al oeste de Irán. |
| Siberia Occidental | Asia | 167, 68 | 5, 2 | 579.883, 246.000 | asia-6-2 | Franja norte, al este de los Urales y al oeste de Siberia central. |
| Siberia Central | Asia | 294, 145 | 9, 2 | 898.581, 246.000 | asia-10-2 | Franja norte entre Siberia occidental y oriental. |
| Mongolia | Asia | 167, 222 | 9, 4 | 978.255, 384.000 | asia-11-4 | Al sur de Siberia central y al norte del Gobi y China. |
| Montes Urales | Asia | 343, 68 | 2, 3 | 380.697, 315.000 | asia-3-3 | Borde occidental de Siberia, al noroeste de Asia central. |
| Siberia Oriental | Asia | 470, 145 | 13, 2 | 1217.278, 246.000 | asia-14-2 | Franja nororiental, al este de Siberia central. |
| Kamchatka | Asia | 646, 145 | 16, 4 | 1535.975, 384.000 | asia-18-4 | Península del Pacífico nororiental, al norte de Japón. |
| Desierto de Gobi | Asia | 255, 222 | 9, 5 | 1018.092, 453.000 | asia-11-5 | Al sur de Mongolia y al norte de China. |
| Himalaya | Asia | 343, 222 | 5, 7 | 779.069, 591.000 | asia-8-7 | Al sur de Asia central y del Tíbet, al norte de India. |
| Península Arábiga | Asia | 558, 145 | -2, 9 | 301.023, 729.000 | asia-2-9 | Península suroccidental, al sur de Mesopotamia. |
| Mesopotamia | Asia | 79, 222 | -1, 7 | 301.023, 591.000 | asia-2-7 | Al sureste de Anatolia, al oeste de Irán y al norte de Arabia. |
| Meseta de Irán | Asia | 431, 222 | 1, 7 | 460.372, 591.000 | asia-4-7 | Entre Mesopotamia y Asia central, al noroeste de India. |
| Meseta del Tíbet | Asia | 519, 222 | 6, 6 | 818.906, 522.000 | asia-9-6 | Al norte del Himalaya y al oeste de China. |
| Estepas de Asia Central | Asia | 607, 222 | 5, 5 | 699.395, 453.000 | asia-7-5 | Al sur de Siberia y al oeste de Mongolia. |
| China Septentrional | Asia | 382, 299 | 10, 6 | 1137.604, 522.000 | asia-13-6 | Al sur del Gobi y al oeste de Corea. |
| Subcontinente Indio | Asia | 470, 299 | 3, 9 | 699.395, 729.000 | asia-7-9 | Proyección meridional al sur del Himalaya. |
| China Meridional | Asia | 558, 299 | 9, 8 | 1137.604, 660.000 | asia-13-8 | Al sur de China septentrional y al noreste del Sudeste Asiático. |
| Península de Corea | Asia | 431, 376 | 12, 6 | 1296.952, 522.000 | asia-15-6 | Costa oriental al este de China, al oeste de Japón. |
| Sudeste Asiático | Asia | 519, 376 | 7, 10 | 1057.929, 798.000 | asia-12-10 | Al sur de China y al este de India. |
| Archipiélago Japonés | Asia | 607, 376 | 14, 7 | 1496.138, 591.000 | asia-17-7 | Islas separadas al este de Corea y al sur de Kamchatka. |
| Magreb | África | 255, 68 | 2, 0 | 261.186, 108.000 | africa-2-0 | Noroeste mediterráneo; comparte sector con la cordillera del Atlas. |
| Sabana de África oriental | África | 382, 145 | 5, 5 | 699.395, 453.000 | africa-7-5 | Al sur de Etiopía y al este de la cuenca del Congo. |
| Cuenca del Congo | África | 431, 222 | 2, 5 | 460.372, 453.000 | africa-4-5 | Centro ecuatorial, al sur del Sahel y al oeste de los Grandes Lagos. |
| Valle del Nilo | África | 431, 68 | 7, 1 | 699.395, 177.000 | africa-7-1 | Noreste africano, al norte de Etiopía y del África oriental. |
| Sahel occidental | África | 206, 145 | 1, 3 | 301.023, 315.000 | africa-2-3 | Franja bajo el Sahara occidental y sobre los bosques occidentales. |
| Bosques de África occidental | África | 167, 222 | -1, 4 | 181.512, 384.000 | africa-1-4 | Costa ecuatorial occidental, al sur del Sahel occidental. |
| Grandes Lagos africanos | África | 470, 299 | 3, 6 | 579.883, 522.000 | africa-6-6 | África centro-oriental; sector compartido con los lagos del Rift. |
| Kalahari y sabana austral | África | 343, 376 | 0, 8 | 420.535, 660.000 | africa-4-8 | Interior austral, al este del Namib y al norte del Cabo. |
| Costa del Cabo | África | 470, 453 | -1, 10 | 420.535, 798.000 | africa-4-10 | Extremo meridional, bajo el interior austral. |
| Madagascar | África | 734, 299 | 5, 8 | 818.906, 660.000 | africa-9-8 | Isla separada frente al sureste africano. |
| Cuerno de África | África | 558, 145 | 8, 4 | 898.581, 384.000 | africa-10-4 | Proyección oriental al océano Índico, al este de Etiopía. |
| Delta del Okavango | África | 255, 376 | 1, 7 | 460.372, 591.000 | africa-4-7 | Botsuana septentrional, al norte del Kalahari y al este de Namibia. |
| Bosques de Gabón | África | 343, 222 | 0, 5 | 301.023, 453.000 | africa-2-5 | Costa atlántica ecuatorial, al oeste de la cuenca del Congo. |
| Tierras altas de Etiopía | África | 646, 145 | 7, 3 | 779.069, 315.000 | africa-8-3 | Noreste elevado, al oeste del Cuerno de África. |
| Desierto del Namib | África | 206, 453 | -1, 9 | 380.697, 729.000 | africa-3-9 | Franja atlántica del suroeste, al oeste del Kalahari. |
| Montañas del Atlas | África | 167, 68 | 2, 0 | 261.186, 108.000 | africa-2-0 | Cordillera del Magreb; sector compartido sin fusionar regiones. |
| Bosques de miombo | África | 294, 299 | 1, 6 | 420.535, 522.000 | africa-4-6 | Bosques al sur del Congo, al oeste de los lagos orientales. |
| Costa de Mozambique | África | 519, 376 | 2, 8 | 579.883, 660.000 | africa-6-8 | Costa del Índico al este de Bangweulu y del interior austral. |
| Lagos del Rift | África | 519, 222 | 3, 6 | 579.883, 522.000 | africa-6-6 | Cadena lacustre del África oriental; sin fusionar datos con Grandes Lagos. |
| Islas Seychelles y Aldabra | África | 734, 145 | 8, 6 | 978.255, 522.000 | africa-11-6 | Islas del Índico al noreste de Madagascar, separadas del continente. |
| Humedales de Bangweulu | África | 558, 299 | 2, 7 | 540.046, 591.000 | africa-5-7 | Zambia, al sur de los Grandes Lagos y al noreste del Okavango. |
| Lowveld y Kruger | África | 382, 453 | 1, 9 | 540.046, 729.000 | africa-5-9 | Sureste austral, al este del Kalahari y al norte del Cabo. |
| Desierto del Sáhara | África | 79, 68 | 3, 2 | 420.535, 246.000 | africa-4-2 | Gran franja septentrional, al norte del Sahel y del Congo. |
| Sahel oriental | África | 470, 145 | 5, 3 | 619.720, 315.000 | africa-6-3 | Continuación oriental del Sahel, bajo el Sahara y al oeste de Etiopía. |
| Alaska | Norteamérica | 382, 68 | 0, 2 | 181.512, 246.000 | norteamerica-1-2 | Extremo noroccidental de Norteamérica. |
| Columbia Británica | Norteamérica | 79, 145 | 2, 4 | 420.535, 384.000 | norteamerica-4-4 | Costa occidental canadiense, al sureste de Alaska. |
