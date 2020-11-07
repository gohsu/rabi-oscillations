const tf = require('@tensorflow/tfjs');


function ab_to_alphabeta(thet) {
    const a = tf.cos(tf.div(thet,2));
    const b = tf.sin(tf.div(thet,2));
    const c = tf.mul(-1, a);
    const row1 = a.concat(b);
    const row2 = b.concat(c);
    const M = tf.stack([row1, row2]);
    return M;
}

function theta(w0, w1, w) {
    const t1 = tf.sub(w0, w);
    const weff_sq = tf.add(t1.pow(2), w1.pow(2));
    const weff = weff_sq.sqrt();
    const thet = tf.acos(tf.div(t1, weff));
    return thet;
}

function params_to_omegas(B0, B, q, m) {
    const g = 2.002;
    //const c = 29979245800 // cgs!
    const c = 1;
    const w0 = -g*q*B0/(2*m*c);
    const w1 = -g*q*B/(2*m*c);
    return tf.tensor([w0, w1]);
}

function psi_top(t, psi0, w0, w1, w) {
    const thet = theta(w0,w1,w);
    const t1 = tf.sub(w0, w);
    const weff_sq = tf.add(t1.pow(2), w1.pow(2));
    const weff = weff_sq.sqrt();
    const M = ab_to_alphabeta(thet);
    const alpha_beta = tf.matMul(M, psi0);
    const alpha_ = tf.slice(alpha_beta, 0, 1);
    const beta_ = tf.slice(alpha_beta, 1, 1);
    const norm = tf.add(tf.pow(tf.abs(alpha_), 2), tf.pow(tf.abs(beta_), 2));
    const alpha = tf.div(alpha_, norm);
    const beta = tf.div(beta_, norm);
    const term1 = tf.pow(tf.mul(alpha, tf.cos(tf.div(thet,2))),2);
    const term2 = tf.pow(tf.mul(beta, tf.sin(tf.div(thet,2))), 2)
    const term3 = tf.mul(alpha, beta, tf.sin(thet), tf.cos(weff * t));
    const psi_t = tf.add(term1, term2, term3);
    return psi_t;
} 

function main(t, psi0, B0, B, w, m, q) {
    const w0_w1 = params_to_omegas(B0,B,q,m);
    const w0 = tf.slice(w0_w1, 0, 1);
    const w1 = tf.slice(w0_w1, 1, 1);
    const psi_t = psi_top(t,psi0,w0,w1,w);
    return psi_t;
}

const psi0 = tf.tensor([[1],[0]]);
const omega = tf.tensor([1]);
var prob = main(0, psi0, 0, 0, omega, 1, -1);
console.log('prob');
prob.print();