const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const requireApp = createRequire(path.join(root,'package.json'));
const ts = requireApp('typescript');
function load(file,mocks={}) {
  const source = fs.readFileSync(path.join(root,file),'utf8');
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const module={exports:{}};
  const requireMock=name=>Object.hasOwn(mocks,name)?mocks[name]:requireApp(name);
  new Function('require','module','exports',code)(requireMock,module,module.exports);
  return module.exports;
}
async function main() {
  const calls=[];
  let signedIn=true;
  const tx={itinerary:{deleteMany:async v=>calls.push(['delete',v]),createMany:async v=>calls.push(['create',v])},quizAnswer:{deleteMany:async v=>calls.push(['deleteQuiz',v]),create:async v=>calls.push(['createQuiz',v])}};
  const prisma={$transaction:async fn=>fn(tx),match:{delete:async v=>calls.push(['deleteMatch',v]),create:async v=>calls.push(['createMatch',v])},itinerary:{findMany:async v=>{calls.push(['get',v]);return [];}}};
  let streamError;
  const actions=load('app/actions.ts',{
    '@/lib/db':prisma, '@/lib/user':{requireUser:async()=>{if(!signedIn)throw Error('Sign in required');return{id:'test-user',username:'traveler'};}},
    '@clerk/nextjs/server':{currentUser:async()=>null}, 'next/cache':{revalidatePath:()=>{}},'next/navigation':{redirect:()=>{}},
    '@/lib/logger':{},'../lib/stripe':{},'@/lib/stripe':{},'./quiz-questions/questions':[],
    '@ai-sdk/google':{google:()=>({})},ai:{streamText:async()=>{throw Error('Provider offline');}},
    'ai/rsc':{createStreamableValue:()=>({value:{},error:error=>{streamError=error;},update:()=>{},done:()=>{}})},
  });
  const block={id:'block-1',type:'paragraph',props:{textAlignment:'left'},content:[{type:'text',text:'First ',styles:{bold:true}},{type:'text',text:'second',styles:{}}],children:[{type:'paragraph',content:[{type:'text',text:'Nested',styles:{}}]}]};
  await actions.updateItinerary([block]);
  const row=calls.find(([name])=>name==='create')[1].data[0];
  assert.equal(row.text,'First second');assert.deepEqual(row.props._cityswipeBlock,block);assert.equal(row.userId,'test-user');assert.equal(row.blockNum,1);
  console.log('PASS rich text, nested blocks, block order, and user ownership survive saves');
  calls.length=0;await actions.updateItinerary([]);assert.deepEqual(calls,[['delete',{where:{userId:'test-user'}}]]);console.log('PASS clearing an itinerary clears stored blocks');
  signedIn=false;calls.length=0;await assert.rejects(actions.updateItinerary([block]),/Sign in/);await assert.rejects(actions.deleteMatch('someone-elses-match'),/Sign in/);assert.equal(calls.length,0);signedIn=true;console.log('PASS unauthenticated writes are rejected before database access');
  await actions.deleteMatch('match-1');assert.deepEqual(calls[0][1].where,{id:'match-1',userId:'test-user'});console.log('PASS deleting matches is scoped to the signed-in user');
  calls.length=0;await actions.addQuestions(['A','B','C','D','E']);assert.equal(calls[1][1].data.a5,'E');assert.equal(calls[1][1].data.userId,'test-user');await assert.rejects(actions.addQuestions(['A']));console.log('PASS quiz answers validate and replace previous answers');
  calls.length=0;await actions.addMatch({destinations:[{city:'Paris',country:'France',description:'Description',illustration:'/photo.jpg',pros:[],cons:[],compatibility:85,budget:200}]});assert.equal(calls[0][1].data.budget,200);await assert.rejects(actions.addMatch({destinations:[]}));console.log('PASS saved matches retain budgets and invalid matches are rejected');
  await actions.streamFlirtatiousConversation('New York','United States',[]);await new Promise(resolve=>setImmediate(resolve));assert.match(streamError.message,/Unable to contact/);console.log('PASS AI failures close the client stream with an error');
  const swipe=load('app/match/_utils/handleResponse.tsx').default;const card={city:'Paris'};const saved=[];assert.deepEqual(swipe({direction:'left',cards:[card],destinations:saved}),[]);assert.deepEqual(swipe({direction:'right',cards:[card],destinations:saved}),[card]);assert.equal(saved.length,0);console.log('PASS swipes only save accepted cards without mutating state');
  const cards=[{city:'Old'}], fresh=[{city:'A'},{city:'B'}];const state={id:1,cards,allCards:[{city:'Seen'}],responses:['A']};
  const loader=load('app/match/_utils/loadCards.tsx',{'@/app/quiz/generateDestinations':{generateDestinations:async()=>fresh}});let next;await loader.loadMoreCards(state,fn=>{next=fn(state);});assert.deepEqual(next.cards.map(c=>c.city),['B','A','Old']);assert.deepEqual(next.allCards.map(c=>c.city),['Seen','A','B']);assert.deepEqual(fresh.map(c=>c.city),['A','B']);console.log('PASS loading more cards preserves order and exclusion history');
  console.log('9 regression checks passed');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
