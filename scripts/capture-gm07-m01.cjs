'use strict';
const fs=require('node:fs'),{make}=require('./gm07-m01-engine.cjs'),h=make({candidate:true}),g=h.g,after={};
for(const[id,sp]of Object.entries(g.SPECIES)){const a={normal:g.getSpriteMarkup(id)};for(const v of g.configuredSpecials(sp)){const skin=g.variantToSkin(v);a[skin]=g.getSpriteMarkup(id,skin);}if(g.SEXUAL_DIMORPHISM[id])for(const sex of ['male','female'])a[sex]=g.getSpriteMarkup(id,'normal',sex);after[id]=a;}
fs.writeFileSync('docs/gm07-m01/audit/m01-routes.json',JSON.stringify(after)+'\n');console.log(Object.keys(after).length,'species rendered from the real M01 engine.');
