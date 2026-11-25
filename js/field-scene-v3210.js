/* El Gran Atlas — field environments, v3.21.0.
 * Original lightweight scenery; visual only. No game state, storage or external assets.
 * Clear central ground keeps specimen silhouettes readable at mobile scene heights.
 */
(function(root){
'use strict';
const habitats=Object.freeze(['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal','selva','sabana']);
const lights=Object.freeze(['amanecer','dia','atardecer','noche']);
const palettes={
 amanecer:{sky:'#e5d3ba',haze:'#eee1c5',far:'#a2b1a0',ridge:'#879b85',ground:'#c0c394',near:'#879765',leaf:'#657c57',trunk:'#756750',water:'#a3c2bf',shine:'#e5e5cc',sand:'#d8bd89',rock:'#9a9c8a',snow:'#e6e8dc'},
 dia:{sky:'#d5e2dc',haze:'#edf0d7',far:'#b0c4ae',ridge:'#8ca88a',ground:'#c4c99b',near:'#899f6c',leaf:'#587955',trunk:'#756750',water:'#8db8b5',shine:'#dbe8db',sand:'#ddc38e',rock:'#9aa594',snow:'#f0f0df'},
 atardecer:{sky:'#d4b6a3',haze:'#ead4b1',far:'#a3a99a',ridge:'#879880',ground:'#b9b48a',near:'#7e8c60',leaf:'#586b4f',trunk:'#6c604d',water:'#9eaaa4',shine:'#e2d8bb',sand:'#cfab7b',rock:'#969185',snow:'#e3d8c7'},
 noche:{sky:'#465e66',haze:'#849b9b',far:'#6b8885',ridge:'#597770',ground:'#929f86',near:'#607b66',leaf:'#405e50',trunk:'#53605a',water:'#6b9498',shine:'#a8c3bd',sand:'#a4a48c',rock:'#758d89',snow:'#bdcecb'}
};
const path=(d,fill,stroke='',width=1)=>'<path d="'+d+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"':'')+'/>';
const line=(d,color,width=1)=>path(d,'none',color,width);
const ellipse=(x,y,rx,ry,fill)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
function oak(x,y,scale,p){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+path('M39 96L43 45 50 44 52 96Z',p.trunk)+line('M46 67L26 42M48 57L67 35',p.trunk,5)+path('M10 45Q1 30 14 22Q11 8 28 8Q35 0 47 8Q58 1 67 12Q84 8 88 24Q101 34 86 48Q67 57 52 48Q33 57 22 47Q16 52 10 45Z',p.leaf)+path('M18 24Q23 12 39 17Q44 8 58 18Q74 14 81 27Q61 24 53 33Q35 23 18 34Z',p.ridge)+'</g>';}
function pine(x,y,scale,p){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+path('M25 105L28 22 33 22 36 105Z',p.trunk)+path('M29 0L16 25 24 24 9 47 20 44 3 72 19 66 0 94Q18 91 30 83Q44 93 61 94L43 65 56 70 40 43 50 46 35 22 43 24Z',p.leaf)+line('M29 17L23 32M30 38L17 58M31 59L16 82',p.ridge,2)+'</g>';}
function grass(p,wet=false){return '<g opacity=".8">'+line('M8 278Q17 249 28 239M19 278Q28 255 40 251M36 280L33 261M600 279Q597 252 584 242M615 279Q612 252 626 239M629 280L634 259',p.near,2)+(wet?line('M53 278L51 238M68 280L71 233M570 280L569 236',p.leaf,2)+line('M51 245v-12M71 240v-13M569 243v-13',p.trunk,5):'')+'</g>';}
function acacia(x,y,scale,p){return '<g transform="translate('+x+' '+y+') scale('+scale+')">'+path('M52 102L48 42 42 34 46 30 56 40 60 102Z',p.trunk)+line('M52 58L25 25M54 46L82 20',p.trunk,4)+path('M5 27Q8 18 24 18Q33 6 49 14Q61 2 77 12Q96 10 103 25Q88 34 73 31Q54 39 35 31Q18 36 5 27Z',p.leaf)+line('M17 25Q37 20 48 24M64 20Q80 16 92 24',p.ridge,2)+'</g>';}
function reeds(x,p){return '<g>'+line('M'+x+' 274q0-39-12-51m12 51q-3-35 12-57m-6 59q-2-27 13-39m-20 33-8-20',p.leaf,2)+line('M'+(x-12)+' 228v-14m24 10v-14',p.trunk,4)+'</g>';}
function render(habitat,time='dia'){
 const biome=habitats.includes(habitat)?habitat:'bosque',light=lights.includes(time)?time:'dia',p=palettes[light];
 let art=path('M0 0H640V280H0Z',p.sky)+path('M0 112Q140 92 299 109T640 99V210H0Z',p.haze);
 art+=light==='noche'?path('M500 34Q475 38 484 59Q494 72 511 60Q491 66 490 50Q489 41 500 34Z',p.shine):ellipse(light==='amanecer'?117:light==='atardecer'?520:492,light==='dia'?49:83,light==='dia'?18:23,light==='dia'?18:23,p.shine);
 art+=line('M35 75Q63 68 90 73M337 54Q366 48 395 54M412 95Q436 88 466 94',p.haze,3);
 if(biome==='montana'){
  art+=path('M0 170L77 103 119 139 211 39 294 132 357 77 438 153 538 56 640 142V233H0Z',p.far)+path('M0 204L108 133 158 170 256 83 349 185 427 119 518 180 604 118 640 139V250H0Z',p.rock)+path('M180 79L211 39 246 87 221 72 208 88 197 73ZM508 93L538 56 569 90 543 80 533 96 522 84Z',p.snow)+path('M0 231Q153 201 283 222T640 216V280H0Z',p.ground)+path('M0 263Q66 245 128 253L108 280H0ZM550 280L529 257Q594 244 640 252V280Z',p.ridge)+path('M27 254L51 236 78 245 83 266 45 273ZM563 258L580 244 602 248 620 270 572 274Z',p.rock)+line('M52 244l-4 14 22 1M584 251l-4 13 20 2',p.far,1.6);
 }else if(biome==='tundra'){
  art+=path('M0 167L87 114 130 131 201 84 263 146 333 119 415 158 505 105 584 140 640 122V228H0Z',p.far)+path('M163 114L201 84 237 119 210 109 196 124 181 111Z',p.snow)+path('M0 204Q126 175 244 203T457 199T640 209V280H0Z',p.ground)+path('M0 225Q92 209 162 226T280 228Q198 247 80 239L0 249Z',p.water)+path('M451 221Q548 202 640 223V257Q575 238 451 221Z',p.snow)+path('M0 269Q76 244 145 258L171 280H0ZM509 280Q550 253 640 260V280Z',p.ridge)+line('M20 265l19-9 32 4m-21-7 20-4M566 264l19-6 32 6',p.snow,2);
 }else if(biome==='desierto'){
  art+=path('M0 179Q107 130 234 169T457 169Q551 126 640 164V280H0Z',p.far)+path('M0 217Q134 136 293 189T523 193Q583 176 640 185V280H0Z',p.sand)+path('M0 243Q120 203 240 226T490 217Q578 211 640 224V280H0Z',light==='noche'?p.ground:'#c3a877')+path('M0 267Q154 236 322 259T640 244V280H0Z',p.sand)+line('M32 242Q91 221 150 224M484 247q63-16 117-4',p.haze,1.5)+path('M42 265L55 245 76 250 83 270ZM548 265L568 245 588 251 600 273Z',p.trunk)+line('M64 251l-3 13 13 3M567 253l-4 10',p.rock,1.5);
 }else if(biome==='costa'){
  art+=path('M0 139Q100 123 179 146L244 159 640 153V280H0Z',p.far)+path('M0 165Q220 153 640 164V280H0Z',p.water)+path('M0 218Q94 194 208 223T395 241Q512 238 640 217V280H0Z',p.sand)+line('M2 207Q97 183 204 213T401 230Q520 228 637 207M13 183Q131 172 220 187M410 179q78-8 151 0',p.shine,2)+path('M0 202L20 171 58 164 90 189 80 225 24 236 0 230ZM558 225L579 190 609 182 640 207V247Z',p.rock)+line('M22 183l10 32 32-17M584 204l15 14 27-8',p.far,2);
 }else if(biome==='rio'){
  art+=path('M0 167Q102 121 212 157T427 149T640 167V280H0Z',p.far)+path('M0 205Q109 174 214 199T441 192T640 202V280H0Z',p.ridge)+path('M288 177Q218 202 311 218Q416 235 295 280H640V246Q439 258 398 229Q361 208 329 208Q278 196 339 177Z',p.water)+path('M0 224Q136 194 239 223Q270 238 195 280H0Z',p.ground)+path('M426 224Q500 203 640 222V280H393Q458 247 426 224Z',p.ground)+line('M302 201q-30 5-6 10M340 230q47 13 95 11M392 264q43 3 92-4',p.shine,2)+oak(20,123,.85,p)+oak(526,124,.83,p)+grass(p,true);
 }else if(biome==='humedal'){
  art+=path('M0 171Q102 144 220 161T441 158T640 169V280H0Z',p.far)+path('M0 202Q148 185 258 202T471 196T640 201V280H0Z',p.water)+path('M0 227Q103 207 185 224L140 280H0ZM468 225Q557 210 640 222V280H504Z',p.ground)+path('M169 257Q278 235 398 250L442 280H139Z',p.ground)+line('M189 218q52-5 94 0M345 232q60-7 112 0M225 275q56-8 100-3',p.shine,2)+reeds(49,p)+reeds(96,p)+reeds(565,p)+reeds(610,p)+ellipse(125,247,17,3,p.leaf)+ellipse(508,239,15,3,p.leaf);
 }else if(biome==='selva'){
  art+=path('M0 155Q85 112 175 148T333 135T505 144T640 131V280H0Z',p.far)+path('M0 197Q137 156 248 190T455 185T640 188V280H0Z',p.ridge)+path('M0 222Q141 196 282 217T640 211V280H0Z',p.ground)+path('M0 280V250Q92 221 158 240L186 280ZM481 280L496 237Q571 218 640 251V280Z',p.near)+oak(2,83,1.25,p)+oak(533,75,1.12,p)+path('M18 0Q38 55 27 118M610 0Q585 40 607 107', 'none',p.trunk,3)+path('M10 210Q7 174 62 171Q47 196 10 210ZM34 247Q11 213 75 200Q73 225 34 247ZM599 224Q557 211 563 178Q604 184 599 224ZM621 252Q584 237 587 214Q625 220 621 252Z',p.leaf)+line('M21 200l28-18M44 233l18-22M594 210l-19-21',p.ridge,2);
 }else if(biome==='bosque'){
  art+=path('M0 154Q119 120 240 151T449 147T640 161V280H0Z',p.far)+path('M0 198Q119 166 243 194T451 189T640 198V280H0Z',p.ridge)+path('M0 225Q113 191 250 218T448 217T640 216V280H0Z',p.ground)+pine(75,79,.93,p)+pine(505,67,1.08,p)+oak(0,94,1.04,p)+oak(547,100,.94,p)+path('M0 262Q74 236 147 248L175 280H0ZM489 280L506 248Q570 233 640 260V280Z',p.near)+grass(p);
 }else if(biome==='sabana'){
  art+=path('M0 167Q118 127 261 155T487 151T640 159V280H0Z',p.far)+path('M0 214Q123 186 260 207T463 209T640 201V280H0Z',p.ground)+acacia(27,113,.9,p)+acacia(510,105,1,p)+path('M0 260Q123 242 243 254T480 253T640 245V280H0Z',p.sand)+grass(p);
 }else if(biome==='mediterraneo'){
  art+=path('M0 167Q100 101 208 156T403 143T640 155V280H0Z',p.far)+path('M0 206Q128 160 252 197T471 188T640 196V280H0Z',p.ridge)+path('M0 232Q148 197 283 219T640 216V280H0Z',p.ground)+oak(29,133,.69,p)+oak(537,129,.72,p)+path('M0 258Q95 242 164 259L185 280H0ZM489 280L511 253Q574 239 640 259V280Z',p.sand)+path('M13 259L30 242 61 245 72 264ZM562 267L578 246 614 252 628 274Z',p.rock)+line('M30 247l7 11 23-3M580 252l15 11 18 1',p.far,1.5);
 }else if(biome==='estepa'){
  art+=path('M0 169Q127 123 239 153T460 150T640 170V280H0Z',p.far)+path('M0 209Q129 165 277 202T490 197T640 207V280H0Z',p.ridge)+path('M0 239Q166 204 321 226T640 218V280H0Z',p.ground)+path('M0 272Q122 243 212 263T435 263T640 249V280H0Z',p.sand)+line('M29 268l12-34m-4 22-15-7m20-7 10-10M597 274l-8-37m4 17 15-8m-17-4-10-11',p.near,2)+grass(p);
 }else{
  art+=path('M0 168Q114 116 243 151T480 151T640 160V280H0Z',p.far)+path('M0 209Q131 164 259 197T475 191T640 207V280H0Z',p.ridge)+path('M0 236Q126 207 265 223T484 225T640 216V280H0Z',p.ground)+path('M0 272Q120 243 244 261T473 254T640 258V280H0Z',p.near)+grass(p)+line('M88 254l-2-17m1 9 8-7M546 252l3-17m-2 10-8-6',p.leaf,1.5)+ellipse(84,235,3,2,p.shine)+ellipse(552,235,3,2,p.shine);
 }
 const distant={...p,leaf:p.far,trunk:p.ridge,ridge:p.haze};
 if(biome==='bosque')art+=pine(170,85,.55,distant)+pine(434,72,.62,distant);
 if(biome==='selva')art+=oak(145,76,.75,distant)+oak(420,62,.84,distant)+line('M203 0q-14 39 0 78M446 0q-12 33 1 63',p.ridge,2);
 if(biome==='sabana')art+=acacia(150,126,.6,distant)+acacia(426,115,.62,distant);
 if(biome==='mediterraneo')art+=oak(164,132,.5,distant)+oak(432,126,.55,distant);
 return '<svg xmlns="http://www.w3.org/2000/svg" class="field-backdrop field-scene-v3210" viewBox="0 0 640 280" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" data-field-biome="'+biome+'" data-field-light="'+light+'">'+art+'</svg>';
}
const api=Object.freeze({render,habitats,lights});
root.AtlasFieldScene=api;
if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
