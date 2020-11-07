//yarn add @tensorflow/tfjs-node
//<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>

const tf = require('@tensorflow/tfjs');


function ab_to_alphabeta(thet) {
    const M = tf.tensor([[tf.cos(thet/2), tf.sin(thet/2)],[tf.sin(thet/2),-tf.cos(thet/2)]]);
    return M;
}

function theta(w0, w1, w) {
    const weff = tf.sqrt((w0-w)**2 + w1**2); 
    const thet = tf.acos((w0-w)/weff);
    return thet;
}

function params_to_omegas(B0, B, q, m) {
    const g = 2.002
    const c = 29979245800 // cgs!
    const w0 = -g*q*B0/(2*m*c);
    const w1 = -g*q*B/(2*m*c);
    return tf.tensor([w0, w1]);
}

function psi_top(t, psi0, w0, w1, w) {
    var top, bot;
    const thet = theta(w0,w1,w);
    const weff = tf.sqrt((w0-w)**2 + w1**2); 
    const M = ab_to_alphabeta(thet);
    const alpha_beta = tf.matMul(M, psi0);
    const alpha = alpha_beta[0];
    const beta = alpha_beta[1];
    const term3 = alpha*beta*tf.sin(thet)*tf.cos(weff * t);
    const psi_t = (alpha*tf.cos(thet/2))**2 + (beta*tf.sin(thet/2))**2 + term3;
    return psi_t;
} 

function probability_plus_z(psi_top_t) {
    const prob = psi_top_t;
    return prob;
}

function main(t, psi0, B0, B, w, m, q) {
    const w0_w1 = params_to_omegas(B0,B,q,m);
    const w0 = w0_w1[0];
    const w1 = w0_w1[1];
    const psi_t = psi_top(t,psi0,w0,w1,w);
    const prob = probability_plus_z(psi_t);
    return prob;
}

const psi0 = tf.tensor([[1],[0]])
var prob = main(1, psi0, 1, 1, 1, 1, 1);
print(prob);