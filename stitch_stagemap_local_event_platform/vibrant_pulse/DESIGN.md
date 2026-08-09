---
name: Vibrant Pulse
colors:
  surface: '#fef7ff'
  surface-dim: '#dfd7e6'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f1ff'
  surface-container: '#f3ebfa'
  surface-container-high: '#ede5f4'
  surface-container-highest: '#e8dfee'
  on-surface: '#1d1a24'
  on-surface-variant: '#4a4455'
  inverse-surface: '#332f39'
  inverse-on-surface: '#f6eefc'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#b71422'
  on-secondary: '#ffffff'
  secondary-container: '#db3237'
  on-secondary-container: '#fffbff'
  tertiary: '#704500'
  on-tertiary: '#ffffff'
  tertiary-container: '#905b00'
  on-tertiary-container: '#ffe1c0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#ffdad7'
  secondary-fixed-dim: '#ffb3ae'
  on-secondary-fixed: '#410004'
  on-secondary-fixed-variant: '#930014'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#fef7ff'
  on-background: '#1d1a24'
  surface-variant: '#e8dfee'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
This design system is built for high-energy, real-time discovery. It targets a youthful, mobile-first demographic in Tier-2 and Tier-3 Indian cities. The brand personality is optimistic, local, and hyper-active.

The aesthetic leans into **Modern Minimalism** mixed with **Vibrant Color Blocking**. It prioritizes extreme clarity and high whitespace to ensure the interface remains readable even on mid-range mobile displays. By eschewing photography in favor of expressive emojis and geometric shapes, the design system maintains a lightweight, performance-oriented feel that celebrates cultural vibrancy through a digital-native lens.

## Colors
The palette is rooted in an "India-Modern" vibe—utilizing high-saturation tones that represent the energy of local festivals and markets.

- **Primary (Electric Violet):** Used for main actions, active states, and branding.
- **Secondary (Hot Coral):** Used for urgent discoveries, live indicators, and "Happening Now" highlights.
- **Accents:** Amber Gold, Cyan, and Emerald are used to categorize event types (e.g., Food, Tech, Music) to create a visual "map" that is easy to scan.
- **Surface Strategy:** Backgrounds must remain `#FAFAFA` to allow the `#FFFFFF` cards to "pop" with the help of soft shadows.

## Typography
Plus Jakarta Sans is the sole typeface, chosen for its friendly, open counters and modern geometric construction. 

- **Headlines:** Use Bold (700) or ExtraBold (800) for all headings. Tighten letter spacing slightly on larger titles to maintain a punchy, editorial feel.
- **Body:** Use Medium (500) weight as the default for body text. Avoid Regular (400) weights to ensure high legibility on varying screen qualities.
- **Hierarchy:** Use "Headline-LG-Mobile" for primary page titles on devices under 600px width.

## Layout & Spacing
The system uses a **Fluid Grid** model with generous safe areas to maintain an "airy" feel.

- **Grid:** On mobile, use a 2-column or 4-column layout with 20px side margins. On desktop, transition to a 12-column grid centered at a max-width of 1200px.
- **Rhythm:** Spacing is strictly based on a 4px baseline. Most components should use `md` (16px) or `lg` (24px) for internal padding to emphasize the "High Whitespace" goal.
- **Reflow:** Cards should stack vertically on mobile and transition to a multi-column masonry-style layout on larger screens.

## Elevation & Depth
Elevation is handled via **Tonal Layering** and **Soft Ambient Shadows**. 

- **Shadow Profile:** Use a single, very soft shadow for floating elements: `0px 10px 30px rgba(17, 24, 39, 0.05)`. 
- **Levels:**
    - **Level 0 (Base):** `#FAFAFA` (Background)
    - **Level 1 (Cards):** `#FFFFFF` with soft shadow and 1px border `#F3F4F6`.
    - **Level 2 (Modals/Popups):** `#FFFFFF` with a more pronounced shadow to imply focus.
- **Interactive Depth:** Buttons should not use heavy shadows. Instead, use a slight scale-down effect (0.98) on click to simulate physical pressing.

## Shapes
The shape language is defined by **Generous Rounding**. 

- **Base Radius:** 16px (`rounded-lg`) is the standard for cards and large containers.
- **Button Radius:** Use 12px for standard buttons, or full "Pill" (999px) for chips and category tags.
- **Icon Enclosures:** Small icons should be placed inside circular or 12px rounded-square containers with light-tinted backgrounds (e.g., 10% opacity of the icon color).
- **Geometric Accents:** Decorative elements should include floating circles, soft triangles, and "squiggles" to add a playful, energetic layer to the UI.

## Components
- **Buttons:** Primary buttons use `Electric Violet` with white text. Secondary buttons use a `Violet` tint (10% opacity) with `Violet` text. All buttons have a minimum height of 48px for touch-friendliness.
- **Event Cards:** Must feature a large Emoji (e.g., 🎤) as the primary visual anchor in place of a photo. Cards use a 16px corner radius and include a "Tag" in the top right using `Accent` colors.
- **Chips:** Used for filtering (e.g., "Today", "Music"). These are pill-shaped, using a white background with a 1px border, turning into solid `Primary` color when selected.
- **Input Fields:** Use `#FFFFFF` with a 1px `#E5E7EB` border. Focus state triggers an `Electric Violet` border and a soft violet outer glow.
- **Status Indicators:** "Live" events use `Secondary (Hot Coral)` with a pulsing dot animation.
- **Icons:** Use Lucide icons with a 2px stroke width. Never use filled icons unless they represent a selected/active state.