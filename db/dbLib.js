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


  const checkUserName = name => {
    return selectSomeWhere('users', 'username', name, ['username'])
    .then(data => !data.length)
  }




  // receives login info from the front end
  const authUser = ({ userName, password }) => {
    // SQL driver I wrote, returns the columns in the fourth argument
    return selectSomeWhere('users', 'username', userName, ['username', 'pw', 'id'])
    .then(data => {
      // check for username existing
      if (data.length === 0) return {
        code: 404,
        message: `The username '${userName}' is incorrect.`,
        auth: false
      }

      // bcrypt checks the submitted password with the hashed result on the server
      // I do it async since it is slow
      return {
        valid: bcrypt.compare(password, data[0].pw),
        data
      }
    })
    .then(({ valid, data }) => {
      console.log(valid)
      // if they dont match, return an error code
      if (!valid) return {
        code: 403,
        message: 'The password you entered is incorrect.',
        auth: false
      }

      // generate a token with jsonwebtoken (jwt), this is fast so I do it synchronously
      const token = jwt.sign({ user: userName }, secret, options)
      return {
        code: 200,
        auth: true,
        token,
        userName,
        usersid: data[0].id
      }
    })    
  }



  // adds a new user to the database, takes a user object with the following keys: 
  // userName, email, pw, preferences (JSON), location (optional), userImage (optional)
  // returns confirmation message
  const addNewUser = user => {
    const { location = null, userImage = null, linkedin = null, usergithuburl = null, userbio = null, pw, userName, email, firstname, lastname } = user
    const preferences = JSON.stringify(user.preferences)
    return bcrypt.hash(pw, saltRounds)
    .then(hash => {
      return insertOne('users', 
                      ['username', 'email', 'pw', 'preferences', 'location', 'userimage', 'firstname', 'lastname', 'linkedin', 'usergithuburl', 'userbio'], 
                      [userName, email, hash, preferences, location, userImage, firstname, lastname, linkedin, usergithuburl, userbio])
    })
    .then(results => {
      if (results.affectedRows === 0) throw new Error(`500: User '${userName}' not added.`)
      return results
    })
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
    getUserId,
    checkUserName,
    addNewUser,
    updateUser,
    // dbErrorHandler,
    deleteUser,
    authUser,
  }
})()

module.exports = dbLib