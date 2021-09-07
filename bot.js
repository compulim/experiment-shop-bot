// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, CardFactory, MessageFactory } = require('botbuilder');
// import { ActivityHandler, CardFactory, MessageFactory } from 'botbuilder';

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
                  type: 'Input.ChoiceSet',
                  id: 'State',
                  label: 'State',
                  choices: [
                    { title: 'Alabama', value: 'AL' },
                    { title: 'Alaska', value: 'AK' },
                    { title: 'Arizona', value: 'AZ' },
                    { title: 'Arkansas', value: 'AR' },
                    { title: 'California', value: 'CA' },
                    { title: 'Colorado', value: 'CO' },
                    { title: 'Connecticut', value: 'CT' },
                    { title: 'Delaware', value: 'DE' },
                    { title: 'District of Columbia', value: 'DC' },
                    { title: 'Florida', value: 'FL' },
                    { title: 'Georgia', value: 'GA' },
                    { title: 'Hawaii', value: 'HI' },
                    { title: 'Idaho', value: 'ID' },
                    { title: 'Illinois', value: 'IL' },
                    { title: 'Indiana', value: 'IN' },
                    { title: 'Iowa', value: 'IA' },
                    { title: 'Kansas', value: 'KS' },
                    { title: 'Kentucky', value: 'KY' },
                    { title: 'Louisiana', value: 'LA' },
                    { title: 'Maine', value: 'ME' },
                    { title: 'Maryland', value: 'MD' },
                    { title: 'Massachusetts', value: 'MA' },
                    { title: 'Michigan', value: 'MI' },
                    { title: 'Minnesota', value: 'MN' },
                    { title: 'Mississippi', value: 'MS' },
                    { title: 'Missouri', value: 'MO' },
                    { title: 'Montana', value: 'MT' },
                    { title: 'Nebraska', value: 'NE' },
                    { title: 'Nevada', value: 'NV' },
                    { title: 'New Hampshire', value: 'NH' },
                    { title: 'New Jersey', value: 'NJ' },
                    { title: 'New Mexico', value: 'NM' },
                    { title: 'New York', value: 'NY' },
                    { title: 'North Carolina', value: 'NC' },
                    { title: 'North Dakota', value: 'ND' },
                    { title: 'Ohio', value: 'OH' },
                    { title: 'Oklahoma', value: 'OK' },
                    { title: 'Oregon', value: 'OR' },
                    { title: 'Pennsylvania', value: 'PA' },
                    { title: 'Rhode Island', value: 'RI' },
                    { title: 'South Carolina', value: 'SC' },
                    { title: 'South Dakota', value: 'SD' },
                    { title: 'Tennessee', value: 'TN' },
                    { title: 'Texas', value: 'TX' },
                    { title: 'Utah', value: 'UT' },
                    { title: 'Vermont', value: 'VT' },
                    { title: 'Virginia', value: 'VA' },
                    { title: 'Washington', value: 'WA' },
                    { title: 'West Virginia', value: 'WV' },
                    { title: 'Wisconsin', value: 'WI' },
                    { title: 'Wyoming', value: 'WY' }
                  ]
                }
              ],
              actions: [
                {
                  type: 'Action.Submit',
                  title: 'OK'
                }
              ]
            }),
            'Please enter your mailing address.'
          )
        );
      } else if (context?.activity?.value) {
        const replyText = `Thanks for shopping with us.`;

        await context.sendActivity(MessageFactory.text(replyText, replyText));
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
            MessageFactory.text('Welcome to Contoso shop.', 'Welcome to Contoso shop.'),
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
            MessageFactory.suggestedActions(['Checkout'], 'You can type "checkout" to start checkout process.')
          ]);
        }
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}

module.exports.EchoBot = EchoBot;
// export { EchoBot };
