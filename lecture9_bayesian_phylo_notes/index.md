---
layout: lecture_notes
title: "MCMC in Phylogenetics"
lecture_num: 9
section: bayesian_phylo
section_name: "Bayesian Phylogenetics"
previous_lecture: lecture8_bayesian_inference_notes
next_lecture: lecture10_molecular_clock_notes
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 9</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Yang Ch. 7, Drummond & Bouckaert Ch. 4-5</span>
    </div>
</div>

<section class="section" id="phylogenetic-likelihood">
<h2>1. The Phylogenetic Likelihood</h2>

<p>At the heart of Bayesian phylogenetic inference is the phylogenetic likelihood:</p>

<div class="math-block">
$$\Pr(D|T, \mu)$$
</div>

<p>Where:</p>
<ul>
    <li>$D$ is a multiple sequence alignment of $n$ sequences</li>
    <li>$T$ is a phylogenetic tree with $n$ leaves</li>
    <li>$\mu$ are the parameters of the chosen CTMC-based model of sequence evolution</li>
</ul>

<h3>Computing the Likelihood</h3>

<p>The phylogenetic likelihood is computed using <strong>Felsenstein's pruning algorithm</strong> (covered in Lecture 7). Key points:</p>

<ul>
    <li>The likelihood is a product of site pattern probabilities</li>
    <li>Sites are assumed to evolve independently</li>
    <li>This assumption allows for obvious generalizations:
        <ul>
            <li>Multiple alignments that share a tree</li>
            <li>Phylogenetic networks where different sites evolve under distinct "local" trees</li>
        </ul>
    </li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> As Bayesians, we need a probability distribution for $T$! The likelihood alone is not sufficient.
    </div>
</div>
</section>

<section class="section" id="phylogenetic-posterior">
<h2>2. The Phylogenetic Posterior</h2>

<p>Standard application of Bayes' theorem gives the posterior:</p>

<div class="math-block">
$$P(T,\mu,\theta|D) = \frac{\Pr(D|T,\mu, \theta)P(T,\mu,\theta)}{\Pr(D)}$$
</div>

<h3>Factorizing the Posterior</h3>

<p>Most phylogenetic models make two key assumptions:</p>
<ol>
    <li>$\theta$ only affects the probability of the data via the tree $T$</li>
    <li>$\mu$ has no effect on the tree branching process</li>
</ol>

<p>These assumptions lead to the factorized form:</p>

<div class="theorem-box">
    <h4>Phylogenetic Posterior</h4>
    <div class="math-block">
    $$P(T,\mu,\theta|D) = \frac{1}{\Pr(D)}\Pr(D|T,\mu)P(T|\theta)P(\mu,\theta)$$
    </div>
    <p>Where:</p>
    <ul>
        <li>$P(T|\theta)$ is the "tree prior" parameterized by $\theta$</li>
        <li>$P(\mu,\theta)$ are the parameter priors</li>
        <li>$\Pr(D)$ is the marginal likelihood (evidence)</li>
    </ul>
</div>

<div class="practice-box">
    <h4>Questions to Consider</h4>
    <ul>
        <li>What is $\Pr(D)$ and why is it difficult to compute?</li>
        <li>Is the tree prior really a prior? (i.e., does it depend on the data?)</li>
    </ul>
</div>

<h3>The Neutrality Assumption</h3>

<p>The factorization above implicitly assumes that our alignment could have been produced through the following process:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/neutrality.svg" alt="Neutral evolution process" style="width: 80%;">
    <div class="figure-caption">Three-step process: (1) Generate tree from branching process, (2) Evolve sequences along branches, (3) Observe sequences at tips</div>
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Important:</strong> Separating the process of tree generation from that of sequence evolution implies neutrality. This is a fundamental assumption in most phylogenetic analyses.
    </div>
</div>
</section>

<section class="section" id="tree-priors">
<h2>3. Tree Priors</h2>

<p>Tree priors allow us to specify a generative model for the genealogy. While this model may not involve genetic evolution, it may depend on:</p>
<ul>
    <li>Speciation rates</li>
    <li>Population sizes</li>
    <li>Migration rates</li>
    <li>Extinction rates</li>
    <li>Sampling processes</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> A huge fraction of phylogenetics inference research is focused on developing and efficiently implementing tree priors!
    </div>
</div>

<h3>The Yule Model for Speciation</h3>

<p>The simplest tree prior is the Yule model (Yule, 1924):</p>

<div class="definition-box">
    <div class="title">Yule Process</div>
    <ul>
        <li>Constant rate branching process</li>
        <li>Branching occurs uniformly across extant lineages at rate $\lambda$ per lineage per unit time</li>
        <li>Chemical kinetics formalism: $X \overset{\lambda}{\longrightarrow} 2X$</li>
    </ul>
</div>

<p>The number of lineages $k$ evolves under the master equation:</p>
<div class="math-block">
$$\dot{p}(k,t) = \lambda (k-1)p(k-1,t) - \lambda k p(k,t)$$
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/YuleTree.svg" alt="Yule tree example" style="width: 70%;">
    <div class="figure-caption">Example of a tree generated under the Yule process</div>
</div>

<h3>Birth-Death(-Sampling) Priors</h3>

<p>A more realistic model accounts for both speciation and extinction:</p>

<div class="definition-box">
    <div class="title">Birth-Death Process</div>
    <ul>
        <li>Generalization of Yule process to account for extinction and sampling</li>
        <li>Linear speciation, extinction, and sampling rates</li>
        <li>Prior is over <em>sampled</em> trees: assumes unobserved full tree</li>
        <li>Groundwork largely due to Tanja Stadler (ETH Zürich)</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/StadlerSTT.svg" alt="Birth-death-sampling tree" style="width: 80%;">
    <div class="figure-caption">Birth-death tree showing sampled (solid) and unsampled (dashed) lineages</div>
</div>

<h3>Coalescent Priors</h3>

<p>For modeling gene trees within populations:</p>

<div class="definition-box">
    <div class="title">Coalescent Process</div>
    <ul>
        <li>Original theory due to Kingman (1980)</li>
        <li>Models the shape of <strong>gene trees</strong> within a species</li>
        <li>Can be obtained as the limit of population genetic models (Wright-Fisher, Moran)</li>
        <li>Provides crucial link between tree shape and population size</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/MEPs.svg" alt="Coalescent effective population size" style="width: 85%;">
    <div class="figure-caption">Relationship between tree shape and effective population size under the coalescent</div>
</div>

<h3>Multi-species Coalescent Priors</h3>

<p>Hierarchical models that embed gene trees within species trees:</p>

<ul>
    <li>Species tree described using a birth-death prior</li>
    <li>Gene trees described by coalescent priors for populations which subdivide at speciation events</li>
    <li>Accounts for incomplete lineage sorting</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/MSC.jpg" alt="Multi-species coalescent" style="width: 80%;">
    <div class="figure-caption">Gene trees (thin lines) embedded within a species tree (thick lines)</div>
</div>
</section>

<section class="section" id="mcmc-theory">
<h2>4. MCMC in Tree Space</h2>

<h3>Basic MCMC Theory Review</h3>

<p>MCMC works by simulating a stochastic trajectory according to:</p>
<div class="math-block">
$$p_{i+1}(x)=\int p_i(x')W(x|x')\mathrm{d}x'$$
</div>

<p>Where the transition kernel is:</p>
<div class="math-block">
$$W(x'|x) = q(x'|x)\alpha(x'|x) + \left(1-\int q(x''|x)\alpha(x''|x)\mathrm{d}x''\right)\delta(x'-x)$$
</div>

<h4>Detailed Balance and Acceptance Probability</h4>

<p>A sufficient condition for $\pi(x)$ to be the equilibrium distribution is detailed balance:</p>
<div class="math-block">
$$\pi(x')q(x|x')\alpha(x|x')=\pi(x)q(x'|x)\alpha(x'|x)$$
</div>

<p>This is satisfied by the Metropolis-Hastings acceptance probability:</p>

<div class="theorem-box">
    <h4>Metropolis-Hastings Acceptance</h4>
    <div class="math-block">
    $$\alpha(x'|x)=\min\left[1, \frac{\pi(x')}{\pi(x)}\times\frac{q(x|x')}{q(x'|x)}\right]$$
    </div>
</div>

<h4>Key Properties for Tree Space</h4>

<ul>
    <li>By tuning the acceptance probability, <strong>any</strong> probability distribution can be targeted</li>
    <li>Only the ratio $\pi(x')/\pi(x)$ appears: normalization need not be known</li>
    <li>The only requirement for $q(x'|x)$ is <strong>irreducibility</strong>: random walks must explore the entire state space</li>
    <li>For high-dimensional state spaces, $W(x'|x)$ is decomposed into several distinct operators: $W(x'|x)=\sum_j W_j(x'|x)$</li>
    <li>The ratio $q(x|x')/q(x'|x)$ is the <strong>Hastings ratio</strong></li>
</ul>
</section>

<section class="section" id="tree-operators">
<h2>5. Proposal Distributions for Trees</h2>

<p>We need to identify a set of proposals $q_j(x'|x)$ when $x$ is a point in the space of rooted time trees.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/TreeOperators.svg" alt="Tree operators" style="width: 70%;">
    <div class="figure-caption">Common tree operators: (A) Subtree slide, (B) Wilson-Balding, (C) Exchange, (D) Scale</div>
</div>

<h3>Common Tree Operators</h3>

<dl>
    <dt><strong>Subtree Slide</strong></dt>
    <dd>Move a subtree up or down along a branch, changing node heights</dd>
    
    <dt><strong>Wilson-Balding</strong></dt>
    <dd>Prune a subtree and regraft it elsewhere, sampling new node times</dd>
    
    <dt><strong>Narrow/Wide Exchange</strong></dt>
    <dd>Swap two subtrees that share a grandparent (narrow) or any two subtrees (wide)</dd>
    
    <dt><strong>Node Height Changes</strong></dt>
    <dd>Modify the height of internal nodes while maintaining time consistency</dd>
    
    <dt><strong>Tree Scaling</strong></dt>
    <dd>Scale all node heights by a common factor</dd>
</dl>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Challenge:</strong> Each operator must maintain the constraint that parent nodes are older than their children (time consistency).
    </div>
</div>

<h3>Hastings Ratios for Tree Operators</h3>

<p>Computing the Hastings ratio for tree operators can be complex:</p>

<ul>
    <li>Must account for changes in the number of possible attachment points</li>
    <li>Node height proposals may have different forward/reverse probabilities</li>
    <li>Some operators (e.g., uniform tree scaling) have trivial Hastings ratios</li>
</ul>

<div class="practice-box">
    <h4>Example: Subtree Slide Hastings Ratio</h4>
    <p>For a subtree slide that moves node $v$ from time $t$ to $t'$:</p>
    <ul>
        <li>If heights are proposed uniformly in valid ranges</li>
        <li>Forward range: $(t_{\text{child}}, t_{\text{parent}})$</li>
        <li>Reverse range: $(t'_{\text{child}}, t'_{\text{parent}})$</li>
        <li>Hastings ratio: $\frac{t'_{\text{parent}} - t'_{\text{child}}}{t_{\text{parent}} - t_{\text{child}}}$</li>
    </ul>
</div>
</section>

<section class="section" id="convergence">
<h2>6. Convergence and Mixing</h2>

<h3>Stopping Criteria</h3>

<p>Two critical questions for phylogenetic MCMC:</p>
<ol>
    <li>How can we tell when the chain has reached equilibrium?</li>
    <li>How do we know when we've collected enough samples?</li>
</ol>

<h4>Effective Sample Size (ESS)</h4>

<p>One approach is to compute ESS for each parameter and tree summary statistics:</p>

<ul>
    <li>ESS estimates the number of independent samples</li>
    <li>Common statistics to monitor:
        <ul>
            <li>Tree height (age of root)</li>
            <li>Tree length (sum of branch lengths)</li>
            <li>Model parameters (substitution rates, etc.)</li>
        </ul>
    </li>
    <li>Rule of thumb: ESS > 200 for all parameters</li>
</ul>

<h4>Multiple Independent Runs</h4>

<div class="alert alert-success">
    <i class="fas fa-check-circle"></i>
    <div>
        <strong>Best Practice:</strong> Always run multiple independent chains with different starting points. Convergence to the same distribution is necessary (but not sufficient) for equilibrium.
    </div>
</div>

<h3>Assessing Tree Convergence</h3>

<p>Trees present special challenges for convergence assessment:</p>

<ul>
    <li>Cannot plot simple traces of "the tree"</li>
    <li>Need specialized statistics for tree space</li>
    <li>Common approaches:
        <ul>
            <li>Compare split frequencies between runs</li>
            <li>Average standard deviation of split frequencies (ASDSF)</li>
            <li>Tree distance metrics between samples</li>
        </ul>
    </li>
</ul>

<h4>AWTY (Are We There Yet?)</h4>

<p>Software that applies multiple statistics to assess tree convergence:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/rwty.jpeg" alt="AWTY convergence diagnostics" style="width: 80%;">
    <div class="figure-caption">AWTY/RWTY visualization of convergence diagnostics across multiple runs</div>
</div>

<p>Key diagnostics:</p>
<ul>
    <li>Split frequency correlations between runs</li>
    <li>Cumulative split frequencies over time</li>
    <li>Tree space visualization using multidimensional scaling</li>
</ul>
</section>

<section class="section" id="postprocessing">
<h2>7. Post-processing MCMC Output</h2>

<h3>Parameter Samples</h3>

<p>Logs of individual parameters can be considered samples from marginal posteriors:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture9/tracer.png" alt="Tracer parameter analysis" style="width: 80%;">
    <div class="figure-caption">Tracer software showing parameter traces and marginal distributions</div>
</div>

<p>Common analyses:</p>
<ul>
    <li>Marginal density estimation</li>
    <li>95% credible intervals</li>
    <li>Mean/median estimates</li>
    <li>Correlation between parameters</li>
</ul>

<h3>Tree Samples</h3>

<h4>Summary Statistics</h4>

<p>Extract specific information from sampled trees:</p>
<ul>
    <li>Age of MRCA for clades of interest</li>
    <li>Posterior probabilities of clades</li>
    <li>Branch length distributions</li>
    <li>Tree balance statistics</li>
</ul>

<h4>Summary Trees</h4>

<p>Different approaches to produce a single "summary" tree:</p>

<dl>
    <dt><strong>Strict Consensus</strong></dt>
    <dd>Include only clades that appear in ALL sampled trees</dd>
    
    <dt><strong>Majority Rule Consensus</strong></dt>
    <dd>Include clades that appear in >50% of sampled trees</dd>
    
    <dt><strong>Maximum Clade Credibility (MCC) Tree</strong></dt>
    <dd>The sampled topology for which the product of posterior clade probabilities is maximized</dd>
</dl>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>In BEAST:</strong> Summary trees are produced using the MCC tree method via the program TreeAnnotator.
    </div>
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Caution:</strong> No summary tree algorithm is perfect! They may be misleading when the posterior is multimodal. Consider reporting uncertainty using posterior probabilities.
    </div>
</div>
</section>

<section class="section" id="software">
<h2>8. Bayesian Phylogenetic Software</h2>

<h3>General Purpose Software</h3>

<dl>
    <dt><strong>MrBayes</strong> (Huelsenbeck and Ronquist, 2001)</dt>
    <dd>
        <ul>
            <li>Early command-line program for phylogenetic inference</li>
            <li>Implements standard substitution models and tree priors</li>
            <li>Widely used and well-tested</li>
        </ul>
    </dd>
    
    <dt><strong>RevBayes</strong> (Höhna et al., 2016)</dt>
    <dd>
        <ul>
            <li>R-like syntax for specifying phylogenetic models</li>
            <li>Highly flexible model specification</li>
            <li>Growing ecosystem of tutorials and methods</li>
        </ul>
    </dd>
    
    <dt><strong>BEAST/BEAST 2</strong> (Drummond and Rambaut, 2007; Bouckaert et al., 2014)</dt>
    <dd>
        <ul>
            <li>XML specification of phylogenetic models</li>
            <li>Extensible through packages</li>
            <li>Strong focus on time-calibrated trees</li>
            <li>Integrated with other tools (BEAUti, Tracer, TreeAnnotator)</li>
        </ul>
    </dd>
</dl>

<h3>Specialized Software</h3>

<dl>
    <dt><strong>MIGRATE</strong></dt>
    <dd>Performs inference under the Structured Coalescent (subpopulation sizes, migration rates, ancestral locations)</dd>
    
    <dt><strong>ClonalFrame/ClonalOrigin</strong></dt>
    <dd>Infer bacterial Ancestral Recombination Graphs (generalizations of trees when recombination is present)</dd>
</dl>

<div class="tools-box">
    <h4>Software Ecosystem</h4>
    <ul>
        <li><strong>BEAUti:</strong> GUI for creating BEAST XML files</li>
        <li><strong>Tracer:</strong> MCMC trace analysis and diagnostics</li>
        <li><strong>FigTree:</strong> Tree visualization and annotation</li>
        <li><strong>DensiTree:</strong> Visualizing sets of trees</li>
        <li><strong>SPREAD:</strong> Spatial phylogenetic reconstruction</li>
    </ul>
</div>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture covered the practical aspects of Bayesian phylogenetic inference using MCMC:</p>

<ol>
    <li><strong>Phylogenetic posterior:</strong> Combines tree likelihood with tree priors under neutrality assumption</li>
    
    <li><strong>Tree priors:</strong> 
        <ul>
            <li>Yule process (pure birth)</li>
            <li>Birth-death-sampling models</li>
            <li>Coalescent and multi-species coalescent</li>
        </ul>
    </li>
    
    <li><strong>MCMC in tree space:</strong>
        <ul>
            <li>Requires specialized operators</li>
            <li>Must maintain time consistency</li>
            <li>Complex Hastings ratios</li>
        </ul>
    </li>
    
    <li><strong>Convergence assessment:</strong>
        <ul>
            <li>ESS for parameters and tree statistics</li>
            <li>Multiple independent runs essential</li>
            <li>Specialized diagnostics for trees</li>
        </ul>
    </li>
    
    <li><strong>Post-processing:</strong>
        <ul>
            <li>Parameter estimation straightforward</li>
            <li>Tree summarization challenging</li>
            <li>Report uncertainty, not just point estimates</li>
        </ul>
    </li>
</ol>

<div class="alert alert-success">
    <i class="fas fa-key"></i>
    <div>
        <strong>Key takeaways:</strong>
        <ul>
            <li>Tree priors link tree shape to biological processes</li>
            <li>MCMC makes Bayesian phylogenetics computationally feasible</li>
            <li>Convergence assessment is crucial but challenging</li>
            <li>No single summary can capture complex posteriors</li>
        </ul>
    </div>
</div>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Felsenstein (2004) "Inferring Phylogenies" - Chapters 26-27</li>
            <li>Drummond & Bouckaert (2015) "Bayesian Evolutionary Analysis with BEAST" - Chapters 4-5</li>
            <li>Yang (2014) "Molecular Evolution: A Statistical Approach" - Chapter 7</li>
            <li>Höhna et al. (2016) "RevBayes: Bayesian phylogenetic inference" - Systematic Biology</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why does the phylogenetic posterior factorization imply neutral evolution?</li>
        <li>What's the difference between birth-death and coalescent tree priors?</li>
        <li>Why do we need specialized operators for tree space MCMC?</li>
        <li>What makes ESS a useful but imperfect convergence diagnostic?</li>
        <li>Why might an MCC tree be misleading for multimodal posteriors?</li>
    </ol>
</div>
</section>
