const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./db/connect")
require('dotenv').config();

app.use(cors());
app.use(express.json());

// routes 
const userRouter = require('./routes/user')
app.use('/v1/user',userRouter)

const messageRouter = require('./routes/messages')
app.use('/api/v1/messages',messageRouter)

const conversationRouter = require('./routes/conversation')
app.use('/api/v1/conversation',conversationRouter)

const notificationRouter = require('./routes/notification')
app.use('/api/v1/notifications',notificationRouter)

const start =  () => {
  try {
   connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();