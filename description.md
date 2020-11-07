Solutions to physical problems with time-dependent potentials are quite rare. In most cases, we resort to time-dependent perturbation theory to obtain an approximate answer, valid only at early times and for small potentials. 

One of the few exactly solvable problems is the two-level system with the Hamiltonian:
$$
\begin{align*}
H = 
\begin{pmatrix}
\frac{\hbar}{2}\omega_0 & \frac{\hbar}{2}\omega_1 e^{-i\omega t}\\
\frac{\hbar}{2}\omega_1 e^{i\omega t} & -\frac{\hbar}{2}\omega_0\\
\end{pmatrix}
\end{align*}
$$
This can be seen as coupling the magnetic moment $\vec{\mu}$ of a particle to an oscillating magnetic field $ \vec{B} = (B \space cos(\omega t),B \space sin(\omega t),B_0) $. As time carries on, the probability distribution of a particle initially in the spin-up state $\begin{pmatrix}a \\ b \end{pmatrix} = \begin{pmatrix}1 \\ 0 \end{pmatrix}$ will oscillate, coming back to its starting point at a time $t^* = \frac{2\pi mc}{geB}$. 

Remarkably, this system also admits a resonance frequency $\Omega = \frac{geB_0}{2mc}$ for which the particle will now go from having $P(\uparrow) = 1$ to $P(\downarrow) = 1$ -- there can be a zero probability to find the particle in its initial state!

Our simulation displays the proability over time of a particle being in a spin-up or spin-down state.