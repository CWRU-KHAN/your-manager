const { selectSomeWhere, selectSomeJoin, insertOne, updateOne, deleteOne, selectTripleJoin } = require('./orm')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10


const dbLib = (() => {

  // jwt params
  const options = { expiresIn: '2d', issuer: 'https://your-manager.herokuapp.com' }
  const secret = process.env.JWT_SECRET

  const verifyToken = (userName, token) => {    
    const result = jwt.verify(token, secret, options)
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
          const token = jwt.sign({ user: userName }, secret, options)
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
  const addNewBand = ({ bandName, usersid }) => {
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
  const addNewEvent = ({ eventName, date, time, eventLocation, usersid }) => {
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
  const addNewBE = ({ bandsid, eventsid}) => {
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
  const addNewBM = ({ bandsid, usersid }) => {
    return insertOne(
      'bandmates',
      ['bandsid', 'usersid'],
      [bandsid, usersid]
    )
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: User not added to band.')
      return results
    })
    .catch(translateDbErr)
  }


  // gets info on a band
  const getBandInfo = ({ bandsid }) => {
    return
  }

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
    addNewBM
  }

})()

// selectTripleJoin('bandmates', 'bandsid', 'bands', 'users', ['bandname'], ['username'], 2).then(x => console.log(x)).catch(x => console.log(x))


module.exports = dbLib