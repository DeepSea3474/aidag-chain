import{f as yr,N as Ot,p as hr,h as Nt,P as Hr,X as we,Y as Re,Z as Ge,$ as Se,a0 as rr,a1 as Lt,a2 as Pt,U as zt,v as Ht,x as ze,a3 as Er,a4 as Gt,e as Gr,u as Zr,_ as Wr,a5 as Zt,a6 as Wt,a as $t,a7 as Xt,a8 as Yt,a9 as Oe,aa as $r,ab as Vt,ac as Xr,ad as cr,ae as jt,af as Kt,ag as pr,ah as Ze,ai as qt,aj as Jt,ak as Qt,al as ea,am as ra,an as gr,ao as ta,ap as aa,aq as Nr,ar as na,as as lr,at as ia,V as qe,au as ur,av as oa,aw as sa,ax as la,ay as ca,J as ua,az as Lr}from"./index-HfHBYcHX.js";import{r as P}from"./index-DAhayqZU.js";import{v as Yr}from"./constants-yfYA5--q.js";var Me=Uint8Array,Ne=Uint16Array,wr=Uint32Array,Vr=new Me([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),jr=new Me([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),ha=new Me([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Kr=function(n,t){for(var i=new Ne(31),o=0;o<31;++o)i[o]=t+=1<<n[o-1];for(var l=new wr(i[30]),o=1;o<30;++o)for(var h=i[o];h<i[o+1];++h)l[h]=h-i[o]<<5|o;return[i,l]},qr=Kr(Vr,2),Jr=qr[0],da=qr[1];Jr[28]=258,da[258]=28;var fa=Kr(jr,0),va=fa[0],_r=new Ne(32768);for(var ee=0;ee<32768;++ee){var ke=(ee&43690)>>>1|(ee&21845)<<1;ke=(ke&52428)>>>2|(ke&13107)<<2,ke=(ke&61680)>>>4|(ke&3855)<<4,_r[ee]=((ke&65280)>>>8|(ke&255)<<8)>>>1}var er=(function(n,t,i){for(var o=n.length,l=0,h=new Ne(t);l<o;++l)++h[n[l]-1];var d=new Ne(t);for(l=0;l<t;++l)d[l]=d[l-1]+h[l-1]<<1;var y;if(i){y=new Ne(1<<t);var m=15-t;for(l=0;l<o;++l)if(n[l])for(var p=l<<4|n[l],F=t-n[l],b=d[n[l]-1]++<<F,C=b|(1<<F)-1;b<=C;++b)y[_r[b]>>>m]=p}else for(y=new Ne(o),l=0;l<o;++l)n[l]&&(y[l]=_r[d[n[l]-1]++]>>>15-n[l]);return y}),ar=new Me(288);for(var ee=0;ee<144;++ee)ar[ee]=8;for(var ee=144;ee<256;++ee)ar[ee]=9;for(var ee=256;ee<280;++ee)ar[ee]=7;for(var ee=280;ee<288;++ee)ar[ee]=8;var Qr=new Me(32);for(var ee=0;ee<32;++ee)Qr[ee]=5;var ma=er(ar,9,1),pa=er(Qr,5,1),vr=function(n){for(var t=n[0],i=1;i<n.length;++i)n[i]>t&&(t=n[i]);return t},Ce=function(n,t,i){var o=t/8|0;return(n[o]|n[o+1]<<8)>>(t&7)&i},mr=function(n,t){var i=t/8|0;return(n[i]|n[i+1]<<8|n[i+2]<<16)>>(t&7)},ga=function(n){return(n/8|0)+(n&7&&1)},wa=function(n,t,i){(i==null||i>n.length)&&(i=n.length);var o=new(n instanceof Ne?Ne:n instanceof wr?wr:Me)(i-t);return o.set(n.subarray(t,i)),o},_a=function(n,t,i){var o=n.length;if(!o||i&&!i.l&&o<5)return t||new Me(0);var l=!t||i,h=!i||i.i;i||(i={}),t||(t=new Me(o*3));var d=function(Y){var Fe=t.length;if(Y>Fe){var Ae=new Me(Math.max(Fe*2,Y));Ae.set(t),t=Ae}},y=i.f||0,m=i.p||0,p=i.b||0,F=i.l,b=i.d,C=i.m,A=i.n,Z=o*8;do{if(!F){i.f=y=Ce(n,m,1);var ue=Ce(n,m+1,3);if(m+=3,ue)if(ue==1)F=ma,b=pa,C=9,A=5;else if(ue==2){var le=Ce(n,m,31)+257,se=Ce(n,m+10,15)+4,z=le+Ce(n,m+5,31)+1;m+=14;for(var D=new Me(z),B=new Me(19),v=0;v<se;++v)B[ha[v]]=Ce(n,m+v*3,7);m+=se*3;for(var S=vr(B),G=(1<<S)-1,X=er(B,S,1),v=0;v<z;){var H=X[Ce(n,m,G)];m+=H&15;var N=H>>>4;if(N<16)D[v++]=N;else{var W=0,R=0;for(N==16?(R=3+Ce(n,m,3),m+=2,W=D[v-1]):N==17?(R=3+Ce(n,m,7),m+=3):N==18&&(R=11+Ce(n,m,127),m+=7);R--;)D[v++]=W}}var te=D.subarray(0,le),O=D.subarray(le);C=vr(te),A=vr(O),F=er(te,C,1),b=er(O,A,1)}else throw"invalid block type";else{var N=ga(m)+4,ie=n[N-4]|n[N-3]<<8,re=N+ie;if(re>o){if(h)throw"unexpected EOF";break}l&&d(p+ie),t.set(n.subarray(N,re),p),i.b=p+=ie,i.p=m=re*8;continue}if(m>Z){if(h)throw"unexpected EOF";break}}l&&d(p+131072);for(var xe=(1<<C)-1,Le=(1<<A)-1,Ie=m;;Ie=m){var W=F[mr(n,m)&xe],J=W>>>4;if(m+=W&15,m>Z){if(h)throw"unexpected EOF";break}if(!W)throw"invalid length/literal";if(J<256)t[p++]=J;else if(J==256){Ie=m,F=null;break}else{var De=J-254;if(J>264){var v=J-257,ae=Vr[v];De=Ce(n,m,(1<<ae)-1)+Jr[v],m+=ae}var de=b[mr(n,m)&Le],Te=de>>>4;if(!de)throw"invalid distance";m+=de&15;var O=va[Te];if(Te>3){var ae=jr[Te];O+=mr(n,m)&(1<<ae)-1,m+=ae}if(m>Z){if(h)throw"unexpected EOF";break}l&&d(p+131072);for(var $e=p+De;p<$e;p+=4)t[p]=t[p-O],t[p+1]=t[p+1-O],t[p+2]=t[p+2-O],t[p+3]=t[p+3-O];p=$e}}i.l=F,i.p=Ie,i.b=p,F&&(y=1,i.m=C,i.d=b,i.n=A)}while(!y);return p==t.length?t:wa(t,0,p)},ya=new Me(0),Ea=function(n){if((n[0]&15)!=8||n[0]>>>4>7||(n[0]<<8|n[1])%31)throw"invalid zlib data";if(n[1]&32)throw"invalid zlib data: preset dictionaries not supported"};function or(n,t){return _a((Ea(n),n.subarray(2,-4)),t)}var Ma=typeof TextDecoder<"u"&&new TextDecoder,Sa=0;try{Ma.decode(ya,{stream:!0}),Sa=1}catch{}const xa=n=>n&&n.isCubeTexture;class Ia extends yr{constructor(t,i){var o,l;const h=xa(t),y=((l=h?(o=t.image[0])==null?void 0:o.width:t.image.width)!=null?l:1024)/4,m=Math.floor(Math.log2(y)),p=Math.pow(2,m),F=3*Math.max(p,112),b=4*p,C=[h?"#define ENVMAP_TYPE_CUBE":"",`#define CUBEUV_TEXEL_WIDTH ${1/F}`,`#define CUBEUV_TEXEL_HEIGHT ${1/b}`,`#define CUBEUV_MAX_MIP ${m}.0`],A=`
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,Z=C.join(`
`)+`
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${Yr>=154?"colorspace_fragment":"encodings_fragment"}>
        }
        `,ue={map:{value:t},height:{value:i?.height||15},radius:{value:i?.radius||100}},N=new Ot(1,16),ie=new hr({uniforms:ue,fragmentShader:Z,vertexShader:A,side:Nt});super(N,ie)}set radius(t){this.material.uniforms.radius.value=t}get radius(){return this.material.uniforms.radius.value}set height(t){this.material.uniforms.height.value=t}get height(){return this.material.uniforms.height.value}}class Ca extends Hr{constructor(t){super(t),this.type=we}parse(t){const d=function(v,S){switch(v){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(S||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(S||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(S||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(S||""))}},b=function(v,S,G){S=S||1024;let H=v.pos,W=-1,R=0,te="",O=String.fromCharCode.apply(null,new Uint16Array(v.subarray(H,H+128)));for(;0>(W=O.indexOf(`
`))&&R<S&&H<v.byteLength;)te+=O,R+=O.length,H+=128,O+=String.fromCharCode.apply(null,new Uint16Array(v.subarray(H,H+128)));return-1<W?(v.pos+=R+W+1,te+O.slice(0,W)):!1},C=function(v){const S=/^#\?(\S+)/,G=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,X=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,H=/^\s*FORMAT=(\S+)\s*$/,W=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,R={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let te,O;for((v.pos>=v.byteLength||!(te=b(v)))&&d(1,"no header found"),(O=te.match(S))||d(3,"bad initial token"),R.valid|=1,R.programtype=O[1],R.string+=te+`
`;te=b(v),te!==!1;){if(R.string+=te+`
`,te.charAt(0)==="#"){R.comments+=te+`
`;continue}if((O=te.match(G))&&(R.gamma=parseFloat(O[1])),(O=te.match(X))&&(R.exposure=parseFloat(O[1])),(O=te.match(H))&&(R.valid|=2,R.format=O[1]),(O=te.match(W))&&(R.valid|=4,R.height=parseInt(O[1],10),R.width=parseInt(O[2],10)),R.valid&2&&R.valid&4)break}return R.valid&2||d(3,"missing format specifier"),R.valid&4||d(3,"missing image size specifier"),R},A=function(v,S,G){const X=S;if(X<8||X>32767||v[0]!==2||v[1]!==2||v[2]&128)return new Uint8Array(v);X!==(v[2]<<8|v[3])&&d(3,"wrong scanline width");const H=new Uint8Array(4*S*G);H.length||d(4,"unable to allocate buffer space");let W=0,R=0;const te=4*X,O=new Uint8Array(4),xe=new Uint8Array(te);let Le=G;for(;Le>0&&R<v.byteLength;){R+4>v.byteLength&&d(1),O[0]=v[R++],O[1]=v[R++],O[2]=v[R++],O[3]=v[R++],(O[0]!=2||O[1]!=2||(O[2]<<8|O[3])!=X)&&d(3,"bad rgbe scanline format");let Ie=0,J;for(;Ie<te&&R<v.byteLength;){J=v[R++];const ae=J>128;if(ae&&(J-=128),(J===0||Ie+J>te)&&d(3,"bad scanline data"),ae){const de=v[R++];for(let Te=0;Te<J;Te++)xe[Ie++]=de}else xe.set(v.subarray(R,R+J),Ie),Ie+=J,R+=J}const De=X;for(let ae=0;ae<De;ae++){let de=0;H[W]=xe[ae+de],de+=X,H[W+1]=xe[ae+de],de+=X,H[W+2]=xe[ae+de],de+=X,H[W+3]=xe[ae+de],W+=4}Le--}return H},Z=function(v,S,G,X){const H=v[S+3],W=Math.pow(2,H-128)/255;G[X+0]=v[S+0]*W,G[X+1]=v[S+1]*W,G[X+2]=v[S+2]*W,G[X+3]=1},ue=function(v,S,G,X){const H=v[S+3],W=Math.pow(2,H-128)/255;G[X+0]=Ge.toHalfFloat(Math.min(v[S+0]*W,65504)),G[X+1]=Ge.toHalfFloat(Math.min(v[S+1]*W,65504)),G[X+2]=Ge.toHalfFloat(Math.min(v[S+2]*W,65504)),G[X+3]=Ge.toHalfFloat(1)},N=new Uint8Array(t);N.pos=0;const ie=C(N),re=ie.width,le=ie.height,se=A(N.subarray(N.pos),re,le);let z,D,B;switch(this.type){case Re:B=se.length/4;const v=new Float32Array(B*4);for(let G=0;G<B;G++)Z(se,G*4,v,G*4);z=v,D=Re;break;case we:B=se.length/4;const S=new Uint16Array(B*4);for(let G=0;G<B;G++)ue(se,G*4,S,G*4);z=S,D=we;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:re,height:le,data:z,header:ie.string,gamma:ie.gamma,exposure:ie.exposure,type:D}}setDataType(t){return this.type=t,this}load(t,i,o,l){function h(d,y){switch(d.type){case Re:case we:"colorSpace"in d?d.colorSpace="srgb-linear":d.encoding=3e3,d.minFilter=Se,d.magFilter=Se,d.generateMipmaps=!1,d.flipY=!0;break}i&&i(d,y)}return super.load(t,h,o,l)}}const Je=Yr>=152;class Ta extends Hr{constructor(t){super(t),this.type=we}parse(t){const S=Math.pow(2.7182818,2.2);function G(e,r){for(var a=0,s=0;s<65536;++s)(s==0||e[s>>3]&1<<(s&7))&&(r[a++]=s);for(var c=a-1;a<65536;)r[a++]=0;return c}function X(e){for(var r=0;r<16384;r++)e[r]={},e[r].len=0,e[r].lit=0,e[r].p=null}const H={l:0,c:0,lc:0};function W(e,r,a,s,c){for(;a<e;)r=r<<8|kr(s,c),a+=8;a-=e,H.l=r>>a&(1<<e)-1,H.c=r,H.lc=a}const R=new Array(59);function te(e){for(var r=0;r<=58;++r)R[r]=0;for(var r=0;r<65537;++r)R[e[r]]+=1;for(var a=0,r=58;r>0;--r){var s=a+R[r]>>1;R[r]=a,a=s}for(var r=0;r<65537;++r){var c=e[r];c>0&&(e[r]=c|R[c]++<<6)}}function O(e,r,a,s,c,u,g){for(var f=a,E=0,_=0;c<=u;c++){if(f.value-a.value>s)return!1;W(6,E,_,e,f);var M=H.l;if(E=H.c,_=H.lc,g[c]=M,M==63){if(f.value-a.value>s)throw"Something wrong with hufUnpackEncTable";W(8,E,_,e,f);var w=H.l+6;if(E=H.c,_=H.lc,c+w>u+1)throw"Something wrong with hufUnpackEncTable";for(;w--;)g[c++]=0;c--}else if(M>=59){var w=M-59+2;if(c+w>u+1)throw"Something wrong with hufUnpackEncTable";for(;w--;)g[c++]=0;c--}}te(g)}function xe(e){return e&63}function Le(e){return e>>6}function Ie(e,r,a,s){for(;r<=a;r++){var c=Le(e[r]),u=xe(e[r]);if(c>>u)throw"Invalid table entry";if(u>14){var g=s[c>>u-14];if(g.len)throw"Invalid table entry";if(g.lit++,g.p){var f=g.p;g.p=new Array(g.lit);for(var E=0;E<g.lit-1;++E)g.p[E]=f[E]}else g.p=new Array(1);g.p[g.lit-1]=r}else if(u)for(var _=0,E=1<<14-u;E>0;E--){var g=s[(c<<14-u)+_];if(g.len||g.p)throw"Invalid table entry";g.len=u,g.lit=r,_++}}return!0}const J={c:0,lc:0};function De(e,r,a,s){e=e<<8|kr(a,s),r+=8,J.c=e,J.lc=r}const ae={c:0,lc:0};function de(e,r,a,s,c,u,g,f,E,_){if(e==r){s<8&&(De(a,s,c,g),a=J.c,s=J.lc),s-=8;var M=a>>s,M=new Uint8Array([M])[0];if(E.value+M>_)return!1;for(var w=f[E.value-1];M-- >0;)f[E.value++]=w}else if(E.value<_)f[E.value++]=e;else return!1;ae.c=a,ae.lc=s}function Te(e){return e&65535}function $e(e){var r=Te(e);return r>32767?r-65536:r}const Y={a:0,b:0};function Fe(e,r){var a=$e(e),s=$e(r),c=s,u=a+(c&1)+(c>>1),g=u,f=u-c;Y.a=g,Y.b=f}function Ae(e,r){var a=Te(e),s=Te(r),c=a-(s>>1)&65535,u=s+c-32768&65535;Y.a=u,Y.b=c}function ot(e,r,a,s,c,u,g){for(var f=g<16384,E=a>c?c:a,_=1,M;_<=E;)_<<=1;for(_>>=1,M=_,_>>=1;_>=1;){for(var w=0,oe=w+u*(c-M),I=u*_,T=u*M,U=s*_,k=s*M,V,K,ce,me;w<=oe;w+=T){for(var q=w,be=w+s*(a-M);q<=be;q+=k){var Q=q+U,he=q+I,Ue=he+U;f?(Fe(e[q+r],e[he+r]),V=Y.a,ce=Y.b,Fe(e[Q+r],e[Ue+r]),K=Y.a,me=Y.b,Fe(V,K),e[q+r]=Y.a,e[Q+r]=Y.b,Fe(ce,me),e[he+r]=Y.a,e[Ue+r]=Y.b):(Ae(e[q+r],e[he+r]),V=Y.a,ce=Y.b,Ae(e[Q+r],e[Ue+r]),K=Y.a,me=Y.b,Ae(V,K),e[q+r]=Y.a,e[Q+r]=Y.b,Ae(ce,me),e[he+r]=Y.a,e[Ue+r]=Y.b)}if(a&_){var he=q+I;f?Fe(e[q+r],e[he+r]):Ae(e[q+r],e[he+r]),V=Y.a,e[he+r]=Y.b,e[q+r]=V}}if(c&_)for(var q=w,be=w+s*(a-M);q<=be;q+=k){var Q=q+U;f?Fe(e[q+r],e[Q+r]):Ae(e[q+r],e[Q+r]),V=Y.a,e[Q+r]=Y.b,e[q+r]=V}M=_,_>>=1}return w}function st(e,r,a,s,c,u,g,f,E,_){for(var M=0,w=0,oe=f,I=Math.trunc(c.value+(u+7)/8);c.value<I;)for(De(M,w,a,c),M=J.c,w=J.lc;w>=14;){var T=M>>w-14&16383,U=r[T];if(U.len)w-=U.len,de(U.lit,g,M,w,a,s,c,E,_,oe),M=ae.c,w=ae.lc;else{if(!U.p)throw"hufDecode issues";var k;for(k=0;k<U.lit;k++){for(var V=xe(e[U.p[k]]);w<V&&c.value<I;)De(M,w,a,c),M=J.c,w=J.lc;if(w>=V&&Le(e[U.p[k]])==(M>>w-V&(1<<V)-1)){w-=V,de(U.p[k],g,M,w,a,s,c,E,_,oe),M=ae.c,w=ae.lc;break}}if(k==U.lit)throw"hufDecode issues"}}var K=8-u&7;for(M>>=K,w-=K;w>0;){var U=r[M<<14-w&16383];if(U.len)w-=U.len,de(U.lit,g,M,w,a,s,c,E,_,oe),M=ae.c,w=ae.lc;else throw"hufDecode issues"}return!0}function Rr(e,r,a,s,c,u){var g={value:0},f=a.value,E=pe(r,a),_=pe(r,a);a.value+=4;var M=pe(r,a);if(a.value+=4,E<0||E>=65537||_<0||_>=65537)throw"Something wrong with HUF_ENCSIZE";var w=new Array(65537),oe=new Array(16384);X(oe);var I=s-(a.value-f);if(O(e,r,a,I,E,_,w),M>8*(s-(a.value-f)))throw"Something wrong with hufUncompress";Ie(w,E,_,oe),st(w,oe,e,r,a,M,_,u,c,g)}function lt(e,r,a){for(var s=0;s<a;++s)r[s]=e[r[s]]}function Fr(e){for(var r=1;r<e.length;r++){var a=e[r-1]+e[r]-128;e[r]=a}}function Ar(e,r){for(var a=0,s=Math.floor((e.length+1)/2),c=0,u=e.length-1;!(c>u||(r[c++]=e[a++],c>u));)r[c++]=e[s++]}function Ur(e){for(var r=e.byteLength,a=new Array,s=0,c=new DataView(e);r>0;){var u=c.getInt8(s++);if(u<0){var g=-u;r-=g+1;for(var f=0;f<g;f++)a.push(c.getUint8(s++))}else{var g=u;r-=2;for(var E=c.getUint8(s++),f=0;f<g+1;f++)a.push(E)}}return a}function ct(e,r,a,s,c,u){var Q=new DataView(u.buffer),g=a[e.idx[0]].width,f=a[e.idx[0]].height,E=3,_=Math.floor(g/8),M=Math.ceil(g/8),w=Math.ceil(f/8),oe=g-(M-1)*8,I=f-(w-1)*8,T={value:0},U=new Array(E),k=new Array(E),V=new Array(E),K=new Array(E),ce=new Array(E);for(let j=0;j<E;++j)ce[j]=r[e.idx[j]],U[j]=j<1?0:U[j-1]+M*w,k[j]=new Float32Array(64),V[j]=new Uint16Array(64),K[j]=new Uint16Array(M*64);for(let j=0;j<w;++j){var me=8;j==w-1&&(me=I);var q=8;for(let ne=0;ne<M;++ne){ne==M-1&&(q=oe);for(let $=0;$<E;++$)V[$].fill(0),V[$][0]=c[U[$]++],ut(T,s,V[$]),ht(V[$],k[$]),dt(k[$]);ft(k);for(let $=0;$<E;++$)vt(k[$],K[$],ne*64)}let ve=0;for(let ne=0;ne<E;++ne){const $=a[e.idx[ne]].type;for(let Ee=8*j;Ee<8*j+me;++Ee){ve=ce[ne][Ee];for(let Pe=0;Pe<_;++Pe){const ge=Pe*64+(Ee&7)*8;Q.setUint16(ve+0*$,K[ne][ge+0],!0),Q.setUint16(ve+2*$,K[ne][ge+1],!0),Q.setUint16(ve+4*$,K[ne][ge+2],!0),Q.setUint16(ve+6*$,K[ne][ge+3],!0),Q.setUint16(ve+8*$,K[ne][ge+4],!0),Q.setUint16(ve+10*$,K[ne][ge+5],!0),Q.setUint16(ve+12*$,K[ne][ge+6],!0),Q.setUint16(ve+14*$,K[ne][ge+7],!0),ve+=16*$}}if(_!=M)for(let Ee=8*j;Ee<8*j+me;++Ee){const Pe=ce[ne][Ee]+8*_*2*$,ge=_*64+(Ee&7)*8;for(let Be=0;Be<q;++Be)Q.setUint16(Pe+Be*2*$,K[ne][ge+Be],!0)}}}for(var be=new Uint16Array(g),Q=new DataView(u.buffer),he=0;he<E;++he){a[e.idx[he]].decoded=!0;var Ue=a[e.idx[he]].type;if(a[he].type==2)for(var Ke=0;Ke<f;++Ke){const j=ce[he][Ke];for(var ye=0;ye<g;++ye)be[ye]=Q.getUint16(j+ye*2*Ue,!0);for(var ye=0;ye<g;++ye)Q.setFloat32(j+ye*2*Ue,x(be[ye]),!0)}}}function ut(e,r,a){for(var s,c=1;c<64;)s=r[e.value],s==65280?c=64:s>>8==255?c+=s&255:(a[c]=s,c++),e.value++}function ht(e,r){r[0]=x(e[0]),r[1]=x(e[1]),r[2]=x(e[5]),r[3]=x(e[6]),r[4]=x(e[14]),r[5]=x(e[15]),r[6]=x(e[27]),r[7]=x(e[28]),r[8]=x(e[2]),r[9]=x(e[4]),r[10]=x(e[7]),r[11]=x(e[13]),r[12]=x(e[16]),r[13]=x(e[26]),r[14]=x(e[29]),r[15]=x(e[42]),r[16]=x(e[3]),r[17]=x(e[8]),r[18]=x(e[12]),r[19]=x(e[17]),r[20]=x(e[25]),r[21]=x(e[30]),r[22]=x(e[41]),r[23]=x(e[43]),r[24]=x(e[9]),r[25]=x(e[11]),r[26]=x(e[18]),r[27]=x(e[24]),r[28]=x(e[31]),r[29]=x(e[40]),r[30]=x(e[44]),r[31]=x(e[53]),r[32]=x(e[10]),r[33]=x(e[19]),r[34]=x(e[23]),r[35]=x(e[32]),r[36]=x(e[39]),r[37]=x(e[45]),r[38]=x(e[52]),r[39]=x(e[54]),r[40]=x(e[20]),r[41]=x(e[22]),r[42]=x(e[33]),r[43]=x(e[38]),r[44]=x(e[46]),r[45]=x(e[51]),r[46]=x(e[55]),r[47]=x(e[60]),r[48]=x(e[21]),r[49]=x(e[34]),r[50]=x(e[37]),r[51]=x(e[47]),r[52]=x(e[50]),r[53]=x(e[56]),r[54]=x(e[59]),r[55]=x(e[61]),r[56]=x(e[35]),r[57]=x(e[36]),r[58]=x(e[48]),r[59]=x(e[49]),r[60]=x(e[57]),r[61]=x(e[58]),r[62]=x(e[62]),r[63]=x(e[63])}function dt(e){const r=.5*Math.cos(.7853975),a=.5*Math.cos(3.14159/16),s=.5*Math.cos(3.14159/8),c=.5*Math.cos(3*3.14159/16),u=.5*Math.cos(5*3.14159/16),g=.5*Math.cos(3*3.14159/8),f=.5*Math.cos(7*3.14159/16);for(var E=new Array(4),_=new Array(4),M=new Array(4),w=new Array(4),oe=0;oe<8;++oe){var I=oe*8;E[0]=s*e[I+2],E[1]=g*e[I+2],E[2]=s*e[I+6],E[3]=g*e[I+6],_[0]=a*e[I+1]+c*e[I+3]+u*e[I+5]+f*e[I+7],_[1]=c*e[I+1]-f*e[I+3]-a*e[I+5]-u*e[I+7],_[2]=u*e[I+1]-a*e[I+3]+f*e[I+5]+c*e[I+7],_[3]=f*e[I+1]-u*e[I+3]+c*e[I+5]-a*e[I+7],M[0]=r*(e[I+0]+e[I+4]),M[3]=r*(e[I+0]-e[I+4]),M[1]=E[0]+E[3],M[2]=E[1]-E[2],w[0]=M[0]+M[1],w[1]=M[3]+M[2],w[2]=M[3]-M[2],w[3]=M[0]-M[1],e[I+0]=w[0]+_[0],e[I+1]=w[1]+_[1],e[I+2]=w[2]+_[2],e[I+3]=w[3]+_[3],e[I+4]=w[3]-_[3],e[I+5]=w[2]-_[2],e[I+6]=w[1]-_[1],e[I+7]=w[0]-_[0]}for(var T=0;T<8;++T)E[0]=s*e[16+T],E[1]=g*e[16+T],E[2]=s*e[48+T],E[3]=g*e[48+T],_[0]=a*e[8+T]+c*e[24+T]+u*e[40+T]+f*e[56+T],_[1]=c*e[8+T]-f*e[24+T]-a*e[40+T]-u*e[56+T],_[2]=u*e[8+T]-a*e[24+T]+f*e[40+T]+c*e[56+T],_[3]=f*e[8+T]-u*e[24+T]+c*e[40+T]-a*e[56+T],M[0]=r*(e[T]+e[32+T]),M[3]=r*(e[T]-e[32+T]),M[1]=E[0]+E[3],M[2]=E[1]-E[2],w[0]=M[0]+M[1],w[1]=M[3]+M[2],w[2]=M[3]-M[2],w[3]=M[0]-M[1],e[0+T]=w[0]+_[0],e[8+T]=w[1]+_[1],e[16+T]=w[2]+_[2],e[24+T]=w[3]+_[3],e[32+T]=w[3]-_[3],e[40+T]=w[2]-_[2],e[48+T]=w[1]-_[1],e[56+T]=w[0]-_[0]}function ft(e){for(var r=0;r<64;++r){var a=e[0][r],s=e[1][r],c=e[2][r];e[0][r]=a+1.5747*c,e[1][r]=a-.1873*s-.4682*c,e[2][r]=a+1.8556*s}}function vt(e,r,a){for(var s=0;s<64;++s)r[a+s]=Ge.toHalfFloat(mt(e[s]))}function mt(e){return e<=1?Math.sign(e)*Math.pow(Math.abs(e),2.2):Math.sign(e)*Math.pow(S,Math.abs(e)-1)}function Dr(e){return new DataView(e.array.buffer,e.offset.value,e.size)}function pt(e){var r=e.viewer.buffer.slice(e.offset.value,e.offset.value+e.size),a=new Uint8Array(Ur(r)),s=new Uint8Array(a.length);return Fr(a),Ar(a,s),new DataView(s.buffer)}function fr(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),a=or(r),s=new Uint8Array(a.length);return Fr(a),Ar(a,s),new DataView(s.buffer)}function gt(e){for(var r=e.viewer,a={value:e.offset.value},s=new Uint16Array(e.width*e.scanlineBlockSize*(e.channels*e.type)),c=new Uint8Array(8192),u=0,g=new Array(e.channels),f=0;f<e.channels;f++)g[f]={},g[f].start=u,g[f].end=g[f].start,g[f].nx=e.width,g[f].ny=e.lines,g[f].size=e.type,u+=g[f].nx*g[f].ny*g[f].size;var E=Ye(r,a),_=Ye(r,a);if(_>=8192)throw"Something is wrong with PIZ_COMPRESSION BITMAP_SIZE";if(E<=_)for(var f=0;f<_-E+1;f++)c[f+E]=He(r,a);var M=new Uint16Array(65536),w=G(c,M),oe=pe(r,a);Rr(e.array,r,a,oe,s,u);for(var f=0;f<e.channels;++f)for(var I=g[f],T=0;T<g[f].size;++T)ot(s,I.start+T,I.nx,I.size,I.ny,I.nx*I.size,w);lt(M,s,u);for(var U=0,k=new Uint8Array(s.buffer.byteLength),V=0;V<e.lines;V++)for(var K=0;K<e.channels;K++){var I=g[K],ce=I.nx*I.size,me=new Uint8Array(s.buffer,I.end*2,ce*2);k.set(me,U),U+=ce*2,I.end+=ce}return new DataView(k.buffer)}function wt(e){var r=e.array.slice(e.offset.value,e.offset.value+e.size),a=or(r);const s=e.lines*e.channels*e.width,c=e.type==1?new Uint16Array(s):new Uint32Array(s);let u=0,g=0;const f=new Array(4);for(let E=0;E<e.lines;E++)for(let _=0;_<e.channels;_++){let M=0;switch(e.type){case 1:f[0]=u,f[1]=f[0]+e.width,u=f[1]+e.width;for(let w=0;w<e.width;++w){const oe=a[f[0]++]<<8|a[f[1]++];M+=oe,c[g]=M,g++}break;case 2:f[0]=u,f[1]=f[0]+e.width,f[2]=f[1]+e.width,u=f[2]+e.width;for(let w=0;w<e.width;++w){const oe=a[f[0]++]<<24|a[f[1]++]<<16|a[f[2]++]<<8;M+=oe,c[g]=M,g++}break}}return new DataView(c.buffer)}function Br(e){var r=e.viewer,a={value:e.offset.value},s=new Uint8Array(e.width*e.lines*(e.channels*e.type*2)),c={version:_e(r,a),unknownUncompressedSize:_e(r,a),unknownCompressedSize:_e(r,a),acCompressedSize:_e(r,a),dcCompressedSize:_e(r,a),rleCompressedSize:_e(r,a),rleUncompressedSize:_e(r,a),rleRawSize:_e(r,a),totalAcUncompressedCount:_e(r,a),totalDcUncompressedCount:_e(r,a),acCompression:_e(r,a)};if(c.version<2)throw"EXRLoader.parse: "+je.compression+" version "+c.version+" is unsupported";for(var u=new Array,g=Ye(r,a)-2;g>0;){var f=nr(r.buffer,a),E=He(r,a),_=E>>2&3,M=(E>>4)-1,w=new Int8Array([M])[0],oe=He(r,a);u.push({name:f,index:w,type:oe,compression:_}),g-=f.length+3}for(var I=je.channels,T=new Array(e.channels),U=0;U<e.channels;++U){var k=T[U]={},V=I[U];k.name=V.name,k.compression=0,k.decoded=!1,k.type=V.pixelType,k.pLinear=V.pLinear,k.width=e.width,k.height=e.lines}for(var K={idx:new Array(3)},ce=0;ce<e.channels;++ce)for(var k=T[ce],U=0;U<u.length;++U){var me=u[U];k.name==me.name&&(k.compression=me.compression,me.index>=0&&(K.idx[me.index]=ce),k.offset=ce)}if(c.acCompressedSize>0)switch(c.acCompression){case 0:var Q=new Uint16Array(c.totalAcUncompressedCount);Rr(e.array,r,a,c.acCompressedSize,Q,c.totalAcUncompressedCount);break;case 1:var q=e.array.slice(a.value,a.value+c.totalAcUncompressedCount),be=or(q),Q=new Uint16Array(be.buffer);a.value+=c.totalAcUncompressedCount;break}if(c.dcCompressedSize>0){var he={array:e.array,offset:a,size:c.dcCompressedSize},Ue=new Uint16Array(fr(he).buffer);a.value+=c.dcCompressedSize}if(c.rleRawSize>0){var q=e.array.slice(a.value,a.value+c.rleCompressedSize),be=or(q),Ke=Ur(be.buffer);a.value+=c.rleCompressedSize}for(var ye=0,j=new Array(T.length),U=0;U<j.length;++U)j[U]=new Array;for(var ve=0;ve<e.lines;++ve)for(var ne=0;ne<T.length;++ne)j[ne].push(ye),ye+=T[ne].width*e.type*2;ct(K,j,T,Q,Ue,s);for(var U=0;U<T.length;++U){var k=T[U];if(!k.decoded)switch(k.compression){case 2:for(var $=0,Ee=0,ve=0;ve<e.lines;++ve){for(var Pe=j[U][$],ge=0;ge<k.width;++ge){for(var Be=0;Be<2*k.type;++Be)s[Pe++]=Ke[Ee+Be*k.width*k.height];Ee++}$++}break;default:throw"EXRLoader.parse: unsupported channel compression"}}return new DataView(s.buffer)}function nr(e,r){for(var a=new Uint8Array(e),s=0;a[r.value+s]!=0;)s+=1;var c=new TextDecoder().decode(a.slice(r.value,r.value+s));return r.value=r.value+s+1,c}function _t(e,r,a){var s=new TextDecoder().decode(new Uint8Array(e).slice(r.value,r.value+a));return r.value=r.value+a,s}function yt(e,r){var a=Xe(e,r),s=pe(e,r);return[a,s]}function Et(e,r){var a=pe(e,r),s=pe(e,r);return[a,s]}function Xe(e,r){var a=e.getInt32(r.value,!0);return r.value=r.value+4,a}function pe(e,r){var a=e.getUint32(r.value,!0);return r.value=r.value+4,a}function kr(e,r){var a=e[r.value];return r.value=r.value+1,a}function He(e,r){var a=e.getUint8(r.value);return r.value=r.value+1,a}const _e=function(e,r){let a;return"getBigInt64"in DataView.prototype?a=Number(e.getBigInt64(r.value,!0)):a=e.getUint32(r.value+4,!0)+Number(e.getUint32(r.value,!0)<<32),r.value+=8,a};function fe(e,r){var a=e.getFloat32(r.value,!0);return r.value+=4,a}function Mt(e,r){return Ge.toHalfFloat(fe(e,r))}function x(e){var r=(e&31744)>>10,a=e&1023;return(e>>15?-1:1)*(r?r===31?a?NaN:1/0:Math.pow(2,r-15)*(1+a/1024):6103515625e-14*(a/1024))}function Ye(e,r){var a=e.getUint16(r.value,!0);return r.value+=2,a}function St(e,r){return x(Ye(e,r))}function xt(e,r,a,s){for(var c=a.value,u=[];a.value<c+s-1;){var g=nr(r,a),f=Xe(e,a),E=He(e,a);a.value+=3;var _=Xe(e,a),M=Xe(e,a);u.push({name:g,pixelType:f,pLinear:E,xSampling:_,ySampling:M})}return a.value+=1,u}function It(e,r){var a=fe(e,r),s=fe(e,r),c=fe(e,r),u=fe(e,r),g=fe(e,r),f=fe(e,r),E=fe(e,r),_=fe(e,r);return{redX:a,redY:s,greenX:c,greenY:u,blueX:g,blueY:f,whiteX:E,whiteY:_}}function Ct(e,r){var a=["NO_COMPRESSION","RLE_COMPRESSION","ZIPS_COMPRESSION","ZIP_COMPRESSION","PIZ_COMPRESSION","PXR24_COMPRESSION","B44_COMPRESSION","B44A_COMPRESSION","DWAA_COMPRESSION","DWAB_COMPRESSION"],s=He(e,r);return a[s]}function Tt(e,r){var a=pe(e,r),s=pe(e,r),c=pe(e,r),u=pe(e,r);return{xMin:a,yMin:s,xMax:c,yMax:u}}function bt(e,r){var a=["INCREASING_Y"],s=He(e,r);return a[s]}function Rt(e,r){var a=fe(e,r),s=fe(e,r);return[a,s]}function Ft(e,r){var a=fe(e,r),s=fe(e,r),c=fe(e,r);return[a,s,c]}function At(e,r,a,s,c){if(s==="string"||s==="stringvector"||s==="iccProfile")return _t(r,a,c);if(s==="chlist")return xt(e,r,a,c);if(s==="chromaticities")return It(e,a);if(s==="compression")return Ct(e,a);if(s==="box2i")return Tt(e,a);if(s==="lineOrder")return bt(e,a);if(s==="float")return fe(e,a);if(s==="v2f")return Rt(e,a);if(s==="v3f")return Ft(e,a);if(s==="int")return Xe(e,a);if(s==="rational")return yt(e,a);if(s==="timecode")return Et(e,a);if(s==="preview")return a.value+=c,"skipped";a.value+=c}function Ut(e,r,a){const s={};if(e.getUint32(0,!0)!=20000630)throw"THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.";s.version=e.getUint8(4);const c=e.getUint8(5);s.spec={singleTile:!!(c&2),longName:!!(c&4),deepFormat:!!(c&8),multiPart:!!(c&16)},a.value=8;for(var u=!0;u;){var g=nr(r,a);if(g==0)u=!1;else{var f=nr(r,a),E=pe(e,a),_=At(e,r,a,f,E);_===void 0?console.warn(`EXRLoader.parse: skipped unknown header attribute type '${f}'.`):s[g]=_}}if((c&-5)!=0)throw console.error("EXRHeader:",s),"THREE.EXRLoader: provided file is currently unsupported.";return s}function Dt(e,r,a,s,c){const u={size:0,viewer:r,array:a,offset:s,width:e.dataWindow.xMax-e.dataWindow.xMin+1,height:e.dataWindow.yMax-e.dataWindow.yMin+1,channels:e.channels.length,bytesPerLine:null,lines:null,inputSize:null,type:e.channels[0].pixelType,uncompress:null,getter:null,format:null,[Je?"colorSpace":"encoding"]:null};switch(e.compression){case"NO_COMPRESSION":u.lines=1,u.uncompress=Dr;break;case"RLE_COMPRESSION":u.lines=1,u.uncompress=pt;break;case"ZIPS_COMPRESSION":u.lines=1,u.uncompress=fr;break;case"ZIP_COMPRESSION":u.lines=16,u.uncompress=fr;break;case"PIZ_COMPRESSION":u.lines=32,u.uncompress=gt;break;case"PXR24_COMPRESSION":u.lines=16,u.uncompress=wt;break;case"DWAA_COMPRESSION":u.lines=32,u.uncompress=Br;break;case"DWAB_COMPRESSION":u.lines=256,u.uncompress=Br;break;default:throw"EXRLoader.parse: "+e.compression+" is unsupported"}if(u.scanlineBlockSize=u.lines,u.type==1)switch(c){case Re:u.getter=St,u.inputSize=2;break;case we:u.getter=Ye,u.inputSize=2;break}else if(u.type==2)switch(c){case Re:u.getter=fe,u.inputSize=4;break;case we:u.getter=Mt,u.inputSize=4}else throw"EXRLoader.parse: unsupported pixelType "+u.type+" for "+e.compression+".";u.blockCount=(e.dataWindow.yMax+1)/u.scanlineBlockSize;for(var g=0;g<u.blockCount;g++)_e(r,s);u.outputChannels=u.channels==3?4:u.channels;const f=u.width*u.height*u.outputChannels;switch(c){case Re:u.byteArray=new Float32Array(f),u.channels<u.outputChannels&&u.byteArray.fill(1,0,f);break;case we:u.byteArray=new Uint16Array(f),u.channels<u.outputChannels&&u.byteArray.fill(15360,0,f);break;default:console.error("THREE.EXRLoader: unsupported type: ",c);break}return u.bytesPerLine=u.width*u.inputSize*u.channels,u.outputChannels==4?u.format=rr:u.format=Lt,Je?u.colorSpace="srgb-linear":u.encoding=3e3,u}const ir=new DataView(t),Bt=new Uint8Array(t),Ve={value:0},je=Ut(ir,t,Ve),L=Dt(je,ir,Bt,Ve,this.type),Or={value:0},kt={R:0,G:1,B:2,A:3,Y:0};for(let e=0;e<L.height/L.scanlineBlockSize;e++){const r=pe(ir,Ve);L.size=pe(ir,Ve),L.lines=r+L.scanlineBlockSize>L.height?L.height-r:L.scanlineBlockSize;const s=L.size<L.lines*L.bytesPerLine?L.uncompress(L):Dr(L);Ve.value+=L.size;for(let c=0;c<L.scanlineBlockSize;c++){const u=c+e*L.scanlineBlockSize;if(u>=L.height)break;for(let g=0;g<L.channels;g++){const f=kt[je.channels[g].name];for(let E=0;E<L.width;E++){Or.value=(c*(L.channels*L.width)+g*L.width+E)*L.inputSize;const _=(L.height-1-u)*(L.width*L.outputChannels)+E*L.outputChannels+f;L.byteArray[_]=L.getter(s,Or)}}}}return{header:je,width:L.width,height:L.height,data:L.byteArray,format:L.format,[Je?"colorSpace":"encoding"]:L[Je?"colorSpace":"encoding"],type:this.type}}setDataType(t){return this.type=t,this}load(t,i,o,l){function h(d,y){Je?d.colorSpace=y.colorSpace:d.encoding=y.encoding,d.minFilter=Se,d.magFilter=Se,d.generateMipmaps=!1,d.flipY=!1,i&&i(d,y)}return super.load(t,h,o,l)}}function ba(n,t,i,o){var l;return l=class extends hr{constructor(h){super({vertexShader:t,fragmentShader:i,...h});for(const d in n)this.uniforms[d]=new Pt(n[d]),Object.defineProperty(this,d,{get(){return this.uniforms[d].value},set(y){this.uniforms[d].value=y}});this.uniforms=zt.clone(this.uniforms)}},l.key=Ht.generateUUID(),l}function Pr(n,t,i){const o=ze(A=>A.size),l=ze(A=>A.viewport),h=typeof n=="number"?n:o.width*l.dpr,d=o.height*l.dpr,y=(typeof n=="number"?i:n)||{},{samples:m=0,depth:p,...F}=y,b=p??y.depthBuffer,C=P.useMemo(()=>{const A=new Er(h,d,{minFilter:Se,magFilter:Se,type:we,...F});return b&&(A.depthTexture=new Gt(h,d,Re)),A.samples=m,A},[]);return P.useLayoutEffect(()=>{C.setSize(h,d),m&&(C.samples=m)},[m,C,h,d]),P.useEffect(()=>()=>C.dispose(),[]),C}const Ra=ba({},"void main() { }","void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }");class Fa extends Wt{constructor(t=6,i=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new $t("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=o=>{o.uniforms={...o.uniforms,...this.uniforms},this.anisotropy>0&&(o.defines.USE_ANISOTROPY=""),i?o.defines.USE_SAMPLER="":o.defines.USE_TRANSMISSION="",o.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+o.fragmentShader,o.fragmentShader=o.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
            // Direction of refracted light.
            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
            // Compute rotation-independant scaling of the model matrix.
            vec3 modelScale;
            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
            if ( isinf( attenuationDistance ) ) {
              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
              return radiance;
            } else {
              // Compute light attenuation using Beer's law.
              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
              return transmittance * radiance;
            }
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in vec3 attenuationColor, const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
            // Get the specular component.
            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),o.fragmentShader=o.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        vec3 pos = vWorldPosition;
        float runningSeed = 0.0;
        vec3 v = normalize( cameraPosition - pos );
        vec3 n = inverseTransformDirection( normal, viewMatrix );
        vec3 transmission = vec3(0.0);
        float transmissionR, transmissionB, transmissionG;
        float randomCoords = rand(runningSeed++);
        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
        vec3 distortionNormal = vec3(0.0);
        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
        if (distortion > 0.0) {
          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
        }
        for (float i = 0.0; i < ${t}.0; i ++) {
          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
          transmissionR = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${t}),
            material.attenuationColor, material.attenuationDistance
          ).r;
          transmissionG = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${t})) , material.thickness + thickness_smear * (i + randomCoords) / float(${t}),
            material.attenuationColor, material.attenuationDistance
          ).g;
          transmissionB = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${t})), material.thickness + thickness_smear * (i + randomCoords) / float(${t}),
            material.attenuationColor, material.attenuationDistance
          ).b;
          transmission.r += transmissionR;
          transmission.g += transmissionG;
          transmission.b += transmissionB;
        }
        transmission /= ${t}.0;
        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`)},Object.keys(this.uniforms).forEach(o=>Object.defineProperty(this,o,{get:()=>this.uniforms[o].value,set:l=>this.uniforms[o].value=l}))}}const Ka=P.forwardRef(({buffer:n,transmissionSampler:t=!1,backside:i=!1,side:o=Zt,transmission:l=1,thickness:h=0,backsideThickness:d=0,backsideEnvMapIntensity:y=1,samples:m=10,resolution:p,backsideResolution:F,background:b,anisotropy:C,anisotropicBlur:A,...Z},ue)=>{Gr({MeshTransmissionMaterial:Fa});const N=P.useRef(null),[ie]=P.useState(()=>new Ra),re=Pr(F||p),le=Pr(p);let se,z,D,B;return Zr(v=>{if(N.current.time=v.clock.elapsedTime,N.current.buffer===le.texture&&!t){var S;B=(S=N.current.__r3f.parent)==null?void 0:S.object,B&&(D=v.gl.toneMapping,se=v.scene.background,z=N.current.envMapIntensity,v.gl.toneMapping=Xt,b&&(v.scene.background=b),B.material=ie,i&&(v.gl.setRenderTarget(re),v.gl.render(v.scene,v.camera),B.material=N.current,B.material.buffer=re.texture,B.material.thickness=d,B.material.side=Yt,B.material.envMapIntensity=y),v.gl.setRenderTarget(le),v.gl.render(v.scene,v.camera),B.material=N.current,B.material.thickness=h,B.material.side=o,B.material.buffer=le.texture,B.material.envMapIntensity=z,v.scene.background=se,v.gl.setRenderTarget(null),v.gl.toneMapping=D)}}),P.useImperativeHandle(ue,()=>N.current,[]),P.createElement("meshTransmissionMaterial",Wr({args:[m,t],ref:N},Z,{buffer:n||le.texture,_transmission:l,anisotropicBlur:A??C,transmission:t?l:0,thickness:h,side:o}))}),et=(n,t,i)=>{let o;switch(n){case gr:o=new Uint8ClampedArray(t*i*4);break;case we:o=new Uint16Array(t*i*4);break;case ra:o=new Uint32Array(t*i*4);break;case ea:o=new Int8Array(t*i*4);break;case Qt:o=new Int16Array(t*i*4);break;case Jt:o=new Int32Array(t*i*4);break;case Re:o=new Float32Array(t*i*4);break;default:throw new Error("Unsupported data type")}return o};let sr;const Aa=(n,t,i,o)=>{if(sr!==void 0)return sr;const l=new Er(1,1,o);t.setRenderTarget(l);const h=new yr(new Xr,new qt({color:16777215}));t.render(h,i),t.setRenderTarget(null);const d=et(n,l.width,l.height);return t.readRenderTargetPixels(l,0,0,l.width,l.height,d),l.dispose(),h.geometry.dispose(),h.material.dispose(),sr=d[0]!==0,sr};class Mr{_renderer;_rendererIsDisposable=!1;_material;_scene;_camera;_quad;_renderTarget;_width;_height;_type;_colorSpace;_supportsReadPixels=!0;constructor(t){this._width=t.width,this._height=t.height,this._type=t.type,this._colorSpace=t.colorSpace;const i={format:rr,depthBuffer:!1,stencilBuffer:!1,type:this._type,colorSpace:this._colorSpace,anisotropy:t.renderTargetOptions?.anisotropy!==void 0?t.renderTargetOptions?.anisotropy:1,generateMipmaps:t.renderTargetOptions?.generateMipmaps!==void 0?t.renderTargetOptions?.generateMipmaps:!1,magFilter:t.renderTargetOptions?.magFilter!==void 0?t.renderTargetOptions?.magFilter:Se,minFilter:t.renderTargetOptions?.minFilter!==void 0?t.renderTargetOptions?.minFilter:Se,samples:t.renderTargetOptions?.samples!==void 0?t.renderTargetOptions?.samples:void 0,wrapS:t.renderTargetOptions?.wrapS!==void 0?t.renderTargetOptions?.wrapS:Oe,wrapT:t.renderTargetOptions?.wrapT!==void 0?t.renderTargetOptions?.wrapT:Oe};if(this._material=t.material,t.renderer?this._renderer=t.renderer:(this._renderer=Mr.instantiateRenderer(),this._rendererIsDisposable=!0),this._scene=new $r,this._camera=new Vt,this._camera.position.set(0,0,10),this._camera.left=-.5,this._camera.right=.5,this._camera.top=.5,this._camera.bottom=-.5,this._camera.updateProjectionMatrix(),!Aa(this._type,this._renderer,this._camera,i)){let o;this._type===we&&(o=this._renderer.extensions.has("EXT_color_buffer_float")?Re:void 0),o!==void 0?(console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${Re}`),this._type=o):(this._supportsReadPixels=!1,console.warn("This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown"))}this._quad=new yr(new Xr,this._material),this._quad.geometry.computeBoundingBox(),this._scene.add(this._quad),this._renderTarget=new Er(this.width,this.height,i),this._renderTarget.texture.mapping=t.renderTargetOptions?.mapping!==void 0?t.renderTargetOptions?.mapping:cr}static instantiateRenderer(){const t=new jt;return t.setSize(128,128),t}render=()=>{this._renderer.setRenderTarget(this._renderTarget);try{this._renderer.render(this._scene,this._camera)}catch(t){throw this._renderer.setRenderTarget(null),t}this._renderer.setRenderTarget(null)};toArray(){if(!this._supportsReadPixels)throw new Error("Can't read pixels in this browser");const t=et(this._type,this._width,this._height);return this._renderer.readRenderTargetPixels(this._renderTarget,0,0,this._width,this._height,t),t}toDataTexture(t){const i=new Kt(this.toArray(),this.width,this.height,rr,this._type,t?.mapping||cr,t?.wrapS||Oe,t?.wrapT||Oe,t?.magFilter||Se,t?.minFilter||Se,t?.anisotropy||1,pr);return i.generateMipmaps=t?.generateMipmaps!==void 0?t?.generateMipmaps:!1,i}disposeOnDemandRenderer(){this._renderer.setRenderTarget(null),this._rendererIsDisposable&&(this._renderer.dispose(),this._renderer.forceContextLoss())}dispose(t){this.disposeOnDemandRenderer(),t&&this.renderTarget.dispose(),this.material instanceof hr&&Object.values(this.material.uniforms).forEach(i=>{i.value instanceof Ze&&i.value.dispose()}),Object.values(this.material).forEach(i=>{i instanceof Ze&&i.dispose()}),this.material.dispose(),this._quad.geometry.dispose()}get width(){return this._width}set width(t){this._width=t,this._renderTarget.setSize(this._width,this._height)}get height(){return this._height}set height(t){this._height=t,this._renderTarget.setSize(this._width,this._height)}get renderer(){return this._renderer}get renderTarget(){return this._renderTarget}set renderTarget(t){this._renderTarget=t,this._width=t.width,this._height=t.height}get material(){return this._material}get type(){return this._type}get colorSpace(){return this._colorSpace}}class rt extends Error{}class tt extends Error{}const Qe=(n,t,i)=>{const o=new RegExp(`${t}="([^"]*)"`,"i").exec(n);if(o)return o[1];const l=new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`,"i").exec(n);if(l){const h=l[1].match(/<rdf:li>([^<]*)<\/rdf:li>/g);return h&&h.length===3?h.map(d=>d.replace(/<\/?rdf:li>/g,"")):l[1].trim()}if(i!==void 0)return i;throw new Error(`Can't find ${t} in gainmap metadata`)},Ua=n=>{let t;typeof TextDecoder<"u"?t=new TextDecoder().decode(n):t=n.toString();let i=t.indexOf("<x:xmpmeta");for(;i!==-1;){const o=t.indexOf("x:xmpmeta>",i),l=t.slice(i,o+10);try{const h=Qe(l,"hdrgm:GainMapMin","0"),d=Qe(l,"hdrgm:GainMapMax"),y=Qe(l,"hdrgm:Gamma","1"),m=Qe(l,"hdrgm:OffsetSDR","0.015625"),p=Qe(l,"hdrgm:OffsetHDR","0.015625"),F=/hdrgm:HDRCapacityMin="([^"]*)"/.exec(l),b=F?F[1]:"0",C=/hdrgm:HDRCapacityMax="([^"]*)"/.exec(l);if(!C)throw new Error("Incomplete gainmap metadata");const A=C[1];return{gainMapMin:Array.isArray(h)?h.map(Z=>parseFloat(Z)):[parseFloat(h),parseFloat(h),parseFloat(h)],gainMapMax:Array.isArray(d)?d.map(Z=>parseFloat(Z)):[parseFloat(d),parseFloat(d),parseFloat(d)],gamma:Array.isArray(y)?y.map(Z=>parseFloat(Z)):[parseFloat(y),parseFloat(y),parseFloat(y)],offsetSdr:Array.isArray(m)?m.map(Z=>parseFloat(Z)):[parseFloat(m),parseFloat(m),parseFloat(m)],offsetHdr:Array.isArray(p)?p.map(Z=>parseFloat(Z)):[parseFloat(p),parseFloat(p),parseFloat(p)],hdrCapacityMin:parseFloat(b),hdrCapacityMax:parseFloat(A)}}catch{}i=t.indexOf("<x:xmpmeta",o)}};class Da{options;constructor(t){this.options={debug:t&&t.debug!==void 0?t.debug:!1,extractFII:t&&t.extractFII!==void 0?t.extractFII:!0,extractNonFII:t&&t.extractNonFII!==void 0?t.extractNonFII:!0}}extract(t){return new Promise((i,o)=>{const l=this.options.debug,h=new DataView(t.buffer);if(h.getUint16(0)!==65496){o(new Error("Not a valid jpeg"));return}const d=h.byteLength;let y=2,m=0,p;for(;y<d;){if(++m>250){o(new Error(`Found no marker after ${m} loops 😵`));return}if(h.getUint8(y)!==255){o(new Error(`Not a valid marker at offset 0x${y.toString(16)}, found: 0x${h.getUint8(y).toString(16)}`));return}if(p=h.getUint8(y+1),l&&console.log(`Marker: ${p.toString(16)}`),p===226){l&&console.log("Found APP2 marker (0xffe2)");const F=y+4;if(h.getUint32(F)===1297106432){const b=F+4;let C;if(h.getUint16(b)===18761)C=!1;else if(h.getUint16(b)===19789)C=!0;else{o(new Error("No valid endianness marker found in TIFF header"));return}if(h.getUint16(b+2,!C)!==42){o(new Error("Not valid TIFF data! (no 0x002A marker)"));return}const A=h.getUint32(b+4,!C);if(A<8){o(new Error("Not valid TIFF data! (First offset less than 8)"));return}const Z=b+A,ue=h.getUint16(Z,!C),N=Z+2;let ie=0;for(let z=N;z<N+12*ue;z+=12)h.getUint16(z,!C)===45057&&(ie=h.getUint32(z+8,!C));const le=Z+2+ue*12+4,se=[];for(let z=le;z<le+ie*16;z+=16){const D={MPType:h.getUint32(z,!C),size:h.getUint32(z+4,!C),dataOffset:h.getUint32(z+8,!C),dependantImages:h.getUint32(z+12,!C),start:-1,end:-1,isFII:!1};D.dataOffset?(D.start=b+D.dataOffset,D.isFII=!1):(D.start=0,D.isFII=!0),D.end=D.start+D.size,se.push(D)}if(this.options.extractNonFII&&se.length){const z=new Blob([h]),D=[];for(const B of se){if(B.isFII&&!this.options.extractFII)continue;const v=z.slice(B.start,B.end+1,"image/jpeg");D.push(v)}i(D)}}}y+=2+h.getUint16(y+2)}})}}const Ba=async n=>{const t=Ua(n);if(!t)throw new tt("Gain map XMP metadata not found");const o=await new Da({extractFII:!0,extractNonFII:!0}).extract(n);if(o.length!==2)throw new rt("Gain map recovery image not found");return{sdr:new Uint8Array(await o[0].arrayBuffer()),gainMap:new Uint8Array(await o[1].arrayBuffer()),metadata:t}},zr=n=>new Promise((t,i)=>{const o=document.createElement("img");o.onload=()=>{t(o)},o.onerror=l=>{i(l)},o.src=URL.createObjectURL(n)});class ka extends ta{_renderer;_renderTargetOptions;_internalLoadingManager;_config;constructor(t,i){super(i),this._config=t,t.renderer&&(this._renderer=t.renderer),this._internalLoadingManager=new aa}setRenderer(t){return this._renderer=t,this}setRenderTargetOptions(t){return this._renderTargetOptions=t,this}prepareQuadRenderer(){this._renderer||console.warn("WARNING: A Renderer was not passed to this Loader constructor or in setRenderer, the result of this Loader will need to be converted to a Data Texture with toDataTexture() before you can use it in your renderer.");const t=this._config.createMaterial({gainMapMax:[1,1,1],gainMapMin:[0,0,0],gamma:[1,1,1],offsetHdr:[1,1,1],offsetSdr:[1,1,1],hdrCapacityMax:1,hdrCapacityMin:0,maxDisplayBoost:1,gainMap:new Ze,sdr:new Ze});return this._config.createQuadRenderer({width:16,height:16,type:we,colorSpace:pr,material:t,renderer:this._renderer,renderTargetOptions:this._renderTargetOptions})}async processImages(t,i,o){const l=i?new Blob([i],{type:"image/jpeg"}):void 0,h=new Blob([t],{type:"image/jpeg"});let d,y,m=!1;if(typeof createImageBitmap>"u"){const p=await Promise.all([l?zr(l):Promise.resolve(void 0),zr(h)]);y=p[0],d=p[1],m=o==="flipY"}else{const p=await Promise.all([l?createImageBitmap(l,{imageOrientation:o||"flipY"}):Promise.resolve(void 0),createImageBitmap(h,{imageOrientation:o||"flipY"})]);y=p[0],d=p[1]}return{sdrImage:d,gainMapImage:y,needsFlip:m}}createTextures(t,i,o){const l=new Ze(i||new ImageData(2,2),cr,Oe,Oe,Se,Nr,rr,gr,1,pr);l.flipY=o,l.needsUpdate=!0;const h=new Ze(t,cr,Oe,Oe,Se,Nr,rr,gr,1,na);return h.flipY=o,h.needsUpdate=!0,{gainMap:l,sdr:h}}updateQuadRenderer(t,i,o,l,h){t.width=i.width,t.height=i.height,t.material.gainMap=o,t.material.sdr=l,t.material.gainMapMin=h.gainMapMin,t.material.gainMapMax=h.gainMapMax,t.material.offsetHdr=h.offsetHdr,t.material.offsetSdr=h.offsetSdr,t.material.gamma=h.gamma,t.material.hdrCapacityMin=h.hdrCapacityMin,t.material.hdrCapacityMax=h.hdrCapacityMax,t.material.maxDisplayBoost=Math.pow(2,h.hdrCapacityMax),t.material.needsUpdate=!0}}const Oa=`
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Na=`
// min half float value
#define HALF_FLOAT_MIN vec3( -65504, -65504, -65504 )
// max half float value
#define HALF_FLOAT_MAX vec3( 65504, 65504, 65504 )

uniform sampler2D sdr;
uniform sampler2D gainMap;
uniform vec3 gamma;
uniform vec3 offsetHdr;
uniform vec3 offsetSdr;
uniform vec3 gainMapMin;
uniform vec3 gainMapMax;
uniform float weightFactor;

varying vec2 vUv;

void main() {
  vec3 rgb = texture2D( sdr, vUv ).rgb;
  vec3 recovery = texture2D( gainMap, vUv ).rgb;
  vec3 logRecovery = pow( recovery, gamma );
  vec3 logBoost = gainMapMin * ( 1.0 - logRecovery ) + gainMapMax * logRecovery;
  vec3 hdrColor = (rgb + offsetSdr) * exp2( logBoost * weightFactor ) - offsetHdr;
  vec3 clampedHdrColor = max( HALF_FLOAT_MIN, min( HALF_FLOAT_MAX, hdrColor ));
  gl_FragColor = vec4( clampedHdrColor , 1.0 );
}
`;class La extends hr{_maxDisplayBoost;_hdrCapacityMin;_hdrCapacityMax;constructor({gamma:t,offsetHdr:i,offsetSdr:o,gainMapMin:l,gainMapMax:h,maxDisplayBoost:d,hdrCapacityMin:y,hdrCapacityMax:m,sdr:p,gainMap:F}){super({name:"GainMapDecoderMaterial",vertexShader:Oa,fragmentShader:Na,uniforms:{sdr:{value:p},gainMap:{value:F},gamma:{value:new qe(1/t[0],1/t[1],1/t[2])},offsetHdr:{value:new qe().fromArray(i)},offsetSdr:{value:new qe().fromArray(o)},gainMapMin:{value:new qe().fromArray(l)},gainMapMax:{value:new qe().fromArray(h)},weightFactor:{value:(Math.log2(d)-y)/(m-y)}},blending:ia,depthTest:!1,depthWrite:!1}),this._maxDisplayBoost=d,this._hdrCapacityMin=y,this._hdrCapacityMax=m,this.needsUpdate=!0,this.uniformsNeedUpdate=!0}get sdr(){return this.uniforms.sdr.value}set sdr(t){this.uniforms.sdr.value=t}get gainMap(){return this.uniforms.gainMap.value}set gainMap(t){this.uniforms.gainMap.value=t}get offsetHdr(){return this.uniforms.offsetHdr.value.toArray()}set offsetHdr(t){this.uniforms.offsetHdr.value.fromArray(t)}get offsetSdr(){return this.uniforms.offsetSdr.value.toArray()}set offsetSdr(t){this.uniforms.offsetSdr.value.fromArray(t)}get gainMapMin(){return this.uniforms.gainMapMin.value.toArray()}set gainMapMin(t){this.uniforms.gainMapMin.value.fromArray(t)}get gainMapMax(){return this.uniforms.gainMapMax.value.toArray()}set gainMapMax(t){this.uniforms.gainMapMax.value.fromArray(t)}get gamma(){const t=this.uniforms.gamma.value;return[1/t.x,1/t.y,1/t.z]}set gamma(t){const i=this.uniforms.gamma.value;i.x=1/t[0],i.y=1/t[1],i.z=1/t[2]}get hdrCapacityMin(){return this._hdrCapacityMin}set hdrCapacityMin(t){this._hdrCapacityMin=t,this.calculateWeight()}get hdrCapacityMax(){return this._hdrCapacityMax}set hdrCapacityMax(t){this._hdrCapacityMax=t,this.calculateWeight()}get maxDisplayBoost(){return this._maxDisplayBoost}set maxDisplayBoost(t){this._maxDisplayBoost=Math.max(1,Math.min(65504,t)),this.calculateWeight()}calculateWeight(){const t=(Math.log2(this._maxDisplayBoost)-this._hdrCapacityMin)/(this._hdrCapacityMax-this._hdrCapacityMin);this.uniforms.weightFactor.value=Math.max(0,Math.min(1,t))}}class at extends ka{constructor(t,i){super({renderer:t,createMaterial:o=>new La(o),createQuadRenderer:o=>new Mr(o)},i)}async render(t,i,o,l){const{sdrImage:h,gainMapImage:d,needsFlip:y}=await this.processImages(o,l,"flipY"),{gainMap:m,sdr:p}=this.createTextures(h,d,y);this.updateQuadRenderer(t,h,m,p,i),t.render()}}class Pa extends at{load([t,i,o],l,h,d){const y=this.prepareQuadRenderer();let m,p,F;const b=async()=>{if(m&&p&&F){try{await this.render(y,F,m,p)}catch(S){this.manager.itemError(t),this.manager.itemError(i),this.manager.itemError(o),typeof d=="function"&&d(S),y.disposeOnDemandRenderer();return}typeof l=="function"&&l(y),this.manager.itemEnd(t),this.manager.itemEnd(i),this.manager.itemEnd(o),y.disposeOnDemandRenderer()}};let C=!0,A=0,Z=0,ue=!0,N=0,ie=0,re=!0,le=0,se=0;const z=()=>{if(typeof h=="function"){const S=A+N+le,G=Z+ie+se,X=C&&ue&&re;h(new ProgressEvent("progress",{lengthComputable:X,loaded:G,total:S}))}};this.manager.itemStart(t),this.manager.itemStart(i),this.manager.itemStart(o);const D=new lr(this._internalLoadingManager);D.setResponseType("arraybuffer"),D.setRequestHeader(this.requestHeader),D.setPath(this.path),D.setWithCredentials(this.withCredentials),D.load(t,async S=>{if(typeof S=="string")throw new Error("Invalid sdr buffer");m=S,await b()},S=>{C=S.lengthComputable,Z=S.loaded,A=S.total,z()},S=>{this.manager.itemError(t),typeof d=="function"&&d(S)});const B=new lr(this._internalLoadingManager);B.setResponseType("arraybuffer"),B.setRequestHeader(this.requestHeader),B.setPath(this.path),B.setWithCredentials(this.withCredentials),B.load(i,async S=>{if(typeof S=="string")throw new Error("Invalid gainmap buffer");p=S,await b()},S=>{ue=S.lengthComputable,ie=S.loaded,N=S.total,z()},S=>{this.manager.itemError(i),typeof d=="function"&&d(S)});const v=new lr(this._internalLoadingManager);return v.setRequestHeader(this.requestHeader),v.setPath(this.path),v.setWithCredentials(this.withCredentials),v.load(o,async S=>{if(typeof S!="string")throw new Error("Invalid metadata string");F=JSON.parse(S),await b()},S=>{re=S.lengthComputable,se=S.loaded,le=S.total,z()},S=>{this.manager.itemError(o),typeof d=="function"&&d(S)}),y}}class za extends at{load(t,i,o,l){const h=this.prepareQuadRenderer(),d=new lr(this._internalLoadingManager);return d.setResponseType("arraybuffer"),d.setRequestHeader(this.requestHeader),d.setPath(this.path),d.setWithCredentials(this.withCredentials),this.manager.itemStart(t),d.load(t,async y=>{if(typeof y=="string")throw new Error("Invalid buffer, received [string], was expecting [ArrayBuffer]");const m=new Uint8Array(y);let p,F,b;try{const C=await Ba(m);p=C.sdr,F=C.gainMap,b=C.metadata}catch(C){if(C instanceof tt||C instanceof rt)console.warn(`Failure to reconstruct an HDR image from ${t}: Gain map metadata not found in the file, HDRJPGLoader will render the SDR jpeg`),b={gainMapMin:[0,0,0],gainMapMax:[1,1,1],gamma:[1,1,1],hdrCapacityMin:0,hdrCapacityMax:1,offsetHdr:[0,0,0],offsetSdr:[0,0,0]},p=m;else throw C}try{await this.render(h,b,p.buffer,F?.buffer)}catch(C){this.manager.itemError(t),typeof l=="function"&&l(C),h.disposeOnDemandRenderer();return}typeof i=="function"&&i(h),this.manager.itemEnd(t),h.disposeOnDemandRenderer()},o,y=>{this.manager.itemError(t),typeof l=="function"&&l(y)}),h}}const tr={apartment:"lebombo_1k.hdr",city:"potsdamer_platz_1k.hdr",dawn:"kiara_1_dawn_1k.hdr",forest:"forest_slope_1k.hdr",lobby:"st_fagans_interior_1k.hdr",night:"dikhololo_night_1k.hdr",park:"rooitou_park_1k.hdr",studio:"studio_small_03_1k.hdr",sunset:"venice_sunset_1k.hdr",warehouse:"empty_warehouse_01_1k.hdr"},nt="https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/",We=n=>Array.isArray(n),Sr=["/px.png","/nx.png","/py.png","/ny.png","/pz.png","/nz.png"];function dr({files:n=Sr,path:t="",preset:i=void 0,colorSpace:o=void 0,extensions:l}={}){i&&(xr(i),n=tr[i],t=nt);const h=We(n),{extension:d,isCubemap:y}=Ir(n),m=Cr(d);if(!m)throw new Error("useEnvironment: Unrecognized file extension: "+n);const p=ze(A=>A.gl);P.useLayoutEffect(()=>{if(d!=="webp"&&d!=="jpg"&&d!=="jpeg")return;function A(){ur.clear(m,h?[n]:n)}p.domElement.addEventListener("webglcontextlost",A,{once:!0})},[n,p.domElement]);const F=ur(m,h?[n]:n,A=>{(d==="webp"||d==="jpg"||d==="jpeg")&&A.setRenderer(p),A.setPath==null||A.setPath(t),l&&l(A)});let b=h?F[0]:F;if(d==="jpg"||d==="jpeg"||d==="webp"){var C;b=(C=b.renderTarget)==null?void 0:C.texture}return b.mapping=y?oa:sa,b.colorSpace=o??(y?"srgb":"srgb-linear"),b}const Ha={files:Sr,path:"",preset:void 0,extensions:void 0};dr.preload=n=>{const t={...Ha,...n};let{files:i,path:o=""}=t;const{preset:l,extensions:h}=t;l&&(xr(l),i=tr[l],o=nt);const{extension:d}=Ir(i);if(d==="webp"||d==="jpg"||d==="jpeg")throw new Error("useEnvironment: Preloading gainmaps is not supported");const y=Cr(d);if(!y)throw new Error("useEnvironment: Unrecognized file extension: "+i);ur.preload(y,We(i)?[i]:i,m=>{m.setPath==null||m.setPath(o),h&&h(m)})};const Ga={files:Sr,preset:void 0};dr.clear=n=>{const t={...Ga,...n};let{files:i}=t;const{preset:o}=t;o&&(xr(o),i=tr[o]);const{extension:l}=Ir(i),h=Cr(l);if(!h)throw new Error("useEnvironment: Unrecognized file extension: "+i);ur.clear(h,We(i)?[i]:i)};function xr(n){if(!(n in tr))throw new Error("Preset must be one of: "+Object.keys(tr).join(", "))}function Ir(n){var t;const i=We(n)&&n.length===6,o=We(n)&&n.length===3&&n.some(d=>d.endsWith("json")),l=We(n)?n[0]:n;return{extension:i?"cube":o?"webp":l.startsWith("data:application/exr")?"exr":l.startsWith("data:application/hdr")?"hdr":l.startsWith("data:image/jpeg")?"jpg":(t=l.split(".").pop())==null||(t=t.split("?"))==null||(t=t.shift())==null?void 0:t.toLowerCase(),isCubemap:i,isGainmap:o}}function Cr(n){return n==="cube"?la:n==="hdr"?Ca:n==="exr"?Ta:n==="jpg"||n==="jpeg"?za:n==="webp"?Pa:null}const Za=n=>n.current&&n.current.isScene,Wa=n=>Za(n)?n.current:n;function Tr(n,t,i,o,l={}){var h,d,y,m;l={backgroundBlurriness:0,backgroundIntensity:1,backgroundRotation:[0,0,0],environmentIntensity:1,environmentRotation:[0,0,0],...l};const p=Wa(t||i),F=p.background,b=p.environment,C={backgroundBlurriness:p.backgroundBlurriness,backgroundIntensity:p.backgroundIntensity,backgroundRotation:(h=(d=p.backgroundRotation)==null||d.clone==null?void 0:d.clone())!==null&&h!==void 0?h:[0,0,0],environmentIntensity:p.environmentIntensity,environmentRotation:(y=(m=p.environmentRotation)==null||m.clone==null?void 0:m.clone())!==null&&y!==void 0?y:[0,0,0]};return n!=="only"&&(p.environment=o),n&&(p.background=o),Lr(p,l),()=>{n!=="only"&&(p.environment=b),n&&(p.background=F),Lr(p,C)}}function br({scene:n,background:t=!1,map:i,...o}){const l=ze(h=>h.scene);return P.useLayoutEffect(()=>{if(i)return Tr(t,n,l,i,o)}),null}function it({background:n=!1,scene:t,blur:i,backgroundBlurriness:o,backgroundIntensity:l,backgroundRotation:h,environmentIntensity:d,environmentRotation:y,...m}){const p=dr(m),F=ze(b=>b.scene);return P.useLayoutEffect(()=>Tr(n,t,F,p,{backgroundBlurriness:i??o,backgroundIntensity:l,backgroundRotation:h,environmentIntensity:d,environmentRotation:y})),P.useEffect(()=>()=>{p.dispose()},[p]),null}function $a({children:n,near:t=.1,far:i=1e3,resolution:o=256,frames:l=1,map:h,background:d=!1,blur:y,backgroundBlurriness:m,backgroundIntensity:p,backgroundRotation:F,environmentIntensity:b,environmentRotation:C,scene:A,files:Z,path:ue,preset:N=void 0,extensions:ie}){const re=ze(v=>v.gl),le=ze(v=>v.scene),se=P.useRef(null),[z]=P.useState(()=>new $r),D=P.useMemo(()=>{const v=new ca(o);return v.texture.type=we,v},[o]);P.useEffect(()=>()=>{D.dispose()},[D]),P.useLayoutEffect(()=>{if(l===1){const v=re.autoClear;re.autoClear=!0,se.current.update(re,z),re.autoClear=v}return Tr(d,A,le,D.texture,{backgroundBlurriness:y??m,backgroundIntensity:p,backgroundRotation:F,environmentIntensity:b,environmentRotation:C})},[n,z,D.texture,A,le,d,l,re]);let B=1;return Zr(()=>{if(l===1/0||B<l){const v=re.autoClear;re.autoClear=!0,se.current.update(re,z),re.autoClear=v,B++}}),P.createElement(P.Fragment,null,ua(P.createElement(P.Fragment,null,n,P.createElement("cubeCamera",{ref:se,args:[t,i,D]}),Z||N?P.createElement(it,{background:!0,files:Z,preset:N,path:ue,extensions:ie}):h?P.createElement(br,{background:!0,map:h,extensions:ie}):null),z))}function Xa(n){var t,i,o,l;const h=dr(n),d=n.map||h;P.useMemo(()=>Gr({GroundProjectedEnvImpl:Ia}),[]),P.useEffect(()=>()=>{h.dispose()},[h]);const y=P.useMemo(()=>[d],[d]),m=(t=n.ground)==null?void 0:t.height,p=(i=n.ground)==null?void 0:i.radius,F=(o=(l=n.ground)==null?void 0:l.scale)!==null&&o!==void 0?o:1e3;return P.createElement(P.Fragment,null,P.createElement(br,Wr({},n,{map:d})),P.createElement("groundProjectedEnvImpl",{args:y,scale:F,height:m,radius:p}))}function qa(n){return n.ground?P.createElement(Xa,n):n.map?P.createElement(br,n):n.children?P.createElement($a,n):P.createElement(it,n)}export{qa as E,Ka as M};
