const ctx = canvas.getContext("2d");
ctx.fillStyle='#050505';
ctx.fillRect(0,0,w=1920,h=1080);
canvas.onclick=e=>canvas.requestFullscreen();