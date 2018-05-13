/*
@description - Interactions with MongoDB database hosted on mLabs.
@author - Brandon - Brandon.Murch@protonmail.com
*/
//config contains login information for mLabs MongoDB database.
const config = require('/Users/BrandonMurch/Documents/Programming/Github/Link-Shortener/Config/config.js');
const dbConnection = 'mongodb://' + config.DBConfig.username + ':'
  + encodeURIComponent(config.DBConfig.password) + config.DBConfig.url;
const mongo = require('mongodb').MongoClient;

//Promise that returns an array with all the links that match the search criteria
const databaseFindId = (value: number) => {
  let connectAndFind: any = new Promise(function(resolve: any, reject: any) {
    mongo.connect(dbConnection, async function(err: string, client: any) {
      try {
        const db = client.db('brandon');
        const linksDB = db.collection('links');
        let results = linksDB.find({ _id: value });
        let resultsArray: string[] = await results.toArray(function(err: string, docs: any) {
          if (err) throw err
          resolve(docs);
          results.close();
          client.close();
        })
        return resultsArray;
      } catch (err) {
        return reject(err);
      }
    });
  });
  return connectAndFind;
};

//Insert link into the database if link not found.
const databaseInsert = (itemInfo: any): void => {
  mongo.connect(dbConnection, function(err: string, client: any): void {
    try {
      const db = client.db('brandon');
      const linksDB = db.collection('links');
      linksDB.insert({
        _id: itemInfo[0],
        website: itemInfo[1],
        shortLink: itemInfo[2]
      })
      client.close();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }

  });
};

/*Hashing the input so there is a very small chance of duplication using a
combination of bitwise operators (left shift and zero-fill right shift)*/
const hashCode = (str: string): number => {
  var i,
    hashValue: any = 0x811c9dc5; // starting seed
  for (i = 0; i < str.length; i++) {
    hashValue ^= str.charCodeAt(i);
    hashValue += (hashValue << 1) + (hashValue << 4) + (hashValue << 7)
      + (hashValue << 8) + (hashValue << 24);
  }
  return hashValue >>> 0;
}

//Since most people won't insert http(s) before the link we must add it for them.
const addHttp = (link: string): string => {
  const httpRegEx = /^http(s)?:\/\//gi;
  return (!httpRegEx.exec(link) ? 'https://' + link : link);
};

//Entry point for the file. Determines what kind of link it is.
exports.handleLink = async (link: any) => {
  if (Number(link) % 1 == 0) { // if number, this means the link should already be in the database.
    try {
      let queryResults: any = await databaseFindId(parseInt(link));
      if (queryResults[0] != undefined) {
        return ['redirect', queryResults[0]['website']];
      } else {
        return ['display', 'Error: No website has been found.'];
      }
    }
    catch (err) {
      return err;
    }

  } else if (Number(link) % 1 != 0) { // if string, we must check if the website exists in the database
    try {
      let website = addHttp(link)
      let linkHash: number = hashCode(website);
      let shortLink: string = "https://link-shortener.glitch.me/L/" + linkHash;
      let databaseSearchResults = await databaseFindId(linkHash);
      if (databaseSearchResults[0] == undefined) { //Nothing found in DB
        databaseInsert([linkHash, website, shortLink]);
        return ['display', shortLink];
      } else { // website is already in DB
        return ['display', databaseSearchResults[0]['shortLink']];
      }
    }
    catch (err) {
      return err;
    }
  }
}
