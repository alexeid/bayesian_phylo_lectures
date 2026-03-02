---
layout: lecture_notes
title: "Likelihood and Substitution Models"
lecture_num: 7
section: introduction
section_name: "Introduction to Phylogenetics"
previous_lecture: lecture-parsimony/notes
next_lecture: lecture-bayesian-inference/notes
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 7</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Felsenstein (2004) Ch. 13-16</span>
    </div>
</div>

<section class="section" id="parsimony-problems">
<h2>1. Problems with Parsimony</h2>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-parsimony/Parsimony.png" alt="Parsimony example" style="width: 60%;">
    <div class="figure-caption">Recall: parsimony seeks trees with minimum number of changes</div>
</div>

<p>While parsimony is intuitive and computationally tractable for small problems, it has several limitations:</p>

<ul>
    <li><strong>"Large parsimony problem" is computationally expensive</strong>
        <ul>
            <li>NP-hard problem requiring heuristic search algorithms</li>
            <li>No guarantee of finding global optimum</li>
        </ul>
    </li>
    <li><strong>Gives point estimates with no uncertainty quantification</strong>
        <ul>
            <li>No confidence intervals or support values</li>
            <li>No way to compare alternative hypotheses statistically</li>
        </ul>
    </li>
    <li><strong>Questionable biological basis</strong>
        <ul>
            <li>Assumes all changes are equally unlikely</li>
            <li>Ignores branch lengths</li>
        </ul>
    </li>
    <li><strong>Not model-based</strong>
        <ul>
            <li>No formal hypothesis testing</li>
            <li>No model comparison</li>
        </ul>
    </li>
    <li><strong>Hidden problems</strong>
        <ul>
            <li>Long branch attraction</li>
            <li>Inconsistency under certain conditions</li>
        </ul>
    </li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> We need a model-based approach that can quantify uncertainty and allow formal hypothesis testing.
    </div>
</div>
</section>

<section class="section" id="models">
<h2>2. Modelling Neutral Sequence Evolution</h2>

<h3>Why Use Models?</h3>

<blockquote>
    We need a model to relate what we observe (data) to what we want to know (hypotheses and parameters).
</blockquote>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Fundamental principle:</strong> Inference is not possible without a model!
    </div>
</div>

<p>We use <strong>probabilistic models</strong> for molecular evolution because:</p>
<ul>
    <li>We don't know enough about mutation mechanisms for deterministic models</li>
    <li>Stochastic effects are important at molecular level</li>
    <li>Allows uncertainty quantification</li>
    <li>Enables formal statistical inference</li>
</ul>

<h3>Genetic Distance: From p-distance to Model-based Estimates</h3>

<h4>The p-distance</h4>

<div class="definition-box">
    <div class="title">p-distance</div>
    <p>The proportion of sites that differ between two aligned sequences.</p>
    <p><strong>Example:</strong> If 15 out of 100 sites differ, p-distance = 0.15</p>
    <ul>
        <li>Simple to calculate</li>
        <li>Always between 0 and 1</li>
        <li>Also called normalized Hamming distance</li>
        <li>BUT: underestimates true evolutionary distance (we'll see why)</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-substitution-models/pdist.svg" alt="p-distance calculation" style="width: 70%;">
    <div class="figure-caption">Computing p-distance between aligned sequences</div>
</div>

<div class="example-box">
    <h4>p-distance Example</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lecture-substitution-models/pdist2.svg" alt="p-distance example" style="width: 30%; display: inline-block;">
        <div style="display: inline-block; margin-left: 2em;">
            <p>p-distance = 3/7 ≈ 0.43</p>
            <p><strong>Interpretation:</strong> 43% of sites differ between these sequences</p>
        </div>
    </div>
</div>

<h4>Why p-distance Underestimates True Distance</h4>

<p>The p-distance usually <strong>underestimates</strong> the true genetic (evolutionary) distance because it doesn't account for:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-substitution-models/pdist3.svg" alt="Multiple substitutions" style="width: 70%;">
    <div class="figure-caption">Multiple, parallel, and back-substitutions are invisible in pairwise comparisons</div>
</div>

<div class="bio-context">
    <h4>Biological Intuition</h4>
    <p>Imagine watching a bird feeder at different times:</p>
    <ul>
        <li>You see a korimako/bellbird at 9am and you again see a korimako/bellbird at 5pm.</li>
        <li>Same bird all day? Or did multiple birds use the spot?</li>
        <li>Without continuous observation, you can't tell!</li>
    </ul>
    <p>Similarly, DNA sites may have changed multiple times between ancestors and descendants.</p>
</div>

<ul>
    <li><strong>Multiple substitutions:</strong> Same site changing more than once</li>
    <li><strong>Parallel substitutions:</strong> Same change occurring independently</li>
    <li><strong>Back-substitutions:</strong> Reversions to ancestral state</li>
</ul>

<h4>Relationship Between p-distance and Genetic Distance</h4>

<div id="pdistOutput" style="width:100%;height:400px;margin-top:2em">
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var trace1 = { 
        x: [], 
        y: [],
        mode: 'lines',
        name: 'True relationship (JC69 model)',
        line: {
            width: 4,
            dash: 'solid',
            color: '#2563eb'
        }
    };

    var trace2 = {
        x: [], 
        y: [], 
        mode: 'lines', 
        name: 'p = d (no correction)',
        line: { 
            width: 2, 
            dash: 'dash',
            color: '#ef4444'
        }
    };
    
    for (var i=0; i<100; i++) {
        var ut = 3.0*i/100;
        trace1.x[i] = ut;
        trace1.y[i] = 0.75*(1-Math.exp(-4/3*ut));
        trace2.x[i] = ut; 
        trace2.y[i] = ut;
    }

    var data = [trace1, trace2];

    var layout = {
        showlegend: true,
        xaxis: {
            title: "True genetic distance (expected substitutions per site)"
        },
        yaxis: {
            title: "Observed p-distance",
            range: [0,1]
        },
        margin: {
            t:10
        }
    };

    Plotly.newPlot('pdistOutput', data, layout, {displayModeBar: false});
});
</script>
<div class="figure-caption">The p-distance saturates at 0.75 for random sequences, while true genetic distance continues to increase</div>

<div class="intuition-box">
    <h4>Why does p-distance saturate at 0.75?</h4>
    <p>With 4 nucleotides and random substitutions:</p>
    <ul>
        <li>Probability of staying the same = 1/4</li>
        <li>Probability of being different = 3/4</li>
        <li>After infinite time, sequences become random with respect to each other</li>
        <li>Random sequences differ at 75% of sites</li>
    </ul>
</div>

</section>

<section class="section" id="ctmc">
<h2>3. Continuous-Time Markov Chains (CTMCs)</h2>

<h3>Mathematical Framework</h3>

<div class="definition-box">
    <div class="title">Continuous-Time Markov Chain</div>
    <p>A stochastic process where:</p>
    <ul>
        <li>State X(t) is a function of continuous time</li>
        <li>Future states depend only on current state (Markov property)</li>
        <li>Transition rates are constant over time</li>
    </ul>
</div>

<div class="bio-context">
    <h4>What does this mean biologically?</h4>
    <p>A continuous-time Markov chain models how nucleotides change over time:</p>
    <ul>
        <li>Each site evolves independently</li>
        <li>Changes can happen at any time</li>
        <li>The probability of change depends only on current state, not history</li>
        <li>Like radioactive decay - constant probability of change per unit time</li>
    </ul>
    <p><strong>Example:</strong> An 'A' nucleotide doesn't "remember" how long it's been an 'A' - it always has the same probability of mutating in the next instant.</p>
</div>

<p>CTMCs obey the <strong>Chapman-Kolmogorov equation</strong>:</p>
<div class="math-block">
$$P(X(t_1)|X(t_0)) = \sum_{X(t_i)} P(X(t_1)|X(t_i))P(X(t_i)|X(t_0))$$
</div>

<p><strong>In plain English:</strong> To get from state X(t₀) to X(t₁), sum over all possible paths through intermediate states.</p>

<h3>Mathematical Details (Optional)</h3>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        This section provides mathematical depth for those interested. Biology-focused readers can skip to the next section.
    </div>
</div>

<p>The differential form (Master equation/Kolmogorov forward equation):</p>
<div class="math-block">
$$\frac{d}{dt}p(x,t|x_0,t_0) = \sum_{x'} Q_{x'x}p(x',t|x_0,t_0)$$
</div>

<p>Where Q is the instantaneous rate matrix with:</p>
<ul>
    <li>\(Q_{ij}\) = rate of change from state i to j (i ≠ j)</li>
    <li>\(Q_{ii} = -\sum_{j \neq i} Q_{ij}\) (rows sum to zero)</li>
</ul>

<h3>Relationship Between Q and P(t)</h3>

<div class="definition-box">
    <div class="title">Key Relationship</div>
    <p>The transition probability matrix P(t) is the matrix exponential of Qt:</p>
    <div class="math-block">
    $$P(t) = \exp(Qt) = \sum_{k=0}^{\infty} \frac{(Qt)^k}{k!} = I + tQ + \frac{(tQ)^2}{2!} + \frac{(tQ)^3}{3!} + \ldots$$
    </div>
</div>

<div class="intuition-box">
    <h4>Intuition for the Matrix Exponential</h4>
    <p>This formula tells us:</p>
    <ul>
        <li><strong>P(0) = I</strong> (no time = no change)</li>
        <li><strong>P(small t) ≈ I + tQ</strong> (short time = approximately linear)</li>
        <li><strong>P(large t) → stationary distribution</strong> (long time = equilibrium)</li>
    </ul>
    <p>Think of it as compound interest for mutations!</p>
</div>

<h3>CTMC Example</h3>

<div class="practice-box">
    <h4>Two-State System</h4>
    <p>Consider a simplified DNA with only purines (R) and pyrimidines (Y):</p>
    <div class="math-block">
    $$Q = \begin{bmatrix} -2 & 2 \\ 1 & -1 \end{bmatrix}$$
    </div>
    
    <p>This means:</p>
    <ul>
        <li>Rate R→Y: 2 per unit time</li>
        <li>Rate Y→R: 1 per unit time</li>
    </ul>
    
    <p><strong>Biological interpretation:</strong> Transitions (R↔Y) happen at different rates in each direction</p>
    
    <p>Time spent in state before transition follows exponential distribution:</p>
    <div class="math-block">
    $$P(\Delta t|x) = \lambda e^{-\lambda \Delta t}$$
    </div>
    where \(\lambda = -Q_{xx}\) is the total rate of leaving state x.
</div>

<h3>Time-Reversibility and Detailed Balance</h3>

<div class="definition-box">
    <div class="title">Time-Reversible CTMC</div>
    <p>A CTMC is time-reversible if it satisfies detailed balance:</p>
    <div class="math-block">
    $$\pi_i Q_{ij} = \pi_j Q_{ji}$$
    </div>
    <p>where π is the stationary distribution.</p>
</div>

<p>For time-reversible CTMCs:</p>
<ul>
    <li>Process looks the same forward and backward in time</li>
    <li>Stationary distribution satisfies: \(\pi Q = 0\)</li>
    <li>Mathematical convenience for phylogenetics</li>
    <li><strong>Important:</strong> No biological justification required!</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> We assume time-reversibility for mathematical convenience, not because evolution looks the same in both directions!
    </div>
</div>

</section>

<section class="section" id="substitution-models">
<h2>4. DNA Substitution Models</h2>

<p>Now let's see how CTMCs are used to model DNA evolution. We'll start simple and build complexity.</p>

<h3>Jukes-Cantor (JC69) Model</h3>

<div class="model-box">
    <h4>The Simplest Model</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lecture-substitution-models/JC.svg" alt="Jukes-Cantor model" style="width: 30%; display: inline-block; vertical-align: middle;">
        <div style="display: inline-block; width: 65%; vertical-align: middle; margin-left: 1em;">
            <p><strong>Assumptions:</strong></p>
            <ul>
                <li>All substitutions equally likely</li>
                <li>Equal base frequencies (25% each)</li>
                <li>One parameter: μ (overall rate)</li>
            </ul>
            <p><strong>Rate matrix:</strong></p>
            <div class="math-block">
            $$Q = \mu \begin{bmatrix}
            -1 & \frac{1}{3} & \frac{1}{3} & \frac{1}{3} \\
            \frac{1}{3} & -1 & \frac{1}{3} & \frac{1}{3} \\
            \frac{1}{3} & \frac{1}{3} & -1 & \frac{1}{3} \\
            \frac{1}{3} & \frac{1}{3} & \frac{1}{3} & -1
            \end{bmatrix}$$
            </div>
        </div>
    </div>
</div>

<p><strong>Transition probabilities:</strong></p>
<div class="math-block">
$$P_{ij}(t) = \begin{cases}
\frac{1}{4} + \frac{3}{4}e^{-\frac{4}{3}\mu t} & \text{if } i = j \text{ (same nucleotide)} \\
\frac{1}{4} - \frac{1}{4}e^{-\frac{4}{3}\mu t} & \text{if } i \neq j \text{ (different nucleotide)}
\end{cases}$$
</div>

<h4>Genetic Distance Under JC69</h4>

<p>Given observed p-distance, we can estimate the true genetic distance:</p>
<div class="math-block">
$$\hat{d} = -\frac{3}{4}\log\left(1 - \frac{4}{3}p\right)$$
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Limitations:</strong>
        <ul>
            <li>Formula undefined if p ≥ 3/4 (sequences too divergent)</li>
            <li>Assumes all changes equally likely (unrealistic)</li>
            <li>Assumes equal base composition (often violated)</li>
        </ul>
    </div>
</div>

<h3>Kimura 2-Parameter (K80) Model</h3>

<div class="model-box">
    <h4>Adding Biological Realism</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lecture-substitution-models/K80.svg" alt="Kimura 80 model" style="width: 30%; display: inline-block; vertical-align: middle;">
        <div style="display: inline-block; width: 65%; vertical-align: middle; margin-left: 1em;">
            <p><strong>Key innovation:</strong> Transitions ≠ Transversions</p>
            <ul>
                <li><strong>Transitions (α):</strong> Purine↔Purine, Pyrimidine↔Pyrimidine</li>
                <li><strong>Transversions (β):</strong> Purine↔Pyrimidine</li>
                <li>Usually α > β (transitions more common)</li>
            </ul>
            <p><strong>Rate matrix:</strong></p>
            <div class="math-block">
            $$Q = \begin{bmatrix}
            \cdot & \alpha & \beta & \beta \\
            \alpha & \cdot & \beta & \beta \\
            \beta & \beta & \cdot & \alpha \\
            \beta & \beta & \alpha & \cdot
            \end{bmatrix}$$
            </div>
        </div>
    </div>
</div>

<div class="bio-context">
    <h4>Why are transitions more common?</h4>
    <p>Chemical similarity:</p>
    <ul>
        <li>Purines (A,G): Two-ring structures</li>
        <li>Pyrimidines (C,T): One-ring structures</li>
        <li>Replacing like-with-like causes less structural disruption</li>
    </ul>
</div>

<h3>HKY Model</h3>

<div class="model-box">
    <h4>Hasegawa-Kishino-Yano (1985)</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lecture-substitution-models/HKY.svg" alt="HKY model" style="width: 30%; display: inline-block; vertical-align: middle;">
        <div style="display: inline-block; width: 65%; vertical-align: middle; margin-left: 1em;">
            <p><strong>Features:</strong></p>
            <ul>
                <li>Different transition/transversion rates</li>
                <li>Unequal base frequencies (πA, πC, πG, πT)</li>
                <li>Reflects GC-content variation</li>
            </ul>
            <p><strong>Rate matrix:</strong></p>
            <div class="math-block">
            $$Q = \begin{bmatrix}
            \cdot & \alpha\pi_C & \beta\pi_G & \beta\pi_T \\
            \alpha\pi_A & \cdot & \beta\pi_G & \beta\pi_T \\
            \beta\pi_A & \beta\pi_C & \cdot & \alpha\pi_T \\
            \beta\pi_A & \beta\pi_C & \alpha\pi_G & \cdot
            \end{bmatrix}$$
            </div>
        </div>
    </div>
</div>

<h3>General Time Reversible (GTR) Model</h3>

<div class="model-box">
    <h4>The Most General Model</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lecture-substitution-models/GTR.svg" alt="GTR model" style="width: 30%; display: inline-block; vertical-align: middle;">
        <div style="display: inline-block; width: 65%; vertical-align: middle; margin-left: 1em;">
            <p><strong>Features:</strong></p>
            <ul>
                <li>All substitution types can have different rates</li>
                <li>6 rate parameters + 4 frequency parameters</li>
                <li>Most flexible time-reversible model</li>
                <li>Includes all previous models as special cases</li>
            </ul>
            <p><strong>Rate matrix:</strong></p>
            <div class="math-block">
            $$Q = \begin{bmatrix}
            \cdot & \alpha\pi_C & \beta\pi_G & \gamma\pi_T \\
            \alpha\pi_A & \cdot & \delta\pi_G & \epsilon\pi_T \\
            \beta\pi_A & \delta\pi_C & \cdot & \eta\pi_T \\
            \gamma\pi_A & \epsilon\pi_C & \eta\pi_G & \cdot
            \end{bmatrix}$$
            </div>
        </div>
    </div>
</div>

<div class="comparison-box">
    <h4>Model Comparison Summary</h4>
    <table>
        <tr>
            <th>Model</th>
            <th>Parameters</th>
            <th>Key Feature</th>
            <th>When to Use</th>
        </tr>
        <tr>
            <td>JC69</td>
            <td>1</td>
            <td>All equal</td>
            <td>Very similar sequences</td>
        </tr>
        <tr>
            <td>K80</td>
            <td>2</td>
            <td>Ts/Tv ratio</td>
            <td>Moderate divergence</td>
        </tr>
        <tr>
            <td>HKY</td>
            <td>5</td>
            <td>+Base frequencies</td>
            <td>GC-content varies</td>
        </tr>
        <tr>
            <td>GTR</td>
            <td>9</td>
            <td>All different</td>
            <td>Complex datasets</td>
        </tr>
    </table>
</div>

<h3>Rate Heterogeneity Among Sites</h3>

<div class="bio-context">
    <h4>Biological Reality</h4>
    <p>Not all sites in a gene evolve at the same rate:</p>
    <ul>
        <li><strong>Active sites:</strong> Highly conserved (slow evolution)</li>
        <li><strong>Structural regions:</strong> Moderate constraints</li>
        <li><strong>Surface loops:</strong> Fewer constraints (fast evolution)</li>
        <li><strong>Synonymous sites:</strong> Often evolve fastest</li>
    </ul>
</div>

<p>We model rate variation using a gamma distribution:</p>

<div class="math-block">
$$f(r) = \frac{\alpha^\alpha}{\Gamma(\alpha)} r^{\alpha-1} e^{-\alpha r}$$
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-substitution-models/gamma_rates.png" alt="Gamma distributions" style="width: 50%;">
    <div class="figure-caption">Different values of α give different rate distributions. Small α = high variation</div>
</div>

<div class="intuition-box">
    <h4>Understanding the shape parameter α</h4>
    <ul>
        <li><strong>α < 1:</strong> Most sites evolve slowly, few evolve very fast</li>
        <li><strong>α = 1:</strong> Exponential distribution</li>
        <li><strong>α > 1:</strong> Bell-shaped distribution</li>
        <li><strong>α → ∞:</strong> All sites evolve at same rate</li>
    </ul>
</div>

<h3>Model Comparison Example</h3>

<div class="practice-box">
    <h4>HIV Distance Estimates</h4>
    <p>HIV-1B vs other strains (env gene):</p>
    <table>
        <tr>
            <th>Comparison</th>
            <th>p-distance</th>
            <th>JC69</th>
            <th>K80</th>
            <th>Tajima-Nei</th>
        </tr>
        <tr>
            <td>HIV-O</td>
            <td>0.391</td>
            <td>0.552</td>
            <td>0.560</td>
            <td>0.572</td>
        </tr>
        <tr>
            <td>SIVcpz</td>
            <td>0.266</td>
            <td>0.337</td>
            <td>0.340</td>
            <td>0.427</td>
        </tr>
        <tr>
            <td>HIV-1C</td>
            <td>0.163</td>
            <td>0.184</td>
            <td>0.187</td>
            <td>0.189</td>
        </tr>
    </table>
    <p><strong>Observation:</strong> Model choice matters more for divergent sequences!</p>
</div>
</section>

<section class="section" id="likelihood">
<h2>5. Likelihood-Based Phylogenetic Inference</h2>

<h3>From Distances to Likelihood</h3>

<p>Distance methods lose information by summarizing sequences as pairwise distances. Likelihood methods use all the data.</p>

<h3>The Likelihood Function</h3>

<div class="definition-box">
    <div class="title">Likelihood</div>
    <p>The likelihood for parameter θ under model M given data D is:</p>
    <div class="math-block">
    $$L(\theta|D,M) \equiv P(D|\theta,M)$$
    </div>
    <p>In words: "The probability of observing our data if the parameter values were θ"</p>
    <p><strong>Important:</strong> The likelihood is NOT a probability distribution over θ!</p>
</div>

<div class="example-box">
    <h4>Simple Example: Coin Flips</h4>
    <p>5 tosses give: D = (H,T,T,H,T)</p>
    <p>What's the probability of getting exactly this sequence?</p>
    <div class="math-block">
    $$P(D|f) = f \times (1-f) \times (1-f) \times f \times (1-f) = f^2(1-f)^3$$
    </div>
    <p>This is the likelihood function L(f|D)!</p>
    
    <div class="figure">
        <div id="maxLikelihoodOut" style="width:100%;height:300px">
            <script>
            var trace = { x: [], y: [], mode: "lines", name: ""};

            for (var i=0; i<100; i++) {
                var f = i/100;
                var L = Math.pow(f,2)*Math.pow(1-f,3);
                trace.x[i] = f;
                trace.y[i] = L;
            }

            var layout = {
                showlegend: false,
                xaxis: {
                    title: "f (probability of heads)"
                },
                yaxis: {
                    title: "L(f|D) = P(data|f)",
                },
                margin: {
                    t:10,
                    b:40
                }
            }

            layout.shapes = [ {
                type: 'line',
                x0: 0.4,
                y0: 0,
                x1: 0.4,
                y1: 0.04,
                line: {
                    dash: 'dash',
                    color: 'orange',
                    width: 2
                }
            } ];

            layout.annotations = [{
                x: 0.4,
                y: 0.045,
                text: 'Maximum at f=0.4',
                showarrow: false
            }];

            Plotly.newPlot('maxLikelihoodOut', [trace], layout, {displayModeBar: false});
            </script>
    </div>
        <div class="figure-caption">The likelihood peaks at f = 2/5 = 0.4 (we observed 2 heads in 5 flips)</div>
    </div>
</div>

<h3>Maximum Likelihood Inference</h3>

<blockquote>
    The maximum likelihood estimate is the parameter value that makes the observed data most probable.
</blockquote>

<div class="intuition-box">
    <h4>Why Maximum Likelihood?</h4>
    <ul>
        <li><strong>Intuitive:</strong> Choose parameters that make data most likely</li>
        <li><strong>Optimal properties:</strong> Consistent, efficient (with enough data)</li>
        <li><strong>General framework:</strong> Works for any statistical model</li>
        <li><strong>BUT:</strong> Only gives point estimates, no uncertainty!</li>
    </ul>
</div>

<h3>Tree Likelihood</h3>

<p>For phylogenetics, we want P(alignment | tree, model):</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture-substitution-models/treeLikelihood.svg" alt="Tree likelihood calculation" style="width: 50%;">
    <div class="figure-caption">Computing likelihood requires summing over all possible ancestral states</div>
</div>

<p>The likelihood calculation involves:</p>
<ol>
    <li><strong>For each site in the alignment:</strong>
        <ul>
            <li>Consider all possible ancestral states</li>
            <li>Calculate probability of observing tip states</li>
            <li>Sum over all possibilities</li>
        </ul>
    </li>
    <li><strong>Multiply across sites</strong> (assumes independence)</li>
</ol>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Computational challenge:</strong> For n taxa with DNA, there are 4^(n-1) possible combinations of internal node states per site!
    </div>
</div>

<h3>Felsenstein's Pruning Algorithm</h3>

<p>Joseph Felsenstein (1973) solved this using dynamic programming:</p>

<div class="algorithm-box">
    <h4>The Pruning Algorithm</h4>
    <p><strong>Key idea:</strong> Work from tips toward root, storing partial likelihoods</p>
    
    <p>Define: L<sub>k</sub>(s) = likelihood of subtree below node k if node k has state s</p>
    
    <p><strong>For leaf nodes:</strong></p>
    <div class="math-block">
    $$L_k(s) = \begin{cases}
    1 & \text{if leaf has state } s \\
    0 & \text{otherwise}
    \end{cases}$$
    </div>
    
    <p><strong>For internal nodes with children i and j:</strong></p>
    <div class="math-block">
    $$L_k(s) = \left(\sum_x P(x|s,t_i)L_i(x)\right)\left(\sum_y P(y|s,t_j)L_j(y)\right)$$
    </div>
    
    <p>Where P(x|s,t) is the probability of state s changing to x in time t</p>
</div>

<div class="intuition-box">
    <h4>Why This Works</h4>
    <p>Instead of considering all 4^(n-1) combinations:</p>
    <ul>
        <li>Store 4 numbers at each node (partial likelihoods)</li>
        <li>Build up from tips to root</li>
        <li>Reuse calculations (dynamic programming principle)</li>
    </ul>
    <p><strong>Result:</strong> Linear time in number of taxa!</p>
</div>

<h3>Maximum Likelihood Software</h3>

<div class="tools-box">
    <h4>ML Phylogenetic Software</h4>
    <ul>
        <li><strong>IQ-TREE</strong> (Nguyen et al., 2015)
            <ul>
                <li>State-of-the-art tree search</li>
                <li>Automatic model selection</li>
                <li>Ultrafast bootstrap</li>
            </ul>
        </li>
        <li><strong>RAxML</strong> (Stamatakis, 2014)
            <ul>
                <li>Highly optimized for large datasets</li>
                <li>Excellent parallelization</li>
                <li>Standard in many pipelines</li>
            </ul>
        </li>
        <li><strong>PhyML</strong> (Guindon et al., 2010)
            <ul>
                <li>User-friendly</li>
                <li>Good for moderate datasets</li>
                <li>Fast approximate likelihood ratio tests</li>
            </ul>
        </li>
        <li><strong>FastTree</strong> (Price et al., 2009)
            <ul>
                <li>Approximate but very fast</li>
                <li>Can handle millions of sequences</li>
                <li>Good for initial analyses</li>
            </ul>
        </li>
    </ul>
</div>

<h3>Limitations of Maximum Likelihood</h3>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>ML gives us a point estimate with no measure of uncertainty!</strong>
    </div>
</div>

<ul>
    <li><strong>No confidence intervals</strong>
        <ul>
            <li>How certain are we about the tree?</li>
            <li>Bootstrap provides some help (but it's ad hoc)</li>
        </ul>
    </li>
    <li><strong>Model selection challenges</strong>
        <ul>
            <li>How do we choose between JC69, K80, HKY, GTR?</li>
            <li>Likelihood ratio tests only work for nested models</li>
        </ul>
    </li>
    <li><strong>Can't incorporate prior knowledge</strong>
        <ul>
            <li>What if we know some clades are unlikely?</li>
            <li>What if we have fossil calibrations?</li>
        </ul>
    </li>
</ul>

<blockquote>
    We need a framework that handles uncertainty properly → Bayesian inference!
</blockquote>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture introduced model-based phylogenetic inference:</p>

<ol>
    <li><strong>Why models?</strong> 
        <ul>
            <li>Parsimony has serious limitations</li>
            <li>Models enable statistical inference</li>
            <li>Can test hypotheses formally</li>
        </ul>
    </li>
    
    <li><strong>Substitution models as CTMCs:</strong> 
        <ul>
            <li>Continuous-time Markov chains model sequence evolution</li>
            <li>Models range from simple (JC69) to complex (GTR+Γ)</li>
            <li>More complex models fit data better but risk overfitting</li>
        </ul>
    </li>
    
    <li><strong>Key biological insights:</strong>
        <ul>
            <li>p-distance underestimates true distance due to multiple hits</li>
            <li>Transitions more common than transversions</li>
            <li>Base composition varies across genomes</li>
            <li>Different sites evolve at different rates</li>
        </ul>
    </li>
    
    <li><strong>Likelihood methods:</strong>
        <ul>
            <li>Use all information in the alignment</li>
            <li>Felsenstein's algorithm makes computation feasible</li>
            <li>BUT: still only point estimates</li>
        </ul>
    </li>
    
    <li><strong>Next step:</strong> Bayesian inference provides a complete framework for uncertainty</li>
</ol>

<div class="key-takeaways">
    <h4>Key Takeaways</h4>
    <ul>
        <li><strong>For biologists:</strong> Models let us correct for unseen changes and test evolutionary hypotheses</li>
        <li><strong>For computer scientists:</strong> Phylogenetics offers rich algorithmic challenges (DP, matrix exponentials, tree search)</li>
        <li><strong>For everyone:</strong> Understanding models is crucial for interpreting phylogenetic results</li>
    </ul>
</div>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Felsenstein (2004) "Inferring Phylogenies" - Chapters 13-16</li>
            <li>Yang (2014) "Molecular Evolution: A Statistical Approach" - Chapters 1-2</li>
            <li>Drummond & Bouckaert (2015) "Bayesian Evolutionary Analysis with BEAST" - Chapter 2</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why does p-distance underestimate true evolutionary distance?</li>
        <li>What biological reasons explain why transitions are more common than transversions?</li>
        <li>How does Felsenstein's algorithm achieve computational efficiency?</li>
        <li>What are the key differences between JC69, K80, HKY, and GTR models?</li>
        <li>Why isn't likelihood a probability distribution over parameters?</li>
    </ol>
</div>
</section>