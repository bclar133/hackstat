const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const lookup=require('../dist/course-lookup.js'),fixture=require('./fixtures/online-scorecard.json');
const detail=lookup.normaliseDetail(fixture),tee=detail.tees[0];
assert.equal(detail.name,'Pebble Beach Golf Links');assert.equal(tee.name,'Blue · Male');assert.equal(tee.holes.length,18);assert.equal(tee.holes[0].distance,346,'convert 378 yards to 346 metres');assert.equal(tee.rating,74.9);assert.equal(tee.slope,144);assert.deepEqual(lookup.issues(tee),[]);
const bad=structuredClone(fixture);delete bad.holes_data[0].yardages.blue;assert.ok(lookup.issues(lookup.normaliseDetail(bad).tees[0]).some(s=>s.includes('distances')),'missing distance never becomes a guessed value');
const invalid=structuredClone(tee);invalid.holes[1].si=invalid.holes[0].si;assert.ok(lookup.issues(invalid).some(s=>s.includes('indexes')),'reject duplicate stroke indexes');
assert.equal(lookup.normaliseDetail({course_name:'Listed only',tees:[],holes_data:[]}).tees.length,0);assert.equal(lookup.validUrl('javascript:alert(1)'),'', 'reject executable source links');assert.equal(lookup.normal('MálEny Golf Club'),'maleny golf club');
const catalog=JSON.parse(fs.readFileSync('dist/course-catalog.json')).courses;
assert.ok(catalog.some(c=>lookup.normal(c.name).includes('male')),'Male prefix finds Maleny');
for(const c of catalog)for(const t of c.tees){assert.equal(t.holes.length,18);assert.deepEqual(lookup.issues(t),[],c.name+' '+t.name);assert.equal(t.holes.reduce((a,h)=>a+h.par,0),69)}
const elements=new Map();function el(sel){if(!elements.has(sel))elements.set(sel,{open:true,innerHTML:'',value:'',textContent:'',attributes:{},setAttribute(k,v){this.attributes[k]=v},removeAttribute(k){delete this.attributes[k]},getAttribute(k){return this.attributes[k]},scrollIntoView(){}});return elements.get(sel)}
let remoteResolve;
const ctx={console,document:{querySelector:el,querySelectorAll:()=>[]},$:el,esc:s=>String(s??'').replace(/[<>&"']/g,''),sum:a=>a.reduce((x,y)=>x+y,0),AbortController,URL,setTimeout,clearTimeout,fetch:async()=>({ok:true,json:async()=>({courses:catalog})}),CourseLookup:{...lookup,search:async()=>[],detail:async()=>detail}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/course-search-ui.js','utf8'),ctx);const run=s=>vm.runInContext(s,ctx);
(async()=>{
 run('initialiseCourseLookup()');await run('runCourseLookup("Male",courseLookupSequence)');assert.ok(el('#courseSuggestions').innerHTML.includes('Maleny Golf Club'));
 await run('chooseCourseResult(0)');assert.ok(el('#ctee').value);assert.equal(el('#choles').value,'18');assert.ok(el('#courseImportSummary').innerHTML.includes('18 holes filled'));assert.ok(el('#courseHoleFields').innerHTML.includes('data-cpar="17"'));assert.equal(run('courseImportSource.externalId'),'maleny-golf-club');
 const personal={rounds:[{id:'round-remains'}]};ctx.db=personal;run('applyOnlineTee(0)');assert.equal(personal.rounds[0].id,'round-remains','lookup does not mutate rounds');
 ctx.CourseLookup.search=()=>new Promise(r=>remoteResolve=r);const pending=run('runCourseLookup("Maleny",courseLookupSequence)');await new Promise(r=>setTimeout(r,0));run('courseLookupSequence++;');remoteResolve([{id:'stale',name:'Stale result'}]);await pending;assert.ok(!el('#courseSuggestions').innerHTML.includes('Stale result'),'discard stale autocomplete response');
 ctx.CourseLookup.detail=async()=>({...detail,name:'No card',tees:[]});run("courseLookupItems=[{id:'missing',name:'No card',provider:'opengolfapi'}]");await run('chooseCourseResult(0)');assert.equal(el('#ctee').value,'');assert.ok(el('#courseHoleFields').innerHTML.includes('value=""'));assert.ok(el('#courseImportPanel').innerHTML.includes('not available'));
 console.log('Passed: live-response schema, tee categories, yards/metres, missing data, duplicate indexes, Maleny autocomplete, tee autofill, stale responses, source links and preserved rounds.');
})().catch(e=>{console.error(e);process.exitCode=1});
