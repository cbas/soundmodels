/*soundmodels - v2.3.0 - Wed Mar 04 2015 11:42:06 GMT+0800 (SGT) */console.log("Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library v2.3.0.");
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Trigger = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function Trigger(e,t,o,r,i,a){function n(e){multiFileLoader.call(h,e,h.audioContext,h.onLoadProgress,m),c=e}if(!(this instanceof Trigger))throw new TypeError("Trigger constructor cannot be called as a function.");BaseSound.call(this,e),this.maxSources=Config.MAX_VOICES,this.minSources=1,this.modelName="Trigger",this.onLoadProgress=o,this.onLoadComplete=r;var u=i,s=a;Object.defineProperty(this,"onAudioStart",{enumerable:!0,configurable:!1,set:function(e){d&&(u=e,d.onAudioStart=e)},get:function(){return u}}),Object.defineProperty(this,"onAudioEnd",{enumerable:!0,configurable:!1,set:function(e){s=e,d&&(d.onAudioEnd=e)},get:function(){return s}});var d,c,h=this,l=[],p=0,f=0,m=function(e,t){l=t,d.connect(h.releaseGainNode),e&&(h.isInitialized=!0),"function"==typeof h.onLoadComplete&&h.onLoadComplete(e,t)};this.registerParameter(SPAudioParam.createPsuedoParam(this,"pitchShift",-60,60,0)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"pitchRand",0,24,0)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"eventRand",!0,!1,!1)),this.setSources=function(e,t,o){BaseSound.prototype.setSources.call(this,e,t,o),n(e)},this.stop=function(e){d.stop(e),BaseSound.prototype.stop.call(this,e)},this.pause=function(){d.pause(),BaseSound.prototype.pause.call(this)},this.play=function(){this.start(0)},this.start=function(e,t,o,r){if(!this.isInitialized)return void console.error(this.modelName,"hasn't finished Initializing yet. Please wait before calling start/play");("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var i=1;"[object Array]"===Object.prototype.toString.call(c)&&(i=c.length),this.eventRand.value?f=i>2?(f+Math.floor(Math.random()*(i-1)))%i:Math.floor(Math.random()*(i-1)):f%=i;var a=e,n=Converter.semitonesToRatio(this.pitchShift.value+Math.random()*this.pitchRand.value);d.queueSetSource(a,p,l[f]),d.queueSetParameter(a,p,"playSpeed",n),d.queueStart(a,p),p++,f++,BaseSound.prototype.start.call(this,e,t,o,r)},d=new SoundQueue(this.audioContext,this.onAudioStart,this.onAudioEnd),window.setTimeout(function(){n(t)},0)}var Config=_dereq_("../core/Config"),BaseSound=_dereq_("../core/BaseSound"),SoundQueue=_dereq_("../core/SoundQueue"),SPAudioParam=_dereq_("../core/SPAudioParam"),multiFileLoader=_dereq_("../core/multiFileLoader"),Converter=_dereq_("../core/Converter");Trigger.prototype=Object.create(BaseSound.prototype),module.exports=Trigger;
},{"../core/BaseSound":3,"../core/Config":4,"../core/Converter":5,"../core/SPAudioParam":10,"../core/SoundQueue":12,"../core/multiFileLoader":14}],2:[function(_dereq_,module,exports){
"use strict";function AudioContextMonkeyPatch(){window.AudioContext=window.AudioContext||window.webkitAudioContext}module.exports=AudioContextMonkeyPatch;


},{}],3:[function(_dereq_,module,exports){
"use strict";function BaseSound(e){function t(e){function t(){n.start(0),n.stop(e.currentTime+1e-4),window.liveAudioContexts.push(e),window.removeEventListener("touchstart",t)}var i=/(iPad|iPhone|iPod)/g.test(navigator.userAgent);if(i&&(window.liveAudioContexts||(window.liveAudioContexts=[]),window.liveAudioContexts.indexOf(e)<0)){var n=e.createOscillator(),o=e.createGain();o.gain.value=0,n.connect(o),o.connect(e.destination),window.addEventListener("touchstart",t)}}void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,t(this.audioContext),this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var i=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),i=Math.round(e)},get:function(){return i}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.destinations=[],this.modelName="Model",this.onLoadProgress=null,this.onLoadComplete=null,this.onAudioStart=null,this.onAudioEnd=null,this.isBaseSound=!0,this.parameterList_=[],this.connect(this.audioContext.destination)}_dereq_("../core/AudioContextMonkeyPatch");var webAudioDispatch=_dereq_("../core/WebAudioDispatch");BaseSound.prototype.connect=function(e,t,i){e instanceof AudioNode?(this.releaseGainNode.connect(e,t,i),this.destinations.push({destination:e,output:t,input:i})):e.inputNode instanceof AudioNode?(this.releaseGainNode.connect(e.inputNode,t,i),this.destinations.push({destination:e.inputNode,output:t,input:i})):console.error("No Input Connection - Attempts to connect "+typeof e+" to "+typeof this)},BaseSound.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e),this.destinations=[]},BaseSound.prototype.start=function(e,t,i,n){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),this.releaseGainNode.gain.cancelScheduledValues(e),"undefined"!=typeof n?(this.releaseGainNode.gain.setValueAtTime(0,e),this.releaseGainNode.gain.linearRampToValueAtTime(1,e+n)):this.releaseGainNode.gain.setValueAtTime(1,e);var o=this;webAudioDispatch(function(){o.isPlaying=!0},e,this.audioContext)},BaseSound.prototype.stop=function(e){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var t=this;webAudioDispatch(function(){t.isPlaying=!1},e,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(e)},BaseSound.prototype.release=function(e,t,i){if(this.isPlaying){var n=.5;if(("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),!i){var o=this;webAudioDispatch(function(){o.pause()},e+t,this.audioContext)}}},BaseSound.prototype.setSources=function(e,t,i){this.isInitialized=!1,"function"==typeof t&&(this.onLoadProgress=t),"function"==typeof i&&(this.onLoadComplete=i)},BaseSound.prototype.play=function(){this.start(0)},BaseSound.prototype.pause=function(){this.isPlaying=!1},BaseSound.prototype.registerParameter=function(e,t){(void 0===t||null===t)&&(t=!1),Object.defineProperty(this,e.name,{enumerable:!0,configurable:t,value:e});var i=this,n=!1;this.parameterList_.forEach(function(t,o){t.name===e.name&&(i.parameterList_.splice(o,1,e),n=!0)}),n||this.parameterList_.push(e)},BaseSound.prototype.listParams=function(){return this.parameterList_},BaseSound.prototype.setOutputEffect=function(e){this.disconnect(),this.connect(e),e.connect(this.audioContext.destination)},module.exports=BaseSound;


},{"../core/AudioContextMonkeyPatch":2,"../core/WebAudioDispatch":13}],4:[function(_dereq_,module,exports){
"use strict";function Config(){}Config.LOG_ERRORS=!0,Config.ZERO=parseFloat("1e-37"),Config.MAX_VOICES=8,Config.NOMINAL_REFRESH_RATE=60,Config.WINDOW_LENGTH=512,Config.CHUNK_LENGTH=256,Config.DEFAULT_SMOOTHING_CONSTANT=.05,module.exports=Config;


},{}],5:[function(_dereq_,module,exports){
"use strict";function Converter(){}Converter.semitonesToRatio=function(t){return Math.pow(2,t/12)},Converter.ratioToDBFS=function(t){return 20*Math.log10(t)},Converter.dBFStoRatio=function(t){return Math.pow(10,t/20)},module.exports=Converter;


},{}],6:[function(_dereq_,module,exports){
"use strict";function DetectLoopMarkers(r){var e=0,n=0,t=!0,u=5e3,a=44100,o=.5,l=2e4,f=.01,c=1024,i=16,s=[],d=0,h=function(r,e){for(var n=0,t=e+i;e+i+c>t;++t)n+=Math.abs(r[t]);return f>n/c},v=function(r){return function(e,n,t){var u;return u=t%2===0?n[r]>o:n[r]<-o,e&&u}},b=function(t){var o=null,f=null;e=0,n=d;for(var c=0;null===o&&d>c&&l>c;){if(t.reduce(v(c),!0)&&(1!==t.length||h(t[0],c))){o=c;break}c++}for(c=d;null===f&&c>0&&l>d-c;){if(t.reduce(v(c),!0)){f=c;break}c--}var i=Math.round(u/2*r.sampleRate/a);return null!==o&&null!==f&&f>o+i?(e=o+i,n=f-i,!0):!1},k=function(r){return function(e,n){return e&&Math.abs(n[r])<f}},p=function(r){var t=!0;for(e=0;l>e&&d>e&&(t=r.reduce(k(e),!0));)e++;for(n=d;l>d-n&&n>0&&(t=r.reduce(k(n),!0));)n--;e>n&&(e=0)};d=r.length;for(var M=0;M<r.numberOfChannels;M++)s.push(new Float32Array(r.getChannelData(M)));return b(s)||(p(s),t=!1),{marked:t,start:e,end:n}}module.exports=DetectLoopMarkers;


},{}],7:[function(_dereq_,module,exports){
"use strict";function FileLoader(e,r,t,n){function o(){var r=Object.prototype.toString.call(e),t=/[^.]+$/.exec(e);if("[object String]"===r){var o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType="arraybuffer",o.addEventListener("progress",n,!1),o.onload=function(){a(o.response,t)},o.send()}else if("[object File]"===r||"[object Blob]"===r){var i=new FileReader;i.addEventListener("progress",n,!1),i.onload=function(){a(i.result,t)},i.readAsArrayBuffer(e)}}function a(n,o){r.decodeAudioData(n,function(e){if(u=!0,i=e,f=0,s=i.length,"wav"!==o[0]){var r=detectLoopMarkers(i);r&&(f=r.start,s=r.end)}t&&"function"==typeof t&&t(!0)},function(){console.warn("Error Decoding "+e),t&&"function"==typeof t&&t(!1)})}if(!(this instanceof FileLoader))throw new TypeError("FileLoader constructor cannot be called as a function.");var i,f=0,s=0,u=!1,c=function(e){var r=/^[0-9]+$/;return r.test(e)?!0:!1},l=function(e,t){"undefined"==typeof t&&(t=i.length),c(e)?c(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=Number.isNan(t)?0:Math.round(Number(t))):(e=Number.isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>s||f>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+f),e=f),(t>s||f>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+i.length+" . Setting start to "+s),t=s);var n=t-e;if(!i)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var o=r.createBuffer(i.numberOfChannels,n,i.sampleRate),a=0;a<i.numberOfChannels;a++){var u=new Float32Array(i.getChannelData(a));o.getChannelData(a).set(u.subarray(e,t))}return o};this.getBuffer=function(e,r){return"undefined"==typeof e&&(e=0),"undefined"==typeof r&&(r=s-f),l(f+e,f+r)},this.getRawBuffer=function(){return u?i:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return u},o()}var detectLoopMarkers=_dereq_("../core/DetectLoopMarkers");module.exports=FileLoader;


},{"../core/DetectLoopMarkers":6}],8:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,n,r,o){if(!(e instanceof AudioContext))return void console.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void console.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void console.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void console.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void console.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void console.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void console.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),n=0;n<a.numberOfChannels;n++){var r=new Float32Array(a.getChannelData(n));i.getChannelData(n).set(r.subarray(e,t))}}}else this.duration=0};var s=Object.prototype.toString.call(t),l=Object.prototype.toString.call(n),h=Object.prototype.toString.call(r),d=Object.prototype.toString.call(o);"[object String]"===s||"[object File]"===s?this.sourceURL=t:"[object AudioBuffer]"===s?this.buffer=t:console.warn("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===l?this.startPoint=parseFloat(n):"[object Undefined]"!==l&&console.warn("Incorrect Parameter Type. startPoint should be a Number"),"[object Number]"===h?this.endPoint=parseFloat(r):"[object Undefined]"!==l&&console.warn("Incorrect Parameter Type. endPoint should be a Number"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}module.exports=SPAudioBuffer;


},{}],9:[function(_dereq_,module,exports){
"use strict";function SPAudioBufferSourceNode(e){function t(t){for(var n=new Float32Array(t.length),a=e.createBuffer(1,t.length,44100),o=0;o<t.length;o++)n[o]=o;return a.getChannelData(0).set(n),a}function n(){i.connect(u),r.connect(c),u.connect(c),u.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);f=t[t.length-1]||0}function o(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var r=e.createBufferSource(),i=e.createBufferSource(),u=e.createScriptProcessor(256,1,1),c=e.createGain(),f=0;this.audioContext=e,this.channelCount=r.channelCount,this.channelCountMode=r.channelCountMode,this.channelInterpretation=r.channelInterpretation,this.numberOfInputs=r.numberOfInputs,this.numberOfOutputs=r.numberOfOutputs,this.playbackState=0,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=new SPPlaybackRateParam(this,r.playbackRate,i.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){r.loopEnd=e,i.loopEnd=e},get:function(){return r.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){r.loopStart=e,i.loopStart=e},get:function(){return r.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){r.onended=o(this,e)},get:function(){return r.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){r.loop=e,i.loop=e},get:function(){return r.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return f}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(e){e.isSPAudioBuffer?(r.buffer=e.buffer,i.buffer=t(e.buffer)):e instanceof AudioBuffer&&(r.buffer=e,i.buffer=t(e))},get:function(){return r.buffer}}),Object.defineProperty(this,"gain",{enumerable:!0,configurable:!1,get:function(){return c.gain}}),this.connect=function(e,t,n){c.connect(e,t,n)},this.disconnect=function(e){c.disconnect(e)},this.start=function(e,t,n){"undefined"==typeof n&&(n=r.buffer.duration),"undefined"==typeof t&&(t=0),this.playbackState===this.UNSCHEDULED_STATE&&(r.start(e,t,n),i.start(e,t,n),this.playbackState=this.SCHEDULED_STATE);var a=this;webAudioDispatch(function(){a.playbackState=a.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(r.stop(e),i.stop(e))},this.resetBufferSource=function(t,n){var a=this;webAudioDispatch(function(){u.disconnect();var t=a.audioContext.createGain();t.gain.value=c.gain.value,c=t;var f=a.audioContext.createBufferSource();f.buffer=r.buffer,f.loopStart=r.loopStart,f.loopEnd=r.loopEnd,f.onended=o(a,r.onended),r.onended=null,i.disconnect();var s=e.createBufferSource();s.buffer=i.buffer,r=f,i=s;var l=a.playbackRate.value;a.playbackRate=new SPPlaybackRateParam(a,r.playbackRate,i.playbackRate),a.playbackRate.setValueAtTime(l,0),i.connect(u),r.connect(c),u.connect(c),a.connect(n),a.playbackState=a.UNSCHEDULED_STATE},t,this.audioContext)},n()}var SPPlaybackRateParam=_dereq_("../core/SPPlaybackRateParam"),webAudioDispatch=_dereq_("../core/WebAudioDispatch");module.exports=SPAudioBufferSourceNode;


},{"../core/SPPlaybackRateParam":11,"../core/WebAudioDispatch":13}],10:[function(_dereq_,module,exports){
"use strict";function SPAudioParam(e,t,a,n,i,o,u,r){var l,c=1e-4,f=500,s=0,m=!1;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",this.isSPAudioParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(t){if(typeof t!=typeof i)return void console.error("Attempt to set a "+typeof i+" parameter to a "+typeof t+" value");if("number"==typeof t&&(t>n?(console.warn(this.name+" clamping to max"),t=n):a>t&&(console.warn(this.name+" clamping to min"),t=a)),s=t,"function"==typeof u&&(t=u(t)),m||window.clearInterval(l),m=!1,"function"==typeof r&&e.audioContext)r(o,t,e.audioContext);else if(o){if(o instanceof AudioParam){var c=[];c.push(o),o=c}o.forEach(function(a){e.isPlaying?a.setTargetAtTime(t,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT):a.setValueAtTime(t,e.audioContext.currentTime)})}},get:function(){return s}}),o&&(o instanceof AudioParam||o instanceof Array))var d=o[0]||o;t?this.name=t:d&&(this.name=d.name),"undefined"!=typeof i?(this.defaultValue=i,this.value=i):d&&(this.defaultValue=d.defaultValue,this.value=d.defaultValue),"undefined"!=typeof a?this.minValue=a:d&&(this.minValue=d.minValue),"undefined"!=typeof n?this.maxValue=n:d&&(this.maxValue=d.maxValue),this.setValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.setValueAtTime(t,a)});else{var n=this;webAudioDispatch(function(){n.value=t},a,e.audioContext)}},this.setTargetAtTime=function(t,a,n){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.setTargetAtTime(t,a,n):o instanceof Array&&o.forEach(function(e){e.setTargetAtTime(t,a,n)});else{var i=this,r=i.value,s=e.audioContext.currentTime;console.log("starting automation"),l=window.setInterval(function(){e.audioContext.currentTime>=a&&(m=!0,i.value=t+(r-t)*Math.exp(-(e.audioContext.currentTime-s)/n),Math.abs(i.value-t)<c&&window.clearInterval(l))},f)}},this.setValueCurveAtTime=function(t,a,n){if(o){if("function"==typeof u)for(var i=0;i<t.length;i++)t[i]=u(t[i]);o instanceof AudioParam?o.setValueCurveAtTime(t,a,n):o instanceof Array&&o.forEach(function(e){e.setValueCurveAtTime(t,a,n)})}else{var r=this,c=e.audioContext.currentTime;l=window.setInterval(function(){if(e.audioContext.currentTime>=a){var i=Math.floor(t.length*(e.audioContext.currentTime-c)/n);i<t.length?(m=!0,r.value=t[i]):window.clearInterval(l)}},f)}},this.exponentialRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.exponentialRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.exponentialRampToValueAtTime(t,a)});else{var n=this,i=n.value,r=e.audioContext.currentTime;0===i&&(i=.001),l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,n.value=i*Math.pow(t/i,o),e.audioContext.currentTime>=a&&window.clearInterval(l)},f)}},this.linearRampToValueAtTime=function(t,a){if(o)"function"==typeof u&&(t=u(t)),o instanceof AudioParam?o.linearRampToValueAtTime(t,a):o instanceof Array&&o.forEach(function(e){e.linearRampToValueAtTime(t,a)});else{var n=this,i=n.value,r=e.audioContext.currentTime;l=window.setInterval(function(){var o=(e.audioContext.currentTime-r)/(a-r);m=!0,n.value=i+(t-i)*o,e.audioContext.currentTime>=a&&window.clearInterval(l)},f)}},this.cancelScheduledValues=function(e){o?o instanceof AudioParam?o.cancelScheduledValues(e):o instanceof Array&&o.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(l)}}var webAudioDispatch=_dereq_("../core/WebAudioDispatch"),Config=_dereq_("../core/Config");SPAudioParam.createPsuedoParam=function(e,t,a,n,i){return new SPAudioParam(e,t,a,n,i,null,null,null)},module.exports=SPAudioParam;


},{"../core/Config":4,"../core/WebAudioDispatch":13}],11:[function(_dereq_,module,exports){
"use strict";function SPPlaybackRateParam(e,t,a){this.defaultValue=t.defaultValue,this.maxValue=t.maxValue,this.minValue=t.minValue,this.name=t.name,this.units=t.units,this.isSPPlaybackRateParam=!0,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(i){e.playbackState===e.PLAYING_STATE?(t.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT),a.setTargetAtTime(i,e.audioContext.currentTime,Config.DEFAULT_SMOOTHING_CONSTANT)):(t.setValueAtTime(i,e.audioContext.currentTime),a.setValueAtTime(i,e.audioContext.currentTime))},get:function(){return t.value}}),t.value=t.value,a.value=t.value,this.linearRampToValueAtTime=function(e,i){t.linearRampToValueAtTime(e,i),a.linearRampToValueAtTime(e,i)},this.exponentialRampToValueAtTime=function(e,i){t.exponentialRampToValueAtTime(e,i),a.exponentialRampToValueAtTime(e,i)},this.setValueCurveAtTime=function(e,i,u){t.setValueCurveAtTime(e,i,u),a.setValueCurveAtTime(e,i,u)},this.setTargetAtTime=function(e,i,u){t.setTargetAtTime(e,i,u),a.setTargetAtTime(e,i,u)},this.setValueAtTime=function(e,i){t.setValueAtTime(e,i),a.setValueAtTime(e,i)},this.cancelScheduledValues=function(e){t.cancelScheduledValues(e),a.cancelScheduledValues(e)}}var Config=_dereq_("../core/Config");module.exports=SPPlaybackRateParam;


},{"../core/Config":4}],12:[function(_dereq_,module,exports){
"use strict";function SoundQueue(e,n,t,i){function o(){p(e.currentTime+1/Config.NOMINAL_REFRESH_RATE),window.requestAnimationFrame(o)}function u(){for(var n=0;i>n;n++)d[n]=new Looper(e,null,null,null,null,null,r),d[n].disconnect(),d[n].maxLoops.value=1,d[n].voiceIndex=n;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(o)}function r(e){d.push(e),E.splice(E.indexOf(e),1);var n=m.reduce(function(e,n){return e||"QESTART"!==n.type},0===m.length);l.isPlaying&&0===E.length&&n&&(l.isPlaying=!1,"function"==typeof l.onAudioEnd&&l.onAudioEnd())}function a(e){for(h=0;h<E.length;h++)if(E[h].eventID==e)return E[h];return null}function s(e){for(var n=0;n<m.length;n++){var t=m[n];t.eventID===e&&(m.splice(n,1),n--)}}function c(n,t){var i;return d.length<1?(console.warn("No free voices left. Stealing the oldest"),i=E.shift(),s(i.eventID),i.eventID=n,i.release(e.currentTime,t-e.currentTime,!0),E.push(i)):(i=d.shift(),i.eventID=n,E.push(i)),i}function f(n){var t=a(n.eventID);"QESTART"!=n.type&&"QESETPARAM"!=n.type&&"QESETSRC"!=n.type||null!==t||(t=c(n.eventID,n.time)),t&&("QESTART"==n.type?(t.start(n.time,n.offset,null,n.attackDuration),webaudioDispatch(function(){l.isPlaying||(l.isPlaying=!0,"function"==typeof l.onAudioStart&&l.onAudioStart())},n.time,e)):"QESETPARAM"==n.type?t[n.paramName]&&t[n.paramName].setValueAtTime(n.paramValue,n.time):"QESETSRC"==n.type?t.setSources(n.sourceBuffer):"QERELEASE"==n.type?t.release(n.time,n.releaseDuration):"QESTOP"==n.type?(t.pause(n.time),webaudioDispatch(function(){d.push(t),E.splice(E.indexOf(t),1)},n.time,e)):console.warn("Unknown Event Type : "+n))}function p(e){for(var n=0;n<m.length;n++){var t=m[n];t.time<=e&&(f(t),m.splice(n,1),n--)}}if(!(this instanceof SoundQueue))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof i&&(i=Config.MAX_VOICES);var l=this;this.onAudioEnd=t,this.onAudioStart=n;var h,m=[],E=[],d=[];this.isPlaying=!1,this.queueStart=function(e,n,t,i){m.push({type:"QESTART",time:e,eventID:n,offset:t,attackDuration:i})},this.queueRelease=function(e,n,t){m.push({type:"QERELEASE",time:e,eventID:n,releaseDuration:t})},this.queueStop=function(e,n){m.push({type:"QESTOP",time:e,eventID:n})},this.queueSetParameter=function(e,n,t,i){m.push({type:"QESETPARAM",time:e,eventID:n,paramName:t,paramValue:i})},this.queueSetSource=function(e,n,t){m.push({type:"QESETSRC",time:e,eventID:n,sourceBuffer:t})},this.queueUpdate=function(e,n,t,i){for(var o=0;o<m.length;o++){var u=m[o];u.type!==e||n&&u.eventID!=n||u.hasOwnProperty(t)&&(u[t]=i)}},this.pause=function(){this.stop(0)},this.stop=function(e){p(e),m=[],E.forEach(function(n){n.release(e)}),d.forEach(function(n){n.stop(e)})},this.connect=function(e,n,t){d.forEach(function(i){i.connect(e,n,t)}),E.forEach(function(i){i.connect(e,n,t)})},this.disconnect=function(e){d.forEach(function(n){n.disconnect(e)}),E.forEach(function(n){n.disconnect(e)})},u()}var Config=_dereq_("../core/Config"),Looper=_dereq_("../models/Looper"),webaudioDispatch=_dereq_("../core/WebAudioDispatch");module.exports=SoundQueue;


},{"../core/Config":4,"../core/WebAudioDispatch":13,"../models/Looper":16}],13:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(o,e,i){if(!i)return void console.warn("No AudioContext provided");var t=i.currentTime;t>=e||.005>e-t?o():window.setTimeout(function(){o()},1e3*(e-t))}module.exports=WebAudioDispatch;


},{}],14:[function(_dereq_,module,exports){
"use strict";function MultiFileLoader(e,o,r,u){function i(){if(!e)return console.log("Setting empty source. No sound may be heard"),void u(!1,c);if(!(e instanceof Array)){var o=[];o.push(e),e=o}return e.length<f.minSources||e.length>f.maxSources?(console.error("Unsupported number of Sources. "+f.modelName+" only supports a minimum of "+f.minSources+" and a maximum of "+f.maxSources+" sources. Trying to load "+e.length+"."),void u(!1,c)):(a=e.length,c=new Array(a),void e.forEach(function(e,o){n(e,t(o))}))}function n(e,o){var u,i=Object.prototype.toString.call(e);if("[object AudioBuffer]"===i)u=new SPAudioBuffer(f.audioContext,e),o(!0,u);else if(e.isSPAudioBuffer&&e.buffer)o(!0,e);else if("[object String]"===i||"[object File]"===i||e.isSPAudioBuffer&&e.sourceURL){var n;e.isSPAudioBuffer&&e.sourceURL?(n=e.sourceURL,u=e):(n=e,u=new SPAudioBuffer(f.audioContext,n));var t=new FileLoader(n,f.audioContext,function(e){e?(u.buffer=t.getBuffer(),o(e,u)):o(e)},function(e){r&&"function"==typeof r&&r(e,u)})}else console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer or doesn't have sourceURL or buffer"),o(!1,{})}function t(e){return function(o,r){if(o&&(c[e]=r),a--,0===a){for(var i=!0,n=0;n<c.length;++n)if(!c[n]){i=!1;break}u(i,c)}}}var f=this;this.audioContext=o;var a=0,c=[];i()}var FileLoader=_dereq_("../core/FileLoader"),SPAudioBuffer=_dereq_("../core/SPAudioBuffer");module.exports=MultiFileLoader;


},{"../core/FileLoader":7,"../core/SPAudioBuffer":8}],15:[function(_dereq_,module,exports){
"use strict";function WebAudioDispatch(o,e,i){if(!i)return void console.warn("No AudioContext provided");var t=i.currentTime;t>=e||.005>e-t?o():window.setTimeout(function(){o()},1e3*(e-t))}module.exports=WebAudioDispatch;


},{}],16:[function(_dereq_,module,exports){
"use strict";function Looper(e,t,i,o,a,n,r){function u(e){d=[],c.forEach(function(e){e.disconnect()}),s.multiTrackGain.length=0,multiFileLoader.call(s,e,s.audioContext,s.onLoadProgress,f)}if(!(this instanceof Looper))throw new TypeError("Looper constructor cannot be called as a function.");BaseSound.call(this,e),this.maxSources=Config.MAX_VOICES,this.minSources=1,this.modelName="Looper",this.onLoadProgress=i,this.onLoadComplete=o,this.onAudioStart=a,this.onAudioEnd=n;var s=this,c=[],l=[],d=[],f=function(e,t){s.multiTrackGain.length=t.length,t.forEach(function(e,i){l.push(0),p(e,i,t.length)}),d&&d.length>0&&s.registerParameter(new SPAudioParam(s,"playSpeed",0,10,1,d,null,m),!0),e&&(s.isInitialized=!0),"function"==typeof s.onLoadComplete&&s.onLoadComplete(e,t)},p=function(e,t,i){var o;if(o=c[t]instanceof SPAudioBufferSourceNode?c[t]:new SPAudioBufferSourceNode(s.audioContext),o.buffer=e,o.loopEnd=e.duration,o.onended=function(e){h(e,t,o)},i>1){var a=new SPAudioParam(s,"track-"+t+"-gain",0,1,1,o.gain,null,null);s.multiTrackGain.splice(t,1,a)}o.connect(s.releaseGainNode),c.splice(t,1,o),d.push(o.playbackRate)},h=function(e,t,i){var o=s.audioContext.currentTime;if(i.resetBufferSource(o,s.releaseGainNode),s.multiTrackGain.length>1){var a=new SPAudioParam(s,"track-"+t+"-gain"+t,0,1,1,i.gain,null,null);s.multiTrackGain.splice(t,1,a)}"function"==typeof s.onTrackEnd&&r(s,t);var n=c.reduce(function(e,t){return e&&(t.playbackState===t.FINISHED_STATE||t.playbackState===t.UNSCHEDULED_STATE)},!0);n&&s.isPlaying&&(s.isPlaying=!1,"function"==typeof s.onAudioEnd&&s.onAudioEnd())},m=function(e,t,i){if(s.isInitialized){var o=6.90776,a=c[0]?c[0].playbackRate.value:1;s.isPlaying?t>a?c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setTargetAtTime(t,i.currentTime,s.easeIn.value/o)}):a>t&&c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setTargetAtTime(t,i.currentTime,s.easeOut.value/o)}):c.forEach(function(e){e.playbackRate.cancelScheduledValues(i.currentTime),e.playbackRate.setValueAtTime(t,i.currentTime)})}};this.onTrackEnd=r,this.registerParameter(new SPAudioParam(this,"playSpeed",0,10,1.005,null,null,m),!0),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeIn",.05,10,.05)),this.registerParameter(SPAudioParam.createPsuedoParam(this,"easeOut",.05,10,.05));var S=[];S.name="multiTrackGain",this.registerParameter(S,!1),this.registerParameter(SPAudioParam.createPsuedoParam(this,"maxLoops",-1,1,-1)),this.setSources=function(e,t,i){BaseSound.prototype.setSources.call(this,e,t,i),u(e)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName,"hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(c.forEach(function(t,i){var o=l&&l[i]?l[i]:t.loopStart;t.loop=1!==s.maxLoops.value,t.start(e,o)}),BaseSound.prototype.start.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))},this.start=function(e,t,i,o){return this.isInitialized?void(this.isPlaying||(c.forEach(function(o){t=o.loopStart+parseFloat(t)||0,("undefined"==typeof i||null===i)&&(i=o.buffer.duration),o.loop=1!==s.maxLoops.value,o.start(e,t,i)}),BaseSound.prototype.start.call(this,e,t,i,o),webAudioDispatch(function(){"function"==typeof s.onAudioStart&&s.onAudioStart()},e,this.audioContext))):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){s.isPlaying&&(c.forEach(function(t,i){t.stop(e),l[i]=0}),BaseSound.prototype.stop.call(this,e),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e,this.audioContext))},this.pause=function(){s.isPlaying&&(c.forEach(function(e,t){e.stop(0),l[t]=e.playbackPosition/e.buffer.sampleRate}),BaseSound.prototype.stop.call(this,0),webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.onAudioEnd()},0,this.audioContext))},this.release=function(e,t,i){("undefined"==typeof e||e<this.audioContext.currentTime)&&(e=this.audioContext.currentTime);var o=.5;t=t||o,BaseSound.prototype.release.call(this,e,t,i),i&&(this.releaseGainNode=this.audioContext.createGain(),this.destinations.forEach(function(e){s.releaseGainNode.connect(e.destination,e.output,e.input)}),c.forEach(function(i,o){i.stop(e+t),l[o]=0,i.resetBufferSource(e,s.releaseGainNode);var a=new SPAudioParam(s,"gain-"+o,0,1,1,i.gain,null,null);s.multiTrackGain.splice(o,1,a)}),this.isPlaying=!1,webAudioDispatch(function(){"function"==typeof s.onAudioEnd&&s.isPlaying===!1&&s.onAudioEnd()},e+t,this.audioContext))},window.setTimeout(function(){u(t)},0)}var Config=_dereq_("../core/Config"),BaseSound=_dereq_("../core/BaseSound"),SPAudioParam=_dereq_("../core/SPAudioParam"),SPAudioBufferSourceNode=_dereq_("../core/SPAudioBufferSourceNode"),multiFileLoader=_dereq_("../core/multiFileLoader"),webAudioDispatch=_dereq_("../core/webAudioDispatch");Looper.prototype=Object.create(BaseSound.prototype),module.exports=Looper;


},{"../core/BaseSound":3,"../core/Config":4,"../core/SPAudioBufferSourceNode":9,"../core/SPAudioParam":10,"../core/multiFileLoader":14,"../core/webAudioDispatch":15}]},{},[1])(1)
});