#!/usr/bin/env python3
"""Generate blueprint-style linework SVGs for the portfolio.

Everything strokes in currentColor so one file themes for light AND dark.
Subject matter is Rishab's actual research: wavelet subband decomposition
of an X-ray signal. Math-generated => precise plotter look, not wobbly.
"""
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "art")
os.makedirs(OUT, exist_ok=True)

def f(x):  # short floats, keeps files small
    return f"{x:.2f}".rstrip("0").rstrip(".")

def poly(pts, w=0.7, op=1.0, dash=None):
    d = "M" + " L".join(f"{f(x)},{f(y)}" for x, y in pts)
    a = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" stroke-width="{w}" opacity="{op}"{a}/>'

def line(x1, y1, x2, y2, w=0.7, op=1.0, dash=None):
    return poly([(x1, y1), (x2, y2)], w, op, dash)

def circle(cx, cy, r, w=0.7, op=1.0):
    return (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" '
            f'stroke-width="{w}" opacity="{op}" fill="none"/>')

def label(x, y, t, size=5.2, op=0.75, anchor="start"):
    return (f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" opacity="{op}" '
            f'text-anchor="{anchor}" font-family="ui-monospace,monospace" '
            f'stroke="none" fill="currentColor" letter-spacing="0.4">{t}</text>')

def wave(x0, y0, w, h, fn, n=150):
    """Sample fn(t in 0..1) -> -1..1 into a polyline."""
    return [(x0 + w * i / (n - 1), y0 - h * fn(i / (n - 1))) for i in range(n)]

def dim(x, y1, y2, t):
    """Vertical dimension line with arrowheads + label."""
    o = [line(x, y1, x, y2, 0.5, 0.5)]
    for yy, s in ((y1, 1), (y2, -1)):
        o.append(poly([(x - 1.6, yy + 2.4 * s), (x, yy), (x + 1.6, yy + 2.4 * s)], 0.5, 0.5))
    o.append(label(x + 3, (y1 + y2) / 2 + 1.8, t, 4.6, 0.5))
    return o


# ── HERO: spectral cascade ────────────────────────────────────────────
def hero():
    W, H = 340, 700
    o = []
    L, R = 34, 300           # plot bounds
    PW = R - L

    # ruler along the left edge
    for i in range(0, 69):
        y = 26 + i * 9.7
        if y > H - 18: break
        major = i % 5 == 0
        o.append(line(10, y, 10 + (7 if major else 3.5), y, 0.5, 0.45 if major else 0.22))
    o.append(line(10, 26, 10, H - 22, 0.5, 0.3))

    # source signal — sum of sines, the "raw X-ray scanline"
    src = lambda t: (0.62 * math.sin(t * 15.7) + 0.26 * math.sin(t * 41.3 + 1.1)
                     + 0.12 * math.sin(t * 88.0 + 0.4)) * (0.45 + 0.55 * math.sin(math.pi * t))
    y_src = 96
    o.append(label(L, y_src - 56, "RAW  SCANLINE", 6, 0.85))
    o.append(label(L, y_src - 47, "x[n]  ·  1024 px", 4.8, 0.45))
    for gx in range(9):                                    # vertical grid
        x = L + PW * gx / 8
        o.append(line(x, y_src - 40, x, y_src + 40, 0.4, 0.14, "1.5 3"))
    o.append(line(L, y_src, R, y_src, 0.45, 0.3, "2 3"))   # zero axis
    o.append(poly(wave(L, y_src, PW, 38, src), 0.85, 0.95))
    o.extend(dim(R + 8, y_src - 38, y_src + 38, "2A"))

    # decomposition bracket
    o.append(poly([(L + 6, y_src + 52), (L, y_src + 58), (L, y_src + 70),
                   (L + 6, y_src + 76)], 0.6, 0.5))
    o.append(label(L + 11, y_src + 68, "2D DWT  ·  db4", 5.4, 0.8))
    o.append(line(L + 74, y_src + 64, R, y_src + 64, 0.5, 0.25, "2 3"))

    # four subbands
    bands = [
        ("LL", "approximation", lambda t: 0.9 * math.sin(t * 6.2) * math.sin(math.pi * t)),
        ("LH", "horizontal",    lambda t: 0.55 * math.sin(t * 19.0) * math.sin(math.pi * t) ** 2),
        ("HL", "vertical",      lambda t: 0.42 * math.sin(t * 34.5 + 0.6) * math.sin(math.pi * t) ** 2),
        ("HH", "diagonal",      lambda t: 0.3 * math.sin(t * 61.0 + 1.2) * math.sin(math.pi * t) ** 3),
    ]
    y = 236
    for i, (nm, sub, fn) in enumerate(bands):
        amp = 26 - i * 2.5
        o.append(label(L, y - amp - 9, nm, 6.6, 0.9))
        o.append(label(L + 17, y - amp - 9, f"/ {sub}", 4.6, 0.42))
        o.append(line(L, y, R, y, 0.4, 0.22, "2 3"))
        o.append(poly(wave(L, y, PW, amp, fn), 0.75, 0.85 - i * 0.1))
        # frame corners only — lighter than a full box
        for cx, sx in ((L, 1), (R, -1)):
            for cy, sy in ((y - amp - 4, 1), (y + amp + 4, -1)):
                o.append(poly([(cx + sx * 7, cy), (cx, cy), (cx, cy + sy * 6)], 0.5, 0.3))
        y += 76

    # magnified callout on the HH band
    ccx, ccy = L + PW * 0.68, y - 76
    o.append(circle(ccx, ccy, 17, 0.6, 0.55))
    o.append(circle(ccx, ccy, 17.9, 0.4, 0.22))
    o.append(line(ccx + 12.5, ccy - 12.5, ccx + 34, ccy - 34, 0.5, 0.45))
    o.append(line(ccx + 34, ccy - 34, ccx + 52, ccy - 34, 0.5, 0.45))
    o.append(label(ccx + 36, ccy - 37, "σ = 0.041", 4.8, 0.6))
    o.append(line(ccx - 17, ccy, ccx + 17, ccy, 0.4, 0.3))   # crosshair
    o.append(line(ccx, ccy - 17, ccx, ccy + 17, 0.4, 0.3))

    # feature-fusion spectrum
    y_sp = 596
    o.append(label(L, y_sp - 46, "FUSED  FEATURE  MAP", 6, 0.85))
    o.append(line(L, y_sp, R, y_sp, 0.55, 0.4))
    nb = 42
    bw = PW / nb
    for i in range(nb):
        t = i / (nb - 1)
        h = 38 * abs(math.sin(t * 7.4) * math.cos(t * 2.1)) * (1 - 0.35 * t)
        x = L + i * bw
        o.append(poly([(x + 0.7, y_sp), (x + 0.7, y_sp - h),
                       (x + bw - 0.7, y_sp - h), (x + bw - 0.7, y_sp)],
                      0.5, 0.28 + 0.42 * (h / 38)))
    for i in range(0, nb, 7):                                # x ticks
        o.append(line(L + i * bw, y_sp, L + i * bw, y_sp + 3.5, 0.5, 0.35))
    o.append(label(L, y_sp + 14, "0", 4.4, 0.4))
    o.append(label(R, y_sp + 14, "1.0 kHz", 4.4, 0.4, "end"))
    o.append(label(R, y_sp - 46, "acc 92.22%", 5.2, 0.6, "end"))

    return svg(W, H, o)


# ── DECO: 2x2 subband grid, small, sits beside a section ──────────────
def deco():
    W, H = 132, 360
    o = []
    o.append(line(W / 2, 0, W / 2, 30, 0.5, 0.3, "2 3"))
    top = 40
    cell = 52
    # 2x2 quadrant grid with per-cell texture
    for r in range(2):
        for c in range(2):
            x, y = 14 + c * cell, top + r * cell
            o.append(poly([(x, y), (x + cell, y), (x + cell, y + cell),
                           (x, y + cell), (x, y)], 0.6, 0.45))
            freq = 3 + (r * 2 + c) * 5
            for i in range(1, 9):
                t = i / 9
                if (r + c) % 2 == 0:                        # horizontal texture
                    yy = y + cell * t
                    o.append(poly(wave(x + 2, yy, cell - 4, 2.4,
                                       lambda u, fq=freq: math.sin(u * fq + i), n=26), 0.4, 0.3))
                else:                                        # vertical texture
                    xx = x + cell * t
                    o.append(line(xx, y + 2, xx, y + cell - 2, 0.4, 0.22))
    for i, nm in enumerate(("LL", "LH", "HL", "HH")):
        o.append(label(16 + (i % 2) * cell, top + (i // 2) * cell + 8, nm, 5, 0.75))

    # dimension + descending detail ticks below
    o.extend(dim(W - 10, top, top + 2 * cell, "n/2"))
    y = top + 2 * cell + 26
    for i in range(22):
        w_ = 74 * (1 - i / 26)
        o.append(line(14, y, 14 + w_, y, 0.5, 0.3 - i * 0.008))
        y += 6.4
    o.append(label(14, y + 10, "residual", 4.8, 0.45))
    o.append(circle(W / 2, H - 14, 4.5, 0.5, 0.4))
    o.append(line(W / 2 - 7, H - 14, W / 2 + 7, H - 14, 0.4, 0.35))
    return svg(W, H, o)


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'fill="none" stroke="currentColor" stroke-linecap="round" '
            f'aria-hidden="true">\n' + "\n".join(body) + "\n</svg>\n")


for name, gen in (("hero", hero), ("deco", deco)):
    p = os.path.join(OUT, f"{name}.svg")
    open(p, "w").write(gen())
    print(f"{name}.svg  {os.path.getsize(p) // 1024}KB  {os.path.getsize(p)}B")
