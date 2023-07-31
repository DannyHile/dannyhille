import svg from './svg.js';

export default
class Spark {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10;
        this.speedX = Math.random() * 4 - 2;
        this.weight = Math.random() * -5 - 1;
        this.markedForDeletion = false;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
        this.color=`rgb(${Math.random()*66|0+70},${Math.random()*70|0+170},${Math.random()*56|0+200})`;
    }
    update(){
        this.x += this.speedX;
        this.angle += this.va;
        if (this.size > 0.5) {
            this.size -= 0.9;
        }else{
            this.markedForDeletion = true;
        }
      
        this.y += this.weight  += 0.3;
    }
    draw(ctx){
        ctx.save();
        ctx.fillStyle=this.color;
        ctx.translate(this.x, this.y);
        ctx.scale(this.size/90,this.size/90);
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = this.size<1?0:this.size*2|0;
        ctx.globalAlpha=this.size/30;
        ctx.rotate(this.angle);
        ctx.fill(svg.star1);
        ctx.restore();
    }
}