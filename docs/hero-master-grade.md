# Home Command Center — Hero Image Master Grade

> Reference doc. The implementation is the reusable hero-grade module in
> `index.html` (see `applyHeroGrades()` + the `.hcc-hero-grade` /
> `.hcc-hero-vignette` CSS). This file documents the intent and the values so
> future sections stay consistent. The "Gold Standard" rules also live in
> `CLAUDE.md`.

## Purpose
Apply ONE cinematic golden-hour color grade to every hero image so the whole
app looks like one film stock. Do **not** replace image assets or change
overlays/typography. New sections inherit the grade automatically.

## How it actually works (as shipped)
- **`applyHeroGrades()`** runs on init, finds every hero container
  (`.house-hero`, `.sec-hero`, `.hcc-hero`), and:
  - adds **`.hcc-hero-grade`** to the hero `<img>` (the color grade)
  - adds **`.hcc-hero-vignette`** to the container (the vignette)
- To cover a NEW section's hero: just put its `<img>` inside a `.sec-hero`
  (or `.house-hero` / `.hcc-hero`) container with a descriptive `alt`. Done —
  no per-hero CSS.

> Note: the vignette is on the **container** (`::before`), not the `<img>`.
> An `<img>` is a replaced element and does not render `::before`/`::after`,
> so an image-level vignette would silently do nothing.

## CSS (in index.html)
```css
.hcc-hero-grade{
  filter: brightness(.92) contrast(1.14) saturate(.93) sepia(.10) hue-rotate(-3deg);
}
.hcc-hero-vignette::before{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    radial-gradient(circle at 50% 36%, rgba(255,206,120,.06), transparent 55%),
    radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,.48) 100%);
}
```

## JavaScript (in index.html)
```javascript
function applyHeroGrades(){
  var heroes = document.querySelectorAll('.house-hero, .sec-hero, .hcc-hero');
  heroes.forEach(function(c){
    c.classList.add('hcc-hero-vignette');
    var img = c.querySelector('img');
    if(img) img.classList.add('hcc-hero-grade');
  });
}
// called in INIT
```

## Art Direction
- Weather hero was the calibration reference; the grade is intentionally mild
  and now applies uniformly to ALL heroes so the set looks like one evening,
  one camera, one color profile.
- Do not swap or regenerate hero images to fix tone — the grade handles tone.
- Keep all existing overlays and typography.
- Preserve composition and cropping.
- To shift the look, change the shared `.hcc-hero-grade` values once (affects
  every hero together). Never add a per-hero `filter:`.
