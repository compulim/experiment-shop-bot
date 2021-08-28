// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, CardFactory, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
  constructor() {
    super();

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      const text = context?.activity?.text;

      if (/(^|\s)checkout(\s|$)/iu.test(text)) {
        await context.sendActivity(
          MessageFactory.attachment(
            CardFactory.adaptiveCard({
              type: 'AdaptiveCard',
              $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
              version: '1.3',
              body: [
                {
                  type: 'Input.Text',
                  id: 'ReceipientName',
                  label: 'Receipient name'
                },
                {
                  type: 'Input.Text',
                  id: 'StreetAddress1',
                  label: 'Street address 1'
                },
                {
                  type: 'Input.Text',
                  id: 'StreetAddress2',
                  label: 'Street address 2'
                },
                {
                  type: 'Input.Text',
                  id: 'City',
                  label: 'City'
                },
                {
                  type: 'Input.Text',
                  id: 'State',
                  label: 'State'
                }
              ]
            }),
            'Please enter your mailing address.'
          )
        );
      } else {
        const replyText = `Echo: ${text}`;

        await context.sendActivity(MessageFactory.text(replyText, replyText));
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;

      for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          await context.sendActivities([
            MessageFactory.carousel(
              [
                CardFactory.heroCard(
                  'Xbox Series X',
                  [
                    'https://compass-ssl.surface.com/assets/9e/cc/9eccdb3c-e965-4ab7-97d2-651c5f5a7fbe.jpg?n=Consoles-Hub_Content-Placement_Hub-SX_788x444.jpg'
                  ],
                  [],
                  {
                    subtitle: '$499.99',
                    text: 'New generation console. New generation games. Embark on new adventures the way they’re meant to be experienced on the Xbox Series X.'
                  }
                ),
                CardFactory.heroCard(
                  'Xbox Elite Wireless Controller Series 2',
                  [
                    'https://compass-ssl.xbox.com/assets/f7/29/f72981fb-9f8d-4b66-8da7-355e6f48efce.jpg?n=999666_Content-Placement-0_Accessory-hub_740x417.jpg'
                  ],
                  [],
                  {
                    subtitle: '$179.99',
                    text: 'Adjustable-tension thumbsticks I Shorter hair trigger locks I Wrap-around rubberized grip I Re-engineered components'
                  }
                ),
                CardFactory.heroCard(
                  'Xbox Adaptive Controller',
                  [
                    'https://compass-ssl.xbox.com/assets/01/d0/01d0d6c7-cda9-41c2-96d3-55ceccc2486c.jpg?n=Accessory-Hub_Content-Placement-0_94_740x417.jpg'
                  ],
                  [],
                  {
                    subtitle: '$99.99',
                    text: 'Designed primarily to meet the needs of gamers with limited mobility, the Xbox Adaptive Controller is a unified hub for devices that helps make gaming more accessible.'
                  }
                )
              ],
              'You have 3 items in your shopping cart.'
            ),
            MessageFactory.suggestedActions(['Checkout'], 'You can say "checkout" to start checkout process.')
          ]);
        }
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;
