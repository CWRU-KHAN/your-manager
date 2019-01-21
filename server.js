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
  addNewExternalBand,
  addNewNote,
  markNoteAsRead,
  addNewBandToken,
  getBandInfo,
  getUserInfo,
  getEventInfo,
  getCalendarInfo,
  getUserNotes,
  getUserEvents,
  getNotesOnDate,
  updateUser,
  updateUserPassword,
  updateBand,
  updateEvent,
  deleteBand,
  deleteEvent,
  deleteBandMate,
  deleteBandEvent
} = require('./db/dbLib')




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
    .catch(err => res.status(200).send(err || 'Internal server error.'))

})

// add a new user
app.post('/api/user/', (req, res) => {
  addNewUser(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(200).send(err || 'Internal server error.'))
})

// add a new band
app.post('/api/band/', (req, res) => {
  addNewBand(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(200).send(err || 'Internal server error.'))
})

// add a new event
app.post('/api/event/', (req, res) => {
  addNewEvent(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(200).send(err || 'Internal server error.'))
})

// add that a user is a member of a band
app.post('/api/bandmate/', (req, res) => {
  addNewBM(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => {
      res.status(200).json(err || 'Internal server error.')
    })
})

// generate a token for joining a band
app.post('/api/bandtoken/', (req, res) => {
  addNewBandToken(req.body)
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

// add an external band to an event
app.post('/api/externalband/', (req, res) => {
  addNewExternalBand(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// add a new note
app.post('/api/note/', (req, res) => {
  addNewNote(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })
    .catch(err => res.status(200).send(err || 'Internal server error.'))
})

app.post('/api/readnote/', (req, res) => {
  markNoteAsRead(req.body)
    .then(results => {
      if (results.error) throw results.error
      res.json({success: true})
    })
    .catch(err => res.send(err.message))
})

// get info on a specific band
app.get('/api/band/:id', (req, res) => {
  const { usersid } = req.headers
  getBandInfo({ bandsid: req.params.id, usersid })
    .then(results => {
      if (results.error) throw results.error
      res.json(results)
    })    
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// get info on a specific user
app.get('/api/user/:id', (req, res) => {
  getUserInfo({ usersid: req.params.id })
    .then(results => {
      if (results.error) throw results.error
      const parsedResults = results.reduce((acc, entry) => {
        const { bandname, id, ...rest } = entry
        return acc.bands ? 
          {
            ...rest,
            bands: acc.bands.concat({ bandname, id })
          } :
          {
            ...rest,
            bands: [{ bandname, id }]
          }
      }, {})
      res.json(parsedResults)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// get info on a specific event
app.get('/api/event/:id', (req, res) => {
  getEventInfo({ eventsid: req.params.id })
    .then(results => {
      if (results.error) throw results.error
      const [ internalBands, externalBands ] = results
      const parsedResults = internalBands.reduce((acc, entry) => {
        const { bandname, id, ...rest } = entry
        return acc.internalBands ?
        {
          ...rest,
          internalBands: acc.internalBands.concat({ bandname, id })
        } :
        {
          ...rest,
          internalBands: [{ bandname, id }]
        }
      }, {})
      parsedResults.externalBands = externalBands

      res.json(parsedResults)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// get notes for a specific band for a specific day
app.get('/api/notedate/', (req, res) => {
  const { eventdate, bandsid, usersid } = req.headers
  getNotesOnDate({ eventdate, bandsid, usersid })
    .then(results => {
      res.json(results)
    })
    .catch(err => res.json(err))
})

// get calendar for a band
app.get('/api/calendar/:id', (req, res) => {
  getCalendarInfo({ bandsid: req.params.id })
    .then(results => {
      const parsedEvents = results[0].reduce((acc, cur) => {
        const currentDate = cur.date
        return acc[currentDate] ?
        acc.concat({[currentDate]: [cur, ...acc[currentDate]]})
        :
        acc.concat({[currentDate]: [cur]})
      }, [])
      const parsedNotes = results[1].reduce((acc, cur) => {
        const currentDate = cur.calendardate
        if (acc[currentDate]) {
          acc[currentDate] = acc[currentDate].concat(cur)
          return acc
        }
        return {...acc, [currentDate]: [cur]}
      }, {})
      res.json({events: parsedEvents, notes: parsedNotes})
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))

})

// get notes for a user
app.get('/api/usernotes/:id', (req, res) => {
  getUserNotes({usersid: req.params.id}).then(results => {
    const parsed = results.map(result => {
      if (result.length === 0) return result
      return {
        name: result[0].bandname,
        bandsid: result[0].id,
        notes: result
      }      
    })
      res.json(parsed)
    })
    .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// get dashboard information for a user
app.get('/api/userdashboard/:id', (req, res) => {
  return Promise.all([
    getUserInfo({ usersid: req.params.id })
    .then(userRes => userRes.reduce((acc, entry) => {
      const { bandname, id, ...rest } = entry
      return acc.bands ? 
        {
          ...rest,
          bands: acc.bands.concat({ bandname, id })
        } :
        {
          ...rest,
          bands: [{ bandname, id }]
        }
    }, {})),
    getUserNotes({ usersid: req.params.id })
      .then(notesRes => {
        return notesRes.map(result => {
          if (result.length === 0) return result
          return {
            name: result[0].bandname,
            bandsid: result[0].id,
            notes: result
          }      
        }
      )
    }),
    getUserEvents({ usersid: req.params.id })
      .then(eventsRes => {
        if (!eventsRes.length) return eventsRes
        return eventsRes.map(result => {
        if (result.length === 0) return result
          return {
            name: result[0].bandname,
            events: result
          }
      })
    })
  ])
  .then(results => res.json(results))
})

// update a user's personal info
app.put('/api/user/', (req, res) => {
  updateUser(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows > 0)
  })
  .catch(err => res.json(err))
})

// update a user's password
app.put('/api/user/password', (req, res) => {
  updateUserPassword(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows === 1)
  })
  .catch(err => res.json(err))
})

// update a band's details
app.put('/api/band/', (req, res) => {
  updateBand(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows > 0)
  })
  .catch(err => res.json(err))
})

// update an event's details
app.put('/api/event/', (req, res) => {
  updateEvent(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows > 0)
  })
  .catch(err => res.json(err))
})



// delete a band
app.delete('/api/band/', (req, res) => {
  deleteBand(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows === 1)
  })
  .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// delete an event
app.delete('/api/event/', (req, res) => {
  deleteEvent(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows === 1)
  })
  .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})

// remove a user from bandmates
app.delete('/api/bandmate/', (req, res) => {
  deleteBandMate(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows === 1)
  })
  .catch(err => res.status(err.code || 500).send(err.message || 'Internal server error.'))
})



// remove a band from an event
app.delete('/api/bandevent/', (req, res) => {
  deleteBandEvent(req.body).then(results => {
    if (results.error) throw results.error
    res.send(results.affectedRows === 1)
  })
  .catch(err => res.json(err))
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

const PORT = process.env.PORT || 8081;
app.listen(PORT);