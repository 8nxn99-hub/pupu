/* Apply regular Latin typography to initial and dynamically inserted copy. */
(()=>{'use strict';
const excluded='script,style,noscript,textarea,code,pre,svg,.latin-run,[contenteditable=true]';
function wrap(container){if(!container?.isConnected)return;const nodes=[];
 if(container.nodeType===Node.TEXT_NODE)nodes.push(container);else{const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode);}
 for(const node of nodes){if(!node.parentElement||node.parentElement.closest(excluded)||!/[A-Za-z]/.test(node.data))continue;const text=node.data,regex=/[A-Za-z][A-Za-z0-9’'&\/?.:!+()–—\- \u00a0]*/g;let m,start=0;const frag=document.createDocumentFragment();while((m=regex.exec(text))){if(m.index>start)frag.append(text.slice(start,m.index));const span=document.createElement('pupu-latin');span.className='latin-run';span.textContent=m[0];frag.append(span);start=m.index+m[0].length;}if(start){if(start<text.length)frag.append(text.slice(start));node.replaceWith(frag);}}
}
const observer=new MutationObserver(records=>{observer.disconnect();for(const r of records){if(r.type==='characterData')wrap(r.target);else for(const node of r.addedNodes)wrap(node);}observe();});
function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
wrap(document.body);observe();
})();

