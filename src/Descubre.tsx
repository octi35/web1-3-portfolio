import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, Atom, FileCode2, Zap, Wind, Boxes, PenTool } from 'lucide-react';

const TECNOLOGIAS = [
  { icon: Atom,      nombre: 'React 19',           desc: 'Componentes interactivos y estado reactivo para el carrusel y las animaciones.' },
  { icon: FileCode2, nombre: 'TypeScript',         desc: 'Tipado estático que evita errores y hace el código mantenible.' },
  { icon: Zap,       nombre: 'Vite',               desc: 'Build ultrarrápido con recarga instantánea durante el desarrollo.' },
  { icon: Wind,      nombre: 'Tailwind CSS 4',     desc: 'Estilos utilitarios para maquetar rápido y de forma consistente.' },
  { icon: Boxes,     nombre: 'CSS 3D Transforms',  desc: 'Perspective, rotateX/Y y preserve-3d: la profundidad que estás viendo ahora.' },
  { icon: PenTool,   nombre: 'Diseño en Figma',    desc: 'Prototipado visual de la interfaz antes de escribir una línea de código.' },
];

const EMAIL = 'octifaki@gmail.com';
const TEL = '5493512294285';
const TEL_DISPLAY = '+54 9 351 229-4285';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function Descubre() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 cuando el borde superior entra por abajo, 1 cuando recorrió ~85% del viewport
        setProgress(clamp01((vh - r.top) / (vh * 0.85)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // El título "cae" en 3D desde atrás a medida que se scrollea
  const tituloP = clamp01(progress / 0.45);
  const contactoP = clamp01((progress - 0.55) / 0.45);

  return (
    <section
      id="descubre"
      ref={sectionRef}
      style={{
        background: '#101014',
        color: 'white',
        fontFamily: "'Inter', sans-serif",
        padding: isMobile ? '72px 20px 56px' : '110px 64px 80px',
        position: 'relative',
        overflow: 'hidden',
        perspective: '1200px',
      }}
    >
      {/* Ghost text de fondo con parallax */}
      <div aria-hidden style={{ position: 'absolute', top: 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none' }}>
        <span style={{
          fontFamily: "'Anton', sans-serif", fontSize: 'clamp(80px, 22vw, 300px)', fontWeight: 900,
          color: 'rgba(255,255,255,0.04)', lineHeight: 1, textTransform: 'uppercase', whiteSpace: 'nowrap',
          transform: `translateY(${(1 - progress) * 120}px)`,
        }}>
          BEHIND
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

        {/* Título con entrada 3D */}
        <div style={{ perspective: '900px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.24em', opacity: 0.5 * tituloP, margin: '0 0 10px', transform: `translateY(${(1 - tituloP) * 20}px)` }}>
            DETRÁS DE ESCENA
          </p>
          <h2 style={{
            fontFamily: "'Anton', sans-serif", fontSize: isMobile ? 38 : 64, lineHeight: 1.05,
            textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 14px',
            transformOrigin: 'center bottom', transformStyle: 'preserve-3d',
            transform: `rotateX(${(1 - tituloP) * 55}deg) translateY(${(1 - tituloP) * 40}px)`,
            opacity: tituloP,
          }}>
            ¿Con qué se hacen<br />estas páginas?
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, opacity: 0.6 * tituloP, lineHeight: 1.7, maxWidth: 560, margin: '0 0 56px', transform: `translateY(${(1 - tituloP) * 30}px)` }}>
            Cada animación, cada transición y cada efecto de profundidad que viste arriba
            está construido con estas tecnologías web modernas.
          </p>
        </div>

        {/* Grid de tarjetas 3D */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 16 : 22,
          perspective: '1400px',
        }}>
          {TECNOLOGIAS.map((t, i) => {
            // Entrada escalonada: cada tarjeta gira desde un plano 3D al scrollear
            const cardP = clamp01((progress - 0.18 - i * 0.07) / 0.4);
            return <TiltCard key={t.nombre} tec={t} entrada={cardP} />;
          })}
        </div>

        {/* Contacto */}
        <div style={{
          marginTop: isMobile ? 64 : 96,
          textAlign: 'center',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${(1 - contactoP) * 35}deg) translateY(${(1 - contactoP) * 50}px)`,
          transformOrigin: 'center bottom',
          opacity: contactoP,
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.24em', opacity: 0.5, margin: '0 0 10px' }}>
            ¿QUERÉS UNA PÁGINA ASÍ?
          </p>
          <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: isMobile ? 30 : 48, textTransform: 'uppercase', margin: '0 0 28px', letterSpacing: '-0.01em' }}>
            Hablemos
          </h3>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 14 : 24, justifyContent: 'center', alignItems: 'center' }}>
            <ContactLink href={`mailto:${EMAIL}`} icon={<Mail size={18} />} text={EMAIL} />
            <ContactLink href={`https://wa.me/${TEL}`} icon={<Phone size={18} />} text={TEL_DISPLAY} />
          </div>
          <p style={{ fontSize: 11, opacity: 0.35, marginTop: 48, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            TOONHUB · por Octavio Fakiani
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── helpers ── */

function TiltCard({ tec, entrada }: { tec: typeof TECNOLOGIAS[number]; entrada: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  const Icon = tec.icon;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -14,
      y: ((e.clientX - r.left) / r.width - 0.5) * 14,
    });
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        background: 'rgba(255,255,255,0.045)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 18,
        padding: '26px 24px',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center bottom',
        transform: `rotateX(${(1 - entrada) * 65 + tilt.x}deg) rotateY(${tilt.y}deg) translateY(${(1 - entrada) * 70}px) scale(${hov ? 1.03 : 1})`,
        opacity: entrada,
        transition: 'transform 200ms ease-out, box-shadow 200ms, background-color 200ms',
        boxShadow: hov ? '0 24px 50px rgba(0,0,0,0.45)' : '0 8px 24px rgba(0,0,0,0.25)',
        cursor: 'default',
        willChange: 'transform, opacity',
      }}
    >
      <div style={{ transform: 'translateZ(30px)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon size={22} strokeWidth={2} />
        </div>
        <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.01em' }}>{tec.nombre}</h4>
        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.6, margin: 0 }}>{tec.desc}</p>
      </div>
    </div>
  );
}

function ContactLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '14px 26px', borderRadius: 999,
        border: '1.5px solid rgba(255,255,255,0.25)',
        background: hov ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
        color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 600,
        transform: hov ? 'translateY(-3px) scale(1.03)' : 'none',
        transition: 'transform 180ms ease-out, background-color 180ms',
      }}
    >
      {icon}
      {text}
    </a>
  );
}
