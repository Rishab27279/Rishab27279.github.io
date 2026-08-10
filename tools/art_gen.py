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


# ══════════════════════════════════════════════════════════════════
#  ROW THUMBNAILS — one per row, revealed on hover.
#  Far sparser than the hero: these render ~120px wide, so anything
#  denser than ~40 elements turns to mush.
# ══════════════════════════════════════════════════════════════════
RW, RH = 130, 104          # shared viewBox for every thumbnail

def arc(cx, cy, rx, ry, a0, a1, n=28):
    """Points along an ellipse arc, angles in radians."""
    return [(cx + rx * math.cos(a0 + (a1 - a0) * i / (n - 1)),
             cy + ry * math.sin(a0 + (a1 - a0) * i / (n - 1))) for i in range(n)]

def blob(cx, cy, r, mods, n=64):
    """Closed organic contour. mods = [(amplitude, frequency, phase), ...]"""
    pts = []
    for i in range(n + 1):
        a = 2 * math.pi * i / n
        rr = r * (1 + sum(m[0] * math.sin(m[1] * a + m[2]) for m in mods))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts

def corners(x, y, w, h, op=.34):
    """Four corner ticks — lighter than a full box."""
    o = []
    for cx, sx in ((x, 1), (x + w, -1)):
        for cy, sy in ((y, 1), (y + h, -1)):
            o.append(poly([(cx + sx * 8, cy), (cx, cy), (cx, cy + sy * 7)], .5, op))
    return o

def bars(x, y, w, h, n, fn, op=.55):
    bw = w / n
    return [poly([(x + i * bw + .6, y), (x + i * bw + .6, y - h * fn(i / (n - 1))),
                  (x + (i + 1) * bw - .6, y - h * fn(i / (n - 1))),
                  (x + (i + 1) * bw - .6, y)], .5, op) for i in range(n)]

def quad(x, y, s, op=.5):
    """2x2 wavelet grid, each cell textured differently."""
    o = [poly([(x, y), (x + s, y), (x + s, y + s), (x, y + s), (x, y)], .6, op),
         line(x + s / 2, y, x + s / 2, y + s, .5, op * .7),
         line(x, y + s / 2, x + s, y + s / 2, .5, op * .7)]
    h = s / 2
    for r in range(2):
        for c in range(2):
            ox, oy = x + c * h, y + r * h
            if r == 0 and c == 0:                      # LL — smooth
                o.append(poly(wave(ox + 2, oy + h / 2, h - 4, 3,
                                   lambda t: math.sin(t * 3), n=18), .45, .5))
            elif r == 0:                               # LH — horizontal
                for i in range(1, 4):
                    o.append(line(ox + 2, oy + i * h / 4, ox + h - 2, oy + i * h / 4, .4, .38))
            elif c == 0:                               # HL — vertical
                for i in range(1, 4):
                    o.append(line(ox + i * h / 4, oy + 2, ox + i * h / 4, oy + h - 2, .4, .38))
            else:                                      # HH — diagonal
                for i in range(1, 4):
                    o.append(line(ox + 1, oy + i * h / 4, ox + i * h / 4, oy + 1, .4, .38))
    return o

def phone(x, y, w, h, op=.55):
    r = 5
    o = [f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{r}" '
         f'stroke-width="0.7" opacity="{op}" fill="none"/>',
         line(x + w * .38, y + 3, x + w * .62, y + 3, .6, op * .8),      # speaker
         f'<rect x="{f(x + 4)}" y="{f(y + 7)}" width="{f(w - 8)}" height="{f(h - 14)}" '
         f'stroke-width="0.4" opacity="{op * .5}" fill="none"/>']
    return o

def trace_stack(x, y, w, rows, gap=17, op=.6):
    """Stacked labelled signal traces. rows = [(label, fn), ...]"""
    o = []
    for i, (nm, fn) in enumerate(rows):
        yy = y + i * gap
        o.append(line(x, yy, x + w, yy, .4, .22, "2 3"))
        o.append(poly(wave(x, yy, w, gap * .38, fn, n=44), .65, op - i * .06))
        o.append(label(x - 3, yy + 1.6, nm, 4.4, .55, "end"))
    return o


def a_flam():          # talking-head avatar — wireframe mesh on a face
    o, cx, cy, RX, RY = [], 62, 46, 22, 29

    def surf(u, v):
        """Point on a face-ish ellipsoid. u across (-1..1), v down (-1..1).
        Chin tapers, forehead is wider — that read is what makes it a face."""
        taper = 1 - .30 * max(0.0, v) ** 2
        return (cx + RX * u * taper * math.sqrt(max(0.0, 1 - v * v * .35)),
                cy + RY * v)

    o.append(poly([surf(math.sin(a), -math.cos(a))                    # outline
                   for a in [2 * math.pi * i / 60 for i in range(61)]], .8, .62))
    for v in (-.62, -.3, 0, .3, .58, .8):                             # latitude
        o.append(poly([surf(u / 10, v) for u in range(-10, 11)], .38, .3))
    for u in (-.72, -.36, 0, .36, .72):                               # longitude
        o.append(poly([surf(u, v / 10) for v in range(-9, 10)], .38, .3))

    for u, v in ((-.42, -.18), (.42, -.18)):                          # eyes
        x, y = surf(u, v)
        o.append(poly(arc(x, y, 4.4, 2.2, math.pi, 2 * math.pi, 12), .55, .6))
        o.append(circle(x, y - .4, 1.2, .5, .55))
    o.append(poly([surf(0, -.05), surf(-.1, .2), surf(.1, .2)], .5, .5))   # nose
    x, y = surf(0, .42)                                                # mouth
    o.append(poly(arc(x, y - 2, 6.4, 3.6, .5, math.pi - .5, 14), .65, .65))
    o.extend(corners(30, 10, 64, 74, .3))
    o.append(label(24, 98, "landmarks / 68", 4.4, .5))
    return svg(RW, RH, o)

def a_hamad():         # triage queue + vitals trace
    o = []
    for i in range(4):                                   # queue, shortening
        y = 20 + i * 9
        o.append(poly([(16, y), (16 + 46 - i * 9, y)], 1.4, .5 - i * .08))
        o.append(circle(11, y, 2.4, .5, .55))
    o.append(poly([(70, 18), (76, 18), (76, 51), (70, 51)], .5, .35))
    o.append(label(80, 22, "triage", 4.4, .55))
    ecg = lambda t: (math.exp(-((t % .34 - .17) * 26) ** 2) * 1.0
                     - .28 * math.exp(-((t % .34 - .11) * 40) ** 2))
    o.append(line(16, 74, 114, 74, .4, .22, "2 3"))
    o.append(poly(wave(16, 74, 98, 16, ecg, n=110), .7, .65))
    o.append(label(16, 96, "vitals", 4.4, .5))
    o.extend(corners(10, 12, 108, 74, .28))
    return svg(RW, RH, o)

def a_bits():          # wavelet quad grid + descending detail
    o = quad(16, 16, 56)
    o.extend(dim(80, 16, 72, "n/2"))
    for i in range(9):
        o.append(line(16, 80 + i * 2.4, 16 + 56 * (1 - i / 11), 80 + i * 2.4, .45, .34 - i * .028))
    o.append(label(100, 22, "2DDWT", 4.4, .55))
    return svg(RW, RH, o)

def a_igcar():         # camouflaged object — faint ground, picked-out edge
    o, cx, cy = [], 62, 48
    target = blob(cx, cy, 22, [(.14, 3, .5), (-.08, 5, 2.0), (.05, 7, 1.2)])
    for i in range(9):                                   # background clutter
        b = blob(20 + i * 12, 20 + (i * 29) % 60, 9 + (i % 3) * 3,
                 [(.2, 3, i), (.1, 5, i * .7)], n=26)
        o.append(poly(b, .4, .12))
    o.append(poly(target, .95, .7))                      # the found object
    o.append(poly([(p[0], p[1]) for p in target[::4]], .4, .3, "1 2"))
    o.append(circle(cx, cy, 30, .5, .3))
    o.append(line(cx - 34, cy, cx - 26, cy, .5, .45))
    o.append(line(cx + 26, cy, cx + 34, cy, .5, .45))
    o.append(label(16, 96, "SAM / adapter", 4.4, .5))
    return svg(RW, RH, o)

def a_fourier():       # on-device DFT — phone with a spectrum inside
    o = phone(40, 8, 50, 84)
    o.extend(bars(46, 62, 38, 30, 13, lambda t: .25 + .75 * abs(math.sin(t * 5.6)) * (1 - .3 * t)))
    o.append(line(46, 62, 84, 62, .5, .5))
    o.append(poly(wave(46, 26, 38, 8, lambda t: math.sin(t * 13), n=40), .55, .5))
    o.append(line(46, 40, 84, 40, .4, .25, "2 2"))
    o.append(label(46, 78, "DFT", 4.4, .6))
    o.append(label(8, 26, "88.41%", 4.6, .55))
    o.append(line(8, 30, 34, 30, .5, .3))
    o.append(label(8, 70, "edge", 4.4, .5))
    return svg(RW, RH, o)

def a_multifreq():     # four subbands fusing into one vector
    o = trace_stack(30, 20, 58, [
        ("LL", lambda t: math.sin(t * 4)),
        ("LH", lambda t: .7 * math.sin(t * 11)),
        ("HL", lambda t: .55 * math.sin(t * 21 + .5)),
        ("HH", lambda t: .4 * math.sin(t * 37 + 1)),
    ])
    for i in range(4):                                   # fan into the fusion bar
        o.append(line(90, 20 + i * 17, 104, 45, .4, .3))
    o.append(poly([(104, 30), (110, 30), (110, 60), (104, 60)], .55, .5))
    o.append(label(96, 74, "fuse", 4.4, .55, "middle"))
    o.extend(corners(14, 10, 102, 76, .26))
    return svg(RW, RH, o)

def a_chest():         # chest film — two lungs, one with a flagged opacity
    o, cx, top, bot = [], 62, 20, 78

    def lung(s):
        """Half a lung: narrow apex, wide base, flat edge against the heart."""
        outer = [(cx + s * (6 + 17 * math.sin(math.pi * t ** .72) ** .8),
                  top + (bot - top) * t) for t in [i / 26 for i in range(27)]]
        inner = [(cx + s * (5 + 4.5 * math.sin(math.pi * t)), top + (bot - top) * t)
                 for t in [i / 14 for i in range(15)]][::-1]
        return outer + inner + [outer[0]]

    o.append(line(cx, 12, cx, top + 6, .7, .5))                        # trachea
    for s in (-1, 1):
        o.append(line(cx, top + 6, cx + s * 7, top + 13, .6, .45))     # bronchi
        o.append(poly(lung(s), .8, .6))
    o.append(poly(arc(cx + 4, 62, 12, 13, math.pi * 1.05, math.pi * 2.1, 20), .5, .3))

    for i in range(7):                                                 # scan grid
        o.append(line(30, 22 + i * 9, 94, 22 + i * 9, .35, .13))
    for i in range(6):
        o.append(line(32 + i * 12, 18, 32 + i * 12, 80, .35, .13))

    fx, fy = cx - 15, 42                                               # flagged region
    o.append(circle(fx, fy, 8.5, .6, .6))
    o.append(circle(fx, fy, 10.4, .4, .28))
    for i in range(5):
        o.append(line(fx - 6 + i * 3, fy - 5.5, fx - 7.5 + i * 3, fy + 5.5, .4, .4))
    o.append(line(fx - 12, fy - 10, fx - 22, fy - 18, .5, .45))
    o.append(label(16, 20, "opacity", 4.4, .55))
    o.append(label(16, 96, "PN / TB", 4.4, .5))
    return svg(RW, RH, o)

def a_utube():         # film strip + audio track
    o = [f'<rect x="14" y="16" width="72" height="40" rx="2" '
         f'stroke-width="0.7" opacity="0.55" fill="none"/>']
    for i in range(6):                                   # sprockets
        for y in (19, 50):
            o.append(f'<rect x="{f(17 + i * 11.6)}" y="{y}" width="5" height="3.4" rx="1" '
                     f'stroke-width="0.4" opacity="0.4" fill="none"/>')
    o.append(poly([(38, 30), (52, 36), (38, 42), (38, 30)], .6, .6))   # play glyph
    o.append(label(94, 22, "video", 4.4, .55))
    o.append(label(94, 74, "audio", 4.4, .55))
    o.append(line(14, 74, 86, 74, .4, .22, "2 3"))
    o.append(poly(wave(14, 74, 72, 13,
                       lambda t: math.sin(t * 47) * (.35 + .65 * abs(math.sin(t * 6))), n=96), .6, .6))
    return svg(RW, RH, o)

def a_moody():         # three modalities converging
    o = trace_stack(34, 22, 52, [
        ("face",  lambda t: math.sin(t * 5) * .9),
        ("voice", lambda t: math.sin(t * 29) * (.4 + .6 * math.sin(t * 4))),
        ("text",  lambda t: (1 if int(t * 11) % 2 else -1) * .55),
    ], gap=20)
    for i in range(3):
        o.append(line(88, 22 + i * 20, 102, 42, .4, .32))
    o.append(circle(107, 42, 6.5, .6, .55))
    o.append(circle(107, 42, 8.4, .4, .25))
    o.append(label(107, 62, "mood", 4.4, .55, "middle"))
    return svg(RW, RH, o)

def a_edgeseg():       # segmentation mask, loaded a tile at a time
    o, x0, y0, c, n = [], 20, 16, 11.5, 7
    for r in range(6):
        for k in range(n):
            x, y = x0 + k * c, y0 + r * c
            inside = ((k - 3.2) / 3.1) ** 2 + ((r - 2.6) / 2.5) ** 2 < 1
            o.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(c)}" height="{f(c)}" '
                     f'stroke-width="0.35" opacity="{.4 if inside else .13}" fill="none"/>')
            if inside:                                   # hatch the mask
                o.append(line(x + 1.5, y + c - 1.5, x + c - 1.5, y + 1.5, .35, .3))
    o.append(label(20, 98, "sequential load", 4.4, .5))
    o.extend(dim(x0 + n * c + 5, y0, y0 + 6 * c, "1 blk"))
    return svg(RW, RH, o)

def a_osteo():         # knee joint inside a phone
    o = phone(38, 8, 54, 84)
    cx = 65
    o.append(poly(arc(cx, 40, 15, 12, .15, 2.99), .75, .6))           # femur condyles
    o.append(line(cx - 15, 40, cx - 13, 26, .6, .5))
    o.append(line(cx + 15, 40, cx + 13, 26, .6, .5))
    o.append(poly(arc(cx, 52, 13, 9, 3.29, 6.13), .75, .6))           # tibia plateau
    o.append(line(cx - 13, 52, cx - 11, 70, .6, .5))
    o.append(line(cx + 13, 52, cx + 11, 70, .6, .5))
    o.append(line(cx - 17, 46, cx + 17, 46, .4, .3, "2 2"))           # joint space
    for i in range(7):                                                # trabecular density
        o.append(line(cx - 9 + i * 3, 32, cx - 8 + i * 3, 38, .3, .3))
    o.append(label(8, 30, "T-score", 4.4, .55))
    o.append(line(8, 34, 32, 34, .5, .3))
    o.append(label(46, 82, "on-device", 4.2, .5))
    return svg(RW, RH, o)

def a_medmamba():      # state-space cascade
    o = []
    for i in range(4):
        x = 16 + i * 26
        o.append(f'<rect x="{f(x)}" y="34" width="17" height="17" rx="2" '
                 f'stroke-width="0.6" opacity="{.55 - i * .06}" fill="none"/>')
        o.append(label(x + 8.5, 45, "h", 5, .6, "middle"))
        if i < 3:
            o.append(line(x + 17, 42.5, x + 25, 42.5, .5, .4))
            o.append(poly([(x + 22.5, 40.8), (x + 25, 42.5), (x + 22.5, 44.2)], .5, .4))
        o.append(line(x + 8.5, 34, x + 8.5, 26, .45, .35))            # input tick
        o.append(circle(x + 8.5, 23, 1.8, .45, .45))
        o.append(line(x + 8.5, 51, x + 8.5, 59, .45, .35))            # output tick
    o.append(poly(arc(59, 34, 43, 16, 3.3, 6.12, 30), .4, .25, "2 2"))  # skip path
    o.append(label(16, 76, "selective scan", 4.4, .5))
    o.append(label(16, 96, "O(n)", 4.4, .45))
    return svg(RW, RH, o)


ROWS = {
    "flam": a_flam, "hamad": a_hamad, "bits": a_bits, "igcar": a_igcar,
    "fourier": a_fourier, "multifreq": a_multifreq, "chest": a_chest,
    "utube": a_utube, "moody": a_moody, "edgeseg": a_edgeseg, "osteo": a_osteo,
    "medmamba": a_medmamba,
}

if __name__ == "__main__":
    total = 0
    for name, gen in (("hero", hero), ("deco", deco), *ROWS.items()):
        p = os.path.join(OUT, f"{name}.svg")
        open(p, "w").write(gen())
        n = os.path.getsize(p)
        total += n
        print(f"{name:<10} {n:>6}B")
    print(f"{'total':<10} {total:>6}B")
