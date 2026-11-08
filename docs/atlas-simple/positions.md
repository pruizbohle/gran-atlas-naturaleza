# Auditoría de posiciones · 3.21.1b

La propuesta anterior tenía 406 celdas. Esta corrección reduce el mapa a 73 celdas y mantiene los identificadores y regiones existentes. Los identificadores heredados se conservan solamente como referencias técnicas y de guardado.

| Región | Continente | Centro anterior | Axial nuevo (q,r) | Centro nuevo | Celda | Justificación |
| --- | --- | --- | --- | --- | --- | --- |
| Islas Británicas | Europa | 261.1858428704208, 384 | 0, 1 | 61.837, 137.000 | europa-0-1 | Islas al noroeste de Francia, separadas del continente. |
| Escandinavia | Europa | 659.5575286112626, 246 | 3, 0 | 261.023, 68.000 | europa-3-0 | Península septentrional, al norte de Europa central y del Báltico. |
| Alpes | Europa | 699.3946971853468, 591 | 1, 3 | 221.186, 275.000 | europa-2-3 | Arco montañoso al norte de Italia y al sur de Europa central. |
| Europa Occidental | Europa | 500.2088543149259, 522 | 1, 2 | 181.349, 206.000 | europa-2-2 | Francia y su entorno, al este de las islas y al norte de Iberia. |
| Europa Central | Europa | 739.231865759431, 522 | 2, 2 | 261.023, 206.000 | europa-3-2 | Al este de Francia, al norte de los Alpes y al oeste de Europa oriental. |
| Península Ibérica | Europa | 340.86018001858923, 660 | 0, 3 | 141.512, 275.000 | europa-1-3 | Península suroccidental, al sur de Francia. |
| Europa Oriental | Europa | 1057.9292143521043, 522 | 3, 2 | 340.697, 206.000 | europa-4-2 | Llanuras orientales, al este de Europa central. |
| Península Itálica | Europa | 659.5575286112626, 660 | 0, 4 | 181.349, 344.000 | europa-2-4 | Península mediterránea bajo los Alpes, al oeste de los Balcanes. |
| Región del mar Báltico | Europa | 818.9062029075992, 384 | 3, 1 | 300.860, 137.000 | europa-3-1 | Cuenca al este de Escandinavia y al noreste de Europa central. |
| Balcanes | Europa | 898.5805400557676, 660 | 2, 3 | 300.860, 275.000 | europa-3-3 | Sureste europeo, al este de Italia y al sur de Europa oriental. |
| Cáucaso | Asia | 301.023011444505, 453 | -1, 2 | 61.837, 206.000 | asia-0-2 | Entre mar Negro y Caspio, al noreste de Anatolia. |
| Anatolia | Asia | 181.51150572225254, 522 | -1, 3 | 101.674, 275.000 | asia-0-3 | Extremo occidental de Asia, al oeste de Irán. |
| Siberia Occidental | Asia | 579.8831914630944, 246 | 2, 1 | 261.023, 137.000 | asia-2-1 | Franja norte, al este de los Urales y al oeste de Siberia central. |
| Siberia Central | Asia | 898.5805400557676, 246 | 3, 1 | 340.697, 137.000 | asia-3-1 | Franja norte entre Siberia occidental y oriental. |
| Mongolia | Asia | 978.2548772039361, 384 | 1, 2 | 221.186, 206.000 | asia-2-2 | Franja de Mongolia al sur de Siberia y al oeste del Gobi y China. |
| Montes Urales | Asia | 380.6973485926734, 315 | 1, 1 | 181.349, 137.000 | asia-1-1 | Borde occidental de Siberia, al noroeste de Asia central. |
| Siberia Oriental | Asia | 1217.2778886484411, 246 | 4, 1 | 420.372, 137.000 | asia-4-1 | Franja nororiental, al este de Siberia central. |
| Kamchatka | Asia | 1535.9752372411144, 384 | 5, 1 | 500.046, 137.000 | asia-5-1 | Península del Pacífico nororiental, al norte de Japón. |
| Desierto de Gobi | Asia | 1018.0920457780202, 453 | 2, 2 | 300.860, 206.000 | asia-3-2 | Franja del Gobi entre Mongolia y China septentrional, en la escala simplificada. |
| Himalaya | Asia | 779.0690343335152, 591 | 1, 4 | 300.860, 344.000 | asia-3-4 | Al sur de Asia central y del Tíbet, al norte de India. |
| Península Arábiga | Asia | 301.023011444505, 729 | -1, 4 | 141.512, 344.000 | asia-1-4 | Península suroccidental, al sur de Mesopotamia. |
| Mesopotamia | Asia | 301.023011444505, 591 | 0, 3 | 181.349, 275.000 | asia-1-3 | Al sureste de Anatolia, al oeste de Irán y al norte de Arabia. |
| Meseta de Irán | Asia | 460.3716857408417, 591 | 1, 3 | 261.023, 275.000 | asia-2-3 | Entre Mesopotamia y Asia central, al noroeste de India. |
| Meseta del Tíbet | Asia | 818.9062029075993, 522 | 2, 3 | 340.697, 275.000 | asia-3-3 | Al norte del Himalaya y al oeste de China. |
| Estepas de Asia Central | Asia | 699.3946971853468, 453 | 0, 2 | 141.512, 206.000 | asia-1-2 | Al sur de Siberia y al oeste de Mongolia. |
| China Septentrional | Asia | 1137.6035515002727, 522 | 3, 2 | 380.535, 206.000 | asia-4-2 | Al sur del Gobi y al oeste de Corea. |
| Subcontinente Indio | Asia | 699.3946971853468, 729 | 0, 5 | 261.023, 413.000 | asia-2-5 | Proyección meridional al sur del Himalaya. |
| China Meridional | Asia | 1137.6035515002727, 660 | 3, 3 | 420.372, 275.000 | asia-4-3 | Al sur de China septentrional y al noreste del Sudeste Asiático. |
| Península de Corea | Asia | 1296.9522257966094, 522 | 4, 2 | 460.209, 206.000 | asia-5-2 | Costa oriental al este de China, al oeste de Japón. |
| Sudeste Asiático | Asia | 1057.9292143521043, 798 | 2, 4 | 380.535, 344.000 | asia-4-4 | Al sur de China y al este de India. |
| Archipiélago Japonés | Asia | 1496.1380686670302, 591 | 5, 3 | 579.720, 275.000 | asia-6-3 | Islas separadas al este de Corea y al sur de Kamchatka. |
| Magreb | África | 261.18584287042086, 108 | 1, 0 | 141.512, 68.000 | africa-1-0 | Noroeste mediterráneo, al este de la celda del Atlas. |
| Sabana de África oriental | África | 699.3946971853468, 453 | 2, 2 | 300.860, 206.000 | africa-3-2 | África centro-oriental: celda propia junto a la cuenca del Congo. |
| Cuenca del Congo | África | 460.3716857408417, 453 | 1, 2 | 221.186, 206.000 | africa-2-2 | Centro ecuatorial, al sur del Sahel y al oeste de los Grandes Lagos. |
| Valle del Nilo | África | 699.3946971853468, 177 | 3, 0 | 300.860, 68.000 | africa-3-0 | Noreste africano, al norte de Etiopía y del África oriental. |
| Sahel occidental | África | 301.023011444505, 315 | 1, 1 | 181.349, 137.000 | africa-1-1 | Franja bajo el Sahara occidental y sobre los bosques occidentales. |
| Bosques de África occidental | África | 181.51150572225254, 384 | 0, 1 | 101.674, 137.000 | africa-0-1 | Bosques atlánticos al oeste de la cuenca del Congo. |
| Grandes Lagos africanos | África | 579.8831914630944, 522 | 1, 3 | 261.023, 275.000 | africa-2-3 | África centro-oriental: celda propia junto a la cuenca del Congo. |
| Kalahari y sabana austral | África | 420.53451716675755, 660 | 0, 5 | 261.023, 413.000 | africa-2-5 | Interior austral: posición aproximada, con una celda propia para esta región. |
| Costa del Cabo | África | 420.53451716675755, 798 | -1, 6 | 221.186, 482.000 | africa-2-6 | Extremo meridional, bajo el interior austral. |
| Madagascar | África | 818.9062029075993, 660 | 3, 4 | 460.209, 344.000 | africa-5-4 | Isla del Índico separada del continente, frente al sureste africano. |
| Cuerno de África | África | 898.5805400557676, 384 | 4, 1 | 420.372, 137.000 | africa-4-1 | Proyección oriental al océano Índico, al este de Etiopía. |
| Delta del Okavango | África | 460.3716857408417, 591 | 0, 4 | 221.186, 344.000 | africa-2-4 | Interior austral: posición aproximada, con una celda propia para esta región. |
| Bosques de Gabón | África | 301.023011444505, 453 | 0, 2 | 141.512, 206.000 | africa-1-2 | Bosques atlánticos al oeste de la cuenca del Congo. |
| Tierras altas de Etiopía | África | 779.0690343335152, 315 | 3, 1 | 340.697, 137.000 | africa-3-1 | Noreste elevado, al oeste del Cuerno de África. |
| Desierto del Namib | África | 380.6973485926734, 729 | -1, 4 | 141.512, 344.000 | africa-1-4 | Interior austral: posición aproximada, con una celda propia para esta región. |
| Montañas del Atlas | África | 261.18584287042086, 108 | 0, 0 | 61.837, 68.000 | africa-0-0 | Cordillera del Magreb: celda propia en el extremo noroeste. |
| Bosques de miombo | África | 420.53451716675755, 522 | 0, 3 | 181.349, 275.000 | africa-1-3 | Interior austral: posición aproximada, con una celda propia para esta región. |
| Costa de Mozambique | África | 579.8831914630944, 660 | 2, 3 | 340.697, 275.000 | africa-3-3 | Sureste africano, al este del interior austral. |
| Lagos del Rift | África | 579.8831914630944, 522 | 3, 2 | 380.535, 206.000 | africa-4-2 | África centro-oriental: celda propia junto a la cuenca del Congo. |
| Islas Seychelles y Aldabra | África | 978.2548772039361, 522 | 5, 2 | 539.883, 206.000 | africa-6-2 | Islas del Índico separadas del continente y de Madagascar, al noreste. |
| Humedales de Bangweulu | África | 540.0460228890101, 591 | 1, 4 | 300.860, 344.000 | africa-3-4 | Interior austral: posición aproximada, con una celda propia para esta región. |
| Lowveld y Kruger | África | 540.0460228890101, 729 | 1, 5 | 340.697, 413.000 | africa-3-5 | Sureste africano, al este del interior austral. |
| Desierto del Sáhara | África | 420.53451716675755, 246 | 2, 0 | 221.186, 68.000 | africa-2-0 | Gran franja septentrional, al norte del Sahel y del Congo. |
| Sahel oriental | África | 619.7203600371785, 315 | 2, 1 | 261.023, 137.000 | africa-2-1 | Continuación oriental del Sahel, bajo el Sahara y al oeste de Etiopía. |
| Alaska | Norteamérica | 181.51150572225254, 246 | 0, 0 | 61.837, 68.000 | norteamerica-0-0 | Extremo noroccidental de Norteamérica. |
| Columbia Británica | Norteamérica | 420.53451716675755, 384 | 1, 1 | 181.349, 137.000 | norteamerica-1-1 | Costa occidental canadiense, al sureste de Alaska. |
