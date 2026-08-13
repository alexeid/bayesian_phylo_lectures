"""Draw a simulated birth-death tree beside its reconstructed counterpart.

Panel A is the full tree: every lineage with no living descendant is grey
and ends in a cross. Panel B keeps only the black parts, which is what an
analysis of living species can see. Survivors hold the same vertical
position in both panels, so the second panel reads as the first with the
grey erased.

Writes figures/full_vs_reconstructed.svg.
"""
import random

LAM, MU, T = 1.0, 0.6, 4.2
SEED = 3
TIP_MIN, TIP_MAX = 10, 14
EXT_MIN = 8          # extinct tips, so the hidden half is visible


def simulate_bd(lam, mu, T):
    """Forward birth-death. Lineage = [t_start, t_end, parent, extant]."""
    lin = [[0.0, None, -1, False]]
    alive = [0]
    t = 0.0
    rate_tot = lam + mu
    while alive:
        k = len(alive)
        t += random.expovariate(k * rate_tot)
        if t >= T:
            for i in alive:
                lin[i][1] = T
                lin[i][3] = True
            return lin
        i = alive[random.randrange(k)]
        if random.random() < lam / rate_tot:
            lin[i][1] = t
            alive.remove(i)
            for _ in range(2):
                lin.append([t, None, i, False])
                alive.append(len(lin) - 1)
        else:
            lin[i][1] = t
            alive.remove(i)
    return None


def children(lin, keep):
    kids = {}
    for i, L in enumerate(lin):
        if keep[i] and L[2] >= 0:
            kids.setdefault(L[2], []).append(i)
    return kids


def tip_order(lin, keep):
    """Terminal lineages in depth-first order."""
    kids = children(lin, keep)
    out = []

    def walk(i):
        c = kids.get(i, [])
        if not c:
            out.append(i)
            return
        for j in c:
            walk(j)

    walk(0)
    return out


def draw(lin, keep, ys, x0, w, grey):
    """Rectangular cladogram. `ys` maps terminal lineage -> y pixel."""
    kids = children(lin, keep)

    def yof(i):
        c = kids.get(i, [])
        if not c:
            return ys[i]
        return sum(yof(j) for j in c) / len(c)

    def xof(t):
        return x0 + w * t / T

    pos = {i: yof(i) for i in range(len(lin)) if keep[i]}
    parts = []
    for i, L in enumerate(lin):
        if not keep[i]:
            continue
        dead = grey and not grey[i]
        col = "#c3c9d2" if dead else "#111827"
        parts.append(
            '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" '
            'stroke-width="%.1f" stroke-linecap="round"/>'
            % (xof(L[0]), pos[i], xof(L[1]), pos[i], col, 1.7 if dead else 2.4))
        c = kids.get(i, [])
        if c:
            lo, hi = min(pos[j] for j in c), max(pos[j] for j in c)
            live = [j for j in c if not grey or grey[j]]
            if live and not dead:
                # black connector spans the surviving children only
                blo = min(pos[j] for j in live)
                bhi = max(pos[j] for j in live)
                parts.append(
                    '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
                    'stroke="#c3c9d2" stroke-width="1.7"/>'
                    % (xof(L[1]), lo, xof(L[1]), hi))
                parts.append(
                    '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" '
                    'stroke="#111827" stroke-width="2.4"/>'
                    % (xof(L[1]), blo, xof(L[1]), bhi))
            else:
                parts.append(
                    '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" '
                    'stroke-width="%.1f"/>'
                    % (xof(L[1]), lo, xof(L[1]), hi, col, 1.7 if dead else 2.4))
        elif L[3]:
            parts.append('<circle cx="%.1f" cy="%.1f" r="4" fill="#111827"/>'
                         % (xof(L[1]), pos[i]))
        else:
            cx, cy, r = xof(L[1]), pos[i], 3.6
            parts.append(
                '<path d="M%.1f %.1f L%.1f %.1f M%.1f %.1f L%.1f %.1f" '
                'stroke="%s" stroke-width="1.8" stroke-linecap="round"/>'
                % (cx - r, cy - r, cx + r, cy + r, cx - r, cy + r, cx + r,
                   cy - r, "#aab1bb" if dead else "#111827"))
    return "\n".join(parts)


random.seed(SEED)
while True:
    lin = simulate_bd(LAM, MU, T)
    if lin is None:
        continue
    ext = sum(1 for L in lin if L[3])
    dead_tips = sum(1 for i, L in enumerate(lin)
                    if not L[3] and not any(x[2] == i for x in lin))
    if TIP_MIN <= ext <= TIP_MAX and dead_tips >= EXT_MIN:
        break

# lineages with at least one living descendant
he = [L[3] for L in lin]
for i in range(len(lin) - 1, -1, -1):
    if he[i] and lin[i][2] >= 0:
        he[lin[i][2]] = True

W, H = 1240.0, 500.0
PW, PH = 545.0, 350.0
LX, RX = 46.0, 664.0
TY = 78.0

order = tip_order(lin, [True] * len(lin))
dy = PH / max(len(order) - 1, 1)
ys = {node: TY + k * dy for k, node in enumerate(order)}

full = draw(lin, [True] * len(lin), ys, LX, PW, he)
recon = draw(lin, he, ys, RX, PW, None)

n_ext = sum(1 for L in lin if L[3])
n_tips = len(order)


def axis(x0):
    y = TY + PH + 30
    p = ['<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#94a3b8" '
         'stroke-width="1.4"/>' % (x0, y, x0 + PW, y)]
    for frac, lab, anc in ((0.0, "origin", "start"), (1.0, "present", "end")):
        x = x0 + PW * frac
        p.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#94a3b8" '
                 'stroke-width="1.4"/>' % (x, y, x, y + 7))
        p.append('<text x="%.1f" y="%.1f" text-anchor="%s" font-size="20" '
                 'fill="#64748b">%s</text>' % (x, y + 27, anc, lab))
    p.append('<text x="%.1f" y="%.1f" text-anchor="middle" font-size="20" '
             'fill="#64748b">time</text>' % (x0 + PW / 2, y + 27))
    return "\n".join(p)


svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W:.0f}" height="{H:.0f}" font-family="Helvetica, Arial, sans-serif">
<rect width="{W:.0f}" height="{H:.0f}" fill="#ffffff"/>
<text x="{LX + PW / 2:.0f}" y="36" text-anchor="middle" font-size="26" font-weight="700" fill="#c2410c">The full tree</text>
<text x="{LX + PW / 2:.0f}" y="61" text-anchor="middle" font-size="20" fill="#64748b">{n_tips - n_ext} of its {n_tips} lineages end before the present</text>
<text x="{RX + PW / 2:.0f}" y="36" text-anchor="middle" font-size="26" font-weight="700" fill="#1d4ed8">The reconstructed tree</text>
<text x="{RX + PW / 2:.0f}" y="61" text-anchor="middle" font-size="20" fill="#64748b">all that the {n_ext} living species can show</text>
{full}
{recon}
{axis(LX)}
{axis(RX)}
<line x1="{(LX + PW + RX) / 2:.0f}" y1="20" x2="{(LX + PW + RX) / 2:.0f}" y2="{H - 14:.0f}" stroke="#e2e8f0" stroke-width="2"/>
</svg>
'''

open('figures/full_vs_reconstructed.svg', 'w').write(svg)
print("%d lineages, %d tips, %d extant, %d extinct tips"
      % (len(lin), n_tips, n_ext, n_tips - n_ext))
