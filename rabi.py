import numpy as np

def ab_to_alphabeta(thet):
    """
    Matrix that transforms (a,b)^T (alpha,beta)^T
    """
    # dtype = complex?
    M = np.array([[np.cos(thet/2),np.sin(thet/2)],[np.sin(thet/2),-np.cos(thet/2)]])
    return M

def theta(w0,w1,w):
    """
    Calculates theta
    """
    weff = np.sqrt((w0-w)**2 + w1**2)
    thet = np.arccos((w0-w)/weff)
    return thet

def params_to_omegas(B0,B,g,q,m,c):
    """
    Calculates omegas from parameters
    """
    w0 = -g*q*B0/(2*m*c)
    w1 = -g*q*B/(2*m*c)
    return [w0,w1]

def psi(t,psi0,w0,w1,w):
    """
    psi(t)
    """
    # theta
    thet = theta(w0,w1,w)
    weff = np.sqrt((w0-w)**2 + w1**2)
    # alpha and beta
    alpha_beta = np.array([[ab_to_alphabeta(thet)[0,0]*psi0[0] + ab_to_alphabeta(thet)[0,1]*psi0[1]],[ab_to_alphabeta(thet)[1,0]*psi0[0] + ab_to_alphabeta(thet)[1,1]*psi0[1]]])
    alpha = alpha_beta[0]
    beta = alpha_beta[1]
    # cos(theta/2) and sin(theta/2)
    costo2 = np.cos(thet/2)
    sinto2 = np.sin(thet/2)
    # top
    top = costo2*np.exp(-1j*w/2*t)*np.exp(-1j*weff/2*t)*alpha
    top += sinto2*np.exp(-1j*w/2*t)*np.exp(1j*weff/2*t)*beta
    # bottom
    bot = sinto2*np.exp(1j*w/2*t)*np.exp(-1j*weff/2*t)*alpha
    bot += -costo2*np.exp(1j*w/2*t)*np.exp(1j*weff/2*t)*beta
    # psi(t)
    psi_t = np.array([[top],[bot]],dtype=complex)
    
    return psi_t

def probability(psi_t, proj):
    """
    Returns |<proj|psi(t)>|^2
    Proj is state to be projected onto
    """
    prob_amp = np.conj(proj[0])*psi_t[0] + np.conj(proj[1])*psi_t[1]
    prob = np.abs(prob_amp)**2
    return prob

def main(t,psi0,proj,B0,B,w,g,q,m,c):
    """
    Main
    Returns prob to be in key for given t
    """
    # omegas
    [w0,w1] = params_to_omegas(B0,B,g,q,m,c)
    
    # psi(t)
    psi_t = psi(t,psi0,w0,w1,w)
    
    # prob
    prob = probability(psi_t,proj)
    
    return prob

import matplotlib.pyplot as plt

def plot_t(psi0,proj,B0,B,w,g,q,m,c):
    t = np.linspace(0,25*np.pi,num=1000)
    prob_t = main(t,psi0,proj,B0,B,w,g,q,m,c)
    
    fig = plt.figure(figsize=(10,5))
    plt.suptitle("$|<+z|\psi(t)>|^2$")
    plt.xlabel("$t$")
    plt.ylabel("$|<+z|\psi(t)>|^2$")
    plt.plot(t,prob_t[0,0])
    plt.show()
    

def plot_w(t,psi0,proj,B0,B,g,q,m,c):
    w = np.linspace(0,2,num=1000)
    prob_w = main(t,psi0,proj,B0,B,w,g,q,m,c)
    
    fig = plt.figure(figsize=(10,5))
    plt.suptitle("$|<+z|\psi(t)>|^2$")
    plt.xlabel("$\omega$")
    plt.ylabel("$|<+z|\psi(t)>|^2$")
    plt.plot(w,prob_w[0,0])
    plt.show()
