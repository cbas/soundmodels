/*soundmodels - v2.5.4 - Tue Apr 21 2015 11:27:00 GMT+0800 (SGT) */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.SPAudioBuffer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";function SPAudioBuffer(e,t,r,n,o){if(!(e instanceof AudioContext))return void log.error("First argument to SPAudioBuffer must be a valid AudioContext");var i,a,u,f;this.audioContext=e,this.duration=null,Object.defineProperty(this,"numberOfChannels",{get:function(){return this.buffer?this.buffer.numberOfChannels:0}}),Object.defineProperty(this,"sampleRate",{get:function(){return this.buffer?this.buffer.sampleRate:0}}),this.getChannelData=function(e){return this.buffer?this.buffer.getChannelData(e):null},this.isSPAudioBuffer=!0,Object.defineProperty(this,"buffer",{set:function(e){if(null===u)this.startPoint=0;else if(u>e.length/e.sampleRate)return void log.error("SPAudioBuffer : startPoint cannot be greater than buffer length");if(null===f)this.endPoint=this.rawBuffer_.length;else if(f>e.length/e.sampleRate)return void log.error("SPAudioBuffer : endPoint cannot be greater than buffer length");a=e,this.updateBuffer()}.bind(this),get:function(){return i}}),this.sourceURL=null,Object.defineProperty(this,"startPoint",{set:function(e){return void 0!==f&&e>=f?void log.error("SPAudioBuffer : startPoint cannot be greater than endPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : startPoint cannot be greater than or equal to buffer length"):(u=e,void this.updateBuffer())}.bind(this),get:function(){return u}}),Object.defineProperty(this,"endPoint",{set:function(e){return void 0!==u&&u>=e?void log.error("SPAudioBuffer : endPoint cannot be lesser than startPoint"):a&&e*a.sampleRate>=a.length?void log.error("SPAudioBuffer : endPoint cannot be greater than buffer or equal to length"):(f=e,void this.updateBuffer())}.bind(this),get:function(){return f}}),this.updateBuffer=function(){if(a){if((null===u||void 0===u)&&(u=0),(null===f||void 0===f)&&(f=a.duration),this.duration=f-u,this.length=Math.ceil(a.sampleRate*this.duration)+1,this.length>0){i&&i.length==this.length&&i.numberOfChannels==a.numberOfChannels&&i.sampleRate==a.sampleRate||(i=this.audioContext.createBuffer(a.numberOfChannels,this.length,a.sampleRate));for(var e=Math.floor(u*a.sampleRate),t=Math.ceil(f*a.sampleRate),r=0;r<a.numberOfChannels;r++){var n=new Float32Array(a.getChannelData(r));i.getChannelData(r).set(n.subarray(e,t))}}}else this.duration=0};var l=Object.prototype.toString.call(t),s=Object.prototype.toString.call(r),h=Object.prototype.toString.call(n),d=Object.prototype.toString.call(o);"[object String]"===l||"[object File]"===l?this.sourceURL=t:"[object AudioBuffer]"===l?this.buffer=t:log.error("Incorrect Parameter Type. url can only be a String, File or an AudioBuffer"),"[object Number]"===s?this.startPoint=parseFloat(r):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. startPoint should be a Number. Setting startPoint to 0"),"[object Number]"===h?this.endPoint=parseFloat(n):"[object Undefined]"!==s&&log.warn("Incorrect Parameter Type. endPoint should be a Number. Setting endPoint to end of dile"),"[object AudioBuffer]"!==d||this.buffer||(this.buffer=o)}var log=_dereq_("loglevel");module.exports=SPAudioBuffer;
},{"loglevel":2}],2:[function(_dereq_,module,exports){
!function(e,o){"object"==typeof module&&module.exports&&"function"==typeof _dereq_?module.exports=o():"function"==typeof define&&"object"==typeof define.amd?define(o):e.log=o()}(this,function(){function e(e){return typeof console===f?!1:void 0!==console[e]?o(console,e):void 0!==console.log?o(console,"log"):c}function o(e,o){var n=e[o];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function n(e,o){return function(){typeof console!==f&&(t(o),r[e].apply(r,arguments))}}function t(e){for(var o=0;o<u.length;o++){var n=u[o];r[n]=e>o?c:r.methodFactory(n,e)}}function l(e){var o=(u[e]||"silent").toUpperCase();try{return void(window.localStorage.loglevel=o)}catch(n){}try{window.document.cookie="loglevel="+o+";"}catch(n){}}function i(){var e;try{e=window.localStorage.loglevel}catch(o){}if(typeof e===f)try{e=/loglevel=([^;]+)/.exec(window.document.cookie)[1]}catch(o){}void 0===r.levels[e]&&(e="WARN"),r.setLevel(r.levels[e])}var r={},c=function(){},f="undefined",u=["trace","debug","info","warn","error"];r.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},r.methodFactory=function(o,t){return e(o)||n(o,t)},r.setLevel=function(e){if("string"==typeof e&&void 0!==r.levels[e.toUpperCase()]&&(e=r.levels[e.toUpperCase()]),!("number"==typeof e&&e>=0&&e<=r.levels.SILENT))throw"log.setLevel() called with invalid level: "+e;return l(e),t(e),typeof console===f&&e<r.levels.SILENT?"No console available for logging":void 0},r.enableAll=function(){r.setLevel(r.levels.TRACE)},r.disableAll=function(){r.setLevel(r.levels.SILENT)};var a=typeof window!==f?window.log:void 0;return r.noConflict=function(){return typeof window!==f&&window.log===r&&(window.log=a),r},i(),r});


},{}]},{},[1])(1)
});