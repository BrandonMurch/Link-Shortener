const config = require('/Users/BrandonMurch/Documents/Programming/Github/Link-Shortener/Config/config.js');
const dbConnection = 'mongodb://' + config.DBConfig.username + ':'
    + encodeURIComponent(config.DBConfig.password) + config.DBConfig.url;
const mongo = require('mongodb').MongoClient;
const databaseFindId = (value) => {
    let connectAndFind = new Promise(function (resolve, reject) {
        mongo.connect(dbConnection, async function (err, client) {
            try {
                const db = client.db('brandon');
                const linksDB = db.collection('links');
                let results = linksDB.find({ _id: value });
                let resultsArray = await results.toArray(function (err, docs) {
                    if (err)
                        throw err;
                    resolve(docs);
                    results.close();
                    client.close();
                });
                return resultsArray;
            }
            catch (err) {
                return reject(err);
            }
        });
    });
    return connectAndFind;
};
const databaseInsert = (itemInfo) => {
    mongo.connect(dbConnection, function (err, client) {
        try {
            const db = client.db('brandon');
            const linksDB = db.collection('links');
            linksDB.insert({
                _id: itemInfo[0],
                website: itemInfo[1],
                shortLink: itemInfo[2]
            });
            client.close();
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
    });
};
const hashCode = (str) => {
    var i, hashValue = 0x811c9dc5;
    for (i = 0; i < str.length; i++) {
        hashValue ^= str.charCodeAt(i);
        hashValue += (hashValue << 1) + (hashValue << 4) + (hashValue << 7)
            + (hashValue << 8) + (hashValue << 24);
    }
    return hashValue >>> 0;
};
const addHttp = (link) => {
    const httpRegEx = /^http(s)?:\/\//gi;
    return (!httpRegEx.exec(link) ? 'https://' + link : link);
};
exports.handleLink = async (link) => {
    if (Number(link) % 1 == 0) {
        try {
            let queryResults = await databaseFindId(parseInt(link));
            if (queryResults[0] != undefined) {
                return ['redirect', queryResults[0]['website']];
            }
            else {
                return ['display', 'Error: No website has been found.'];
            }
        }
        catch (err) {
            return err;
        }
    }
    else if (Number(link) % 1 != 0) {
        try {
            let website = addHttp(link);
            let linkHash = hashCode(website);
            let shortLink = "https://link-shortener.glitch.me/L/" + linkHash;
            let databaseSearchResults = await databaseFindId(linkHash);
            if (databaseSearchResults[0] == undefined) {
                databaseInsert([linkHash, website, shortLink]);
                let response = {
                    '_Id': linkHash,
                    'Website': website,
                    'Short Link': shortLink
                };
                return ['display', shortLink];
            }
            else if (databaseSearchResults[0]['_id'] == linkHash
                && databaseSearchResults[0]['website'] != website) {
                let duplicateOffset = 10 ** 16;
                return ['display', databaseSearchResults[0]['shortLink'] += duplicateOffset];
            }
            else {
                return ['display', databaseSearchResults[0]['shortLink']];
            }
        }
        catch (err) {
            return err;
        }
    }
};
//# sourceMappingURL=mongoDB.js.map