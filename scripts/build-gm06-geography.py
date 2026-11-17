import json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
b=json.loads((root/'docs/gm06/base-cartografia.json').read_text())
positions={c:{i:[p['q'],p['r']] for i,p in m['positions'].items()} for c,m in b['maps'].items() if c not in ['Polos','Océanos']}
positions['Norteamérica'].update(gm06_hudson=[3,-1],gm06_labrador=[4,-1],gm06_atlantico=[5,0],gm06_antillas=[5,3])
positions['Sudamérica'].update(gm06_darien=[-1,0],gm06_galapagos=[-4,2],gm06_humboldt=[-2,2],gm06_bosques=[-2,4],sa_patagonia_y_tierra_del_fuego=[-2,5])
positions['Asia'].update(gm06_sonda=[2,6],gm06_wallacea=[4,6])
positions['Oceanía'].update(gm06_melanesia=[4,1])
# Bangweulu is north of Okavango. Miombo moves south with Okavango, leaving all IDs intact.
positions['África'].update({'HX-09-12':[0,3],'HX-09-09':[0,4],'HX-10-09':[-1,5],'HX-11-08':[-2,5],'gm06_rojo':[4,0]})
(root/'docs/gm06/coordenadas-propuestas.json').write_text(json.dumps(positions,ensure_ascii=False,indent=2)+'\n')
js='''/* Stable ID-based axial cartography for the opt-in GM-06 candidate. */
(function(root){'use strict';
const base=root.AtlasGeography, coords=COORDS, decorations=DECORATIONS;
if(!base)throw Error('GM06 requires base cartography');
function layout(continent,regions=[]){
 if(!coords[continent])return base.layout(continent,regions);
 const occupied=new Set(),raw=[];
 for(const region of regions){
  const p=coords[continent][region.id];if(!p)throw Error('GM06 missing stable coordinate: '+region.id);
  const [q,r]=p,key=q+','+r;if(occupied.has(key))throw Error('GM06 overlapping cells: '+key);occupied.add(key);
  raw.push({regionId:region.id,q,r,label:region.name,shortLabel:region.name,terrain:region.habitats[0],regionIds:[region.id],playable:true,kind:'playable',...base.point(q,r)});
 }
 for(const c of decorations[continent]||[])if(!occupied.has(c.q+','+c.r))raw.push({...c,regionIds:[],playable:false,...base.point(c.q,c.r)});
 const padding=22,origin={x:padding+base.dx/2-Math.min(...raw.map(c=>c.x)),y:padding+base.radius-Math.min(...raw.map(c=>c.y))},positions={};
 const cells=raw.map(c=>{const cell={...c,cellId:'gm06-'+continent+'-'+c.q+'-'+c.r,continent,column:c.q+(c.r-(c.r&1))/2,sourceId:c.regionId,x:c.x+origin.x,y:c.y+origin.y};if(c.regionId)positions[c.regionId]={cellId:cell.cellId,q:cell.q,r:cell.r,x:cell.x,y:cell.y,reason:'Retícula axial vinculada a ID estable GM-06'};return cell;});
 return {cells,positions,origin,board:{width:Math.max(...cells.map(c=>c.x))+base.dx/2+padding,height:Math.max(...cells.map(c=>c.y))+base.radius+padding},radius:base.radius};
}
function audit(continent,regions=[]){
 if(!coords[continent])return base.audit(continent,regions);
 const m=layout(continent,regions),ix=new Map(m.cells.map(c=>[c.q+','+c.r,c])),pairs=[],edgeErrors=[];
 for(const a of m.cells)for(const[dq,dr]of base.directions){const z=ix.get((a.q+dq)+','+(a.r+dr));if(!z||z.cellId<=a.cellId)continue;
  const av=base.vertices().map(([x,y])=>[a.x+x,a.y+y]),bv=base.vertices().map(([x,y])=>[z.x+x,z.y+y]);
  const sharedVertices=av.filter(v=>bv.some(w=>Math.hypot(v[0]-w[0],v[1]-w[1])<1e-7)).length,error=Math.abs(Math.hypot(a.x-z.x,a.y-z.y)-base.dx),edgeError=av.flatMap(v=>bv.map(w=>Math.hypot(v[0]-w[0],v[1]-w[1]))).sort((a,b)=>a-b)[1];
  const p={a:a.cellId,b:z.cellId,sharedVertices,error,edgeError};pairs.push(p);if(error>1e-7||edgeError>1e-7||sharedVertices!==2)edgeErrors.push(p);
 }
 return {continent,cells:m.cells.length,regions:regions.length,playableCells:regions.length,additionalCells:m.cells.length-regions.length,groupedCells:0,groupedRegions:0,neighborPairs:pairs.length,maxError:Math.max(0,...pairs.map(p=>p.error)),maxEdgeError:Math.max(0,...pairs.map(p=>p.edgeError)),edgeErrors,pairs};
}
root.AtlasGM06GeographyBase=base;root.AtlasGeography=Object.freeze({...base,layout,audit,gm06Coordinates:coords});
})(globalThis);
'''
decorations={c:[{k:x[k] for k in ['q','r','kind','terrain','label','shortLabel'] if k in x} for x in m['cells'] if not x['playable']] for c,m in b['maps'].items()}
js=js.replace('COORDS',json.dumps(positions,ensure_ascii=False)).replace('DECORATIONS',json.dumps(decorations,ensure_ascii=False))
(root/'www/js/gm06/geography.js').write_text(js)
