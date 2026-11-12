#!/usr/bin/env python3
"""Plot measured wall-clock sessions, never infer Android/device results."""
import json,os,tempfile
from pathlib import Path
os.environ.setdefault('MPLCONFIGDIR',str(Path(tempfile.gettempdir())/'atlas3410-mpl'))
os.environ.setdefault('XDG_CACHE_HOME',str(Path(tempfile.gettempdir())/'atlas3410-cache'))
Path(os.environ['XDG_CACHE_HOME']).mkdir(parents=True,exist_ok=True)
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

root=Path('docs/ux3410')
series=[('3.40.0',json.loads((root/'session-before/report.json').read_text()),'#99713d'),('3.41.0',json.loads((root/'session-final/report.json').read_text()),'#315b45')]
fig,axes=plt.subplots(3,1,figsize=(8,7),sharex=True,layout='constrained')
for label,data,color in series:
    assert data['actualElapsedMs']>=1200000 and not data['errors']
    samples=data['samples'];minutes=[s['elapsedMs']/60000 for s in samples]
    for ax,key,scale in zip(axes,['heap','nodes','jsEventListeners'],[1e6,1,1]):
        ax.plot(minutes,[s[key]/scale for s in samples],label=label,color=color,linewidth=1.8,marker='o',markersize=3)
for ax,label,limit in zip(axes,['Heap tras GC (MB)','Nodos DOM en Sociedad / Logros','Escuchadores activos (CDP)'],[10,1600,80]):
    ax.set_ylabel(label,fontsize=9);ax.set_ylim(0,limit);ax.set_xlim(0,21);ax.grid(alpha=.2);ax.spines[['top','right']].set_visible(False)
axes[0].legend(frameon=False,ncol=2);axes[-1].set_xlabel('Minutos reales · Chromium 390 px · partida avanzada sintética')
fig.suptitle('El Gran Atlas · sesiones de 20 minutos',fontsize=14)
fig.savefig(root/'sessions-comparison.png',dpi=180)
fig.savefig(root/'sessions-comparison.svg')
print('Saved measured-session charts (PNG and SVG).')
