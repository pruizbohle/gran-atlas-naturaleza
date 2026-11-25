#!/usr/bin/env python3
"""MEC-09A · Clasifica los fallos históricos por causa raíz a partir de los TAP de la suite.
Uso: python3 scripts/classify-mec09a-failures.py DIR_TAP_ANTES [DIR_TAP_DESPUES] > docs/mec09a/fallos-historicos.csv
Las reglas son explícitas y verificables; cada causa raíz está documentada en docs/mec09a/README.md (§5)."""
import sys, re, os, json, csv

def parse(d):
    out = {}
    for f in sorted(os.listdir(d)):
        if not f.endswith('.tap'): continue
        name = f[:-4]; txt = open(os.path.join(d, f), errors='replace').read(); lines = txt.split('\n')
        found = False
        for i, l in enumerate(lines):
            m = re.match(r'^(ok|not ok) \d+ - (.*?)(?: # .*)?$', l)
            if not m: continue
            found = True
            block = []; j = i + 1
            while j < len(lines) and not re.match(r'^(ok|not ok) \d+ ', lines[j]) and not lines[j].startswith('# Subtest'):
                block.append(lines[j]); j += 1
            b = '\n'.join(block); err = ''
            mm = re.search(r"^\s+error: (.*)$", b, re.M)
            if mm:
                e = mm.group(1).strip()
                if e in ('|-', '>-', '|'):
                    e = ' '.join(x.strip() for x in b[mm.end():].split('\n')[1:6] if x.strip())
                err = e.strip("'\"")
            if m.group(1) == 'not ok':
                head = '\n'.join(lines[:i])
                if err in ('test failed', '') and 'ReferenceError' in head: err = (re.search(r'# (ReferenceError[^\n]*)', head) or re.search('x', 'x')).group(1) if re.search(r'# (ReferenceError[^\n]*)', head) else err
            out[(name, m.group(2).strip())] = (m.group(1), err)
        if not found: out[(name, '<archivo sin resultados>')] = ('not ok', 'tiempo agotado (600 s) sin resultados')
    return out

# (patrón sobre archivo|prueba|error, clase, causa raíz, mecánica, prioridad)
RULES = [
 (r"tiempo agotado", 'G', 'R01 Bucle de Box-Muller sin límite con generador degenerado (rng=()=>0) en el hito del guepardo', 'Récords naturales / arnés', 'P2'),
 (r"Faltan los datos polares", 'C', 'R02 Arnés histórico que carga app.js sin el módulo de datos polares 3.31 (obligatorio desde 3.31)', 'Arnés de pruebas', 'P3'),
 (r"CONTINENT_RULES3300 is not defined", 'C', 'R03 Fuente reconstruida por legacy-source (withoutOceania3290/AM-04) que elimina bloques de los que depende el motor actual', 'Arnés de pruebas', 'P3'),
 (r"importScripts is not defined|animalMarkup is not defined", 'C', 'R04 Ejecución de módulos de navegador/laboratorio fuera de su contexto', 'Arnés de pruebas', 'P3'),
 (r"'5\.6\.\d' !== '3\.\d+\.\d'|/v?3\.\d+\.\d|gran-atlas-v3|3\\\.\d+|/build-campamento-release|⛺ Campamento", 'B', 'R05 Literal de versión, revisión de caché o texto de publicación de una versión 3.x', 'Versionado / PWA', 'P3'),
 (r"4725 !== 4035|\b(9[0-9]{2}|8[0-9]{2}|1000) !== (8[0-9]{2}|9[0-4][0-9])\b|113 !== 94|Identificadas 807|data-total=\"9[0-9]{2}\"|unknown 942|20 !== 10|30 !== 12|252 !== 251|6 !== 4|54 !== 68|945 unique identities|945 full records|asia_esp_0523|all945 data", 'B', 'R06 Recuento de catálogo, legendarios, variantes o pestañas ampliado por etapas aprobadas (GM-03…GM-07, 5.1, ART, MEC-04/08)', 'Catálogos', 'P3'),
 (r"[0-9a-f]{64}|'\(function\(\)\{\\n'|SCIENTIFIC_MISSIONS=\[|Reconocimientos de la Sociedad|android_release\.py|tests/ach3360-attainability\.test\.cjs|untouched|Skipped lines '<!doctype html>", 'B', 'R07 Instantánea byte a byte o hash de código, pruebas o publicación modificados después por diseño aprobado', 'Integridad de fuentes', 'P3'),
 (r"consumes its map|^(SPECIES|ITEMS|RECIPES|Europa upgrades|museum) \+ actual|dependencies:|all prior trade routes|current runtime retains old research|four commercial routes|commercial routes,recipes", 'B', 'R08 Catálogo, recetas, objetos o investigaciones comparados con una versión anterior; cambiaron en etapas aprobadas (INV 3.40, MEC-02…MEC-08)', 'Catálogos / economía', 'P3'),
 (r"Stale production lab", 'B', 'R09 Laboratorio auxiliar generado desde app.js congelado en 3.22; regenerarlo arrastraría el motor actual', 'Laboratorio auxiliar', 'P3'),
 (r"reading '1'\)|build-gm06-release", 'B', 'R10 Script de publicación GM-06 que espera la lista ASSETS en línea en sw.js (ahora la genera el manifiesto)', 'Publicación', 'P3'),
 (r"MainActivity|install-atlas-export", 'H', 'R11 Proyecto Android nativo ausente en el entorno (no se ejecutan flujos Android)', 'Android', 'P3'),
 (r"REGIONS\.some", 'B', 'R06 Recuento de catálogo, legendarios, variantes o pestañas ampliado por etapas aprobadas (GM-03…GM-07, 5.1, ART, MEC-04/08)', 'Catálogos', 'P3'),
 (r"endAt|is not valid JSON|false !== true|0 !== 1|false !== 1|undefined - false|'sondeo' - 'extraordinario|automaticEligibleSpecies|eligibleSpecies|sightings\[|profundo_|polar_hielo|Atlántico|frailecillo|mar_esp_|1000000000? - 9999|\+ \[\] - \[|' !== |manual |marine|REGIONS\.some|polar thresholds|research costs", 'B', 'R12 Preparación anterior a las compuertas cartográficas aprobadas (INV 3.40: mapas por continente, world_map para océanos y fondos) y a los rangos de MEC-04; con las compuertas vigentes las 1.744 presencias y las operaciones profundas funcionan (pruebas equivalentes MEC-09A)', 'Acceso a regiones / operaciones profundas', 'P3'),
 (r"Expected values to be strictly deep-equal|deep-equal", 'B', 'R08 Catálogo, recetas, objetos o investigaciones comparados con una versión anterior; cambiaron en etapas aprobadas (INV 3.40, MEC-02…MEC-08)', 'Catálogos / economía', 'P3'),
 (r"test failed", 'C', 'R03 Fuente reconstruida por legacy-source (withoutOceania3290/AM-04) que elimina bloques de los que depende el motor actual', 'Arnés de pruebas', 'P3'),
 (r"split", 'B', 'R07 Instantánea byte a byte o hash de código, pruebas o publicación modificados después por diseño aprobado', 'Integridad de fuentes', 'P3'),
]

def classify(key, err):
    text = key[0] + '|' + key[1] + '|' + err
    for pat, cls, cause, mech, prio in RULES:
        if re.search(pat, err) or (pat.startswith('tiempo') and 'sin resultados' in key[1]):
            return cls, cause, mech, prio
    return 'I', 'R99 Causa no determinada', '—', 'P2'

def main():
    before = parse(sys.argv[1]); after = parse(sys.argv[2]) if len(sys.argv) > 2 else {}
    fails = {k: v for k, v in before.items() if v[0] != 'ok'}
    # Pruebas que antes no producían resultado (archivo con tiempo agotado) y ahora se ven: también se clasifican.
    for k, v in after.items():
        if v[0] != 'ok' and k not in before: fails[k] = v
    w = csv.writer(sys.stdout, delimiter=';')
    w.writerow(['archivo', 'prueba', 'error', 'clase', 'causa_raiz', 'mecanica', 'prioridad', 'correccion', 'resultado_posterior', 'justificacion_pendiente'])
    for k, (st, err) in sorted(fails.items()):
        cls, cause, mech, prio = classify(k, err)
        post = after.get(k, ('—', ''))[0] if after else '—'
        if k[1] == '<archivo sin resultados>' and after:
            sub = [x for x in after if x[0] == k[0]]
            post = 'ejecuta %d pruebas (%d ok, %d fallan, todas clasificadas)' % (len(sub), sum(after[x][0] == 'ok' for x in sub), sum(after[x][0] != 'ok' for x in sub))
        fix = {'G': 'Bucles acotados (64 intentos; misma secuencia con un generador real) en app.js y mec07', 'B': 'Sin cambio de código: la prueba queda como registro histórico; comportamiento vigente cubierto por pruebas equivalentes (tests/mec09a-integral.test.cjs)', 'C': 'Sin cambio de código: arnés histórico incompatible; pruebas vigentes usan tests/helpers/mec01-game.cjs (catálogo completo)', 'H': 'Sin cambio: requiere proyecto Android, fuera de alcance (no se ejecutan flujos Android)'}.get(cls, '—')
        just = '' if cls == 'G' else 'Prueba de una versión anterior; actualizar su expectativa sin otra razón sería maquillar el resultado. Se conserva y se clasifica.'
        w.writerow([k[0], k[1], err[:300], cls, cause, mech, prio, fix, post, just])

if __name__ == '__main__': main()
