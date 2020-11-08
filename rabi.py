import numpy as np
import matplotlib.pyplot as plt
import cmath
from matplotlib.patches import FancyArrowPatch
from mpl_toolkits.mplot3d import proj3d
from mpl_toolkits.mplot3d import Axes3D
import seaborn as sns
sns.set_style("white")

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
    M = ab_to_alphabeta(thet)
    alpha_beta = np.dot(M,psi0)
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

def plot_t(psi0,proj,B0,B,w,g,q,m,c):
    t = np.linspace(0,25*np.pi,num=1000)
    prob_t = main(t,psi0,proj,B0,B,w,g,q,m,c)
    
    fig = plt.figure(figsize=(10,5))
    plt.suptitle("$|<+z|\psi(t)>|^2$")
    plt.xlabel("$t$")
    plt.ylabel("$|<+z|\psi(t)>|^2$")
    plt.plot(t,prob_t[0,0])
    plt.show()

def main_bloch(t,psi0,B0,B,w,g,q,m,c):
    """
    Takes in params and spits out (theta,phi) corresponding to state
    """
    # omegas
    [w0,w1] = params_to_omegas(B0,B,g,q,m,c)
    
    # psi(t)
    psi_t = psi(t,psi0,w0,w1,w)
    
    # top
    top = psi_t[0]
    polars = cmath.polar(top)
    thet = 2*np.arccos(polars[0])
    
    # bot
    bot = psi_t[1]
    bot *= np.exp(-1j*polars[1])
    phi = cmath.polar(bot)[1]
    
    return thet, phi




class Arrow3D(FancyArrowPatch):

    def __init__(self, xs, ys, zs, *args, **kwargs):
        FancyArrowPatch.__init__(self, (0, 0), (0, 0), *args, **kwargs)
        self._verts3d = xs, ys, zs

    def draw(self, renderer):
        xs3d, ys3d, zs3d = self._verts3d
        xs, ys, zs = proj3d.proj_transform(xs3d, ys3d, zs3d, renderer.M)
        self.set_positions((xs[0], ys[0]), (xs[1], ys[1]))
        FancyArrowPatch.draw(self, renderer)

def bloch_sphere(t,index,psi0,B0,B,w,g,q,m,c):
    """
    Plots bloch sphere at given
    """
    fig = plt.figure(figsize=(10,10))
    plt.suptitle(r"Bloch sphere visualization of $\uparrow$ state undergoing rabi oscillations ($B_0 = "+str(B0)+"$, $B = "+str(B)+"$, $\omega = "+str(w)+"$)",fontsize=15)
    ax = fig.gca(projection='3d')
    ax.set_ylabel("$y$",fontsize=15)
    ax.set_yticks([])
    ax.set_xlabel("$x$",fontsize=15)
    ax.set_xticks([])
    ax.set_zlabel("$z$",fontsize=15)
    ax.set_zticks([])

    # sphere
    u, v = np.mgrid[0:2*np.pi:100j, 0:np.pi:100j]
    x = np.cos(u)*np.sin(v)
    y = np.sin(u)*np.sin(v)
    z = np.cos(v)
    ax.plot_wireframe(x, y, z, color="r",alpha=0.1)

    # origin
    ax.scatter([0], [0], [0], color="g", s=100)
    
    # state
    thet, phi = main_bloch(t,psi0,B0,B,w,g,q,m,c)
    a = Arrow3D([0, np.sin(thet)*np.cos(phi)], [0, np.sin(thet)*np.sin(phi)], [0, np.cos(thet)], mutation_scale=20,
            lw=1, arrowstyle="-|>", color="k") 
    ax.add_artist(a)
    plt.savefig("images/rabi_bloch_sphere_"+str(index)+".png")
    plt.close()

def make_movie(tf,psi0,B0,B,w,g,q,m,c):
    """
    Makes bloch sphere animation
    NOT OPTIMIZED in the slightest
    be sure to have images folder in cwd
    """
    ts = np.linspace(0,tf,200)

    # make images in folder
    for i in range(len(ts)):
        bloch_sphere(ts[i],i,psi0,B0,B,w,g,q,m,c)
        
    import imageio
    images = []
    
    # make filenames array
    filenames = []
    for i in range(len(ts)):
        filenames.append("images/rabi_bloch_sphere_"+str(i)+".png")
        
    # make movie
    for filename in filenames:
        images.append(imageio.imread(filename))
    imageio.mimsave('bloch_sphere.gif', images, duration = 1/24)

