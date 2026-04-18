```markdown
# Design System Document: The Editorial Harvest

## 1. Overview & Creative North Star
### "The Editorial Harvest"
Traditional B2B ingredient platforms are often utilitarian, cluttered, and rigid. This design system breaks that mold by adopting a **Creative North Star: The Editorial Harvest.** 

We are not building a warehouse interface; we are building a high-end digital catalog that feels as fresh as the produce it sells. This system moves beyond the "template" look by using **intentional asymmetry**, **exaggerated white space**, and **tonal layering**. The goal is to evoke the feeling of a premium culinary magazine—where high-contrast typography and breathable layouts establish an immediate sense of business trust and premium quality.

---

## 2. Colors: Tonal Depth over Structural Lines
The palette is rooted in the earth (Deep Green) and ignited by the urgency of commerce (Electric Orange).

### The "No-Line" Rule
**Explicit Instruction:** Junior designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined strictly through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
2.  **Negative Space:** Using the spacing scale to create invisible boundaries.

### Color Tokens & Roles
*   **Primary (#004C16 - #0B6623):** The "Deep Green." Used for brand presence and primary structural elements.
*   **Secondary (#A04100 - #FE6B00):** The "Electric Orange." Reserved exclusively for high-velocity actions: "Add to Cart," "Reorder Now," and "Limited Stock."
*   **Tertiary (#771E3D):** Used for "Business-Only" pricing and exclusive B2B loyalty indicators to provide a sophisticated contrast to the green/orange.

### Signature Textures & Glassmorphism
To avoid a "flat" feel, use **Glassmorphism** for floating elements (like mobile bottom navigation or category filters). 
*   **Token:** `surface` at 80% opacity + 16px backdrop-blur. 
*   **Gradients:** Use subtle linear gradients for Hero CTAs, transitioning from `primary` to `primary_container` at a 135-degree angle to provide a "lit from within" professional polish.

---

## 3. Typography: The Hierarchy of Authority
We pair the functional clarity of **Inter/Pretendard** with the high-fashion editorial feel of **Plus Jakarta Sans** (as defined in our tokens).

*   **Display & Headlines (Plus Jakarta Sans):** These are your "hooks." Use `display-lg` for hero sections with tight letter-spacing (-0.02em) to create an authoritative, premium look.
*   **Titles & Body (Inter/Pretendard):** Built for speed and legibility. `title-md` is the workhorse for product names.
*   **Pricing Typography:** 
    *   **General Price:** `body-md` in `on_surface_variant`.
    *   **Business Price:** `title-lg` in `primary`, bolded. This creates an immediate visual "reward" for logged-in business users.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop." We use **Tonal Layering** to create "position."

### The Layering Principle
Think of the UI as stacked sheets of fine, heavy-weight paper.
1.  **Base Layer:** `surface` (#F9F9FC)
2.  **Sectional Layer:** `surface_container_low` (to group related products)
3.  **Interaction Layer (Cards):** `surface_container_lowest` (#FFFFFF)

### Ambient Shadows
When a card must float (e.g., a "Quick Reorder" snackbar), use an **Ambient Shadow**:
*   **X:0, Y:8, Blur:24, Spread:0.**
*   **Color:** `on_surface` at **4% opacity**. It should be felt, not seen.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use a **Ghost Border**: `outline_variant` at 15% opacity. Never use a 100% opaque border.

---

## 5. Components

### 5.1 Buttons (Action Anchors)
*   **Primary Action:** `secondary` (#A04100) background. Roundedness: `full`. This is the "Speed" button.
*   **Secondary Action:** `primary_container` (#0B6623). Roundedness: `xl`. This is the "Freshness/Trust" button.
*   **Tertiary (Text-only):** `on_surface` with no background, used for "View Details."

### 5.2 Product Cards & Lists
*   **The Rule:** No divider lines between list items. Use 16px or 24px vertical padding to separate items.
*   **B2B Price Badge:** A small, `tertiary_container` pill next to the price to validate the business discount.
*   **Image Ratio:** 1:1 or 4:5 (Portrait) to emphasize the "Editorial" feel.

### 5.3 Inputs & Search
*   **Style:** `surface_variant` background with a `md` roundedness. 
*   **Focus State:** Instead of a heavy border, use a 2px `primary` "Ghost Border" at 40% opacity.

### 5.4 Specialized B2B Components
*   **The "Fast Reorder" Chip:** A high-contrast `secondary_fixed` chip that appears on the product card for items frequently purchased by the business.
*   **Inventory Status:** A subtle `on_surface_variant` label indicating "Next Day Delivery Available."

---

## 6. Do's and Don'ts

### Do
*   **Do** allow elements to overlap slightly (e.g., a product image bleeding out of a card boundary) to break the "grid-box" feel.
*   **Do** use `surface_container_highest` for "Business Trust" sections (Certifications, HACCP info) to give them weight.
*   **Do** prioritize the **Business Price** as the largest typographic element on the card.

### Don't
*   **Don't** use 1px solid #CCCCCC or #EEEEEE dividers. If you feel the need for a line, increase the whitespace by 8px instead.
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#1A1C1E) to maintain a premium, softer contrast.
*   **Don't** use sharp corners. The `xl` (0.75rem) and `full` roundedness tokens are essential to conveying "Freshness."

---

## 7. Responsive Grid Strategy
*   **Desktop (12-Column):** Max-width 1440px. Use wide gutters (32px) to allow the "Editorial" layout to breathe. Use the outer columns for asymmetrical "asides" or category navigation.
*   **Mobile (4-Column):** Focus on the thumb-zone. The primary "Add to Cart" action should be a floating bar using the **Glassmorphism** rule to ensure the product content remains visible underneath.

---
**Director's Final Note:** This system is about the tension between the "Deep Green" of the earth and the "Electric Orange" of the trade. Keep the backgrounds quiet so the products and actions can speak loudly.```