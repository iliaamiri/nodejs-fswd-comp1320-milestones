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

const selectById = (collectionName, id) => {
    return new Promise((resolve, reject) => {
        fs.readFile(database_file, 'utf-8')
            .then(data => {
                const parsedData = JSON.parse(data);

                const collectionArray = parsedData[collectionName];

                if (collectionArray === undefined){
                    return reject('User does not exist');
                }

                const result = collectionArray.filter(row => row.id === id);

                return (result.length === 1) ? resolve(result[0]) : reject("User does not exist");
            }).catch(err => console.log(err))
    })
}

const searchByIconTitle = (iconTitle) => {
    return new Promise((resolve, reject) => {
        fs.readFile(database_file, 'utf-8')
            .then(data => {
                const parsedData = JSON.parse(data);

                const collectionArray = parsedData['skills'];

                if (collectionArray === undefined){
                    return reject('Icon does not exist');
                }

                const result = collectionArray.filter(row => (row.title.toLowerCase().includes(iconTitle.toLowerCase()) || row.title.toLowerCase() === iconTitle.toLowerCase()));

                return (result.length >= 1) ? resolve(result) : reject("Icon does not exist");
            }).catch(err => console.log(err))
    })
}

const deleteById = (collectionName, id) => {
    return new Promise((resolve, reject) => {
        fs.readFile(database_file, 'utf-8')
            .then(data => {
                const parsedData = JSON.parse(data);

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
    deleteById,
    selectById,
    searchByIconTitle
}