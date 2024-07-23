const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { graphqlHTTP } = require("express-graphql");
const db = require("./db");

const port = process.env.PORT || 9000;
const app = express();

// Read type definitions from schema.graphql
const typeDefs = fs.readFileSync("./schema.graphql", { encoding: "utf-8" });
const resolvers = require("./resolvers");

// Ensure typeDefs are correctly read
if (!typeDefs) {
	console.error("Error: typeDefs not provided");
	process.exit(1);
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(cors());
app.use(bodyParser.json());

// Set up GraphQL endpoint
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true, // This enables the GraphiQL interface
	})
);

// Set up GraphiQL endpoint (optional)
app.get("/graphiql", (req, res) => {
	res.redirect("/graphql");
});

app.listen(port, () => console.info(`Server started on port ${port}`));
