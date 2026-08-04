/* Interactive figures for the BIOSCI 322 coalescent lecture.

   Two canvas widgets:
     1. wfCoalescent  - Wright-Fisher population, trace a sample back to its
                        common ancestor, accumulate a distribution of TMRCA
     2. skyline       - choose a population history, simulate coalescent trees
                        under it, and read the history back off the trees

   Canvases are sized by us rather than measured, because reveal.js keeps
   slides hidden until they are shown. Backed at 2x for projection. */

(function () {
    "use strict";

    var BLUE = "#1d4ed8", ORANGE = "#ea580c", GREEN = "#047857",
        RED = "#b91c1c", GREY = "#94a3b8", DARK = "#1f2937",
        LIGHTBLUE = "#dbeafe", PALE = "#eef2ff";

    var FONT = "Source Sans Pro, Helvetica, sans-serif";

    function ready(fn) {
        if (document.readyState !== "loading") { fn(); }
        else { document.addEventListener("DOMContentLoaded", fn); }
    }

    function makeCanvas(id, w, h) {
        var c = document.getElementById(id);
        if (!c) return null;
        c.width = w * 2; c.height = h * 2;
        c.style.width = w + "px"; c.style.height = h + "px";
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

    function text(ctx, s, x, y, o) {
        o = o || {};
        ctx.font = (o.weight || "400") + " " + (o.size || 13) + "px " + FONT;
        ctx.fillStyle = o.color || DARK;
        ctx.textAlign = o.align || "left";
        ctx.textBaseline = o.baseline || "alphabetic";
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

    function onCurrentSlide(el) {
        if (typeof Reveal === "undefined") return true;
        var s = Reveal.getCurrentSlide();
        return s ? s.contains(el) : false;
    }

    /* ================================================================
       1. Wright-Fisher population and the coalescent
       ================================================================ */

    function initWF() {
        var ctx = makeCanvas("wfCanvas", 640, 430);
        if (!ctx) return;

        var elN = document.getElementById("wfN"),
            elK = document.getElementById("wfK");

        var MAXGEN = 4000;      /* simulate this far back if needed */
        var MAXDRAW = 46;       /* but only ever draw this many rows */

        var state = { tmrcas: [], gens: null, lineages: null, tmrca: 0 };

        /* One replicate: build parent assignments generation by generation,
           tracing only the ancestors of the sample until they all coalesce. */
        function simulate(N, k, keepGrid) {
            var sample = [];
            while (sample.length < k) {
                var i = Math.floor(Math.random() * N);
                if (sample.indexOf(i) < 0) sample.push(i);
            }
            sample.sort(function (a, b) { return a - b; });

            var grid = keepGrid ? [] : null;   /* grid[g][i] = parent index */
            var cur = sample.slice();          /* current ancestral lineages */
            var paths = keepGrid ? [cur.slice()] : null;
            var g = 0;
            while (cur.length > 1 && g < MAXGEN) {
                var parents = null;
                if (keepGrid && g < MAXDRAW) {
                    parents = [];
                    for (var i = 0; i < N; i++) parents.push(Math.floor(Math.random() * N));
                    grid.push(parents);
                }
                var next = [], seen = {};
                for (var j = 0; j < cur.length; j++) {
                    var p = parents ? parents[cur[j]] : Math.floor(Math.random() * N);
                    if (!seen[p]) { seen[p] = 1; next.push(p); }
                }
                cur = next;
                g++;
                if (paths && g <= MAXDRAW) paths.push(cur.slice());
            }
            return { tmrca: g, grid: grid, paths: paths, N: N };
        }

        function newSample() {
            var N = +elN.value, k = +elK.value;
            var r = simulate(N, k, true);
            state.gens = r;
            state.tmrca = r.tmrca;
            state.tmrcas.push(r.tmrca);
            draw();
        }

        function replicates(n) {
            var N = +elN.value, k = +elK.value;
            for (var i = 0; i < n; i++) state.tmrcas.push(simulate(N, k, false).tmrca);
            draw();
        }

        function reset() {
            state.tmrcas = [];
            newSample();
        }

        /* ---- drawing ---- */
        var GX = 46, GY = 62, GW = 300, GH = 330;
        var HX = 402, HY = 66, HW = 226, HH = 204;

        function draw() {
            clear(ctx);
            var N = +elN.value, k = +elK.value;
            var r = state.gens;
            if (!r) return;

            var rows = Math.min(r.tmrca + 1, MAXDRAW);
            var rowH = GH / Math.max(rows, 8);
            var colW = GW / N;

            text(ctx, "A Wright-Fisher population", GX, 18, { size: 14, weight: "700" });
            text(ctx, "each individual picks a parent at random",
                 GX, 33, { size: 11.5, color: GREY });
            /* legend, so nothing has to be labelled in the crowded grid */
            ctx.beginPath(); ctx.arc(GX + 5, GY - 14, 4.5, 0, 2 * Math.PI);
            ctx.fillStyle = BLUE; ctx.fill();
            text(ctx, "the sample and its ancestors", GX + 15, GY - 10,
                 { size: 11, color: BLUE });
            ctx.beginPath(); ctx.arc(GX + 196, GY - 14, 4.5, 0, 2 * Math.PI);
            ctx.fillStyle = ORANGE; ctx.fill();
            text(ctx, "a coalescence", GX + 206, GY - 10, { size: 11, color: ORANGE });

            /* time axis label */
            ctx.save();
            ctx.translate(16, GY + GH / 2);
            ctx.rotate(-Math.PI / 2);
            text(ctx, "generations into the past", 0, 0, { align: "center", size: 12 });
            ctx.restore();
            line(ctx, 26, GY + GH, 26, GY, DARK, 1.5);
            line(ctx, 26, GY, 30, GY + 6, DARK, 1.5);
            line(ctx, 26, GY, 22, GY + 6, DARK, 1.5);

            function px(i) { return GX + (i + 0.5) * colW; }
            function py(g) { return GY + GH - (g + 0.5) * rowH; }

            /* faint background: everybody's parent link */
            if (r.grid) {
                for (var g = 0; g < Math.min(r.grid.length, rows - 1); g++) {
                    for (var i = 0; i < N; i++) {
                        line(ctx, px(i), py(g), px(r.grid[g][i]), py(g + 1),
                             "#e5e7eb", 1);
                    }
                }
            }
            /* every individual as a small dot */
            for (var g2 = 0; g2 < rows; g2++) {
                for (var i2 = 0; i2 < N; i2++) {
                    ctx.beginPath();
                    ctx.arc(px(i2), py(g2), Math.min(2.4, colW / 3), 0, 2 * Math.PI);
                    ctx.fillStyle = "#cbd5e1"; ctx.fill();
                }
            }

            /* the traced ancestry of the sample */
            if (r.paths) {
                for (var g3 = 0; g3 + 1 < Math.min(r.paths.length, rows); g3++) {
                    var from = r.paths[g3], to = r.paths[g3 + 1];
                    for (var a = 0; a < from.length; a++) {
                        var parent = r.grid[g3] ? r.grid[g3][from[a]] : null;
                        if (parent === null) continue;
                        line(ctx, px(from[a]), py(g3), px(parent), py(g3 + 1),
                             "rgba(29,78,216,0.8)", 1.8);
                    }
                    /* mark coalescences: fewer lineages than the generation below */
                    if (to.length < from.length) {
                        for (var b = 0; b < to.length; b++) {
                            var count = 0;
                            for (var c = 0; c < from.length; c++) {
                                if (r.grid[g3][from[c]] === to[b]) count++;
                            }
                            if (count > 1) {
                                ctx.beginPath();
                                ctx.arc(px(to[b]), py(g3 + 1), 5, 0, 2 * Math.PI);
                                ctx.fillStyle = ORANGE; ctx.fill();
                            }
                        }
                    }
                }
                /* the sample itself */
                var s0 = r.paths[0];
                for (var d = 0; d < s0.length; d++) {
                    ctx.beginPath();
                    ctx.arc(px(s0[d]), py(0), 5, 0, 2 * Math.PI);
                    ctx.fillStyle = BLUE; ctx.fill();
                }
            }

            if (r.tmrca >= MAXDRAW) {
                text(ctx, "the common ancestor is further back than this window",
                     GX + GW / 2, GY + GH + 20,
                     { align: "center", size: 11.5, color: RED });
            }

            /* ---- histogram of TMRCA over replicates ---- */
            text(ctx, "Time to the common ancestor", HX, 22, { size: 14, weight: "700" });
            text(ctx, state.tmrcas.length.toLocaleString() + " samples so far",
                 HX, 38, { size: 11.5, color: GREY });

            var expected = 2 * N * (1 - 1 / k);
            var top = Math.max(expected * 3, 20);
            var NB = 26, bins = new Array(NB).fill(0), i3;
            for (i3 = 0; i3 < state.tmrcas.length; i3++) {
                var bi = Math.floor((state.tmrcas[i3] / top) * NB);
                if (bi >= NB) bi = NB - 1;
                if (bi < 0) bi = 0;
                bins[bi]++;
            }
            var bmax = 1;
            for (i3 = 0; i3 < NB; i3++) bmax = Math.max(bmax, bins[i3]);
            var bh = HH / NB;
            for (i3 = 0; i3 < NB; i3++) {
                var w = (bins[i3] / bmax) * HW;
                ctx.fillStyle = LIGHTBLUE;
                ctx.fillRect(HX, HY + HH - (i3 + 1) * bh, w, bh - 1);
            }
            line(ctx, HX, HY, HX, HY + HH, DARK, 1.5);

            /* expected value and observed mean, labelled below rather than
               inline, because the two lines sit on top of each other once the
               chain of replicates has settled */
            var ey = HY + HH - (expected / top) * HH;
            line(ctx, HX, ey, HX + HW, ey, ORANGE, 2, [6, 4]);

            var mean = null;
            if (state.tmrcas.length) {
                mean = 0;
                for (i3 = 0; i3 < state.tmrcas.length; i3++) mean += state.tmrcas[i3];
                mean /= state.tmrcas.length;
                var my = HY + HH - (mean / top) * HH;
                line(ctx, HX, my, HX + HW, my, BLUE, 2);
            }

            text(ctx, "0", HX - 6, HY + HH + 4, { align: "right", size: 11 });
            text(ctx, top.toFixed(0), HX - 6, HY + 4, { align: "right", size: 11 });
            text(ctx, "generations", HX + HW, HY + HH + 18,
                 { align: "right", size: 11, color: GREY });

            line(ctx, HX, HY + HH + 36, HX + 22, HY + HH + 36, ORANGE, 2, [6, 4]);
            text(ctx, "expected " + expected.toFixed(0), HX + 28, HY + HH + 40,
                 { size: 12, weight: "700", color: ORANGE });
            line(ctx, HX, HY + HH + 56, HX + 22, HY + HH + 56, BLUE, 2);
            text(ctx, mean === null ? "observed mean" : "observed mean " + mean.toFixed(0),
                 HX + 28, HY + HH + 60, { size: 12, weight: "700", color: BLUE });

            text(ctx, "This sample: " + (r.tmrca >= MAXGEN ? "> " + MAXGEN : r.tmrca) +
                 " generations", HX, HY + HH + 86, { size: 13, weight: "700" });
            text(ctx, "Double the population and the wait", HX, HY + HH + 108,
                 { size: 12, color: GREY });
            text(ctx, "roughly doubles.", HX, HY + HH + 123, { size: 12, color: GREY });
        }

        document.getElementById("wfNew").addEventListener("click", newSample);
        document.getElementById("wfRun").addEventListener("click", function () {
            replicates(200);
        });
        document.getElementById("wfReset").addEventListener("click", reset);
        elN.addEventListener("input", function () {
            document.getElementById("wfNVal").textContent = this.value;
            reset();
        });
        elK.addEventListener("input", function () {
            document.getElementById("wfKVal").textContent = this.value;
            reset();
        });

        reset();
    }


    /* ================================================================
       2. Population history, coalescent trees and the skyline plot
       ================================================================ */

    function initSkyline() {
        var ctx = makeCanvas("skCanvas", 660, 520);
        if (!ctx) return;

        var NBINS = 14;

        var PROFILES = {
            constant: {
                label: "Constant size", tmax: 3000, nmax: 2400,
                f: function () { return 1000; }
            },
            growth: {
                label: "Recent growth", tmax: 1400, nmax: 1400,
                /* forward in time the population grows, so going back it shrinks */
                f: function (t) { return Math.max(1000 * Math.exp(-0.0022 * t), 12); }
            },
            bottleneck: {
                label: "Bottleneck", tmax: 1600, nmax: 2000,
                f: function (t) {
                    if (t < 500) return 1200;
                    if (t < 900) return 60;
                    return 1200;
                }
            }
        };
        var KEYS = ["constant", "growth", "bottleneck"];

        var state = { key: "constant", trees: [] };

        function prof() { return PROFILES[state.key]; }

        /* Simulate one coalescent tree under N(t). The waiting time to the next
           coalescence is drawn by accumulating hazard in adaptive steps. */
        function simulateTree(f, n, tmax) {
            var k = n, t = 0, i;
            var nodes = [];
            for (i = 0; i < n; i++) nodes.push({ leaf: true, time: 0 });
            var events = [];
            while (k > 1 && t < tmax * 6) {
                var target = -Math.log(Math.random());
                var acc = 0;
                while (acc < target && t < tmax * 6) {
                    var rate = (k * (k - 1) / 2) / Math.max(f(t), 1);
                    var step = Math.min(0.05 / rate, 5);
                    acc += rate * step;
                    t += step;
                }
                var a = Math.floor(Math.random() * nodes.length);
                var b = Math.floor(Math.random() * (nodes.length - 1));
                if (b >= a) b++;
                var lo = Math.min(a, b), hi = Math.max(a, b);
                var node = { leaf: false, time: t, left: nodes[lo], right: nodes[hi] };
                nodes.splice(hi, 1); nodes.splice(lo, 1);
                nodes.push(node);
                events.push({ time: t, k: k });
                k--;
            }
            return { root: nodes[0], events: events, n: n };
        }

        /* Grouped skyline estimate. Within each time window pool the coalescent
           opportunity sum(C(k,2) * dt) across all trees and divide by the number
           of coalescences that fell in the window. Windows with no coalescence
           carry no information and are left blank. */
        function estimate(trees, tmax) {
            var A = new Array(NBINS).fill(0), C = new Array(NBINS).fill(0);
            var bw = tmax / NBINS;
            trees.forEach(function (tree) {
                var ev = tree.events.slice().sort(function (x, y) { return x.time - y.time; });
                var prev = 0;
                ev.forEach(function (e) {
                    var c2 = e.k * (e.k - 1) / 2;
                    for (var b = 0; b < NBINS; b++) {
                        var ov = Math.min(e.time, (b + 1) * bw) - Math.max(prev, b * bw);
                        if (ov > 0) A[b] += c2 * ov;
                    }
                    var cb = Math.floor(e.time / bw);
                    if (cb >= 0 && cb < NBINS) C[cb]++;
                    prev = e.time;
                });
            });
            return A.map(function (a, i) { return C[i] > 0 ? a / C[i] : null; });
        }

        function resimulate() {
            var p = prof();
            var m = +document.getElementById("skTrees").value;
            var n = +document.getElementById("skN").value;
            state.trees = [];
            for (var i = 0; i < m; i++) state.trees.push(simulateTree(p.f, n, p.tmax));
            draw();
        }

        /* ---- drawing: tree and population history share a vertical time axis ---- */
        var TX = 70, TW = 222, PX = 366, PW = 274, TOP = 58, BOT = 450;

        function draw() {
            clear(ctx);
            var p = prof(), f = p.f, i, b;

            function ty(t) { return BOT - (Math.min(t, p.tmax) / p.tmax) * (BOT - TOP); }
            function nx(N) { return PX + Math.min(N, p.nmax) / p.nmax * PW; }

            /* shared time axis */
            ctx.save();
            ctx.translate(14, (TOP + BOT) / 2);
            ctx.rotate(-Math.PI / 2);
            text(ctx, "generations before present", 0, 0, { align: "center", size: 12 });
            ctx.restore();
            line(ctx, 58, BOT, 58, TOP, DARK, 1.5);
            var tstep = p.tmax / 4;
            for (var t = 0; t <= p.tmax + 1; t += tstep) {
                line(ctx, 54, ty(t), 58, ty(t), DARK, 1.5);
                text(ctx, String(Math.round(t)), 52, ty(t) + 4, { align: "right", size: 11 });
            }

            /* ---- left: one coalescent tree ---- */
            text(ctx, "A coalescent tree", TX, 24, { size: 14, weight: "700" });
            text(ctx, state.trees.length > 1 ? "one of " + state.trees.length : "",
                 TX + 152, 24, { size: 11.5, color: GREY });

            if (state.trees.length) {
                var tree = state.trees[0];
                var leafIdx = 0;
                var lw = TW / Math.max(tree.n - 1, 1);
                var place = function (node) {
                    if (node.leaf) { node.x = TX + (leafIdx++) * lw; return node.x; }
                    var l = place(node.left), r = place(node.right);
                    node.x = (l + r) / 2;
                    return node.x;
                };
                place(tree.root);
                var drawNode = function (node) {
                    if (node.leaf) return;
                    var y = ty(node.time);
                    line(ctx, node.left.x, ty(node.left.time), node.left.x, y, BLUE, 1.4);
                    line(ctx, node.right.x, ty(node.right.time), node.right.x, y, BLUE, 1.4);
                    line(ctx, node.left.x, y, node.right.x, y, BLUE, 1.4);
                    drawNode(node.left); drawNode(node.right);
                };
                drawNode(tree.root);
                line(ctx, TX - 6, BOT, TX + TW + 6, BOT, DARK, 1.5);
                text(ctx, "present", TX + TW / 2, BOT + 18,
                     { align: "center", size: 11.5, color: GREY });
            }

            /* ---- right: the truth and what the trees recover ---- */
            text(ctx, "Population size through time", PX, 24, { size: 14, weight: "700" });

            var est = state.trees.length ? estimate(state.trees, p.tmax) : [];
            var bw = p.tmax / NBINS;

            /* the estimate as a step function, blank where there is no data */
            ctx.save();
            ctx.strokeStyle = BLUE; ctx.lineWidth = 3;
            ctx.beginPath();
            var open = false, deepest = 0;
            for (b = 0; b < NBINS; b++) {
                if (est[b] === null || est[b] === undefined) { open = false; continue; }
                var x = nx(est[b]), y0 = ty(b * bw), y1 = ty((b + 1) * bw);
                if (!open) { ctx.moveTo(x, y0); open = true; } else { ctx.lineTo(x, y0); }
                ctx.lineTo(x, y1);
                deepest = (b + 1) * bw;
            }
            ctx.stroke();
            ctx.restore();

            if (deepest > 0 && deepest < p.tmax * 0.98) {
                line(ctx, PX, ty(deepest), PX + PW, ty(deepest), GREY, 1.2, [4, 3]);
                text(ctx, "no information beyond here", PX + 4, ty(deepest) - 6,
                     { size: 11, color: GREY });
            }

            /* the truth */
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = DARK; ctx.lineWidth = 2.5;
            ctx.setLineDash([7, 4]);
            for (var g = 0; g <= 400; g++) {
                var t2 = (g / 400) * p.tmax;
                var xv = nx(f(t2)), yv = ty(t2);
                if (g === 0) ctx.moveTo(xv, yv); else ctx.lineTo(xv, yv);
            }
            ctx.stroke();
            ctx.restore();

            line(ctx, PX, BOT, PX + PW, BOT, DARK, 1.5);
            var nstep = p.nmax / 4;
            for (var nn = 0; nn <= p.nmax + 1; nn += nstep) {
                line(ctx, nx(nn), BOT, nx(nn), BOT + 5, DARK, 1.5);
                text(ctx, String(Math.round(nn)), nx(nn), BOT + 18,
                     { align: "center", size: 11 });
            }
            text(ctx, "population size", PX + PW / 2, BOT + 36,
                 { align: "center", size: 12, weight: "600" });

            /* legend */
            line(ctx, PX, 42, PX + 24, 42, DARK, 2.5, [7, 4]);
            text(ctx, "the truth", PX + 30, 46, { size: 11.5 });
            line(ctx, PX + 100, 42, PX + 124, 42, BLUE, 3);
            text(ctx, "read off the tree(s)", PX + 130, 46, { size: 11.5, color: BLUE });

            text(ctx, "A long wait between branching events means the population was large then.",
                 18, 505, { size: 12.5, weight: "600" });
        }

        KEYS.forEach(function (key) {
            document.getElementById("sk_" + key).addEventListener("click", function () {
                state.key = key;
                KEYS.forEach(function (k2) {
                    var el = document.getElementById("sk_" + k2);
                    el.style.fontWeight = (k2 === key) ? "700" : "400";
                    el.style.background = (k2 === key) ? "#dbeafe" : "";
                });
                resimulate();
            });
        });
        document.getElementById("skN").addEventListener("input", function () {
            document.getElementById("skNVal").textContent = this.value;
            resimulate();
        });
        document.getElementById("skTrees").addEventListener("input", function () {
            document.getElementById("skTreesVal").textContent = this.value;
            resimulate();
        });
        document.getElementById("skGo").addEventListener("click", resimulate);

        document.getElementById("sk_constant").style.fontWeight = "700";
        document.getElementById("sk_constant").style.background = "#dbeafe";
        resimulate();
    }

    ready(function () {
        try { initWF(); } catch (e) { console.error("wfCoalescent", e); }
        try { initSkyline(); } catch (e) { console.error("skyline", e); }
    });
})();
