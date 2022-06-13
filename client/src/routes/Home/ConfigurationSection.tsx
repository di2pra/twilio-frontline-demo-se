import { useCallback, useContext, useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import useForm, { FormSchema } from "../../hooks/useForm";
import sanitizeHtml from 'sanitize-html';
import { addCodeTag } from "../../Helper";
import { UserContext } from "../../SecureLayout";
import { IClaim, IConfiguration, ISetting } from "../../Types";

const stateSchema: FormSchema = {
  selectedPollyVoice: { value: '', errorMessage: '', isInvalid: false },
  companyNameShort: { value: '', errorMessage: '', isInvalid: false },
  companyNameLong: { value: '', errorMessage: '', isInvalid: false },
  companyUrl: { value: '', errorMessage: '', isInvalid: false },
  welcomeKnownContact: { value: '', errorMessage: '', isInvalid: false },
  welcomeUnknownContact: { value: '', errorMessage: '', isInvalid: false },
  agentBusyAnswer: { value: '', errorMessage: '', isInvalid: false },
  agentNotFoundAnswer: { value: '', errorMessage: '', isInvalid: false }
};

const validationStateSchema = {
  selectedPollyVoice: {
    required: true
  },
  companyNameShort: {
    required: true
  },
  companyNameLong: {
    required: true
  },
  companyUrl: {
    required: true
  },
  welcomeKnownContact: {
    required: true
  },
  welcomeUnknownContact: {
    required: true
  },
  agentBusyAnswer: {
    required: true
  },
  agentNotFoundAnswer: {
    required: true
  }
};

type Props = {
  claim?: IClaim;
  setting?: ISetting;
  configuration?: IConfiguration;
  updateConfigurationHandler: (info: IConfiguration) => void;
}

const ConfigurationSection = ({ claim, setting, configuration, updateConfigurationHandler }: Props) => {

  const { loggedInUser } = useContext(UserContext);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [initState, setInitState] = useState<FormSchema>(stateSchema);
  const { state, handleOnChange, handleOnSubmit } = useForm(initState, validationStateSchema);

  const handleAddBtn = () => {

    setInitState({
      ...stateSchema, ...{
        selectedPollyVoice: { value: configuration?.selectedPollyVoice || '', errorMessage: '', isInvalid: false },
        companyNameLong: { value: configuration?.companyNameLong || '', errorMessage: '', isInvalid: false },
        companyNameShort: { value: configuration?.companyNameShort || '', errorMessage: '', isInvalid: false },
        companyUrl: { value: configuration?.companyUrl || '', errorMessage: '', isInvalid: false },
        welcomeKnownContact: { value: configuration?.welcomeKnownContact || '', errorMessage: '', isInvalid: false },
        welcomeUnknownContact: { value: configuration?.welcomeUnknownContact || '', errorMessage: '', isInvalid: false },
        agentBusyAnswer: { value: configuration?.agentBusyAnswer || '', errorMessage: '', isInvalid: false },
        agentNotFoundAnswer: { value: configuration?.agentNotFoundAnswer || '', errorMessage: '', isInvalid: false }
      }
    });

    setIsEditable(true);
  };

  const handleClose = () => {
    setIsEditable(false);
  };

  const processAddTemplate = useCallback((state: FormSchema) => {


    updateConfigurationHandler({
      selectedPollyVoice: String(state.selectedPollyVoice.value),
      companyNameShort: String(state.companyNameShort.value),
      companyNameLong: String(state.companyNameLong.value),
      companyUrl: String(state.companyUrl.value),
      welcomeKnownContact: String(state.welcomeKnownContact.value),
      welcomeUnknownContact: String(state.welcomeUnknownContact.value),
      agentBusyAnswer: String(state.agentBusyAnswer.value),
      agentNotFoundAnswer: String(state.agentNotFoundAnswer.value)
    });


  }, [updateConfigurationHandler]);

  if (isEditable) {
    return (

      <Card className="mb-3">
        <Card.Header as="h3">Configuration</Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => { handleOnSubmit(e, processAddTemplate) }}>
            <Row>
              <Form.Group as={Col} className="mb-3" controlId="selectedPollyVoice">
                <Form.Label>Polly Voice</Form.Label>
                <Form.Select name="selectedPollyVoice" value={String(state.selectedPollyVoice.value)} onChange={handleOnChange}>
                  {
                    setting?.selectedSetting.pollyVoice.map((item, key) => <option key={key}>{item}</option>)
                  }
                </Form.Select>
                <div className="invalid-feedback">{state.selectedPollyVoice.errorMessage}</div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} className="mb-3" controlId="companyNameShort">
                <Form.Label>Company Short Name</Form.Label>
                <Form.Control type="text" value={String(state.companyNameShort.value)} name='companyNameShort' isInvalid={state.companyNameShort.isInvalid} onChange={handleOnChange} />
                <div className="invalid-feedback">{state.companyNameShort.errorMessage}</div>
              </Form.Group>
              <Form.Group as={Col} className="mb-3" controlId="companyNameLong">
                <Form.Label>Company Long Name</Form.Label>
                <Form.Control type="text" value={String(state.companyNameLong.value)} name='companyNameLong' isInvalid={state.companyNameLong.isInvalid} onChange={handleOnChange} />
                <div className="invalid-feedback">{state.companyNameLong.errorMessage}</div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} className="mb-3" controlId="companyUrl">
                <Form.Label>Company URL</Form.Label>
                <Form.Control type="text" value={String(state.companyUrl.value)} name='companyUrl' isInvalid={state.companyUrl.isInvalid} onChange={handleOnChange} />
                <div className="invalid-feedback">{state.companyUrl.errorMessage}</div>
              </Form.Group>
              <Col></Col>
            </Row>
            <Form.Group as={Col} className="mb-3" controlId="welcomeKnownContact">
              <Form.Label>Welcome sentence when it's a known customer with identified advisor</Form.Label>
              <Form.Control as="textarea" rows={3} value={String(state.welcomeKnownContact.value)} name='welcomeKnownContact' isInvalid={state.welcomeKnownContact.isInvalid} onChange={handleOnChange} />
              <div className="invalid-feedback">{state.welcomeKnownContact.errorMessage}</div>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="welcomeUnknownContact">
              <Form.Label>Phrase de bienvenue si contact nouveau</Form.Label>
              <Form.Control as="textarea" rows={3} value={String(state.welcomeUnknownContact.value)} name='welcomeUnknownContact' isInvalid={state.welcomeUnknownContact.isInvalid} onChange={handleOnChange} />
              <div className="invalid-feedback">{state.welcomeUnknownContact.errorMessage}</div>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="agentBusyAnswer">
              <Form.Label>Réponse si le conseillé ne répond pas</Form.Label>
              <Form.Control as="textarea" rows={3} value={String(state.agentBusyAnswer.value)} name='agentBusyAnswer' isInvalid={state.agentBusyAnswer.isInvalid} onChange={handleOnChange} />
              <div className="invalid-feedback">{state.agentBusyAnswer.errorMessage}</div>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="agentNotFoundAnswer">
              <Form.Label>Réponse si le conseillé est introuvable</Form.Label>
              <Form.Control as="textarea" rows={3} value={String(state.agentNotFoundAnswer.value)} name='agentNotFoundAnswer' isInvalid={state.agentNotFoundAnswer.isInvalid} onChange={handleOnChange} />
              <div className="invalid-feedback">{state.agentNotFoundAnswer.errorMessage}</div>
            </Form.Group>
            <Alert className="mt-3" variant="success">
              <Alert.Heading as="h6">Available variables :</Alert.Heading>
              <hr />
              <div className="ms-2 me-auto">
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{companyNameShort}}`} :</code> Company Name Short</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{companyNameLong}}`} :</code> Company Name Long</p>
              </div>
            </Alert>
            <Row>
              <Col>
                <Button className="mr-1" variant="danger" type="button" onClick={handleClose}>Cancel</Button>
                <Button className="float-end" variant="primary" type="submit">Save</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    )
  }

  return (

    <Card className="mb-3">
      <Card.Header as="h3">Configuration</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <h6>Polly Voice</h6>
            <Alert className="mb-4 p-2" variant='secondary'>
              <p className="mb-0">{configuration?.selectedPollyVoice}</p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>Company Short Name</h6>
            <Alert className="mb-4 p-2" variant='secondary'>
              <p className="mb-0">{configuration?.companyNameShort}</p>
            </Alert>
          </Col>
          <Col>
            <h6>Company Long Name</h6>
            <Alert className="mb-4 p-2" variant='secondary'>
              <p className="mb-0">{configuration?.companyNameLong}</p>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>Company URL</h6>
            <Alert className="mb-4 p-2" variant='secondary'>
              <p className="mb-0">{configuration?.companyUrl}</p>
            </Alert>
          </Col>
          <Col>
          </Col>
        </Row>
        <h6>Welcome sentence when it's a known customer with identified advisor</h6>
        <Alert className="mb-4 p-2" variant='secondary'>
          <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configuration?.welcomeKnownContact))) }} />
        </Alert>
        <h6>Welcome sentence when it's an unknown customer</h6>
        <Alert className="mb-4 p-2" variant='secondary'>
          <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configuration?.welcomeUnknownContact))) }} />
        </Alert>
        <h6>Sentence when the advisor decline the call</h6>
        <Alert className="mb-4 p-2" variant='secondary'>
          <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configuration?.agentBusyAnswer))) }} />
        </Alert>
        <h6>Sentence when it's a customer with unidentified advisor</h6>
        <Alert className="mb-4 p-2" variant='secondary'>
          <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configuration?.agentNotFoundAnswer))) }} />
        </Alert>
        {
          (claim != null && claim.ended_at === null && (claim.user === loggedInUser?.email)) ? <Button variant="warning" onClick={handleAddBtn} >Edit</Button> : null
        }
      </Card.Body>
    </Card>
  )
}

export default ConfigurationSection;