const { selectSomeWhere, selectSomeWhereOrderBy, selectSomeJoin, insertOne, updateOne, deleteOne, selectTripleJoin } = require('./orm')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10


const dbLib = (() => {

  // jwt params
  const loginOptions = { expiresIn: '2d', issuer: 'https://your-manager.herokuapp.com' }
  const bandOptions = { expiresIn: '10y', issuer: 'https://your-manager.herokuapp.com' }
  const testOptions = { expiresIn: '5s', issuer: 'https://your-manager.herokuapp.com' }
  const secret = process.env.JWT_SECRET
  const practice = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYW5kc2lkIjoxLCJpYXQiOjE1NDUyNDQ0NDgsImV4cCI6MTg2MDgyMDQ0OCwiaXNzIjoiaHR0cHM6Ly95b3VyLW1hbmFnZXIuaGVyb2t1YXBwLmNvbSJ9.Mk5dqp1SwN6oQG1DqwR6T4gUQ3-Q19RvUjExPYTVTLY'
  const expiredPractice = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJiYW5kc2lkIjoxLCJpYXQiOjE1NDUyNDYzMzAsImV4cCI6MTU0NTI0NjMzNSwiaXNzIjoiaHR0cHM6Ly95b3VyLW1hbmFnZXIuaGVyb2t1YXBwLmNvbSJ9.AMRq152u9vJfll0dbVSJEmUmLND9hUyL52L1Iq-iRNs'

  const verifyToken = (userName, token) => {    
    const result = jwt.verify(token, secret, loginOptions)
    if (userName !== result.user) throw {
      code: 403,
      message: `Access forbidden.`
    }
    return result
  }

  const translateDbErr = error => {
    const { errno } = error
    const errorTable = {
      1062: {
        message: 'Sorry, this name is already taken, please choose another.',
        code: 409
      },
      1048: {
        message: 'Missing information, ensure all fields are filled out.',
        code: 409
      }
    }

    return errno ? {error: errorTable[errno]} : error
  }

  const checkUserName = name => {
    return selectSomeWhere('users', 'username', name, ['username'])
    .then(data => !data.length)
  }

  // generate a token for use in joining a band
  const createBandToken = ({ bandsid }) => {
    const token = jwt.sign({ bandsid }, secret, bandOptions)
    return token
  }



  const authUser = ({ userName, password }) => {

    return selectSomeWhere('users', 'username', userName, ['username', 'password', 'id'])
    .then(data => {
      if (data.length === 0) return {
        code: 404,
        message: `The username '${userName}' is incorrect.`,
        auth: false
      }

      return bcrypt.compare(password, data[0].password)
        .then(valid => {
          if (!valid) return {
            code: 403,
            message: 'The password you entered is incorrect.',
            auth: false
          }
          const token = jwt.sign({ user: userName }, secret, loginOptions)
          return {
            code: 200,
            auth: true,
            token,
            userName,
            usersid: data[0].id
          }
        })
    })
  }

  // adds a new user to the database, takes a user object
  const addNewUser = user => {
    const { password, userName, email, firstname = null, lastname = null } = user
    return bcrypt.hash(password, saltRounds)
      .then(hash => {
        return insertOne(
          'users', 
          ['username', 'email', 'password',  'firstname', 'lastname'], 
          [userName, email, hash, firstname, lastname])
      })
      .then(results => {
        if (results.affectedRows === 0) throw new Error(`500: User '${userName}' not added.`)
        return results
      })
      .catch(translateDbErr)
  }

  // adds a band to the database, takes a band object
  const addNewBand = ({ bandName, usersid, token, userName }) => {
    verifyToken(userName, token)
    return insertOne(
      'bands',
      ['bandname', 'ownerid'],
      [bandName, usersid]
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error(`500: Band '${bandName}' not added.`)
        return results
      })
      .catch(translateDbErr)
  }

  // adds an event to the database, takes an event object
  const addNewEvent = ({ eventName, date, time, eventLocation, usersid, token, userName }) => {
    verifyToken(userName, token)
    return insertOne(
      'events',
      ['eventname', 'date', 'time', 'eventlocation', 'ownerid'],
      [eventName, date, time, eventLocation, usersid]
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error(`500: Event '${eventName}' not added.`)
        return results
      })
      .catch(translateDbErr)
  }

  // adds a bandevent, takes an object with a bandsid and a eventsid
  const addNewBE = ({ bandsid, eventsid, token, userName}) => {
    verifyToken(userName, token)
    return insertOne(
      'bandsevents',
      ['bandsid', 'eventsid'],
      [bandsid, eventsid]
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: Band not added to event.')
        return results
      })
      .catch(translateDbErr)
  }

  // adds a bandmate, takes an object with a bandsid and a usersid
  const addNewBM = ({ token, usersid }) => {
    const verified = {}
    try {
      verified.results = jwt.verify(token, secret, bandOptions)
    } catch(error) {
      verified.results = false
    }
    return verified.results ? insertOne(
      'bandmates',
      ['bandsid', 'usersid'],
      [verified.results.bandsid, usersid]
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: User not added to band.')
        return results
      })
      .catch(translateDbErr)
      : Promise.reject({code: 409, message: 'Invalid Token'})
  }

  // adds a new external band for populating an event
  const addNewExternalBand = ({ token, bandName, bandURL = '', eventsid, userName }) => {
    verifyToken(userName, token)
    return insertOne(
      'externalbands',
      ['eventsid', 'bandname', 'bandurl'],
      [eventsid, bandName, bandURL]
    )      
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: Band not added to event.')
        return results
      })
      .catch(translateDbErr)
  }

  // adds a new note
  const addNewNote = ({ token, userName, bandsid, usersid, calendarDate, noteTitle = 'Untitled', noteBody }) => {
    verifyToken(userName, token)
    const postedAt = new Date
    return insertOne(
      'notes',
      ['usersid', 'bandsid', 'notetitle', 'notebody', 'calendardate', 'postedat'],
      [usersid, bandsid, noteTitle, noteBody, calendarDate, postedAt]
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: Note not added.')
        return results
      })
      .catch(translateDbErr)
  }

  // gets a band token for sharing
  const addNewBandToken = ({ token, userName, bandsid }) => {
    return new Promise((resolve, reject) => {
      verifyToken(userName, token)
      resolve(createBandToken({ bandsid }))
    })
  }

  // gets info on a band
  const getBandInfo = ({ bandsid }) => {
    return Promise.all([
      selectTripleJoin(
        'bandmates',
        'bandsid',
        'usersid', 
        'bands', 
        'users', 
        ['bandname', 'bandimage', 'genre', 'ownerid'], 
        ['username', 'id'], 
        bandsid
      ),
      selectTripleJoin(
        'bandsevents',
        'bandsid',
        'eventsid', 
        'bands', 
        'events', 
        [], 
        ['eventname', 'id'], 
        bandsid
      )]
    )
      .then(results => {
        if (results[0].affectedRows === 0) throw new Error('500: Not a valid band.')
        return results
      })
      .catch(translateDbErr)
  }

  // gets info on a user
  const getUserInfo = ({ usersid }) => {
    return selectTripleJoin(
      'bandmates',
      'usersid',
      'bandsid',
      'users',
      'bands',
      ['username', 'email', 'userimage', 'firstname', 'lastname'],
      ['bandname', 'id'],
      usersid
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: Not a valid user.')
        return results
      })
      .catch(translateDbErr)
  }

  // gets info on an event
  const getEventInfo = ({ eventsid }) => {
    return Promise.all([
      selectTripleJoin(
        'bandsevents',
        'eventsid',
        'bandsid',
        'events',
        'bands',
        ['eventname', 'eventdescription', 'date', 'time', 'eventlocation'],
        ['bandname', 'id'],
        eventsid
      ),
      selectSomeWhere(
        'externalbands',
        'eventsid',
        eventsid,
        ['bandname', 'bandurl']
      )
    ])
      .then(results => {
        if (results[0].affectedRows === 0) throw new Error('500: No results for specified event.')
        return results
      })
      .catch(translateDbErr)
  }

  // gets calendar details
  const getCalendarInfo = ({ bandsid }) => {
    // verifyToken(userName, token)
    return Promise.all([
      selectTripleJoin(
        'bandsevents',
        'bandsid',
        'eventsid',
        'bands',
        'events',
        ['bandname'],
        ['eventname', 'eventdescription', 'date', 'time', 'eventlocation'],
        bandsid
      ),
      selectSomeWhere(
        'notes',
        'bandsid',
        bandsid,
        ['id', 'usersid', 'bandsid', 'notetitle', 'notebody', 'calendardate', 'postedat']
      )
    ])    
  }

  // gets notes relevant to a user
  // const getUserNotes = ({ token, userName, usersid })

  // updates user information, takes a user object with two keys: userName and updates.
  // updates should be an object with key/value pairs corresponding to column names/values to be updated
  // returns confirmation message
  const updateUser = ({ userName, updates, token }) => {
    verifyToken(userName, token)
    return updateOne('users', updates, `username = '${userName}'`)
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: No rows updated.')
      return results
    })
  }
  
  const deleteUser = ({ userName, token }) => {
    verifyToken(userName, token)
    return deleteOne('users', `username = '${userName}'`)
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: No user deleted.')
      return results
    })
  }



  // public methods
  return {
    checkUserName,
    addNewUser,
    updateUser,
    deleteUser,
    authUser,
    addNewBand,
    addNewEvent,
    addNewBE,
    addNewBM,
    addNewNote,
    addNewExternalBand,
    addNewBandToken,
    getBandInfo,
    getUserInfo,
    getEventInfo,
    getCalendarInfo,
    // createBandToken,
  }

})()

// selectTripleJoin('bandmates', 'bandsid', 'usersid', 'bands', 'users', ['bandname'], ['username'], 1).then(x => console.log(x)).catch(x => console.log(x))


// console.log(dbLib.createBandToken({bandsid: 1}))
// dbLib.addNewNote()

module.exports = dbLib