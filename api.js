const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, 'data', 'tasks.json');

// Helper function to read data
const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [], studios: [], bookings: [], favorites: [] };
    }
};

// Helper function to write data
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Initialize data structure if empty
const initializeData = () => {
    try {
        const data = readData();
        let needsUpdate = false;

        // Check and initialize each array if missing
        if (!Array.isArray(data.users)) {
            data.users = [];
            needsUpdate = true;
        }
        if (!Array.isArray(data.studios)) {
            data.studios = [];
            needsUpdate = true;
        }
        if (!Array.isArray(data.bookings)) {
            data.bookings = [];
            needsUpdate = true;
        }
        if (!Array.isArray(data.favorites)) {
            data.favorites = [];
            needsUpdate = true;
        }

        // Only write if changes were needed
        if (needsUpdate) {
            writeData(data);
            console.log('Initialized empty data structures');
        }
    } catch (err) {
        console.error('Initialization error:', err);
    }
};
const ensureDataFileExists = () => {
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(dataPath)) {
        writeData({ users: [], studios: [], bookings: [], favorites: [] });
    }
};
ensureDataFileExists();  // Creates file if missing
initializeData();  

//initializeData();


// ========== USER ROUTES ========== //

// GET all users (for admin purposes)
router.get('/users', (req, res) => {
    const data = readData();
    res.json(data.users);
});

// GET current user
router.get('/users/current', (req, res) => {
    const data = readData();
    const userEmail = req.query.email;
    const user = data.users.find(u => u.email === userEmail);
    
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// POST login
router.post('/login', (req, res) => {
    const { email } = req.body;
    const data = readData();
    const user = data.users.find(u => u.email === email);
    
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// POST signup
router.post('/signup', (req, res) => {
    const { name, email, phone, role } = req.body;
    const data = readData();
    
    if (data.users.some(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = { name, email, phone, role };
    data.users.push(newUser);
    writeData(data);
    
    res.json({ success: true, user: newUser });
});

// PUT update user profile
router.put('/users/:email', (req, res) => {
    const email = req.params.email;
    const { name, phone, newEmail } = req.body;
    const data = readData();
    
    const userIndex = data.users.findIndex(u => u.email === email);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if new email is already taken by another user
    if (newEmail && newEmail !== email && data.users.some(u => u.email === newEmail)) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    
    data.users[userIndex] = {
        ...data.users[userIndex],
        name: name || data.users[userIndex].name,
        phone: phone || data.users[userIndex].phone,
        email: newEmail || data.users[userIndex].email
    };
    
    writeData(data);
    res.json({ success: true, user: data.users[userIndex] });
});

// ========== STUDIO ROUTES ========== //

// GET all studios
router.get('/studios', (req, res) => {
    const data = readData();
    
    res.json(data.studios);
    
});

// GET studios by owner
router.get('/studios/owner/:email', (req, res) => {
    const email = req.params.email;
    const data = readData();
    const studios = data.studios.filter(s => s.owner === email);
    res.json(studios);
});

// GET studio by ID
router.get('/studios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const studio = data.studios.find(s => s.id === id);
    
    if (studio) {
        res.json({ success: true, studio });
    } else {
        res.status(404).json({ success: false, message: 'Studio not found' });
    }
});


// POST create studio
router.post('/studios', (req, res) => {
    const studio = req.body;
    const data = readData();
    
    studio.id = Date.now();
    data.studios.push(studio);
    writeData(data);
    
    res.json({ success: true, studio });
});

// PUT update studio
router.put('/studios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedStudio = req.body;
    const data = readData();
    
    const index = data.studios.findIndex(s => s.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
    }
    
    data.studios[index] = { ...data.studios[index], ...updatedStudio };
    writeData(data);
    res.json({ success: true, studio: data.studios[index] });
});

// DELETE studio
// DELETE favorite - WORKING VERSION
router.delete('/favorites/:studioId/:userEmail', (req, res) => {
    const studioId = parseInt(req.params.studioId); // Convert to number
    const userEmail = req.params.userEmail;
    const data = readData();
    
    // Find the exact favorite to remove
    const initialLength = data.favorites.length;
    data.favorites = data.favorites.filter(fav => 
        !(fav.studioId === studioId && fav.userEmail === userEmail)
    );
    
    if (data.favorites.length === initialLength) {
        return res.status(404).json({ 
            success: false, 
            message: 'Favorite not found' 
        });
    }
    
    writeData(data);
    res.json({ 
        success: true,
        message: 'Favorite removed successfully'
    });
});

// ========== BOOKING ROUTES ========== //

// GET all bookings
router.get('/bookings', (req, res) => {
    const data = readData();
    res.json(data.bookings);
});
// router.get('/studios', (req, res) => {
//     const data = readData();
//     res.json({ success: true, studios: data.studios }); // Wrap in success object
// });
// GET bookings by user
router.get('/bookings/user/:email', (req, res) => {
    const email = req.params.email;
    const data = readData();
    const bookings = data.bookings.filter(b => b.renterEmail === email);
    res.json(bookings);
});
router.get('/bookings/user/:email', (req, res) => {
    const email = req.params.email;
    const data = readData();
    const bookings = data.bookings.filter(b => b.renterEmail === email);
    res.json({ success: true, bookings }); // Wrap in success object
});
// POST create booking
router.post('/bookings', (req, res) => {
    const { studioId, renterEmail } = req.body;
    const data = readData();
    
    // Check if studio exists
    const studio = data.studios.find(s => s.id === studioId);
    if (!studio) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
    }
    
    // Check if user exists
    const user = data.users.find(u => u.email === renterEmail);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const newBooking = {
        id: Date.now(),
        studioId,
        renterEmail,
        bookingDate: new Date().toISOString(),
        status: 'pending'
    };
    
    data.bookings.push(newBooking);
    writeData(data);
    res.json({ success: true, booking: newBooking });
});

// DELETE booking
router.delete('/bookings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    
    const index = data.bookings.findIndex(b => b.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    data.bookings.splice(index, 1);
    writeData(data);
    res.json({ success: true });
});


//delete studios by owner
// In your server route:
router.delete('/studios/:id', (req, res) => {
    console.log('Delete request received for ID:', req.params.id);
    const id = parseInt(req.params.id);
    const data = readData();
    console.log('Current studios:', data.studios);
    
    const index = data.studios.findIndex(b => b.id === id);
    console.log('Found index:', index);
    
    if (index === -1) {
        console.log('Studio not found');
        return res.status(404).json({ success: false, message: 'studio not found' });
    }
    
    data.studios.splice(index, 1);
    writeData(data);
    console.log('Studio deleted successfully');
    res.json({ success: true });
});


// Filtering the studios 
// Add this to your studio routes section in api.js
// GET filtered studios
// GET filtered studios - Updated to match your data structure
// GET filtered studios - Simplified version
// Add this right before your route handlers
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
router.get('/studios/filter', (req, res) => {
    console.log('FILTER ENDPOINT HIT!', req.query); // Add this line

    const data = readData();
    let studios = data.studios;

    // Get filter values from query parameters
    const availability = req.query.availability;
    const rentMin = req.query.rentMin;
    const rentMax = req.query.rentMax;
    const parking = req.query.parking;
    const publicTransport = req.query.publicTransport;

    // Apply filters one by one
    if (availability === 'available') {
        studios = studios.filter(studio => studio.availability === true);
    }
    if (availability === 'not-available') {
        studios = studios.filter(studio => studio.availability === false);
    }

    if (rentMin) {
        studios = studios.filter(studio => studio.rent >= parseInt(rentMin));
    }

    if (rentMax) {
        studios = studios.filter(studio => studio.rent <= parseInt(rentMax));
    }

    if (parking === 'yes') {
        studios = studios.filter(studio => studio.parking === true);
    }
    if (parking === 'no') {
        studios = studios.filter(studio => studio.parking === false);
    }

    if (publicTransport === 'yes') {
        studios = studios.filter(studio => studio.publicTransport === true);
    }
    if (publicTransport === 'no') {
        studios = studios.filter(studio => studio.publicTransport === false);
    }

    res.json(studios);
});


// ========== SEARCH ROUTES ========== //

// GET search studios
// Simple search endpoint
router.get('/studios/search', (req, res) => {
    const query = req.query.q || '';
    const data = readData();
    
    if (!query.trim()) {
        return res.json(data.studios); // Return all if empty search
    }

    const searchTerm = query.toLowerCase();
    
    const results = data.studios.filter(studio => {
        // Search in name, address, and description
        return (
            studio.name.toLowerCase().includes(searchTerm) ||
            studio.address.toLowerCase().includes(searchTerm) ||
            (studio.description && studio.description.toLowerCase().includes(searchTerm))
        );
    });

    res.json(results); // Return just the array of matching studios
});

// GET advanced search with filters
router.get('/studios/advanced-search', (req, res) => {
    const { q, minPrice, maxPrice, amenities } = req.query;
    const data = readData();
    
    let results = data.studios;

    // Text search
    if (q && q.trim() !== '') {
        const searchTerm = q.toLowerCase().trim();
        results = results.filter(studio => {
            const searchFields = [
                studio.name,
                studio.address,
                studio.description || ''
            ].join(' ').toLowerCase();
            return searchFields.includes(searchTerm);
        });
    }

    // Price range filter
    if (minPrice) {
        results = results.filter(studio => studio.rent >= parseInt(minPrice));
    }
    if (maxPrice) {
        results = results.filter(studio => studio.rent <= parseInt(maxPrice));
    }

    // Amenities filter (comma-separated list)
    if (amenities) {
        const desiredAmenities = amenities.split(',').map(a => a.trim().toLowerCase());
        results = results.filter(studio => {
            if (!studio.amenities) return false;
            const studioAmenities = studio.amenities.map(a => a.toLowerCase());
            return desiredAmenities.every(da => studioAmenities.includes(da));
        });
    }

    res.json({ 
        success: true, 
        results,
        count: results.length
    });
});

// ========== FAVORITE ROUTES ========== //

// ... (keep all your existing code until the favorites routes)

// GET favorites by user
router.get('/favorites/:email', (req, res) => {
    const email = req.params.email;
    const data = readData();
    const favorites = data.favorites.filter(f => f.userEmail === email);
    res.json(favorites);
});

// POST add favorite
router.post('/favorites', (req, res) => {
    const { studioId, userEmail } = req.body;
    const data = readData();
    
    // Check if studio exists
    const studio = data.studios.find(s => s.id === studioId);
    if (!studio) {
        return res.status(404).json({ success: false, message: 'Studio not found' });
    }
    
    // Check if user exists
    const user = data.users.find(u => u.email === userEmail);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if already favorited
    if (data.favorites.some(f => f.studioId === studioId && f.userEmail === userEmail)) {
        return res.status(400).json({ success: false, message: 'Studio already in favorites' });
    }
    
    const newFavorite = {
        id: Date.now(),
        studioId,
        userEmail
    };
    
    data.favorites.push(newFavorite);
    writeData(data);
    res.json({ success: true, favorite: newFavorite });
});

// DELETE favorite - FIXED VERSION
// DELETE favorite - VERIFIED WORKING VERSION
router.delete('/favorites/:studioId/:userEmail', (req, res) => {
    const studioId = parseInt(req.params.studioId);
    const userEmail = req.params.userEmail;
    const data = readData();
    
    const index = data.favorites.findIndex(f => 
        f.studioId === studioId && 
        f.userEmail === userEmail
    );
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Favorite not found' });
    }
    
    data.favorites.splice(index, 1);
    writeData(data);
    res.json({ success: true });
});

module.exports = router;