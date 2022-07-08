import { Card } from "react-bootstrap";

const HowToSection = () => {

  return (
    <Card className="mb-3">
      <Card.Header as="h3">How-to</Card.Header>
      <Card.Body>
        <p>Ready-to-use Frontline demo connected to Hubspot with support for SMS, Voice and WhatsApp on the local phone number depending the selected country. This is the application to customize the demo to fit with your customer's use case.</p>
        <p></p>
        <strong>How the demo works ?</strong>
        <p>First, an IVR welcomes the incoming calls. If it's an incoming call from a known customer in Hubspot and a Frontline user is identified as the owner of the contact, then call is routed to the Frontline user.<br />
        If it's an incoming call from an unknown customer, then the call is directly routed to the Contact Center.<br />
        If the call is declined by the Frontline user, then the call is routed to the Contact Center.</p>
        <strong>Customers :</strong>
        <p>The customer list is synchronised with Hubspot. You can only intiate a conversation with your contacts.</p>
        <strong>How-to :</strong>
        <p>
          Request for access to <code>prajendirane at twilio.com</code><br/>
          Login to the application here, and then claim the demo if it's available to start customizing it. If not, request the user currently owning the demo to release it.
        </p>
      </Card.Body>
    </Card>
  )
}

export default HowToSection;