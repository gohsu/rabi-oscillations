const tf = require('@tensorflow/tfjs');


function ab_to_alphabeta(thet) {
    const M = tf.tensor([[tf.cos(thet/2), tf.sin(thet/2)],[tf.sin(thet/2),-tf.cos(thet/2)]]);
    return M;
}

function theta(w0, w1, w) {
    w0.print();
    console.log(w);
    w1.print();
    const weff = tf.sqrt((w0-w)*(w0-w) + w1*w1);
    console.log(weff);
    const thet = tf.acos((w0-w)/weff);
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
    const weff = tf.sqrt((w0-w)*(w0-w) + w1*w1);
    console.log('weff');
    console.log(weff);
    const M = ab_to_alphabeta(thet);
    const alpha_beta = tf.matMul(M, psi0);
    const alpha_ = tf.slice(alpha_beta, 0, 1);
    const beta_ = tf.slice(alpha_beta, 1, 1);
//    const norm = tf.conjugate(alpha_)*alpha_ + tf.conjugate(beta_)*beta_;
    const norm = tf.abs(alpha_) ** 2 + tf.abs(beta_) ** 2
    const alpha = alpha_/norm;
    const beta = beta_/norm;
    console.log('alp');
    alpha.print();
    beta.print();
    const term3 = alpha*beta*tf.sin(thet)*tf.cos(weff * t);
    const psi_t = (alpha*tf.cos(thet/2))**2 + (beta*tf.sin(thet/2))**2 + term3;
    return psi_t;
} 

function main(t, psi0, B0, B, w, m, q) {
    const w0_w1 = params_to_omegas(B0,B,q,m);
    console.log('w0w1');
    w0_w1.print();
    const w0 = tf.slice(w0_w1, 0, 1);
    const w1 = tf.slice(w0_w1, 1, 1);
    console.log('w0 saa w1');
    w0.print();
    w1.print();
    const psi_t = psi_top(t,psi0,w0,w1,w);
    return psi_t;
}

const psi0 = tf.tensor([[1],[0]]);
var prob = main(0, psi0, 1, 2, 1, 1, 1);
console.log('prob');
console.log(prob);