CREATE TABLE "category" (
	"id" serial PRIMARY KEY,
	"display_name"	TEXT
);

CREATE TABLE "template" (
	"id" serial PRIMARY KEY,
	"category_id"	INTEGER NOT NULL,
	"content"	TEXT,
	"whatsapp_approved" BOOLEAN,
	"is_deleted" BOOLEAN
);


CREATE TABLE "configuration" (
	"id" serial PRIMARY KEY,
	"info"	json NOT NULL,
	"updated_on" timestamptz NOT NULL,
	"updated_by" VARCHAR(255) NOT NULL
);

CREATE TABLE "claim" (
	"id" serial PRIMARY KEY,
	"user"	VARCHAR(255) NOT NULL,
	"started_at" timestamptz NOT NULL,
	"ended_at" timestamptz NULL
);

CREATE TABLE "language" (
	"id" serial PRIMARY KEY,
	"lang"	VARCHAR(255) NOT NULL,
	"friendly_name" VARCHAR(255) NOT NULL,
	"setting" json NOT NULL,
	"configuration" json NOT NULL,
	"template" json NOT NULL,
	"updated_on" timestamptz NOT NULL,
	"updated_by" VARCHAR(255) NOT NULL
);


INSERT INTO public.language (lang, friendly_name, setting, configuration, template, updated_on, updated_by) VALUES ('fr-FR', 'France', '{
  "pollyVoice": [
    "Polly.Celine",
    "Polly.Lea",
    "Polly.Mathieu",
    "Polly.Lea-Neural"
  ],
  "phoneNumberSMS": "+33757593873",
  "phoneNumberWA": "+33757593873",
  "phoneNumberVoice": "+33757593873"
}', '{
    "selectedPollyVoice": "Polly.Lea",
    "companyNameShort": "Twilio",
    "companyNameLong": "Twilio",
    "companyUrl": "https://twilio.com",
    "welcomeKnownContact": "Bonjour, bienvenue chez {{companyNameLong}}, je vous mets en relation avec votre conseiller.",
    "welcomeUnknownContact": "Bonjour, bienvenue chez {{companyNameLong}}. Je vous redirige vers le premier conseiller disponible de notre centre d''''appel.",
    "agentBusyAnswer": "Votre conseiller est occupé, je vous redirige vers le centre d''''appel.",
    "agentNotFoundAnswer": "Je vous redirige vers le premier conseiller disponible de notre centre d''''appel."
  }', '[
    {
      "name": "Démarrer une conversation",
      "templates": [
        {
          "content": "Bonjour {{customerFirstname}}, je suis {{agentFirstname}} {{agentLastname}}, votre conseiller chez {{companyNameShort}}, je me permets de vous contacter pour qu''on puisse discuter de votre contrat. Envoyez moi un message dès que vous êtes disponible. Merci.",
          "whatsapp_approved": true
        },
        {
          "content": "Bonjour {{customerFirstname}} nous avons traité vos documents, vous pouvez me contacter ici. {{agentFirstname}} de chez {{companyNameShort}}.",
          "whatsapp_approved": false
        }
      ]
    },
    {
      "name": "Répondre à un message",
      "templates": [
        {
          "content": "Toutes les réductions indiquées sont appliquées après signature. {{agentFirstname}} de chez {{companyNameShort}}.",
          "whatsapp_approved": false
        }
      ]
    },
    {
      "name": "Clore une conversation",
      "templates": [
        {
          "content": "Je vous remercie de m''avoir contacté, {{customerFirstname}}. Si vous avez d''autres questions, n''hésitez à me recontacter sur ce même numéro. {{agentFirstname}} de chez {{companyNameShort}}.",
          "whatsapp_approved": false
        }
      ]
    }
  ]', '2022-05-20 14:31:14.951662+00', 'prajendirane@twilio.com');
INSERT INTO public.language (lang, friendly_name, setting, configuration, template, updated_on, updated_by) VALUES ('en-GB', 'United Kingdom', '{
  "lang": "en-GB",
  "pollyVoice": [
    "Polly.Amy",
    "Polly.Brian",
    "Polly.Emma",
    "Polly.Amy-Neural",
    "Polly.Brian-Neural",
    "Polly.Emma-Neural"
  ],
  "phoneNumberSMS": "+447361589764",
  "phoneNumberWA": "+447361589764",
  "phoneNumberVoice": "+447361589764"
}
', '{
    "selectedPollyVoice": "Polly.Amy",
    "companyNameShort": "Twilio",
    "companyNameLong": "Twilio",
    "companyUrl": "https://twilio.com",
    "welcomeKnownContact": "Good morning, welcome to {{companyNameLong}}, let me put you in connection with your advisor.",
    "welcomeUnknownContact": "Bonjour, bienvenue chez {{companyNameLong}}. Je vous redirige vers le premier conseiller disponible de notre centre d''''appel.",
    "agentBusyAnswer": "Votre conseiller est occupé, je vous redirige vers le centre d''''appel.",
    "agentNotFoundAnswer": "Je vous redirige vers le premier conseiller disponible de notre centre d''''appel."
  }', '[
    {
      "name": "Openers",
      "templates": [
        {
          "content": "Hello {{customerFirstname}} we have now processed your documents and would like to move you on to the next step. Drop me a message. {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "Hello {{customerFirstname}} we have a new product out which may be of interest to your business. Drop me a message. {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "Just to confirm I am on my way to your office. {{agentFirstname}}.",
          "whatsapp_approved": false
        }
      ]
    },
    {
      "name": "Replies",
      "templates": [
        {
          "content": "This has now been sent. {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "Our rates for any loan are 20% or 30% over $30,000. You can read more at {{companyUrl}}. {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "Just to confirm I am on my way to your office. {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "Would you like me to go over some options with you {{customerFirstname}}? {{agentFirstname}}.",
          "whatsapp_approved": false
        },
        {
          "content": "We have a secure drop box for documents. Can you attach and upload them here: {{companyUrl}}. {{agentFirstname}}",
          "whatsapp_approved": false
        }
      ]
    },
    {
      "name": "Closing",
      "templates": [
        {
          "content": "Happy to help, {{customerFirstname}}. If you have a moment could you leave a review about our interaction at this link: {{companyUrl}}. {{agentFirstname}}.",
          "whatsapp_approved": false
        }
      ]
    }
  ]', '2022-05-23 14:01:13.183315+00', 'prajendirane@twilio.com');