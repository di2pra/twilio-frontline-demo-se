import { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import ModalContainer from "../../components/ModalContainer";
import useApi from "../../hooks/useApi";
import useForm, { FormSchema } from "../../hooks/useForm";
import { IConfiguration, ISetting } from "../../Types";

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
  isShowing: boolean;
  hide: () => void;
  updateCallback: (data: IConfiguration) => void;
  configurationState: IConfiguration;
  setting: ISetting
}

const ConfigurationModal = ({ isShowing, hide, configurationState, setting, updateCallback }: Props) => {

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { postConfiguration } = useApi();

  const [initState] = useState<FormSchema>({
    ...stateSchema, ...{
      selectedPollyVoice: { value: configurationState.selectedPollyVoice || '', errorMessage: '', isInvalid: false },
      companyNameLong: { value: configurationState.companyNameLong || '', errorMessage: '', isInvalid: false },
      companyNameShort: { value: configurationState.companyNameShort || '', errorMessage: '', isInvalid: false },
      companyUrl: { value: configurationState.companyUrl || '', errorMessage: '', isInvalid: false },
      welcomeKnownContact: { value: configurationState.welcomeKnownContact || '', errorMessage: '', isInvalid: false },
      welcomeUnknownContact: { value: configurationState.welcomeUnknownContact || '', errorMessage: '', isInvalid: false },
      agentBusyAnswer: { value: configurationState.agentBusyAnswer || '', errorMessage: '', isInvalid: false },
      agentNotFoundAnswer: { value: configurationState.agentNotFoundAnswer || '', errorMessage: '', isInvalid: false }
    }
  })

  const { state, handleOnChange, handleOnSubmit } = useForm(initState, validationStateSchema);

  const handleClose = useCallback(() => {
    hide()
  }, [hide]);

  const processUpdateConfiguration = useCallback((state: FormSchema) => {

    setIsProcessing(true);

    postConfiguration({
      selectedPollyVoice: String(state.selectedPollyVoice.value),
      companyNameShort: String(state.companyNameShort.value),
      companyNameLong: String(state.companyNameLong.value),
      companyUrl: String(state.companyUrl.value),
      welcomeKnownContact: String(state.welcomeKnownContact.value),
      welcomeUnknownContact: String(state.welcomeUnknownContact.value),
      agentBusyAnswer: String(state.agentBusyAnswer.value),
      agentNotFoundAnswer: String(state.agentNotFoundAnswer.value)
    })
      .then((data) => {
        updateCallback(data);
        hide();
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsProcessing(false));

  }, [postConfiguration, hide, updateCallback]);

  if (isProcessing) {
    return (
      <ModalContainer size="xl" title="Update Configuration" isShowing={isShowing} >
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner className="mb-3" animation="border" variant="danger" />
            <h3>Processing...</h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </ModalContainer>
    )
  }


  return (
    <ModalContainer size="xl" title="Update Configuration" isShowing={isShowing} >
      <Form onSubmit={(e) => { handleOnSubmit(e, processUpdateConfiguration) }}>
        <Modal.Body>
          {
            error ? <Alert variant="danger">{error}</Alert> : null
          }

          {
            error ? <Row><Col><Alert variant="danger">{error}</Alert></Col></Row> : null
          }
          <Row>
            <Form.Group as={Col} className="mb-3" controlId="selectedPollyVoice">
              <Form.Label>Polly Voice</Form.Label>
              <Form.Select name="selectedPollyVoice" value={String(state.selectedPollyVoice.value)} onChange={handleOnChange}>
                {
                  setting.selectedSetting.pollyVoice.map((item, key) => <option key={key}>{item}</option>)
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
        </Modal.Body>
        <Modal.Footer>
          <Button className="mr-1" variant="danger" type="button" onClick={handleClose}>Cancel</Button>
          <Button className="float-end" variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </ModalContainer>
  )


}

export default ConfigurationModal;