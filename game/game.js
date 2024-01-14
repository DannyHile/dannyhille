class GameEngine{
    state = {
        stopped:true,
        sprites:{},
        levels:[],
        currentLevel:null,
    }
    keys={};

    constructor(canvas){
        this.canvas = canvas;
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.ctx = canvas.getContext("2d");
        onkeydown = onkeyup = (e)=>{
            if(e.repeat) return;
            this.keys[e.key] = e.type==="keydown"?1:0;
        }
    }
    start(){
        if(this.state.stopped==false) return;
        this.state.stopped=false;
        this.mainLoop();
    }
    stop(){
        this.state.stopped=true;
    }
    renderFunction(t){
        const {ctx, canvas}=this;
        ctx.save();
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.fillStyle = "black";
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.fillRect(-50+Math.cos(t)*300,-50+Math.sin(t)*300,100,100);
        ctx.restore();
    }

    addSprite(name, sprite){
        this.state.sprites[name]=sprite;
    }

    mainLoop(t){
        if(this.state.stopped) return;
        this.renderFunction(t/1000);
        requestAnimationFrame(this.mainLoop.bind(this));
    }

}