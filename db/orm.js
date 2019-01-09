const connection = require('./connection.js')

const orm = (() => {

    const questions = num => Array(num).fill('?').toString();
    const dblQuestions = num => Array(num).fill('??').toString();
    const multQuestions = num => Array(num).fill('(?, ?)').toString();

    const sqlVals = object => {
        let arrPairs = Object.entries(object)
        return arrPairs.map(x => `${x[0]} = '${x[1]}'`).join(', ');
    }

    const selectAll = table => {
        return new Promise((resolve, reject) => {
            let queryString = `SELECT * FROM ${table};`;
            connection.query(queryString, (err, res) => {
                if (err) reject(err);
                resolve(res)
            })
        })
    }

    const selectSome = (table, ...cols) => {
        return new Promise((resolve, reject) => {
            let colList = cols.join(', ')
            let queryString = `SELECT ${colList} FROM ${table}`
            connection.query(queryString, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }

    const selectSomeWhere = (table, whereCol, whereVal, selectCols) => {
        return new Promise((resolve, reject) => {            
            let queryString = `SELECT ${dblQuestions(selectCols.length)} FROM ${table} WHERE ?? = ?`;
            let vals = [...selectCols, whereCol, whereVal]
            connection.query(queryString, vals, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const selectSomeWhereOrderBy = (table, whereCol, whereVal, selectCols, orderCol) => {
        return new Promise((resolve, reject) => {            
            let queryString = `SELECT ${dblQuestions(selectCols.length)} FROM ${table} WHERE ?? = ? ORDER BY ??`;
            let vals = [...selectCols, whereCol, whereVal, orderCol]
            connection.query(queryString, vals, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const selectSomeJoin = (table1, table2, t1Cols, t2Cols, t1Key, t2Key, conditionCol, conditionVal) => {
        return new Promise((resolve, reject) => {
            let table1Selectors = t1Cols.map(value => `${table1}.${value}`)
            let table2Selectors = t2Cols.map(value => `${table2}.${value}`)
            let selectors = [...table1Selectors, ...table2Selectors]
            let queryString = `SELECT ${dblQuestions(selectors.length)} FROM ?? INNER JOIN ?? ON ?? = ?? WHERE ?? = ?`
            let vals = [...table1Selectors, ...table2Selectors, table1, table2, t1Key, t2Key, conditionCol, conditionVal]
            connection.query(queryString, vals, (err, res) => {
                if (err) reject(err);
                resolve(res)
            })
        })
    }

    const selectTripleJoin = (joinTable, joinTableCol1, joinTableCol2, table1, table2, t1Cols, t2Cols, conditionVal) => {
        return new Promise((resolve, reject) => {
            const joinTableSelector = `${joinTable}.${joinTableCol1}` 
            const joinTableSelector2 = `${joinTable}.${joinTableCol2}`
            const table1Selectors = t1Cols.map(value => `${table1}.${value}`)
            const table2Selectors = t2Cols.map(value => `${table2}.${value}`)
            const selectors = [...table1Selectors, ...table2Selectors]
            const t1Key = `${table1}.id`
            const t2Key = `${table2}.id`
            const queryString = `SELECT ${dblQuestions(selectors.length)} FROM ?? JOIN ?? ON ?? = ?? JOIN ?? ON ?? = ?? WHERE ?? = ?`
            const vals = [...selectors, joinTable, table1, joinTableSelector, t1Key, table2, joinTableSelector2, t2Key, joinTableSelector, conditionVal]
            connection.query(queryString, vals, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        }
    )}


    const insertOne = (table, cols, vals) => {
        return new Promise((resolve, reject) => {
            let queryString = `INSERT INTO ${table} (${cols.toString()}) VALUES (${questions(vals.length)});`;
            connection.query(queryString, vals, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const insertMany = (table, cols, vals) => {
        const questionString = multQuestions(vals.length)
        const valArray = vals.reduce((acc, val) => acc.concat(val))
        console.log(questionString, valArray)
        return new Promise((resolve, reject) => {
            let queryString = `INSERT INTO ${table} (${cols.toString()}) VALUES ${questionString};`;
            console.log(queryString)
            connection.query(queryString, valArray, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const updateOne = (table, vals, condition) => {
        return new Promise((resolve, reject) => {
            let queryString = `UPDATE ${table} SET ${sqlVals(vals)} WHERE ${condition};`;
            connection.query(queryString, (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const deleteOne = (table, condition) => {
        return new Promise((resolve, reject) => {
            let queryString = `DELETE FROM ?? WHERE ${condition}`
            connection.query(queryString, [table], (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    const deleteOneTwoCond = (table, condition1, condition2) => {
        return new Promise((resolve, reject) => {
            let queryString = `DELETE FROM ?? WHERE ${condition1} AND ${condition2}`
            connection.query(queryString, [table], (err, res) => {
                if (err) reject(err);
                resolve(res);
            })
        })
    }

    return {
        selectAll,
        selectSome,
        selectSomeWhere,
        insertOne,
        insertMany,
        updateOne,
        selectSomeJoin,
        deleteOne,
        deleteOneTwoCond,
        selectTripleJoin,
        selectSomeWhereOrderBy
    }

})()

// orm.insertMany('bandsgenres', ['bandsid', 'genre'], [[6,3], [6,4]])
module.exports = orm;