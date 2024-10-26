window.mouse??=[0,0,0];
window.keys??={};
const clamp = (n, low, high) => Math.max(Math.min(n, high), low);

onpointerdown=e=>window.mouse[2]=1;
onpointerup=e=>window.mouse[2]=0;
onkeydown=e=>keys[e.code]=1;
onkeyup=e=>keys[e.code]=0;

onpointermove=e=>{
    const cor = canvas.getBoundingClientRect();
    const scaleX = cor.width/w;
    const scaleY = cor.height/h;
    mouse[0] = clamp((e.x-cor.x)/scaleX,0,canvas.width);
    mouse[1] = clamp((e.y-cor.y)/scaleY,0,canvas.height);
  };