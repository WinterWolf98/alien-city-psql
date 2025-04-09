// /**
//  *
//  * @param {import('./types/basicio').Context} context
//  * @param {import('./types/basicio').BasicIO} basicIO
//  */
// module.exports = (context, basicIO) => {
// 	/*
//         BASICIO FUNCTIONALITIES
//     */
// 	basicIO.write('Hello from index.js'); //response stream (accepts only string, throws error if other than string)
// 	basicIO.getArgument('argument1'); // returns QUERY_PARAM[argument1] || BODY_JSON[argument1] (takes argument from query and body, first preference to query)
// 	/*
//         CONTEXT FUNCTIONALITIES
//     */
// 	console.log('successfully executed basicio functions');
// 	context.close(); //end of application
// };

"use strict";

const express = require("express");
const catalyst = require("zcatalyst-sdk-node");

const app = express();
app.use(express.json());

// Auth routes
app.post("/authorize", async (req, res) => {
  try {
    const { email_id, first_name, last_name } = req.body;

    if (!email_id) {
      return res.status(400).json({
        error: "Email ID is required",
      });
    }

    const catalystApp = catalyst.initialize(req);
    const userManagement = catalystApp.userManagement();
    const tokenResponse = await userManagement.generateCustomToken({
      type: "web",
      user_details: {
        email_id: email_id,
        first_name: first_name || "",
        last_name: last_name || "",
      },
    });

    res.json({
      client_id: tokenResponse.client_id,
      scopes: tokenResponse.scopes,
      jwt_token: tokenResponse.jwt_token,
    });
  } catch (error) {
    console.error("Error generating custom token:", error);
    res.status(500).json({
      error: "Failed to generate custom token",
      details: error.message,
    });
  }
});

module.exports = app;
