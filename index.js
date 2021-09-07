// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// const path = require('path');
const { join } = require('path');

require('dotenv/config');
// import 'dotenv/config';
// Import required bot configuration.
// const ENV_FILE = path.join(__dirname, '.env');
// dotenv.config({ path: ENV_FILE });

const restify = require('restify');
// import restify from 'restify';

const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const { promises: fs } = require('fs');
// import { promises as fs } from 'node:fs';
const random = require('math-random');
// import random from 'math-random';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');
// import { BotFrameworkAdapter } from 'botbuilder';

// This bot's main dialog.
const { EchoBot } = require('./bot');
// import { EchoBot } from './bot.js';

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
  console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
  console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights. See https://aka.ms/bottelemetry for telemetry
  //       configuration instructions.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${error}`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  // Send a message to the user
  await context.sendActivity('The bot encountered an error or bug.');
  await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Set the onTurnError for the singleton BotFrameworkAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the main dialog.
const myBot = new EchoBot();

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async context => {
    // Route to main dialog.
    await myBot.run(context);
  });
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', (req, socket, head) => {
  // Create an adapter scoped to this WebSocket connection to allow storing session data.
  const streamingAdapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
  });
  // Set onTurnError for the BotFrameworkAdapter created for each connection.
  streamingAdapter.onTurnError = onTurnErrorHandler;

  streamingAdapter.useWebSocket(req, socket, head, async context => {
    // After connecting via WebSocket, run this logic for every request sent over
    // the WebSocket connection.
    await myBot.run(context);
  });
});

server.post('/api/token', async (req, res) => {
  try {
    const tokenRes = await fetch(`https://directline.botframework.com/v3/directline/tokens/generate`, {
      body: JSON.stringify({
        user: { id: `dl_${random().toString(36).substr(2)}` },
        trustedOrigins: ['https://hawo-shop-bot.azurewebsites.net']
      }),
      headers: {
        authorization: `Bearer ${process.env.DIRECT_LINE_SECRET}`,
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });

    if (tokenRes.status !== 200) {
      console.log(await tokenRes.text());

      throw new Error(`Direct Line service returned ${tokenRes.status} while generating new token`);
    }

    const json = await tokenRes.json();

    if ('error' in json) {
      throw new Error(`Direct Line service responded ${JSON.stringify(json.error)} while generating new token`);
    }

    const { conversationId, token, userId } = json;

    res.sendRaw(
      JSON.stringify(
        {
          conversationId,
          token,
          userId
        },
        null,
        2
      ),
      { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
    );
  } catch (err) {
    res.send(500, { message: err.message, stack: err.stack }, { 'Access-Control-Allow-Origin': '*' });
  }
});

server.get('/', async (req, res) => {
  res.sendRaw(200, await fs.readFile(join(__dirname, './public/index.html')), { 'content-type': 'text/html' });
  // res.sendRaw(200, await fs.readFile(new URL('./public/index.html', import.meta.url)), { 'content-type': 'text/html' });
});
