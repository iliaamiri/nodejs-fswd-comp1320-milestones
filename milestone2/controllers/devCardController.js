const database = require('../modules/database/database');
const userCollectionName = 'users';

const devCardController = (req, res) => {
    return new Promise((resolve, reject) => {
        const postParams = req.body['mainForm'];
        console.log(postParams)
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
            const skills = Object.keys(postParams.knownTechnologies);
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
                .then(() => resolve(''))
                .catch(err => reject(err));
        }
    })
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

module.exports = devCardController;