/* HUD: chamada de detalhe das asas (recorte ampliado da própria foto, ligado por uma linha) */
(function(){
var fr=document.querySelector('.hero .frame');if(!fr)return;
var ov=fr.parentNode.querySelector('.wout');if(!ov)return;
var img=fr.querySelector('img'),wd=ov.querySelector('.wd'),cv=wd&&wd.querySelector('canvas'),
    mk=ov.querySelector('.wm.a'),ln=ov.querySelector('.wl line');
if(!img||!cv||!mk||!ln)return;
/* coordenadas na foto original (736x946): ponto nas asas e recorte ampliado ao redor */
var PX=580,PY=520,CX=490,CY=450,CW=200,CH=135;
function draw(){
  if(!img.naturalWidth)return;
  var f=fr.getBoundingClientRect();if(!f.width)return;
  var o=ln.ownerSVGElement.parentNode.getBoundingClientRect(),dx0=f.left-o.left,dy0=f.top-o.top;
  var s=Math.max(f.width/img.naturalWidth,f.height/img.naturalHeight),
      op=(getComputedStyle(img).objectPosition||'50% 50%').split(' '),
      ox=(f.width-img.naturalWidth*s)*(parseFloat(op[0])||50)/100,
      oy=(f.height-img.naturalHeight*s)*(parseFloat(op[1])||50)/100,
      ax=dx0+ox+PX*s,ay=dy0+oy+PY*s;
  mk.style.left=ax+'px';mk.style.top=ay+'px';
  var r=wd.getBoundingClientRect(),side=(r.left-o.left)>ax+24;wd.classList.toggle('side',side);
      var bx=side?r.left-o.left:r.left+r.width/2-o.left,by=side?r.top+r.height/2-o.top:r.bottom-o.top,
      dx=bx-ax,dy=by-ay,d=Math.hypot(dx,dy)||1,k=6/d;
  ln.setAttribute('x1',ax+dx*k);ln.setAttribute('y1',ay+dy*k);
  ln.setAttribute('x2',bx-dx*k);ln.setAttribute('y2',by-dy*k);
  var dpr=Math.min(2,window.devicePixelRatio||1),w=Math.round(cv.clientWidth*dpr),h=Math.round(cv.clientHeight*dpr);
  if(!w||!h)return;
  cv.width=w;cv.height=h;
  try{cv.getContext('2d').drawImage(img,CX,CY,CW,CH,0,0,w,h)}catch(e){}
}
if(img.complete)draw();else img.addEventListener('load',draw);
window.addEventListener('load',draw);window.addEventListener('resize',draw);
if(window.ResizeObserver)new ResizeObserver(draw).observe(fr);
})();
