const faunadb = require('faunadb'),
  q = faunadb.query;

  require("dotenv").config()


exports.handler = async function(event, context) {
    try {
      var client = new faunadb.Client({   secret: process.env.GATSBY_FAUNADB_SECRET })
        var result = await client.query(
          q.Map(
              q.Paginate(q.Match(q.Index("crudd"))),
              q.Lambda((x) => q.Get(x))
            )
        );
        return{ 
            statusCode: 200,
            body: JSON.stringify(result.data),
        }
      } 
    catch(error) {

        return { statusCode: 400 ,  body: `${error.toString()}`}

    }
}