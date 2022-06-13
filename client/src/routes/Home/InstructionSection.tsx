import { Card } from "react-bootstrap";
import { ISetting } from "../../Types";

type Props = {
  setting?: ISetting;
}

const InstructionSection = ({ setting }: Props) => {

  return (
    <Card className="mb-3">
      <Card.Header as="h3">Instructions</Card.Header>
      <Card.Body>
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
      </Card.Body>
    </Card>
  )
}

export default InstructionSection;