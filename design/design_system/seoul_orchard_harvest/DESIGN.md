# Design System Specification: The Ethereal Greenhouse

## 1. Overview & Creative North Star
### Creative North Star: "The Digital Curator’s Greenhouse"
This design system moves beyond the utility of a standard marketplace to create a "Digital Greenhouse." We are not just selling groceries; we are curated guardians of freshness and vitality. The aesthetic is defined by **Luminous Transparency** and **Organic Precision**. 

To break the "template" look common in e-commerce, we utilize intentional asymmetry, overlapping card structures, and high-contrast editorial typography. We prioritize breathing room over information density, ensuring the UI feels as fresh as the produce it displays.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the vitality of `Fresh Emerald Green` (#22C55E) and the energetic urgency of `Action Orange` (#FF6B00).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. Use `surface-container-low` sections against a `surface` background to denote change. Boundaries should feel felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass or fine washi paper. 
- **Base Layer:** `surface` (#f3fcef)
- **Secondary Sectioning:** `surface-container-low` (#edf6ea)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) for maximum "lift."
- **Nesting:** Place a `surface-container-lowest` card inside a `surface-container-low` section to create soft, natural depth without a single drop shadow.

### The "Glass & Gradient" Rule
Floating elements (e.g., sticky headers or mobile bottom sheets) must use Glassmorphism.
- **Token Use:** `surface_variant` at 70% opacity + 20px Backdrop Blur.
- **Signature Texture:** Primary CTAs should utilize a subtle linear gradient from `primary` (#006e2f) to `primary_container` (#22c55e) at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography: The Editorial Voice
We use **Plus Jakarta Sans** for Latin characters and **Pretendard** for Korean optimization. This pairing ensures high readability at small sizes and a sophisticated, modern character at display sizes.

| Scale | Token | Usage |
| :--- | :--- | :--- |
| **Display** | `display-lg` | Editorial hero moments; limited to single-word impact (e.g., "신선함"). |
| **Headline** | `headline-md` | Section headers; used with ample margin-top to create breathing room. |
| **Title** | `title-lg` | Product names and high-level card information. |
| **Body** | `body-md` | Product descriptions and primary reading text. |
| **Label** | `label-md` | Micro-copy, metadata, and tiny utility instructions. |

**Editorial Note:** Use `display-sm` for price points to give them a "boutique" feel. Always ensure Korean characters have a slightly increased line-height (1.6x) to accommodate the visual complexity of Hangul.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural lines.

- **The Layering Principle:** Stack tiers to define importance. A search bar should sit on `surface-container-highest` to draw the eye against a `surface` background.
- **Ambient Shadows:** Shadows are reserved for elements that physically "float" (Modals/Popovers). Use `on-surface` (#161d16) at 6% opacity with a 32px blur. The shadow must feel like ambient light, not a dark smudge.
- **The "Ghost Border" Fallback:** If a container requires definition for accessibility, use `outline-variant` (#bccbb9) at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons (버튼)
- **Primary:** `primary` background, `on-primary` text. Use the 135° gradient.
  - *Label Example:* **지금 구매하기** (Buy Now)
- **Secondary:** `secondary_container` background, `on-secondary_container` text.
  - *Label Example:* **장바구니 담기** (Add to Cart)
- **Rounding:** Strictly `DEFAULT` (12px) for buttons to maintain the modern, approachable feel.

### Chips (칩)
- Use for categories like "당일 배송" (Same-day Delivery) or "유기농" (Organic).
- Style: `surface-container-high` background with `on-surface-variant` text. No border.

### Input Fields (입력 필드)
- Background: `surface-container-highest`.
- Active State: A 2px `primary` bottom-bar only, rather than a full-box focus ring.
- *Label Example:* **배송지 입력** (Enter delivery address)

### Cards & Lists (카드 및 리스트)
- **Rule:** Forbid all divider lines.
- **Spacing:** Use 24px vertical white space between list items. Use `surface-container-low` background cards to group related items.
- **Asymmetry:** In product grids, slightly offset every second image by 8px vertically to create a rhythmic, editorial flow that mimics a physical magazine layout.

---

## 6. Do's and Don'ts

### Do
- **Do** use `surface-bright` for highlights in dark-mode transitions to maintain the "greenhouse" glow.
- **Do** use "Action Orange" (`secondary`) sparingly—only for conversion (Buy buttons, Sale badges).
- **Do** prioritize Korean typography hierarchy; use font-weight (Bold vs Regular) rather than color to differentiate titles from body text.

### Don't
- **Don't** use pure black (#000000) for text. Use `on-surface` (#161d16) to keep the palette organic and soft.
- **Don't** use "Standard" 8px rounding. The `12px` (`DEFAULT`) rounding is our signature; it is the bridge between organic shapes and digital precision.
- **Don't** use traditional "shadow-heavy" cards. If the UI feels cluttered, increase the whitespace (`48px+` between sections) rather than adding borders.

---

## 7. Multi-Device Integrated Tokens
- **Mobile (Handheld):** Tap targets for buttons must be 48dp minimum. Use `surface-container-lowest` for bottom navigation bars with a 20px backdrop blur.
- **Desktop (Wide):** Utilize the extra horizontal space for asymmetric image placement and "floating" product cards that overlap section backgrounds by 32px.