var SIR = (function() {
    var pub = {};

    pub.N = 100;
    pub.beta = 0.01;
    pub.mu = 0.1;

    function Tinf(S,I,R) {
        return pub.beta*S*I;
    }

    function Trem(S,I,R) {
        return pub.mu*I;
    }

    pub.getStochastic = function (T) {
        var S = [pub.N-1], I=[1], R=[0], t=[0];

        var i = 0;
        while (t[i]<T) {
            var Ti = Tinf(S[i], I[i], R[i]);
            var Tr = Trem(S[i], I[i], R[i]);
            var T0 = Ti + Tr;

            if (T0 == 0)
                break;

            var dt = -Math.log(Math.random())/T0;
            if (t[i] + dt > T)
                break;

            t.push(t[i] + dt);

            if (Math.random()*T0 < Ti) {
                // Infection
                S.push(S[i]-1);
                I.push(I[i]+1);
                R.push(R[i]);
            } else {
                // Recovery
                S.push(S[i]);
                I.push(I[i]-1);
                R.push(R[i]+1);
            }

            i += 1;
        }

        S.push(S[i]);
        I.push(I[i]);
        R.push(R[i]);
        t.push(T);

        return {
            S: S,
            I: I,
            R: R,
            t: t
        };
    }

    pub.getDeterministic = function (T, nSteps) {

        var dt = T/(nSteps - 1);

        S = [pub.N-1], I=[1], R=[0], t=[0];

        for (var i=1; i<nSteps; i++) {

            // Semi-implicit algorithm (uses numerical estimate of dx/dt at t+0.5dt)

            var Sp = S[i-1], Ip = I[i-1], Rp = R[i-1]; 

            for (var iter=0; iter<3; iter++) {
                var Spp = S[i-1] - Tinf(Sp,Ip,Rp)*0.5*dt
                var Ipp = I[i-1] + (Tinf(Sp,Ip,Rp) - Trem(Sp,Ip,Rp))*0.5*dt
                var Rpp = R[i-1] + Trem(Sp,Ip,Rp)*0.5*dt

                Sp = Spp, Ip = Ipp, Rp = Rpp;
            }

            S.push(Sp*2 - S[i-1]);
            I.push(Ip*2 - I[i-1]);
            R.push(Rp*2 - R[i-1]);
            t.push(t[i-1] + dt);
        }

        return {
            S: S,
            I: I,
            R: R,
            t: t
        };
    }

    pub.getR0 = function(traj) {
        R0 = [];
        for (var j=0; j<t.length; j++) {
            R0.push(Tinf(traj.S[j],traj.I[j],traj.R[j])/Trem(traj.S[j],traj.I[j],traj.R[j]))
        }

        return R0;
    }

    return pub;
})();


