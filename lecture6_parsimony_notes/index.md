---
layout: lecture_notes
title: "Maximum Parsimony"
lecture_num: 6
section: introduction
section_name: "Introduction to Phylogenetics"
previous_lecture: lecture5_phylogenetics_notes
next_lecture: lecture7_likelihood
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 6</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Felsenstein Ch. 1-3</span>
    </div>
</div>

<section class="section" id="introduction">
<h2>1. Characters and Character States</h2>

<p>To understand parsimony, we first need to understand the fundamental units of phylogenetic analysis: characters and character states.</p>

<div class="definition-box">
    <div class="title">Key Definitions</div>
    <ul>
        <li><strong>Character:</strong> A feature that can vary among organisms (e.g., a nucleotide position in DNA, presence/absence of wings)</li>
        <li><strong>Character state:</strong> The specific condition of a character in a particular organism (e.g., A, C, G, or T at a DNA position)</li>
        <li><strong>Character matrix:</strong> A table showing character states for all taxa across all characters</li>
    </ul>
</div>

<p>Example character matrix for DNA sequences:</p>

<table class="character-matrix">
    <tr>
        <th>Taxon</th>
        <th colspan="10">Character (position)</th>
    </tr>
    <tr>
        <th></th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
    </tr>
    <tr>
        <td>Human</td>
        <td>A</td><td>G</td><td>C</td><td>T</td><td>A</td><td>C</td><td>G</td><td>G</td><td>T</td><td>A</td>
    </tr>
    <tr>
        <td>Chimp</td>
        <td>A</td><td>G</td><td>C</td><td>T</td><td>A</td><td>C</td><td>G</td><td>A</td><td>T</td><td>A</td>
    </tr>
    <tr>
        <td>Gorilla</td>
        <td>A</td><td>G</td><td>T</td><td>T</td><td>G</td><td>C</td><td>G</td><td>A</td><td>T</td><td>C</td>
    </tr>
    <tr>
        <td>Orangutan</td>
        <td>A</td><td>A</td><td>T</td><td>C</td><td>G</td><td>T</td><td>A</td><td>A</td><td>C</td><td>C</td>
    </tr>
</table>

<p>Similarities and differences in character states provide evidence for inferring evolutionary relationships.</p>

<h3>When Do Characters Support the Correct Tree?</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/CharactersSupportTree.png" alt="Characters supporting phylogenetic trees" style="width: 80%;">
    <div class="figure-caption">Characters provide evidence for phylogenetic relationships through shared derived states</div>
</div>

<p>Characters support correct phylogenetic inference when:</p>
<ul>
    <li>Shared character states reflect common ancestry (homology)</li>
    <li>Changes are rare enough that multiple changes to the same state are uncommon</li>
    <li>There's sufficient variation to be informative</li>
</ul>

<h3>The Problem of Homoplasy</h3>

<div class="definition-box">
    <div class="title">Homoplasy</div>
    <p>Similarity in character states that is not due to common ancestry. This can arise from:</p>
    <ul>
        <li><strong>Convergent evolution:</strong> Independent evolution of similar traits</li>
        <li><strong>Parallel evolution:</strong> Independent evolution along similar pathways</li>
        <li><strong>Reversals:</strong> Return to an ancestral character state</li>
    </ul>
</div>

<h4>Reversals</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/Reversals.png" alt="Character reversals in evolution" style="width: 80%;">
    <div class="figure-caption">Reversals to ancestral states can mislead phylogenetic inference</div>
</div>

<p>If a character reverts to an ancestral state, this can affect phylogenetic inference by creating false signals of relationship.</p>
</section>

<section class="section" id="parsimony-principle">
<h2>2. The Parsimony Principle</h2>

<div class="definition-box">
    <div class="title">Maximum Parsimony</div>
    <p>A method of phylogenetic inference that selects the tree(s) requiring the fewest evolutionary changes to explain the observed data.</p>
</div>

<p>Key concepts in parsimony analysis:</p>
<ul>
    <li><strong>Key issue:</strong> How to separate homoplasy from homology (true shared ancestry)</li>
    <li><strong>Parsimony criterion:</strong> Favors hypotheses that maximize congruence and minimize homoplasy</li>
    <li><strong>Optimization problem:</strong> Find the tree with the minimum number of character state changes</li>
</ul>

<h3>Character Fit to Trees</h3>

<p>The "fit" of a character to a tree is defined as the minimum number of steps (changes) required to explain the observed distribution of character states at the tips.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/Parsimony.png" alt="Parsimony analysis example" style="width: 90%;">
    <div class="figure-caption">Different trees require different numbers of changes to explain the same character data</div>
</div>

<div class="practice-box">
    <h4>Parsimony Calculation</h4>
    <p>Given a set of characters (e.g., aligned sequences):</p>
    <ol>
        <li>For each character, determine the minimum number of steps on a given tree</li>
        <li>Sum over all characters to get the <strong>tree length</strong></li>
        <li>The <strong>most parsimonious trees (MPTs)</strong> have the minimum tree length</li>
    </ol>
</div>

<h3>Parsimony Informative Sites</h3>

<p>Not all characters contribute equally to distinguishing between alternative trees:</p>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Parsimony-informative sites</strong> must have:
        <ul>
            <li>At least two different character states</li>
            <li>Each state appearing in at least two taxa</li>
        </ul>
    </div>
</div>

<p>Examples of non-informative sites:</p>
<ul>
    <li><strong>Invariant sites:</strong> All taxa have the same state (always score 0)</li>
    <li><strong>Singleton sites:</strong> Only one taxon differs (always score 1)</li>
</ul>

<div class="example-box">
    <h4>Identifying Informative Sites</h4>
    <table class="small-table">
        <tr>
            <th>Site</th>
            <th>Pattern</th>
            <th>Informative?</th>
            <th>Reason</th>
        </tr>
        <tr>
            <td>1</td>
            <td>AAAA</td>
            <td>No</td>
            <td>Invariant</td>
        </tr>
        <tr>
            <td>2</td>
            <td>AAAG</td>
            <td>No</td>
            <td>Singleton</td>
        </tr>
        <tr>
            <td>3</td>
            <td>AAGG</td>
            <td>Yes</td>
            <td>Two states, each in ≥2 taxa</td>
        </tr>
        <tr>
            <td>4</td>
            <td>AGTC</td>
            <td>No</td>
            <td>No state in ≥2 taxa</td>
        </tr>
    </table>
</div>
</section>

<section class="section" id="algorithms">
<h2>3. Computing Parsimony Scores</h2>

<h3>The Small Parsimony Problem</h3>

<p>Given a tree topology and character data at the tips, find:</p>
<ol>
    <li>The minimum number of changes required for each character</li>
    <li>The ancestral states that achieve this minimum</li>
</ol>

<h3>Dynamic Programming Solution</h3>

<p>We can solve this efficiently using dynamic programming (Sankoff algorithm):</p>

<div class="algorithm-box">
    <h4>Sankoff Algorithm</h4>
    <p>For each node $v$ and each possible state $X$, calculate $m[v,X]$ = minimum cost of the subtree rooted at $v$ if $v$ has state $X$.</p>
    
    <p><strong>For leaf nodes:</strong></p>
    <div class="math-block">
    $$m[v,X] = \begin{cases}
    0 & \text{if character state for } v \text{ is } X\\
    \infty & \text{otherwise}
    \end{cases}$$
    </div>
    
    <p><strong>For internal nodes (with children L and R):</strong></p>
    <div class="math-block">
    $$m[v,X] = \min_Y\{m[L,Y] + c(X,Y)\} + \min_Z\{m[R,Z] + c(X,Z)\}$$
    </div>
    
    <p>where $c(X,Y)$ is the cost of changing from state $X$ to state $Y$.</p>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/LengthOfCharacter.png" alt="Computing parsimony length for a character" style="width: 80%;">
    <div class="figure-caption">Dynamic programming computes optimal ancestral states bottom-up</div>
</div>

<h3>Complexity Analysis</h3>

<p>For the small parsimony problem:</p>
<ul>
    <li><strong>Time complexity:</strong> $O(nS^2L)$
        <ul>
            <li>$n$ = number of taxa (gives $2n-1$ nodes in rooted binary tree)</li>
            <li>$S$ = number of possible states (4 for DNA)</li>
            <li>$L$ = sequence length</li>
            <li>At each node: $O(S^2)$ calculations</li>
        </ul>
    </li>
    <li><strong>Space complexity:</strong> $O(nS)$ to store the dynamic programming table</li>
</ul>

<h3>Fitch Parsimony</h3>

<p>For the special case where all changes have equal cost (unweighted parsimony), Fitch (1971) developed a faster algorithm:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/fitchAlgorithm.png" alt="Fitch parsimony algorithm" style="width: 80%;">
    <div class="figure-caption">The Fitch algorithm uses set operations for unweighted parsimony</div>
</div>

<div class="algorithm-box">
    <h4>Fitch Algorithm</h4>
    <p><strong>Phase 1 (Bottom-up):</strong></p>
    <ul>
        <li>For each leaf, assign its observed state</li>
        <li>For each internal node with children having state sets $S_L$ and $S_R$:
            <ul>
                <li>If $S_L \cap S_R \neq \emptyset$: assign $S_L \cap S_R$ (intersection)</li>
                <li>If $S_L \cap S_R = \emptyset$: assign $S_L \cup S_R$ (union) and count one change</li>
            </ul>
        </li>
    </ul>
    
    <p><strong>Phase 2 (Top-down):</strong></p>
    <ul>
        <li>Assign specific ancestral states using the sets computed in Phase 1</li>
    </ul>
</div>

<div class="practice-box">
    <h4>Fitch Algorithm Example</h4>
    <p>Consider a simple tree with tips having states: ((A,G),(A,T))</p>
    <ol>
        <li>Left child of root: A ∩ G = ∅, so assign {A,G}, cost = 1</li>
        <li>Right child of root: A ∩ T = ∅, so assign {A,T}, cost = 1</li>
        <li>Root: {A,G} ∩ {A,T} = {A}, so assign {A}, no additional cost</li>
        <li>Total parsimony score = 2</li>
    </ol>
</div>
</section>

<section class="section" id="tree-search">
<h2>4. Finding Optimal Trees</h2>

<p>The "large parsimony problem" involves finding the tree topology (or topologies) with the minimum parsimony score:</p>

<h3>Search Strategies</h3>

<ol>
    <li><strong>Exhaustive search:</strong> Evaluate all possible trees
        <ul>
            <li>Guarantees finding all MPTs</li>
            <li>Only feasible for small numbers of taxa (≤10-12)</li>
        </ul>
    </li>
    
    <li><strong>Branch-and-bound:</strong> Intelligent exhaustive search
        <ul>
            <li>Uses lower bounds to eliminate parts of tree space</li>
            <li>Still guarantees finding all MPTs</li>
            <li>Practical for up to ~20-25 taxa</li>
        </ul>
    </li>
    
    <li><strong>Heuristic search:</strong> Not guaranteed to find optimal trees
        <ul>
            <li>Necessary for larger datasets</li>
            <li>Various strategies for exploring tree space</li>
        </ul>
    </li>
</ol>

<h3>Branch-and-Bound Example</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/branch-and-bound.png" alt="Branch and bound search strategy" style="width: 70%;">
    <div class="figure-caption">Branch-and-bound prunes search space by eliminating partial trees that cannot be optimal</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Key insight:</strong> If a partial tree already has a parsimony score higher than a complete tree we've found, we can abandon that path.
    </div>
</div>

<h3>Heuristic Search Methods</h3>

<p>Since the number of trees grows exponentially (NP-complete problem), heuristic methods are essential for larger datasets:</p>

<div class="algorithm-box">
    <h4>General Heuristic Strategy</h4>
    <ol>
        <li><strong>Generate starting tree(s)</strong>
            <ul>
                <li>Stepwise addition</li>
                <li>Star decomposition</li>
                <li>Random trees</li>
            </ul>
        </li>
        <li><strong>Local search via branch swapping</strong>
            <ul>
                <li>Nearest Neighbor Interchange (NNI)</li>
                <li>Subtree Pruning and Regrafting (SPR)</li>
                <li>Tree Bisection and Reconnection (TBR)</li>
            </ul>
        </li>
    </ol>
</div>

<h4>Branch Swapping Methods</h4>

<ul>
    <li><strong>NNI (Nearest Neighbor Interchange):</strong>
        <ul>
            <li>Swaps adjacent branches</li>
            <li>Fastest but most limited</li>
            <li>Can get stuck in local optima</li>
        </ul>
    </li>
    
    <li><strong>SPR (Subtree Pruning and Regrafting):</strong>
        <ul>
            <li>Detaches a subtree and reattaches elsewhere</li>
            <li>More extensive search than NNI</li>
        </ul>
    </li>
    
    <li><strong>TBR (Tree Bisection and Reconnection):</strong>
        <ul>
            <li>Breaks tree into two subtrees and reconnects</li>
            <li>Most extensive rearrangements</li>
            <li>Best for escaping local optima</li>
        </ul>
    </li>
</ul>
</section>

<section class="section" id="tree-representation">
<h2>5. Tree Representation in Computers</h2>

<p>Understanding how trees are stored in memory is crucial for implementing phylogenetic algorithms:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture6/InternalStorage.png" alt="Internal tree representation" style="width: 80%;">
    <div class="figure-caption">Trees can be represented as tables showing parent-child relationships</div>
</div>

<div class="definition-box">
    <div class="title">Tree Traversal Orders</div>
    <ul>
        <li><strong>Pre-order:</strong> Visit parent before children (shown in table)</li>
        <li><strong>Post-order:</strong> Visit children before parent (used in Fitch algorithm)</li>
    </ul>
</div>

<div class="practice-box">
    <h4>Tree Traversal Example</h4>
    <p>For tree (((A,B),C),(D,E)) with nodes numbered as in the figure:</p>
    <ul>
        <li><strong>Pre-order:</strong> 1 → 2 → 3 → 4(A) → 5(B) → 6(C) → 7 → 8(D) → 9(E)</li>
        <li><strong>Post-order:</strong> 4(A) → 5(B) → 3 → 6(C) → 2 → 8(D) → 9(E) → 7 → 1</li>
    </ul>
    <p>Note: The table in the figure shows nodes in pre-order, which is why they're numbered 1-9 in that sequence.</p>
</div>
</section>

<section class="section" id="summary">
<h2>6. Parsimony Summary</h2>

<h3>Advantages of Parsimony</h3>
<ul>
    <li>Simple, intuitive principle (Occam's Razor)</li>
    <li>No explicit evolutionary model required</li>
    <li>Fast algorithms for scoring trees</li>
    <li>Can handle any type of character data</li>
    <li>Identifies synapomorphies (shared derived characters)</li>
</ul>

<h3>Limitations of Parsimony</h3>
<ul>
    <li>Can be inconsistent under certain conditions (long branch attraction)</li>
    <li>Doesn't account for multiple substitutions on a branch</li>
    <li>All changes treated equally (unless weighted)</li>
    <li>No measure of uncertainty or support</li>
    <li>No branch length estimation</li>
</ul>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Long Branch Attraction:</strong> Parsimony can incorrectly group long branches together because multiple changes on long branches can create false homoplasies.
    </div>
</div>

<h3>Key Points to Remember</h3>

<ol>
    <li>The <strong>small parsimony problem</strong> (scoring a tree) is efficiently solved by dynamic programming</li>
    <li>The <strong>large parsimony problem</strong> (finding optimal trees) has no efficient solution</li>
    <li>Maximum parsimony finds trees requiring the fewest evolutionary changes</li>
    <li>Not based on an explicit evolutionary model</li>
    <li>Best suited for datasets with low homoplasy</li>
</ol>

<div class="tools-box">
    <h4>Software for Parsimony Analysis</h4>
    <ul>
        <li><strong>PAUP*:</strong> Comprehensive phylogenetic analysis with excellent parsimony implementation</li>
        <li><strong>TNT:</strong> Optimized for large datasets, very fast</li>
        <li><strong>MEGA:</strong> User-friendly interface, good for teaching</li>
        <li><strong>MPBoot:</strong> Ultrafast bootstrap approximation for parsimony</li>
    </ul>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>What makes a site parsimony-informative?</li>
        <li>How does the Fitch algorithm differ from the general Sankoff algorithm?</li>
        <li>Why is branch-and-bound better than exhaustive search?</li>
        <li>What is the difference between the small and large parsimony problems?</li>
        <li>Under what conditions might parsimony give misleading results?</li>
    </ol>
</div>
</section>