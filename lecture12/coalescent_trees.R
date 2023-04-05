library(ape)
library(phangorn)

setwd("~/Git/bayesian_phylo_lectures/lecture12/")

create_coalescent_tree <- function(num_taxa) {
  LETTERS <- c("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")
  tree <- rcoal(num_taxa, tip.label=LETTERS[1:num_taxa])
  return(tree)
}

# Generate 6 coalescent trees
trees <- lapply(rep(26, 6), create_coalescent_tree)

# Save the plot to a PNG file
png("coalescent_trees.png", width = 2400, height = 1600, pointsize=28)

# Set the plot layout
layout(matrix(1:6, nrow = 2, ncol = 3, byrow = TRUE))

# Plot the trees
for (tree in trees) {
  plot(tree, show.tip.label = TRUE, show.node.label = FALSE, edge.width=3, cex=1)
}

# Close the PNG device
dev.off()

# Reset the plot layout
layout(1)
