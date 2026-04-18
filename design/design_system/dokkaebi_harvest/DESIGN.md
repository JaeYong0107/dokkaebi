# Design System Specification: The High-Velocity Garden

## 1. Overview & Creative North Star
This design system is engineered to bridge the gap between organic freshness and industrial-grade efficiency. We are moving beyond the generic "grocery app" aesthetic to embrace a Creative North Star we call **"The High-Velocity Garden."**

Most B2B platforms feel like spreadsheets; most B2C platforms feel like toy stores. This system rejects both. It treats grocery commerce with the reverence of a high-end editorial catalog and the precision of a logistics dashboard. We achieve this through "Organic Brutalism"—using rigid, high-density information layouts softened by lush tonal layering, generous white space, and sophisticated glassmorphism. We break the grid with intentional asymmetry, allowing hero products to overlap container boundaries, suggesting movement and "just-harvested" vitality.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is anchored by the authority of **Deep Green (`primary`)** and the kinetic energy of **Electric Orange (`secondary_container`)**. 

### The "No-Line" Rule
To achieve a premium feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts.
- Use `surface` as your base.
- Use `surface_container_low` to define secondary content zones.
- Use `surface_container_high` for interactive regions.
This creates a seamless, "molded" look rather than a fragmented, "boxed-in" layout.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-weight paper.
- **Base Layer:** `surface` (#f6fbf1) – The canvas.
- **Nesting:** Place `surface_container_lowest` cards onto `surface_container` sections to create soft, natural lift without the clutter of shadows.

### The "Glass & Gradient" Rule
To escape the "flat" trap:
- **Glassmorphism:** For floating navigation or "Quick Reorder" bars, use `surface_bright` with a 20% opacity and a `24px` backdrop blur.
- **Signature Gradients:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#004c16) to `primary_container` (#0b6623) at a 135-degree angle to provide visual "soul."

---

## 3. Typography: Editorial Authority
We utilize a dual-font strategy to balance character with readability.

- **Headlines (Manrope):** A modern, geometric sans-serif used for `display` and `headline` scales. It feels engineered and premium. Use `headline-lg` for product categories to command attention.
- **Utility (Inter):** Our workhorse for `title`, `body`, and `label` scales. Inter provides the high-legibility required for dense B2B inventory lists.

**Price Hierarchy Strategy:**
In a hybrid platform, price is the most critical data point.
- **Business Price:** Use `title-lg` in `primary` (#004c16) with a bold weight. This is the "authoritative" price.
- **Regular Price:** Use `body-sm` in `on_surface_variant` (#40493e) with a strikethrough. 
- Place them in a vertical stack to save horizontal space, allowing for higher information density.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often the mark of an amateur. We define hierarchy through **Tonal Layering.**

- **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card sitting on a `surface_container_low` background creates a sophisticated "lift" that feels integrated into the architecture.
- **Ambient Shadows:** When an element *must* float (e.g., a modal or a floating action button), use extra-diffused shadows. 
    - *Blur:* 32px to 64px. 
    - *Opacity:* 4%–6%.
    - *Color:* Use a tinted version of `on_surface` rather than pure black.
- **The "Ghost Border" Fallback:** For accessibility in high-density data tables, use a "Ghost Border"—the `outline_variant` token at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons: The Kinetic Engine
- **Primary (Electric Orange):** Use `secondary_container` (#fe6b00) with `on_secondary_container`. Reserved strictly for the final "Checkout" or "Add to Cart." Apply `rounded-md` (0.375rem).
- **Quick Reorder:** A high-density pill-shaped button (`rounded-full`) using `primary_fixed`. It should include a small "Previously bought" label in `label-sm`.

### Product Cards: The "No-Divider" List
Forbid the use of divider lines. Separate product entries using `16px` of vertical white space and subtle background shifts.
- **B2B Density:** Product cards should be horizontal in B2B views to allow for bulk-quantity selectors and SKU numbers without increasing vertical height.
- **Visual Soul:** Allow product imagery to slightly break the card's top-left boundary, creating a sense of "freshness" and breaking the digital box.

### Input Fields: Clean Functionality
- **Default State:** `surface_container_highest` background with a `ghost border`.
- **Focus State:** Transition the border to `primary` at 2px thickness. No "glow" effects; keep it crisp.

### "Quick Reorder" Floating Bar
A signature component for this system. A glassmorphic bar positioned at the bottom of the viewport on mobile/web, using `surface_bright` at 80% opacity with a heavy blur. It houses the last 3 purchased items for one-tap replenishment.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `on_surface_variant` for metadata (SKUs, weights, units) to keep the UI from feeling "heavy."
- **Do** use the `rounded-xl` (0.75rem) for large promotional banners to make them feel inviting.
- **Do** leverage the asymmetry of Manrope for large typography-driven layouts.

### Don't:
- **Don't** use 100% black (#000000) for text. Use `on_surface` (#181d17) for a softer, premium contrast.
- **Don't** use standard "Success" green. Use our `primary` (#004c16) to maintain brand cohesion.
- **Don't** use dividers between list items. Trust the `surface` color shifts and white space to guide the eye.
- **Don't** use generic iconography. Use "Stroke" style icons with a 1.5px weight to match the Inter typeface's visual weight.

---
**Director's Final Note:** 
Precision is the foundation of trust. In grocery commerce, a single misplaced pixel can make a platform feel "cheap" or "unreliable." Use the tonal layers to guide the user's eye toward the Electric Orange CTAs. Efficiency isn't just about speed; it's about the absence of friction.