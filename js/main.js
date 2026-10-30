// marcações do relógio
(function(){var g=document.getElementById('ticks'),s='';
for(var i=0;i<60;i++){var a=i*6*Math.PI/180,big=i%5===0,r1=big?186:190,r2=198;
s+='<line x1="'+(200+r1*Math.sin(a)).toFixed(1)+'" y1="'+(200-r1*Math.cos(a)).toFixed(1)+'" x2="'+(200+r2*Math.sin(a)).toFixed(1)+'" y2="'+(200-r2*Math.cos(a)).toFixed(1)+'" stroke-width="'+(big?2:1)+'" opacity="'+(big?.9:.45)+'"/>';}
g.innerHTML=s;})();

// tema
var root=document.documentElement,btn=document.getElementById('theme');
try{var saved=localStorage.getItem('tema');if(saved)root.setAttribute('data-theme',saved);}catch(e){}
btn.addEventListener('click',function(){
  var dark=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
  var next=dark?'light':'dark';root.setAttribute('data-theme',next);
  try{localStorage.setItem('tema',next);}catch(e){}
});

// idioma (PT / EN): o português fica no próprio HTML; aqui só entra a tradução
var LANG='pt',langHooks=[],typedTimer;
var EN={
 'home':`Manuela, home`,
 'nav.about':`About`,'nav.edu':`Education`,'nav.proj':`Projects`,'nav.cert':`Certifications`,'nav.contact':`Contact`,
 'theme':`Toggle light and dark theme`,
 'hero.h1':`Hi, I'm Manuela`,'role.pre':``,'role.post':` student`,
 'hero.cta':`See my projects →`,
 'hero.alt':`Featured image of Manuela's portfolio`,
 'about.h2':`About`,
 'about.p':`Student in Rio de Janeiro, coming from Psychology. I'm still exploring different areas, but I'm interested in <strong>software development</strong>, <strong>front-end</strong>, <strong>UX/UI</strong> and <strong>game development</strong>, and I practice by building personal projects.`,
 'about.wings':`Wings made of braille dots, with little sparkles`,
 'edu.h2':`Education`,'edu.cs':`Computer Science · IBMR`,'edu.inprog':`In progress`,
 'edu.psy':`Psychology · Afya Universidade Unigranrio`,'edu.psyp':`3 semesters completed, through 2026.1`,
 'edu.eng':`English · Cultura Inglesa`,'edu.lvl':`Level B1`,
 'tech.sub':`Technologies`,'tech.lang':`Languages`,'tech.vc':`Tools`,'tech.ai':`AI`,
 'proj.h2':`Projects`,'proj.intro':`Here are some of the projects I've worked on recently.`,
 'p1.desc':`A Python bot built with discord.py for study organization, music and Discord server management, with switchable personalities.`,
 'p1.more':`Integration with the Google Gemini API for context-aware chat and an AI tutor (explanations, summaries and quizzes). Commands and features organized in cogs, with moderation, music with a queue (yt-dlp and FFmpeg), pomodoro, reminders and tasks. A personality system (Ame and KAngel) with AI instructions and messages of its own for each mode, chosen per server. Bilingual support (Portuguese and English) with a language preference saved per server and automatic welcome and goodbye messages.`,
 'pf.desc':`This very site: my personal portfolio, built with plain HTML, CSS and JavaScript, no frameworks.`,
 'pf.more':`Light and dark theme, Portuguese and English without reloading the page, a project carousel with keyboard arrows and swipe on mobile, certifications with a filter by area, draggable stars and a contact form that opens the email app. Respects prefers-reduced-motion.`,
 'pj.desc':`A Java (OOP) command-line application to register employees and generate the payroll.`,
 'pj.more':`A class hierarchy with inheritance and polymorphism (standard, commissioned and production employees), each with its own salary calculation. Input data validation and unique employee ID enforcement. A payroll summary with total and average salary.`,
 'p2.desc':`A "Hello, World!" in every language I'm learning.`,
 'p2.more':`Each folder has the classic "Hello, World!" in a different language, as a record of what I'm learning and how each syntax changes.`,
 'p3.desc':`Exercises and small projects from my first steps in programming logic.`,
 'p3.more':`Exercises solved in Portugol, from the basics (variables and conditions) to small projects with loops and arrays.`,
 'code':`Code`,
 'soon.code':`// coming soon`,'soon.desc':`Space reserved for the next portfolio project.`,'soon.chip':`Coming soon`,
 'prev':`Previous page`,'next':`Next page`,
 'cert.h2':`Certifications`,'cert.filter':`Filter by area`,
 'c1':`Programming Logic in JavaScript`,'c6':`GitHub in Practice Workshop`,'c7':`Digital Safety and Security Awareness`,'c2':`UX Design level 1 of 3`,
 'c3':`User-Centered Design`,'c4':`Office 2016 Suite`,'c5':`Internet of Things, AI and the Connected Revolution`,
 'contact.h2':`Contact`,'form.bar':`Contact form`,'mascot.alt':`Pixel open envelope with a letter`,'mascot.cap':`Get in touch!`,
 'f.name':`Name:`,'f.msg':`Message:`,'ph.name':`Your name...`,'ph.msg':`Tell me about your project...`,'f.send':`Send email`,
 'footer':`© 2026 Manuela Espiúca. All rights reserved.`,
 'hint':`drag me!`
};
var DYN={
 pt:{btn:'EN',tip:'English',switchTo:'Mudar idioma para inglês',title:'Manuela Espiúca · Portfólio',typed:'Ciência da Computação',details:'Detalhes',hide:'Ocultar',page:'Página ',seeAll:'Ver todas',seeLess:'Ver menos',subject:'Contato pelo portfólio',nome:'Nome: ',mail:'E-mail: '},
 en:{btn:'PT',tip:'Português',switchTo:'Switch language to Portuguese',title:'Manuela Espiúca · Portfolio',typed:'Computer Science',details:'Details',hide:'Hide',page:'Page ',seeAll:'See all',seeLess:'See less',subject:'Contact via portfolio',nome:'Name: ',mail:'Email: '}
};
var AREAS={'Todas':'All','Programação':'Programming','Design':'Design','Tecnologia':'Technology','Produtividade':'Productivity'};
function L(k){return DYN[LANG][k];}
function areaName(a){return LANG==='en'?(AREAS[a]||a):a;}

function typeText(t,animate){var el=document.getElementById('typed'),i=0;clearTimeout(typedTimer);
if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=t;return;}
(function n(){el.textContent=t.slice(0,i++);if(i<=t.length)typedTimer=setTimeout(n,70);})();}

function applyStatic(){var en=LANG==='en';
[].forEach.call(document.querySelectorAll('[data-i18n],[data-i18n-attr]'),function(el){
 if(el.hasAttribute('data-i18n')){if(el._pt===undefined)el._pt=el.innerHTML;
  var k=el.getAttribute('data-i18n');el.innerHTML=(en&&EN[k]!==undefined)?EN[k]:el._pt;}
 if(el.hasAttribute('data-i18n-attr')){if(!el._ptA)el._ptA={};
  el.getAttribute('data-i18n-attr').split(',').forEach(function(p){var s=p.split(':'),a=s[0],k=s[1];
   if(el._ptA[a]===undefined)el._ptA[a]=el.getAttribute(a);
   el.setAttribute(a,(en&&EN[k]!==undefined)?EN[k]:el._ptA[a]);});}
});}

function applyLang(lang,animate){LANG=lang;
 applyStatic();
 document.documentElement.lang=lang==='en'?'en':'pt-BR';
 document.title=L('title');
 var lb=document.getElementById('lang');
 document.getElementById('lang-label').textContent=L('btn');
 lb.setAttribute('aria-label',L('switchTo'));lb.title=L('tip');
 typeText(L('typed'),animate);
 [].forEach.call(document.querySelectorAll('.proj .solid'),function(b){
  b.textContent=b.closest('.proj').classList.contains('open')?L('hide'):L('details');});
 langHooks.forEach(function(f){f();});
 try{localStorage.setItem('lang',lang);}catch(e){}}

document.getElementById('lang').addEventListener('click',function(){applyLang(LANG==='pt'?'en':'pt',true);});

// formulário: abre o app de e-mail com a mensagem pronta
document.getElementById('cform').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target;
  var corpo=L('nome')+f.nome.value+'\n'+L('mail')+f.email.value+'\n\n'+f.msg.value;
  location.href='mailto:manuespiuca.dev@gmail.com?subject='+encodeURIComponent(L('subject'))+'&body='+encodeURIComponent(corpo);
});


// detalhes abrem para baixo
document.querySelectorAll('.proj .solid').forEach(function(b){b.addEventListener('click',function(){
  var c=b.closest('.proj'),o=c.classList.toggle('open');
  b.setAttribute('aria-expanded',o);b.textContent=o?L('hide'):L('details');});});

// páginas dos projetos: 3 por página
(function(){var t=document.getElementById('track'),nav=document.getElementById('pdots'),
prev=document.getElementById('prev'),next=document.getElementById('next'),
cards=[].slice.call(t.children),per=3,pages=Math.ceil(cards.length/per),cur=0,btns=[];
if(pages<2){document.querySelector('.pager').hidden=true;return;}
for(var i=0;i<pages;i++){(function(i){var d=document.createElement('button');d.type='button';
  d.setAttribute('aria-label',L('page')+(i+1));
  d.addEventListener('click',function(){show(i);});nav.appendChild(d);btns.push(d);})(i);}
function show(p){cur=p;
  cards.forEach(function(c,i){var on=Math.floor(i/per)===p;c.hidden=!on;
    if(!on){c.classList.remove('open');var b=c.querySelector('.solid');if(b){b.setAttribute('aria-expanded','false');b.textContent=L('details');}}});
  btns.forEach(function(d,i){d.className=i===p?'on':'';if(i===p)d.setAttribute('aria-current','page');else d.removeAttribute('aria-current');});
  prev.disabled=p===0;next.disabled=p===pages-1;}
prev.addEventListener('click',function(){if(cur>0)show(cur-1);});
next.addEventListener('click',function(){if(cur<pages-1)show(cur+1);});
langHooks.push(function(){btns.forEach(function(d,i){d.setAttribute('aria-label',L('page')+(i+1));});});
show(0);})();

// certificações: filtro por área + "ver todas"
(function(){var LIM=5,items=[].slice.call(document.querySelectorAll('#certs li')),
fb=document.getElementById('cfilters'),tg=document.getElementById('cert-toggle'),
area='Todas',open=false,areas=['Todas'];
items.forEach(function(li){var a=li.dataset.area;if(areas.indexOf(a)<0)areas.push(a);});
function n(a){return a==='Todas'?items.length:items.filter(function(li){return li.dataset.area===a;}).length;}
function buildFilters(){if(areas.length>2){fb.innerHTML=areas.map(function(a){return '<button class="cf" type="button" data-a="'+a+'" aria-pressed="'+(a===area)+'">'+areaName(a)+' <b>'+n(a)+'</b></button>';}).join('');}
else fb.hidden=true;}
buildFilters();
function render(){var k=0;items.forEach(function(li){var ok=area==='Todas'||li.dataset.area===area;
 if(ok){li.hidden=!open&&k>=LIM;k++;}else li.hidden=true;});
 var tot=n(area);tg.hidden=tot<=LIM;tg.setAttribute('aria-expanded',open);
 tg.textContent=open?L('seeLess'):L('seeAll')+' ('+tot+')';
 items.forEach(function(li){var ar=li.querySelector('.org i');if(ar)ar.textContent=areaName(li.dataset.area);});
 [].forEach.call(fb.children,function(b){b.setAttribute('aria-pressed',b.dataset.a===area);});}
fb.addEventListener('click',function(e){var b=e.target.closest('.cf');if(!b)return;area=b.dataset.a;open=false;render();});
tg.addEventListener('click',function(){open=!open;render();});
langHooks.push(function(){buildFilters();render();});
render();})();

// estrelas arrastáveis
(function(){var sky=document.getElementById('sky');if(!sky)return;
var P={
 star:'<path d="M24.4 5 L29.2 18 L43 19.2 L31.6 27.8 L35.4 41.4 L24 33.2 L12.4 40.8 L16.3 27.4 L5.2 18.6 L19.3 18.4 Z"/>',
 sparkle:'<path d="M24 4C25 17 31 23 44 24C31 25 25 31 24 44C23 31 17 25 4 24C17 23 23 17 24 4Z"/>',
 diamond:'<path d="M24 4L32 24L24 44L16 24Z"/>',
 plus:'<path d="M24 7V41M7 24H41"/>',
 kite:'<path d="M9 7L41 24L9 41L17 24Z"/>',
 moon:'<path d="M32 6C20 8 12 16 12 26C12 37 21 44 32 42C23 38 20 30 22 22C24 15 28 9 32 6Z"/>'};
var HINT='<span class="hint"><svg viewBox="0 0 44 30"><path d="M40 5C28 4 16 9 6 19M6 19L13.7 17M6 19L8 11.3"/></svg><span data-i18n="hint">me arraste!</span></span>';
// [forma, posição horizontal em %, posição vertical (px; ou fração da altura da página se <= 1), tamanho, dica?]
var S=[['star',83,600,46,1],['sparkle',90,230,30],['diamond',8,340,22],['kite',28,82,28],['plus',30,720,24],
 ['moon',88,900,32],['sparkle',14,.30,28],['star',60,.38,34],['diamond',92,.46,20],['plus',20,.55,22],
 ['kite',80,.64,26],['sparkle',45,.72,30,0,'cert'],['moon',10,.80,30],['star',86,.88,38],['diamond',35,.95,22]];
var els=[],drag=null,lx=0,ly=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function layout(){var W=sky.clientWidth,H=sky.clientHeight;
 els.forEach(function(el){var w=el.offsetWidth,h=el.offsetHeight;if(!w)return;
  if(el._anchor&&!el._moved){var ch=document.querySelector('#certificacoes .cert-head'),cw=document.querySelector('#certificacoes .cwin');
   if(ch&&cw){var y=0,n=ch;while(n){y+=n.offsetTop;n=n.offsetParent;}el._py=y-6;
    el._fx=Math.max(0,Math.min(1,(cw.getBoundingClientRect().right-w-8)/Math.max(1,W-w)));}}
  el._py=clamp(el._py,0,Math.max(0,H-h));
  el.style.left=(el._fx*Math.max(0,W-w))+'px';el.style.top=el._py+'px';});}
function follow(){var r=sky.getBoundingClientRect(),el=drag.el;
 el.style.left=clamp(lx-r.left-drag.ox,0,Math.max(0,r.width-el.offsetWidth))+'px';
 el.style.top=clamp(ly-r.top-drag.oy,0,Math.max(0,r.height-el.offsetHeight))+'px';}
function end(e){if(!drag||e.pointerId!==drag.id)return;var el=drag.el,free=sky.clientWidth-el.offsetWidth;
 el.classList.remove('drag');el._fx=free>0?el.offsetLeft/free:0;el._py=el.offsetTop;drag=null;}
function build(){var H=sky.clientHeight;
 S.forEach(function(c,i){var el=document.createElement('div');
  el.className='sp'+(i>5?' extra':'');el.style.width=(c[3]+20)+'px';
  el.innerHTML='<svg viewBox="0 0 48 48">'+P[c[0]]+'</svg>'+(c[4]?HINT:'');
  el._fx=c[1]/100;el._py=c[2]>1?c[2]:c[2]*H;el._anchor=c[5]||null;
  if(c[4]&&matchMedia('(max-width:760px)').matches){el._fx=.8;el._py=92;}
  el.addEventListener('pointerdown',function(e){if(e.button>0)return;e.preventDefault();
   var r=sky.getBoundingClientRect();
   el._moved=true;drag={el:el,id:e.pointerId,ox:e.clientX-r.left-el.offsetLeft,oy:e.clientY-r.top-el.offsetTop};
   lx=e.clientX;ly=e.clientY;el.classList.add('drag');sky.classList.add('touched');
   try{el.setPointerCapture(e.pointerId);}catch(x){}});
  el.addEventListener('pointermove',function(e){if(!drag||e.pointerId!==drag.id)return;lx=e.clientX;ly=e.clientY;follow();});
  el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  sky.appendChild(el);els.push(el);});
 applyStatic();layout();}
window.addEventListener('scroll',function(){if(drag)follow();},{passive:true});
if(window.ResizeObserver)new ResizeObserver(layout).observe(sky);else window.addEventListener('resize',layout);
if(document.readyState==='complete')build();else window.addEventListener('load',build);})();
var startLang='pt';try{var sl=localStorage.getItem('lang');if(sl==='en'||sl==='pt')startLang=sl;}catch(e){}
applyLang(startLang,true);
