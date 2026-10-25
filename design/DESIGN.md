---
name: RadyoAI
colors:
  background: '#0B0F19'
  surface: '#121824'
  surface-panel: '#1B2233'
  surface-container: '#151D2C'
  surface-container-low: '#0F141F'
  surface-container-high: '#1A2538'
  surface-sheet: '#151C2B'
  on-surface: '#F2E6C9'
  on-surface-variant: '#C5D0E0'
  on-surface-muted: '#A6B2C8'
  outline: '#3A4256'
  outline-variant: '#27334A'
  primary: '#2FA4A9'
  primary-hover: '#289196'
  primary-highlight: '#82E6EA'
  on-primary: '#0B101B'
  warning: '#E8A33D'
  danger: '#C8553D'
typography:
  display:
    fontFamily: Pixelify Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline:
    fontFamily: Pixelify Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
  button-primary:
    fontFamily: Pixelify Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  label:
    fontFamily: Pixelify Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
  caption:
    fontFamily: Pixelify Sans
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
  choice:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: '800'
    lineHeight: 20px
  body:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  body-sm:
    fontFamily: Nunito
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  screen-width: 390px
  screen-height: 844px
  scene-height: 410px
  margin: 0.75rem
  gutter: 0.625rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  touch-target: 48px
---

# Design System

## Brand & Style

RadyoAI is a decision game in the style of **Yes, Your Grace**: a 16-bit pixel-art scene in the top half of the screen and a dark, framed text panel in the bottom half. The setting is a modern Turkish hospital's radiology AI office, not a castle. The mood is calm and serious, with a light retro-game touch (CRT scanlines over the scene, pixel borders, pixel display font). Text must stay readable on a phone, so the pixel font is only for titles and labels; all sentences use a clean sans-serif. All UI text is Turkish and must render ş, ğ, ı, İ, ç, ö, ü.

## Colors

The system has a single dark mode built on deep navy surfaces and warm parchment text.

- **Surfaces (`#0B0F19` → `#1B2233`)**: Layered navy tones. The page background is the darkest, the decision panel (`#1B2233`) is the main surface, and nested boxes (hint box, result sections) step slightly darker or lighter.
- **Parchment (`#F2E6C9`)**: Primary text color, like ink on old paper. Secondary text uses cool grays (`#C5D0E0`, `#A6B2C8`).
- **Slate outline (`#3A4256`)**: The 2px border on every frame, button and bubble.
- **Teal (`#2FA4A9`)**: The hospital accent. Used for the primary action (Başla, Devam), selected states, positive resource changes and the tutor icon.
- **Amber (`#E8A33D`)**: Attention. Used for the timer, the hint box title and the "Neden?" label.
- **Danger red (`#C8553D`)**: Negative resource changes, bad-ending markers and the "ASKIDA" stamp.

## Typography

Two families with strict roles:

- **Pixelify Sans**: game title, section headers, buttons with a single word, labels in uppercase (ZİYARETÇİ 1/3, BÜTÇE, NE OLDU?), resource numbers and the timer.
- **Nunito**: every sentence the player reads: speech bubbles, choice labels, hint text, "Ne oldu / Neden" explanations, tutor chat.

Labels in Pixelify Sans are uppercase with slight letter spacing. Nunito body text is 12–14px with snug line height so a full speech bubble fits without scrolling.

## Layout & Spacing

Portrait mobile layout designed at 390×844.

- **Scene (top, ~410px)**: Full-bleed pixel illustration with a scanline overlay and a gradient fading into the panel color at the bottom. HUD items float on top: visitor counter (top-left), timer badge (top-right), character name tag and the speech bubble (bottom).
- **Panel (bottom, remaining height)**: In order: resource bar, hint box, two stacked choice buttons, and a bottom row with the "Tutor'a sor" button.
- Spacing is tight and even: 12px outer padding, 10px between stacked elements.
- Every tappable element is at least 48px tall.

## Elevation & Depth

Depth comes from pixel-style borders, not soft shadows. Frames use a solid 2px slate outline; pressed-looking buttons use an inset bevel (light top-left edge, dark bottom-right edge). The result sheet slides up from the bottom over the panel with a 4px teal top border. The only blurred effect is the semi-transparent background behind floating HUD badges.

## Shapes

Mostly sharp, slightly softened corners to keep the pixel feel: 4px on buttons, chips and badges; 6px on the resource bar and hint box; 8px on the speech bubble; 12px on the top of the bottom sheet. The timer badge is fully rounded. The speech bubble has a small triangle tail pointing at the character.

## Components

- **Speech bubble:** Navy panel with a 2px slate border and tail, an amber speech icon on the left, Nunito 13px semibold text. Key numbers in the sentence may be highlighted in amber.
- **Character name tag:** Small framed tag above the bubble: role in teal (VERİ BİLİMCİ) followed by the name in bold parchment (DENİZ).
- **Resource bar:** One framed row with three items separated by thin dividers: emoji icon, uppercase label, number (💰 BÜTÇE, 🤝 GÜVEN, ⚖️ UYUM).
- **Hint box:** Collapsible frame titled "💡 İPUCU" in amber with a chevron; the body text is Nunito 12px.
- **Choice buttons:** Two full-width stacked buttons, minimum 52px tall, with a square letter badge (A / B) on the left and the choice text in Nunito 14px extrabold. **Both buttons use the same neutral style** (slate border, teal on hover and press). Color, icons or subtitles must never hint at which choice is better.
- **Primary button:** Full-width, 48px, teal fill with a light teal border, dark text in Pixelify Sans uppercase (BAŞLA, DEVAM ET, YENİDEN OYNA). Disabled state is gray with muted text.
- **Selectable cards (start screen):** Pill-shaped option buttons grouped under a question; the selected one fills with teal.
- **Result sheet:** Bottom sheet with a drag handle, title "KARAR SONUCU", two dark sections labeled "NE OLDU?" (teal) and "NEDEN?" (amber), a row of resource change chips (red for negative, teal for positive, gray for no change), and a Devam button.
- **Timer badge:** Rounded amber-bordered badge with a clock icon and the seconds left.
- **Ending screen:** Large pixel title, a full-width scene illustration (teal glow for the good ending, dark with a red "ASKIDA" stamp for the bad ending), final resource values, the list of decisions and the reading suggestions card.
