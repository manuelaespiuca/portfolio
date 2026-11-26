(function(){
var src=document.getElementById('src'),desk=document.getElementById('pf-desk'),fo=document.getElementById('pf-folders');
if(!src||!desk||!fo)return;
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.textContent=h;return e}
var z=10,n=0,open={},POS=[[1,1],[20.5,1],[1,26],[1,51],[20.5,26],[20.5,51],[10.75,76]];
// textos das janelas vêm dos cards originais (assim PT/EN continuam funcionando)
function sync(){[].forEach.call(document.querySelectorAll('[data-sk]'),function(e){var s=src.querySelector('[data-i18n="'+e.getAttribute('data-sk')+'"]');if(s)e.innerHTML=s.innerHTML})}
langHooks.push(sync);
function win(title,body,x,y,key,cls){
  var w=el('div','pf-win '+(cls||''));w.style.left=x+'px';w.style.top=y+'px';w.style.zIndex=++z;
  var t=el('div','pf-wt');t.appendChild(el('span',null,title));var bt=el('div');
  bt.appendChild(el('i',null,'–'));bt.appendChild(el('i',null,'□'));var c=el('i','c','×');c.title='X';bt.appendChild(c);t.appendChild(bt);
  var b=el('div','pf-wb');b.appendChild(body);w.appendChild(t);w.appendChild(b);desk.appendChild(w);
  c.onclick=function(){w.remove();if(key)delete open[key]};return w}
function projBody(a){
  var d=el('div'),sp=[].map.call(a.querySelectorAll('.mini code span'),function(s){return s.textContent.replace(/\u00a0/g,' ')});
  d.appendChild(el('div','pf-term',sp.join('\n')));
  [a.querySelector('p[data-i18n$=".desc"]'),a.querySelector('.more p')].forEach(function(s){if(!s)return;var p=el('p');p.setAttribute('data-sk',s.getAttribute('data-i18n'));d.appendChild(p)});
  var u=el('ul','pf-ch');[].forEach.call(a.querySelectorAll('.chips li'),function(c){u.appendChild(el('li',null,c.textContent))});d.appendChild(u);
  var l=el('a','pf-go');l.href=a.querySelector('a.btn').href;l.target='_blank';l.rel='noopener';l.innerHTML='<span data-sk="code"></span> &gt;&gt;';d.appendChild(l);return d}
[].forEach.call(src.querySelectorAll('.proj'),function(a){
  var name=a.getAttribute('data-repo'),b=el('button','pf-fo');b.type='button';b.appendChild(el('span','pf-fd'));b.appendChild(document.createTextNode(name));
  b.onclick=function(){var w=open[name];
    if(w&&w.isConnected){w.style.zIndex=++z}else{n++;w=open[name]=win(name+'.exe',projBody(a),Math.round(desk.clientWidth*.875),Math.round(desk.clientHeight*.54),name,'pf-pw');sync();
      /* posição padrão: canto inferior direito da foto; se não couber na tela, recua para dentro */
      var dl=desk.getBoundingClientRect().left,mx=document.documentElement.clientWidth-dl-w.offsetWidth-12;if(parseFloat(w.style.left)>mx)w.style.left=Math.max(0,mx)+'px'}
    if(innerWidth<=760)w.scrollIntoView({behavior:'smooth',block:'center'})};
  var P=POS[fo.children.length]||[2,3];b.style.left=P[0]+'%';b.style.top=P[1]+'%';b.setAttribute('data-i',fo.children.length);
  fo.appendChild(b)});
var last=0;
document.addEventListener('pfpage',function(e){var p=e.detail.page,per=e.detail.per,dir=p>=last?1:-1;last=p;
  [].forEach.call(fo.children,function(b){var on=Math.floor(b.getAttribute('data-i')/per)===p;b.hidden=!on;b.classList.remove('in');
    if(on){b.style.setProperty('--pfx',(14*dir)+'px');void b.offsetWidth;b.classList.add('in')}})});
var dr=null;
document.addEventListener('pointerdown',function(e){var t=e.target.closest('.pf-wt');if(!t||e.target.closest('i')||innerWidth<=760)return;
  var w=t.parentElement;w.style.zIndex=++z;dr={w:w,dx:e.clientX-w.offsetLeft,dy:e.clientY-w.offsetTop};t.setPointerCapture(e.pointerId);t.style.cursor='grabbing'});
document.addEventListener('pointermove',function(e){if(!dr)return;dr.w.style.left=(e.clientX-dr.dx)+'px';dr.w.style.top=(e.clientY-dr.dy)+'px'});
document.addEventListener('pointerup',function(){if(dr){dr.w.firstChild.style.cursor='';dr=null}});

/* arrastar as pastas (clique simples continua abrindo a janela) */
(function(){
  var dg=null,moved=false;
  fo.addEventListener('pointerdown',function(e){
    moved=false;var b=e.target.closest('.pf-fo');if(!b||innerWidth<=760||e.button>0)return;
    var r=fo.getBoundingClientRect();
    dg={b:b,id:e.pointerId,sx:e.clientX,sy:e.clientY,l:b.offsetLeft,t:b.offsetTop,w:r.width,h:r.height,on:false};
  });
  fo.addEventListener('pointermove',function(e){
    if(!dg||e.pointerId!==dg.id)return;
    var dx=e.clientX-dg.sx,dy=e.clientY-dg.sy;
    if(!dg.on){if(Math.abs(dx)+Math.abs(dy)<6)return;dg.on=true;dg.b.setPointerCapture(e.pointerId);dg.b.classList.add('dragging')}
    var x=Math.min(Math.max(dg.l+dx,0),Math.max(0,dg.w-dg.b.offsetWidth)),
        y=Math.min(Math.max(dg.t+dy,0),Math.max(0,dg.h-dg.b.offsetHeight));
    dg.b.style.left=x+'px';dg.b.style.top=y+'px';
  });
  function end(e){
    if(!dg||e.pointerId!==dg.id)return;
    if(dg.on){
      moved=true;
      dg.b.classList.remove('dragging');
      dg.b.style.left=(dg.b.offsetLeft/dg.w*100).toFixed(2)+'%';
      dg.b.style.top=(dg.b.offsetTop/dg.h*100).toFixed(2)+'%';
    }
    dg=null;
  }
  fo.addEventListener('pointerup',end);fo.addEventListener('pointercancel',end);
  fo.addEventListener('click',function(e){if(moved){e.stopImmediatePropagation();e.preventDefault()}},true);
})();
})();
