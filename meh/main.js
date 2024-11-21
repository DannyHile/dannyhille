const canvas = document.createElement("canvas");
const glCanvas = document.createElement("canvas");
const w = (canvas.width = 384);
const h = (canvas.height = 800);
const remap = (n, srcMin, srcMax, dstMin, dstMax) =>
	((n - srcMin) / (srcMax - srcMin)) * (dstMax - dstMin) + dstMin;
glCanvas.width = w;
glCanvas.height = h;
const ctx3d = getContext3d(glCanvas, fragmentShader.innerText);
const ctx = canvas.getContext("2d");
let shader = 0;
ctx3d.setInt("viz", shader);
document.body.prepend(canvas);

onkeydown = (e) => {
	switch (e.code) {
		case "KeyF":
			document.fullscreenElement
				? document.exitFullscreen()
				: document.body.requestFullscreen();
			break;
		case "KeyV":
			ctx3d.setInt("wiz", ++shader);
			break;
		case "KeyM":
			playing ? loopAudio.pause() : loopAudio.play();
			break;
	}
};


const mouse = [0,0,0];
canvas.onpointermove=
canvas.ontouchmove=e=>{
    e.preventDefault();
    const crect = canvas.getBoundingClientRect();
    const scaleX = crect.width/w;
    const scaleY = crect.height/h;
    const {pageX, pageY} = (e.touches && e.touches[0]) || e;
    mouse[0] = (pageX-crect.x)/scaleX;
	mouse[1] = (pageY-crect.y)/scaleY;
};
canvas.onpointerup=
canvas.ontouchend=e=>mouse[2]=0;
canvas.onpointerdown=
canvas.ontouchstart=e=>{
    e.preventDefault();
    mouse[2]=1;
    const crect = canvas.getBoundingClientRect();
    const scaleX = crect.width/w;
    const scaleY = crect.height/h;
    const {pageX, pageY} = (e.touches && e.touches[0]) || e;
    mouse[0] = (pageX-crect.x)/scaleX;
	mouse[1] = (pageY-crect.y)/scaleY;    
};
oncontextmenu=e=>console.log('prevent context-'+e.preventDefault());
let audioCtx;
let analyser;
let playing = false;

loopAudio.onpause = (e) => (playing = false);
loopAudio.onplay = (e) => {
	playing = true;
	if (!!analyser) return;
	audioCtx = new AudioContext();
	analyser = audioCtx.createAnalyser();
	analyser.connect(audioCtx.destination);
	audioCtx.createMediaElementSource(loopAudio).connect(analyser);
};

const freqArray = new Uint8Array(1024);

ctx.textAlign = "center";
!(function animate(t = 0) {
	if (!!analyser) analyser.getByteFrequencyData(freqArray);
	ctx3d.setUniform3F("frq", [
		freqArray[4] / 255,
		freqArray[404] / 255,
		freqArray[800] / 255
	]);
    ctx3d.setUniform3F("mouse", [mouse[0]/w,mouse[1]/h,mouse[2]]);
	ctx3d.update();
	ctx.drawImage(glCanvas, 0, 0, w, h);
	ctx.font = "100px Rubik";
	ctx.fillStyle = "#fff7";
	ctx.fillText(new Date().toLocaleTimeString().substring(0, 5), w / 2, h - 30);
	ctx.save();
	ctx.translate(w - 25, 10);
	ctx.scale(0.03, 0.03);
	ctx.fill(
		new Path2D(
			"M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"
		)
	);
	ctx.restore();
	if (!playing) {
		let line = 70;
		ctx.font = "46px Rubik";
		ctx.fillText("Seizure warning!", w / 2, (line += 40));
		ctx.font = "26px Rubik";
		ctx.fillText("Press 'm' to toggle music", w / 2, (line += 40));
		ctx.fillText("Press 'f' to toggle fullscreen", w / 2, (line += 40));
		ctx.fillText("Press 'v' to change visualizer", w / 2, (line += 40));
	}
	for (let i = 0; i < w; i += 8) {
		ctx.fillStyle = "#fff6";
		ctx.fillRect(i, h / 2, 7, -freqArray[i]);
		ctx.fillStyle = "#fff2";
		ctx.fillRect(i, h / 2, 7, freqArray[i]);
	}
    ctx.beginPath();
    ctx.fillStyle="#fff";
    ctx.arc(mouse[0],mouse[1],mouse[2]?20:10,0,Math.PI*2);
    ctx.fill();   
    //if(mouse[2])mouse[2]=0;
    requestAnimationFrame(animate);
})();
