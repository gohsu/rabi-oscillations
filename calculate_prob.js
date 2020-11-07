//yarn add @tensorflow/tfjs-node
//<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>

const tf = require('@tensorflow/tfjs');


function ab_to_alphabeta(thet) {
    const M = tf.constant([[tf.math.cos(thet/2), tf.math.sin(thet/2)],[tf.math.sin(thet/2),-tf.math.cos(thet/2)]]);
    return M;
}

function theta(w0, w) {
    const thet = tf.math.acos((w0-w)/weff);
    return thet;
}

function params_to_omegas(B0, B, q, m) {
    const g = 2.002
    const c = 29979245800 // cgs!
    const w0 = -g*q*B0/(2*m*c);
    const w1 = -g*q*B/(2*m*c);
    return w0, w1;
}

function psi(t, psi0, w0, w1, w) {
    var top, bot;
    const thet = theta(w0,w1,w);
    const weff = tf.math.sqrt((w0-w)**2 + w1**2); 
    const M = ab_to_alphabeta(thet);
    const alpha_beta = tf.matmul(M, psi0);
    const alpha = alpha_beta[0];
    const beta = alpha_beta[1];
    const costo2 = tf.math.cos(thet/2);
    const sinto2 = tf.math.sin(thet/2);
    top = costo2*tf.math.exp(tf.complex(0, -w/2*t))*tf.math.exp(tf.complex(0, -weff/2*t))*alpha;
    top += sinto2*tf.math.exp(tf.complex(0, -w/2*t))*tf.math.exp(tf.complex(0, weff/2*t))*beta;
    bot = sinto2*tf.math.exp(tf.complex(0, w/2*t))*tf.math.exp(tf.complex(0, -weff/2*t))*alpha;
    bot += -costo2*tf.math.exp(tf.complex(0, w/2*t))*tf.math.exp(tf.complex(0, weff/2*t))*beta;
    const psi_t = tf.constant([[top],[bot]],dtype=complex)
    return psi_t;
} 

function probability_plus_z(psi_t) {
    const prob_amp, prob;
    prob_amp = psi_t[0];
    prob = tf.abs(prob_amp) ** 2;
    return prob;
}

function main(t, psi0, B0, B, w, m) {
    const w0, w1, psi_t, prob;
    w0, w1 = params_to_omegas(B0,B,q,m);
    psi_t = psi(t,psi0,w0,w1,w);
    prob = probability_plus_z(psi_t);
    return prob;
}

const psi0 = tf.constant([[1],[0]])
var prob = main(1, psi0, 1, 1, 1, 1);
print(prob);