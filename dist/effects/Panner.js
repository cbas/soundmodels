/*soundmodels - v2.3.0 - Wed Mar 04 2015 11:42:06 GMT+0800 (SGT) */console.log("Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library v2.3.0.");
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Panner = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Panner(e){function t(e){return e/90}function n(e,t){var n=parseInt(t),r=n+90;r>90&&(r=180-r);var i=Math.sin(n*(Math.PI/180)),o=Math.sin(r*(Math.PI/180));a.setPosition(i,0,o)}if(!(this instanceof Panner))throw new TypeError("Panner constructor cannot be called as a function.");BaseEffect.call(this,e),this.maxSources=0,this.minSources=0,this.effectName="Panner";var a,r="function"==typeof this.audioContext.createStereoPanner;r?(console.log("using native panner"),a=this.audioContext.createStereoPanner()):(console.log("using 3D panner"),a=this.audioContext.createPanner()),this.inputNode=a,this.outputNode=a,r?this.registerParameter(new SPAudioParam(this,"pan",-90,90,0,a.pan,t),!1):this.registerParameter(new SPAudioParam(this,"pan",-90,90,0,null,null,n),!1),this.isInitialized=!0}var BaseEffect=_dereq_("../core/BaseEffect"),SPAudioParam=_dereq_("../core/SPAudioParam");Panner.prototype=Object.create(BaseEffect.prototype),module.exports=Panner;
},{"../core/BaseEffect":3,"../core/SPAudioParam":5}],2:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],3:[function(_dereq_,module,exports){
"use strict";function BaseEffect(t){function e(t){function e(){i.start(0),i.stop(t.currentTime+1e-4),window.liveAudioContexts.push(t),window.removeEventListener("touchstart",e)}var n=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(n&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(t)<0)){var i=t.createOscillator(),o=t.createGain();o.gain.value=0,i.connect(o),o.connect(t.destination),window.addEventListener("touchstart",e)}}void 0===t||null===t?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=t,e(this.audioContext),this.inputNode=null,Object.defineProperty(this,"numberOfInputs",{enumerable:!0,configurable:!1,get:function(){return this.inputNode.numberOfOutputs||0}}),this.outputNode=null,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.outputNode.numberOfOutputs||0}}),this.isPlaying=!1,this.isInitialized=!1,this.destinations=[],this.effectName="Effect",this.isBaseEffect=!0,this.parameterList_=[]}_dereq_("../core/AudioContextMonkeyPatch"),BaseEffect.prototype.connect=function(t,e,n){t instanceof AudioNode?(this.outputNode.connect(t,e,n),this.destinations.push({destination:t,output:e,input:n})):t.inputNode instanceof AudioNode?(this.outputNode.connect(t.inputNode,e,n),this.destinations.push({destination:t.inputNode,output:e,input:n})):console.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseEffect.prototype.disconnect=function(t){this.outputNode.disconnect(t),this.destinations=[]},BaseEffect.prototype.registerParameter=function(t,e){(void 0===e||null===e)&&(e=!1),Object.defineProperty(this,t.name,{enumerable:!0,configurable:e,value:t});var n=this,i=!1;this.parameterList_.forEach(function(e,o){e.name===t.name&&(n.parameterList_.splice(o,1,t),i=!0)}),i||this.parameterList_.push(t)},BaseEffect.prototype.listParams=function(){return this.parameterList_},module.exports=BaseEffect;


},{"../core/AudioContextMonkeyPatch":2}],4:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=256,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],5:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,n,i,o,u,r){var l,c=1e-4,f=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(t){if(typeof t!=typeof i)return void console.error("Attempt to set a "+typeof i+" parameter to a "+typeof t+" value");if("number"==typeof t&&(t>n?(console.warn(this.name+" clamping to max"),t=n):a>t&&(console.warn(this.name+" clamping to min"),t=a)),s=t,"function"==typeof u&&(t=u(t)),m||window.clearInterval(l),m=!1,"function"==typeof r&&e.audioContext)r(o,t,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(t,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):a.setValueAtTime(t,e.audioContext.currentTime)})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof i?(this.defaultValue=i,this.value=i):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof n?this.maxValue=n:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var n=this;webAudioDispatch(function(){n.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,n){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,n):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,n)});else{var i=this,r=i.value,s=e.audioContext.currentTime;console.log("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,i.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/n),Math.abs(i.value-t)<c&&window.clearInterval(l))},f)}},this.setValueCurveAtTime=function(t,a,n){if(o){if("function"==typeof u)for(var i=0;i<t.length;i++)t[i]=u(t[i]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,n):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,n)})}else{var r=this,c=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var i=Math.floor(t.length*(e.audioContext.currentTime-c)/n);i<t.length?(m=!0,r.value=t[i]):window.clearInterval(l)}},f)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var n=this,i=n.value,r=e.audioContext.currentTime;0===i&&(i=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,n.value=i*Math.pow(t/i,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},f)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var n=this,i=n.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,n.value=i+(t-i)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},f)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config");SPAudioParam.createPsuedoParam=function(e,t,a,n,i){return new SPAudioParam(e,t,a,n,i,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":4,"../core/WebAudioDispatch":6}],6:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(o,e,i){if(!i)return void console.warn("No AudioContext provided");var t=i.currentTime;t>=e||.005>e-t?o():window.setTimeout(function(){o()},1e3*(e-t))}module.exports=WebAudioDispatch;


},{}]},{},[1])(1)
});