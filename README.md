# Buna House — Modern 3D Ethiopian Restaurant Website

A modern, dark-themed, 3D-animated website for a fictional Ethiopian restaurant. Built with vanilla HTML/CSS/JS + Three.js for the 3D background.

## What's in the box

- **3D animated background** — floating coffee beans, particle field, glowing central orb (Three.js)
- **Mouse parallax** — camera follows your cursor
- **Tilt-on-hover** dish cards
- **Smooth scroll navigation** with active link highlighting
- **Reservation form** with working interactive submit
- **Fully responsive** — works on phone, tablet, desktop
- **Zero build step** — just open `index.html` in a browser

## File structure

```
buna-house/
├── index.html      # main page
├── styles.css      # all styling
├── app.js          # 3D scene + interactions
└── README.md       # this file
```

## Local preview

Just open `index.html` in any modern browser, or run:

```bash
# Option 1: direct
open index.html   # macOS
xdg-open index.html  # Linux
start index.html  # Windows

# Option 2: local server (recommended for the 3D scene)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customize for your real restaurant

Search & replace these in `index.html`:
- `Buna House` → your restaurant name
- `+251 11 234 5678` → your phone
- `123 Bole Road` → your address
- Dishes/prices in the menu grid
- Hero subtitle text
