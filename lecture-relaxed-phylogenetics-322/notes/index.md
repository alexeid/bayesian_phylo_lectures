---
layout: lecture_notes
title: "Molecular clocks and dated phylogenies"
lecture_num: 9
section: biosci322
section_name: "BIOSCI 322: Phylogenetics and Coalescence"
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> 7 August 2026</span>
        <span><i class="fas fa-clock"></i> 50 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: <em>Decoding Genomes</em> Ch 6.4</span>
    </div>
</div>

<section class="section" id="the-question">
<h2>The question this lecture answers</h2>

<p>A phylogeny with a <strong>calendar axis</strong> tells you when lineages last shared an
ancestor. That is what turns a tree into a statement about history: when a virus entered a
country, when two species diverged, how old a fossil lineage is.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics-322/douglas2021-figure4A.png"
         alt="Time-calibrated SARS-CoV-2 phylogeny for New Zealand" style="width: 85%;">
    <div class="figure-caption">
        Figure 4A of Douglas <em>et al.</em> (2021), <em>Virus Evolution</em> 7(2):veab052 (CC BY).
        A maximum-clade-credibility tree of SARS-CoV-2 genomes from New Zealand's first wave.
        Rings are calendar months; red is the New Zealand deme and grey the rest of the world,
        so each red cluster is a separate introduction. $t_1$ marks the first reported case and
        $t_2$ the decrease in mobility.
    </div>
</div>

<p>The sample dates at the tips are known. Every <strong>internal</strong> date is estimated,
and so has a posterior distribution and a credible interval, exactly like any other parameter
from L8. The squares are posterior clade probabilities.</p>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>The problem to solve:</strong> sequences record genetic distance, which is
        rate multiplied by time. Before a tree can carry a calendar axis, something has to
        separate those two.
    </div>
</div>
</section>

<section class="section" id="molecular-clock">
<h2>1. The Molecular Clock Hypothesis</h2>

<h3>Genetic Distance = Rate × Time</h3>

<p>The fundamental equation of molecular evolution:</p>

<div class="theorem-box">
    <h4>The Molecular Clock Equation</h4>
    <div class="math-block">
    $$d = \mu \times t$$
    </div>
    <p>Where:</p>
    <ul>
        <li>$d$ = genetic distance (expected substitutions per site)</li>
        <li>$\mu$ = substitution rate (substitutions per site per unit time)</li>
        <li>$t$ = time</li>
    </ul>
</div>

<h3>The Strict Molecular Clock</h3>

<p>Under a strict molecular clock, all lineages evolve at the same rate:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_StrictClockParam.svg" alt="Strict clock parameterization" style="width: 80%;">
    <div class="figure-caption">The strict clock: a single rate $\mu$ converts the time tree to a substitution tree</div>
</div>

<div class="definition-box">
    <div class="title">Strict Molecular Clock</div>
    <ul>
        <li>Single evolutionary rate $\mu$ for all branches</li>
        <li>Ultrametric trees (all tips equidistant from root)</li>
        <li>Proposed by Zuckerkandl and Pauling (1962)</li>
        <li>Enables dating without fossils if rate is known</li>
    </ul>
</div>
</section>

<section class="section" id="identifiability">
<h2>2. The Identifiability Problem</h2>

<h3>Non-identifiability of Rate and Time</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_NonidentifiabilityRateTime.svg" alt="Rate-time non-identifiability" style="width: 75%;">
    <div class="figure-caption">Without calibration, infinitely many combinations of rate and time produce the same genetic distances</div>
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Fundamental problem:</strong> From genetic distances alone, we cannot separate rate from time. If we double all times and halve the rate, we get the same likelihood!
    </div>
</div>

<h3>Solutions to the Identifiability Problem</h3>

<p>To separate rate and time, we need additional information:</p>

<h4>1. Node Calibrations</h4>

<p>Use fossil or biogeographic evidence to constrain node ages:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_NodeCalibration.png" alt="Node calibration" style="width: 75%;">
    <div class="figure-caption">Fossil evidence constraining the age of the ABC ancestor to 25-35 Mya</div>
</div>

<div class="practice-box">
    <h4>Node Calibration in Practice</h4>
    <ul>
        <li>Fossil provides minimum age (fossil must be younger than clade)</li>
        <li>Biogeography can provide maximum age (e.g., island age)</li>
        <li>Often specified as probability distributions (e.g., lognormal)</li>
        <li>Multiple calibrations improve precision</li>
    </ul>
</div>

<h4>2. Tip Calibrations</h4>

<p>Use samples from different time points:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_LeafCalibration.png" alt="Tip calibration" style="width: 75%;">
    <div class="figure-caption">Ancient DNA from sample C (20,000 years old) provides temporal information</div>
</div>

<div class="example-box">
    <h4>Applications of Tip Calibration</h4>
    <ul>
        <li><strong>Ancient DNA:</strong> Subfossil remains, museum specimens</li>
        <li><strong>Rapidly evolving pathogens:</strong> Virus samples from different years</li>
        <li><strong>Laboratory evolution:</strong> Samples from known time points</li>
    </ul>
</div>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Key principle:</strong> With either node or tip calibration, knowing even one absolute time allows us to estimate all other times under a strict clock.
    </div>
</div>
</section>

<section class="section" id="relaxed-clocks">
<h2>3. Relaxed Molecular Clocks</h2>

<p>The strict molecular clock is often too restrictive. Relaxed clocks allow rate variation across branches.</p>

<h3>Relaxed Clock Parameterization</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_RelaxedClockParam.png" alt="Relaxed clock parameterization" style="width: 80%;">
    <div class="figure-caption">Each branch has its own rate, converting time tree to substitution tree</div>
</div>

<div class="definition-box">
    <div class="title">Relaxed Molecular Clock</div>
    <p>Instead of a single rate $\mu$, we have a vector of rates $\vec{\mu} = (\mu_1, \mu_2, ..., \mu_{2n-2})$</p>
    <p>The substitution tree is computed as: $T = \vec{\mu} \star g$</p>
    <p>Where $\star$ denotes element-wise multiplication of rates and branch durations</p>
</div>

<h3>Identifiability Under Relaxed Clocks</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-relaxed-phylogenetics/fig_RelaxedNonidentifiabilityRateTime.png" alt="Relaxed clock identifiability" style="width: 75%;">
    <div class="figure-caption">With relaxed clocks, the identifiability problem is even more severe</div>
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Critical issue:</strong> Relaxed clocks are only identifiable through their priors! The likelihood alone cannot distinguish between fast rates with short times vs. slow rates with long times.
    </div>
</div>
</section>

<section class="section" id="bayesian-framework">
<h2>4. Bayesian Framework for Molecular Clocks</h2>

<h3>Posterior with Strict Clock</h3>

<div class="theorem-box">
    <h4>Strict Clock Posterior</h4>
    <p>Substitution tree: $T = \color{darkgreen}{\mu} \times \color{red}{g}$</p>
    
    <div class="math-block">
    $$P(\color{red}{g}, \color{darkgreen}{\mu}, \color{blue}{\Theta}|D) \propto \Pr(D|T)P(\color{red}{g}|\color{blue}{\Theta})P(\color{darkgreen}{\mu})P(\color{blue}{\Theta})$$
    </div>
    
    <p>Where:</p>
    <ul>
        <li>$\color{red}{g}$ = time tree</li>
        <li>$\color{darkgreen}{\mu}$ = clock rate</li>
        <li>$\color{blue}{\Theta}$ = tree prior parameters (as in L7 and L8)</li>
    </ul>
</div>

<h3>Posterior with Relaxed Clock</h3>

<div class="theorem-box">
    <h4>Relaxed Clock Posterior</h4>
    <p>Substitution tree: $T = \color{darkgreen}{\vec{\mu}} \star \color{red}{g}$</p>
    
    <div class="math-block">
    $$P(\color{red}{g}, \color{darkgreen}{\vec{\mu}},\color{blue}{\Theta}|D) \propto \Pr(D|T)P(\color{red}{g}|\color{blue}{\Theta})P(\color{darkgreen}{\vec{\mu}})P(\color{blue}{\Theta})$$
    </div>
    
    <p>Where $P(\color{darkgreen}{\vec{\mu}})$ is the prior for rate variation</p>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key observations:</strong>
        <ul>
            <li>The phylogenetic likelihood only depends on the substitution tree $T$: $\Pr(D|T)$</li>
            <li>The tree prior only depends on the time tree $\color{red}{g}$: $P(\color{red}{g}|\color{blue}{\Theta})$</li>
            <li>By fixing $\color{darkgreen}{\vec{\mu}} = 1$, we get a time tree in units of substitutions</li>
        </ul>
    </div>
</div>
</section>

<section class="section" id="rate-models">
<h2>5. Models of Rate Variation</h2>

<h3>Autocorrelated Models</h3>

<p>Rates evolve along the tree, with child rates similar to parent rates:</p>

<div class="definition-box">
    <div class="title">Autocorrelated Rate Model</div>
    <div class="math-block">
    $$P(\color{darkgreen}{\vec{\mu}}) = \prod_i P(\mu_i | \mu_{\text{parent}(i)})$$
    </div>
    
    <p>Common implementation: <strong>Lognormal autocorrelated model</strong></p>
    <div class="math-block">
    $$\log(\mu_i) \sim \text{Normal}(\log(\mu_{\text{parent}(i)}), \sigma \sqrt{t_i})$$
    </div>
    
    <p>Where:</p>
    <ul>
        <li>$t_i$ = time duration of branch $i$</li>
        <li>$\sigma$ = rate of evolution of rates (volatility parameter)</li>
    </ul>
</div>

<h3>Uncorrelated Models</h3>

<p>Rates are drawn independently for each branch:</p>

<div class="definition-box">
    <div class="title">Uncorrelated Rate Model</div>
    <div class="math-block">
    $$P(\color{darkgreen}{\vec{\mu}}) = \prod_i P(\mu_i | \nu)$$
    </div>
    
    <p>Common implementations:</p>
    <ul>
        <li><strong>Lognormal:</strong> $\log(\mu_i) \sim \text{Normal}(M, S)$</li>
        <li><strong>Exponential:</strong> $\mu_i \sim \text{Exponential}(\lambda)$</li>
        <li><strong>Gamma:</strong> $\mu_i \sim \text{Gamma}(\alpha, \beta)$</li>
    </ul>
</div>

<div class="comparison-box">
    <div class="comparison-column">
        <h4>Autocorrelated</h4>
        <ul>
            <li>Biologically motivated</li>
            <li>Smooth rate changes</li>
            <li>Good for closely related species</li>
            <li>Can extrapolate rates</li>
        </ul>
    </div>
    <div class="comparison-column">
        <h4>Uncorrelated</h4>
        <ul>
            <li>More flexible</li>
            <li>Allows sudden rate changes</li>
            <li>Good for diverse datasets</li>
            <li>Simpler to implement</li>
        </ul>
    </div>
</div>
</section>

<section class="section" id="advantages">
<h2>6. Advantages of Molecular Clock Models</h2>

<p>Relaxed molecular clocks offer several benefits over unconstrained models:</p>

<ol>
    <li><strong>Improved phylogenetic accuracy:</strong>
        <ul>
            <li>Rate smoothing helps identify correct topology</li>
            <li>Reduces long-branch attraction artifacts</li>
            <li>Better performance on empirical datasets</li>
        </ul>
    </li>
    
    <li><strong>Automatic rooting:</strong>
        <ul>
            <li>No need for outgroup</li>
            <li>Root position estimated from rate variation</li>
            <li>Particularly useful when outgroup is distant</li>
        </ul>
    </li>
    
    <li><strong>Temporal information:</strong>
        <ul>
            <li>Relative divergence times always available</li>
            <li>Absolute times with calibration</li>
            <li>Useful for studying evolutionary rates</li>
        </ul>
    </li>
    
    <li><strong>Integration with other models:</strong>
        <ul>
            <li>Natural combination with coalescent priors</li>
            <li>Enables epidemiological inference</li>
            <li>Links to fossil data</li>
        </ul>
    </li>
</ol>

<div class="alert alert-success">
    <i class="fas fa-check-circle"></i>
    <div>
        <strong>Best practice:</strong> Use relaxed clocks unless you have strong evidence for a strict clock. The added flexibility usually outweighs the increased parameter count.
    </div>
</div>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture answered one question: how do we put a date, with an interval, on a common
ancestor?</p>

<ol>
    <li><strong>The obstacle:</strong>
        <ul>
            <li>Sequences record genetic distance, and distance = rate × time</li>
            <li>Rate and time are non-identifiable: a fast rate over a short time and a slow
                rate over a long time give identical likelihoods</li>
        </ul>
    </li>

    <li><strong>The solution, calibration:</strong>
        <ul>
            <li><strong>Node</strong> calibration from a dated fossil</li>
            <li><strong>Tip</strong> calibration from samples of different known ages: ancient
                DNA, or a fast-evolving virus sequenced over months</li>
            <li>Either one puts the whole tree on a scale of years</li>
        </ul>
    </li>

    <li><strong>Rate variation:</strong>
        <ul>
            <li>Strict clocks assume one rate; relaxed clocks give every branch its own</li>
            <li>Relaxed clocks are usually more realistic, but add non-identifiability that
                only the priors resolve, so priors must be reported</li>
            <li>Uncorrelated draws each rate independently; autocorrelated lets rate evolve
                along the tree</li>
        </ul>
    </li>

    <li><strong>What you get out:</strong>
        <ul>
            <li>A posterior distribution of dates for every ancestor, hence credible intervals</li>
            <li>A rooted tree without needing an outgroup</li>
            <li>Dates that are conditional on the clock model, substitution model and tree prior</li>
        </ul>
    </li>
</ol>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key takeaway:</strong> Molecular clocks transform phylogenetics from estimating relationships to understanding the tempo and mode of evolution.
    </div>
</div>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Stadler et al. (2024) <em>Decoding Genomes</em> - Ch 6.4 (strict clock, time trees, calibrations)</li>
            <li>Drummond & Bouckaert (2015) "Bayesian Evolutionary Analysis with BEAST" - Chapters 6-7 (relaxed clocks in detail)</li>
            <li>Yang (2014) "Molecular Evolution: A Statistical Approach" - Chapter 7</li>
            <li>Drummond et al. (2006) "Relaxed phylogenetics and dating with confidence" - PLOS Biology</li>
            <li>Douglas et al. (2021) "Phylodynamics reveals the role of human travel and contact
                tracing in controlling the first wave of COVID-19 in four island nations" -
                <em>Virus Evolution</em> 7(2):veab052. Source of the opening figure.</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>What makes rate and time non-identifiable in molecular evolution?</li>
        <li>How do node and tip calibrations solve the identifiability problem?</li>
        <li>The SARS-CoV-2 tree in the opening figure has a calendar axis even though there are
            no fossils. What calibrates it?</li>
        <li>What's the key difference between autocorrelated and uncorrelated relaxed clocks?</li>
        <li>Why do relaxed clocks often produce better phylogenetic estimates than no-clock
            models, and what do they make you more dependent on?</li>
        <li>A paper reports a divergence date of 12.4 Mya. What else must it report before you
            can judge that number?</li>
    </ol>
</div>
</section>