# AUD-04 — Auditoría artística global · fase inicial ejecutada
Base V4.9.6, commit 84298f39b4e333dc2f9a8bae0e07e3ae84a1264e. No se modifica producción. Inventario exhaustivo de rutas; evaluación visual dirigida, NO aprobación global.

## Cobertura técnica
- 1000 fichas, 304 familias, 1672 láminas distintas, 6688 archivos WebP de animales esperados (64/128/256/512): todas las rutas existen en el árbol Git. Las 16 escenas de paisaje no forman parte de este cotejo.
- 564 variantes pigmentarias (302 albinas y 262 melánicas), ninguna idéntica byte por byte a su normal a 512 px. La diferencia de hash no demuestra calidad ni descarta recolor.
- 64 variantes tienen peso a 512 px inferior al 55% de la normal: señal de triaje débil, no defecto demostrado. Revisar visualmente.
- 59 fichas con ambos sexos: 22 reutilizan lámina normal para macho, no es por sí solo un defecto (el león revisado tiene macho con melena y hembra diferente). 58 fichas de dimorfismo aún pendientes.
- Escalas especiales verificadas en inventario: murciélago abejorro 0,35; pichiciego menor 0,40; colibrí abeja 0,50; sapo pulga 0,25. Probar en Campo móvil. La proporción se aplica al encuadre de juego, no pretende simular escala absoluta entre todas las especies.
- 12 legendarios y 9 relictos: revisión artística de sus recursos y homologación pendiente; no agregar ejemplares ni alterar mecánicas.
- Se inspeccionaron directamente 36 imágenes de 256 px del repositorio: 21 variantes y sus 13 normales, más macho/hembra de león. 4 correctas, 9 mejorables, 8 insuficientes (muestra intencional, no representativa); 543 variantes pendientes. Los resultados son juicio visual preliminar, no certificación biológica ni evaluación real en 64/128 px.

## Estándar obligatorio
Referencia positiva aportada por el usuario: wombat albino, confirmada visualmente en el recurso de producción. El albino requiere despigmentación biológicamente coherente, ojos y tejidos desnudos cuando corresponda, textura, sombras y anatomía. No imponer ojos rojos o piel rosada indiscriminadamente: validar pigmentos y rasgos por taxón. Diferenciar albinismo, leucismo y morfos claros; si hay evidencia insuficiente documentar la variante como representación hipotética. El melánico requiere pigmentación oscura localizada, sombras legibles, detalle y reflejos naturales; conservar patrones fantasma cuando proceda. Evitar filtros globales de brillo, saturación o contraste como solución única. No se exige crear nueva pose si la misma anatomía puede tratarse correctamente. No cambiar IDs, tasas o datos de guardado.

## Muestra visual y prioridades
- Correctas: wombat albino, cuervo albino, ajolote albino y salmón rosado albino.
- Insuficientes: albinos gorila, tigre, jaguar, zorro rojo y abejaruco carmín; melánicos tigre, hipopótamo y pangolín gigante.
- Mejorables: melánicos gorila, jaguar, zorro rojo, abejaruco carmín, cocodrilo del Nilo, salmón rosado y tiburón blanco; albinos cocodrilo del Nilo y tiburón blanco.
- El león confirma diferenciación macho/hembra en la muestra. No extrapolar a las otras rutas compartidas.
Cada observación individual, ruta, hash, ratio de peso y estado se conserva en aud04-inventario-artistico.json.

## Orden de corrección
P1 visual: variantes insuficientes y especies emblemáticas; conservar originales y validar por familia antes de reemplazar. P2: variantes mejorables y el triaje de ratios, fondos y tamaños. Revisar después dimorfismo, legendarios, relictos, escalas y las 304 familias. Comparar a 64/128 en fondo claro y oscuro y vista 512; confirmar anatomía y rasgos pigmentarios con fuentes apropiadas cuando corresponda. Registrar decisiones por variante. No reemplazar de golpe las 564 variantes.

## Herramienta de continuidad
Desde un checkout de esta rama:
    node scripts/aud04-contact-sheets.cjs --class Mammalia --mode variants
    node scripts/aud04-contact-sheets.cjs --family Felidae --mode variants
    node scripts/aud04-contact-sheets.cjs --mode dimorphism
    node scripts/aud04-contact-sheets.cjs --mode family --class Aves
El generador produce HTML local con pares de fondos claro/oscuro y enlaces al original, fuera de www. Está implementado pero pendiente de ejecución y validación en checkout completo; no altera archivos de producción. Las revisiones humanas o de visión deben actualizar la matriz explícitamente.

## Condiciones de cierre
AUD-04 sigue abierta. No generar APK firmado, no actualizar versión pública, no introducir mecánicas ni cambiar balance. Continuar en paralelo con AUD-01/02/03 y consolidar antes de publicar.
