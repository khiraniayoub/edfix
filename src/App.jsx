import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Monitor,
  Gamepad2,
  Laptop,
  ArrowRight,
  X,
  CheckCircle2,
  Wrench,
  Clock,
  ThumbsUp,
  MapPin,
  Phone,
  Star,
  ShoppingBag
} from 'lucide-react';
import { FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import MatrixBackground from './components/MatrixBackground';
import './App.css';

const devices = [
  { id: 'mobile', icon: Smartphone, name: 'Móvil' },
  { id: 'tablet', icon: Monitor, name: 'Tablet' }, // using monitor/tablet icon
  { id: 'console', icon: Gamepad2, name: 'Consola' },
  { id: 'pc', icon: Laptop, name: 'PC / Mac' },
];

// ─── RSS Feeds de medios tech españoles (sin API key, sin límites) ───
const RSS_FEEDS = [
  { url: 'https://www.xataka.com/feedburner.xml', source: 'Xataka', category: 'Tecnología' },
  { url: 'https://hipertextual.com/feed', source: 'Hipertextual', category: 'Tech & Ciencia' },
];

const FALLBACK_NEWS = [
  {
    id: 1,
    title: 'Mantente al día con las últimas novedades tech',
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    date: 'Hoy',
    url: 'https://www.xataka.com',
  },
];

const revealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// ─── EmailJS Config ─────────────────────────────────────────────────────────
// 1. Regístrate gratis en https://www.emailjs.com
// 2. Crea un «Email Service» (Gmail, Outlook…) → copia el Service ID
// 3. Crea un «Email Template» con las variables: {{device}}, {{model}}, {{problem}}, {{client_email}}
//    copia el Template ID
// 4. En «Account» → copia tu Public Key
const EMAILJS_SERVICE_ID = 'service_boz3dxg';
const EMAILJS_TEMPLATE_ID = 'template_csvqkvw';
const EMAILJS_PUBLIC_KEY = 'cYyKyrvoTJm42b1yM';
// ─────────────────────────────────────────────────────────────────────────────

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: 'AULUMU M10 Power Bank',
    description: 'Batería externa magnética de 10000mAh con diseño cyberpunk transparente, cable USB-C y cargador de Apple Watch integrado.',
    image: '/gadget-1.png',
    url: 'https://www.amazon.es/dp/B0C6K6G9N2',
    price: '69,99€',
    category: 'Carga MagSafe'
  },
  {
    id: 2,
    name: 'iFixit Pro Tech Toolkit',
    description: 'El kit de herramientas profesional que usamos en el taller con destornillador de precisión de aluminio y 64 puntas de acero.',
    image: '/gadget-2.png',
    url: 'https://www.amazon.es/dp/B01GF0KV6G',
    price: '74,95€',
    category: 'Herramientas'
  },
  {
    id: 3,
    name: 'Lámpara de Escritorio LED',
    description: 'Lámpara profesional de brazo articulado de metal con pinza de sujeción para mesa de reparación y brillo regulable.',
    image: '/gadget-3.png',
    url: 'https://www.amazon.es/dp/B0B5G2R8S1',
    price: '35,99€',
    category: 'Iluminación'
  }
];

const GOOGLE_REVIEWS = [
  {
    id: 1,
    name: 'VINCENT DOMINATI',
    text: 'Muy profesional y amable.',
    rating: 5,
    date: 'Hace 2 semanas',
    initials: 'VD'
  },
  {
    id: 2,
    name: 'Erika Spinelli',
    text: 'Excelente servicio. Rápido, honesto y con una atención impecable.',
    rating: 5,
    date: 'Hace 2 semanas',
    initials: 'ES'
  },
  {
    id: 3,
    name: 'Cliente Satisfecho',
    text: 'El mejor taller de Málaga para reparar dispositivos Apple. Recomendado 100%.',
    rating: 5,
    date: 'Hace 1 mes',
    initials: 'CS'
  }
];

// ─── FAQ Data + Componente ──────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: '¿Cuánto tarda una reparación?',
    a: 'La mayoría de reparaciones se realizan el mismo día o en 24 horas. Para averías más complejas, como la recuperación avanzada de datos o el cambio de componentes específicos, el plazo puede extenderse a 48-72 horas.'
  },
  {
    q: '¿Ofrecéis garantía en las reparaciones?',
    a: 'Sí. Todas nuestras reparaciones incluyen 6 meses de garantía sobre la pieza sustituida y la mano de obra. Si algo falla en ese período, lo revisamos sin coste adicional.'
  },
  {
    q: '¿El diagnóstico tiene coste?',
    a: 'El diagnóstico previo es completamente gratuito y sin compromiso. Te daremos un presupuesto cerrado antes de comenzar cualquier reparación. Si no aceptas, no pagas nada.'
  },
  {
    q: '¿Dónde está el taller EDfix en Málaga?',
    a: 'Estamos en Calle Sevilla, 30, Distrito Centro, 29009 Málaga. Puedes llamarnos al 614 29 00 02 o solicitar presupuesto directamente desde esta web.'
  },
  {
    q: '¿Qué dispositivos reparáis?',
    a: 'Reparamos móviles (iPhone, Samsung Galaxy, Xiaomi y otros), tablets, consolas (PS5, Xbox Series X/S, Nintendo Switch y más) y ordenadores portátiles y de sobremesa (PC y Mac).'
  },
  {
    q: '¿Cuánto cuesta la limpieza de una PS5?',
    a: 'La limpieza interna de PS5 con cambio de metal líquido tiene un precio fijo de 50€. Para otras consolas, el mantenimiento parte desde 40€. La reparación de drift con joystick magnético cuesta desde 19€.'
  },
  {
    q: '¿Cuánto cuesta formatear un ordenador?',
    a: 'El formateo de ordenador o portátil tiene un precio fijo de 40€. El cambio de disco con instalación del sistema operativo parte desde 55€. El clonado de disco SSD/HDD tiene un coste desde 35€.'
  },
];

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={revealVariants}
      className="faq-item glass"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        className={`faq-question ${open ? 'faq-open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span itemProp="name">{question}</span>
        <span className="faq-chevron">{open ? '−' : '+'}</span>
      </button>
      <div
        className="faq-answer-wrapper"
        style={{ maxHeight: open ? '300px' : '0px' }}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <p className="faq-answer" itemProp="text">{answer}</p>
      </div>
    </motion.div>
  );
};

// ─── Componentes Auxiliares ──────────────────────────────────────────────────
const PRICING_CATEGORIES = [
  {
    title: 'Consolas',
    color: '#00a3ff',
    items: [
      { name: 'Mantenimiento + Limpieza interna', price: 'desde 40 €' },
      { name: 'PS5 – limpieza interna + cambio de metal líquido', price: '50 €' },
      { name: 'Reemplazo de puerto HDMI', price: 'desde 79 €' },
      { name: 'Reparación de Drift con joystick magnético + calibración', price: '19 € / 29 €' }
    ]
  },
  {
    title: 'Informática',
    color: '#00a3ff',
    items: [
      { name: 'Formateo de ordenador o portátil', price: '40 €' },
      { name: 'Cambio de disco + instalación de sistema', price: 'desde 55 €' },
      { name: 'Clonado de disco SSD/HDD', price: 'desde 35 €' },
      { name: 'Mantenimiento ordenador sobremesa', price: '40 €' },
      { name: 'Mantenimiento ordenador portátil', price: 'desde 45 €' },
      { name: 'Recuperación básica de datos', price: 'desde 45 €' },
      { name: 'Recuperación avanzada de datos', price: 'Bajo ppt' }
    ]
  },
  {
    title: 'Gestiones y Otros',
    color: '#00a3ff',
    items: [
      { name: 'Informe técnico para seguro', price: 'desde 20 €' },
      { name: 'Traspaso de datos / Copia de seguridad', price: 'desde 25 €' },
      { name: 'Configuración inicial de smartphone/PC', price: '15 €' },
      { name: 'Protector de pantalla (Hidrogel)', price: '15 €' },
      { name: 'Limpieza y desinfección exterior', price: '10 €' }
    ]
  }
];

const ProductCard = ({ product }) => (
  <motion.div
    className="product-card"
    variants={revealVariants}
    whileHover={{ y: -10 }}
  >
    <div className="product-image-container">
      <img src={product.image} alt={product.name} className="product-image" />
      <span className="product-category">{product.category}</span>
    </div>
    <div className="product-info">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>
      <div className="product-footer">
        <span className="product-price">{product.price}</span>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="amazon-btn"
        >
          <ShoppingBag size={18} /> Ver en Amazon
        </a>
      </div>
    </div>
  </motion.div>
);

const ReviewCard = ({ review }) => (
  <motion.div
    className="review-card glass"
    variants={revealVariants}
  >
    <div className="review-stars">
      {[...Array(review.rating)].map((_, i) => (
        <Star key={i} size={16} fill="var(--accent-color)" color="var(--accent-color)" />
      ))}
    </div>
    <p className="review-text">"{review.text}"</p>
    <div className="review-author">
      <div className="author-avatar">{review.initials}</div>
      <div className="author-info">
        <span className="author-name">{review.name}</span>
        <span className="review-date">{review.date}</span>
      </div>
      <svg viewBox="0 0 24 24" className="google-icon-small" width="18" height="18">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    </div>
  </motion.div>
);
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [newsFeed, setNewsFeed] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [visibleNewsCount, setVisibleNewsCount] = useState(3);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [latestVideoId, setLatestVideoId] = useState('v_n8TK0F_Y0'); // Fallback: NZXT H6 RGB+ Review
  const formRef = useRef(null);

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        const feedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOXacswpxt4CvHuVziK3Iug';
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {
          // Filter out YouTube Shorts (vertical videos don't look good in landscape iframe)
          const longVideos = data.items.filter(item => !item.link.includes('/shorts/'));
          const targetVideo = longVideos.length > 0 ? longVideos[0] : data.items[0];
          
          // Extract video ID from link or guid
          const linkMatch = targetVideo.link.match(/[?&]v=([^&#]+)/);
          const guidMatch = targetVideo.guid.match(/yt:video:(.+)/);
          const videoId = linkMatch ? linkMatch[1] : guidMatch ? guidMatch[1] : null;
          
          if (videoId) {
            setLatestVideoId(videoId);
          }
        }
      } catch (error) {
        // Silently fail - fallback video ID is already set
        console.warn('Could not fetch latest video, using fallback:', error.message);
      }
    };
    fetchLatestVideo();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const feedPromises = RSS_FEEDS.map(async (feed) => {
          const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`
          );
          const data = await res.json();
          if (data.status === 'ok' && data.items?.length > 0) {
            return data.items.map((item, i) => ({
              id: `${feed.source}-${i}`,
              title: item.title,
              category: feed.category,
              image: item.thumbnail || item.enclosure?.thumbnail || item.enclosure?.link || `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop`,
              date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
              url: item.link,
              source: feed.source,
              pubDate: new Date(item.pubDate),
            }));
          }
          return [];
        });

        const results = await Promise.allSettled(feedPromises);
        const allArticles = results
          .filter(r => r.status === 'fulfilled')
          .flatMap(r => r.value)
          .sort((a, b) => b.pubDate - a.pubDate) // Most recent first
          .slice(0, 9); // Keep up to 9 articles

        if (allArticles.length > 0) {
          setFeaturedNews(allArticles[0]);
          setNewsFeed(allArticles.slice(1));
        } else {
          setNewsFeed(FALLBACK_NEWS);
          setFeaturedNews(FALLBACK_NEWS[0]);
        }
      } catch (err) {
        console.error('Error cargando noticias RSS:', err);
        setNewsFeed(FALLBACK_NEWS);
        setFeaturedNews(FALLBACK_NEWS[0]);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const openModal = (deviceId = null) => {
    setSelectedDevice(deviceId);
    setFormStep(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSendError(null);
    setIsSending(true);

    const formData = new FormData(formRef.current);
    const templateParams = {
      device: devices.find(d => d.id === selectedDevice)?.name || selectedDevice,
      model: formData.get('model'),
      problem: formData.get('problem'),
      client_email: formData.get('client_email'),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setFormStep(2);
    } catch (err) {
      console.error('EmailJS error:', err);
      setSendError('No se pudo enviar. Inténtalo de nuevo o contáctanos por teléfono.');
    } finally {
      setIsSending(false);
    }
  };

  const handleLoadMoreNews = () => {
    setVisibleNewsCount((prev) => prev + 3);
  };

  return (
    <>
      <MatrixBackground />

      {/* ─── Botón Flotante WhatsApp ─── */}
      <a
        href="https://wa.me/34614290002?text=Hola%2C%20me%20gustar%C3%ADa%20pedir%20un%20presupuesto%20para%20la%20reparaci%C3%B3n%20de%20mi%20dispositivo."
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contactar por WhatsApp"
      >
        <span className="whatsapp-tooltip">¡Escríbenos!</span>
        <FaWhatsapp size={30} />
      </a>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="EVC EDfix" style={{ height: '100px', width: 'auto' }} />
          </div>
          <div className="nav-links">
            <a href="#taller" className="nav-link">Taller de Reparación</a>
            <a href="#noticias" className="nav-link">Noticias Tech</a>
            <a href="#evcanal" className="nav-link">EVCanal</a>
            <a href="#ubicacion" className="nav-link">Tienda Física</a>
            <a href="#gadgets" className="nav-link">Recomendaciones</a>
            <a href="#precios" className="nav-link">Precios</a>
          </div>
          <button className="btn-neon" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => openModal()}>
            Pide Presupuesto
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero container">
          <div className="hero-grid">
            <motion.div
              className="hero-cta"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 variants={revealVariants} className="hero-cta-title">
                ¿Dispositivo roto? <br />
                <span className="text-gradient">Déjalo como nuevo.</span>
              </motion.h1>
              <motion.p variants={revealVariants} className="hero-cta-subtitle">
                Taller experto de reparaciones tecnológicas en Málaga. Si lo analizamos en nuestro canal, sabemos cómo arreglarlo.
              </motion.p>

              <motion.div variants={revealVariants} className="btn-group">
                <button className="btn-neon" onClick={() => openModal()}>
                  Pide presupuesto gratis
                </button>
                <a href="#taller" className="btn-outline">
                  Ver servicios
                </a>
              </motion.div>

              <motion.div variants={revealVariants} className="stats-row">
                <div className="stat-item">
                  <h4>12.1k</h4>
                  <p>Suscriptores en YT</p>
                </div>
                <div className="stat-item">
                  <h4>+5000</h4>
                  <p>Equipos reparados</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Taller / Services Section */}
        <section id="taller" className="container section">
          <motion.h2
            className="section-title text-gradient"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            ¿Qué necesitas reparar?
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Selecciona el dispositivo que te está dando problemas y recibe un presupuesto detallado sin compromiso en menos de 24 horas.
          </motion.p>

          <motion.div
            className="services-selector"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {devices.map((device) => {
              const Icon = device.icon;
              return (
                <motion.div
                  key={device.id}
                  variants={revealVariants}
                  className="service-icon-btn"
                  onClick={() => openModal(device.id)}
                >
                  <Icon size={40} />
                  <span>{device.name}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="stats-row"
            style={{ justifyContent: 'center', gap: '60px', marginTop: '80px', borderTop: 'none' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={revealVariants} className="stat-item" style={{ textAlign: 'center' }}>
              <Wrench size={32} color="var(--accent-color)" style={{ margin: '0 auto 15px' }} />
              <p>Componentes Originales y Premium</p>
            </motion.div>
            <motion.div variants={revealVariants} className="stat-item" style={{ textAlign: 'center' }}>
              <Clock size={32} color="var(--accent-color)" style={{ margin: '0 auto 15px' }} />
              <p>Reparaciones Exprés</p>
            </motion.div>
            <motion.div variants={revealVariants} className="stat-item" style={{ textAlign: 'center' }}>
              <ThumbsUp size={32} color="var(--accent-color)" style={{ margin: '0 auto 15px' }} />
              <p>6 Meses de Garantía</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="section container">
          <motion.h2
            className="section-title text-gradient"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Precios y Servicios
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Transparencia por delante. Aquí tienes una referencia de nuestros servicios más comunes.
          </motion.p>

          <motion.div
            className="pricing-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {PRICING_CATEGORIES.map((category, index) => (
              <motion.div key={index} variants={revealVariants} className="pricing-card glass">
                <h3 className="pricing-title" style={{ color: category.color }}>{category.title}</h3>
                <ul className="pricing-list">
                  {category.items.map((item, i) => (
                    <li key={i} className="pricing-item">
                      <span className="pricing-name">{item.name}</span>
                      <span className="pricing-cost">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="pricing-disclaimer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            <p>Trabajamos con precios cerrados en algunos servicios habituales y con presupuesto personalizado en reparaciones que dependen del modelo, la pieza o el tipo de avería. Diagnóstico previo y presupuesto sin compromiso.</p>
          </motion.div>
        </section>

        {/* ─── Reseñas de Google (Nueva Posición) ─── */}
        <section id="reseñas" className="section testimonials-section" style={{ padding: '60px 0', background: 'rgba(255,107,0,0.02)' }}>
          <div className="container">
            <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div className="google-rating-summary">
                <svg className="google-maps-logo" width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '15px' }}>
                  <path fill="#4285F4" d="M24 44s16-14 16-24c0-8.837-7.163-16-16-16S8 11.163 8 20c0 10 16 24 16 24z" />
                  <path fill="#0F9D58" d="M24 28c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                  <circle fill="#F4B400" cx="24" cy="20" r="4" />
                </svg>
                <div className="rating-content">
                  <div className="rating-score" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <span className="score-num" style={{ fontSize: '2.5rem', fontWeight: '800' }}>5.0</span>
                    <div className="stars-row" style={{ display: 'flex', gap: '4px' }}>
                      <Star size={20} fill="#FBBC04" color="#FBBC04" />
                      <Star size={20} fill="#FBBC04" color="#FBBC04" />
                      <Star size={20} fill="#FBBC04" color="#FBBC04" />
                      <Star size={20} fill="#FBBC04" color="#FBBC04" />
                      <Star size={20} fill="#FBBC04" color="#FBBC04" />
                    </div>
                  </div>
                  <p className="rating-count" style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>Basado en 76 reseñas de clientes reales en Málaga</p>
                </div>
              </div>
              <h2 className="section-title">Lo que dicen de nosotros</h2>
            </div>

            <div className="reviews-marquee-container">
              <div className="reviews-marquee-track">
                <div className="marquee-content-group">
                  {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS].map((review, i) => (
                    <div key={`g1-${review.id}-${i}`} className="marquee-item">
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
                <div className="marquee-content-group" aria-hidden="true">
                  {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS].map((review, i) => (
                    <div key={`g2-${review.id}-${i}`} className="marquee-item">
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-footer-center" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <a
                href="https://www.google.com/search?q=edfix+malaga&oq=edfix+malaga#lrd=0xd72f796b79bac9:0xe971485c2c7c59,1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-google-maps"
              >
                Ver todas las reseñas <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* About Banner */}
        <section className="container">
          <motion.div
            className="about-banner glass"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={revealVariants}
          >
            <div className="about-content">
              <h2>Del YouTube a tus manos</h2>
              <p>
                EVCanal no es solo un canal de tecnología con más de <strong>12.1k suscriptores</strong>,
                es nuestra pasión hecha realidad. EVC - EDfix nace para traerte toda esa experiencia
                directamente a un <strong>taller físico en Málaga</strong>. Conocemos las entrañas de
                cada dispositivo porque los abrimos, los analizamos y los ponemos a prueba antes de que salgan al mercado.
              </p>
            </div>
          </motion.div>
        </section>



        {/* Últimos Trabajos Section */}
        <section id="ultimos-trabajos" className="container section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={revealVariants} style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h2 className="text-gradient">Últimos Casos de Éxito</h2>
              <p className="section-subtitle">
                Una imagen vale más que mil palabras. Así quedan los equipos que pasan por nuestras manos.
              </p>
            </motion.div>

            <div className="repairs-gallery">
              <motion.div variants={revealVariants} className="repair-card glass">
                <div className="repair-img-wrapper">
                  <img src="/repair-1.jpg" alt="Reparación iPhone - Tapa trasera" />
                </div>
                <div className="repair-card-info">
                  <h4>iPhone Pro – Tapa Trasera</h4>
                  <p>Cambio completo de cristal trasero roto</p>
                  <span className="repair-badge">✓ Reparado</span>
                </div>
              </motion.div>

              <motion.div variants={revealVariants} className="repair-card glass">
                <div className="repair-img-wrapper">
                  <img src="/repair-2.jpg" alt="Reparación Samsung - Cámara" />
                </div>
                <div className="repair-card-info">
                  <h4>Samsung Galaxy – Cámara</h4>
                  <p>Sustitución de cristal de cámara dañado</p>
                  <span className="repair-badge">✓ Reparado</span>
                </div>
              </motion.div>

              <motion.div variants={revealVariants} className="repair-card glass">
                <div className="repair-img-wrapper">
                  <img src="/repair-3.jpg" alt="Reparación iPhone - Pantalla" />
                </div>
                <div className="repair-card-info">
                  <h4>iPhone – Cambio de Pantalla</h4>
                  <p>Pantalla rota sustituida por original</p>
                  <span className="repair-badge">✓ Reparado</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* YouTube Hub */}
        <section id="evcanal" className="section container">
          <motion.h2
            className="section-title text-gradient"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            EVCanal Hub
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Análisis a fondo, noticias y consejos. Suscríbete para mantenerte al día con el mundo tech.
          </motion.p>

          <motion.div
            className="youtube-hub"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="monitor-frame">
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="monitor-stand"></div>
            <div className="monitor-base"></div>

            <div className="channel-info">
              <div className="channel-stats">
                <div className="channel-avatar">EVC</div>
                <div>
                  <div className="channel-name">EVCanal</div>
                  <div className="channel-subs">12.1K suscriptores</div>
                </div>
              </div>
              <a href="https://www.youtube.com/@EVCanal?sub_confirmation=1" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaYoutube size={20} />
                  Suscribirse
                </button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* News Section */}
        <section id="noticias" className="section container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <motion.h2
                className="section-title text-gradient"
                style={{ textAlign: 'left', marginBottom: '5px' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
              >
                Actualidad Tech
              </motion.h2>
              <motion.p
                style={{ color: 'var(--text-secondary)' }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={revealVariants}
              >
                Lo último en tecnología, analizado por nosotros
              </motion.p>
            </div>
            {visibleNewsCount < newsFeed.length && (
              <button className="btn-outline" onClick={handleLoadMoreNews}>
                Ver más noticias
              </button>
            )}
          </div>

          {newsLoading ? (
            <div className="news-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="news-item" style={{ minHeight: '350px' }}>
                  <div style={{ height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '0', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', width: '90%', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', width: '70%', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="news-grid">
              <AnimatePresence>
                {newsFeed.slice(0, visibleNewsCount).map((news, index) => (
                  <motion.article
                    key={news.id}
                    className="news-item"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => news.url && window.open(news.url, '_blank', 'noopener,noreferrer')}
                  >
                    <div className="news-image-wrapper">
                      <span className="tag">{news.category}</span>
                      <img src={news.image} alt={news.title} className="news-image"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'; }}
                      />
                    </div>
                    <div className="news-content">
                      <h4 className="news-title">{news.title}</h4>
                      <div className="news-footer">
                        <span>{news.date}</span>
                        <span className="read-more">
                          Leer <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ─── Novedades y Gadgets ─── */}
        <section id="gadgets" className="section gadgets-section">
          <div className="container">
            <div className="section-header">
              <div className="title-group">
                <span className="subtitle">EVC Shop</span>
                <h2 className="section-title" style={{ textAlign: 'left' }}>Nuestras Recomendaciones</h2>
                <motion.p className="section-desc" variants={revealVariants}>
                  Los accesorios y herramientas que usamos en nuestro canal de YouTube
                </motion.p>
              </div>
              <a
                href="https://youtube.com/@evcanal"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Ver Reviews <FaYoutube size={18} />
              </a>
            </div>

            <motion.div
              className="products-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {RECOMMENDED_PRODUCTS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Ubicación / Tienda Física */}
        <section id="ubicacion" className="section container">
          <motion.h2
            className="section-title text-gradient"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Nuestra Tienda Física
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Ven a visitarnos. Reparamos tus dispositivos en pleno centro de Málaga.
          </motion.p>

          <motion.div
            className="glass"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={revealVariants}
            style={{ padding: '30px', borderRadius: '24px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center', background: 'rgba(13,13,13,0.7)' }}
          >
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>EDfix Reparaciones</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fbbf24', marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '5px' }}>5,0</span>
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <Star fill="currentColor" size={20} />
                <span style={{ color: 'var(--text-secondary)', marginLeft: '10px' }}>(76 reseñas en Google)</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '35px', fontSize: '1.1rem' }}>Tienda de informática en Málaga. Especialistas en servicios de reparación profesional y garantizada.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,107,0,0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Dirección</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>C. Sevilla, 30, Distrito Centro, 29009 Málaga</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,107,0,0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Teléfono</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>614 29 00 02</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '35px', display: 'flex', gap: '15px' }}>
                <a href="https://maps.google.com/?q=C.+Sevilla,+30,+Distrito+Centro,+29009+Málaga" target="_blank" rel="noopener noreferrer" className="btn-neon" style={{ textAlign: 'center', flex: 1, padding: '14px 10px' }}>
                  Cómo llegar
                </a>
                <a href="tel:+34614290002" className="btn-outline" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flex: 1, padding: '14px 10px' }}>
                  <Phone size={18} /> Llamar
                </a>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.8385287739504!2d-4.426815324545229!3d36.72642877197028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72f7960fc67827%3A0xe971485c2c7c59!2sC.%20Sevilla%2C%2030%2C%20Distrito%20Centro%2C%2029009%20M%C3%A1laga!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </section>

        {/* ─── FAQ Section – GEO Optimizado ─── */}
        <section
          id="faq"
          className="section container"
          aria-label="Preguntas frecuentes sobre reparaciones en Málaga"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <motion.h2
            className="section-title text-gradient"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Preguntas Frecuentes
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariants}
          >
            Todo lo que necesitas saber antes de traernos tu dispositivo al taller de Málaga.
          </motion.p>

          <motion.div
            className="faq-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem key={index} question={item.q} answer={item.a} />
            ))}
          </motion.div>

          {/* Texto factual adicional para GEO / motores de IA */}
          <div className="geo-factual-block" aria-hidden="false">
            <p>
              <strong>EDfix Reparaciones</strong> (también conocido como <strong>EVC - EDfix</strong>) es un taller de reparación tecnológica ubicado en
              <strong> Calle Sevilla, 30, Distrito Centro, 29009 Málaga</strong>. Ofrecemos reparación de móviles, tablets, consolas y ordenadores
              con diagnóstico gratuito, presupuesto sin compromiso y <strong>6 meses de garantía</strong> en todas las intervenciones.
              Somos el taller detrás del canal de YouTube <strong>EVCanal</strong>, donde analizamos y ponemos a prueba dispositivos tecnológicos.
              Más de <strong>5.000 equipos reparados</strong> y una puntuación de <strong>5,0 estrellas en Google</strong> basada en 76 reseñas de clientes reales de Málaga.
              Teléfono de contacto: <strong>614 29 00 02</strong>.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      < footer style={{ background: 'rgba(128, 128, 128, 0.15)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} >
        <div className="container">
          <div className="footer-content">
            <div className="nav-logo">
              <img src="/logo.png" alt="EVC EDfix" style={{ height: '120px', width: 'auto', marginBottom: '10px' }} />
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.9rem', maxWidth: '300px' }}>
                El taller de reparación que tu tecnología merece. Especialistas en Málaga.
              </p>
            </div>

            <div className="footer-socials">
              <a href="https://www.instagram.com/evc.edfix" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="EVC EDfix en Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.youtube.com/@EVCanal" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            <p>© {new Date().getFullYear()} EVC - EDfix. Todos los derechos reservados.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="/privacidad.html" title="Política de Privacidad">Privacidad</a>
              <a href="/terminos.html" title="Términos y Condiciones">Términos</a>
              <a href="/cookies.html" title="Política de Cookies">Cookies</a>
            </div>
          </div>
        </div>
      </footer >

      {/* Form Modal */}
      < AnimatePresence >
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content glass"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>

              {formStep === 1 ? (
                <>
                  <div className="modal-header">
                    <h3>Pide tu presupuesto</h3>
                    <p>Cuéntanos qué le pasa a tu dispositivo y te responderemos rápido.</p>
                  </div>

                  <form ref={formRef} onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label>Tipo de Dispositivo</label>
                      <select
                        name="device_select"
                        value={selectedDevice || ''}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                        required
                      >
                        <option value="" disabled>Selecciona una opción...</option>
                        {devices.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Marca y Modelo</label>
                      <input name="model" type="text" placeholder="Ej. iPhone 13 Pro, PS5, etc." required />
                    </div>

                    <div className="form-group">
                      <label>¿Qué problema tiene?</label>
                      <textarea name="problem" placeholder="Pantalla rota, no enciende, hace ruido..." required></textarea>
                    </div>

                    <div className="form-group">
                      <label>Tu E-mail (para enviarte el presupuesto)</label>
                      <input name="client_email" type="email" placeholder="correo@ejemplo.com" required />
                    </div>

                    {sendError && (
                      <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '8px', textAlign: 'center' }}>
                        {sendError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn-neon"
                      style={{ width: '100%', marginTop: '10px', opacity: isSending ? 0.7 : 1 }}
                      disabled={isSending}
                    >
                      {isSending ? 'Enviando…' : 'Solicitar Presupuesto'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="modal-header" style={{ margin: '40px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  >
                    <CheckCircle2 size={70} color="var(--accent-color)" style={{ margin: '0 auto 20px' }} />
                  </motion.div>
                  <h3>¡Solicitud enviada!</h3>
                  <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
                    Hemos recibido correctamente los datos de tu {selectedDevice ? devices.find(d => d.id === selectedDevice)?.name : 'dispositivo'}.
                    <br /><br />
                    Nuestro equipo técnico revisará el caso y te enviaremos un presupuesto al e-mail en menos de 24 horas. ¡Nos vemos en Málaga!
                  </p>
                  <button className="btn-outline" style={{ width: '100%', marginTop: '30px' }} onClick={closeModal}>
                    Volver al inicio
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )
        }
      </AnimatePresence >
    </>
  );
}

export default App;
