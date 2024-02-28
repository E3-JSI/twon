// SocialApp
const express = require('express');
const webPush = require ('web-push');
const bodyParser = require("body-parser");
const User = require('./models/User.js');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require("multer");
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts.js');
const commentRoute = require('./routes/comments.js');
const path = require('path');
const fs = require('fs');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const port = process.env.PORT || proPort;
dotenv.config();

// SocialApp
// Admin
//const app = express();
global.app = express(); 
global.moment = require('moment');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cors = require('cors');
var apiRouter = require('./routes/api.js');
global.connectPool = require('./config/db.js'); 
if (process.env.NODE_ENV === 'development') {
  global.nodeSiteUrl  = process.env.nodeSiteUrl 
  global.nodeAdminUrl = process.env.localAdminUrl 

} else if (process.env.NODE_ENV === 'production') {
  global.nodeSiteUrl  =  process.env.NODESITEURL   
  global.nodeAdminUrl =  process.env.LOCALADMINURL  

}

global.siteTitle = 'TWON Admin';
global.successStatus = 200;
global.failStatus = 401; 
global.SessionExpireStatus = 500;  
global.CURRENCY = '$'; 
var flash = require('express-flash-messages') 
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
const Subscription = require('./models/Subscription.js');

// Admin
// Swagger
const options = {
  definition: { openapi: "3.1.0",
    info: {
      title: "Twin of Online Social Networks", version: "0.1.0", description: "", },
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);

//Swagger
const upload2 = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(__dirname, "../../client/public/uploads"));
    },
    filename(req, file, cb) {
      //cb(null, `${new Date().getTime()}_${file.originalname}`);
      cb(null,Date.now() + '-' + file.originalname);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, path.join(__dirname, "../server/public/images"));
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

// update user
userRoute.put("/:id/updateProfile", upload.single('profilePicture'),  async (req, res) => {
const id = req.body.id;
let diction = {}

if(req.body.desc && req.body.desc!= "undefined"){diction["desc"] = req.body.desc}
if(req.body.city && req.body.city!= "undefined"){diction["city"] = req.body.city}
if(req.body.from && req.body.from!= "undefined"){diction["from"] = req.body.from}
if(req.body.relationship && req.body.relationship!= "undefined"){diction["relationship"] = req.body.relationship}
diction["profilePicture"] = getLastPart(req.file.path)

const updatedData = { $set: diction}
console.log(updatedData);
try {
  const res2 = await User.updateOne({"_id": id}, updatedData);
  console.log(res2);
  return res.status(200).json(res2);

} catch(err) {

  console.log("Error updating profile image");
  console.log(err);
  return res.status(500).json(err);
}
});

// update user
userRoute.post("/:id/updateProfile2",  async (req, res) => {
const id = req.params.id;
console.log("Here is the requst")
console.log(req.body);
console.log(req.params);
let diction = {}

if(req.body.desc){diction["desc"] = req.body.desc}
if(req.body.city){diction["city"] = req.body.city}
if(req.body.from){diction["from"] = req.body.from}
if(req.body.relationship){diction["relationship"] = req.body.relationship}

const updatedData = { $set: diction}
console.log(updatedData);
try {
  const res2 = await User.findByIdAndUpdate({"_id": id}, updatedData);
  console.log(res2);
  return res.status(200).json(res2);

} catch(err) {
  console.log("Error updating profile");
  console.log(err);
  return res.status(500).json(err);
}
});


// Route for handling image upload
app.post('/images', upload.single('profilePicture'), (req, res) => {
if (!req.file) {
  return res.status(400).send('No file uploaded.');
}

// Create a write stream to store the file in GridFS
const writestream = gfs.createWriteStream({
  filename: req.file.filename,
});

// Read the file and pipe it to GridFS
const readStream = fs.createReadStream(req.file.path);
readStream.pipe(writestream);

readStream.on('end', () => {
  // Remove the temporary file after upload
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.send('File uploaded successfully.');
});

writestream.on('error', (err) => {
  console.error(err);
  res.status(500).send('Error uploading file.');
});
});


function getLastPart(url) {
const parts = url.split('/');
return parts.at(-1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SocialApp
app.use("/images", express.static("images"));
app.use(express.static('dist'));
app.use('/users', userRoute);
app.use('/auth',  authRoute);
app.use('/posts', postRoute);
app.use('/comments', commentRoute);
app.use('/users', apiRouter);  

app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    //console.log(r.route.path)
  }
})

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  console.log("Production!");

  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/', function (req, res) {
  res.sendFile(
      path.resolve(__dirname, '../', 'client', 'build', 'index.html')
    )}
  );
  app.get('/', (req, res) => res.send('DONE'));
  
} else {

  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/', (req, res) => res.send('Please set to production'));
  console.log("Development!");

}

// SocialApp

// Swagger
app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true, customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",}));

// Admin
app.use(expressValidator());
app.use(cors()); 
app.use(fileUpload()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));  
app.use(express.static(path.join(__dirname  +'/public')));
app.use(express.static(__dirname +'/public')); 
app.use(flash())
app.use(cookieParser()); 
app.use(expressSession({secret: 'D%$*&^lk32', resave: false,saveUninitialized: true})); 
app.use(function (req, res, next) {res.header('Content-Type', 'application/json');  next();});   
app.use(bodyParser.json());  
app.use(express.urlencoded({limit: '100mb',extended: true }));
app.get('/text/', (req, res) => {
  res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});
app.use('/admin/', apiRouter);   

app.listen(port, () => console.log(`Server started on port ${port} and ${nodeSiteUrl}`));     

process.on('uncaughtException', function (err) { 
  console.log('Caught exception: ' + err);
}); 



