/* Interactive figures for the macroevolution lecture.
   Data (macro_data.json) is produced by a birth-death simulator; this file
   only renders it. Plots use fixed pixel sizes so they render correctly even
   while their reveal.js slide is hidden (Plotly cannot measure a hidden div). */

(function () {
    "use strict";

    var BLUE = "#1d4ed8", ORANGE = "#ea580c", GREEN = "#047857", GREY = "#94a3b8";

    function ready(fn) {
        if (document.readyState !== "loading") { fn(); }
        else { document.addEventListener("DOMContentLoaded", fn); }
    }

    function baseLayout(extra) {
        var l = {
            width: 720, height: 430,
            margin: { l: 64, r: 24, t: 28, b: 52 },
            paper_bgcolor: "#ffffff", plot_bgcolor: "#ffffff",
            font: { family: "Inter, sans-serif", size: 14, color: "#1f2937" },
            showlegend: false
        };
        for (var k in extra) { l[k] = extra[k]; }
        return l;
    }

    // ---------- Yule (pure-birth) growth, button per speciation rate ----------
    function drawYule(div, data) {
        var lams = ["0.3", "0.5", "0.8"], traces = [], groups = [];
        lams.forEach(function (lam, gi) {
            var g = data.yule[lam], idx = [];
            // expectation curve
            idx.push(traces.length);
            traces.push({
                x: g.exp.t, y: g.exp.n, mode: "lines", type: "scatter",
                line: { color: ORANGE, width: 4 }, hoverinfo: "skip",
                visible: gi === 1
            });
            // stochastic realisations (step functions)
            g.reals.forEach(function (r) {
                idx.push(traces.length);
                traces.push({
                    x: r[0], y: r[1], mode: "lines", type: "scatter",
                    line: { color: BLUE, width: 1.3, shape: "hv" },
                    opacity: 0.55, hoverinfo: "skip", visible: gi === 1
                });
            });
            groups.push(idx);
        });

        function mask(gi) {
            var m = traces.map(function () { return false; });
            groups[gi].forEach(function (i) { m[i] = true; });
            return m;
        }
        var buttons = lams.map(function (lam, gi) {
            return {
                label: "λ = " + lam, method: "restyle",
                args: ["visible", mask(gi)]
            };
        });

        var layout = baseLayout({
            xaxis: { title: "time", range: [0, data.T], zeroline: false },
            yaxis: { title: "number of lineages", type: "log",
                     range: [0, 3.35], zeroline: false },
            updatemenus: [{
                type: "buttons", direction: "right", showactive: true, active: 1,
                x: 0, y: 1.16, xanchor: "left", yanchor: "top",
                pad: { r: 6, t: 2 }, buttons: buttons,
                bgcolor: "#eff6ff", bordercolor: "#bfdbfe",
                font: { size: 13, color: BLUE }
            }],
            annotations: [{
                x: 0.02, y: 1.0, xref: "paper", yref: "paper", showarrow: false,
                text: "thick: expected e<sup>λt</sup>&nbsp;&nbsp;thin: single realisations",
                font: { size: 12, color: "#64748b" }, xanchor: "left"
            }]
        });
        Plotly.newPlot(div, traces, layout, { displayModeBar: false, responsive: false });
    }

    // ---------- Reconstructed LTT: the pull of the present, slider over epsilon
    function drawLTT(div, data) {
        var grid = data.grid, epsKeys = ["0.00", "0.50", "0.90"], traces = [];

        function norm(curve) {
            var last = curve[curve.length - 1];
            return curve.map(function (v) { return v / last; });
        }
        // reference: pure birth (epsilon = 0), always visible
        traces.push({
            x: grid, y: norm(data.ltt["0.00"].curve), mode: "lines",
            type: "scatter", line: { color: GREY, width: 2, dash: "dot" },
            name: "pure birth", hoverinfo: "skip"
        });
        // one highlighted curve per epsilon
        epsKeys.forEach(function (k, i) {
            traces.push({
                x: grid, y: norm(data.ltt[k].curve), mode: "lines",
                type: "scatter", line: { color: i === 0 ? GREEN : (i === 1 ? BLUE : ORANGE), width: 4 },
                hoverinfo: "skip", visible: i === 0
            });
        });

        function mask(sel) {
            var m = [true]; // reference always on
            epsKeys.forEach(function (_, i) { m.push(i === sel); });
            return m;
        }
        var steps = epsKeys.map(function (k, i) {
            var d = data.ltt[k];
            return {
                label: k.replace(/0$/, ""), method: "restyle",
                args: ["visible", mask(i)]
            };
        });

        var layout = baseLayout({
            xaxis: { title: "time  (root → present)", range: [0, data.T], zeroline: false },
            yaxis: {
                title: "lineages (fraction of present diversity)", type: "log",
                range: [-2.85, 0.12], zeroline: false,
                tickvals: [0.001, 0.01, 0.1, 1], ticktext: ["0.001", "0.01", "0.1", "1"]
            },
            sliders: [{
                active: 0, x: 0.02, y: 1.16, len: 0.6, xanchor: "left", yanchor: "top",
                currentvalue: { prefix: "relative extinction  ε = ", font: { size: 14, color: "#1f2937" } },
                pad: { t: 0, b: 6 }, steps: steps
            }],
            annotations: [{
                x: data.T, y: 0.0, xref: "x", yref: "y", ax: -46, ay: 30,
                text: "pull of the<br>present", font: { size: 12, color: ORANGE },
                arrowcolor: ORANGE, arrowhead: 3, align: "center"
            }]
        });
        Plotly.newPlot(div, traces, layout, { displayModeBar: false, responsive: false });
    }

    // ---------- Live birth-death tree, with the survivors traced on top ------
    // Simulates in the browser and draws the full tree in grey, with the
    // reconstructed tree of survivors traced over it in blue.
    var SIM = {
        W: 920, H: 384,          // fixed pixels: the slide may be hidden
        ML: 12, MR: 34, MT: 26, MB: 34,
        TRACE: 1600,             // ms to trace the survivors back from the present
        TIP_LO: 8, TIP_HI: 24, MAX_LIN: 220, TRIES: 3000,
        TARGET: 14               // expected survivors, sets the time span
    };
    var simCount = 0;            // makes each render's clip-path id unique

    function simulateBD(lam, mu, T, maxLin) {
        var lin = [[0, 0, -1, false]], alive = [0], t = 0, rt = lam + mu, i, k;
        while (alive.length) {
            k = alive.length;
            t += -Math.log(1 - Math.random()) / (k * rt);
            if (t >= T) {
                for (i = 0; i < alive.length; i++) {
                    lin[alive[i]][1] = T; lin[alive[i]][3] = true;
                }
                return lin;
            }
            k = Math.floor(Math.random() * alive.length);
            i = alive[k];
            lin[i][1] = t;
            alive.splice(k, 1);
            if (Math.random() < lam / rt) {
                lin.push([t, 0, i, false]); alive.push(lin.length - 1);
                lin.push([t, 0, i, false]); alive.push(lin.length - 1);
                if (lin.length > maxLin) { return null; }
            }
        }
        return null;                       // whole clade died out
    }

    function drawSim(eps) {
        var lam = 1.0, mu = eps * lam, T = Math.log(SIM.TARGET) / (lam - mu);
        var lin = null, tries = 0, n;
        while (tries++ < SIM.TRIES) {
            var cand = simulateBD(lam, mu, T, SIM.MAX_LIN);
            if (!cand) { continue; }
            n = 0;
            for (var q = 0; q < cand.length; q++) { if (cand[q][3]) { n++; } }
            if (n >= SIM.TIP_LO && n <= SIM.TIP_HI) { lin = cand; break; }
        }
        if (!lin) { return null; }

        // lineages with at least one living descendant (children follow parents)
        var he = lin.map(function (L) { return L[3]; }), i;
        for (i = lin.length - 1; i > 0; i--) {
            if (he[i]) { he[lin[i][2]] = true; }
        }
        var kids = {};
        for (i = 1; i < lin.length; i++) {
            (kids[lin[i][2]] = kids[lin[i][2]] || []).push(i);
        }
        // ladderise: count tips below each node, smaller clade drawn first
        var cnt = [];
        for (i = lin.length - 1; i >= 0; i--) {
            c = kids[i];
            cnt[i] = 0;
            if (!c) { cnt[i] = 1; continue; }
            for (var k2 = 0; k2 < c.length; k2++) { cnt[i] += cnt[c[k2]]; }
        }
        var order = function (a, b) { return cnt[a] - cnt[b] || a - b; };
        // tip rows in depth-first order, then internal nodes by child mean
        var rows = {}, nTips = 0, stack = [0], node, c;
        while (stack.length) {
            node = stack.pop();
            c = kids[node];
            if (!c) { rows[node] = nTips++; continue; }
            c = kids[node] = c.slice().sort(order);
            for (i = c.length - 1; i >= 0; i--) { stack.push(c[i]); }
        }
        var pos = {};
        var pw = SIM.W - SIM.ML - SIM.MR, ph = SIM.H - SIM.MT - SIM.MB;
        var dy = ph / Math.max(nTips - 1, 1);
        for (i = lin.length - 1; i >= 0; i--) {
            c = kids[i];
            if (!c) { pos[i] = SIM.MT + rows[i] * dy; continue; }
            // the layout is that of the full tree; the blue trace then takes
            // small vertical steps wherever a sister clade has died out
            var s = 0;
            for (var j = 0; j < c.length; j++) { s += pos[c[j]]; }
            pos[i] = s / c.length;
        }
        function xof(t) { return SIM.ML + pw * t / T; }

        // The reconstructed tree starts at the most recent common ancestor of
        // the survivors. Nothing above that split can be recovered from living
        // species, so the stem is left grey.
        var mrca = 0;
        for (;;) {
            c = kids[mrca];
            if (!c) { break; }
            var live = c.filter(function (j) { return he[j]; });
            if (live.length !== 1) { break; }
            mrca = live[0];
        }
        var desc = [];
        desc[mrca] = true;
        for (i = mrca + 1; i < lin.length; i++) { desc[i] = !!desc[lin[i][2]]; }

        var dense = nTips > 40;
        var grey = [], blue = [], nLive = 0;
        for (i = 0; i < lin.length; i++) {
            var L = lin[i], x1 = xof(L[0]), x2 = xof(L[1]), y = pos[i];
            var seg = '<path d="M' + x1.toFixed(1) + ' ' + y.toFixed(1) +
                      'H' + x2.toFixed(1) + '"/>';
            c = kids[i];
            if (c) {
                var lo = pos[c[0]], hi = pos[c[0]];
                for (j = 1; j < c.length; j++) {
                    lo = Math.min(lo, pos[c[j]]); hi = Math.max(hi, pos[c[j]]);
                }
                seg += '<path d="M' + x2.toFixed(1) + ' ' + lo.toFixed(1) +
                       'V' + hi.toFixed(1) + '"/>';
            }
            grey.push(seg);
            if (he[i] && desc[i]) {
                // the mrca's own branch is stem, so keep only its split bar
                var bseg = i === mrca ? "" :
                    '<path d="M' + x1.toFixed(1) + ' ' + y.toFixed(1) +
                    'H' + x2.toFixed(1) + '"/>';
                if (c) {
                    // span the surviving children, and this branch's own end,
                    // so that the trace stays connected across the step
                    var blo = i === mrca ? null : y, bhi = blo;
                    for (j = 0; j < c.length; j++) {
                        if (!he[c[j]]) { continue; }
                        blo = blo === null ? pos[c[j]] : Math.min(blo, pos[c[j]]);
                        bhi = bhi === null ? pos[c[j]] : Math.max(bhi, pos[c[j]]);
                    }
                    if (blo !== null && bhi > blo) {
                        bseg += '<path d="M' + x2.toFixed(1) + ' ' + blo.toFixed(1) +
                                'V' + bhi.toFixed(1) + '"/>';
                    }
                }
                blue.push(bseg);
            }
            if (!c && L[3]) {
                nLive++;
                blue.push('<circle cx="' + x2.toFixed(1) + '" cy="' + y.toFixed(1) +
                          '" r="3.6" fill="' + BLUE + '" stroke="none"/>');
            } else if (!c && !dense) {
                var r = 3.2;
                grey.push('<path d="M' + (x2 - r).toFixed(1) + ' ' + (y - r).toFixed(1) +
                          'l' + (2 * r) + ' ' + (2 * r) + 'M' + (x2 - r).toFixed(1) +
                          ' ' + (y + r).toFixed(1) + 'l' + (2 * r) + ' ' + (-2 * r) + '"/>');
            }
        }
        return {
            grey: grey.join(""), blue: blue.join(""), dense: dense,
            nLin: nTips, nLive: nLive, x0: SIM.ML, x1: SIM.W - SIM.MR
        };
    }

    function renderSim(container, eps, existing) {
        var d = existing || drawSim(eps);
        if (!d) { return null; }
        var axisY = SIM.H - SIM.MB + 16;
        var id = "bdsim" + (++simCount);
        container.innerHTML =
            '<svg viewBox="0 0 ' + SIM.W + ' ' + SIM.H + '" width="' + SIM.W +
            '" height="' + SIM.H + '" style="background:#fff;border-radius:6px">' +
            '<defs><clipPath id="' + id + '"><rect id="' + id + 'r" x="' + SIM.W +
            '" y="0" width="0" height="' + SIM.H + '"/></clipPath></defs>' +
            '<g fill="none" stroke="' + GREY +
            '" stroke-opacity="0.6" stroke-width="' + (d.dense ? 1.1 : 1.6) +
            '" stroke-linecap="round">' + d.grey + '</g>' +
            '<g clip-path="url(#' + id + ')" fill="none" stroke="' + BLUE +
            '" stroke-width="' + (d.dense ? 1.8 : 2.4) + '" stroke-linecap="round">' +
            d.blue + '</g>' +
            '<line x1="' + d.x0 + '" y1="' + axisY + '" x2="' + d.x1 + '" y2="' + axisY +
            '" stroke="#cbd5e1" stroke-width="1.2"/>' +
            '<text x="' + d.x0 + '" y="' + (axisY + 17) + '" font-size="13" fill="#94a3b8">origin</text>' +
            '<text x="' + d.x1 + '" y="' + (axisY + 17) + '" font-size="13" fill="#94a3b8" text-anchor="end">present</text>' +
            '<text x="' + d.x0 + '" y="16" font-size="14" fill="#64748b">' +
            '<tspan fill="' + GREY + '">' + d.nLin + ' tips in the full tree</tspan>' +
            '<tspan fill="#94a3b8">&#160;&#160;&#183;&#160;&#160;</tspan>' +
            '<tspan fill="' + BLUE + '" font-weight="700">' + d.nLive +
            ' survive to the present</tspan></text>' +
            '</svg>';

        // trace the survivors back from the present; the grey tree stays put
        var clip = document.getElementById(id + "r");
        var span = d.x1 - d.x0 + SIM.MR;
        function reveal(f) {
            var w = span * f;
            clip.setAttribute("x", SIM.W - w);
            clip.setAttribute("width", w);
        }
        if (!clip) { return d; }
        if (window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            reveal(1);
            return d;
        }
        var t0 = null;
        function frame(ts) {
            if (t0 === null) { t0 = ts; }
            var f = (ts - t0) / SIM.TRACE;
            reveal(f < 1 ? f : 1);
            if (f < 1) { requestAnimationFrame(frame); }
        }
        requestAnimationFrame(frame);
        return d;
    }

    function setupSim(host) {
        var plot = document.createElement("div");
        var bar = document.createElement("div");
        bar.style.cssText = "display:flex;gap:0.5em;align-items:center;" +
            "justify-content:center;margin:0.1em 0 0.25em;font-size:15px;" +
            "font-family:Inter,sans-serif";
        var eps = 0.5, buttons = [], last = null;
        function paint() {
            buttons.forEach(function (b) {
                var on = b.dataset.eps === String(eps);
                b.style.background = on ? "#eff6ff" : "#f8fafc";
                b.style.color = on ? BLUE : "#64748b";
                b.style.borderColor = on ? "#bfdbfe" : "#e2e8f0";
                b.style.fontWeight = on ? "700" : "400";
            });
        }
        function btn(text, css) {
            var b = document.createElement("button");
            b.textContent = text;
            b.style.cssText = "border:1px solid #e2e8f0;border-radius:5px;" +
                "padding:2px 10px;cursor:pointer;font:inherit;background:#f8fafc;" +
                "color:#64748b;" + (css || "");
            bar.appendChild(b);
            return b;
        }
        var tag = document.createElement("span");
        tag.textContent = "relative extinction ε =";
        tag.style.cssText = "color:#64748b";
        bar.appendChild(tag);
        [0, 0.5, 0.8].forEach(function (v) {
            var b = btn(String(v));
            b.dataset.eps = String(v);
            b.onclick = function () { eps = v; paint(); last = renderSim(plot, eps); };
            buttons.push(b);
        });
        var again = btn("↻ new tree", "margin-left:0.8em");
        again.onclick = function () { last = renderSim(plot, eps); };

        host.innerHTML = "";
        host.appendChild(bar);
        host.appendChild(plot);
        paint();
        last = renderSim(plot, eps);
        // replay the same tree whenever the slide comes back into view
        if (window.Reveal && Reveal.addEventListener) {
            Reveal.addEventListener("slidechanged", function (ev) {
                if (ev.currentSlide && ev.currentSlide.contains(host)) {
                    last = renderSim(plot, eps, last);
                }
            });
        }
    }

    ready(function () {
        var sDiv = document.getElementById("bd-tree-sim");
        if (sDiv) { setupSim(sDiv); }
        if (typeof Plotly === "undefined") { return; }
        var yDiv = document.getElementById("yule-plot");
        var lDiv = document.getElementById("ltt-plot");
        if (!yDiv && !lDiv) { return; }
        fetch("macro_data.json").then(function (r) { return r.json(); }).then(function (data) {
            if (yDiv) { drawYule(yDiv, data); }
            if (lDiv) { drawLTT(lDiv, data); }
        }).catch(function (e) { if (window.console) { console.warn("macro_data load failed", e); } });
    });
})();
