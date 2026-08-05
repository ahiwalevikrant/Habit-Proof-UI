---
name: High-Performance Athletic System
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e5beb2'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#ac897e'
  outline-variant: '#5c4037'
  surface-tint: '#ffb59d'
  primary: '#ffb59d'
  on-primary: '#5d1900'
  primary-container: '#ff570e'
  on-primary-container: '#511500'
  inverse-primary: '#ab3500'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832700'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-stat:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
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
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
This design system is engineered for elite habit tracking, evoking the high-stakes environment of competitive athletics and premium fitness hardware. The brand personality is disciplined, intense, and technologically advanced. It targets "high-performers" who view habit formation as a rigorous training regimen rather than a casual pursuit.

The visual style is **Modern Athletic with Glassmorphic accents**. It utilizes a deep-dark canvas to reduce visual noise, allowing high-vibrancy "action" colors to guide the user's focus toward streaks and data milestones. The aesthetic balance combines the precision of a dashboard with the visceral energy of a sportscar cockpit, using glowing elements and subtle depth to signify active progress.

## Colors
The palette is built on a "True Dark" foundation to ensure maximum contrast for the primary brand color. 

- **Primary (Action):** Strava Orange (#FC5200) is reserved for active states, completion buttons, and streak counters. It should be used sparingly but impactfully.
- **Surface & Depth:** The background uses Deep Slate Black. Cards and containers use Dark Charcoal to create a clear visual hierarchy against the base.
- **Functional Colors:** Success Green (#10B981) and Warning Amber (#F59E0B) follow industry standards for health and achievement metrics.
- **Borders:** Subtle grey-blue borders (#2A2A30) provide structural definition without breaking the dark immersion.

## Typography
Typography is split into two roles: **Data Presentation** and **Functional Reading**.

- **Outfit** is used for all headings, statistics, and labels. Its geometric nature provides a modern, engineered look. For "Display Stats," use the Bold weight with tight letter-spacing to mimic athletic jersey numbering or high-end chronometers.
- **Inter** is used for body copy and descriptions to ensure maximum legibility at smaller sizes. 

All labels use uppercase styling with increased letter-spacing to provide an "instrument panel" feel.

## Layout & Spacing
The layout uses a **Fluid-Fixed Hybrid** model. While the overall container stretches, content is organized into cards that follow a strict 4px grid system.

- **Grid:** A 12-column grid for desktop/tablet and a 4-column grid for mobile.
- **Margins:** Standard 20px horizontal padding on mobile devices to ensure content doesn't hit the bezel.
- **Rhythm:** Use "MD" (16px) for the majority of internal card padding and "LG" (24px) for vertical section separation.
- **Stacking:** Elements are stacked vertically in a single stream on mobile, with horizontal "carousel" swiping used only for secondary metric charts.

## Elevation & Depth
Depth in this system is achieved through **Glassmorphism and Glow**, rather than traditional shadows.

1.  **Base Layer:** Deep Slate Black background.
2.  **Surface Layer (Cards):** Dark Charcoal with a 1px border (#2A2A30).
3.  **Active Layer (Glass):** Elements like the navigation bar or "Selfie Required" badges use a backdrop blur (20px) and 60% opacity fill to feel suspended over the content.
4.  **Action Elevation:** Primary buttons and active streaks emit a **Soft Orange Glow** (Drop shadow: 0 4px 20px rgba(252, 82, 0, 0.4)). This "neon" effect signifies energy and high priority.

## Shapes
Shapes are intentionally modern and structured. 
- **Standard Cards:** Use a 0.5rem (8px) radius to maintain a professional, sharp aesthetic.
- **Badges/Chips:** Use a full pill-shape (round-xl) to contrast against the rectangular structure of the habit cards.
- **Progress Rings:** Use thick, rounded strokes (8px–12px stroke width) for circular data visualizations, ensuring they feel "heavy" and significant.

## Components
- **Habit Cards:** Glassmorphic background with a left-aligned high-contrast "Outfit" title. "Selfie ID Required" badges should be positioned in the top-right corner using the secondary (Green) or primary (Orange) glass style.
- **Buttons:** 
    - *Primary:* Solid Strava Orange with white text.
    - *Secondary:* Dark Charcoal with a #2A2A30 border and orange text.
- **Sticky Tab Bar:** A floating glassmorphic bar anchored at the bottom with a 24px backdrop blur. The active icon should have a small orange dot or glow beneath it.
- **Inputs:** Rich Black (#151518) background with the subtle border. On focus, the border transitions to Strava Orange with a 2px outer glow.
- **Progress Rings:** Use a dual-track system. A dark "track" color (#2A2A30) and the primary "fill" color (#FC5200).
- **Animations:** 
    - *Streak Pulse:* Active streaks should have a subtle 2-second breathing glow.
    - *Neon Scan:* When a "Selfie ID" is being verified, use a thin horizontal orange light bar that slides vertically across the card.