#!/usr/bin/env python3
"""MEC-09A · Mapa de funciones redefinidas en www/js/app.js (sección 8).
Genera docs/mec09a/funciones-redefinidas.csv: función, declaración original, redefiniciones (línea y bloque),
implementación efectiva, consumidores, capturas de la versión anterior y riesgos detectados."""
import re, csv, sys, os
ROOT = os.path.join(os.path.dirname(__file__), '..')
src = open(os.path.join(ROOT, 'www/js/app.js'), encoding='utf8').read()
lines = src.split('\n')
decl = {}
for i, l in enumerate(lines, 1):
    m = re.match(r'^function ([A-Za-z_$][\w$]*)\s*\(', l)
    if m: decl.setdefault(m.group(1), i)
# bloques: último encabezado de bloque conocido antes de la línea
heads = []
for i, l in enumerate(lines, 1):
    m = re.search(r'(MEC-0\d[A-Z]?|\b[A-Z]{2,4}-?\d{2,4}\b|v?3\.\d{2}\.?\d?|GM-?0\d|E-3280|AM-0\d)', l) if l.lstrip().startswith('//') else None
    if m and m.group(1)!='MEC-09A': heads.append((i, m.group(1)))
def block(n):
    b = 'base'
    for i, h in heads:
        if i <= n: b = h
        else: break
    return b
redef = {}
for i, l in enumerate(lines, 1):
    for m in re.finditer(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*=\s*(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>|watch\(|async\s+function)', l):
        name = m.group(1)
        if name in decl:
            # descarta declaraciones const/let locales con el mismo nombre
            pre = l[:m.start()]
            if re.search(r'(const|let|var)\s+$', pre): continue
            redef.setdefault(name, []).append(i)
rows = []
for name, where in sorted(redef.items(), key=lambda kv: -len(kv[1])):
    calls = len(re.findall(r'(?<![\w$.])' + re.escape(name) + r'\s*\(', src)) - 1
    captures = [i for i, l in enumerate(lines, 1) if re.search(r'(const|let)\s+[\w$]+\s*=\s*' + re.escape(name) + r'\s*[;,]', l)]
    risks = []
    if re.search(r'setInterval\(\s*' + re.escape(name) + r'\b', src): risks.append('setInterval captura la versión vigente al arrancar; los ganchos deben ir dentro de la función')
    if re.search(r'addEventListener\([^)]*,\s*' + re.escape(name) + r'\)', src): risks.append('un listener registrado con la referencia directa conserva la versión de ese momento')
    if len(where) >= 4: risks.append('cadena larga de envolturas: el orden de carga de los bloques determina el comportamiento')
    rows.append([name, decl[name], len(where), ' | '.join('%d (%s)' % (i, block(i)) for i in where), '%d (%s)' % (where[-1], block(where[-1])), calls, ' '.join(map(str, captures[:12])), '; '.join(risks)])
w = csv.writer(sys.stdout, delimiter=';')
w.writerow(['funcion', 'declaracion_original', 'redefiniciones', 'lineas_y_bloques', 'implementacion_efectiva', 'llamadas', 'capturas_de_version_anterior', 'riesgos'])
for r in rows: w.writerow(r)
print('# funciones redefinidas: %d; redefiniciones: %d' % (len(rows), sum(r[2] for r in rows)), file=sys.stderr)
