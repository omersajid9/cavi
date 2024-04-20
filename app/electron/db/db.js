const Datastore = require('nedb-promises');
const sound = require("sound-play");
const path = require("path");

const dbFactory = (userDataPath, fileName) =>
{
    // Change back user path
    return Datastore.create(
        {
            filename: `${userDataPath ? userDataPath : '.'}/data/${fileName}`,
            timestampData: true,
            autoload: true
        })
}


const pushHotKey = async (db, text, idx) =>
{
    db.count({key: idx}).then( async (val) =>
    {
        if (val > 0)
        {
            await db.deleteMany({ key: idx });
        }
        sound.play(path.join(__dirname, "../../../resources/sonds/copy.mp3"));
        await db.insert({key:idx, text: text});
    })
}

const getHotKey = async (db, idx) =>
{
    const ret = await db.find({key: idx});
    return ret;
}

const pushClip = async (db, Clip) =>
{    
    if (Clip && Clip.snippet.text && Clip.snippet.text.length > 0) 
    {
        db.count({"snippet.text": Clip.snippet.text, "snippet.title": Clip.snippet.title}).then( async (val) =>
        {
            if (val > 0)
            {
                await db.deleteMany({ "snippet.text": Clip.snippet.text, "snippet.title": Clip.snippet.title });
            }
            sound.play(path.join(__dirname, "../../../resources/sonds/copy.mp3"));
            await db.insert(Clip);
        })
    }
}

const deleteClip = async (db, id) =>
{
    await db.deleteOne({ _id: id })
}

const findAll = async (db) =>
{
    return await db.find({}).sort({createdAt: -1});
}

module.exports = { 
    dbFactory,
    pushClip,
    findAll,
    pushHotKey,
    getHotKey,
    deleteClip
 };
 


