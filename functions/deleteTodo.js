const faunadb = require("faunadb"),
  q = faunadb.query

const dotenv = require("dotenv")
dotenv.config()

exports.handler = async function (event, context) {
  var client = new faunadb.Client({ secret: process.env.GATSBY_FAUNADB_SECRET })
  try {
    const id = JSON.parse(event.body);
    console.log("from delete",event.body);
    var result = await client.query(q.Delete(q.Ref(q.Collection("crud"), id)));

    console.log(
      "Document deleted from the Container of Database: " + result.ref.id
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Document deleted from the Database" }),
    }
  } catch (error) {
    console.log("Error: ")
    console.log(error)
  }
}
