'use strict';
// Historical structural checks compare the untouched engine after removing
// only the scoped, separately tested M01 art adapter.
module.exports=source=>source.replace("function getSpriteMarkup(id, skin='normal', sex=null, legacy=false){\n  if(!legacy&&globalThis.AtlasM01Art?.has(id))return spriteMarkupM01(id,skin);","function getSpriteMarkup(id, skin='normal', sex=null){").replace(/\/\/ M01: opt-in art[\s\S]*?\nfunction applySkin/,'function applySkin');
