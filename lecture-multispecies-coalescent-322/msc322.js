/* Interactive figure for the BIOSCI 322 multispecies coalescent lecture.

   One canvas widget: incomplete lineage sorting in the human / chimpanzee /
   gorilla trio. A gene lineage is sampled from each species and run backwards
   through a species tree drawn as a set of pipes. When the internal branch is
   short relative to the population size the three gene lineages often fail to
   sort within it, and the gene tree disagrees with the species tree.

   Times are in coalescent units, i.e. multiples of the population size, which
   is the only thing that matters here. */

(function () {
    "use strict";

    var BLUE = "#1d4ed8", ORANGE = "#ea580c", GREEN = "#047857",
        RED = "#b91c1c", GREY = "#94a3b8", DARK = "#1f2937",
        PIPE = "#e2e8f0", PIPEEDGE = "#94a3b8";

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

    function expRand(rate) { return -Math.log(Math.random()) / rate; }

    var SPECIES = ["Human", "Chimp", "Gorilla"];
    var TOPOS = [
        { key: "HC", label: "(Human, Chimp)", note: "matches the species tree" },
        { key: "HG", label: "(Human, Gorilla)", note: "" },
        { key: "CG", label: "(Chimp, Gorilla)", note: "" }
    ];

    function initILS() {
        var ctx = makeCanvas("ilsCanvas", 660, 470);
        if (!ctx) return;

        var T1 = 1.0;    /* human-chimp split, in units of population size */

        var state = { counts: { HC: 0, HG: 0, CG: 0 }, last: null };

        function internal() { return +document.getElementById("ilsT").value; }

        /* Run one gene backwards through the species tree. */
        function simulate() {
            var T = internal(), T2 = T1 + T;
            var events = [];

            /* Inside the human+chimp ancestor, one pair, rate 1 per unit time. */
            var tc = T1 + expRand(1);
            var sorted = tc < T2;
            var lineages;
            if (sorted) {
                events.push({ t: tc, pair: ["Human", "Chimp"], pop: "HC" });
                lineages = [{ name: "HC", members: ["Human", "Chimp"] }];
            } else {
                lineages = [{ name: "Human", members: ["Human"] },
                            { name: "Chimp", members: ["Chimp"] }];
            }
            lineages.push({ name: "Gorilla", members: ["Gorilla"] });

            /* Inside the root population, everything left must coalesce. */
            var t = T2;
            while (lineages.length > 1) {
                var k = lineages.length;
                t += expRand(k * (k - 1) / 2);
                var a = Math.floor(Math.random() * k);
                var b = Math.floor(Math.random() * (k - 1));
                if (b >= a) b++;
                var lo = Math.min(a, b), hi = Math.max(a, b);
                events.push({
                    t: t,
                    pair: lineages[lo].members.concat(lineages[hi].members),
                    pop: "root"
                });
                var merged = {
                    name: lineages[lo].name + "+" + lineages[hi].name,
                    members: lineages[lo].members.concat(lineages[hi].members)
                };
                lineages.splice(hi, 1); lineages.splice(lo, 1);
                lineages.push(merged);
            }

            /* The first coalescence defines the rooted gene tree topology. */
            var first = events[0].pair;
            var topo;
            if (first.indexOf("Human") >= 0 && first.indexOf("Chimp") >= 0) topo = "HC";
            else if (first.indexOf("Human") >= 0 && first.indexOf("Gorilla") >= 0) topo = "HG";
            else topo = "CG";

            return { events: events, topo: topo, sorted: sorted, T: T, T2: T2, tmax: t };
        }

        function oneGene() {
            var r = simulate();
            state.last = r;
            state.counts[r.topo]++;
            draw();
        }
        function manyGenes(n) {
            for (var i = 0; i < n; i++) {
                var r = simulate();
                state.counts[r.topo]++;
                state.last = r;
            }
            draw();
        }
        function reset() {
            state.counts = { HC: 0, HG: 0, CG: 0 };
            state.last = null;
            oneGene();
        }

        /* ---- drawing ---- */
        /* The pipes are schematic containers for the species tree; their width
           carries no meaning. What matters is the length of the internal branch
           relative to the population size, which the slider controls. */
        var TOP = 52, BOT = 412;
        var TIPX = { Human: 90, Chimp: 160, Gorilla: 265 };
        var PIPEW = 50, ABW = 130, ROOTW = 245;
        var ABX = 125, ROOTX = 177;
        var BX = 384, BW = 226;

        function draw() {
            clear(ctx);
            var r = state.last;
            if (!r) return;
            var T2 = r.T2;
            var tmax = Math.max(r.tmax * 1.12, T2 + 1.2);

            function ty(t) { return BOT - (t / tmax) * (BOT - TOP); }

            /* ---- species tree drawn as pipes ---- */
            function pipe(cx, w, tFrom, tTo) {
                ctx.fillStyle = PIPE;
                ctx.strokeStyle = PIPEEDGE;
                ctx.lineWidth = 1.5;
                var y0 = ty(tFrom), y1 = ty(tTo);
                ctx.beginPath();
                ctx.rect(cx - w / 2, y1, w, y0 - y1);
                ctx.fill(); ctx.stroke();
            }
            pipe(ROOTX, ROOTW, T2, tmax);
            pipe(ABX, ABW, T1, T2);
            pipe(TIPX.Human, PIPEW, 0, T1);
            pipe(TIPX.Chimp, PIPEW, 0, T1);
            pipe(TIPX.Gorilla, PIPEW, 0, T2);

            /* ---- gene lineages inside the pipes ---- */
            /* x position of each lineage while it is in a given population */
            function slots(cx, w, n, i) {
                if (n === 1) return cx;
                var span = w * 0.56;
                return cx - span / 2 + (i * span) / (n - 1);
            }

            var xs = {};   /* current x of each surviving lineage name */
            xs.Human = TIPX.Human;
            xs.Chimp = TIPX.Chimp;
            xs.Gorilla = TIPX.Gorilla;

            function seg(x1, y1, x2, y2) { line(ctx, x1, y1, x2, y2, BLUE, 2.4); }

            /* present up to the human-chimp split */
            seg(xs.Human, ty(0), xs.Human, ty(T1));
            seg(xs.Chimp, ty(0), xs.Chimp, ty(T1));
            seg(xs.Gorilla, ty(0), xs.Gorilla, ty(T2));

            /* into the human+chimp ancestor */
            var hx = slots(ABX, ABW, 2, 0), cx2 = slots(ABX, ABW, 2, 1);
            seg(xs.Human, ty(T1), hx, ty(T1));
            seg(xs.Chimp, ty(T1), cx2, ty(T1));
            xs.Human = hx; xs.Chimp = cx2;

            var ev0 = r.events[0];
            var abTop = r.sorted ? ev0.t : T2;
            seg(xs.Human, ty(T1), xs.Human, ty(abTop));
            seg(xs.Chimp, ty(T1), xs.Chimp, ty(abTop));

            var rootLineages;
            if (r.sorted) {
                /* they meet inside the ancestral human+chimp population */
                seg(xs.Human, ty(ev0.t), xs.Chimp, ty(ev0.t));
                ctx.beginPath();
                ctx.arc(ABX, ty(ev0.t), 5, 0, 2 * Math.PI);
                ctx.fillStyle = ORANGE; ctx.fill();
                xs.HC = ABX;
                seg(ABX, ty(ev0.t), ABX, ty(T2));
                rootLineages = ["HC", "Gorilla"];
            } else {
                rootLineages = ["Human", "Chimp", "Gorilla"];
            }

            /* into the root population */
            var i;
            for (i = 0; i < rootLineages.length; i++) {
                var nx = slots(ROOTX, ROOTW, rootLineages.length, i);
                seg(xs[rootLineages[i]], ty(T2), nx, ty(T2));
                xs[rootLineages[i]] = nx;
            }

            /* remaining coalescences in the root */
            var alive = rootLineages.slice();
            var startIdx = r.sorted ? 1 : 0;
            var tprev = T2;
            for (i = startIdx; i < r.events.length; i++) {
                var e = r.events[i];
                var j;
                for (j = 0; j < alive.length; j++) {
                    seg(xs[alive[j]], ty(tprev), xs[alive[j]], ty(e.t));
                }
                /* which two lineages merged: those whose members are all in e.pair
                   and which are still alive */
                var merging = alive.filter(function (nm) {
                    return membersOf(nm).every(function (m) { return e.pair.indexOf(m) >= 0; });
                });
                if (merging.length > 2) merging = merging.slice(0, 2);
                if (merging.length === 2) {
                    var xa = xs[merging[0]], xb = xs[merging[1]];
                    seg(xa, ty(e.t), xb, ty(e.t));
                    var mid = (xa + xb) / 2;
                    ctx.beginPath();
                    ctx.arc(mid, ty(e.t), 5, 0, 2 * Math.PI);
                    ctx.fillStyle = ORANGE; ctx.fill();
                    var nm2 = merging[0] + "+" + merging[1];
                    xs[nm2] = mid;
                    alive = alive.filter(function (n2) { return merging.indexOf(n2) < 0; });
                    alive.push(nm2);
                }
                tprev = e.t;
            }
            for (i = 0; i < alive.length; i++) {
                seg(xs[alive[i]], ty(tprev), xs[alive[i]], ty(tmax));
            }

            function membersOf(nm) {
                if (nm === "HC") return ["Human", "Chimp"];
                return nm.split("+").reduce(function (acc, part) {
                    return acc.concat(part === "HC" ? ["Human", "Chimp"] : [part]);
                }, []);
            }

            /* tip labels */
            line(ctx, 30, BOT, 320, BOT, DARK, 1.5);
            SPECIES.forEach(function (s) {
                text(ctx, s, TIPX[s], BOT + 18,
                     { align: "center", size: 12.5, weight: "600" });
            });
            text(ctx, "present", 30, BOT + 18, { size: 11, color: GREY });

            ctx.save();
            ctx.translate(18, (TOP + BOT) / 2);
            ctx.rotate(-Math.PI / 2);
            text(ctx, "time before present", 0, 0, { align: "center", size: 12 });
            ctx.restore();

            text(ctx, "grey pipes: the species tree     blue lines: one gene",
                 30, 24, { size: 12.5, weight: "600" });

            /* the verdict for this gene */
            var matched = r.topo === "HC";
            text(ctx, matched ? "this gene matches the species tree"
                              : "this gene DISAGREES with the species tree",
                 30, 40, { size: 12.5, weight: "700",
                           color: matched ? GREEN : RED });

            /* ---- tally ---- */
            var total = state.counts.HC + state.counts.HG + state.counts.CG;
            text(ctx, "Gene tree topologies", BX, 24, { size: 14, weight: "700" });
            text(ctx, total.toLocaleString() + " genes simulated", BX, 40,
                 { size: 11.5, color: GREY });

            var T = r.T;
            var pFail = Math.exp(-T);
            var expect = { HC: 1 - (2 / 3) * pFail, HG: pFail / 3, CG: pFail / 3 };

            for (var b = 0; b < 3; b++) {
                var key = TOPOS[b].key;
                var y = 76 + b * 86;
                var frac = total ? state.counts[key] / total : 0;
                text(ctx, TOPOS[b].label, BX, y,
                     { size: 12.5, weight: "700",
                       color: key === "HC" ? GREEN : DARK });
                if (TOPOS[b].note) {
                    text(ctx, TOPOS[b].note, BX, y + 14, { size: 10.5, color: GREY });
                }
                var by = y + 22;
                ctx.fillStyle = "#f1f5f9";
                ctx.fillRect(BX, by, BW, 20);
                ctx.fillStyle = key === "HC" ? GREEN : ORANGE;
                ctx.fillRect(BX, by, BW * frac, 20);
                /* expected value marker */
                line(ctx, BX + BW * expect[key], by - 4, BX + BW * expect[key], by + 24,
                     DARK, 2, [4, 3]);
                text(ctx, (100 * frac).toFixed(1) + "%", BX, by + 36,
                     { size: 12, weight: "700" });
                text(ctx, "expected " + (100 * expect[key]).toFixed(1) + "%",
                     BX + BW, by + 36, { align: "right", size: 11, color: GREY });
            }

            var disagree = total ? (state.counts.HG + state.counts.CG) / total : 0;
            text(ctx, "Disagreeing with the species tree: " +
                 (100 * disagree).toFixed(1) + "%", BX, 372,
                 { size: 13, weight: "700", color: RED });
            text(ctx, "Shorten the internal branch, or enlarge the", BX, 396,
                 { size: 11.5, color: GREY });
            text(ctx, "population, and disagreement takes over.", BX, 411,
                 { size: 11.5, color: GREY });
        }

        document.getElementById("ilsOne").addEventListener("click", oneGene);
        document.getElementById("ilsMany").addEventListener("click", function () {
            manyGenes(500);
        });
        document.getElementById("ilsReset").addEventListener("click", reset);
        document.getElementById("ilsT").addEventListener("input", function () {
            document.getElementById("ilsTVal").textContent = (+this.value).toFixed(2);
            reset();
        });

        reset();
    }

    ready(function () {
        try { initILS(); } catch (e) { console.error("ils", e); }
    });
})();
