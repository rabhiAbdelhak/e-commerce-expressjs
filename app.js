//envereonment variables
require('dotenv').config();

//express error handler 
require('express-async-errors');

//local imports 
const connectDB = require('./db/connect')

//error and not found middlewares
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const {authenticationMiddleware} = require('./middleware/authentication')

//express
const express = require('express');
const app = express();

//external routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const companyRouter = require('./routes/companyRoutes');
const skuRouter = require('./routes/skuRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

//rest of the packages 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//security packages
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');



//security middlwares
app.set('trust proxy', 1);

app.use(rateLimiter({
    windowMs : 15*60*1000, //
    max: 60
}))
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(rateLimiter());
app.use(mongoSanitize());


//express middlewares to use
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(fileUpload());
//routes
app.get('/', (req, res) => {
    console.log(req.cookies);
    res.json({msg : 'here we go , the server is ready !', user : req.user});
})

//switch routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticationMiddleware, userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/skus', skuRouter);
app.use('/api/v1/categories', authenticationMiddleware , categoryRouter);
app.use('/api/v1/companies', authenticationMiddleware , companyRouter);
app.use('/api/v1/reviews', authenticationMiddleware ,reviewRouter);
app.use('/api/v1/orders', authenticationMiddleware ,orderRouter);


//envoke error-handler and notfound middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware);

//start the application 
const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URI)
        app.listen(port , ( ) => {
            console.log('server listening on port '+ port)
        })
    }catch(err){
        console.log(err)
    }
}

start();
