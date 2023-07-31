'use strict'
const s6=[2.05,0,66.41,,.06,.47,1,1.01,.1,,,,.01,.1,,.2,.1,.33,.1,.01];
const s5=[,,7,,,.25,1,.75,,,-535,.02,,,,,,,.12,.93];
const s4=[,,657,,.15,0,1,.35,,65,-938,.17,.09,,2.9,,,,.08];
const s3=[,,106,,.04,.08,,1.33,-0.6,3.1,,,,,,,,.79,.05];
const s2=[1.99,,290,.04,.01,.04,1,1.59,-5,,-303,.01,,,,,.19];
const s1=[1.19,,14,,,.07,,.6,59,,,,,,-186,,,.81,.01];
const mouse={x:0,y:0,lb:0};
let w = c.width=window.innerWidth;
let h = c.height=window.innerHeight;
const ctx = c.getContext('2d');
const bw = 10;
const bh = 9;
const tz = 60;
const htz = tz/2;
let off=[w/2-(bw*tz)/2,90];
const PIH = Math.PI/2, PI=Math.PI;
//zzfx=()=>{};

zzfx(...s4);


onmousedown=onmouseup=onmousemove=e=>{
	mouse.x=e.x;
  mouse.y=e.y;
	mouse.lb=e.buttons===1?1:0;
};

  

const board = Array(bw*bh).fill().map((a,i)=>{
	const x=i%bw;
	const y=i/bw|0;
	return{
			x,y,
			id:i,
			tile:Math.random()*4|0,
			rect:[x*tz+off[0],y*tz+off[1], tz,tz]};
	}); 

const inRect=(x,y,x1,y1,w,h)=>x>x1&&x<x1+w&&y>y1&&y<y1+h;
const isAdjacent=(a,b)=>(Math.abs(a.x-b.x)<2 && Math.abs(a.y-b.y)<2);



let lastId=-1;
let selArr=[];
let animStack=[];
let lastDrawTime = 0;

class Particle{
  pos = {x:0,y:0};
  target = {x:0,y:0};
  vel = {x:0,y:1};
  speed=300;
  maxSpeed=100;
  markedForDeletion=0;
  lastT=0;
  delta=0;
  tile=0;  
  constructor(x=0,y=0,tile=0,tx=0,ty=0){
    this.pos={x,y};
    this.target={x:tx,y:ty};
    this.tile=tile;
  }
  update(time){
    let delta=time-this.lastT;
    this.pos.x+=this.vel.x*this.speed;
    this.pos.y+=this.vel.y*this.speed*.1;
    if(this.pos.x<0||this.pos.x>w||this.pos.y<0||this.pos.y>h)
      this.markedForDeletion=1;
    this.lastT=time;
  }
  draw(ctx){
    ctx.drawImage(gems,this.tile*32,0,32,32,this.pos.x-htz+3,this.pos.y-htz+3,tz-6,tz-6);
  }
}
const particles=[];
const pacTrail =[];



function tileDrop(idx){
  window.idx=idx;
  if(board[idx]?.tile!=-1)return 0;
  if(idx-bw<0&&idx>=0)
    return board[idx].tile=Math.random()*4|0;
  if(board[idx-bw]?.tile==-1)return 2;
  board[idx].tile = board[idx-bw].tile;
  board[idx-bw].tile=-1; 
}


(function gameLoop(t){
  const time=t/1000;
   	w = c.width=window.innerWidth;
 	h = c.height=window.innerHeight;
 //off=[w/2-(bw*tz)/2,90];
  const diff = t-lastDrawTime;
  if(diff>30){
    lastDrawTime = t;
    if(pacTrail.length>0){
      let pacPixel = pacTrail.pop();
      drawpac(pacPixel[0], pacPixel[1], ctx, t, pacPixel[2]);
    }
    else if(animStack.length>0){
      const l = animStack.shift();
      particles.push(new Particle(l.x*tz+off[0]+htz,l.y*tz+off[1]+htz,l.tile));
      board[l.id].tile=-1;
      zzfx(...s3);
    }
    else if(particles.length<1)
      for(let i=board.length-1;i>=0;i--){
        if(board[i].tile===-1)
          tileDrop(i);
    }
  }
  c.width+=0;
  //background();
  //clouds(time);
  //monster(time);
  //grass(time);
  //teradactyle(time);
  //pacRotate(time);

	board.forEach((a,i)=>{
    //Handle mouse input
		if(animStack.length===0&&inRect(mouse.x,mouse.y, a.rect[0]+4,a.rect[1]+4,tz-8,tz-8)){
			if(mouse.lb==1 && a.id!==lastId){
        if(selArr.length===0)//First in chain
          selArr=[a];
        else if(selArr.length>1&&selArr.at(-2).id===a.id){
          //Remove last from chain
          selArr.pop();
          zzfx(...s6);
          lastId=null;
        }
        else if(selArr.at(-1).tile===a.tile
              && !selArr.find(o=>o.id===a.id)
              && isAdjacent(selArr.at(-1),a)){
          //Add to Chain
					selArr.push(a); 
          zzfx(...s2);
        }
        lastId=a.id;
			}
			else if(mouse.lb==0&&selArr.length>0){
        // mouse released and selectes
        if(selArr.length>2){
          selArr.forEach((p,i)=>{
            animStack.push(p);
          });
        }
        selArr.length=0;
        lastId=null;
			}
		}
    paintTile(time, a, i);
	});

  drawTileDrop(time);
  drawSelectionLine(time);

	requestAnimationFrame(gameLoop);
})(0);

function drawTileDrop(time){
   particles.forEach(p=>{p.update(time);p.draw(ctx)});
  for(let i=particles.length-1;i>=0;i--){
    if(particles[i].markedForDeletion)
      particles.splice(i,1)
  }

}

function drawpac(x,y,ctx,t,ang=0){

  ctx.save();
  ctx.beginPath();
  ctx.lineJoin = "round";
  ctx.lineCap='round'

  const m = Math.abs(Math.sin(t/100));
  ctx.moveTo(x,y);
  ctx.lineWidth=9;
  ctx.arc(x, y, 30, m+ang, 2 * Math.PI-m+ang);
  ctx.closePath()  
  ctx.stroke();
  ctx.fillStyle="yellow";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.restore();
}

function clouds(t){
  for(let i=9;i--;){
    ctx.save();
    ctx.fillStyle="#fff3";
    ctx.translate((-t/(9+i/13)+1000*i)*(90+i*9)%(w*2)-200,30+i*40);
    ctx.scale(1.2,.6+(i/20));
    ctx.fill(svgs[4]);
    ctx.restore();
  }
}

function grass(time){
  //paint some grass    
  const cnt = (w/60|0)+1;
  for(let i=cnt;i--;){
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 9;
    ctx.shadowColor = "#09f";

    ctx.translate(60*i,h+10+Math.sin(time+i)*5);
    ctx.scale(1+Math.cos(time*2+i)/8,1+Math.sin(time+i)/9);
    ctx.rotate(Math.sin(time+i)/9);
    ctx.fillStyle=`rgb(10,${100+Math.sin(time*2+i/2)*30},29)`;
    ctx.fill(svgs[0]);
    ctx.restore();
  }
}

function background(){
  const grd = ctx.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, "black");
  grd.addColorStop(1, "#0077aa");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
}

function monster(time){
  ctx.save()
  ctx.fillStyle="#02050944";
  ctx.translate(w/2-Math.sin(time/4)*(w/2+150),h-Math.abs(Math.sin(time*4))*20+70);
  const dir = Math.sign(Math.sin(time/4+Math.PI/2));
  ctx.scale(dir*.3+Math.sin(time*5)/199,.3+Math.sin(time*4)/199);
  ctx.fill(svgs[3]);
  ctx.restore();
}


function drawSelectionLine(time,spaghetti=1){
  //Write selection trail
  if(selArr.length>0){
    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap='round'
    ctx.globalAlpha = .9;
    ctx.lineWidth = tz/4;
    ctx.shadowBlur = htz;
    ctx.shadowColor = "#09f";
    ctx.strokeStyle="#fff";
    ctx.beginPath();

    // Straight path
    if(!spaghetti){
    selArr.forEach((s,i)=>ctx.lineTo(s.x*tz+off[0]+htz+Math.sin(time*8+i)*2,s.y*tz+off[1]+htz+Math.cos(time*9+i)*2));
    ctx.lineTo(mouse.x,mouse.y);
    ctx.stroke();
    }
    
  else{
    //Wobblery spaghetti path
    //ctx.lineDashOffset=(time*-190);
    //ctx.setLineDash([tz,htz]);
    ctx.moveTo(selArr[0].x*tz+off[0]+htz, selArr[0].y*tz+off[1]+htz);
    var i=0;
    if(selArr.length==1){
    }
    else{
      for (i=1; i < selArr.length - 1; i ++){
        let xc = (selArr[i].x*tz+off[0]+htz + selArr[i + 1].x*tz+off[0]+htz) / 2;
        let yc = (selArr[i].y*tz+off[1]+htz + selArr[i + 1].y*tz+off[1]+htz) / 2;
        xc+=Math.sin(time*9+i)*2
        yc+=Math.cos(time*8+i)*2
        ctx.quadraticCurveTo(selArr[i].x*tz+off[0]+htz, selArr[i].y*tz+off[1]+htz, xc, yc);
      }
    }
ctx.quadraticCurveTo( selArr[i].x*tz+off[0]+20, 
                      selArr[i].y*tz+off[1]+20,
                      mouse.x,
                      mouse.y 
                      );
      ctx.stroke();
      
    }
  }
  ctx.restore();
}

function teradactyle(time){
  ctx.save();
  ctx.translate(w/2-time*60%w*2+w,h*.6+Math.sin(time)*30);
  ctx.scale(.2,.2);
  ctx.fillStyle='#0006';
  ctx.fill(svgs[5]);
  ctx.restore();
}

function paintTile(time, cTile, tileIndex){
    ctx.save();
    if(selArr.find(o=>o.id==cTile.id)){
      ctx.translate(cTile.x*tz+off[0]+htz,cTile.y*tz+off[1]+htz);
      const c = Math.sin(time*9+tileIndex/6);
      ctx.rotate(c/htz);
      ctx.drawImage(gems,cTile.tile*32,0,32,32,-(htz-htz/5)-c/2,-(htz-htz/5)-c/2,tz-tz/5+c,tz-tz/5+c)
    }
    else{
		  ctx.drawImage(gems,cTile.tile*32,0,32,32,cTile.x*tz+off[0]+3,cTile.y*tz+off[1]+3,tz-6,tz-6)
    }
    ctx.restore();
}



function linePoints(x1, y1, x2, y2) {
	let ret = [], u, s, v, d1x, d1y, d2x, d2y, n, m, ang;
	u = x2 - x1;
	v = y2 - y1;
  ang = Math.atan2(v,u);
	d1x = Math.sign(u);
	d1y = Math.sign(v);
	d2x = Math.sign(u);
	d2y = 0;
	m = Math.abs(u);
	n = Math.abs(v);
	if (m <= n) {
		d2x = 0;
		d2y = Math.sign(v);
		m = Math.abs(v);
		n = Math.abs(u);
	}
	s = (m / 2) | 0;
	for (let i = 0; i < m; i++) {
		ret.push([x1,y1,ang]);
		s += n | 0;
		if (s >= m) {
			s -= m | 0;
			x1 += d1x | 0;
			y1 += d1y | 0;
		} else {
			x1 += d2x | 0;
			y1 += d2y | 0;
		}
	}
	return ret;
}

function pacRotate(time){
  const tic =(time/4)%4|0;
  drawpac([w/2-300+time*150%600,
      w/2+300,
      w/2+300-time*150%600,
      w/2-300][tic],
    [ 50,
      50+time*100%400,
      450,
      450-time*100%400][tic]
      ,ctx,time*1000,[0,PIH,PI,PIH*3][tic])
}



