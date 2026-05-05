# Waitless

`Waitless` is a Greasemonkey/Tampermonkey userscript that speeds up JavaScript-driven countdowns on supported download pages by making browser timers appear to move faster.

It has no configuration panel and runs only on the hosts listed in the userscript header.

## What It Changes

The current script accelerates:

- `setTimeout`
- `setInterval`
- `Date` and `Date.now()`
- `performance.now()` when the page allows it to be overridden
- only delays of `500ms` or more are accelerated, so short polling and animation timers stay at normal speed

Default behavior in `waitless.js`:

- Speed factor: `30x`
- Minimum accelerated delay: `500ms`
- Minimum scheduled delay after scaling: `10ms`
- Match patterns: the listed download hosts in the userscript header
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
2. Open Greasy Fork at <https://greasyfork.org/>.
3. Find the `Waitless` script and click its install button.
4. Confirm the installation in your userscript manager.
5. Reload the page you want to test.

## Verification

The current version was verified locally with a small Node-based harness that executed the userscript in a mocked browser environment.

Observed behavior:

- a `3000ms` timeout fired in about `100ms`
- `Date.now()` advanced about `30x` faster than real elapsed time
- `performance.now()` advanced about `30x` faster than real elapsed time

That confirms the present implementation is working as written for timer acceleration. Real-world results still depend on how each site implements its waiting logic.
