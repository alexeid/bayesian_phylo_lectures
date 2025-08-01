---
layout: lecture_notes
title: "The Coalescent"
lecture_num: 10
section: bayesian_phylo
section_name: "Bayesian Phylogenetics"
previous_lecture: lecture9_mcmc_phylogenetics
next_lecture: lecture11_molecular_clock_notes
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 10</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Wakeley Ch. 1-3, Hein et al. Ch. 3-4</span>
    </div>
</div>

<section class="section" id="introduction">
<h2>1. Introduction to the Coalescent</h2>

<p>The coalescent is one of the most important theoretical frameworks in population genetics and molecular evolution. It provides a mathematical description of how genetic lineages merge backward in time.</p>

<div class="definition-box">
    <div class="title">The Coalescent</div>
    <p>Data: a <span style="color: red;">small genetic sample</span> from a <span style="color: red;">large background population</span></p>
    
    <p>The coalescent:</p>
    <ul>
        <li>Is a model of the ancestral relationships of a sample of individuals taken from a larger population</li>
        <li>Describes a probability distribution on ancestral genealogies (trees) given a population history, N(t)</li>
        <li>Can convert information from ancestral genealogies into information about population history and vice versa</li>
        <li>Is a model of ancestral genealogies, not sequences, and its simplest form assumes neutral evolution</li>
        <li>Can be thought of as a prior on the tree, in a Bayesian setting</li>
    </ul>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> The coalescent allows us to link observable patterns in genetic data to the demographic history of populations.
    </div>
</div>

<h3>Why the Coalescent Matters</h3>

<p>The coalescent framework is crucial because it:</p>
<ul>
    <li>Provides a null model for genetic variation under neutrality</li>
    <li>Enables inference of population parameters from genetic data</li>
    <li>Forms the basis for many modern population genetic analyses</li>
    <li>Connects microevolutionary processes to macroevolutionary patterns</li>
</ul>
</section>

<section class="section" id="wright-fisher">
<h2>2. Theoretical Population Genetics Foundation</h2>

<h3>The Wright-Fisher Model</h3>

<p>Most of theoretical population genetics is based on the idealized Wright-Fisher model of population, which makes several simplifying assumptions:</p>

<div class="definition-box">
    <div class="title">Wright-Fisher Model Assumptions</div>
    <ul>
        <li><strong>Constant population size N</strong></li>
        <li><strong>Discrete generations</strong> (no overlapping generations)</li>
        <li><strong>Complete mixing</strong> (random mating)</li>
        <li><strong>Neutral evolution</strong> (no selection)</li>
        <li><strong>No mutation</strong> (in the basic model)</li>
        <li><strong>No migration</strong> (closed population)</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture10/wrightFisher.png" alt="Wright-Fisher model" style="width: 50%;">
    <div class="figure-caption">The Wright-Fisher model: each generation is formed by random sampling with replacement from the previous generation</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> For the purposes of this presentation, the population will be assumed to be haploid, as is the case for many pathogens. The diploid case follows similar principles with adjusted parameters.
    </div>
</div>

<h3>From Forward to Backward in Time</h3>

<p>Traditional population genetics works forward in time, tracking allele frequencies through generations. The coalescent takes a different approach:</p>

<ul>
    <li><strong>Forward in time:</strong> Track all individuals and their descendants</li>
    <li><strong>Backward in time:</strong> Track only the ancestors of the sample</li>
</ul>

<p>This backward-time approach is computationally efficient because:</p>
<ul>
    <li>We only track lineages that contribute to the present-day sample</li>
    <li>The number of lineages decreases as we go back in time</li>
    <li>We can ignore the vast majority of the population that left no descendants in our sample</li>
</ul>
</section>

<section class="section" id="kingman">
<h2>3. Kingman's n-Coalescent</h2>

<p>John Kingman's groundbreaking work in 1982 established the mathematical foundation for coalescent theory.</p>

<div class="definition-box">
    <div class="title">Kingman's n-Coalescent</div>
    <p>Consider tracing the ancestry of a sample of $k$ individuals from the present, back into the past. This process eventually coalesces to a single common ancestor (concestor) of the sample.</p>
    
    <p>Kingman's n-coalescent describes the statistical properties of such an ancestry when $k$ is small compared to the total population size $N$.</p>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture10/wfCoalescent3.png" alt="Coalescent process" style="width: 60%;">
    <div class="figure-caption">Tracing lineages backward in time until they coalesce to a common ancestor</div>
</div>

<h3>The Coalescence of Two Lineages</h3>

<p>Let's start with the simplest case: two randomly sampled individuals from a population of size $N$.</p>

<div class="theorem-box">
    <h4>Two-Lineage Coalescence</h4>
    <ul>
        <li>By perfect mixing, the probability they share a common ancestor in the previous generation is $1/N$</li>
        <li>The probability the common ancestor is $t$ generations back is:
            <div class="math-block">
            $$\Pr(t) = \frac{1}{N}\left(1-\frac{1}{N}\right)^{t-1}$$
            </div>
        </li>
        <li>This is a geometric distribution with success rate $\lambda = 1/N$</li>
        <li>Mean time to coalescence: $E[t] = N$ generations</li>
        <li>Variance: $\text{Var}[t] = N^2(1-1/N) \approx N^2$ for large $N$</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture10/wfCoalescent2.png" alt="Two lineage coalescence" style="width: 50%;">
    <div class="figure-caption">Two lineages coalescing in the Wright-Fisher model</div>
</div>

<h3>The Coalescence of k Lineages</h3>

<p>With $k$ lineages, the analysis becomes more complex but follows similar principles:</p>

<div class="theorem-box">
    <h4>k-Lineage Coalescence</h4>
    <p>With $k$ lineages, there are $\binom{k}{2} = \frac{k(k-1)}{2}$ possible pairs that may coalesce.</p>
    
    <ul>
        <li>Coalescence rate: $\lambda_k = \binom{k}{2}/N$</li>
        <li>Mean time to first coalescence:
            <div class="math-block">
            $$E[t_k] = \frac{N}{\binom{k}{2}} = \frac{2N}{k(k-1)}$$
            </div>
        </li>
        <li>After coalescence, we have $k-1$ lineages remaining</li>
    </ul>
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Important assumption:</strong> This implicitly assumes that $N$ is much larger than $O(k^2)$, so that the probability of two coalescent events in the same generation is negligible.
    </div>
</div>

<h3>The Complete Coalescent Process</h3>

<p>The complete coalescent process for a sample of $n$ individuals involves successive coalescence events:</p>

<table class="coalescent-table">
    <tr>
        <th>Lineages</th>
        <th>Coalescence Rate</th>
        <th>Expected Time</th>
    </tr>
    <tr>
        <td>$n → n-1$</td>
        <td>$\binom{n}{2}/N$</td>
        <td>$\frac{2N}{n(n-1)}$</td>
    </tr>
    <tr>
        <td>$n-1 → n-2$</td>
        <td>$\binom{n-1}{2}/N$</td>
        <td>$\frac{2N}{(n-1)(n-2)}$</td>
    </tr>
    <tr>
        <td>...</td>
        <td>...</td>
        <td>...</td>
    </tr>
    <tr>
        <td>$3 → 2$</td>
        <td>$3/N$</td>
        <td>$N/3$</td>
    </tr>
    <tr>
        <td>$2 → 1$</td>
        <td>$1/N$</td>
        <td>$N$</td>
    </tr>
</table>

<p>Total expected time to the most recent common ancestor (TMRCA):</p>
<div class="math-block">
$$E[T_{MRCA}] = 2N\sum_{k=2}^n \frac{1}{k(k-1)} = 2N\left(1 - \frac{1}{n}\right)$$
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key result:</strong> As $n → ∞$, $E[T_{MRCA}] → 2N$. The expected TMRCA approaches $2N$ generations regardless of sample size!
    </div>
</div>
</section>

<section class="section" id="continuous-time">
<h2>4. The Coalescent as a Continuous-Time Process</h2>

<h3>From Discrete to Continuous Time</h3>

<p>As the population size $N$ becomes large, the discrete-time Wright-Fisher model converges to a continuous-time process:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture10/distribution_comparison.png" alt="Geometric to exponential" style="width: 65%;">
    <div class="figure-caption">The geometric distribution converges to the exponential distribution as population size increases</div>
</div>

<h3>The Coalescent as a Diffusion Approximation</h3>

<p>Kingman (1982) showed that as $N$ grows, the coalescent process converges to a continuous-time Markov chain.</p>

<div class="theorem-box">
    <h4>Continuous-Time Coalescent</h4>
    <p>For $k$ lineages, the waiting time until the next coalescence follows an exponential distribution:</p>
    
    <div class="math-block">
    $$f(t_k) = \frac{\binom{k}{2}}{N}\exp\left(-\frac{\binom{k}{2}t_k}{N}\right)$$
    </div>
    
    <p>For a <em>specific</em> pair of lineages to coalesce:</p>
    
    <div class="math-block">
    $$f(t_k) = \frac{1}{N}\exp\left(-\frac{\binom{k}{2}t_k}{N}\right)$$
    </div>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture10/wrightFisherToTree.png" alt="Wright-Fisher to tree" style="width: 60%;">
    <div class="figure-caption">From Wright-Fisher genealogy to coalescent tree representation</div>
</div>

</section>

<section class="section" id="coalescent-density">
<h2>5. The Coalescent Density</h2>

<h3>Probability Density for a Genealogy</h3>

<p>For a genealogy $g$ with $n$ samples and coalescent times $\mathbf{t} = \{t_2, t_3, \ldots, t_n\}$, we can write the probability density:</p>

<div class="theorem-box">
    <h4>Coalescent Density Function</h4>
    <div class="math-block">
    $$P(g|N) = \frac{1}{N^{n-1}}\prod_{k=2}^n\exp\left(-\frac{\binom{k}{2}t_k}{N}\right)$$
    </div>
    
    <p>Where:</p>
    <ul>
        <li>$t_k$ is the time interval during which there are $k$ lineages</li>
        <li>The factor $1/N$ appears for each coalescence event (probability of specific pair coalescing)</li>
        <li>The exponential term accounts for the waiting time with $k$ lineages</li>
    </ul>
</div>

<div class="practice-box">
    <h4>Example: Three-Sample Genealogy</h4>
    <p>For $n = 3$ samples with coalescence times $t_3$ (3→2 lineages) and $t_2$ (2→1 lineages):</p>
    
    <div class="math-block">
    $$P(g|N) = \frac{1}{N^2} \exp\left(-\frac{3t_3}{N}\right) \exp\left(-\frac{t_2}{N}\right)$$
    </div>
    
    <p>This shows how both topology and branch lengths contribute to the genealogy probability.</p>
</div>

<h3>Properties of the Coalescent Density</h3>

<ul>
    <li><strong>Factorization:</strong> The density factorizes over coalescence intervals</li>
    <li><strong>Markov property:</strong> Given $k$ lineages, future coalescence is independent of past</li>
    <li><strong>Exchangeability:</strong> All labeled topologies are equally likely under the standard coalescent</li>
</ul>
</section>

<section class="section" id="variable-population">
<h2>6. The Coalescent with Variable Population Size</h2>

<p>Real populations rarely maintain constant size. The coalescent can be generalized to handle time-varying population sizes.</p>

<h3>Variable Population Size Coalescent</h3>

<p>Griffiths and Tavaré (1994) showed that for population size $N(t)$ varying with time:</p>

<div class="theorem-box">
    <h4>Coalescent Density with Variable N(t)</h4>
    <p>The probability density for the first coalescence event at time $t$ given $n$ lineages:</p>
    
    <div class="math-block">
    $$f(t) = \frac{\binom{n}{2}}{N(t)} \exp\left(-\int_0^t \frac{\binom{n}{2}}{N(x)} dx\right)$$
    </div>
    
    <p>Requirements:</p>
    <ul>
        <li>The coalescent intensity function $1/N(t)$ must be integrable</li>
        <li>$N(t) > 0$ for all $t$</li>
    </ul>
</div>

<h3>Common Population Size Functions</h3>

<div class="example-box">
    <h4>Examples of N(t)</h4>
    
    <p><strong>1. Exponential growth/decline:</strong></p>
    <div class="math-block">
    $$N(t) = N_0 e^{-rt}$$
    </div>
    
    <p><strong>2. Logistic growth:</strong></p>
    <div class="math-block">
    $$N(t) = \frac{K}{1 + \left(\frac{K}{N_0} - 1\right)e^{-rt}}$$
    </div>
    
    <p><strong>3. Bottleneck:</strong></p>
    <div class="math-block">
    $$N(t) = \begin{cases}
    N_0 & \text{if } t < t_b \text{ or } t > t_b + \Delta t \\
    N_b & \text{if } t_b \leq t \leq t_b + \Delta t
    \end{cases}$$
    </div>
</div>

<h3>Effects of Population Size Changes</h3>

<p>Different demographic scenarios leave characteristic signatures in genealogies:</p>

<ul>
    <li><strong>Population expansion:</strong> Star-like trees with long terminal branches</li>
    <li><strong>Population bottleneck:</strong> Rapid coalescence during the bottleneck</li>
    <li><strong>Cyclic population size:</strong> Clustering of coalescence events</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> The shape of a genealogy contains information about historical population size changes. This is the basis for demographic inference from genetic data.
    </div>
</div>
</section>

<section class="section" id="applications">
<h2>7. Applications and Extensions</h2>

<h3>The Coalescent as a Tree Prior</h3>

<p>In Bayesian phylogenetics, the coalescent serves as a natural prior distribution on gene trees:</p>

<div class="math-block">
$$P(\text{tree}|\theta)$$
</div>

<p>Where $\theta$ includes parameters like:</p>
<ul>
    <li>Effective population size $N_e$</li>
    <li>Growth rate $r$</li>
    <li>Migration rates (for structured populations)</li>
</ul>

<h3>Extensions of the Basic Coalescent</h3>

<dl>
    <dt><strong>Structured Coalescent</strong></dt>
    <dd>Accounts for population subdivision and migration</dd>
    
    <dt><strong>Selection at Linked Sites</strong></dt>
    <dd>Modifies coalescence rates due to hitchhiking effects</dd>
    
    <dt><strong>Recombination</strong></dt>
    <dd>Leads to the ancestral recombination graph (ARG)</dd>
    
    <dt><strong>Multiple Merger Coalescents</strong></dt>
    <dd>Allows more than two lineages to coalesce simultaneously</dd>
</dl>

<h3>Practical Applications</h3>

<p>The coalescent framework enables:</p>

<ol>
    <li><strong>Demographic inference:</strong> Estimating historical population sizes and growth rates</li>
    <li><strong>Species delimitation:</strong> Distinguishing population structure from species boundaries</li>
    <li><strong>Dating events:</strong> Estimating times of population splits or admixture</li>
    <li><strong>Selection detection:</strong> Identifying deviations from neutral expectations</li>
    <li><strong>Epidemiological inference:</strong> Tracking pathogen spread and transmission</li>
</ol>

<div class="tools-box">
    <h4>Software Implementing Coalescent Models</h4>
    <ul>
        <li><strong>BEAST/BEAST2:</strong> Bayesian phylogenetics with coalescent priors</li>
        <li><strong>MIGRATE:</strong> Estimation of migration rates and population sizes</li>
        <li><strong>ms/msprime:</strong> Coalescent simulation programs</li>
        <li><strong>LAMARC:</strong> Likelihood analysis with coalescent models</li>
        <li><strong>IMa2:</strong> Isolation with migration models</li>
    </ul>
</div>
</section>

<section class="section" id="simulation">
<h2>8. Visualizing the Coalescent Process</h2>

<p>Understanding the coalescent often benefits from visualization and simulation. The interactive demonstration in the lecture allows exploration of:</p>

<h3>Key Parameters to Explore</h3>

<ul>
    <li><strong>Sample size (n):</strong> How does increasing n affect the genealogy shape?</li>
    <li><strong>Population size (N):</strong> How does N affect coalescence rate?</li>
    <li><strong>Population dynamics:</strong> Effects of different N(t) functions:
        <ul>
            <li>Sinusoidal (cyclic populations)</li>
            <li>Square wave (abrupt changes)</li>
            <li>Sawtooth (gradual change followed by crash)</li>
        </ul>
    </li>
</ul>

<h3>Observable Patterns</h3>

<p>Through simulation, we can observe:</p>
<ul>
    <li>The randomness in coalescence times and tree shapes</li>
    <li>How bottlenecks accelerate coalescence</li>
    <li>The relationship between N(t) and the coalescent density</li>
    <li>Why most coalescence occurs near the present (for constant N)</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Exercise:</strong> Try simulating genealogies with different population size functions. Notice how bottlenecks create "hourglass" shaped genealogies, while expansion creates "star" phylogenies.
    </div>
</div>
</section>

<section class="section">
<h2>Summary</h2>

<p>The coalescent is a fundamental framework in population genetics that:</p>

<ol>
    <li><strong>Provides a null model:</strong> Describes genealogies under neutral evolution in idealized populations</li>
    
    <li><strong>Works backward in time:</strong> More efficient than forward simulations for genealogical questions</li>
    
    <li><strong>Links demography to genealogy:</strong> Population size changes leave signatures in gene trees</li>
    
    <li><strong>Has elegant mathematics:</strong> 
        <ul>
            <li>Exponential waiting times between coalescence events</li>
            <li>Rate depends on number of lineages and population size</li>
            <li>Generalizes to variable population sizes</li>
        </ul>
    </li>
    
    <li><strong>Forms the basis for inference:</strong> Used as tree priors in Bayesian phylogenetics and for demographic inference</li>
    
    <li><strong>Has many extensions:</strong> Can incorporate population structure, selection, recombination, and other biological realities</li>
</ol>

<div class="alert alert-success">
    <i class="fas fa-key"></i>
    <div>
        <strong>Key formula to remember:</strong> For $k$ lineages in a population of size $N$, the rate of coalescence is $\binom{k}{2}/N$, and the expected waiting time is $N/\binom{k}{2}$.
    </div>
</div>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Wakeley (2009) "Coalescent Theory: An Introduction" - Chapters 1-3</li>
            <li>Hein, Schierup & Wiuf (2005) "Gene Genealogies, Variation and Evolution" - Chapters 3-4</li>
            <li>Kingman (1982) "The coalescent" - Stochastic Processes and their Applications</li>
            <li>Griffiths & Tavaré (1994) "Sampling theory for neutral alleles" - Phil Trans R Soc B</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why is the coalescent more efficient than forward-time simulations?</li>
        <li>What is the expected TMRCA for a large sample from a population of size N?</li>
        <li>How does a population bottleneck affect the rate of coalescence?</li>
        <li>Why do all labeled topologies have equal probability under the standard coalescent?</li>
        <li>What information about population history can be inferred from genealogy shape?</li>
    </ol>
</div>
</section>
