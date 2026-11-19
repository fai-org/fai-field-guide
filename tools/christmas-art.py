#!/usr/bin/env python3
"""Draws the Christmas edition's art with the FAI Christmas kit and writes it into the site.

    python3 tools/christmas-art.py /path/to/fai-christmas [--rasters]

The kit (the private fai-christmas repository) rules the lines and places the shapes; this file only says
what goes where, in modules. It writes the inline art between the xmas-art and xmas-switch markers in
index.html, and favicon-christmas.svg. With --rasters (needs Pillow and Chrome) it also writes
og-christmas.jpg, the favicon PNGs, and xmas/: the gold glitter tile, the cranberry bauble and the ground
of the quiz result card. The kit and its glitter photographs stay out of this repository.
"""
import os, re, subprocess, sys, tempfile

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if not args:
    sys.exit(__doc__)
KIT = os.path.abspath(os.path.expanduser(args[0]))
sys.path.insert(0, KIT)
from xmas.kit import Sheet, sheet, GLITTER, GLITTER_RED  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M = 30                                     # the page module, in CSS pixels
KICK = "FAI’s Tech Right Gift Guide 2026"
HEAD = ["A field guide", "to post-IPO", "holiday giving"]
TILE = 192                                 # the gold glitter tile, in CSS pixels (shipped at 2x)


def body(s):
    """A flat kit sheet as SVG content for the page: no ground, lines in the text color,
    gold glitter as dots filled from the page's glitter tile, the bauble as its picture."""
    svg = s.svg(type_layer=False)
    svg = re.sub(r"^<svg[^>]*>|</svg>$", "", svg)
    svg = re.sub(r"<defs>.*?</defs>", "", svg)
    svg = re.sub(r'^<rect width="[\d.]+" height="[\d.]+" fill="#[0-9A-Fa-f]{6}"/>', "", svg)
    svg = re.sub(r'<rect width="[\d.]+" height="[\d.]+" fill="none" stroke="none"/>', "", svg)
    svg = re.sub(r"<image [^>]*/>", "", svg)
    svg = svg.replace(f'stroke="{s.g["line"]}"', 'stroke="currentColor"')
    # Ink shapes (a hanger's cap, a coupe's foot) take the text color, so they show on Ink stock.
    # Where two inks overlap the kit prints ink; those stay ink.
    for x in s.flats:
        if x["fam"] == "ink":
            svg = svg.replace(x["svg"], "", 1) + f'<g fill="currentColor">{x["svg"]}</g>'
    svg = svg.replace('<g fill="#1F201C"></g>', "")
    for g in s.glit:
        cx, cy, r = (round(g[k] * s.M, 1) for k in ("cx", "cy", "r"))
        svg += (f'<image href="xmas/bauble.webp" x="{cx - r:g}" y="{cy - r:g}" width="{2 * r:g}" height="{2 * r:g}"/>' if g["kind"] == "red"
                else f'<circle cx="{cx:g}" cy="{cy:g}" r="{r:g}" fill="url(#xg-gold)"/>')
    return svg


def art(cls, box, *bodies):
    x, y, w, h = (v * M for v in box)
    return f'<svg class="xa {cls}" viewBox="{x:g} {y:g} {w:g} {h:g}" aria-hidden="true" focusable="false">{"".join(bodies)}</svg>'


def flat(w, h, ground="cream"):
    return Sheet(w, h, M, ground=ground, name="x", textured=False)


def cover(w, h, tree, bauble, standard, strand, box, cls):
    """The gift guide's cover art. The page rules the ground lines; the tree stands on one, the standard
    crosses them, and the bauble hangs from a plumb line on the standard's axis."""
    a = flat(w, h); a.standard(*standard); a.tiers(*tree)
    b = flat(w, h); b.bauble(*bauble)
    c = flat(w, h); c.strand(*strand[:3], strand[3], r_min=strand[4], r_swell=strand[5])
    ox = bauble[0] * M
    return art(cls, box, body(a), f'<g class="xa-hang" style="transform-origin:{ox:g}px 0">{body(b)}</g>', body(c))


def tier(kind):
    """Section art for a price tier, standing on the section's ground line (5.25 modules below the top)."""
    s = flat(6, 5.25, "ink")
    if kind == "gift":
        s.gift(4, 5.25, 2, "cranberry")
        return art("xt-art", (2, 0, 4, 5.25), body(s))
    if kind == "coupe":
        s.coupe(4, 5.25, 3.5, "cranberry")
        return art("xt-art", (2, 0, 4, 5.25), body(s))
    t = flat(6, 5.25, "ink"); t.tri(1.5, 3.25, 2)
    s.house(4, 5.25, 2.5)
    return art("xt-art", (0.5, 0, 5.5, 5.25), f'<g class="xa-far">{body(t)}</g>', body(s))


def finale():
    s = flat(7, 5, "fir"); s.gift(2.5, 5, 3, "cranberry"); s.candle(5.5, 5, 2.5, 0.6, "cream"); s.candle(6.5, 5, 1.5, 0.6, "cream")
    p = flat(3, 4, "fir"); p.gift(1.5, 4, 2, "cranberry")
    return art("xf-art xa-wide", (0, 0.5, 7, 4.5), body(s)) + art("xf-art xa-phone", (0, 0.75, 3, 3.25), body(p))


def hung():
    """The flat ball that hangs from the top rule of a Christmas list. The rule crosses one module down."""
    s = flat(1.5, 2.5, "ink"); s.ball(0.75, 2, 0.5, "cranberry")
    return art("xl-ball", (0, 0, 1.5, 2.5), body(s))


def switch():
    """The Christmas mode switch: a rail, and a ball on a plumb line that slides along it. Flat cranberry
    when off; when on, a second dot filled with gold glitter covers it."""
    r = flat(2, 2); r.seg(0.25, 0.5, 1.75, 0.5)
    b = flat(2, 2); b.hanger(0.75, 1.06, 0.44); b.circle(0.75, 1.5, 0.44, "cranberry")
    glit = f'<circle class="xglit" cx="{0.75 * M:g}" cy="{1.5 * M:g}" r="{0.44 * M:g}" fill="url(#xg-gold)"/>'
    return art("xsw", (0, 0, 2, 2), body(r), f'<g class="xball">{body(b)}{glit}</g>')


def favicon():
    s = Sheet(4, 4, 45, name="fgfav", textured=False)
    s.ground_line(3, 0.5, 3.5); s.standard(3, 2.25, 3.75)
    s.tri(1.5, 1, 2); s.ball(3, 1.5, 0.5, "cranberry")
    return s


def share():
    s = sheet("og-1200x630", name="fgshare")
    s.ground_line(15.5); s.standard(35, 12, 19.5)
    s.tiers(28.5, 15.5, 11, 4); s.bauble(35, 6.5, 3)
    s.strand((19, 0.8), (29, 14.5), (40, 9.2), 21, r_min=0.1, r_swell=0.36)
    s.facts(KICK, 2, 2.4); s.headline(HEAD, 2, 6.5, size=5, advance=4.5)
    s.lockup(2, 17.2, 3, asset="Acronym-Black.svg")
    s.facts("tribes.thefai.org/christmas", 34, 18.4, anchor="end")
    return s


def card():
    """The ground of the quiz result card: its left 19 modules. The page draws the avatar, the type and the plate."""
    s = sheet("og-1200x630", name="fgcard")
    s.ground_line(13.5, 1, 18); s.standard(15.5, 10.5, 15.5)
    s.bauble(15.5, 4.5, 1.5)
    s.lockup(2, 18.2, 5)
    return s


def between(html, marker, content):
    pat = re.compile(rf"(<!-- {marker}:start -->).*?(<!-- {marker}:end -->)", re.S)
    if not pat.search(html):
        sys.exit(f"{marker} markers not found in index.html")
    return pat.sub(lambda m: m.group(1) + content + m.group(2), html)


def inline():
    tpl = lambda i, c: f'<template id="xa-{i}">{c}</template>'
    covers = (cover(18, 10, (12.5, 9, 5.5, 3), (15.5, 3.5, 1.5), (15.5, 6, 10), ((11, 0), (12.8, 9.8), (18, 6.3), 19, 0.06, 0.22), (10, 0, 8, 10), "xa-wide")
              + cover(13, 16, (7.5, 6, 4.5, 3), (11, 3, 1), (11, 5, 16), ((3.6, 2.6), (8, 7.4), (13, 4.9), 17, 0.06, 0.2), (3, 0, 10, 16), "xa-phone"))
    arts = "".join([tpl("cover", covers), tpl("tier0", tier("gift")), tpl("tier1", tier("coupe")), tpl("tier2", tier("house")),
                    tpl("finale", finale()), tpl("hung", hung())])
    path = os.path.join(ROOT, "index.html")
    html = open(path, encoding="utf-8").read()
    html = between(between(html, "xmas-art", arts), "xmas-switch", switch())
    open(path, "w", encoding="utf-8").write(html)
    open(os.path.join(ROOT, "favicon-christmas.svg"), "w", encoding="utf-8").write(favicon().svg() + "\n")
    print("inline art and favicon-christmas.svg")


CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def shoot(s, out):
    """Render a kit sheet to a PNG at 2x in headless Chrome, which has the paper and print textures."""
    svg = s.svg().replace('"../assets', f'"file://{KIT}/assets')
    w, h = (int(float(v)) for v in re.search(r'width="([\d.]+)" height="([\d.]+)"', svg).groups())
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write('<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=block">'
                f'<body style="margin:0">{svg}</body>')
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--force-device-scale-factor=2",
                    f"--window-size={w},{h}", "--virtual-time-budget=5000", f"--screenshot={out}", "file://" + f.name],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(f.name)


def rasters():
    from PIL import Image, ImageChops, ImageDraw
    os.makedirs(os.path.join(ROOT, "xmas"), exist_ok=True)
    out = lambda n: os.path.join(ROOT, n)
    tmp = tempfile.mkdtemp()
    px = 2400 / (GLITTER * M)                       # glitter photograph pixels per CSS pixel at the page module
    # Gold: one tile of the glitter photograph at the kit's flake size.
    gold = Image.open(f"{KIT}/assets/glitter-gold.jpg").convert("RGB")
    side = round(TILE * px)
    gold.crop((600, 500, 600 + side, 500 + side)).resize((TILE * 2, TILE * 2), Image.LANCZOS).save(out("xmas/glitter-gold.webp"), quality=74, method=6)
    # The bauble: the kit's red glitter (its luminance sheet over the red base, overlay 0.7 then multiply 0.2), as a disc.
    r, n = 1.5 * M, 360
    lum = Image.open(f"{KIT}/assets/glitter-lum.jpg").convert("RGB")
    x0, y0 = 80 * M / 48 * px, 60 * M / 48 * px
    lum = lum.crop((round(x0), round(y0), round(x0 + 2 * r * px), round(y0 + 2 * r * px))).resize((n, n), Image.LANCZOS)
    red = Image.new("RGB", (n, n), GLITTER_RED)
    red = Image.blend(red, ImageChops.overlay(red, lum), 0.7)
    red = Image.blend(red, ImageChops.multiply(red, lum), 0.2)
    mask = Image.new("L", (n * 4, n * 4), 0); ImageDraw.Draw(mask).ellipse((0, 0, n * 4 - 1, n * 4 - 1), fill=255)
    red.putalpha(mask.resize((n, n), Image.LANCZOS)); red.save(out("xmas/bauble.webp"), quality=80, method=6)
    # The link preview, the result card's ground and the favicon PNGs.
    shoot(share(), f"{tmp}/share.png")
    Image.open(f"{tmp}/share.png").convert("RGB").resize((1200, 630), Image.LANCZOS).save(out("og-christmas.jpg"), quality=88, optimize=True)
    shoot(card(), f"{tmp}/card.png")
    Image.open(f"{tmp}/card.png").convert("RGB").resize((1200, 630), Image.LANCZOS).crop((0, 0, 570, 630)).save(out("xmas/card.jpg"), quality=86, optimize=True)
    shoot(favicon(), f"{tmp}/fav.png")
    fav = Image.open(f"{tmp}/fav.png").convert("RGB")
    fav.resize((32, 32), Image.LANCZOS).save(out("favicon-christmas-32.png"), optimize=True)
    fav.resize((180, 180), Image.LANCZOS).save(out("apple-touch-icon-christmas.png"), optimize=True)
    print("og-christmas.jpg, favicon PNGs, xmas/glitter-gold.webp, xmas/bauble.webp, xmas/card.jpg")


if __name__ == "__main__":
    inline()
    if "--rasters" in sys.argv:
        rasters()
