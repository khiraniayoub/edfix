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
import { FaYoutube, FaInstagram } from 'react-icons/fa';
import MatrixBackground from './components/MatrixBackground';
import './App.css';

const devices = [
  { id: 'mobile', icon: Smartphone, name: 'Móvil' },
  { id: 'tablet', icon: Monitor, name: 'Tablet' }, // using monitor/tablet icon
  { id: 'console', icon: Gamepad2, name: 'Consola' },
  { id: 'pc', icon: Laptop, name: 'PC / Mac' },
];

// ⚠️ Reemplaza con tu API key gratuita de https://gnews.io
const GNEWS_API_KEY = 'b37cdac48c6f087405916800ed0aef24';

const FALLBACK_NEWS = [
  {
    id: 1,
    title: 'Uber invierte 1.250 millones en Rivian para lanzar 50.000 robotaxis eléctricos',
    category: 'IA & Movilidad',
    image: '/news-robotaxi.png',
    date: 'Hoy',
    url: 'https://techcrunch.com',
  },
  {
    id: 2,
    title: 'Cómo cambiar la pasta térmica de tu PS5 paso a paso',
    category: 'Guías de Reparación',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop',
    date: 'Hace 5 horas',
    url: 'https://ifixit.com',
  },
  {
    id: 3,
    title: 'Samsung Galaxy Book6 Ultra llega con GPU RTX 5070 e IA integrada',
    category: 'Lanzamientos',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    date: 'Hoy',
    url: 'https://theverge.com',
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
    description: 'Batería magnética con diseño futurista Cyberpunk. Carga rápida y estilo único.',
    image: 'https://m.media-amazon.com/images/I/71qZ-yR56FL._AC_SL1500_.jpg',
    url: 'https://amzn.to/3PwzOiV',
    price: '69,99€',
    category: 'Carga MagSafe'
  },
  {
    id: 2,
    name: 'iFixit Pro Tech Toolkit',
    description: 'El kit de herramientas que usamos en el taller para todas las reparaciones.',
    image: 'https://m.media-amazon.com/images/I/71H2o0t-UuL._AC_SL1500_.jpg',
    url: 'https://amzn.to/3VQExmG',
    price: '74,95€',
    category: 'Herramientas'
  },
  {
    id: 3,
    name: 'Lámpara de Escritorio LED',
    description: 'Iluminación profesional para ver hasta el último tornillo de tu móvil.',
    image: 'https://m.media-amazon.com/images/I/61I0Zf6P+mL._AC_SL1500_.jpg',
    url: 'https://amzn.to/3VT5gT9',
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

// ─── Componentes Auxiliares ──────────────────────────────────────────────────
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
      <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Maps_icon_%282020%29.svg" alt="Google" className="google-icon-small" />
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
  const formRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (GNEWS_API_KEY === 'TU_API_KEY_AQUI') {
        setNewsFeed(FALLBACK_NEWS);
        setFeaturedNews(FALLBACK_NEWS[0]);
        setNewsLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/top-headlines?category=technology&lang=es&country=es&max=10&apikey=${GNEWS_API_KEY}`
        );
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          const articles = data.articles.map((a, i) => ({
            id: i + 1,
            title: a.title,
            category: 'Tecnología',
            image: a.image || `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop`,
            date: new Date(a.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
            url: a.url,
            source: a.source?.name || 'Tech News',
          }));
          setFeaturedNews(articles[0]);
          setNewsFeed(articles.slice(1)); // Guardamos el resto
        } else {
          setNewsFeed(FALLBACK_NEWS);
          setFeaturedNews(FALLBACK_NEWS[0]);
        }
      } catch (err) {
        console.error('Error cargando noticias:', err);
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
              <motion.h2 variants={revealVariants} className="hero-cta-title">
                ¿Dispositivo roto? <br />
                <span className="text-gradient">Déjalo como nuevo.</span>
              </motion.h2>
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
                  <h4>11.9k</h4>
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

        {/* ─── Reseñas de Google (Nueva Posición) ─── */}
        <section id="reseñas" className="section testimonials-section" style={{ padding: '60px 0', background: 'rgba(255,107,0,0.02)' }}>
          <div className="container">
            <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div className="google-rating-summary">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Maps_icon_%282020%29.svg/1200px-Google_Maps_icon_%282020%29.svg.png" alt="Google" className="google-maps-logo" />
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

            <motion.div
              className="reviews-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {GOOGLE_REVIEWS.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </motion.div>

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
                EVCanal no es solo un canal de tecnología con más de <strong>11.9k suscriptores</strong>,
                es nuestra pasión hecha realidad. EVC - EDfix nace para traerte toda esa experiencia
                directamente a un <strong>taller físico en Málaga</strong>. Conocemos las entrañas de
                cada dispositivo porque los abrimos, los analizamos y los ponemos a prueba antes de que salgan al mercado.
              </p>
            </div>
          </motion.div>
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
                {/* Mocked iframe for visual purposes. In real usage, replace with actual YouTube embed link if needed. We use a stock video placeholder or empty iframe block. */}
                <iframe
                  src="https://www.youtube.com/embed/xCXZzYtiR-E"
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
                  <div className="channel-subs">11.9K suscriptores</div>
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
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="nav-logo">
              <img src="/logo.png" alt="EVC EDfix" style={{ height: '120px', width: 'auto', marginBottom: '10px' }} />
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.9rem', maxWidth: '300px' }}>
                El taller de reparación que tu tecnología merece. Especialistas en Málaga.
              </p>
            </div>

            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
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
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Form Modal */}
      <AnimatePresence>
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
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
