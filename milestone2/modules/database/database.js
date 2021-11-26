const configs = require('./config');
const database_file = configs.database_name;
const fs = require('fs').promises;

const insert = (collectionName, jsonData) => {
    return new Promise((resolve, reject) => {
        if (typeof jsonData !== 'object' || Array.isArray(jsonData) || jsonData === null) {
            return reject("Database Insert Error: Inserting data is not a valid object!");
        }
        fs.readFile(database_file, 'utf-8')
            .then(data => {
                let parsedData = JSON.parse(data);

                return {
                    data: parsedData,
                    collectionArray: (parsedData[collectionName] !== undefined) ? parsedData[collectionName] : []
                }
            })
            .then(dataAndCollection => {
                const {data, collectionArray} = dataAndCollection;
                collectionArray.push(jsonData);
                data[collectionName] = collectionArray;
                return JSON.stringify(data);
            })
            .then(newData => fs.writeFile(database_file, newData))
            .then(() => resolve(jsonData))
            .catch(error => reject(error))
    })
}

const deleteById = (collectionName, id) => {
    return new Promise((resolve, reject) => {
        if (typeof id !== 'string') {
            return reject("Database DeleteById Error: Id value is not a valid id");
        }
        fs.readFile(database_file, 'utf-8')
            .then(data => {
                let parsedData = JSON.parse(data);

                return {
                    data: parsedData,
                    collectionArray: (parsedData[collectionName] !== undefined) ? parsedData[collectionName].filter(row => row.id !== id) : []
                }
            })
            .then(dataAndCollection => {
                const {data, collectionArray} = dataAndCollection;
                data[collectionName] = collectionArray;
                return JSON.stringify(data)
            })
            .then(newData => fs.writeFile(database_file, newData))
            .then(() => resolve(id))
            .catch(error => reject(error))
    })
}

// insert('users',{'asdf':true})
// deleteById('users', '54')

module.exports = {
    insert,
    deleteById
}