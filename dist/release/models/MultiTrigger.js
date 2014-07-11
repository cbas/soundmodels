/*javascript-sound-models - v1.0.2 - 2014-07-11 */ 
console.log("   ____                           __ \n" + "  / _____  ___ ___  ___ ___  ____/ /_\n" + " _\\ \\/ _ \\/ _ / _ \\/ _ / _ \\/ __/ __/\n" + "/___/\\___/_//_\\___/ .__\\___/_/  \\__/ \n" + "                 /_/                 \n" + "Hello Developer!\n" + "Thanks for using Sonoport Dynamic Sound Library.");

define("core/Config",[],function(){function e(){}return e.LOG_ERRORS=!0,e.ZERO=parseFloat("1e-37"),e.MAX_VOICES=8,e.NOMINAL_REFRESH_RATE=60,e.WINDOW_LENGTH=512,e.CHUNK_LENGTH=256,e}),define("core/WebAudioDispatch",[],function(){function e(e,t,n){if(!n)return void console.warn("No AudioContext provided");var o=n.currentTime;o>=t||.005>t-o?e():window.setTimeout(function(){e()},1e3*(t-o))}return e}),define("core/AudioContextMonkeyPatch",[],function(){function e(e){e&&(e.setTargetAtTime||(e.setTargetAtTime=e.setTargetValueAtTime))}window.hasOwnProperty("webkitAudioContext")&&!window.hasOwnProperty("AudioContext")&&(window.AudioContext=webkitAudioContext,AudioContext.prototype.hasOwnProperty("createGain")||(AudioContext.prototype.createGain=AudioContext.prototype.createGainNode),AudioContext.prototype.hasOwnProperty("createDelay")||(AudioContext.prototype.createDelay=AudioContext.prototype.createDelayNode),AudioContext.prototype.hasOwnProperty("createScriptProcessor")||(AudioContext.prototype.createScriptProcessor=AudioContext.prototype.createJavaScriptNode),AudioContext.prototype.internal_createGain=AudioContext.prototype.createGain,AudioContext.prototype.createGain=function(){var t=this.internal_createGain();return e(t.gain),t},AudioContext.prototype.internal_createDelay=AudioContext.prototype.createDelay,AudioContext.prototype.createDelay=function(t){var n=t?this.internal_createDelay(t):this.internal_createDelay();return e(n.delayTime),n},AudioContext.prototype.internal_createBufferSource=AudioContext.prototype.createBufferSource,AudioContext.prototype.createBufferSource=function(){var t=this.internal_createBufferSource();return t.start||(t.start=function(e,t,n){t||n?this.noteGrainOn(e,t,n):this.noteOn(e)}),t.stop||(t.stop=t.noteOff),e(t.playbackRate),t},AudioContext.prototype.internal_createDynamicsCompressor=AudioContext.prototype.createDynamicsCompressor,AudioContext.prototype.createDynamicsCompressor=function(){var t=this.internal_createDynamicsCompressor();return e(t.threshold),e(t.knee),e(t.ratio),e(t.reduction),e(t.attack),e(t.release),t},AudioContext.prototype.internal_createBiquadFilter=AudioContext.prototype.createBiquadFilter,AudioContext.prototype.createBiquadFilter=function(){var t=this.internal_createBiquadFilter();return e(t.frequency),e(t.detune),e(t.Q),e(t.gain),t},AudioContext.prototype.hasOwnProperty("createOscillator")&&(AudioContext.prototype.internal_createOscillator=AudioContext.prototype.createOscillator,AudioContext.prototype.createOscillator=function(){var t=this.internal_createOscillator();return t.start||(t.start=t.noteOn),t.stop||(t.stop=t.noteOff),e(t.frequency),e(t.detune),t}))}),define("core/BaseSound",["core/WebAudioDispatch","core/AudioContextMonkeyPatch"],function(e){function t(e){void 0===e||null===e?(console.log("Making a new AudioContext"),this.audioContext=new AudioContext):this.audioContext=e,this.numberOfInputs=0,Object.defineProperty(this,"numberOfOutputs",{enumerable:!0,configurable:!1,get:function(){return this.releaseGainNode.numberOfOutputs}});var t=0;Object.defineProperty(this,"maxSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),t=Math.round(e)},get:function(){return t}});var n=0;Object.defineProperty(this,"minSources",{enumerable:!0,configurable:!1,set:function(e){0>e&&(e=0),n=Math.round(e)},get:function(){return n}}),this.releaseGainNode=this.audioContext.createGain(),this.isPlaying=!1,this.isInitialized=!1,this.inputNode=null,this.modelName="Model",this.releaseGainNode.connect(this.audioContext.destination)}return t.prototype.connect=function(e,t,n){e instanceof AudioNode?this.releaseGainNode.connect(e,t,n):e.inputNode instanceof AudioNode?this.releaseGainNode.connect(e.inputNode,t,n):console.error("No Input Connection - Attempts to connect "+typeof t+" to "+typeof this)},t.prototype.disconnect=function(e){this.releaseGainNode.disconnect(e)},t.prototype.start=function(e,t,n,o){var i=this.audioContext.currentTime;"undefined"!=typeof o?(this.releaseGainNode.gain.cancelScheduledValues(i),this.releaseGainNode.gain.setValueAtTime(0,i),this.releaseGainNode.gain.linearRampToValueAtTime(1,i+o)):this.releaseGainNode.gain.setValueAtTime(1,i),this.isPlaying=!0},t.prototype.stop=function(t){10/this.audioContext.sampleRate;"undefined"==typeof t&&(t=0);var n=this;e(function(){n.isPlaying=!1},t,this.audioContext),this.releaseGainNode.gain.cancelScheduledValues(t)},t.prototype.release=function(e,t){if(this.isPlaying){var n=.5,o=1/this.audioContext.sampleRate;"undefined"==typeof e&&(e=this.audioContext.currentTime),t=t||n,this.releaseGainNode.gain.setValueAtTime(this.releaseGainNode.gain.value,e),this.releaseGainNode.gain.linearRampToValueAtTime(0,e+t),this.stop(e+t+o)}},t.prototype.play=function(){this.start(0)},t.prototype.pause=function(){this.isPlaying=!1},t.prototype.listParams=function(){var e=[];for(var t in this){var n=this[t];n&&n.hasOwnProperty("value")&&n.hasOwnProperty("minValue")&&n.hasOwnProperty("maxValue")&&e.push(n)}return e},t}),define("core/SPAudioParam",["core/WebAudioDispatch"],function(e){function t(t,n,o,i,a,r,u,c){var s,l=1e-4,f=500,d=0;if(this.defaultValue=null,this.maxValue=0,this.minValue=0,this.name="",Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(e){return typeof e!=typeof i?void console.error("Attempt to set a "+typeof i+" parameter to a "+typeof e+" value"):("number"==typeof e&&(e>o?(console.warn(this.name+" clamping to max"),e=o):n>e&&(console.warn(this.name+" clamping to min"),e=n)),"function"==typeof r&&(e=r(e)),"function"==typeof u&&c?u(a,e,c):a?a instanceof AudioParam?a.value=e:a instanceof Array&&a.forEach(function(t){t.value=e}):window.clearInterval(s),void(d=e))},get:function(){if(a){if(a instanceof AudioParam)return a.value;if(a instanceof Array)return a[0].value}return d}}),a&&(a instanceof AudioParam||a instanceof Array)){var p=a[0]||a;this.defaultValue=p.defaultValue,this.minValue=p.minValue,this.maxValue=p.maxValue,this.value=p.defaultValue,this.name=p.name}t&&(this.name=t),"undefined"!=typeof i&&(this.defaultValue=i,this.value=i),"undefined"!=typeof n&&(this.minValue=n),"undefined"!=typeof o&&(this.maxValue=o),this.setValueAtTime=function(t,n){if("function"==typeof r&&(t=r(t)),a)a instanceof AudioParam?a.setValueAtTime(t,n):a instanceof Array&&a.forEach(function(e){e.setValueAtTime(t,n)});else{var o=this;e(function(){o.value=t},n,c)}},this.setTargetAtTime=function(e,t,n){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.setTargetAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setTargetAtTime(e,t,n)});else{var o=this,i=o.value,u=c.currentTime;s=window.setInterval(function(){c.currentTime>=t&&(o.value=e+(i-e)*Math.exp(-(c.currentTime-u)/n),Math.abs(o.value-e)<l&&window.clearInterval(s))},f)}},this.setValueCurveAtTime=function(e,t,n){if("function"==typeof r)for(var o=0;o<e.length;o++)e[o]=r(e[o]);if(a)a instanceof AudioParam?a.setValueCurveAtTime(e,t,n):a instanceof Array&&a.forEach(function(o){o.setValueCurveAtTime(e,t,n)});else{var i=this,u=c.currentTime;s=window.setInterval(function(){if(c.currentTime>=t){var o=Math.floor(e.length*(c.currentTime-u)/n);o<e.length?i.value=e[o]:window.clearInterval(s)}},f)}},this.exponentialRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.exponentialRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.exponentialRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;0===o&&(o=.001),s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o*Math.pow(e/o,a),c.currentTime>=t&&window.clearInterval(s)},f)}},this.linearRampToValueAtTime=function(e,t){if("function"==typeof r&&(e=r(e)),a)a instanceof AudioParam?a.linearRampToValueAtTime(e,t):a instanceof Array&&a.forEach(function(n){n.linearRampToValueAtTime(e,t)});else{var n=this,o=n.value,i=c.currentTime;s=window.setInterval(function(){var a=(c.currentTime-i)/(t-i);n.value=o+(e-o)*a,c.currentTime>=t&&window.clearInterval(s)},f)}},this.cancelScheduledValues=function(e){a?a instanceof AudioParam?a.cancelScheduledValues(e):a instanceof Array&&a.forEach(function(t){t.cancelScheduledValues(e)}):window.clearInterval(s)}}return t.createPsuedoParam=function(e,n,o,i,a){return new t(e,n,o,i,null,null,null,a)},t}),define("core/SPPlaybackRateParam",[],function(){function e(e,t){this.defaultValue=e.defaultValue,this.maxValue=e.maxValue,this.minValue=e.minValue,this.name=e.name,this.units=e.units,Object.defineProperty(this,"value",{enumerable:!0,configurable:!1,set:function(n){e.value=n,t.value=n},get:function(){return e.value}}),this.linearRampToValueAtTime=function(n,o){e.linearRampToValueAtTime(n,o),t.linearRampToValueAtTime(n,o)},this.exponentialRampToValueAtTime=function(n,o){e.exponentialRampToValueAtTime(n,o),t.exponentialRampToValueAtTime(n,o)},this.setValueCurveAtTime=function(n,o,i){e.setValueCurveAtTime(n,o,i),t.setValueCurveAtTime(n,o,i)},this.setTargetAtTime=function(n,o,i){e.setTargetAtTime(n,o,i),t.setTargetAtTime(n,o,i)},this.setValueAtTime=function(n,o){e.setValueAtTime(n,o),t.setValueAtTime(n,o)},this.cancelScheduledValues=function(n){e.cancelScheduledValues(n),t.cancelScheduledValues(n)}}return e}),define("core/SPAudioBufferSourceNode",["core/SPPlaybackRateParam","core/WebAudioDispatch"],function(e,t){function n(n){function o(e){for(var t=new Float32Array(e.length),o=n.createBuffer(1,e.length,44100),i=0;i<e.length;i++)t[i]=i;return o.getChannelData(0).set(t),o}function i(){c.connect(s),s.onaudioprocess=a}function a(e){var t=e.inputBuffer.getChannelData(0);l=t[t.length-1]||0}function r(e,t){return function(n){e.playbackState=e.FINISHED_STATE,"function"==typeof t&&t(n)}}var u=n.createBufferSource(),c=n.createBufferSource(),s=n.createScriptProcessor(256,1,1),l=0;this.audioContext=n,this.channelCount=u.channelCount,this.channelCountMode=u.channelCountMode,this.channelInterpretation=u.channelInterpretation,this.numberOfInputs=u.numberOfInputs,this.numberOfOutputs=u.numberOfOutputs,this.playbackState=0,this.UNSCHEDULED_STATE=0,this.SCHEDULED_STATE=1,this.PLAYING_STATE=2,this.FINISHED_STATE=3,this.playbackRate=new e(u.playbackRate,c.playbackRate),Object.defineProperty(this,"loopEnd",{enumerable:!0,configurable:!1,set:function(e){u.loopEnd=e,c.loopEnd=e},get:function(){return u.loopEnd}}),Object.defineProperty(this,"loopStart",{enumerable:!0,configurable:!1,set:function(e){u.loopStart=e,c.loopStart=e},get:function(){return u.loopStart}}),Object.defineProperty(this,"onended",{enumerable:!0,configurable:!1,set:function(e){u.onended=r(this,e)},get:function(){return u.onended}}),Object.defineProperty(this,"loop",{enumerable:!0,configurable:!1,set:function(e){u.loop=e,c.loop=e},get:function(){return u.loop}}),Object.defineProperty(this,"playbackPosition",{enumerable:!0,configurable:!1,get:function(){return l}}),Object.defineProperty(this,"buffer",{enumerable:!0,configurable:!1,set:function(e){u.buffer=e,c.buffer=o(e)},get:function(){return u.buffer}}),this.connect=function(e,t,n){u.connect(e,t,n),s.connect(e,t,n)},this.disconnect=function(e){u.disconnect(e),s.disconnect(e)},this.start=function(e,n,o){"undefined"==typeof o&&(o=u.buffer.duration),this.playbackState===this.UNSCHEDULED_STATE&&(u.start(e,n,o),c.start(e,n,o),this.playbackState=this.SCHEDULED_STATE);var i=this;t(function(){i.playbackState=i.PLAYING_STATE},e,this.audioContext)},this.stop=function(e){(this.playbackState===this.PLAYING_STATE||this.playbackState===this.SCHEDULED_STATE)&&(u.stop(e),c.stop(e))},this.resetBufferSource=function(o,i){var a=this;t(function(){a.disconnect(i);var t=a.audioContext.createBufferSource();t.buffer=u.buffer,t.loopStart=u.loopStart,t.loopEnd=u.loopEnd,t.onended=r(a,u.onended),u=t;var o=n.createBufferSource();o.buffer=c.buffer,o.connect(s),c=o;var l=a.playbackRate.value;a.playbackRate=new e(u.playbackRate,c.playbackRate),a.playbackRate.setValueAtTime(l,0),a.connect(i),a.playbackState=a.UNSCHEDULED_STATE},o,this.audioContext)},i()}return n}),define("core/DetectLoopMarkers",[],function(){function e(e){var t=0,n=0,o=!0,i=5e3,a=.5,r=2e4,u=.01,c=1024,s=16,l=[],f=0,d=function(e,t){for(var n=0,o=t+s;t+s+c>o;++o)n+=Math.abs(e[o]);return u>n/c},p=function(e){return function(t,n,o){var i;return i=o%2===0?n[e]>a:n[e]<-a,t&&i}},h=function(e){var o=null,a=null;t=0,n=f;for(var u=0;null===o&&f>u&&r>u;){if(e.reduce(p(u),!0)&&(1!==e.length||d(e[0],u))){o=u;break}u++}for(u=f;null===a&&u>0&&r>f-u;){if(e.reduce(p(u),!0)){a=u;break}u--}return null!==o&&null!==a&&a>o+i?(t=o+i/2,n=a-i/2,!0):!1},m=function(e){return function(t,n){return t&&Math.abs(n[e])<u}},y=function(e){var o=!0;for(t=0;r>t&&f>t&&(o=e.reduce(m(t),!0));)t++;for(n=f;r>f-n&&n>0&&(o=e.reduce(m(n),!0));)n--;t>n&&(t=0)};f=e.length;for(var v=0;v<e.numberOfChannels;v++)l.push(new Float32Array(e.getChannelData(v)));return h(l)||(y(l),o=!1),{marked:o,start:t,end:n}}return e}),define("core/FileLoader",["core/DetectLoopMarkers"],function(e){function t(n,o,i,a){function r(){var e=Object.prototype.toString.call(n),t=/[^.]+$/.exec(n);if("[object String]"===e){var o=new XMLHttpRequest;o.open("GET",n,!0),o.responseType="arraybuffer",o.addEventListener("progress",a,!1),o.onload=function(){u(o.response,t)},o.send()}else if("[object File]"===e||"[object Blob]"===e){var i=new FileReader;i.addEventListener("progress",a,!1),i.onload=function(){u(i.result,t)},i.readAsArrayBuffer(n)}}function u(t,a){o.decodeAudioData(t,function(t){if(f=!0,c=t,s=0,l=c.length,"wav"!==a[0]){var n=e(c);n&&(s=n.start,l=n.end)}i&&"function"==typeof i&&i(!0)},function(){console.warn("Error Decoding "+n),i&&"function"==typeof i&&i(!1)})}if(!(this instanceof t))throw new TypeError("FileLoader constructor cannot be called as a function.");var c,s=0,l=0,f=!1,d=function(e){var t=/^[0-9]+$/;return t.test(e)?!0:!1},p=function(e,t){"undefined"==typeof t&&(t=c.length),d(e)?d(t)||(console.warn("Incorrect parameter Type - FileLoader getBuffer end parameter is not an integer"),t=isNan(t)?0:Math.round(Number(t))):(e=isNan(e)?0:Math.round(Number(e)),console.warn("Incorrect parameter Type - FileLoader getBuffer start parameter is not an integer. Coercing it to an Integer - start")),e>t&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter "+e+" should be smaller than end parameter "+t+" . Setting them to the same value "+e),t=e),(e>l||s>e)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+s),e=s),(t>l||s>t)&&(console.error("Incorrect parameter Type - FileLoader getBuffer start parameter should be within the buffer size : 0-"+c.length+" . Setting start to "+l),t=l);var n=t-e;if(!c)return console.error("No Buffer Found - Buffer loading has not completed or has failed."),null;for(var i=o.createBuffer(c.numberOfChannels,n,c.sampleRate),a=0;a<c.numberOfChannels;a++){var r=new Float32Array(c.getChannelData(a));i.getChannelData(a).set(r.subarray(e,t))}return i};this.getBuffer=function(e,t){return"undefined"==typeof e&&(e=0),"undefined"==typeof t&&(t=l-s),p(s+e,s+t)},this.getRawBuffer=function(){return f?c:(console.error("No Buffer Found - Buffer loading has not completed or has failed."),null)},this.isLoaded=function(){return f},r()}return t}),define("core/MultiFileLoader",["core/FileLoader"],function(e){function t(t,n,o,i){function a(){var e=Object.prototype.toString.call(t);"[object Array]"===e?t.length>=c.minSources&&t.length<=c.maxSources?(s=t.length,l=new Array(s),t.forEach(function(e,t){r(e,u(t))})):(console.error("Unsupported number of Sources. "+c.modelName+" only supports a minimum of "+c.minSources+" and a maximum of "+c.maxSources+" sources. Trying to load "+t.length+"."),o(!1,l)):t?(s=1,l=new Array(s),r(t,u(0))):(console.warn("Setting empty source. No sound may be heard"),o(!1,l))}function r(t,n){var o=Object.prototype.toString.call(t);if("[object String]"===o||"[object File]"===o)var a=new e(t,c.audioContext,function(e){e?n(e,a.getBuffer()):n(e)},function(e){i&&"function"==typeof i&&i(e,t)});else"[object AudioBuffer]"===o?n(!0,t):(console.error("Incorrect Parameter Type - Source is not a URL, File or AudioBuffer"),n(!1,{}))}function u(e){return function(t,n){if(t&&(l[e]=n),s--,0===s){for(var i=!0,a=0;a<l.length;++a)if(!l[a]){i=!1;break}o(i,l)}}}var c=this;this.audioContext=n;var s=0,l=[];a()}return t}),define("models/Looper",["core/Config","core/BaseSound","core/SPAudioParam","core/SPAudioBufferSourceNode","core/MultiFileLoader"],function(e,t,n,o,i){function a(r,u,c,s,l){function f(e,t,n){y=[],p.forEach(function(e){e.disconnect()}),p=[],i.call(d,e,d.audioContext,v(t),n)}if(!(this instanceof a))throw new TypeError("Looper constructor cannot be called as a function.");t.call(this,u),this.maxSources=e.MAX_VOICES,this.minSources=1,this.modelName="Looper";var d=this,p=[],h=[],m=[],y=[],v=function(e){return function(t,o){o.forEach(function(e,t){m.push(0),T(e,t)}),d.playSpeed=new n("playSpeed",0,10,1,y,null,S,d.audioContext),t&&(d.isInitialized=!0),"function"==typeof e&&e(t)}},A=function(e,t,n){d.isPlaying=!1;var o=d.audioContext.currentTime;n.resetBufferSource(o,h[t]),"function"==typeof l&&l(d,t)},T=function(e,t){var i=new o(d.audioContext);i.buffer=e,i.loopEnd=e.duration,i.onended=function(e){A(e,t,i)};var a;if(h[t])a=h[t];else{a=d.audioContext.createGain(),h[t]=a;var r=new n("gain",0,1,1,a.gain,null,null,d.audioContext);d.multiTrackGain.push[t]=r}i.connect(a),a.connect(d.releaseGainNode),p.push(i),y.push(i.playbackRate)},S=function(e,t,n){if(d.isInitialized){var o=6.90776,i=p[0]?p[0].playbackRate.value:1;t>i?p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.riseTime.value/o)}):i>t&&p.forEach(function(e){e.playbackRate.cancelScheduledValues(n.currentTime),e.playbackRate.setTargetAtTime(t,n.currentTime,d.decayTime.value/o)})}},g=function(e,t){p.forEach(function(e){e.loopStart=t*e.buffer.duration})};this.playSpeed=null,this.riseTime=n.createPsuedoParam("riseTime",.05,10,.05,this.audioContext),this.decayTime=n.createPsuedoParam("decayTime",.05,10,.05,this.audioContext),this.startPoint=new n("startPoint",0,.99,0,null,null,g,this.audioContext),this.multiTrackGain=[],this.maxLoops=n.createPsuedoParam("maxLoops",-1,1,-1,this.audioContext),this.setSources=function(e,t,n){this.isInitialized=!1,f(e,t,n)},this.play=function(){if(!this.isInitialized)throw new Error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play");var e=this.audioContext.currentTime;this.isPlaying||(p.forEach(function(t,n){var o=m&&m[n]?m[n]:d.startPoint.value*t.buffer.duration;t.loop=1!==d.maxLoops.value,t.start(e,o)}),t.prototype.start.call(this,e))},this.start=function(e,n,o,i){return this.isInitialized?void(this.isPlaying||(p.forEach(function(t){("undefined"==typeof n||null===n)&&(n=d.startPoint.value*t.buffer.duration),("undefined"==typeof o||null===o)&&(o=t.buffer.duration),t.loop=1!==d.maxLoops.value,t.start(e,n,o)}),t.prototype.start.call(this,e,n,o,i))):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.stop=function(e){p.forEach(function(t,n){d.isPlaying&&t.stop(e),m[n]=0}),t.prototype.stop.call(this,e)},this.pause=function(){p.forEach(function(e,t){d.isPlaying&&e.stop(0),m[t]=e.playbackPosition/e.buffer.sampleRate}),t.prototype.stop.call(this,0)},r&&f(r,c,s)}return a.prototype=Object.create(t.prototype),a}),define("core/SoundQueue",["core/Config","models/Looper","core/FileLoader","core/WebAudioDispatch"],function(e,t,n,o){function i(n,a){function r(){p(n.currentTime+1/e.NOMINAL_REFRESH_RATE),window.requestAnimationFrame(r)}function u(){for(var e=0;a>e;e++)v[e]=new t(null,n,null,null,c),v[e].disconnect(),v[e].maxLoops.value=1,v[e].voiceIndex=e;window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,window.requestAnimationFrame(r)}function c(e){v.push(e),y.splice(y.indexOf(e),1)}function s(e){for(h=0;h<y.length;h++)if(y[h].eventID==e)return y[h];return null}function l(e){for(var t=0;t<m.length;t++){var n=m[t];n.eventID===e&&(m.splice(t,1),t--)}}function f(e,t){var o;return v.length<1?(console.warn("No free voices left. Stealing the oldest"),o=y.shift(),l(o.eventID),o.eventID=e,o.release(n.currentTime,t-n.currentTime),y.push(o)):(o=v.shift(),o.eventID=e,y.push(o)),o}function d(e){var t=s(e.eventID);"QESTART"!=e.type&&"QESETPARAM"!=e.type&&"QESETSRC"!=e.type||null!==t||(t=f(e.eventID,e.time)),t&&("QESTART"==e.type?t.start(e.time,e.offset,null,e.attackDuration):"QESETPARAM"==e.type?t[e.paramName]&&t[e.paramName].setValueAtTime(e.paramValue,e.time):"QESETSRC"==e.type?o(function(){t.setSources(e.sourceBuffer)},e.time,n):"QERELEASE"==e.type?t.release(e.time,e.releaseDuration):"QESTOP"==e.type?(t.pause(e.time),o(function(){v.push(t),y.splice(y.indexOf(t),1)},e.time,n)):console.warn("Unknown Event Type : "+e))}function p(e){for(var t=0;t<m.length;t++){var n=m[t];n.time<=e&&(d(n),m.splice(t,1),t--)}}if(!(this instanceof i))throw new TypeError("SoundQueue constructor cannot be called as a function.");"undefined"==typeof a&&(a=e.MAX_VOICES);var h,m=[],y=[],v=[];this.queueStart=function(e,t,n,o){m.push({type:"QESTART",time:e,eventID:t,offset:n,attackDuration:o})},this.queueRelease=function(e,t,n){m.push({type:"QERELEASE",time:e,eventID:t,releaseDuration:n})},this.queueStop=function(e,t){m.push({type:"QESTOP",time:e,eventID:t})},this.queueSetParameter=function(e,t,n,o){m.push({type:"QESETPARAM",time:e,eventID:t,paramName:n,paramValue:o})},this.queueSetSource=function(e,t,n){m.push({type:"QESETSRC",time:e,eventID:t,sourceBuffer:n})},this.queueUpdate=function(e,t,n,o){for(var i=0;i<m.length;i++){var a=m[i];a.type!==e||t&&a.eventID!=t||a.hasOwnProperty(n)&&(a[n]=o)}},this.pause=function(){this.stop(0)},this.stop=function(e){p(e),m=[],y.forEach(function(t){t.release(e)}),v.forEach(function(t){t.stop(e)})},this.connect=function(e,t,n){v.forEach(function(o){o.connect(e,t,n)}),y.forEach(function(o){o.connect(e,t,n)})},this.disconnect=function(e){v.forEach(function(t){t.disconnect(e)}),y.forEach(function(t){t.disconnect(e)})},u()}return i}),define("core/Converter",[],function(){function e(){}return e.semitonesToRatio=function(e){return Math.pow(2,e/12)},e}),define("models/MultiTrigger",["core/Config","core/BaseSound","core/SoundQueue","core/SPAudioParam","core/MultiFileLoader","core/Converter","core/WebAudioDispatch"],function(e,t,n,o,i,a,r){function u(c,s,l,f){function d(e,t,n){i.call(v,e,v.audioContext,w(t),n)}function p(e){if(b>=v.maxSources-2){var t=b-(v.maxSources-2),n=e-T;A.queueRelease(e,t,n)}var o=g.length;v.eventRand.value?C=o>2?(C+Math.floor(Math.random()*(o-1)))%o:Math.floor(Math.random()*(o-1)):C%=o;var i=e,r=a.semitonesToRatio(v.pitchShift.value+Math.random()*v.pitchRand.value);A.queueSetSource(i,b,g[C]),A.queueSetParameter(i,b,"playSpeed",r),A.queueStart(i,b),b++,C++}function h(){for(var t=s.currentTime,n=t+1/e.NOMINAL_REFRESH_RATE;n>T+S;){var o=Math.max(t,T+S);p(o),T=o,S=m(v.eventRate.value)}v.isPlaying&&window.requestAnimationFrame(h)}function m(e){var t=1/e,n=Math.random()-.5,o=1+2*v.eventJitter.value*n,i=t*o;if(isFinite(i)){var a=Math.max(.99*t*(1-v.eventJitter.value),.01);A.queueUpdate("QERELEASE",null,"releaseDuration",a)}else i=31536e3;return i}function y(e,t){0===t?v.isPlaying&&(E=!0,v.pause()):(!v.isPlaying&&v.isInitialized&&E&&v.play(),v.isInitialized&&(S=m(t)))}if(!(this instanceof u))throw new TypeError("MultiTrigger constructor cannot be called as a function.");t.call(this,s);var v=this;this.maxSources=e.MAX_VOICES,this.minSources=1,this.modelName="MultiTrigger";var A,T=0,S=0,g=[],b=0,C=0,E=!1,w=function(e){return function(t,n){g=n,S=m(v.eventRate.value),A.connect(v.releaseGainNode),t&&(v.isInitialized=!0),"function"==typeof e&&e(t)}};this.pitchShift=o.createPsuedoParam("pitchShift",-60,60,0,this.audioContext),this.pitchRand=o.createPsuedoParam("pitchRand",0,24,0,this.audioContext),this.eventRand=o.createPsuedoParam("eventRand",!0,!1,!1,this.audioContext),this.eventRate=new o("eventRate",0,60,10,null,null,y,this.audioContext),this.eventJitter=o.createPsuedoParam("eventJitter",0,.99,0,this.audioContext),this.start=function(e,n,o,i){return this.isInitialized?(t.prototype.start.call(this,e,n,o,i),void r(h,e,this.audioContext)):void console.error(this.modelName," hasn't finished Initializing yet. Please wait before calling start/play")},this.play=function(){this.start(0)},this.stop=function(e){A.stop(e),E=!1,t.prototype.stop.call(this,e)},this.pause=function(){A.pause(),E=!1,t.prototype.pause.call(this)},this.setSources=function(e,t){this.isInitialized=!1,d(e,t,f)},A=new n(this.audioContext),c&&d(c,l,f)}return u.prototype=Object.create(t.prototype),u});