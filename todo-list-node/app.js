require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const header = require('./fw/header');
const footer = require('./fw/footer');
const login = require('./login');
const index = require('./index');
const adminUser = require('./admin/users');
const editTask = require('./edit');
const { deleteTask } = require('./deletetask');
const tasklist = require('./user/tasklist');
const saveTask = require('./savetask');
const search = require('./search');
const searchProvider = require('./search/v2/index');
const register = require('./register');
const auth = require('./auth');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 3000;

app.use(express.static('public'));

// Middleware für Session-Handling
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // in production secure: true
}));

function activeUserSession(req) {
    return req.session && req.session.userid;
}

// Middleware für Body-Parser
app.use(cors({
    origin: 'http://localhost', // Ohne Port wenn auf 80 gemapped
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.static('views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use('/auth', register);
app.use('/login', login);

// Middleware zur Überprüfung der Authentifizierung
app.use(async (req, res, next) => {
    const idToken = req.cookies.idToken;
    if (idToken) {
        try {
            const decodedToken = await auth.verifyToken(idToken);
            req.user = decodedToken;
            req.user.uid = decodedToken.uid;
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    }
    next();
});


// Routen
app.get('/', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await index.html(req), req)
        res.send(html);
    } else {
        res.redirect('login');
    }
});

app.post('/login', async (req, res) => {
    let content = await login.handleLogin(req, res);
    let html = await wrapContent(content.html, req);
    res.redirect('/');
});

// edit task
app.get('/admin/users', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await adminUser.html, req);
        res.send(html);
    } else {
        res.redirect('/');
    }
});

// edit task
app.get('/edit', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await editTask.html(req), req);
        res.send(html);
    } else {
        res.redirect('/');
    }
});


// Login-Seite anzeigen
app.get('/login', async (req, res) => {
    let content = await login.handleLogin(req, res);

    if (content.user.userid !== 0) {
        // login was successful... set cookies and redirect to /
        login.startUserSession(res, content.user);
    } else {
        // login unsuccessful or not made jet... display login form
        let html = await wrapContent(content.html, req);
        res.send(html);
    }
});


app.get('/delete', deleteTask);

// delete task
app.post('/delete', async (req, res) => {
    console.log('Session:', req.session); // Debugging-Ausgabe
    if (activeUserSession(req)) {
        console.log('User session is active'); // Debugging-Ausgabe
        await deleteTask(req, res);
    } else {
        console.log('User session is not active'); // Debugging-Ausgabe
        res.redirect('/');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('username');
    res.clearCookie('userid');
    res.clearCookie('idToken');
    res.redirect('/login');
});

// Profilseite anzeigen
app.get('/profile', async (req, res) => {
    if (req.user) {
        const userRecord = await auth.getUser(req.user.uid);
        res.send(`Welcome, ${userRecord.displayName || userRecord.email}! <a href="/logout">Logout</a>`);
    } else {
        res.send('Please login to view this page');
    }
});

// Andere Routen bleiben unverändert
app.get('/admin/users', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await adminUser.html, req);
        res.send(html);
    } else {
        res.redirect('/');
    }
});

app.get('/edit', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await editTask.html(req), req);
        res.send(html);
    } else {
        res.redirect('/');
    }
});

app.post('/savetask', async (req, res) => {
    if (req.user) {
        let html = await wrapContent(await saveTask.html(req), req);
        res.send(html);
    } else {
        res.redirect('/');
    }
});

// search
app.post('/search', async (req, res) => {
    let html = await search.html(req);
    res.send(html);
});

// search provider
app.get('/search/v2/', async (req, res) => {
    let result = await searchProvider.search(req);
    res.send(result);
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


async function wrapContent(content, req) {
    let headerHtml = await header(req);
    return headerHtml + content + footer;
}
