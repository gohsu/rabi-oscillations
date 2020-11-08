function ab_to_alphabeta(thet) {
    const a = math.cos(math.divide(thet,2));
    const b = math.sin(math.divide(thet,2));
    const c = math.multiply(-1, a);
    const M = math.matrix([[a, b], [b, c]]);
    return M;
}

function theta(w0, w1, w) {
    const t1 = math.subtract(w0, w);
    const weff_sq = math.add(math.pow(t1, 2), math.pow(w1, 2));
    const weff = math.sqrt(weff_sq);
    const thet = math.acos(math.divide(t1, weff));
    return thet;
}

function params_to_omegas(B0, B, q, m) {
    const g = 2.002;
    const c = 29979245800 // cgs!
    //const c = 1;
    const w0 = -g*q*B0/(2*m*c);
    const w1 = -g*q*B/(2*m*c);
    return [w0, w1];
}

function psi_top(t, psi0, w0, w1, w) {
    const thet = theta(w0,w1,w);
    const t1 = math.subtract(w0, w);
    const weff_sq = math.add(math.pow(t1, 2), math.pow(w1, 2));
    const weff = math.sqrt(weff_sq);
    const M = ab_to_alphabeta(thet);
    const alpha_beta = math.multiply(M, psi0);
    const alpha = alpha_beta['_data'][0];
    const beta = alpha_beta['_data'][1];
    const term1 = math.pow(alpha.abs() * math.cos(math.divide(thet,2)),2);
    const term2 = math.pow(beta.abs() * math.sin(math.divide(thet,2)), 2)
    const term3 = alpha.abs() * beta.abs() * math.sin(thet) * math.cos(weff * t + beta.arg() - alpha.arg());
    const psi_t = math.add(term1, term2, term3);
    return psi_t;
} 

function calculateProb(t, real_row1_psi0, im_row1_psi0, real_row2_psi0, im_row2_psi0, B0_in, B_in, w, m_in, q_in) {
    // mass in kg, q in elementary charge
    const m = 9.10938356 * math.pow(10, -31) * 1000 * m_in;
    const q = 4.80320427 * math.pow(10, -10) * q_in;
    const B0 = mat.pow(10, 5) * B0_in;
    const B = mat.pow(10, 5) * B_in; 
    const w0_w1 = params_to_omegas(B0,B,q,m);
    const w0 = w0_w1[0];
    const w1 = w0_w1[1];
    const norm_psi0 = math.sqrt(math.add(math.pow(real_row1_psi0, 2), math.pow(im_row1_psi0, 2), math.pow(real_row2_psi0, 2), math.pow(im_row2_psi0, 2))); 
    const psi0row1 = math.complex(math.divide(real_row1_psi0, norm_psi0), math.divide(im_row1_psi0, norm_psi0));
    const psi0row2 = math.complex(math.divide(real_row2_psi0, norm_psi0), math.divide(im_row2_psi0, norm_psi0));
    const psi0 = math.transpose(math.matrix([psi0row1, psi0row2]));
    const psi_t = psi_top(t,psi0,w0,w1,w);
    return psi_t;
}
