---
layout: lecture_notes
title: "Bayesian Inference"
lecture_num: 8
section: bayesian_phylo
section_name: "Bayesian Phylogenetics"
previous_lecture: lecture7_likelihood_notes
next_lecture: lecture9_mcmc_phylogenetics
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 8</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Jaynes Ch. 1-3</span>
    </div>
</div>

<section class="section" id="probability">
<h2>1. Probability as Extended Logic</h2>

<h3>From Logic to Plausible Reasoning</h3>

<p>Traditional deductive logic is based on syllogisms that provide certain conclusions:</p>

<div class="logic-box">
    <div class="syllogism">
        <p class="premise">If A is true, then B is true</p>
        <p class="premise">A is true</p>
        <hr>
        <p class="conclusion">Therefore, B is true</p>
    </div>
    
    <div class="syllogism">
        <p class="premise">If A is true, then B is true</p>
        <p class="premise">B is false</p>
        <hr>
        <p class="conclusion">Therefore, A is false</p>
    </div>
</div>

<p>But real-world reasoning often requires handling uncertainty. Consider this scenario:</p>

<blockquote>
    Suppose some dark night a policeman walks down a street. He hears a burglar alarm, looks across the street, and sees a jewelry store with a broken window. Then a gentleman wearing a mask comes crawling out of the window, carrying a bag full of jewelry. The policeman decides immediately that the gentleman is a thief. How does he decide this?
    <cite>— E.T. Jaynes, Probability Theory</cite>
</blockquote>

<p>Let's analyze this:</p>
<ul>
    <li>A: "the gentleman is a thief"</li>
    <li>B: "the gentleman is wearing a mask and exited a broken window holding a bag of jewelry"</li>
</ul>

<p>The policeman appears to use a <strong>weak syllogism</strong>:</p>

<div class="logic-box">
    <div class="syllogism weak">
        <p class="premise">If A is true, then B is likely</p>
        <p class="premise">B is true</p>
        <hr>
        <p class="conclusion">Therefore, A is likely</p>
    </div>
</div>

<div class="alert alert-info">
    <i class="fas fa-question-circle"></i>
    <div>
        <strong>Key Question:</strong> Why does this reasoning seem so sound? How can we formalize this type of plausible reasoning?
    </div>
</div>

<h3>Developing a Theory of Plausible Reasoning</h3>

<p>To formalize reasoning under uncertainty, our theory must satisfy:</p>

<ol>
    <li><strong>Degrees of plausibility are represented by real numbers</strong></li>
    <li><strong>Qualitative correspondence with common sense</strong></li>
    <li><strong>Consistency:</strong>
        <ul>
            <li>All valid reasoning routes give the same result</li>
            <li>Equivalent states of knowledge have equivalent plausibilities</li>
        </ul>
    </li>
</ol>

<div class="definition-box">
    <div class="title">Cox's Theorem</div>
    <p>These requirements uniquely identify the rules of probability theory!</p>
    <ul>
        <li>Richard Cox (1946) showed that any consistent system for plausible reasoning must follow the rules of probability</li>
        <li>Probability theory is thus the unique extension of logic to handle uncertainty</li>
    </ul>
</div>

<h3>The Rules of Probability</h3>

<p>From Cox's axioms, we derive:</p>

<div class="math-box">
    <h4>Fundamental Rules</h4>
    <ul>
        <li><strong>Probability:</strong> $P(A|B)$ is the degree of plausibility of proposition A given that B is true</li>
        <li><strong>Product Rule:</strong> $P(A,B|C) = P(A|B,C)P(B|C)$</li>
        <li><strong>Sum Rule:</strong> $P(A|B) + P(\neg A|B) = 1$</li>
    </ul>
    <p>By convention: $P(A) = 0$ means A is certainly false; $P(A) = 1$ means A is certainly true</p>
</div>

<div class="alert alert-success">
    <i class="fas fa-check-circle"></i>
    <div>
        <strong>That's it!</strong> These simple rules are sufficient for all of Bayesian statistics!
    </div>
</div>

<h3>Notation and Continuous Variables</h3>

<p>For continuous variables, we use probability densities:</p>
<ul>
    <li>If X can take any value between 0 and 10, then $P(X = x) = 0$ always</li>
    <li>Instead, define: $P(x < X < x + \delta) = \delta f(x)$</li>
    <li>$f(x)$ is a probability <strong>density</strong></li>
    <li>Normalization: $\int_0^{10} f(x)dx = 1$</li>
    <li>Non-negative: $f(x) \geq 0$</li>
    <li>Can have $f(x) > 1$ at specific points!</li>
</ul>

<h3>Bayesian vs. Frequentist Interpretations</h3>

<div class="comparison-box">
    <div class="comparison-column">
        <h4>Frequentist</h4>
        <ul>
            <li>Probability = long-run frequency</li>
            <li>Requires repeatable experiments</li>
            <li>Assumes randomness is inherent</li>
            <li>Cannot assign probabilities to hypotheses</li>
        </ul>
    </div>
    <div class="comparison-column">
        <h4>Bayesian</h4>
        <ul>
            <li>Probability = degree of belief</li>
            <li>Works for unique events</li>
            <li>Uncertainty due to incomplete information</li>
            <li>Can reason about any proposition</li>
        </ul>
    </div>
</div>

<p>Example illustrating the difference:</p>
<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/dice_inference.svg" alt="Bayesian dice inference" style="width: 80%;">
    <div class="figure-caption">A single proposition can have different probabilities depending on available information</div>
</div>

<h3>Justifications for the Bayesian Approach</h3>

<dl>
    <dt><strong>Axiomatic approach</strong></dt>
    <dd>Derivation from axioms for manipulating reasonable expectations (Cox's theorem)</dd>
    
    <dt><strong>Dutch book approach</strong></dt>
    <dd>If probability rules aren't followed for gambling odds, one party can always win</dd>
    
    <dt><strong>Decision theory approach</strong></dt>
    <dd>Every admissible statistical procedure is either Bayesian or a limit of Bayesian procedures</dd>
</dl>
</section>

<section class="section" id="inference">
<h2>2. Bayesian Inference</h2>

<h3>What is Inference?</h3>

<div class="definition-box">
    <div class="title">Statistical Inference</div>
    <p>The act of deriving logical conclusions from premises when the premises are not sufficient to draw conclusions without uncertainty.</p>
</div>

<h3>Example: The Urn Problem</h3>

<div class="example-box">
    <h4>Setup</h4>
    <img src="{{ site.baseurl }}/lecture8/urn.svg" alt="Urn with colored balls" style="float: right; width: 30%;">
    <ul>
        <li>An urn contains 11 balls: $N_r$ red and $11 - N_r$ blue</li>
        <li>We draw a ball, record its color, and replace it</li>
        <li>Repeat 3 times, obtaining: R, B, R</li>
    </ul>
    <p style="clear: both;"><strong>Question:</strong> What is $P(N_r | d_1=R, d_2=B, d_3=R)$?</p>
</div>

<h4>Solution</h4>

<p>First, calculate the likelihood:</p>
<div class="math-block">
$$P(d_1=R, d_2=B, d_3=R | N_r) = \frac{N_r}{11} \times \frac{11-N_r}{11} \times \frac{N_r}{11} = \frac{N_r^2(11-N_r)}{11^3}$$
</div>

<p>Apply the product rule to get:</p>
<div class="math-block">
$$P(N_r | R,B,R) = \frac{P(R,B,R | N_r) P(N_r)}{P(R,B,R)}$$
</div>

<p>Where:</p>
<ul>
    <li>$P(R,B,R | N_r)$ is the likelihood</li>
    <li>$P(N_r)$ is the prior probability</li>
    <li>$P(R,B,R)$ is a normalization constant</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/urn_posterior.png" alt="Posterior distribution for urn problem" style="width: 70%;">
    <div class="figure-caption">Posterior distribution for number of red balls given observations R,B,R</div>
</div>

<h3>Bayes' Theorem</h3>

<p>The urn example illustrates the general form of Bayes' theorem:</p>

<div class="theorem-box">
    <h4>Bayes' Theorem</h4>
    <div class="math-block">
    $$\color{cyan}{P(\theta_M|D,M)} = \frac{\color{orange}{P(D|\theta_M,M)}\color{red}{P(\theta_M|M)}}{\color{lime}{P(D|M)}}$$
    </div>
    <p>Where:</p>
    <ul>
        <li><span style="color: darkcyan;">Posterior</span> $P(\theta_M|D,M)$: Updated belief about parameters after seeing data</li>
        <li><span style="color: orange;">Likelihood</span> $P(D|\theta_M,M)$: Probability of data given parameters</li>
        <li><span style="color: red;">Prior</span> $P(\theta_M|M)$: Initial belief about parameters</li>
        <li><span style="color: green;">Evidence</span> $P(D|M)$: Marginal likelihood, normalizing constant</li>
    </ul>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> Bayes' theorem is just the product rule of probability rearranged! It's not a special assumption or axiom.
    </div>
</div>
</section>

<section class="section" id="priors">
<h2>3. Prior Probabilities</h2>

<h3>What is a Prior?</h3>

<div class="definition-box">
    <div class="title">Prior Probability</div>
    <p>A prior is simply a probability — specifically, the probability of your hypothesis in the absence of the specific data you're about to analyze.</p>
</div>

<p>Key points about priors:</p>
<ul>
    <li>In principle, two rational people with the same information should specify the same prior</li>
    <li>In practice, this often doesn't happen due to different background knowledge</li>
    <li>Priors are <strong>necessary</strong> — you cannot do inference without assumptions</li>
    <li>Frequentist methods also use priors implicitly</li>
</ul>

<h3>Priors for Discrete Variables</h3>

<ul>
    <li><strong>Finite support:</strong> Often use uniform distribution (principle of indifference)</li>
    <li><strong>Count data:</strong> Poisson distribution may be appropriate</li>
    <li><strong>Maximum entropy:</strong> Choose the distribution with maximum entropy subject to constraints</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/poissonian.png" alt="Poisson distributions" style="width: 40%;">
    <div class="figure-caption">Poisson distributions for different rate parameters</div>
</div>

<h3>Priors for Continuous Variables</h3>

<p>For bounded continuous variables $a < x < b$:</p>
<ul>
    <li><strong>Uniform:</strong> $f(x) = 1/(b-a)$</li>
    <li><strong>Beta:</strong> $f(x) \propto (x-a)^{\alpha-1}(b-x)^{\beta-1}$</li>
</ul>

<p>For positive rate parameters $\lambda > 0$:</p>
<ul>
    <li><strong>Uniform:</strong> $f(\lambda) = c$ (improper!)</li>
    <li><strong>Jeffreys:</strong> $f(\lambda) = 1/\lambda$ (uniform in log space)</li>
    <li><strong>Log-normal:</strong> Proper alternative to Jeffreys prior</li>
</ul>

<h3>Improper Priors</h3>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Warning:</strong> Some priors cannot be normalized!
    </div>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/uniform_improper.png" alt="Improper uniform prior" style="width: 80%;">
    <div class="figure-caption">A uniform prior on an unbounded domain cannot be normalized</div>
</div>

<p>Remember:</p>
<ul>
    <li>One almost never knows absolutely nothing</li>
    <li>Upper and lower bounds can almost always be placed</li>
    <li>Log-normal can replace the improper $1/x$ prior</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/lognormal.png" alt="Log-normal distributions" style="width: 80%;">
    <div class="figure-caption">Log-normal distributions as proper alternatives to improper priors</div>
</div>

<h3>Which Prior is Best?</h3>

<blockquote class="important">
    Only the person doing the analysis can answer this! Priors encapsulate expert knowledge (or its absence). This is your opportunity to contribute your expertise to the analysis.
</blockquote>
</section>

<section class="section" id="uncertainty">
<h2>4. Summarizing Uncertainty</h2>

<h3>Credible Intervals</h3>

<p>Bayesian credible intervals summarize uncertainty in parameter estimates:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/credible_interval.png" alt="95% credible interval" style="width: 80%;">
    <div class="figure-caption">95% credible interval [0.41, 0.91] contains 95% of the posterior probability</div>
</div>

<div class="comparison-box">
    <div class="comparison-column">
        <h4>Credible Interval (Bayesian)</h4>
        <ul>
            <li>Given the data, 95% probability the parameter is in this interval</li>
            <li>Direct probability statement</li>
            <li>Depends on prior</li>
        </ul>
    </div>
    <div class="comparison-column">
        <h4>Confidence Interval (Frequentist)</h4>
        <ul>
            <li>95% of such intervals contain the true value</li>
            <li>No probability statement about this specific interval</li>
            <li>Prior-free (supposedly)</li>
        </ul>
    </div>
</div>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> For symmetric, unimodal distributions, credible intervals often coincide with confidence intervals, but their interpretations differ fundamentally.
    </div>
</div>
</section>

<section class="section" id="practice">
<h2>5. Inference in Practice</h2>

<h3>The Computational Challenge</h3>

<p>Bayes' theorem has a troublesome denominator:</p>

<div class="math-block">
$$P(\theta_M|D,M) = \frac{P(D|\theta_M,M)P(\theta_M|M)}{P(D|M)}$$
</div>

<p>The evidence $P(D|M)$ requires integration:</p>

<div class="math-block">
$$P(D|M) = \int P(D|\theta_M,M)P(\theta_M|M)d\theta_M$$
</div>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Problem:</strong>
        <ul>
            <li>Rarely can this integral be solved analytically</li>
            <li>For high-dimensional $\theta_M$, numerical integration is infeasible</li>
        </ul>
    </div>
</div>

<h3>Monte Carlo Methods</h3>

<div class="definition-box">
    <div class="title">Monte Carlo Methods</div>
    <p>Algorithms that produce random samples to characterize probability distributions.</p>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MonteCarlo.jpg" alt="Monte Carlo simulation" style="width: 60%;">
    <div class="figure-caption">Named after the Monte Carlo casino — using randomness to solve deterministic problems</div>
</div>

<h3>Rejection Sampling</h3>

<p>One of the simplest Monte Carlo methods:</p>

<div class="algorithm-box">
    <h4>Rejection Sampling Algorithm</h4>
    <ol>
        <li>Find an envelope distribution that bounds the target</li>
        <li>Sample uniformly under the envelope</li>
        <li>Accept samples under the target distribution</li>
        <li>Reject samples above the target</li>
    </ol>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/rejection_sampling1.svg" alt="Rejection sampling" style="width: 70%;">
    <div class="figure-caption">Green samples are accepted, red samples are rejected</div>
</div>

<h4>The Curse of Dimensionality</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/curse.svg" alt="Curse of dimensionality" style="width: 40%; float: right;">
    <p>As dimensions increase, the fraction of the envelope occupied by the target diminishes rapidly. For high-dimensional problems, rejection sampling becomes impractical.</p>
</div>
<div style="clear: both;"></div>

<h3>Markov Chain Monte Carlo (MCMC)</h3>

<p>The Metropolis-Hastings algorithm generates samples by creating a random walk:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MCMC6.svg" alt="MCMC random walk" style="width: 70%;">
    <div class="figure-caption">MCMC explores the target distribution through a directed random walk</div>
</div>

<p>Key advantages:</p>
<ul>
    <li>Walk explores mostly high-probability areas</li>
    <li>Does not require normalized target distribution</li>
    <li>Works in high dimensions</li>
</ul>

<h4>MCMC Output</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MCMC_trace.png" alt="MCMC trace" style="width: 45%; display: inline-block;">
    <img src="{{ site.baseurl }}/lecture8/MCMC_density.png" alt="MCMC density" style="width: 45%; display: inline-block;">
    <div class="figure-caption">Left: MCMC trace showing parameter values over iterations. Right: Resulting density estimate</div>
</div>

<h3>Convergence and Mixing</h3>

<p>MCMC challenges:</p>
<ul>
    <li>Adjacent samples are <strong>correlated</strong></li>
    <li>Initial state is arbitrary (burn-in needed)</li>
    <li>Must assess convergence and mixing</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MCMC_burnin.svg" alt="MCMC burn-in" style="width: 80%;">
    <div class="figure-caption">Burn-in period before chain converges to target distribution</div>
</div>

<h4>Assessing Convergence</h4>

<p>Compare multiple chains from different starting points:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MCMC_convergence_testing.png" alt="Convergence testing" style="width: 50%;">
    <div class="figure-caption">Multiple chains should converge to the same distribution</div>
</div>

<h4>Assessing Mixing</h4>

<p>Use the autocorrelation function:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture8/MCMC_acf.png" alt="Autocorrelation function" style="width: 80%;">
    <div class="figure-caption">Autocorrelation shows how quickly samples become independent</div>
</div>

<div class="definition-box">
    <div class="title">Effective Sample Size (ESS)</div>
    <div class="math-block">
    $$N_{\text{eff}} = \frac{N}{\tau}$$
    </div>
    <p>Where N is total samples and τ is the autocorrelation time. ESS estimates the number of independent samples.</p>
</div>

<h3>Other Approaches</h3>

<dl>
    <dt><strong>Monte Carlo Methods</strong></dt>
    <dd>
        <ul>
            <li>Gibbs sampling</li>
            <li>Hamiltonian Monte Carlo</li>
            <li>Particle filtering</li>
        </ul>
    </dd>
    
    <dt><strong>Deterministic Methods</strong></dt>
    <dd>
        <ul>
            <li>Variational Bayes</li>
            <li>Laplace approximation</li>
        </ul>
    </dd>
</dl>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture introduced Bayesian inference as the extension of logic to handle uncertainty:</p>

<ol>
    <li><strong>Probability as logic:</strong> Cox's theorem shows probability theory uniquely extends deductive logic</li>
    
    <li><strong>Bayes' theorem:</strong> Simply the product rule rearranged, provides a coherent framework for updating beliefs</li>
    
    <li><strong>Priors:</strong> Necessary for any inference, encode background knowledge</li>
    
    <li><strong>Computational methods:</strong> MCMC makes Bayesian inference practical for complex problems</li>
    
    <li><strong>Advantages:</strong>
        <ul>
            <li>Direct probability statements about parameters</li>
            <li>Coherent handling of uncertainty</li>
            <li>Natural incorporation of prior knowledge</li>
        </ul>
    </li>
</ol>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Further Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>E.T. Jaynes (2003) "Probability Theory: The Logic of Science"</li>
            <li>MacKay (2003) "Information Theory, Inference, and Learning Algorithms"</li>
            <li>Gelman et al. (2013) "Bayesian Data Analysis"</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why is probability theory the unique extension of logic for handling uncertainty?</li>
        <li>What's the difference between likelihood and posterior probability?</li>
        <li>Why are priors necessary for inference?</li>
        <li>What is the "curse of dimensionality" in rejection sampling?</li>
        <li>How do we assess MCMC convergence and mixing?</li>
    </ol>
</div>
</section>
