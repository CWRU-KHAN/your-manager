const { selectSomeWhere, selectSomeJoin, insertOne, updateOne, deleteOne } = require('./orm')
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

  const translateDbErr = ({ errno }) => {
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

    return {error: errorTable[errno]}

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
        .catch(err => console.log(err))
    })
  }



  // adds a new user to the database, takes a user object
  const addNewUser = user => {
    const { password, userName, email, firstname = null, lastname = null } = user
    return bcrypt.hash(password, saltRounds)
    .then(hash => {
      return insertOne('users', 
                      ['username', 'email', 'password',  'firstname', 'lastname'], 
                      [userName, email, hash,  firstname, lastname])
    })
    .then(results => {
      if (results.affectedRows === 0) throw new Error(`500: User '${userName}' not added.`)
      return results
    })
    // .catch(({ errno, code }) => {
    //   return {
    //     error: {
    //       errno,
    //       code
    //     }        
    //   }
    // })
    .catch(translateDbErr)
  }

  // adds a band to the database, takes a band object
  const addNewBand = ({ bandName, id }) => {
    return insertOne(
      'bands',
      ['bandname', 'ownerid'],
      [bandName, id]
      )
    .then(x => console.log(x))
    .catch(x => console.log(x))
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




  // Handles errors that are thrown by MySQL. Stick this in the catch block to 'translate' them
  // const dbErrorHandler = error => {
  //   const errorInfo = {
  //     1062: 'Sorry, this name is already taken, please choose another.',
  //     1048: 'Missing information, ensure all fields are filled out.',
  //     1452: 'The parent user or portfolio in question does not exist.'
  //   }
  //   let message = errorInfo[error.errno] || `Undocumented error code ${error.errno || error}`
  //   console.log(message)
  // }


  // public methods
  return {
    checkUserName,
    addNewUser,
    updateUser,
    // dbErrorHandler,
    deleteUser,
    authUser,
    addNewBand
  }
})()

module.exports = dbLib