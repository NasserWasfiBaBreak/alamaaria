// ===================================
// Property Management System
// ===================================

// Default credentials (In production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'alamaaria2025'
};

// Storage key for properties
const PROPERTIES_STORAGE_KEY = 'alamaaria_properties';

// Current property being edited
let currentEditingPropertyId = null;
let currentDeletingPropertyId = null;
let propertyImages = [];

// ===================================
// Authentication
// ===================================
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const logoutBtn = document.getElementById('logoutBtn');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        sessionStorage.setItem('alamaaria_admin_logged_in', 'true');
        loadProperties();
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('alamaaria_admin_logged_in');
    adminPanel.style.display = 'none';
    loginSection.style.display = 'flex';
    loginForm.reset();
});

// Check if already logged in
if (sessionStorage.getItem('alamaaria_admin_logged_in') === 'true') {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
    loadProperties();
}

// ===================================
// Property Management Functions
// ===================================

// Get all properties from localStorage
function getProperties() {
    const properties = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    return properties ? JSON.parse(properties) : getDefaultProperties();
}

// Get default properties (initial data)
function getDefaultProperties() {
    const defaultProps = [
        {
            id: 1,
            title: 'Luxury Villa',
            location: 'Al Rawda, Ajman',
            beds: 5,
            baths: 4,
            area: 450,
            price: 2500000,
            featured: true,
            images: [],
            description: 'Stunning luxury villa with modern amenities'
        },
        {
            id: 2,
            title: 'Modern Apartment',
            location: 'Al Nuaimia, Ajman',
            beds: 3,
            baths: 2,
            area: 180,
            price: 850000,
            featured: false,
            images: [],
            description: 'Contemporary apartment in prime location'
        },
        {
            id: 3,
            title: 'Penthouse Suite',
            location: 'Ajman Corniche',
            beds: 4,
            baths: 3,
            area: 320,
            price: 1750000,
            featured: false,
            images: [],
            description: 'Exclusive penthouse with breathtaking views'
        }
    ];

    // Create property detail pages for default properties
    defaultProps.forEach(property => {
        createPropertyDetailPage(property.id, property);
    });

    return defaultProps;
}

// Save properties to localStorage
function saveProperties(properties) {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
}

// Load and display properties
function loadProperties() {
    const properties = getProperties();
    const container = document.getElementById('propertiesContainer');
    const countElement = document.getElementById('propertyCount');

    countElement.textContent = `${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`;

    if (properties.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Properties Yet</h3>
                <p>Click "Add New Property" to get started</p>
            </div>
        `;
        return;
    }

    container.innerHTML = properties.map(property => {
        const primaryImage = property.images && property.images.length > 0 ? property.images[0] : '';

        return `
        <div class="property-card-admin" data-id="${property.id}">
            <div class="property-image-admin" style="${primaryImage ? `background-image: url('${primaryImage}'); background-size: cover; background-position: center;` : ''}">
                ${property.featured ? '<div class="property-badge">Featured</div>' : ''}
            </div>
            <div class="property-info">
                <h4>${property.title}</h4>
                <p class="location">📍 ${property.location}</p>
                <div class="details">
                    <span class="detail-item">🛏️ ${property.beds} Beds</span>
                    <span class="detail-item">🚿 ${property.baths} Baths</span>
                    <span class="detail-item">📐 ${property.area} m²</span>
                </div>
                <p class="price">AED ${formatPrice(property.price)}</p>
                <div class="actions">
                    <button class="btn btn-secondary btn-small edit-property" data-id="${property.id}">Edit</button>
                    <button class="btn btn-danger btn-small delete-property" data-id="${property.id}">Delete</button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    // Attach event listeners to edit and delete buttons
    document.querySelectorAll('.edit-property').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            editProperty(id);
        });
    });

    document.querySelectorAll('.delete-property').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            showDeleteModal(id);
        });
    });
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ===================================
// Modal Management
// ===================================
const propertyModal = document.getElementById('propertyModal');
const deleteModal = document.getElementById('deleteModal');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const propertyForm = document.getElementById('propertyForm');
const modalTitle = document.getElementById('modalTitle');

// Open add property modal
addPropertyBtn.addEventListener('click', () => {
    currentEditingPropertyId = null;
    modalTitle.textContent = 'Add New Property';
    propertyForm.reset();
    document.getElementById('propertyId').value = '';
    propertyModal.classList.add('active');
});

// Close modals
document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        propertyModal.classList.remove('active');
    });
});

document.querySelectorAll('.close-delete-modal, .cancel-delete-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        deleteModal.classList.remove('active');
    });
});

// Close modal when clicking outside
propertyModal.addEventListener('click', (e) => {
    if (e.target === propertyModal) {
        propertyModal.classList.remove('active');
    }
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
});

// ===================================
// Image Upload Handling
// ===================================
const imageInput = document.getElementById('propertyImages');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');

imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            propertyImages.push(event.target.result);
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });

    e.target.value = ''; // Reset input
}

function renderImagePreviews() {
    imagePreviewContainer.innerHTML = propertyImages.map((img, index) => `
        <div class="image-preview-item">
            <img src="${img}" alt="Property image ${index + 1}">
            <button type="button" class="image-preview-remove" onclick="removeImage(${index})">×</button>
            ${index === 0 ? '<span class="primary-badge">Primary</span>' : ''}
        </div>
    `).join('');
}

function removeImage(index) {
    propertyImages.splice(index, 1);
    renderImagePreviews();
}

// ===================================
// Add/Edit Property
// ===================================
propertyForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        title: document.getElementById('propertyTitle').value,
        location: document.getElementById('propertyLocation').value,
        beds: parseInt(document.getElementById('propertyBeds').value),
        baths: parseInt(document.getElementById('propertyBaths').value),
        area: parseInt(document.getElementById('propertyArea').value),
        price: parseInt(document.getElementById('propertyPrice').value),
        featured: document.getElementById('propertyFeatured').value === 'true',
        images: propertyImages.length > 0 ? propertyImages : [],
        description: document.getElementById('propertyDescription').value
    };

    const properties = getProperties();
    let propertyId;

    if (currentEditingPropertyId) {
        // Update existing property
        const index = properties.findIndex(p => p.id === currentEditingPropertyId);
        if (index !== -1) {
            properties[index] = { ...properties[index], ...formData };
            propertyId = currentEditingPropertyId;
        }
    } else {
        // Add new property
        const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
        propertyId = newId;
        properties.push({ id: newId, ...formData });
    }

    saveProperties(properties);

    // Create or update property detail page
    createPropertyDetailPage(propertyId, formData);

    loadProperties();
    propertyModal.classList.remove('active');
    propertyForm.reset();
    propertyImages = [];
    imagePreviewContainer.innerHTML = '';
    currentEditingPropertyId = null;

    showNotification(
        currentEditingPropertyId ? 'Property updated successfully!' : 'Property added successfully!',
        'success'
    );
});

// Edit property
function editProperty(id) {
    const properties = getProperties();
    const property = properties.find(p => p.id === id);

    if (property) {
        currentEditingPropertyId = id;
        modalTitle.textContent = 'Edit Property';

        document.getElementById('propertyId').value = property.id;
        document.getElementById('propertyTitle').value = property.title;
        document.getElementById('propertyLocation').value = property.location;
        document.getElementById('propertyBeds').value = property.beds;
        document.getElementById('propertyBaths').value = property.baths;
        document.getElementById('propertyArea').value = property.area;
        document.getElementById('propertyPrice').value = property.price;
        document.getElementById('propertyFeatured').value = property.featured.toString();
        document.getElementById('propertyDescription').value = property.description || '';

        // Load existing images
        propertyImages = property.images || [];
        renderImagePreviews();

        propertyModal.classList.add('active');
    }
}

// ===================================
// Delete Property
// ===================================
function showDeleteModal(id) {
    currentDeletingPropertyId = id;
    deleteModal.classList.add('active');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (currentDeletingPropertyId) {
        // Delete property detail page
        deletePropertyDetailPage(currentDeletingPropertyId);

        const properties = getProperties();
        const filteredProperties = properties.filter(p => p.id !== currentDeletingPropertyId);
        saveProperties(filteredProperties);
        loadProperties();
        deleteModal.classList.remove('active');
        currentDeletingPropertyId = null;
        showNotification('Property deleted successfully!', 'success');
    }
});

// ===================================
// Property Detail Page Management
// ===================================
function createPropertyDetailPage(propertyId, propertyData) {
    // Store property pages data
    const pagesKey = 'alamaaria_property_pages';
    const pages = JSON.parse(localStorage.getItem(pagesKey) || '{}');

    pages[propertyId] = {
        id: propertyId,
        ...propertyData,
        createdAt: pages[propertyId]?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem(pagesKey, JSON.stringify(pages));
}

function deletePropertyDetailPage(propertyId) {
    const pagesKey = 'alamaaria_property_pages';
    const pages = JSON.parse(localStorage.getItem(pagesKey) || '{}');
    delete pages[propertyId];
    localStorage.setItem(pagesKey, JSON.stringify(pages));
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
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
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize properties in localStorage if not exists
if (!localStorage.getItem(PROPERTIES_STORAGE_KEY)) {
    saveProperties(getDefaultProperties());
}

console.log('Admin panel loaded successfully');
console.log('Default credentials - Username: admin, Password: alamaaria2025');
