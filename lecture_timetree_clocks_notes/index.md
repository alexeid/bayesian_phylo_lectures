---
layout: lecture_notes
title: "Molecular Clocks and Tree Space"
lecture_num: 11
section: bayesian_phylo
section_name: "Bayesian Phylogenetics"
previous_lecture: lecture10_coalescent_notes
next_lecture: lecture12_model_selection_notes
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 11</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Drummond & Bouckaert Ch. 6-7, Yang Ch. 7</span>
    </div>
</div>

<section class="section" id="tree-space">
<h2>1. Understanding Tree Space</h2>

<p>Before diving into molecular clocks, we need to understand the mathematical space in which phylogenetic trees exist. This "tree space" has unique geometric properties that affect how we search for optimal trees and summarize posterior distributions.</p>

<h3>Tree Space for Time Trees</h3>

<p>Consider the simplest non-trivial case: time trees for 3 taxa.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_1_treesubspace.svg" alt="Tree subspace for 3 taxa" style="width: 60%;">
    <div class="figure-caption">A two-dimensional space representing all possible time-trees for the topology ((1,2),3). The axes x and y are the two inter-coalescent intervals, with $t_{root} = x + y$</div>
</div>

<div class="definition-box">
    <div class="title">Tree Subspace Properties</div>
    <ul>
        <li>Each tree topology defines a subspace</li>
        <li>For time trees with $n$ taxa, each subspace is $(n-1)$-dimensional</li>
        <li>The dimensions correspond to node heights or inter-coalescent intervals</li>
        <li>Trees can be averaged within a subspace (arithmetic mean shown)</li>
        <li>Distances between trees can be computed (Euclidean distance shown as dashed lines)</li>
    </ul>
</div>

<h3>The Complete Tree Space</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_2_treespace.svg" alt="Complete tree space for 3 taxa" style="width: 65%;">
    <div class="figure-caption">The complete tree space for 3 taxa showing how topology subspaces connect</div>
</div>

<p>Key features of tree space:</p>
<ul>
    <li>Each non-degenerate tree topology is a two-dimensional space</li>
    <li>These subspaces meet at shared edges representing degenerate topologies</li>
    <li>The star tree (all three taxa diverge simultaneously) is a one-dimensional subspace</li>
    <li>The parameter for the star tree is just the age of the root</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> Tree space has both discrete (topology) and continuous (branch lengths/node times) components. MCMC must explore both!
    </div>
</div>

<h3>Alternative Visualizations of Tree Space</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/tSpace2d.svg" alt="Alternative tree space visualization" style="width: 70%;">
    <div class="figure-caption">Another representation of tip-labeled time-tree space showing the geometric relationships</div>
</div>

<h3>Higher-Dimensional Tree Spaces</h3>

<p>For 4 taxa, the tree space becomes more complex:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/tauSpace.svg" alt="4-taxa tree space projection" style="width: 70%;">
    <div class="figure-caption">Projection of 4-taxa tree space. The full space has 18 subspaces (only 6 shown). Each subspace is actually a 3D cube, shown as squares by fixing one dimension</div>
</div>

<div class="practice-box">
    <h4>Tree Space Complexity</h4>
    <p>As the number of taxa increases:</p>
    <ul>
        <li>3 taxa: 3 topologies, 2D subspaces</li>
        <li>4 taxa: 18 topologies (3 unrooted × 6 rootings), 3D subspaces</li>
        <li>5 taxa: 180 topologies, 4D subspaces</li>
        <li>n taxa: $(2n-3)!!$ rooted topologies, $(n-1)$D subspaces</li>
    </ul>
</div>

<h3>Implications for Phylogenetic Inference</h3>

<p>Understanding tree space helps us appreciate:</p>

<ol>
    <li><strong>Complexity of the search problem:</strong> Tree space grows super-exponentially with taxa</li>
    <li><strong>Need for specialized moves:</strong> MCMC operators must handle both discrete topology changes and continuous parameter updates</li>
    <li><strong>Challenges in summarization:</strong> Averaging trees across topologies is problematic</li>
    <li><strong>Local optima:</strong> The discrete nature creates barriers between topology subspaces</li>
</ol>
</section>

<section class="section" id="molecular-clock">
<h2>2. The Molecular Clock Hypothesis</h2>

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
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_StrictClockParam.svg" alt="Strict clock parameterization" style="width: 80%;">
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
<h2>3. The Identifiability Problem</h2>

<h3>Non-identifiability of Rate and Time</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_NonidentifiabilityRateTime.svg" alt="Rate-time non-identifiability" style="width: 75%;">
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
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_NodeCalibration.png" alt="Node calibration" style="width: 75%;">
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
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_LeafCalibration.png" alt="Tip calibration" style="width: 75%;">
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
<h2>4. Relaxed Molecular Clocks</h2>

<p>The strict molecular clock is often too restrictive. Relaxed clocks allow rate variation across branches.</p>

<h3>Relaxed Clock Parameterization</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_RelaxedClockParam.png" alt="Relaxed clock parameterization" style="width: 80%;">
    <div class="figure-caption">Each branch has its own rate, converting time tree to substitution tree</div>
</div>

<div class="definition-box">
    <div class="title">Relaxed Molecular Clock</div>
    <p>Instead of a single rate $\mu$, we have a vector of rates $\vec{\mu} = (\mu_1, \mu_2, ..., \mu_{2n-2})$</p>
    <p>The substitution tree is computed as: $T = \vec{\mu} \star g$</p>
    <p>Where $\star$ denotes element-wise multiplication of rates and branch durations</p>
</div>

<h3>Alternative Relaxed Clock Visualization</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_RelaxedClockParam2.png" alt="Alternative relaxed clock view" style="width: 80%;">
    <div class="figure-caption">Another view showing how branch-specific rates create the substitution tree</div>
</div>

<h3>Identifiability Under Relaxed Clocks</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/fig_RelaxedNonidentifiabilityRateTime.png" alt="Relaxed clock identifiability" style="width: 75%;">
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
<h2>5. Bayesian Framework for Molecular Clocks</h2>

<h3>Posterior with Strict Clock</h3>

<div class="theorem-box">
    <h4>Strict Clock Posterior</h4>
    <p>Substitution tree: $T = \textcolor{darkgreen}{\mu} \times \textcolor{red}{g}$</p>
    
    <div class="math-block">
    $$P(\textcolor{red}{g}, \textcolor{darkgreen}{\mu}, \theta|D) = \frac{1}{\Pr(D)}\Pr(D|T)P(\textcolor{red}{g}|\theta)P(\textcolor{darkgreen}{\mu})P(\theta)$$
    </div>
    
    <p>Where:</p>
    <ul>
        <li>$\textcolor{red}{g}$ = time tree</li>
        <li>$\textcolor{darkgreen}{\mu}$ = clock rate</li>
        <li>$\theta$ = other model parameters</li>
    </ul>
</div>

<h3>Posterior with Relaxed Clock</h3>

<div class="theorem-box">
    <h4>Relaxed Clock Posterior</h4>
    <p>Substitution tree: $T = \textcolor{darkgreen}{\vec{\mu}} \star \textcolor{red}{g}$</p>
    
    <div class="math-block">
    $$P(\textcolor{red}{g}, \textcolor{darkgreen}{\vec{\mu}},\theta|D) = \frac{1}{\Pr(D)}\Pr(D|T)P(\textcolor{red}{g}|\theta)P(\textcolor{darkgreen}{\vec{\mu}})P(\theta)$$
    </div>
    
    <p>Where $P(\textcolor{darkgreen}{\vec{\mu}})$ is the prior for rate variation</p>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key observations:</strong>
        <ul>
            <li>The phylogenetic likelihood only depends on the substitution tree $T$: $\Pr(D|T)$</li>
            <li>The tree prior only depends on the time tree $\textcolor{red}{g}$: $P({\textcolor{red}{g}}|\theta)$</li>
            <li>By fixing $\textcolor{darkgreen}{\vec{\mu}} = 1$, we get a time tree in units of substitutions</li>
        </ul>
    </div>
</div>
</section>

<section class="section" id="rate-models">
<h2>6. Models of Rate Variation</h2>

<h3>Autocorrelated Models</h3>

<p>Rates evolve along the tree, with child rates similar to parent rates:</p>

<div class="definition-box">
    <div class="title">Autocorrelated Rate Model</div>
    <div class="math-block">
    $$P(\textcolor{darkgreen}{\vec{\mu}}) = \prod_i P(\mu_i | \mu_{\text{parent}(i)})$$
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
    $$P(\textcolor{darkgreen}{\vec{\mu}}) = \prod_i P(\mu_i | \nu)$$
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

<section class="section" id="parameter-counting">
<h2>7. Parameter Dimensions</h2>

<p>Understanding the number of parameters helps us appreciate model complexity:</p>

<h3>Unrooted Tree (No Clock)</h3>
<ul>
    <li>$2n-3$ branch lengths (one per branch)</li>
    <li>Total: $2n-3$ parameters</li>
</ul>

<h3>Strict Molecular Clock</h3>
<ul>
    <li>$n-1$ node heights (internal nodes)</li>
    <li>1 clock rate $\mu$</li>
    <li>Total: $n$ parameters</li>
</ul>

<h3>Relaxed Molecular Clock</h3>
<ul>
    <li>$n-1$ node heights</li>
    <li>$2n-2$ rate parameters (one per branch)</li>
    <li>Total: $3n-3$ parameters</li>
</ul>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Overparameterization:</strong> Relaxed clocks have more parameters than unrooted trees! They are only identifiable through their priors.
    </div>
</div>
</section>

<section class="section" id="mcmc-differences">
<h2>8. MCMC Implementation Differences</h2>

<h3>MrBayes Approach (No Clock)</h3>

<p>MrBayes samples unrooted trees without molecular clock constraints:</p>

<ul>
    <li>Operators must connect any unrooted tree to any other</li>
    <li>Branch lengths can be any positive value</li>
    <li>No temporal constraints</li>
    <li>Simpler operators but no time information</li>
</ul>

<h3>BEAST Approach (With Clock)</h3>

<p>BEAST samples rooted time trees with clock constraints:</p>

<ul>
    <li>Operators must maintain temporal constraints</li>
    <li>All tips fixed at their sampling times</li>
    <li>Internal nodes must be older than descendants</li>
    <li>Natural to work with node heights rather than branch lengths</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureRelaxedPhylogenetics/ClockConstraint.png" alt="Clock constraints in MCMC" style="width: 70%;">
    <div class="figure-caption">MCMC operators must respect the constraint that parent nodes are older than children</div>
</div>

<div class="practice-box">
    <h4>Clock-Constrained Operators</h4>
    <p>Examples of operators that maintain temporal constraints:</p>
    <ul>
        <li><strong>Scale:</strong> Multiply all node heights by a factor</li>
        <li><strong>Subtree slide:</strong> Move subtree up/down while maintaining order</li>
        <li><strong>Wilson-Balding:</strong> Prune and regraft with valid node times</li>
        <li><strong>Uniform node height:</strong> Sample new height within valid bounds</li>
    </ul>
</div>
</section>

<section class="section" id="advantages">
<h2>9. Advantages of Molecular Clock Models</h2>

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

<p>This lecture covered two interrelated topics crucial for modern phylogenetics:</p>

<ol>
    <li><strong>Tree space geometry:</strong>
        <ul>
            <li>Trees exist in a complex space with discrete and continuous components</li>
            <li>Each topology defines a subspace of dimension $n-1$</li>
            <li>Understanding tree space helps design better algorithms</li>
        </ul>
    </li>
    
    <li><strong>Molecular clocks:</strong>
        <ul>
            <li>Fundamental equation: distance = rate × time</li>
            <li>Rate and time are non-identifiable without calibration</li>
            <li>Strict clocks assume constant rates</li>
            <li>Relaxed clocks allow rate variation</li>
        </ul>
    </li>
    
    <li><strong>Bayesian implementation:</strong>
        <ul>
            <li>Priors essential for identifiability</li>
            <li>Different parameterizations for different software</li>
            <li>MCMC must respect temporal constraints</li>
        </ul>
    </li>
    
    <li><strong>Practical advantages:</strong>
        <ul>
            <li>Better tree estimation</li>
            <li>Automatic rooting</li>
            <li>Temporal information</li>
            <li>Integration with other evolutionary models</li>
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
            <li>Drummond & Bouckaert (2015) "Bayesian Evolutionary Analysis with BEAST" - Chapters 6-7</li>
            <li>Yang (2014) "Molecular Evolution: A Statistical Approach" - Chapter 7</li>
            <li>Drummond et al. (2006) "Relaxed phylogenetics and dating with confidence" - PLOS Biology</li>
            <li>Billera et al. (2001) "Geometry of the space of phylogenetic trees" - Advances in Applied Mathematics</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why is tree space not a simple Euclidean space?</li>
        <li>What makes rate and time non-identifiable in molecular evolution?</li>
        <li>How do node and tip calibrations solve the identifiability problem?</li>
        <li>What's the key difference between autocorrelated and uncorrelated relaxed clocks?</li>
        <li>Why do relaxed clocks often produce better phylogenetic estimates than no-clock models?</li>
    </ol>
</div>
</section>
