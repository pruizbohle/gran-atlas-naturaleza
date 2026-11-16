"""Raster-space checks, contact sheets and reproducible nearest-neighbour review."""
import hashlib,json,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import numpy as np
root=Path('/tmp/art240-raster');out=Path('docs/art-col-01');manifest=json.loads(Path('www/data/atlas_coleccionables_240_manifest_v2.json').read_text());pieces=manifest['pieces'];ids=[p['ID']for p in pieces]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13);small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',11)
features=[];checks=[];hashes={};duplicates=[]
for piece in pieces:
 id=piece['ID'];im=Image.open(root/(id+'-120.png')).convert('RGBA');sha=hashlib.sha256(im.tobytes()).hexdigest()
 if sha in hashes:duplicates.append([hashes[sha],id])
 hashes[sha]=id
 for size in [24,48,80,120]:
  a=np.asarray(Image.open(root/(id+'-'+str(size)+'.png')).convert('RGBA'))[:,:,3];pixels=int((a>32).sum());assert pixels>12,(id,size,pixels);assert a[0,0]==a[0,-1]==a[-1,0]==a[-1,-1]==0,(id,'background');checks.append({'id':id,'size':size,'visiblePixels':pixels})
 bg=Image.new('RGBA',im.size,'#f6ecd8');bg.alpha_composite(im);gray=bg.convert('L').resize((48,48));a=np.asarray(gray,dtype=float)/255;edges=np.concatenate([np.diff(a,axis=0).flatten(),np.diff(a,axis=1).flatten()]);edges/=max(np.linalg.norm(edges),1e-9);features.append(edges)
f=np.array(features);similarity=f@f.T;pairs=[]
for i in range(len(ids)):
 for j in range(i):
  pairs.append({'a':ids[j],'b':ids[i],'edgeCosine':round(float(similarity[i,j]),5),'sameCollection':pieces[i]['Colección']==pieces[j]['Colección']})
pairs.sort(key=lambda x:x['edgeCosine'],reverse=True)
(out/'raster-report.json').write_text(json.dumps({'rasterChecks':len(checks),'exactRasterDuplicates':duplicates,'nearestPairs':pairs[:40],'flaggedAt0985':[p for p in pairs if p['edgeCosine']>=.985],'checks':checks},indent=2)+'\n')
assert not duplicates,duplicates

def sheet(items,name,columns=6,cellw=202,cellh=192):
 rows=math.ceil(len(items)/columns);im=Image.new('RGB',(columns*cellw,rows*cellh+52),'#eee5d0');d=ImageDraw.Draw(im);d.text((16,15),'240 coleccionables propuestos · Arte sin integrar' if name=='overview-240.png' else 'Los siete mares (7) · Secretos de Atlántida (5, FICCIÓN)',font=font,fill='#35563f')
 for i,piece in enumerate(items):
  x=(i%columns)*cellw;y=(i//columns)*cellh+48;d.rounded_rectangle((x+4,y+4,x+cellw-4,y+cellh-4),7,fill='#f9f0dd',outline='#b7a77c');drawing=Image.open(root/(piece['ID']+'-120.png')).convert('RGBA');im.paste(drawing,(x+(cellw-120)//2,y+8),drawing);d.text((x+9,y+130),piece['ID']+(' · FICCIÓN' if piece['Colección']=='Secretos de Atlántida' else ''),font=font,fill='#775e40');words=piece['Pieza'].split();lines=['']
  for word in words:
   if d.textbbox((0,0),lines[-1]+' '+word,font=small)[2]>cellw-18:lines.append(word)
   else:lines[-1]+=(' 'if lines[-1]else'')+word
  for k,line in enumerate(lines[:3]):d.text((x+9,y+149+k*13),line,font=small,fill='#554b37')
 im.save(out/name)
sheet(pieces,'overview-240.png',12,160,190)
sheet([x for x in pieces if x['ID'].startswith('MAR-')],'marine-twelve.png',6,202,203)
# Rendered comparison of actual small sizes, without substituting scaled labels.
items=[pieces[0],pieces[5],next(p for p in pieces if p['ID']=='MAR-07'),next(p for p in pieces if p['ID']=='HUE-09')];im=Image.new('RGB',(760,4*170+45),'#eee5d0');d=ImageDraw.Draw(im);d.text((15,12),'Raster real: 24, 48, 80 y 120 px',font=font,fill='#35563f')
for row,piece in enumerate(items):
 y=45+row*170;d.text((12,y+45),piece['ID'],font=font,fill='#604a35')
 for col,size in enumerate([24,48,80,120]):
  x=115+col*155;img=Image.open(root/(piece['ID']+'-'+str(size)+'.png'));im.paste(img,(x,y+120-size),img);d.text((x,y+127),str(size)+' px',font=font,fill='#604a35')
im.save(out/'sizes-real.png')
print(json.dumps({'checks':len(checks),'duplicates':duplicates,'nearest':pairs[:12]},ensure_ascii=False))
