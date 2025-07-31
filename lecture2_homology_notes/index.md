---
layout: lecture_notes
title: "Sequence Homology"
lecture_num: 2
section: introductionSA
section_name: "Introduction to Sequence Analysis"
previous_lecture: lecture1_introduction
next_lecture: lecture3_multiple_alignment
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 2</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Ch. 2-3</span>
    </div>
</div>

<section class="section" id="homology">
<h2>1. Introduction to Sequence Homology</h2>

<div class="definition-box">
    <div class="title">Definition of Homology</div>
    Homology is the existence of a <strong>shared ancestry</strong> between a pair of biological traits or sequences.
</div>

<p>Understanding homology is fundamental to phylogenetic analysis. When we observe similarity between sequences, we form hypotheses about their evolutionary relationships.</p>

<h3>Key Concepts</h3>
<ul>
    <li>Homologous sequence regions are expected to display a degree of similarity</li>
    <li>The statement that two sequence regions are homologous is an <strong>evolutionary hypothesis</strong> based on similarity</li>
    <li>It is rarely possible to observe homology directly</li>
    <li>Homologous sequences are referred to as <strong>homologs</strong></li>
</ul>

<h3>Types of Homologs</h3>
<p>Different evolutionary events can lead to different types of homologous relationships:</p>

<ul>
    <li><strong>Orthology</strong>: Ancestral sequences separated by <strong>speciation</strong></li>
    <li><strong>Paralogy</strong>: Ancestral sequences separated by <strong>gene duplication</strong></li>
    <li><strong>Xenology</strong>: Homologs resulting from <strong>horizontal gene transfer</strong></li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Note:</strong> The distinction between these types of homology is crucial for accurate phylogenetic reconstruction, as they imply different evolutionary scenarios.
    </div>
</div>

<h3>Examples from Nature</h3>
<p>The globin family provides excellent examples of homologous proteins across diverse organisms:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/globins-lemur.jpg" alt="Ring-tailed lemur beta globin">
    <div class="figure-caption">Ring-tailed lemur beta globin structure</div>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/globins-goldfish.jpg" alt="Goldfish beta globin">
    <div class="figure-caption">Goldfish beta globin structure</div>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/globins-soybeans.jpg" alt="Soybean leghemoglobin">
    <div class="figure-caption">Soybean leghemoglobin structure</div>
</div>
</section>

<section class="section" id="alignment">
<h2>2. Pairwise Alignment</h2>

<h3>The Goal of Pairwise Alignment</h3>

<blockquote>
    Aligning one sequence with another allows us to assess the homology between the two sequences.
</blockquote>

<p>Alignment serves several crucial purposes in sequence analysis:</p>
<ul>
    <li>It breaks down the question of sequence similarity into smaller questions about character similarity</li>
    <li>It forms the basis for multiple sequence alignment</li>
    <li>It provides the foundation for phylogenetic reconstruction from molecular data</li>
</ul>

<h3>Dot Plots</h3>
<p>A simple visual method for assessing pairwise homology. Consider these two sequences:</p>

<ol>
    <li>"decided to build three ships, three Arks in space"</li>
    <li>"decided to build three Arks in space"</li>
</ol>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/dotplot.png" alt="Dot plot visualization">
    <div class="figure-caption">Dot plot showing diagonal lines indicating runs of matching sites</div>
</div>

<ul>
    <li>Each row corresponds to a position on sequence 1</li>
    <li>Each column corresponds to a position on sequence 2</li>
    <li>Pixel (i,j) is colored if characters at site i on seq 1 and j on seq 2 match</li>
    <li>Diagonal lines indicate runs of matching sites</li>
</ul>

<h3>Scoring Alignments</h3>

<p>Alignments are evaluated using scoring systems that assign numeric values to each column:</p>

<div class="alignment">
<div>x' = <span class="match">a</span> <span class="gap">-</span> <span class="gap">c</span> <span class="match">g</span> <span class="mismatch">g</span> <span class="gap">-</span> <span class="match">t</span> <span class="conservative">s</span></div>
<div>y' = <span class="match">a</span> <span class="gap">w</span> <span class="gap">-</span> <span class="match">g</span> <span class="mismatch">c</span> <span class="gap">c</span> <span class="match">t</span> <span class="conservative">t</span></div>
</div>

<p>Column types and their typical scores:</p>
<ul>
    <li><span class="match">Identical</span>: Positive score</li>
    <li><span class="conservative">Conservative</span>: Positive score</li>
    <li><span class="mismatch">Non-conservative</span>: Negative score</li>
    <li><span class="gap">Gap</span>: Negative score</li>
</ul>

<h3>Scoring Methods</h3>

<p>Two main approaches are used for scoring alignments:</p>

<h4>1. Model-based Scoring</h4>
<p>Based on evolutionary models, particularly log-odds scoring:</p>

<div class="math-block">
    $$s(a,b) = \frac{1}{\lambda}\log \frac{p_{a,b}}{f_a f_b}$$
</div>

<p>Where:</p>
<ul>
    <li>\(p_{ab}\) is the probability of observing residues a and b in homologous sequences</li>
    <li>\(f_a\) and \(f_b\) are the background frequencies of residues a and b</li>
    <li>\(\lambda\) is a scaling factor</li>
</ul>

<h4>2. Empirical Scoring</h4>
<p>Based on observed substitution patterns in real sequences:</p>
<ul>
    <li>PAM matrices</li>
    <li>BLOSUM matrices</li>
    <li>JTT matrix</li>
    <li>WAG matrix</li>
</ul>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Important:</strong> Different matrices are appropriate for different levels of sequence similarity. Choosing the right matrix is crucial for accurate alignment.
    </div>
</div>

<h3>Evolutionary Interpretation</h3>

<p>For homologous sequences with divergence time \(t\) and mutation rate \(\mu\):</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/match_probs.png" alt="Match probabilities">
    <div class="figure-caption">Variation of match/mismatch probabilities with evolutionary distance \(d = \mu t\)</div>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/match_scores.png" alt="Match scores">
    <div class="figure-caption">Variation of match/mismatch scores with evolutionary distance</div>
</div>

<h3>Gap Penalties</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/gap_penalty.svg" alt="Gap penalty illustration">
    <div class="figure-caption">Illustration of gap penalties in sequence alignment</div>
</div>

<p>Two main approaches for penalizing gaps in alignments:</p>

<ol>
    <li><strong>Linear gap penalty:</strong>
        <div class="math-block">
            $$\gamma(g) = -gd$$
        </div>
        where \(d\) is the gap penalty and \(g\) is the gap length
    </li>
    
    <li><strong>Affine gap penalty:</strong>
        <div class="math-block">
            $$\gamma(g) = -d - (g-1)e$$
        </div>
        where \(d\) is the gap opening penalty and \(e\) is the gap extension penalty
    </li>
</ol>
</section>

<section class="section" id="algorithms">
<h2>3. Pairwise Alignment Algorithms</h2>

<h3>Dynamic Programming</h3>

<p>Dynamic programming is a powerful method for solving combinatorial optimization problems. It guarantees finding the optimal solution and is based on the <strong>principle of optimality</strong>:</p>

<blockquote>
    A sub-optimal solution of a sub-problem cannot be part of the optimal solution of the full problem.
</blockquote>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/optimality1.svg" alt="Principle of optimality">
    <div class="figure-caption">Illustration of the principle of optimality in dynamic programming</div>
</div>

<p>Key features of dynamic programming:</p>
<ul>
    <li>Computation is carried out from the bottom-up</li>
    <li>All solutions to sub-problems are stored in a table</li>
    <li>Each sub-problem is solved exactly once</li>
    <li>Only optimal solutions to sub-problems are used for the next level</li>
</ul>

<h3>Needleman-Wunsch Algorithm</h3>

<p>The Needleman-Wunsch algorithm (1970) performs <strong>global alignment</strong> using dynamic programming.</p>

<h4>Algorithm Overview</h4>
<p>Given sequences X = (x₁, x₂, ..., xₘ) and Y = (y₁, y₂, ..., yₙ), where m and n are the lengths of sequences X and Y respectively, define F(i,j) as the score of the best alignment between the first i characters of X and the first j characters of Y.</p>

<h4>Recurrence Relation</h4>
<div class="math-block">
    $$F(i,j) = \max\begin{cases}
    F(i-1,j-1) + s(x_i,y_j) & \text{match/mismatch}\\
    F(i,j-1) - d & \text{gap in X}\\
    F(i-1,j) - d & \text{gap in Y}
    \end{cases}$$
</div>

<h4>Initialization</h4>
<ul>
    <li>F(0,0) = 0</li>
    <li>F(i,0) = F(i-1,0) + s(xᵢ,-) for i > 0</li>
    <li>F(0,j) = F(0,j-1) + s(-,yⱼ) for j > 0</li>
</ul>

<div class="bio-context">
    <h4>Biological Application</h4>
    <p>The Needleman-Wunsch algorithm is particularly useful when:</p>
    <ul>
        <li>Comparing full-length protein sequences from different species</li>
        <li>Aligning complete genes to study synteny</li>
        <li>Example: Aligning human and mouse insulin genes to study conservation</li>
    </ul>
</div>

<div class="complexity-note">
    <h4>Computational Complexity</h4>
    <ul>
        <li>Time complexity: O(mn) where m and n are sequence lengths</li>
        <li>Space complexity: O(mn) for the full matrix</li>
        <li>Traceback: O(m+n)</li>
    </ul>
</div>

<div class="interactive-demo">
    <h4>Interactive Demo</h4>
    <p>Try the Needleman-Wunsch algorithm with your own sequences:</p>
    <a href="https://gtuckerkellogg.github.io/pairwise/demo/" target="_blank">Launch Interactive Demo →</a>
</div>

<h3>Smith-Waterman Algorithm</h3>

<p>The Smith-Waterman algorithm computes <strong>local alignment</strong>, finding the best alignment of subsequences while ignoring scores of regions on either side.</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/smith_waterman.svg" alt="Smith-Waterman illustration">
    <div class="figure-caption">Local alignment finds high-scoring subsequences</div>
</div>

<h4>Key Difference</h4>
<p>The main difference from Needleman-Wunsch is the addition of a fourth option in the recurrence:</p>

<div class="math-block">
    $$F(i,j) = \max\begin{cases}
    F(i-1,j-1) + s(x_i,y_j)\\
    F(i,j-1) - d\\
    F(i-1,j) - d\\
    0 & \text{start new alignment}
    \end{cases}$$
</div>

<p>This allows the algorithm to:</p>
<ul>
    <li>Start a new alignment at any position</li>
    <li>End an alignment when the score becomes negative</li>
    <li>Find multiple high-scoring local alignments</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/smith_waterman_example.png" alt="Smith-Waterman example">
    <div class="figure-caption">Example of Smith-Waterman algorithm finding local alignments</div>
</div>

<h3>Specialized Variants</h3>

<h4>Repeated Matches</h4>
<p>For finding multiple occurrences of a motif in a longer sequence:</p>
<ul>
    <li>Useful for identifying repeated domains or motifs</li>
    <li>Asymmetric algorithm (short query vs. long target)</li>
    <li>Tracks multiple high-scoring regions above threshold T</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/repeated_match_example.png" alt="Repeated match example">
    <div class="figure-caption">Finding repeated motifs using modified dynamic programming</div>
</div>

<h4>Overlap Matches</h4>
<p>For sequence assembly and finding overlapping sequences:</p>
<ul>
    <li>No penalty for overhanging ends: F(i,0) = F(0,j) = 0</li>
    <li>Useful in genome assembly projects</li>
    <li>Identifies sequences that overlap at their ends</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture2_homology_notes/overlap_match_example.png" alt="Overlap match example">
    <div class="figure-caption">Overlap alignment for sequence assembly</div>
</div>
</section>

<section class="section">
<h2>Summary and Next Steps</h2>

<p>In this lecture, we've covered the fundamental concepts of sequence homology and pairwise alignment:</p>

<ul>
    <li>The definition and types of homology</li>
    <li>Methods for visualizing and scoring sequence alignments</li>
    <li>Dynamic programming algorithms for global and local alignment</li>
    <li>Specialized alignment variants for specific biological problems</li>
</ul>

<p>These concepts form the foundation for:</p>
<ul>
    <li>Multiple sequence alignment (next lecture)</li>
    <li>Phylogenetic tree construction</li>
    <li>Evolutionary rate estimation</li>
    <li>Functional annotation of sequences</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Further Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Durbin et al. (1998) "Biological Sequence Analysis" - Chapters 2-3</li>
            <li>Felsenstein (2004) "Inferring Phylogenies" - Chapter 11</li>
            <li>Original papers: Needleman & Wunsch (1970), Smith & Waterman (1981)</li>
        </ul>
    </div>
</div>
</section>
