---
layout: lecture_notes
title: "Likelihood and Substitution Models"
lecture_num: 7
section: introduction
section_name: "Introduction to Phylogenetics"
previous_lecture: lecture6_parsimony_notes
next_lecture: lecture8_bayesian_inference
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 7</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Felsenstein Ch. 13-16</span>
    </div>
</div>

<section class="section" id="parsimony-problems">
<h2>1. Problems with Parsimony</h2>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/Parsimony.png" alt="Parsimony example" style="width: 60%;">
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
    <ul>
        <li>Also called normalized Hamming distance</li>
        <li>Probability that two sequences differ at a random site</li>
        <li>Simple but biased estimator of true evolutionary distance</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/pdist.svg" alt="p-distance calculation" style="width: 70%;">
    <div class="figure-caption">Computing p-distance between aligned sequences</div>
</div>

<div class="example-box">
    <h4>p-distance Example</h4>
    <div class="figure">
        <img src="{{ site.baseurl }}/lectureSubstitutionModels/pdist2.svg" alt="p-distance example" style="width: 30%; display: inline-block;">
        <div style="display: inline-block; margin-left: 2em;">
            <p>p-distance = 3/7 ≈ 0.43</p>
        </div>
    </div>
</div>

<h4>Why p-distance Underestimates True Distance</h4>

<p>The p-distance usually <strong>underestimates</strong> the true genetic (evolutionary) distance because it doesn't account for:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/pdist3.svg" alt="Multiple substitutions" style="width: 70%;">
    <div class="figure-caption">Multiple, parallel, and back-substitutions are invisible in pairwise comparisons</div>
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
        name: 'Actual relationship',
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
            title: "Genetic distance (d)"
        },
        yaxis: {
            title: "p-distance (p)",
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

<p>CTMCs obey the <strong>Chapman-Kolmogorov equation</strong>:</p>
<div class="math-block">
$$P(X(t_1)|X(t_0)) = \sum_{X(t_i)} P(X(t_1)|X(t_i))P(X(t_i)|X(t_0))$$
</div>

<p><strong>Informally:</strong> You can find the probability of going from state X(t₀) to X(t₁) by averaging over all possible intermediate states.</p>

<h3>Mathematical Details (Optional)</h3>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        This section provides mathematical depth for those interested.
    </div>
</div>

<p>The differential form (Master equation/Kolmogorov forward equation):</p>
<div class="math-block">
$$\frac{d}{dt}p(x,t|x_0,t_0) = \sum_{x'} Q_{x'x}p(x',t|x_0,t_0)$$
</div>

<p>Where Q is the instantaneous rate matrix with:</p>
<ul>
    <li>$Q_{ij}$ = rate of change from state i to j (i ≠ j)</li>
    <li>$Q_{ii} = -\sum_{j \neq i} Q_{ij}$ (rows sum to zero)</li>
</ul>

<h3>Relationship Between Q and P(t)</h3>

<div class="definition-box">
    <div class="title">Key Relationship</div>
    <p>The transition probability matrix P(t) is the matrix exponential of Qt:</p>
    <div class="math-block">
    $$P(t) = \exp(Qt) = \sum_{k=0}^{\infty} \frac{(Qt)^k}{k!} = I + tQ + \frac{(tQ)^2}{2!} + \frac{(tQ)^3}{3!} + \ldots$$
    </div>
</div>

<h3>CTMC Example</h3>

<div class="practice-box">
    <h4>Two-State System</h4>
    <p>Consider a system with states 0 and 1, with rate matrix:</p>
    <div class="math-block">
    $$Q = \begin{bmatrix} -2 & 2 \\ 1 & -1 \end{bmatrix}$$
    </div>
    
    <p>This means:</p>
    <ul>
        <li>Rate 0→1: 2 per unit time</li>
        <li>Rate 1→0: 1 per unit time</li>
    </ul>
    
    <p>Time spent in state before transition follows exponential distribution:</p>
    <div class="math-block">
    $$P(\Delta t|x) = \lambda e^{-\lambda \Delta t}$$
    </div>
    where $\lambda = -Q_{xx}$ is the total rate of leaving state x.
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
    <li>Stationary distribution satisfies: $\pi Q = 0$</li>
    <li>Mathematical convenience for phylogenetics</li>
    <li>No biological justification required!</li>
</ul>

</section>

<section class="section" id="substitution-models">
<h2>4. DNA Substitution Models</h2>

<h3>Jukes-Cantor (JC69) Model</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/JC.svg" alt="Jukes-Cantor model" style="width: 30%; display: inline-block; vertical-align: middle;">
    <div style="display: inline-block; width: 50%; vertical-align: middle; margin-left: 2em;">
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

<p><strong>Assumptions:</strong></p>
<ul>
    <li>All substitutions equally likely</li>
    <li>Equal base frequencies (0.25 each)</li>
    <li>Simplest possible model</li>
</ul>

<p><strong>Transition probabilities:</strong></p>
<div class="math-block">
$$P_{ij}(t) = \begin{cases}
\frac{1}{4} + \frac{3}{4}e^{-\frac{4}{3}\mu t} & \text{if } i = j \\
\frac{1}{4} - \frac{1}{4}e^{-\frac{4}{3}\mu t} & \text{if } i \neq j
\end{cases}$$
</div>

<h4>Genetic Distance Under JC69</h4>

<p>Given observed p-distance, we can estimate the genetic distance:</p>
<div class="math-block">
$$\hat{d} = -\frac{3}{4}\log\left(1 - \frac{4}{3}p\right)$$
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Limitations:</strong>
        <ul>
            <li>Only valid if p is exact (infinite sequences)</li>
            <li>Diverges if p ≥ 3/4</li>
            <li>Assumes all changes equally likely</li>
        </ul>
    </div>
</div>

<h3>Kimura 2-Parameter (K80) Model</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/K80.svg" alt="Kimura 80 model" style="width: 30%; display: inline-block; vertical-align: middle;">
    <div style="display: inline-block; width: 50%; vertical-align: middle; margin-left: 2em;">
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

<p><strong>Features:</strong></p>
<ul>
    <li>Different rates for transitions (α) and transversions (β)</li>
    <li>Still assumes equal base frequencies</li>
    <li>Accounts for transition/transversion bias</li>
</ul>

<h3>HKY Model</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/HKY.svg" alt="HKY model" style="width: 30%; display: inline-block; vertical-align: middle;">
    <div style="display: inline-block; width: 50%; vertical-align: middle; margin-left: 2em;">
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

<p><strong>Features:</strong></p>
<ul>
    <li>Different transition/transversion rates</li>
    <li>Unequal base frequencies (πA, πC, πG, πT)</li>
    <li>Most complex model with analytical solution</li>
    <li>Due to Hasegawa, Kishino, Yano (1985)</li>
</ul>

<h3>General Time Reversible (GTR) Model</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/GTR.svg" alt="GTR model" style="width: 30%; display: inline-block; vertical-align: middle;">
    <div style="display: inline-block; width: 50%; vertical-align: middle; margin-left: 2em;">
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

<p><strong>Features:</strong></p>
<ul>
    <li>Most general time-reversible model</li>
    <li>Six substitution rate parameters</li>
    <li>Four base frequency parameters</li>
    <li>No analytical solution (must use numerical methods)</li>
</ul>

<h3>Rate Heterogeneity Among Sites</h3>

<p>Not all sites evolve at the same rate. We model this using a gamma distribution:</p>

<div class="math-block">
$$f(r) = \frac{\alpha^\alpha}{\Gamma(\alpha)} r^{\alpha-1} e^{-\alpha r}$$
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/gamma_rates.png" alt="Gamma distributions" style="width: 50%;">
    <div class="figure-caption">Different values of α give different rate distributions. Small α = high variation</div>
</div>

<p>For JC69 with gamma-distributed rates:</p>
<div class="math-block">
$$\hat{d} = -\frac{3}{4}\alpha\left[\left(1-\frac{4}{3}p\right)^{-1/\alpha} - 1\right]$$
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
    <p>Note how model choice affects distance estimates, especially for divergent sequences!</p>
</div>
</section>

<section class="section" id="likelihood">
<h2>5. Likelihood-Based Phylogenetic Inference</h2>

<h3>Least-Squares with Genetic Distances</h3>

<p>Before introducing likelihood, consider how we can use genetic distances:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/lsq.svg" alt="Least squares phylogenetics" style="width: 45%; display: inline-block;">
    <div style="display: inline-block; width: 50%; vertical-align: middle; margin-left: 1em;">
        <p>Cost function:</p>
        <div class="math-block">
        $$C(T) = \sum_i \sum_j w_{ij}(d_{ij}(T) - \hat{d}_{ij})^2$$
        </div>
        <p>Where:</p>
        <ul>
            <li>$d_{ij}(T)$ = tree distance</li>
            <li>$\hat{d}_{ij}$ = estimated genetic distance</li>
            <li>$w_{ij}$ = weights</li>
        </ul>
    </div>
</div>

<p><strong>Comments:</strong></p>
<ul>
    <li>Ignores correlations due to shared ancestry</li>
    <li>Consistent estimator (converges to truth with infinite data)</li>
    <li>Still gives only point estimates</li>
</ul>

<h3>The Likelihood Function</h3>

<div class="definition-box">
    <div class="title">Likelihood</div>
    <p>The likelihood for parameter θ under model M given data D is:</p>
    <div class="math-block">
    $$L(\theta|D,M) \equiv P(D|\theta,M)$$
    </div>
    <p><strong>Important:</strong> The likelihood is NOT a probability distribution over θ!</p>
</div>

<div class="example-box">
    <h4>Coin Toss Example</h4>
    <p>5 tosses give: D = (H,T,T,H,T)</p>
    <p>Probability of this sequence:</p>
    <div class="math-block">
    $$P(D|f) = f \times (1-f) \times (1-f) \times f \times (1-f) = f^2(1-f)^3 = L(f|D)$$
    </div>
    <div class="figure">
        <div id="maxLikelihoodOut" style="width:100%;height:250px">
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
                    title: "f"
                },
                yaxis: {
                    title: "L(f|D)",
                },
                margin: {
                    t:10,
                    b:20
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

            Plotly.newPlot('maxLikelihoodOut', [trace], layout, {displayModeBar: false});
            </script>
    </div>
        <div class="figure-caption">Likelihood function peaks at f = 2/5 = 0.4</div>
    </div>
</div>

<h3>Maximum Likelihood Inference</h3>

<blockquote>
    Sensible methods of parameter estimation often correspond to values which maximize the likelihood function.
</blockquote>

<p>For the coin example:</p>
<div class="math-block">
$$\log L(f|D) = n\log f + (N-n)\log(1-f)$$
$$\frac{\partial}{\partial f}\log L(f|D)\bigg|_{f=f_{ML}} = 0 \implies f_{ML} = \frac{n}{N}$$
</div>

<h3>Tree Likelihood</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lectureSubstitutionModels/treeLikelihood.svg" alt="Tree likelihood calculation" style="width: 40%;">
    <div class="figure-caption">Computing likelihood requires summing over all possible ancestral states</div>
</div>

<p>The likelihood of a tree is:</p>
<div class="math-block">
$$L(T|A) = P(A|T) = \sum_x \sum_w P(x)P(A|x)P(w|x)P(G|w)P(G|w)$$
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Computational challenge:</strong> For n taxa, there are 4^(n-1) possible internal node states!
    </div>
</div>

<h3>Felsenstein's Pruning Algorithm</h3>

<p>Joseph Felsenstein (1973) solved this using dynamic programming:</p>

<div class="algorithm-box">
    <h4>Pruning Algorithm</h4>
    <p>Define $L_k(s)$ = conditional likelihood of subtree below node k having state s</p>
    
    <p><strong>For leaves:</strong></p>
    <div class="math-block">
    $$L_k(s) = \begin{cases}
    1 & \text{if leaf has state } s \\
    0 & \text{otherwise}
    \end{cases}$$
    </div>
    
    <p><strong>For internal nodes:</strong></p>
    <div class="math-block">
    $$L_k(s) = \left(\sum_x P(x|s)L_{c_l}(x)\right)\left(\sum_y P(y|s)L_{c_r}(y)\right)$$
    </div>
    
    <p>where $c_l$ and $c_r$ are the left and right children of node k.</p>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Efficiency:</strong> Time complexity for m sites: O(mn × 16). This is the workhorse of computational phylogenetics!
    </div>
</div>

<h3>Maximum Likelihood Software</h3>

<div class="tools-box">
    <h4>ML Phylogenetic Software</h4>
    <ul>
        <li><strong>PhyML</strong> (Guindon & Gascuel, 2003)
            <ul>
                <li>Hill-climbing algorithm for ML trees</li>
                <li>Good for moderate-sized datasets</li>
            </ul>
        </li>
        <li><strong>RAxML</strong> (Stamatakis, 2005)
            <ul>
                <li>Optimized for large trees</li>
                <li>Parallel implementations available</li>
            </ul>
        </li>
        <li><strong>IQ-TREE</strong> (Nguyen et al., 2015)
            <ul>
                <li>Efficient tree search</li>
                <li>Automatic model selection</li>
            </ul>
        </li>
        <li><strong>FastTree</strong> (Price et al., 2009)
            <ul>
                <li>Uses NJ for starting tree</li>
                <li>Can handle >10^5 sequences</li>
            </ul>
        </li>
    </ul>
</div>

<h3>Problems with Maximum Likelihood</h3>

<ul>
    <li><strong>Point estimates only</strong>
        <ul>
            <li>No indication of uncertainty</li>
            <li>Addressed with bootstrap (more ad hoc methods!)</li>
        </ul>
    </li>
    <li><strong>Theoretical issues</strong>
        <ul>
            <li>L(θ|D) is not a probability</li>
            <li>No principled way to compare non-nested models</li>
        </ul>
    </li>
    <li><strong>No prior information</strong>
        <ul>
            <li>Cannot incorporate existing knowledge</li>
            <li>All parameter values initially equally likely</li>
        </ul>
    </li>
</ul>

<blockquote>
    We need a better approach that addresses these limitations!
</blockquote>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture introduced model-based phylogenetic inference:</p>

<ol>
    <li><strong>Motivation:</strong> Parsimony has significant limitations that require a model-based approach</li>
    
    <li><strong>Substitution models:</strong> 
        <ul>
            <li>CTMCs provide mathematical framework</li>
            <li>Models range from simple (JC69) to complex (GTR)</li>
            <li>Can incorporate rate heterogeneity</li>
        </ul>
    </li>
    
    <li><strong>Distance estimation:</strong> Models correct for unseen changes, giving better estimates than p-distance</li>
    
    <li><strong>Likelihood methods:</strong>
        <ul>
            <li>Principled statistical framework</li>
            <li>Efficient algorithms (Felsenstein's pruning)</li>
            <li>But still have limitations</li>
        </ul>
    </li>
    
    <li><strong>Next step:</strong> Bayesian inference addresses ML limitations by treating parameters as random variables</li>
</ol>

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
        <li>What makes GTR the most general time-reversible model?</li>
        <li>How does Felsenstein's algorithm achieve computational efficiency?</li>
        <li>What are the key differences between JC69, K80, and HKY models?</li>
        <li>Why isn't likelihood a probability distribution over parameters?</li>
    </ol>
</div>
</section>