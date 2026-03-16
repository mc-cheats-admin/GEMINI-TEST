export class WebGLBackground {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private timeLoc: WebGLUniformLocation | null = null;
  private resLoc: WebGLUniformLocation | null = null;
  private mouseLoc: WebGLUniformLocation | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl')!;
    this.init();
    
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = window.innerHeight - e.clientY;
    });
  }

  private init() {
    const gl = this.gl;
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;

        float dist = distance(st, mouse);
        vec2 distortion = normalize(st - mouse) * exp(-dist * 5.0) * 0.1;
        
        vec2 p = st + distortion;
        
        float n = snoise(p * 2.0 + u_time * 0.1);
        n += 0.5 * snoise(p * 4.0 - u_time * 0.15);
        n += 0.25 * snoise(p * 8.0 + u_time * 0.05);

        // Living Silk colors: deep dark blues, subtle purples, and a hint of cyan
        vec3 color1 = vec3(0.02, 0.02, 0.05); // Very dark base
        vec3 color2 = vec3(0.1, 0.05, 0.2);   // Deep purple silk
        vec3 color3 = vec3(0.0, 0.4, 0.6);    // Cyan highlight

        // Smooth color mixing for silk effect
        float mix1 = smoothstep(-1.0, 1.0, n);
        float mix2 = smoothstep(0.2, 1.2, n);

        vec3 finalColor = mix(color1, color2, mix1);
        finalColor = mix(finalColor, color3, mix2 * 0.5); // Subtle cyan highlight

        // Add a subtle vignette
        float vignette = 1.0 - smoothstep(0.5, 1.5, length(st - 0.5));
        finalColor *= vignette;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    this.timeLoc = gl.getUniformLocation(this.program, 'u_time');
    this.resLoc = gl.getUniformLocation(this.program, 'u_resolution');
    this.mouseLoc = gl.getUniformLocation(this.program, 'u_mouse');

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.uniform2f(this.resLoc, this.canvas.width, this.canvas.height);
  }

  update(dt: number, time: number) {
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.1;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.1;

    this.gl.uniform1f(this.timeLoc, time * 0.001);
    this.gl.uniform2f(this.mouseLoc, this.mouseX, this.mouseY);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
