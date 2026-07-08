---
name: Professional Ledger System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

The design system is engineered for high-stakes professional environments where information density, clarity, and trust are paramount. It follows a **Minimalist Corporate** aesthetic, prioritizing legibility and structural integrity over decorative elements. 

The visual language is defined by a strict adherence to a "flat-plus" philosophy: depth is communicated through subtle tonal changes and crisp borders rather than shadows or gradients. This approach ensures a high-trust environment suitable for financial analysis, data monitoring, and institutional tooling. The emotional response is one of calm, precise, and unwavering reliability.

## Colors

The palette is anchored by a high-contrast relationship between pure white surfaces and deep charcoal typography. 

- **Core Surfaces:** Pure `#FFFFFF` is used for the primary content area to maximize contrast. `#F8FAFC` is reserved for layout containers, sidebars, and header backgrounds to provide subtle structural grouping.
- **Typography:** The primary text uses `#0F172A` to ensure maximum readability and an authoritative tone.
- **Accents & Semantics:** A strict semantic system is employed for P&L data. Green (`#10B981`) and Red (`#EF4444`) are used only for status and performance indicators, calibrated to remain legible against both white and off-white backgrounds.
- **Borders:** All UI segmentation is handled by `#E2E8F0`. No shadows or blurs are permitted.

## Typography

Typography is the primary driver of hierarchy in this design system. We utilize two distinct families:

1.  **Hanken Grotesk:** Used for all UI labels, headings, and instructional body text. It provides a sharp, contemporary professional feel.
2.  **JetBrains Mono:** Dedicated exclusively to numeric data, tables, and code snippets. The monospaced nature ensures that columns of numbers align perfectly, facilitating rapid scanning of P&L sheets and data grids.

Weight is used sparingly to denote importance: Bold (700) for headers, Medium (500) for data values, and Regular (400) for body descriptions.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop views to maintain a controlled information density, transitioning to a fluid model for mobile devices.

- **Grid:** A 12-column grid system with 24px (`1.5rem`) gutters.
- **Rhythm:** A strict 4px base unit controls all spacing. 
- **Density:** High density is preferred. Padding in data-heavy components (like tables) should favor vertical compactness (8px - 12px) to allow more information to be visible above the fold.
- **Breakpoints:**
    - Desktop: 1280px+ (Fixed container)
    - Tablet: 768px - 1279px (Fluid, 24px margins)
    - Mobile: Below 768px (Fluid, 16px margins)

## Elevation & Depth

In alignment with the high-trust, professional aesthetic, this design system **eschews all drop shadows**. Depth is created through a "Layered Tonal" approach:

1.  **Level 0 (Floor):** Use `#F8FAFC` for the global background of the application.
2.  **Level 1 (Cards/Workspaces):** Use pure `#FFFFFF` for the primary work surfaces. These are defined by a 1px border of `#E2E8F0`.
3.  **Level 2 (Modals/Overlays):** These sit on the highest plane, also using `#FFFFFF` but distinguished by a slightly darker border (`#CBD5E1`) to separate them from the Level 1 surfaces.

Interaction states (hover/active) should use subtle background color shifts (e.g., `#F1F5F9`) rather than raising the element physically.

## Shapes

The shape language is "Soft-Square." We use a consistent **0.25rem (4px)** radius for most UI components (buttons, input fields, cards). This provides a subtle nod to modern UI trends while remaining grounded in a professional, structured grid. 

- Small components (chips/tags): 4px radius.
- Standard containers (cards): 4px radius.
- Layout containers (sidebars): 0px radius (flush to the edge).

## Components

### Buttons
- **Primary:** Solid `#0F172A` background with `#FFFFFF` text. No rounded-pill shapes; use the standard 4px radius.
- **Secondary:** Transparent background with a 1px `#E2E8F0` border and `#0F172A` text.
- **Ghost:** No border, `#64748B` text, shifting to a light gray background on hover.

### Data Tables
- Header cells: `#F8FAFC` background, `#0F172A` bold text, 1px bottom border.
- Data cells: JetBrains Mono for all numeric values. High alignment precision (right-aligned for numbers, left-aligned for text).

### Input Fields
- White background with `#E2E8F0` border. On focus, the border color shifts to `#0F172A`. No glow or shadow effects.

### Chips & Tags
- Used for status. For P&L indicators, use light background tints (e.g., Green-50) with high-contrast text of the same hue to ensure accessibility without overwhelming the UI.

### Cards
- Pure white background, 1px `#E2E8F0` border, 4px corner radius. Group related data points within cards to maintain a clean "dashboard" layout.