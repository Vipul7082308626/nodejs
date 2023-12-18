import express from 'express';
const app = express();
import './src/config/db.js'

import userRouter from './src/routes/userRoute.js';

app.use(express.json());
app.use('/api/v1', userRouter);
app.get('/',function(req,res){
    res.send('WELCOME')
})


const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on ${port} ...`);
    const error = false;
    if (error) {
        console.log(`Error running in server`)
    }
})