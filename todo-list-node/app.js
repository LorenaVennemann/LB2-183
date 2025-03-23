require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const helmet = require('helmet');

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
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Helmet middleware for security headers
app.use(helmet());

// Configure CSP
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'", 
            "https://www.gstatic.com", 
            "https://cdnjs.cloudflare.com", 
            "https://cdn.jsdelivr.net",
            "https://www.google.com",
            "https://www.google-analytics.com",
            "https://www.googletagmanager.com",
            "https://www.recaptcha.net",
            "'unsafe-inline'"
        ],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://www.google.com", "https://www.gstatic.com"],
        connectSrc: ["'self'", "https://www.googleapis.com", "https://securetoken.googleapis.com", "https://identitytoolkit.googleapis.com"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net", "data:"],
        frameSrc: ["'self'", "https://www.google.com", "https://www.recaptcha.net"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"]
    }
}));

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
            console.error('Error verifying token');
            if (error.code === 'auth/id-token-expired') {
                // Token is expired, redirect to login
                return res.redirect('/login');
            }
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

// Import routes
const login = require('./login');
const register = require('./register');
const search = require('./search');
const edit = require('./edit');
const savetask = require('./savetask');
const deletetask = require('./deletetask');

// Route setup
app.use('/auth', register);
app.use('/login', login);
app.use('/search', requireAuth, search);
app.use('/edit', requireAuth, edit);
app.use('/savetask', requireAuth, savetask);
app.use('/delete', requireAuth, deletetask);

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

// Edit route
app.get('/edit', requireAuth, async (req, res) => {
    let title = '';
    let state = '';
    let taskId = '';
    let options = ["Open", "In Progress", "Done"];

    if (req.query.id !== undefined) {
        taskId = req.query.id;
        const taskDocRef = db.collection('tasks').doc(taskId);
        const taskDoc = await taskDocRef.get();
        if (taskDoc.exists) {
            const taskData = taskDoc.data();
            title = taskData.title;
            state = taskData.state;
        }
    }

    res.render('edit', { 
        user: req.user,
        userData: req.userData,
        taskId: taskId,
        title: title,
        state: state,
        options: options
    });
});

// If the Rout doesn't exist
app.use((req, res) => {
    res.status(404);
    res.type('text/plain').send('404 Not Found');
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});