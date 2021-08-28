# template-echo-bot

This repo is for quickly set up an Azure bot with Node.js Web App. It will clone the [Bot Builder Samples](https://github.com/microsoft/BotBuilder-Samples/) and add GitHub Action to deploy your bot.

## Why this is needed?

[Bot Builder Samples](https://github.com/microsoft/BotBuilder-Samples/) repository contains great samples. But it is a mono-repository and need extra tweaks to deploy code using GitHub Actions.

Using GitHub Actions, you can easily modify your bot code and re-deploy automatically.

With this template repository, it will simplify deploying a bot from samples to your environment:

- No need to manual copying sample bot from its own folder to a new repository
- No need to write your own GitHub workflow for deploying to Azure Web App
- No need to patch the bot to support Azure Web App ZipDeploy
   - ZipDeploy is a super-fast deployment for Azure Web App, it only take 10 seconds to deploy a bot
   - No need to write your own `web.config` to support ZipDeploy

## Steps

1. Set up your Web App
   1. (Optional) Set the application settings `WEBSITE_RUN_FROM_PACKAGE=1` will speed up deployment significantly
   1. Download the publish profile
1. [Fork this repo via the "Use this template" button](https://github.com/compulim/template-echo-bot/generate)
1. [Add a new secret](../../settings/secrets/actions/new) named `PUBLISH_PROFILE`
   - Paste the content of the publish profile file you downloaded from step 1 into the value field
1. [Navigate to the scaffold workflow](../../actions/workflows/set-up-scaffold.yaml)
1. Click "Run workflow" to set up the scaffold
1. [Modify `bot.js` to trigger the first deployment](../../edit/main/bot.js)
