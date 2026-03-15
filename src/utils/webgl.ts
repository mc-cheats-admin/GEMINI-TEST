import { state } from '../store';

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_scroll_velocity;
  
  // FBM Noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Fluid Raymarching SDF
  float liquidSDF(vec3 p) {
    float t = u_time * 0.3;
    
    // Mouse distortion
    vec2 mouseNorm = u_mouse / u_resolution;
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float mouseDist = length(uv - mouseNorm);
    float mouseInfluence = smoothstep(0.3, 0.0, mouseDist) * 0.8;
    
    vec3 q = p + vec3(
      fbm(p + vec3(t * 0.5, 0.0, 0.0)),
      fbm(p + vec3(0.0, t * 0.3, 0.0)),
      fbm(p + vec3(0.0, 0.0, t * 0.4))
    );
    
    q += mouseInfluence * vec3(
      sin((mouseNorm.x - 0.5) * 10.0),
      cos((mouseNorm.y - 0.5) * 10.0),
      0.0
    );
    
    float noise = fbm(q * 2.0 + t * 0.2);
    
    // Scroll velocity influence
    noise += u_scroll_velocity * 0.05;
    
    return noise;
  }
  
  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    
    // Raymarching setup
    vec3 ro = vec3(0.0, 0.0, -3.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    float t = u_time * 0.15;
    vec3 p = ro + rd * 2.0;
    
    // Sample liquid field
    float density = liquidSDF(p + vec3(t, t * 0.5, 0.0));
    
    // Dark liquid metal palette (пурпурный, обсидиан, неоново-синий)
    vec3 obsidian = vec3(0.08, 0.05, 0.12);
    vec3 purple = vec3(0.25, 0.08, 0.35);
    vec3 neonBlue = vec3(0.0, 0.6, 0.95);
    vec3 deepPurple = vec3(0.15, 0.0, 0.25);
    
    // Color mixing based on density
    vec3 color = mix(obsidian, purple, smoothstep(-0.3, 0.0, density));
    color = mix(color, deepPurple, smoothstep(0.0, 0.3, density));
    color = mix(color, neonBlue, smoothstep(0.3, 0.6, density) * 0.4);
    
    // Silk shimmer effect
    float shimmer = fbm(p * 4.0 + u_time * 0.5) * 0.5 + 0.5;
    color += neonBlue * shimmer * 0.15;
    
    // Mouse glow
    vec2 mouseNorm = u_mouse / u_resolution;
    vec2 fragUV = gl_FragCoord.xy / u_resolution;
    float mouseDist = length(fragUV - mouseNorm);
    float mouseGlow = exp(-mouseDist * 8.0) * 0.3;
    color += neonBlue * mouseGlow;
    
    // Vignette
    float vignette = 1.0 - length(uv) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export class WebGLBackground {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private startTime: number = Date.now();
  private rafId: number = 0;
  
  private uniformLocations: {
    time: WebGLUniformLocation | null;
    resolution: WebGLUniformLocation | null;
    mouse: WebGLUniformLocation | null;
    scrollVelocity: WebGLUniformLocation | null;
  } = {
    time: null,
    resolution: null,
    mouse: null,
    scrollVelocity: null
  };

  init(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }
    
    this.gl = gl;
    state.webgl.canvas = canvas;
    state.webgl.gl = gl;
    
    // Compile shaders
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) {
      return false;
    }
    
    // Create program
    const program = gl.createProgram();
    if (!program) {
      return false;
    }
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return false;
    }
    
    this.program = program;
    state.webgl.program = program;
    gl.useProgram(program);
    
    // Setup geometry (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    this.uniformLocations.time = gl.getUniformLocation(program, 'u_time');
    this.uniformLocations.resolution = gl.getUniformLocation(program, 'u_resolution');
    this.uniformLocations.mouse = gl.getUniformLocation(program, 'u_mouse');
    this.uniformLocations.scrollVelocity = gl.getUniformLocation(program, 'u_scroll_velocity');
    
    this.resize();
    this.startRenderLoop();
    
    return true;
  }
  
  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  resize(): void {
    if (!this.canvas || !this.gl) return;
    
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  
  private startRenderLoop(): void {
    const render = () => {
      this.render();
      this.rafId = requestAnimationFrame(render);
    };
    render();
  }
  
  render(): void {
    if (!this.gl || !this.program) return;
    
    const time = (Date.now() - this.startTime) * 0.001;
    
    // Update uniforms
    if (this.uniformLocations.time) {
      this.gl.uniform1f(this.uniformLocations.time, time);
    }
    
    if (this.uniformLocations.resolution && this.canvas) {
      this.gl.uniform2f(
        this.uniformLocations.resolution,
        this.canvas.width,
        this.canvas.height
      );
    }
    
    if (this.uniformLocations.mouse) {
      this.gl.uniform2f(
        this.uniformLocations.mouse,
        state.mouse.x * window.devicePixelRatio,
        (window.innerHeight - state.mouse.y) * window.devicePixelRatio
      );
    }
    
    if (this.uniformLocations.scrollVelocity) {
      this.gl.uniform1f(
        this.uniformLocations.scrollVelocity,
        Math.abs(state.scroll.velocity) * 0.01
      );
    }
    
    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  
  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
    
    this.canvas = null;
    this.gl = null;
    this.program = null;
    state.webgl.canvas = null;
    state.webgl.gl = null;
    state.webgl.program = null;
  }
}