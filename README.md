# El Gran Atlas de la Naturaleza — v0.1

Proyecto móvil web-first (HTML, CSS, JavaScript) para el hexágono **HX-01-09 Islas Británicas**. Contiene exactamente las nueve especies del archivo de fauna aportado, con las rarezas lúdicas allí indicadas. Esta versión no pretende representar distribuciones biológicas verificadas.

## Qué funciona

- Interfaz vertical, adaptable a teléfono; exploración manual por hábitat, horario y estación.
- Encuentros probabilísticos; primero avistamiento descubre especie; todos suman para los hitos 1, 10, 20, 50 y 100.
- Investigación 1/5–5/5 **no automática**: requiere suficientes avistamientos Y pagar conocimiento en cada nivel.
- Monografía al terminar 5/5, con +1 prestigio, no repetible.
- Naturalistas automáticos contratables con conocimiento, y simulación de hasta 8 horas de ausencia.
- Variantes cosméticas raras y opcionales solo en especies configuradas.
- Guardado local (localStorage), exportación manual JSON, y reinicio de partida.
- Pruebas automatizadas del motor con Node.

## Probar en el computador

Usa un servidor local, porque los módulos JS y JSON no funcionan de forma consistente abriendo `index.html` con `file://`.

```bash
cd gran-atlas-mobile
python3 -m http.server 8080 -d www
```

Abrir `http://localhost:8080` y probar también en vista móvil del navegador. **No es necesario instalar dependencias para probar la web.**

## Ejecutar pruebas del motor

```bash
node --test tests/*.test.mjs
```

## Preparar Android con Capacitor

Requiere Node.js/npm, Android Studio y Android SDK en el computador de desarrollo:

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```

Compilar y ejecutar desde Android Studio. `android/` se genera en `cap add`; **no está incluido en este ZIP**, ni se entrega un APK compilado. La configuración inicial usa Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`). El identificador `com.granatlas.naturaleza` es provisional y debería elegirse uno definitivo antes de publicar. Para iOS se necesita entorno de compilación de Apple (Mac/Xcode).

## Mecánica inicial (editable)

- Encuentro: probabilidad dependiente de los animales compatibles con ambiente/horario/estación y de su rareza.
- Una búsqueda manual exitosa da exactamente 1 avistamiento; la búsqueda automática usa el mismo mecanismo.
- Hitos acumulativos: 1, 10, 20, 50, 100.
- Costos de conocimiento: 8, 25, 55, 100, 175 (ajustados moderadamente por rareza).
- Naturalista inicial: 40 conocimiento; siguientes multiplicados por 1,65.
- Cada naturalista ejecuta 0,18 búsquedas/s, también computadas en modo offline. El límite offline son 8 horas.
- No existen compras reales, cuentas, ni conexión a servidores.

## Próximas tareas prioritarias

1. Balance de probabilidades, ingresos y progresión 1–100, especialmente frailecillo legendario.
2. Sustituir emojis por sprites genéricos de fauna e integrar variantes de color.
3. Añadir persistencia más robusta, importación/restauración de partidas, respaldo opcional y migraciones de esquema.
4. Incorporar mapa de 209 hexágonos y desbloqueos regionales usando los datos del Excel.
5. Objetos equipables, astillero, Museo y árbol tecnológico después de comprobar el bucle principal.

### Advertencias

- `localStorage` puede borrarse junto a los datos de la aplicación; se ofrece exportación manual, no sincronización en nube.
- El progreso offline utiliza la hora del dispositivo; no es resistente a manipulación intencional.
- Las temporadas y horarios del prototipo son reglas de juego aproximadas; no afirmaciones ecológicas precisas.
- **No se ha compilado ni probado en un teléfono Android real.**


## Actualización v0.2

- Se reemplazaron los emojis de las nueve especies por sprites SVG sencillos, locales y reutilizables.
- El zorro dispone de las variantes normal, albino, melánico y alfa (brillos). Los demás animales tienen sprite normal.
- El resultado de una búsqueda muestra el animal encontrado, rareza, avistamientos y variante si aparece.
- Cuaderno: rareza, barras 1–5, condiciones y encuentros restantes para el siguiente hito.
- **Compatibilidad con partidas v0.1:** conserva la misma clave de guardado. IMPORTANTE: ejecutar con el mismo origen web (misma dirección y puerto en Live Server); cambiar la dirección puede dejar la partida anterior en otro almacenamiento local. Se aconseja exportarla antes.
- Los requisitos 1, 10, 20, 50, 100 y el costo de conocimiento no cambiaron.
- Los sprites SVG son ilustraciones vectoriales esquemáticas, no arte final.

### Instalación rápida

Descomprime esta versión y abre `www/index.html` con Live Server de VS Code. Para Android, `npm install`, `npx cap add android` (solo primera vez) y `npx cap sync android`.
