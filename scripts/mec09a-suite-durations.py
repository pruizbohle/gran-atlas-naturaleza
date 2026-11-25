#!/usr/bin/env python3
"""MEC-09A · Duración por archivo de prueba (antes/después) a partir de los TAP. Uso: DIR_ANTES DIR_DESPUES > csv"""
import sys,os,re,csv
def dur(d):
    out={}
    for f in os.listdir(d):
        if not f.endswith('.tap'):continue
        t=open(os.path.join(d,f),errors='replace').read();m=re.findall(r'^# duration_ms ([\d.]+)',t,re.M)
        out[f[:-4]]=float(m[-1])/1000 if m else None
    ex={l.split()[0]:l.split()[1] for l in open(os.path.join(d,'_exit.txt'))}
    return out,ex
a,ea=dur(sys.argv[1]);b,eb=dur(sys.argv[2])
w=csv.writer(sys.stdout,delimiter=';');w.writerow(['archivo','segundos_antes','segundos_despues','salida_antes','salida_despues'])
for k in sorted(set(a)|set(b),key=lambda k:-(b.get(k) or a.get(k) or 0)):
    fa='>600 (tiempo agotado)' if ea.get(k)=='124' else ('%.1f'%a[k] if a.get(k) is not None else '—')
    fb='>600 (tiempo agotado)' if eb.get(k)=='124' else ('%.1f'%b[k] if b.get(k) is not None else '—')
    w.writerow([k,fa,fb,ea.get(k,'—'),eb.get(k,'—')])
