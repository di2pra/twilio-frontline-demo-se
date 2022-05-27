import { Request, Response } from "express";
import Setting from "../api/models/setting.js";

const outgoingConversationCallbackHandler = async (req: Request, res: Response) => {
  console.log('outgoingConversationCallbackHandler');

  const location = req.body.Location;

  // Location helps to determine which action to perform.
  switch (location) {
    case 'GetProxyAddress': {
      await handleGetProxyAddress(req, res);
      return;
    }

    default: {
      console.log('Unknown location: ', location);
      res.sendStatus(422);
    }
  }
};

const handleGetProxyAddress = async (req: Request, res: Response) => {
  console.log('Getting Proxy Address');

  const body = req.body;
  const channelName = body.ChannelType;

  const proxyAddress = await getCustomerProxyAddress(channelName);

  // In order to start a new conversation ConversationsApp need a proxy address
  // otherwise the app doesn't know from which number send a message to a customer
  if (proxyAddress) {

    console.log({ proxy_address: proxyAddress })

    res.status(200).send({ proxy_address: proxyAddress });
    console.log("Got proxy address!");
    return;
  }

  console.log("Proxy address not found");
  res.sendStatus(403);
};

const getCustomerProxyAddress = async (channelName: string) => {

  const setting = await Setting.get();

  if (channelName === 'whatsapp') {
    return `whatsapp:${setting.phoneNumberWA}`;
  } else if (channelName === 'sms') {
    return setting.phoneNumberSMS;
  } else {
    return setting.phoneNumberVoice;
  }
};

export default outgoingConversationCallbackHandler;