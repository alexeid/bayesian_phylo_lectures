---
layout: lecture_notes
title: "Introduction to Phylogenetics"
lecture_num: 5
section: introduction
section_name: "Introduction to Phylogenetics"
previous_lecture: lecture3_msa_notes
next_lecture: lecture6_parsimony_notes
---

<div class="lecture-header">
    <div class="lecture-number">Lecture {{ page.lecture_num }}</div>
    <h1>{{ page.title }}</h1>
    <div class="lecture-meta">
        <span><i class="fas fa-calendar"></i> Week 5</span>
        <span><i class="fas fa-clock"></i> 90 minutes</span>
        <span><i class="fas fa-book"></i> Required reading: Yang Ch. 3, Higgs & Attwood Ch. 8</span>
    </div>
</div>

<section class="section" id="introduction">
<h2>1. Molecules as Documents of Evolutionary History</h2>

<p>Molecular sequences contain a wealth of information about evolutionary processes and history. By comparing sequences from different organisms, we can infer their evolutionary relationships.</p>

<div class="example-box">
    <h4>Example: HIV-1 Sequence Variation</h4>
    <div class="alignment">
        <pre>
HIV-1 (UK)  ATC<span class="mismatch">G</span>GATGCTA<span class="mismatch">A</span>AGC<span class="mismatch">A</span>TATGA<span class="mismatch">C</span>ACAGAGGTACA<span class="mismatch">TAA</span>TGTTT
HIV-1 (USA) ATC<span class="mismatch">A</span>GATGCTA<span class="mismatch">G</span>AGC<span class="mismatch">T</span>TATGA<span class="mismatch">T</span>ACAGAGGTACA<span class="gap">---</span>TGTTT
        </pre>
    </div>
    <p>The differences (highlighted) between these sequences tell us about their evolutionary divergence.</p>
</div>

<p>Key points about molecular evolution:</p>
<ul>
    <li>Macromolecules contain information about the processes and history that formed them</li>
    <li>This information is incomplete, so the full history must be inferred</li>
    <li>Computational biology aims to decipher the information held in molecular sequences about evolutionary processes and history</li>
</ul>

<h3>What is Phylogenetics?</h3>

<div class="definition-box">
    <div class="title">Phylogenetics</div>
    <p>The study of evolutionary relationships among organisms or genes, typically represented as trees showing patterns of descent from common ancestors.</p>
</div>

<p>Core concepts in phylogenetics:</p>
<ul>
    <li><strong>Homology:</strong> Similarity due to inheritance from a common ancestor</li>
    <li><strong>Phylogenetic trees:</strong> Branching structure representing evolutionary relationships based on common ancestry</li>
    <li><strong>Monophyletic groups (clades):</strong> Groups containing species more closely related to each other than to any species outside the group</li>
    <li><strong>Statistical inference:</strong> Modern phylogenetics uses probabilistic models of evolution</li>
</ul>

<h3>A Typical Phylogenetic Analysis</h3>

<ol>
    <li><strong>Collect homologous sequences</strong> - Identify sequences that share common ancestry</li>
    <li><strong>Construct multiple sequence alignment</strong> - Align sequences to identify homologous positions</li>
    <li><strong>Phylogeny reconstruction</strong> - Infer the tree using various methods</li>
    <li><strong>Test reliability</strong> - Assess confidence in the estimated phylogeny</li>
    <li><strong>Interpretation and application</strong> - Use the phylogeny to answer biological questions</li>
</ol>

<h3>Applications of Phylogenetics</h3>

<p>Phylogenetic methods have diverse applications across biology:</p>
<ul>
    <li>Inferring relationships among species and genes</li>
    <li>Estimating divergence times</li>
    <li>Identifying functional elements through comparative genomics</li>
    <li>Detecting molecular adaptation</li>
    <li>Forensics and paternity testing</li>
    <li>Studying the emergence and spread of viral pandemics</li>
    <li>Conservation biology and biodiversity assessment</li>
</ul>
</section>

<section class="section" id="tree-basics">
<h2>2. Types and Anatomy of Phylogenetic Trees</h2>

<h3>Tree Representations</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/typesOfPhylogenies.svg" alt="Types of phylogenetic tree representations">
    <div class="figure-caption">Different ways to represent the same phylogenetic relationships</div>
</div>

<p>Phylogenetic trees can be drawn in various formats:</p>
<ul>
    <li><strong>Rectangular (dendogram):</strong> Branch lengths shown horizontally</li>
    <li><strong>Circular:</strong> Taxa arranged in a circle</li>
    <li><strong>Radial:</strong> Branches radiate from center</li>
</ul>

<h3>Bifurcating vs. Multifurcating Trees</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/bifurcatingAndMultifurcatingTrees.svg" alt="Bifurcating and multifurcating trees">
    <div class="figure-caption">Comparison of fully resolved (bifurcating) and partially resolved (multifurcating) trees</div>
</div>

<div class="definition-box">
    <div class="title">Polytomy</div>
    <ul>
        <li>In a <strong>rooted tree:</strong> A node with more than 2 children</li>
        <li>In an <strong>unrooted tree:</strong> A node of degree 4 or greater</li>
    </ul>
    <p>Polytomies can represent either uncertainty in relationships or rapid diversification events.</p>
</div>

<h3>Rooted vs. Unrooted Trees</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/rootedToUnrooted.svg" alt="Rooted versus unrooted trees">
    <div class="figure-caption">The same evolutionary relationships shown as rooted and unrooted trees</div>
</div>

<p>Key differences:</p>
<ul>
    <li><strong>Rooted trees</strong> show the direction of evolution and identify the common ancestor</li>
    <li><strong>Unrooted trees</strong> show relationships but not evolutionary direction</li>
    <li>Many methods (parsimony, distance, likelihood without molecular clock) produce unrooted trees</li>
</ul>

<h4>Rooting Trees Using an Outgroup</h4>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/RootingTreesOutgroup.png" alt="Rooting trees with outgroup">
    <div class="figure-caption">Using an outgroup (distantly related species) to determine the root position</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Tip:</strong> The outgroup should be clearly outside the group of interest but still closely related enough to align sequences reliably.
    </div>
</div>

<h3>Tree Anatomy</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/AnatomyOfTree.png" alt="Anatomy of a phylogenetic tree">
    <div class="figure-caption">Key components of a phylogenetic tree</div>
</div>

<p>Essential tree terminology:</p>
<ul>
    <li><strong>Nodes:</strong> Points where branches meet (internal nodes = ancestors, tips/leaves = observed taxa)</li>
    <li><strong>Branches/Edges:</strong> Lines connecting nodes (represent evolutionary lineages)</li>
    <li><strong>Branch lengths:</strong> Can represent time or amount of evolutionary change</li>
    <li><strong>Root:</strong> The common ancestor of all taxa in the tree</li>
    <li><strong>Tips/Leaves:</strong> The observed taxa (species, genes, etc.)</li>
</ul>
</section>

<section class="section" id="tree-space">
<h2>3. The Universe of Possible Trees</h2>

<h3>How Many Trees Are There?</h3>

<p>The number of possible tree topologies grows explosively with the number of taxa. For $n$ taxa, the number of:</p>

<div class="math-block">
    <p><strong>Rooted, binary trees:</strong></p>
    $$T_n^{(R)} = (2n-3)(2n-5)\cdots(3)(1) = \frac{(2n-3)!}{2^{n-2}(n-2)!}$$
</div>

<div class="practice-box">
    <h4>Tree Numbers in Perspective</h4>
    <table>
        <tr>
            <th>n (taxa)</th>
            <th># Rooted Trees</th>
            <th>Context</th>
        </tr>
        <tr>
            <td>4</td>
            <td>15</td>
            <td>Enumerable by hand</td>
        </tr>
        <tr>
            <td>5</td>
            <td>105</td>
            <td>Enumerable by hand on a rainy day</td>
        </tr>
        <tr>
            <td>10</td>
            <td>34,459,425</td>
            <td>≈ Upper limit for exhaustive search</td>
        </tr>
        <tr>
            <td>20</td>
            <td>8.2 × 10²¹</td>
            <td>≈ Upper limit for branch-and-bound</td>
        </tr>
        <tr>
            <td>48</td>
            <td>3.2 × 10⁷⁰</td>
            <td>≈ Number of particles in the universe</td>
        </tr>
    </table>
</div>

<h3>Counting Unrooted Trees</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/stepwiseAddition.png" alt="Stepwise addition algorithm">
    <div class="figure-caption">Building trees by stepwise addition shows how tree numbers grow</div>
</div>

<p>The number of unrooted trees can be calculated using stepwise addition:</p>
<ul>
    <li>Start with 3 taxa: only 1 possible unrooted tree</li>
    <li>Each new taxon can be added to any branch</li>
    <li>Formula: $T_n = 1 × 3 × 5 × \cdots × (2n-5)$ for $n$ taxa</li>
</ul>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Computational Challenge:</strong> The vast number of possible trees makes exhaustive searching impossible for even moderate numbers of taxa. This is why we need heuristic search strategies.
    </div>
</div>

<h3>Measuring Tree Differences</h3>

<div class="definition-box">
    <div class="title">Robinson-Foulds Distance</div>
    <p>The partition distance between two trees is the total number of bipartitions (splits) that are in one tree but not the other.</p>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/robinsonFoulds.png" alt="Robinson-Foulds distance example">
    <div class="figure-caption">Each internal branch defines a bipartition of taxa. The RF distance counts non-shared bipartitions.</div>
</div>

<p>Properties of the Robinson-Foulds distance:</p>
<ul>
    <li>Ranges from 0 (identical trees) to $2(n-3)$ for $n$ taxa</li>
    <li>Simple to compute but can be sensitive to small changes</li>
    <li>Treats all bipartitions equally (no weighting by branch length)</li>
</ul>
</section>

<section class="section" id="reconstruction-overview">
<h2>4. Overview of Phylogenetic Reconstruction</h2>

<h3>Types of Data</h3>

<p>Phylogenetic reconstruction uses two main types of data:</p>

<div class="comparison-box">
    <div class="comparison-column">
        <h4>Distance Data</h4>
        <p>Pairwise dissimilarities stored in a distance matrix</p>
        <table class="small-table">
            <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>
            <tr><th>A</th><td>0</td><td>3</td><td>5</td><td>6</td><td>5</td></tr>
            <tr><th>B</th><td>3</td><td>0</td><td>4</td><td>7</td><td>6</td></tr>
            <tr><th>C</th><td>5</td><td>4</td><td>0</td><td>5</td><td>4</td></tr>
            <tr><th>D</th><td>6</td><td>7</td><td>5</td><td>0</td><td>1</td></tr>
            <tr><th>E</th><td>5</td><td>6</td><td>4</td><td>1</td><td>0</td></tr>
        </table>
    </div>
    <div class="comparison-column">
        <h4>Character Data</h4>
        <p>Discrete states for each taxon at each position</p>
        <table class="small-table">
            <tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr>
            <tr><th>A</th><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
            <tr><th>B</th><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
            <tr><th>C</th><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
            <tr><th>D</th><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
            <tr><th>E</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
        </table>
    </div>
</div>

<h3>Reconstruction Approaches</h3>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/PhylogeneticReconstruction.png" alt="Phylogenetic reconstruction methods">
    <div class="figure-caption">Overview of major phylogenetic reconstruction approaches</div>
</div>

<p>Given the enormous number of possible trees, we have three main strategies:</p>

<ol>
    <li><strong>Clustering algorithms:</strong> Build tree using a specific algorithm (fast but no optimality criterion)</li>
    <li><strong>Optimality criteria:</strong> Define a score and find the tree(s) that optimize it</li>
    <li><strong>Statistical inference:</strong> Find the most probable trees under an evolutionary model</li>
</ol>
</section>

<section class="section" id="clustering-methods">
<h2>5. Clustering Methods</h2>

<h3>Overview of Clustering Approaches</h3>

<p>Clustering algorithms like UPGMA and Neighbor-Joining are:</p>
<ul>
    <li>Usually very fast (polynomial time)</li>
    <li>Simple to implement and understand</li>
    <li>Based on greedy heuristics (make locally optimal choices)</li>
</ul>

<div class="alert alert-warning">
    <i class="fas fa-exclamation-triangle"></i>
    <div>
        <strong>Limitations:</strong>
        <ul>
            <li>No explicit optimality criterion</li>
            <li>No measure of how good the tree is</li>
            <li>No information about alternative trees</li>
        </ul>
    </div>
</div>

<h3>UPGMA (Unweighted Pair Group Method with Arithmetic Mean)</h3>

<p>UPGMA is one of the simplest tree-building methods:</p>

<div class="algorithm-box">
    <h4>UPGMA Algorithm</h4>
    <ol>
        <li>Start with each taxon as a separate cluster</li>
        <li>Find the pair of clusters with smallest distance</li>
        <li>Join them into a new cluster</li>
        <li>Calculate distances from new cluster to all others using average distances</li>
        <li>Repeat until all taxa are joined</li>
    </ol>
</div>

<h4>UPGMA Example</h4>

<div class="practice-box">
    <h4>Step-by-step UPGMA</h4>
    
    <p><strong>Initial distances:</strong></p>
    <table>
        <tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
        <tr><th>A</th><td>0</td><td>8</td><td><span class="match">7</span></td><td>12</td></tr>
        <tr><th>B</th><td>8</td><td>0</td><td>9</td><td>14</td></tr>
        <tr><th>C</th><td><span class="match">7</span></td><td>9</td><td>0</td><td>11</td></tr>
        <tr><th>D</th><td>12</td><td>14</td><td>11</td><td>0</td></tr>
    </table>
    
    <p><strong>Step 1:</strong> Join A and C (smallest distance = 7)</p>
    <p>New distances:</p>
    <ul>
        <li>$d_{B(AC)} = (d_{BA} + d_{BC})/2 = (8 + 9)/2 = 8.5$</li>
        <li>$d_{D(AC)} = (d_{DA} + d_{DC})/2 = (12 + 11)/2 = 11.5$</li>
    </ul>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/upgma3.svg" alt="UPGMA final tree">
    <div class="figure-caption">Final UPGMA tree showing ultrametric property (all leaves equidistant from root)</div>
</div>

<div class="alert alert-info">
    <i class="fas fa-info-circle"></i>
    <div>
        <strong>Key assumption:</strong> UPGMA assumes a molecular clock (constant evolutionary rate), producing an ultrametric tree where all leaves are equidistant from the root.
    </div>
</div>

<h4>UPGMA Weaknesses</h4>

<p>UPGMA can fail when evolutionary rates vary:</p>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/non-upgma-tree.svg" alt="UPGMA failure case">
    <div class="figure-caption">A non-clock-like tree with different topology that fits the distance matrix perfectly</div>
</div>

<h3>Neighbor-Joining (NJ) Algorithm</h3>

<p>Saitou and Nei (1987) developed NJ to address UPGMA's limitations:</p>

<div class="definition-box">
    <div class="title">Key Innovation</div>
    <p>NJ corrects for unequal evolutionary rates by considering the average distance from each taxon to all others.</p>
</div>

<h4>The NJ Algorithm</h4>

<ol>
    <li>Compute "average distance" for each taxon:
        <div class="math-block">$$r_i = \frac{1}{n-2} \sum_j d_{ij}$$</div>
    </li>
    <li>Calculate corrected distances:
        <div class="math-block">$$d_{ij}^* = d_{ij} - r_i - r_j$$</div>
    </li>
    <li>Join the pair with smallest $d_{ij}^*$</li>
    <li>Calculate branch lengths to new node:
        <div class="math-block">$$d_{ik} = \frac{1}{2}(d_{ij} + r_i - r_j)$$</div>
    </li>
</ol>

<div class="figure small">
    <img src="{{ site.baseurl }}/lecture5/nj.png" alt="Neighbor-joining result">
    <div class="figure-caption">NJ correctly groups AB and CD, unlike UPGMA which incorrectly grouped AC</div>
</div>

<h3>Time Complexity</h3>

<p>Both UPGMA and NJ have $O(n^3)$ time complexity:</p>
<ul>
    <li>$n$ steps (joining operations)</li>
    <li>Each step requires finding minimum distance: $O(n^2)$</li>
    <li>Updating distances: $O(n)$</li>
</ul>

<div class="alert alert-info">
    <i class="fas fa-lightbulb"></i>
    <div>
        <strong>Note:</strong> An optimized UPGMA implementation can achieve $O(n^2)$ complexity, though it's more complex to implement.
    </div>
</div>
</section>

<section class="section" id="least-squares">
<h2>6. Least Squares Distance Methods</h2>

<p>Unlike clustering methods, least squares approaches have an explicit optimality criterion: minimize the difference between observed and tree-implied distances.</p>

<h3>The Least Squares Criterion</h3>

<div class="example-box">
    <h4>Primate Example</h4>
    <table>
        <tr><th>$d_{ij}$</th><th>Human</th><th>Chimp</th><th>Gorilla</th><th>Orangutan</th></tr>
        <tr><th>Human</th><td>0</td><td>0.0965</td><td>0.1140</td><td>0.1849</td></tr>
        <tr><th>Chimp</th><td></td><td>0</td><td>0.1180</td><td>0.2009</td></tr>
        <tr><th>Gorilla</th><td></td><td></td><td>0</td><td>0.1947</td></tr>
        <tr><th>Orangutan</th><td></td><td></td><td></td><td>0</td></tr>
    </table>
</div>

<p>For any tree topology with branch lengths, we can calculate the sum of squared differences:</p>

<div class="math-block">
$$S = \sum_{i<j} (d_{ij} - \hat{d}_{ij})^2$$
</div>

<p>Where:</p>
<ul>
    <li>$d_{ij}$ = observed distance between taxa $i$ and $j$</li>
    <li>$\hat{d}_{ij}$ = tree-implied distance (sum of branch lengths on path)</li>
</ul>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/hcgoTree.png" alt="Tree with branch lengths">
    <div class="figure-caption">Tree-implied distances are sums of branch lengths along paths</div>
</div>

<h3>Optimization Process</h3>

<p>For the primate example:</p>
<ul>
    <li>6 data points (pairwise distances)</li>
    <li>5 free parameters (branch lengths)</li>
    <li>Use numerical optimization to minimize $S$</li>
</ul>

<div class="practice-box">
    <h4>Results for Different Topologies</h4>
    <table>
        <tr>
            <th>Tree Topology</th>
            <th>Least Squares Score (S)</th>
        </tr>
        <tr>
            <td>((Human,Chimp),Gorilla,Orangutan)</td>
            <td><strong>0.000035</strong> ✓</td>
        </tr>
        <tr>
            <td>((Human,Gorilla),Chimp,Orangutan)</td>
            <td>0.000140</td>
        </tr>
        <tr>
            <td>((Human,Orangutan),Chimp,Gorilla)</td>
            <td>0.000140</td>
        </tr>
    </table>
</div>

<div class="figure">
    <img src="{{ site.baseurl }}/lecture5/leastSquares.png" alt="Least squares trees comparison">
    <div class="figure-caption">Different tree topologies with optimized branch lengths and their fit to the data</div>
</div>

<h3>Advantages and Limitations</h3>

<p><strong>Advantages:</strong></p>
<ul>
    <li>Explicit optimality criterion</li>
    <li>Can compare different topologies</li>
    <li>Provides branch length estimates</li>
</ul>

<p><strong>Limitations:</strong></p>
<ul>
    <li>Still need to search tree space (NP-hard problem)</li>
    <li>Assumes distances are measured without error</li>
    <li>No statistical framework for uncertainty</li>
</ul>
</section>

<section class="section">
<h2>Summary</h2>

<p>This lecture introduced the fundamentals of phylogenetic analysis:</p>

<ol>
    <li><strong>Evolutionary information:</strong> Molecular sequences contain historical information that can be decoded through phylogenetic analysis</li>
    
    <li><strong>Tree basics:</strong> Understanding tree anatomy, rooted vs. unrooted trees, and different representations</li>
    
    <li><strong>Tree space:</strong> The number of possible trees grows explosively, making exhaustive searches impossible</li>
    
    <li><strong>Distance methods:</strong> 
        <ul>
            <li>Clustering (UPGMA, NJ): Fast but no optimality measure</li>
            <li>Least squares: Explicit criterion but computationally intensive</li>
        </ul>
    </li>
    
    <li><strong>Key challenges:</strong> Accounting for rate variation, searching vast tree space, and quantifying uncertainty</li>
</ol>

<div class="alert alert-info">
    <i class="fas fa-book"></i>
    <div>
        <strong>Recommended Reading:</strong>
        <ul style="margin-bottom: 0;">
            <li>Higgs & Attwood (2005) "Bioinformatics and Molecular Evolution" - Sections 8.1, 8.3</li>
            <li>Yang (2006) "Computational Molecular Evolution" - Sections 3.1-3.3</li>
            <li>Durbin et al. (1998) "Biological Sequence Analysis" - Sections 7.1-7.3</li>
            <li>Saitou & Nei (1987) "The neighbor-joining method" - Mol Biol Evol 4:406-425</li>
        </ul>
    </div>
</div>

<div class="self-assessment">
    <h4>Check Your Understanding</h4>
    <ol>
        <li>Why do unrooted trees contain less information than rooted trees?</li>
        <li>How does the number of possible trees change as you add more taxa?</li>
        <li>What assumption does UPGMA make that NJ does not?</li>
        <li>How do clustering methods differ from optimality-based methods?</li>
        <li>What information do we need to root an unrooted tree?</li>
    </ol>
</div>

<div class="tools-box">
    <h4>Phylogenetic Software</h4>
    <ul>
        <li><strong>MEGA:</strong> User-friendly GUI for distance and parsimony methods</li>
        <li><strong>RAxML:</strong> Fast maximum likelihood phylogenetic inference</li>
        <li><strong>IQ-TREE:</strong> Efficient phylogenetic software with model selection</li>
        <li><strong>BEAST:</strong> Bayesian phylogenetic inference with molecular dating</li>
        <li><strong>FigTree:</strong> Graphical viewer for phylogenetic trees</li>
    </ul>
</div>
</section>
