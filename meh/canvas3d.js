function getContext3d(canvasObj, fragmentShaderScript, vertextShaderScript) {
    this.context = canvasObj.getContext("webgl2");
    const w = this.context.canvas.width;
    const h = this.context.canvas.height;
    this.context.bindBuffer(this.context.ARRAY_BUFFER, this.context.createBuffer());
    this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), this.context.STATIC_DRAW);
    const program = this.context.createProgram();
    const vshader = this.context.createShader(this.context.VERTEX_SHADER);
    const fshader = this.context.createShader(this.context.FRAGMENT_SHADER);
    this.context.shaderSource(vshader, vertextShaderScript || `precision mediump float;attribute vec2 a_texcoord; attribute vec2 a_position;varying vec2 v_texcoord;void main(){v_texcoord=a_texcoord;gl_Position = vec4(a_position, 0, 1);}`);
    this.context.shaderSource(fshader, fragmentShaderScript);
    this.context.compileShader(vshader);
    this.context.compileShader(fshader);
    this.context.attachShader(program, vshader);
    this.context.attachShader(program, fshader);
    this.context.linkProgram(program);
    this.context.useProgram(program);
    this.context.program = program;
    const positionLocation = context.getAttribLocation(program, "a_position");
    this.context.enableVertexAttribArray(positionLocation);
    this.context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);
    const texcoordLocation = context.getAttribLocation(program, "a_texcoord");
    this.context.enableVertexAttribArray(texcoordLocation);
    this.context.vertexAttribPointer(texcoordLocation, 2, context.FLOAT, false, 0, 0);
    this.context.uniform2f(context.getUniformLocation(program, "resolution"), w, h);
    this.context.viewport(0, 0, w, h);
    this.context.setUniform2F = (name, val) => this.context.uniform2f(this.context.getUniformLocation(this.context.program, name), ...val);
    this.context.setUniform3F = (name, val) => this.context.uniform3f(this.context.getUniformLocation(this.context.program, name), ...val);
    this.context.setInt = (name, val) => this.context.uniform1i(this.context.getUniformLocation(this.context.program, name), val);
    this.context.update = (time = performance.now() * .001) => {
        this.context.uniform1f(this.context.getUniformLocation(this.context.program, "time"), time);
        context.drawArrays(this.context.TRIANGLES, 0, 6);
    };
    return context;
}