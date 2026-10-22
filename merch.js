(()=>{'use strict';
const section=document.querySelector('#merch'),viewer=document.querySelector('#merch-viewer');if(!section||!viewer)return;
const cards=[...section.querySelectorAll('.merch-card')],picture=viewer.querySelector('.merch-viewer-image'),title=viewer.querySelector('#merch-viewer-title'),copy=viewer.querySelector('.merch-viewer-copy'),count=viewer.querySelector('.merch-viewer-count');let index=0,trigger=null,scrollLock='';
function render(next){index=(next+cards.length)%cards.length;const card=cards[index],img=card.querySelector('img');picture.src=img.getAttribute('src');picture.alt=img.alt;title.textContent=card.querySelector('h3').textContent;copy.textContent=card.querySelector('p').textContent;count.textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');}
section.querySelectorAll('[data-merch-index]').forEach(button=>button.addEventListener('click',()=>{trigger=button;render(Number(button.dataset.merchIndex));scrollLock=document.body.style.overflow;viewer.showModal();document.body.style.overflow='hidden';viewer.querySelector('.merch-close').focus();}));
viewer.querySelector('.merch-close').addEventListener('click',()=>viewer.close());viewer.querySelector('.merch-prev').addEventListener('click',()=>render(index-1));viewer.querySelector('.merch-next').addEventListener('click',()=>render(index+1));
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();render(index-1)}if(e.key==='ArrowRight'){e.preventDefault();render(index+1)}});
viewer.addEventListener('click',e=>{if(e.target!==viewer)return;const b=viewer.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)viewer.close()});
viewer.addEventListener('close',()=>{document.body.style.overflow=scrollLock;trigger?.focus({preventScroll:true})});
})();
