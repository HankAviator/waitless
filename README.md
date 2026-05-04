# waitless

`waitless` is a Greasemonkey/Tampermonkey userscript that speeds up JavaScript-driven countdowns on pages by making browser timers appear to move faster.

It has no configuration panel and runs on all websites by default.

## What It Changes

The current script accelerates:

- `setTimeout`
- `setInterval`
- `Date` and `Date.now()`
- `performance.now()` when the page allows it to be overridden

Default behavior in [`waitless.js`](/d:/gitproject/waitless/waitless.js):

- Speed factor: `30x`
- Minimum scheduled delay: `10ms`
- Match pattern: `*://*/*`
- Run timing: `document-start`

## What It Can Help With

If a page relies only on client-side JavaScript countdowns before enabling a button or showing content, this script may make that countdown finish sooner.

## Limits

This does not bypass:

- server-enforced waiting periods
- token validation
- CAPTCHAs
- rate limits
- download rules enforced outside page-side JavaScript

Some sites may also behave incorrectly if they depend on real-time timing for animations, polling, or anti-tamper logic.

## Installation

1. Install a userscript manager such as Greasemonkey or Tampermonkey.
2. Create a new userscript.
3. Paste in the contents of [`waitless.js`](/d:/gitproject/waitless/waitless.js).
4. Save the script and reload the page you want to test.

## Verification

The current version was verified locally with a small Node-based harness that executed the userscript in a mocked browser environment.

Observed behavior:

- a `3000ms` timeout fired in about `100ms`
- `Date.now()` advanced about `30x` faster than real elapsed time
- `performance.now()` advanced about `30x` faster than real elapsed time

That confirms the present implementation is working as written for timer acceleration. Real-world results still depend on how each site implements its waiting logic.
