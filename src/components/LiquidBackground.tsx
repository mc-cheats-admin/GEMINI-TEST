import React, { useEffect, useRef } from 'react';
import { state } from '../store';

export const LiquidBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    window.addEventListener('resize', handleResize);

    // Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader - Living Silk with Fluid Raymarching
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // 3D Noise function
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

      // FBM (Fractal Brownian Motion)
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

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Mouse influence
        vec2 mouseNorm = u_mouse / u_resolution.xy;
        vec2 toMouse = mouseNorm - uv;
        float mouseDist = length(toMouse);
        float mouseInfluence = smoothstep(0.3, 0.0, mouseDist) * 0.5;
        
        // Animated 3D position with mouse distortion
        vec3 pos = vec3(p * 0.8, 0.0);
        pos.x += mouseInfluence * toMouse.x * 2.0;
        pos.y += mouseInfluence * toMouse.y * 2.0;
        pos.z = u_time * 0.15;
        
        // Layered FBM for silk effect
        float n1 = fbm(pos * 1.5 + vec3(u_time * 0.1, u_time * 0.15, 0.0));
        float n2 = fbm(pos * 2.5 + vec3(-u_time * 0.08, u_time * 0.12, u_time * 0.2));
        float n3 = fbm(pos * 4.0 + vec3(u_time * 0.05, -u_time * 0.1, u_time * 0.15));
        
        // Combine noise layers
        float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
        noise += mouseInfluence * 0.8;
        
        // Liquid metal color palette (obsidian, purple, neon blue)
        vec3 color1 = vec3(0.08, 0.05, 0.15); // Deep obsidian
        vec3 color2 = vec3(0.15, 0.08, 0.25); // Dark purple
        vec3 color3 = vec3(0.0, 0.6, 0.8);    // Neon blue
        vec3 color4 = vec3(0.6, 0.1, 0.7);    // Neon purple
        
        // Color mixing based on noise
        vec3 finalColor = mix(color1, color2, smoothstep(-0.5, 0.0, noise));
        finalColor = mix(finalColor, color3, smoothstep(0.0, 0.5, noise));
        finalColor = mix(finalColor, color4, smoothstep(0.5, 1.0, noise));
        
        // Add highlights
        float highlight = pow(max(0.0, noise), 3.0) * 0.8;
        finalColor += vec3(highlight);
        
        // Subtle animated shimmer
        float shimmer = sin(u_time * 2.0 + p.x * 5.0) * 0.03;
        shimmer += cos(u_time * 1.5 + p.y * 4.0) * 0.03;
        finalColor += vec3(shimmer);
        
        // Vignette
        float vignette = 1.0 - length(p) * 0.3;
        finalColor *= vignette;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);

    // Setup geometry (fullscreen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');

    let time = 0;
    let rafId: number;

    const render = () => {
      time += 0.016 + Math.abs(state.scroll.velocity) * 0.0005;
      
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, state.mouse.x, state.mouse.y);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10"
      style={{ filter: 'blur(12px) contrast(1.5)' }}
    />
  );
};