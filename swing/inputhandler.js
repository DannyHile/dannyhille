window.mouse??=[0,0,0];
window.keys??={};
onpointermove = e=>{
    window.mouse[0]=e.x;
    window.mouse[1]=e.y;
}
onpointerdown=e=>window.mouse[2]=1;
onpointerup=e=>window.mouse[2]=0;
onkeydown=e=>keys[e.code]=1;
onkeyup=e=>keys[e.code]=0;