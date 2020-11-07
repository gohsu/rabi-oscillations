yarn add @tensorflow/tfjs-node
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>

function ab_to_alphabeta(thet) {
    // Matrix that transforms (a,b)^T (alpha,beta)^T
    M = tf.constant([[np.cos(thet/2),np.sin(thet/2)],[np.sin(thet/2),-np.cos(thet/2)];
    return M;
}

function theta(w0, w1, w): {
    thet = tf.math.acos((w0-w)/weff);
    return thet;
}

function params_to_omegas(B0, B, q, m) {
    g = 2.002
    c = 29979245800 // cgs!
    w0 = -g*q*B0/(2*m*c);
    w1 = -g*q*B/(2*m*c);
    return w0, w1;
}

function psi(t, psi0, w0, w1, w) {
    thet = theta(w0,w1,w);
    weff = tf.math.sqrt((w0-w)**2 + w1**2);
    M = ab_to_alphabeta(thet);
    alpha_beta = tf.matmul(M, psi0);
    alpha = alpha_beta[0];
    beta = alpha_beta[1];
    costo2 = tf.math.cos(thet/2);
    sinto2 = tf.math.sin(thet/2);
    top = costo2*tf.math.exp(-1j*w/2*t)*tf.math.exp(-1j*weff/2*t)*alpha;
    top += sinto2*tf.math.exp(-1j*w/2*t)*tf.math.exp(1j*weff/2*t)*beta;
    bot = sinto2*tf.math.exp(1j*w/2*t)*tf.math.exp(-1j*weff/2*t)*alpha;
    bot += -costo2*tf.math.exp(1j*w/2*t)*tf.math.exp(1j*weff/2*t)*beta;
    psi_t = tf.constant([[top],[bot]],dtype=complex)
    return psi_t;
} 

function probability_plus_z(psi_t) {
    prob_amp = psi_t[0];
    prob = tf.abs(prob_amp) ** 2;
    return prob;
}

function main(t, psi0, B0, B, w, m) {
    w0, w1 = params_to_omegas(B0,B,q,m);
    psi_t = psi(t,psi0,w0,w1,w);
    prob = probability_plus_z(psi_t);
    return prob;
}