import { useContext } from "react";
import { Card } from "react-bootstrap";
import { SettingContext } from "../../providers/SettingProvider";

const InstructionSection = () => {

  const { setting } = useContext(SettingContext);

  return (
    <Card className="mb-3">
      <Card.Header as="h3">How-to</Card.Header>
      <Card.Body>
        <p>Ready-to-use Frontline demo connected to Hubspot with support for SMS, Voice and WhatsApp on the local phone number depending the selected country. This is the application to customize the demo to fit with your customer's use case.</p>
        <h6>Phone Numbers :</h6>
        <ul>
          <li>SMS : <code>{setting?.selectedSetting.phoneNumberSMS}</code></li>
          <li>Voice : <code>{setting?.selectedSetting.phoneNumberVoice}</code></li>
          <li>WhatsApp : <code>{setting?.selectedSetting.phoneNumberWA}</code></li>
        </ul>
        <h6>Links :</h6>
        <ul>
          <li>
            <b>Frontline:</b> <a href="https://frontline.twilio.com" rel="noreferrer" target={"_blank"}>https://frontline.twilio.com</a> ; workspace : <code>frontline-demo-se</code>
            <ul>
             <li>Frontline Manage Account : Username <code>se-france@twilio.com</code> / Password : <code>FrontlineManager</code></li>
            </ul>
          </li>
          <li><b>Hubspot:</b> <a href="https://app.hubspot.com/login/sso" rel="noreferrer" target={"_blank"}>https://app.hubspot.com/login/sso</a></li>
          <li><b>Flex:</b> <a href="https://flex.twilio.com/cadet-manatee-3328" rel="noreferrer" target={"_blank"}>https://flex.twilio.com/cadet-manatee-3328</a></li>
        </ul>
        <h6>How the demo works ?</h6>
        <p>First, an IVR welcomes the incoming calls. If it's an incoming call from a known customer in Hubspot and a Frontline user is identified as the owner of the contact, then call is routed to the Frontline user.<br />
        If it's an incoming call from an unknown customer, then the call is directly routed to the Contact Center.<br />
        If the call is declined by the Frontline user, then the call is routed to the Contact Center.</p>
        <h6>Customers List :</h6>
        <p>The customer list is synchronised with Hubspot. You can only intiate a conversation with your contacts.</p>
      </Card.Body>
    </Card>
  )
}

export default InstructionSection;