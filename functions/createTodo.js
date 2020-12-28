const faunadb = require('faunadb'),
  q = faunadb.query;

const dotenv =  require("dotenv");
dotenv.config();


exports.handler = async function(event, context) {
    try{
    let reqObject = JSON.parse(event.body);

    const client = new faunadb.Client({secret:  process.env.GATSBY_FAUNADB_SECRET});

    let result = await client.query(
        q.Create(
             q.Collection("crud"),
            {data: {message: reqObject.message}}
        )
    )

    console.log("Entry is successfully Created with following ID " + result.ref.id);

    return {
        statusCode: 200,
        body: JSON.stringify({id: `${result.ref.id}` })
    }

    } catch(error) {

        return { statusCode: 400 ,  body: `${error.toString()}`}

    }
}