const Datastore = require('nedb-promises');


const dbFactory = (userDataPath, fileName) =>
{
    // Change back user path
    return Datastore.create(
        {
            filename: `${userDataPath ? userDataPath : '.'}/data/${fileName}`,
            timestampData: true,
            // autoload: true
        })
}

const pushClip = async (db, Clip) =>
{
    const c =  await db.insert(Clip);
    const all = await findAll(db);
    console.log("FINDINGS", all)
}

const findAll = async (db) =>
{
    return await db.find({});
}

module.exports = { 
    dbFactory,
    pushClip,
    findAll
 };