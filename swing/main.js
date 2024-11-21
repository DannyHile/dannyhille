const ctx = canvas.getContext("2d");
ctx.fillStyle='#050505';
let w=innerWidth,h=innerHeight;
const {sin,cos,PI,random} = Math, PIh = PI/2, TAU=PI*2;

const s={
    boardWidth:20,
    boardHeight:12,
    board:[],
    offset:[20,20],
    tileSz:80,
};
s.board = new Array(s.boardWidth*s.boardHeight).fill(0);

function isPointInRect(x,y,rect){
    return x>=rect[0]&&x<rect[0]+rect[2]&&y>=rect[1]&&y<rect[1]+rect[3];
}
let rectTmp=[300,300,50,Math.PI/2];
function drawBoard(ctx){
    ctx.fillStyle="#222";
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#000";
    ctx.strokeStyle="#333";
    let x,y,tileRect;
    for(let i=0;i<s.board.length;i++){
        x = i%s.boardWidth;
        y = Math.floor(i/s.boardWidth);
        tileRect = [x*s.tileSz+s.offset[0],y*s.tileSz+s.offset[1],s.tileSz,s.tileSz];
        ctx.fillStyle=isPointInRect(mouse[0],mouse[1],tileRect )?"#444":"#000"; 
        ctx.fillRect(...tileRect);
        ctx.strokeRect(...tileRect);
    }
    if(rectTmp[3]>0){
        ctx.fillStyle="#000";
        ctx.strokeStyle="#fff";
        rectTmp[3]-=0.1;
        dr(ctx,...rectTmp);
        ctx.fillStyle="#fff";
    }else{
        if(mouse[2]){
            rectTmp=[mouse[0],mouse[1],50,Math.PI*2];
        }
    }
}
function dr(ctx,x,y,w,a){
    const qadc = PI/2;
    ctx.save();
    ctx.lineWidth=w/20;
    ctx.translate(x,y);
    ctx.rotate(a);
    ctx.fillRect(-w/2,-w/2,w,w);
    ctx.beginPath();
    ctx.arc(w/2,w/2,w/2,-qadc*2,-qadc);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-w/2,-w/2,w/2,0,-qadc*3);
    ctx.stroke();
    //ctx.strokeRect(-w/2,-w/2,w,w);
    ctx.restore();
}
//canvas.onclick=e=>canvas.requestFullscreen();

function drawMouse(ctx){
    ctx.fillStyle="#fff";
    ctx.beginPath();
    const [x,y] = [window.mouse[0],window.mouse[1]];
    ctx.arc(x,y,mouse[2]?20:10,0,2*Math.PI);
    ctx.fill();
}

ctx.fc=(r=0,g=0,b=0,a=1)=>ctx.fillStyle=`rgb(${r},${g},${b},${a})`;

const tiles = Array(s.boardWidth*s.boardHeight).fill().map((a,i)=>[(i%s.boardWidth)*s.tileSz+s.tileSz/2,(i/s.boardWidth|0)*s.tileSz+s.tileSz/2,s.tileSz,PIh*(random()*4|0)]);

const nthFrame=5;
let frame = 0;
!(function animate(t=0){
    t*=.001;
    [canvas.width,canvas.height]=[w=innerWidth,h=innerHeight];
    s.offset[0] = (w-s.boardWidth*s.tileSz)/2;
    //drawBoard(ctx);
    ctx.fillStyle="#000";
    ctx.strokeStyle="#fff";

    tiles.forEach(t=>dr(ctx,...t));
    drawMouse(ctx);
    if(frame++>nthFrame){
        frame=0;
        tiles[random()*tiles.length|0][3]+=PIh*(random()*2|0);
    };
    ctx.fillStyle="#fff";
    ctx.fillText(frame,10,10);
    requestAnimationFrame(animate);    
})();

console.log('bluetooth' in Navigator);