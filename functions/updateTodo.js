const faunadb = require('faunadb'),
  q = faunadb.query;

  require("dotenv").config()


exports.handler = async function(event, context) {
    try{

    let {message} = JSON.parse(event.body);
    const {id} = JSON.parse(event.body);
    console.log("id: ", id);
    console.log("req:", message);
   

    const client = new faunadb.Client({secret:  process.env.GATSBY_FAUNADB_SECRET});

    let result = await client.query(
        q.Update(
            q.Ref(q.Collection('crud'), id),
            { data: { message } },
          )
    )

    console.log("Entry successfully updated with following ID " + result.ref.id);

    return {
        statusCode: 200,
        body: JSON.stringify({id: `${result.ref.id}` })
    }

    } catch(error) {

        return { statusCode: 400 ,  body: `${error.toString()}`}

    }
}