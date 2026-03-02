plotWrightFisher <- function(N=12, G=21,sorted=T, unsorted=T, pch=1, seed=NA, lines=T, plotNodeLabels=F, col="gray", horizontal=F) {
  
  if (!is.na(seed)) {
  	set.seed(seed);
  }
  
  x <- rep(1:N, times=G); 
  y <- rep(0:(G-1), each=N)
  p <- sample(1:N,N*(G-1),replace=T)
  mar <- c(3,5,1,1) + 0.1;
  if (sorted && unsorted) {
  	par(mar = mar, mfrow=ifelse(horizontal,c(2,1),c(1,2)))
  } else {
  	par(mar = mar)
  }
  
  xlab <- "individuals";
  ylab <- "Generations in the past";
  if (horizontal) {
  	tmp <- xlab;
  	xlab <- ylab;
  	ylab <- tmp;
  }
  
  if (horizontal) {
    plot(unlist(ifelse(horizontal,list(y),list(x))),unlist(ifelse(horizontal,list(x),list(y))),xlab="", ylab=ylab, yaxt="n", col=col)
  } else {
    plot(unlist(ifelse(horizontal,list(y),list(x))),unlist(ifelse(horizontal,list(x),list(y))),xlab="", ylab=ylab, xaxt="n", col=col)
  }    

  mtext(xlab, side=1, line=1)

  if (unsorted) {
    lx <- c(rbind(x[1:length(p)],p,NA))
    ly <- c(rbind(y,y+1,NA))
    lines(lx[1:(3*N*(G-1))],ly[1:(3*N*(G-1))],col="black")
    points(x,y,pch=16,col="white")
    points(x,y,pch=pch)
  }

  if (sorted) {
    if (unsorted) {
      plot(unlist(ifelse(horizontal,list(y),list(x))),unlist(ifelse(horizontal,list(x),list(y))),xlab="", ylab=ylab, 
        xaxt=ifelse(horizontal,"","n"), yaxt=ifelse(horizontal,"n",""), col=col)
      mtext(xlab, side=1, line=1)
    }
    
    # the labels of the x after sorting
    xl <-  x[(((G-1)*N)+1):(G*N)];
    np <- c();
  
    for (i in (G-2):0) {
      
	  xl_parents <- xl[1:N];
	      
	  parents <- p[((i*N)+1):((i+1)*N)]
	  children <- x[((i*N)+1):((i+1)*N)]
      
      xl <- c(order(match(parents,xl_parents)),xl)

      np <- c(match(parents[xl[1:N]],xl_parents), np);  
    }

    if (lines) {
      lx <- c(rbind(x[1:length(p)],np,NA))
      ly <- c(rbind(y,y+1,NA))
      
      if (horizontal) {
      	tmp <- lx;
      	lx <- ly;
      	ly <- tmp;
      }
      
      lines(lx[1:(3*N*(G-1))],ly[1:(3*N*(G-1))], col=col)
    }
    
      if (horizontal) {
      	tmp <- x;
      	x <- y;
      	y <- tmp;
      }

    points(x,y,pch=16,col="white")
    points(x,y,pch=pch, col=col)
    if (plotNodeLabels) {
    	text(x,y,xl,cex=0.6)
    }
    #text(x,y+0.5,np, col="red")
  }  
  
  result <- list(N=N, G=G, node_labels=xl, parent_positions=np, x=x, y=y)
  return (result)
}

# takes a vector of node labels and plots their ancestry back to the oldest generation
plotAncestralLineages <- function(wrightFisher, node_labels, pch=16, col="red", plotRootLineage=F, horizontal=F) {

	x <- c();
	y <- c();
	lx <- c();
	ly <- c();
	
	N <- wrightFisher$N
	G <- wrightFisher$G

	node_positions <- match(node_labels, wrightFisher$node_labels[1:N])

	i <- 0;

	while  (i < G & (length(node_positions) > 1 | plotRootLineage)) {
			
		x <- c(x, node_positions);
		y <- c(y, rep(i, length(node_positions)));
		
		start <- i*N+1;

		parent_positions <- wrightFisher$parent_positions[start:(start+N)]
		parent_positions <- parent_positions[node_positions]
		
		lx <- c(lx, rbind(node_positions,parent_positions,NA))
		ly <- c(ly, rbind(rep(i, length(node_positions)),rep(i+1, length(node_positions)),NA))
		
		node_positions <- unique(parent_positions);
		i = i + 1;
	}
	
	if (length(node_positions) == 1 & !plotRootLineage) {
		x <- c(x, node_positions);
		y <- c(y, i);
	}
	
	if (horizontal) {
      		tmp <- x;
      		x <- y;
      		y <- tmp;

      		tmp <- lx;
      		lx <- ly;
      		ly <- tmp;

	}

    	lines(lx,ly,col=col)
	points(x, y, pch=pch, col=col);	
}