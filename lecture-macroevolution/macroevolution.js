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

    ready(function () {
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
