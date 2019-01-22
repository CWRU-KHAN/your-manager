const { 
  selectSomeWhere, 
  selectSomeWhereTwoCond,
  selectSomeWhereOrderBy, 
  selectSomeJoin, 
  insertOne, 
  insertMany, 
  updateOne, 
  deleteOne, 
  deleteOneTwoCond, 
  selectTripleJoin,
  selectJoinNotes } = require('./orm')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10
const moment = require('moment')


const dbLib = (() => {

  // jwt params
  const loginOptions = { expiresIn: '100d', issuer: 'https://your-manager.herokuapp.com' }
  const bandOptions = { expiresIn: '10y', issuer: 'https://your-manager.herokuapp.com' }
  const secret = process.env.JWT_SECRET

  // helper function to determine whether a username and token match
  const verifyToken = (userName, token) => {    
    const result = jwt.verify(token, secret, loginOptions)
    if (userName !== result.user) throw {
      code: 403,
      message: `Access forbidden.`
    }
    return result
  }

  // helper function to make sense of MySQL DB error codes
  const translateDbErr = error => {
    const { errno } = error
    const errorTable = {
      1062: {
        message: 'Sorry, this name or email address is already taken, please choose another.',
        code: 409
      },
      1048: {
        message: 'Missing information, ensure all fields are filled out.',
        code: 409
      }
    }
    

    return errno ? {error: errorTable[errno]} : error
  }


  // helper function to prune repeat entries in an array
  const filterUnique = (value, index, self) => self.indexOf(value) === index


  // generate a token for use in joining a band
  const createBandToken = ({ bandsid }) => {
    const token = jwt.sign({ bandsid }, secret, bandOptions)
    return token
  }



  const authUser = ({ userName, password }) => {

    return selectSomeWhere('users', 'username', userName, ['username', 'password', 'id'])
    .then(data => {
      if (data.length === 0) return {
        error: {
          code: 404,
          message: `The username '${userName}' is incorrect.`,
          auth: false
        }
      }

      return bcrypt.compare(password, data[0].password)
        .then(valid => {
          if (!valid) return {
            error: {
              code: 403,
              message: 'The password you entered is incorrect.',
              auth: false
            }
          }
          const token = jwt.sign({ user: userName }, secret, loginOptions)
          return {
            code: 200,
            auth: true,
            token,
            userName: data[0].username,
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
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Username or email address already in use.`
            }  
          }
       }
        return results
      })
      .catch(translateDbErr)
  }

  // adds a band to the database, takes a band object
  const addNewBand = ({ bandName, usersid, token, userName, genres, bandimage }) => {
    verifyToken(userName, token)
    return insertOne(
      'bands',
      ['bandname', 'ownerid', 'bandimage'],
      [bandName, usersid, bandimage]
    )
      .then(results => {
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Error. Band not created.`
            }  
          
          }
       }
        return Promise.all([
          results,
          insertOne(
            'bandmates',
            ['usersid', 'bandsid'],
            [usersid, results.insertId]
          )
        ])
      })
      .then(results => {
        if (!genres.length) return results
        const { insertId: bandsid } = results[0]
        const formattedGenres = genres.map(genre => [bandsid, genre])
        return insertMany(
          'bandsgenres',
          ['bandsid', 'genre'],
          formattedGenres
        )        
      })
      .then(({ insertId }) => {
        return {bandsid: insertId}
      })
      .catch(x => console.log(x))
  }

  // adds an event to the database, takes an event object

  const addNewEvent = ({ eventName, date, eventLocation, eventcity, eventstate, usersid, token, userName, eventimage, eventdescription, bandsid }) => {
    verifyToken(userName, token)
    return insertOne(
      'events',
      ['eventname', 'date', 'eventlocation', 'eventcity', 'eventstate', 'ownerid', 'eventdescription', 'eventimage'],
      [eventName, date, eventLocation, eventcity, eventstate, usersid, eventdescription, eventimage]
    )
    .then(({insertId}) => {
      return insertOne(
        'bandsevents',
        ['bandsid', 'eventsid'],
        [bandsid, insertId]
      )
    })
      .then(results => {
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Error. Event not created.`
            }  
          }
       }
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
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Error. Band member not added.`
            }  
          }
       }
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
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Error. Note not added.`
            }  
          }
       }
        return results
      })
      .catch(err => console.log(err))
  }


  // marks a note as read for a user
  const markNoteAsRead = ({ token, userName, usersid, notesid }) => {
    verifyToken(userName, token)
    return insertOne(
      'readnotes',
      ['usersid', 'notesid'],
      [usersid, notesid]
    )
      .then(results => {
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: 'Error: Note not marked as unread.'
            }
          }
        }
        return results
      })
      .catch(err => console.log(err))
  }

  // gets a band token for sharing
  const addNewBandToken = ({ token, userName, bandsid }) => {
    return new Promise((resolve, reject) => {
      verifyToken(userName, token)
      resolve(createBandToken({ bandsid }))
    })
  }

  // gets info on a band
  const getBandInfo = ({ bandsid, usersid }) => {
    return Promise.all([
      selectTripleJoin(
        'bandmates',
        'bandsid',
        'usersid', 
        'bands', 
        'users', 
        ['bandname', 'bandimage', 'genre', 'ownerid', 'description', 'id'], 
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
        ['eventname', 'id', 'date'], 
        bandsid
      ),
      selectSomeJoin(
        'notes',
        'bands',
        ['usersid', 'notetitle', 'notebody', 'calendardate', 'postedat', 'id'],
        [],
        'bands.id',
        'notes.bandsid',
        'bandsid',
        bandsid
      ),
      selectSomeWhere(
        'readnotes',
        'usersid',
        usersid,
        ['notesid']
      )]
    )
      .then(results => {        
        if (results[0].affectedRows === 0) throw new Error('500: Not a valid band.')
        const [bands, events, notes, notesMap] = results
        const notesList = notesMap.map(({ notesid }) => notesid)
        const modifiedNotes = notes.map(note => {
          note.read = notesList.includes(note.id)
          return note
        })
        return [bands, events, modifiedNotes]
      })
      .then(resultsArray => {
        const usersResults = resultsArray[0]      
        if (usersResults.error) throw usersResults.error
        const parsedResults = usersResults.reduce((acc, entry) => {
          const { username, id, ...rest } = entry
          return acc.users ? 
            {
              ...rest,
              users: acc.users.concat({ username, id })
            } :
            {
              ...rest,
              users: [{ username, id }]
            }
        }, {})
        parsedResults.events = resultsArray[1]
          .map(({ eventname, id, date }) => ({ eventname, id, date }))

        parsedResults.notes = resultsArray[2]        

        const userIdList = resultsArray[2].reduce((acc, cur) => {
            return acc.includes(cur.usersid) ? acc : acc.concat(cur.usersid)
          }, [])        
        .filter( filterUnique )
        
        return Promise.all([
          parsedResults,
          ...userIdList.map(id => {
            return selectSomeWhere(
              'users',
              'id',
              id,
              ['username', 'id']
            )
          })
        ])
      })

      .then(results => {

        const [dashboardInfo, ...userArray] = results  
        if (!userArray.length) return dashboardInfo
        const userMap = userArray
          .reduce((acc, cur) => acc.concat(cur))
          .reduce((acc, cur) => {
            const {id, username} = cur
            acc[id] = username
            return acc
          }, {})
  
        const modifiedNotes = dashboardInfo.notes.map(note => {
            note.author = userMap[note.usersid]
            return note
          }) 
        
        dashboardInfo.notes = modifiedNotes
        return dashboardInfo
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
        if (!results.length) {
          return selectSomeWhere(
            'users',
            'id',
            usersid,
            ['username', 'email', 'userimage', 'firstname', 'lastname']
          )
        }
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
        ['eventname', 'eventdescription', 'date', 'eventlocation', 'eventcity', 'eventstate', 'eventimage', 'ownerid'],
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

  // get notes for a specific day for a specific band
  const getNotesOnDate = ({ bandsid, eventdate, usersid }) => {
    return selectSomeJoin(
      'notes',
      'users',
      ['usersid', 'notetitle', 'notebody', 'calendardate', 'postedat', 'id'],
      ['username'],
      'notes.usersid',
      'users.id',
      'notes.bandsid',
      bandsid,
    )
    .then(results => {
      const trimmedDate = eventdate.slice(0,10)
      const relevantResults = results.filter(({ calendardate }) => {
        return moment(calendardate).format().slice(0,10) === trimmedDate
      })
      return Promise.all([
        relevantResults,
        selectSomeWhere(
          'readnotes',
          'usersid',
          usersid,
          ['notesid']
        )        
      ])
    })
    .then(results => {
      if (results.length === 1) return results[0]
      const [notes, noteArray] = results

      const noteList = noteArray
        .map(({ notesid }) => notesid)
        
      const modifiedNotes = notes.map(note => {
          note.read = noteList.includes(note.id)
          return note
        })     

      return modifiedNotes

      
    })
  }

  // gets calendar details
  const getCalendarInfo = ({ bandsid }) => {
    return Promise.all([
      selectTripleJoin(
        'bandsevents',
        'bandsid',
        'eventsid',
        'bands',
        'events',
        ['bandname'],
        ['eventname', 'eventdescription', 'date', 'eventlocation', 'eventcity', 'eventstate'],
        bandsid
      ),
      selectSomeWhere(
        'notes',
        'bandsid',
        bandsid,
        ['id', 'usersid', 'bandsid', 'notetitle', 'notebody', 'calendardate', 'postedat']
      )
    ])      
      .then(results => {
        if (results[0].affectedRows === 0) throw new Error('500: No results for this calendar.')
        return results
      })
      .catch(translateDbErr)    
  }

  // gets notes relevant to a user
  const getUserNotes = ({ usersid }) => {
    return selectSomeWhere(
      'bandmates',
      'usersid',
      usersid,
      ['bandsid']
    )
      .then(results => {
        if (results.affectedRows === 0) throw new Error('500: No associated bands for this user.')
        return Promise.all(        
          results.map(({ bandsid }) => {
            return selectSomeJoin(
              'notes',
              'bands',
              ['usersid', 'notetitle', 'notebody', 'calendardate', 'postedat', 'id'],
              ['bandname'],
              'bands.id',
              'notes.bandsid',
              'bandsid',
              bandsid
            )
          })
        )
      })

    .then(results => {
      const bandsWithNotes = results.filter(bandNotes => bandNotes.length)

      if (!bandsWithNotes.length) return [results]
      const userIdList = bandsWithNotes.map(band => {
        return band.reduce((acc, cur) => {
          return acc.includes(cur.usersid) ? acc : acc.concat(cur.usersid)
        }, [])
      })
      .reduce((acc,cur) => acc.concat(cur))
      .filter( filterUnique )

      return Promise.all([
        results,
        ...userIdList.map(id => {
          return selectSomeWhere(
            'users',
            'id',
            id,
            ['username', 'id']
          )
        })
      ])
    })
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: No associated notes for these bands.')
      if (results.length === 1) return results[0]
      const [bands, ...userArray] = results
      
      const userMap = userArray
        .reduce((acc, cur) => acc.concat(cur))
        .reduce((acc, cur) => {
          const {id, username} = cur
          acc[id] = username
          return acc
        }, {})

      const modifiedNotes = bands.map(band => {          
        if (band.length === 0) return band
        return band.map(note => {
          note.author = userMap[note.usersid]
          return note
        }) 
      })

      return modifiedNotes
    })
    .then(results => {
      return Promise.all([
        results,
        selectSomeWhere(
          'readnotes',
          'usersid',
          usersid,
          ['notesid']
        )        
      ])
    })
    .then(results => {
      if (results.length === 1) return results[0]
      const [bands, ...noteArray] = results

      const noteList = noteArray
        .reduce((acc, cur) => acc.concat(cur))
        .map(({ notesid }) => notesid)
        
      const modifiedNotes = bands.map(band => {
        if (band.length === 0) return band
        return band.map(note => {
          note.read = noteList.includes(note.id)
          return note
        })
      })

      return modifiedNotes
    })
    .catch(err => console.log(err))
  }

  // gets notes relevant to a user
  const getUserEvents = ({ usersid }) => {
    return selectSomeWhere(
      'bandmates',
      'usersid',
      usersid,
      ['bandsid']
    )
    .then(results => {
      return Promise.all(
        results.map(result => {
          return selectTripleJoin(
            'bandsevents',
            'bandsid',
            'eventsid', 
            'bands', 
            'events', 
            ['bandname'], 
            ['eventname', 'date', 'eventlocation', 'eventcity', 'eventstate', 'id', 'eventdescription', 'eventimage'],
            result.bandsid
          )
        })
      )
    })
      .then(results => {
        const testArray = results.reduce((a, b) => a.concat(b))

        if (!testArray.length) return []
        return results
      })
      .catch(translateDbErr)
  }

  // update user information
  const updateUser = ({ userName, updates, token }) => {
    verifyToken(userName, token)
    return updateOne('users', updates, `username = '${userName}'`)
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: No rows updated.')
      return results
    })
  }

  // update user password
  const updateUserPassword = ({ userName, token, currentPassword, newPassword, confirmPassword }) => {
    verifyToken(userName, token)
    let usersid = ''
    return selectSomeWhere('users', 'username', userName, ['username', 'password', 'id'])
    .then(data => {
      usersid = data[0].id
      return bcrypt.compare(currentPassword, data[0].password)
    })
    .then(valid => {
      if (!valid) return {
        error: {
          code: 403,
          message: 'The password you entered is incorrect.',
        }
      }
      if (newPassword !== confirmPassword) return {
        error: {
          message: "Passwords must match."
        }
      }
      return bcrypt.hash(newPassword, saltRounds)
      .then(hash => {
        return updateOne(
          'users', 
          {'password': hash},
          `id = '${usersid}'`)
      })
      .then(results => {
        if (results.affectedRows === 0) {
          return {
            error: {
              code: 403,
              message: `Password not updated.`
          }
        }
      }
        return results
      }) 
    })
    .catch(err => console.log(err))
  }

  // update band information
  const updateBand = ({ userName, updates, token, bandsid, usersid }) => {
    verifyToken(userName, token)
    return selectSomeWhere(
      'bands',
      'id',
      bandsid,
      ['ownerid', 'bandname']
    )
    .then(result => {
      const { ownerid, bandname } = result[0]
      if (ownerid !== usersid) return {
        error: {
          message: `You do not have permission to modify ${bandname}'s information.`,
        }
      }
      return updateOne(
        'bands',
        updates,
        `id = '${bandsid}'`
      )
    })
    .catch(err => console.log(err))
  }
  
  // update event information
  const updateEvent = ({ userName, updates, token, eventsid, usersid }) => {

    verifyToken(userName, token)
    return selectSomeWhere(
      'events', 
      'id',
      eventsid,
      ['ownerid', 'eventname']
    )
    .then(result => {
      const { ownerid, eventname } = result[0]
      // if (ownerid !== usersid) return {
      //   error: {
      //     message: `You do not have permission to modify ${eventname}.`
      //   }
      // }
      return updateOne(
        'events',
        updates,
        `id = '${eventsid}'`
      )
    })
    .catch(err => console.log(err))
  }

  const deleteUser = ({ userName, token }) => {
    verifyToken(userName, token)
    return deleteOne('users', `username = '${userName}'`)
    .then(results => {
      if (results.affectedRows === 0) throw new Error('500: No user deleted.')
      return results
    })
  }

  const deleteBand = ({ userName, bandsid, token }) => {
    verifyToken(userName, token)
    return selectSomeJoin(
      'bands',
      'users',
      [],
      ['username'],
      'bands.ownerid',
      'users.id',
      'bands.id',
      bandsid
    )
    .then(results => {
      return results.length > 0 && results[0].username === userName
    })
    .then(match => {
      if (!match) throw {
        error: {
          code: 403,
          message: 'You do not have permission to delete this band.'
        }
      }
      return deleteOne(
        'bands',
        `id = '${bandsid}'`
        )        
    })
    .catch(translateDbErr)
  }

  const deleteEvent = ({ userName, eventsid, token }) => {
    verifyToken(userName, token)
    return selectSomeJoin(
      'events',
      'users',
      [],
      ['username'],
      'events.ownerid',
      'users.id',
      'events.id',
      eventsid
    )
    .then(results => {
      return results.length > 0 && results[0].username === userName
    })
    .then(match => {
      if (!match) throw {
        error: {
          code: 403,
          message: 'You do not have permission to delete this event.'
        }
      }
      return deleteOne(
        'events',
        `id = '${eventsid}'`
        )        
    })
    .catch(translateDbErr)
  }

  const deleteBandMate = ({ userName, token, bandsid, usersid }) => {
    verifyToken(userName, token)
    return selectSomeJoin(
      'bands',
      'users',
      [],
      ['username'],
      'bands.ownerid',
      'users.id',
      'bands.id',
      bandsid
    )
    .then(results => {
      return results.length > 0 && results[0].username === userName
    })
    .then(match => {
      if (!match) throw {
        error: {
          code: 403,
          message: 'You do not have permission remove users from this band.'
        }
      }
      return deleteOneTwoCond(
        'bandmates',
        `bandsid = '${bandsid}'`,
        `usersid = '${usersid}'`
        )        
    })
    .catch(translateDbErr)
  }

  const deleteBandEvent = ({ userName, token, bandsid, eventsid, usersid }) => {
    verifyToken(userName, token)
    return selectSomeWhere(
      'events',
      'id',
      eventsid,
      ['ownerid', 'eventname']
    )
    .then(result => {
      const { ownerid, eventname } = result[0]
      if (ownerid !== usersid) return {
        error: {
          message: `You do not have permission to modify ${eventname}.`
        }
      }
      return deleteOneTwoCond(
        'bandsevents',
        `bandsid = '${bandsid}'`,
        `eventsid = '${eventsid}'`
      )
    })
    .catch(err => console.log(err))
  }




  // public methods
  return {
    addNewUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    authUser,
    addNewBand,
    updateBand,
    addNewEvent,
    updateEvent,
    addNewBE,
    addNewBM,
    addNewNote,
    markNoteAsRead,
    addNewExternalBand,
    addNewBandToken,
    getBandInfo,
    getUserInfo,
    getEventInfo,
    getCalendarInfo,
    getUserNotes,
    getUserEvents,
    getNotesOnDate,
    deleteBand,
    deleteEvent,
    deleteBandMate,
    deleteBandEvent
  }

})()


module.exports = dbLib