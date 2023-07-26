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
        this.color=`rgb(${Math.random()*35|0+220},${Math.random()*75|0+170},0)`;
    }
    update(){
        this.x += this.speedX;
        this.angle += this.va;
        if (this.size > 0.3) {
            this.size -= 0.2;
        } else {
            this.markedForDeletion = true;
        }
        this.weight += 0.1;
        this.y += this.weight;
    }
    draw(ctx){
        ctx.save();
        ctx.fillStyle=this.color;
        ctx.translate(this.x, this.y);
        ctx.scale(this.size/80,this.size/80);
        ctx.globalAlpha=this.size/30;
        ctx.rotate(this.angle);
        ctx.fill(svg.star);
        ctx.restore();
    }
}