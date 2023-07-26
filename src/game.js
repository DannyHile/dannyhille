console.log('game');
import svg from './svg.js';
import sounds from "./sounds.js"
import {ZZFX,zzfx} from "./zzfx.js"
import Spark from "./spark.js"
const gameCtx = gameCanvas.getContext("2d");
let width,height;
const mouse={x:0,y:0,lb:0};
const keys={};
onmouseup=onmousedown=onmousemove=e=>[mouse.x, mouse.y, mouse.lb]=[e.x, e.y, e.buttons===1?1:0];
onkeydown=onkeyup=e=>{
    keys[e.key]=e.type==='keydown'?1:0;
    if(e.type==='keydown')
        switch(e.key){
            case"q":zzfx(...sounds.s1);break;
            case"w":zzfx(...sounds.s2);break;
            case"e":zzfx(...sounds.s3);break;
            case"r":zzfx(...sounds.s4);break;
            case"t":zzfx(...sounds.s5);break;
            case"y":zzfx(...sounds.s6);break;
        }
}

const sparks = [];

function gameLoop(t=0){
    gameCanvas.width = width = innerWidth;
    gameCanvas.height = height = innerHeight;
    gameCtx.fillStyle='white';
    gameCtx.fillText(JSON.stringify(mouse),0,10);
    gameCtx.fillText(JSON.stringify(keys),0,20);
    gameCtx.save();
    gameCtx.translate(mouse.x,mouse.y);
    // if(mouse.lb)
    //     gameCtx.scale(2,2);
    // gameCtx.fill(svg.star);
    gameCtx.restore();
    for(let i=sparks.length-1; i>=0; i--){
        const spark=sparks[i];
        spark.update();
        if(!spark.markedForDeletion)
            spark.draw(gameCtx);
        else
            sparks.splice(i,1);
    }

    if(mouse.lb)
        sparks.push(new Spark(mouse.x,mouse.y));

    requestAnimationFrame(gameLoop);
}

gameLoop();