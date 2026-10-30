/* Online course lookup. OpenGolfAPI data: ODbL 1.0; see ATTRIBUTION.md. */
(function(root){
'use strict';
const API='https://api.opengolfapi.org';
const text=v=>String(v??'').trim();
const number=v=>v===null||v===undefined||v===''?null:Number.isFinite(Number(v))?Number(v):null;
const normal=v=>text(v).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function validUrl(v){try{const u=new URL(v);return u.protocol==='https:'||u.protocol==='http:'?u.href:''}catch{return ''}}
function normaliseResult(c){return{id:text(c.id),name:text(c.course_name||c.name),location:[c.city,c.state,c.country].filter(Boolean).map(text).join(', '),provider:'opengolfapi',sourceUrl:validUrl(c.website)||'https://opengolfapi.org',sourceLabel:'OpenGolfAPI · online directory'}}
function keyed(obj,keys){if(!obj||typeof obj!=='object')return null;for(const key of keys){const match=Object.keys(obj).find(k=>normal(k)===normal(key));if(match!==undefined&&number(obj[match])!==null)return number(obj[match])}return null}
function normaliseDetail(c){
 const raw=Array.isArray(c.holes_data)?c.holes_data:Array.isArray(c.holes)?c.holes:Array.isArray(c.scorecard)?c.scorecard:[];
 const base=raw.slice().sort((a,b)=>(a.number??a.hole_number??a.hole)-(b.number??b.hole_number??b.hole));
 const tees=(Array.isArray(c.tees)?c.tees:[]).map((t,i)=>{
  const teeName=text(t.tee_name||t.name||t.tee_color||'Tee '+(i+1)),keys=[t.tee_key,t.tee_color,teeName].filter(Boolean);
  const holes=(Array.isArray(t.holes)?t.holes:base).map((h,j)=>{
   const metres=number(h.distance_meters??h.distance_m??h.distance)??keyed(h.meters||h.metres,keys);
   const yards=keyed(h.yardages||h.yards,keys)??number(h.yardage??h.distance_yards);
   return{number:number(h.number??h.hole_number??h.hole)??j+1,par:number(h.par),si:number(h.handicap_index??h.stroke_index??h.handicap??h.si),distance:metres!==null?Math.round(metres):yards!==null?Math.round(yards*.9144):null};
  });
  return{id:text(t.tee_key||i),name:teeName+(t.gender?' · '+text(t.gender):''),rating:number(t.course_rating??t.rating),slope:number(t.slope??t.slope_rating),holes};
 });
 return{...normaliseResult(c),sourceUrl:validUrl(c.website)||'https://opengolfapi.org',sourceLabel:'OpenGolfAPI · © OpenStreetMap contributors · ODbL 1.0',retrievedAt:new Date().toISOString(),notes:'Review the selected tee set against the club’s current scorecard. Missing values stay blank. Yardages are converted to metres.',tees};
}
function issues(tee){const h=tee?.holes||[],list=[];if(![9,18].includes(h.length))list.push('A complete 9- or 18-hole scorecard is not available.');if(h.some((x,i)=>x.number!==undefined&&x.number!==i+1))list.push('Hole numbering is incomplete.');if(h.some(x=>!Number.isInteger(x.par)||x.par<3||x.par>6))list.push('Some hole pars are missing.');if(h.some(x=>!Number.isFinite(x.distance)||x.distance<=0||x.distance>1000))list.push('Some hole distances are missing.');if(h.some(x=>!Number.isInteger(x.si)||x.si<1||x.si>h.length)||new Set(h.map(x=>x.si)).size!==h.length)list.push('Some stroke indexes are missing or need checking.');return list}
async function get(path,signal){const controller=new AbortController(),abort=()=>controller.abort();if(signal?.aborted)throw new DOMException('Aborted','AbortError');signal?.addEventListener('abort',abort,{once:true});const timer=setTimeout(abort,10000);try{const response=await fetch(API+path,{signal:controller.signal,headers:{Accept:'application/json'}});if(!response.ok)throw Error(response.status===429?'The online directory is busy. Try again shortly.':'The online directory is unavailable.');return await response.json()}finally{clearTimeout(timer);signal?.removeEventListener('abort',abort)}}
const cache=new Map();
async function search(q,signal){const key=normal(q);if(key.length<3)return[];if(cache.has(key))return cache.get(key);const data=await get('/v1/courses/search?q='+encodeURIComponent(text(q))+'&limit=12',signal);const results=(data.courses||[]).map(normaliseResult).filter(c=>c.id&&c.name);cache.set(key,results);return results}
async function detail(id,signal){return normaliseDetail(await get('/api/v1/courses/'+encodeURIComponent(id),signal))}
const api={normal,normaliseResult,normaliseDetail,issues,search,detail,validUrl};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CourseLookup=api;
})(typeof globalThis!=='undefined'?globalThis:this);
