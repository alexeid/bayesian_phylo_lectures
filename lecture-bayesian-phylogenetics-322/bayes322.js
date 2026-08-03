/* Interactive figures for the BIOSCI 322 Bayesian phylogenetics lecture.

   Three canvas widgets, all self-contained:
     1. bayesUpdate  - prior x likelihood -> posterior for an allele frequency
     2. mcmcLandscape - Metropolis sampling of a one-dimensional posterior
     3. treeMCMC      - Metropolis sampling over the 15 unrooted 5-taxon trees

   Canvases are used rather than Plotly because reveal.js hides slides until
   they are shown, and a canvas we size ourselves does not care. Each canvas is
   backed at 2x for crisp projection and scaled down with CSS. */

(function () {
    "use strict";

    var BLUE = "#1d4ed8", ORANGE = "#ea580c", GREEN = "#047857",
        RED = "#b91c1c", GREY = "#94a3b8", DARK = "#1f2937",
        LIGHTBLUE = "#dbeafe", LIGHTGREY = "#e5e7eb";

    var FONT = "Source Sans Pro, Helvetica, sans-serif";

    function ready(fn) {
        if (document.readyState !== "loading") { fn(); }
        else { document.addEventListener("DOMContentLoaded", fn); }
    }

    /* Set up a canvas at 2x backing resolution. Returns a context whose
       coordinate system is in CSS pixels. */
    function makeCanvas(id, w, h) {
        var c = document.getElementById(id);
        if (!c) return null;
        c.width = w * 2;
        c.height = h * 2;
        c.style.width = w + "px";
        c.style.height = h + "px";
        var ctx = c.getContext("2d");
        ctx.scale(2, 2);
        ctx.W = w; ctx.H = h; ctx.canvasEl = c;
        return ctx;
    }

    function clear(ctx) {
        ctx.clearRect(0, 0, ctx.W, ctx.H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, ctx.W, ctx.H);
    }

    function text(ctx, s, x, y, opts) {
        opts = opts || {};
        ctx.font = (opts.weight || "400") + " " + (opts.size || 13) + "px " + FONT;
        ctx.fillStyle = opts.color || DARK;
        ctx.textAlign = opts.align || "left";
        ctx.textBaseline = opts.baseline || "alphabetic";
        ctx.fillText(s, x, y);
    }

    function line(ctx, x1, y1, x2, y2, color, width, dash) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = color; ctx.lineWidth = width || 1;
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.restore();
    }

    /* Is this element on the slide reveal.js is currently showing? */
    function onCurrentSlide(el) {
        if (typeof Reveal === "undefined") return true;
        var s = Reveal.getCurrentSlide();
        return s ? s.contains(el) : false;
    }

    /* ================================================================
       1. Prior x likelihood -> posterior (beta-binomial)
       ================================================================ */

    function logGamma(z) {
        var c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
                 771.32342877765313, -176.61502916214059, 12.507343278686905,
                 -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        z -= 1;
        var x = c[0];
        for (var i = 1; i < 9; i++) x += c[i] / (z + i);
        var t = z + 7.5;
        return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
    }

    function betaPdf(x, a, b) {
        if (x <= 0 || x >= 1) return 0;
        var lb = logGamma(a) + logGamma(b) - logGamma(a + b);
        return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lb);
    }

    function initBayesUpdate() {
        var ctx = makeCanvas("buCanvas", 640, 400);
        if (!ctx) return;

        var elStrength = document.getElementById("buStrength"),
            elGuess = document.getElementById("buGuess"),
            elN = document.getElementById("buN"),
            elK = document.getElementById("buK");

        var NGRID = 401;

        function grid(f) {
            var v = [];
            for (var i = 0; i < NGRID; i++) v.push(f(i / (NGRID - 1)));
            return v;
        }
        function normalise(v) {
            var s = 0, dx = 1 / (NGRID - 1);
            for (var i = 0; i < NGRID; i++) s += v[i] * dx;
            if (s <= 0) return v;
            return v.map(function (y) { return y / s; });
        }

        function credibleInterval(dens) {
            var dx = 1 / (NGRID - 1), cum = 0, lo = 0, hi = 1, i;
            for (i = 0; i < NGRID; i++) {
                cum += dens[i] * dx;
                if (cum >= 0.025) { lo = i / (NGRID - 1); break; }
            }
            cum = 0;
            for (i = 0; i < NGRID; i++) {
                cum += dens[i] * dx;
                if (cum >= 0.975) { hi = i / (NGRID - 1); break; }
            }
            return [lo, hi];
        }

        function draw() {
            var s = +elStrength.value, m = +elGuess.value;
            var n = +elN.value, k = Math.min(+elK.value, n);
            if (+elK.value > n) { elK.value = n; }
            elK.max = n;

            document.getElementById("buStrengthVal").textContent = s;
            document.getElementById("buGuessVal").textContent = m.toFixed(2);
            document.getElementById("buNVal").textContent = n;
            document.getElementById("buKVal").textContent = k;

            var a0 = m * s + 1, b0 = (1 - m) * s + 1;
            var prior = normalise(grid(function (x) { return betaPdf(x, a0, b0); }));
            var lik = normalise(grid(function (x) {
                if (x <= 0 || x >= 1) return 0;
                return Math.exp(k * Math.log(x) + (n - k) * Math.log(1 - x));
            }));
            var post = normalise(grid(function (x) { return betaPdf(x, a0 + k, b0 + n - k); }));

            var ci = credibleInterval(post);

            clear(ctx);
            var L = 56, R = 626, T = 48, B = 286;
            var ymax = 0;
            [prior, lik, post].forEach(function (v) {
                v.forEach(function (y) { if (y > ymax) ymax = y; });
            });
            ymax *= 1.12;

            function px(x) { return L + x * (R - L); }
            function py(y) { return B - (y / ymax) * (B - T); }

            /* axes */
            line(ctx, L, B, R, B, DARK, 1.5);
            line(ctx, L, T, L, B, DARK, 1.5);
            for (var t = 0; t <= 1.0001; t += 0.2) {
                line(ctx, px(t), B, px(t), B + 5, DARK, 1.5);
                text(ctx, t.toFixed(1), px(t), B + 20, { align: "center", size: 12 });
            }
            text(ctx, "frequency of the allele in the population",
                 (L + R) / 2, B + 38, { align: "center", size: 13, weight: "600" });
            ctx.save();
            ctx.translate(18, (T + B) / 2);
            ctx.rotate(-Math.PI / 2);
            text(ctx, "plausibility", 0, 0, { align: "center", size: 12 });
            ctx.restore();

            /* 95% credible interval shading under the posterior */
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(px(ci[0]), B);
            for (var i = 0; i < NGRID; i++) {
                var x = i / (NGRID - 1);
                if (x < ci[0] || x > ci[1]) continue;
                ctx.lineTo(px(x), py(post[i]));
            }
            ctx.lineTo(px(ci[1]), B);
            ctx.closePath();
            ctx.fillStyle = LIGHTBLUE;
            ctx.fill();
            ctx.restore();

            function curve(v, color, width, dash) {
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash(dash || []);
                ctx.strokeStyle = color; ctx.lineWidth = width;
                for (var i = 0; i < NGRID; i++) {
                    var x = i / (NGRID - 1);
                    if (i === 0) ctx.moveTo(px(x), py(v[i])); else ctx.lineTo(px(x), py(v[i]));
                }
                ctx.stroke();
                ctx.restore();
            }
            curve(prior, GREY, 2, [6, 4]);
            curve(lik, ORANGE, 2);
            curve(post, BLUE, 3);

            /* credible interval bar */
            line(ctx, px(ci[0]), B + 76, px(ci[1]), B + 76, BLUE, 4);
            line(ctx, px(ci[0]), B + 70, px(ci[0]), B + 82, BLUE, 2);
            line(ctx, px(ci[1]), B + 70, px(ci[1]), B + 82, BLUE, 2);
            text(ctx, "95% credible interval:  " + ci[0].toFixed(2) + " to " + ci[1].toFixed(2),
                 (L + R) / 2, B + 64, { align: "center", size: 13, weight: "600", color: BLUE });

            /* legend */
            var lx = 66, ly = 26;
            line(ctx, lx, ly, lx + 26, ly, GREY, 2, [6, 4]);
            text(ctx, "prior (before the data)", lx + 32, ly + 4, { size: 12, color: GREY });
            lx = 250;
            line(ctx, lx, ly, lx + 26, ly, ORANGE, 2);
            text(ctx, "likelihood (the data alone)", lx + 32, ly + 4, { size: 12, color: ORANGE });
            lx = 466;
            line(ctx, lx, ly, lx + 26, ly, BLUE, 3);
            text(ctx, "posterior", lx + 32, ly + 4, { size: 12, color: BLUE, weight: "600" });
        }

        [elStrength, elGuess, elN, elK].forEach(function (el) {
            el.addEventListener("input", draw);
        });
        draw();
    }

    /* ================================================================
       2. MCMC on a one-dimensional landscape
       ================================================================ */

    function initMcmcLandscape() {
        var ctx = makeCanvas("mlCanvas", 640, 470);
        if (!ctx) return;

        var XMIN = 0, XMAX = 20, NBINS = 60;

        function gauss(x, mu, sd) {
            return Math.exp(-0.5 * Math.pow((x - mu) / sd, 2)) / sd;
        }
        var LANDSCAPES = {
            simple: function (x) {
                if (x < XMIN || x > XMAX) return 0;
                return 0.68 * gauss(x, 6.0, 1.2) + 0.32 * gauss(x, 9.2, 2.4);
            },
            twopeaks: function (x) {
                if (x < XMIN || x > XMAX) return 0;
                return 0.5 * gauss(x, 4.0, 0.75) + 0.5 * gauss(x, 15.5, 0.75);
            }
        };

        var state = {};
        function reset() {
            state.target = LANDSCAPES[document.getElementById("mlLandscape").value];
            state.x = 17.0;
            state.bins = new Array(NBINS).fill(0);
            state.n = 0; state.accepted = 0;
            state.last = null;
            state.showProposal = false;
            record(state.x);
            draw();
            updateReadout();
        }
        function record(x) {
            var b = Math.floor(((x - XMIN) / (XMAX - XMIN)) * NBINS);
            if (b < 0) b = 0; if (b >= NBINS) b = NBINS - 1;
            state.bins[b]++;
            state.n++;
        }

        function step() {
            var d = +document.getElementById("mlStep").value;
            var xNew = state.x + (Math.random() * 2 - 1) * d;
            var hOld = state.target(state.x), hNew = state.target(xNew);
            var ratio = hOld > 0 ? hNew / hOld : 1;
            var u = Math.random();
            var accept = (ratio >= 1) || (u < ratio);
            state.last = {
                xOld: state.x, xNew: xNew, hOld: hOld, hNew: hNew,
                ratio: ratio, u: u, accept: accept, auto: ratio >= 1
            };
            if (accept) { state.x = xNew; state.accepted++; }
            record(state.x);
        }

        /* ---- drawing ---- */
        var L = 56, R = 626, T1 = 48, B1 = 232, T2 = 300, B2 = 410;

        function px(x) { return L + ((x - XMIN) / (XMAX - XMIN)) * (R - L); }

        function draw() {
            clear(ctx);
            var f = state.target;

            /* top panel: the landscape */
            var hmax = 0, i, x;
            for (i = 0; i <= 400; i++) {
                x = XMIN + (i / 400) * (XMAX - XMIN);
                if (f(x) > hmax) hmax = f(x);
            }
            hmax *= 1.15;
            function py1(h) { return B1 - (h / hmax) * (B1 - T1); }

            ctx.beginPath();
            ctx.moveTo(px(XMIN), B1);
            for (i = 0; i <= 400; i++) {
                x = XMIN + (i / 400) * (XMAX - XMIN);
                ctx.lineTo(px(x), py1(f(x)));
            }
            ctx.lineTo(px(XMAX), B1);
            ctx.closePath();
            ctx.fillStyle = LIGHTBLUE; ctx.fill();
            ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.stroke();

            line(ctx, L, B1, R, B1, DARK, 1.5);
            text(ctx, "How good is each answer?  (the posterior)", L, T1 - 18,
                 { size: 14, weight: "600" });

            var last = state.last;
            /* While a proposal is on show, keep the walker drawn at the position
               it was standing on, so the move being decided is legible. */
            var walkerX = (last && state.showProposal) ? last.xOld : state.x;

            if (last && state.showProposal) {
                var col = last.accept ? GREEN : RED;
                line(ctx, px(last.xNew), py1(last.hNew), px(last.xNew), B1, col, 1.5, [5, 4]);
                ctx.beginPath();
                ctx.arc(px(last.xNew), py1(last.hNew), 8, 0, 2 * Math.PI);
                ctx.strokeStyle = col; ctx.lineWidth = 2.5;
                ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.stroke();
                text(ctx, last.accept ? "move here" : "stay put",
                     px(last.xNew), py1(last.hNew) - 14,
                     { align: "center", size: 12, weight: "700", color: col });
                /* arrow along the axis showing the proposed jump */
                var y = B1 + 16;
                line(ctx, px(last.xOld), y, px(last.xNew), y, col, 1.5,
                     last.accept ? [] : [4, 3]);
            }

            /* the walker */
            var hx = f(walkerX);
            line(ctx, px(walkerX), py1(hx), px(walkerX), B1, DARK, 1, [3, 3]);
            ctx.beginPath();
            ctx.arc(px(walkerX), py1(hx), 9, 0, 2 * Math.PI);
            ctx.fillStyle = DARK; ctx.fill();
            if (last && state.showProposal) {
                text(ctx, "you are here", px(walkerX), py1(hx) - 32,
                     { align: "center", size: 12, weight: "700", color: DARK });
            }

            /* bottom panel: where the walker has been */
            var bmax = 1;
            for (i = 0; i < NBINS; i++) if (state.bins[i] > bmax) bmax = state.bins[i];
            var bw = (R - L) / NBINS;
            for (i = 0; i < NBINS; i++) {
                var h = (state.bins[i] / bmax) * (B2 - T2);
                ctx.fillStyle = BLUE;
                ctx.fillRect(L + i * bw + 0.5, B2 - h, bw - 1, h);
            }
            /* the target, rescaled to the same peak, for comparison */
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([6, 4]);
            ctx.strokeStyle = DARK; ctx.lineWidth = 2;
            var scale = (B2 - T2) / (hmax / 1.15);
            for (i = 0; i <= 400; i++) {
                x = XMIN + (i / 400) * (XMAX - XMIN);
                var yy = B2 - f(x) * scale;
                if (i === 0) ctx.moveTo(px(x), yy); else ctx.lineTo(px(x), yy);
            }
            ctx.stroke();
            ctx.restore();

            line(ctx, L, B2, R, B2, DARK, 1.5);
            text(ctx, "Where the walker has spent its time  (" +
                 state.n.toLocaleString() + " steps)", L, T2 - 18, { size: 14, weight: "600" });
            text(ctx, "dashed line: the true posterior", R, T2 - 18,
                 { size: 12, align: "right", color: DARK });

            for (var t = 0; t <= 20.0001; t += 5) {
                line(ctx, px(t), B2, px(t), B2 + 5, DARK, 1.5);
                text(ctx, String(t), px(t), B2 + 20, { align: "center", size: 12 });
            }
            text(ctx, "age of the common ancestor (millions of years)",
                 (L + R) / 2, B2 + 40, { align: "center", size: 13, weight: "600" });
        }

        function fmt(v) { return (+v.toPrecision(3)).toString(); }

        function updateReadout() {
            var box = document.getElementById("mlReadout");
            var last = state.last;
            var rate = state.n > 1 ? (100 * state.accepted / (state.n - 1)) : 0;
            if (!last) {
                box.innerHTML = "<div style='opacity:0.6'>Press <b>Take one step</b> to " +
                    "make the first proposal.</div>";
            } else {
                var col = last.accept ? GREEN : RED;
                var decision = last.auto
                    ? "ratio is 1 or more &rarr; <b>always accept</b>"
                    : "spin a wheel: got " + fmt(last.u) +
                      (last.accept ? " &lt; " : " &gt; ") + fmt(last.ratio) +
                      " &rarr; <b>" + (last.accept ? "accept" : "reject") + "</b>";
                box.innerHTML =
                    "<div>Standing at <b>" + last.xOld.toFixed(2) + "</b>," +
                    " height " + fmt(last.hOld) + "</div>" +
                    "<div>Proposed <b>" + last.xNew.toFixed(2) + "</b>," +
                    " height " + fmt(last.hNew) + "</div>" +
                    "<div style='margin-top:0.35em'>height ratio = " + fmt(last.hNew) +
                    " / " + fmt(last.hOld) + " = <b>" + fmt(last.ratio) + "</b></div>" +
                    "<div>" + decision + "</div>" +
                    "<div style='margin-top:0.35em;color:" + col + ";font-weight:700'>" +
                    (last.accept ? "ACCEPTED - move" : "REJECTED - stay") + "</div>";
            }
            document.getElementById("mlStats").innerHTML =
                "steps: <b>" + state.n.toLocaleString() + "</b> &nbsp; " +
                "accepted: <b>" + rate.toFixed(0) + "%</b>";
        }

        /* ---- animation ---- */
        var running = false, acc = 0, lastTs = 0;
        function frame(ts) {
            if (!running) return;
            if (!onCurrentSlide(ctx.canvasEl)) { stop(); return; }
            if (!lastTs) lastTs = ts;
            var dt = ts - lastTs; lastTs = ts;
            var rate = +document.getElementById("mlSpeed").value;
            acc += (dt / 1000) * rate;
            var nsteps = Math.floor(acc);
            if (nsteps > 0) {
                acc -= nsteps;
                if (nsteps > 500) nsteps = 500;
                for (var i = 0; i < nsteps; i++) step();
                state.showProposal = rate <= 12;
                draw();
                updateReadout();
            }
            requestAnimationFrame(frame);
        }
        function start() {
            if (running) return;
            running = true; lastTs = 0; acc = 0;
            document.getElementById("mlRun").textContent = "Pause";
            requestAnimationFrame(frame);
        }
        function stop() {
            running = false;
            document.getElementById("mlRun").textContent = "Run";
        }

        document.getElementById("mlRun").addEventListener("click", function () {
            if (running) stop(); else start();
        });
        document.getElementById("mlStep").addEventListener("input", function () {
            document.getElementById("mlStepVal").textContent = (+this.value).toFixed(1);
        });
        document.getElementById("mlSpeed").addEventListener("input", function () {
            document.getElementById("mlSpeedVal").textContent = this.value;
        });
        document.getElementById("mlOne").addEventListener("click", function () {
            stop(); step(); state.showProposal = true; draw(); updateReadout();
        });
        document.getElementById("mlReset").addEventListener("click", function () {
            stop(); reset();
        });
        document.getElementById("mlLandscape").addEventListener("change", function () {
            stop(); reset();
        });

        reset();
    }

    /* ================================================================
       3. MCMC over the 15 unrooted 5-taxon trees
       ================================================================ */

    var TAXA = ["Human", "Chimp", "Gorilla", "Orangutan", "Gibbon"];
    var SHORT = ["Hu", "Ch", "Go", "Or", "Gi"];
    var NUC = ["A", "C", "G", "T"];

    /* 40 sites simulated under JC69 on ((Human,Chimp),Gorilla,(Orangutan,Gibbon))
       with every branch length 0.12 substitutions/site. */
    var ALIGNMENT = [
        "CATATATCTTACGTAGGTGCGCGCCGCAAAATTGATTTCA",
        "CATATATCTTACGTGGGAGCGTGGCTCAAAATTGATTTCA",
        "AATATATCTAACGTAGGAGGGCGGCACAAAATCGATTCCA",
        "AATAGTGCTGACGTAGTAGCGCGGCACAAACTTGATTGTA",
        "AATATATCTTCCGTAGCTGAGCGTCATAAAATTGATTGCA"
    ];
    var BRANCH_LENGTH = 0.12;

    /* -- topology representation: unrooted 5-taxon trees are all caterpillars,
          so a tree is a cherry, a middle leaf, and another cherry. -- */
    function canon(t) {
        var a = t.pairA.slice().sort(function (x, y) { return x - y; });
        var b = t.pairB.slice().sort(function (x, y) { return x - y; });
        if (a[0] > b[0]) { var s = a; a = b; b = s; }
        return { pairA: a, mid: t.mid, pairB: b };
    }
    function tkey(t) {
        var c = canon(t);
        return c.pairA.join(",") + "|" + c.mid + "|" + c.pairB.join(",");
    }
    function allTopologies() {
        var out = [], mid, j;
        for (mid = 0; mid < 5; mid++) {
            var rest = [0, 1, 2, 3, 4].filter(function (x) { return x !== mid; });
            for (j = 1; j < 4; j++) {
                var a = [rest[0], rest[j]];
                var b = rest.filter(function (x) { return a.indexOf(x) < 0; });
                out.push(canon({ pairA: a, mid: mid, pairB: b }));
            }
        }
        return out;
    }
    function toAdj(t) {
        var adj = {}, i;
        for (i = 0; i < 8; i++) adj[i] = [];
        function link(x, y) { adj[x].push(y); adj[y].push(x); }
        link(t.pairA[0], 5); link(t.pairA[1], 5); link(5, 6);
        link(t.mid, 6); link(6, 7);
        link(t.pairB[0], 7); link(t.pairB[1], 7);
        return adj;
    }
    function fromAdj(adj) {
        var cherries = [], mids = [];
        [5, 6, 7].forEach(function (n) {
            var nl = adj[n].filter(function (x) { return x < 5; }).length;
            if (nl === 2) cherries.push(n); else mids.push(n);
        });
        return canon({
            pairA: adj[cherries[0]].filter(function (x) { return x < 5; }),
            mid: adj[mids[0]].filter(function (x) { return x < 5; })[0],
            pairB: adj[cherries[1]].filter(function (x) { return x < 5; })
        });
    }
    /* Nearest-neighbour interchange: every 5-taxon tree has exactly four
       NNI neighbours, and the relation is symmetric, so the proposal needs
       no Hastings correction. */
    function nniNeighbours(t) {
        var base = toAdj(t), seen = {}, out = [];
        var edges = [];
        [5, 6, 7].forEach(function (x) {
            base[x].forEach(function (y) { if (y >= 5 && y > x) edges.push([x, y]); });
        });
        edges.forEach(function (e) {
            var x = e[0], y = e[1];
            base[x].filter(function (n) { return n !== y; }).forEach(function (p) {
                base[y].filter(function (n) { return n !== x; }).forEach(function (q) {
                    var adj = {}, k;
                    for (k in base) adj[k] = base[k].slice();
                    adj[x] = adj[x].map(function (n) { return n === p ? q : n; });
                    adj[y] = adj[y].map(function (n) { return n === q ? p : n; });
                    adj[p] = adj[p].map(function (n) { return n === x ? y : n; });
                    adj[q] = adj[q].map(function (n) { return n === y ? x : n; });
                    var nt = fromAdj(adj), kk = tkey(nt);
                    if (kk !== tkey(t) && !seen[kk]) { seen[kk] = 1; out.push(nt); }
                });
            });
        });
        return out;
    }

    /* -- JC69 likelihood by Felsenstein's pruning algorithm -- */
    function sitePatterns() {
        var counts = {}, i, j;
        for (i = 0; i < ALIGNMENT[0].length; i++) {
            var col = "";
            for (j = 0; j < 5; j++) col += ALIGNMENT[j][i];
            counts[col] = (counts[col] || 0) + 1;
        }
        return Object.keys(counts).map(function (k) {
            return { states: k.split(""), count: counts[k] };
        });
    }
    function logLikelihood(topo, patterns, bl) {
        var adj = toAdj(topo);
        var same = 0.25 + 0.75 * Math.exp(-4 * bl / 3);
        var diff = 0.25 - 0.25 * Math.exp(-4 * bl / 3);
        var lnL = 0;
        patterns.forEach(function (pat) {
            function prune(node, parent) {
                if (node < 5) {
                    var v = [0, 0, 0, 0];
                    v[NUC.indexOf(pat.states[node])] = 1;
                    return v;
                }
                var partial = [1, 1, 1, 1];
                adj[node].forEach(function (ch) {
                    if (ch === parent) return;
                    var cv = prune(ch, node);
                    for (var i = 0; i < 4; i++) {
                        var s = 0;
                        for (var j = 0; j < 4; j++) s += (i === j ? same : diff) * cv[j];
                        partial[i] *= s;
                    }
                });
                return partial;
            }
            var rv = prune(6, -1), l = 0;
            for (var i = 0; i < 4; i++) l += 0.25 * rv[i];
            lnL += pat.count * Math.log(l);
        });
        return lnL;
    }

    function initTreeMCMC() {
        var ctx = makeCanvas("tmCanvas", 640, 512);
        if (!ctx) return;

        var patterns = sitePatterns();
        var topos = allTopologies();
        var lls = topos.map(function (t) { return logLikelihood(t, patterns, BRANCH_LENGTH); });
        var mx = Math.max.apply(null, lls);
        var ws = lls.map(function (l) { return Math.exp(l - mx); });
        var z = ws.reduce(function (a, b) { return a + b; }, 0);
        var post = ws.map(function (w) { return w / z; });

        /* order the trees by posterior so the bar chart reads left to right */
        var order = topos.map(function (t, i) { return i; })
            .sort(function (a, b) { return post[b] - post[a]; });
        var trees = order.map(function (i) { return topos[i]; });
        var probs = order.map(function (i) { return post[i]; });
        var index = {};
        trees.forEach(function (t, i) { index[tkey(t)] = i; });

        /* exact support for the Human+Chimp split */
        var hcExact = 0;
        trees.forEach(function (t, i) {
            if (hasHC(t)) hcExact += probs[i];
        });
        function hasHC(t) {
            var c = canon(t);
            return (c.pairA[0] === 0 && c.pairA[1] === 1) ||
                   (c.pairB[0] === 0 && c.pairB[1] === 1);
        }

        var state = {};
        function reset() {
            state.cur = 14;            /* start from the worst tree */
            state.counts = new Array(15).fill(0);
            state.n = 0; state.accepted = 0; state.hc = 0;
            state.last = null;
            state.showProposal = false;
            recordState();
            draw(); updateReadout();
        }
        function recordState() {
            state.counts[state.cur]++;
            state.n++;
            if (hasHC(trees[state.cur])) state.hc++;
        }
        function step() {
            var nb = nniNeighbours(trees[state.cur]);
            var prop = index[tkey(nb[Math.floor(Math.random() * nb.length)])];
            var ratio = probs[prop] / probs[state.cur];
            var u = Math.random();
            var accept = (ratio >= 1) || (u < ratio);
            state.last = {
                from: state.cur, to: prop, ratio: ratio, u: u,
                accept: accept, auto: ratio >= 1
            };
            if (accept) { state.cur = prop; state.accepted++; }
            recordState();
        }

        /* -- draw one unrooted caterpillar in a box --
              The tree occupies the middle 60% of the box so that the taxon
              labels beyond each tip have room and cannot run into a
              neighbouring tree. -- */
        function drawTree(t, x0, y0, w, h, color) {
            var c = canon(t);
            var lx = x0 + 0.30 * w, mx2 = x0 + 0.50 * w, rx = x0 + 0.70 * w;
            var cy = y0 + 0.42 * h;
            var topY = y0 + 0.10 * h, botY = y0 + 0.74 * h;
            var tipLx = x0 + 0.22 * w, tipRx = x0 + 0.78 * w;
            var midY = y0 + 0.88 * h;

            function seg(x1, y1, x2, y2) { line(ctx, x1, y1, x2, y2, color, 2.5); }
            seg(lx, cy, rx, cy);
            seg(lx, cy, tipLx, topY);
            seg(lx, cy, tipLx, botY);
            seg(rx, cy, tipRx, topY);
            seg(rx, cy, tipRx, botY);
            seg(mx2, cy, mx2, midY);

            var o = { size: 12.5, weight: "600", color: DARK, baseline: "middle" };
            function lab(taxon, x, y, align) {
                var opt = {}; for (var k in o) opt[k] = o[k];
                opt.align = align;
                text(ctx, TAXA[taxon], x, y, opt);
            }
            lab(c.pairA[0], x0 + 0.20 * w, topY, "right");
            lab(c.pairA[1], x0 + 0.20 * w, botY, "right");
            lab(c.pairB[0], x0 + 0.80 * w, topY, "left");
            lab(c.pairB[1], x0 + 0.80 * w, botY, "left");
            lab(c.mid, mx2, midY + 12, "center");
        }

        function draw() {
            clear(ctx);
            var last = state.last;

            /* current and proposed trees, side by side */
            text(ctx, "Current tree", 158, 18, { size: 14, weight: "700", align: "center" });
            drawTree(trees[state.cur], 4, 28, 310, 150, BLUE);

            if (last && state.showProposal) {
                var col = last.accept ? GREEN : RED;
                text(ctx, "Proposed tree (one branch swap)", 482, 18,
                     { size: 14, weight: "700", align: "center", color: col });
                drawTree(trees[last.to], 326, 28, 310, 150, col);
                text(ctx, last.accept ? "ACCEPTED" : "REJECTED", 482, 208,
                     { size: 16, weight: "700", align: "center", color: col });
            } else {
                text(ctx, "Proposed tree", 482, 18,
                     { size: 14, weight: "700", align: "center", color: GREY });
                text(ctx, "(press a button to propose)", 482, 105,
                     { size: 13, align: "center", color: GREY });
            }
            line(ctx, 320, 12, 320, 214, LIGHTGREY, 1.5);

            /* bar chart of the 15 topologies */
            var L = 46, R = 624, T = 262, B = 400;
            var bw = (R - L) / 15;
            var pmax = Math.max.apply(null, probs) * 1.15;
            var fmax = 0, i;
            for (i = 0; i < 15; i++) fmax = Math.max(fmax, state.counts[i] / state.n);
            var scale = Math.max(pmax, fmax * 1.05);

            text(ctx, "All 15 possible trees, best to worst", L, T - 26,
                 { size: 14, weight: "700" });
            text(ctx, "outline: true posterior     bars: MCMC visits", R, T - 26,
                 { size: 12, align: "right" });

            for (i = 0; i < 15; i++) {
                var x = L + i * bw;
                var freq = state.counts[i] / state.n;
                var hf = (freq / scale) * (B - T);
                ctx.fillStyle = (i === state.cur) ? ORANGE : BLUE;
                ctx.fillRect(x + 4, B - hf, bw - 8, hf);
                var hp = (probs[i] / scale) * (B - T);
                ctx.save();
                ctx.strokeStyle = DARK; ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(x + 2, B - hp, bw - 4, hp);
                ctx.restore();
                text(ctx, String(i + 1), x + bw / 2, B + 16,
                     { align: "center", size: 11, color: i === state.cur ? ORANGE : DARK,
                       weight: i === state.cur ? "700" : "400" });
            }
            line(ctx, L, B, R, B, DARK, 1.5);
            text(ctx, "tree rank", (L + R) / 2, B + 34, { align: "center", size: 12 });

            /* the top three trees, named */
            for (i = 0; i < 3; i++) {
                var c = canon(trees[i]);
                var s = "tree " + (i + 1) + ":   (" + SHORT[c.pairA[0]] + "," + SHORT[c.pairA[1]] +
                        ") - " + SHORT[c.mid] + " - (" + SHORT[c.pairB[0]] + "," +
                        SHORT[c.pairB[1]] + ")      posterior " +
                        (probs[i] * 100).toFixed(0) + "%";
                text(ctx, s, L, B + 54 + i * 18,
                     { size: 12.5, color: i === state.cur ? ORANGE : DARK,
                       weight: i === state.cur ? "700" : "400" });
            }
        }

        function updateReadout() {
            var last = state.last, box = document.getElementById("tmReadout");
            if (!last) {
                box.innerHTML = "<div style='opacity:0.6'>The chain starts on the " +
                    "<i>worst</i> tree. Press <b>Take one step</b>.</div>";
            } else {
                var col = last.accept ? GREEN : RED;
                var decision = last.auto
                    ? "ratio is 1 or more &rarr; <b>always accept</b>"
                    : "spin a wheel: got " + last.u.toFixed(3) +
                      (last.accept ? " &lt; " : " &gt; ") + last.ratio.toFixed(3) +
                      " &rarr; <b>" + (last.accept ? "accept" : "reject") + "</b>";
                box.innerHTML =
                    "<div>tree " + (last.from + 1) + " score " +
                        (probs[last.from] * 100).toFixed(1) + "%</div>" +
                    "<div>tree " + (last.to + 1) + " score " +
                        (probs[last.to] * 100).toFixed(1) + "%</div>" +
                    "<div style='margin-top:0.35em'>ratio = <b>" +
                        last.ratio.toFixed(3) + "</b></div>" +
                    "<div>" + decision + "</div>" +
                    "<div style='margin-top:0.35em;color:" + col + ";font-weight:700'>" +
                        (last.accept ? "ACCEPTED - move" : "REJECTED - stay") + "</div>";
            }
            var rate = state.n > 1 ? (100 * state.accepted / (state.n - 1)) : 0;
            document.getElementById("tmStats").innerHTML =
                "steps: <b>" + state.n.toLocaleString() + "</b> &nbsp; accepted: <b>" +
                rate.toFixed(0) + "%</b>";
            document.getElementById("tmClade").innerHTML =
                "Trees sampled with <b>Human+Chimp</b> together:<br>" +
                "<span style='font-size:1.5em;font-weight:700;color:" + BLUE + "'>" +
                (100 * state.hc / state.n).toFixed(1) + "%</span>" +
                "<span style='opacity:0.7'> &nbsp;(exact: " +
                (100 * hcExact).toFixed(1) + "%)</span>";
        }

        var running = false, acc = 0, lastTs = 0;
        function frame(ts) {
            if (!running) return;
            if (!onCurrentSlide(ctx.canvasEl)) { stop(); return; }
            if (!lastTs) lastTs = ts;
            var dt = ts - lastTs; lastTs = ts;
            var rate = +document.getElementById("tmSpeed").value;
            acc += (dt / 1000) * rate;
            var nsteps = Math.floor(acc);
            if (nsteps > 0) {
                acc -= nsteps;
                if (nsteps > 500) nsteps = 500;
                for (var i = 0; i < nsteps; i++) step();
                state.showProposal = true;
                draw(); updateReadout();
            }
            requestAnimationFrame(frame);
        }
        function start() {
            if (running) return;
            running = true; lastTs = 0; acc = 0;
            document.getElementById("tmRun").textContent = "Pause";
            requestAnimationFrame(frame);
        }
        function stop() {
            running = false;
            document.getElementById("tmRun").textContent = "Run";
        }

        document.getElementById("tmRun").addEventListener("click", function () {
            if (running) stop(); else start();
        });
        document.getElementById("tmOne").addEventListener("click", function () {
            stop(); step(); state.showProposal = true; draw(); updateReadout();
        });
        document.getElementById("tmReset").addEventListener("click", function () {
            stop(); reset();
        });
        document.getElementById("tmSpeed").addEventListener("input", function () {
            document.getElementById("tmSpeedVal").textContent = this.value;
        });

        reset();
    }

    ready(function () {
        try { initBayesUpdate(); } catch (e) { console.error("bayesUpdate", e); }
        try { initMcmcLandscape(); } catch (e) { console.error("mcmcLandscape", e); }
        try { initTreeMCMC(); } catch (e) { console.error("treeMCMC", e); }
    });
})();
