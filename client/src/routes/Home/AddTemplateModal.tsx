import { useCallback, useState } from "react";
import { Form, Button, Col, Row, Table, Modal, Spinner, Alert } from "react-bootstrap";
import { Delay } from "../../Helper";
import useApi from "../../hooks/useApi";
import { IWhatsAppCategory } from "../../Types";

type FormValue = {
  friendly_name: string;
  content: string;
  variables: {
    [key: string]: string
  },
  requestWAApproval: boolean;
  WACategory?: IWhatsAppCategory;
}

const DEFAULT_VALUE = {
  friendly_name: "",
  content: "",
  variables: {},
  requestWAApproval: false
};

const WHATSAPP_CATEGORY = [
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

const AddTemplateModal = () => {

  const { addTemplateContent } = useApi();

  const [show, setShow] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [validated, setValidated] = useState(false);

  const [formValue, setFormValue] = useState<FormValue>(DEFAULT_VALUE);

  const onContentChangeHandler = useCallback((event: any) => {

    const newContent = event.target.value;

    const regexp = /{{[0-9]+}}/g;

    const variableKey = [...newContent.matchAll(regexp)].map(item => item[0]);

    setFormValue(prevState => {

      let newVariables = {};

      for (let i = 0; i < variableKey.length; i++) {

        const key = variableKey[i].slice(2, -2);

        newVariables = { ...newVariables, ...{ [key]: prevState.variables[key] || '' } }
      }

      return { ...prevState, content: newContent, variables: newVariables }
    });
  }, []);

  const onFriendlyNameChangeHandler = useCallback((event: any) => {

    const newValue = event.target.value;

    setFormValue(prevState => {
      return { ...prevState, friendly_name: newValue }
    });

  }, []);

  const onVariableChangeHandler = useCallback((key: string, value: string) => {

    setFormValue(prevState => {
      return { ...prevState, variables: { ...prevState.variables, [key]: value } }
    });

  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const submitHandler = useCallback((event: any) => {

    setError(undefined);

    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === true) {
      setIsLoading(true);

      addTemplateContent(formValue)
        .then(() => {

        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false))
    }

  }, [formValue]);

  const requestWAApprovalChangeHandler = useCallback((event: any) => {

    setFormValue(prevState => {
      return { ...prevState, requestWAApproval: event.target.checked }
    });

  }, []);

  const onWACategoryChangeHandler = useCallback((event: any) => {

    setFormValue(prevState => {
      return { ...prevState, WACategory: event.target.value }
    });

  }, []);

  return (
    <Modal backdrop="static" size="xl" show={show}>
      <Form noValidate validated={validated} onSubmit={submitHandler}>
        <Modal.Header>
          <Modal.Title>Add Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            error ? <Alert variant="danger">{error}</Alert> : null
          }
          <Form.Group className="mb-3" controlId="friendly_name">
            <Form.Label>Friendly Name</Form.Label>
            <Form.Control disabled={isLoading} required type="text" name="friendly_name" value={formValue.friendly_name} placeholder="flight_departure_update" onChange={onFriendlyNameChangeHandler} />
            <Form.Control.Feedback type="invalid">Friendly Name Is Required</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control disabled={isLoading} required as="textarea" rows={3} name="content" value={formValue.content} placeholder="Bonjour {{1}}, je suis {{2}}, votre conseiller chez {{3}}, je me permets de vous contacter pour qu'on puisse discuter de votre contrat. Envoyez moi un message dès que vous êtes disponible. Merci." onChange={onContentChangeHandler} />
            <Form.Text className="text-muted">Use double curly braces to indicate where you plan to use dynamic content. For example, to send "Your login code for Twilio is 1234", the template would be: "Your login code for {`{{1}}`} is {`{{2}}`}."</Form.Text>
            <Form.Control.Feedback type="invalid">Content Is Required</Form.Control.Feedback>
          </Form.Group>
          <VariableInput formValue={formValue} isLoading={isLoading} onVariableChangeHandler={onVariableChangeHandler} />
          <Form.Group className="mb-3" controlId="switch-wa-request">
            <Form.Label>Request WhatsApp Approval ?</Form.Label>
            <Form.Check
              disabled={isLoading}
              type="switch"
              id="switch-wa-request"
              value={formValue.requestWAApproval ? 1 : 0}
              onChange={requestWAApprovalChangeHandler}
            />
          </Form.Group>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : 'Save'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

function VariableInput({ formValue, isLoading, onVariableChangeHandler }: { formValue: FormValue, isLoading: boolean, onVariableChangeHandler: (key: string, value: string) => void }) {

  if (Object.entries(formValue.variables).length > 0) {
    return (
      <Form.Group className="mb-3" as={Col} xs={6} controlId="variables">
        <Form.Label>Variables</Form.Label>
        <Table borderless>
          <tbody>
            {
              Object.entries(formValue.variables).map(([key, value], index) => {
                return (
                  <tr key={index}>
                    <td className="text-center" style={{ 'verticalAlign': 'middle' }}>{key}</td>
                    <td>
                      <Form.Select disabled={isLoading} required name={`variable-${key}`} defaultValue={value} onChange={(e) => onVariableChangeHandler(key, e.target.value)}>
                        <option value="">Select a value</option>
                        <option value={`customerFirstname`}>Customer Firstname</option>
                        <option value={`customerLastname`}>Customer Last Name</option>
                        <option value={`agentFirstname`}>Agent Firstname</option>
                        <option value={`agentLastname`}>Agent Lastname</option>
                        <option value={`companyNameShort`}>Company Name Short</option>
                        <option value={`companyNameLong`}>Company Name Long</option>
                        <option value={`companyUrl`}>Company Name Long</option>
                      </Form.Select>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Form.Group>
    )
  } else {
    return (
      <Form.Group className="mb-3" as={Col} xs={6} controlId="variables">
        <Form.Label>Variables</Form.Label>
        <p className="text-muted">No Variable</p>
      </Form.Group>
    )
  }

}

export default AddTemplateModal;