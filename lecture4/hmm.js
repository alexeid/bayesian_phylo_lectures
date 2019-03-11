$(document).ready(function() {
    $("#HMMsim").click(function(e) {
        e.preventDefault();
        var res = HMM.sim();
        $("#HMMsim_output").text(HMM.getSimString(res[0], res[1]));
    });

    $("#HMMviterbi").click(function(e) {
        e.preventDefault();
        var res = HMM.sim();

        var state_sequence = res[0];
        var obs_sequence = res[1];
        var viterbi_state_sequence = HMM.viterbi(obs_sequence);
        
        var simstr = HMM.getSimString(state_sequence, obs_sequence);
        var vitstr = HMM.getViterbiString(viterbi_state_sequence);
        
        var count = 0;
        for (i=1; i < state_sequence.length; i++) {
          count += (viterbi_state_sequence[i] == state_sequence[i]) ? 1 : 0;  
        }
        
        $("#HMMviterbi_output").text(simstr
                                + "\n"
                                + vitstr + "\n         " + count + "/" + state_sequence.length + " correct.");
    });

    $("#HMMforwardBackward").click(function(e) {
        e.preventDefault();
        var res = HMM.sim();
        $("#HMMforwardBackwardOutput").text(HMM.getSimString(res[0], res[1]) + "\n"
                                + HMM.getViterbiString(HMM.viterbi(res[1])) + "\n\n"
                                + HMM.getPosteriorString(HMM.forwardBackward(res[1])) );
    });

});

HMM = (function() {

    states = ["F", "U"];
    obs = ["H", "T"];

    var M = [
        [ 0.95, 0.05 ],
        [ 0.1,  0.9  ]
    ];

    var e = [
        [0.5, 0.5],
        [0.9, 0.1]
    ];

    var N = 90;

    function sim() {
        function toss(state) {
            if (Math.random()<e[state][0])
                return 0;
            else
                return 1;
        }

        function propagate(state) {
            if (Math.random()<M[state][state])
                return state;
            else
                return 1-state;
        }

        var state_sequence = [0];
        var obs_sequence = [toss(state_sequence[0])];

        var i;
        for (i=1; i<N; i++) {
            state_sequence[i] = propagate(state_sequence[i-1]);
            obs_sequence[i] = toss(state_sequence[i]);
        }

        return [state_sequence, obs_sequence];
    }

    function getSimString(state_sequence, obs_sequence) {
        var statesString = " States: ";
        var obsString =    "    Obs: ";
        for (i=0; i<N; i++) {
            statesString += states[state_sequence[i]];
            obsString += obs[obs_sequence[i]];
        }

        return statesString + "\n" + obsString;
    }

    function getViterbiString(hidden_sequence) {
        var obsString =    "Viterbi: ";
        for (i=0; i<N; i++) {
            obsString += states[hidden_sequence[i]];
        }

        return obsString;
    }


    function viterbi(obs_sequence) {
        var v = [[e[0][obs_sequence[0]]*M[0][0], e[1][obs_sequence[0]]*M[0][1]]];
        var ptr = [[0, 0]];

        var i;
        for (i=1; i<N; i++) {
            v[i] = [];
            ptr[i] = [];
            var x = obs_sequence[i];
            for (var l=0; l<=1; l++) {
                var q = Number.NEGATIVE_INFINITY;
                var kmax = undefined;
                for (var k=0; k<=1; k++) {
                    var newq = v[i-1][k]*M[k][l];
                    if (newq > q) {
                        q = newq;
                        kmax = k;
                    }
                }
                v[i][l] = e[l][x]*q;
                ptr[i][l] = kmax;
            }
        }

        var path = Array(N);
        if (v[N-1][0] > v[N-1][1])
            path[N-1] = [0];
        else
            path[N-1] = [1];

        for (i=N-2; i>=0; i--) {
            path[i] = ptr[i+1][path[i+1]];
        }

        return path;
    }

    function forwardBackward(obs_sequence) {
        var f = Array(N), b = Array(N);

        // forward
        f[0] = [1, 0];

        var i;
        for (i=1; i<N; i++) {
            var x = obs_sequence[i];

            f[i] = [
                e[0][x]*(f[i-1][0]*M[0][0] + f[i-1][1]*M[1][0]),
                e[1][x]*(f[i-1][0]*M[0][1] + f[i-1][1]*M[1][1]),
            ];
        }

        var P = f[N-1][0] + f[N-1][1];

        // backward
        b[N-1] = [1, 1];

        for (i=N-1; i>0; i--) {
            var x = obs_sequence[i];

            b[i-1] = [
                M[0][0]*e[0][x]*b[i][0] + M[0][1]*e[1][x]*b[i][1],
                M[1][0]*e[0][x]*b[i][0] + M[1][1]*e[1][x]*b[i][1]
            ];
        }

        // posterior
        var fairPosterior = [];

        for (i=0; i<N; i++) {
            fairPosterior[i] = f[i][0]*b[i][0]/P;
        }

        return fairPosterior;
    }

    function getPosteriorString(posterior) {
        var string = "Posterior fairness:\n";

        var nLines = 20;

        var l, i;
        for (l=0; l<nLines; l++) {
            if (l==0)
                string +=    "     1 -";
            else if (l == nLines-1)
                string +=    "     0 -";
            else if (l == nLines/2)
                string +=    "   0.5 -";
            else
                string +=    "        ";

            var top = (nLines - l)/nLines;
            var bot = (nLines - l - 1)/nLines;

            for (i=0; i<N; i++) {
                if (posterior[i]>= bot && posterior[i]<top)
                    string += "#";
                else
                    string += " ";
            }

            if (l==0)
                string +=    " - 1";
            else if (l == nLines-1)
                string +=    " - 0";
            else if (l == nLines/2)
                string +=    " - 0.5";
            string += "\n";
        }

        return string;
    }

    return {
        sim: sim,
        getSimString: getSimString,
        viterbi: viterbi,
        getViterbiString: getViterbiString,
        forwardBackward: forwardBackward,
        getPosteriorString: getPosteriorString
    }
})();
