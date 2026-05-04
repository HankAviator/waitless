// ==UserScript==
// @name         Waitless
// @namespace    han.universal.countdown.speeder
// @version      1.0.2
// @description  Speeds up client-side countdown timers on download pages.
// @author       HankAviator
// @license      GPL-3.0-or-later
// @match        https://1fichier.com/*
// @match        https://buzzheavier.com/*
// @match        https://dailyuploads.net/*
// @match        https://ddownload.com/*
// @match        https://dosya.co/*
// @match        https://gofile.io/*
// @match        https://hexload.com/*
// @match        https://megaup.net/*
// @match        https://rapidgator.net/*
// @match        https://usersdrive.com/*
// @match        https://vikingfile.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
	'use strict';

	/**
	 * Increase this to make timers faster.
	 * 10  = 10 seconds becomes 1 second
	 * 30  = 30 seconds becomes 1 second
	 * 100 = 100 seconds becomes 1 second
	 */
	const SPEED_FACTOR = 30;

	/**
	 * Prevents extremely small timers from becoming 0ms and breaking pages.
	 */
	const MIN_TIMER_MS = 10;

	const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

	const NativeDate = w.Date;
	const nativeDateNow = NativeDate.now.bind(NativeDate);

	const nativeSetTimeout = w.setTimeout.bind(w);
	const nativeSetInterval = w.setInterval.bind(w);

	const realStart = nativeDateNow();
	const fakeStart = realStart;

	function fakeNow() {
		const realElapsed = nativeDateNow() - realStart;
		return fakeStart + realElapsed * SPEED_FACTOR;
	}

	function scaleDelay(delay) {
		const n = Number(delay);

		if (!Number.isFinite(n) || n <= 0) {
			return delay;
		}

		return Math.max(MIN_TIMER_MS, n / SPEED_FACTOR);
	}

	// Hook setTimeout
	w.setTimeout = function (callback, delay, ...args) {
		return nativeSetTimeout(callback, scaleDelay(delay), ...args);
	};

	// Hook setInterval
	w.setInterval = function (callback, delay, ...args) {
		return nativeSetInterval(callback, scaleDelay(delay), ...args);
	};

	// Hook Date and Date.now
	function FakeDate(...args) {
		if (this instanceof FakeDate) {
			if (args.length === 0) {
				return new NativeDate(fakeNow());
			}

			return new NativeDate(...args);
		}

		return new NativeDate(fakeNow()).toString();
	}

	FakeDate.now = fakeNow;
	FakeDate.parse = NativeDate.parse;
	FakeDate.UTC = NativeDate.UTC;
	FakeDate.prototype = NativeDate.prototype;

	Object.setPrototypeOf(FakeDate, NativeDate);

	w.Date = FakeDate;

	// Hook performance.now if possible
	if (w.performance && typeof w.performance.now === 'function') {
		const nativePerformanceNow = w.performance.now.bind(w.performance);
		const perfStart = nativePerformanceNow();

		try {
			Object.defineProperty(w.performance, 'now', {
				configurable: true,
				writable: true,
				value: function () {
					const realElapsed = nativePerformanceNow() - perfStart;
					return perfStart + realElapsed * SPEED_FACTOR;
				}
			});
		} catch (e) {
			// Some browsers/pages do not allow overriding performance.now
		}
	}

	console.log(`[Universal Countdown Speeder] Active. Speed factor: ${SPEED_FACTOR}x`);
})();
