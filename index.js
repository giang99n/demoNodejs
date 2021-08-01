//require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute=require('./routes/user.route')

mongoose.connect('mongodb+srv://demo:aloalo123@cluster0.nwfs7.mongodb.net/demo?retryWrites=true&w=majority' , {
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());


app.use('/api',userRoute);

//Start an express server
app.listen(4000, () => console.log(`Server Started`));
