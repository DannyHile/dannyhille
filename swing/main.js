const ctx = canvas.getContext("2d");
ctx.fillStyle='#050505';
ctx.fillRect(0,0,w=1920,h=1080);
canvas.onclick=e=>canvas.requestFullscreen();
const {sin,cos} = Math;
ctx.fc=(r=0,g=0,b=0,a=1)=>ctx.fillStyle=`rgb(${r},${g},${b},${a})`;


!(function animate(t=0){
    t*=.001;
    canvas.width=w;
    ctx.fillStyle="#222";
    ctx.fillRect(sin(-t)*100+w/2,cos(-t)*100+h/2,50,50);
    ctx.fc(255,255,255);
    ctx.font='50px sans-serif'
    ctx.fillText(`${mouse[0]|0},${mouse[1]|0}`,10,50);
    ctx.fillText(`${JSON.stringify(keys)}`,10,100);
    requestAnimationFrame(animate);    
})();