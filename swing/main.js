const ctx = canvas.getContext("2d");
ctx.fillStyle='#050505';
ctx.fillRect(0,0,w=1920,h=1080);
canvas.onclick=e=>canvas.requestFullscreen();
const {sin,cos} = Math;

!(function animate(t=0){
    t*=.001;
    canvas.width=w;
    ctx.fillStyle="#fff";
    ctx.fillRect(sin(-t)*100+w/2,cos(-t)*100+h/2,50,50);
    requestAnimationFrame(animate);    
})();