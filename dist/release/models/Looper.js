/*javascript-sound-models - v1.0.2 - 2014-07-11 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.LOG_ERRORS=!0,e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e.CHUNK_LENGTH=256,e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/WebAudioDispatch","core/AudioContextMonkeyPatch"],function(e){function t(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var t=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),t=Math.round(e)},get:function(){return t}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return t.prototype.connect=function(e,t,n){e instanceof AudioNode?this.releaseGainNode.connect(e,t,n):e.inputNode instanceof AudioNode?this.releaseGainNode.connect(e.inputNode,t,n):console.error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this)},t.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},t.prototype.start=function(e,t,n,o){var a=this.audioContext.currentTime;"undefined"!=typeof o?(this.releaseGainNode.gain.cancelScheduledValues(a),this.releaseGainNode.gain.setValueAtTime(0,a),this.releaseGainNode.gain.linearRampToValueAtTime(1,a+o)):this.releaseGainNode.gain.setValueAtTime(1,a),this.isPlaying=!0},t.prototype.stop=function(t){10/this.audioContext.sampleRate;"undefined"==typeof t&&(t=0);var n=this;e(function(){n.isPlaying=!1},t,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(t)},t.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},t.prototype.play=function(){this.start(0)},t.prototype.pause=function(){this.isPlaying=!1},t.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},t}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,a,r,i,u,c){var s,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(e){return typeof e!=typeof a?void console.error("Attempt to set a "+typeof a+" parameter to a "+typeof e+" value"):("number"==typeof e&&(e>o?(console.warn(this.name+" clamping to max"),e=o):n>e&&(console.warn(this.name+" clamping to min"),e=n)),"function"==typeof i&&(e=i(e)),"function"==typeof u&&c?u(r,e,c):r?r instanceof AudioParam?r.value=e:r instanceof Array&&r.forEach(function(t){t.value=e}):window.clearInterval(s),void(d=e))},get:function(){if(r){if(r instanceof AudioParam)return r.value;if(r instanceof Array)return r[0].value}return d}}),r&&(r instanceof AudioParam||r instanceof Array)){var p=r[0]||r;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof a&&(this.defaultValue=a,this.value=a),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof i&&(t=i(t)),r)r instanceof AudioParam?r.setValueAtTime(t,n):r instanceof Array&&r.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof i&&(e=i(e)),r)r instanceof AudioParam?r.setTargetAtTime(e,t,n):r instanceof Array&&r.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,a=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(a-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(s))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof i)for(var o=0;o<e.length;o++)e[o]=i(e[o]);if(r)r instanceof AudioParam?r.setValueCurveAtTime(e,t,n):r instanceof Array&&r.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var a=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?a.value=e[o]:window.clearInterval(s)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),r)r instanceof AudioParam?r.exponentialRampToValueAtTime(e,t):r instanceof Array&&r.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,a=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var r=(c.currentTime-a)/(t-a);n.value=o*Math.pow(e/o,r),c.currentTime>=t&&window.clearInterval(s)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof i&&(e=i(e)),r)r instanceof AudioParam?r.linearRampToValueAtTime(e,t):r instanceof Array&&r.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,a=c.currentTime;s=window.setInterval(function(){var r=(c.currentTime-a)/(t-a);n.value=o+(e-o)*r,c.currentTime>=t&&window.clearInterval(s)},f)}},this.cancelScheduledValues=function(e){r?r instanceof AudioParam?r.cancelScheduledValues(e):r instanceof Array&&r.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,a,r){return new t(e,n,o,a,null,null,null,r)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,a){e.setValueCurveAtTime(n,o,a),t.setValueCurveAtTime(n,o,a)},this.setTargetAtTime=function(n,o,a){e.setTargetAtTime(n,o,a),t.setTargetAtTime(n,o,a)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),a=0;a<e.length;a++)t[a]=a;return o.getChannelData(0).set(t),o}function a(){c.connect(s),s.onaudioprocess=r}function r(e){var t=e.inputBuffer.getChannelData(0);l=t[t.length-1]||0}function i(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var u=n.createBufferSource(),c=n.createBufferSource(),s=n.createScriptProcessor(256,1,1),l=0;this.audioContext=n,this.channelCount=u.channelCount,this.channelCountMode=u.channelCountMode,this.channelInterpretation=u.channelInterpretation,this.numberOfInputs=u.numberOfInputs,this.numberOfOutputs=u.numberOfOutputs,this.playbackState=0,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=new e(u.playbackRate,c.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){u.loopEnd=e,c.loopEnd=e},get:function(){return u.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){u.loopStart=e,c.loopStart=e},get:function(){return u.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){u.onended=i(this,e)},get:function(){return u.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){u.loop=e,c.loop=e},get:function(){return u.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return l}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(e){u.buffer=e,c.buffer=o(e)},get:function(){return u.buffer}}),this.connect=function(e,t,n){u.connect(e,t,n),s.connect(e,t,n)},this.disconnect=function(e){u.disconnect(e),s.disconnect(e)},this.start=function(e,n,o){"undefined"==typeof o&&(o=u.buffer.duration),this.playbackState===this.UNSCHEDULED_STATE&&(u.start(e,n,o),c.start(e,n,o),this.playbackState=this.SCHEDULED_STATE);var a=this;t(function(){a.playbackState=a.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(u.stop(e),c.stop(e))},this.resetBufferSource=function(o,a){var r=this;t(function(){r.disconnect(a);var t=r.audioContext.createBufferSource();t.buffer=u.buffer,t.loopStart=u.loopStart,t.loopEnd=u.loopEnd,t.onended=i(r,u.onended),u=t;var o=n.createBufferSource();o.buffer=c.buffer,o.connect(s),c=o;var l=r.playbackRate.value;r.playbackRate=new e(u.playbackRate,c.playbackRate),r.playbackRate.setValueAtTime(l,0),r.connect(a),r.playbackState=r.UNSCHEDULED_STATE},o,this.audioContext)},a()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,a=5e3,r=.5,i=2e4,u=.01,c=1024,s=16,l=[],f=0,d=function(e,t){for(var n=0,o=t+s;t+s+c>o;++o)n+=Math.abs(e[o]);return u>n/c},p=function(e){return function(t,n,o){var a;return a=o%2===0?n[e]>r:n[e]<-r,t&&a}},h=function(e){var o=null,r=null;t=0,n=f;for(var u=0;null===o&&f>u&&i>u;){if(e.reduce(p(u),!0)&&(1!==e.length||d(e[0],u))){o=u;break}u++}for(u=f;null===r&&u>0&&i>f-u;){if(e.reduce(p(u),!0)){r=u;break}u--}return null!==o&&null!==r&&r>o+a?(t=o+a/2,n=r-a/2,!0):!1},m=function(e){return function(t,n){return t&&Math.abs(n[e])<u}},y=function(e){var o=!0;for(t=0;i>t&&f>t&&(o=e.reduce(m(t),!0));)t++;for(n=f;i>f-n&&n>0&&(o=e.reduce(m(n),!0));)n--;t>n&&(t=0)};f=e.length;for(var A=0;A<e.numberOfChannels;A++)l.push(new Float32Array(e.getChannelData(A)));return h(l)||(y(l),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,a,r){function i(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",r,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var a=new FileReader;a.addEventListener("progress",r,!1),a.onload=function(){u(a.result,t)},a.readAsArrayBuffer(n)}}function u(t,r){o.decodeAudioData(t,function(t){if(f=!0,c=t,s=0,l=c.length,"wav"!==r[0]){var n=e(c);n&&(s=n.start,l=n.end)}a&&"function"==typeof a&&a(!0)},function(){console.warn("Error Decoding "+n),a&&"function"==typeof a&&a(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){"undefined"==typeof t&&(t=c.length),d(e)?d(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=isNan(t)?0:Math.round(Number(t))):(e=isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>l||s>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+s),e=s),(t>l||s>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+l),t=l);var n=t-e;if(!c)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var a=o.createBuffer(c.numberOfChannels,n,c.sampleRate),r=0;r<c.numberOfChannels;r++){var i=new Float32Array(c.getChannelData(r));a.getChannelData(r).set(i.subarray(e,t))}return a};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-s),p(s+e,s+t)},this.getRawBuffer=function(){return f?c:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return f},i()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,a){function r(){var e=Object.prototype.toString.call(t);"[object Array]"===e?t.length>=c.minSources&&t.length<=c.maxSources?(s=t.length,l=new Array(s),t.forEach(function(e,t){i(e,u(t))})):(console.error("Unsupported number of Sources. "+c.modelName+" only supports a minimum of "+c.minSources+" and a maximum of "+c.maxSources+" sources. Trying to load "+t.length+"."),o(!1,l)):t?(s=1,l=new Array(s),i(t,u(0))):(console.warn("Setting empty source. No sound may be heard"),o(!1,l))}function i(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var r=new e(t,c.audioContext,function(e){e?n(e,r.getBuffer()):n(e)},function(e){a&&"function"==typeof a&&a(e,t)});else"[object AudioBuffer]"===o?n(!0,t):(console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer"),n(!1,{}))}function u(e){return function(t,n){if(t&&(l[e]=n),s--,0===s){for(var a=!0,r=0;r<l.length;++r)if(!l[r]){a=!1;break}o(a,l)}}}var c=this;this.audioContext=n;var s=0,l=[];r()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,a){function r(i,u,c,s,l){function f(e,t,n){y=[],p.forEach(function(e){e.disconnect()}),p=[],a.call(d,e,d.audioContext,A(t),n)}if(!(this instanceof r))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.minSources=1,this.modelName="Looper";var d=this,p=[],h=[],m=[],y=[],A=function(e){return function(t,o){o.forEach(function(e,t){m.push(0),b(e,t)}),d.playSpeed=new n("playSpeed",0,10,1,y,null,v,d.audioContext),t&&(d.isInitialized=!0),"function"==typeof e&&e(t)}},T=function(e,t,n){d.isPlaying=!1;var o=d.audioContext.currentTime;n.resetBufferSource(o,h[t]),"function"==typeof l&&l(d,t)},b=function(e,t){var a=new o(d.audioContext);a.buffer=e,a.loopEnd=e.duration,a.onended=function(e){T(e,t,a)};var r;if(h[t])r=h[t];else{r=d.audioContext.createGain(),h[t]=r;var i=new n("gain",0,1,1,r.gain,null,null,d.audioContext);d.multiTrackGain.push[t]=i}a.connect(r),r.connect(d.releaseGainNode),p.push(a),y.push(a.playbackRate)},v=function(e,t,n){if(d.isInitialized){var o=6.90776,a=p[0]?p[0].playbackRate.value:1;t>a?p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.riseTime.value/o)}):a>t&&p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.decayTime.value/o)})}},g=function(e,t){p.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.playSpeed=null,this.riseTime=n.createPsuedoParam("riseTime",.05,10,.05,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,.05,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,g,this.audioContext),this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t,n){this.isInitialized=!1,f(e,t,n)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(p.forEach(function(t,n){var o=m&&m[n]?m[n]:d.startPoint.value*t.buffer.duration;t.loop=1!==d.maxLoops.value,t.start(e,o)}),t.prototype.start.call(this,e))},this.start=function(e,n,o,a){return this.isInitialized?void(this.isPlaying||(p.forEach(function(t){("undefined"==typeof n||null===n)&&(n=d.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==d.maxLoops.value,t.start(e,n,o)}),t.prototype.start.call(this,e,n,o,a))):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){p.forEach(function(t,n){d.isPlaying&&t.stop(e),m[n]=0}),t.prototype.stop.call(this,e)},this.pause=function(){p.forEach(function(e,t){d.isPlaying&&e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0)},i&&f(i,c,s)}return r.prototype=Object.create(t.prototype),r});