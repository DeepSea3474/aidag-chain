import{r}from"./index-DAhayqZU.js";import{u as x,v as b,e as z,x as C,a as A,_ as S,i as w,V as k,s as O,p as V}from"./index-HfHBYcHX.js";import{v as T}from"./Stars-DFOWXC9O.js";const G=r.forwardRef(({children:e,enabled:t=!0,speed:a=1,rotationIntensity:i=1,floatIntensity:p=1,floatingRange:n=[-.1,.1],autoInvalidate:l=!1,...v},y)=>{const o=r.useRef(null);r.useImperativeHandle(y,()=>o.current,[]);const s=r.useRef(Math.random()*1e4);return x(g=>{var c,f;if(!t||a===0)return;l&&g.invalidate();const u=s.current+g.clock.elapsedTime;o.current.rotation.x=Math.cos(u/4*a)/8*i,o.current.rotation.y=Math.sin(u/4*a)/8*i,o.current.rotation.z=Math.sin(u/4*a)/20*i;let m=Math.sin(u/4*a)/10;m=b.mapLinear(m,-.1,.1,(c=n?.[0])!==null&&c!==void 0?c:-.1,(f=n?.[1])!==null&&f!==void 0?f:.1),o.current.position.y=m*p,o.current.updateMatrix()}),r.createElement("group",v,r.createElement("group",{ref:o,matrixAutoUpdate:!1},e))});class $ extends V{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${T>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(t){this.uniforms.time.value=t}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(t){this.uniforms.pixelRatio.value=t}}const P=e=>e&&e.constructor===Float32Array,j=e=>[e.r,e.g,e.b],M=e=>e instanceof w||e instanceof k||e instanceof O,_=e=>Array.isArray(e)?e:M(e)?e.toArray():[e,e,e];function d(e,t,a){return r.useMemo(()=>{if(t!==void 0){if(P(t))return t;if(t instanceof A){const i=Array.from({length:e*3},()=>j(t)).flat();return Float32Array.from(i)}else if(M(t)||Array.isArray(t)){const i=Array.from({length:e*3},()=>_(t)).flat();return Float32Array.from(i)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},a)},[t])}const J=r.forwardRef(({noise:e=1,count:t=100,speed:a=1,opacity:i=1,scale:p=1,size:n,color:l,children:v,...y},o)=>{r.useMemo(()=>z({SparklesImplMaterial:$}),[]);const s=r.useRef(null),g=C(h=>h.viewport.dpr),c=_(p),f=r.useMemo(()=>Float32Array.from(Array.from({length:t},()=>c.map(b.randFloatSpread)).flat()),[t,...c]),u=d(t,n,Math.random),m=d(t,i),E=d(t,a),F=d(t*3,e),R=d(l===void 0?t*3:t,P(l)?l:new A(l),()=>1);return x(h=>{s.current&&s.current.material&&(s.current.material.time=h.clock.elapsedTime)}),r.useImperativeHandle(o,()=>s.current,[]),r.createElement("points",S({key:`particle-${t}-${JSON.stringify(p)}`},y,{ref:s}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[f,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[u,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[m,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[E,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[R,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[F,3]})),v||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:g,depthWrite:!1}))});export{G as F,J as S};
