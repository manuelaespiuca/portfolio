// ===== interatividade extra (adicionada) =====
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

// barra de progresso de leitura + botão "voltar ao topo"
var bar=document.createElement('div');bar.className='xp-bar';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
var top=document.createElement('button');top.type='button';top.className='xp-top';
top.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>';
document.body.appendChild(top);
function topLabel(){var en=document.documentElement.lang==='en';top.setAttribute('aria-label',en?'Back to top':'Voltar ao topo');}
topLabel();new MutationObserver(topLabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
top.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'});});
var tick=false;
function onScroll(){tick=false;var h=document.documentElement,max=h.scrollHeight-h.clientHeight,y=scrollY;
 bar.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';top.classList.toggle('on',y>600);}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll);}},{passive:true});onScroll();

// seções entram suavemente ao rolar
if('IntersectionObserver' in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
 document.querySelectorAll('main section').forEach(function(s){
  if(s.getBoundingClientRect().top<innerHeight*.9)return;s.classList.add('rv');io.observe(s);});
}

if(fine){
 // brilho que segue o mouse nos cards de projeto
 document.querySelectorAll('.proj').forEach(function(c){
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});
  c.addEventListener('pointerleave',function(){c.style.setProperty('--mx','-999px');c.style.setProperty('--my','-999px');});});
}

// projetos: setas do teclado e deslizar no celular
var prev=document.getElementById('prev'),next=document.getElementById('next'),tr=document.getElementById('track');
function go(b){if(b&&!b.disabled)b.click();}
addEventListener('keydown',function(e){var t=e.target.tagName;if(/INPUT|TEXTAREA|SELECT/.test(t)||e.altKey||e.ctrlKey||e.metaKey)return;
 var s=document.getElementById('projetos'),r=s.getBoundingClientRect();if(r.top>innerHeight*.6||r.bottom<innerHeight*.3)return;
 if(e.key==='ArrowRight')go(next);else if(e.key==='ArrowLeft')go(prev);});
var sx=0,sy=0;
tr.addEventListener('touchstart',function(e){sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY;},{passive:true});
tr.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
 if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(dx<0?next:prev);},{passive:true});
})();
