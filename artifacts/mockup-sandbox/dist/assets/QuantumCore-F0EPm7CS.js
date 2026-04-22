import{r as h,j as a}from"./index-DAhayqZU.js";import{k as U,M as F,V as M,H as y,p as G,i as j,a as A,r as L,R as N,x as O,j as k,u as g,J as W,C as B,d as Q,w as Y,A as $,q,O as K,K as H}from"./index-HfHBYcHX.js";import{S as J,F as X}from"./Sparkles-hMxjSXLy.js";import{S as Z}from"./Stars-DFOWXC9O.js";import{E as tt,M as et}from"./Environment-CMA4ViRA.js";import{T as it}from"./Text-BE3H0qKC.js";import"./constants-yfYA5--q.js";var st=Object.defineProperty,rt=(r,t,e)=>t in r?st(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,u=(r,t,e)=>(rt(r,typeof t!="symbol"?t+"":t,e),e);function C(r,t,e,i,s){let n;if(r=r.subarray||r.slice?r:r.buffer,e=e.subarray||e.slice?e:e.buffer,r=t?r.subarray?r.subarray(t,s&&t+s):r.slice(t,s&&t+s):r,e.set)e.set(r,i);else for(n=0;n<r.length;n++)e[n+i]=r[n];return e}function at(r){return r instanceof Float32Array?r:r instanceof U?r.getAttribute("position").array:r.map(t=>{const e=Array.isArray(t);return t instanceof M?[t.x,t.y,t.z]:t instanceof j?[t.x,t.y,0]:e&&t.length===3?[t[0],t[1],t[2]]:e&&t.length===2?[t[0],t[1],0]:t}).flat()}class nt extends U{constructor(){super(),u(this,"type","MeshLine"),u(this,"isMeshLine",!0),u(this,"positions",[]),u(this,"previous",[]),u(this,"next",[]),u(this,"side",[]),u(this,"width",[]),u(this,"indices_array",[]),u(this,"uvs",[]),u(this,"counters",[]),u(this,"widthCallback",null),u(this,"_attributes"),u(this,"_points",[]),u(this,"points"),u(this,"matrixWorld",new F),Object.defineProperties(this,{points:{enumerable:!0,get(){return this._points},set(t){this.setPoints(t,this.widthCallback)}}})}setMatrixWorld(t){this.matrixWorld=t}setPoints(t,e){if(t=at(t),this._points=t,this.widthCallback=e??null,this.positions=[],this.counters=[],t.length&&t[0]instanceof M)for(let i=0;i<t.length;i++){const s=t[i],n=i/(t.length-1);this.positions.push(s.x,s.y,s.z),this.positions.push(s.x,s.y,s.z),this.counters.push(n),this.counters.push(n)}else for(let i=0;i<t.length;i+=3){const s=i/(t.length-1);this.positions.push(t[i],t[i+1],t[i+2]),this.positions.push(t[i],t[i+1],t[i+2]),this.counters.push(s),this.counters.push(s)}this.process()}compareV3(t,e){const i=t*6,s=e*6;return this.positions[i]===this.positions[s]&&this.positions[i+1]===this.positions[s+1]&&this.positions[i+2]===this.positions[s+2]}copyV3(t){const e=t*6;return[this.positions[e],this.positions[e+1],this.positions[e+2]]}process(){const t=this.positions.length/6;this.previous=[],this.next=[],this.side=[],this.width=[],this.indices_array=[],this.uvs=[];let e,i;this.compareV3(0,t-1)?i=this.copyV3(t-2):i=this.copyV3(0),this.previous.push(i[0],i[1],i[2]),this.previous.push(i[0],i[1],i[2]);for(let s=0;s<t;s++){if(this.side.push(1),this.side.push(-1),this.widthCallback?e=this.widthCallback(s/(t-1)):e=1,this.width.push(e),this.width.push(e),this.uvs.push(s/(t-1),0),this.uvs.push(s/(t-1),1),s<t-1){i=this.copyV3(s),this.previous.push(i[0],i[1],i[2]),this.previous.push(i[0],i[1],i[2]);const n=s*2;this.indices_array.push(n,n+1,n+2),this.indices_array.push(n+2,n+1,n+3)}s>0&&(i=this.copyV3(s),this.next.push(i[0],i[1],i[2]),this.next.push(i[0],i[1],i[2]))}this.compareV3(t-1,0)?i=this.copyV3(1):i=this.copyV3(t-1),this.next.push(i[0],i[1],i[2]),this.next.push(i[0],i[1],i[2]),!this._attributes||this._attributes.position.count!==this.counters.length?this._attributes={position:new y(new Float32Array(this.positions),3),previous:new y(new Float32Array(this.previous),3),next:new y(new Float32Array(this.next),3),side:new y(new Float32Array(this.side),1),width:new y(new Float32Array(this.width),1),uv:new y(new Float32Array(this.uvs),2),index:new y(new Uint16Array(this.indices_array),1),counters:new y(new Float32Array(this.counters),1)}:(this._attributes.position.copyArray(new Float32Array(this.positions)),this._attributes.position.needsUpdate=!0,this._attributes.previous.copyArray(new Float32Array(this.previous)),this._attributes.previous.needsUpdate=!0,this._attributes.next.copyArray(new Float32Array(this.next)),this._attributes.next.needsUpdate=!0,this._attributes.side.copyArray(new Float32Array(this.side)),this._attributes.side.needsUpdate=!0,this._attributes.width.copyArray(new Float32Array(this.width)),this._attributes.width.needsUpdate=!0,this._attributes.uv.copyArray(new Float32Array(this.uvs)),this._attributes.uv.needsUpdate=!0,this._attributes.index.copyArray(new Uint16Array(this.indices_array)),this._attributes.index.needsUpdate=!0),this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setIndex(this._attributes.index),this.computeBoundingSphere(),this.computeBoundingBox()}advance({x:t,y:e,z:i}){const s=this._attributes.position.array,n=this._attributes.previous.array,l=this._attributes.next.array,o=s.length;C(s,0,n,0,o),C(s,6,s,0,o-6),s[o-6]=t,s[o-5]=e,s[o-4]=i,s[o-3]=t,s[o-2]=e,s[o-1]=i,C(s,6,l,0,o-6),l[o-6]=t,l[o-5]=e,l[o-4]=i,l[o-3]=t,l[o-2]=e,l[o-1]=i,this._attributes.position.needsUpdate=!0,this._attributes.previous.needsUpdate=!0,this._attributes.next.needsUpdate=!0}}const ot=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>
  #include <clipping_planes_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
    vCounters = counters;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0) * aspect;
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy * aspect;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <clipping_planes_vertex>
    #include <fog_vertex>
  }
`,ut=parseInt(N.replace(/\D+/g,"")),lt=ut>=154?"colorspace_fragment":"encodings_fragment",ht=`
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useGradient;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  uniform vec3 gradient[2];
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 diffuseColor = vColor;
    if (useGradient == 1.) diffuseColor = vec4(mix(gradient[0], gradient[1], vCounters), 1.0);
    if (useMap == 1.) diffuseColor *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) diffuseColor.a *= texture2D(alphaMap, vUV * repeat).a;
    if (diffuseColor.a < alphaTest) discard;
    if (useDash == 1.) diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    diffuseColor.a *= step(vCounters, visibility);
    #include <clipping_planes_fragment>
    gl_FragColor = diffuseColor;     
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <${lt}>
  }
`;class ct extends G{constructor(t){super({uniforms:{...L.fog,lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},color:{value:new A(16777215)},gradient:{value:[new A(16711680),new A(65280)]},opacity:{value:1},resolution:{value:new j(1,1)},sizeAttenuation:{value:1},dashArray:{value:0},dashOffset:{value:0},dashRatio:{value:.5},useDash:{value:0},useGradient:{value:0},visibility:{value:1},alphaTest:{value:0},repeat:{value:new j(1,1)}},vertexShader:ot,fragmentShader:ht}),u(this,"lineWidth"),u(this,"map"),u(this,"useMap"),u(this,"alphaMap"),u(this,"useAlphaMap"),u(this,"color"),u(this,"gradient"),u(this,"resolution"),u(this,"sizeAttenuation"),u(this,"dashArray"),u(this,"dashOffset"),u(this,"dashRatio"),u(this,"useDash"),u(this,"useGradient"),u(this,"visibility"),u(this,"repeat"),this.type="MeshLineMaterial",Object.defineProperties(this,{lineWidth:{enumerable:!0,get(){return this.uniforms.lineWidth.value},set(e){this.uniforms.lineWidth.value=e}},map:{enumerable:!0,get(){return this.uniforms.map.value},set(e){this.uniforms.map.value=e}},useMap:{enumerable:!0,get(){return this.uniforms.useMap.value},set(e){this.uniforms.useMap.value=e}},alphaMap:{enumerable:!0,get(){return this.uniforms.alphaMap.value},set(e){this.uniforms.alphaMap.value=e}},useAlphaMap:{enumerable:!0,get(){return this.uniforms.useAlphaMap.value},set(e){this.uniforms.useAlphaMap.value=e}},color:{enumerable:!0,get(){return this.uniforms.color.value},set(e){this.uniforms.color.value=e}},gradient:{enumerable:!0,get(){return this.uniforms.gradient.value},set(e){this.uniforms.gradient.value=e}},opacity:{enumerable:!0,get(){return this.uniforms.opacity.value},set(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get(){return this.uniforms.resolution.value},set(e){this.uniforms.resolution.value.copy(e)}},sizeAttenuation:{enumerable:!0,get(){return this.uniforms.sizeAttenuation.value},set(e){this.uniforms.sizeAttenuation.value=e}},dashArray:{enumerable:!0,get(){return this.uniforms.dashArray.value},set(e){this.uniforms.dashArray.value=e,this.useDash=e!==0?1:0}},dashOffset:{enumerable:!0,get(){return this.uniforms.dashOffset.value},set(e){this.uniforms.dashOffset.value=e}},dashRatio:{enumerable:!0,get(){return this.uniforms.dashRatio.value},set(e){this.uniforms.dashRatio.value=e}},useDash:{enumerable:!0,get(){return this.uniforms.useDash.value},set(e){this.uniforms.useDash.value=e}},useGradient:{enumerable:!0,get(){return this.uniforms.useGradient.value},set(e){this.uniforms.useGradient.value=e}},visibility:{enumerable:!0,get(){return this.uniforms.visibility.value},set(e){this.uniforms.visibility.value=e}},alphaTest:{enumerable:!0,get(){return this.uniforms.alphaTest.value},set(e){this.uniforms.alphaTest.value=e}},repeat:{enumerable:!0,get(){return this.uniforms.repeat.value},set(e){this.uniforms.repeat.value.copy(e)}}}),this.setValues(t)}copy(t){return super.copy(t),this.lineWidth=t.lineWidth,this.map=t.map,this.useMap=t.useMap,this.alphaMap=t.alphaMap,this.useAlphaMap=t.useAlphaMap,this.color.copy(t.color),this.gradient=t.gradient,this.opacity=t.opacity,this.resolution.copy(t.resolution),this.sizeAttenuation=t.sizeAttenuation,this.dashArray=t.dashArray,this.dashOffset=t.dashOffset,this.dashRatio=t.dashRatio,this.useDash=t.useDash,this.useGradient=t.useGradient,this.visibility=t.visibility,this.alphaTest=t.alphaTest,this.repeat.copy(t.repeat),this}}const V={width:.2,length:1,decay:1,local:!1,stride:0,interval:1},pt=(r,t=1)=>(r.set(r.subarray(t)),r.fill(-1/0,-t),r);function ft(r,t){const{length:e,local:i,decay:s,interval:n,stride:l}={...V,...t},o=h.useRef(null),[v]=h.useState(()=>new M);h.useLayoutEffect(()=>{r&&(o.current=Float32Array.from({length:e*10*3},(p,c)=>r.position.getComponent(c%3)))},[e,r]);const f=h.useRef(new M),d=h.useRef(0);return g(()=>{if(r&&o.current){if(d.current===0){let p;i?p=r.position:(r.getWorldPosition(v),p=v);const c=1*s;for(let _=0;_<c;_++)p.distanceTo(f.current)<l||(pt(o.current,3),o.current.set(p.toArray(),o.current.length-3));f.current.copy(p)}d.current++,d.current=d.current%n}}),o}const dt=h.forwardRef((r,t)=>{const{children:e}=r,{width:i,length:s,decay:n,local:l,stride:o,interval:v}={...V,...r},{color:f="hotpink",attenuation:d,target:p}=r,c=O(m=>m.size),_=O(m=>m.scene),S=h.useRef(null),[z,E]=h.useState(null),P=ft(z,{length:s,decay:n,local:l,stride:o,interval:v});h.useEffect(()=>{const m=p?.current||S.current.children.find(w=>w instanceof k);m&&E(m)},[P,p]);const R=h.useMemo(()=>new nt,[]),T=h.useMemo(()=>{var m,w;const I=new ct({lineWidth:.1*i,color:f,sizeAttenuation:1,resolution:new j(c.width,c.height)});let b;if(e)if(Array.isArray(e))b=e.find(x=>{const D=x;return typeof D.type=="string"&&D.type==="meshLineMaterial"});else{const x=e;typeof x.type=="string"&&x.type==="meshLineMaterial"&&(b=x)}return typeof((m=b)==null?void 0:m.props)=="object"&&((w=b)==null?void 0:w.props)!==null&&I.setValues(b.props),I},[i,f,c,e]);return h.useEffect(()=>{T.uniforms.resolution.value.set(c.width,c.height)},[c]),g(()=>{P.current&&R.setPoints(P.current,d)}),h.createElement("group",null,W(h.createElement("mesh",{ref:t,geometry:R,material:T}),_),h.createElement("group",{ref:S},e))}),mt=[{name:"DAO",color:"#00ffff",radius:5,speed:.5,tilt:.2},{name:"LIQUIDITY",color:"#ff00ff",radius:6,speed:.4,tilt:-.3},{name:"SECURITY",color:"#00ff88",radius:4.5,speed:.6,tilt:.5},{name:"GOVERNANCE",color:"#4488ff",radius:7,speed:.3,tilt:-.1},{name:"LSC BUILD",color:"#ffaa00",radius:5.5,speed:.45,tilt:.6},{name:"BRIDGE",color:"#00aaff",radius:6.5,speed:.35,tilt:-.4},{name:"AGENTS",color:"#aa00ff",radius:4.8,speed:.55,tilt:.1}];function vt(){const r=h.useRef(null);return g(t=>{r.current&&(r.current.rotation.x=t.clock.elapsedTime*.2,r.current.rotation.y=t.clock.elapsedTime*.3)}),a.jsxs(X,{speed:2,rotationIntensity:.5,floatIntensity:.5,children:[a.jsxs("mesh",{ref:r,children:[a.jsx("sphereGeometry",{args:[2.5,64,64]}),a.jsx(et,{backside:!0,samples:4,thickness:1.5,chromaticAberration:.8,anisotropy:.3,distortion:.2,distortionScale:.5,temporalDistortion:.1,iridescence:1,iridescenceIOR:1.5,iridescenceThicknessRange:[0,1400],color:"#ffffff",attenuationColor:"#4488ff",attenuationDistance:1})]}),a.jsxs("mesh",{children:[a.jsx("sphereGeometry",{args:[1.5,32,32]}),a.jsx("meshBasicMaterial",{color:"#00aaff",transparent:!0,opacity:.6})]}),a.jsx("pointLight",{color:"#00aaff",intensity:10,distance:15})]})}function yt({data:r,index:t}){const e=h.useRef(null),i=h.useRef(null),s=h.useMemo(()=>Math.random()*Math.PI*2,[]);return g(n=>{if(e.current){const l=n.clock.elapsedTime*r.speed+s;e.current.position.x=Math.cos(l)*r.radius,e.current.position.z=Math.sin(l)*r.radius,e.current.position.y=Math.sin(l*2)*r.tilt*2}i.current&&(i.current.rotation.y+=.05,i.current.rotation.x+=.02)}),a.jsxs("group",{ref:e,children:[a.jsx(dt,{width:.5,length:4,color:new A(r.color),attenuation:n=>n*n,children:a.jsxs("mesh",{ref:i,children:[a.jsx("octahedronGeometry",{args:[.4,0]}),a.jsx("meshPhysicalMaterial",{color:r.color,emissive:r.color,emissiveIntensity:2,transparent:!0,opacity:.9,roughness:.1,metalness:.8})]})}),a.jsx(it,{position:[0,-.8,0],fontSize:.25,color:r.color,anchorX:"center",anchorY:"middle",font:"https://fonts.gstatic.com/s/rajdhani/v15/LDI2apCSOBg7S-QT7pb0FdGwaA.woff","material-transparent":!0,"material-opacity":.8,children:r.name}),a.jsx("pointLight",{color:r.color,intensity:2,distance:3})]})}function bt(){const t=h.useMemo(()=>{const i=new Float32Array(600);for(let s=0;s<200;s++){const n=2+Math.random()*8,l=Math.random()*2*Math.PI,o=(Math.random()-.5)*Math.PI;i[s*3]=n*Math.cos(l)*Math.cos(o),i[s*3+1]=n*Math.sin(o),i[s*3+2]=n*Math.sin(l)*Math.cos(o)}return i},[]),e=h.useRef(null);return g(i=>{if(e.current){e.current.rotation.y=i.clock.elapsedTime*.05;const s=e.current.geometry.attributes.position.array;for(let n=0;n<200;n++){const l=s[n*3],o=s[n*3+1],v=s[n*3+2],f=Math.sqrt(l*l+o*o+v*v);if(f>2.5)s[n*3]-=l/f*.02,s[n*3+1]-=o/f*.02,s[n*3+2]-=v/f*.02;else{const d=8+Math.random()*2,p=Math.random()*2*Math.PI,c=(Math.random()-.5)*Math.PI;s[n*3]=d*Math.cos(p)*Math.cos(c),s[n*3+1]=d*Math.sin(c),s[n*3+2]=d*Math.sin(p)*Math.cos(c)}}e.current.geometry.attributes.position.needsUpdate=!0}}),a.jsxs("points",{ref:e,children:[a.jsx("bufferGeometry",{children:a.jsx("bufferAttribute",{attach:"attributes-position",count:200,array:t,itemSize:3})}),a.jsx("pointsMaterial",{size:.05,color:"#ffffff",transparent:!0,opacity:.6,blending:H})]})}function xt(){return a.jsxs(a.Fragment,{children:[a.jsx("color",{attach:"background",args:["#020205"]}),a.jsx("ambientLight",{intensity:.2}),a.jsx(vt,{}),mt.map((r,t)=>a.jsx(yt,{data:r,index:t},r.name)),a.jsx(bt,{}),a.jsx(J,{count:300,scale:15,size:1,speed:.4,opacity:.2,color:"#4488ff"}),a.jsx(Z,{radius:50,depth:50,count:2e3,factor:4,saturation:0,fade:!0,speed:1}),a.jsx(tt,{preset:"night"}),a.jsxs(Q,{disableNormalPass:!0,children:[a.jsx(Y,{luminanceThreshold:.2,luminanceSmoothing:.9,height:300,intensity:1.5}),a.jsx($,{opacity:.05}),a.jsx(q,{eskil:!1,offset:.1,darkness:1.1})]}),a.jsx(K,{autoRotate:!0,autoRotateSpeed:.5,enableZoom:!1,enablePan:!1,enableDamping:!0,maxPolarAngle:Math.PI/2+.2,minPolarAngle:Math.PI/2-.2})]})}function Ct(){const[r,t]=h.useState(513189);h.useEffect(()=>{const i=setInterval(()=>{t(s=>s+1)},1e3);return()=>clearInterval(i)},[]);const e=i=>{const s=Math.floor(i/3600),n=Math.floor(i%3600/60),l=i%60;return`${s.toString().padStart(3,"0")}:${n.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`};return a.jsxs("div",{className:"fixed inset-0 w-screen h-screen bg-[#020205] overflow-hidden font-mono selection:bg-cyan-500/30",children:[a.jsx(B,{camera:{position:[0,2,12],fov:45},children:a.jsx(xt,{})}),a.jsx("div",{className:"absolute inset-x-0 bottom-0 p-8 pointer-events-none flex flex-col items-center justify-end bg-gradient-to-t from-black/80 to-transparent h-48",children:a.jsxs("div",{className:"flex gap-6 items-center px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,170,255,0.1)] text-[11px] md:text-sm tracking-widest uppercase text-cyan-100",children:[a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"}),"SOULWARE UPTIME ",e(r)]}),a.jsx("div",{className:"w-1 h-1 rounded-full bg-white/20"}),a.jsx("div",{children:"DECISIONS 1,847"}),a.jsx("div",{className:"w-1 h-1 rounded-full bg-white/20"}),a.jsx("div",{children:"Q-KEY ROTATIONS 23"}),a.jsx("div",{className:"w-1 h-1 rounded-full bg-white/20"}),a.jsx("div",{children:"EVOLUTION 87.3"})]})}),a.jsx("div",{className:"absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20"})]})}export{Ct as QuantumCore};
