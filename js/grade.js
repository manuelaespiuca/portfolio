/* grade que some conforme o mouse passa e volta aos poucos */
(function(){
var st=document.querySelector('.pf-stage');if(!st||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var cv=document.createElement('canvas');cv.className='pf-grid';cv.setAttribute('aria-hidden','true');st.insertBefore(cv,st.firstChild);
var ctx=cv.getContext('2d'),g=document.createElement('canvas'),gx=g.getContext('2d'),e=document.createElement('canvas'),ex=e.getContext('2d'),
    D=1,W=0,H=0,STEP=34,R=95,last=null,run=false,until=0;
function size(){var r=cv.getBoundingClientRect();if(!r.width)return;D=Math.min(2,window.devicePixelRatio||1);
  W=Math.round(r.width*D);H=Math.round(r.height*D);cv.width=g.width=e.width=W;cv.height=g.height=e.height=H;
  gx.clearRect(0,0,W,H);gx.strokeStyle='rgba(238,241,248,.07)';gx.lineWidth=D;gx.beginPath();
  for(var x=0;x<=W;x+=STEP*D){gx.moveTo(Math.round(x)+.5,0);gx.lineTo(Math.round(x)+.5,H);}
  for(var y=0;y<=H;y+=STEP*D){gx.moveTo(0,Math.round(y)+.5);gx.lineTo(W,Math.round(y)+.5);}
  gx.stroke();render();}
function render(){ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);ctx.drawImage(g,0,0);
  ctx.globalCompositeOperation='destination-out';ctx.drawImage(e,0,0);}
function blob(x,y){var r=R*D,gr=ex.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');ex.fillStyle=gr;ex.fillRect(x-r,y-r,r*2,r*2);}
function tick(){ex.globalCompositeOperation='destination-out';ex.fillStyle='rgba(0,0,0,.025)';ex.fillRect(0,0,W,H);ex.globalCompositeOperation='source-over';
  render();if(performance.now()<until)requestAnimationFrame(tick);else{run=false;ex.clearRect(0,0,W,H);render();}}
function kick(){until=performance.now()+3500;if(!run){run=true;requestAnimationFrame(tick);}}
st.addEventListener('pointermove',function(ev){var r=cv.getBoundingClientRect();if(!W)size();
  var x=(ev.clientX-r.left)*D,y=(ev.clientY-r.top)*D;
  if(last){var dx=x-last.x,dy=y-last.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/(R*D*.3)));
    for(var i=1;i<=n;i++)blob(last.x+dx*i/n,last.y+dy*i/n);}else blob(x,y);
  last={x:x,y:y};kick();});
st.addEventListener('pointerleave',function(){last=null;});
st.classList.add('gc');size();
if(window.ResizeObserver)new ResizeObserver(size).observe(st);else addEventListener('resize',size);
addEventListener('load',size);
})();
