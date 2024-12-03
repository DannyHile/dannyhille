import Sound from "./sound.js";
export default class Ball{
    soundFrequencies = [
        1760, 1567.98, 1396.91, 1318.51, 1174.66, 1046.5, 987.77, 880,
        783.99, 698.46, 659.25, 587.33, 523.25, 493.88, 440, 392, 349.23,
        329.63, 293.66, 261.63
];
    constructor(track, radius, speed, hue=0){
        this.track = track;
        this.radius = radius;
        this.speed = speed;
        this.offset = 0;
        this.hue = hue;
        this.sound = new Sound();
        this.center = this.track.getPosition(this.offset);
        this.round = this.center.r;
        this.frequency = this.soundFrequencies[Math.floor(Math.random()*this.soundFrequencies.length)];
    }
    draw(ctx){
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.strokeStyle='#fff';
        ctx.fill();
        ctx.stroke();
    }

    update(){
        this.center = this.track.getPosition(this.offset);
        if(this.center.r !== this.round){
            this.round = this.center.r;
            this.sound.play(this.frequency, 1.5);
        }
        this.offset += this.speed
        
    }
}