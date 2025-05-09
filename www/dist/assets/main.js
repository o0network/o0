(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();function Cs(s,e){if(!(s instanceof e))throw new TypeError("Cannot call a class as a function")}function zo(s,e){for(var t=0;t<e.length;t++){var i=e[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(s,i.key,i)}}function Rs(s,e,t){return e&&zo(s.prototype,e),s}function $s(s){return+s.replace(/px/,"")}function Ho(s){var e=window.devicePixelRatio,t=getComputedStyle(s),i=$s(t.getPropertyValue("width")),r=$s(t.getPropertyValue("height"));s.setAttribute("width",(i*e).toString()),s.setAttribute("height",(r*e).toString())}function Ft(s,e){var t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,i=Math.random()*(e-s)+s;return Math.floor(i*Math.pow(10,t))/Math.pow(10,t)}function Zs(s){return s[Ft(0,s.length)]}var Vo=.00125,Go=5e-4,ko=9e-4,Wo=1e-5,Xo=6,qo=80,Yo=.9,$o=1.7,Zo=.2,Ko=.6,jo=.03,Jo=.07,Qo=15,el=82,tl=100,nl=250,il=40,rl=["#fcf403","#62fc03","#f4fc03","#03e7fc","#03fca5","#a503fc","#fc03ad","#fc03c2"];function Ks(s){var e=1920;return Math.log(s)/Math.log(e)}var js=function(){function s(e){Cs(this,s);var t=e.initialPosition,i=e.direction,r=e.confettiRadius,n=e.confettiColors,o=e.emojis,a=e.emojiSize,c=e.canvasWidth,f=Ft(Yo,$o,3),u=f*Ks(c);this.confettiSpeed={x:u,y:u},this.finalConfettiSpeedX=Ft(Zo,Ko,3),this.rotationSpeed=o.length?.01:Ft(jo,Jo,3)*Ks(c),this.dragForceCoefficient=Ft(Go,ko,6),this.radius={x:r,y:r},this.initialRadius=r,this.rotationAngle=i==="left"?Ft(0,.2,3):Ft(-.2,0,3),this.emojiSize=a,this.emojiRotationAngle=Ft(0,2*Math.PI),this.radiusYUpdateDirection="down";var d=i==="left"?Ft(el,Qo)*Math.PI/180:Ft(-15,-82)*Math.PI/180;this.absCos=Math.abs(Math.cos(d)),this.absSin=Math.abs(Math.sin(d));var h=Ft(-150,0),l={x:t.x+(i==="left"?-h:h)*this.absCos,y:t.y-h*this.absSin};this.currentPosition=Object.assign({},l),this.initialPosition=Object.assign({},l),this.color=o.length?null:Zs(n),this.emoji=o.length?Zs(o):null,this.createdAt=new Date().getTime(),this.direction=i}return Rs(s,[{key:"draw",value:function(t){var i=this.currentPosition,r=this.radius,n=this.color,o=this.emoji,a=this.rotationAngle,c=this.emojiRotationAngle,f=this.emojiSize,u=window.devicePixelRatio;n?(t.fillStyle=n,t.beginPath(),t.ellipse(i.x*u,i.y*u,r.x*u,r.y*u,a,0,2*Math.PI),t.fill()):o&&(t.font="".concat(f,"px serif"),t.save(),t.translate(u*i.x,u*i.y),t.rotate(c),t.textAlign="center",t.fillText(o,0,0),t.restore())}},{key:"updatePosition",value:function(t,i){var r=this.confettiSpeed,n=this.dragForceCoefficient,o=this.finalConfettiSpeedX,a=this.radiusYUpdateDirection,c=this.rotationSpeed,f=this.createdAt,u=this.direction,d=i-f;if(r.x>o&&(this.confettiSpeed.x-=n*t),this.currentPosition.x+=r.x*(u==="left"?-this.absCos:this.absCos)*t,this.currentPosition.y=this.initialPosition.y-r.y*this.absSin*d+Vo*Math.pow(d,2)/2,this.rotationSpeed-=this.emoji?1e-4:Wo*t,this.rotationSpeed<0&&(this.rotationSpeed=0),this.emoji){this.emojiRotationAngle+=this.rotationSpeed*t%(2*Math.PI);return}a==="down"?(this.radius.y-=t*c,this.radius.y<=0&&(this.radius.y=0,this.radiusYUpdateDirection="up")):(this.radius.y+=t*c,this.radius.y>=this.initialRadius&&(this.radius.y=this.initialRadius,this.radiusYUpdateDirection="down"))}},{key:"getIsVisibleOnCanvas",value:function(t){return this.currentPosition.y<t+tl}}]),s}();function sl(){var s=document.createElement("canvas");return s.style.position="fixed",s.style.width="100%",s.style.height="100%",s.style.top="0",s.style.left="0",s.style.zIndex="1000",s.style.pointerEvents="none",document.body.appendChild(s),s}function al(s){var e=s.confettiRadius,t=e===void 0?Xo:e,i=s.confettiNumber,r=i===void 0?s.confettiesNumber||(s.emojis?il:nl):i,n=s.confettiColors,o=n===void 0?rl:n,a=s.emojis,c=a===void 0?s.emojies||[]:a,f=s.emojiSize,u=f===void 0?qo:f;return s.emojies&&console.error("emojies argument is deprecated, please use emojis instead"),s.confettiesNumber&&console.error("confettiesNumber argument is deprecated, please use confettiNumber instead"),{confettiRadius:t,confettiNumber:r,confettiColors:o,emojis:c,emojiSize:u}}var ol=function(){function s(e){var t=this;Cs(this,s),this.canvasContext=e,this.shapes=[],this.promise=new Promise(function(i){return t.resolvePromise=i})}return Rs(s,[{key:"getBatchCompletePromise",value:function(){return this.promise}},{key:"addShapes",value:function(){var t;(t=this.shapes).push.apply(t,arguments)}},{key:"complete",value:function(){var t;return this.shapes.length?!1:((t=this.resolvePromise)===null||t===void 0||t.call(this),!0)}},{key:"processShapes",value:function(t,i,r){var n=this,o=t.timeDelta,a=t.currentTime;this.shapes=this.shapes.filter(function(c){return c.updatePosition(o,a),c.draw(n.canvasContext),r?c.getIsVisibleOnCanvas(i):!0})}}]),s}(),ll=function(){function s(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Cs(this,s),this.activeConfettiBatches=[],this.canvas=e.canvas||sl(),this.canvasContext=this.canvas.getContext("2d"),this.requestAnimationFrameRequested=!1,this.lastUpdated=new Date().getTime(),this.iterationIndex=0,this.loop=this.loop.bind(this),requestAnimationFrame(this.loop)}return Rs(s,[{key:"loop",value:function(){this.requestAnimationFrameRequested=!1,Ho(this.canvas);var t=new Date().getTime(),i=t-this.lastUpdated,r=this.canvas.offsetHeight,n=this.iterationIndex%10===0;this.activeConfettiBatches=this.activeConfettiBatches.filter(function(o){return o.processShapes({timeDelta:i,currentTime:t},r,n),n?!o.complete():!0}),this.iterationIndex++,this.queueAnimationFrameIfNeeded(t)}},{key:"queueAnimationFrameIfNeeded",value:function(t){this.requestAnimationFrameRequested||this.activeConfettiBatches.length<1||(this.requestAnimationFrameRequested=!0,this.lastUpdated=t||new Date().getTime(),requestAnimationFrame(this.loop))}},{key:"addConfetti",value:function(){for(var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},i=al(t),r=i.confettiRadius,n=i.confettiNumber,o=i.confettiColors,a=i.emojis,c=i.emojiSize,f=this.canvas.getBoundingClientRect(),u=f.width,d=f.height,h=d*5/7,l={x:0,y:h},m={x:u,y:h},g=new ol(this.canvasContext),p=0;p<n/2;p++){var v=new js({initialPosition:l,direction:"right",confettiRadius:r,confettiColors:o,confettiNumber:n,emojis:a,emojiSize:c,canvasWidth:u}),A=new js({initialPosition:m,direction:"left",confettiRadius:r,confettiColors:o,confettiNumber:n,emojis:a,emojiSize:c,canvasWidth:u});g.addShapes(v,A)}return this.activeConfettiBatches.push(g),this.queueAnimationFrameIfNeeded(),g.getBatchCompletePromise()}},{key:"clearCanvas",value:function(){this.activeConfettiBatches=[]}},{key:"destroyCanvas",value:function(){this.canvas.remove()}}]),s}();const tr=document.getElementById("oouSound"),Js=document.getElementById("rocketSound");let zr=!1,Zn=!1;async function Qa(){try{const s=await navigator.permissions.query({name:"downloads"});if(s.state==="granted")Zn=!0;else if(s.state==="prompt"){const e=new Blob([""],{type:"text/plain"}),t=URL.createObjectURL(e),i=document.createElement("a");i.href=t,i.download="test.txt",document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(t),Zn=!0}}catch(s){console.warn("Download permission check failed:",s),Zn=!0}finally{setTimeout(()=>{document.body.style.animation=""},2e3)}}document.querySelector(".logo-wrapper").addEventListener("click",()=>{tr.currentTime=0,tr.play();const s=document.querySelector(".logo-wrapper");s.classList.add("clicked"),zr=!0,setTimeout(()=>{s.classList.remove("clicked"),Zn||Qa()},200)});const cl=new ll,Qs=document.querySelector(".download-link");Qs&&Qs.addEventListener("click",async()=>{if(!Zn&&(await Qa(),!Zn))return;const s=document.querySelector(".logo-wrapper:nth-child(1)"),e=document.querySelector(".logo-wrapper:nth-child(2)");s.classList.add("fly-away"),e.classList.add("move-up"),setTimeout(()=>{s.remove();const t=document.createElement("div");t.className="logo-wrapper",t.innerHTML=`
        <img class="logo-ghost" src="assets/logo.png" alt="o0 logo" />
      `,document.querySelector(".logo-stack").prepend(t),t.offsetHeight,e.classList.remove("move-up"),t.addEventListener("click",()=>{tr.currentTime=0,tr.play(),zr=!0})},1e3),cl.addConfetti({emojis:["🎉","✨","⭐️","🌟","💫"],emojiSize:100,confettiNumber:50,confettiRadius:50}),zr&&(Js.currentTime=0,setTimeout(()=>{Js.play()},1e3))});document.querySelector(".logo-ghost").addEventListener("animationend",s=>{if(s.animationName==="ghost-download"){const e=document.querySelector(".logo-ghost");e.style.animation="float-infinity 10s infinite ease-in-out"}});document.addEventListener("DOMContentLoaded",()=>{const s=document.querySelector('a.download-link[href="https://o0.network/explore"]');s&&s.addEventListener("click",function(e){e.preventDefault();const t=this.href;this.textContent,this.textContent="Launching...",setTimeout(()=>{window.location.href=t},1e3)})});var ea=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Yi={exports:{}};/*!
 * matter-js 0.20.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var ul=Yi.exports,ta;function fl(){return ta||(ta=1,function(s,e){(function(i,r){s.exports=r()})(ul,function(){return function(t){var i={};function r(n){if(i[n])return i[n].exports;var o=i[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=i,r.d=function(n,o,a){r.o(n,o)||Object.defineProperty(n,o,{enumerable:!0,get:a})},r.r=function(n){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},r.t=function(n,o){if(o&1&&(n=r(n)),o&8||o&4&&typeof n=="object"&&n&&n.__esModule)return n;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:n}),o&2&&typeof n!="string")for(var c in n)r.d(a,c,(function(f){return n[f]}).bind(null,c));return a},r.n=function(n){var o=n&&n.__esModule?function(){return n.default}:function(){return n};return r.d(o,"a",o),o},r.o=function(n,o){return Object.prototype.hasOwnProperty.call(n,o)},r.p="",r(r.s=20)}([function(t,i){var r={};t.exports=r,function(){r._baseDelta=1e3/60,r._nextId=0,r._seed=0,r._nowStartTime=+new Date,r._warnedOnce={},r._decomp=null,r.extend=function(o,a){var c,f;typeof a=="boolean"?(c=2,f=a):(c=1,f=!0);for(var u=c;u<arguments.length;u++){var d=arguments[u];if(d)for(var h in d)f&&d[h]&&d[h].constructor===Object&&(!o[h]||o[h].constructor===Object)?(o[h]=o[h]||{},r.extend(o[h],f,d[h])):o[h]=d[h]}return o},r.clone=function(o,a){return r.extend({},a,o)},r.keys=function(o){if(Object.keys)return Object.keys(o);var a=[];for(var c in o)a.push(c);return a},r.values=function(o){var a=[];if(Object.keys){for(var c=Object.keys(o),f=0;f<c.length;f++)a.push(o[c[f]]);return a}for(var u in o)a.push(o[u]);return a},r.get=function(o,a,c,f){a=a.split(".").slice(c,f);for(var u=0;u<a.length;u+=1)o=o[a[u]];return o},r.set=function(o,a,c,f,u){var d=a.split(".").slice(f,u);return r.get(o,a,0,-1)[d[d.length-1]]=c,c},r.shuffle=function(o){for(var a=o.length-1;a>0;a--){var c=Math.floor(r.random()*(a+1)),f=o[a];o[a]=o[c],o[c]=f}return o},r.choose=function(o){return o[Math.floor(r.random()*o.length)]},r.isElement=function(o){return typeof HTMLElement<"u"?o instanceof HTMLElement:!!(o&&o.nodeType&&o.nodeName)},r.isArray=function(o){return Object.prototype.toString.call(o)==="[object Array]"},r.isFunction=function(o){return typeof o=="function"},r.isPlainObject=function(o){return typeof o=="object"&&o.constructor===Object},r.isString=function(o){return toString.call(o)==="[object String]"},r.clamp=function(o,a,c){return o<a?a:o>c?c:o},r.sign=function(o){return o<0?-1:1},r.now=function(){if(typeof window<"u"&&window.performance){if(window.performance.now)return window.performance.now();if(window.performance.webkitNow)return window.performance.webkitNow()}return Date.now?Date.now():new Date-r._nowStartTime},r.random=function(o,a){return o=typeof o<"u"?o:0,a=typeof a<"u"?a:1,o+n()*(a-o)};var n=function(){return r._seed=(r._seed*9301+49297)%233280,r._seed/233280};r.colorToNumber=function(o){return o=o.replace("#",""),o.length==3&&(o=o.charAt(0)+o.charAt(0)+o.charAt(1)+o.charAt(1)+o.charAt(2)+o.charAt(2)),parseInt(o,16)},r.logLevel=1,r.log=function(){console&&r.logLevel>0&&r.logLevel<=3&&console.log.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},r.info=function(){console&&r.logLevel>0&&r.logLevel<=2&&console.info.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},r.warn=function(){console&&r.logLevel>0&&r.logLevel<=3&&console.warn.apply(console,["matter-js:"].concat(Array.prototype.slice.call(arguments)))},r.warnOnce=function(){var o=Array.prototype.slice.call(arguments).join(" ");r._warnedOnce[o]||(r.warn(o),r._warnedOnce[o]=!0)},r.deprecated=function(o,a,c){o[a]=r.chain(function(){r.warnOnce("🔅 deprecated 🔅",c)},o[a])},r.nextId=function(){return r._nextId++},r.indexOf=function(o,a){if(o.indexOf)return o.indexOf(a);for(var c=0;c<o.length;c++)if(o[c]===a)return c;return-1},r.map=function(o,a){if(o.map)return o.map(a);for(var c=[],f=0;f<o.length;f+=1)c.push(a(o[f]));return c},r.topologicalSort=function(o){var a=[],c=[],f=[];for(var u in o)!c[u]&&!f[u]&&r._topologicalSort(u,c,f,o,a);return a},r._topologicalSort=function(o,a,c,f,u){var d=f[o]||[];c[o]=!0;for(var h=0;h<d.length;h+=1){var l=d[h];c[l]||a[l]||r._topologicalSort(l,a,c,f,u)}c[o]=!1,a[o]=!0,u.push(o)},r.chain=function(){for(var o=[],a=0;a<arguments.length;a+=1){var c=arguments[a];c._chained?o.push.apply(o,c._chained):o.push(c)}var f=function(){for(var u,d=new Array(arguments.length),h=0,l=arguments.length;h<l;h++)d[h]=arguments[h];for(h=0;h<o.length;h+=1){var m=o[h].apply(u,d);typeof m<"u"&&(u=m)}return u};return f._chained=o,f},r.chainPathBefore=function(o,a,c){return r.set(o,a,r.chain(c,r.get(o,a)))},r.chainPathAfter=function(o,a,c){return r.set(o,a,r.chain(r.get(o,a),c))},r.setDecomp=function(o){r._decomp=o},r.getDecomp=function(){var o=r._decomp;try{!o&&typeof window<"u"&&(o=window.decomp),!o&&typeof ea<"u"&&(o=ea.decomp)}catch{o=null}return o}}()},function(t,i){var r={};t.exports=r,function(){r.create=function(n){var o={min:{x:0,y:0},max:{x:0,y:0}};return n&&r.update(o,n),o},r.update=function(n,o,a){n.min.x=1/0,n.max.x=-1/0,n.min.y=1/0,n.max.y=-1/0;for(var c=0;c<o.length;c++){var f=o[c];f.x>n.max.x&&(n.max.x=f.x),f.x<n.min.x&&(n.min.x=f.x),f.y>n.max.y&&(n.max.y=f.y),f.y<n.min.y&&(n.min.y=f.y)}a&&(a.x>0?n.max.x+=a.x:n.min.x+=a.x,a.y>0?n.max.y+=a.y:n.min.y+=a.y)},r.contains=function(n,o){return o.x>=n.min.x&&o.x<=n.max.x&&o.y>=n.min.y&&o.y<=n.max.y},r.overlaps=function(n,o){return n.min.x<=o.max.x&&n.max.x>=o.min.x&&n.max.y>=o.min.y&&n.min.y<=o.max.y},r.translate=function(n,o){n.min.x+=o.x,n.max.x+=o.x,n.min.y+=o.y,n.max.y+=o.y},r.shift=function(n,o){var a=n.max.x-n.min.x,c=n.max.y-n.min.y;n.min.x=o.x,n.max.x=o.x+a,n.min.y=o.y,n.max.y=o.y+c}}()},function(t,i){var r={};t.exports=r,function(){r.create=function(n,o){return{x:n||0,y:o||0}},r.clone=function(n){return{x:n.x,y:n.y}},r.magnitude=function(n){return Math.sqrt(n.x*n.x+n.y*n.y)},r.magnitudeSquared=function(n){return n.x*n.x+n.y*n.y},r.rotate=function(n,o,a){var c=Math.cos(o),f=Math.sin(o);a||(a={});var u=n.x*c-n.y*f;return a.y=n.x*f+n.y*c,a.x=u,a},r.rotateAbout=function(n,o,a,c){var f=Math.cos(o),u=Math.sin(o);c||(c={});var d=a.x+((n.x-a.x)*f-(n.y-a.y)*u);return c.y=a.y+((n.x-a.x)*u+(n.y-a.y)*f),c.x=d,c},r.normalise=function(n){var o=r.magnitude(n);return o===0?{x:0,y:0}:{x:n.x/o,y:n.y/o}},r.dot=function(n,o){return n.x*o.x+n.y*o.y},r.cross=function(n,o){return n.x*o.y-n.y*o.x},r.cross3=function(n,o,a){return(o.x-n.x)*(a.y-n.y)-(o.y-n.y)*(a.x-n.x)},r.add=function(n,o,a){return a||(a={}),a.x=n.x+o.x,a.y=n.y+o.y,a},r.sub=function(n,o,a){return a||(a={}),a.x=n.x-o.x,a.y=n.y-o.y,a},r.mult=function(n,o){return{x:n.x*o,y:n.y*o}},r.div=function(n,o){return{x:n.x/o,y:n.y/o}},r.perp=function(n,o){return o=o===!0?-1:1,{x:o*-n.y,y:o*n.x}},r.neg=function(n){return{x:-n.x,y:-n.y}},r.angle=function(n,o){return Math.atan2(o.y-n.y,o.x-n.x)},r._temp=[r.create(),r.create(),r.create(),r.create(),r.create(),r.create()]}()},function(t,i,r){var n={};t.exports=n;var o=r(2),a=r(0);(function(){n.create=function(c,f){for(var u=[],d=0;d<c.length;d++){var h=c[d],l={x:h.x,y:h.y,index:d,body:f,isInternal:!1};u.push(l)}return u},n.fromPath=function(c,f){var u=/L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig,d=[];return c.replace(u,function(h,l,m){d.push({x:parseFloat(l),y:parseFloat(m)})}),n.create(d,f)},n.centre=function(c){for(var f=n.area(c,!0),u={x:0,y:0},d,h,l,m=0;m<c.length;m++)l=(m+1)%c.length,d=o.cross(c[m],c[l]),h=o.mult(o.add(c[m],c[l]),d),u=o.add(u,h);return o.div(u,6*f)},n.mean=function(c){for(var f={x:0,y:0},u=0;u<c.length;u++)f.x+=c[u].x,f.y+=c[u].y;return o.div(f,c.length)},n.area=function(c,f){for(var u=0,d=c.length-1,h=0;h<c.length;h++)u+=(c[d].x-c[h].x)*(c[d].y+c[h].y),d=h;return f?u/2:Math.abs(u)/2},n.inertia=function(c,f){for(var u=0,d=0,h=c,l,m,g=0;g<h.length;g++)m=(g+1)%h.length,l=Math.abs(o.cross(h[m],h[g])),u+=l*(o.dot(h[m],h[m])+o.dot(h[m],h[g])+o.dot(h[g],h[g])),d+=l;return f/6*(u/d)},n.translate=function(c,f,u){u=typeof u<"u"?u:1;var d=c.length,h=f.x*u,l=f.y*u,m;for(m=0;m<d;m++)c[m].x+=h,c[m].y+=l;return c},n.rotate=function(c,f,u){if(f!==0){var d=Math.cos(f),h=Math.sin(f),l=u.x,m=u.y,g=c.length,p,v,A,w;for(w=0;w<g;w++)p=c[w],v=p.x-l,A=p.y-m,p.x=l+(v*d-A*h),p.y=m+(v*h+A*d);return c}},n.contains=function(c,f){for(var u=f.x,d=f.y,h=c.length,l=c[h-1],m,g=0;g<h;g++){if(m=c[g],(u-l.x)*(m.y-l.y)+(d-l.y)*(l.x-m.x)>0)return!1;l=m}return!0},n.scale=function(c,f,u,d){if(f===1&&u===1)return c;d=d||n.centre(c);for(var h,l,m=0;m<c.length;m++)h=c[m],l=o.sub(h,d),c[m].x=d.x+l.x*f,c[m].y=d.y+l.y*u;return c},n.chamfer=function(c,f,u,d,h){typeof f=="number"?f=[f]:f=f||[8],u=typeof u<"u"?u:-1,d=d||2,h=h||14;for(var l=[],m=0;m<c.length;m++){var g=c[m-1>=0?m-1:c.length-1],p=c[m],v=c[(m+1)%c.length],A=f[m<f.length?m:f.length-1];if(A===0){l.push(p);continue}var w=o.normalise({x:p.y-g.y,y:g.x-p.x}),T=o.normalise({x:v.y-p.y,y:p.x-v.x}),x=Math.sqrt(2*Math.pow(A,2)),y=o.mult(a.clone(w),A),E=o.normalise(o.mult(o.add(w,T),.5)),M=o.sub(p,o.mult(E,x)),S=u;u===-1&&(S=Math.pow(A,.32)*1.75),S=a.clamp(S,d,h),S%2===1&&(S+=1);for(var _=Math.acos(o.dot(w,T)),b=_/S,C=0;C<S;C++)l.push(o.add(o.rotate(y,b*C),M))}return l},n.clockwiseSort=function(c){var f=n.mean(c);return c.sort(function(u,d){return o.angle(f,u)-o.angle(f,d)}),c},n.isConvex=function(c){var f=0,u=c.length,d,h,l,m;if(u<3)return null;for(d=0;d<u;d++)if(h=(d+1)%u,l=(d+2)%u,m=(c[h].x-c[d].x)*(c[l].y-c[h].y),m-=(c[h].y-c[d].y)*(c[l].x-c[h].x),m<0?f|=1:m>0&&(f|=2),f===3)return!1;return f!==0?!0:null},n.hull=function(c){var f=[],u=[],d,h;for(c=c.slice(0),c.sort(function(l,m){var g=l.x-m.x;return g!==0?g:l.y-m.y}),h=0;h<c.length;h+=1){for(d=c[h];u.length>=2&&o.cross3(u[u.length-2],u[u.length-1],d)<=0;)u.pop();u.push(d)}for(h=c.length-1;h>=0;h-=1){for(d=c[h];f.length>=2&&o.cross3(f[f.length-2],f[f.length-1],d)<=0;)f.pop();f.push(d)}return f.pop(),u.pop(),f.concat(u)}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(2),c=r(7),f=r(0),u=r(1),d=r(11);(function(){n._timeCorrection=!0,n._inertiaScale=4,n._nextCollidingGroupId=1,n._nextNonCollidingGroupId=-1,n._nextCategory=1,n._baseDelta=1e3/60,n.create=function(l){var m={id:f.nextId(),type:"body",label:"Body",parts:[],plugin:{},angle:0,vertices:o.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),position:{x:0,y:0},force:{x:0,y:0},torque:0,positionImpulse:{x:0,y:0},constraintImpulse:{x:0,y:0,angle:0},totalContacts:0,speed:0,angularSpeed:0,velocity:{x:0,y:0},angularVelocity:0,isSensor:!1,isStatic:!1,isSleeping:!1,motion:0,sleepThreshold:60,density:.001,restitution:0,friction:.1,frictionStatic:.5,frictionAir:.01,collisionFilter:{category:1,mask:4294967295,group:0},slop:.05,timeScale:1,render:{visible:!0,opacity:1,strokeStyle:null,fillStyle:null,lineWidth:null,sprite:{xScale:1,yScale:1,xOffset:0,yOffset:0}},events:null,bounds:null,chamfer:null,circleRadius:0,positionPrev:null,anglePrev:0,parent:null,axes:null,area:0,mass:0,inertia:0,deltaTime:16.666666666666668,_original:null},g=f.extend(m,l);return h(g,l),g},n.nextGroup=function(l){return l?n._nextNonCollidingGroupId--:n._nextCollidingGroupId++},n.nextCategory=function(){return n._nextCategory=n._nextCategory<<1,n._nextCategory};var h=function(l,m){m=m||{},n.set(l,{bounds:l.bounds||u.create(l.vertices),positionPrev:l.positionPrev||a.clone(l.position),anglePrev:l.anglePrev||l.angle,vertices:l.vertices,parts:l.parts||[l],isStatic:l.isStatic,isSleeping:l.isSleeping,parent:l.parent||l}),o.rotate(l.vertices,l.angle,l.position),d.rotate(l.axes,l.angle),u.update(l.bounds,l.vertices,l.velocity),n.set(l,{axes:m.axes||l.axes,area:m.area||l.area,mass:m.mass||l.mass,inertia:m.inertia||l.inertia});var g=l.isStatic?"#14151f":f.choose(["#f19648","#f5d259","#f55a3c","#063e7b","#ececd1"]),p=l.isStatic?"#555":"#ccc",v=l.isStatic&&l.render.fillStyle===null?1:0;l.render.fillStyle=l.render.fillStyle||g,l.render.strokeStyle=l.render.strokeStyle||p,l.render.lineWidth=l.render.lineWidth||v,l.render.sprite.xOffset+=-(l.bounds.min.x-l.position.x)/(l.bounds.max.x-l.bounds.min.x),l.render.sprite.yOffset+=-(l.bounds.min.y-l.position.y)/(l.bounds.max.y-l.bounds.min.y)};n.set=function(l,m,g){var p;typeof m=="string"&&(p=m,m={},m[p]=g);for(p in m)if(Object.prototype.hasOwnProperty.call(m,p))switch(g=m[p],p){case"isStatic":n.setStatic(l,g);break;case"isSleeping":c.set(l,g);break;case"mass":n.setMass(l,g);break;case"density":n.setDensity(l,g);break;case"inertia":n.setInertia(l,g);break;case"vertices":n.setVertices(l,g);break;case"position":n.setPosition(l,g);break;case"angle":n.setAngle(l,g);break;case"velocity":n.setVelocity(l,g);break;case"angularVelocity":n.setAngularVelocity(l,g);break;case"speed":n.setSpeed(l,g);break;case"angularSpeed":n.setAngularSpeed(l,g);break;case"parts":n.setParts(l,g);break;case"centre":n.setCentre(l,g);break;default:l[p]=g}},n.setStatic=function(l,m){for(var g=0;g<l.parts.length;g++){var p=l.parts[g];m?(p.isStatic||(p._original={restitution:p.restitution,friction:p.friction,mass:p.mass,inertia:p.inertia,density:p.density,inverseMass:p.inverseMass,inverseInertia:p.inverseInertia}),p.restitution=0,p.friction=1,p.mass=p.inertia=p.density=1/0,p.inverseMass=p.inverseInertia=0,p.positionPrev.x=p.position.x,p.positionPrev.y=p.position.y,p.anglePrev=p.angle,p.angularVelocity=0,p.speed=0,p.angularSpeed=0,p.motion=0):p._original&&(p.restitution=p._original.restitution,p.friction=p._original.friction,p.mass=p._original.mass,p.inertia=p._original.inertia,p.density=p._original.density,p.inverseMass=p._original.inverseMass,p.inverseInertia=p._original.inverseInertia,p._original=null),p.isStatic=m}},n.setMass=function(l,m){var g=l.inertia/(l.mass/6);l.inertia=g*(m/6),l.inverseInertia=1/l.inertia,l.mass=m,l.inverseMass=1/l.mass,l.density=l.mass/l.area},n.setDensity=function(l,m){n.setMass(l,m*l.area),l.density=m},n.setInertia=function(l,m){l.inertia=m,l.inverseInertia=1/l.inertia},n.setVertices=function(l,m){m[0].body===l?l.vertices=m:l.vertices=o.create(m,l),l.axes=d.fromVertices(l.vertices),l.area=o.area(l.vertices),n.setMass(l,l.density*l.area);var g=o.centre(l.vertices);o.translate(l.vertices,g,-1),n.setInertia(l,n._inertiaScale*o.inertia(l.vertices,l.mass)),o.translate(l.vertices,l.position),u.update(l.bounds,l.vertices,l.velocity)},n.setParts=function(l,m,g){var p;for(m=m.slice(0),l.parts.length=0,l.parts.push(l),l.parent=l,p=0;p<m.length;p++){var v=m[p];v!==l&&(v.parent=l,l.parts.push(v))}if(l.parts.length!==1){if(g=typeof g<"u"?g:!0,g){var A=[];for(p=0;p<m.length;p++)A=A.concat(m[p].vertices);o.clockwiseSort(A);var w=o.hull(A),T=o.centre(w);n.setVertices(l,w),o.translate(l.vertices,T)}var x=n._totalProperties(l);l.area=x.area,l.parent=l,l.position.x=x.centre.x,l.position.y=x.centre.y,l.positionPrev.x=x.centre.x,l.positionPrev.y=x.centre.y,n.setMass(l,x.mass),n.setInertia(l,x.inertia),n.setPosition(l,x.centre)}},n.setCentre=function(l,m,g){g?(l.positionPrev.x+=m.x,l.positionPrev.y+=m.y,l.position.x+=m.x,l.position.y+=m.y):(l.positionPrev.x=m.x-(l.position.x-l.positionPrev.x),l.positionPrev.y=m.y-(l.position.y-l.positionPrev.y),l.position.x=m.x,l.position.y=m.y)},n.setPosition=function(l,m,g){var p=a.sub(m,l.position);g?(l.positionPrev.x=l.position.x,l.positionPrev.y=l.position.y,l.velocity.x=p.x,l.velocity.y=p.y,l.speed=a.magnitude(p)):(l.positionPrev.x+=p.x,l.positionPrev.y+=p.y);for(var v=0;v<l.parts.length;v++){var A=l.parts[v];A.position.x+=p.x,A.position.y+=p.y,o.translate(A.vertices,p),u.update(A.bounds,A.vertices,l.velocity)}},n.setAngle=function(l,m,g){var p=m-l.angle;g?(l.anglePrev=l.angle,l.angularVelocity=p,l.angularSpeed=Math.abs(p)):l.anglePrev+=p;for(var v=0;v<l.parts.length;v++){var A=l.parts[v];A.angle+=p,o.rotate(A.vertices,p,l.position),d.rotate(A.axes,p),u.update(A.bounds,A.vertices,l.velocity),v>0&&a.rotateAbout(A.position,p,l.position,A.position)}},n.setVelocity=function(l,m){var g=l.deltaTime/n._baseDelta;l.positionPrev.x=l.position.x-m.x*g,l.positionPrev.y=l.position.y-m.y*g,l.velocity.x=(l.position.x-l.positionPrev.x)/g,l.velocity.y=(l.position.y-l.positionPrev.y)/g,l.speed=a.magnitude(l.velocity)},n.getVelocity=function(l){var m=n._baseDelta/l.deltaTime;return{x:(l.position.x-l.positionPrev.x)*m,y:(l.position.y-l.positionPrev.y)*m}},n.getSpeed=function(l){return a.magnitude(n.getVelocity(l))},n.setSpeed=function(l,m){n.setVelocity(l,a.mult(a.normalise(n.getVelocity(l)),m))},n.setAngularVelocity=function(l,m){var g=l.deltaTime/n._baseDelta;l.anglePrev=l.angle-m*g,l.angularVelocity=(l.angle-l.anglePrev)/g,l.angularSpeed=Math.abs(l.angularVelocity)},n.getAngularVelocity=function(l){return(l.angle-l.anglePrev)*n._baseDelta/l.deltaTime},n.getAngularSpeed=function(l){return Math.abs(n.getAngularVelocity(l))},n.setAngularSpeed=function(l,m){n.setAngularVelocity(l,f.sign(n.getAngularVelocity(l))*m)},n.translate=function(l,m,g){n.setPosition(l,a.add(l.position,m),g)},n.rotate=function(l,m,g,p){if(!g)n.setAngle(l,l.angle+m,p);else{var v=Math.cos(m),A=Math.sin(m),w=l.position.x-g.x,T=l.position.y-g.y;n.setPosition(l,{x:g.x+(w*v-T*A),y:g.y+(w*A+T*v)},p),n.setAngle(l,l.angle+m,p)}},n.scale=function(l,m,g,p){var v=0,A=0;p=p||l.position;for(var w=0;w<l.parts.length;w++){var T=l.parts[w];o.scale(T.vertices,m,g,p),T.axes=d.fromVertices(T.vertices),T.area=o.area(T.vertices),n.setMass(T,l.density*T.area),o.translate(T.vertices,{x:-T.position.x,y:-T.position.y}),n.setInertia(T,n._inertiaScale*o.inertia(T.vertices,T.mass)),o.translate(T.vertices,{x:T.position.x,y:T.position.y}),w>0&&(v+=T.area,A+=T.inertia),T.position.x=p.x+(T.position.x-p.x)*m,T.position.y=p.y+(T.position.y-p.y)*g,u.update(T.bounds,T.vertices,l.velocity)}l.parts.length>1&&(l.area=v,l.isStatic||(n.setMass(l,l.density*v),n.setInertia(l,A))),l.circleRadius&&(m===g?l.circleRadius*=m:l.circleRadius=null)},n.update=function(l,m){m=(typeof m<"u"?m:1e3/60)*l.timeScale;var g=m*m,p=n._timeCorrection?m/(l.deltaTime||m):1,v=1-l.frictionAir*(m/f._baseDelta),A=(l.position.x-l.positionPrev.x)*p,w=(l.position.y-l.positionPrev.y)*p;l.velocity.x=A*v+l.force.x/l.mass*g,l.velocity.y=w*v+l.force.y/l.mass*g,l.positionPrev.x=l.position.x,l.positionPrev.y=l.position.y,l.position.x+=l.velocity.x,l.position.y+=l.velocity.y,l.deltaTime=m,l.angularVelocity=(l.angle-l.anglePrev)*v*p+l.torque/l.inertia*g,l.anglePrev=l.angle,l.angle+=l.angularVelocity;for(var T=0;T<l.parts.length;T++){var x=l.parts[T];o.translate(x.vertices,l.velocity),T>0&&(x.position.x+=l.velocity.x,x.position.y+=l.velocity.y),l.angularVelocity!==0&&(o.rotate(x.vertices,l.angularVelocity,l.position),d.rotate(x.axes,l.angularVelocity),T>0&&a.rotateAbout(x.position,l.angularVelocity,l.position,x.position)),u.update(x.bounds,x.vertices,l.velocity)}},n.updateVelocities=function(l){var m=n._baseDelta/l.deltaTime,g=l.velocity;g.x=(l.position.x-l.positionPrev.x)*m,g.y=(l.position.y-l.positionPrev.y)*m,l.speed=Math.sqrt(g.x*g.x+g.y*g.y),l.angularVelocity=(l.angle-l.anglePrev)*m,l.angularSpeed=Math.abs(l.angularVelocity)},n.applyForce=function(l,m,g){var p={x:m.x-l.position.x,y:m.y-l.position.y};l.force.x+=g.x,l.force.y+=g.y,l.torque+=p.x*g.y-p.y*g.x},n._totalProperties=function(l){for(var m={mass:0,area:0,inertia:0,centre:{x:0,y:0}},g=l.parts.length===1?0:1;g<l.parts.length;g++){var p=l.parts[g],v=p.mass!==1/0?p.mass:1;m.mass+=v,m.area+=p.area,m.inertia+=p.inertia,m.centre=a.add(m.centre,a.mult(p.position,v))}return m.centre=a.div(m.centre,m.mass),m}})()},function(t,i,r){var n={};t.exports=n;var o=r(0);(function(){n.on=function(a,c,f){for(var u=c.split(" "),d,h=0;h<u.length;h++)d=u[h],a.events=a.events||{},a.events[d]=a.events[d]||[],a.events[d].push(f);return f},n.off=function(a,c,f){if(!c){a.events={};return}typeof c=="function"&&(f=c,c=o.keys(a.events).join(" "));for(var u=c.split(" "),d=0;d<u.length;d++){var h=a.events[u[d]],l=[];if(f&&h)for(var m=0;m<h.length;m++)h[m]!==f&&l.push(h[m]);a.events[u[d]]=l}},n.trigger=function(a,c,f){var u,d,h,l,m=a.events;if(m&&o.keys(m).length>0){f||(f={}),u=c.split(" ");for(var g=0;g<u.length;g++)if(d=u[g],h=m[d],h){l=o.clone(f,!1),l.name=d,l.source=a;for(var p=0;p<h.length;p++)h[p].apply(a,[l])}}}})()},function(t,i,r){var n={};t.exports=n;var o=r(5),a=r(0),c=r(1),f=r(4);(function(){n.create=function(u){return a.extend({id:a.nextId(),type:"composite",parent:null,isModified:!1,bodies:[],constraints:[],composites:[],label:"Composite",plugin:{},cache:{allBodies:null,allConstraints:null,allComposites:null}},u)},n.setModified=function(u,d,h,l){if(u.isModified=d,d&&u.cache&&(u.cache.allBodies=null,u.cache.allConstraints=null,u.cache.allComposites=null),h&&u.parent&&n.setModified(u.parent,d,h,l),l)for(var m=0;m<u.composites.length;m++){var g=u.composites[m];n.setModified(g,d,h,l)}},n.add=function(u,d){var h=[].concat(d);o.trigger(u,"beforeAdd",{object:d});for(var l=0;l<h.length;l++){var m=h[l];switch(m.type){case"body":if(m.parent!==m){a.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");break}n.addBody(u,m);break;case"constraint":n.addConstraint(u,m);break;case"composite":n.addComposite(u,m);break;case"mouseConstraint":n.addConstraint(u,m.constraint);break}}return o.trigger(u,"afterAdd",{object:d}),u},n.remove=function(u,d,h){var l=[].concat(d);o.trigger(u,"beforeRemove",{object:d});for(var m=0;m<l.length;m++){var g=l[m];switch(g.type){case"body":n.removeBody(u,g,h);break;case"constraint":n.removeConstraint(u,g,h);break;case"composite":n.removeComposite(u,g,h);break;case"mouseConstraint":n.removeConstraint(u,g.constraint);break}}return o.trigger(u,"afterRemove",{object:d}),u},n.addComposite=function(u,d){return u.composites.push(d),d.parent=u,n.setModified(u,!0,!0,!1),u},n.removeComposite=function(u,d,h){var l=a.indexOf(u.composites,d);if(l!==-1){var m=n.allBodies(d);n.removeCompositeAt(u,l);for(var g=0;g<m.length;g++)m[g].sleepCounter=0}if(h)for(var g=0;g<u.composites.length;g++)n.removeComposite(u.composites[g],d,!0);return u},n.removeCompositeAt=function(u,d){return u.composites.splice(d,1),n.setModified(u,!0,!0,!1),u},n.addBody=function(u,d){return u.bodies.push(d),n.setModified(u,!0,!0,!1),u},n.removeBody=function(u,d,h){var l=a.indexOf(u.bodies,d);if(l!==-1&&(n.removeBodyAt(u,l),d.sleepCounter=0),h)for(var m=0;m<u.composites.length;m++)n.removeBody(u.composites[m],d,!0);return u},n.removeBodyAt=function(u,d){return u.bodies.splice(d,1),n.setModified(u,!0,!0,!1),u},n.addConstraint=function(u,d){return u.constraints.push(d),n.setModified(u,!0,!0,!1),u},n.removeConstraint=function(u,d,h){var l=a.indexOf(u.constraints,d);if(l!==-1&&n.removeConstraintAt(u,l),h)for(var m=0;m<u.composites.length;m++)n.removeConstraint(u.composites[m],d,!0);return u},n.removeConstraintAt=function(u,d){return u.constraints.splice(d,1),n.setModified(u,!0,!0,!1),u},n.clear=function(u,d,h){if(h)for(var l=0;l<u.composites.length;l++)n.clear(u.composites[l],d,!0);return d?u.bodies=u.bodies.filter(function(m){return m.isStatic}):u.bodies.length=0,u.constraints.length=0,u.composites.length=0,n.setModified(u,!0,!0,!1),u},n.allBodies=function(u){if(u.cache&&u.cache.allBodies)return u.cache.allBodies;for(var d=[].concat(u.bodies),h=0;h<u.composites.length;h++)d=d.concat(n.allBodies(u.composites[h]));return u.cache&&(u.cache.allBodies=d),d},n.allConstraints=function(u){if(u.cache&&u.cache.allConstraints)return u.cache.allConstraints;for(var d=[].concat(u.constraints),h=0;h<u.composites.length;h++)d=d.concat(n.allConstraints(u.composites[h]));return u.cache&&(u.cache.allConstraints=d),d},n.allComposites=function(u){if(u.cache&&u.cache.allComposites)return u.cache.allComposites;for(var d=[].concat(u.composites),h=0;h<u.composites.length;h++)d=d.concat(n.allComposites(u.composites[h]));return u.cache&&(u.cache.allComposites=d),d},n.get=function(u,d,h){var l,m;switch(h){case"body":l=n.allBodies(u);break;case"constraint":l=n.allConstraints(u);break;case"composite":l=n.allComposites(u).concat(u);break}return l?(m=l.filter(function(g){return g.id.toString()===d.toString()}),m.length===0?null:m[0]):null},n.move=function(u,d,h){return n.remove(u,d),n.add(h,d),u},n.rebase=function(u){for(var d=n.allBodies(u).concat(n.allConstraints(u)).concat(n.allComposites(u)),h=0;h<d.length;h++)d[h].id=a.nextId();return u},n.translate=function(u,d,h){for(var l=h?n.allBodies(u):u.bodies,m=0;m<l.length;m++)f.translate(l[m],d);return u},n.rotate=function(u,d,h,l){for(var m=Math.cos(d),g=Math.sin(d),p=l?n.allBodies(u):u.bodies,v=0;v<p.length;v++){var A=p[v],w=A.position.x-h.x,T=A.position.y-h.y;f.setPosition(A,{x:h.x+(w*m-T*g),y:h.y+(w*g+T*m)}),f.rotate(A,d)}return u},n.scale=function(u,d,h,l,m){for(var g=m?n.allBodies(u):u.bodies,p=0;p<g.length;p++){var v=g[p],A=v.position.x-l.x,w=v.position.y-l.y;f.setPosition(v,{x:l.x+A*d,y:l.y+w*h}),f.scale(v,d,h)}return u},n.bounds=function(u){for(var d=n.allBodies(u),h=[],l=0;l<d.length;l+=1){var m=d[l];h.push(m.bounds.min,m.bounds.max)}return c.create(h)}})()},function(t,i,r){var n={};t.exports=n;var o=r(4),a=r(5),c=r(0);(function(){n._motionWakeThreshold=.18,n._motionSleepThreshold=.08,n._minBias=.9,n.update=function(f,u){for(var d=u/c._baseDelta,h=n._motionSleepThreshold,l=0;l<f.length;l++){var m=f[l],g=o.getSpeed(m),p=o.getAngularSpeed(m),v=g*g+p*p;if(m.force.x!==0||m.force.y!==0){n.set(m,!1);continue}var A=Math.min(m.motion,v),w=Math.max(m.motion,v);m.motion=n._minBias*A+(1-n._minBias)*w,m.sleepThreshold>0&&m.motion<h?(m.sleepCounter+=1,m.sleepCounter>=m.sleepThreshold/d&&n.set(m,!0)):m.sleepCounter>0&&(m.sleepCounter-=1)}},n.afterCollisions=function(f){for(var u=n._motionSleepThreshold,d=0;d<f.length;d++){var h=f[d];if(h.isActive){var l=h.collision,m=l.bodyA.parent,g=l.bodyB.parent;if(!(m.isSleeping&&g.isSleeping||m.isStatic||g.isStatic)&&(m.isSleeping||g.isSleeping)){var p=m.isSleeping&&!m.isStatic?m:g,v=p===m?g:m;!p.isStatic&&v.motion>u&&n.set(p,!1)}}}},n.set=function(f,u){var d=f.isSleeping;u?(f.isSleeping=!0,f.sleepCounter=f.sleepThreshold,f.positionImpulse.x=0,f.positionImpulse.y=0,f.positionPrev.x=f.position.x,f.positionPrev.y=f.position.y,f.anglePrev=f.angle,f.speed=0,f.angularSpeed=0,f.motion=0,d||a.trigger(f,"sleepStart")):(f.isSleeping=!1,f.sleepCounter=0,d&&a.trigger(f,"sleepEnd"))}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(9);(function(){var c=[],f={overlap:0,axis:null},u={overlap:0,axis:null};n.create=function(d,h){return{pair:null,collided:!1,bodyA:d,bodyB:h,parentA:d.parent,parentB:h.parent,depth:0,normal:{x:0,y:0},tangent:{x:0,y:0},penetration:{x:0,y:0},supports:[null,null],supportCount:0}},n.collides=function(d,h,l){if(n._overlapAxes(f,d.vertices,h.vertices,d.axes),f.overlap<=0||(n._overlapAxes(u,h.vertices,d.vertices,h.axes),u.overlap<=0))return null;var m=l&&l.table[a.id(d,h)],g;m?g=m.collision:(g=n.create(d,h),g.collided=!0,g.bodyA=d.id<h.id?d:h,g.bodyB=d.id<h.id?h:d,g.parentA=g.bodyA.parent,g.parentB=g.bodyB.parent),d=g.bodyA,h=g.bodyB;var p;f.overlap<u.overlap?p=f:p=u;var v=g.normal,A=g.tangent,w=g.penetration,T=g.supports,x=p.overlap,y=p.axis,E=y.x,M=y.y,S=h.position.x-d.position.x,_=h.position.y-d.position.y;E*S+M*_>=0&&(E=-E,M=-M),v.x=E,v.y=M,A.x=-M,A.y=E,w.x=E*x,w.y=M*x,g.depth=x;var b=n._findSupports(d,h,v,1),C=0;if(o.contains(d.vertices,b[0])&&(T[C++]=b[0]),o.contains(d.vertices,b[1])&&(T[C++]=b[1]),C<2){var D=n._findSupports(h,d,v,-1);o.contains(h.vertices,D[0])&&(T[C++]=D[0]),C<2&&o.contains(h.vertices,D[1])&&(T[C++]=D[1])}return C===0&&(T[C++]=b[0]),g.supportCount=C,g},n._overlapAxes=function(d,h,l,m){var g=h.length,p=l.length,v=h[0].x,A=h[0].y,w=l[0].x,T=l[0].y,x=m.length,y=Number.MAX_VALUE,E=0,M,S,_,b,C,D;for(C=0;C<x;C++){var U=m[C],I=U.x,O=U.y,B=v*I+A*O,F=w*I+T*O,Z=B,j=F;for(D=1;D<g;D+=1)b=h[D].x*I+h[D].y*O,b>Z?Z=b:b<B&&(B=b);for(D=1;D<p;D+=1)b=l[D].x*I+l[D].y*O,b>j?j=b:b<F&&(F=b);if(S=Z-F,_=j-B,M=S<_?S:_,M<y&&(y=M,E=C,M<=0))break}d.axis=m[E],d.overlap=y},n._findSupports=function(d,h,l,m){var g=h.vertices,p=g.length,v=d.position.x,A=d.position.y,w=l.x*m,T=l.y*m,x=g[0],y=x,E=w*(v-y.x)+T*(A-y.y),M,S,_;for(_=1;_<p;_+=1)y=g[_],S=w*(v-y.x)+T*(A-y.y),S<E&&(E=S,x=y);return M=g[(p+x.index-1)%p],E=w*(v-M.x)+T*(A-M.y),y=g[(x.index+1)%p],w*(v-y.x)+T*(A-y.y)<E?(c[0]=x,c[1]=y,c):(c[0]=x,c[1]=M,c)}})()},function(t,i,r){var n={};t.exports=n;var o=r(16);(function(){n.create=function(a,c){var f=a.bodyA,u=a.bodyB,d={id:n.id(f,u),bodyA:f,bodyB:u,collision:a,contacts:[o.create(),o.create()],contactCount:0,separation:0,isActive:!0,isSensor:f.isSensor||u.isSensor,timeCreated:c,timeUpdated:c,inverseMass:0,friction:0,frictionStatic:0,restitution:0,slop:0};return n.update(d,a,c),d},n.update=function(a,c,f){var u=c.supports,d=c.supportCount,h=a.contacts,l=c.parentA,m=c.parentB;a.isActive=!0,a.timeUpdated=f,a.collision=c,a.separation=c.depth,a.inverseMass=l.inverseMass+m.inverseMass,a.friction=l.friction<m.friction?l.friction:m.friction,a.frictionStatic=l.frictionStatic>m.frictionStatic?l.frictionStatic:m.frictionStatic,a.restitution=l.restitution>m.restitution?l.restitution:m.restitution,a.slop=l.slop>m.slop?l.slop:m.slop,a.contactCount=d,c.pair=a;var g=u[0],p=h[0],v=u[1],A=h[1];(A.vertex===g||p.vertex===v)&&(h[1]=p,h[0]=p=A,A=h[1]),p.vertex=g,A.vertex=v},n.setActive=function(a,c,f){c?(a.isActive=!0,a.timeUpdated=f):(a.isActive=!1,a.contactCount=0)},n.id=function(a,c){return a.id<c.id?a.id.toString(36)+":"+c.id.toString(36):c.id.toString(36)+":"+a.id.toString(36)}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(2),c=r(7),f=r(1),u=r(11),d=r(0);(function(){n._warming=.4,n._torqueDampen=1,n._minLength=1e-6,n.create=function(h){var l=h;l.bodyA&&!l.pointA&&(l.pointA={x:0,y:0}),l.bodyB&&!l.pointB&&(l.pointB={x:0,y:0});var m=l.bodyA?a.add(l.bodyA.position,l.pointA):l.pointA,g=l.bodyB?a.add(l.bodyB.position,l.pointB):l.pointB,p=a.magnitude(a.sub(m,g));l.length=typeof l.length<"u"?l.length:p,l.id=l.id||d.nextId(),l.label=l.label||"Constraint",l.type="constraint",l.stiffness=l.stiffness||(l.length>0?1:.7),l.damping=l.damping||0,l.angularStiffness=l.angularStiffness||0,l.angleA=l.bodyA?l.bodyA.angle:l.angleA,l.angleB=l.bodyB?l.bodyB.angle:l.angleB,l.plugin={};var v={visible:!0,lineWidth:2,strokeStyle:"#ffffff",type:"line",anchors:!0};return l.length===0&&l.stiffness>.1?(v.type="pin",v.anchors=!1):l.stiffness<.9&&(v.type="spring"),l.render=d.extend(v,l.render),l},n.preSolveAll=function(h){for(var l=0;l<h.length;l+=1){var m=h[l],g=m.constraintImpulse;m.isStatic||g.x===0&&g.y===0&&g.angle===0||(m.position.x+=g.x,m.position.y+=g.y,m.angle+=g.angle)}},n.solveAll=function(h,l){for(var m=d.clamp(l/d._baseDelta,0,1),g=0;g<h.length;g+=1){var p=h[g],v=!p.bodyA||p.bodyA&&p.bodyA.isStatic,A=!p.bodyB||p.bodyB&&p.bodyB.isStatic;(v||A)&&n.solve(h[g],m)}for(g=0;g<h.length;g+=1)p=h[g],v=!p.bodyA||p.bodyA&&p.bodyA.isStatic,A=!p.bodyB||p.bodyB&&p.bodyB.isStatic,!v&&!A&&n.solve(h[g],m)},n.solve=function(h,l){var m=h.bodyA,g=h.bodyB,p=h.pointA,v=h.pointB;if(!(!m&&!g)){m&&!m.isStatic&&(a.rotate(p,m.angle-h.angleA,p),h.angleA=m.angle),g&&!g.isStatic&&(a.rotate(v,g.angle-h.angleB,v),h.angleB=g.angle);var A=p,w=v;if(m&&(A=a.add(m.position,p)),g&&(w=a.add(g.position,v)),!(!A||!w)){var T=a.sub(A,w),x=a.magnitude(T);x<n._minLength&&(x=n._minLength);var y=(x-h.length)/x,E=h.stiffness>=1||h.length===0,M=E?h.stiffness*l:h.stiffness*l*l,S=h.damping*l,_=a.mult(T,y*M),b=(m?m.inverseMass:0)+(g?g.inverseMass:0),C=(m?m.inverseInertia:0)+(g?g.inverseInertia:0),D=b+C,U,I,O,B,F;if(S>0){var Z=a.create();O=a.div(T,x),F=a.sub(g&&a.sub(g.position,g.positionPrev)||Z,m&&a.sub(m.position,m.positionPrev)||Z),B=a.dot(O,F)}m&&!m.isStatic&&(I=m.inverseMass/b,m.constraintImpulse.x-=_.x*I,m.constraintImpulse.y-=_.y*I,m.position.x-=_.x*I,m.position.y-=_.y*I,S>0&&(m.positionPrev.x-=S*O.x*B*I,m.positionPrev.y-=S*O.y*B*I),U=a.cross(p,_)/D*n._torqueDampen*m.inverseInertia*(1-h.angularStiffness),m.constraintImpulse.angle-=U,m.angle-=U),g&&!g.isStatic&&(I=g.inverseMass/b,g.constraintImpulse.x+=_.x*I,g.constraintImpulse.y+=_.y*I,g.position.x+=_.x*I,g.position.y+=_.y*I,S>0&&(g.positionPrev.x+=S*O.x*B*I,g.positionPrev.y+=S*O.y*B*I),U=a.cross(v,_)/D*n._torqueDampen*g.inverseInertia*(1-h.angularStiffness),g.constraintImpulse.angle+=U,g.angle+=U)}}},n.postSolveAll=function(h){for(var l=0;l<h.length;l++){var m=h[l],g=m.constraintImpulse;if(!(m.isStatic||g.x===0&&g.y===0&&g.angle===0)){c.set(m,!1);for(var p=0;p<m.parts.length;p++){var v=m.parts[p];o.translate(v.vertices,g),p>0&&(v.position.x+=g.x,v.position.y+=g.y),g.angle!==0&&(o.rotate(v.vertices,g.angle,m.position),u.rotate(v.axes,g.angle),p>0&&a.rotateAbout(v.position,g.angle,m.position,v.position)),f.update(v.bounds,v.vertices,m.velocity)}g.angle*=n._warming,g.x*=n._warming,g.y*=n._warming}}},n.pointAWorld=function(h){return{x:(h.bodyA?h.bodyA.position.x:0)+(h.pointA?h.pointA.x:0),y:(h.bodyA?h.bodyA.position.y:0)+(h.pointA?h.pointA.y:0)}},n.pointBWorld=function(h){return{x:(h.bodyB?h.bodyB.position.x:0)+(h.pointB?h.pointB.x:0),y:(h.bodyB?h.bodyB.position.y:0)+(h.pointB?h.pointB.y:0)}},n.currentLength=function(h){var l=(h.bodyA?h.bodyA.position.x:0)+(h.pointA?h.pointA.x:0),m=(h.bodyA?h.bodyA.position.y:0)+(h.pointA?h.pointA.y:0),g=(h.bodyB?h.bodyB.position.x:0)+(h.pointB?h.pointB.x:0),p=(h.bodyB?h.bodyB.position.y:0)+(h.pointB?h.pointB.y:0),v=l-g,A=m-p;return Math.sqrt(v*v+A*A)}})()},function(t,i,r){var n={};t.exports=n;var o=r(2),a=r(0);(function(){n.fromVertices=function(c){for(var f={},u=0;u<c.length;u++){var d=(u+1)%c.length,h=o.normalise({x:c[d].y-c[u].y,y:c[u].x-c[d].x}),l=h.y===0?1/0:h.x/h.y;l=l.toFixed(3).toString(),f[l]=h}return a.values(f)},n.rotate=function(c,f){if(f!==0)for(var u=Math.cos(f),d=Math.sin(f),h=0;h<c.length;h++){var l=c[h],m;m=l.x*u-l.y*d,l.y=l.x*d+l.y*u,l.x=m}}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(0),c=r(4),f=r(1),u=r(2);(function(){n.rectangle=function(d,h,l,m,g){g=g||{};var p={label:"Rectangle Body",position:{x:d,y:h},vertices:o.fromPath("L 0 0 L "+l+" 0 L "+l+" "+m+" L 0 "+m)};if(g.chamfer){var v=g.chamfer;p.vertices=o.chamfer(p.vertices,v.radius,v.quality,v.qualityMin,v.qualityMax),delete g.chamfer}return c.create(a.extend({},p,g))},n.trapezoid=function(d,h,l,m,g,p){p=p||{},g>=1&&a.warn("Bodies.trapezoid: slope parameter must be < 1."),g*=.5;var v=(1-g*2)*l,A=l*g,w=A+v,T=w+A,x;g<.5?x="L 0 0 L "+A+" "+-m+" L "+w+" "+-m+" L "+T+" 0":x="L 0 0 L "+w+" "+-m+" L "+T+" 0";var y={label:"Trapezoid Body",position:{x:d,y:h},vertices:o.fromPath(x)};if(p.chamfer){var E=p.chamfer;y.vertices=o.chamfer(y.vertices,E.radius,E.quality,E.qualityMin,E.qualityMax),delete p.chamfer}return c.create(a.extend({},y,p))},n.circle=function(d,h,l,m,g){m=m||{};var p={label:"Circle Body",circleRadius:l};g=g||25;var v=Math.ceil(Math.max(10,Math.min(g,l)));return v%2===1&&(v+=1),n.polygon(d,h,v,l,a.extend({},p,m))},n.polygon=function(d,h,l,m,g){if(g=g||{},l<3)return n.circle(d,h,m,g);for(var p=2*Math.PI/l,v="",A=p*.5,w=0;w<l;w+=1){var T=A+w*p,x=Math.cos(T)*m,y=Math.sin(T)*m;v+="L "+x.toFixed(3)+" "+y.toFixed(3)+" "}var E={label:"Polygon Body",position:{x:d,y:h},vertices:o.fromPath(v)};if(g.chamfer){var M=g.chamfer;E.vertices=o.chamfer(E.vertices,M.radius,M.quality,M.qualityMin,M.qualityMax),delete g.chamfer}return c.create(a.extend({},E,g))},n.fromVertices=function(d,h,l,m,g,p,v,A){var w=a.getDecomp(),T,x,y,E,M,S,_,b,C,D,U;for(T=!!(w&&w.quickDecomp),m=m||{},y=[],g=typeof g<"u"?g:!1,p=typeof p<"u"?p:.01,v=typeof v<"u"?v:10,A=typeof A<"u"?A:.01,a.isArray(l[0])||(l=[l]),D=0;D<l.length;D+=1)if(S=l[D],E=o.isConvex(S),M=!E,M&&!T&&a.warnOnce("Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."),E||!T)E?S=o.clockwiseSort(S):S=o.hull(S),y.push({position:{x:d,y:h},vertices:S});else{var I=S.map(function(ee){return[ee.x,ee.y]});w.makeCCW(I),p!==!1&&w.removeCollinearPoints(I,p),A!==!1&&w.removeDuplicatePoints&&w.removeDuplicatePoints(I,A);var O=w.quickDecomp(I);for(_=0;_<O.length;_++){var B=O[_],F=B.map(function(ee){return{x:ee[0],y:ee[1]}});v>0&&o.area(F)<v||y.push({position:o.centre(F),vertices:F})}}for(_=0;_<y.length;_++)y[_]=c.create(a.extend(y[_],m));if(g){var Z=5;for(_=0;_<y.length;_++){var j=y[_];for(b=_+1;b<y.length;b++){var re=y[b];if(f.overlaps(j.bounds,re.bounds)){var _e=j.vertices,Ce=re.vertices;for(C=0;C<j.vertices.length;C++)for(U=0;U<re.vertices.length;U++){var Y=u.magnitudeSquared(u.sub(_e[(C+1)%_e.length],Ce[U])),te=u.magnitudeSquared(u.sub(_e[C],Ce[(U+1)%Ce.length]));Y<Z&&te<Z&&(_e[C].isInternal=!0,Ce[U].isInternal=!0)}}}}}return y.length>1?(x=c.create(a.extend({parts:y.slice(0)},m)),c.setPosition(x,{x:d,y:h}),x):y[0]}})()},function(t,i,r){var n={};t.exports=n;var o=r(0),a=r(8);(function(){n.create=function(c){var f={bodies:[],collisions:[],pairs:null};return o.extend(f,c)},n.setBodies=function(c,f){c.bodies=f.slice(0)},n.clear=function(c){c.bodies=[],c.collisions=[]},n.collisions=function(c){var f=c.pairs,u=c.bodies,d=u.length,h=n.canCollide,l=a.collides,m=c.collisions,g=0,p,v;for(u.sort(n._compareBoundsX),p=0;p<d;p++){var A=u[p],w=A.bounds,T=A.bounds.max.x,x=A.bounds.max.y,y=A.bounds.min.y,E=A.isStatic||A.isSleeping,M=A.parts.length,S=M===1;for(v=p+1;v<d;v++){var _=u[v],b=_.bounds;if(b.min.x>T)break;if(!(x<b.min.y||y>b.max.y)&&!(E&&(_.isStatic||_.isSleeping))&&h(A.collisionFilter,_.collisionFilter)){var C=_.parts.length;if(S&&C===1){var D=l(A,_,f);D&&(m[g++]=D)}else for(var U=M>1?1:0,I=C>1?1:0,O=U;O<M;O++)for(var B=A.parts[O],w=B.bounds,F=I;F<C;F++){var Z=_.parts[F],b=Z.bounds;if(!(w.min.x>b.max.x||w.max.x<b.min.x||w.max.y<b.min.y||w.min.y>b.max.y)){var D=l(B,Z,f);D&&(m[g++]=D)}}}}}return m.length!==g&&(m.length=g),m},n.canCollide=function(c,f){return c.group===f.group&&c.group!==0?c.group>0:(c.mask&f.category)!==0&&(f.mask&c.category)!==0},n._compareBoundsX=function(c,f){return c.bounds.min.x-f.bounds.min.x}})()},function(t,i,r){var n={};t.exports=n;var o=r(0);(function(){n.create=function(a){var c={};return a||o.log("Mouse.create: element was undefined, defaulting to document.body","warn"),c.element=a||document.body,c.absolute={x:0,y:0},c.position={x:0,y:0},c.mousedownPosition={x:0,y:0},c.mouseupPosition={x:0,y:0},c.offset={x:0,y:0},c.scale={x:1,y:1},c.wheelDelta=0,c.button=-1,c.pixelRatio=parseInt(c.element.getAttribute("data-pixel-ratio"),10)||1,c.sourceEvents={mousemove:null,mousedown:null,mouseup:null,mousewheel:null},c.mousemove=function(f){var u=n._getRelativeMousePosition(f,c.element,c.pixelRatio),d=f.changedTouches;d&&(c.button=0,f.preventDefault()),c.absolute.x=u.x,c.absolute.y=u.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.sourceEvents.mousemove=f},c.mousedown=function(f){var u=n._getRelativeMousePosition(f,c.element,c.pixelRatio),d=f.changedTouches;d?(c.button=0,f.preventDefault()):c.button=f.button,c.absolute.x=u.x,c.absolute.y=u.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mousedownPosition.x=c.position.x,c.mousedownPosition.y=c.position.y,c.sourceEvents.mousedown=f},c.mouseup=function(f){var u=n._getRelativeMousePosition(f,c.element,c.pixelRatio),d=f.changedTouches;d&&f.preventDefault(),c.button=-1,c.absolute.x=u.x,c.absolute.y=u.y,c.position.x=c.absolute.x*c.scale.x+c.offset.x,c.position.y=c.absolute.y*c.scale.y+c.offset.y,c.mouseupPosition.x=c.position.x,c.mouseupPosition.y=c.position.y,c.sourceEvents.mouseup=f},c.mousewheel=function(f){c.wheelDelta=Math.max(-1,Math.min(1,f.wheelDelta||-f.detail)),f.preventDefault(),c.sourceEvents.mousewheel=f},n.setElement(c,c.element),c},n.setElement=function(a,c){a.element=c,c.addEventListener("mousemove",a.mousemove,{passive:!0}),c.addEventListener("mousedown",a.mousedown,{passive:!0}),c.addEventListener("mouseup",a.mouseup,{passive:!0}),c.addEventListener("wheel",a.mousewheel,{passive:!1}),c.addEventListener("touchmove",a.mousemove,{passive:!1}),c.addEventListener("touchstart",a.mousedown,{passive:!1}),c.addEventListener("touchend",a.mouseup,{passive:!1})},n.clearSourceEvents=function(a){a.sourceEvents.mousemove=null,a.sourceEvents.mousedown=null,a.sourceEvents.mouseup=null,a.sourceEvents.mousewheel=null,a.wheelDelta=0},n.setOffset=function(a,c){a.offset.x=c.x,a.offset.y=c.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y},n.setScale=function(a,c){a.scale.x=c.x,a.scale.y=c.y,a.position.x=a.absolute.x*a.scale.x+a.offset.x,a.position.y=a.absolute.y*a.scale.y+a.offset.y},n._getRelativeMousePosition=function(a,c,f){var u=c.getBoundingClientRect(),d=document.documentElement||document.body.parentNode||document.body,h=window.pageXOffset!==void 0?window.pageXOffset:d.scrollLeft,l=window.pageYOffset!==void 0?window.pageYOffset:d.scrollTop,m=a.changedTouches,g,p;return m?(g=m[0].pageX-u.left-h,p=m[0].pageY-u.top-l):(g=a.pageX-u.left-h,p=a.pageY-u.top-l),{x:g/(c.clientWidth/(c.width||c.clientWidth)*f),y:p/(c.clientHeight/(c.height||c.clientHeight)*f)}}})()},function(t,i,r){var n={};t.exports=n;var o=r(0);(function(){n._registry={},n.register=function(a){if(n.isPlugin(a)||o.warn("Plugin.register:",n.toString(a),"does not implement all required fields."),a.name in n._registry){var c=n._registry[a.name],f=n.versionParse(a.version).number,u=n.versionParse(c.version).number;f>u?(o.warn("Plugin.register:",n.toString(c),"was upgraded to",n.toString(a)),n._registry[a.name]=a):f<u?o.warn("Plugin.register:",n.toString(c),"can not be downgraded to",n.toString(a)):a!==c&&o.warn("Plugin.register:",n.toString(a),"is already registered to different plugin object")}else n._registry[a.name]=a;return a},n.resolve=function(a){return n._registry[n.dependencyParse(a).name]},n.toString=function(a){return typeof a=="string"?a:(a.name||"anonymous")+"@"+(a.version||a.range||"0.0.0")},n.isPlugin=function(a){return a&&a.name&&a.version&&a.install},n.isUsed=function(a,c){return a.used.indexOf(c)>-1},n.isFor=function(a,c){var f=a.for&&n.dependencyParse(a.for);return!a.for||c.name===f.name&&n.versionSatisfies(c.version,f.range)},n.use=function(a,c){if(a.uses=(a.uses||[]).concat(c||[]),a.uses.length===0){o.warn("Plugin.use:",n.toString(a),"does not specify any dependencies to install.");return}for(var f=n.dependencies(a),u=o.topologicalSort(f),d=[],h=0;h<u.length;h+=1)if(u[h]!==a.name){var l=n.resolve(u[h]);if(!l){d.push("❌ "+u[h]);continue}n.isUsed(a,l.name)||(n.isFor(l,a)||(o.warn("Plugin.use:",n.toString(l),"is for",l.for,"but installed on",n.toString(a)+"."),l._warned=!0),l.install?l.install(a):(o.warn("Plugin.use:",n.toString(l),"does not specify an install function."),l._warned=!0),l._warned?(d.push("🔶 "+n.toString(l)),delete l._warned):d.push("✅ "+n.toString(l)),a.used.push(l.name))}d.length>0&&o.info(d.join("  "))},n.dependencies=function(a,c){var f=n.dependencyParse(a),u=f.name;if(c=c||{},!(u in c)){a=n.resolve(a)||a,c[u]=o.map(a.uses||[],function(h){n.isPlugin(h)&&n.register(h);var l=n.dependencyParse(h),m=n.resolve(h);return m&&!n.versionSatisfies(m.version,l.range)?(o.warn("Plugin.dependencies:",n.toString(m),"does not satisfy",n.toString(l),"used by",n.toString(f)+"."),m._warned=!0,a._warned=!0):m||(o.warn("Plugin.dependencies:",n.toString(h),"used by",n.toString(f),"could not be resolved."),a._warned=!0),l.name});for(var d=0;d<c[u].length;d+=1)n.dependencies(c[u][d],c);return c}},n.dependencyParse=function(a){if(o.isString(a)){var c=/^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;return c.test(a)||o.warn("Plugin.dependencyParse:",a,"is not a valid dependency string."),{name:a.split("@")[0],range:a.split("@")[1]||"*"}}return{name:a.name,range:a.range||a.version}},n.versionParse=function(a){var c=/^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;c.test(a)||o.warn("Plugin.versionParse:",a,"is not a valid version or range.");var f=c.exec(a),u=Number(f[4]),d=Number(f[5]),h=Number(f[6]);return{isRange:!!(f[1]||f[2]),version:f[3],range:a,operator:f[1]||f[2]||"",major:u,minor:d,patch:h,parts:[u,d,h],prerelease:f[7],number:u*1e8+d*1e4+h}},n.versionSatisfies=function(a,c){c=c||"*";var f=n.versionParse(c),u=n.versionParse(a);if(f.isRange){if(f.operator==="*"||a==="*")return!0;if(f.operator===">")return u.number>f.number;if(f.operator===">=")return u.number>=f.number;if(f.operator==="~")return u.major===f.major&&u.minor===f.minor&&u.patch>=f.patch;if(f.operator==="^")return f.major>0?u.major===f.major&&u.number>=f.number:f.minor>0?u.minor===f.minor&&u.patch>=f.patch:u.patch===f.patch}return a===c||a==="*"}})()},function(t,i){var r={};t.exports=r,function(){r.create=function(n){return{vertex:n,normalImpulse:0,tangentImpulse:0}}}()},function(t,i,r){var n={};t.exports=n;var o=r(7),a=r(18),c=r(13),f=r(19),u=r(5),d=r(6),h=r(10),l=r(0),m=r(4);(function(){n._deltaMax=1e3/60,n.create=function(g){g=g||{};var p={positionIterations:6,velocityIterations:4,constraintIterations:2,enableSleeping:!1,events:[],plugin:{},gravity:{x:0,y:1,scale:.001},timing:{timestamp:0,timeScale:1,lastDelta:0,lastElapsed:0,lastUpdatesPerFrame:0}},v=l.extend(p,g);return v.world=g.world||d.create({label:"World"}),v.pairs=g.pairs||f.create(),v.detector=g.detector||c.create(),v.detector.pairs=v.pairs,v.grid={buckets:[]},v.world.gravity=v.gravity,v.broadphase=v.grid,v.metrics={},v},n.update=function(g,p){var v=l.now(),A=g.world,w=g.detector,T=g.pairs,x=g.timing,y=x.timestamp,E;p>n._deltaMax&&l.warnOnce("Matter.Engine.update: delta argument is recommended to be less than or equal to",n._deltaMax.toFixed(3),"ms."),p=typeof p<"u"?p:l._baseDelta,p*=x.timeScale,x.timestamp+=p,x.lastDelta=p;var M={timestamp:x.timestamp,delta:p};u.trigger(g,"beforeUpdate",M);var S=d.allBodies(A),_=d.allConstraints(A);for(A.isModified&&(c.setBodies(w,S),d.setModified(A,!1,!1,!0)),g.enableSleeping&&o.update(S,p),n._bodiesApplyGravity(S,g.gravity),p>0&&n._bodiesUpdate(S,p),u.trigger(g,"beforeSolve",M),h.preSolveAll(S),E=0;E<g.constraintIterations;E++)h.solveAll(_,p);h.postSolveAll(S);var b=c.collisions(w);f.update(T,b,y),g.enableSleeping&&o.afterCollisions(T.list),T.collisionStart.length>0&&u.trigger(g,"collisionStart",{pairs:T.collisionStart,timestamp:x.timestamp,delta:p});var C=l.clamp(20/g.positionIterations,0,1);for(a.preSolvePosition(T.list),E=0;E<g.positionIterations;E++)a.solvePosition(T.list,p,C);for(a.postSolvePosition(S),h.preSolveAll(S),E=0;E<g.constraintIterations;E++)h.solveAll(_,p);for(h.postSolveAll(S),a.preSolveVelocity(T.list),E=0;E<g.velocityIterations;E++)a.solveVelocity(T.list,p);return n._bodiesUpdateVelocities(S),T.collisionActive.length>0&&u.trigger(g,"collisionActive",{pairs:T.collisionActive,timestamp:x.timestamp,delta:p}),T.collisionEnd.length>0&&u.trigger(g,"collisionEnd",{pairs:T.collisionEnd,timestamp:x.timestamp,delta:p}),n._bodiesClearForces(S),u.trigger(g,"afterUpdate",M),g.timing.lastElapsed=l.now()-v,g},n.merge=function(g,p){if(l.extend(g,p),p.world){g.world=p.world,n.clear(g);for(var v=d.allBodies(g.world),A=0;A<v.length;A++){var w=v[A];o.set(w,!1),w.id=l.nextId()}}},n.clear=function(g){f.clear(g.pairs),c.clear(g.detector)},n._bodiesClearForces=function(g){for(var p=g.length,v=0;v<p;v++){var A=g[v];A.force.x=0,A.force.y=0,A.torque=0}},n._bodiesApplyGravity=function(g,p){var v=typeof p.scale<"u"?p.scale:.001,A=g.length;if(!(p.x===0&&p.y===0||v===0))for(var w=0;w<A;w++){var T=g[w];T.isStatic||T.isSleeping||(T.force.y+=T.mass*p.y*v,T.force.x+=T.mass*p.x*v)}},n._bodiesUpdate=function(g,p){for(var v=g.length,A=0;A<v;A++){var w=g[A];w.isStatic||w.isSleeping||m.update(w,p)}},n._bodiesUpdateVelocities=function(g){for(var p=g.length,v=0;v<p;v++)m.updateVelocities(g[v])}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(0),c=r(1);(function(){n._restingThresh=2,n._restingThreshTangent=Math.sqrt(6),n._positionDampen=.9,n._positionWarming=.8,n._frictionNormalMultiplier=5,n._frictionMaxStatic=Number.MAX_VALUE,n.preSolvePosition=function(f){var u,d,h,l=f.length;for(u=0;u<l;u++)d=f[u],d.isActive&&(h=d.contactCount,d.collision.parentA.totalContacts+=h,d.collision.parentB.totalContacts+=h)},n.solvePosition=function(f,u,d){var h,l,m,g,p,v,A,w,T=n._positionDampen*(d||1),x=a.clamp(u/a._baseDelta,0,1),y=f.length;for(h=0;h<y;h++)l=f[h],!(!l.isActive||l.isSensor)&&(m=l.collision,g=m.parentA,p=m.parentB,v=m.normal,l.separation=m.depth+v.x*(p.positionImpulse.x-g.positionImpulse.x)+v.y*(p.positionImpulse.y-g.positionImpulse.y));for(h=0;h<y;h++)l=f[h],!(!l.isActive||l.isSensor)&&(m=l.collision,g=m.parentA,p=m.parentB,v=m.normal,w=l.separation-l.slop*x,(g.isStatic||p.isStatic)&&(w*=2),g.isStatic||g.isSleeping||(A=T/g.totalContacts,g.positionImpulse.x+=v.x*w*A,g.positionImpulse.y+=v.y*w*A),p.isStatic||p.isSleeping||(A=T/p.totalContacts,p.positionImpulse.x-=v.x*w*A,p.positionImpulse.y-=v.y*w*A))},n.postSolvePosition=function(f){for(var u=n._positionWarming,d=f.length,h=o.translate,l=c.update,m=0;m<d;m++){var g=f[m],p=g.positionImpulse,v=p.x,A=p.y,w=g.velocity;if(g.totalContacts=0,v!==0||A!==0){for(var T=0;T<g.parts.length;T++){var x=g.parts[T];h(x.vertices,p),l(x.bounds,x.vertices,w),x.position.x+=v,x.position.y+=A}g.positionPrev.x+=v,g.positionPrev.y+=A,v*w.x+A*w.y<0?(p.x=0,p.y=0):(p.x*=u,p.y*=u)}}},n.preSolveVelocity=function(f){var u=f.length,d,h;for(d=0;d<u;d++){var l=f[d];if(!(!l.isActive||l.isSensor)){var m=l.contacts,g=l.contactCount,p=l.collision,v=p.parentA,A=p.parentB,w=p.normal,T=p.tangent;for(h=0;h<g;h++){var x=m[h],y=x.vertex,E=x.normalImpulse,M=x.tangentImpulse;if(E!==0||M!==0){var S=w.x*E+T.x*M,_=w.y*E+T.y*M;v.isStatic||v.isSleeping||(v.positionPrev.x+=S*v.inverseMass,v.positionPrev.y+=_*v.inverseMass,v.anglePrev+=v.inverseInertia*((y.x-v.position.x)*_-(y.y-v.position.y)*S)),A.isStatic||A.isSleeping||(A.positionPrev.x-=S*A.inverseMass,A.positionPrev.y-=_*A.inverseMass,A.anglePrev-=A.inverseInertia*((y.x-A.position.x)*_-(y.y-A.position.y)*S))}}}}},n.solveVelocity=function(f,u){var d=u/a._baseDelta,h=d*d,l=h*d,m=-n._restingThresh*d,g=n._restingThreshTangent,p=n._frictionNormalMultiplier*d,v=n._frictionMaxStatic,A=f.length,w,T,x,y;for(x=0;x<A;x++){var E=f[x];if(!(!E.isActive||E.isSensor)){var M=E.collision,S=M.parentA,_=M.parentB,b=M.normal.x,C=M.normal.y,D=M.tangent.x,U=M.tangent.y,I=E.inverseMass,O=E.friction*E.frictionStatic*p,B=E.contacts,F=E.contactCount,Z=1/F,j=S.position.x-S.positionPrev.x,re=S.position.y-S.positionPrev.y,_e=S.angle-S.anglePrev,Ce=_.position.x-_.positionPrev.x,Y=_.position.y-_.positionPrev.y,te=_.angle-_.anglePrev;for(y=0;y<F;y++){var ee=B[y],se=ee.vertex,he=se.x-S.position.x,Oe=se.y-S.position.y,xe=se.x-_.position.x,Xe=se.y-_.position.y,Ne=j-Oe*_e,ze=re+he*_e,N=Ce-Xe*te,_t=Y+xe*te,He=Ne-N,Be=ze-_t,Se=b*He+C*Be,Ve=D*He+U*Be,Me=E.separation+Se,L=Math.min(Me,1);L=Me<0?0:L;var R=L*O;Ve<-R||Ve>R?(T=Ve>0?Ve:-Ve,w=E.friction*(Ve>0?1:-1)*l,w<-T?w=-T:w>T&&(w=T)):(w=Ve,T=v);var G=he*C-Oe*b,K=xe*C-Xe*b,Q=Z/(I+S.inverseInertia*G*G+_.inverseInertia*K*K),$=(1+E.restitution)*Se*Q;if(w*=Q,Se<m)ee.normalImpulse=0;else{var ve=ee.normalImpulse;ee.normalImpulse+=$,ee.normalImpulse>0&&(ee.normalImpulse=0),$=ee.normalImpulse-ve}if(Ve<-g||Ve>g)ee.tangentImpulse=0;else{var oe=ee.tangentImpulse;ee.tangentImpulse+=w,ee.tangentImpulse<-T&&(ee.tangentImpulse=-T),ee.tangentImpulse>T&&(ee.tangentImpulse=T),w=ee.tangentImpulse-oe}var ye=b*$+D*w,Ee=C*$+U*w;S.isStatic||S.isSleeping||(S.positionPrev.x+=ye*S.inverseMass,S.positionPrev.y+=Ee*S.inverseMass,S.anglePrev+=(he*Ee-Oe*ye)*S.inverseInertia),_.isStatic||_.isSleeping||(_.positionPrev.x-=ye*_.inverseMass,_.positionPrev.y-=Ee*_.inverseMass,_.anglePrev-=(xe*Ee-Xe*ye)*_.inverseInertia)}}}}})()},function(t,i,r){var n={};t.exports=n;var o=r(9),a=r(0);(function(){n.create=function(c){return a.extend({table:{},list:[],collisionStart:[],collisionActive:[],collisionEnd:[]},c)},n.update=function(c,f,u){var d=o.update,h=o.create,l=o.setActive,m=c.table,g=c.list,p=g.length,v=p,A=c.collisionStart,w=c.collisionEnd,T=c.collisionActive,x=f.length,y=0,E=0,M=0,S,_,b;for(b=0;b<x;b++)S=f[b],_=S.pair,_?(_.isActive&&(T[M++]=_),d(_,S,u)):(_=h(S,u),m[_.id]=_,A[y++]=_,g[v++]=_);for(v=0,p=g.length,b=0;b<p;b++)_=g[b],_.timeUpdated>=u?g[v++]=_:(l(_,!1,u),_.collision.bodyA.sleepCounter>0&&_.collision.bodyB.sleepCounter>0?g[v++]=_:(w[E++]=_,delete m[_.id]));g.length!==v&&(g.length=v),A.length!==y&&(A.length=y),w.length!==E&&(w.length=E),T.length!==M&&(T.length=M)},n.clear=function(c){return c.table={},c.list.length=0,c.collisionStart.length=0,c.collisionActive.length=0,c.collisionEnd.length=0,c}})()},function(t,i,r){var n=t.exports=r(21);n.Axes=r(11),n.Bodies=r(12),n.Body=r(4),n.Bounds=r(1),n.Collision=r(8),n.Common=r(0),n.Composite=r(6),n.Composites=r(22),n.Constraint=r(10),n.Contact=r(16),n.Detector=r(13),n.Engine=r(17),n.Events=r(5),n.Grid=r(23),n.Mouse=r(14),n.MouseConstraint=r(24),n.Pair=r(9),n.Pairs=r(19),n.Plugin=r(15),n.Query=r(25),n.Render=r(26),n.Resolver=r(18),n.Runner=r(27),n.SAT=r(28),n.Sleeping=r(7),n.Svg=r(29),n.Vector=r(2),n.Vertices=r(3),n.World=r(30),n.Engine.run=n.Runner.run,n.Common.deprecated(n.Engine,"run","Engine.run ➤ use Matter.Runner.run(engine) instead")},function(t,i,r){var n={};t.exports=n;var o=r(15),a=r(0);(function(){n.name="matter-js",n.version="0.20.0",n.uses=[],n.used=[],n.use=function(){o.use(n,Array.prototype.slice.call(arguments))},n.before=function(c,f){return c=c.replace(/^Matter./,""),a.chainPathBefore(n,c,f)},n.after=function(c,f){return c=c.replace(/^Matter./,""),a.chainPathAfter(n,c,f)}})()},function(t,i,r){var n={};t.exports=n;var o=r(6),a=r(10),c=r(0),f=r(4),u=r(12),d=c.deprecated;(function(){n.stack=function(h,l,m,g,p,v,A){for(var w=o.create({label:"Stack"}),T=h,x=l,y,E=0,M=0;M<g;M++){for(var S=0,_=0;_<m;_++){var b=A(T,x,_,M,y,E);if(b){var C=b.bounds.max.y-b.bounds.min.y,D=b.bounds.max.x-b.bounds.min.x;C>S&&(S=C),f.translate(b,{x:D*.5,y:C*.5}),T=b.bounds.max.x+p,o.addBody(w,b),y=b,E+=1}else T+=p}x+=S+v,T=h}return w},n.chain=function(h,l,m,g,p,v){for(var A=h.bodies,w=1;w<A.length;w++){var T=A[w-1],x=A[w],y=T.bounds.max.y-T.bounds.min.y,E=T.bounds.max.x-T.bounds.min.x,M=x.bounds.max.y-x.bounds.min.y,S=x.bounds.max.x-x.bounds.min.x,_={bodyA:T,pointA:{x:E*l,y:y*m},bodyB:x,pointB:{x:S*g,y:M*p}},b=c.extend(_,v);o.addConstraint(h,a.create(b))}return h.label+=" Chain",h},n.mesh=function(h,l,m,g,p){var v=h.bodies,A,w,T,x,y;for(A=0;A<m;A++){for(w=1;w<l;w++)T=v[w-1+A*l],x=v[w+A*l],o.addConstraint(h,a.create(c.extend({bodyA:T,bodyB:x},p)));if(A>0)for(w=0;w<l;w++)T=v[w+(A-1)*l],x=v[w+A*l],o.addConstraint(h,a.create(c.extend({bodyA:T,bodyB:x},p))),g&&w>0&&(y=v[w-1+(A-1)*l],o.addConstraint(h,a.create(c.extend({bodyA:y,bodyB:x},p)))),g&&w<l-1&&(y=v[w+1+(A-1)*l],o.addConstraint(h,a.create(c.extend({bodyA:y,bodyB:x},p))))}return h.label+=" Mesh",h},n.pyramid=function(h,l,m,g,p,v,A){return n.stack(h,l,m,g,p,v,function(w,T,x,y,E,M){var S=Math.min(g,Math.ceil(m/2)),_=E?E.bounds.max.x-E.bounds.min.x:0;if(!(y>S)){y=S-y;var b=y,C=m-1-y;if(!(x<b||x>C)){M===1&&f.translate(E,{x:(x+(m%2===1?1:-1))*_,y:0});var D=E?x*_:0;return A(h+D+x*p,T,x,y,E,M)}}})},n.newtonsCradle=function(h,l,m,g,p){for(var v=o.create({label:"Newtons Cradle"}),A=0;A<m;A++){var w=1.9,T=u.circle(h+A*(g*w),l+p,g,{inertia:1/0,restitution:1,friction:0,frictionAir:1e-4,slop:1}),x=a.create({pointA:{x:h+A*(g*w),y:l},bodyB:T});o.addBody(v,T),o.addConstraint(v,x)}return v},d(n,"newtonsCradle","Composites.newtonsCradle ➤ moved to newtonsCradle example"),n.car=function(h,l,m,g,p){var v=f.nextGroup(!0),A=20,w=-m*.5+A,T=m*.5-A,x=0,y=o.create({label:"Car"}),E=u.rectangle(h,l,m,g,{collisionFilter:{group:v},chamfer:{radius:g*.5},density:2e-4}),M=u.circle(h+w,l+x,p,{collisionFilter:{group:v},friction:.8}),S=u.circle(h+T,l+x,p,{collisionFilter:{group:v},friction:.8}),_=a.create({bodyB:E,pointB:{x:w,y:x},bodyA:M,stiffness:1,length:0}),b=a.create({bodyB:E,pointB:{x:T,y:x},bodyA:S,stiffness:1,length:0});return o.addBody(y,E),o.addBody(y,M),o.addBody(y,S),o.addConstraint(y,_),o.addConstraint(y,b),y},d(n,"car","Composites.car ➤ moved to car example"),n.softBody=function(h,l,m,g,p,v,A,w,T,x){T=c.extend({inertia:1/0},T),x=c.extend({stiffness:.2,render:{type:"line",anchors:!1}},x);var y=n.stack(h,l,m,g,p,v,function(E,M){return u.circle(E,M,w,T)});return n.mesh(y,m,g,A,x),y.label="Soft Body",y},d(n,"softBody","Composites.softBody ➤ moved to softBody and cloth examples")})()},function(t,i,r){var n={};t.exports=n;var o=r(9),a=r(0),c=a.deprecated;(function(){n.create=function(f){var u={buckets:{},pairs:{},pairsList:[],bucketWidth:48,bucketHeight:48};return a.extend(u,f)},n.update=function(f,u,d,h){var l,m,g,p=d.world,v=f.buckets,A,w,T=!1;for(l=0;l<u.length;l++){var x=u[l];if(!(x.isSleeping&&!h)&&!(p.bounds&&(x.bounds.max.x<p.bounds.min.x||x.bounds.min.x>p.bounds.max.x||x.bounds.max.y<p.bounds.min.y||x.bounds.min.y>p.bounds.max.y))){var y=n._getRegion(f,x);if(!x.region||y.id!==x.region.id||h){(!x.region||h)&&(x.region=y);var E=n._regionUnion(y,x.region);for(m=E.startCol;m<=E.endCol;m++)for(g=E.startRow;g<=E.endRow;g++){w=n._getBucketId(m,g),A=v[w];var M=m>=y.startCol&&m<=y.endCol&&g>=y.startRow&&g<=y.endRow,S=m>=x.region.startCol&&m<=x.region.endCol&&g>=x.region.startRow&&g<=x.region.endRow;!M&&S&&S&&A&&n._bucketRemoveBody(f,A,x),(x.region===y||M&&!S||h)&&(A||(A=n._createBucket(v,w)),n._bucketAddBody(f,A,x))}x.region=y,T=!0}}}T&&(f.pairsList=n._createActivePairsList(f))},c(n,"update","Grid.update ➤ replaced by Matter.Detector"),n.clear=function(f){f.buckets={},f.pairs={},f.pairsList=[]},c(n,"clear","Grid.clear ➤ replaced by Matter.Detector"),n._regionUnion=function(f,u){var d=Math.min(f.startCol,u.startCol),h=Math.max(f.endCol,u.endCol),l=Math.min(f.startRow,u.startRow),m=Math.max(f.endRow,u.endRow);return n._createRegion(d,h,l,m)},n._getRegion=function(f,u){var d=u.bounds,h=Math.floor(d.min.x/f.bucketWidth),l=Math.floor(d.max.x/f.bucketWidth),m=Math.floor(d.min.y/f.bucketHeight),g=Math.floor(d.max.y/f.bucketHeight);return n._createRegion(h,l,m,g)},n._createRegion=function(f,u,d,h){return{id:f+","+u+","+d+","+h,startCol:f,endCol:u,startRow:d,endRow:h}},n._getBucketId=function(f,u){return"C"+f+"R"+u},n._createBucket=function(f,u){var d=f[u]=[];return d},n._bucketAddBody=function(f,u,d){var h=f.pairs,l=o.id,m=u.length,g;for(g=0;g<m;g++){var p=u[g];if(!(d.id===p.id||d.isStatic&&p.isStatic)){var v=l(d,p),A=h[v];A?A[2]+=1:h[v]=[d,p,1]}}u.push(d)},n._bucketRemoveBody=function(f,u,d){var h=f.pairs,l=o.id,m;u.splice(a.indexOf(u,d),1);var g=u.length;for(m=0;m<g;m++){var p=h[l(d,u[m])];p&&(p[2]-=1)}},n._createActivePairsList=function(f){var u,d=f.pairs,h=a.keys(d),l=h.length,m=[],g;for(g=0;g<l;g++)u=d[h[g]],u[2]>0?m.push(u):delete d[h[g]];return m}})()},function(t,i,r){var n={};t.exports=n;var o=r(3),a=r(7),c=r(14),f=r(5),u=r(13),d=r(10),h=r(6),l=r(0),m=r(1);(function(){n.create=function(g,p){var v=(g?g.mouse:null)||(p?p.mouse:null);v||(g&&g.render&&g.render.canvas?v=c.create(g.render.canvas):p&&p.element?v=c.create(p.element):(v=c.create(),l.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));var A=d.create({label:"Mouse Constraint",pointA:v.position,pointB:{x:0,y:0},length:.01,stiffness:.1,angularStiffness:1,render:{strokeStyle:"#90EE90",lineWidth:3}}),w={type:"mouseConstraint",mouse:v,element:null,body:null,constraint:A,collisionFilter:{category:1,mask:4294967295,group:0}},T=l.extend(w,p);return f.on(g,"beforeUpdate",function(){var x=h.allBodies(g.world);n.update(T,x),n._triggerEvents(T)}),T},n.update=function(g,p){var v=g.mouse,A=g.constraint,w=g.body;if(v.button===0){if(A.bodyB)a.set(A.bodyB,!1),A.pointA=v.position;else for(var T=0;T<p.length;T++)if(w=p[T],m.contains(w.bounds,v.position)&&u.canCollide(w.collisionFilter,g.collisionFilter))for(var x=w.parts.length>1?1:0;x<w.parts.length;x++){var y=w.parts[x];if(o.contains(y.vertices,v.position)){A.pointA=v.position,A.bodyB=g.body=w,A.pointB={x:v.position.x-w.position.x,y:v.position.y-w.position.y},A.angleB=w.angle,a.set(w,!1),f.trigger(g,"startdrag",{mouse:v,body:w});break}}}else A.bodyB=g.body=null,A.pointB=null,w&&f.trigger(g,"enddrag",{mouse:v,body:w})},n._triggerEvents=function(g){var p=g.mouse,v=p.sourceEvents;v.mousemove&&f.trigger(g,"mousemove",{mouse:p}),v.mousedown&&f.trigger(g,"mousedown",{mouse:p}),v.mouseup&&f.trigger(g,"mouseup",{mouse:p}),c.clearSourceEvents(p)}})()},function(t,i,r){var n={};t.exports=n;var o=r(2),a=r(8),c=r(1),f=r(12),u=r(3);(function(){n.collides=function(d,h){for(var l=[],m=h.length,g=d.bounds,p=a.collides,v=c.overlaps,A=0;A<m;A++){var w=h[A],T=w.parts.length,x=T===1?0:1;if(v(w.bounds,g))for(var y=x;y<T;y++){var E=w.parts[y];if(v(E.bounds,g)){var M=p(E,d);if(M){l.push(M);break}}}}return l},n.ray=function(d,h,l,m){m=m||1e-100;for(var g=o.angle(h,l),p=o.magnitude(o.sub(h,l)),v=(l.x+h.x)*.5,A=(l.y+h.y)*.5,w=f.rectangle(v,A,p,m,{angle:g}),T=n.collides(w,d),x=0;x<T.length;x+=1){var y=T[x];y.body=y.bodyB=y.bodyA}return T},n.region=function(d,h,l){for(var m=[],g=0;g<d.length;g++){var p=d[g],v=c.overlaps(p.bounds,h);(v&&!l||!v&&l)&&m.push(p)}return m},n.point=function(d,h){for(var l=[],m=0;m<d.length;m++){var g=d[m];if(c.contains(g.bounds,h))for(var p=g.parts.length===1?0:1;p<g.parts.length;p++){var v=g.parts[p];if(c.contains(v.bounds,h)&&u.contains(v.vertices,h)){l.push(g);break}}}return l}})()},function(t,i,r){var n={};t.exports=n;var o=r(4),a=r(0),c=r(6),f=r(1),u=r(5),d=r(2),h=r(14);(function(){var l,m;typeof window<"u"&&(l=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||function(x){window.setTimeout(function(){x(a.now())},1e3/60)},m=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame),n._goodFps=30,n._goodDelta=1e3/60,n.create=function(x){var y={engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,timing:{historySize:60,delta:0,deltaHistory:[],lastTime:0,lastTimestamp:0,lastElapsed:0,timestampElapsed:0,timestampElapsedHistory:[],engineDeltaHistory:[],engineElapsedHistory:[],engineUpdatesHistory:[],elapsedHistory:[]},options:{width:800,height:600,pixelRatio:1,background:"#14151f",wireframeBackground:"#14151f",wireframeStrokeStyle:"#bbb",hasBounds:!!x.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showStats:!1,showPerformance:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},E=a.extend(y,x);return E.canvas&&(E.canvas.width=E.options.width||E.canvas.width,E.canvas.height=E.options.height||E.canvas.height),E.mouse=x.mouse,E.engine=x.engine,E.canvas=E.canvas||v(E.options.width,E.options.height),E.context=E.canvas.getContext("2d"),E.textures={},E.bounds=E.bounds||{min:{x:0,y:0},max:{x:E.canvas.width,y:E.canvas.height}},E.controller=n,E.options.showBroadphase=!1,E.options.pixelRatio!==1&&n.setPixelRatio(E,E.options.pixelRatio),a.isElement(E.element)&&E.element.appendChild(E.canvas),E},n.run=function(x){(function y(E){x.frameRequestId=l(y),g(x,E),n.world(x,E),x.context.setTransform(x.options.pixelRatio,0,0,x.options.pixelRatio,0,0),(x.options.showStats||x.options.showDebug)&&n.stats(x,x.context,E),(x.options.showPerformance||x.options.showDebug)&&n.performance(x,x.context,E),x.context.setTransform(1,0,0,1,0,0)})()},n.stop=function(x){m(x.frameRequestId)},n.setPixelRatio=function(x,y){var E=x.options,M=x.canvas;y==="auto"&&(y=A(M)),E.pixelRatio=y,M.setAttribute("data-pixel-ratio",y),M.width=E.width*y,M.height=E.height*y,M.style.width=E.width+"px",M.style.height=E.height+"px"},n.setSize=function(x,y,E){x.options.width=y,x.options.height=E,x.bounds.max.x=x.bounds.min.x+y,x.bounds.max.y=x.bounds.min.y+E,x.options.pixelRatio!==1?n.setPixelRatio(x,x.options.pixelRatio):(x.canvas.width=y,x.canvas.height=E)},n.lookAt=function(x,y,E,M){M=typeof M<"u"?M:!0,y=a.isArray(y)?y:[y],E=E||{x:0,y:0};for(var S={min:{x:1/0,y:1/0},max:{x:-1/0,y:-1/0}},_=0;_<y.length;_+=1){var b=y[_],C=b.bounds?b.bounds.min:b.min||b.position||b,D=b.bounds?b.bounds.max:b.max||b.position||b;C&&D&&(C.x<S.min.x&&(S.min.x=C.x),D.x>S.max.x&&(S.max.x=D.x),C.y<S.min.y&&(S.min.y=C.y),D.y>S.max.y&&(S.max.y=D.y))}var U=S.max.x-S.min.x+2*E.x,I=S.max.y-S.min.y+2*E.y,O=x.canvas.height,B=x.canvas.width,F=B/O,Z=U/I,j=1,re=1;Z>F?re=Z/F:j=F/Z,x.options.hasBounds=!0,x.bounds.min.x=S.min.x,x.bounds.max.x=S.min.x+U*j,x.bounds.min.y=S.min.y,x.bounds.max.y=S.min.y+I*re,M&&(x.bounds.min.x+=U*.5-U*j*.5,x.bounds.max.x+=U*.5-U*j*.5,x.bounds.min.y+=I*.5-I*re*.5,x.bounds.max.y+=I*.5-I*re*.5),x.bounds.min.x-=E.x,x.bounds.max.x-=E.x,x.bounds.min.y-=E.y,x.bounds.max.y-=E.y,x.mouse&&(h.setScale(x.mouse,{x:(x.bounds.max.x-x.bounds.min.x)/x.canvas.width,y:(x.bounds.max.y-x.bounds.min.y)/x.canvas.height}),h.setOffset(x.mouse,x.bounds.min))},n.startViewTransform=function(x){var y=x.bounds.max.x-x.bounds.min.x,E=x.bounds.max.y-x.bounds.min.y,M=y/x.options.width,S=E/x.options.height;x.context.setTransform(x.options.pixelRatio/M,0,0,x.options.pixelRatio/S,0,0),x.context.translate(-x.bounds.min.x,-x.bounds.min.y)},n.endViewTransform=function(x){x.context.setTransform(x.options.pixelRatio,0,0,x.options.pixelRatio,0,0)},n.world=function(x,y){var E=a.now(),M=x.engine,S=M.world,_=x.canvas,b=x.context,C=x.options,D=x.timing,U=c.allBodies(S),I=c.allConstraints(S),O=C.wireframes?C.wireframeBackground:C.background,B=[],F=[],Z,j={timestamp:M.timing.timestamp};if(u.trigger(x,"beforeRender",j),x.currentBackground!==O&&T(x,O),b.globalCompositeOperation="source-in",b.fillStyle="transparent",b.fillRect(0,0,_.width,_.height),b.globalCompositeOperation="source-over",C.hasBounds){for(Z=0;Z<U.length;Z++){var re=U[Z];f.overlaps(re.bounds,x.bounds)&&B.push(re)}for(Z=0;Z<I.length;Z++){var _e=I[Z],Ce=_e.bodyA,Y=_e.bodyB,te=_e.pointA,ee=_e.pointB;Ce&&(te=d.add(Ce.position,_e.pointA)),Y&&(ee=d.add(Y.position,_e.pointB)),!(!te||!ee)&&(f.contains(x.bounds,te)||f.contains(x.bounds,ee))&&F.push(_e)}n.startViewTransform(x),x.mouse&&(h.setScale(x.mouse,{x:(x.bounds.max.x-x.bounds.min.x)/x.options.width,y:(x.bounds.max.y-x.bounds.min.y)/x.options.height}),h.setOffset(x.mouse,x.bounds.min))}else F=I,B=U,x.options.pixelRatio!==1&&x.context.setTransform(x.options.pixelRatio,0,0,x.options.pixelRatio,0,0);!C.wireframes||M.enableSleeping&&C.showSleeping?n.bodies(x,B,b):(C.showConvexHulls&&n.bodyConvexHulls(x,B,b),n.bodyWireframes(x,B,b)),C.showBounds&&n.bodyBounds(x,B,b),(C.showAxes||C.showAngleIndicator)&&n.bodyAxes(x,B,b),C.showPositions&&n.bodyPositions(x,B,b),C.showVelocity&&n.bodyVelocity(x,B,b),C.showIds&&n.bodyIds(x,B,b),C.showSeparations&&n.separations(x,M.pairs.list,b),C.showCollisions&&n.collisions(x,M.pairs.list,b),C.showVertexNumbers&&n.vertexNumbers(x,B,b),C.showMousePosition&&n.mousePosition(x,x.mouse,b),n.constraints(F,b),C.hasBounds&&n.endViewTransform(x),u.trigger(x,"afterRender",j),D.lastElapsed=a.now()-E},n.stats=function(x,y,E){for(var M=x.engine,S=M.world,_=c.allBodies(S),b=0,C=55,D=44,U=0,I=0,O=0;O<_.length;O+=1)b+=_[O].parts.length;var B={Part:b,Body:_.length,Cons:c.allConstraints(S).length,Comp:c.allComposites(S).length,Pair:M.pairs.list.length};y.fillStyle="#0e0f19",y.fillRect(U,I,C*5.5,D),y.font="12px Arial",y.textBaseline="top",y.textAlign="right";for(var F in B){var Z=B[F];y.fillStyle="#aaa",y.fillText(F,U+C,I+8),y.fillStyle="#eee",y.fillText(Z,U+C,I+26),U+=C}},n.performance=function(x,y){var E=x.engine,M=x.timing,S=M.deltaHistory,_=M.elapsedHistory,b=M.timestampElapsedHistory,C=M.engineDeltaHistory,D=M.engineUpdatesHistory,U=M.engineElapsedHistory,I=E.timing.lastUpdatesPerFrame,O=E.timing.lastDelta,B=p(S),F=p(_),Z=p(C),j=p(D),re=p(U),_e=p(b),Ce=_e/B||0,Y=Math.round(B/O),te=1e3/B||0,ee=4,se=12,he=60,Oe=34,xe=10,Xe=69;y.fillStyle="#0e0f19",y.fillRect(0,50,se*5+he*6+22,Oe),n.status(y,xe,Xe,he,ee,S.length,Math.round(te)+" fps",te/n._goodFps,function(Ne){return S[Ne]/B-1}),n.status(y,xe+se+he,Xe,he,ee,C.length,O.toFixed(2)+" dt",n._goodDelta/O,function(Ne){return C[Ne]/Z-1}),n.status(y,xe+(se+he)*2,Xe,he,ee,D.length,I+" upf",Math.pow(a.clamp(j/Y||1,0,1),4),function(Ne){return D[Ne]/j-1}),n.status(y,xe+(se+he)*3,Xe,he,ee,U.length,re.toFixed(2)+" ut",1-I*re/n._goodFps,function(Ne){return U[Ne]/re-1}),n.status(y,xe+(se+he)*4,Xe,he,ee,_.length,F.toFixed(2)+" rt",1-F/n._goodFps,function(Ne){return _[Ne]/F-1}),n.status(y,xe+(se+he)*5,Xe,he,ee,b.length,Ce.toFixed(2)+" x",Ce*Ce*Ce,function(Ne){return(b[Ne]/S[Ne]/Ce||0)-1})},n.status=function(x,y,E,M,S,_,b,C,D){x.strokeStyle="#888",x.fillStyle="#444",x.lineWidth=1,x.fillRect(y,E+7,M,1),x.beginPath(),x.moveTo(y,E+7-S*a.clamp(.4*D(0),-2,2));for(var U=0;U<M;U+=1)x.lineTo(y+U,E+7-(U<_?S*a.clamp(.4*D(U),-2,2):0));x.stroke(),x.fillStyle="hsl("+a.clamp(25+95*C,0,120)+",100%,60%)",x.fillRect(y,E-7,4,4),x.font="12px Arial",x.textBaseline="middle",x.textAlign="right",x.fillStyle="#eee",x.fillText(b,y+M,E-5)},n.constraints=function(x,y){for(var E=y,M=0;M<x.length;M++){var S=x[M];if(!(!S.render.visible||!S.pointA||!S.pointB)){var _=S.bodyA,b=S.bodyB,C,D;if(_?C=d.add(_.position,S.pointA):C=S.pointA,S.render.type==="pin")E.beginPath(),E.arc(C.x,C.y,3,0,2*Math.PI),E.closePath();else{if(b?D=d.add(b.position,S.pointB):D=S.pointB,E.beginPath(),E.moveTo(C.x,C.y),S.render.type==="spring")for(var U=d.sub(D,C),I=d.perp(d.normalise(U)),O=Math.ceil(a.clamp(S.length/5,12,20)),B,F=1;F<O;F+=1)B=F%2===0?1:-1,E.lineTo(C.x+U.x*(F/O)+I.x*B*4,C.y+U.y*(F/O)+I.y*B*4);E.lineTo(D.x,D.y)}S.render.lineWidth&&(E.lineWidth=S.render.lineWidth,E.strokeStyle=S.render.strokeStyle,E.stroke()),S.render.anchors&&(E.fillStyle=S.render.strokeStyle,E.beginPath(),E.arc(C.x,C.y,3,0,2*Math.PI),E.arc(D.x,D.y,3,0,2*Math.PI),E.closePath(),E.fill())}}},n.bodies=function(x,y,E){var M=E;x.engine;var S=x.options,_=S.showInternalEdges||!S.wireframes,b,C,D,U;for(D=0;D<y.length;D++)if(b=y[D],!!b.render.visible){for(U=b.parts.length>1?1:0;U<b.parts.length;U++)if(C=b.parts[U],!!C.render.visible){if(S.showSleeping&&b.isSleeping?M.globalAlpha=.5*C.render.opacity:C.render.opacity!==1&&(M.globalAlpha=C.render.opacity),C.render.sprite&&C.render.sprite.texture&&!S.wireframes){var I=C.render.sprite,O=w(x,I.texture);M.translate(C.position.x,C.position.y),M.rotate(C.angle),M.drawImage(O,O.width*-I.xOffset*I.xScale,O.height*-I.yOffset*I.yScale,O.width*I.xScale,O.height*I.yScale),M.rotate(-C.angle),M.translate(-C.position.x,-C.position.y)}else{if(C.circleRadius)M.beginPath(),M.arc(C.position.x,C.position.y,C.circleRadius,0,2*Math.PI);else{M.beginPath(),M.moveTo(C.vertices[0].x,C.vertices[0].y);for(var B=1;B<C.vertices.length;B++)!C.vertices[B-1].isInternal||_?M.lineTo(C.vertices[B].x,C.vertices[B].y):M.moveTo(C.vertices[B].x,C.vertices[B].y),C.vertices[B].isInternal&&!_&&M.moveTo(C.vertices[(B+1)%C.vertices.length].x,C.vertices[(B+1)%C.vertices.length].y);M.lineTo(C.vertices[0].x,C.vertices[0].y),M.closePath()}S.wireframes?(M.lineWidth=1,M.strokeStyle=x.options.wireframeStrokeStyle,M.stroke()):(M.fillStyle=C.render.fillStyle,C.render.lineWidth&&(M.lineWidth=C.render.lineWidth,M.strokeStyle=C.render.strokeStyle,M.stroke()),M.fill())}M.globalAlpha=1}}},n.bodyWireframes=function(x,y,E){var M=E,S=x.options.showInternalEdges,_,b,C,D,U;for(M.beginPath(),C=0;C<y.length;C++)if(_=y[C],!!_.render.visible)for(U=_.parts.length>1?1:0;U<_.parts.length;U++){for(b=_.parts[U],M.moveTo(b.vertices[0].x,b.vertices[0].y),D=1;D<b.vertices.length;D++)!b.vertices[D-1].isInternal||S?M.lineTo(b.vertices[D].x,b.vertices[D].y):M.moveTo(b.vertices[D].x,b.vertices[D].y),b.vertices[D].isInternal&&!S&&M.moveTo(b.vertices[(D+1)%b.vertices.length].x,b.vertices[(D+1)%b.vertices.length].y);M.lineTo(b.vertices[0].x,b.vertices[0].y)}M.lineWidth=1,M.strokeStyle=x.options.wireframeStrokeStyle,M.stroke()},n.bodyConvexHulls=function(x,y,E){var M=E,S,_,b;for(M.beginPath(),_=0;_<y.length;_++)if(S=y[_],!(!S.render.visible||S.parts.length===1)){for(M.moveTo(S.vertices[0].x,S.vertices[0].y),b=1;b<S.vertices.length;b++)M.lineTo(S.vertices[b].x,S.vertices[b].y);M.lineTo(S.vertices[0].x,S.vertices[0].y)}M.lineWidth=1,M.strokeStyle="rgba(255,255,255,0.2)",M.stroke()},n.vertexNumbers=function(x,y,E){var M=E,S,_,b;for(S=0;S<y.length;S++){var C=y[S].parts;for(b=C.length>1?1:0;b<C.length;b++){var D=C[b];for(_=0;_<D.vertices.length;_++)M.fillStyle="rgba(255,255,255,0.2)",M.fillText(S+"_"+_,D.position.x+(D.vertices[_].x-D.position.x)*.8,D.position.y+(D.vertices[_].y-D.position.y)*.8)}}},n.mousePosition=function(x,y,E){var M=E;M.fillStyle="rgba(255,255,255,0.8)",M.fillText(y.position.x+"  "+y.position.y,y.position.x+5,y.position.y-5)},n.bodyBounds=function(x,y,E){var M=E;x.engine;var S=x.options;M.beginPath();for(var _=0;_<y.length;_++){var b=y[_];if(b.render.visible)for(var C=y[_].parts,D=C.length>1?1:0;D<C.length;D++){var U=C[D];M.rect(U.bounds.min.x,U.bounds.min.y,U.bounds.max.x-U.bounds.min.x,U.bounds.max.y-U.bounds.min.y)}}S.wireframes?M.strokeStyle="rgba(255,255,255,0.08)":M.strokeStyle="rgba(0,0,0,0.1)",M.lineWidth=1,M.stroke()},n.bodyAxes=function(x,y,E){var M=E;x.engine;var S=x.options,_,b,C,D;for(M.beginPath(),b=0;b<y.length;b++){var U=y[b],I=U.parts;if(U.render.visible)if(S.showAxes)for(C=I.length>1?1:0;C<I.length;C++)for(_=I[C],D=0;D<_.axes.length;D++){var O=_.axes[D];M.moveTo(_.position.x,_.position.y),M.lineTo(_.position.x+O.x*20,_.position.y+O.y*20)}else for(C=I.length>1?1:0;C<I.length;C++)for(_=I[C],D=0;D<_.axes.length;D++)M.moveTo(_.position.x,_.position.y),M.lineTo((_.vertices[0].x+_.vertices[_.vertices.length-1].x)/2,(_.vertices[0].y+_.vertices[_.vertices.length-1].y)/2)}S.wireframes?(M.strokeStyle="indianred",M.lineWidth=1):(M.strokeStyle="rgba(255, 255, 255, 0.4)",M.globalCompositeOperation="overlay",M.lineWidth=2),M.stroke(),M.globalCompositeOperation="source-over"},n.bodyPositions=function(x,y,E){var M=E;x.engine;var S=x.options,_,b,C,D;for(M.beginPath(),C=0;C<y.length;C++)if(_=y[C],!!_.render.visible)for(D=0;D<_.parts.length;D++)b=_.parts[D],M.arc(b.position.x,b.position.y,3,0,2*Math.PI,!1),M.closePath();for(S.wireframes?M.fillStyle="indianred":M.fillStyle="rgba(0,0,0,0.5)",M.fill(),M.beginPath(),C=0;C<y.length;C++)_=y[C],_.render.visible&&(M.arc(_.positionPrev.x,_.positionPrev.y,2,0,2*Math.PI,!1),M.closePath());M.fillStyle="rgba(255,165,0,0.8)",M.fill()},n.bodyVelocity=function(x,y,E){var M=E;M.beginPath();for(var S=0;S<y.length;S++){var _=y[S];if(_.render.visible){var b=o.getVelocity(_);M.moveTo(_.position.x,_.position.y),M.lineTo(_.position.x+b.x,_.position.y+b.y)}}M.lineWidth=3,M.strokeStyle="cornflowerblue",M.stroke()},n.bodyIds=function(x,y,E){var M=E,S,_;for(S=0;S<y.length;S++)if(y[S].render.visible){var b=y[S].parts;for(_=b.length>1?1:0;_<b.length;_++){var C=b[_];M.font="12px Arial",M.fillStyle="rgba(255,255,255,0.5)",M.fillText(C.id,C.position.x+10,C.position.y-10)}}},n.collisions=function(x,y,E){var M=E,S=x.options,_,b,C,D;for(M.beginPath(),C=0;C<y.length;C++)if(_=y[C],!!_.isActive)for(b=_.collision,D=0;D<_.contactCount;D++){var U=_.contacts[D],I=U.vertex;M.rect(I.x-1.5,I.y-1.5,3.5,3.5)}for(S.wireframes?M.fillStyle="rgba(255,255,255,0.7)":M.fillStyle="orange",M.fill(),M.beginPath(),C=0;C<y.length;C++)if(_=y[C],!!_.isActive&&(b=_.collision,_.contactCount>0)){var O=_.contacts[0].vertex.x,B=_.contacts[0].vertex.y;_.contactCount===2&&(O=(_.contacts[0].vertex.x+_.contacts[1].vertex.x)/2,B=(_.contacts[0].vertex.y+_.contacts[1].vertex.y)/2),b.bodyB===b.supports[0].body||b.bodyA.isStatic===!0?M.moveTo(O-b.normal.x*8,B-b.normal.y*8):M.moveTo(O+b.normal.x*8,B+b.normal.y*8),M.lineTo(O,B)}S.wireframes?M.strokeStyle="rgba(255,165,0,0.7)":M.strokeStyle="orange",M.lineWidth=1,M.stroke()},n.separations=function(x,y,E){var M=E,S=x.options,_,b,C,D,U;for(M.beginPath(),U=0;U<y.length;U++)if(_=y[U],!!_.isActive){b=_.collision,C=b.bodyA,D=b.bodyB;var I=1;!D.isStatic&&!C.isStatic&&(I=.5),D.isStatic&&(I=0),M.moveTo(D.position.x,D.position.y),M.lineTo(D.position.x-b.penetration.x*I,D.position.y-b.penetration.y*I),I=1,!D.isStatic&&!C.isStatic&&(I=.5),C.isStatic&&(I=0),M.moveTo(C.position.x,C.position.y),M.lineTo(C.position.x+b.penetration.x*I,C.position.y+b.penetration.y*I)}S.wireframes?M.strokeStyle="rgba(255,165,0,0.5)":M.strokeStyle="orange",M.stroke()},n.inspector=function(x,y){x.engine;var E=x.selected,M=x.render,S=M.options,_;if(S.hasBounds){var b=M.bounds.max.x-M.bounds.min.x,C=M.bounds.max.y-M.bounds.min.y,D=b/M.options.width,U=C/M.options.height;y.scale(1/D,1/U),y.translate(-M.bounds.min.x,-M.bounds.min.y)}for(var I=0;I<E.length;I++){var O=E[I].data;switch(y.translate(.5,.5),y.lineWidth=1,y.strokeStyle="rgba(255,165,0,0.9)",y.setLineDash([1,2]),O.type){case"body":_=O.bounds,y.beginPath(),y.rect(Math.floor(_.min.x-3),Math.floor(_.min.y-3),Math.floor(_.max.x-_.min.x+6),Math.floor(_.max.y-_.min.y+6)),y.closePath(),y.stroke();break;case"constraint":var B=O.pointA;O.bodyA&&(B=O.pointB),y.beginPath(),y.arc(B.x,B.y,10,0,2*Math.PI),y.closePath(),y.stroke();break}y.setLineDash([]),y.translate(-.5,-.5)}x.selectStart!==null&&(y.translate(.5,.5),y.lineWidth=1,y.strokeStyle="rgba(255,165,0,0.6)",y.fillStyle="rgba(255,165,0,0.1)",_=x.selectBounds,y.beginPath(),y.rect(Math.floor(_.min.x),Math.floor(_.min.y),Math.floor(_.max.x-_.min.x),Math.floor(_.max.y-_.min.y)),y.closePath(),y.stroke(),y.fill(),y.translate(-.5,-.5)),S.hasBounds&&y.setTransform(1,0,0,1,0,0)};var g=function(x,y){var E=x.engine,M=x.timing,S=M.historySize,_=E.timing.timestamp;M.delta=y-M.lastTime||n._goodDelta,M.lastTime=y,M.timestampElapsed=_-M.lastTimestamp||0,M.lastTimestamp=_,M.deltaHistory.unshift(M.delta),M.deltaHistory.length=Math.min(M.deltaHistory.length,S),M.engineDeltaHistory.unshift(E.timing.lastDelta),M.engineDeltaHistory.length=Math.min(M.engineDeltaHistory.length,S),M.timestampElapsedHistory.unshift(M.timestampElapsed),M.timestampElapsedHistory.length=Math.min(M.timestampElapsedHistory.length,S),M.engineUpdatesHistory.unshift(E.timing.lastUpdatesPerFrame),M.engineUpdatesHistory.length=Math.min(M.engineUpdatesHistory.length,S),M.engineElapsedHistory.unshift(E.timing.lastElapsed),M.engineElapsedHistory.length=Math.min(M.engineElapsedHistory.length,S),M.elapsedHistory.unshift(M.lastElapsed),M.elapsedHistory.length=Math.min(M.elapsedHistory.length,S)},p=function(x){for(var y=0,E=0;E<x.length;E+=1)y+=x[E];return y/x.length||0},v=function(x,y){var E=document.createElement("canvas");return E.width=x,E.height=y,E.oncontextmenu=function(){return!1},E.onselectstart=function(){return!1},E},A=function(x){var y=x.getContext("2d"),E=window.devicePixelRatio||1,M=y.webkitBackingStorePixelRatio||y.mozBackingStorePixelRatio||y.msBackingStorePixelRatio||y.oBackingStorePixelRatio||y.backingStorePixelRatio||1;return E/M},w=function(x,y){var E=x.textures[y];return E||(E=x.textures[y]=new Image,E.src=y,E)},T=function(x,y){var E=y;/(jpg|gif|png)$/.test(y)&&(E="url("+y+")"),x.canvas.style.background=E,x.canvas.style.backgroundSize="contain",x.currentBackground=y}})()},function(t,i,r){var n={};t.exports=n;var o=r(5),a=r(17),c=r(0);(function(){n._maxFrameDelta=1e3/15,n._frameDeltaFallback=1e3/60,n._timeBufferMargin=1.5,n._elapsedNextEstimate=1,n._smoothingLowerBound=.1,n._smoothingUpperBound=.9,n.create=function(u){var d={delta:16.666666666666668,frameDelta:null,frameDeltaSmoothing:!0,frameDeltaSnapping:!0,frameDeltaHistory:[],frameDeltaHistorySize:100,frameRequestId:null,timeBuffer:0,timeLastTick:null,maxUpdates:null,maxFrameTime:33.333333333333336,lastUpdatesDeferred:0,enabled:!0},h=c.extend(d,u);return h.fps=0,h},n.run=function(u,d){return u.timeBuffer=n._frameDeltaFallback,function h(l){u.frameRequestId=n._onNextFrame(u,h),l&&u.enabled&&n.tick(u,d,l)}(),u},n.tick=function(u,d,h){var l=c.now(),m=u.delta,g=0,p=h-u.timeLastTick;if((!p||!u.timeLastTick||p>Math.max(n._maxFrameDelta,u.maxFrameTime))&&(p=u.frameDelta||n._frameDeltaFallback),u.frameDeltaSmoothing){u.frameDeltaHistory.push(p),u.frameDeltaHistory=u.frameDeltaHistory.slice(-u.frameDeltaHistorySize);var v=u.frameDeltaHistory.slice(0).sort(),A=u.frameDeltaHistory.slice(v.length*n._smoothingLowerBound,v.length*n._smoothingUpperBound),w=f(A);p=w||p}u.frameDeltaSnapping&&(p=1e3/Math.round(1e3/p)),u.frameDelta=p,u.timeLastTick=h,u.timeBuffer+=u.frameDelta,u.timeBuffer=c.clamp(u.timeBuffer,0,u.frameDelta+m*n._timeBufferMargin),u.lastUpdatesDeferred=0;var T=u.maxUpdates||Math.ceil(u.maxFrameTime/m),x={timestamp:d.timing.timestamp};o.trigger(u,"beforeTick",x),o.trigger(u,"tick",x);for(var y=c.now();m>0&&u.timeBuffer>=m*n._timeBufferMargin;){o.trigger(u,"beforeUpdate",x),a.update(d,m),o.trigger(u,"afterUpdate",x),u.timeBuffer-=m,g+=1;var E=c.now()-l,M=c.now()-y,S=E+n._elapsedNextEstimate*M/g;if(g>=T||S>u.maxFrameTime){u.lastUpdatesDeferred=Math.round(Math.max(0,u.timeBuffer/m-n._timeBufferMargin));break}}d.timing.lastUpdatesPerFrame=g,o.trigger(u,"afterTick",x),u.frameDeltaHistory.length>=100&&(u.lastUpdatesDeferred&&Math.round(u.frameDelta/m)>T?c.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs."):u.lastUpdatesDeferred&&c.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."),typeof u.isFixed<"u"&&c.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."),(u.deltaMin||u.deltaMax)&&c.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."),u.fps!==0&&c.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."))},n.stop=function(u){n._cancelNextFrame(u)},n._onNextFrame=function(u,d){if(typeof window<"u"&&window.requestAnimationFrame)u.frameRequestId=window.requestAnimationFrame(d);else throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");return u.frameRequestId},n._cancelNextFrame=function(u){if(typeof window<"u"&&window.cancelAnimationFrame)window.cancelAnimationFrame(u.frameRequestId);else throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.")};var f=function(u){for(var d=0,h=u.length,l=0;l<h;l+=1)d+=u[l];return d/h||0}})()},function(t,i,r){var n={};t.exports=n;var o=r(8),a=r(0),c=a.deprecated;(function(){n.collides=function(f,u){return o.collides(f,u)},c(n,"collides","SAT.collides ➤ replaced by Collision.collides")})()},function(t,i,r){var n={};t.exports=n,r(1);var o=r(0);(function(){n.pathToVertices=function(a,c){typeof window<"u"&&!("SVGPathSeg"in window)&&o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");var f,u,d,h,l,m,g,p,v,A,w=[],T,x,y=0,E=0,M=0;c=c||15;var S=function(b,C,D){var U=D%2===1&&D>1;if(!v||b!=v.x||C!=v.y){v&&U?(T=v.x,x=v.y):(T=0,x=0);var I={x:T+b,y:x+C};(U||!v)&&(v=I),w.push(I),E=T+b,M=x+C}},_=function(b){var C=b.pathSegTypeAsLetter.toUpperCase();if(C!=="Z"){switch(C){case"M":case"L":case"T":case"C":case"S":case"Q":E=b.x,M=b.y;break;case"H":E=b.x;break;case"V":M=b.y;break}S(E,M,b.pathSegType)}};for(n._svgPathToAbsolute(a),d=a.getTotalLength(),m=[],f=0;f<a.pathSegList.numberOfItems;f+=1)m.push(a.pathSegList.getItem(f));for(g=m.concat();y<d;){if(A=a.getPathSegAtLength(y),l=m[A],l!=p){for(;g.length&&g[0]!=l;)_(g.shift());p=l}switch(l.pathSegTypeAsLetter.toUpperCase()){case"C":case"T":case"S":case"Q":case"A":h=a.getPointAtLength(y),S(h.x,h.y,0);break}y+=c}for(f=0,u=g.length;f<u;++f)_(g[f]);return w},n._svgPathToAbsolute=function(a){for(var c,f,u,d,h,l,m=a.pathSegList,g=0,p=0,v=m.numberOfItems,A=0;A<v;++A){var w=m.getItem(A),T=w.pathSegTypeAsLetter;if(/[MLHVCSQTA]/.test(T))"x"in w&&(g=w.x),"y"in w&&(p=w.y);else switch("x1"in w&&(u=g+w.x1),"x2"in w&&(h=g+w.x2),"y1"in w&&(d=p+w.y1),"y2"in w&&(l=p+w.y2),"x"in w&&(g+=w.x),"y"in w&&(p+=w.y),T){case"m":m.replaceItem(a.createSVGPathSegMovetoAbs(g,p),A);break;case"l":m.replaceItem(a.createSVGPathSegLinetoAbs(g,p),A);break;case"h":m.replaceItem(a.createSVGPathSegLinetoHorizontalAbs(g),A);break;case"v":m.replaceItem(a.createSVGPathSegLinetoVerticalAbs(p),A);break;case"c":m.replaceItem(a.createSVGPathSegCurvetoCubicAbs(g,p,u,d,h,l),A);break;case"s":m.replaceItem(a.createSVGPathSegCurvetoCubicSmoothAbs(g,p,h,l),A);break;case"q":m.replaceItem(a.createSVGPathSegCurvetoQuadraticAbs(g,p,u,d),A);break;case"t":m.replaceItem(a.createSVGPathSegCurvetoQuadraticSmoothAbs(g,p),A);break;case"a":m.replaceItem(a.createSVGPathSegArcAbs(g,p,w.r1,w.r2,w.angle,w.largeArcFlag,w.sweepFlag),A);break;case"z":case"Z":g=c,p=f;break}(T=="M"||T=="m")&&(c=g,f=p)}}})()},function(t,i,r){var n={};t.exports=n;var o=r(6);r(0),function(){n.create=o.create,n.add=o.add,n.remove=o.remove,n.clear=o.clear,n.addComposite=o.addComposite,n.addBody=o.addBody,n.addConstraint=o.addConstraint}()}])})}(Yi)),Yi.exports}var Fe=fl();document.addEventListener("DOMContentLoaded",()=>{const s=Fe.Engine.create({enableSleeping:!1});s.world.gravity.y=0;const e=document.querySelector(".preview-bg");if(!e)return;let t=[],i=!1,r=null,n={x:0,y:0},o=0;const a=Math.max(Math.min(window.innerWidth*.24,320),220),c=Fe.Render.create({element:e,engine:s,options:{width:e.clientWidth,height:e.clientHeight,wireframes:!1,background:"transparent",pixelRatio:window.devicePixelRatio}});c.canvas.style.display="none";let f=e.getBoundingClientRect();d(),h(),setTimeout(()=>{l()},1e3),m(),A(),w(),window.addEventListener("resize",x(T,100));const u=Fe.Runner.create();Fe.Runner.run(u,s);function d(){f=e.getBoundingClientRect();const y=20,E=[Fe.Bodies.rectangle(f.width/2,0,f.width,y,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(f.width/2,f.height,f.width,y,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(0,f.height/2,y,f.height,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(f.width,f.height/2,y,f.height,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}})];Fe.Composite.add(s.world,E)}function h(){f=e.getBoundingClientRect();const y=f.width/2,E=f.height/2,M=[30,90,150,210,270,330].map(b=>b*(Math.PI/180));for(let b=0;b<6;b++){const C=S(y,E,b),D=_(b+1,C.id);D.style.transform=`translate3d(${y-a/2}px, ${E-a/2}px, 0)`,t.push({body:C,element:D}),Fe.Composite.add(s.world,C),e.appendChild(D)}function S(b,C,D){const U=M[D%M.length],I=.15,O=Math.cos(U)*I,B=Math.sin(U)*I,F=a/2,Z=Fe.Bodies.circle(b,C,F,{restitution:.9,friction:0,frictionAir:.07,density:.5,inertia:1/0,render:{visible:!1}});return Fe.Body.setVelocity(Z,{x:O,y:B}),Z}function _(b,C){const D=document.createElement("div");D.className="video-note",D.style.width=`${a}px`,D.style.height=`${a}px`,D.style.willChange="transform",D.style.borderRadius="50%",D.style.position="absolute",D.style.overflow="hidden",D.style.zIndex="3",D.dataset.bodyId=C;const U=document.createElement("div");U.className="player-ring",U.style.position="absolute",U.style.width="100%",U.style.height="100%",U.style.borderRadius="50%",U.style.border="2px solid rgba(255, 255, 255, 0.8)",U.style.boxSizing="border-box",U.style.boxShadow="0 0 0 2px rgba(0, 0, 0, 0.1)",U.style.zIndex="1";const I=document.createElement("div");I.className="video-container",I.style.width="100%",I.style.height="100%",I.style.borderRadius="50%",I.style.overflow="hidden",I.style.position="relative",I.style.display="flex",I.style.alignItems="center",I.style.justifyContent="center";const O=document.createElement("img");O.src=`assets/thumbnails/${b}.jpg`,O.alt=`Video ${b} preview`,O.style.width="100%",O.style.height="100%",O.style.objectFit="cover",O.style.objectPosition="center",O.style.cursor="pointer",O.draggable=!1;const B=document.createElement("video");B.src=`assets/media/${b}.mp4`,B.style.width="100%",B.style.height="100%",B.style.objectFit="cover",B.style.objectPosition="center",B.style.display="none",B.controls=!1,B.draggable=!1;const F=document.createElement("div");return F.className="play-indicator",F.style.position="absolute",F.style.top="50%",F.style.left="50%",F.style.transform="translate(-50%, -50%)",F.style.transition="opacity 0.2s",F.style.zIndex="4",F.innerHTML=`
<svg width="41" height="47" viewBox="0 0 41 47" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 23.5L2 4.46282C2 2.9235 3.66611 1.96122 4.99944 2.73045L37.9972 21.7676C39.3313 22.5373 39.3313 24.4627 37.9972 25.2324L4.99944 44.2695C3.66611 45.0388 2 44.0765 2 42.5372L2 23.5Z" fill="#EEEEEE" stroke="#EEEEEE" stroke-width="4" stroke-linejoin="round"/>
</svg>`,D.addEventListener("click",function(Z){(!i||Date.now()-o<200)&&(B.style.display==="none"?(O.style.display="none",B.style.display="block",F.style.opacity="0",B.play(),D.classList.add("playing"),Fe.Body.setStatic(t.find(j=>j.body.id===parseInt(C)).body,!0),D.style.zIndex="5",document.querySelectorAll(".video-note video").forEach(j=>{if(j!==B&&j.style.display==="block"){const re=j.closest(".video-note");j.pause(),j.style.display="none",re.querySelector("img").style.display="block",re.querySelector(".play-indicator").style.opacity="1",re.classList.remove("playing");const _e=t.find(Ce=>Ce.element===re).body;Fe.Body.setStatic(_e,!1),re.style.zIndex="3"}})):B.paused?(B.play(),F.style.opacity="0"):(B.pause(),F.style.opacity="1"))}),B.addEventListener("ended",function(){B.style.display="none",O.style.display="block",F.style.opacity="1",D.classList.remove("playing"),Fe.Body.setStatic(t.find(Z=>Z.element===D).body,!1),D.style.zIndex="3"}),I.appendChild(O),I.appendChild(B),I.appendChild(F),D.appendChild(I),D.appendChild(U),D}}function l(){const y=document.querySelector(".logo-section");if(!y)return;const E=e.getBoundingClientRect(),M=y.getBoundingClientRect(),S=M.left-E.left,_=M.top-E.top,b=10,C=[Fe.Bodies.rectangle(S+M.width/2,_,M.width,b,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(S+M.width/2,_+M.height,M.width,b,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(S,_+M.height/2,b,M.height,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}}),Fe.Bodies.rectangle(S+M.width,_+M.height/2,b,M.height,{isStatic:!0,restitution:1,friction:0,render:{visible:!1}})];Fe.Composite.add(s.world,C);const D=S+M.width/2,U=_+M.height/2;t.forEach(({body:I,element:O})=>{if(I.position.x>S&&I.position.x<S+M.width&&I.position.y>_&&I.position.y<_+M.height){let B=I.position.x-D,F=I.position.y-U;B===0&&F===0&&(B=Math.random()-.5,F=Math.random()-.5);const Z=Math.atan2(F,B),j=5;Fe.Body.setVelocity(I,{x:Math.cos(Z)*j,y:Math.sin(Z)*j})}})}function m(){document.addEventListener("mousedown",g),document.addEventListener("mousemove",p),document.addEventListener("mouseup",v),document.addEventListener("touchstart",g,{passive:!1}),document.addEventListener("touchmove",p,{passive:!1}),document.addEventListener("touchend",v,{passive:!1})}function g(y){var S,_;const E=((S=y.touches)==null?void 0:S[0])||y,M=E.target.closest(".video-note");if(M&&(o=Date.now(),i=!0,r=(_=t.find(b=>b.body.id===parseInt(M.dataset.bodyId)))==null?void 0:_.body,r)){M.classList.add("dragging"),document.body.classList.add("dragging"),Fe.Body.setVelocity(r,{x:0,y:0}),M.classList.contains("playing")||Fe.Body.setStatic(r,!0);const b=c.options.pixelRatio,C=(E.clientX-f.left)*b,D=(E.clientY-f.top)*b;n.x=C-r.position.x,n.y=D-r.position.y}}function p(y){var U;if(!i||!r)return;y.preventDefault();const E=((U=y.touches)==null?void 0:U[0])||y,M=c.options.pixelRatio,S=(E.clientX-f.left)*M,_=(E.clientY-f.top)*M,b=a/2,C=Math.max(b,Math.min(f.width-b,S-n.x)),D=Math.max(b,Math.min(f.height-b,_-n.y));Fe.Body.setPosition(r,{x:C,y:D})}function v(y){var M;if(y.type==="mouseup"&&(document.querySelectorAll(".video-note.dragging").forEach(S=>{S.classList.remove("dragging")}),document.body.classList.remove("dragging")),!r)return;const E=(M=t.find(S=>S.body===r))==null?void 0:M.element;if(!(E!=null&&E.classList.contains("playing"))){Fe.Body.setStatic(r,!1);const S=Math.random()*Math.PI*2,_=.5;Fe.Body.setVelocity(r,{x:Math.cos(S)*_,y:Math.sin(S)*_})}i=!1,r=null}function A(){Fe.Events.on(s,"afterUpdate",()=>{f=e.getBoundingClientRect(),t.forEach(({body:C,element:D})=>{if(!i||C!==r){if(Math.random()<.005){const j=Math.random()*Math.PI*2,re=.2+(Math.random()-.5)*.1;Fe.Body.setVelocity(C,{x:Math.cos(j)*re,y:Math.sin(j)*re})}const F=Fe.Vector.magnitude(C.velocity);if(F<.2*.8){const j=Math.atan2(C.velocity.y,C.velocity.x);Fe.Body.setVelocity(C,{x:Math.cos(j)*.2,y:Math.sin(j)*.2})}const Z=3;if(F>Z){const j=Z/F;Fe.Body.setVelocity(C,{x:C.velocity.x*j,y:C.velocity.y*j})}}const U=a/2,I=Math.max(U,Math.min(f.width-U,C.position.x)),O=Math.max(U,Math.min(f.height-U,C.position.y));(I!==C.position.x||O!==C.position.y)&&Fe.Body.setPosition(C,{x:I,y:O});const B=D.classList.contains("playing")?1.05:1;D.style.transform=`translate3d(${C.position.x-a/2}px, ${C.position.y-a/2}px, 0) scale(${B})`});for(let C=0;C<t.length;C++)for(let D=C+1;D<t.length;D++){const U=t[C].body,I=t[D].body;if((U===r||I===r)&&i)continue;const O=I.position.x-U.position.x,B=I.position.y-U.position.y,F=O*O+B*B;if(F>0&&F<62500){const Z=Math.sqrt(F),j=.015/(F*Z),re={x:O*j,y:B*j};Fe.Body.applyForce(U,U.position,{x:-re.x,y:-re.y}),Fe.Body.applyForce(I,I.position,re)}}})}function w(){document.addEventListener("click",y=>{const E=document.querySelector(".video-note.playing");if(E&&!E.contains(y.target)){const M=E.querySelector("video"),S=E.querySelector("img");M&&M.style.display==="block"&&(M.pause(),M.style.display="none",S.style.display="block",E.querySelector(".play-indicator").style.opacity="1",E.classList.remove("playing"),Fe.Body.setStatic(t.find(_=>_.element===E).body,!1),E.style.zIndex="3")}},!0)}function T(){f=e.getBoundingClientRect(),c.canvas.width=f.width,c.canvas.height=f.height,Fe.Composite.allBodies(s.world).forEach(y=>{y.isStatic&&y!==r&&Fe.Composite.remove(s.world,y)}),d(),t.forEach(({body:y,element:E})=>{const M=a/2,S=Math.max(M,Math.min(f.width-M,y.position.x)),_=Math.max(M,Math.min(f.height-M,y.position.y));Fe.Body.setPosition(y,{x:S,y:_}),E.style.width=`${a}px`,E.style.height=`${a}px`})}function x(y,E){let M;return(...S)=>{clearTimeout(M),M=setTimeout(()=>y.apply(null,S),E)}}});/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ps="176",hl=0,na=1,dl=2,eo=1,pl=2,jt=3,pn=0,Mt=1,Jt=2,hn=0,Kn=1,Hr=2,ia=3,ra=4,ml=5,An=100,gl=101,vl=102,_l=103,xl=104,Sl=200,Ml=201,yl=202,El=203,Vr=204,Gr=205,Tl=206,Al=207,wl=208,bl=209,Cl=210,Rl=211,Pl=212,Dl=213,Ll=214,kr=0,Wr=1,Xr=2,Jn=3,qr=4,Yr=5,$r=6,Zr=7,to=0,Il=1,Ul=2,dn=0,Nl=1,Fl=2,Ol=3,Bl=4,zl=5,Hl=6,Vl=7,no=300,Qn=301,ei=302,Kr=303,jr=304,rr=306,Jr=1e3,bn=1001,Qr=1002,Ht=1003,Gl=1004,Ai=1005,Gt=1006,cr=1007,Cn=1008,nn=1009,io=1010,ro=1011,di=1012,Ds=1013,Pn=1014,Qt=1015,_i=1016,Ls=1017,Is=1018,pi=1020,so=35902,ao=1021,oo=1022,Bt=1023,mi=1026,gi=1027,lo=1028,Us=1029,co=1030,Ns=1031,Fs=1033,$i=33776,Zi=33777,Ki=33778,ji=33779,es=35840,ts=35841,ns=35842,is=35843,rs=36196,ss=37492,as=37496,os=37808,ls=37809,cs=37810,us=37811,fs=37812,hs=37813,ds=37814,ps=37815,ms=37816,gs=37817,vs=37818,_s=37819,xs=37820,Ss=37821,Ji=36492,Ms=36494,ys=36495,uo=36283,Es=36284,Ts=36285,As=36286,kl=3200,Wl=3201,Xl=0,ql=1,fn="",Rt="srgb",ti="srgb-linear",nr="linear",Je="srgb",Un=7680,sa=519,Yl=512,$l=513,Zl=514,fo=515,Kl=516,jl=517,Jl=518,Ql=519,aa=35044,oa="300 es",en=2e3,ir=2001;class ii{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const n=r.indexOf(t);n!==-1&&r.splice(n,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let n=0,o=r.length;n<o;n++)r[n].call(this,e);e.target=null}}}const dt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ur=Math.PI/180,ws=180/Math.PI;function xi(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(dt[s&255]+dt[s>>8&255]+dt[s>>16&255]+dt[s>>24&255]+"-"+dt[e&255]+dt[e>>8&255]+"-"+dt[e>>16&15|64]+dt[e>>24&255]+"-"+dt[t&63|128]+dt[t>>8&255]+"-"+dt[t>>16&255]+dt[t>>24&255]+dt[i&255]+dt[i>>8&255]+dt[i>>16&255]+dt[i>>24&255]).toLowerCase()}function Ge(s,e,t){return Math.max(e,Math.min(t,s))}function ec(s,e){return(s%e+e)%e}function fr(s,e,t){return(1-t)*s+t*e}function oi(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function St(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Ke{constructor(e=0,t=0){Ke.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),n=this.x-e.x,o=this.y-e.y;return this.x=n*i-o*r+e.x,this.y=n*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Le{constructor(e,t,i,r,n,o,a,c,f){Le.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,n,o,a,c,f)}set(e,t,i,r,n,o,a,c,f){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=n,u[5]=c,u[6]=i,u[7]=o,u[8]=f,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,n=this.elements,o=i[0],a=i[3],c=i[6],f=i[1],u=i[4],d=i[7],h=i[2],l=i[5],m=i[8],g=r[0],p=r[3],v=r[6],A=r[1],w=r[4],T=r[7],x=r[2],y=r[5],E=r[8];return n[0]=o*g+a*A+c*x,n[3]=o*p+a*w+c*y,n[6]=o*v+a*T+c*E,n[1]=f*g+u*A+d*x,n[4]=f*p+u*w+d*y,n[7]=f*v+u*T+d*E,n[2]=h*g+l*A+m*x,n[5]=h*p+l*w+m*y,n[8]=h*v+l*T+m*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],o=e[4],a=e[5],c=e[6],f=e[7],u=e[8];return t*o*u-t*a*f-i*n*u+i*a*c+r*n*f-r*o*c}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],o=e[4],a=e[5],c=e[6],f=e[7],u=e[8],d=u*o-a*f,h=a*c-u*n,l=f*n-o*c,m=t*d+i*h+r*l;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/m;return e[0]=d*g,e[1]=(r*f-u*i)*g,e[2]=(a*i-r*o)*g,e[3]=h*g,e[4]=(u*t-r*c)*g,e[5]=(r*n-a*t)*g,e[6]=l*g,e[7]=(i*c-f*t)*g,e[8]=(o*t-i*n)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,n,o,a){const c=Math.cos(n),f=Math.sin(n);return this.set(i*c,i*f,-i*(c*o+f*a)+o+e,-r*f,r*c,-r*(-f*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(hr.makeScale(e,t)),this}rotate(e){return this.premultiply(hr.makeRotation(-e)),this}translate(e,t){return this.premultiply(hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const hr=new Le;function ho(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function vi(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function tc(){const s=vi("canvas");return s.style.display="block",s}const la={};function Qi(s){s in la||(la[s]=!0,console.warn(s))}function nc(s,e,t){return new Promise(function(i,r){function n(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:r();break;case s.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:i()}}setTimeout(n,t)})}function ic(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function rc(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const ca=new Le().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ua=new Le().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sc(){const s={enabled:!0,workingColorSpace:ti,spaces:{},convert:function(r,n,o){return this.enabled===!1||n===o||!n||!o||(this.spaces[n].transfer===Je&&(r.r=tn(r.r),r.g=tn(r.g),r.b=tn(r.b)),this.spaces[n].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[n].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Je&&(r.r=jn(r.r),r.g=jn(r.g),r.b=jn(r.b))),r},fromWorkingColorSpace:function(r,n){return this.convert(r,this.workingColorSpace,n)},toWorkingColorSpace:function(r,n){return this.convert(r,n,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===fn?nr:this.spaces[r].transfer},getLuminanceCoefficients:function(r,n=this.workingColorSpace){return r.fromArray(this.spaces[n].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,n,o){return r.copy(this.spaces[n].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[ti]:{primaries:e,whitePoint:i,transfer:nr,toXYZ:ca,fromXYZ:ua,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:i,transfer:Je,toXYZ:ca,fromXYZ:ua,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),s}const Ye=sc();function tn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function jn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Nn;class ac{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Nn===void 0&&(Nn=vi("canvas")),Nn.width=e.width,Nn.height=e.height;const r=Nn.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Nn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=vi("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),n=r.data;for(let o=0;o<n.length;o++)n[o]=tn(n[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(tn(t[i]/255)*255):t[i]=tn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let oc=0;class Os{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:oc++}),this.uuid=xi(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let n;if(Array.isArray(r)){n=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?n.push(dr(r[o].image)):n.push(dr(r[o]))}else n=dr(r);i.url=n}return t||(e.images[this.uuid]=i),i}}function dr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ac.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lc=0;class mt extends ii{constructor(e=mt.DEFAULT_IMAGE,t=mt.DEFAULT_MAPPING,i=bn,r=bn,n=Gt,o=Cn,a=Bt,c=nn,f=mt.DEFAULT_ANISOTROPY,u=fn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lc++}),this.uuid=xi(),this.name="",this.source=new Os(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=n,this.minFilter=o,this.anisotropy=f,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ke(0,0),this.repeat=new Ke(1,1),this.center=new Ke(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Le,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isTextureArray=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isTextureArray=e.isTextureArray,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==no)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Jr:e.x=e.x-Math.floor(e.x);break;case bn:e.x=e.x<0?0:1;break;case Qr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Jr:e.y=e.y-Math.floor(e.y);break;case bn:e.y=e.y<0?0:1;break;case Qr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}mt.DEFAULT_IMAGE=null;mt.DEFAULT_MAPPING=no;mt.DEFAULT_ANISOTROPY=1;class rt{constructor(e=0,t=0,i=0,r=1){rt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,n=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*n,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*n,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*n,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,n;const c=e.elements,f=c[0],u=c[4],d=c[8],h=c[1],l=c[5],m=c[9],g=c[2],p=c[6],v=c[10];if(Math.abs(u-h)<.01&&Math.abs(d-g)<.01&&Math.abs(m-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+g)<.1&&Math.abs(m+p)<.1&&Math.abs(f+l+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(f+1)/2,T=(l+1)/2,x=(v+1)/2,y=(u+h)/4,E=(d+g)/4,M=(m+p)/4;return w>T&&w>x?w<.01?(i=0,r=.707106781,n=.707106781):(i=Math.sqrt(w),r=y/i,n=E/i):T>x?T<.01?(i=.707106781,r=0,n=.707106781):(r=Math.sqrt(T),i=y/r,n=M/r):x<.01?(i=.707106781,r=.707106781,n=0):(n=Math.sqrt(x),i=E/n,r=M/n),this.set(i,r,n,t),this}let A=Math.sqrt((p-m)*(p-m)+(d-g)*(d-g)+(h-u)*(h-u));return Math.abs(A)<.001&&(A=1),this.x=(p-m)/A,this.y=(d-g)/A,this.z=(h-u)/A,this.w=Math.acos((f+l+v-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this.w=Ge(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this.w=Ge(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class cc extends ii{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth?i.depth:1,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);const r={width:e,height:t,depth:this.depth};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Gt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,multiview:!1},i);const n=new mt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);n.flipY=!1,n.generateMipmaps=i.generateMipmaps,n.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=n.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,n=this.textures.length;r<n;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new Os(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dn extends cc{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class po extends mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class uc extends mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Si{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,n,o,a){let c=i[r+0],f=i[r+1],u=i[r+2],d=i[r+3];const h=n[o+0],l=n[o+1],m=n[o+2],g=n[o+3];if(a===0){e[t+0]=c,e[t+1]=f,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=l,e[t+2]=m,e[t+3]=g;return}if(d!==g||c!==h||f!==l||u!==m){let p=1-a;const v=c*h+f*l+u*m+d*g,A=v>=0?1:-1,w=1-v*v;if(w>Number.EPSILON){const x=Math.sqrt(w),y=Math.atan2(x,v*A);p=Math.sin(p*y)/x,a=Math.sin(a*y)/x}const T=a*A;if(c=c*p+h*T,f=f*p+l*T,u=u*p+m*T,d=d*p+g*T,p===1-a){const x=1/Math.sqrt(c*c+f*f+u*u+d*d);c*=x,f*=x,u*=x,d*=x}}e[t]=c,e[t+1]=f,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,n,o){const a=i[r],c=i[r+1],f=i[r+2],u=i[r+3],d=n[o],h=n[o+1],l=n[o+2],m=n[o+3];return e[t]=a*m+u*d+c*l-f*h,e[t+1]=c*m+u*h+f*d-a*l,e[t+2]=f*m+u*l+a*h-c*d,e[t+3]=u*m-a*d-c*h-f*l,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,n=e._z,o=e._order,a=Math.cos,c=Math.sin,f=a(i/2),u=a(r/2),d=a(n/2),h=c(i/2),l=c(r/2),m=c(n/2);switch(o){case"XYZ":this._x=h*u*d+f*l*m,this._y=f*l*d-h*u*m,this._z=f*u*m+h*l*d,this._w=f*u*d-h*l*m;break;case"YXZ":this._x=h*u*d+f*l*m,this._y=f*l*d-h*u*m,this._z=f*u*m-h*l*d,this._w=f*u*d+h*l*m;break;case"ZXY":this._x=h*u*d-f*l*m,this._y=f*l*d+h*u*m,this._z=f*u*m+h*l*d,this._w=f*u*d-h*l*m;break;case"ZYX":this._x=h*u*d-f*l*m,this._y=f*l*d+h*u*m,this._z=f*u*m-h*l*d,this._w=f*u*d+h*l*m;break;case"YZX":this._x=h*u*d+f*l*m,this._y=f*l*d+h*u*m,this._z=f*u*m-h*l*d,this._w=f*u*d-h*l*m;break;case"XZY":this._x=h*u*d-f*l*m,this._y=f*l*d-h*u*m,this._z=f*u*m+h*l*d,this._w=f*u*d+h*l*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],n=t[8],o=t[1],a=t[5],c=t[9],f=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){const l=.5/Math.sqrt(h+1);this._w=.25/l,this._x=(u-c)*l,this._y=(n-f)*l,this._z=(o-r)*l}else if(i>a&&i>d){const l=2*Math.sqrt(1+i-a-d);this._w=(u-c)/l,this._x=.25*l,this._y=(r+o)/l,this._z=(n+f)/l}else if(a>d){const l=2*Math.sqrt(1+a-i-d);this._w=(n-f)/l,this._x=(r+o)/l,this._y=.25*l,this._z=(c+u)/l}else{const l=2*Math.sqrt(1+d-i-a);this._w=(o-r)/l,this._x=(n+f)/l,this._y=(c+u)/l,this._z=.25*l}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ge(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,n=e._z,o=e._w,a=t._x,c=t._y,f=t._z,u=t._w;return this._x=i*u+o*a+r*f-n*c,this._y=r*u+o*c+n*a-i*f,this._z=n*u+o*f+i*c-r*a,this._w=o*u-i*a-r*c-n*f,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,n=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+n*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=n,this;const c=1-a*a;if(c<=Number.EPSILON){const l=1-t;return this._w=l*o+t*this._w,this._x=l*i+t*this._x,this._y=l*r+t*this._y,this._z=l*n+t*this._z,this.normalize(),this}const f=Math.sqrt(c),u=Math.atan2(f,a),d=Math.sin((1-t)*u)/f,h=Math.sin(t*u)/f;return this._w=o*d+this._w*h,this._x=i*d+this._x*h,this._y=r*d+this._y*h,this._z=n*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),n=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),n*Math.sin(t),n*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class k{constructor(e=0,t=0,i=0){k.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(fa.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(fa.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6]*r,this.y=n[1]*t+n[4]*i+n[7]*r,this.z=n[2]*t+n[5]*i+n[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,n=e.elements,o=1/(n[3]*t+n[7]*i+n[11]*r+n[15]);return this.x=(n[0]*t+n[4]*i+n[8]*r+n[12])*o,this.y=(n[1]*t+n[5]*i+n[9]*r+n[13])*o,this.z=(n[2]*t+n[6]*i+n[10]*r+n[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,n=e.x,o=e.y,a=e.z,c=e.w,f=2*(o*r-a*i),u=2*(a*t-n*r),d=2*(n*i-o*t);return this.x=t+c*f+o*d-a*u,this.y=i+c*u+a*f-n*d,this.z=r+c*d+n*u-o*f,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,n=e.elements;return this.x=n[0]*t+n[4]*i+n[8]*r,this.y=n[1]*t+n[5]*i+n[9]*r,this.z=n[2]*t+n[6]*i+n[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ge(this.x,e.x,t.x),this.y=Ge(this.y,e.y,t.y),this.z=Ge(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ge(this.x,e,t),this.y=Ge(this.y,e,t),this.z=Ge(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ge(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,n=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-n*a,this.y=n*o-i*c,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return pr.copy(this).projectOnVector(e),this.sub(pr)}reflect(e){return this.sub(pr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Ge(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pr=new k,fa=new Si;class Mi{constructor(e=new k(1/0,1/0,1/0),t=new k(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(It.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(It.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=It.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const n=i.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=n.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,It):It.fromBufferAttribute(n,o),It.applyMatrix4(e.matrixWorld),this.expandByPoint(It);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wi.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wi.copy(i.boundingBox)),wi.applyMatrix4(e.matrixWorld),this.union(wi)}const r=e.children;for(let n=0,o=r.length;n<o;n++)this.expandByObject(r[n],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,It),It.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(li),bi.subVectors(this.max,li),Fn.subVectors(e.a,li),On.subVectors(e.b,li),Bn.subVectors(e.c,li),sn.subVectors(On,Fn),an.subVectors(Bn,On),vn.subVectors(Fn,Bn);let t=[0,-sn.z,sn.y,0,-an.z,an.y,0,-vn.z,vn.y,sn.z,0,-sn.x,an.z,0,-an.x,vn.z,0,-vn.x,-sn.y,sn.x,0,-an.y,an.x,0,-vn.y,vn.x,0];return!mr(t,Fn,On,Bn,bi)||(t=[1,0,0,0,1,0,0,0,1],!mr(t,Fn,On,Bn,bi))?!1:(Ci.crossVectors(sn,an),t=[Ci.x,Ci.y,Ci.z],mr(t,Fn,On,Bn,bi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,It).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(It).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(qt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),qt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),qt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),qt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),qt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),qt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),qt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),qt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(qt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const qt=[new k,new k,new k,new k,new k,new k,new k,new k],It=new k,wi=new Mi,Fn=new k,On=new k,Bn=new k,sn=new k,an=new k,vn=new k,li=new k,bi=new k,Ci=new k,_n=new k;function mr(s,e,t,i,r){for(let n=0,o=s.length-3;n<=o;n+=3){_n.fromArray(s,n);const a=r.x*Math.abs(_n.x)+r.y*Math.abs(_n.y)+r.z*Math.abs(_n.z),c=e.dot(_n),f=t.dot(_n),u=i.dot(_n);if(Math.max(-Math.max(c,f,u),Math.min(c,f,u))>a)return!1}return!0}const fc=new Mi,ci=new k,gr=new k;class Bs{constructor(e=new k,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):fc.setFromPoints(e).getCenter(i);let r=0;for(let n=0,o=e.length;n<o;n++)r=Math.max(r,i.distanceToSquared(e[n]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ci.subVectors(e,this.center);const t=ci.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ci,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ci.copy(e.center).add(gr)),this.expandByPoint(ci.copy(e.center).sub(gr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Yt=new k,vr=new k,Ri=new k,on=new k,_r=new k,Pi=new k,xr=new k;class hc{constructor(e=new k,t=new k(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yt)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Yt.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Yt.copy(this.origin).addScaledVector(this.direction,t),Yt.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){vr.copy(e).add(t).multiplyScalar(.5),Ri.copy(t).sub(e).normalize(),on.copy(this.origin).sub(vr);const n=e.distanceTo(t)*.5,o=-this.direction.dot(Ri),a=on.dot(this.direction),c=-on.dot(Ri),f=on.lengthSq(),u=Math.abs(1-o*o);let d,h,l,m;if(u>0)if(d=o*c-a,h=o*a-c,m=n*u,d>=0)if(h>=-m)if(h<=m){const g=1/u;d*=g,h*=g,l=d*(d+o*h+2*a)+h*(o*d+h+2*c)+f}else h=n,d=Math.max(0,-(o*h+a)),l=-d*d+h*(h+2*c)+f;else h=-n,d=Math.max(0,-(o*h+a)),l=-d*d+h*(h+2*c)+f;else h<=-m?(d=Math.max(0,-(-o*n+a)),h=d>0?-n:Math.min(Math.max(-n,-c),n),l=-d*d+h*(h+2*c)+f):h<=m?(d=0,h=Math.min(Math.max(-n,-c),n),l=h*(h+2*c)+f):(d=Math.max(0,-(o*n+a)),h=d>0?n:Math.min(Math.max(-n,-c),n),l=-d*d+h*(h+2*c)+f);else h=o>0?-n:n,d=Math.max(0,-(o*h+a)),l=-d*d+h*(h+2*c)+f;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(vr).addScaledVector(Ri,h),l}intersectSphere(e,t){Yt.subVectors(e.center,this.origin);const i=Yt.dot(this.direction),r=Yt.dot(Yt)-i*i,n=e.radius*e.radius;if(r>n)return null;const o=Math.sqrt(n-r),a=i-o,c=i+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,n,o,a,c;const f=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return f>=0?(i=(e.min.x-h.x)*f,r=(e.max.x-h.x)*f):(i=(e.max.x-h.x)*f,r=(e.min.x-h.x)*f),u>=0?(n=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(n=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||n>r||((n>i||isNaN(i))&&(i=n),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-h.z)*d,c=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,c=(e.min.z-h.z)*d),i>c||a>r)||((a>i||i!==i)&&(i=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Yt)!==null}intersectTriangle(e,t,i,r,n){_r.subVectors(t,e),Pi.subVectors(i,e),xr.crossVectors(_r,Pi);let o=this.direction.dot(xr),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;on.subVectors(this.origin,e);const c=a*this.direction.dot(Pi.crossVectors(on,Pi));if(c<0)return null;const f=a*this.direction.dot(_r.cross(on));if(f<0||c+f>o)return null;const u=-a*on.dot(xr);return u<0?null:this.at(u/o,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,i,r,n,o,a,c,f,u,d,h,l,m,g,p){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,n,o,a,c,f,u,d,h,l,m,g,p)}set(e,t,i,r,n,o,a,c,f,u,d,h,l,m,g,p){const v=this.elements;return v[0]=e,v[4]=t,v[8]=i,v[12]=r,v[1]=n,v[5]=o,v[9]=a,v[13]=c,v[2]=f,v[6]=u,v[10]=d,v[14]=h,v[3]=l,v[7]=m,v[11]=g,v[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/zn.setFromMatrixColumn(e,0).length(),n=1/zn.setFromMatrixColumn(e,1).length(),o=1/zn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*n,t[5]=i[5]*n,t[6]=i[6]*n,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,n=e.z,o=Math.cos(i),a=Math.sin(i),c=Math.cos(r),f=Math.sin(r),u=Math.cos(n),d=Math.sin(n);if(e.order==="XYZ"){const h=o*u,l=o*d,m=a*u,g=a*d;t[0]=c*u,t[4]=-c*d,t[8]=f,t[1]=l+m*f,t[5]=h-g*f,t[9]=-a*c,t[2]=g-h*f,t[6]=m+l*f,t[10]=o*c}else if(e.order==="YXZ"){const h=c*u,l=c*d,m=f*u,g=f*d;t[0]=h+g*a,t[4]=m*a-l,t[8]=o*f,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=l*a-m,t[6]=g+h*a,t[10]=o*c}else if(e.order==="ZXY"){const h=c*u,l=c*d,m=f*u,g=f*d;t[0]=h-g*a,t[4]=-o*d,t[8]=m+l*a,t[1]=l+m*a,t[5]=o*u,t[9]=g-h*a,t[2]=-o*f,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const h=o*u,l=o*d,m=a*u,g=a*d;t[0]=c*u,t[4]=m*f-l,t[8]=h*f+g,t[1]=c*d,t[5]=g*f+h,t[9]=l*f-m,t[2]=-f,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const h=o*c,l=o*f,m=a*c,g=a*f;t[0]=c*u,t[4]=g-h*d,t[8]=m*d+l,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-f*u,t[6]=l*d+m,t[10]=h-g*d}else if(e.order==="XZY"){const h=o*c,l=o*f,m=a*c,g=a*f;t[0]=c*u,t[4]=-d,t[8]=f*u,t[1]=h*d+g,t[5]=o*u,t[9]=l*d-m,t[2]=m*d-l,t[6]=a*u,t[10]=g*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(dc,e,pc)}lookAt(e,t,i){const r=this.elements;return Et.subVectors(e,t),Et.lengthSq()===0&&(Et.z=1),Et.normalize(),ln.crossVectors(i,Et),ln.lengthSq()===0&&(Math.abs(i.z)===1?Et.x+=1e-4:Et.z+=1e-4,Et.normalize(),ln.crossVectors(i,Et)),ln.normalize(),Di.crossVectors(Et,ln),r[0]=ln.x,r[4]=Di.x,r[8]=Et.x,r[1]=ln.y,r[5]=Di.y,r[9]=Et.y,r[2]=ln.z,r[6]=Di.z,r[10]=Et.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,n=this.elements,o=i[0],a=i[4],c=i[8],f=i[12],u=i[1],d=i[5],h=i[9],l=i[13],m=i[2],g=i[6],p=i[10],v=i[14],A=i[3],w=i[7],T=i[11],x=i[15],y=r[0],E=r[4],M=r[8],S=r[12],_=r[1],b=r[5],C=r[9],D=r[13],U=r[2],I=r[6],O=r[10],B=r[14],F=r[3],Z=r[7],j=r[11],re=r[15];return n[0]=o*y+a*_+c*U+f*F,n[4]=o*E+a*b+c*I+f*Z,n[8]=o*M+a*C+c*O+f*j,n[12]=o*S+a*D+c*B+f*re,n[1]=u*y+d*_+h*U+l*F,n[5]=u*E+d*b+h*I+l*Z,n[9]=u*M+d*C+h*O+l*j,n[13]=u*S+d*D+h*B+l*re,n[2]=m*y+g*_+p*U+v*F,n[6]=m*E+g*b+p*I+v*Z,n[10]=m*M+g*C+p*O+v*j,n[14]=m*S+g*D+p*B+v*re,n[3]=A*y+w*_+T*U+x*F,n[7]=A*E+w*b+T*I+x*Z,n[11]=A*M+w*C+T*O+x*j,n[15]=A*S+w*D+T*B+x*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],n=e[12],o=e[1],a=e[5],c=e[9],f=e[13],u=e[2],d=e[6],h=e[10],l=e[14],m=e[3],g=e[7],p=e[11],v=e[15];return m*(+n*c*d-r*f*d-n*a*h+i*f*h+r*a*l-i*c*l)+g*(+t*c*l-t*f*h+n*o*h-r*o*l+r*f*u-n*c*u)+p*(+t*f*d-t*a*l-n*o*d+i*o*l+n*a*u-i*f*u)+v*(-r*a*u-t*c*d+t*a*h+r*o*d-i*o*h+i*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],n=e[3],o=e[4],a=e[5],c=e[6],f=e[7],u=e[8],d=e[9],h=e[10],l=e[11],m=e[12],g=e[13],p=e[14],v=e[15],A=d*p*f-g*h*f+g*c*l-a*p*l-d*c*v+a*h*v,w=m*h*f-u*p*f-m*c*l+o*p*l+u*c*v-o*h*v,T=u*g*f-m*d*f+m*a*l-o*g*l-u*a*v+o*d*v,x=m*d*c-u*g*c-m*a*h+o*g*h+u*a*p-o*d*p,y=t*A+i*w+r*T+n*x;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/y;return e[0]=A*E,e[1]=(g*h*n-d*p*n-g*r*l+i*p*l+d*r*v-i*h*v)*E,e[2]=(a*p*n-g*c*n+g*r*f-i*p*f-a*r*v+i*c*v)*E,e[3]=(d*c*n-a*h*n-d*r*f+i*h*f+a*r*l-i*c*l)*E,e[4]=w*E,e[5]=(u*p*n-m*h*n+m*r*l-t*p*l-u*r*v+t*h*v)*E,e[6]=(m*c*n-o*p*n-m*r*f+t*p*f+o*r*v-t*c*v)*E,e[7]=(o*h*n-u*c*n+u*r*f-t*h*f-o*r*l+t*c*l)*E,e[8]=T*E,e[9]=(m*d*n-u*g*n-m*i*l+t*g*l+u*i*v-t*d*v)*E,e[10]=(o*g*n-m*a*n+m*i*f-t*g*f-o*i*v+t*a*v)*E,e[11]=(u*a*n-o*d*n-u*i*f+t*d*f+o*i*l-t*a*l)*E,e[12]=x*E,e[13]=(u*g*r-m*d*r+m*i*h-t*g*h-u*i*p+t*d*p)*E,e[14]=(m*a*r-o*g*r-m*i*c+t*g*c+o*i*p-t*a*p)*E,e[15]=(o*d*r-u*a*r+u*i*c-t*d*c-o*i*h+t*a*h)*E,this}scale(e){const t=this.elements,i=e.x,r=e.y,n=e.z;return t[0]*=i,t[4]*=r,t[8]*=n,t[1]*=i,t[5]*=r,t[9]*=n,t[2]*=i,t[6]*=r,t[10]*=n,t[3]*=i,t[7]*=r,t[11]*=n,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),n=1-i,o=e.x,a=e.y,c=e.z,f=n*o,u=n*a;return this.set(f*o+i,f*a-r*c,f*c+r*a,0,f*a+r*c,u*a+i,u*c-r*o,0,f*c-r*a,u*c+r*o,n*c*c+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,n,o){return this.set(1,i,n,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,n=t._x,o=t._y,a=t._z,c=t._w,f=n+n,u=o+o,d=a+a,h=n*f,l=n*u,m=n*d,g=o*u,p=o*d,v=a*d,A=c*f,w=c*u,T=c*d,x=i.x,y=i.y,E=i.z;return r[0]=(1-(g+v))*x,r[1]=(l+T)*x,r[2]=(m-w)*x,r[3]=0,r[4]=(l-T)*y,r[5]=(1-(h+v))*y,r[6]=(p+A)*y,r[7]=0,r[8]=(m+w)*E,r[9]=(p-A)*E,r[10]=(1-(h+g))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let n=zn.set(r[0],r[1],r[2]).length();const o=zn.set(r[4],r[5],r[6]).length(),a=zn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(n=-n),e.x=r[12],e.y=r[13],e.z=r[14],Ut.copy(this);const f=1/n,u=1/o,d=1/a;return Ut.elements[0]*=f,Ut.elements[1]*=f,Ut.elements[2]*=f,Ut.elements[4]*=u,Ut.elements[5]*=u,Ut.elements[6]*=u,Ut.elements[8]*=d,Ut.elements[9]*=d,Ut.elements[10]*=d,t.setFromRotationMatrix(Ut),i.x=n,i.y=o,i.z=a,this}makePerspective(e,t,i,r,n,o,a=en){const c=this.elements,f=2*n/(t-e),u=2*n/(i-r),d=(t+e)/(t-e),h=(i+r)/(i-r);let l,m;if(a===en)l=-(o+n)/(o-n),m=-2*o*n/(o-n);else if(a===ir)l=-o/(o-n),m=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=f,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=l,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,n,o,a=en){const c=this.elements,f=1/(t-e),u=1/(i-r),d=1/(o-n),h=(t+e)*f,l=(i+r)*u;let m,g;if(a===en)m=(o+n)*d,g=-2*d;else if(a===ir)m=n*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*f,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-l,c[2]=0,c[6]=0,c[10]=g,c[14]=-m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const zn=new k,Ut=new ot,dc=new k(0,0,0),pc=new k(1,1,1),ln=new k,Di=new k,Et=new k,ha=new ot,da=new Si;class rn{constructor(e=0,t=0,i=0,r=rn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,n=r[0],o=r[4],a=r[8],c=r[1],f=r[5],u=r[9],d=r[2],h=r[6],l=r[10];switch(t){case"XYZ":this._y=Math.asin(Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,l),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(h,f),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,l),this._z=Math.atan2(c,f)):(this._y=Math.atan2(-d,n),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,l),this._z=Math.atan2(-o,f)):(this._y=0,this._z=Math.atan2(c,n));break;case"ZYX":this._y=Math.asin(-Ge(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,l),this._z=Math.atan2(c,n)):(this._x=0,this._z=Math.atan2(-o,f));break;case"YZX":this._z=Math.asin(Ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,f),this._y=Math.atan2(-d,n)):(this._x=0,this._y=Math.atan2(a,l));break;case"XZY":this._z=Math.asin(-Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,f),this._y=Math.atan2(a,n)):(this._x=Math.atan2(-u,l),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ha.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ha,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return da.setFromEuler(this),this.setFromQuaternion(da,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}rn.DEFAULT_ORDER="XYZ";class mo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let mc=0;const pa=new k,Hn=new Si,$t=new ot,Li=new k,ui=new k,gc=new k,vc=new Si,ma=new k(1,0,0),ga=new k(0,1,0),va=new k(0,0,1),_a={type:"added"},_c={type:"removed"},Vn={type:"childadded",child:null},Sr={type:"childremoved",child:null};class At extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mc++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=At.DEFAULT_UP.clone();const e=new k,t=new rn,i=new Si,r=new k(1,1,1);function n(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(n),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new Le}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=At.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new mo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.multiply(Hn),this}rotateOnWorldAxis(e,t){return Hn.setFromAxisAngle(e,t),this.quaternion.premultiply(Hn),this}rotateX(e){return this.rotateOnAxis(ma,e)}rotateY(e){return this.rotateOnAxis(ga,e)}rotateZ(e){return this.rotateOnAxis(va,e)}translateOnAxis(e,t){return pa.copy(e).applyQuaternion(this.quaternion),this.position.add(pa.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ma,e)}translateY(e){return this.translateOnAxis(ga,e)}translateZ(e){return this.translateOnAxis(va,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($t.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Li.copy(e):Li.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ui.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$t.lookAt(ui,Li,this.up):$t.lookAt(Li,ui,this.up),this.quaternion.setFromRotationMatrix($t),r&&($t.extractRotation(r.matrixWorld),Hn.setFromRotationMatrix($t),this.quaternion.premultiply(Hn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(_a),Vn.child=e,this.dispatchEvent(Vn),Vn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_c),Sr.child=e,this.dispatchEvent(Sr),Sr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$t.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$t.multiply(e.parent.matrixWorld)),e.applyMatrix4($t),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(_a),Vn.child=e,this.dispatchEvent(Vn),Vn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let n=0,o=r.length;n<o;n++)r[n].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ui,e,gc),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ui,vc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let n=0,o=r.length;n<o;n++)r[n].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?{min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}:void 0,boundingSphere:a.boundingSphere?{radius:a.boundingSphere.radius,center:a.boundingSphere.center.toArray()}:void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:this.boundingSphere.center.toArray(),radius:this.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:this.boundingBox.min.toArray(),max:this.boundingBox.max.toArray()}));function n(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=n(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let f=0,u=c.length;f<u;f++){const d=c[f];n(e.shapes,d)}else n(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,f=this.material.length;c<f;c++)a.push(n(e.materials,this.material[c]));r.material=a}else r.material=n(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(n(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),f=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),l=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),c.length>0&&(i.materials=c),f.length>0&&(i.textures=f),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),l.length>0&&(i.animations=l),m.length>0&&(i.nodes=m)}return i.object=r,i;function o(a){const c=[];for(const f in a){const u=a[f];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}At.DEFAULT_UP=new k(0,1,0);At.DEFAULT_MATRIX_AUTO_UPDATE=!0;At.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Nt=new k,Zt=new k,Mr=new k,Kt=new k,Gn=new k,kn=new k,xa=new k,yr=new k,Er=new k,Tr=new k,Ar=new rt,wr=new rt,br=new rt;class Ot{constructor(e=new k,t=new k,i=new k){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Nt.subVectors(e,t),r.cross(Nt);const n=r.lengthSq();return n>0?r.multiplyScalar(1/Math.sqrt(n)):r.set(0,0,0)}static getBarycoord(e,t,i,r,n){Nt.subVectors(r,t),Zt.subVectors(i,t),Mr.subVectors(e,t);const o=Nt.dot(Nt),a=Nt.dot(Zt),c=Nt.dot(Mr),f=Zt.dot(Zt),u=Zt.dot(Mr),d=o*f-a*a;if(d===0)return n.set(0,0,0),null;const h=1/d,l=(f*c-a*u)*h,m=(o*u-a*c)*h;return n.set(1-l-m,m,l)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Kt)===null?!1:Kt.x>=0&&Kt.y>=0&&Kt.x+Kt.y<=1}static getInterpolation(e,t,i,r,n,o,a,c){return this.getBarycoord(e,t,i,r,Kt)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(n,Kt.x),c.addScaledVector(o,Kt.y),c.addScaledVector(a,Kt.z),c)}static getInterpolatedAttribute(e,t,i,r,n,o){return Ar.setScalar(0),wr.setScalar(0),br.setScalar(0),Ar.fromBufferAttribute(e,t),wr.fromBufferAttribute(e,i),br.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Ar,n.x),o.addScaledVector(wr,n.y),o.addScaledVector(br,n.z),o}static isFrontFacing(e,t,i,r){return Nt.subVectors(i,t),Zt.subVectors(e,t),Nt.cross(Zt).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nt.subVectors(this.c,this.b),Zt.subVectors(this.a,this.b),Nt.cross(Zt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ot.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ot.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,n){return Ot.getInterpolation(e,this.a,this.b,this.c,t,i,r,n)}containsPoint(e){return Ot.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ot.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,n=this.c;let o,a;Gn.subVectors(r,i),kn.subVectors(n,i),yr.subVectors(e,i);const c=Gn.dot(yr),f=kn.dot(yr);if(c<=0&&f<=0)return t.copy(i);Er.subVectors(e,r);const u=Gn.dot(Er),d=kn.dot(Er);if(u>=0&&d<=u)return t.copy(r);const h=c*d-u*f;if(h<=0&&c>=0&&u<=0)return o=c/(c-u),t.copy(i).addScaledVector(Gn,o);Tr.subVectors(e,n);const l=Gn.dot(Tr),m=kn.dot(Tr);if(m>=0&&l<=m)return t.copy(n);const g=l*f-c*m;if(g<=0&&f>=0&&m<=0)return a=f/(f-m),t.copy(i).addScaledVector(kn,a);const p=u*m-l*d;if(p<=0&&d-u>=0&&l-m>=0)return xa.subVectors(n,r),a=(d-u)/(d-u+(l-m)),t.copy(r).addScaledVector(xa,a);const v=1/(p+g+h);return o=g*v,a=h*v,t.copy(i).addScaledVector(Gn,o).addScaledVector(kn,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const go={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cn={h:0,s:0,l:0},Ii={h:0,s:0,l:0};function Cr(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ye.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Ye.workingColorSpace){if(e=ec(e,1),t=Ge(t,0,1),i=Ge(i,0,1),t===0)this.r=this.g=this.b=i;else{const n=i<=.5?i*(1+t):i+t-i*t,o=2*i-n;this.r=Cr(o,n,e+1/3),this.g=Cr(o,n,e),this.b=Cr(o,n,e-1/3)}return Ye.toWorkingColorSpace(this,r),this}setStyle(e,t=Rt){function i(n){n!==void 0&&parseFloat(n)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let n;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const n=r[1],o=n.length;if(o===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(n,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){const i=go[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=tn(e.r),this.g=tn(e.g),this.b=tn(e.b),this}copyLinearToSRGB(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return Ye.fromWorkingColorSpace(pt.copy(this),e),Math.round(Ge(pt.r*255,0,255))*65536+Math.round(Ge(pt.g*255,0,255))*256+Math.round(Ge(pt.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.fromWorkingColorSpace(pt.copy(this),t);const i=pt.r,r=pt.g,n=pt.b,o=Math.max(i,r,n),a=Math.min(i,r,n);let c,f;const u=(a+o)/2;if(a===o)c=0,f=0;else{const d=o-a;switch(f=u<=.5?d/(o+a):d/(2-o-a),o){case i:c=(r-n)/d+(r<n?6:0);break;case r:c=(n-i)/d+2;break;case n:c=(i-r)/d+4;break}c/=6}return e.h=c,e.s=f,e.l=u,e}getRGB(e,t=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(pt.copy(this),t),e.r=pt.r,e.g=pt.g,e.b=pt.b,e}getStyle(e=Rt){Ye.fromWorkingColorSpace(pt.copy(this),e);const t=pt.r,i=pt.g,r=pt.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(cn),this.setHSL(cn.h+e,cn.s+t,cn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(cn),e.getHSL(Ii);const i=fr(cn.h,Ii.h,t),r=fr(cn.s,Ii.s,t),n=fr(cn.l,Ii.l,t);return this.setHSL(i,r,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,n=e.elements;return this.r=n[0]*t+n[3]*i+n[6]*r,this.g=n[1]*t+n[4]*i+n[7]*r,this.b=n[2]*t+n[5]*i+n[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const pt=new Qe;Qe.NAMES=go;let xc=0;class sr extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xc++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=Kn,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vr,this.blendDst=Gr,this.blendEquation=An,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qe(0,0,0),this.blendAlpha=0,this.depthFunc=Jn,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Un,this.stencilZFail=Un,this.stencilZPass=Un,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Kn&&(i.blending=this.blending),this.side!==pn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Vr&&(i.blendSrc=this.blendSrc),this.blendDst!==Gr&&(i.blendDst=this.blendDst),this.blendEquation!==An&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Jn&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sa&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Un&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Un&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Un&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(n){const o=[];for(const a in n){const c=n[a];delete c.metadata,o.push(c)}return o}if(t){const n=r(e.textures),o=r(e.images);n.length>0&&(i.textures=n),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let n=0;n!==r;++n)i[n]=t[n].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class vo extends sr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=to,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const at=new k,Ui=new Ke;let Sc=0;class kt{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Sc++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=aa,this.updateRanges=[],this.gpuType=Qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,n=this.itemSize;r<n;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ui.fromBufferAttribute(this,t),Ui.applyMatrix3(e),this.setXY(t,Ui.x,Ui.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)at.fromBufferAttribute(this,t),at.applyMatrix3(e),this.setXYZ(t,at.x,at.y,at.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)at.fromBufferAttribute(this,t),at.applyMatrix4(e),this.setXYZ(t,at.x,at.y,at.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)at.fromBufferAttribute(this,t),at.applyNormalMatrix(e),this.setXYZ(t,at.x,at.y,at.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)at.fromBufferAttribute(this,t),at.transformDirection(e),this.setXYZ(t,at.x,at.y,at.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=oi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=St(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=St(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),r=St(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,n){return e*=this.itemSize,this.normalized&&(t=St(t,this.array),i=St(i,this.array),r=St(r,this.array),n=St(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==aa&&(e.usage=this.usage),e}}class _o extends kt{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class xo extends kt{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Rn extends kt{constructor(e,t,i){super(new Float32Array(e),t,i)}}let Mc=0;const Ct=new ot,Rr=new At,Wn=new k,Tt=new Mi,fi=new Mi,ut=new k;class Ln extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mc++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ho(e)?xo:_o)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const n=new Le().getNormalMatrix(e);i.applyNormalMatrix(n),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Ct.makeRotationFromQuaternion(e),this.applyMatrix4(Ct),this}rotateX(e){return Ct.makeRotationX(e),this.applyMatrix4(Ct),this}rotateY(e){return Ct.makeRotationY(e),this.applyMatrix4(Ct),this}rotateZ(e){return Ct.makeRotationZ(e),this.applyMatrix4(Ct),this}translate(e,t,i){return Ct.makeTranslation(e,t,i),this.applyMatrix4(Ct),this}scale(e,t,i){return Ct.makeScale(e,t,i),this.applyMatrix4(Ct),this}lookAt(e){return Rr.lookAt(e),Rr.updateMatrix(),this.applyMatrix4(Rr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wn).negate(),this.translate(Wn.x,Wn.y,Wn.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,n=e.length;r<n;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Rn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new k(-1/0,-1/0,-1/0),new k(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const n=t[i];Tt.setFromBufferAttribute(n),this.morphTargetsRelative?(ut.addVectors(this.boundingBox.min,Tt.min),this.boundingBox.expandByPoint(ut),ut.addVectors(this.boundingBox.max,Tt.max),this.boundingBox.expandByPoint(ut)):(this.boundingBox.expandByPoint(Tt.min),this.boundingBox.expandByPoint(Tt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Bs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new k,1/0);return}if(e){const i=this.boundingSphere.center;if(Tt.setFromBufferAttribute(e),t)for(let n=0,o=t.length;n<o;n++){const a=t[n];fi.setFromBufferAttribute(a),this.morphTargetsRelative?(ut.addVectors(Tt.min,fi.min),Tt.expandByPoint(ut),ut.addVectors(Tt.max,fi.max),Tt.expandByPoint(ut)):(Tt.expandByPoint(fi.min),Tt.expandByPoint(fi.max))}Tt.getCenter(i);let r=0;for(let n=0,o=e.count;n<o;n++)ut.fromBufferAttribute(e,n),r=Math.max(r,i.distanceToSquared(ut));if(t)for(let n=0,o=t.length;n<o;n++){const a=t[n],c=this.morphTargetsRelative;for(let f=0,u=a.count;f<u;f++)ut.fromBufferAttribute(a,f),c&&(Wn.fromBufferAttribute(e,f),ut.add(Wn)),r=Math.max(r,i.distanceToSquared(ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,n=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let M=0;M<i.count;M++)a[M]=new k,c[M]=new k;const f=new k,u=new k,d=new k,h=new Ke,l=new Ke,m=new Ke,g=new k,p=new k;function v(M,S,_){f.fromBufferAttribute(i,M),u.fromBufferAttribute(i,S),d.fromBufferAttribute(i,_),h.fromBufferAttribute(n,M),l.fromBufferAttribute(n,S),m.fromBufferAttribute(n,_),u.sub(f),d.sub(f),l.sub(h),m.sub(h);const b=1/(l.x*m.y-m.x*l.y);isFinite(b)&&(g.copy(u).multiplyScalar(m.y).addScaledVector(d,-l.y).multiplyScalar(b),p.copy(d).multiplyScalar(l.x).addScaledVector(u,-m.x).multiplyScalar(b),a[M].add(g),a[S].add(g),a[_].add(g),c[M].add(p),c[S].add(p),c[_].add(p))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let M=0,S=A.length;M<S;++M){const _=A[M],b=_.start,C=_.count;for(let D=b,U=b+C;D<U;D+=3)v(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const w=new k,T=new k,x=new k,y=new k;function E(M){x.fromBufferAttribute(r,M),y.copy(x);const S=a[M];w.copy(S),w.sub(x.multiplyScalar(x.dot(S))).normalize(),T.crossVectors(y,S);const b=T.dot(c[M])<0?-1:1;o.setXYZW(M,w.x,w.y,w.z,b)}for(let M=0,S=A.length;M<S;++M){const _=A[M],b=_.start,C=_.count;for(let D=b,U=b+C;D<U;D+=3)E(e.getX(D+0)),E(e.getX(D+1)),E(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,l=i.count;h<l;h++)i.setXYZ(h,0,0,0);const r=new k,n=new k,o=new k,a=new k,c=new k,f=new k,u=new k,d=new k;if(e)for(let h=0,l=e.count;h<l;h+=3){const m=e.getX(h+0),g=e.getX(h+1),p=e.getX(h+2);r.fromBufferAttribute(t,m),n.fromBufferAttribute(t,g),o.fromBufferAttribute(t,p),u.subVectors(o,n),d.subVectors(r,n),u.cross(d),a.fromBufferAttribute(i,m),c.fromBufferAttribute(i,g),f.fromBufferAttribute(i,p),a.add(u),c.add(u),f.add(u),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(g,c.x,c.y,c.z),i.setXYZ(p,f.x,f.y,f.z)}else for(let h=0,l=t.count;h<l;h+=3)r.fromBufferAttribute(t,h+0),n.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,n),d.subVectors(r,n),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)ut.fromBufferAttribute(e,t),ut.normalize(),e.setXYZ(t,ut.x,ut.y,ut.z)}toNonIndexed(){function e(a,c){const f=a.array,u=a.itemSize,d=a.normalized,h=new f.constructor(c.length*u);let l=0,m=0;for(let g=0,p=c.length;g<p;g++){a.isInterleavedBufferAttribute?l=c[g]*a.data.stride+a.offset:l=c[g]*u;for(let v=0;v<u;v++)h[m++]=f[l++]}return new kt(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ln,i=this.index.array,r=this.attributes;for(const a in r){const c=r[a],f=e(c,i);t.setAttribute(a,f)}const n=this.morphAttributes;for(const a in n){const c=[],f=n[a];for(let u=0,d=f.length;u<d;u++){const h=f[u],l=e(h,i);c.push(l)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const f=o[a];t.addGroup(f.start,f.count,f.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const f in c)c[f]!==void 0&&(e[f]=c[f]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const c in i){const f=i[c];e.data.attributes[c]=f.toJSON(e.data)}const r={};let n=!1;for(const c in this.morphAttributes){const f=this.morphAttributes[c],u=[];for(let d=0,h=f.length;d<h;d++){const l=f[d];u.push(l.toJSON(e.data))}u.length>0&&(r[c]=u,n=!0)}n&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const f in r){const u=r[f];this.setAttribute(f,u.clone(t))}const n=e.morphAttributes;for(const f in n){const u=[],d=n[f];for(let h=0,l=d.length;h<l;h++)u.push(d[h].clone(t));this.morphAttributes[f]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let f=0,u=o.length;f<u;f++){const d=o[f];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Sa=new ot,xn=new hc,Ni=new Bs,Ma=new k,Fi=new k,Oi=new k,Bi=new k,Pr=new k,zi=new k,ya=new k,Hi=new k;class zt extends At{constructor(e=new Ln,t=new vo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let n=0,o=r.length;n<o;n++){const a=r[n].name||String(n);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=n}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,n=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(n&&a){zi.set(0,0,0);for(let c=0,f=n.length;c<f;c++){const u=a[c],d=n[c];u!==0&&(Pr.fromBufferAttribute(d,e),o?zi.addScaledVector(Pr,u):zi.addScaledVector(Pr.sub(t),u))}t.add(zi)}return t}raycast(e,t){const i=this.geometry,r=this.material,n=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ni.copy(i.boundingSphere),Ni.applyMatrix4(n),xn.copy(e.ray).recast(e.near),!(Ni.containsPoint(xn.origin)===!1&&(xn.intersectSphere(Ni,Ma)===null||xn.origin.distanceToSquared(Ma)>(e.far-e.near)**2))&&(Sa.copy(n).invert(),xn.copy(e.ray).applyMatrix4(Sa),!(i.boundingBox!==null&&xn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,xn)))}_computeIntersections(e,t,i){let r;const n=this.geometry,o=this.material,a=n.index,c=n.attributes.position,f=n.attributes.uv,u=n.attributes.uv1,d=n.attributes.normal,h=n.groups,l=n.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,g=h.length;m<g;m++){const p=h[m],v=o[p.materialIndex],A=Math.max(p.start,l.start),w=Math.min(a.count,Math.min(p.start+p.count,l.start+l.count));for(let T=A,x=w;T<x;T+=3){const y=a.getX(T),E=a.getX(T+1),M=a.getX(T+2);r=Vi(this,v,e,i,f,u,d,y,E,M),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const m=Math.max(0,l.start),g=Math.min(a.count,l.start+l.count);for(let p=m,v=g;p<v;p+=3){const A=a.getX(p),w=a.getX(p+1),T=a.getX(p+2);r=Vi(this,o,e,i,f,u,d,A,w,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,g=h.length;m<g;m++){const p=h[m],v=o[p.materialIndex],A=Math.max(p.start,l.start),w=Math.min(c.count,Math.min(p.start+p.count,l.start+l.count));for(let T=A,x=w;T<x;T+=3){const y=T,E=T+1,M=T+2;r=Vi(this,v,e,i,f,u,d,y,E,M),r&&(r.faceIndex=Math.floor(T/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const m=Math.max(0,l.start),g=Math.min(c.count,l.start+l.count);for(let p=m,v=g;p<v;p+=3){const A=p,w=p+1,T=p+2;r=Vi(this,o,e,i,f,u,d,A,w,T),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function yc(s,e,t,i,r,n,o,a){let c;if(e.side===Mt?c=i.intersectTriangle(o,n,r,!0,a):c=i.intersectTriangle(r,n,o,e.side===pn,a),c===null)return null;Hi.copy(a),Hi.applyMatrix4(s.matrixWorld);const f=t.ray.origin.distanceTo(Hi);return f<t.near||f>t.far?null:{distance:f,point:Hi.clone(),object:s}}function Vi(s,e,t,i,r,n,o,a,c,f){s.getVertexPosition(a,Fi),s.getVertexPosition(c,Oi),s.getVertexPosition(f,Bi);const u=yc(s,e,t,i,Fi,Oi,Bi,ya);if(u){const d=new k;Ot.getBarycoord(ya,Fi,Oi,Bi,d),r&&(u.uv=Ot.getInterpolatedAttribute(r,a,c,f,d,new Ke)),n&&(u.uv1=Ot.getInterpolatedAttribute(n,a,c,f,d,new Ke)),o&&(u.normal=Ot.getInterpolatedAttribute(o,a,c,f,d,new k),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:c,c:f,normal:new k,materialIndex:0};Ot.getNormal(Fi,Oi,Bi,h.normal),u.face=h,u.barycoord=d}return u}class yi extends Ln{constructor(e=1,t=1,i=1,r=1,n=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:n,depthSegments:o};const a=this;r=Math.floor(r),n=Math.floor(n),o=Math.floor(o);const c=[],f=[],u=[],d=[];let h=0,l=0;m("z","y","x",-1,-1,i,t,e,o,n,0),m("z","y","x",1,-1,i,t,-e,o,n,1),m("x","z","y",1,1,e,i,t,r,o,2),m("x","z","y",1,-1,e,i,-t,r,o,3),m("x","y","z",1,-1,e,t,i,r,n,4),m("x","y","z",-1,-1,e,t,-i,r,n,5),this.setIndex(c),this.setAttribute("position",new Rn(f,3)),this.setAttribute("normal",new Rn(u,3)),this.setAttribute("uv",new Rn(d,2));function m(g,p,v,A,w,T,x,y,E,M,S){const _=T/E,b=x/M,C=T/2,D=x/2,U=y/2,I=E+1,O=M+1;let B=0,F=0;const Z=new k;for(let j=0;j<O;j++){const re=j*b-D;for(let _e=0;_e<I;_e++){const Ce=_e*_-C;Z[g]=Ce*A,Z[p]=re*w,Z[v]=U,f.push(Z.x,Z.y,Z.z),Z[g]=0,Z[p]=0,Z[v]=y>0?1:-1,u.push(Z.x,Z.y,Z.z),d.push(_e/E),d.push(1-j/M),B+=1}}for(let j=0;j<M;j++)for(let re=0;re<E;re++){const _e=h+re+I*j,Ce=h+re+I*(j+1),Y=h+(re+1)+I*(j+1),te=h+(re+1)+I*j;c.push(_e,Ce,te),c.push(Ce,Y,te),F+=6}a.addGroup(l,F,S),l+=F,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ni(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const r=s[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function vt(s){const e={};for(let t=0;t<s.length;t++){const i=ni(s[t]);for(const r in i)e[r]=i[r]}return e}function Ec(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function So(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const Tc={clone:ni,merge:vt};var Ac=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Wt extends sr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ac,this.fragmentShader=wc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ni(e.uniforms),this.uniformsGroups=Ec(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Mo extends At{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=en}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const un=new k,Ea=new Ke,Ta=new Ke;class Pt extends Mo{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ws*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ur*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ws*2*Math.atan(Math.tan(ur*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(un.x,un.y).multiplyScalar(-e/un.z),un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(un.x,un.y).multiplyScalar(-e/un.z)}getViewSize(e,t){return this.getViewBounds(e,Ea,Ta),t.subVectors(Ta,Ea)}setViewOffset(e,t,i,r,n,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=n,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ur*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,n=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,f=o.fullHeight;n+=o.offsetX*r/c,t-=o.offsetY*i/f,r*=o.width/c,i*=o.height/f}const a=this.filmOffset;a!==0&&(n+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Xn=-90,qn=1;class bc extends At{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Pt(Xn,qn,e,t);r.layers=this.layers,this.add(r);const n=new Pt(Xn,qn,e,t);n.layers=this.layers,this.add(n);const o=new Pt(Xn,qn,e,t);o.layers=this.layers,this.add(o);const a=new Pt(Xn,qn,e,t);a.layers=this.layers,this.add(a);const c=new Pt(Xn,qn,e,t);c.layers=this.layers,this.add(c);const f=new Pt(Xn,qn,e,t);f.layers=this.layers,this.add(f)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,n,o,a,c]=t;for(const f of t)this.remove(f);if(e===en)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ir)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const f of t)this.add(f),f.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[n,o,a,c,f,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),l=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,n),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,c),e.setRenderTarget(i,4,r),e.render(t,f),i.texture.generateMipmaps=g,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(d,h,l),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class yo extends mt{constructor(e=[],t=Qn,i,r,n,o,a,c,f,u){super(e,t,i,r,n,o,a,c,f,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cc extends Dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new yo(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Gt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new yi(5,5,5),n=new Wt({name:"CubemapFromEquirect",uniforms:ni(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Mt,blending:hn});n.uniforms.tEquirect.value=t;const o=new zt(r,n),a=t.minFilter;return t.minFilter===Cn&&(t.minFilter=Gt),new bc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const n=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(n)}}class Gi extends At{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Rc={type:"move"};class Dr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new k,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new k),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new k,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new k),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,n=null,o=null;const a=this._targetRay,c=this._grip,f=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(f&&e.hand){o=!0;for(const g of e.hand.values()){const p=t.getJointPose(g,i),v=this._getHandJoint(f,g);p!==null&&(v.matrix.fromArray(p.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=p.radius),v.visible=p!==null}const u=f.joints["index-finger-tip"],d=f.joints["thumb-tip"],h=u.position.distanceTo(d.position),l=.02,m=.005;f.inputState.pinching&&h>l+m?(f.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!f.inputState.pinching&&h<=l-m&&(f.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,i),n!==null&&(c.matrix.fromArray(n.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,n.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(n.linearVelocity)):c.hasLinearVelocity=!1,n.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(n.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&n!==null&&(r=n),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Rc)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=n!==null),f!==null&&(f.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Eo extends At{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Lr=new k,Pc=new k,Dc=new Le;class En{constructor(e=new k(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Lr.subVectors(i,t).cross(Pc.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Lr),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const n=-(e.start.dot(this.normal)+this.constant)/r;return n<0||n>1?null:t.copy(e.start).addScaledVector(i,n)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Dc.getNormalMatrix(e),r=this.coplanarPoint(Lr).applyMatrix4(e),n=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Sn=new Bs,ki=new k;class To{constructor(e=new En,t=new En,i=new En,r=new En,n=new En,o=new En){this.planes=[e,t,i,r,n,o]}set(e,t,i,r,n,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(n),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=en){const i=this.planes,r=e.elements,n=r[0],o=r[1],a=r[2],c=r[3],f=r[4],u=r[5],d=r[6],h=r[7],l=r[8],m=r[9],g=r[10],p=r[11],v=r[12],A=r[13],w=r[14],T=r[15];if(i[0].setComponents(c-n,h-f,p-l,T-v).normalize(),i[1].setComponents(c+n,h+f,p+l,T+v).normalize(),i[2].setComponents(c+o,h+u,p+m,T+A).normalize(),i[3].setComponents(c-o,h-u,p-m,T-A).normalize(),i[4].setComponents(c-a,h-d,p-g,T-w).normalize(),t===en)i[5].setComponents(c+a,h+d,p+g,T+w).normalize();else if(t===ir)i[5].setComponents(a,d,g,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Sn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Sn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Sn)}intersectsSprite(e){return Sn.center.set(0,0,0),Sn.radius=.7071067811865476,Sn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Sn)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(ki.x=r.normal.x>0?e.max.x:e.min.x,ki.y=r.normal.y>0?e.max.y:e.min.y,ki.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ki)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Aa extends mt{constructor(e,t,i,r,n,o,a,c,f){super(e,t,i,r,n,o,a,c,f),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ao extends mt{constructor(e,t,i=Pn,r,n,o,a=Ht,c=Ht,f,u=mi){if(u!==mi&&u!==gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");super(null,r,n,o,a,c,u,i,f),this.isDepthTexture=!0,this.image={width:e,height:t},this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Os(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ri extends Ln{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const n=e/2,o=t/2,a=Math.floor(i),c=Math.floor(r),f=a+1,u=c+1,d=e/a,h=t/c,l=[],m=[],g=[],p=[];for(let v=0;v<u;v++){const A=v*h-o;for(let w=0;w<f;w++){const T=w*d-n;m.push(T,-A,0),g.push(0,0,1),p.push(w/a),p.push(1-v/c)}}for(let v=0;v<c;v++)for(let A=0;A<a;A++){const w=A+f*v,T=A+f*(v+1),x=A+1+f*(v+1),y=A+1+f*v;l.push(w,T,y),l.push(T,x,y)}this.setIndex(l),this.setAttribute("position",new Rn(m,3)),this.setAttribute("normal",new Rn(g,3)),this.setAttribute("uv",new Rn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ri(e.width,e.height,e.widthSegments,e.heightSegments)}}class Lc extends sr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ic extends sr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const wa={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class Uc{constructor(e,t,i){const r=this;let n=!1,o=0,a=0,c;const f=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(u){a++,n===!1&&r.onStart!==void 0&&r.onStart(u,o,a),n=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(n=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,d){return f.push(u,d),this},this.removeHandler=function(u){const d=f.indexOf(u);return d!==-1&&f.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=f.length;d<h;d+=2){const l=f[d],m=f[d+1];if(l.global&&(l.lastIndex=0),l.test(u))return m}return null}}}const Nc=new Uc;class zs{constructor(e){this.manager=e!==void 0?e:Nc,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,n){i.load(e,r,t,n)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}zs.DEFAULT_MATERIAL_NAME="__DEFAULT";class Fc extends zs{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const n=this,o=wa.get(e);if(o!==void 0)return n.manager.itemStart(e),setTimeout(function(){t&&t(o),n.manager.itemEnd(e)},0),o;const a=vi("img");function c(){u(),wa.add(e,this),t&&t(this),n.manager.itemEnd(e)}function f(d){u(),r&&r(d),n.manager.itemError(e),n.manager.itemEnd(e)}function u(){a.removeEventListener("load",c,!1),a.removeEventListener("error",f,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",f,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),n.manager.itemStart(e),a.src=e,a}}class Oc extends zs{constructor(e){super(e)}load(e,t,i,r){const n=new mt,o=new Fc(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){n.image=a,n.needsUpdate=!0,t!==void 0&&t(n)},i,r),n}}class wo extends Mo{constructor(e=-1,t=1,i=1,r=-1,n=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=n,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,n,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=n,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let n=i-e,o=i+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const f=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=f*this.view.offsetX,o=n+f*this.view.width,a-=u*this.view.offsetY,c=a-u*this.view.height}this.projectionMatrix.makeOrthographic(n,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Bc extends Pt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class zc{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=ba(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=ba();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function ba(){return performance.now()}function Ca(s,e,t,i){const r=Hc(i);switch(t){case ao:return s*e;case lo:return s*e/r.components*r.byteLength;case Us:return s*e/r.components*r.byteLength;case co:return s*e*2/r.components*r.byteLength;case Ns:return s*e*2/r.components*r.byteLength;case oo:return s*e*3/r.components*r.byteLength;case Bt:return s*e*4/r.components*r.byteLength;case Fs:return s*e*4/r.components*r.byteLength;case $i:case Zi:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ki:case ji:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ts:case is:return Math.max(s,16)*Math.max(e,8)/4;case es:case ns:return Math.max(s,8)*Math.max(e,8)/2;case rs:case ss:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case as:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case os:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ls:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case cs:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case us:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case fs:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case hs:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case ds:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ps:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case ms:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case gs:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case vs:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case _s:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case xs:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Ss:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Ji:case Ms:case ys:return Math.ceil(s/4)*Math.ceil(e/4)*16;case uo:case Es:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Ts:case As:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Hc(s){switch(s){case nn:case io:return{byteLength:1,components:1};case di:case ro:case _i:return{byteLength:2,components:1};case Ls:case Is:return{byteLength:2,components:4};case Pn:case Ds:case Qt:return{byteLength:4,components:1};case so:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ps}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ps);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function bo(){let s=null,e=!1,t=null,i=null;function r(n,o){t(n,o),i=s.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=s.requestAnimationFrame(r),e=!0)},stop:function(){s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){s=n}}}function Vc(s){const e=new WeakMap;function t(a,c){const f=a.array,u=a.usage,d=f.byteLength,h=s.createBuffer();s.bindBuffer(c,h),s.bufferData(c,f,u),a.onUploadCallback();let l;if(f instanceof Float32Array)l=s.FLOAT;else if(f instanceof Uint16Array)a.isFloat16BufferAttribute?l=s.HALF_FLOAT:l=s.UNSIGNED_SHORT;else if(f instanceof Int16Array)l=s.SHORT;else if(f instanceof Uint32Array)l=s.UNSIGNED_INT;else if(f instanceof Int32Array)l=s.INT;else if(f instanceof Int8Array)l=s.BYTE;else if(f instanceof Uint8Array)l=s.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)l=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:h,type:l,bytesPerElement:f.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,c,f){const u=c.array,d=c.updateRanges;if(s.bindBuffer(f,a),d.length===0)s.bufferSubData(f,0,u);else{d.sort((l,m)=>l.start-m.start);let h=0;for(let l=1;l<d.length;l++){const m=d[h],g=d[l];g.start<=m.start+m.count+1?m.count=Math.max(m.count,g.start+g.count-m.start):(++h,d[h]=g)}d.length=h+1;for(let l=0,m=d.length;l<m;l++){const g=d[l];s.bufferSubData(f,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function n(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(s.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const f=e.get(a);if(f===void 0)e.set(a,t(a,c));else if(f.version<a.version){if(f.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(f.buffer,a,c),f.version=a.version}}return{get:r,remove:n,update:o}}var Gc=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kc=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wc=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xc=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qc=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yc=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$c=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Zc=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kc=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,jc=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Jc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qc=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,iu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ru=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,su=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,au=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ou=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,uu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,du=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,pu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_u="gl_FragColor = linearToOutputTexel( gl_FragColor );",xu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Su=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Mu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,yu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Eu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Au=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ru=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Pu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Du=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Iu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Uu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ou=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ku=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$u=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ku=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ju=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ju=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ef=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,af=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,of=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ff=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,hf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,df=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ef=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Af=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Df=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,If=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Uf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ff=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Of=`#ifdef USE_TRANSMISSION
	uniform float transmission;
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
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Bf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Gf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$f=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,jf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,th=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nh=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ih=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rh=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sh=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ah=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,oh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lh=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ch=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,uh=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fh=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hh=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dh=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ph=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mh=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gh=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,vh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_h=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xh=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Sh=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ue={alphahash_fragment:Gc,alphahash_pars_fragment:kc,alphamap_fragment:Wc,alphamap_pars_fragment:Xc,alphatest_fragment:qc,alphatest_pars_fragment:Yc,aomap_fragment:$c,aomap_pars_fragment:Zc,batching_pars_vertex:Kc,batching_vertex:jc,begin_vertex:Jc,beginnormal_vertex:Qc,bsdfs:eu,iridescence_fragment:tu,bumpmap_pars_fragment:nu,clipping_planes_fragment:iu,clipping_planes_pars_fragment:ru,clipping_planes_pars_vertex:su,clipping_planes_vertex:au,color_fragment:ou,color_pars_fragment:lu,color_pars_vertex:cu,color_vertex:uu,common:fu,cube_uv_reflection_fragment:hu,defaultnormal_vertex:du,displacementmap_pars_vertex:pu,displacementmap_vertex:mu,emissivemap_fragment:gu,emissivemap_pars_fragment:vu,colorspace_fragment:_u,colorspace_pars_fragment:xu,envmap_fragment:Su,envmap_common_pars_fragment:Mu,envmap_pars_fragment:yu,envmap_pars_vertex:Eu,envmap_physical_pars_fragment:Uu,envmap_vertex:Tu,fog_vertex:Au,fog_pars_vertex:wu,fog_fragment:bu,fog_pars_fragment:Cu,gradientmap_pars_fragment:Ru,lightmap_pars_fragment:Pu,lights_lambert_fragment:Du,lights_lambert_pars_fragment:Lu,lights_pars_begin:Iu,lights_toon_fragment:Nu,lights_toon_pars_fragment:Fu,lights_phong_fragment:Ou,lights_phong_pars_fragment:Bu,lights_physical_fragment:zu,lights_physical_pars_fragment:Hu,lights_fragment_begin:Vu,lights_fragment_maps:Gu,lights_fragment_end:ku,logdepthbuf_fragment:Wu,logdepthbuf_pars_fragment:Xu,logdepthbuf_pars_vertex:qu,logdepthbuf_vertex:Yu,map_fragment:$u,map_pars_fragment:Zu,map_particle_fragment:Ku,map_particle_pars_fragment:ju,metalnessmap_fragment:Ju,metalnessmap_pars_fragment:Qu,morphinstance_vertex:ef,morphcolor_vertex:tf,morphnormal_vertex:nf,morphtarget_pars_vertex:rf,morphtarget_vertex:sf,normal_fragment_begin:af,normal_fragment_maps:of,normal_pars_fragment:lf,normal_pars_vertex:cf,normal_vertex:uf,normalmap_pars_fragment:ff,clearcoat_normal_fragment_begin:hf,clearcoat_normal_fragment_maps:df,clearcoat_pars_fragment:pf,iridescence_pars_fragment:mf,opaque_fragment:gf,packing:vf,premultiplied_alpha_fragment:_f,project_vertex:xf,dithering_fragment:Sf,dithering_pars_fragment:Mf,roughnessmap_fragment:yf,roughnessmap_pars_fragment:Ef,shadowmap_pars_fragment:Tf,shadowmap_pars_vertex:Af,shadowmap_vertex:wf,shadowmask_pars_fragment:bf,skinbase_vertex:Cf,skinning_pars_vertex:Rf,skinning_vertex:Pf,skinnormal_vertex:Df,specularmap_fragment:Lf,specularmap_pars_fragment:If,tonemapping_fragment:Uf,tonemapping_pars_fragment:Nf,transmission_fragment:Ff,transmission_pars_fragment:Of,uv_pars_fragment:Bf,uv_pars_vertex:zf,uv_vertex:Hf,worldpos_vertex:Vf,background_vert:Gf,background_frag:kf,backgroundCube_vert:Wf,backgroundCube_frag:Xf,cube_vert:qf,cube_frag:Yf,depth_vert:$f,depth_frag:Zf,distanceRGBA_vert:Kf,distanceRGBA_frag:jf,equirect_vert:Jf,equirect_frag:Qf,linedashed_vert:eh,linedashed_frag:th,meshbasic_vert:nh,meshbasic_frag:ih,meshlambert_vert:rh,meshlambert_frag:sh,meshmatcap_vert:ah,meshmatcap_frag:oh,meshnormal_vert:lh,meshnormal_frag:ch,meshphong_vert:uh,meshphong_frag:fh,meshphysical_vert:hh,meshphysical_frag:dh,meshtoon_vert:ph,meshtoon_frag:mh,points_vert:gh,points_frag:vh,shadow_vert:_h,shadow_frag:xh,sprite_vert:Sh,sprite_frag:Mh},ae={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Le}},envmap:{envMap:{value:null},envMapRotation:{value:new Le},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Le}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Le}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Le},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Le},normalScale:{value:new Ke(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Le},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Le}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Le}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Le}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0},uvTransform:{value:new Le}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new Ke(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Le},alphaMap:{value:null},alphaMapTransform:{value:new Le},alphaTest:{value:0}}},Vt={basic:{uniforms:vt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Ue.meshbasic_vert,fragmentShader:Ue.meshbasic_frag},lambert:{uniforms:vt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ue.meshlambert_vert,fragmentShader:Ue.meshlambert_frag},phong:{uniforms:vt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30}}]),vertexShader:Ue.meshphong_vert,fragmentShader:Ue.meshphong_frag},standard:{uniforms:vt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag},toon:{uniforms:vt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)}}]),vertexShader:Ue.meshtoon_vert,fragmentShader:Ue.meshtoon_frag},matcap:{uniforms:vt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Ue.meshmatcap_vert,fragmentShader:Ue.meshmatcap_frag},points:{uniforms:vt([ae.points,ae.fog]),vertexShader:Ue.points_vert,fragmentShader:Ue.points_frag},dashed:{uniforms:vt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ue.linedashed_vert,fragmentShader:Ue.linedashed_frag},depth:{uniforms:vt([ae.common,ae.displacementmap]),vertexShader:Ue.depth_vert,fragmentShader:Ue.depth_frag},normal:{uniforms:vt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Ue.meshnormal_vert,fragmentShader:Ue.meshnormal_frag},sprite:{uniforms:vt([ae.sprite,ae.fog]),vertexShader:Ue.sprite_vert,fragmentShader:Ue.sprite_frag},background:{uniforms:{uvTransform:{value:new Le},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ue.background_vert,fragmentShader:Ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Le}},vertexShader:Ue.backgroundCube_vert,fragmentShader:Ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ue.cube_vert,fragmentShader:Ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ue.equirect_vert,fragmentShader:Ue.equirect_frag},distanceRGBA:{uniforms:vt([ae.common,ae.displacementmap,{referencePosition:{value:new k},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ue.distanceRGBA_vert,fragmentShader:Ue.distanceRGBA_frag},shadow:{uniforms:vt([ae.lights,ae.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:Ue.shadow_vert,fragmentShader:Ue.shadow_frag}};Vt.physical={uniforms:vt([Vt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Le},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Le},clearcoatNormalScale:{value:new Ke(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Le},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Le},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Le},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Le},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Le},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Le},transmissionSamplerSize:{value:new Ke},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Le},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Le},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Le},anisotropyVector:{value:new Ke},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Le}}]),vertexShader:Ue.meshphysical_vert,fragmentShader:Ue.meshphysical_frag};const Wi={r:0,b:0,g:0},Mn=new rn,yh=new ot;function Eh(s,e,t,i,r,n,o){const a=new Qe(0);let c=n===!0?0:1,f,u,d=null,h=0,l=null;function m(w){let T=w.isScene===!0?w.background:null;return T&&T.isTexture&&(T=(w.backgroundBlurriness>0?t:e).get(T)),T}function g(w){let T=!1;const x=m(w);x===null?v(a,c):x&&x.isColor&&(v(x,1),T=!0);const y=s.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,o):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(s.autoClear||T)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(w,T){const x=m(T);x&&(x.isCubeTexture||x.mapping===rr)?(u===void 0&&(u=new zt(new yi(1,1,1),new Wt({name:"BackgroundCubeMaterial",uniforms:ni(Vt.backgroundCube.uniforms),vertexShader:Vt.backgroundCube.vertexShader,fragmentShader:Vt.backgroundCube.fragmentShader,side:Mt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(y,E,M){this.matrixWorld.copyPosition(M.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Mn.copy(T.backgroundRotation),Mn.x*=-1,Mn.y*=-1,Mn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Mn.y*=-1,Mn.z*=-1),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(yh.makeRotationFromEuler(Mn)),u.material.toneMapped=Ye.getTransfer(x.colorSpace)!==Je,(d!==x||h!==x.version||l!==s.toneMapping)&&(u.material.needsUpdate=!0,d=x,h=x.version,l=s.toneMapping),u.layers.enableAll(),w.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(f===void 0&&(f=new zt(new ri(2,2),new Wt({name:"BackgroundMaterial",uniforms:ni(Vt.background.uniforms),vertexShader:Vt.background.vertexShader,fragmentShader:Vt.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),f.geometry.deleteAttribute("normal"),Object.defineProperty(f.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(f)),f.material.uniforms.t2D.value=x,f.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,f.material.toneMapped=Ye.getTransfer(x.colorSpace)!==Je,x.matrixAutoUpdate===!0&&x.updateMatrix(),f.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||h!==x.version||l!==s.toneMapping)&&(f.material.needsUpdate=!0,d=x,h=x.version,l=s.toneMapping),f.layers.enableAll(),w.unshift(f,f.geometry,f.material,0,0,null))}function v(w,T){w.getRGB(Wi,So(s)),i.buffers.color.setClear(Wi.r,Wi.g,Wi.b,T,o)}function A(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),f!==void 0&&(f.geometry.dispose(),f.material.dispose(),f=void 0)}return{getClearColor:function(){return a},setClearColor:function(w,T=1){a.set(w),c=T,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,v(a,c)},render:g,addToRenderList:p,dispose:A}}function Th(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},r=h(null);let n=r,o=!1;function a(_,b,C,D,U){let I=!1;const O=d(D,C,b);n!==O&&(n=O,f(n.object)),I=l(_,D,C,U),I&&m(_,D,C,U),U!==null&&e.update(U,s.ELEMENT_ARRAY_BUFFER),(I||o)&&(o=!1,T(_,b,C,D),U!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function c(){return s.createVertexArray()}function f(_){return s.bindVertexArray(_)}function u(_){return s.deleteVertexArray(_)}function d(_,b,C){const D=C.wireframe===!0;let U=i[_.id];U===void 0&&(U={},i[_.id]=U);let I=U[b.id];I===void 0&&(I={},U[b.id]=I);let O=I[D];return O===void 0&&(O=h(c()),I[D]=O),O}function h(_){const b=[],C=[],D=[];for(let U=0;U<t;U++)b[U]=0,C[U]=0,D[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:b,enabledAttributes:C,attributeDivisors:D,object:_,attributes:{},index:null}}function l(_,b,C,D){const U=n.attributes,I=b.attributes;let O=0;const B=C.getAttributes();for(const F in B)if(B[F].location>=0){const j=U[F];let re=I[F];if(re===void 0&&(F==="instanceMatrix"&&_.instanceMatrix&&(re=_.instanceMatrix),F==="instanceColor"&&_.instanceColor&&(re=_.instanceColor)),j===void 0||j.attribute!==re||re&&j.data!==re.data)return!0;O++}return n.attributesNum!==O||n.index!==D}function m(_,b,C,D){const U={},I=b.attributes;let O=0;const B=C.getAttributes();for(const F in B)if(B[F].location>=0){let j=I[F];j===void 0&&(F==="instanceMatrix"&&_.instanceMatrix&&(j=_.instanceMatrix),F==="instanceColor"&&_.instanceColor&&(j=_.instanceColor));const re={};re.attribute=j,j&&j.data&&(re.data=j.data),U[F]=re,O++}n.attributes=U,n.attributesNum=O,n.index=D}function g(){const _=n.newAttributes;for(let b=0,C=_.length;b<C;b++)_[b]=0}function p(_){v(_,0)}function v(_,b){const C=n.newAttributes,D=n.enabledAttributes,U=n.attributeDivisors;C[_]=1,D[_]===0&&(s.enableVertexAttribArray(_),D[_]=1),U[_]!==b&&(s.vertexAttribDivisor(_,b),U[_]=b)}function A(){const _=n.newAttributes,b=n.enabledAttributes;for(let C=0,D=b.length;C<D;C++)b[C]!==_[C]&&(s.disableVertexAttribArray(C),b[C]=0)}function w(_,b,C,D,U,I,O){O===!0?s.vertexAttribIPointer(_,b,C,U,I):s.vertexAttribPointer(_,b,C,D,U,I)}function T(_,b,C,D){g();const U=D.attributes,I=C.getAttributes(),O=b.defaultAttributeValues;for(const B in I){const F=I[B];if(F.location>=0){let Z=U[B];if(Z===void 0&&(B==="instanceMatrix"&&_.instanceMatrix&&(Z=_.instanceMatrix),B==="instanceColor"&&_.instanceColor&&(Z=_.instanceColor)),Z!==void 0){const j=Z.normalized,re=Z.itemSize,_e=e.get(Z);if(_e===void 0)continue;const Ce=_e.buffer,Y=_e.type,te=_e.bytesPerElement,ee=Y===s.INT||Y===s.UNSIGNED_INT||Z.gpuType===Ds;if(Z.isInterleavedBufferAttribute){const se=Z.data,he=se.stride,Oe=Z.offset;if(se.isInstancedInterleavedBuffer){for(let xe=0;xe<F.locationSize;xe++)v(F.location+xe,se.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let xe=0;xe<F.locationSize;xe++)p(F.location+xe);s.bindBuffer(s.ARRAY_BUFFER,Ce);for(let xe=0;xe<F.locationSize;xe++)w(F.location+xe,re/F.locationSize,Y,j,he*te,(Oe+re/F.locationSize*xe)*te,ee)}else{if(Z.isInstancedBufferAttribute){for(let se=0;se<F.locationSize;se++)v(F.location+se,Z.meshPerAttribute);_.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let se=0;se<F.locationSize;se++)p(F.location+se);s.bindBuffer(s.ARRAY_BUFFER,Ce);for(let se=0;se<F.locationSize;se++)w(F.location+se,re/F.locationSize,Y,j,re*te,re/F.locationSize*se*te,ee)}}else if(O!==void 0){const j=O[B];if(j!==void 0)switch(j.length){case 2:s.vertexAttrib2fv(F.location,j);break;case 3:s.vertexAttrib3fv(F.location,j);break;case 4:s.vertexAttrib4fv(F.location,j);break;default:s.vertexAttrib1fv(F.location,j)}}}}A()}function x(){M();for(const _ in i){const b=i[_];for(const C in b){const D=b[C];for(const U in D)u(D[U].object),delete D[U];delete b[C]}delete i[_]}}function y(_){if(i[_.id]===void 0)return;const b=i[_.id];for(const C in b){const D=b[C];for(const U in D)u(D[U].object),delete D[U];delete b[C]}delete i[_.id]}function E(_){for(const b in i){const C=i[b];if(C[_.id]===void 0)continue;const D=C[_.id];for(const U in D)u(D[U].object),delete D[U];delete C[_.id]}}function M(){S(),o=!0,n!==r&&(n=r,f(n.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:M,resetDefaultState:S,dispose:x,releaseStatesOfGeometry:y,releaseStatesOfProgram:E,initAttributes:g,enableAttribute:p,disableUnusedAttributes:A}}function Ah(s,e,t){let i;function r(f){i=f}function n(f,u){s.drawArrays(i,f,u),t.update(u,i,1)}function o(f,u,d){d!==0&&(s.drawArraysInstanced(i,f,u,d),t.update(u,i,d))}function a(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,f,0,u,0,d);let l=0;for(let m=0;m<d;m++)l+=u[m];t.update(l,i,1)}function c(f,u,d,h){if(d===0)return;const l=e.get("WEBGL_multi_draw");if(l===null)for(let m=0;m<f.length;m++)o(f[m],u[m],h[m]);else{l.multiDrawArraysInstancedWEBGL(i,f,0,u,0,h,0,d);let m=0;for(let g=0;g<d;g++)m+=u[g]*h[g];t.update(m,i,1)}}this.setMode=r,this.render=n,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function wh(s,e,t,i){let r;function n(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");r=s.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(E){return!(E!==Bt&&i.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const M=E===_i&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==nn&&i.convert(E)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==Qt&&!M)}function c(E){if(E==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let f=t.precision!==void 0?t.precision:"highp";const u=c(f);u!==f&&(console.warn("THREE.WebGLRenderer:",f,"not supported, using",u,"instead."),f=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),l=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),v=s.getParameter(s.MAX_VERTEX_ATTRIBS),A=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),T=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),x=m>0,y=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:f,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:l,maxVertexTextures:m,maxTextureSize:g,maxCubemapSize:p,maxAttributes:v,maxVertexUniforms:A,maxVaryings:w,maxFragmentUniforms:T,vertexTextures:x,maxSamples:y}}function bh(s){const e=this;let t=null,i=0,r=!1,n=!1;const o=new En,a=new Le,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const l=d.length!==0||h||i!==0||r;return r=h,i=d.length,l},this.beginShadows=function(){n=!0,u(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,l){const m=d.clippingPlanes,g=d.clipIntersection,p=d.clipShadows,v=s.get(d);if(!r||m===null||m.length===0||n&&!p)n?u(null):f();else{const A=n?0:i,w=A*4;let T=v.clippingState||null;c.value=T,T=u(m,h,w,l);for(let x=0;x!==w;++x)T[x]=t[x];v.clippingState=T,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=A}};function f(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,l,m){const g=d!==null?d.length:0;let p=null;if(g!==0){if(p=c.value,m!==!0||p===null){const v=l+g*4,A=h.matrixWorldInverse;a.getNormalMatrix(A),(p===null||p.length<v)&&(p=new Float32Array(v));for(let w=0,T=l;w!==g;++w,T+=4)o.copy(d[w]).applyMatrix4(A,a),o.normal.toArray(p,T),p[T+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,p}}function Ch(s){let e=new WeakMap;function t(o,a){return a===Kr?o.mapping=Qn:a===jr&&(o.mapping=ei),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Kr||a===jr)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const f=new Cc(c.height);return f.fromEquirectangularTexture(s,o),e.set(o,f),o.addEventListener("dispose",r),t(f.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function n(){e=new WeakMap}return{get:i,dispose:n}}const $n=4,Ra=[.125,.215,.35,.446,.526,.582],wn=20,Ir=new wo,Pa=new Qe;let Ur=null,Nr=0,Fr=0,Or=!1;const Tn=(1+Math.sqrt(5))/2,Yn=1/Tn,Da=[new k(-Tn,Yn,0),new k(Tn,Yn,0),new k(-Yn,0,Tn),new k(Yn,0,Tn),new k(0,Tn,-Yn),new k(0,Tn,Yn),new k(-1,1,-1),new k(1,1,-1),new k(-1,1,1),new k(1,1,1)],Rh=new k;class La{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,n={}){const{size:o=256,position:a=Rh}=n;Ur=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,i,r,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Na(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ua(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ur,Nr,Fr),this._renderer.xr.enabled=Or,e.scissorTest=!1,Xi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qn||e.mapping===ei?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ur=this._renderer.getRenderTarget(),Nr=this._renderer.getActiveCubeFace(),Fr=this._renderer.getActiveMipmapLevel(),Or=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Gt,minFilter:Gt,generateMipmaps:!1,type:_i,format:Bt,colorSpace:ti,depthBuffer:!1},r=Ia(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ia(e,t,i);const{_lodMax:n}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ph(n)),this._blurMaterial=Dh(n,e,t)}return r}_compileMaterial(e){const t=new zt(this._lodPlanes[0],e);this._renderer.compile(t,Ir)}_sceneToCubeUV(e,t,i,r,n){const c=new Pt(90,1,t,i),f=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,l=d.toneMapping;d.getClearColor(Pa),d.toneMapping=dn,d.autoClear=!1;const m=new vo({name:"PMREM.Background",side:Mt,depthWrite:!1,depthTest:!1}),g=new zt(new yi,m);let p=!1;const v=e.background;v?v.isColor&&(m.color.copy(v),e.background=null,p=!0):(m.color.copy(Pa),p=!0);for(let A=0;A<6;A++){const w=A%3;w===0?(c.up.set(0,f[A],0),c.position.set(n.x,n.y,n.z),c.lookAt(n.x+u[A],n.y,n.z)):w===1?(c.up.set(0,0,f[A]),c.position.set(n.x,n.y,n.z),c.lookAt(n.x,n.y+u[A],n.z)):(c.up.set(0,f[A],0),c.position.set(n.x,n.y,n.z),c.lookAt(n.x,n.y,n.z+u[A]));const T=this._cubeSize;Xi(r,w*T,A>2?T:0,T,T),d.setRenderTarget(r),p&&d.render(g,c),d.render(e,c)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=l,d.autoClear=h,e.background=v}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Qn||e.mapping===ei;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Na()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ua());const n=r?this._cubemapMaterial:this._equirectMaterial,o=new zt(this._lodPlanes[0],n),a=n.uniforms;a.envMap.value=e;const c=this._cubeSize;Xi(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,Ir)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let n=1;n<r;n++){const o=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),a=Da[(r-n-1)%Da.length];this._blur(e,n-1,n,o,a)}t.autoClear=i}_blur(e,t,i,r,n){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",n),this._halfBlur(o,e,i,i,r,"longitudinal",n)}_halfBlur(e,t,i,r,n,o,a){const c=this._renderer,f=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new zt(this._lodPlanes[r],f),h=f.uniforms,l=this._sizeLods[i]-1,m=isFinite(n)?Math.PI/(2*l):2*Math.PI/(2*wn-1),g=n/m,p=isFinite(n)?1+Math.floor(u*g):wn;p>wn&&console.warn(`sigmaRadians, ${n}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${wn}`);const v=[];let A=0;for(let E=0;E<wn;++E){const M=E/g,S=Math.exp(-M*M/2);v.push(S),E===0?A+=S:E<p&&(A+=2*S)}for(let E=0;E<v.length;E++)v[E]=v[E]/A;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=v,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:w}=this;h.dTheta.value=m,h.mipInt.value=w-i;const T=this._sizeLods[r],x=3*T*(r>w-$n?r-w+$n:0),y=4*(this._cubeSize-T);Xi(t,x,y,3*T,2*T),c.setRenderTarget(t),c.render(d,Ir)}}function Ph(s){const e=[],t=[],i=[];let r=s;const n=s-$n+1+Ra.length;for(let o=0;o<n;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>s-$n?c=Ra[o-s+$n-1]:o===0&&(c=0),i.push(c);const f=1/(a-2),u=-f,d=1+f,h=[u,u,d,u,d,d,u,u,d,d,u,d],l=6,m=6,g=3,p=2,v=1,A=new Float32Array(g*m*l),w=new Float32Array(p*m*l),T=new Float32Array(v*m*l);for(let y=0;y<l;y++){const E=y%3*2/3-1,M=y>2?0:-1,S=[E,M,0,E+2/3,M,0,E+2/3,M+1,0,E,M,0,E+2/3,M+1,0,E,M+1,0];A.set(S,g*m*y),w.set(h,p*m*y);const _=[y,y,y,y,y,y];T.set(_,v*m*y)}const x=new Ln;x.setAttribute("position",new kt(A,g)),x.setAttribute("uv",new kt(w,p)),x.setAttribute("faceIndex",new kt(T,v)),e.push(x),r>$n&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Ia(s,e,t){const i=new Dn(s,e,t);return i.texture.mapping=rr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xi(s,e,t,i,r){s.viewport.set(e,t,i,r),s.scissor.set(e,t,i,r)}function Dh(s,e,t){const i=new Float32Array(wn),r=new k(0,1,0);return new Wt({name:"SphericalGaussianBlur",defines:{n:wn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Hs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Ua(){return new Wt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Hs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Na(){return new Wt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Hs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hn,depthTest:!1,depthWrite:!1})}function Hs(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Lh(s){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const c=a.mapping,f=c===Kr||c===jr,u=c===Qn||c===ei;if(f||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new La(s)),d=f?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const l=a.image;return f&&l&&l.height>0||u&&l&&r(l)?(t===null&&(t=new La(s)),d=f?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",n),d.texture):null}}}return a}function r(a){let c=0;const f=6;for(let u=0;u<f;u++)a[u]!==void 0&&c++;return c===f}function n(a){const c=a.target;c.removeEventListener("dispose",n);const f=e.get(c);f!==void 0&&(e.delete(c),f.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Ih(s){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=s.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Qi("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Uh(s,e,t,i){const r={},n=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const m in h.attributes)e.remove(h.attributes[m]);h.removeEventListener("dispose",o),delete r[h.id];const l=n.get(h);l&&(e.remove(l),n.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function c(d){const h=d.attributes;for(const l in h)e.update(h[l],s.ARRAY_BUFFER)}function f(d){const h=[],l=d.index,m=d.attributes.position;let g=0;if(l!==null){const A=l.array;g=l.version;for(let w=0,T=A.length;w<T;w+=3){const x=A[w+0],y=A[w+1],E=A[w+2];h.push(x,y,y,E,E,x)}}else if(m!==void 0){const A=m.array;g=m.version;for(let w=0,T=A.length/3-1;w<T;w+=3){const x=w+0,y=w+1,E=w+2;h.push(x,y,y,E,E,x)}}else return;const p=new(ho(h)?xo:_o)(h,1);p.version=g;const v=n.get(d);v&&e.remove(v),n.set(d,p)}function u(d){const h=n.get(d);if(h){const l=d.index;l!==null&&h.version<l.version&&f(d)}else f(d);return n.get(d)}return{get:a,update:c,getWireframeAttribute:u}}function Nh(s,e,t){let i;function r(h){i=h}let n,o;function a(h){n=h.type,o=h.bytesPerElement}function c(h,l){s.drawElements(i,l,n,h*o),t.update(l,i,1)}function f(h,l,m){m!==0&&(s.drawElementsInstanced(i,l,n,h*o,m),t.update(l,i,m))}function u(h,l,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,l,0,n,h,0,m);let p=0;for(let v=0;v<m;v++)p+=l[v];t.update(p,i,1)}function d(h,l,m,g){if(m===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<h.length;v++)f(h[v]/o,l[v],g[v]);else{p.multiDrawElementsInstancedWEBGL(i,l,0,n,h,0,g,0,m);let v=0;for(let A=0;A<m;A++)v+=l[A]*g[A];t.update(v,i,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=f,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Fh(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(n/3);break;case s.LINES:t.lines+=a*(n/2);break;case s.LINE_STRIP:t.lines+=a*(n-1);break;case s.LINE_LOOP:t.lines+=a*n;break;case s.POINTS:t.points+=a*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Oh(s,e,t){const i=new WeakMap,r=new rt;function n(o,a,c){const f=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=i.get(a);if(h===void 0||h.count!==d){let _=function(){M.dispose(),i.delete(a),a.removeEventListener("dispose",_)};var l=_;h!==void 0&&h.texture.dispose();const m=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,v=a.morphAttributes.position||[],A=a.morphAttributes.normal||[],w=a.morphAttributes.color||[];let T=0;m===!0&&(T=1),g===!0&&(T=2),p===!0&&(T=3);let x=a.attributes.position.count*T,y=1;x>e.maxTextureSize&&(y=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const E=new Float32Array(x*y*4*d),M=new po(E,x,y,d);M.type=Qt,M.needsUpdate=!0;const S=T*4;for(let b=0;b<d;b++){const C=v[b],D=A[b],U=w[b],I=x*y*4*b;for(let O=0;O<C.count;O++){const B=O*S;m===!0&&(r.fromBufferAttribute(C,O),E[I+B+0]=r.x,E[I+B+1]=r.y,E[I+B+2]=r.z,E[I+B+3]=0),g===!0&&(r.fromBufferAttribute(D,O),E[I+B+4]=r.x,E[I+B+5]=r.y,E[I+B+6]=r.z,E[I+B+7]=0),p===!0&&(r.fromBufferAttribute(U,O),E[I+B+8]=r.x,E[I+B+9]=r.y,E[I+B+10]=r.z,E[I+B+11]=U.itemSize===4?r.w:1)}}h={count:d,texture:M,size:new Ke(x,y)},i.set(a,h),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let m=0;for(let p=0;p<f.length;p++)m+=f[p];const g=a.morphTargetsRelative?1:1-m;c.getUniforms().setValue(s,"morphTargetBaseInfluence",g),c.getUniforms().setValue(s,"morphTargetInfluences",f)}c.getUniforms().setValue(s,"morphTargetsTexture",h.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:n}}function Bh(s,e,t,i){let r=new WeakMap;function n(c){const f=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==f&&(e.update(d),r.set(d,f)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==f&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,f))),c.isSkinnedMesh){const h=c.skeleton;r.get(h)!==f&&(h.update(),r.set(h,f))}return d}function o(){r=new WeakMap}function a(c){const f=c.target;f.removeEventListener("dispose",a),t.remove(f.instanceMatrix),f.instanceColor!==null&&t.remove(f.instanceColor)}return{update:n,dispose:o}}const Co=new mt,Fa=new Ao(1,1),Ro=new po,Po=new uc,Do=new yo,Oa=[],Ba=[],za=new Float32Array(16),Ha=new Float32Array(9),Va=new Float32Array(4);function si(s,e,t){const i=s[0];if(i<=0||i>0)return s;const r=e*t;let n=Oa[r];if(n===void 0&&(n=new Float32Array(r),Oa[r]=n),e!==0){i.toArray(n,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(n,a)}return n}function lt(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function ct(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function ar(s,e){let t=Ba[e];t===void 0&&(t=new Int32Array(e),Ba[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function zh(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function Hh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;s.uniform2fv(this.addr,e),ct(t,e)}}function Vh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(lt(t,e))return;s.uniform3fv(this.addr,e),ct(t,e)}}function Gh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;s.uniform4fv(this.addr,e),ct(t,e)}}function kh(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(lt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,i))return;Va.set(i),s.uniformMatrix2fv(this.addr,!1,Va),ct(t,i)}}function Wh(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(lt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,i))return;Ha.set(i),s.uniformMatrix3fv(this.addr,!1,Ha),ct(t,i)}}function Xh(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(lt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),ct(t,e)}else{if(lt(t,i))return;za.set(i),s.uniformMatrix4fv(this.addr,!1,za),ct(t,i)}}function qh(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Yh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;s.uniform2iv(this.addr,e),ct(t,e)}}function $h(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;s.uniform3iv(this.addr,e),ct(t,e)}}function Zh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;s.uniform4iv(this.addr,e),ct(t,e)}}function Kh(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function jh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(lt(t,e))return;s.uniform2uiv(this.addr,e),ct(t,e)}}function Jh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(lt(t,e))return;s.uniform3uiv(this.addr,e),ct(t,e)}}function Qh(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(lt(t,e))return;s.uniform4uiv(this.addr,e),ct(t,e)}}function ed(s,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(s.uniform1i(this.addr,r),i[0]=r);let n;this.type===s.SAMPLER_2D_SHADOW?(Fa.compareFunction=fo,n=Fa):n=Co,t.setTexture2D(e||n,r)}function td(s,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(s.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Po,r)}function nd(s,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(s.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Do,r)}function id(s,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(s.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Ro,r)}function rd(s){switch(s){case 5126:return zh;case 35664:return Hh;case 35665:return Vh;case 35666:return Gh;case 35674:return kh;case 35675:return Wh;case 35676:return Xh;case 5124:case 35670:return qh;case 35667:case 35671:return Yh;case 35668:case 35672:return $h;case 35669:case 35673:return Zh;case 5125:return Kh;case 36294:return jh;case 36295:return Jh;case 36296:return Qh;case 35678:case 36198:case 36298:case 36306:case 35682:return ed;case 35679:case 36299:case 36307:return td;case 35680:case 36300:case 36308:case 36293:return nd;case 36289:case 36303:case 36311:case 36292:return id}}function sd(s,e){s.uniform1fv(this.addr,e)}function ad(s,e){const t=si(e,this.size,2);s.uniform2fv(this.addr,t)}function od(s,e){const t=si(e,this.size,3);s.uniform3fv(this.addr,t)}function ld(s,e){const t=si(e,this.size,4);s.uniform4fv(this.addr,t)}function cd(s,e){const t=si(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function ud(s,e){const t=si(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function fd(s,e){const t=si(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function hd(s,e){s.uniform1iv(this.addr,e)}function dd(s,e){s.uniform2iv(this.addr,e)}function pd(s,e){s.uniform3iv(this.addr,e)}function md(s,e){s.uniform4iv(this.addr,e)}function gd(s,e){s.uniform1uiv(this.addr,e)}function vd(s,e){s.uniform2uiv(this.addr,e)}function _d(s,e){s.uniform3uiv(this.addr,e)}function xd(s,e){s.uniform4uiv(this.addr,e)}function Sd(s,e,t){const i=this.cache,r=e.length,n=ar(t,r);lt(i,n)||(s.uniform1iv(this.addr,n),ct(i,n));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Co,n[o])}function Md(s,e,t){const i=this.cache,r=e.length,n=ar(t,r);lt(i,n)||(s.uniform1iv(this.addr,n),ct(i,n));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Po,n[o])}function yd(s,e,t){const i=this.cache,r=e.length,n=ar(t,r);lt(i,n)||(s.uniform1iv(this.addr,n),ct(i,n));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Do,n[o])}function Ed(s,e,t){const i=this.cache,r=e.length,n=ar(t,r);lt(i,n)||(s.uniform1iv(this.addr,n),ct(i,n));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Ro,n[o])}function Td(s){switch(s){case 5126:return sd;case 35664:return ad;case 35665:return od;case 35666:return ld;case 35674:return cd;case 35675:return ud;case 35676:return fd;case 5124:case 35670:return hd;case 35667:case 35671:return dd;case 35668:case 35672:return pd;case 35669:case 35673:return md;case 5125:return gd;case 36294:return vd;case 36295:return _d;case 36296:return xd;case 35678:case 36198:case 36298:case 36306:case 35682:return Sd;case 35679:case 36299:case 36307:return Md;case 35680:case 36300:case 36308:case 36293:return yd;case 36289:case 36303:case 36311:case 36292:return Ed}}class Ad{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=rd(t.type)}}class wd{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Td(t.type)}}class bd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let n=0,o=r.length;n!==o;++n){const a=r[n];a.setValue(e,t[a.id],i)}}}const Br=/(\w+)(\])?(\[|\.)?/g;function Ga(s,e){s.seq.push(e),s.map[e.id]=e}function Cd(s,e,t){const i=s.name,r=i.length;for(Br.lastIndex=0;;){const n=Br.exec(i),o=Br.lastIndex;let a=n[1];const c=n[2]==="]",f=n[3];if(c&&(a=a|0),f===void 0||f==="["&&o+2===r){Ga(t,f===void 0?new Ad(a,s,e):new wd(a,s,e));break}else{let d=t.map[a];d===void 0&&(d=new bd(a),Ga(t,d)),t=d}}}class er{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const n=e.getActiveUniform(t,r),o=e.getUniformLocation(t,n.name);Cd(n,o,this)}}setValue(e,t,i,r){const n=this.map[t];n!==void 0&&n.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let n=0,o=t.length;n!==o;++n){const a=t[n],c=i[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,n=e.length;r!==n;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function ka(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const Rd=37297;let Pd=0;function Dd(s,e){const t=s.split(`
`),i=[],r=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let o=r;o<n;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Wa=new Le;function Ld(s){Ye._getMatrix(Wa,Ye.workingColorSpace,s);const e=`mat3( ${Wa.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(s)){case nr:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Xa(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),r=s.getShaderInfoLog(e).trim();if(i&&r==="")return"";const n=/ERROR: 0:(\d+)/.exec(r);if(n){const o=parseInt(n[1]);return t.toUpperCase()+`

`+r+`

`+Dd(s.getShaderSource(e),o)}else return r}function Id(s,e){const t=Ld(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Ud(s,e){let t;switch(e){case Nl:t="Linear";break;case Fl:t="Reinhard";break;case Ol:t="Cineon";break;case Bl:t="ACESFilmic";break;case Hl:t="AgX";break;case Vl:t="Neutral";break;case zl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qi=new k;function Nd(){Ye.getLuminanceCoefficients(qi);const s=qi.x.toFixed(4),e=qi.y.toFixed(4),t=qi.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Fd(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hi).join(`
`)}function Od(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Bd(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const n=s.getActiveAttrib(e,r),o=n.name;let a=1;n.type===s.FLOAT_MAT2&&(a=2),n.type===s.FLOAT_MAT3&&(a=3),n.type===s.FLOAT_MAT4&&(a=4),t[o]={type:n.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function hi(s){return s!==""}function qa(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ya(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const zd=/^[ \t]*#include +<([\w\d./]+)>/gm;function bs(s){return s.replace(zd,Vd)}const Hd=new Map;function Vd(s,e){let t=Ue[e];if(t===void 0){const i=Hd.get(e);if(i!==void 0)t=Ue[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return bs(t)}const Gd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $a(s){return s.replace(Gd,kd)}function kd(s,e,t,i){let r="";for(let n=parseInt(e);n<parseInt(t);n++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return r}function Za(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Wd(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===eo?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===pl?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===jt&&(e="SHADOWMAP_TYPE_VSM"),e}function Xd(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Qn:case ei:e="ENVMAP_TYPE_CUBE";break;case rr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function qd(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ei:e="ENVMAP_MODE_REFRACTION";break}return e}function Yd(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case to:e="ENVMAP_BLENDING_MULTIPLY";break;case Il:e="ENVMAP_BLENDING_MIX";break;case Ul:e="ENVMAP_BLENDING_ADD";break}return e}function $d(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Zd(s,e,t,i){const r=s.getContext(),n=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=Wd(t),f=Xd(t),u=qd(t),d=Yd(t),h=$d(t),l=Fd(t),m=Od(n),g=r.createProgram();let p,v,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(hi).join(`
`),p.length>0&&(p+=`
`),v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(hi).join(`
`),v.length>0&&(v+=`
`)):(p=[Za(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hi).join(`
`),v=[Za(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dn?"#define TONE_MAPPING":"",t.toneMapping!==dn?Ue.tonemapping_pars_fragment:"",t.toneMapping!==dn?Ud("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ue.colorspace_pars_fragment,Id("linearToOutputTexel",t.outputColorSpace),Nd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hi).join(`
`)),o=bs(o),o=qa(o,t),o=Ya(o,t),a=bs(a),a=qa(a,t),a=Ya(a,t),o=$a(o),a=$a(a),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,p=[l,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["#define varying in",t.glslVersion===oa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===oa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const w=A+p+o,T=A+v+a,x=ka(r,r.VERTEX_SHADER,w),y=ka(r,r.FRAGMENT_SHADER,T);r.attachShader(g,x),r.attachShader(g,y),t.index0AttributeName!==void 0?r.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function E(b){if(s.debug.checkShaderErrors){const C=r.getProgramInfoLog(g).trim(),D=r.getShaderInfoLog(x).trim(),U=r.getShaderInfoLog(y).trim();let I=!0,O=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(I=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(r,g,x,y);else{const B=Xa(r,x,"vertex"),F=Xa(r,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+b.name+`
Material Type: `+b.type+`

Program Info Log: `+C+`
`+B+`
`+F)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(D===""||U==="")&&(O=!1);O&&(b.diagnostics={runnable:I,programLog:C,vertexShader:{log:D,prefix:p},fragmentShader:{log:U,prefix:v}})}r.deleteShader(x),r.deleteShader(y),M=new er(r,g),S=Bd(r,g)}let M;this.getUniforms=function(){return M===void 0&&E(this),M};let S;this.getAttributes=function(){return S===void 0&&E(this),S};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=r.getProgramParameter(g,Rd)),_},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Pd++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=x,this.fragmentShader=y,this}let Kd=0;class jd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),n=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(n)===!1&&(o.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Jd(e),t.set(e,i)),i}}class Jd{constructor(e){this.id=Kd++,this.code=e,this.usedTimes=0}}function Qd(s,e,t,i,r,n,o){const a=new mo,c=new jd,f=new Set,u=[],d=r.logarithmicDepthBuffer,h=r.vertexTextures;let l=r.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return f.add(S),S===0?"uv":`uv${S}`}function p(S,_,b,C,D){const U=C.fog,I=D.geometry,O=S.isMeshStandardMaterial?C.environment:null,B=(S.isMeshStandardMaterial?t:e).get(S.envMap||O),F=B&&B.mapping===rr?B.image.height:null,Z=m[S.type];S.precision!==null&&(l=r.getMaxPrecision(S.precision),l!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",l,"instead."));const j=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,re=j!==void 0?j.length:0;let _e=0;I.morphAttributes.position!==void 0&&(_e=1),I.morphAttributes.normal!==void 0&&(_e=2),I.morphAttributes.color!==void 0&&(_e=3);let Ce,Y,te,ee;if(Z){const je=Vt[Z];Ce=je.vertexShader,Y=je.fragmentShader}else Ce=S.vertexShader,Y=S.fragmentShader,c.update(S),te=c.getVertexShaderID(S),ee=c.getFragmentShaderID(S);const se=s.getRenderTarget(),he=s.state.buffers.depth.getReversed(),Oe=D.isInstancedMesh===!0,xe=D.isBatchedMesh===!0,Xe=!!S.map,Ne=!!S.matcap,ze=!!B,N=!!S.aoMap,_t=!!S.lightMap,He=!!S.bumpMap,Be=!!S.normalMap,Se=!!S.displacementMap,Ve=!!S.emissiveMap,Me=!!S.metalnessMap,L=!!S.roughnessMap,R=S.anisotropy>0,G=S.clearcoat>0,K=S.dispersion>0,Q=S.iridescence>0,$=S.sheen>0,ve=S.transmission>0,oe=R&&!!S.anisotropyMap,ye=G&&!!S.clearcoatMap,Ee=G&&!!S.clearcoatNormalMap,ne=G&&!!S.clearcoatRoughnessMap,pe=Q&&!!S.iridescenceMap,we=Q&&!!S.iridescenceThicknessMap,Re=$&&!!S.sheenColorMap,me=$&&!!S.sheenRoughnessMap,ke=!!S.specularMap,Ie=!!S.specularColorMap,et=!!S.specularIntensityMap,z=ve&&!!S.transmissionMap,ce=ve&&!!S.thicknessMap,q=!!S.gradientMap,J=!!S.alphaMap,fe=S.alphaTest>0,ue=!!S.alphaHash,De=!!S.extensions;let nt=dn;S.toneMapped&&(se===null||se.isXRRenderTarget===!0)&&(nt=s.toneMapping);const ht={shaderID:Z,shaderType:S.type,shaderName:S.name,vertexShader:Ce,fragmentShader:Y,defines:S.defines,customVertexShaderID:te,customFragmentShaderID:ee,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:l,batching:xe,batchingColor:xe&&D._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&D.instanceColor!==null,instancingMorph:Oe&&D.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:se===null?s.outputColorSpace:se.isXRRenderTarget===!0?se.texture.colorSpace:ti,alphaToCoverage:!!S.alphaToCoverage,map:Xe,matcap:Ne,envMap:ze,envMapMode:ze&&B.mapping,envMapCubeUVHeight:F,aoMap:N,lightMap:_t,bumpMap:He,normalMap:Be,displacementMap:h&&Se,emissiveMap:Ve,normalMapObjectSpace:Be&&S.normalMapType===ql,normalMapTangentSpace:Be&&S.normalMapType===Xl,metalnessMap:Me,roughnessMap:L,anisotropy:R,anisotropyMap:oe,clearcoat:G,clearcoatMap:ye,clearcoatNormalMap:Ee,clearcoatRoughnessMap:ne,dispersion:K,iridescence:Q,iridescenceMap:pe,iridescenceThicknessMap:we,sheen:$,sheenColorMap:Re,sheenRoughnessMap:me,specularMap:ke,specularColorMap:Ie,specularIntensityMap:et,transmission:ve,transmissionMap:z,thicknessMap:ce,gradientMap:q,opaque:S.transparent===!1&&S.blending===Kn&&S.alphaToCoverage===!1,alphaMap:J,alphaTest:fe,alphaHash:ue,combine:S.combine,mapUv:Xe&&g(S.map.channel),aoMapUv:N&&g(S.aoMap.channel),lightMapUv:_t&&g(S.lightMap.channel),bumpMapUv:He&&g(S.bumpMap.channel),normalMapUv:Be&&g(S.normalMap.channel),displacementMapUv:Se&&g(S.displacementMap.channel),emissiveMapUv:Ve&&g(S.emissiveMap.channel),metalnessMapUv:Me&&g(S.metalnessMap.channel),roughnessMapUv:L&&g(S.roughnessMap.channel),anisotropyMapUv:oe&&g(S.anisotropyMap.channel),clearcoatMapUv:ye&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Ee&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:we&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Re&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:me&&g(S.sheenRoughnessMap.channel),specularMapUv:ke&&g(S.specularMap.channel),specularColorMapUv:Ie&&g(S.specularColorMap.channel),specularIntensityMapUv:et&&g(S.specularIntensityMap.channel),transmissionMapUv:z&&g(S.transmissionMap.channel),thicknessMapUv:ce&&g(S.thicknessMap.channel),alphaMapUv:J&&g(S.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(Be||R),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!I.attributes.uv&&(Xe||J),fog:!!U,useFog:S.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:he,skinning:D.isSkinnedMesh===!0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:_e,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&b.length>0,shadowMapType:s.shadowMap.type,toneMapping:nt,decodeVideoTexture:Xe&&S.map.isVideoTexture===!0&&Ye.getTransfer(S.map.colorSpace)===Je,decodeVideoTextureEmissive:Ve&&S.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(S.emissiveMap.colorSpace)===Je,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Jt,flipSided:S.side===Mt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:De&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&S.extensions.multiDraw===!0||xe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ht.vertexUv1s=f.has(1),ht.vertexUv2s=f.has(2),ht.vertexUv3s=f.has(3),f.clear(),ht}function v(S){const _=[];if(S.shaderID?_.push(S.shaderID):(_.push(S.customVertexShaderID),_.push(S.customFragmentShaderID)),S.defines!==void 0)for(const b in S.defines)_.push(b),_.push(S.defines[b]);return S.isRawShaderMaterial===!1&&(A(_,S),w(_,S),_.push(s.outputColorSpace)),_.push(S.customProgramCacheKey),_.join()}function A(S,_){S.push(_.precision),S.push(_.outputColorSpace),S.push(_.envMapMode),S.push(_.envMapCubeUVHeight),S.push(_.mapUv),S.push(_.alphaMapUv),S.push(_.lightMapUv),S.push(_.aoMapUv),S.push(_.bumpMapUv),S.push(_.normalMapUv),S.push(_.displacementMapUv),S.push(_.emissiveMapUv),S.push(_.metalnessMapUv),S.push(_.roughnessMapUv),S.push(_.anisotropyMapUv),S.push(_.clearcoatMapUv),S.push(_.clearcoatNormalMapUv),S.push(_.clearcoatRoughnessMapUv),S.push(_.iridescenceMapUv),S.push(_.iridescenceThicknessMapUv),S.push(_.sheenColorMapUv),S.push(_.sheenRoughnessMapUv),S.push(_.specularMapUv),S.push(_.specularColorMapUv),S.push(_.specularIntensityMapUv),S.push(_.transmissionMapUv),S.push(_.thicknessMapUv),S.push(_.combine),S.push(_.fogExp2),S.push(_.sizeAttenuation),S.push(_.morphTargetsCount),S.push(_.morphAttributeCount),S.push(_.numDirLights),S.push(_.numPointLights),S.push(_.numSpotLights),S.push(_.numSpotLightMaps),S.push(_.numHemiLights),S.push(_.numRectAreaLights),S.push(_.numDirLightShadows),S.push(_.numPointLightShadows),S.push(_.numSpotLightShadows),S.push(_.numSpotLightShadowsWithMaps),S.push(_.numLightProbes),S.push(_.shadowMapType),S.push(_.toneMapping),S.push(_.numClippingPlanes),S.push(_.numClipIntersection),S.push(_.depthPacking)}function w(S,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.reverseDepthBuffer&&a.enable(4),_.skinning&&a.enable(5),_.morphTargets&&a.enable(6),_.morphNormals&&a.enable(7),_.morphColors&&a.enable(8),_.premultipliedAlpha&&a.enable(9),_.shadowMapEnabled&&a.enable(10),_.doubleSided&&a.enable(11),_.flipSided&&a.enable(12),_.useDepthPacking&&a.enable(13),_.dithering&&a.enable(14),_.transmission&&a.enable(15),_.sheen&&a.enable(16),_.opaque&&a.enable(17),_.pointsUvs&&a.enable(18),_.decodeVideoTexture&&a.enable(19),_.decodeVideoTextureEmissive&&a.enable(20),_.alphaToCoverage&&a.enable(21),S.push(a.mask)}function T(S){const _=m[S.type];let b;if(_){const C=Vt[_];b=Tc.clone(C.uniforms)}else b=S.uniforms;return b}function x(S,_){let b;for(let C=0,D=u.length;C<D;C++){const U=u[C];if(U.cacheKey===_){b=U,++b.usedTimes;break}}return b===void 0&&(b=new Zd(s,_,S,n),u.push(b)),b}function y(S){if(--S.usedTimes===0){const _=u.indexOf(S);u[_]=u[u.length-1],u.pop(),S.destroy()}}function E(S){c.remove(S)}function M(){c.dispose()}return{getParameters:p,getProgramCacheKey:v,getUniforms:T,acquireProgram:x,releaseProgram:y,releaseShaderCache:E,programs:u,dispose:M}}function ep(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function i(o){s.delete(o)}function r(o,a,c){s.get(o)[a]=c}function n(){s=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:n}}function tp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Ka(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function ja(){const s=[];let e=0;const t=[],i=[],r=[];function n(){e=0,t.length=0,i.length=0,r.length=0}function o(d,h,l,m,g,p){let v=s[e];return v===void 0?(v={id:d.id,object:d,geometry:h,material:l,groupOrder:m,renderOrder:d.renderOrder,z:g,group:p},s[e]=v):(v.id=d.id,v.object=d,v.geometry=h,v.material=l,v.groupOrder=m,v.renderOrder=d.renderOrder,v.z=g,v.group=p),e++,v}function a(d,h,l,m,g,p){const v=o(d,h,l,m,g,p);l.transmission>0?i.push(v):l.transparent===!0?r.push(v):t.push(v)}function c(d,h,l,m,g,p){const v=o(d,h,l,m,g,p);l.transmission>0?i.unshift(v):l.transparent===!0?r.unshift(v):t.unshift(v)}function f(d,h){t.length>1&&t.sort(d||tp),i.length>1&&i.sort(h||Ka),r.length>1&&r.sort(h||Ka)}function u(){for(let d=e,h=s.length;d<h;d++){const l=s[d];if(l.id===null)break;l.id=null,l.object=null,l.geometry=null,l.material=null,l.group=null}}return{opaque:t,transmissive:i,transparent:r,init:n,push:a,unshift:c,finish:u,sort:f}}function np(){let s=new WeakMap;function e(i,r){const n=s.get(i);let o;return n===void 0?(o=new ja,s.set(i,[o])):r>=n.length?(o=new ja,n.push(o)):o=n[r],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function ip(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new k,color:new Qe};break;case"SpotLight":t={position:new k,direction:new k,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new k,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new k,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new k,halfWidth:new k,halfHeight:new k};break}return s[e.id]=t,t}}}function rp(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ke,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let sp=0;function ap(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function op(s){const e=new ip,t=rp(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let f=0;f<9;f++)i.probe.push(new k);const r=new k,n=new ot,o=new ot;function a(f){let u=0,d=0,h=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let l=0,m=0,g=0,p=0,v=0,A=0,w=0,T=0,x=0,y=0,E=0;f.sort(ap);for(let S=0,_=f.length;S<_;S++){const b=f[S],C=b.color,D=b.intensity,U=b.distance,I=b.shadow&&b.shadow.map?b.shadow.map.texture:null;if(b.isAmbientLight)u+=C.r*D,d+=C.g*D,h+=C.b*D;else if(b.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(b.sh.coefficients[O],D);E++}else if(b.isDirectionalLight){const O=e.get(b);if(O.color.copy(b.color).multiplyScalar(b.intensity),b.castShadow){const B=b.shadow,F=t.get(b);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,i.directionalShadow[l]=F,i.directionalShadowMap[l]=I,i.directionalShadowMatrix[l]=b.shadow.matrix,A++}i.directional[l]=O,l++}else if(b.isSpotLight){const O=e.get(b);O.position.setFromMatrixPosition(b.matrixWorld),O.color.copy(C).multiplyScalar(D),O.distance=U,O.coneCos=Math.cos(b.angle),O.penumbraCos=Math.cos(b.angle*(1-b.penumbra)),O.decay=b.decay,i.spot[g]=O;const B=b.shadow;if(b.map&&(i.spotLightMap[x]=b.map,x++,B.updateMatrices(b),b.castShadow&&y++),i.spotLightMatrix[g]=B.matrix,b.castShadow){const F=t.get(b);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,i.spotShadow[g]=F,i.spotShadowMap[g]=I,T++}g++}else if(b.isRectAreaLight){const O=e.get(b);O.color.copy(C).multiplyScalar(D),O.halfWidth.set(b.width*.5,0,0),O.halfHeight.set(0,b.height*.5,0),i.rectArea[p]=O,p++}else if(b.isPointLight){const O=e.get(b);if(O.color.copy(b.color).multiplyScalar(b.intensity),O.distance=b.distance,O.decay=b.decay,b.castShadow){const B=b.shadow,F=t.get(b);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,F.shadowCameraNear=B.camera.near,F.shadowCameraFar=B.camera.far,i.pointShadow[m]=F,i.pointShadowMap[m]=I,i.pointShadowMatrix[m]=b.shadow.matrix,w++}i.point[m]=O,m++}else if(b.isHemisphereLight){const O=e.get(b);O.skyColor.copy(b.color).multiplyScalar(D),O.groundColor.copy(b.groundColor).multiplyScalar(D),i.hemi[v]=O,v++}}p>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;const M=i.hash;(M.directionalLength!==l||M.pointLength!==m||M.spotLength!==g||M.rectAreaLength!==p||M.hemiLength!==v||M.numDirectionalShadows!==A||M.numPointShadows!==w||M.numSpotShadows!==T||M.numSpotMaps!==x||M.numLightProbes!==E)&&(i.directional.length=l,i.spot.length=g,i.rectArea.length=p,i.point.length=m,i.hemi.length=v,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=T,i.spotShadowMap.length=T,i.directionalShadowMatrix.length=A,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=T+x-y,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=y,i.numLightProbes=E,M.directionalLength=l,M.pointLength=m,M.spotLength=g,M.rectAreaLength=p,M.hemiLength=v,M.numDirectionalShadows=A,M.numPointShadows=w,M.numSpotShadows=T,M.numSpotMaps=x,M.numLightProbes=E,i.version=sp++)}function c(f,u){let d=0,h=0,l=0,m=0,g=0;const p=u.matrixWorldInverse;for(let v=0,A=f.length;v<A;v++){const w=f[v];if(w.isDirectionalLight){const T=i.directional[d];T.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),d++}else if(w.isSpotLight){const T=i.spot[l];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(p),T.direction.setFromMatrixPosition(w.matrixWorld),r.setFromMatrixPosition(w.target.matrixWorld),T.direction.sub(r),T.direction.transformDirection(p),l++}else if(w.isRectAreaLight){const T=i.rectArea[m];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(p),o.identity(),n.copy(w.matrixWorld),n.premultiply(p),o.extractRotation(n),T.halfWidth.set(w.width*.5,0,0),T.halfHeight.set(0,w.height*.5,0),T.halfWidth.applyMatrix4(o),T.halfHeight.applyMatrix4(o),m++}else if(w.isPointLight){const T=i.point[h];T.position.setFromMatrixPosition(w.matrixWorld),T.position.applyMatrix4(p),h++}else if(w.isHemisphereLight){const T=i.hemi[g];T.direction.setFromMatrixPosition(w.matrixWorld),T.direction.transformDirection(p),g++}}}return{setup:a,setupView:c,state:i}}function Ja(s){const e=new op(s),t=[],i=[];function r(u){f.camera=u,t.length=0,i.length=0}function n(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function c(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:f,setupLights:a,setupLightsView:c,pushLight:n,pushShadow:o}}function lp(s){let e=new WeakMap;function t(r,n=0){const o=e.get(r);let a;return o===void 0?(a=new Ja(s),e.set(r,[a])):n>=o.length?(a=new Ja(s),o.push(a)):a=o[n],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const cp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,up=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fp(s,e,t){let i=new To;const r=new Ke,n=new Ke,o=new rt,a=new Lc({depthPacking:Wl}),c=new Ic,f={},u=t.maxTextureSize,d={[pn]:Mt,[Mt]:pn,[Jt]:Jt},h=new Wt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ke},radius:{value:4}},vertexShader:cp,fragmentShader:up}),l=h.clone();l.defines.HORIZONTAL_PASS=1;const m=new Ln;m.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new zt(m,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eo;let v=this.type;this.render=function(y,E,M){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;const S=s.getRenderTarget(),_=s.getActiveCubeFace(),b=s.getActiveMipmapLevel(),C=s.state;C.setBlending(hn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const D=v!==jt&&this.type===jt,U=v===jt&&this.type!==jt;for(let I=0,O=y.length;I<O;I++){const B=y[I],F=B.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;r.copy(F.mapSize);const Z=F.getFrameExtents();if(r.multiply(Z),n.copy(F.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(n.x=Math.floor(u/Z.x),r.x=n.x*Z.x,F.mapSize.x=n.x),r.y>u&&(n.y=Math.floor(u/Z.y),r.y=n.y*Z.y,F.mapSize.y=n.y)),F.map===null||D===!0||U===!0){const re=this.type!==jt?{minFilter:Ht,magFilter:Ht}:{};F.map!==null&&F.map.dispose(),F.map=new Dn(r.x,r.y,re),F.map.texture.name=B.name+".shadowMap",F.camera.updateProjectionMatrix()}s.setRenderTarget(F.map),s.clear();const j=F.getViewportCount();for(let re=0;re<j;re++){const _e=F.getViewport(re);o.set(n.x*_e.x,n.y*_e.y,n.x*_e.z,n.y*_e.w),C.viewport(o),F.updateMatrices(B,re),i=F.getFrustum(),T(E,M,F.camera,B,this.type)}F.isPointLightShadow!==!0&&this.type===jt&&A(F,M),F.needsUpdate=!1}v=this.type,p.needsUpdate=!1,s.setRenderTarget(S,_,b)};function A(y,E){const M=e.update(g);h.defines.VSM_SAMPLES!==y.blurSamples&&(h.defines.VSM_SAMPLES=y.blurSamples,l.defines.VSM_SAMPLES=y.blurSamples,h.needsUpdate=!0,l.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new Dn(r.x,r.y)),h.uniforms.shadow_pass.value=y.map.texture,h.uniforms.resolution.value=y.mapSize,h.uniforms.radius.value=y.radius,s.setRenderTarget(y.mapPass),s.clear(),s.renderBufferDirect(E,null,M,h,g,null),l.uniforms.shadow_pass.value=y.mapPass.texture,l.uniforms.resolution.value=y.mapSize,l.uniforms.radius.value=y.radius,s.setRenderTarget(y.map),s.clear(),s.renderBufferDirect(E,null,M,l,g,null)}function w(y,E,M,S){let _=null;const b=M.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(b!==void 0)_=b;else if(_=M.isPointLight===!0?c:a,s.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const C=_.uuid,D=E.uuid;let U=f[C];U===void 0&&(U={},f[C]=U);let I=U[D];I===void 0&&(I=_.clone(),U[D]=I,E.addEventListener("dispose",x)),_=I}if(_.visible=E.visible,_.wireframe=E.wireframe,S===jt?_.side=E.shadowSide!==null?E.shadowSide:E.side:_.side=E.shadowSide!==null?E.shadowSide:d[E.side],_.alphaMap=E.alphaMap,_.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,_.map=E.map,_.clipShadows=E.clipShadows,_.clippingPlanes=E.clippingPlanes,_.clipIntersection=E.clipIntersection,_.displacementMap=E.displacementMap,_.displacementScale=E.displacementScale,_.displacementBias=E.displacementBias,_.wireframeLinewidth=E.wireframeLinewidth,_.linewidth=E.linewidth,M.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const C=s.properties.get(_);C.light=M}return _}function T(y,E,M,S,_){if(y.visible===!1)return;if(y.layers.test(E.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&_===jt)&&(!y.frustumCulled||i.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,y.matrixWorld);const D=e.update(y),U=y.material;if(Array.isArray(U)){const I=D.groups;for(let O=0,B=I.length;O<B;O++){const F=I[O],Z=U[F.materialIndex];if(Z&&Z.visible){const j=w(y,Z,S,_);y.onBeforeShadow(s,y,E,M,D,j,F),s.renderBufferDirect(M,null,D,j,y,F),y.onAfterShadow(s,y,E,M,D,j,F)}}}else if(U.visible){const I=w(y,U,S,_);y.onBeforeShadow(s,y,E,M,D,I,null),s.renderBufferDirect(M,null,D,I,y,null),y.onAfterShadow(s,y,E,M,D,I,null)}}const C=y.children;for(let D=0,U=C.length;D<U;D++)T(C[D],E,M,S,_)}function x(y){y.target.removeEventListener("dispose",x);for(const M in f){const S=f[M],_=y.target.uuid;_ in S&&(S[_].dispose(),delete S[_])}}}const hp={[kr]:Wr,[Xr]:$r,[qr]:Zr,[Jn]:Yr,[Wr]:kr,[$r]:Xr,[Zr]:qr,[Yr]:Jn};function dp(s,e){function t(){let z=!1;const ce=new rt;let q=null;const J=new rt(0,0,0,0);return{setMask:function(fe){q!==fe&&!z&&(s.colorMask(fe,fe,fe,fe),q=fe)},setLocked:function(fe){z=fe},setClear:function(fe,ue,De,nt,ht){ht===!0&&(fe*=nt,ue*=nt,De*=nt),ce.set(fe,ue,De,nt),J.equals(ce)===!1&&(s.clearColor(fe,ue,De,nt),J.copy(ce))},reset:function(){z=!1,q=null,J.set(-1,0,0,0)}}}function i(){let z=!1,ce=!1,q=null,J=null,fe=null;return{setReversed:function(ue){if(ce!==ue){const De=e.get("EXT_clip_control");ue?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),ce=ue;const nt=fe;fe=null,this.setClear(nt)}},getReversed:function(){return ce},setTest:function(ue){ue?se(s.DEPTH_TEST):he(s.DEPTH_TEST)},setMask:function(ue){q!==ue&&!z&&(s.depthMask(ue),q=ue)},setFunc:function(ue){if(ce&&(ue=hp[ue]),J!==ue){switch(ue){case kr:s.depthFunc(s.NEVER);break;case Wr:s.depthFunc(s.ALWAYS);break;case Xr:s.depthFunc(s.LESS);break;case Jn:s.depthFunc(s.LEQUAL);break;case qr:s.depthFunc(s.EQUAL);break;case Yr:s.depthFunc(s.GEQUAL);break;case $r:s.depthFunc(s.GREATER);break;case Zr:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}J=ue}},setLocked:function(ue){z=ue},setClear:function(ue){fe!==ue&&(ce&&(ue=1-ue),s.clearDepth(ue),fe=ue)},reset:function(){z=!1,q=null,J=null,fe=null,ce=!1}}}function r(){let z=!1,ce=null,q=null,J=null,fe=null,ue=null,De=null,nt=null,ht=null;return{setTest:function(je){z||(je?se(s.STENCIL_TEST):he(s.STENCIL_TEST))},setMask:function(je){ce!==je&&!z&&(s.stencilMask(je),ce=je)},setFunc:function(je,Dt,Xt){(q!==je||J!==Dt||fe!==Xt)&&(s.stencilFunc(je,Dt,Xt),q=je,J=Dt,fe=Xt)},setOp:function(je,Dt,Xt){(ue!==je||De!==Dt||nt!==Xt)&&(s.stencilOp(je,Dt,Xt),ue=je,De=Dt,nt=Xt)},setLocked:function(je){z=je},setClear:function(je){ht!==je&&(s.clearStencil(je),ht=je)},reset:function(){z=!1,ce=null,q=null,J=null,fe=null,ue=null,De=null,nt=null,ht=null}}}const n=new t,o=new i,a=new r,c=new WeakMap,f=new WeakMap;let u={},d={},h=new WeakMap,l=[],m=null,g=!1,p=null,v=null,A=null,w=null,T=null,x=null,y=null,E=new Qe(0,0,0),M=0,S=!1,_=null,b=null,C=null,D=null,U=null;const I=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,B=0;const F=s.getParameter(s.VERSION);F.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(F)[1]),O=B>=1):F.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),O=B>=2);let Z=null,j={};const re=s.getParameter(s.SCISSOR_BOX),_e=s.getParameter(s.VIEWPORT),Ce=new rt().fromArray(re),Y=new rt().fromArray(_e);function te(z,ce,q,J){const fe=new Uint8Array(4),ue=s.createTexture();s.bindTexture(z,ue),s.texParameteri(z,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(z,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let De=0;De<q;De++)z===s.TEXTURE_3D||z===s.TEXTURE_2D_ARRAY?s.texImage3D(ce,0,s.RGBA,1,1,J,0,s.RGBA,s.UNSIGNED_BYTE,fe):s.texImage2D(ce+De,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,fe);return ue}const ee={};ee[s.TEXTURE_2D]=te(s.TEXTURE_2D,s.TEXTURE_2D,1),ee[s.TEXTURE_CUBE_MAP]=te(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[s.TEXTURE_2D_ARRAY]=te(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ee[s.TEXTURE_3D]=te(s.TEXTURE_3D,s.TEXTURE_3D,1,1),n.setClear(0,0,0,1),o.setClear(1),a.setClear(0),se(s.DEPTH_TEST),o.setFunc(Jn),He(!1),Be(na),se(s.CULL_FACE),N(hn);function se(z){u[z]!==!0&&(s.enable(z),u[z]=!0)}function he(z){u[z]!==!1&&(s.disable(z),u[z]=!1)}function Oe(z,ce){return d[z]!==ce?(s.bindFramebuffer(z,ce),d[z]=ce,z===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ce),z===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ce),!0):!1}function xe(z,ce){let q=l,J=!1;if(z){q=h.get(ce),q===void 0&&(q=[],h.set(ce,q));const fe=z.textures;if(q.length!==fe.length||q[0]!==s.COLOR_ATTACHMENT0){for(let ue=0,De=fe.length;ue<De;ue++)q[ue]=s.COLOR_ATTACHMENT0+ue;q.length=fe.length,J=!0}}else q[0]!==s.BACK&&(q[0]=s.BACK,J=!0);J&&s.drawBuffers(q)}function Xe(z){return m!==z?(s.useProgram(z),m=z,!0):!1}const Ne={[An]:s.FUNC_ADD,[gl]:s.FUNC_SUBTRACT,[vl]:s.FUNC_REVERSE_SUBTRACT};Ne[_l]=s.MIN,Ne[xl]=s.MAX;const ze={[Sl]:s.ZERO,[Ml]:s.ONE,[yl]:s.SRC_COLOR,[Vr]:s.SRC_ALPHA,[Cl]:s.SRC_ALPHA_SATURATE,[wl]:s.DST_COLOR,[Tl]:s.DST_ALPHA,[El]:s.ONE_MINUS_SRC_COLOR,[Gr]:s.ONE_MINUS_SRC_ALPHA,[bl]:s.ONE_MINUS_DST_COLOR,[Al]:s.ONE_MINUS_DST_ALPHA,[Rl]:s.CONSTANT_COLOR,[Pl]:s.ONE_MINUS_CONSTANT_COLOR,[Dl]:s.CONSTANT_ALPHA,[Ll]:s.ONE_MINUS_CONSTANT_ALPHA};function N(z,ce,q,J,fe,ue,De,nt,ht,je){if(z===hn){g===!0&&(he(s.BLEND),g=!1);return}if(g===!1&&(se(s.BLEND),g=!0),z!==ml){if(z!==p||je!==S){if((v!==An||T!==An)&&(s.blendEquation(s.FUNC_ADD),v=An,T=An),je)switch(z){case Kn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Hr:s.blendFunc(s.ONE,s.ONE);break;case ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ra:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Kn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Hr:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ra:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}A=null,w=null,x=null,y=null,E.set(0,0,0),M=0,p=z,S=je}return}fe=fe||ce,ue=ue||q,De=De||J,(ce!==v||fe!==T)&&(s.blendEquationSeparate(Ne[ce],Ne[fe]),v=ce,T=fe),(q!==A||J!==w||ue!==x||De!==y)&&(s.blendFuncSeparate(ze[q],ze[J],ze[ue],ze[De]),A=q,w=J,x=ue,y=De),(nt.equals(E)===!1||ht!==M)&&(s.blendColor(nt.r,nt.g,nt.b,ht),E.copy(nt),M=ht),p=z,S=!1}function _t(z,ce){z.side===Jt?he(s.CULL_FACE):se(s.CULL_FACE);let q=z.side===Mt;ce&&(q=!q),He(q),z.blending===Kn&&z.transparent===!1?N(hn):N(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),n.setMask(z.colorWrite);const J=z.stencilWrite;a.setTest(J),J&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ve(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?se(s.SAMPLE_ALPHA_TO_COVERAGE):he(s.SAMPLE_ALPHA_TO_COVERAGE)}function He(z){_!==z&&(z?s.frontFace(s.CW):s.frontFace(s.CCW),_=z)}function Be(z){z!==hl?(se(s.CULL_FACE),z!==b&&(z===na?s.cullFace(s.BACK):z===dl?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):he(s.CULL_FACE),b=z}function Se(z){z!==C&&(O&&s.lineWidth(z),C=z)}function Ve(z,ce,q){z?(se(s.POLYGON_OFFSET_FILL),(D!==ce||U!==q)&&(s.polygonOffset(ce,q),D=ce,U=q)):he(s.POLYGON_OFFSET_FILL)}function Me(z){z?se(s.SCISSOR_TEST):he(s.SCISSOR_TEST)}function L(z){z===void 0&&(z=s.TEXTURE0+I-1),Z!==z&&(s.activeTexture(z),Z=z)}function R(z,ce,q){q===void 0&&(Z===null?q=s.TEXTURE0+I-1:q=Z);let J=j[q];J===void 0&&(J={type:void 0,texture:void 0},j[q]=J),(J.type!==z||J.texture!==ce)&&(Z!==q&&(s.activeTexture(q),Z=q),s.bindTexture(z,ce||ee[z]),J.type=z,J.texture=ce)}function G(){const z=j[Z];z!==void 0&&z.type!==void 0&&(s.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function K(){try{s.compressedTexImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{s.compressedTexImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function $(){try{s.texSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ve(){try{s.texSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function oe(){try{s.compressedTexSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ye(){try{s.compressedTexSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ee(){try{s.texStorage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ne(){try{s.texStorage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function pe(){try{s.texImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function we(){try{s.texImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Re(z){Ce.equals(z)===!1&&(s.scissor(z.x,z.y,z.z,z.w),Ce.copy(z))}function me(z){Y.equals(z)===!1&&(s.viewport(z.x,z.y,z.z,z.w),Y.copy(z))}function ke(z,ce){let q=f.get(ce);q===void 0&&(q=new WeakMap,f.set(ce,q));let J=q.get(z);J===void 0&&(J=s.getUniformBlockIndex(ce,z.name),q.set(z,J))}function Ie(z,ce){const J=f.get(ce).get(z);c.get(ce)!==J&&(s.uniformBlockBinding(ce,J,z.__bindingPointIndex),c.set(ce,J))}function et(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),u={},Z=null,j={},d={},h=new WeakMap,l=[],m=null,g=!1,p=null,v=null,A=null,w=null,T=null,x=null,y=null,E=new Qe(0,0,0),M=0,S=!1,_=null,b=null,C=null,D=null,U=null,Ce.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),n.reset(),o.reset(),a.reset()}return{buffers:{color:n,depth:o,stencil:a},enable:se,disable:he,bindFramebuffer:Oe,drawBuffers:xe,useProgram:Xe,setBlending:N,setMaterial:_t,setFlipSided:He,setCullFace:Be,setLineWidth:Se,setPolygonOffset:Ve,setScissorTest:Me,activeTexture:L,bindTexture:R,unbindTexture:G,compressedTexImage2D:K,compressedTexImage3D:Q,texImage2D:pe,texImage3D:we,updateUBOMapping:ke,uniformBlockBinding:Ie,texStorage2D:Ee,texStorage3D:ne,texSubImage2D:$,texSubImage3D:ve,compressedTexSubImage2D:oe,compressedTexSubImage3D:ye,scissor:Re,viewport:me,reset:et}}function pp(s,e,t,i,r,n,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new Ke,u=new WeakMap;let d;const h=new WeakMap;let l=!1;try{l=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,R){return l?new OffscreenCanvas(L,R):vi("canvas")}function g(L,R,G){let K=1;const Q=Me(L);if((Q.width>G||Q.height>G)&&(K=G/Math.max(Q.width,Q.height)),K<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const $=Math.floor(K*Q.width),ve=Math.floor(K*Q.height);d===void 0&&(d=m($,ve));const oe=R?m($,ve):d;return oe.width=$,oe.height=ve,oe.getContext("2d").drawImage(L,0,0,$,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+$+"x"+ve+")."),oe}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),L;return L}function p(L){return L.generateMipmaps}function v(L){s.generateMipmap(L)}function A(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function w(L,R,G,K,Q=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let $=R;if(R===s.RED&&(G===s.FLOAT&&($=s.R32F),G===s.HALF_FLOAT&&($=s.R16F),G===s.UNSIGNED_BYTE&&($=s.R8)),R===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&($=s.R8UI),G===s.UNSIGNED_SHORT&&($=s.R16UI),G===s.UNSIGNED_INT&&($=s.R32UI),G===s.BYTE&&($=s.R8I),G===s.SHORT&&($=s.R16I),G===s.INT&&($=s.R32I)),R===s.RG&&(G===s.FLOAT&&($=s.RG32F),G===s.HALF_FLOAT&&($=s.RG16F),G===s.UNSIGNED_BYTE&&($=s.RG8)),R===s.RG_INTEGER&&(G===s.UNSIGNED_BYTE&&($=s.RG8UI),G===s.UNSIGNED_SHORT&&($=s.RG16UI),G===s.UNSIGNED_INT&&($=s.RG32UI),G===s.BYTE&&($=s.RG8I),G===s.SHORT&&($=s.RG16I),G===s.INT&&($=s.RG32I)),R===s.RGB_INTEGER&&(G===s.UNSIGNED_BYTE&&($=s.RGB8UI),G===s.UNSIGNED_SHORT&&($=s.RGB16UI),G===s.UNSIGNED_INT&&($=s.RGB32UI),G===s.BYTE&&($=s.RGB8I),G===s.SHORT&&($=s.RGB16I),G===s.INT&&($=s.RGB32I)),R===s.RGBA_INTEGER&&(G===s.UNSIGNED_BYTE&&($=s.RGBA8UI),G===s.UNSIGNED_SHORT&&($=s.RGBA16UI),G===s.UNSIGNED_INT&&($=s.RGBA32UI),G===s.BYTE&&($=s.RGBA8I),G===s.SHORT&&($=s.RGBA16I),G===s.INT&&($=s.RGBA32I)),R===s.RGB&&G===s.UNSIGNED_INT_5_9_9_9_REV&&($=s.RGB9_E5),R===s.RGBA){const ve=Q?nr:Ye.getTransfer(K);G===s.FLOAT&&($=s.RGBA32F),G===s.HALF_FLOAT&&($=s.RGBA16F),G===s.UNSIGNED_BYTE&&($=ve===Je?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT_4_4_4_4&&($=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&($=s.RGB5_A1)}return($===s.R16F||$===s.R32F||$===s.RG16F||$===s.RG32F||$===s.RGBA16F||$===s.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function T(L,R){let G;return L?R===null||R===Pn||R===pi?G=s.DEPTH24_STENCIL8:R===Qt?G=s.DEPTH32F_STENCIL8:R===di&&(G=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):R===null||R===Pn||R===pi?G=s.DEPTH_COMPONENT24:R===Qt?G=s.DEPTH_COMPONENT32F:R===di&&(G=s.DEPTH_COMPONENT16),G}function x(L,R){return p(L)===!0||L.isFramebufferTexture&&L.minFilter!==Ht&&L.minFilter!==Gt?Math.log2(Math.max(R.width,R.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?R.mipmaps.length:1}function y(L){const R=L.target;R.removeEventListener("dispose",y),M(R),R.isVideoTexture&&u.delete(R)}function E(L){const R=L.target;R.removeEventListener("dispose",E),_(R)}function M(L){const R=i.get(L);if(R.__webglInit===void 0)return;const G=L.source,K=h.get(G);if(K){const Q=K[R.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&S(L),Object.keys(K).length===0&&h.delete(G)}i.remove(L)}function S(L){const R=i.get(L);s.deleteTexture(R.__webglTexture);const G=L.source,K=h.get(G);delete K[R.__cacheKey],o.memory.textures--}function _(L){const R=i.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),i.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(R.__webglFramebuffer[K]))for(let Q=0;Q<R.__webglFramebuffer[K].length;Q++)s.deleteFramebuffer(R.__webglFramebuffer[K][Q]);else s.deleteFramebuffer(R.__webglFramebuffer[K]);R.__webglDepthbuffer&&s.deleteRenderbuffer(R.__webglDepthbuffer[K])}else{if(Array.isArray(R.__webglFramebuffer))for(let K=0;K<R.__webglFramebuffer.length;K++)s.deleteFramebuffer(R.__webglFramebuffer[K]);else s.deleteFramebuffer(R.__webglFramebuffer);if(R.__webglDepthbuffer&&s.deleteRenderbuffer(R.__webglDepthbuffer),R.__webglMultisampledFramebuffer&&s.deleteFramebuffer(R.__webglMultisampledFramebuffer),R.__webglColorRenderbuffer)for(let K=0;K<R.__webglColorRenderbuffer.length;K++)R.__webglColorRenderbuffer[K]&&s.deleteRenderbuffer(R.__webglColorRenderbuffer[K]);R.__webglDepthRenderbuffer&&s.deleteRenderbuffer(R.__webglDepthRenderbuffer)}const G=L.textures;for(let K=0,Q=G.length;K<Q;K++){const $=i.get(G[K]);$.__webglTexture&&(s.deleteTexture($.__webglTexture),o.memory.textures--),i.remove(G[K])}i.remove(L)}let b=0;function C(){b=0}function D(){const L=b;return L>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+r.maxTextures),b+=1,L}function U(L){const R=[];return R.push(L.wrapS),R.push(L.wrapT),R.push(L.wrapR||0),R.push(L.magFilter),R.push(L.minFilter),R.push(L.anisotropy),R.push(L.internalFormat),R.push(L.format),R.push(L.type),R.push(L.generateMipmaps),R.push(L.premultiplyAlpha),R.push(L.flipY),R.push(L.unpackAlignment),R.push(L.colorSpace),R.join()}function I(L,R){const G=i.get(L);if(L.isVideoTexture&&Se(L),L.isRenderTargetTexture===!1&&L.version>0&&G.__version!==L.version){const K=L.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(G,L,R);return}}t.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+R)}function O(L,R){const G=i.get(L);if(L.version>0&&G.__version!==L.version){Y(G,L,R);return}t.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+R)}function B(L,R){const G=i.get(L);if(L.version>0&&G.__version!==L.version){Y(G,L,R);return}t.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+R)}function F(L,R){const G=i.get(L);if(L.version>0&&G.__version!==L.version){te(G,L,R);return}t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+R)}const Z={[Jr]:s.REPEAT,[bn]:s.CLAMP_TO_EDGE,[Qr]:s.MIRRORED_REPEAT},j={[Ht]:s.NEAREST,[Gl]:s.NEAREST_MIPMAP_NEAREST,[Ai]:s.NEAREST_MIPMAP_LINEAR,[Gt]:s.LINEAR,[cr]:s.LINEAR_MIPMAP_NEAREST,[Cn]:s.LINEAR_MIPMAP_LINEAR},re={[Yl]:s.NEVER,[Ql]:s.ALWAYS,[$l]:s.LESS,[fo]:s.LEQUAL,[Zl]:s.EQUAL,[Jl]:s.GEQUAL,[Kl]:s.GREATER,[jl]:s.NOTEQUAL};function _e(L,R){if(R.type===Qt&&e.has("OES_texture_float_linear")===!1&&(R.magFilter===Gt||R.magFilter===cr||R.magFilter===Ai||R.magFilter===Cn||R.minFilter===Gt||R.minFilter===cr||R.minFilter===Ai||R.minFilter===Cn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,Z[R.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,Z[R.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,Z[R.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,j[R.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,j[R.minFilter]),R.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,re[R.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(R.magFilter===Ht||R.minFilter!==Ai&&R.minFilter!==Cn||R.type===Qt&&e.has("OES_texture_float_linear")===!1)return;if(R.anisotropy>1||i.get(R).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");s.texParameterf(L,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(R.anisotropy,r.getMaxAnisotropy())),i.get(R).__currentAnisotropy=R.anisotropy}}}function Ce(L,R){let G=!1;L.__webglInit===void 0&&(L.__webglInit=!0,R.addEventListener("dispose",y));const K=R.source;let Q=h.get(K);Q===void 0&&(Q={},h.set(K,Q));const $=U(R);if($!==L.__cacheKey){Q[$]===void 0&&(Q[$]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,G=!0),Q[$].usedTimes++;const ve=Q[L.__cacheKey];ve!==void 0&&(Q[L.__cacheKey].usedTimes--,ve.usedTimes===0&&S(R)),L.__cacheKey=$,L.__webglTexture=Q[$].texture}return G}function Y(L,R,G){let K=s.TEXTURE_2D;(R.isDataArrayTexture||R.isCompressedArrayTexture)&&(K=s.TEXTURE_2D_ARRAY),R.isData3DTexture&&(K=s.TEXTURE_3D);const Q=Ce(L,R),$=R.source;t.bindTexture(K,L.__webglTexture,s.TEXTURE0+G);const ve=i.get($);if($.version!==ve.__version||Q===!0){t.activeTexture(s.TEXTURE0+G);const oe=Ye.getPrimaries(Ye.workingColorSpace),ye=R.colorSpace===fn?null:Ye.getPrimaries(R.colorSpace),Ee=R.colorSpace===fn||oe===ye?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,R.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,R.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);let ne=g(R.image,!1,r.maxTextureSize);ne=Ve(R,ne);const pe=n.convert(R.format,R.colorSpace),we=n.convert(R.type);let Re=w(R.internalFormat,pe,we,R.colorSpace,R.isVideoTexture);_e(K,R);let me;const ke=R.mipmaps,Ie=R.isVideoTexture!==!0,et=ve.__version===void 0||Q===!0,z=$.dataReady,ce=x(R,ne);if(R.isDepthTexture)Re=T(R.format===gi,R.type),et&&(Ie?t.texStorage2D(s.TEXTURE_2D,1,Re,ne.width,ne.height):t.texImage2D(s.TEXTURE_2D,0,Re,ne.width,ne.height,0,pe,we,null));else if(R.isDataTexture)if(ke.length>0){Ie&&et&&t.texStorage2D(s.TEXTURE_2D,ce,Re,ke[0].width,ke[0].height);for(let q=0,J=ke.length;q<J;q++)me=ke[q],Ie?z&&t.texSubImage2D(s.TEXTURE_2D,q,0,0,me.width,me.height,pe,we,me.data):t.texImage2D(s.TEXTURE_2D,q,Re,me.width,me.height,0,pe,we,me.data);R.generateMipmaps=!1}else Ie?(et&&t.texStorage2D(s.TEXTURE_2D,ce,Re,ne.width,ne.height),z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ne.width,ne.height,pe,we,ne.data)):t.texImage2D(s.TEXTURE_2D,0,Re,ne.width,ne.height,0,pe,we,ne.data);else if(R.isCompressedTexture)if(R.isCompressedArrayTexture){Ie&&et&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ce,Re,ke[0].width,ke[0].height,ne.depth);for(let q=0,J=ke.length;q<J;q++)if(me=ke[q],R.format!==Bt)if(pe!==null)if(Ie){if(z)if(R.layerUpdates.size>0){const fe=Ca(me.width,me.height,R.format,R.type);for(const ue of R.layerUpdates){const De=me.data.subarray(ue*fe/me.data.BYTES_PER_ELEMENT,(ue+1)*fe/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,ue,me.width,me.height,1,pe,De)}R.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,me.width,me.height,ne.depth,pe,me.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,q,Re,me.width,me.height,ne.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?z&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,q,0,0,0,me.width,me.height,ne.depth,pe,we,me.data):t.texImage3D(s.TEXTURE_2D_ARRAY,q,Re,me.width,me.height,ne.depth,0,pe,we,me.data)}else{Ie&&et&&t.texStorage2D(s.TEXTURE_2D,ce,Re,ke[0].width,ke[0].height);for(let q=0,J=ke.length;q<J;q++)me=ke[q],R.format!==Bt?pe!==null?Ie?z&&t.compressedTexSubImage2D(s.TEXTURE_2D,q,0,0,me.width,me.height,pe,me.data):t.compressedTexImage2D(s.TEXTURE_2D,q,Re,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?z&&t.texSubImage2D(s.TEXTURE_2D,q,0,0,me.width,me.height,pe,we,me.data):t.texImage2D(s.TEXTURE_2D,q,Re,me.width,me.height,0,pe,we,me.data)}else if(R.isDataArrayTexture)if(Ie){if(et&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ce,Re,ne.width,ne.height,ne.depth),z)if(R.layerUpdates.size>0){const q=Ca(ne.width,ne.height,R.format,R.type);for(const J of R.layerUpdates){const fe=ne.data.subarray(J*q/ne.data.BYTES_PER_ELEMENT,(J+1)*q/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,ne.width,ne.height,1,pe,we,fe)}R.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,pe,we,ne.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Re,ne.width,ne.height,ne.depth,0,pe,we,ne.data);else if(R.isData3DTexture)Ie?(et&&t.texStorage3D(s.TEXTURE_3D,ce,Re,ne.width,ne.height,ne.depth),z&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,pe,we,ne.data)):t.texImage3D(s.TEXTURE_3D,0,Re,ne.width,ne.height,ne.depth,0,pe,we,ne.data);else if(R.isFramebufferTexture){if(et)if(Ie)t.texStorage2D(s.TEXTURE_2D,ce,Re,ne.width,ne.height);else{let q=ne.width,J=ne.height;for(let fe=0;fe<ce;fe++)t.texImage2D(s.TEXTURE_2D,fe,Re,q,J,0,pe,we,null),q>>=1,J>>=1}}else if(ke.length>0){if(Ie&&et){const q=Me(ke[0]);t.texStorage2D(s.TEXTURE_2D,ce,Re,q.width,q.height)}for(let q=0,J=ke.length;q<J;q++)me=ke[q],Ie?z&&t.texSubImage2D(s.TEXTURE_2D,q,0,0,pe,we,me):t.texImage2D(s.TEXTURE_2D,q,Re,pe,we,me);R.generateMipmaps=!1}else if(Ie){if(et){const q=Me(ne);t.texStorage2D(s.TEXTURE_2D,ce,Re,q.width,q.height)}z&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,pe,we,ne)}else t.texImage2D(s.TEXTURE_2D,0,Re,pe,we,ne);p(R)&&v(K),ve.__version=$.version,R.onUpdate&&R.onUpdate(R)}L.__version=R.version}function te(L,R,G){if(R.image.length!==6)return;const K=Ce(L,R),Q=R.source;t.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+G);const $=i.get(Q);if(Q.version!==$.__version||K===!0){t.activeTexture(s.TEXTURE0+G);const ve=Ye.getPrimaries(Ye.workingColorSpace),oe=R.colorSpace===fn?null:Ye.getPrimaries(R.colorSpace),ye=R.colorSpace===fn||ve===oe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,R.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,R.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,R.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const Ee=R.isCompressedTexture||R.image[0].isCompressedTexture,ne=R.image[0]&&R.image[0].isDataTexture,pe=[];for(let J=0;J<6;J++)!Ee&&!ne?pe[J]=g(R.image[J],!0,r.maxCubemapSize):pe[J]=ne?R.image[J].image:R.image[J],pe[J]=Ve(R,pe[J]);const we=pe[0],Re=n.convert(R.format,R.colorSpace),me=n.convert(R.type),ke=w(R.internalFormat,Re,me,R.colorSpace),Ie=R.isVideoTexture!==!0,et=$.__version===void 0||K===!0,z=Q.dataReady;let ce=x(R,we);_e(s.TEXTURE_CUBE_MAP,R);let q;if(Ee){Ie&&et&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,ke,we.width,we.height);for(let J=0;J<6;J++){q=pe[J].mipmaps;for(let fe=0;fe<q.length;fe++){const ue=q[fe];R.format!==Bt?Re!==null?Ie?z&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,0,0,ue.width,ue.height,Re,ue.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,ke,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,0,0,ue.width,ue.height,Re,me,ue.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,ke,ue.width,ue.height,0,Re,me,ue.data)}}}else{if(q=R.mipmaps,Ie&&et){q.length>0&&ce++;const J=Me(pe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,ke,J.width,J.height)}for(let J=0;J<6;J++)if(ne){Ie?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,pe[J].width,pe[J].height,Re,me,pe[J].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,ke,pe[J].width,pe[J].height,0,Re,me,pe[J].data);for(let fe=0;fe<q.length;fe++){const De=q[fe].image[J].image;Ie?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,0,0,De.width,De.height,Re,me,De.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,ke,De.width,De.height,0,Re,me,De.data)}}else{Ie?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Re,me,pe[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,ke,Re,me,pe[J]);for(let fe=0;fe<q.length;fe++){const ue=q[fe];Ie?z&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,0,0,Re,me,ue.image[J]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,ke,Re,me,ue.image[J])}}}p(R)&&v(s.TEXTURE_CUBE_MAP),$.__version=Q.version,R.onUpdate&&R.onUpdate(R)}L.__version=R.version}function ee(L,R,G,K,Q,$){const ve=n.convert(G.format,G.colorSpace),oe=n.convert(G.type),ye=w(G.internalFormat,ve,oe,G.colorSpace),Ee=i.get(R),ne=i.get(G);if(ne.__renderTarget=R,!Ee.__hasExternalTextures){const pe=Math.max(1,R.width>>$),we=Math.max(1,R.height>>$);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?t.texImage3D(Q,$,ye,pe,we,R.depth,0,ve,oe,null):t.texImage2D(Q,$,ye,pe,we,0,ve,oe,null)}t.bindFramebuffer(s.FRAMEBUFFER,L),Be(R)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,K,Q,ne.__webglTexture,0,He(R)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,K,Q,ne.__webglTexture,$),t.bindFramebuffer(s.FRAMEBUFFER,null)}function se(L,R,G){if(s.bindRenderbuffer(s.RENDERBUFFER,L),R.depthBuffer){const K=R.depthTexture,Q=K&&K.isDepthTexture?K.type:null,$=T(R.stencilBuffer,Q),ve=R.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,oe=He(R);Be(R)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,oe,$,R.width,R.height):G?s.renderbufferStorageMultisample(s.RENDERBUFFER,oe,$,R.width,R.height):s.renderbufferStorage(s.RENDERBUFFER,$,R.width,R.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ve,s.RENDERBUFFER,L)}else{const K=R.textures;for(let Q=0;Q<K.length;Q++){const $=K[Q],ve=n.convert($.format,$.colorSpace),oe=n.convert($.type),ye=w($.internalFormat,ve,oe,$.colorSpace),Ee=He(R);G&&Be(R)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ee,ye,R.width,R.height):Be(R)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ee,ye,R.width,R.height):s.renderbufferStorage(s.RENDERBUFFER,ye,R.width,R.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function he(L,R){if(R&&R.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,L),!(R.depthTexture&&R.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(R.depthTexture);K.__renderTarget=R,(!K.__webglTexture||R.depthTexture.image.width!==R.width||R.depthTexture.image.height!==R.height)&&(R.depthTexture.image.width=R.width,R.depthTexture.image.height=R.height,R.depthTexture.needsUpdate=!0),I(R.depthTexture,0);const Q=K.__webglTexture,$=He(R);if(R.depthTexture.format===mi)Be(R)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0);else if(R.depthTexture.format===gi)Be(R)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0,$):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Oe(L){const R=i.get(L),G=L.isWebGLCubeRenderTarget===!0;if(R.__boundDepthTexture!==L.depthTexture){const K=L.depthTexture;if(R.__depthDisposeCallback&&R.__depthDisposeCallback(),K){const Q=()=>{delete R.__boundDepthTexture,delete R.__depthDisposeCallback,K.removeEventListener("dispose",Q)};K.addEventListener("dispose",Q),R.__depthDisposeCallback=Q}R.__boundDepthTexture=K}if(L.depthTexture&&!R.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const K=L.texture.mipmaps;K&&K.length>0?he(R.__webglFramebuffer[0],L):he(R.__webglFramebuffer,L)}else if(G){R.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(s.FRAMEBUFFER,R.__webglFramebuffer[K]),R.__webglDepthbuffer[K]===void 0)R.__webglDepthbuffer[K]=s.createRenderbuffer(),se(R.__webglDepthbuffer[K],L,!1);else{const Q=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$=R.__webglDepthbuffer[K];s.bindRenderbuffer(s.RENDERBUFFER,$),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,$)}}else{const K=L.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(s.FRAMEBUFFER,R.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,R.__webglFramebuffer),R.__webglDepthbuffer===void 0)R.__webglDepthbuffer=s.createRenderbuffer(),se(R.__webglDepthbuffer,L,!1);else{const Q=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$=R.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,$),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,$)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function xe(L,R,G){const K=i.get(L);R!==void 0&&ee(K.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&Oe(L)}function Xe(L){const R=L.texture,G=i.get(L),K=i.get(R);L.addEventListener("dispose",E);const Q=L.textures,$=L.isWebGLCubeRenderTarget===!0,ve=Q.length>1;if(ve||(K.__webglTexture===void 0&&(K.__webglTexture=s.createTexture()),K.__version=R.version,o.memory.textures++),$){G.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(R.mipmaps&&R.mipmaps.length>0){G.__webglFramebuffer[oe]=[];for(let ye=0;ye<R.mipmaps.length;ye++)G.__webglFramebuffer[oe][ye]=s.createFramebuffer()}else G.__webglFramebuffer[oe]=s.createFramebuffer()}else{if(R.mipmaps&&R.mipmaps.length>0){G.__webglFramebuffer=[];for(let oe=0;oe<R.mipmaps.length;oe++)G.__webglFramebuffer[oe]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(ve)for(let oe=0,ye=Q.length;oe<ye;oe++){const Ee=i.get(Q[oe]);Ee.__webglTexture===void 0&&(Ee.__webglTexture=s.createTexture(),o.memory.textures++)}if(L.samples>0&&Be(L)===!1){G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let oe=0;oe<Q.length;oe++){const ye=Q[oe];G.__webglColorRenderbuffer[oe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[oe]);const Ee=n.convert(ye.format,ye.colorSpace),ne=n.convert(ye.type),pe=w(ye.internalFormat,Ee,ne,ye.colorSpace,L.isXRRenderTarget===!0),we=He(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,we,pe,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+oe,s.RENDERBUFFER,G.__webglColorRenderbuffer[oe])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),se(G.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if($){t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),_e(s.TEXTURE_CUBE_MAP,R);for(let oe=0;oe<6;oe++)if(R.mipmaps&&R.mipmaps.length>0)for(let ye=0;ye<R.mipmaps.length;ye++)ee(G.__webglFramebuffer[oe][ye],L,R,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,ye);else ee(G.__webglFramebuffer[oe],L,R,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);p(R)&&v(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let oe=0,ye=Q.length;oe<ye;oe++){const Ee=Q[oe],ne=i.get(Ee);t.bindTexture(s.TEXTURE_2D,ne.__webglTexture),_e(s.TEXTURE_2D,Ee),ee(G.__webglFramebuffer,L,Ee,s.COLOR_ATTACHMENT0+oe,s.TEXTURE_2D,0),p(Ee)&&v(s.TEXTURE_2D)}t.unbindTexture()}else{let oe=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(oe=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(oe,K.__webglTexture),_e(oe,R),R.mipmaps&&R.mipmaps.length>0)for(let ye=0;ye<R.mipmaps.length;ye++)ee(G.__webglFramebuffer[ye],L,R,s.COLOR_ATTACHMENT0,oe,ye);else ee(G.__webglFramebuffer,L,R,s.COLOR_ATTACHMENT0,oe,0);p(R)&&v(oe),t.unbindTexture()}L.depthBuffer&&Oe(L)}function Ne(L){const R=L.textures;for(let G=0,K=R.length;G<K;G++){const Q=R[G];if(p(Q)){const $=A(L),ve=i.get(Q).__webglTexture;t.bindTexture($,ve),v($),t.unbindTexture()}}}const ze=[],N=[];function _t(L){if(L.samples>0){if(Be(L)===!1){const R=L.textures,G=L.width,K=L.height;let Q=s.COLOR_BUFFER_BIT;const $=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ve=i.get(L),oe=R.length>1;if(oe)for(let Ee=0;Ee<R.length;Ee++)t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer);const ye=L.texture.mipmaps;ye&&ye.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let Ee=0;Ee<R.length;Ee++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),oe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Ee]);const ne=i.get(R[Ee]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ne,0)}s.blitFramebuffer(0,0,G,K,0,0,G,K,Q,s.NEAREST),c===!0&&(ze.length=0,N.length=0,ze.push(s.COLOR_ATTACHMENT0+Ee),L.depthBuffer&&L.resolveDepthBuffer===!1&&(ze.push($),N.push($),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,N)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ze))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),oe)for(let Ee=0;Ee<R.length;Ee++){t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.RENDERBUFFER,ve.__webglColorRenderbuffer[Ee]);const ne=i.get(R[Ee]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ve.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ee,s.TEXTURE_2D,ne,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const R=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[R])}}}function He(L){return Math.min(r.maxSamples,L.samples)}function Be(L){const R=i.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&R.__useRenderToTexture!==!1}function Se(L){const R=o.render.frame;u.get(L)!==R&&(u.set(L,R),L.update())}function Ve(L,R){const G=L.colorSpace,K=L.format,Q=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||G!==ti&&G!==fn&&(Ye.getTransfer(G)===Je?(K!==Bt||Q!==nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),R}function Me(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(f.width=L.naturalWidth||L.width,f.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(f.width=L.displayWidth,f.height=L.displayHeight):(f.width=L.width,f.height=L.height),f}this.allocateTextureUnit=D,this.resetTextureUnits=C,this.setTexture2D=I,this.setTexture2DArray=O,this.setTexture3D=B,this.setTextureCube=F,this.rebindTextures=xe,this.setupRenderTarget=Xe,this.updateRenderTargetMipmap=Ne,this.updateMultisampleRenderTarget=_t,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=Be}function mp(s,e){function t(i,r=fn){let n;const o=Ye.getTransfer(r);if(i===nn)return s.UNSIGNED_BYTE;if(i===Ls)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Is)return s.UNSIGNED_SHORT_5_5_5_1;if(i===so)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===io)return s.BYTE;if(i===ro)return s.SHORT;if(i===di)return s.UNSIGNED_SHORT;if(i===Ds)return s.INT;if(i===Pn)return s.UNSIGNED_INT;if(i===Qt)return s.FLOAT;if(i===_i)return s.HALF_FLOAT;if(i===ao)return s.ALPHA;if(i===oo)return s.RGB;if(i===Bt)return s.RGBA;if(i===mi)return s.DEPTH_COMPONENT;if(i===gi)return s.DEPTH_STENCIL;if(i===lo)return s.RED;if(i===Us)return s.RED_INTEGER;if(i===co)return s.RG;if(i===Ns)return s.RG_INTEGER;if(i===Fs)return s.RGBA_INTEGER;if(i===$i||i===Zi||i===Ki||i===ji)if(o===Je)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===$i)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Zi)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ki)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ji)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===$i)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Zi)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ki)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ji)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===es||i===ts||i===ns||i===is)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===es)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ts)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ns)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===is)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rs||i===ss||i===as)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(i===rs||i===ss)return o===Je?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===as)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===os||i===ls||i===cs||i===us||i===fs||i===hs||i===ds||i===ps||i===ms||i===gs||i===vs||i===_s||i===xs||i===Ss)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(i===os)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ls)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===cs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===us)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===fs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===hs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ds)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ps)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ms)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===gs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===vs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_s)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===xs)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ss)return o===Je?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ji||i===Ms||i===ys)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(i===Ji)return o===Je?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ms)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ys)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===uo||i===Es||i===Ts||i===As)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(i===Ji)return n.COMPRESSED_RED_RGTC1_EXT;if(i===Es)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ts)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===As)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===pi?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const gp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,vp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _p{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new mt,n=e.properties.get(r);n.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Wt({vertexShader:gp,fragmentShader:vp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new zt(new ri(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xp extends ii{constructor(e,t){super();const i=this;let r=null,n=1,o=null,a="local-floor",c=1,f=null,u=null,d=null,h=null,l=null,m=null;const g=new _p,p=t.getContextAttributes();let v=null,A=null;const w=[],T=[],x=new Ke;let y=null;const E=new Pt;E.viewport=new rt;const M=new Pt;M.viewport=new rt;const S=[E,M],_=new Bc;let b=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let te=w[Y];return te===void 0&&(te=new Dr,w[Y]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Y){let te=w[Y];return te===void 0&&(te=new Dr,w[Y]=te),te.getGripSpace()},this.getHand=function(Y){let te=w[Y];return te===void 0&&(te=new Dr,w[Y]=te),te.getHandSpace()};function D(Y){const te=T.indexOf(Y.inputSource);if(te===-1)return;const ee=w[te];ee!==void 0&&(ee.update(Y.inputSource,Y.frame,f||o),ee.dispatchEvent({type:Y.type,data:Y.inputSource}))}function U(){r.removeEventListener("select",D),r.removeEventListener("selectstart",D),r.removeEventListener("selectend",D),r.removeEventListener("squeeze",D),r.removeEventListener("squeezestart",D),r.removeEventListener("squeezeend",D),r.removeEventListener("end",U),r.removeEventListener("inputsourceschange",I);for(let Y=0;Y<w.length;Y++){const te=T[Y];te!==null&&(T[Y]=null,w[Y].disconnect(te))}b=null,C=null,g.reset(),e.setRenderTarget(v),l=null,h=null,d=null,r=null,A=null,Ce.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(x.width,x.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){n=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return f||o},this.setReferenceSpace=function(Y){f=Y},this.getBaseLayer=function(){return h!==null?h:l},this.getBinding=function(){return d},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(v=e.getRenderTarget(),r.addEventListener("select",D),r.addEventListener("selectstart",D),r.addEventListener("selectend",D),r.addEventListener("squeeze",D),r.addEventListener("squeezestart",D),r.addEventListener("squeezeend",D),r.addEventListener("end",U),r.addEventListener("inputsourceschange",I),p.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(x),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let ee=null,se=null,he=null;p.depth&&(he=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=p.stencil?gi:mi,se=p.stencil?pi:Pn);const Oe={colorFormat:t.RGBA8,depthFormat:he,scaleFactor:n};d=new XRWebGLBinding(r,t),h=d.createProjectionLayer(Oe),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),A=new Dn(h.textureWidth,h.textureHeight,{format:Bt,type:nn,depthTexture:new Ao(h.textureWidth,h.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const ee={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:n};l=new XRWebGLLayer(r,t,ee),r.updateRenderState({baseLayer:l}),e.setPixelRatio(1),e.setSize(l.framebufferWidth,l.framebufferHeight,!1),A=new Dn(l.framebufferWidth,l.framebufferHeight,{format:Bt,type:nn,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:l.ignoreDepthValues===!1,resolveStencilBuffer:l.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(c),f=null,o=await r.requestReferenceSpace(a),Ce.setContext(r),Ce.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function I(Y){for(let te=0;te<Y.removed.length;te++){const ee=Y.removed[te],se=T.indexOf(ee);se>=0&&(T[se]=null,w[se].disconnect(ee))}for(let te=0;te<Y.added.length;te++){const ee=Y.added[te];let se=T.indexOf(ee);if(se===-1){for(let Oe=0;Oe<w.length;Oe++)if(Oe>=T.length){T.push(ee),se=Oe;break}else if(T[Oe]===null){T[Oe]=ee,se=Oe;break}if(se===-1)break}const he=w[se];he&&he.connect(ee)}}const O=new k,B=new k;function F(Y,te,ee){O.setFromMatrixPosition(te.matrixWorld),B.setFromMatrixPosition(ee.matrixWorld);const se=O.distanceTo(B),he=te.projectionMatrix.elements,Oe=ee.projectionMatrix.elements,xe=he[14]/(he[10]-1),Xe=he[14]/(he[10]+1),Ne=(he[9]+1)/he[5],ze=(he[9]-1)/he[5],N=(he[8]-1)/he[0],_t=(Oe[8]+1)/Oe[0],He=xe*N,Be=xe*_t,Se=se/(-N+_t),Ve=Se*-N;if(te.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ve),Y.translateZ(Se),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),he[10]===-1)Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const Me=xe+Se,L=Xe+Se,R=He-Ve,G=Be+(se-Ve),K=Ne*Xe/L*Me,Q=ze*Xe/L*Me;Y.projectionMatrix.makePerspective(R,G,K,Q,Me,L),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Z(Y,te){te===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(te.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let te=Y.near,ee=Y.far;g.texture!==null&&(g.depthNear>0&&(te=g.depthNear),g.depthFar>0&&(ee=g.depthFar)),_.near=M.near=E.near=te,_.far=M.far=E.far=ee,(b!==_.near||C!==_.far)&&(r.updateRenderState({depthNear:_.near,depthFar:_.far}),b=_.near,C=_.far),E.layers.mask=Y.layers.mask|2,M.layers.mask=Y.layers.mask|4,_.layers.mask=E.layers.mask|M.layers.mask;const se=Y.parent,he=_.cameras;Z(_,se);for(let Oe=0;Oe<he.length;Oe++)Z(he[Oe],se);he.length===2?F(_,E,M):_.projectionMatrix.copy(E.projectionMatrix),j(Y,_,se)};function j(Y,te,ee){ee===null?Y.matrix.copy(te.matrixWorld):(Y.matrix.copy(ee.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(te.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=ws*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(h===null&&l===null))return c},this.setFoveation=function(Y){c=Y,h!==null&&(h.fixedFoveation=Y),l!==null&&l.fixedFoveation!==void 0&&(l.fixedFoveation=Y)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(_)};let re=null;function _e(Y,te){if(u=te.getViewerPose(f||o),m=te,u!==null){const ee=u.views;l!==null&&(e.setRenderTargetFramebuffer(A,l.framebuffer),e.setRenderTarget(A));let se=!1;ee.length!==_.cameras.length&&(_.cameras.length=0,se=!0);for(let xe=0;xe<ee.length;xe++){const Xe=ee[xe];let Ne=null;if(l!==null)Ne=l.getViewport(Xe);else{const N=d.getViewSubImage(h,Xe);Ne=N.viewport,xe===0&&(e.setRenderTargetTextures(A,N.colorTexture,N.depthStencilTexture),e.setRenderTarget(A))}let ze=S[xe];ze===void 0&&(ze=new Pt,ze.layers.enable(xe),ze.viewport=new rt,S[xe]=ze),ze.matrix.fromArray(Xe.transform.matrix),ze.matrix.decompose(ze.position,ze.quaternion,ze.scale),ze.projectionMatrix.fromArray(Xe.projectionMatrix),ze.projectionMatrixInverse.copy(ze.projectionMatrix).invert(),ze.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),xe===0&&(_.matrix.copy(ze.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),se===!0&&_.cameras.push(ze)}const he=r.enabledFeatures;if(he&&he.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&d){const xe=d.getDepthInformation(ee[0]);xe&&xe.isValid&&xe.texture&&g.init(e,xe,r.renderState)}}for(let ee=0;ee<w.length;ee++){const se=T[ee],he=w[ee];se!==null&&he!==void 0&&he.update(se,te,f||o)}re&&re(Y,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),m=null}const Ce=new bo;Ce.setAnimationLoop(_e),this.setAnimationLoop=function(Y){re=Y},this.dispose=function(){}}}const yn=new rn,Sp=new ot;function Mp(s,e){function t(p,v){p.matrixAutoUpdate===!0&&p.updateMatrix(),v.value.copy(p.matrix)}function i(p,v){v.color.getRGB(p.fogColor.value,So(s)),v.isFog?(p.fogNear.value=v.near,p.fogFar.value=v.far):v.isFogExp2&&(p.fogDensity.value=v.density)}function r(p,v,A,w,T){v.isMeshBasicMaterial||v.isMeshLambertMaterial?n(p,v):v.isMeshToonMaterial?(n(p,v),d(p,v)):v.isMeshPhongMaterial?(n(p,v),u(p,v)):v.isMeshStandardMaterial?(n(p,v),h(p,v),v.isMeshPhysicalMaterial&&l(p,v,T)):v.isMeshMatcapMaterial?(n(p,v),m(p,v)):v.isMeshDepthMaterial?n(p,v):v.isMeshDistanceMaterial?(n(p,v),g(p,v)):v.isMeshNormalMaterial?n(p,v):v.isLineBasicMaterial?(o(p,v),v.isLineDashedMaterial&&a(p,v)):v.isPointsMaterial?c(p,v,A,w):v.isSpriteMaterial?f(p,v):v.isShadowMaterial?(p.color.value.copy(v.color),p.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function n(p,v){p.opacity.value=v.opacity,v.color&&p.diffuse.value.copy(v.color),v.emissive&&p.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(p.map.value=v.map,t(v.map,p.mapTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.bumpMap&&(p.bumpMap.value=v.bumpMap,t(v.bumpMap,p.bumpMapTransform),p.bumpScale.value=v.bumpScale,v.side===Mt&&(p.bumpScale.value*=-1)),v.normalMap&&(p.normalMap.value=v.normalMap,t(v.normalMap,p.normalMapTransform),p.normalScale.value.copy(v.normalScale),v.side===Mt&&p.normalScale.value.negate()),v.displacementMap&&(p.displacementMap.value=v.displacementMap,t(v.displacementMap,p.displacementMapTransform),p.displacementScale.value=v.displacementScale,p.displacementBias.value=v.displacementBias),v.emissiveMap&&(p.emissiveMap.value=v.emissiveMap,t(v.emissiveMap,p.emissiveMapTransform)),v.specularMap&&(p.specularMap.value=v.specularMap,t(v.specularMap,p.specularMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest);const A=e.get(v),w=A.envMap,T=A.envMapRotation;w&&(p.envMap.value=w,yn.copy(T),yn.x*=-1,yn.y*=-1,yn.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(yn.y*=-1,yn.z*=-1),p.envMapRotation.value.setFromMatrix4(Sp.makeRotationFromEuler(yn)),p.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=v.reflectivity,p.ior.value=v.ior,p.refractionRatio.value=v.refractionRatio),v.lightMap&&(p.lightMap.value=v.lightMap,p.lightMapIntensity.value=v.lightMapIntensity,t(v.lightMap,p.lightMapTransform)),v.aoMap&&(p.aoMap.value=v.aoMap,p.aoMapIntensity.value=v.aoMapIntensity,t(v.aoMap,p.aoMapTransform))}function o(p,v){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,v.map&&(p.map.value=v.map,t(v.map,p.mapTransform))}function a(p,v){p.dashSize.value=v.dashSize,p.totalSize.value=v.dashSize+v.gapSize,p.scale.value=v.scale}function c(p,v,A,w){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,p.size.value=v.size*A,p.scale.value=w*.5,v.map&&(p.map.value=v.map,t(v.map,p.uvTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest)}function f(p,v){p.diffuse.value.copy(v.color),p.opacity.value=v.opacity,p.rotation.value=v.rotation,v.map&&(p.map.value=v.map,t(v.map,p.mapTransform)),v.alphaMap&&(p.alphaMap.value=v.alphaMap,t(v.alphaMap,p.alphaMapTransform)),v.alphaTest>0&&(p.alphaTest.value=v.alphaTest)}function u(p,v){p.specular.value.copy(v.specular),p.shininess.value=Math.max(v.shininess,1e-4)}function d(p,v){v.gradientMap&&(p.gradientMap.value=v.gradientMap)}function h(p,v){p.metalness.value=v.metalness,v.metalnessMap&&(p.metalnessMap.value=v.metalnessMap,t(v.metalnessMap,p.metalnessMapTransform)),p.roughness.value=v.roughness,v.roughnessMap&&(p.roughnessMap.value=v.roughnessMap,t(v.roughnessMap,p.roughnessMapTransform)),v.envMap&&(p.envMapIntensity.value=v.envMapIntensity)}function l(p,v,A){p.ior.value=v.ior,v.sheen>0&&(p.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),p.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(p.sheenColorMap.value=v.sheenColorMap,t(v.sheenColorMap,p.sheenColorMapTransform)),v.sheenRoughnessMap&&(p.sheenRoughnessMap.value=v.sheenRoughnessMap,t(v.sheenRoughnessMap,p.sheenRoughnessMapTransform))),v.clearcoat>0&&(p.clearcoat.value=v.clearcoat,p.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(p.clearcoatMap.value=v.clearcoatMap,t(v.clearcoatMap,p.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,t(v.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(p.clearcoatNormalMap.value=v.clearcoatNormalMap,t(v.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Mt&&p.clearcoatNormalScale.value.negate())),v.dispersion>0&&(p.dispersion.value=v.dispersion),v.iridescence>0&&(p.iridescence.value=v.iridescence,p.iridescenceIOR.value=v.iridescenceIOR,p.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(p.iridescenceMap.value=v.iridescenceMap,t(v.iridescenceMap,p.iridescenceMapTransform)),v.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=v.iridescenceThicknessMap,t(v.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),v.transmission>0&&(p.transmission.value=v.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),v.transmissionMap&&(p.transmissionMap.value=v.transmissionMap,t(v.transmissionMap,p.transmissionMapTransform)),p.thickness.value=v.thickness,v.thicknessMap&&(p.thicknessMap.value=v.thicknessMap,t(v.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=v.attenuationDistance,p.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(p.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(p.anisotropyMap.value=v.anisotropyMap,t(v.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=v.specularIntensity,p.specularColor.value.copy(v.specularColor),v.specularColorMap&&(p.specularColorMap.value=v.specularColorMap,t(v.specularColorMap,p.specularColorMapTransform)),v.specularIntensityMap&&(p.specularIntensityMap.value=v.specularIntensityMap,t(v.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,v){v.matcap&&(p.matcap.value=v.matcap)}function g(p,v){const A=e.get(v).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function yp(s,e,t,i){let r={},n={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(A,w){const T=w.program;i.uniformBlockBinding(A,T)}function f(A,w){let T=r[A.id];T===void 0&&(m(A),T=u(A),r[A.id]=T,A.addEventListener("dispose",p));const x=w.program;i.updateUBOMapping(A,x);const y=e.render.frame;n[A.id]!==y&&(h(A),n[A.id]=y)}function u(A){const w=d();A.__bindingPointIndex=w;const T=s.createBuffer(),x=A.__size,y=A.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,x,y),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,w,T),T}function d(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(A){const w=r[A.id],T=A.uniforms,x=A.__cache;s.bindBuffer(s.UNIFORM_BUFFER,w);for(let y=0,E=T.length;y<E;y++){const M=Array.isArray(T[y])?T[y]:[T[y]];for(let S=0,_=M.length;S<_;S++){const b=M[S];if(l(b,y,S,x)===!0){const C=b.__offset,D=Array.isArray(b.value)?b.value:[b.value];let U=0;for(let I=0;I<D.length;I++){const O=D[I],B=g(O);typeof O=="number"||typeof O=="boolean"?(b.__data[0]=O,s.bufferSubData(s.UNIFORM_BUFFER,C+U,b.__data)):O.isMatrix3?(b.__data[0]=O.elements[0],b.__data[1]=O.elements[1],b.__data[2]=O.elements[2],b.__data[3]=0,b.__data[4]=O.elements[3],b.__data[5]=O.elements[4],b.__data[6]=O.elements[5],b.__data[7]=0,b.__data[8]=O.elements[6],b.__data[9]=O.elements[7],b.__data[10]=O.elements[8],b.__data[11]=0):(O.toArray(b.__data,U),U+=B.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,C,b.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function l(A,w,T,x){const y=A.value,E=w+"_"+T;if(x[E]===void 0)return typeof y=="number"||typeof y=="boolean"?x[E]=y:x[E]=y.clone(),!0;{const M=x[E];if(typeof y=="number"||typeof y=="boolean"){if(M!==y)return x[E]=y,!0}else if(M.equals(y)===!1)return M.copy(y),!0}return!1}function m(A){const w=A.uniforms;let T=0;const x=16;for(let E=0,M=w.length;E<M;E++){const S=Array.isArray(w[E])?w[E]:[w[E]];for(let _=0,b=S.length;_<b;_++){const C=S[_],D=Array.isArray(C.value)?C.value:[C.value];for(let U=0,I=D.length;U<I;U++){const O=D[U],B=g(O),F=T%x,Z=F%B.boundary,j=F+Z;T+=Z,j!==0&&x-j<B.storage&&(T+=x-j),C.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=T,T+=B.storage}}}const y=T%x;return y>0&&(T+=x-y),A.__size=T,A.__cache={},this}function g(A){const w={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(w.boundary=4,w.storage=4):A.isVector2?(w.boundary=8,w.storage=8):A.isVector3||A.isColor?(w.boundary=16,w.storage=12):A.isVector4?(w.boundary=16,w.storage=16):A.isMatrix3?(w.boundary=48,w.storage=48):A.isMatrix4?(w.boundary=64,w.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),w}function p(A){const w=A.target;w.removeEventListener("dispose",p);const T=o.indexOf(w.__bindingPointIndex);o.splice(T,1),s.deleteBuffer(r[w.id]),delete r[w.id],delete n[w.id]}function v(){for(const A in r)s.deleteBuffer(r[A]);o=[],r={},n={}}return{bind:c,update:f,dispose:v}}class Lo{constructor(e={}){const{canvas:t=tc(),context:i=null,depth:r=!0,stencil:n=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:f=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let l;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");l=i.getContextAttributes().alpha}else l=o;const m=new Uint32Array(4),g=new Int32Array(4);let p=null,v=null;const A=[],w=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=dn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const T=this;let x=!1;this._outputColorSpace=Rt;let y=0,E=0,M=null,S=-1,_=null;const b=new rt,C=new rt;let D=null;const U=new Qe(0);let I=0,O=t.width,B=t.height,F=1,Z=null,j=null;const re=new rt(0,0,O,B),_e=new rt(0,0,O,B);let Ce=!1;const Y=new To;let te=!1,ee=!1;const se=new ot,he=new ot,Oe=new k,xe=new rt,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ne=!1;function ze(){return M===null?F:1}let N=i;function _t(P,H){return t.getContext(P,H)}try{const P={alpha:!0,depth:r,stencil:n,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:f,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ps}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",fe,!1),t.addEventListener("webglcontextcreationerror",ue,!1),N===null){const H="webgl2";if(N=_t(H,P),N===null)throw _t(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let He,Be,Se,Ve,Me,L,R,G,K,Q,$,ve,oe,ye,Ee,ne,pe,we,Re,me,ke,Ie,et,z;function ce(){He=new Ih(N),He.init(),Ie=new mp(N,He),Be=new wh(N,He,e,Ie),Se=new dp(N,He),Be.reverseDepthBuffer&&h&&Se.buffers.depth.setReversed(!0),Ve=new Fh(N),Me=new ep,L=new pp(N,He,Se,Me,Be,Ie,Ve),R=new Ch(T),G=new Lh(T),K=new Vc(N),et=new Th(N,K),Q=new Uh(N,K,Ve,et),$=new Bh(N,Q,K,Ve),Re=new Oh(N,Be,L),ne=new bh(Me),ve=new Qd(T,R,G,He,Be,et,ne),oe=new Mp(T,Me),ye=new np,Ee=new lp(He),we=new Eh(T,R,G,Se,$,l,c),pe=new fp(T,$,Be),z=new yp(N,Ve,Be,Se),me=new Ah(N,He,Ve),ke=new Nh(N,He,Ve),Ve.programs=ve.programs,T.capabilities=Be,T.extensions=He,T.properties=Me,T.renderLists=ye,T.shadowMap=pe,T.state=Se,T.info=Ve}ce();const q=new xp(T,N);this.xr=q,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const P=He.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=He.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(P){P!==void 0&&(F=P,this.setSize(O,B,!1))},this.getSize=function(P){return P.set(O,B)},this.setSize=function(P,H,W=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=P,B=H,t.width=Math.floor(P*F),t.height=Math.floor(H*F),W===!0&&(t.style.width=P+"px",t.style.height=H+"px"),this.setViewport(0,0,P,H)},this.getDrawingBufferSize=function(P){return P.set(O*F,B*F).floor()},this.setDrawingBufferSize=function(P,H,W){O=P,B=H,F=W,t.width=Math.floor(P*W),t.height=Math.floor(H*W),this.setViewport(0,0,P,H)},this.getCurrentViewport=function(P){return P.copy(b)},this.getViewport=function(P){return P.copy(re)},this.setViewport=function(P,H,W,X){P.isVector4?re.set(P.x,P.y,P.z,P.w):re.set(P,H,W,X),Se.viewport(b.copy(re).multiplyScalar(F).round())},this.getScissor=function(P){return P.copy(_e)},this.setScissor=function(P,H,W,X){P.isVector4?_e.set(P.x,P.y,P.z,P.w):_e.set(P,H,W,X),Se.scissor(C.copy(_e).multiplyScalar(F).round())},this.getScissorTest=function(){return Ce},this.setScissorTest=function(P){Se.setScissorTest(Ce=P)},this.setOpaqueSort=function(P){Z=P},this.setTransparentSort=function(P){j=P},this.getClearColor=function(P){return P.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(P=!0,H=!0,W=!0){let X=0;if(P){let V=!1;if(M!==null){const ie=M.texture.format;V=ie===Fs||ie===Ns||ie===Us}if(V){const ie=M.texture.type,le=ie===nn||ie===Pn||ie===di||ie===pi||ie===Ls||ie===Is,de=we.getClearColor(),ge=we.getClearAlpha(),Pe=de.r,be=de.g,Te=de.b;le?(m[0]=Pe,m[1]=be,m[2]=Te,m[3]=ge,N.clearBufferuiv(N.COLOR,0,m)):(g[0]=Pe,g[1]=be,g[2]=Te,g[3]=ge,N.clearBufferiv(N.COLOR,0,g))}else X|=N.COLOR_BUFFER_BIT}H&&(X|=N.DEPTH_BUFFER_BIT),W&&(X|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",fe,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),we.dispose(),ye.dispose(),Ee.dispose(),Me.dispose(),R.dispose(),G.dispose(),$.dispose(),et.dispose(),z.dispose(),ve.dispose(),q.dispose(),q.removeEventListener("sessionstart",Vs),q.removeEventListener("sessionend",Gs),mn.stop()};function J(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const P=Ve.autoReset,H=pe.enabled,W=pe.autoUpdate,X=pe.needsUpdate,V=pe.type;ce(),Ve.autoReset=P,pe.enabled=H,pe.autoUpdate=W,pe.needsUpdate=X,pe.type=V}function ue(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function De(P){const H=P.target;H.removeEventListener("dispose",De),nt(H)}function nt(P){ht(P),Me.remove(P)}function ht(P){const H=Me.get(P).programs;H!==void 0&&(H.forEach(function(W){ve.releaseProgram(W)}),P.isShaderMaterial&&ve.releaseShaderCache(P))}this.renderBufferDirect=function(P,H,W,X,V,ie){H===null&&(H=Xe);const le=V.isMesh&&V.matrixWorld.determinant()<0,de=Io(P,H,W,X,V);Se.setMaterial(X,le);let ge=W.index,Pe=1;if(X.wireframe===!0){if(ge=Q.getWireframeAttribute(W),ge===void 0)return;Pe=2}const be=W.drawRange,Te=W.attributes.position;let We=be.start*Pe,$e=(be.start+be.count)*Pe;ie!==null&&(We=Math.max(We,ie.start*Pe),$e=Math.min($e,(ie.start+ie.count)*Pe)),ge!==null?(We=Math.max(We,0),$e=Math.min($e,ge.count)):Te!=null&&(We=Math.max(We,0),$e=Math.min($e,Te.count));const st=$e-We;if(st<0||st===1/0)return;et.setup(V,X,de,W,ge);let it,qe=me;if(ge!==null&&(it=K.get(ge),qe=ke,qe.setIndex(it)),V.isMesh)X.wireframe===!0?(Se.setLineWidth(X.wireframeLinewidth*ze()),qe.setMode(N.LINES)):qe.setMode(N.TRIANGLES);else if(V.isLine){let Ae=X.linewidth;Ae===void 0&&(Ae=1),Se.setLineWidth(Ae*ze()),V.isLineSegments?qe.setMode(N.LINES):V.isLineLoop?qe.setMode(N.LINE_LOOP):qe.setMode(N.LINE_STRIP)}else V.isPoints?qe.setMode(N.POINTS):V.isSprite&&qe.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Qi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),qe.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))qe.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Ae=V._multiDrawStarts,ft=V._multiDrawCounts,Ze=V._multiDrawCount,Lt=ge?K.get(ge).bytesPerElement:1,In=Me.get(X).currentProgram.getUniforms();for(let yt=0;yt<Ze;yt++)In.setValue(N,"_gl_DrawID",yt),qe.render(Ae[yt]/Lt,ft[yt])}else if(V.isInstancedMesh)qe.renderInstances(We,st,V.count);else if(W.isInstancedBufferGeometry){const Ae=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ft=Math.min(W.instanceCount,Ae);qe.renderInstances(We,st,ft)}else qe.render(We,st)};function je(P,H,W){P.transparent===!0&&P.side===Jt&&P.forceSinglePass===!1?(P.side=Mt,P.needsUpdate=!0,Ti(P,H,W),P.side=pn,P.needsUpdate=!0,Ti(P,H,W),P.side=Jt):Ti(P,H,W)}this.compile=function(P,H,W=null){W===null&&(W=P),v=Ee.get(W),v.init(H),w.push(v),W.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(v.pushLight(V),V.castShadow&&v.pushShadow(V))}),P!==W&&P.traverseVisible(function(V){V.isLight&&V.layers.test(H.layers)&&(v.pushLight(V),V.castShadow&&v.pushShadow(V))}),v.setupLights();const X=new Set;return P.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const ie=V.material;if(ie)if(Array.isArray(ie))for(let le=0;le<ie.length;le++){const de=ie[le];je(de,W,V),X.add(de)}else je(ie,W,V),X.add(ie)}),v=w.pop(),X},this.compileAsync=function(P,H,W=null){const X=this.compile(P,H,W);return new Promise(V=>{function ie(){if(X.forEach(function(le){Me.get(le).currentProgram.isReady()&&X.delete(le)}),X.size===0){V(P);return}setTimeout(ie,10)}He.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let Dt=null;function Xt(P){Dt&&Dt(P)}function Vs(){mn.stop()}function Gs(){mn.start()}const mn=new bo;mn.setAnimationLoop(Xt),typeof self<"u"&&mn.setContext(self),this.setAnimationLoop=function(P){Dt=P,q.setAnimationLoop(P),P===null?mn.stop():mn.start()},q.addEventListener("sessionstart",Vs),q.addEventListener("sessionend",Gs),this.render=function(P,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(H),H=q.getCamera()),P.isScene===!0&&P.onBeforeRender(T,P,H,M),v=Ee.get(P,w.length),v.init(H),w.push(v),he.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Y.setFromProjectionMatrix(he),ee=this.localClippingEnabled,te=ne.init(this.clippingPlanes,ee),p=ye.get(P,A.length),p.init(),A.push(p),q.enabled===!0&&q.isPresenting===!0){const ie=T.xr.getDepthSensingMesh();ie!==null&&or(ie,H,-1/0,T.sortObjects)}or(P,H,0,T.sortObjects),p.finish(),T.sortObjects===!0&&p.sort(Z,j),Ne=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Ne&&we.addToRenderList(p,P),this.info.render.frame++,te===!0&&ne.beginShadows();const W=v.state.shadowsArray;pe.render(W,P,H),te===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=p.opaque,V=p.transmissive;if(v.setupLights(),H.isArrayCamera){const ie=H.cameras;if(V.length>0)for(let le=0,de=ie.length;le<de;le++){const ge=ie[le];Ws(X,V,P,ge)}Ne&&we.render(P);for(let le=0,de=ie.length;le<de;le++){const ge=ie[le];ks(p,P,ge,ge.viewport)}}else V.length>0&&Ws(X,V,P,H),Ne&&we.render(P),ks(p,P,H);M!==null&&E===0&&(L.updateMultisampleRenderTarget(M),L.updateRenderTargetMipmap(M)),P.isScene===!0&&P.onAfterRender(T,P,H),et.resetDefaultState(),S=-1,_=null,w.pop(),w.length>0?(v=w[w.length-1],te===!0&&ne.setGlobalState(T.clippingPlanes,v.state.camera)):v=null,A.pop(),A.length>0?p=A[A.length-1]:p=null};function or(P,H,W,X){if(P.visible===!1)return;if(P.layers.test(H.layers)){if(P.isGroup)W=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(H);else if(P.isLight)v.pushLight(P),P.castShadow&&v.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Y.intersectsSprite(P)){X&&xe.setFromMatrixPosition(P.matrixWorld).applyMatrix4(he);const le=$.update(P),de=P.material;de.visible&&p.push(P,le,de,W,xe.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Y.intersectsObject(P))){const le=$.update(P),de=P.material;if(X&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),xe.copy(P.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),xe.copy(le.boundingSphere.center)),xe.applyMatrix4(P.matrixWorld).applyMatrix4(he)),Array.isArray(de)){const ge=le.groups;for(let Pe=0,be=ge.length;Pe<be;Pe++){const Te=ge[Pe],We=de[Te.materialIndex];We&&We.visible&&p.push(P,le,We,W,xe.z,Te)}}else de.visible&&p.push(P,le,de,W,xe.z,null)}}const ie=P.children;for(let le=0,de=ie.length;le<de;le++)or(ie[le],H,W,X)}function ks(P,H,W,X){const V=P.opaque,ie=P.transmissive,le=P.transparent;v.setupLightsView(W),te===!0&&ne.setGlobalState(T.clippingPlanes,W),X&&Se.viewport(b.copy(X)),V.length>0&&Ei(V,H,W),ie.length>0&&Ei(ie,H,W),le.length>0&&Ei(le,H,W),Se.buffers.depth.setTest(!0),Se.buffers.depth.setMask(!0),Se.buffers.color.setMask(!0),Se.setPolygonOffset(!1)}function Ws(P,H,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new Dn(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?_i:nn,minFilter:Cn,samples:4,stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const ie=v.state.transmissionRenderTarget[X.id],le=X.viewport||b;ie.setSize(le.z*T.transmissionResolutionScale,le.w*T.transmissionResolutionScale);const de=T.getRenderTarget();T.setRenderTarget(ie),T.getClearColor(U),I=T.getClearAlpha(),I<1&&T.setClearColor(16777215,.5),T.clear(),Ne&&we.render(W);const ge=T.toneMapping;T.toneMapping=dn;const Pe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),te===!0&&ne.setGlobalState(T.clippingPlanes,X),Ei(P,W,X),L.updateMultisampleRenderTarget(ie),L.updateRenderTargetMipmap(ie),He.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let Te=0,We=H.length;Te<We;Te++){const $e=H[Te],st=$e.object,it=$e.geometry,qe=$e.material,Ae=$e.group;if(qe.side===Jt&&st.layers.test(X.layers)){const ft=qe.side;qe.side=Mt,qe.needsUpdate=!0,Xs(st,W,X,it,qe,Ae),qe.side=ft,qe.needsUpdate=!0,be=!0}}be===!0&&(L.updateMultisampleRenderTarget(ie),L.updateRenderTargetMipmap(ie))}T.setRenderTarget(de),T.setClearColor(U,I),Pe!==void 0&&(X.viewport=Pe),T.toneMapping=ge}function Ei(P,H,W){const X=H.isScene===!0?H.overrideMaterial:null;for(let V=0,ie=P.length;V<ie;V++){const le=P[V],de=le.object,ge=le.geometry,Pe=le.group;let be=le.material;be.allowOverride===!0&&X!==null&&(be=X),de.layers.test(W.layers)&&Xs(de,H,W,ge,be,Pe)}}function Xs(P,H,W,X,V,ie){P.onBeforeRender(T,H,W,X,V,ie),P.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),V.onBeforeRender(T,H,W,X,P,ie),V.transparent===!0&&V.side===Jt&&V.forceSinglePass===!1?(V.side=Mt,V.needsUpdate=!0,T.renderBufferDirect(W,H,X,V,P,ie),V.side=pn,V.needsUpdate=!0,T.renderBufferDirect(W,H,X,V,P,ie),V.side=Jt):T.renderBufferDirect(W,H,X,V,P,ie),P.onAfterRender(T,H,W,X,V,ie)}function Ti(P,H,W){H.isScene!==!0&&(H=Xe);const X=Me.get(P),V=v.state.lights,ie=v.state.shadowsArray,le=V.state.version,de=ve.getParameters(P,V.state,ie,H,W),ge=ve.getProgramCacheKey(de);let Pe=X.programs;X.environment=P.isMeshStandardMaterial?H.environment:null,X.fog=H.fog,X.envMap=(P.isMeshStandardMaterial?G:R).get(P.envMap||X.environment),X.envMapRotation=X.environment!==null&&P.envMap===null?H.environmentRotation:P.envMapRotation,Pe===void 0&&(P.addEventListener("dispose",De),Pe=new Map,X.programs=Pe);let be=Pe.get(ge);if(be!==void 0){if(X.currentProgram===be&&X.lightsStateVersion===le)return Ys(P,de),be}else de.uniforms=ve.getUniforms(P),P.onBeforeCompile(de,T),be=ve.acquireProgram(de,ge),Pe.set(ge,be),X.uniforms=de.uniforms;const Te=X.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Te.clippingPlanes=ne.uniform),Ys(P,de),X.needsLights=No(P),X.lightsStateVersion=le,X.needsLights&&(Te.ambientLightColor.value=V.state.ambient,Te.lightProbe.value=V.state.probe,Te.directionalLights.value=V.state.directional,Te.directionalLightShadows.value=V.state.directionalShadow,Te.spotLights.value=V.state.spot,Te.spotLightShadows.value=V.state.spotShadow,Te.rectAreaLights.value=V.state.rectArea,Te.ltc_1.value=V.state.rectAreaLTC1,Te.ltc_2.value=V.state.rectAreaLTC2,Te.pointLights.value=V.state.point,Te.pointLightShadows.value=V.state.pointShadow,Te.hemisphereLights.value=V.state.hemi,Te.directionalShadowMap.value=V.state.directionalShadowMap,Te.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Te.spotShadowMap.value=V.state.spotShadowMap,Te.spotLightMatrix.value=V.state.spotLightMatrix,Te.spotLightMap.value=V.state.spotLightMap,Te.pointShadowMap.value=V.state.pointShadowMap,Te.pointShadowMatrix.value=V.state.pointShadowMatrix),X.currentProgram=be,X.uniformsList=null,be}function qs(P){if(P.uniformsList===null){const H=P.currentProgram.getUniforms();P.uniformsList=er.seqWithValue(H.seq,P.uniforms)}return P.uniformsList}function Ys(P,H){const W=Me.get(P);W.outputColorSpace=H.outputColorSpace,W.batching=H.batching,W.batchingColor=H.batchingColor,W.instancing=H.instancing,W.instancingColor=H.instancingColor,W.instancingMorph=H.instancingMorph,W.skinning=H.skinning,W.morphTargets=H.morphTargets,W.morphNormals=H.morphNormals,W.morphColors=H.morphColors,W.morphTargetsCount=H.morphTargetsCount,W.numClippingPlanes=H.numClippingPlanes,W.numIntersection=H.numClipIntersection,W.vertexAlphas=H.vertexAlphas,W.vertexTangents=H.vertexTangents,W.toneMapping=H.toneMapping}function Io(P,H,W,X,V){H.isScene!==!0&&(H=Xe),L.resetTextureUnits();const ie=H.fog,le=X.isMeshStandardMaterial?H.environment:null,de=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:ti,ge=(X.isMeshStandardMaterial?G:R).get(X.envMap||le),Pe=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,be=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Te=!!W.morphAttributes.position,We=!!W.morphAttributes.normal,$e=!!W.morphAttributes.color;let st=dn;X.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(st=T.toneMapping);const it=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,qe=it!==void 0?it.length:0,Ae=Me.get(X),ft=v.state.lights;if(te===!0&&(ee===!0||P!==_)){const gt=P===_&&X.id===S;ne.setState(X,P,gt)}let Ze=!1;X.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ft.state.version||Ae.outputColorSpace!==de||V.isBatchedMesh&&Ae.batching===!1||!V.isBatchedMesh&&Ae.batching===!0||V.isBatchedMesh&&Ae.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Ae.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Ae.instancing===!1||!V.isInstancedMesh&&Ae.instancing===!0||V.isSkinnedMesh&&Ae.skinning===!1||!V.isSkinnedMesh&&Ae.skinning===!0||V.isInstancedMesh&&Ae.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ae.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ae.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ae.instancingMorph===!1&&V.morphTexture!==null||Ae.envMap!==ge||X.fog===!0&&Ae.fog!==ie||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==ne.numPlanes||Ae.numIntersection!==ne.numIntersection)||Ae.vertexAlphas!==Pe||Ae.vertexTangents!==be||Ae.morphTargets!==Te||Ae.morphNormals!==We||Ae.morphColors!==$e||Ae.toneMapping!==st||Ae.morphTargetsCount!==qe)&&(Ze=!0):(Ze=!0,Ae.__version=X.version);let Lt=Ae.currentProgram;Ze===!0&&(Lt=Ti(X,H,V));let In=!1,yt=!1,ai=!1;const tt=Lt.getUniforms(),wt=Ae.uniforms;if(Se.useProgram(Lt.program)&&(In=!0,yt=!0,ai=!0),X.id!==S&&(S=X.id,yt=!0),In||_!==P){Se.buffers.depth.getReversed()?(se.copy(P.projectionMatrix),ic(se),rc(se),tt.setValue(N,"projectionMatrix",se)):tt.setValue(N,"projectionMatrix",P.projectionMatrix),tt.setValue(N,"viewMatrix",P.matrixWorldInverse);const xt=tt.map.cameraPosition;xt!==void 0&&xt.setValue(N,Oe.setFromMatrixPosition(P.matrixWorld)),Be.logarithmicDepthBuffer&&tt.setValue(N,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&tt.setValue(N,"isOrthographic",P.isOrthographicCamera===!0),_!==P&&(_=P,yt=!0,ai=!0)}if(V.isSkinnedMesh){tt.setOptional(N,V,"bindMatrix"),tt.setOptional(N,V,"bindMatrixInverse");const gt=V.skeleton;gt&&(gt.boneTexture===null&&gt.computeBoneTexture(),tt.setValue(N,"boneTexture",gt.boneTexture,L))}V.isBatchedMesh&&(tt.setOptional(N,V,"batchingTexture"),tt.setValue(N,"batchingTexture",V._matricesTexture,L),tt.setOptional(N,V,"batchingIdTexture"),tt.setValue(N,"batchingIdTexture",V._indirectTexture,L),tt.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&tt.setValue(N,"batchingColorTexture",V._colorsTexture,L));const bt=W.morphAttributes;if((bt.position!==void 0||bt.normal!==void 0||bt.color!==void 0)&&Re.update(V,W,Lt),(yt||Ae.receiveShadow!==V.receiveShadow)&&(Ae.receiveShadow=V.receiveShadow,tt.setValue(N,"receiveShadow",V.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(wt.envMap.value=ge,wt.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&H.environment!==null&&(wt.envMapIntensity.value=H.environmentIntensity),yt&&(tt.setValue(N,"toneMappingExposure",T.toneMappingExposure),Ae.needsLights&&Uo(wt,ai),ie&&X.fog===!0&&oe.refreshFogUniforms(wt,ie),oe.refreshMaterialUniforms(wt,X,F,B,v.state.transmissionRenderTarget[P.id]),er.upload(N,qs(Ae),wt,L)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(er.upload(N,qs(Ae),wt,L),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&tt.setValue(N,"center",V.center),tt.setValue(N,"modelViewMatrix",V.modelViewMatrix),tt.setValue(N,"normalMatrix",V.normalMatrix),tt.setValue(N,"modelMatrix",V.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const gt=X.uniformsGroups;for(let xt=0,lr=gt.length;xt<lr;xt++){const gn=gt[xt];z.update(gn,Lt),z.bind(gn,Lt)}}return Lt}function Uo(P,H){P.ambientLightColor.needsUpdate=H,P.lightProbe.needsUpdate=H,P.directionalLights.needsUpdate=H,P.directionalLightShadows.needsUpdate=H,P.pointLights.needsUpdate=H,P.pointLightShadows.needsUpdate=H,P.spotLights.needsUpdate=H,P.spotLightShadows.needsUpdate=H,P.rectAreaLights.needsUpdate=H,P.hemisphereLights.needsUpdate=H}function No(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(P,H,W){const X=Me.get(P);X.__autoAllocateDepthBuffer=P.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),Me.get(P.texture).__webglTexture=H,Me.get(P.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:W,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(P,H){const W=Me.get(P);W.__webglFramebuffer=H,W.__useDefaultFramebuffer=H===void 0};const Fo=N.createFramebuffer();this.setRenderTarget=function(P,H=0,W=0){M=P,y=H,E=W;let X=!0,V=null,ie=!1,le=!1;if(P){const ge=Me.get(P);if(ge.__useDefaultFramebuffer!==void 0)Se.bindFramebuffer(N.FRAMEBUFFER,null),X=!1;else if(ge.__webglFramebuffer===void 0)L.setupRenderTarget(P);else if(ge.__hasExternalTextures)L.rebindTextures(P,Me.get(P.texture).__webglTexture,Me.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Te=P.depthTexture;if(ge.__boundDepthTexture!==Te){if(Te!==null&&Me.has(Te)&&(P.width!==Te.image.width||P.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(P)}}const Pe=P.texture;(Pe.isData3DTexture||Pe.isDataArrayTexture||Pe.isCompressedArrayTexture)&&(le=!0);const be=Me.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(be[H])?V=be[H][W]:V=be[H],ie=!0):P.samples>0&&L.useMultisampledRTT(P)===!1?V=Me.get(P).__webglMultisampledFramebuffer:Array.isArray(be)?V=be[W]:V=be,b.copy(P.viewport),C.copy(P.scissor),D=P.scissorTest}else b.copy(re).multiplyScalar(F).floor(),C.copy(_e).multiplyScalar(F).floor(),D=Ce;if(W!==0&&(V=Fo),Se.bindFramebuffer(N.FRAMEBUFFER,V)&&X&&Se.drawBuffers(P,V),Se.viewport(b),Se.scissor(C),Se.setScissorTest(D),ie){const ge=Me.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+H,ge.__webglTexture,W)}else if(le){const ge=Me.get(P.texture),Pe=H;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,ge.__webglTexture,W,Pe)}else if(P!==null&&W!==0){const ge=Me.get(P.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ge.__webglTexture,W)}S=-1},this.readRenderTargetPixels=function(P,H,W,X,V,ie,le){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=Me.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&le!==void 0&&(de=de[le]),de){Se.bindFramebuffer(N.FRAMEBUFFER,de);try{const ge=P.texture,Pe=ge.format,be=ge.type;if(!Be.textureFormatReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=P.width-X&&W>=0&&W<=P.height-V&&N.readPixels(H,W,X,V,Ie.convert(Pe),Ie.convert(be),ie)}finally{const ge=M!==null?Me.get(M).__webglFramebuffer:null;Se.bindFramebuffer(N.FRAMEBUFFER,ge)}}},this.readRenderTargetPixelsAsync=async function(P,H,W,X,V,ie,le){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=Me.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&le!==void 0&&(de=de[le]),de)if(H>=0&&H<=P.width-X&&W>=0&&W<=P.height-V){Se.bindFramebuffer(N.FRAMEBUFFER,de);const ge=P.texture,Pe=ge.format,be=ge.type;if(!Be.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Te),N.bufferData(N.PIXEL_PACK_BUFFER,ie.byteLength,N.STREAM_READ),N.readPixels(H,W,X,V,Ie.convert(Pe),Ie.convert(be),0);const We=M!==null?Me.get(M).__webglFramebuffer:null;Se.bindFramebuffer(N.FRAMEBUFFER,We);const $e=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await nc(N,$e,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Te),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ie),N.deleteBuffer(Te),N.deleteSync($e),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(P,H=null,W=0){const X=Math.pow(2,-W),V=Math.floor(P.image.width*X),ie=Math.floor(P.image.height*X),le=H!==null?H.x:0,de=H!==null?H.y:0;L.setTexture2D(P,0),N.copyTexSubImage2D(N.TEXTURE_2D,W,0,0,le,de,V,ie),Se.unbindTexture()};const Oo=N.createFramebuffer(),Bo=N.createFramebuffer();this.copyTextureToTexture=function(P,H,W=null,X=null,V=0,ie=null){ie===null&&(V!==0?(Qi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=V,V=0):ie=0);let le,de,ge,Pe,be,Te,We,$e,st;const it=P.isCompressedTexture?P.mipmaps[ie]:P.image;if(W!==null)le=W.max.x-W.min.x,de=W.max.y-W.min.y,ge=W.isBox3?W.max.z-W.min.z:1,Pe=W.min.x,be=W.min.y,Te=W.isBox3?W.min.z:0;else{const bt=Math.pow(2,-V);le=Math.floor(it.width*bt),de=Math.floor(it.height*bt),P.isDataArrayTexture?ge=it.depth:P.isData3DTexture?ge=Math.floor(it.depth*bt):ge=1,Pe=0,be=0,Te=0}X!==null?(We=X.x,$e=X.y,st=X.z):(We=0,$e=0,st=0);const qe=Ie.convert(H.format),Ae=Ie.convert(H.type);let ft;H.isData3DTexture?(L.setTexture3D(H,0),ft=N.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(L.setTexture2DArray(H,0),ft=N.TEXTURE_2D_ARRAY):(L.setTexture2D(H,0),ft=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,H.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,H.unpackAlignment);const Ze=N.getParameter(N.UNPACK_ROW_LENGTH),Lt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),In=N.getParameter(N.UNPACK_SKIP_PIXELS),yt=N.getParameter(N.UNPACK_SKIP_ROWS),ai=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,it.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,it.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Pe),N.pixelStorei(N.UNPACK_SKIP_ROWS,be),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Te);const tt=P.isDataArrayTexture||P.isData3DTexture,wt=H.isDataArrayTexture||H.isData3DTexture;if(P.isDepthTexture){const bt=Me.get(P),gt=Me.get(H),xt=Me.get(bt.__renderTarget),lr=Me.get(gt.__renderTarget);Se.bindFramebuffer(N.READ_FRAMEBUFFER,xt.__webglFramebuffer),Se.bindFramebuffer(N.DRAW_FRAMEBUFFER,lr.__webglFramebuffer);for(let gn=0;gn<ge;gn++)tt&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Me.get(P).__webglTexture,V,Te+gn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Me.get(H).__webglTexture,ie,st+gn)),N.blitFramebuffer(Pe,be,le,de,We,$e,le,de,N.DEPTH_BUFFER_BIT,N.NEAREST);Se.bindFramebuffer(N.READ_FRAMEBUFFER,null),Se.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||P.isRenderTargetTexture||Me.has(P)){const bt=Me.get(P),gt=Me.get(H);Se.bindFramebuffer(N.READ_FRAMEBUFFER,Oo),Se.bindFramebuffer(N.DRAW_FRAMEBUFFER,Bo);for(let xt=0;xt<ge;xt++)tt?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,bt.__webglTexture,V,Te+xt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,bt.__webglTexture,V),wt?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,gt.__webglTexture,ie,st+xt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,gt.__webglTexture,ie),V!==0?N.blitFramebuffer(Pe,be,le,de,We,$e,le,de,N.COLOR_BUFFER_BIT,N.NEAREST):wt?N.copyTexSubImage3D(ft,ie,We,$e,st+xt,Pe,be,le,de):N.copyTexSubImage2D(ft,ie,We,$e,Pe,be,le,de);Se.bindFramebuffer(N.READ_FRAMEBUFFER,null),Se.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else wt?P.isDataTexture||P.isData3DTexture?N.texSubImage3D(ft,ie,We,$e,st,le,de,ge,qe,Ae,it.data):H.isCompressedArrayTexture?N.compressedTexSubImage3D(ft,ie,We,$e,st,le,de,ge,qe,it.data):N.texSubImage3D(ft,ie,We,$e,st,le,de,ge,qe,Ae,it):P.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ie,We,$e,le,de,qe,Ae,it.data):P.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ie,We,$e,it.width,it.height,qe,it.data):N.texSubImage2D(N.TEXTURE_2D,ie,We,$e,le,de,qe,Ae,it);N.pixelStorei(N.UNPACK_ROW_LENGTH,Ze),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Lt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,In),N.pixelStorei(N.UNPACK_SKIP_ROWS,yt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ai),ie===0&&H.generateMipmaps&&N.generateMipmap(ft),Se.unbindTexture()},this.copyTextureToTexture3D=function(P,H,W=null,X=null,V=0){return Qi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,H,W,X,V)},this.initRenderTarget=function(P){Me.get(P).__webglFramebuffer===void 0&&L.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?L.setTextureCube(P,0):P.isData3DTexture?L.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?L.setTexture2DArray(P,0):L.setTexture2D(P,0),Se.unbindTexture()},this.resetState=function(){y=0,E=0,M=null,Se.reset(),et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return en}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}document.addEventListener("DOMContentLoaded",function(){const s=document.getElementById("threejs");if(!s)return;const e=/Mobi|Android/i.test(navigator.userAgent),t=new Eo,i=new wo(-1,1,1,-1,.1,10);i.position.z=1;const r=new Lo({alpha:!0});r.setSize(window.innerWidth,window.innerHeight),r.setClearColor(0,0),s.appendChild(r.domElement);const n={u_resolution:{value:new Ke(window.innerWidth,window.innerHeight)},u_time:{value:0},u_mouse:{value:new Ke(0,0)},u_orientation:{value:new Ke(0,0)},u_is_mobile:{value:e?1:0}},o=new ri(2,2),a=new Wt({fragmentShader:`
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_orientation;
      uniform float u_is_mobile;

      vec3 rainbowColor(float position, float time) {
        vec3 palette[8] = vec3[](
          vec3(0.9490, 0.0000, 1.0000),
          vec3(0.9608, 0.1961, 0.8627),
          vec3(0.9804, 0.2353, 0.7255),
          vec3(0.9882, 0.2745, 0.5686),
          vec3(0.9961, 0.3137, 0.3922),
          vec3(1.0000, 0.4706, 0.2549),
          vec3(1.0000, 0.6275, 0.1176),
          vec3(1.0000, 0.7843, 0.0000)
        );

        float pattern = fract(position * 0.5 + time * 0.1);
        float index = pattern * 8.0;
        int i0 = int(floor(index));
        int i1 = int(ceil(index));
        float t = fract(index);

        i0 = i0 % 8;
        i1 = i1 % 8;

        return mix(palette[i0], palette[i1], t);
      }

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        vec2 influence = mix(u_mouse, u_orientation, u_is_mobile);
        influence.y *= -1.0;
        influence *= 2.0;

        float base_pattern = 0.0;
        base_pattern += sin(st.x * 10.0 + u_time * 0.5 + influence.x * 0.5) * 0.5 + 0.5;
        base_pattern += cos(st.y * 10.0 + u_time * 0.3 + influence.y * 0.5) * 0.5 + 0.5;

        float noise_val = noise(st * 5.0 + u_time * 0.2 + influence * 0.1) * 0.5;

        float combined_pattern = base_pattern * 0.7 + noise_val * 0.3;

        vec2 distorted_st = st + vec2(
          cos(combined_pattern * 3.14159 * 2.0 + influence.x * 0.5) * 0.05,
          sin(combined_pattern * 3.14159 * 2.0 + influence.y * 0.5) * 0.05
        );

        float color_intensity = 0.0;
        color_intensity += sin(distorted_st.x * 8.0 + cos(u_time * 0.5 + distorted_st.y * 10.0 + sin(distorted_st.x * 12.0 + u_time * 1.0))) * 0.8;
        color_intensity += cos(distorted_st.y * 8.0 + sin(u_time * 0.3 + distorted_st.x * 10.0 + cos(distorted_st.y * 12.0 + u_time * 1.0))) * 0.8;

        vec3 final_color = rainbowColor(color_intensity * 0.5 + 0.5, u_time * 0.5);

        gl_FragColor = vec4(final_color, 1.0);
      }
    `,uniforms:n}),c=new zt(o,a);t.add(c);const f=new zc,u={x:0,y:0},d=()=>{a.uniforms.u_time.value=f.getElapsedTime(),e?a.uniforms.u_orientation.value.set(m.gamma*.01,m.beta*.01):a.uniforms.u_mouse.value.set(u.x,u.y),r.render(t,i),requestAnimationFrame(d)};d();const h=()=>{r.setSize(window.innerWidth,window.innerHeight),a.uniforms.u_resolution.value.set(window.innerWidth,window.innerHeight)};window.addEventListener("resize",h);const l=g=>{u.x=g.clientX/window.innerWidth*2-1,u.y=-(g.clientY/window.innerHeight)*2+1};e||window.addEventListener("mousemove",l);const m={beta:0,gamma:0};e&&window.addEventListener("deviceorientation",g=>{m.beta=g.beta||0,m.gamma=g.gamma||0})});document.addEventListener("DOMContentLoaded",function(){const s=document.createElement("div");s.id="glow-effect",s.style.position="absolute",s.style.top="0",s.style.left="0",s.style.width="100%",s.style.height="100%",s.style.pointerEvents="none",s.style.zIndex="1";const e=document.querySelector(".logo-section");if(e&&e.parentNode&&e.parentNode.insertBefore(s,e),!s)return;const t=Date.now(),i=new Eo,r=window.innerWidth,n=window.innerHeight,o=new Pt(75,r/n,.1,1e3);o.lookAt(i.position),o.position.z=10;const a=new Lo({antialias:!0,alpha:!0});a.setPixelRatio(window.devicePixelRatio),a.setClearColor(0,0),a.setSize(r,n),s.appendChild(a.domElement),window.addEventListener("resize",function(){a.setSize(r,n)}),new Oc;const c=document.createElement("canvas");c.width=512,c.height=512;const f=c.getContext("2d"),u=f.createRadialGradient(c.width/2,c.height/2,0,c.width/2,c.height/2,c.width/2);u.addColorStop(0,"rgba(255, 255, 255, 0.3)"),u.addColorStop(.5,"rgba(255, 255, 255, 0.1)"),u.addColorStop(1,"rgba(255, 255, 255, 0)"),f.fillStyle=u,f.fillRect(0,0,c.width,c.height);const d=new Aa(c),h=document.createElement("canvas");h.width=512,h.height=512;const l=h.getContext("2d");for(let C=0;C<h.height;C++)for(let D=0;D<h.width;D++)l.fillStyle=`rgba(
        ${Math.floor(Math.random()*255)},
        ${Math.floor(Math.random()*255)},
        ${Math.floor(Math.random()*255)},
        1)`,l.fillRect(D,C,1,1);const m=new Aa(h),g=[new k(1,0,0),new k(0,0,1),new k(1,.5,0),new k(.5,0,1),new k(0,1,0),new k(1,1,0)],p=[],v=[],A=20;for(let C=0;C<A;C++){const D=new Wt({uniforms:{_time:{value:1},_random:{value:Math.random()*2-1},_mask:{value:d},_dist:{value:m},_color:{value:g[C%g.length]},_scale:{value:1}},vertexShader:document.getElementById("glowVertexShader").textContent,fragmentShader:document.getElementById("glowFragmentShader").textContent,transparent:!0,blending:Hr});p.push(D)}const w=new ri(4,4,1);for(let C=0;C<p.length;C++){const D=new zt(w,p[C]);i.add(D);const U=1,I=Math.random()*Math.PI*2;D.position.x=Math.cos(I)*U*Math.random(),D.position.y=Math.sin(I)*U*Math.random(),D.position.z=-2+C*.05;const O=.3+Math.random()*.7;D.scale.set(O,O,1),v.push(D)}let T=1,x=1,y=!1,E=3e-4,M=3e-4;const S=document.querySelector(".logo-wrapper");S&&S.addEventListener("click",()=>{x=.5,M=.002,y=!0,setTimeout(()=>{x=1,M=3e-4},200)});const _=document.querySelector(".download-link");_&&_.addEventListener("click",()=>{x=1.5,M=.01,y=!0,setTimeout(()=>{x=1.1},300),setTimeout(()=>{x=1.3},600),setTimeout(()=>{x=1,M=3e-4},1e3)});function b(){requestAnimationFrame(b);const C=Date.now()-t,D=C/1e3;y&&(T+=(x-T)*.05,E+=(M-E)*.05,Math.abs(T-x)<.01&&Math.abs(E-M)<1e-4&&(y=!1));for(let U=0;U<p.length;U++){p[U].uniforms._time.value=20*p[U].uniforms._random.value*D*(1+E*5),p[U].uniforms._scale.value=T;const I=v[U],O=E*C*5e-4*(U%2===0?1:-1),B=Math.sqrt(I.position.x*I.position.x+I.position.y*I.position.y),F=Math.atan2(I.position.y,I.position.x);I.position.x=Math.cos(F+O)*B,I.position.y=Math.sin(F+O)*B}a.render(i,o)}b()});
