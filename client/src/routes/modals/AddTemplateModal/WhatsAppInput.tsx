import { Col, Form } from "react-bootstrap";
import { AddTemplateFormValue } from ".";

export const WHATSAPP_CATEGORY = [
  "ACCOUNT_UPDATE",
  "PAYMENT_UPDATE",
  "PERSONAL_FINANCE_UPDATE",
  "SHIPPING_UPDATE",
  "RESERVATION_UPDATE",
  "ISSUE_RESOLUTION",
  "APPOINTMENT_UPDATE",
  "TRANSPORTATION_UPDATE",
  "TICKET_UPDATE",
  "ALERT_UPDATE",
  "AUTO_REPLY",
  "TRANSACTIONAL",
  "MARKETING",
  "OTP"
]

function WhatsAppInput({ formValue, isLoading, onWACategoryChangeHandler }: { formValue: AddTemplateFormValue, isLoading: boolean, onWACategoryChangeHandler: (event: any) => void }) {
  if (formValue.requestWAApproval) {
    return (
      <Form.Group hidden={formValue.requestWAApproval ? false : true} className="mb-3" as={Col} xs={6} controlId="wa-template-category">
        <Form.Label>WhatsApp Template Category</Form.Label>
        <Form.Select disabled={isLoading} required id="wa-template-category" name='wa-template-category' defaultValue={formValue.WACategory} onChange={onWACategoryChangeHandler}>
          <option value="">Select a value</option>
          {
            WHATSAPP_CATEGORY.map((item, key) => {
              return <option key={key} value={item}>{item}</option>
            })
          }
        </Form.Select>
        <Form.Control.Feedback type="invalid">WhatsApp Template Category Is Required</Form.Control.Feedback>
      </Form.Group>
    )
  } else {
    return null
  }

}

export default WhatsAppInput;