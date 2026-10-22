(()=>{'use strict';
const root=document.querySelector('#history.paper-history');if(!root)return;
const $=s=>root.querySelector(s),motion=matchMedia('(prefers-reduced-motion: reduce)');
const stories=[
 {era:'古罗马 / ROMAN WORLD',title:'上个厕所，还能组个局？',copy:'在古罗马的一些公共厕所里，人们坐在开有孔洞的长凳上，身旁没有今天熟悉的独立隔间。厕所遗迹也让我们看到，排泄这件小事，早就和城市的公共生活连在一起。',joke:'你以为是私人时间，结果是多人座位。古罗马版“拼桌”，有点突然。',source:'https://www.english-heritage.org.uk/visit/places/housesteads-roman-fort-hadrians-wall/history/significance/',label:'English Heritage · 豪斯戴兹罗马堡'},
 {era:'6世纪 · 中国 / CHINA',title:'有些纸，古人真的舍不得用。',copy:'颜之推在《颜氏家训》中提到，写有经典文字或圣贤姓名的纸，不敢用来如厕。这条日常记载，也让后人得以窥见当时纸张的一种用途，以及人们对文字的敬重。',joke:'不是每一张纸，都适合在这里“发挥余热”。这张有知识，先放过。',source:'https://zh.wikisource.org/wiki/%E9%A1%8F%E6%B0%8F%E5%AE%B6%E8%A8%93/%E6%B2%BB%E5%AE%B6',label:'《颜氏家训》· 治家篇'},
 {era:'1858 · 伦敦 / LONDON',title:'一条河，把议会臭急了。',copy:'1858 年夏天，伦敦遭遇“大恶臭”。污水、工业废物与高温让泰晤士河的气味影响了议会办公。这场危机推动了城市排污设施的改善：冲走之后的故事，终于不能再假装看不见。',joke:'有些城市更新，是被市民催出来的；这一次，鼻子也投了一票。',source:'https://www.parliament.uk/about/living-heritage/building/palace/estatehistory/from-the-parliamentary-collections/thames/estimatethamespurification/',label:'UK Parliament · 泰晤士河档案'},
 {era:'现代 · 太空 / SPACE',title:'上了太空，也得解决这件事。',copy:'宇航员到了太空，仍然需要上厕所。微重力环境里，没有重力把一切往下带，太空厕所要依靠气流把排泄物引入收集装置。人类的探索越走越远，日常生活的工程题也跟着升级。',joke:'人可以起飞，便便不能随便飞。这一题，交给工程师。',source:'https://www.nasa.gov/general/morning-routine-in-space/',label:'NASA · 太空里的早晨'}
];
const stage=$('.ph-stage'),pull=$('.ph-pull'),dialog=$('.ph-reader'),sheet=$('.ph-sheet'),bin=$('.ph-bin'),grip=$('.ph-drag-grip');let index=0,seen=0,state='ready',pullDrag=null,sheetDrag=null,focusBefore=null,previousOverflow='';
const animate=async(el,keyframes,options)=>{if(motion.matches)return;try{await el.animate(keyframes,options).finished}catch{}};
function setState(s){state=s;stage.dataset.state=s;root.dataset.paperState=s;}
function status(s){$('.ph-status').textContent=s;}
function update(){const count=String(index+1).padStart(2,'0');$('.ph-counter').textContent=`${count} / 04`;$('.ph-seen').textContent=`已读 ${seen} 张`;$ ('.ph-pull').setAttribute('aria-label',`向下拉撕开第 ${index+1} 张文明史，也可按 Enter`);}
function resetPull(){stage.style.setProperty('--pull','0px');stage.style.setProperty('--pull-ratio','0');$('.ph-pull-text').textContent='向下拉，撕开历史';}
async function tear(){if(!['ready','dragging','armed'].includes(state))return;setState('tearing');pullDrag=null;pull.disabled=true;$('.ph-click-tear').disabled=true;
 const origin=$('.ph-tail').getBoundingClientRect();
 const rollKick=animate($('.ph-roll'),[{transform:'perspective(900px) rotateX(0deg)'},{transform:'perspective(900px) translateY(7px) rotateX(12deg)',offset:.35},{transform:'perspective(900px) rotateX(-6deg)',offset:.7},{transform:'none'}],{duration:470,easing:'ease-out'});
 await animate($('.ph-tail'),[{transform:'perspective(800px) rotateX(0deg) rotate(-2deg)',opacity:1,clipPath:'inset(0 0 0 0)'},{transform:'perspective(800px) translate(9px,26px) rotateX(-13deg) rotate(3deg)',opacity:1,clipPath:'polygon(0 2%,100% 0,100% 100%,0 100%)',offset:.5},{transform:'perspective(800px) translate(15px,60px) rotateX(-20deg) rotate(7deg)',opacity:0,clipPath:'polygon(0 10%,100% 1%,100% 100%,0 100%)'}],{duration:340,easing:'cubic-bezier(.4,0,.6,1)'});
 const s=stories[index];$('.ph-story-number').textContent=`PUPU ARCHIVE / ${String(index+1).padStart(2,'0')}`;$('.ph-story-meta').textContent=s.era;$('#ph-story-title').textContent=s.title;$('.ph-story-copy').textContent=s.copy;$('.ph-joke p').textContent=s.joke;$('.ph-source').href=s.source;$('.ph-source').textContent=`${s.label} ↗`;$ ('.ph-sheet-pagination').textContent=`${index+1} / ${stories.length}`;
 focusBefore=document.activeElement;previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();setState('reading');resetPull();
 const target=sheet.getBoundingClientRect(),dx=origin.left+origin.width/2-target.left-target.width/2,dy=origin.top+origin.height/2-target.top-target.height/2;
 const reveal=[...sheet.querySelectorAll('.ph-story-meta,h3,.ph-story-copy,.ph-joke,.ph-source,.ph-footnote,.ph-sheet-bottom')].map((el,i)=>animate(el,[{opacity:0,transform:'translateY(14px)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:420,delay:180+i*45,easing:'ease-out',fill:'backwards'}));
 await animate(sheet,[{transform:`perspective(1400px) translate(${dx}px,${dy}px) rotateX(-28deg) rotateZ(-4deg) scale(${Math.max(.2,origin.width/target.width)},${Math.max(.25,origin.height/target.height)})`,opacity:.15},{transform:'perspective(1400px) translate(0,0) rotateX(7deg) rotateZ(1deg) scale(1.025)',opacity:1,offset:.76},{transform:'perspective(1400px) rotateX(0deg) scale(1)',opacity:1}],{duration:680,easing:'cubic-bezier(.18,.8,.18,1)'});
 if(state==='reading')$('#ph-story-title').focus({preventScroll:true});
}
function cleanupReader(){sheet.style.transform='';sheet.classList.remove('is-dragging');bin.classList.remove('is-over');dialog.removeAttribute('data-busy');sheetDrag=null;document.documentElement.style.overflow=previousOverflow;pull.disabled=false;$('.ph-click-tear').disabled=false;resetPull();setState('ready');update();(focusBefore?.isConnected?focusBefore:pull).focus({preventScroll:true});}
async function discard(){if(state!=='reading')return;setState('discarding');dialog.dataset.busy='true';const from=sheet.getBoundingClientRect(),to=bin.getBoundingClientRect();const dx=to.left+to.width/2-(from.left+from.width/2),dy=to.top+to.height/2-(from.top+from.height/2);const current=getComputedStyle(sheet).transform,matrix=new DOMMatrixReadOnly(current==='none'?undefined:current);const totalX=dx+matrix.m41,totalY=dy+matrix.m42;sheet.getAnimations().forEach(a=>a.cancel());
 await animate(sheet,[{transform:current==='none'?'none':current,opacity:1},{transform:`translate(${totalX}px,${totalY}px) rotate(28deg) scale(.035)`,opacity:0}],{duration:520,easing:'cubic-bezier(.4,0,.8,.4)'});
 await animate(bin,[{transform:'scale(1)'},{transform:'translateY(-7px) rotate(-7deg) scale(1.08)'},{transform:'scale(1)'}],{duration:230});
 seen++;index=(index+1)%stories.length;dialog.close();cleanupReader();status(index===0?'这一卷读完啦！可以再撕一轮，重温四段历史。':`纸已丢进废纸篓。第 ${index+1} 张历史，等你来撕。`);
}
function putBack(){if(state!=='reading')return;dialog.close();cleanupReader();status('这张先收起，重新撕开还能继续看。');}
pull.addEventListener('pointerdown',e=>{if(state!=='ready'||(e.pointerType==='mouse'&&e.button!==0))return;pullDrag={id:e.pointerId,startY:e.clientY,amount:0};pull.setPointerCapture(e.pointerId);setState('dragging');});
pull.addEventListener('pointermove',e=>{if(!pullDrag||e.pointerId!==pullDrag.id)return;const raw=Math.max(0,e.clientY-pullDrag.startY),amount=Math.min(120,raw*.65);pullDrag.amount=raw;stage.style.setProperty('--pull',`${amount}px`);stage.style.setProperty('--pull-ratio',String(Math.min(1,raw/140)));setState(raw>=105?'armed':'dragging');$('.ph-pull-text').textContent=raw>=105?'松手，撕下这一张！':'再往下一点点…';});
pull.addEventListener('pointerup',e=>{if(!pullDrag||e.pointerId!==pullDrag.id)return;const amount=pullDrag.amount;pullDrag=null;if(pull.hasPointerCapture(e.pointerId))pull.releasePointerCapture(e.pointerId);if(amount>=105||amount<7)tear();else{setState('ready');resetPull();status('还差一点点！再向下拉一些，或点击“撕下一张”。');}});
function cancelPull(){if(!pullDrag)return;pullDrag=null;setState('ready');resetPull();}pull.addEventListener('pointercancel',cancelPull);pull.addEventListener('lostpointercapture',cancelPull);
pull.addEventListener('click',e=>{if(e.detail===0)tear();});$('.ph-click-tear').addEventListener('click',tear);bin.addEventListener('click',discard);$('.ph-put-back').addEventListener('click',putBack);
dialog.addEventListener('cancel',e=>{e.preventDefault();putBack();});
const overBin=(x,y)=>{const r=bin.getBoundingClientRect();return x>=r.left-24&&x<=r.right+24&&y>=r.top-24&&y<=r.bottom+24;};
grip.addEventListener('pointerdown',e=>{if(state!=='reading'||(e.pointerType==='mouse'&&e.button!==0))return;sheetDrag={id:e.pointerId,x:e.clientX,y:e.clientY};grip.setPointerCapture(e.pointerId);sheet.classList.add('is-dragging');});
grip.addEventListener('pointermove',e=>{if(!sheetDrag||e.pointerId!==sheetDrag.id)return;const dx=e.clientX-sheetDrag.x,dy=e.clientY-sheetDrag.y;sheet.style.transform=`translate(${dx}px,${dy}px) rotate(${Math.max(-12,Math.min(12,dx/28))}deg) scale(.97)`;bin.classList.toggle('is-over',overBin(e.clientX,e.clientY));});
function cancelSheet(){sheetDrag=null;sheet.style.transform='';sheet.classList.remove('is-dragging');bin.classList.remove('is-over');}
grip.addEventListener('pointerup',e=>{if(!sheetDrag||e.pointerId!==sheetDrag.id)return;const drop=overBin(e.clientX,e.clientY);sheetDrag=null;if(grip.hasPointerCapture(e.pointerId))grip.releasePointerCapture(e.pointerId);sheet.classList.remove('is-dragging');bin.classList.remove('is-over');if(drop)discard();else{const from=sheet.style.transform;sheet.style.transform='';animate(sheet,[{transform:from},{transform:'none'}],{duration:250,easing:'ease-out'});}});
grip.addEventListener('pointercancel',cancelSheet);grip.addEventListener('lostpointercapture',()=>{if(sheetDrag)cancelSheet();});
dialog.addEventListener('close',()=>{if(state==='reading'){cleanupReader();status('这张已收起，随时可以重新撕开。');}});
update();setState('ready');
})();
