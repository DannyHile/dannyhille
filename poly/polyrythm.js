import Track from './track.js';


const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const w = (canvas.width = 384);
const h = (canvas.height = 800);
document.body.appendChild(canvas);
const tracks = [];
const N = 16;
for (let i = 0; i < N; i++) {
    const track = new Track(
        {x: w/2, y: h/2}, 
        Math.min(w, h)*(.475-.03*i),
        .015+.001*i,
        290+(360/N)*i
        );
    tracks.push(track);
}




!(function animate(t){
    ctx.clearRect(0, 0, w, h);
    tracks.forEach((track, idx) => {
        track.update();
        track.draw(ctx);
    });
    requestAnimationFrame(animate);
})();