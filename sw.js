if(!self.define){let e,s={};const i=(i,t)=>(i=new URL(i+".js",t).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(t,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const l=e=>i(e,r),c={module:{uri:r},exports:o,require:l};s[r]=Promise.all(t.map((e=>c[e]||l(e)))).then((e=>(n(...e),o)))}}define(["./workbox-3bd99cbd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/main-DdbwSP5q.js",revision:null},{url:"assets/style-BCVt5T5S.css",revision:null},{url:"home.html",revision:"15dc7d37555c4a3b7c503a4eaa722c11"},{url:"index.html",revision:"d89df127079582f0e0cf2b568fcd64a7"},{url:"registerSW.js",revision:"aea5b667d5da3c508e0aa692308c98fe"},{url:"manifest.webmanifest",revision:"6f175067b9953738f11b72bb0bae6a00"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute((({request:e})=>"document"===e.destination),new e.NetworkFirst,"GET"),e.registerRoute((({request:e})=>"image"===e.destination),new e.CacheFirst,"GET")}));
