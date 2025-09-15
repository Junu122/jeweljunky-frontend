import React, { useState } from "react";
import Pagination from "../common/Pagination";
import { Link } from "react-router-dom";
import { backIn } from "framer-motion";
import { BorderBottom } from "react-bootstrap-icons";

export default function ShopCollections({ collections }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const styles = {
    section: {
      minHeight: '100vh',
      padding: '3rem 0'
    },
    sectionTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      color: '#030104',
      marginBottom: '1.5rem',
      animation: 'fadeInUp 1s ease-out',
      '@media (max-width: 991px)': {
        fontSize: '2.5rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '2rem'
      }
    },
    divider: {
      width: '80px',
      height: '3px',
      background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
      border: 'none',
      margin: '0 auto'
    },
    leadText: {
      color: "#AB8B46",
      marginTop: '1rem'
    },
    collectionCard: {
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      cursor: 'pointer',
      height: '100%',
      width: '100%',
      background: '#ffffff',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    },
    collectionCardHover: {
      transform: 'translateY(-15px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.3)'
    },
    
    card: {
      background: 'transparent !important',
      border: 'none',
      transition: 'all 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    imageContainer: {
      overflow: 'hidden',
      borderRadius: '0',
      transition: 'all 0.4s ease',
      position: 'relative',
      width: '100%',
      paddingBottom: '100%',
      height: 0,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    },
    imageContainerHover: {
      // Removed individual hover styles as they're now handled by the card
    },
    collectionImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
      display: 'block',
    },
    collectionImageHover: {
      transform: 'scale(1.15)',
      filter: 'brightness(0.9) contrast(1.1)'
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      
      opacity: 0,
      transition: 'all 0.4s ease',
    },
    imageOverlayHover: {
      opacity: 1
    },
    hoverIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(0)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      color: '#000000',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '600',
      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      zIndex: 10,
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
      border: '2px solid rgba(255, 215, 0, 0.3)'
    },
  
    cardBody: {
      padding: '2rem 1.5rem',
      textAlign: 'center',
      flex: '0 0 auto',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    },
    collectionTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      color: '#1a1a1a',
      marginBottom: '0.5rem',
      lineHeight: '1.3',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    },
    collectionTitleHover: {
      color: '#FF8C00',
      transform: 'translateY(-2px)',
      textShadow: '0 4px 8px rgba(255, 140, 0, 0.3)'
    },
    titleLink: {
      textDecoration: 'none',
      color: 'inherit'
    },
    titleUnderline: {
      width: '0',
      height: '3px',
      background: 'linear-gradient(90deg, #FFD700, #FF8C00)',
      margin: '12px auto',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      borderRadius: '2px',
      boxShadow: '0 2px 4px rgba(255, 140, 0, 0.3)'
    },
    titleUnderlineHover: {
      width: '70px'
    },
    modernButton: {
      border: '2px solid #1a1a1a',
      borderRadius: '30px',
      fontWeight: '600',
      fontSize: '0.9rem',
      letterSpacing: '0.8px',
      textTransform: 'uppercase',
      transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, transparent 0%, transparent 100%)',
      color: '#1a1a1a',
      padding: '12px 28px',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    modernButtonHover: {
      color: '#ffffff',
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(255, 140, 0, 0.4)',
      background: 'linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)',
      border: '2px solid #FF8C00'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 0',
      color: '#ffffff'
    },
    emptyIcon: {
      fontSize: '4rem',
      color: '#6c757d',
      marginBottom: '1.5rem'
    },
    paginationWrapper: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'center'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounceIn {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          /* Grid container improvements */
          .collections-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            width: 100%;
            margin: 0 auto;
          }
          
          /* Responsive grid layouts */
          @media (min-width: 1400px) {
            .collections-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 2rem;
            }
          }
          
          @media (min-width: 1200px) and (max-width: 1399px) {
            .collections-grid {
              grid-template-columns: repeat(4, 1fr);
              gap: 1.5rem;
            }
          }
          
          @media (min-width: 992px) and (max-width: 1199px) {
            .collections-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 1.5rem;
            }
          }
          
          @media (min-width: 768px) and (max-width: 991px) {
            .collections-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.25rem;
            }
            .responsive-title {
              font-size: 2.5rem !important;
            }
          }
          
          @media (min-width: 576px) and (max-width: 767px) {
            .collections-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
            }
            .responsive-title {
              font-size: 2rem !important;
            }
            .collection-title {
              font-size: 1.1rem !important;
            }
            .modern-button {
              font-size: 0.8rem !important;
              padding: 8px 18px !important;
            }
          }
          
          @media (max-width: 575px) {
            .collections-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 0.75rem;
            }
            .responsive-title {
              font-size: 1.8rem !important;
            }
            .collection-title {
              font-size: 1rem !important;
              line-height: 1.4 !important;
            }
            .modern-button {
              font-size: 0.75rem !important;
              padding: 6px 16px !important;
            }
            .card-body-responsive {
              padding: 1rem 0.5rem !important;
            }
            .hover-icon-small {
              width: 50px !important;
              height: 50px !important;
              font-size: 16px !important;
            }
          }
          
          @media (max-width: 400px) {
            .collections-grid {
              gap: 0.5rem;
            }
            .responsive-title {
              font-size: 1.5rem !important;
            }
            .collection-title {
              font-size: 0.9rem !important;
            }
            .modern-button {
              font-size: 0.7rem !important;
              padding: 5px 14px !important;
            }
          }
          
          /* Enhanced square aspect ratio container */
          .square-image-container {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          
          .square-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          /* Card container for consistent sizing */
          .collection-card-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            min-height: fit-content;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          }
          
          /* Enhanced modern button with pseudo-element */
          .modern-btn {
            position: relative;
            overflow: hidden;
          }
          
          .modern-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            transition: all 0.6s ease;
            z-index: 1;
          }
          
          .modern-btn:hover::before {
            left: 100%;
          }

          /* Card shine effect */
          .collection-card-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: rotate(45deg);
            transition: all 0.6s ease;
            opacity: 0;
            z-index: 1;
            pointer-events: none;
          }

          .collection-card-container:hover::before {
            animation: shimmer 1.5s ease-in-out;
            opacity: 1;
          }
        `}
      </style>
      
      <section style={styles.section}>
        <div className="container-fluid px-3 px-sm-4">
          {/* Section Header */}
          <div className="row mb-4 mb-sm-5">
            <div className="col-12 text-center">
              <h2 className="responsive-title" style={styles.sectionTitle}>
                Our Collections
              </h2>
              <div style={styles.divider}></div>
              <p className="lead" style={styles.leadText}>
                Discover our carefully curated collections
              </p>
            </div>
          </div>

          {/* Collections Grid */}
          <div className="collections-grid">
            {collections.map((item, index) => (
              <div key={item._id} style={{ animation: `fadeInUp 0.5s ease-out forwards`, animationDelay: `${index * 0.1}s`, opacity: 0 }}>
                <div 
                  className="collection-card-container"
                  style={{
                    ...styles.collectionCard,
                    ...(hoveredItem === item._id ? styles.collectionCardHover : {})
                  }}
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={styles.card}>
                    {/* Square Image Container */}
                    <div className="square-image-container">
                      <Link
                        to={`/shop-collection-list/${item.name}`}
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          zIndex: 1
                        }}
                      >
                        <img
                          src={item.image.url}
                          alt={item.image.alt}
                          className="square-image"
                          style={{
                            ...(hoveredItem === item._id ? styles.collectionImageHover : {})
                          }}
                          loading="lazy"
                        />
                        <div 
                          style={{
                            ...styles.imageOverlay,
                            ...(hoveredItem === item._id ? styles.imageOverlayHover : {})
                          }}
                        ></div>
                        <div 
                          className="hover-icon-small"
                          style={{
                            ...styles.hoverIcon,
                            ...(hoveredItem === item._id ? styles.hoverIconShow : {})
                          }}
                        >
                          →
                        </div>
                      </Link>
                    </div>

                    {/* Card Body */}
                    <div 
                      className="card-body-responsive"
                      style={styles.cardBody}
                    >
                      <Link
                        to={`/shop-collection-list/${item.name}`}
                        style={styles.titleLink}
                        onMouseEnter={(e) => {
                          const title = e.currentTarget.querySelector('.collection-title');
                          const underline = e.currentTarget.querySelector('.title-underline');
                          if (title) Object.assign(title.style, styles.collectionTitleHover);
                          if (underline) Object.assign(underline.style, styles.titleUnderlineHover);
                        }}
                        onMouseLeave={(e) => {
                          const title = e.currentTarget.querySelector('.collection-title');
                          const underline = e.currentTarget.querySelector('.title-underline');
                          if (title) {
                            title.style.color = '#1a1a1a';
                            title.style.transform = 'translateY(0)';
                            title.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
                          }
                          if (underline) underline.style.width = '0';
                        }}
                      >
                        <h5 
                          className="collection-title" 
                          style={styles.collectionTitle}
                        >
                          {item.name}
                        </h5>
                        <div className="title-underline" style={styles.titleUnderline}></div>
                      </Link>
                      
                      <div className="mt-3">
                        <Link
                          to={`/shop-collection-list/${item.name}`}
                          className="modern-btn"
                          style={styles.modernButton}
                          onMouseEnter={(e) => {
                            Object.assign(e.target.style, styles.modernButtonHover);
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#1a1a1a';
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                            e.target.style.background = 'linear-gradient(135deg, transparent 0%, transparent 100%)';
                            e.target.style.border = '2px solid #1a1a1a';
                          }}
                        >
                          Explore
                          <span style={{ marginLeft: '5px' }}>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {collections.length === 0 && (
            <div className="row">
              <div className="col-12">
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📦</div>
                  <h4 style={{ color: '#000000', marginBottom: '1rem' }}>No Collections Found</h4>
                  <p style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
                    Check back later for new collections
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="row mt-5">
            <div className="col-12">
              <nav aria-label="Collections pagination">
                <div style={styles.paginationWrapper}>
                  {/* <Pagination /> */}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}