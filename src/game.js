console.log('game');
import svg from './svg.js';
import sounds from "./sounds.js"
import {ZZFX,zzfx} from "./zzfx.js"
import Spark from "./spark.js"
const gameCtx = gameCanvas.getContext("2d");
let width,height;
let renderFunc = ()=>{};
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
            case"u":zzfx(...sounds.spark);break;
            case"i":zzfx(...sounds.spark2);break;
            case"o":zzfx(...sounds.spark3);break;
            case"p":zzfx(...sounds.tweet);break;
            case"å":zzfx(...sounds.s7);break;
            case" ":zzfx(...sounds.spark3);for(let i=0; i<9; i++)sparks.push(new Spark(mouse.x,mouse.y));break;
        }
}

const sparks = [];

function gameLoop(t=0){    
    gameCanvas.width = width = innerWidth;
    gameCanvas.height = height = innerHeight;
    renderFunc(t/1000);
    requestAnimationFrame(gameLoop);
}
gameLoop();


renderFunc = (time)=>{
    gameCtx.fillStyle='white';
    gameCtx.fillText(JSON.stringify(mouse),0,10);
    gameCtx.fillText(JSON.stringify(keys),0,20);
    gameCtx.fillText(sparks.length,0,30);
    for(let i=sparks.length-1; i>=0; i--){
        const spark=sparks[i];
        spark.update();
        if(spark.markedForDeletion){
            sparks.splice(i,1);
            continue;
        }
        spark.draw(gameCtx);
    }

    if(mouse.lb){
        for(let i=0; i<5; i++)
            sparks.push(new Spark(mouse.x,mouse.y));
    }
    if(Math.random()>.96){
        zzfx(...sounds.spark3);
        const pos = [Math.random()*width|0, Math.random()*height|0];
        for(let i=0; i<19; i++)
            sparks.push(new Spark(...pos))
        
    }
}