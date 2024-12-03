import Ball from './ball.js';
export default class Track{
    constructor(center, radius, speed, hue=0){
        this.center = center;
        this.radius = radius;
        this.hue = hue;
        this.ball = new Ball(this, 4, speed, hue);
        this.round = 0;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0,  Math.PI, true);
        ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.stroke();
        this.ball.draw(ctx);
    }

    update(){
        this.ball.update();
    }

    getPosition(angle){
        return {
            x: this.center.x+Math.cos(angle)*this.radius,
            y: this.center.y-Math.abs(Math.sin(angle))*this.radius,
            r: Math.floor(angle/Math.PI)
        };
    }
}