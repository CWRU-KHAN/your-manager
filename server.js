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
const { addNewUser, 
  authUser, 
  addNewBand, 
  addNewEvent, 
  addNewBE,
  addNewBM,
  getBandInfo,
  updateUser, 
  deleteUser } = require('./db/dbLib')


// test route plz ignore
app.get('/api/user/:username', (req, res) => {
  console.log(req.params)
  res.send('ok computer')
})


// user login
app.post('/api/auth/', (req, res) => {
  if (!(req.body.userName && req.body.password)) {
    return res
      .status(409)
      .send('Please fill out both username and password.')
  }

  authUser(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))

})

// add a new user
app.post('/api/user/', (req, res) => {
  addNewUser(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// add a new band
app.post('/api/band/', (req, res) => {
  addNewBand(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// add a new event
app.post('/api/event/', (req, res) => {
  addNewEvent(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// add that a user is a member of a band
app.post('/api/bandmate/', (req, res) => {
  addNewBM(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// add that a band is a member of an event
app.post('/api/bandevent/', (req, res) => {
  addNewBE(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// get info on a specific band
app.get('/api/band/:id', (req, res) => {
  getBandInfo({bandsid: req.params.id})
    .then(results => {
      if (results.error) throw results.error
      const parsedResults = results.reduce((acc, entry) => {
        const { username, id, ...rest } = entry
        return acc.bandname ? 
          {
            ...rest,
            users: acc.users.concat({username, id})
          } :
          {
            ...rest,
            users: [{username, id}]
          }
      }, {})
      res.json(parsedResults)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

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