p <- function(d) {
    1/4 + 3/4*exp(-(4/3)*d)
}

d <- seq(0, 2, length.out=100)

png("match_probs.png", width=800, height=500, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

plot(d, p(d), 'l', lwd=2, col='blue', ylim=c(0,1),
     xlab="Evolutionary distance (subst per site)", ylab="Probability")
lines(d, 1-p(d), 'l', lwd=2, col='red')

legend('topright', inset=0.05, c(expression(P[a=b](d)), expression(P[a!=b](d))),
       lty=1, lwd=2, col=c("blue", "red"))

dev.off()

png("match_scores.png", width=800, height=500, pointsize=20)
par(mar=c(3,3,1,1), mgp=c(2,0.5,0))

plot(d, log(p(d)/0.25), 'l', lwd=2, col='blue', ylim=c(-2.5, 1.5), xlim=c(0, 2),
     xlab="Evolutionary distance (subst per site)", ylab="Log-odds score")
lines(d, log((1-p(d))/0.75), lwd=2, col='red')
lines(d, rep(0, length(d)), lwd=2, lty=2, col="grey")

legend('topright', inset=0.05, c(expression(P[a=b](d)), expression(P[a!=b](d))),
       lty=1, lwd=2, col=c("blue", "red"))

dev.off()
