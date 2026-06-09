import random, math, json
random.seed(42)

# ---------- Reconstructed LTT under constant-rate birth-death ----------
def simulate_bd(lam, mu, T):
    """Forward birth-death (splitting convention). Returns list of lineages
       (t_start, t_end, parent_idx, extant) and child map."""
    lin = [[0.0, None, -1, False]]  # t_start, t_end, parent, extant
    alive = [0]
    t = 0.0
    rate_tot = lam + mu
    while alive:
        k = len(alive)
        t += random.expovariate(k * rate_tot)
        if t >= T:
            for i in alive:
                lin[i][1] = T; lin[i][3] = True
            return lin
        i = alive[random.randrange(k)]
        if random.random() < lam / rate_tot:      # speciation: i splits into 2
            lin[i][1] = t
            alive.remove(i)
            for _ in range(2):
                lin.append([t, None, i, False]); alive.append(len(lin)-1)
        else:                                      # extinction
            lin[i][1] = t; alive.remove(i)
    return None  # whole clade died

def recon_ltt(lam, mu, T, grid, n_keep=250, min_tips=5, max_try=20000):
    kept = 0; tries = 0
    acc = [0.0]*len(grid)
    while kept < n_keep and tries < max_try:
        tries += 1
        lin = simulate_bd(lam, mu, T)
        if lin is None: continue
        tips = sum(1 for L in lin if L[3])
        if tips < min_tips: continue
        # propagate has_extant up the ancestry (children created after parents)
        he = [L[3] for L in lin]
        for idx in range(len(lin)-1, -1, -1):
            if he[idx]:
                p = lin[idx][2]
                if p >= 0: he[p] = True
        # count reconstructed lineages crossing each grid time
        for gi, tau in enumerate(grid):
            c = 0
            for idx, L in enumerate(lin):
                if he[idx] and L[0] <= tau <= L[1]:
                    c += 1
            acc[gi] += c
        kept += 1
    return [a/kept for a in acc], kept

T = 8.0
G = 60
grid = [T*j/(G-1) for j in range(G)]
r = 0.5
eps_vals = [0.0, 0.5, 0.9]
ltt = {}
for eps in eps_vals:
    lam = r/(1-eps) if eps < 1 else r
    mu = eps*lam
    curve, kept = recon_ltt(lam, mu, T, grid)
    ltt['%.2f' % eps] = {'lam': round(lam,3), 'mu': round(mu,3),
                         'curve': [round(x,3) for x in curve], 'kept': kept}

# ---------- Yule realisations + expectation ----------
def yule_real(lam, T, kcap=3000):
    t = 0.0; k = 1; ts=[0.0]; ks=[1]
    while True:
        t += random.expovariate(k*lam)
        if t >= T or k >= kcap:
            ts.append(T); ks.append(k); break
        k += 1; ts.append(t); ks.append(k)
    return ts, ks

yule = {}
for lam in [0.3, 0.5, 0.8]:
    reals = [yule_real(lam, T) for _ in range(6)]
    exp_t = grid
    exp_n = [math.exp(lam*x) for x in grid]
    yule['%.1f' % lam] = {'reals': reals,
                          'exp': {'t': [round(x,3) for x in exp_t],
                                  'n': [round(x,3) for x in exp_n]}}

out = {'T': T, 'r': r, 'grid': [round(x,3) for x in grid],
       'ltt': ltt, 'yule': yule}
open('macro_data.json','w').write(json.dumps(out))

# sanity report
print("LTT reconstructed (mean lineages), near-present slope check:")
for eps in eps_vals:
    c = ltt['%.2f'%eps]['curve']
    deep = math.log(c[40]/c[20])/(grid[40]-grid[20]) if c[20]>0 else 0
    near = math.log(c[58]/c[50])/(grid[58]-grid[50]) if c[50]>0 else 0
    print("  eps=%.1f lam=%.2f mu=%.2f tips~%.1f deepslope=%.2f nearslope=%.2f kept=%d"
          % (eps, ltt['%.2f'%eps]['lam'], ltt['%.2f'%eps]['mu'], c[-1], deep, near, ltt['%.2f'%eps]['kept']))
