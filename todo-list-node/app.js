require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Import routes
const login = require('./login');
const auth = require('./auth');
const register = require('./register');

// Initialize Firebase Admin
const serviceAccount = require("./login-183-firebase-adminsdk-fbsvc-6ca3379310.json");
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = getFirestore();

const app = express();
const PORT = 3000;

// Set up EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Middleware for Session-Handling
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// CORS middleware
app.use(cors({
    origin: 'http://localhost',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));

// Static files and other middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Route setup
app.use('/auth', register);
app.use('/login', login);

// Token verification middleware
app.use(async (req, res, next) => {
    const idToken = req.cookies.idToken;
    if (idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            req.user.uid = decodedToken.uid;

            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(req.user.uid).get();
            if (userDoc.exists) {
                req.userData = userDoc.data();
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }
    next();
});

// Protected routes middleware
function requireAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/', requireAuth, async (req, res) => {
    const tasksSnapshot = await db.collection('tasks').where('userId', '==', req.user.uid).get();
    const tasks = [];
    
    tasksSnapshot.forEach(doc => {
        tasks.push({
            id: doc.id,
            ...doc.data()
        });
    });

    res.render('index', { 
        user: req.user,
        userData: req.userData,
        tasks: tasks
    });
});

// Email verification route
app.get('/verify-email', requireAuth, (req, res) => {
    res.render('verify-email', { 
        user: req.user,
        userData: req.userData 
    });
});

// Setup MFA route
app.get('/setup-mfa', requireAuth, async (req, res) => {
    // Only allow if email is verified
    const userRecord = await admin.auth().getUser(req.user.uid);
    
    if (!userRecord.emailVerified) {
        return res.redirect('/verify-email');
    }
    
    res.render('setup-mfa', { 
        user: req.user,
        userData: req.userData
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('username');
    res.clearCookie('userid');
    res.clearCookie('idToken');
    res.redirect('/login');
});

// Profile page
app.get('/profile', requireAuth, async (req, res) => {
    const userRecord = await admin.auth().getUser(req.user.uid);
    res.render('profile', {
        user: req.user,
        userData: req.userData,
        userRecord: userRecord
    });
});

// Admin routes
app.get('/admin/users', requireAuth, async (req, res) => {
    // Check if user is admin
    if (!req.userData || !req.userData.isAdmin) {
        return res.redirect('/');
    }
    
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
        users.push({
            id: doc.id,
            ...doc.data()
        });
    });
    
    res.render('admin/users', { 
        user: req.user,
        userData: req.userData,
        users: users
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});