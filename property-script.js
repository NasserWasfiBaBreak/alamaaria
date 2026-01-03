// ===================================
// Property Detail Page
// ===================================

// Get property ID from URL
function getPropertyIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load property data
function loadPropertyData(propertyId) {
    const pagesKey = 'alamaaria_property_pages';
    const pages = JSON.parse(localStorage.getItem(pagesKey) || '{}');
    return pages[propertyId] || null;
}

// Format price
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Render property detail page
function renderPropertyDetail() {
    const propertyId = getPropertyIdFromURL();
    const main = document.getElementById('propertyDetailMain');

    if (!propertyId) {
        main.innerHTML = `
            <div class="property-not-found">
                <h2>Property Not Found</h2>
                <p>The property you're looking for doesn't exist.</p>
                <a href="index.html#properties" class="btn btn-primary">View All Properties</a>
            </div>
        `;
        return;
    }

    const property = loadPropertyData(propertyId);

    if (!property) {
        main.innerHTML = `
            <div class="property-not-found">
                <h2>Property Not Found</h2>
                <p>This property may have been removed or doesn't exist.</p>
                <a href="index.html#properties" class="btn btn-primary">View All Properties</a>
            </div>
        `;
        return;
    }

    // Update page title and meta tags
    document.title = `${property.title} - Alamaaria Real Estate`;

    // Update Open Graph meta tags for better social sharing
    updateMetaTags(property);

    const images = property.images && property.images.length > 0
        ? property.images
        : [''];

    main.innerHTML = `
        <div class="property-detail">
            <!-- Hero Section with Gallery -->
            <div class="property-hero">
                <div class="property-gallery">
                    <div class="gallery-main" id="galleryMain">
                        ${images[0] ? `<img src="${images[0]}" alt="${property.title}">` : '<div style="background: linear-gradient(135deg, #d0d0d0 0%, #e8e8e8 100%); height: 100%;"></div>'}
                    </div>
                    ${images.length > 1 ? `
                        <div class="gallery-controls">
                            <button class="gallery-btn" id="prevBtn">‹</button>
                            <button class="gallery-btn" id="nextBtn">›</button>
                        </div>
                        <div class="gallery-nav" id="galleryNav">
                            ${images.map((img, index) => `
                                <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                                    <img src="${img}" alt="View ${index + 1}">
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- Property Content -->
            <div class="property-content">
                <div class="container">
                    <a href="index.html#properties" class="back-to-properties">← Back to Properties</a>

                    <div class="property-header">
                        ${property.featured ? '<span class="property-badge-featured">Featured Property</span>' : ''}
                        <h1 class="property-title">${property.title}</h1>
                        <p class="property-location">📍 ${property.location}</p>
                        <p class="property-price-large">AED ${formatPrice(property.price)}</p>

                        <!-- Social Share Section -->
                        <div class="share-section">
                            <h4 class="share-title">Share this property:</h4>
                            <div class="share-buttons">
                                <button class="share-btn whatsapp" data-share="whatsapp">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    WhatsApp
                                </button>
                                <button class="share-btn facebook" data-share="facebook">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                </button>
                                <button class="share-btn x-twitter" data-share="twitter">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                    X
                                </button>
                                <button class="share-btn linkedin" data-share="linkedin">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    LinkedIn
                                </button>
                                <button class="share-btn email" data-share="email">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    Email
                                </button>
                                <button class="share-btn copy-link" data-share="copy">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                                    </svg>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="property-grid">
                        <div class="property-main">
                            <!-- Features -->
                            <div class="property-features-grid">
                                <div class="feature-item">
                                    <div class="feature-icon">🛏️</div>
                                    <div class="feature-value">${property.beds}</div>
                                    <div class="feature-label">Bedrooms</div>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">🚿</div>
                                    <div class="feature-value">${property.baths}</div>
                                    <div class="feature-label">Bathrooms</div>
                                </div>
                                <div class="feature-item">
                                    <div class="feature-icon">📐</div>
                                    <div class="feature-value">${property.area}</div>
                                    <div class="feature-label">m² Area</div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="property-description">
                                <h3>About This Property</h3>
                                <p>${property.description || 'Discover this exceptional property that offers the perfect blend of luxury, comfort, and modern living. Located in one of Ajman\'s most sought-after neighborhoods, this residence presents an outstanding opportunity for those seeking quality and elegance.'}</p>
                            </div>
                        </div>

                        <!-- Sidebar Contact Form -->
                        <div class="property-sidebar">
                            <div class="contact-form-property">
                                <h3>Interested in this property?</h3>
                                <form id="propertyInquiryForm">
                                    <div class="form-group-property">
                                        <input type="text" placeholder="Your Name" required>
                                    </div>
                                    <div class="form-group-property">
                                        <input type="email" placeholder="Your Email" required>
                                    </div>
                                    <div class="form-group-property">
                                        <input type="tel" placeholder="Your Phone">
                                    </div>
                                    <div class="form-group-property">
                                        <textarea rows="4" placeholder="Your Message" required></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary btn-full">Send Inquiry</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize gallery if multiple images
    if (images.length > 1) {
        initializeGallery(images);
    }

    // Handle inquiry form
    document.getElementById('propertyInquiryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
        e.target.reset();
    });

    // Initialize social share buttons
    initializeSocialShare(property);
}

// ===================================
// Update Meta Tags for Social Sharing
// ===================================
function updateMetaTags(property) {
    const currentUrl = window.location.href;
    const description = property.description || `Discover this exceptional property: ${property.title} in ${property.location}. ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.area}m². AED ${formatPrice(property.price)}`;
    const imageUrl = property.images && property.images.length > 0 ? property.images[0] : '';

    // Update or create meta tags
    const metaTags = {
        // Open Graph tags
        'og:title': `${property.title} - Alamaaria Real Estate`,
        'og:description': description,
        'og:url': currentUrl,
        'og:type': 'website',
        'og:site_name': 'Alamaaria Real Estate',

        // Twitter Card tags
        'twitter:card': 'summary_large_image',
        'twitter:title': `${property.title} - Alamaaria Real Estate`,
        'twitter:description': description,

        // General meta tags
        'description': description
    };

    // Add image if available
    if (imageUrl) {
        metaTags['og:image'] = imageUrl;
        metaTags['twitter:image'] = imageUrl;
    }

    // Update or create each meta tag
    Object.keys(metaTags).forEach(property => {
        let element = document.querySelector(`meta[property="${property}"]`) ||
                     document.querySelector(`meta[name="${property}"]`);

        if (!element) {
            element = document.createElement('meta');
            if (property.startsWith('og:') || property.startsWith('twitter:')) {
                element.setAttribute('property', property);
            } else {
                element.setAttribute('name', property);
            }
            document.head.appendChild(element);
        }

        element.setAttribute('content', metaTags[property]);
    });
}

// ===================================
// Social Share Functionality
// ===================================
function initializeSocialShare(property) {
    const shareButtons = document.querySelectorAll('.share-btn');
    const currentUrl = window.location.href;
    const shareTitle = `${property.title} - Alamaaria Real Estate`;
    const shareText = `Check out this amazing property: ${property.title} in ${property.location} for AED ${formatPrice(property.price)}`;

    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.getAttribute('data-share');
            handleShare(platform, currentUrl, shareTitle, shareText);
        });
    });
}

function handleShare(platform, url, title, text) {
    let shareUrl = '';

    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(shareUrl, '_blank');
            break;

        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'width=600,height=400');
            break;

        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
            window.location.href = shareUrl;
            break;

        case 'copy':
            copyToClipboard(url);
            break;

        default:
            console.log('Unknown share platform');
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(err => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy link', 'error');
    }

    document.body.removeChild(textArea);
}

// Gallery functionality
let currentImageIndex = 0;

function initializeGallery(images) {
    const galleryMain = document.getElementById('galleryMain');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    function showImage(index) {
        currentImageIndex = index;
        galleryMain.innerHTML = `<img src="${images[index]}" alt="Property image ${index + 1}">`;

        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => showImage(index));
    });

    prevBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
        showImage(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
        showImage(newIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Mobile nav
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('active');
    });
}

// Load property on page load
document.addEventListener('DOMContentLoaded', renderPropertyDetail);

console.log('Property detail page loaded');
