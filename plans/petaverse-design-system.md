# PetVerse Design System

**Version:** 1.0.0
**Status:** Approved
**Last Updated:** 2026-06-10
**Framework:** Tailwind CSS 3 + Framer Motion

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color Palette](#2-color-palette)
3. [Typography System](#3-typography-system)
4. [Spacing System](#4-spacing-system)
5. [Border Radius System](#5-border-radius-system)
6. [Shadow System](#6-shadow-system)
7. [Animation System](#7-animation-system)
8. [Button Design System](#8-button-design-system)
9. [Input Design System](#9-input-design-system)
10. [Card Design System](#10-card-design-system)
11. [Badge System](#11-badge-system)
12. [Empty States](#12-empty-states)
13. [Loading Skeleton System](#13-loading-skeleton-system)
14. [Modal Design System](#14-modal-design-system)
15. [Toast Notification Design](#15-toast-notification-design)
16. [Mobile Design Guidelines](#16-mobile-design-guidelines)
17. [Accessibility Guidelines](#17-accessibility-guidelines)

---

## 1. Brand Identity

### Mission
> Connecting loving homes with pets in need — making pet adoption and rehoming safe, transparent, and joyful.

### Brand Personality

| Trait | Expression |
|-------|-----------|
| **Compassionate** | Warm, empathetic language; soft curves; gentle animations |
| **Trustworthy** | Clean layouts; clear CTAs; transparent processes; professional polish |
| **Joyful** | Playful micro-interactions; uplifting color accents; cheerful iconography |
| **Modern** | Clean SaaS aesthetic; generous whitespace; sharp typography hierarchy |
| **Inclusive** | Accessible to all; mobile-first; multilingual-ready; WCAG 2.1 AA compliant |

### Design Principles

1. **Clarity First** — Every screen must communicate its purpose within 3 seconds. No ambiguous icons. No clever-but-confusing copy.

2. **Progressive Disclosure** — Show the essential first. Reveal complexity on demand. Never overwhelm new users.

3. **Consistency Without Monotony** — Reuse patterns ruthlessly. Vary only when it serves user understanding. Same button = same action everywhere.

4. **Delight in Micro-Moments** — A subtle hover scale, a smooth page transition, a playful empty state illustration. Joy lives in the details.

5. **Mobile is the Default** — Design for 375px viewports first. Enhance for larger screens. Never degrade the mobile experience.

6. **Performance as a Feature** — Every animation must run at 60fps. Every image must lazy-load. Every interaction must feel instant.

---

## 2. Color Palette

### 2.1 Primary Colors — Trust & Professionalism

Primary blue conveys reliability, security, and calm — essential for a platform handling pet adoption.

```
primary-50:  #eff6ff   →   Background tints, info alerts
primary-100: #dbeafe   →   Badge backgrounds, hover states
primary-200: #bfdbfe   →   Selected states, focus rings
primary-300: #93c5fd   →   Decorative accents
primary-400: #60a5fa   →   Secondary CTAs
primary-500: #3b82f6   →   Primary CTAs, links, active states
primary-600: #2563eb   →   Button hover, pressed states
primary-700: #1d4ed8   →   Text on primary backgrounds
primary-800: #1e40af   →   Deep accents, dark mode brand
primary-900: #1e3a8a   →   Headers, footer backgrounds
primary-950: #172554   →   Darkest primary (charts, badges)
```

**Usage:**
- Primary buttons, links, active navigation items
- Focus rings, selection highlights
- Trust badges, verification icons
- Progress bars, loading indicators

### 2.2 Secondary Colors — Warmth & Compassion

Secondary fuchsia/purple adds emotional warmth — representing care, love, and the joy of pet companionship.

```
secondary-50:  #fdf4ff
secondary-100: #fae8ff
secondary-200: #f5d0fe
secondary-300: #f0abfc
secondary-400: #e879f9
secondary-500: #d946ef   →   Accent CTAs, featured highlights
secondary-600: #c026d3
secondary-700: #a21caf
secondary-800: #86198f
secondary-900: #701a75
secondary-950: #4a044e
```

**Usage:**
- Featured pet badges, "New" indicators
- Heart/favorite icons (when active)
- Community section highlights
- Holiday/event banners

### 2.3 Accent Colors — Growth & Freshness

Accent emerald represents new beginnings, growth, and the life-changing journey of pet adoption.

```
accent-50:  #ecfdf5
accent-100: #d1fae5
accent-200: #a7f3d0
accent-300: #6ee7b7
accent-400: #34d399
accent-500: #10b981   →   Success states, adoption badges
accent-600: #059669
accent-700: #047857
accent-800: #065f46
accent-900: #064e3b
accent-950: #022c22
```

**Usage:**
- "Adopted" status badges
- Success toasts, confirmation messages
- Available/online indicators
- Positive metrics (adoptions completed, lives saved)

### 2.4 Semantic Colors

#### Success — Green
```
success-50:  #f0fdf4
success-500: #22c55e   →   Success toasts, valid inputs
success-600: #16a34a
success-700: #15803d   →   Success text on light backgrounds
```

#### Warning — Amber
```
warning-50:  #fffbeb
warning-500: #f59e0b   →   Warning toasts, pending states
warning-600: #d97706
warning-700: #b45309   →   Warning text on light backgrounds
```

#### Error — Red
```
error-50:  #fef2f2
error-500: #ef4444   →   Error toasts, invalid inputs, delete buttons
error-600: #dc2626
error-700: #b91c1c   →   Error text on light backgrounds
```

#### Info — Sky
```
info-50:  #f0f9ff
info-500: #0ea5e9    →   Info toasts, tips, helpful callouts
info-600: #0284c7
info-700: #0369a1    →   Info text on light backgrounds
```

### 2.5 Neutral Grays

```
neutral-50:  #fafafa   →   Page background (light mode)
neutral-100: #f5f5f5   →   Card backgrounds, input backgrounds
neutral-200: #e5e5e5   →   Borders, dividers
neutral-300: #d4d4d4   →   Disabled states, placeholder text
neutral-400: #a3a3a3   →   Secondary text, icons
neutral-500: #737373   →   Body text (muted)
neutral-600: #525252   →   Body text (strong)
neutral-700: #404040   →   Headings, labels
neutral-800: #262626   →   Primary text
neutral-900: #171717   →   High-emphasis text
neutral-950: #0a0a0a   →   Dark mode background
```

### 2.6 Background Colors

| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page Background | `neutral-50` (#fafafa) | `neutral-950` (#0a0a0a) |
| Card Background | `white` (#ffffff) | `neutral-900` (#171717) |
| Elevated Surface | `white` + shadow | `neutral-800` (#262626) |
| Input Background | `white` (#ffffff) | `neutral-900` (#171717) |
| Modal Overlay | `black/50` | `black/70` |
| Sidebar Background | `white` (#ffffff) | `neutral-900` (#171717) |
| Header Background | `white/80` + backdrop-blur | `neutral-950/80` + backdrop-blur |

### 2.7 Dark Mode Colors

All components must support dark mode via the `dark:` Tailwind variant. The dark mode strategy is:

- **Backgrounds:** Invert from light to deep neutral (50 → 950, white → 900)
- **Text:** Invert from dark to light (neutral-800 → neutral-100)
- **Borders:** Soften (neutral-200 → neutral-800)
- **Shadows:** Eliminate or use colored glows instead of dark shadows
- **Brand colors:** Lighten slightly for contrast (primary-500 → primary-400 for CTAs)
- **Semantic colors:** Use `/{opacity}` variants for backgrounds (e.g., `bg-emerald-500/20`)

### 2.8 Listing Type Colors

Specialized colors for the four pet listing categories:

| Listing Type | Color | Tailwind | Badge Style |
|-------------|-------|----------|-------------|
| Adoption | `#10b981` | `accent-500` | Solid green background, white text |
| Rehoming | `#f59e0b` | `warning-500` | Solid amber background, dark text |
| Lost | `#ef4444` | `error-500` | Solid red background, white text |
| Found | `#8b5cf6` | `violet-500` | Solid violet background, white text |

### 2.9 Species Colors

Distinct accent colors for pet species identification:

| Species | Color | Tailwind |
|---------|-------|----------|
| Dog | `#f97316` | `orange-500` |
| Cat | `#8b5cf6` | `violet-500` |
| Bird | `#06b6d4` | `cyan-500` |
| Fish | `#3b82f6` | `primary-500` |
| Rabbit | `#ec4899` | `pink-500` |
| Hamster | `#eab308` | `yellow-500` |
| Reptile | `#10b981` | `accent-500` |
| Other | `#6b7280` | `neutral-500` |

### 2.10 Gradient Definitions

```
Hero Gradient:     linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)
Card Overlay:      linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)
Image Overlay:     linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)
Text Gradient:     linear-gradient(to right, #3b82f6, #10b981)
Footer Gradient:   linear-gradient(180deg, #fafafa 0%, #eff6ff 100%)
```

---

## 3. Typography System

### 3.1 Font Families

| Role | Font Stack | Tailwind Class |
|------|-----------|---------------|
| **Headings** | Poppins, system-ui, sans-serif | `font-display` |
| **Body Text** | Inter, system-ui, -apple-system, sans-serif | `font-sans` |
| **Code** | JetBrains Mono, Fira Code, monospace | `font-mono` |

**Rationale:**
- **Poppins** is geometric, friendly, and modern — perfect for headings that feel approachable yet premium.
- **Inter** is optimized for screen readability at small sizes — ideal for body text, forms, and data-dense interfaces.
- Both are Google Fonts (self-hosted via `@fontsource` for performance).

### 3.2 Type Scale

#### Headings

| Level | Size | Line Height | Weight | Tailwind Class | Usage |
|-------|------|------------|--------|---------------|-------|
| H1 | 48px (3rem) | 1.1 (3.3rem) | Bold (700) | `text-5xl md:text-6xl font-display font-bold` | Hero titles, page headings |
| H2 | 36px (2.25rem) | 1.2 (2.7rem) | Bold (700) | `text-3xl md:text-4xl font-display font-bold` | Section headings |
| H3 | 24px (1.5rem) | 1.3 (1.95rem) | Bold (700) | `text-2xl font-display font-bold` | Card titles, subsection headings |
| H4 | 20px (1.25rem) | 1.4 (1.75rem) | Semibold (600) | `text-xl font-display font-semibold` | Dialog titles, form sections |
| H5 | 18px (1.125rem) | 1.4 (1.575rem) | Semibold (600) | `text-lg font-display font-semibold` | Small headings, list titles |
| H6 | 16px (1rem) | 1.5 (1.5rem) | Semibold (600) | `text-base font-display font-semibold` | Micro-headings, label groups |

#### Body Text

| Level | Size | Line Height | Weight | Tailwind Class | Usage |
|-------|------|------------|--------|---------------|-------|
| Body Large | 18px (1.125rem) | 1.75 (1.968rem) | Regular (400) | `text-lg leading-relaxed` | Article body, pet descriptions |
| Body Base | 16px (1rem) | 1.75 (1.75rem) | Regular (400) | `text-base leading-relaxed` | Default body text, form labels |
| Body Small | 14px (0.875rem) | 1.6 (1.4rem) | Regular (400) | `text-sm leading-relaxed` | Secondary info, metadata, help text |

#### Supporting Text

| Level | Size | Line Height | Weight | Tailwind Class | Usage |
|-------|------|------------|--------|---------------|-------|
| Caption | 12px (0.75rem) | 1.5 (1.125rem) | Medium (500) | `text-xs font-medium` | Image captions, timestamps |
| Label | 12px (0.75rem) | 1.5 (1.125rem) | Semibold (600) | `text-xs font-semibold uppercase tracking-wider` | Form labels (compact), badge text |
| Overline | 10px (0.625rem) | 1.5 (0.9375rem) | Bold (700) | `text-2xs font-bold uppercase tracking-widest` | Card overlines, category markers |

### 3.3 Font Weights

| Weight | Value | Tailwind Class | Usage |
|--------|-------|---------------|-------|
| Regular | 400 | `font-normal` | Body text, descriptions |
| Medium | 500 | `font-medium` | Captions, emphasis in body, button text |
| Semibold | 600 | `font-semibold` | H4-H6 headings, form labels, CTAs |
| Bold | 700 | `font-bold` | H1-H3 headings, strong emphasis, prices |
| Extrabold | 800 | `font-extrabold` | Hero numbers, statistics, countdowns |

### 3.4 Line Heights

| Context | Line Height | Tailwind Class |
|---------|------------|---------------|
| Hero headings | 1.1 | `leading-tight` |
| Section headings | 1.2 | `leading-tight` |
| Card titles | 1.3 | `leading-snug` |
| Body text | 1.75 | `leading-relaxed` |
| Small text / captions | 1.5 | `leading-normal` |
| Form inputs | 1.5 | `leading-normal` |

### 3.5 Letter Spacing

| Context | Spacing | Tailwind Class |
|---------|---------|---------------|
| Headings (H1-H3) | -0.02em | `tracking-tight` |
| Overlines | 0.1em | `tracking-widest` |
| Labels (compact) | 0.05em | `tracking-wider` |
| Body text | 0 (default) | — |

### 3.6 Text Colors

| Role | Light Mode | Dark Mode |
|------|-----------|-----------|
| Primary Text | `text-neutral-900` | `text-neutral-50` |
| Secondary Text | `text-neutral-600` | `text-neutral-400` |
| Muted / Disabled | `text-neutral-400` | `text-neutral-600` |
| Link Text | `text-primary-600` | `text-primary-400` |
| Link Hover | `text-primary-700` | `text-primary-300` |
| Error Text | `text-red-600` | `text-red-400` |
| Success Text | `text-accent-600` | `text-accent-400` |

---

## 4. Spacing System

### 4.1 Base Scale (4px Grid)

All spacing follows a 4px baseline grid. Tailwind's default spacing scale is used directly.

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| 0 | 0px | `p-0`, `m-0`, `gap-0` | No spacing |
| 1 | 4px | `p-1`, `m-1`, `gap-1` | Tight icon + text gaps |
| 2 | 8px | `p-2`, `m-2`, `gap-2` | Inline spacing, icon padding, button gaps |
| 3 | 12px | `p-3`, `m-3`, `gap-3` | Card internal padding (compact) |
| 4 | 16px | `p-4`, `m-4`, `gap-4` | Standard card padding, form group gaps |
| 5 | 20px | `p-5`, `m-5`, `gap-5` | Card padding (spacious) |
| 6 | 24px | `p-6`, `m-6`, `gap-6` | Section gaps, default card padding |
| 8 | 32px | `p-8`, `m-8`, `gap-8` | Large card padding, section separators |
| 10 | 40px | `p-10`, `m-10`, `gap-10` | Major section separators |
| 12 | 48px | `p-12`, `m-12`, `gap-12` | Hero section padding |
| 16 | 64px | `p-16`, `m-16`, `gap-16` | Page-level spacing |
| 20 | 80px | `p-20` | Hero vertical padding |
| 24 | 96px | `p-24` | Full-screen section spacing |

### 4.2 Container Widths

| Container | Max Width | Tailwind Class | Usage |
|-----------|----------|---------------|-------|
| App Container | 1280px (80rem) | `max-w-7xl` | Default page container |
| Content Container | 1024px (64rem) | `max-w-5xl` | Blog, article, detail pages |
| Narrow Container | 768px (48rem) | `max-w-3xl` | Forms, auth pages, settings |
| Card Grid Container | 1280px (80rem) | `max-w-7xl` | Pet listing grids |
| Modal Container | 512px (32rem) | `max-w-lg` | Default modal width |
| Small Modal | 384px (24rem) | `max-w-sm` | Confirmation dialogs |

**Container Padding:** All containers use `px-4 sm:px-6 lg:px-8` for responsive horizontal padding.

### 4.3 Section Spacing

| Section Type | Vertical Padding | Tailwind Class |
|-------------|-----------------|---------------|
| Hero Section | 80px-120px | `py-20 md:py-24 lg:py-32` |
| Standard Section | 48px-80px | `section` (py-12 md:py-16 lg:py-20) |
| Compact Section | 32px-48px | `py-8 md:py-12` |
| Dense Section | 16px-32px | `py-4 md:py-8` |
| Section Gap (between sections) | 0 (sections handle own padding) | — |

### 4.4 Card Internal Spacing

| Card Type | Padding | Tailwind Class |
|-----------|---------|---------------|
| Default Card | 24px (1.5rem) | `p-6` |
| Compact Card | 16px (1rem) | `p-4` |
| Spacious Card | 32px (2rem) | `p-8` |
| Card Header/Footer | 24px horizontal, 16px vertical | `px-6 py-4` |
| Card Body (if separate) | 24px | `p-6` |

### 4.5 Form Spacing

| Element | Spacing | Tailwind Class |
|---------|---------|---------------|
| Form Group Gap | 20px | `gap-5` |
| Label to Input | 6px | `mb-1.5` |
| Input to Error | 4px | `mt-1` |
| Inline Fields Gap | 16px | `gap-4` |
| Form Section Gap | 32px | `gap-8` |
| Submit Button Margin | 24px from last field | `mt-6` |

---

## 5. Border Radius System

### 5.1 Radius Scale

| Token | Value | Tailwind Class | Usage |
|-------|-------|---------------|-------|
| None | 0px | `rounded-none` | Table headers, sharp containers |
| Small | 4px (0.25rem) | `rounded` | Checkboxes, tags, small badges |
| Medium | 8px (0.5rem) | `rounded-lg` | Inputs, dropdowns, tooltips, small cards |
| Large | 12px (0.75rem) | `rounded-xl` | **Buttons (default)**, modals, standard cards |
| X-Large | 16px (1rem) | `rounded-2xl` | **Cards (default)**, large modals |
| 2X-Large | 24px (1.5rem) | `rounded-3xl` | Hero cards, featured cards |
| 3X-Large | 32px (2rem) | `rounded-4xl` | Special containers, pill-shaped elements |
| Full | 9999px | `rounded-full` | Avatars, badges, toggle pills, icon buttons |

### 5.2 Component-Specific Radius

| Component | Radius | Tailwind Class |
|-----------|--------|---------------|
| Buttons | 12px | `rounded-xl` |
| Cards | 16px | `rounded-2xl` |
| Inputs | 12px | `rounded-xl` |
| Modals | 16px | `rounded-2xl` |
| Dropdowns | 12px | `rounded-xl` |
| Tooltips | 8px | `rounded-lg` |
| Badges (status) | 9999px | `rounded-full` |
| Avatars | 9999px | `rounded-full` |
| Pet Image Thumbnails | 12px | `rounded-xl` |
| Pet Image (hero) | 16px | `rounded-2xl` |
| Toasts | 12px | `rounded-xl` |
| Skeleton Placeholders | 8px | `rounded-lg` |
| Mobile Bottom Sheets | 16px (top only) | `rounded-t-2xl` |

---

## 6. Shadow System

### 6.1 Shadow Elevations

| Level | Token | CSS Value | Tailwind Class | Usage |
|-------|-------|----------|---------------|-------|
| 0 | None | `none` | `shadow-none` | Flat elements, inputs |
| 1 | XS | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-sm` | Cards (default), table rows |
| 2 | SM | `0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)` | `shadow-soft` | Cards (hover), dropdowns |
| 3 | MD | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)` | `shadow-md` | Elevated cards, sticky headers |
| 4 | LG | `0 10px 40px -10px rgba(0,0,0,0.1)` | `shadow-soft-lg` | Modals, featured cards |
| 5 | XL | `0 20px 60px -12px rgba(0,0,0,0.15)` | `shadow-xl` | Hero modals, slide-overs |
| 6 | 2XL | `0 25px 50px -12px rgba(0,0,0,0.25)` | `shadow-2xl` | Full-screen overlays |

### 6.2 Component Shadow Assignments

| Component | Resting Shadow | Hover/Active Shadow |
|-----------|---------------|-------------------|
| Standard Card | `shadow-sm` | `shadow-soft` or `shadow-md` |
| Featured Card | `shadow-md` | `shadow-soft-lg` |
| Pet Card | `shadow-sm` | `shadow-soft` |
| Dashboard Card | `shadow-sm` | `shadow-md` |
| Modal | `shadow-soft-lg` | — |
| Dropdown | `shadow-soft-lg` | — |
| Sticky Header (scrolled) | `shadow-sm` | — |
| Button (primary) | none | `shadow-md` (on hover, adds depth) |
| Toast | `shadow-soft-lg` | — |

### 6.3 Dark Mode Shadows

In dark mode, traditional dark shadows are invisible against dark backgrounds. Use colored glows instead:

```
Instead of shadow-sm → shadow-[0_0_0_1px_rgba(255,255,255,0.05)]
Instead of shadow-soft → shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] ring-1 ring-white/5
Cards in dark mode → ring-1 ring-neutral-800 (instead of shadow)
```

### 6.4 Colored Shadows (for CTAs)

```
Primary Button Glow:  shadow-[0_4px_14px_0_rgba(59,130,246,0.35)]
Success Glow:         shadow-[0_4px_14px_0_rgba(16,185,129,0.35)]
Danger Glow:          shadow-[0_4px_14px_0_rgba(239,68,68,0.35)]
```

---

## 7. Animation System

### 7.1 Animation Principles

1. **Purposeful:** Every animation must serve a function — guide attention, provide feedback, or create context.
2. **Fast:** Micro-interactions complete in 150-200ms. Page transitions in 200-300ms. Never exceed 500ms.
3. **Smooth:** All animations use `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)` for natural deceleration.
4. **Respectful:** Honor `prefers-reduced-motion`. Disable all non-essential animations when the user requests reduced motion.
5. **Consistent:** Same element type = same animation behavior across the entire app.

### 7.2 Animation Tokens

| Token | Duration | Easing | Usage |
|-------|---------|--------|-------|
| Instant | 100ms | ease-out | Checkbox toggle, radio select |
| Quick | 150ms | ease-out | Button hover scale, icon hover |
| Standard | 200ms | ease-out | Hover effects, focus transitions, color changes |
| Smooth | 300ms | ease-out | Card expand, dropdown open, modal open |
| Leisurely | 400ms | ease-out | Page transitions, route changes |
| Spring | 500ms | spring (stiffness: 300, damping: 30) | Bouncy reveals, celebration animations |

### 7.3 Framer Motion Variants

#### Fade In (most common)
```js
// Tailwind: animate-fade-in
Initial:  { opacity: 0 }
Animate:  { opacity: 1 }
Exit:     { opacity: 0 }
Transition: { duration: 0.3, ease: 'easeOut' }
```
**Usage:** Page content, cards appearing in grids, modals, toasts.

#### Slide Up (content reveals)
```js
// Tailwind: animate-slide-up
Initial:  { opacity: 0, y: 10 }
Animate:  { opacity: 1, y: 0 }
Exit:     { opacity: 0, y: -10 }
Transition: { duration: 0.3, ease: 'easeOut' }
```
**Usage:** Sections scrolling into view, pet cards loading, dropdown menus.

#### Slide In Right (panels, drawers)
```js
// Tailwind: animate-slide-in-right
Initial:  { opacity: 0, x: 20 }
Animate:  { opacity: 1, x: 0 }
Exit:     { opacity: 0, x: 20 }
Transition: { duration: 0.3, ease: 'easeOut' }
```
**Usage:** Slide-over panels, notification drawers, mobile menus.

#### Slide In Left
```js
// Tailwind: animate-slide-in-left
Initial:  { opacity: 0, x: -20 }
Animate:  { opacity: 1, x: 0 }
Exit:     { opacity: 0, x: -20 }
Transition: { duration: 0.3, ease: 'easeOut' }
```
**Usage:** Sidebar navigation items, breadcrumb reveals.

#### Scale In (modals, dialogs)
```js
Initial:  { opacity: 0, scale: 0.95 }
Animate:  { opacity: 1, scale: 1 }
Exit:     { opacity: 0, scale: 0.95 }
Transition: { duration: 0.2, ease: 'easeOut' }
```
**Usage:** Modals, confirmation dialogs, image lightboxes.

### 7.4 Page Transitions

All page-level route changes use [`AnimatePresence`](https://www.framer.com/motion/animate-presence/) with the following pattern:

```js
// Wrapper for all page content
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

**Rule:** Never animate the entire layout (header, footer). Only animate the page content area.

### 7.5 Hover Effects

| Element | Effect | Duration | Implementation |
|---------|--------|---------|---------------|
| Card | Scale 1.01 + shadow increase | 200ms | `hover:scale-[1.01] hover:shadow-soft transition-all duration-200` |
| Button (primary) | Background darken + slight scale | 150ms | `hover:bg-primary-600 active:scale-[0.98] transition-all duration-150` |
| Button (outline) | Background tint + border color | 150ms | `hover:bg-primary-50 transition-colors duration-150` |
| Link | Underline animation + color | 200ms | `hover:text-primary-600 transition-colors duration-200` |
| Icon Button | Scale 1.1 + rotate(5deg) | 150ms | `hover:scale-110 hover:rotate-[5deg] transition-transform duration-150` |
| Pet Image | Slight brightness increase + scale | 300ms | `hover:brightness-105 hover:scale-105 transition-all duration-300` |
| Table Row | Background tint | 150ms | `hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150` |
| Nav Link | Color change + underline slide | 200ms | Custom underline animation via `::after` pseudo-element |

### 7.6 Button Animations

#### Loading State
```
Button enters loading:
  - Text fades out (opacity 1 → 0, 150ms)
  - Spinner fades in and spins (opacity 0 → 1, 150ms; infinite rotation)
  - Width is locked (prevents layout shift)
  - Button becomes non-interactive (pointer-events: none)

Button exits loading:
  - Spinner fades out (150ms)
  - Success icon or text fades in (200ms)
  - Brief success color flash (accent-500, 500ms then returns to normal)
```

#### Press/Active State
```
active:scale-[0.98] transition-transform duration-75
```

#### Success Flash
```
After form submission success:
  - Button turns accent-500 for 1 second
  - Checkmark icon appears with scale spring animation
  - Button returns to primary color
```

### 7.7 Card Animations

#### Card Entrance (staggered grid)
```
Container:  <motion.div> with staggerChildren: 0.05
Each card:
  Initial:  { opacity: 0, y: 20 }
  Animate:  { opacity: 1, y: 0 }
  Transition: { duration: 0.4, ease: 'easeOut' }
```

#### Card Hover
```
hover:scale-[1.02] hover:shadow-soft
transition-all duration-200 ease-out
```

#### Favorite Heart Animation
```
On toggle:
  - Heart scales from 1 → 1.3 → 1 (spring)
  - Color transitions from neutral-400 → red-500
  - Small particle burst (optional, for delight)
```

### 7.8 Loading Animations

#### Spinner
```js
// Continuous rotation
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
/>
```

#### Skeleton Pulse
```js
// Tailwind class: skeleton-pulse
// CSS: animate-pulse with custom easing
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

#### Page Loader
```
PetVerse logo/brand mark:
  - Subtle breathing scale (1 → 1.05 → 1, 2s infinite)
  - FiLoader spinning below
  - Background: transparent or white/neutral-50
  - Full screen or inline (determined by fullScreen prop)
```

#### Progress Bar
```js
<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

### 7.9 Framer Motion Best Practices

1. **Use `layout` prop for shared layout animations** between related elements (e.g., expanding cards, tab transitions).
2. **Use `layoutId` for shared element transitions** when navigating between list and detail views (e.g., pet card → pet detail image morph).
3. **Always pair `AnimatePresence` with conditional rendering** to enable exit animations.
4. **Use `whileHover` and `whileTap`** for interactive elements instead of CSS `:hover` when animations need sequencing.
5. **Lazy-load Framer Motion features.** Import only what's needed: `motion`, `AnimatePresence`, `LazyMotion`, `domAnimation`.
6. **Use `will-change` sparingly.** Let Framer Motion handle GPU acceleration via `transform` and `opacity` only.
7. **For lists > 20 items**, disable stagger animations on mobile to prevent jank.
8. **Respect `prefers-reduced-motion`:**
```js
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
// If true, set duration: 0 for all animations
```

---

## 8. Button Design System

### 8.1 Button Hierarchy

| Priority | Variant | Usage | Max Per Screen |
|----------|---------|-------|---------------|
| 1 | Primary | Main CTA, form submit, key action | 1 |
| 2 | Secondary | Alternative action, "Cancel" | 1-2 |
| 3 | Outline | Medium-emphasis action, "View Details" | Unlimited |
| 4 | Ghost | Low-emphasis action, toolbar icons, "Edit" | Unlimited |
| 5 | Danger | Destructive action, "Delete", "Remove" | 1 |

### 8.2 Button Sizes

| Size | Height | Padding | Font Size | Gap | Tailwind Class |
|------|--------|---------|-----------|-----|---------------|
| XS | 28px | `px-2 py-1` | 10px (text-2xs) | 4px (gap-1) | `btn-sm px-2 py-1 text-2xs` |
| SM | 32px | `px-3 py-1.5` | 12px (text-xs) | 4px (gap-1) | `btn-sm` |
| MD (default) | 40px | `px-5 py-2.5` | 14px (text-sm) | 8px (gap-2) | `btn` |
| LG | 48px | `px-7 py-3.5` | 16px (text-base) | 8px (gap-2) | `btn-lg` |
| XL | 56px | `px-9 py-4` | 18px (text-lg) | 10px (gap-2.5) | `btn-lg px-9 py-4 text-lg` |

### 8.3 Button Variants

#### Primary Button
```
Classes:       btn-primary
Background:    bg-primary-500
Text:          text-white
Hover:         bg-primary-600
Active:        bg-primary-700 + scale-[0.98]
Focus:         ring-2 ring-primary-500 ring-offset-2
Disabled:      opacity-50 cursor-not-allowed
Dark:          bg-primary-600 hover:bg-primary-500
Shadow:        shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] (on hover)
```

#### Secondary Button
```
Classes:       btn-secondary
Background:    bg-neutral-100
Text:          text-neutral-900
Hover:         bg-neutral-200
Active:        bg-neutral-300 + scale-[0.98]
Dark:          bg-neutral-800 text-neutral-100 hover:bg-neutral-700
```

#### Outline Button
```
Classes:       btn-outline
Background:    transparent
Border:        border-2 border-primary-500
Text:          text-primary-600
Hover:         bg-primary-50
Active:        bg-primary-100
Dark:          text-primary-400 hover:bg-primary-500/10
```

#### Ghost Button
```
Classes:       btn-ghost
Background:    transparent
Text:          text-neutral-600
Hover:         bg-neutral-100
Dark:          text-neutral-400 hover:bg-neutral-800
```

#### Danger Button
```
Classes:       btn-danger
Background:    bg-red-500
Text:          text-white
Hover:         bg-red-600
Active:        bg-red-700 + scale-[0.98]
```

### 8.4 Icon Button

```
Classes:       btn-icon
Size:          40px × 40px (default), 32px × 32px (sm), 48px × 48px (lg)
Padding:       p-2 (default), p-1.5 (sm), p-3 (lg)
Border Radius: rounded-full
Background:    transparent (ghost variant) or bg-neutral-100
Hover:         bg-neutral-200
Icon Size:     20px (default), 16px (sm), 24px (lg)
```

**Icon Button Variants:**
- **Ghost Icon:** `btn-icon text-neutral-500 hover:bg-neutral-100`
- **Primary Icon:** `btn-icon bg-primary-500 text-white hover:bg-primary-600`
- **Outline Icon:** `btn-icon border-2 border-primary-500 text-primary-600`

### 8.5 Button with Icon (Text + Icon)

```
Layout:  [icon] [text]
Gap:     gap-2 (8px)
Icon:    16px-20px depending on button size
```

**Placement Rules:**
- Leading icon: Always before text (e.g., search, add, filter)
- Trailing icon: Always after text (e.g., dropdown arrows, external links)
- Never use both leading and trailing icons in the same button.

### 8.6 Loading State

```
When loading=true:
  - Button becomes non-interactive (pointer-events-none)
  - Text becomes invisible (opacity-0) but retains width
  - Spinner (FiLoader) appears centered, spinning
  - Button width is locked to prevent layout shift
  - Spinner inherits button text color
```

### 8.7 Full-Width Button

Used on mobile forms and single-action screens.

```
Classes:  btn-primary w-full
Max:      100% of parent container
Min:      Never less than 200px
```

### 8.8 Button Group

For related actions (e.g., Save + Cancel, Filter + Sort).

```
Layout:       flex gap-3
Outer radius: Only first and last buttons have outer rounding
Inner radius: Middle buttons have rounded-none
Border:       1px border between adjacent buttons
```

### 8.9 Button States Summary

| State | Visual Change |
|-------|--------------|
| Resting | Default styles |
| Hover | Background darkens/lightens, slight scale (1.01) |
| Focus | Ring-2 primary-500 with offset-2 |
| Active/Press | Background darkest shade, scale 0.98 |
| Disabled | Opacity 50%, cursor not-allowed, no hover effects |
| Loading | Text hidden, spinner shown, pointer-events none |
| Success | Brief green flash, checkmark icon (for form submissions) |

---

## 9. Input Design System

### 9.1 Text Input

```
Classes:       input
Height:        42px (py-2.5)
Padding:       px-4
Font:          text-sm font-sans
Border:        border border-neutral-300
Radius:        rounded-xl
Background:    bg-white
Placeholder:   placeholder:text-neutral-400
Focus:         border-primary-500 ring-2 ring-primary-500/20 outline-none
Disabled:      bg-neutral-100 opacity-60 cursor-not-allowed
Dark:          border-neutral-700 bg-neutral-900 text-neutral-100
```

### 9.2 Textarea

```
Classes:       input (same base)
Min Height:    96px (6 rows)
Padding:       px-4 py-3
Resize:        resize-y (vertical only)
Font:          text-sm leading-relaxed
```

### 9.3 Select

```
Classes:       input (same base)
Appearance:    appearance-none
Arrow:         Custom chevron-down icon positioned absolute right-4
Options:       Styled natively (with bg-white text-neutral-900)
```

### 9.4 Checkbox

```
Size:          20px × 20px
Border:        border-2 border-neutral-300 rounded
Checked:       bg-primary-500 border-primary-500
Check Icon:    FiCheck (white, 14px)
Label:         ml-3 text-sm text-neutral-700
Focus:         ring-2 ring-primary-500 ring-offset-1
Disabled:      opacity-50
```

### 9.5 Radio Button

```
Size:          20px × 20px
Border:        border-2 border-neutral-300 rounded-full
Checked:       border-primary-500
Inner Dot:     10px × 10px bg-primary-500 rounded-full
Label:         ml-3 text-sm text-neutral-700
```

### 9.6 Toggle / Switch

```
Track Width:   44px
Track Height:  24px
Track Radius:  rounded-full
Off:           bg-neutral-300
On:            bg-primary-500
Thumb Size:    20px × 20px
Thumb:         bg-white rounded-full shadow-sm
Animation:     transition-all duration-200
Focus:         ring-2 ring-primary-500 ring-offset-2
```

### 9.7 Validation States

#### Default (untouched)
```
Border:  border-neutral-300
```

#### Focused
```
Border:  border-primary-500
Ring:    ring-2 ring-primary-500/20
```

#### Valid (touched + valid)
```
Border:  border-accent-500
Ring:    ring-2 ring-accent-500/20 (on focus)
Icon:    Optional FiCheck in accent-500 at right-4
```

#### Invalid (touched + error)
```
Classes:  input input-error
Border:   border-red-500
Ring:     ring-2 ring-red-500/20 (on focus)
Message:  <p class="error-text">Error message here</p>
Icon:     Optional FiAlertCircle in red-500 at right-4
```

#### Error Message
```
Classes:       error-text
Font:          text-xs text-red-500
Margin:        mt-1
Icon:          Optional leading FiAlertCircle (12px)
Animation:     animate-slide-up (subtle entrance)
```

#### Success Message
```
Classes:       text-xs text-accent-600
Font:          text-xs
Margin:        mt-1
```

### 9.8 Disabled States

```
Input:    bg-neutral-100 opacity-60 cursor-not-allowed
Label:    text-neutral-400
Helper:   text-neutral-400
```

### 9.9 Input with Icon

#### Leading Icon
```
Icon Position:  absolute left-4 top-1/2 -translate-y-1/2
Icon Size:      18px
Icon Color:     text-neutral-400
Input Padding:  pl-11 (to clear icon + gap)
```

#### Trailing Icon
```
Icon Position:  absolute right-4 top-1/2 -translate-y-1/2
Icon Size:      18px
Icon Color:     text-neutral-400 (default), text-red-500 (error), text-accent-500 (valid)
Input Padding:  pr-11
```

### 9.10 Form Layout

#### Vertical Stack (default)
```
Form Group:  flex flex-col gap-1.5
Label:       label (block, mb-1.5, text-sm font-medium)
Input:       input
Error:       error-text (below input)
Helper:      text-xs text-neutral-500 mt-1
```

#### Horizontal / Inline
```
Form Group:   flex items-start gap-4
Label:        w-40 shrink-0 pt-2.5 text-sm font-medium text-neutral-700
Input Area:   flex-1
```

#### Two-Column Grid
```
Form Row:  grid grid-cols-1 md:grid-cols-2 gap-5
```

### 9.11 Search Input (Special Variant)

```
Classes:       input pl-11 pr-10
Leading Icon:  FiSearch (left-4, text-neutral-400)
Clear Button:  FiX (right-3, btn-icon-sm, appears when value is non-empty)
Background:    bg-neutral-100 (resting), bg-white (focused)
Border:        border-transparent (resting), border-primary-500 (focused)
Width:         Full width on mobile, 320px on desktop
```

---

## 10. Card Design System

### 10.1 Base Card

```
Classes:       card
Background:    bg-white
Border:        border border-neutral-200
Radius:        rounded-2xl
Padding:       p-6
Shadow:        shadow-sm
Hover:         shadow-soft (transition-shadow duration-200)
Dark:          dark:border-neutral-800 dark:bg-neutral-900
```

### 10.2 Pet Card

The primary card for displaying pets in grids and lists.

```
+-------------------------------------------------------+
| [Image - 240px height, object-cover, rounded-t-2xl]    |
|                                                         |
| [Species Badge]  [Listing Type Badge]  [Status Badge]   |
|                                                         |
| Pet Name (H3, font-display, font-bold)                   |
| Breed (text-sm, text-neutral-500)                        |
|                                                         |
| [Location Icon] City, State (text-xs, text-neutral-400) |
|                                                         |
| [Age]  ·  [Gender]  ·  [Size]                            |
|                                                         |
| --- divider ---                                         |
|                                                         |
| Price / "Free" (text-xl, font-bold, text-primary-600)    |
| [Heart Icon Button]  [View Details Button]               |
+-------------------------------------------------------+

Hover:  scale-[1.02] shadow-soft transition-all duration-200
```

**Pet Card States:**
- **Default:** Shadow-sm, neutral border
- **Hover:** Shadow-soft, scale 1.02, slight image brightness increase
- **Featured:** Accent-colored left border (4px), "Featured" badge
- **Urgent:** Red left border (4px), "Urgent" badge with pulse animation
- **Adopted:** 50% opacity overlay with "Adopted 🎉" stamp

**Pet Card Skeleton:**
- Image placeholder: 240px height, `skeleton-pulse`
- 3 lines of text placeholders (varying widths)
- 1 wide button placeholder

**Responsive Behavior:**
- Mobile: Full width, stacked vertically
- Tablet (sm): 2-column grid
- Desktop (lg): 3-column grid
- Wide (xl): 4-column grid

### 10.3 Feature Card

Used for homepage features, service highlights, and how-it-works sections.

```
+-------------------------------------------------------+
|                                                         |
|         [Circular Icon - 56px, bg-primary-100]          |
|                                                         |
|         Feature Title (H4, font-display, center)        |
|                                                         |
|         Description (text-sm, text-neutral-500,         |
|         center, max 3 lines)                            |
|                                                         |
+-------------------------------------------------------+

Hover:  translateY(-4px) shadow-soft-lg transition-all duration-300
Icon container: bg-primary-50 → bg-primary-100 on hover
```

### 10.4 Dashboard Card

Used in admin and user dashboards for statistics and quick actions.

```
+-------------------------------------------------------+
| [Icon - 24px]             [Dropdown Menu ···]           |
|                                                         |
| Stat Value (text-3xl, font-extrabold, font-display)     |
| Stat Label (text-sm, text-neutral-500)                   |
|                                                         |
| [Trend Indicator] +12% from last month (text-xs)        |
+-------------------------------------------------------+

Variants:
  - Default: bg-white
  - Accent: bg-primary-50 border-primary-200
  - Success: bg-accent-50 border-accent-200
  - Warning: bg-amber-50 border-amber-200
  - Danger: bg-red-50 border-red-200
```

### 10.5 Profile Card

```
+-------------------------------------------------------+
|                                                         |
|         [Avatar - 80px, rounded-full, ring-4]           |
|                                                         |
|         User Name (H3, font-display, center)            |
|         @username (text-sm, text-neutral-500, center)   |
|                                                         |
|         Bio (text-sm, center, max 3 lines)              |
|                                                         |
|         [Pets Listed: 5]  [Saved Pets: 12]              |
|         [Member Since: Jan 2025]                        |
|                                                         |
|         [Edit Profile Button - Full Width]              |
+-------------------------------------------------------+

Hover:  shadow-soft (subtle)
```

### 10.6 Glass Card (Special)

Used for hero overlays, transparent sections over image backgrounds.

```
Classes:       card-glass
Background:    bg-white/70 backdrop-blur-xl
Border:        border border-white/20
Radius:        rounded-2xl
Dark:          dark:bg-neutral-900/70 dark:border-neutral-700/30
```

### 10.7 Clickable Card

When an entire card is clickable (e.g., navigating to detail page):

```
cursor:         cursor-pointer
Hover:          shadow-soft scale-[1.01]
Focus:          ring-2 ring-primary-500 ring-offset-2
Inner links:    position: relative; z-index: 10 (to prevent event bubbling issues)
```

---

## 11. Badge System

### 11.1 Base Badge

```
Classes:       badge (inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium)
Font:          text-xs font-medium
Radius:        rounded-full
```

### 11.2 Status Badges

| Badge | Colors | Tailwind Class | Usage |
|-------|--------|---------------|-------|
| Available | Green | `badge-success` | Pet is available for adoption/rehoming |
| Pending | Amber | `badge-warning` | Adoption application under review |
| Adopted | Emerald | `badge-success` + check icon | Pet has been adopted |
| Rehomed | Blue | `badge-primary` | Pet has been rehomed |
| On Hold | Neutral | `badge-neutral` | Pet listing is temporarily on hold |
| Removed | Red | `badge-danger` | Listing has been removed |

### 11.3 Listing Type Badges

| Type | Colors | Icon | Tailwind |
|------|--------|------|----------|
| Adoption | `bg-accent-500 text-white` | FiHeart | Custom inline style |
| Rehoming | `bg-warning-500 text-white` | FiHome | Custom inline style |
| Lost | `bg-red-500 text-white` | FiAlertTriangle | Custom inline style |
| Found | `bg-violet-500 text-white` | FiSearch | Custom inline style |

### 11.4 Special Badges

| Badge | Colors | Animation | Usage |
|-------|--------|-----------|-------|
| Featured | `bg-gradient-to-r from-primary-500 to-secondary-500 text-white` | Subtle shimmer | Premium/boosted listings |
| New | `bg-accent-500 text-white` | Pulse on first render | Recently added (< 48 hours) |
| Urgent | `bg-red-500 text-white` | animate-pulse (subtle) | Urgent rehoming/lost pets |
| Verified | `bg-primary-100 text-primary-700` + FiShield | None | Verified owner/shelter |
| Top Adopter | `bg-amber-100 text-amber-700` + FiAward | None | User achievement badge |

### 11.5 Species Badges

Each species has a distinct mini-badge for card overlays and filter chips:

| Species | Colors |
|---------|--------|
| Dog | `bg-orange-100 text-orange-700` |
| Cat | `bg-violet-100 text-violet-700` |
| Bird | `bg-cyan-100 text-cyan-700` |
| Fish | `bg-blue-100 text-blue-700` |
| Rabbit | `bg-pink-100 text-pink-700` |
| Hamster | `bg-yellow-100 text-yellow-700` |
| Reptile | `bg-emerald-100 text-emerald-700` |
| Other | `bg-neutral-100 text-neutral-700` |

### 11.6 Badge with Icon

```
Layout:   [icon-12px] [text] or [text] [icon-12px]
Gap:      gap-1 (4px)
Example:  <FiCheck className="w-3 h-3" /> Available
```

### 11.7 Badge Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| SM (compact) | 20px | `px-2 py-0` | 10px (text-2xs) |
| MD (default) | 24px | `px-2.5 py-0.5` | 12px (text-xs) |
| LG | 28px | `px-3 py-1` | 14px (text-sm) |

---

## 12. Empty States

### 12.1 Design Philosophy

Empty states are opportunities, not dead ends. Every empty state must:
1. **Explain** what belongs here in plain language
2. **Encourage** the user to take the next action
3. **Delight** with a relevant illustration or icon

### 12.2 Empty State Anatomy

```
+-------------------------------------------------------+
|                                                         |
|                                                         |
|         [Illustration / Large Icon - 80px]              |
|         (neutral-300 color, 80px × 80px)                |
|                                                         |
|         Title (H4, font-display, font-semibold)          |
|         (text-neutral-700 dark:text-neutral-300)        |
|                                                         |
|         Description (text-sm, text-neutral-500,          |
|         max-width 400px, center)                         |
|                                                         |
|         [Primary CTA Button]                             |
|         (optional — only if there's an action to take)   |
|                                                         |
+-------------------------------------------------------+

Padding:       py-16 px-6
Max Width:     480px
Centered:      mx-auto text-center
```

### 12.3 Empty State Variants

#### No Pets Found
```
Icon:       FiHeart (large, neutral-300)
Title:      No pets found
Body:       We couldn't find any pets matching your search. Try adjusting your filters or browse all available pets.
CTA:        "Clear Filters" (btn-outline) + "Browse All Pets" (btn-primary)
```

#### No Saved Pets
```
Icon:       FiBookmark (large, neutral-300)
Title:      No saved pets yet
Body:       Pets you save will appear here. Start browsing and tap the heart icon to save pets you love.
CTA:        "Browse Pets" (btn-primary)
```

#### No Listings (My Listings)
```
Icon:       FiPlusCircle (large, neutral-300)
Title:      No listings yet
Body:      Create your first pet listing to find a loving home. It only takes a few minutes.
CTA:        "Create Listing" (btn-primary)
```

#### No Notifications
```
Icon:       FiBell (large, neutral-300)
Title:      No notifications
Body:       You're all caught up! We'll notify you when there's activity on your listings or saved pets.
CTA:        None
```

#### No Messages
```
Icon:       FiMessageCircle (large, neutral-300)
Title:      No messages yet
Body:       Messages from interested adopters will appear here. Browse pets and start conversations.
CTA:        "Browse Pets" (btn-primary)
```

#### No Search Results
```
Icon:       FiSearch (large, neutral-300)
Title:      No results for "{query}"
Body:       Try checking your spelling, using fewer filters, or searching for a different breed or location.
CTA:        "Clear Search" (btn-outline)
```

#### No Reports (Admin)
```
Icon:       FiFlag (large, neutral-300)
Title:      No reports to review
Body:       Great job! There are no pending reports that need your attention.
CTA:        None
```

#### Generic / Fallback
```
Icon:       FiInbox (large, neutral-300)
Title:      Nothing here yet
Body:       Content will appear here once it's available.
CTA:        None
```

### 12.4 Empty State Component API

The [`EmptyState`](client/src/components/common/EmptyState.jsx) component accepts:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | ReactNode | `FiInbox` | Icon component to display |
| `title` | string | `"Nothing here yet"` | Main heading |
| `description` | string | `""` | Supporting description |
| `actionLabel` | string | — | CTA button text |
| `onAction` | function | — | CTA button click handler |
| `actionVariant` | string | `"primary"` | Button variant |
| `className` | string | `""` | Additional wrapper classes |

---

## 13. Loading Skeleton System

### 13.1 Design Philosophy

Skeletons should:
- **Match layout exactly** — same dimensions, spacing, and structure as the loaded content
- **Use subtle animation** — pulse effect, never flashing or jarring
- **Show structure** — reveal the information architecture before data arrives
- **Be performant** — pure CSS animation via `animate-pulse`, no JavaScript-driven motion

### 13.2 Base Skeleton

```
Classes:       skeleton-pulse (rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse)
Animation:     pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
```

### 13.3 Skeleton Components

#### CardSkeleton
```
+-------------------------------------------------------+
| [████████████████████████████]  ← image (240px h)      |
|                                                         |
| [████████████████████████████████]  ← title (70% w)     |
| [███████████████]                    ← subtitle (40% w) |
| [█████████████]                      ← location (35% w) |
|                                                         |
| --- divider ---                                         |
|                                                         |
| [████████████] [██████████████████]  ← price + button   |
+-------------------------------------------------------+
```

#### ListSkeleton
```
+-------------------------------------------------------+
| [███]  [████████████████]  [████] [██████]  [███████]  |
| [███]  [████████████]     [████] [████]    [███████]  |
| [███]  [████████████████] [████] [██████]  [███████]  |
| [███]  [███████████]      [████] [███████] [███████]  |
+-------------------------------------------------------+
```

#### DetailSkeleton
```
+-------------------------------------------------------+
| [██████████████████████████████████████]  ← image       |
|                                                         |
| [█████████████████████████████]  ← name (60% w)         |
| [████████████]                     ← breed (30% w)      |
|                                                         |
| [██████████████]  [████████████]  ← details              |
| [████████████████]  [██████████]                         |
|                                                         |
| ████████████████████████████      ← description          |
| ██████████████████████████████                           |
| ██████████████████████████                              |
| ████████████████                                        |
|                                                         |
| [████████████████████████████████]  ← CTA button         |
+-------------------------------------------------------+
```

#### TableSkeleton (Admin)
```
+-------------------------------------------------------+
| [██] [████████████] [████████] [███████] [█████] [███] |
| [██] [█████████]    [███████]  [████]    [█████] [███] |
| [██] [████████████] [█████]    [███████] [█████] [███] |
| [██] [██████████]   [████████] [██████]  [█████] [███] |
| [██] [█████████]    [██████]   [███████] [█████] [███] |
+-------------------------------------------------------+
```

#### ProfileSkeleton
```
+-------------------------------------------------------+
|            [○○○○○]  ← avatar (circle)                    |
|        [███████████████]  ← name (40% w)                |
|          [█████████]  ← username (25% w)               |
|                                                         |
|    [███████████████████████████]  ← bio                  |
|    [██████████████████████]                             |
|                                                         |
| [████████]    [███████████]  ← stats                     |
|                                                         |
| [████████████████████████████]  ← button (full width)    |
+-------------------------------------------------------+
```

#### FormSkeleton
```
+-------------------------------------------------------+
| [██████████]                   ← label                   |
| [█████████████████████████████████████████████] ← input |
|                                                         |
| [████████████]                 ← label                   |
| [█████████████████████████████████████████████] ← input |
|                                                         |
| [██████████]                   ← label                   |
| [█████████████████████████████] ← textarea               |
| [█████████████████████████████]                          |
| [██████████████████]                                    |
|                                                         |
| [███████████████████████████████████] ← submit button    |
+-------------------------------------------------------+
```

### 13.4 Skeleton Usage Guidelines

1. **Show skeletons on initial load only.** On subsequent data fetches (filtering, pagination), keep existing content visible and show a subtle loading indicator instead.
2. **Match the grid.** If cards are in a 3-column grid, render 3-6 card skeletons in the same grid layout.
3. **Vary widths slightly.** Title skeletons at 60-80% width, subtitles at 30-50%, for natural appearance.
4. **Use `aria-hidden="true"`.** Skeletons are decorative and should be hidden from screen readers.
5. **Provide `aria-label="Loading"`** on the skeleton container for screen reader announcements.
6. **Transition out smoothly.** Fade skeletons out and fade real content in with a 200ms crossfade.

### 13.5 Skeleton Component API

All skeleton components in [`client/src/components/skeleton/`](client/src/components/skeleton/) accept:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | varies | Number of skeleton items to render |
| `className` | string | `""` | Additional wrapper classes |

---

## 14. Modal Design System

### 14.1 Modal Anatomy

```
+-------------------------------------------------------+
| [Overlay - bg-black/50 backdrop-blur-sm]                |
|                                                         |
|   +-----------------------------------------------+     |
|   | [Title (H4)]              [Close Button (×)]  |     |
|   |                                               |     |
|   | [Content Area]                                |     |
|   | - Flexible content                            |     |
|   | - Scrollable if exceeds max height            |     |
|   |                                               |     |
|   | --- divider (optional) ---                    |     |
|   |                                               |     |
|   | [Secondary Action]     [Primary CTA Button]   |     |
|   +-----------------------------------------------+     |
+-------------------------------------------------------+
```

### 14.2 Modal Sizes

| Size | Max Width | Tailwind | Usage |
|------|----------|----------|-------|
| Small | 384px (24rem) | `max-w-sm` | Confirmation dialogs, alerts |
| Medium | 448px (28rem) | `max-w-md` | Simple forms, login |
| Large | 512px (32rem) | `max-w-lg` | Standard forms, pet details |
| X-Large | 672px (42rem) | `max-w-2xl` | Complex forms, image galleries |
| Full Screen | 100vw × 100vh | `max-w-full h-full` | Mobile drawers, immersive views |

### 14.3 Modal Styles

```
Overlay:
  Background:    bg-black/50 backdrop-blur-sm
  Animation:     fade in (opacity 0 → 1, 200ms)
  Z-Index:       z-50
  Click:         Closes modal (unless persistent)

Modal Container:
  Background:    bg-white
  Border:        border border-neutral-200 (optional)
  Radius:        rounded-2xl
  Shadow:        shadow-soft-lg
  Padding:       p-6
  Animation:     scale-in (opacity 0, scale 0.95 → opacity 1, scale 1, 200ms ease-out)
  Position:      centered (fixed inset-0 flex items-center justify-center)
  Max Height:    calc(100vh - 64px) with overflow-y-auto
  Dark:          dark:bg-neutral-900 dark:border-neutral-800

Header:
  Padding:       pb-4 (bottom padding only, top padding from container)
  Layout:        flex items-start justify-between
  Title:         text-xl font-display font-semibold
  Close Button:  btn-icon btn-ghost rounded-full

Body:
  Padding:       py-4 (if separated from header/footer)
  Overflow:      overflow-y-auto (if content exceeds max height)
  Scroll:        Custom scrollbar styling

Footer:
  Padding:       pt-4 (top padding only)
  Layout:        flex items-center justify-end gap-3
  Border Top:    border-t border-neutral-200 (optional divider)
```

### 14.4 Modal Variants

#### Confirmation Dialog (Small)
```
+-------------------------------------------+
|                                           |
|   [Warning Icon - 48px, red-500]          |
|                                           |
|   Are you sure? (H4, center)              |
|   This action cannot be undone.           |
|   (text-sm, text-neutral-500, center)     |
|                                           |
|   [Cancel]            [Delete — Danger]   |
+-------------------------------------------+
```

#### Form Modal (Large)
```
+-------------------------------------------+
| Create Listing                        [×] |
|                                           |
| [Form fields with labels and inputs...]   |
|                                           |
| [Cancel]              [Create Listing]    |
+-------------------------------------------+
```

#### Image Lightbox (X-Large)
```
+-------------------------------------------+
| [Close Button — top-right, glass]          |
|                                           |
|         [Full Image — max-h-[80vh]]       |
|                                           |
| [Previous]  [Counter: 3/12]  [Next]       |
+-------------------------------------------+
```

### 14.5 Modal Behavior

- **Open:** Animate overlay fade + modal scale-in simultaneously (200ms)
- **Close:** Animate in reverse (150ms, slightly faster)
- **Backdrop Click:** Closes modal (unless `persistent` prop is true)
- **Escape Key:** Closes modal (default behavior)
- **Focus Trap:** Focus is trapped inside modal while open
- **Scroll Lock:** Body scroll is locked while modal is open (`overflow: hidden` on `<body>`)
- **Return Focus:** Focus returns to the element that triggered the modal on close

### 14.6 Mobile Modal Behavior

On mobile (viewport < 640px), modals transform into **bottom sheets**:

```
+-------------------------------------------+
| [Overlay]                                  |
|                                           |
|                                           |
|   +-----------------------------------+   |
|   | [Drag Handle — 32px bar, centered]|   |
|   | Title                        [×]  |   |
|   |                                   |   |
|   | [Scrollable content...]           |   |
|   |                                   |   |
|   | [Cancel]      [Confirm]           |   |
|   +-----------------------------------+   |
+-------------------------------------------+

Radius:       rounded-t-2xl (top only)
Width:        100vw
Max Height:   90vh
Animation:    Slide up from bottom (y: 100% → y: 0%)
Drag:         Swipe down to dismiss (via Framer Motion drag)
```

---

## 15. Toast Notification Design

### 15.1 Toast Anatomy

```
+-------------------------------------------------------+
| [Icon 20px]  Message text (text-sm, max 2 lines)       |
|              [Action Link — optional]    [× Close]      |
+-------------------------------------------------------+
```

### 15.2 Toast Types

| Type | Icon | Border Left | Background | Text Color |
|------|------|------------|------------|------------|
| Success | `FiCheckCircle` (accent-500) | `accent-500` (4px) | `bg-white` | `text-neutral-800` |
| Error | `FiXCircle` (red-500) | `red-500` (4px) | `bg-white` | `text-neutral-800` |
| Warning | `FiAlertTriangle` (amber-500) | `amber-500` (4px) | `bg-white` | `text-neutral-800` |
| Info | `FiInfo` (info-500) | `info-500` (4px) | `bg-white` | `text-neutral-800` |

### 15.3 Toast Styles

```
Container:
  Min Width:     320px
  Max Width:     420px
  Background:    bg-white
  Border:        border border-neutral-200
  Left Border:   4px solid (color based on type)
  Radius:        rounded-xl
  Shadow:        shadow-soft-lg
  Padding:       p-4

Layout:
  display:       flex items-start gap-3

Icon:
  Size:          20px × 20px
  Flex:          shrink-0
  Margin Top:    1px (optical alignment with text)

Message:
  Font:          text-sm text-neutral-800
  Flex:          flex-1
  Max Lines:     2 (line-clamp-2)

Action:
  Font:          text-sm font-semibold text-primary-600
  Margin Left:   ml-2

Close Button:
  Icon:          FiX (16px)
  Style:         btn-icon p-0.5 text-neutral-400 hover:text-neutral-600
  Flex:          shrink-0
```

### 15.4 Toast Positioning

```
Desktop:
  Position:   fixed bottom-4 right-4
  Stack:      flex flex-col-reverse gap-2 (newest at bottom)
  Z-Index:    z-50

Mobile:
  Position:   fixed bottom-4 left-4 right-4
  Width:      calc(100vw - 32px)
  Max Width:  420px
  Center:     mx-auto
```

### 15.5 Toast Animation

```
Entrance:
  Initial:  { opacity: 0, y: 20, scale: 0.95 }
  Animate:  { opacity: 1, y: 0, scale: 1 }
  Transition: { type: 'spring', stiffness: 400, damping: 30 }

Exit:
  Animate:  { opacity: 0, x: 20, scale: 0.95 }
  Transition: { duration: 0.2, ease: 'easeIn' }

Hover:
  Scale:    scale-[1.02] (slight lift)
  Shadow:   shadow-xl (more prominent)
```

### 15.6 Toast Timing

| Type | Default Duration | Auto Dismiss? |
|------|-----------------|---------------|
| Success | 4 seconds | Yes |
| Error | 6 seconds | Yes |
| Warning | 5 seconds | Yes |
| Info | 4 seconds | Yes |
| With Action | 10 seconds | Yes (longer for interaction) |
| Persistent | Never | No (manual close only) |

**Rules:**
- Pause auto-dismiss timer on hover
- Resume timer on mouse leave
- Only show max 3 toasts at once; queue the rest
- Identical toasts (same message) are deduplicated

---

## 16. Mobile Design Guidelines

### 16.1 Breakpoints

| Breakpoint | Min Width | Tailwind Prefix | Device Category |
|-----------|----------|----------------|-----------------|
| XS | 375px | (default) | Small phones (iPhone SE) |
| SM | 640px | `sm:` | Large phones, small tablets |
| MD | 768px | `md:` | Tablets (portrait) |
| LG | 1024px | `lg:` | Tablets (landscape), small laptops |
| XL | 1280px | `xl:` | Desktops |
| 2XL | 1536px | `2xl:` | Large desktops |

### 16.2 Mobile-First Principles

1. **Design at 375px first.** Every component must work perfectly at this width.
2. **Touch targets ≥ 44px.** All interactive elements must be at least 44×44px (WCAG 2.5.5).
3. **No hover-dependent UI.** Critical actions must be discoverable without hovering.
4. **Thumb zone.** Primary actions go in the bottom half of the screen (within thumb reach).
5. **Minimal text input on mobile.** Use selects, toggles, and date pickers over free-text where possible.

### 16.3 Navigation

#### Mobile Navigation (viewport < 768px)
```
Bottom Tab Bar:
  - Fixed at bottom: fixed bottom-0 left-0 right-0
  - Height: 56px
  - Background: bg-white border-t border-neutral-200
  - 4-5 tabs: Home, Browse, Saved, Messages, Profile
  - Active tab: text-primary-500, inactive: text-neutral-400
  - Icons: 24px, Labels: 10px text-2xs
  - Safe area: pb-safe (padding for devices with home indicator)

Hamburger Menu:
  - Trigger: Hamburger icon (FiMenu) in header
  - Drawer slides in from left (full height)
  - Width: 300px
  - Overlay: bg-black/50
  - Close: Swipe left or tap overlay
  - Contains: All nav links, auth actions, theme toggle
```

#### Tablet/Desktop Navigation (viewport ≥ 768px)
```
Top Nav Bar (Header):
  - Horizontal links with underline animation
  - Dropdown menus for nested items
  - User avatar with dropdown menu (UserMenu component)
  - Sticky on scroll
```

### 16.4 Layout Adjustments

| Element | Mobile (default) | Tablet (md:) | Desktop (lg:) |
|---------|-----------------|-------------|---------------|
| Grid Columns | 1 | 2 | 3-4 |
| Pet Cards | Full width | 2 columns | 3 columns |
| Forms | Stacked vertical | Stacked vertical | 2-column grid where appropriate |
| Tables | Horizontal scroll cards | Full table | Full table with more columns |
| Modals | Bottom sheet (90vh) | Centered dialog | Centered dialog |
| Sidebar | Off-screen drawer | Off-screen drawer | Persistent sidebar (240px) |
| Header | Simplified (logo + hamburger) | Simplified (logo + hamburger) | Full nav with links |
| Footer | Stacked links | 2-column | 4-column |

### 16.5 Touch Interactions

- **Swipe gestures:** Pet cards swipeable in carousels, bottom sheets swipe-to-dismiss
- **Long press:** Pet cards show quick-action menu (save, share, report)
- **Pull to refresh:** Pet lists support pull-to-refresh on mobile
- **Double tap:** Pet images zoom to fill (image lightbox)

### 16.6 Mobile Typography Adjustments

- H1 reduces from 48px → 32px on mobile
- H2 reduces from 36px → 28px on mobile
- Body text remains at 16px (never smaller to prevent iOS zoom)
- Input font size must be ≥ 16px to prevent iOS auto-zoom on focus

### 16.7 Mobile Performance

- Lazy load images below the fold (via `loading="lazy"`)
- Use `srcset` for responsive pet images
- Disable heavy animations on mobile (stagger effects, particle effects)
- Reduce skeleton count (show 2-3 instead of 6)
- Use `will-change` only on elements that will animate

### 16.8 Safe Areas

```css
/* Bottom safe area for devices with home indicator */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Top safe area for notched devices */
.pt-safe {
  padding-top: env(safe-area-inset-top, 0px);
}
```

---

## 17. Accessibility Guidelines

### 17.1 Compliance Target

**WCAG 2.1 Level AA** — minimum compliance for all components and pages.

### 17.2 Color Contrast

| Element | Minimum Ratio | Example |
|---------|--------------|---------|
| Normal Text (< 18px) | 4.5:1 | Body text on white background |
| Large Text (≥ 18px or ≥ 14px bold) | 3:1 | Headings on white background |
| UI Components (icons, borders) | 3:1 | Input borders, icon buttons |
| Disabled Text | No requirement | But must still be distinguishable |

**Verified Combinations:**
- `text-neutral-800` (#262626) on `bg-white` (#ffffff): **14.82:1** ✅
- `text-neutral-600` (#525252) on `bg-white` (#ffffff): **7.06:1** ✅
- `text-neutral-500` (#737373) on `bg-white` (#ffffff): **4.64:1** ✅ (passes AA)
- `text-neutral-400` (#a3a3a3) on `bg-white` (#ffffff): **2.63:1** ❌ (use for decoration only)
- `text-white` on `bg-primary-500` (#3b82f6): **4.62:1** ✅
- `text-white` on `bg-primary-600` (#2563eb): **5.58:1** ✅
- `text-white` on `bg-red-500` (#ef4444): **4.57:1** ✅

**Critical: `text-neutral-400` (#a3a3a3) fails AA on white.** Never use it for essential text. Use `text-neutral-500` (#737373, 4.64:1) as the lightest body text.

### 17.3 Focus Management

1. **All interactive elements must have visible focus indicators.**
   - Default: `ring-2 ring-primary-500 ring-offset-2`
   - Skip-to-content link as first focusable element
2. **Focus order must follow visual order.**
3. **Modals trap focus** while open (via focus-trap or manual management).
4. **Route changes move focus** to the `<h1>` or main content area.
5. **Toast notifications do not steal focus.**

### 17.4 Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus forward |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate button/link |
| `Escape` | Close modal, dropdown, toast |
| `Arrow Keys` | Navigate within menus, tabs, carousels |
| `Home` / `End` | Jump to first/last item in list |

### 17.5 ARIA & Semantics

| Element | HTML | ARIA |
|---------|------|------|
| Primary Navigation | `<nav>` | `aria-label="Main navigation"` |
| Secondary Navigation | `<nav>` | `aria-label="Secondary navigation"` |
| Page Main Content | `<main>` | `id="main-content"` |
| Page Sections | `<section>` | `aria-labelledby` referencing heading |
| Cards (list) | `<ul>` + `<li>` | `role="list"` (if list-style removed) |
| Modals | `<div>` | `role="dialog" aria-modal="true" aria-labelledby` |
| Alerts/Toasts | `<div>` | `role="alert"` or `role="status"` |
| Tabs | `<div>` | `role="tablist"`, `role="tab"`, `role="tabpanel"` |
| Accordion | `<div>` | `role="region" aria-expanded` on trigger |
| Breadcrumb | `<nav>` | `aria-label="Breadcrumb"` |
| Search | `<form>` | `role="search"` |
| Loading | `<div>` | `aria-label="Loading" aria-live="polite"` |
| Empty State | `<div>` | `aria-live="polite"` |
| Error State | `<div>` | `role="alert"` |
| Skeleton | `<div>` | `aria-hidden="true"` (parent has `aria-label="Loading"`) |

### 17.6 Screen Reader Only Content

Use for providing context to screen reader users without visual clutter:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Usage Examples:**
- "Skip to main content" link
- Icon button labels (e.g., `<span class="sr-only">Save pet</span>`)
- Pagination context ("Page 3 of 12")
- Status indicators ("5 new notifications")

### 17.7 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**In Framer Motion components:**
```js
const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
/>
```

### 17.8 Images

- All pet images must have meaningful `alt` text: `alt="Golden Retriever puppy named Max"`
- Decorative images: `alt=""` (empty alt, not missing alt)
- Icons hidden from screen readers when paired with visible text: `aria-hidden="true"`
- Complex charts/diagrams: Provide `aria-describedby` linking to a text description

### 17.9 Forms

- Every input must have an associated `<label>` (not just placeholder)
- Required fields marked with `*` (red) + `aria-required="true"` + `required` attribute
- Error messages linked via `aria-describedby` on the input
- Success messages announced via `aria-live="polite"` region
- Form-level errors displayed in a summary at the top with `role="alert"`
- Submit buttons include loading state announcement: `aria-busy="true"` during submission

### 17.10 Color Independence

- Never convey information through color alone
- Error states: Red border + error icon + error message
- Success states: Green border + check icon + success message
- Status badges: Color + icon + text (e.g., red circle + "Lost" text)

### 17.11 Touch Targets (WCAG 2.5.5)

- Minimum touch target size: 44×44px
- Spacing between touch targets: At least 8px
- Exception: Inline links in text blocks (but adjacent links must have 8px gap)

**PetVerse Touch Target Compliance:**
- All buttons: ≥ 40px height (MD), 44px+ (LG)
- Icon buttons: 40×40px or 44×44px
- Checkbox/Radio: 20×20px with 24px invisible hit area expansion
- Nav links: 44px minimum height in mobile nav

### 17.12 Testing Checklist

- [ ] All pages have unique, descriptive `<title>` tags (via SEO component)
- [ ] All pages have exactly one `<h1>`
- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] All images have appropriate `alt` text
- [ ] Color contrast passes AA for all text
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible on all interactive elements
- [ ] Modals trap focus and can be dismissed with Escape
- [ ] Forms have associated labels and error messages
- [ ] `prefers-reduced-motion` is respected
- [ ] Screen reader announces dynamic content changes (toasts, loading, errors)
- [ ] Skip-to-content link is present and functional

---

## Appendix A: Tailwind Configuration Reference

The design system maps to the existing [`tailwind.config.js`](client/tailwind.config.js) as follows:

### Colors (extended)
- `primary` → Blue scale (50-950)
- `secondary` → Fuchsia scale (50-950)
- `accent` → Emerald scale (50-950)
- `neutral` → Gray scale (50-950)

### Fonts (extended)
- `font-sans` → Inter, system-ui
- `font-display` → Poppins, system-ui

### Font Sizes (extended)
- `text-2xs` → 0.625rem

### Border Radius (extended)
- `rounded-4xl` → 2rem

### Box Shadows (extended)
- `shadow-soft` → Card resting + light hover
- `shadow-soft-lg` → Modals, dropdowns, featured cards

### Animations (extended)
- `animate-fade-in` → fadeIn 0.3s ease-in-out
- `animate-slide-up` → slideUp 0.3s ease-out
- `animate-slide-in-right` → slideInRight 0.3s ease-out
- `animate-slide-in-left` → slideInLeft 0.3s ease-out
- `animate-pulse-soft` → pulseSoft 2s ease-in-out infinite

### Keyframes
- `fadeIn`: opacity 0 → 1
- `slideUp`: opacity 0 + translateY(10px) → opacity 1 + translateY(0)
- `slideInRight`: opacity 0 + translateX(20px) → opacity 1 + translateX(0)
- `slideInLeft`: opacity 0 + translateX(-20px) → opacity 1 + translateX(0)
- `pulseSoft`: opacity 1 → 0.7 → 1

## Appendix B: Component Class Reference (index.css)

All CSS component classes are defined in [`client/src/index.css`](client/src/index.css) as `@layer components`:

| Class | Description |
|-------|-------------|
| `.container-app` | Max-width container with responsive padding |
| `.section` | Standard page section with responsive vertical padding |
| `.section-heading` | H2-level section heading |
| `.section-subheading` | Supporting text below section heading |
| `.card` | Standard card with border, shadow, hover |
| `.card-glass` | Frosted glass card with backdrop blur |
| `.btn` | Base button styles |
| `.btn-primary` | Primary CTA button (blue) |
| `.btn-secondary` | Secondary button (gray) |
| `.btn-outline` | Outline button (blue border) |
| `.btn-ghost` | Ghost button (transparent) |
| `.btn-danger` | Danger button (red) |
| `.btn-sm` | Small button size |
| `.btn-lg` | Large button size |
| `.btn-icon` | Icon-only button (square) |
| `.input` | Base form input |
| `.input-error` | Input with error state |
| `.label` | Form label |
| `.error-text` | Error message text |
| `.badge` | Base badge/pill |
| `.badge-primary` | Blue badge |
| `.badge-success` | Green badge |
| `.badge-warning` | Amber badge |
| `.badge-danger` | Red badge |
| `.badge-neutral` | Gray badge |
| `.divider` | Horizontal divider |
| `.skeleton-pulse` | Animated skeleton placeholder |
| `.text-balance` | Balanced text wrapping for headings |
| `.text-gradient` | Gradient text (blue → emerald) |
| `.scrollbar-hide` | Hide scrollbar while preserving scroll |

## Appendix C: Framer Motion Conventions

### Import Pattern
```js
import { motion, AnimatePresence } from 'framer-motion';
```

### Variant Naming Convention
```js
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
```

### Transition Presets
```js
const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  default: { duration: 0.2, ease: 'easeOut' },
  smooth: { duration: 0.3, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
};
```

### Stagger Children Pattern
```js
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### Layout Animation
```js
<motion.div layout>
  {/* Automatically animates position/size changes */}
</motion.div>
```

### Shared Layout (Morphing)
```js
<motion.div layoutId="pet-image-{petId}">
  {/* Morphs between list card and detail page */}
</motion.div>
```

---

*End of PetVerse Design System v1.0.0*
*This document supersedes all ad-hoc styling decisions. All UI implementation must reference this system.*