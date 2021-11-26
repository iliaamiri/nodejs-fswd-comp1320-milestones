const database = require('../modules/database/database');
const userCollectionName = 'users';

const formCreationSubmit = (req, res) => {
    new Promise((resolve, reject) => {
        const postParams = req.body['mainForm'];

        if (postParams === undefined) {
            return reject("Please enter your full name");
        }

        if (!postParams.hasOwnProperty('fullName')) {
            return reject('Please enter your full name');
        } else if (!postParams.hasOwnProperty('aboutMe')) {
            return reject('Please enter your biography');
        } else if (!postParams.hasOwnProperty('knownTechnologies')) {
            return reject('Please enter your skills');
        } else if (!postParams.hasOwnProperty('githubUrl')) {
            return reject('Please enter your Github URL');
        } else if (!postParams.hasOwnProperty('twitterUrl')) {
            return reject('Please enter your Twitter URL');
        } else if (!postParams.hasOwnProperty('favouriteBooks')) {
            return reject('Please enter your Favourite Books');
        } else {
            const id = makeid(5);
            const fullName = postParams.fullName;
            const aboutMe = postParams.aboutMe;
            const skills = postParams.knownTechnologies;
            const githubUrl = postParams.githubUrl;
            const twitterUrl = postParams.twitterUrl;
            const favouriteBooks = postParams.favouriteBooks.split(',');

            const newUser = {
                id: id,
                fullName: fullName,
                aboutMe: aboutMe,
                knownTechnologies: skills,
                githubUrl: githubUrl,
                twitterUrl: twitterUrl,
                favoriteBooks: favouriteBooks
            }

            database.insert(userCollectionName, newUser)
                .then(() => resolve(newUser.id))
                .catch(err => reject(err));
        }
    }).then((id) => {
        res.end(JSON.stringify({
            status: true,
            msg: 'success',
            id: id
        }))
    }).catch(err => {
        res.end(JSON.stringify({
            status: false,
            msg: err.toString()
        }))
    });
}

const showUserById = (req, res) => {
    new Promise((resolve, reject) => {
        const userId = req.params.id;
        if (typeof userId !== 'string') {
            return reject("Error: Id value is not a valid id");
        }

        database.selectById(userCollectionName, userId)
            .then((user) => resolve(user))
            .catch((error) => reject(error))

    }).then(userData => {
        let firstName = userData.fullName.substr(0, userData.fullName.indexOf(" "));

        res.render('people', {
            userData: {
                all: userData,
                firstName: (firstName !== "") ? firstName : userData.fullName
            }
        })
    }).catch(err => {
        res.end(err.toString())
    })
}

const getIconByTitle = (req, res) => {
    new Promise((resolve, reject) => {
        const iconTitle = req.params.title;
        if (typeof iconTitle !== 'string') {
            return reject("Error: Icon does not exist");
        }

        database.searchByIconTitle(iconTitle)
            .then(result => resolve(result))
            .catch(err => reject(err))
    }).then(result => {
        res.end(JSON.stringify({
            status: true,
            icon: result
        }));
    }).catch(error => {
        res.end(JSON.stringify({
            status: false,
            error: error
        }))
    })
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports = {
    formCreationSubmit,
    showUserById,
    getIconByTitle
};