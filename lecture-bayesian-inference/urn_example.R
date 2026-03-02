## Urn example for lecture.

Nr <- seq(0, 11)

lik <- Nr^2*(11-Nr)/11^3

png("urn_posterior.png", width=800, height=600, pointsize=20)
plot(Nr, lik, 'b', col='blue', lwd=2,
     xlab = expression(paste('Value of ', N[r])),
     ylab = expression(P(N[r] ~ '|' ~ R,B,R)))
dev.off()


png("poissonian.png", width=600, height=600, pointsize=20)
n <- seq(0, 10)
p <- dpois(n, 5)
plot(n, p, 'h', lwd=2, col='blue',
     ylab=expression(P(n)))
points(n, p, lwd=2, col='blue')
dev.off()

png("uniform_improper.png", width=800, height=200, pointsize=20)
par(mar=c(3,3,2,1))
lambda <- seq(0,1000)
p <- rep(1/1000, length(lambda))
plot(lambda, p, 'l', lwd=2, col='blue', ylim=c(0,0.002), yaxt='n')
axis(side=2,at=c(0,2/1000),labels=c('0','0.002'))
dev.off()

png("lognormal.png", width=800, height=200, pointsize=20)
par(mar=c(3,3,1,1))
x <- seq(0, 100)
p <- dlnorm(x, meanlog=0, sdlog=4)
plot(x, p, 'l', lwd=2, col='blue')
dev.off()

png("credible_interval.png", width=800, height=300, pointsize=15)
par(mar=c(3,3,1,1))

x <- seq(0, 1, length.out=1000)
p <- dbeta(x, 8, 4)

cutoff <- 0.54
interval <- x[p>cutoff]
pinterval <- p[p>cutoff]
lower <- min(interval)
upper <- max(interval)

plot(x, p, 'l', lwd=2, col='blue')
polygon(c(interval, rev(interval)), c(rep(0, length(interval)), rev(pinterval)), col='grey')
lines(c(lower,lower), c(0, 3), lwd=2, col='red')
lines(c(upper,upper), c(0, 3), lwd=2, col='red')
lines(c(0,1), c(cutoff, cutoff), lwd=2, lty=2, col='purple')

dev.off()

png("rejection_sampling.png", width=800, height=400, pointsize=15)
par(mar=c(3,3,1,1))

x <- seq(0, 1, length.out=1000)
p <- dbeta(x,8,4)

plot(x,p, 'l', lwd=2, col='blue')
dev.off()

png("MCMC.png", width=800, height=400, pointsize=15)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))
x <- seq(0, 1, length.out=1000)
p <- dbeta(x,8,4)

plot(x,p, 'l', lwd=2, col='blue', ylab=expression(f(x)))
dev.off()


mcmc <- function(x0, w, logTarget, steps=1000) {

    x <- x0

    oldLogP <- logTarget(x)

    for (i in 2:steps) {

        xPrime <- runif(1, x[i-1]-w/2, x[i-1]+w/2)

        newLogP <- logTarget(xPrime)

        if (newLogP>oldLogP || runif(1)<exp(newLogP-oldLogP)) {
            x[i] <- xPrime
            oldLogP <- newLogP
        } else {
            x[i] <- x[i-1]
        }
    }

    return(x)
}


png("MCMC_trace.png", width=800, height=400, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

logTarget <- function(x) {
    return(log(dbeta(x,8,4)))
}
trace <- mcmc(0.1, 0.2, logTarget)

plot(1:length(trace), trace, 'l', col='purple',
     xlab="Algorithm steps",
     ylab=expression(x))

dev.off()


png("MCMC_density.png", width=800, height=400, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

trace <- mcmc(0.1, 0.2, logTarget, steps=10000)

plot(density(trace[-(1:1000)]), lwd=2, col='blue',
     xlab="x", main="")
lines(x, exp(logTarget(x)), lwd=2, lty=2, col='red')
legend("topleft", inset=0.05,
       c("MCMC", expression(f(x))),
       col=c("blue","red"),
       lwd=2, lty=c(1,2))

dev.off()


png("MCMC_slow_trace.png", width=800, height=300, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

trace <- mcmc(0.1, 0.05, logTarget, steps=2000)

plot(1:length(trace), trace, 'l', col='purple',
     xlab="Algorithm steps",
     ylab=expression(x))

dev.off()


png("MCMC_convergence_testing.png", width=400, height=400, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

trace <- list()
trace[[1]] <- mcmc(0.1, 0.2, logTarget, steps=10000)
trace[[2]] <- mcmc(0.1, 0.2, logTarget, steps=10000)
trace[[3]] <- mcmc(0.1, 0.2, logTarget, steps=10000)
trace[[4]] <- mcmc(0.1, 0.2, logTarget, steps=10000)

plot(density(trace[[1]][-(1:1000)]), lwd=2, col='blue',
     xlab="x", main="", ylim=c(0,3))
lines(density(trace[[2]][-(1:1000)]), lwd=2, col='blue')
lines(density(trace[[3]][-(1:1000)]), lwd=2, col='blue')
lines(density(trace[[4]][-(1:1000)]), lwd=2, col='blue')
lines(x, exp(logTarget(x)), lwd=2, lty=2, col='red')
dev.off()


png("MCMC_acf.png", width=800, height=300, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

plot(acf(trace[[1]][-(1:1000)]), main="")
dev.off()
