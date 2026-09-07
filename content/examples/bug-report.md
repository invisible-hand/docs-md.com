---
title: Bug report: checkout total drops the discount after changing quantity
filename: bug-report.md
description: A filled-in bug report — one-line summary, environment, exact steps, expected vs actual, evidence, scope, and a workaround — written so the engineer can reproduce it without asking a single follow-up question.
---
# Bug: checkout total drops the applied discount after changing item quantity

## Summary

On the checkout page, changing a line-item quantity after a promo code has been applied recomputes the subtotal but silently removes the discount. The promo code still shows as "applied", so customers are overcharged without warning.

## Environment

- Product: `acme/shop-web`, production, build `2026.09.04-1` (commit `c81d2f7`)
- URL: `https://shop.acme.example/checkout`
- Browser: Chrome 140.0 on macOS 15.6; also reproduced on Safari 18.5 (iPhone 15)
- Account: any logged-in customer; also reproduces as a guest
- Region / currency: US, USD

## Steps to reproduce

1. Add "Trail Runner 2" (SKU `TR2-BLK-42`) to the cart, quantity 1.
2. Open `/checkout` and apply promo code `SAVE10` (10 % off, active until 2026-12-31).
3. Confirm the total shows the discount line: `Subtotal $120.00 · Discount −$12.00 · Total $108.00`.
4. Change the quantity of "Trail Runner 2" from 1 to 2 using the quantity stepper.

## Expected result

Subtotal updates to $240.00, discount updates to −$24.00, total $216.00. Promo badge stays "SAVE10 applied".

## Actual result

Subtotal updates to $240.00, the **discount line disappears**, total shows $240.00. The promo badge still reads "SAVE10 applied". Placing the order charges $240.00 (verified on a test card; order `#A1-73921`).

## Evidence

- Screen recording: `checkout-discount-drop.mp4` (14 s, attached to the ticket)
- Network: `PATCH /api/cart/lines/ln_8f21` → 200; response body has `"discounts": []` while the request before the change returned `"discounts": [{"code":"SAVE10","amount":1200}]`
- Console: no errors
- Order in admin: `#A1-73921`, discount field empty, promo usage counter for `SAVE10` **was** incremented

## Scope and impact

- Reproduces 5/5 on production and 5/5 on staging (`2026.09.04-1`).
- Does **not** reproduce on the previous build `2026.08.28-2` (staging rollback).
- Only quantity changes trigger it; removing a line or adding a new product keeps the discount.
- Support has 11 tickets since 2026-09-04 matching "discount disappeared" — likely the same bug.

## Workaround

Remove and re-apply the promo code after changing quantities. The discount then recomputes correctly. Support is telling customers this in the meantime.

## Suspected cause (optional)

The quantity endpoint was changed in `2026.09.04-1` ("cart: recompute line totals server-side", PR #4127). The new handler builds the cart response from `lines` only and never re-reads `cart.discounts`; the promo badge is rendered from client state, which is why it still looks applied.

## Attachments

- `checkout-discount-drop.mp4`
- `har-checkout-quantity-change.har` (cookies stripped)
