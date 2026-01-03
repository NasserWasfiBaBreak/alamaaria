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

    // Update page title
    document.title = `${property.title} - Alamaaria Real Estate`;

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
