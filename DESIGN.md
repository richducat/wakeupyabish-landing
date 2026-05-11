---
version: alpha
name: Wake Up Ya Bish
description: Retro cockpit design system for an alarm app that is loud, funny, and impossible to mistake for a calm wellness product.
colors:
  background: "#190C2D"
  surface: "#140727"
  surface-container: "#26193A"
  surface-container-high: "#302445"
  primary: "#00F3FF"
  on-primary: "#061114"
  primary-container: "#E3FDFF"
  on-primary-container: "#00373A"
  secondary: "#FE00FE"
  on-secondary: "#12061F"
  tertiary: "#D4FF5C"
  on-tertiary: "#111111"
  text-primary: "#ECDCFF"
  text-muted: "#B9CACB"
  outline: "#3A494B"
  warning: "#FFD866"
  danger: "#FFB4AB"
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 4.5rem
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: 0
  h1:
    fontFamily: Space Grotesk
    fontSize: 3rem
    fontWeight: 900
    lineHeight: 1
    letterSpacing: 0
  h2:
    fontFamily: Space Grotesk
    fontSize: 2rem
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: 0
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  body-strong:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: 0
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
    fontWeight: 900
    lineHeight: 1
    letterSpacing: 0.16em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  device: 28px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 72px
components:
  page-shell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-primary}"
  header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-container}"
    rounded: "{rounded.none}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 14px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.none}"
    padding: 14px
  stat-panel:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: 24px
  device-frame:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.primary-container}"
    rounded: "{rounded.device}"
    padding: 24px
  warning-badge:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 8px
  inverted-chip:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 8px
  muted-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text-muted}"
    typography: "{typography.body}"
  tertiary-metric:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.tertiary}"
    typography: "{typography.h2}"
  divider-line:
    backgroundColor: "{colors.outline}"
    textColor: "{colors.text-primary}"
    height: 1px
  danger-copy:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    typography: "{typography.body-strong}"
---

## Overview

Wake Up Ya Bish should feel like a retro alarm cockpit that has been given permission to roast weak morning behavior. The visual system is high contrast, loud, squared-off, and utilitarian enough to make the product feel like a real alarm tool rather than a soft lifestyle page.

The best screens combine three signals: dark control-room surfaces, neon cyan or magenta command states, and deadpan product confidence. Visual polish should support the app's promise: wake up with stronger consequences.

## Colors

The core palette is a dark violet cockpit with neon command accents.

- **Background (#190C2D):** persistent app/page foundation.
- **Surface (#140727):** sticky headers, footer bands, and chrome.
- **Surface containers (#26193A, #302445):** control boards, stat panels, and device interiors.
- **Primary (#00F3FF):** main command color for active navigation, primary buttons, and alarm-status accents.
- **Secondary (#FE00FE):** disruptive emphasis for anti-snooze humor and contrast moments.
- **Tertiary (#D4FF5C):** sparing success or charged metric color, not a general background.
- **Text primary (#ECDCFF):** readable copy on dark surfaces.
- **Text muted (#B9CACB):** metadata and supporting copy.

Use cyan for real actions, magenta for attitude, and lime only when a small readout needs a sharp system-status pop. Avoid turning the whole page into a single purple gradient; the palette needs contrast between dark surfaces, electric accents, and readable text.

## Typography

Headlines use **Space Grotesk** with heavy weights, uppercase treatment, and compact line height. Body copy uses **Inter** for straightforward readability. Labels are small, all-caps, and mechanical, like instrument-panel text.

Do not use negative letter spacing. Hero text can be huge, but compact panels, cards, and dashboards should use smaller headings that fit inside their controls without wrapping awkwardly.

## Layout

Build pages as full-width bands with constrained inner content. Favor cockpit layouts: command bars, instrument rows, split information panels, and device previews. Marketing sections should still feel like product UI, not generic SaaS cards.

Use 8px spacing increments. Keep primary actions close to the claim they support. On mobile, stack content vertically, keep controls at least 44px tall, and preserve enough space around the app preview for the interface to be inspected.

## Elevation & Depth

Depth should feel electronic, not soft. Prefer sharp shadows, neon glows, thin borders, scanline overlays, and surface contrast. Avoid blurry decorative blobs, generic orbs, and atmospheric backgrounds that do not show product state or brand behavior.

## Shapes

The main interface language is squared-off. Buttons and content panels should use 0px to 8px radius. The main exception is device hardware, where larger radii can communicate the phone shell without infecting every control.

## Components

Primary buttons are cyan with dark text and hard edges. Secondary buttons can use magenta when the action is playful or disruptive. Stat panels and feature tiles should read like dashboard modules: clear label, sharp metric, short explanation.

Device previews should show real app states such as alarms, countdown timers, sounds, calendar-aware wakeups, or habit checkpoints. When adding new components, start from existing Tailwind tokens before introducing new arbitrary hex values.

## Do's and Don'ts

Do:

- Use cyan for action and system readiness.
- Use magenta for brand attitude and selective emphasis.
- Keep content dense, scannable, and product-led.
- Show real app features whenever the design needs imagery.
- Keep repeated cards and panels at 8px radius or less.

Don't:

- Make the page feel like a calm wellness app.
- Add one-off colors that are not in this file or Tailwind config.
- Use oversized rounded pills for ordinary controls.
- Hide the product behind abstract gradients.
- Let joke copy overpower the core utility: waking people up.
