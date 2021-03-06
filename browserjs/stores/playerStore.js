var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var $ = require('jquery');
var _ = require('underscore');
var store = require('../../lib/store');

var index = 0,
	paused = false;

function getFirstAvailableParagraph(paragraphs) {
	do {
		var p = paragraphs[index];
		if (p && !p.match(/^[\s\n]*$/)) {
			break;
		}
		index++;
	} while (true);
	return p;
}

var Store = assign({}, EventEmitter.prototype, {

	init: function() {
		/* todo
		articleStore = _articleStore;
		articleStore.observe('pageChange', function() {
			//var wasPlaying = speechSynthesis.speaking && !paused;
			this.stop(1);
			//if(wasPlaying){
			//	this.play(1);
			//}
		}.bind(this));
		*/
	},
	play: function() {
		/* todo
		paused = false;
		if (paused || speechSynthesis.speaking) {
			this.trigger('statusChange')
			return speechSynthesis.resume();
		}
		var p = getFirstAvailableParagraph(articleStore.bodyParagraphs);
		if (!p) {
			return;
		}
		this.u = this._getUtterance(p);
		this.observeUtterance();
		articleStore.hilight(index);
		speechSynthesis.speak(this.u);
		this.trigger('statusChange')
		*/
	},
	pause: function() {
		if (!speechSynthesis.speaking) {
			return;
		}
		if (!paused) {
			paused = true;
			speechSynthesis.pause();
		} else {
			paused = false;
			speechSynthesis.resume();
		}
		this.trigger('statusChange')
	},
	stop: function() {
		if (!speechSynthesis.speaking) {
			return;
		}
		paused = false;
		index = 0;
		this.stopObservingUtterance();
		delete this.u;
		speechSynthesis.cancel();
		////todo
		//articleStore.dehilight(index);
		this.trigger('statusChange')
	},
	observeUtterance: function() {
		/* todo
		$(this.u).one('end', function(e) {
			if (++index >= articleStore.bodyParagraphs.length) {
				gotoNextPage().then(this.play);
			}
			this.play();
		}.bind(this));
		*/
	},
	stopObservingUtterance: function() {
		$(this.u).off('end');
	},
	get state() {
		return {
			index: index,
			isPlaying: speechSynthesis.speaking,
			isPausing: paused
		}
	},
	_getUtterance: function(p) {
		if (navigator.userAgent.match(/iPhone/i)) {
			return this._getUtteranceForMobile(p);
		} else {
			return this._getUtteranceForChrome(p);
		}
	},
	_getUtteranceForChrome: function(p) {
		var u = new SpeechSynthesisUtterance(p);
		u.lang = 'zh-CN';
		u.pitch = 1;
		u.rate = 1.2;
		u.voiceURI = 'native';
		u.volume = .6;
		return u;
	},
	_getUtteranceForMobile: function(p) {
		var u = new SpeechSynthesisUtterance(p);
		u.lang = 'zh-CN';
		u.pitch = .8;
		u.rate = .6;
		u.voiceURI = 'native';
		u.volume = .6;
		return u;
	},
}, store);
Store.init();
