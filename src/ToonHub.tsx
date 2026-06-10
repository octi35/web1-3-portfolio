import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PERSONAJES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', nombre: 'IGNIS',  edicion: 'Edición Fuego',  num: '01' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', nombre: 'SYLVA',  edicion: 'Edición Bosque', num: '02' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', nombre: 'SAKURA', edicion: 'Edición Flor',   num: '03' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', nombre: 'AQUA',   edicion: 'Edición Océano', num: '04' },
];

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`;

const TRANS = 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)';

type Dir = 'next' | 'prev';
type Role = 'center' | 'left' | 'right' | 'back';

export default function ToonHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const lockRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    PERSONAJES.forEach(({ src }) => { const i = new Image(); i.src = src; });
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => () => { if (lockRef.current) clearTimeout(lockRef.current); }, []);

  const startLock = () => {
    setIsAnimating(true);
    lockRef.current = setTimeout(() => setIsAnimating(false), 650);
  };

  const navigate = (dir: Dir) => {
    if (isAnimating) return;
    startLock();
    setActiveIndex(p => dir === 'next' ? (p + 1) % 4 : (p + 3) % 4);
  };

  const goTo = (i: number) => {
    if (isAnimating || i === activeIndex) return;
    startLock();
    setActiveIndex(i);
  };

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const onMouseLeave = useCallback(() => setMouse({ x: 0.5, y: 0.5 }), []);

  const roleOf = (i: number): Role => {
    if (i === activeIndex)          return 'center';
    if (i === (activeIndex + 3) % 4) return 'left';
    if (i === (activeIndex + 1) % 4) return 'right';
    return 'back';
  };

  const itemStyle = (role: Role): React.CSSProperties => {
    const base: React.CSSProperties = { position: 'absolute', aspectRatio: '0.6 / 1', transition: TRANS, willChange: 'transform, filter, opacity' };
    switch (role) {
      case 'center': return { ...base, transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`, filter: 'none', opacity: 1, zIndex: 20, left: '50%', height: isMobile ? '60%' : '92%', bottom: isMobile ? '22%' : 0 };
      case 'left':   return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
      case 'right':  return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%', height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' };
      case 'back':   return { ...base, transform: 'translateX(-50%) scale(1)', filter: 'blur(4px)', opacity: 1,    zIndex: 5,  left: '50%', height: isMobile ? '13%' : '22%', bottom: isMobile ? '32%' : '12%' };
    }
  };

  const tiltX = (mouse.y - 0.5) * -8;
  const tiltY = (mouse.x - 0.5) * 10;
  const cur = PERSONAJES[activeIndex];

  return (
    <div style={{ backgroundColor: cur.bg, transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)', fontFamily: "'Inter', sans-serif" }} className="relative w-full overflow-hidden">
      <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ height: '100vh', position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/* Grain */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, backgroundImage: GRAIN, backgroundSize: '200px 200px', opacity: 0.4 }} />

        {/* Background orbs */}
        <Orb size={150} top="6%"  left="3%"  anim="drift-a 13s ease-in-out infinite"        opacity={0.09} shape="circle"  />
        <Orb size={90}  top="18%" right="5%" anim="drift-b 10s ease-in-out -3s infinite"     opacity={0.10} shape="circle"  />
        <Orb size={60}  top="65%" left="6%"  anim="drift-c 11s ease-in-out -6s infinite"     opacity={0.10} shape="diamond" />
        <Orb size={50}  top="12%" left="42%" anim="drift-a 15s ease-in-out -8s infinite"     opacity={0.07} shape="diamond" />
        <Orb size={75}  top="72%" right="7%" anim="drift-b 12s ease-in-out -2s infinite"     opacity={0.08} shape="circle"  />
        <Orb size={35}  top="38%" left="12%" anim="drift-c 9s ease-in-out -4s infinite"      opacity={0.12} shape="circle"  />

        {/* Ghost text */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '18%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', zIndex: 2 }}>
          <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(90px, 28vw, 380px)', fontWeight: 900, color: 'white', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            FIGURA 3D
          </span>
        </div>

        {/* Top-left brand */}
        <div style={{ position: 'absolute', top: 24, left: isMobile ? 16 : 32, zIndex: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'white', opacity: 0.9, letterSpacing: '0.18em' }}>TOONHUB</div>
          <div style={{ fontSize: 10, color: 'white', opacity: 0.5, letterSpacing: '0.12em', marginTop: 2 }}>por Octavio Fakiani</div>
        </div>

        {/* Top-right counter */}
        {!isMobile && (
          <div style={{ position: 'absolute', top: 20, right: 40, zIndex: 60, display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <div style={{ overflow: 'hidden', height: 52, display: 'flex', alignItems: 'flex-end' }}>
              <span key={`c-${activeIndex}`} style={{ fontFamily: "'Anton', sans-serif", fontSize: 48, color: 'white', lineHeight: 1, display: 'block', animation: 'counter-in 380ms cubic-bezier(0.4,0,0.2,1) both' }}>
                {cur.num}
              </span>
            </div>
            <span style={{ fontSize: 14, color: 'white', opacity: 0.45, fontWeight: 500 }}>/ 04</span>
          </div>
        )}

        {/* Carousel layer — ground glow + rings + figures share stacking context */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>

          {/* Ground shadow */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: isMobile ? '20%' : '1%', zIndex: 18, pointerEvents: 'none' }}>
            <div style={{ width: isMobile ? 180 : 320, height: isMobile ? 30 : 60, background: 'rgba(0,0,0,0.3)', filter: 'blur(28px)', borderRadius: '50%', animation: 'pulse-shadow 3.2s ease-in-out infinite' }} />
          </div>

          {/* Orbiting rings (desktop) */}
          {!isMobile && (
            <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%,-50%)', zIndex: 17, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', width: 340, height: 340, left: -170, top: -170, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.22)', animation: 'spin-ring 10s linear infinite' }}>
                <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: '50%', background: 'white', opacity: 0.8, boxShadow: '0 0 10px rgba(255,255,255,0.9)' }} />
              </div>
              <div style={{ position: 'absolute', width: 500, height: 500, left: -250, top: -250, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.11)', animation: 'spin-ring-rev 18s linear infinite' }}>
                <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: 'white', opacity: 0.45 }} />
              </div>
            </div>
          )}

          {/* Figures */}
          {PERSONAJES.map((p, i) => {
            const role = roleOf(i);
            return (
              <div key={i} style={itemStyle(role)}>
                {role === 'center' ? (
                  <div style={{ width: '100%', height: '100%', animation: isAnimating ? 'none' : 'float 3.8s ease-in-out infinite' }}>
                    <div style={{ width: '100%', height: '100%', transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`, transition: 'transform 300ms ease-out', transformStyle: 'preserve-3d' }}>
                      <img src={p.src} alt={p.nombre} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
                    </div>
                  </div>
                ) : (
                  <img src={p.src} alt={p.nombre} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom center' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom-left UI */}
        <div style={{ position: 'absolute', bottom: isMobile ? 24 : 72, left: isMobile ? 16 : 96, zIndex: 60, maxWidth: 320 }}>
          <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: 'white', opacity: 0.55, letterSpacing: '0.22em', margin: '0 0 6px' }}>
            COLECCIÓN EXCLUSIVA
          </p>
          <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 4px', fontSize: isMobile ? 16 : 22, color: 'white', opacity: 0.95 }}>
            FIGURAS TOONHUB
          </p>
          <p key={`n-${activeIndex}`} style={{ fontSize: isMobile ? 12 : 14, color: 'white', opacity: 0.65, letterSpacing: '0.14em', textTransform: 'uppercase', margin: `0 0 ${isMobile ? 12 : 10}px`, animation: 'slide-up-in 420ms ease-out both' }}>
            {cur.nombre} · {cur.edicion}
          </p>
          {!isMobile && (
            <p style={{ fontSize: 13, color: 'white', opacity: 0.78, lineHeight: 1.65, margin: '0 0 20px' }}>
              Obra maestra impresa en 3D, lista para exhibir. El acabado es impecable y la calidad artesanal inigualable. ¡Pídela ahora!
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <NavBtn onClick={() => navigate('prev')} label="Anterior"><ArrowLeft size={26} strokeWidth={2.25} /></NavBtn>
            <NavBtn onClick={() => navigate('next')} label="Siguiente"><ArrowRight size={26} strokeWidth={2.25} /></NavBtn>
            <div style={{ display: 'flex', gap: 7, marginLeft: 8, alignItems: 'center' }}>
              {PERSONAJES.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{ width: i === activeIndex ? 22 : 8, height: 8, borderRadius: 4, background: 'white', opacity: i === activeIndex ? 0.95 : 0.3, border: 'none', cursor: 'pointer', padding: 0, transition: 'width 350ms cubic-bezier(0.4,0,0.2,1), opacity 350ms' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom-right CTA */}
        <div style={{ position: 'absolute', bottom: isMobile ? 24 : 72, right: isMobile ? 16 : 40, zIndex: 60 }}>
          <a href="#descubre" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Anton', sans-serif", fontSize: 'clamp(20px, 4vw, 56px)', color: 'white', opacity: 0.95, letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 200ms, gap 200ms' }}
            onClick={e => { e.preventDefault(); document.getElementById('descubre')?.scrollIntoView({ behavior: 'smooth' }); }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.gap = '16px'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.95'; e.currentTarget.style.gap = '8px'; }}>
            DESCÚBRELO
            <ArrowRight style={{ width: isMobile ? 20 : 32, height: isMobile ? 20 : 32, transform: 'rotate(90deg)', transition: 'transform 200ms' }} strokeWidth={2.25} />
          </a>
        </div>

      </div>
    </div>
  );
}

/* ── helpers ── */

function Orb({ size, top, left, right, anim, opacity, shape }: { size: number; top?: string; left?: string; right?: string; anim: string; opacity: number; shape: 'circle' | 'diamond' }) {
  return (
    <div style={{ position: 'absolute', width: size, height: size, top, left, right, zIndex: 1, pointerEvents: 'none', opacity, animation: anim }}>
      <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: shape === 'circle' ? '50%' : '12px', transform: shape === 'diamond' ? 'rotate(45deg)' : undefined }} />
    </div>
  );
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} aria-label={label} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid white', background: hov ? 'rgba(255,255,255,0.12)' : 'transparent', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: hov ? 'scale(1.08)' : 'scale(1)', transition: 'transform 150ms, background-color 150ms', padding: 0 }}>
      {children}
    </button>
  );
}
