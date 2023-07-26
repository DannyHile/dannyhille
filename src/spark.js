export default
class Spark {
    constructor(x,y){
        this.x = Math.random() > 0.5 ? x + 30 : x - 30;
        this.y = y - 30;
        this.size = Math.random() * 20 + 10;
        this.speedX = Math.random() * 4 - 2;
        this.weight = Math.random() * -5 - 1;
        this.markedForDeletion = false;
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
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
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(-5,-5,10,10)
        ctx.restore();
    }
}