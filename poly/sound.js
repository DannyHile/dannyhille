export default class Sound{
    constructor(){
       this.audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    }
    play(frequency = 440, duration = 1){
        const osc = this.audioCtx.createOscillator();
        const envelope = this.audioCtx.createGain();
        osc.connect(envelope);
        envelope.connect(this.audioCtx.destination);
        envelope.gain.setValueAtTime(0, this.audioCtx.currentTime);
        envelope.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);
        envelope.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + duration);
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
    }
}