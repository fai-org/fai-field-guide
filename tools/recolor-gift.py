"""Reprint a gift picture in flat Christmas inks. The picture is enlarged four times, every pixel takes the
ink of the nearest of the picture's own colours, a majority filter clears the fringes that antialiasing leaves
between two inks, and the result is reduced again. gold='cream' prints tan and gold areas Cream; gold='glitter'
prints them with the glitter photograph. Gold is an accent: only saturated gold takes the glitter, and gold
narrower than about 6 px or smaller than MIN_GOLD prints Cream.

Usage: python3 tools/recolor-gift.py <original.webp> [out.webp]. Needs the private kit at ~/Developer/fai-christmas."""
import numpy as np, os, sys
from PIL import Image, ImageFilter
KIT = os.path.expanduser("~/Developer/fai-christmas")
INK, FIR, FIR2, CRAN, CRAN2, CREAM, LIGHT = "#1F201C", "#3C503A", "#253828", "#913129", "#6E211C", "#E9D7B6", "#F6E5C2"
h = lambda s: np.array([int(s[i:i + 2], 16) for i in (1, 3, 5)], float)
CLASSES = [INK, FIR, FIR2, CRAN, CRAN2, LIGHT, CREAM, "G"]
ANCH = [("#182018", INK), ("#101010", INK), ("#201818", INK), ("#385038", FIR), ("#384830", FIR), ("#22301f", FIR2), ("#a82820", CRAN), ("#8c1e16", CRAN2),
        ("#f4e8d6", LIGHT), ("#e8d8b6", CREAM), ("#e0c8a0", CREAM), ("#c49a48", "G"), ("#d2b072", CREAM), ("#bfa070", CREAM)]
K = 4
MIN_GOLD = 300   # smallest gold area kept, in original pixels
def recolor(src, gold="cream"):
    im = Image.open(src).convert("RGBA")
    W, H = im.size
    big = im.resize((W * K, H * K), Image.LANCZOS)
    a = np.asarray(big, np.float32); p = a[..., :3]
    d = np.stack([((p - h(s).astype(np.float32)) ** 2).sum(-1) for s, _ in ANCH])
    lab = np.array([CLASSES.index(t) for _, t in ANCH])[d.argmin(0)]
    # majority filter: the class with the largest share of a 9 x 9 window (about 2 px of the original)
    share = np.stack([np.asarray(Image.fromarray(((lab == c) * 255).astype("uint8")).filter(ImageFilter.BoxBlur(4)), np.float32) for c in range(len(CLASSES))])
    lab = share.argmax(0)
    gi = CLASSES.index("G"); g = lab == gi
    if g.any():
        from scipy import ndimage
        core = ndimage.binary_erosion(g, iterations=3 * K)          # survives only where gold is wider than ~6 px
        keep = ndimage.binary_dilation(core, iterations=3 * K) & g
        lbl, n = ndimage.label(keep); sizes = ndimage.sum(keep, lbl, range(1, n + 1))
        keep = np.isin(lbl, 1 + np.flatnonzero(sizes >= MIN_GOLD * K * K))
        lab[g & ~keep] = CLASSES.index(CREAM)
    glit = np.asarray(Image.open(KIT + "/assets/glitter-gold.jpg").convert("RGB").crop((200, 200, 200 + W * K, 200 + H * K)), np.float32)
    out = np.zeros_like(p)
    for c, t in enumerate(CLASSES):
        m = lab == c
        out[m] = (glit[m] if gold == "glitter" else h(CREAM)) if t == "G" else h(t)
    rgb = Image.fromarray(out.round().clip(0, 255).astype("uint8"), "RGB").resize((W, H), Image.LANCZOS)
    rgb.putalpha(im.getchannel("A"))
    return rgb
if __name__ == "__main__":
    src = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else src
    recolor(src, "glitter").save(out, "WEBP", quality=82, method=6, alpha_quality=90)
