---
layout: lecture_notes
title: "Multiple Sequence Alignment"
lecture_num: 3
section: introductionSA
section_name: "Introduction to Sequence Analysis"
previous_lecture: lecture2_homology_notes
next_lecture: lecture4_phylogenetic_trees
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 3</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Durbin et al. Ch. 6</span>
    </div>
</div>

<section class="section" id="introduction">
<h2>1. What is a Multiple Sequence Alignment?</h2>

<p>Multiple sequence alignment (MSA) is the process of aligning three or more biological sequences (protein or nucleic acid) to identify regions of similarity that may indicate functional, structural, or evolutionary relationships.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/ebola_align.png" alt="Ebola virus alignment example">
    <div class="figure-caption">Example of a multiple sequence alignment of Ebola virus sequences</div>
</div>

<div class="definition-box">
    <div class="title">Formal Definition</div>
    <p>Given sequences $X^{(1)},\ldots,X^{(N)}$ of lengths $n_1,\ldots,n_N$, we seek aligned sequences $A^{(1)},\ldots,A^{(N)}$ of length $n\geq\max\{n_i\}$ such that:</p>
    <ul>
        <li>We can obtain $X^{(i)}$ from $A^{(i)}$ by removing gap characters</li>
        <li>No columns contain all gaps</li>
        <li>The <strong>score</strong> of the alignment is optimal</li>
    </ul>
</div>

<h3>Notation</h3>

<p>Throughout this lecture, we'll use the following notation:</p>

<div class="math-block">
<dl>
    <dt>Sequence $i$:</dt>
    <dd>$X^{(i)} = (x^{(i)}_1,x^{(i)}_2,\ldots,x^{(i)}_{n_i})$</dd>
    
    <dt>Row $i$ in alignment:</dt>
    <dd>$A^{(i)} = (a^{(i)}_1,a^{(i)}_2,\ldots,a^{(i)}_n)$</dd>
    
    <dt>Column $j$ in alignment:</dt>
    <dd>$A_j = (a_j^{(1)}, a_j^{(2)}, \ldots, a_j^{(N)})$</dd>
</dl>
</div>

<h3>Why Multiple Sequence Alignment?</h3>

<p>Multiple sequence alignments are essential for:</p>
<ul>
    <li>Identifying conserved regions across species</li>
    <li>Predicting protein structure and function</li>
    <li>Constructing phylogenetic trees</li>
    <li>Identifying functional motifs and domains</li>
    <li>Designing PCR primers</li>
    <li>Understanding evolutionary relationships</li>
</ul>
</section>

<section class="section" id="scoring">
<h2>2. Scoring Multiple Sequence Alignments</h2>

<h3>Sum of Pairs (SP) Scoring</h3>

<p>The most commonly used scoring function for MSAs is the <strong>sum of pairs</strong> method, which calculates the total score as the sum of all pairwise alignment scores.</p>

<div class="definition-box">
    <div class="title">Column Score</div>
    <p>For column $i$ in the alignment:</p>
    <div class="math-block">
        $$S(A_i) = \sum_{j=1}^N\sum_{k=j+1}^N s(a_i^{(j)},a_i^{(k)})$$
    </div>
    <p>where $s(a,b)$ is the pairwise substitution score between characters $a$ and $b$.</p>
</div>

<h4>Example</h4>

<p>Consider the following alignment:</p>

<div class="alignment">
<pre>
A-CTCAT
A-GTC-T
ACGTC-T
</pre>
</div>

<p>Let's calculate scores for specific columns:</p>

<ul>
    <li><strong>Column 3 score:</strong> We have C, G, G
        <ul>
            <li>$s(C,G) + s(C,G) + s(G,G) = \text{mismatch} + \text{mismatch} + \text{match}$</li>
            <li>Total = $2 \times \text{mismatch score} + \text{match score}$</li>
        </ul>
    </li>
    <li><strong>Column 6 score:</strong> We have A, -, -
        <ul>
            <li>$s(A,-) + s(A,-) + s(-,-) = 2 \times \text{gap penalty} + s(-,-)$</li>
            <li>Note: $s(-,-)$ is typically 0 (no penalty for aligning two gaps)</li>
        </ul>
    </li>
</ul>

<h3>Problems with Sum of Pairs Scoring</h3>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Theoretical Issues with SP Scoring:</strong>
        <ul>
            <li>Substitution scores were derived as log-odds scores for <strong>pairwise</strong> comparisons</li>
            <li>The mathematically correct approach would use log-odds scores for triples, quadruples, etc.</li>
            <li>No probabilistic justification for the sum of pairs approach</li>
        </ul>
    </div>
</div>

<p>Mathematically, the issue is that:</p>

<div class="math-block">
$$s(a,b,c) = \log\frac{p_{abc}}{f_af_bf_c} \neq \log\frac{p_{ab}}{f_af_b} + \log\frac{p_{ac}}{f_af_c} + \log\frac{p_{bc}}{f_bf_c}$$
</div>

<h3>Tree-based Scoring</h3>

<p>A more biologically motivated approach considers the evolutionary tree relating the sequences:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/tree_vs_SP.svg" alt="Tree-based vs sum of pairs scoring">
    <div class="figure-caption">Comparison of sum of pairs scoring versus tree-based scoring</div>
</div>

<p>Tree-based scores are thought to be more biologically appropriate, but they have practical limitations:</p>
<ul>
    <li>We don't know the true evolutionary tree</li>
    <li>We need to infer ancestral characters at internal nodes</li>
    <li>Different parts of the alignment may have different evolutionary histories (due to recombination)</li>
</ul>

<blockquote>
    Despite its theoretical limitations, sum of pairs scoring is almost always used in practice due to its computational simplicity.
</blockquote>
</section>

<section class="section" id="dynamic-programming">
<h2>3. Multidimensional Dynamic Programming</h2>

<h3>The Naïve Approach</h3>

<p>We can extend the pairwise alignment dynamic programming approach to multiple sequences. Define $F(i_1,i_2,\ldots,i_N)$ as the score of the best alignment up to positions $i_1, i_2, \ldots, i_N$ in sequences $1, 2, \ldots, N$.</p>

<p>The recurrence relation becomes:</p>

<div class="math-block" style="font-size: 0.9em;">
$$F(i_1,i_2,\ldots,i_N) = \max \begin{cases}
F(i_1-1,i_2-1,\ldots,i_N-1) + S(x^{(1)}_{i_1},x^{(2)}_{i_2},\ldots,x^{(N)}_{i_N})\\
F(i_1, i_2-1, \ldots,i_N-1) + S(-,x^{(2)}_{i_2},\ldots,x^{(N)}_{i_N})\\
F(i_1-1, i_2, i_3-1, \ldots,i_N-1) + S(x^{(1)}_{i_1},-,x^{(3)}_{i_3},\ldots,x^{(N)}_{i_N})\\
\vdots\\
\text{(all $2^N-1$ combinations of gaps and characters)}
\end{cases}$$
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/MDP.svg" alt="Multidimensional dynamic programming">
    <div class="figure-caption">Visualization of the multidimensional dynamic programming matrix</div>
</div>

<h3>Computational Complexity</h3>

<p>The naïve dynamic programming approach has prohibitive computational requirements:</p>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Complexity Analysis:</strong>
        <ul>
            <li><strong>Space complexity:</strong> $O(n^N)$ - need to store $\prod_{q=1}^{N}n_q$ values</li>
            <li><strong>Time complexity:</strong> $O(2^N n^N)$ - each cell requires maximizing over $2^N-1$ possibilities</li>
        </ul>
    </div>
</div>

<div class="practice-box">
    <h4>Example Calculation</h4>
    <p>For an alignment of 5 sequences, each 100 characters long:</p>
    <ul>
        <li>Space needed: $101^5 \approx 10^{10}$ numbers</li>
        <li>With 32-bit integers: ~39 GB of memory</li>
        <li>Time: Must compute $10^{10}$ cells, each requiring comparison of $2^5-1 = 31$ values</li>
    </ul>
</div>

<h3>The MSA Algorithm</h3>

<p>Carrillo & Lipman (1988) developed an improved algorithm that uses bounds on pairwise alignments to reduce the search space:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/MDP_MSA.svg" alt="MSA algorithm search space reduction">
    <div class="figure-caption">The MSA algorithm reduces the search space by constraining pairwise alignment scores</div>
</div>

<p>While this is a significant improvement, it's still impractical for most real-world alignment problems with more than a few sequences.</p>
</section>

<section class="section" id="progressive">
<h2>4. Progressive Alignment Methods</h2>

<p>Given the computational limitations of exact algorithms, practical MSA methods use heuristic approaches. The most successful of these is <strong>progressive alignment</strong>.</p>

<h3>General Strategy</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/progressive.svg" alt="Progressive alignment strategy">
    <div class="figure-caption">Progressive alignment builds up the MSA by successively aligning sequences or groups</div>
</div>

<p>Key decisions in progressive alignment:</p>
<ol>
    <li><strong>Order of alignments:</strong> Which sequences to align first?</li>
    <li><strong>Alignment strategy:</strong> Allow only sequence-to-group, or also group-to-group?</li>
    <li><strong>Scoring method:</strong> How to score alignments involving groups?</li>
</ol>

<h3>Guide Trees</h3>

<p>Progressive alignment algorithms use "guide trees" to determine the order of alignment:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/guide_tree.svg" alt="Guide tree example">
    <div class="figure-caption">A guide tree determines the order in which sequences are progressively aligned</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> Guide trees are rough phylogenetic trees used only to bootstrap the alignment process. They are not suitable for phylogenetic inference.
    </div>
</div>

<h3>UPGMA Tree Construction</h3>

<p>The Unweighted Pair Group Method with Arithmetic Mean (UPGMA) is commonly used to build guide trees:</p>

<div class="practice-box">
    <h4>UPGMA Example</h4>
    <p>Given the distance matrix:</p>
    <table>
        <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
        <tr><th>A</th><td>-</td><td>4</td><td>8</td><td>8</td></tr>
        <tr><th>B</th><td></td><td>-</td><td>8</td><td>8</td></tr>
        <tr><th>C</th><td></td><td></td><td>-</td><td>6</td></tr>
        <tr><th>D</th><td></td><td></td><td></td><td>-</td></tr>
    </table>
    
    <p>Algorithm steps:</p>
    <ol>
        <li>Find minimum distance: d(A,B) = 4</li>
        <li>Join A and B to form cluster E</li>
        <li>Recalculate distances to E</li>
        <li>Repeat until all sequences are joined</li>
    </ol>
</div>

<h3>The Feng-Doolittle Algorithm</h3>

<p>Published in 1987, this was one of the first practical progressive alignment algorithms:</p>

<ol>
    <li><strong>Calculate pairwise distances:</strong> Align all pairs of sequences and convert alignment scores to evolutionary distances:
        <div class="math-block">
            $$d(k,l) = -\log\frac{S(A^{(k)},A^{(l)})-S_{\text{rand}}}{S_{\text{max}}-S_{\text{rand}}}$$
        </div>
    </li>
    <li><strong>Build guide tree:</strong> Use UPGMA or similar clustering algorithm</li>
    <li><strong>Progressive alignment:</strong> Starting from the leaves, align sequences following the guide tree</li>
</ol>

<h4>Sequence-to-Group Alignment</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/FD_seq_to_group.svg" alt="Sequence to group alignment">
    <div class="figure-caption">Aligning a sequence to an existing group alignment</div>
</div>

<h4>Group-to-Group Alignment</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/FD_group_to_group.svg" alt="Group to group alignment">
    <div class="figure-caption">Aligning two group alignments together</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>"Once a gap, always a gap" rule:</strong> After alignment, gap symbols are replaced by a neutral character 'X'. This encourages gaps to occur in the same columns in subsequent alignments.
    </div>
</div>

<h3>Progressive Misalignment</h3>

<p>A major limitation of progressive alignment is that errors made early in the process cannot be corrected later:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/progressiveMisalignment-00.png" alt="Progressive misalignment example">
    <div class="figure-caption">Example of how early alignment decisions can lead to suboptimal final alignments</div>
</div>

<h3>Profile Alignment</h3>

<p>Modern progressive alignment methods use <strong>profile alignment</strong> to align groups of sequences:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/profile_align.svg" alt="Profile alignment">
    <div class="figure-caption">Profile alignment considers the frequency of each character at each position</div>
</div>

<p>The total alignment score becomes: $S(A) + S(B) + S(A \times B)$</p>

<h3>CLUSTALW</h3>

<p>Thompson, Higgins, and Gibson (1994) developed CLUSTALW, which became one of the most widely used MSA programs (with over 55,000 citations!).</p>

<p>CLUSTALW is essentially the Feng-Doolittle algorithm with profile alignment and many additional heuristics:</p>

<ol>
    <li>Calculate all pairwise distances</li>
    <li>Construct guide tree using UPGMA or neighbor-joining</li>
    <li>Progressively align using sequence-sequence, sequence-profile, and profile-profile alignment</li>
</ol>

<div class="tools-box">
    <h4>Modern Progressive Alignment Tools</h4>
    <ul>
        <li><strong>Clustal Omega:</strong> Successor to CLUSTALW, faster and more accurate</li>
        <li><strong>MUSCLE:</strong> Uses iterative refinement after initial progressive alignment</li>
        <li><strong>MAFFT:</strong> Offers various algorithms optimized for different scenarios</li>
    </ul>
</div>
</section>

<section class="section" id="iterative">
<h2>5. Iterative Refinement Methods</h2>

<p>Iterative refinement methods attempt to improve an initial alignment by making small changes and accepting improvements (hill climbing to a local optimum).</p>

<h3>The Barton-Sternberg Algorithm (1987)</h3>

<ol>
    <li>Find the two most similar sequences and align them</li>
    <li>Find the sequence most similar to the profile of the current alignment and add it</li>
    <li>Repeat step 2 until all sequences are included</li>
    <li><strong>Refinement phase:</strong> Remove each sequence and realign it to the profile of the others</li>
    <li>Repeat step 4 until convergence or a fixed number of iterations</li>
</ol>

<h3>Other Iterative Approaches</h3>

<ul>
    <li><strong>Simulated annealing:</strong> Accept some score-decreasing moves to escape local optima</li>
    <li><strong>Genetic algorithms:</strong> Maintain a population of alignments and evolve them</li>
    <li><strong>Hidden Markov Models:</strong> Use probabilistic models for alignment</li>
</ul>
</section>

<section class="section" id="considerations">
<h2>6. Practical Considerations and Limitations</h2>

<h3>General Limitations</h3>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Important considerations when using MSA algorithms:</strong>
        <ul>
            <li>These algorithms maximize match scores, but the "best" scoring alignment may not be biologically correct</li>
            <li>Progressive alignments deteriorate as more sequences are added</li>
            <li>Early mistakes in progressive alignment are frozen and cannot be corrected</li>
            <li>Manual correction is often necessary for alignments of divergent sequences</li>
        </ul>
    </div>
</div>

<h3>Statistical Approaches: Fitting vs. Modeling</h3>

<p>There are two philosophical approaches to sequence alignment:</p>

<div class="comparison-box">
    <div class="comparison-column">
        <h4>Statistical Fitting</h4>
        <ul>
            <li>Count change frequencies in real data</li>
            <li>Build empirical descriptions (e.g., BLOSUM62)</li>
            <li>Use log-odds ratios for scoring</li>
            <li>Apply in ad hoc algorithms (BLAST, ClustalW)</li>
        </ul>
    </div>
    <div class="comparison-column">
        <h4>Probabilistic Modeling</h4>
        <ul>
            <li>Define evolutionary process models</li>
            <li>Specify substitution and indel rates</li>
            <li>Estimate parameters using likelihood/Bayesian methods</li>
            <li>Co-estimate alignment and phylogeny</li>
        </ul>
    </div>
</div>

<h3>BAli-Phy: A Bayesian Approach</h3>

<p>Suchard and Redelings (2006) developed BAli-Phy, which jointly estimates alignment and phylogeny using Bayesian inference:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture3_msa_notes/baliphy.jpeg" alt="BAli-Phy example">
    <div class="figure-caption">BAli-Phy provides uncertainty estimates for both alignment and phylogeny</div>
</div>

<p>This approach is philosophically optimal but computationally intensive, limiting its use to smaller datasets.</p>
</section>

<section class="section">
<h2>Summary</h2>

<ol>
    <li><strong>Scoring:</strong> Multiple sequence alignments are typically scored using sum of pairs, despite theoretical limitations</li>
    
    <li><strong>Exact algorithms:</strong> Dynamic programming can find optimal alignments but scales as $O(n^N)$, making it impractical for most problems</li>
    
    <li><strong>Progressive alignment:</strong> Practical heuristic that builds alignments incrementally using a guide tree</li>
    
    <li><strong>Iterative refinement:</strong> Can improve initial alignments but may still converge to local optima</li>
    
    <li><strong>Trade-offs:</strong> Current methods balance biological accuracy with computational feasibility</li>
    
    <li><strong>Future directions:</strong> Bayesian approaches offer principled solutions but need computational improvements</li>
</ol>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Durbin et al. (1998) "Biological Sequence Analysis" - Chapter 6</li>
            <li>Thompson et al. (1994) "CLUSTALW" - Nature Protocols</li>
            <li>Notredame (2007) "Recent evolutions of multiple sequence alignment algorithms" - PLOS Comp Bio</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why is sum of pairs scoring theoretically problematic?</li>
        <li>What makes exact dynamic programming impractical for multiple sequences?</li>
        <li>How do guide trees influence progressive alignment quality?</li>
        <li>What is the "once a gap, always a gap" rule and why is it used?</li>
        <li>When might you choose iterative refinement over simple progressive alignment?</li>
    </ol>
</div>
</section>
