const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()

app.use(cors({
    origin: 'http://localhost:3000',
}))
//parse JSON bodies
app.use(express.json());

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

//Global auth AFTER login/signup routes
const requireAuth = require('./middleware/requireAuth');
app.use(requireAuth)

//console.log(app)
//middleware logger
app.use((req, _res, next) => {console.log('REQ:', req.method, req.url); next();});

//mount user routes at /users
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

//mount notes routes at /notes
const noteRoutes = require('./routes/notes');
app.use('/notes',noteRoutes);




//default GET endpoint response
app.get('/', (req, res) => {
    res.send('Hello from our server')
});

app.listen(8080, () => {
    console.log('server listening on port 8080')
});