import { useState } from 'react';
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
  Star
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

const newsFeed = [
  {
    id: 1,
    title: 'Samsung Galaxy S24 Ultra: ¿Vale la pena actualziarse?',
    category: 'Reviews',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
    date: 'Hace 2 horas',
  },
  {
    id: 2,
    title: 'Cómo cambiar la pasta térmica de tu PS5 paso a paso',
    category: 'Guías de Reparación',
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800&auto=format&fit=crop',
    date: 'Hace 5 horas',
  },
  {
    id: 3,
    title: 'Oferta flash: Monitor Gaming 144Hz a precio de chollo en Amazon',
    category: 'Ofertas',
    image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=800&auto=format&fit=crop',
    date: 'Ayer',
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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formStep, setFormStep] = useState(1);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStep(2); // Show success message
  };

  return (
    <>
      <MatrixBackground />

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/logo.png" alt="EVC EDfix" style={{ height: '65px', width: 'auto' }} />
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

            <motion.div
              className="latest-news-card"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600080846061-fcdb9cfd4144?q=80&w=1200&auto=format&fit=crop')` }}
            >
              <div className="news-card-overlay">
                <span className="tag">Lanzamientos</span>
                <h3 className="news-card-title text-gradient">Apple Vision Pro: El futuro ya está aquí</h3>
                <div className="news-card-meta">
                  <span>Por Valerio EVC</span>
                  <span>•</span>
                  <span>Lectura de 5 min</span>
                </div>
              </div>
            </motion.div>
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
            <button className="btn-outline">Ver más noticias</button>
          </div>

          <motion.div
            className="news-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {newsFeed.map((news) => (
              <motion.article key={news.id} className="news-item" variants={revealVariants}>
                <div className="news-image-wrapper">
                  <span className="tag">{news.category}</span>
                  <img src={news.image} alt={news.title} className="news-image" />
                </div>
                <div className="news-content">
                  <h4 className="news-title">{news.title}</h4>
                  <div className="news-footer">
                    <span>{news.date}</span>
                    <a href="#" className="read-more">
                      Leer <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
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
              <img src="/logo.png" alt="EVC EDfix" style={{ height: '85px', width: 'auto', marginBottom: '10px' }} />
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

                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label>Tipo de Dispositivo</label>
                      <select
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
                      <input type="text" placeholder="Ej. iPhone 13 Pro, PS5, etc." required />
                    </div>

                    <div className="form-group">
                      <label>¿Qué problema tiene?</label>
                      <textarea placeholder="Pantalla rota, no enciende, hace ruido..." required></textarea>
                    </div>

                    <div className="form-group">
                      <label>Tu E-mail (para enviarte el presupuesto)</label>
                      <input type="email" placeholder="correo@ejemplo.com" required />
                    </div>

                    <button type="submit" className="btn-neon" style={{ width: '100%', marginTop: '10px' }}>
                      Solicitar Presupuesto
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
