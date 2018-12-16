const path = require('path');
const express = require('express');
const multer  = require('multer');
const upload = multer({
    dest: 'uploads/'
});
require('dotenv').config()
const cloudinary = require('cloudinary')
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('./dist'))





// Cloudinary Image processing

// app.post('/api/upload', upload.single('uploadProjectImg'), (req, res) => {
  app.post('/api/upload', upload.single('file'), (req, res) => {
    cloudinary.uploader.upload(req.file.path, (result) => {
        res.send(result.url)
    })
})


app.get('*', (_, res) => {
res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 8080;
app.listen(PORT);