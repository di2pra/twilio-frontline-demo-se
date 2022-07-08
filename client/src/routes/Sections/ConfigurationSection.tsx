import { useCallback, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import sanitizeHtml from 'sanitize-html';
import { addCodeTag } from "../../Helper";
import useModal from "../../hooks/useModal";
import { IConfiguration, ISetting } from "../../Types";
import ConfigurationModal from "../modals/ConfigurationModal";

type Props = {
  isEditable: boolean
  configuration: IConfiguration
  setting: ISetting
}

const ConfigurationSection = ({ configuration, isEditable, setting }: Props) => {

  const { isShowing: isConfigurationFormShowed, toggle: toggleConfigurationForm } = useModal();

  const [configurationState, setConfigurationState] = useState<IConfiguration>(configuration);

  const updateCallback = useCallback((data: IConfiguration) => {
    setConfigurationState(data);
  }, []);

  return (
    <>
      <ConfigurationModal updateCallback={updateCallback} setting={setting} configurationState={configurationState} isShowing={isConfigurationFormShowed} hide={toggleConfigurationForm} />
      <Card className="mb-3">
        <Card.Header as="h3">Configuration</Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <h6>Polly Voice</h6>
              <Alert className="mb-4 p-2" variant='secondary'>
                <p className="mb-0">{configurationState.selectedPollyVoice}</p>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>Company Short Name</h6>
              <Alert className="mb-4 p-2" variant='secondary'>
                <p className="mb-0">{configurationState.companyNameShort}</p>
              </Alert>
            </Col>
            <Col>
              <h6>Company Long Name</h6>
              <Alert className="mb-4 p-2" variant='secondary'>
                <p className="mb-0">{configurationState.companyNameLong}</p>
              </Alert>
            </Col>
          </Row>
          <Row>
            <Col>
              <h6>Company URL</h6>
              <Alert className="mb-4 p-2" variant='secondary'>
                <p className="mb-0">{configurationState.companyUrl}</p>
              </Alert>
            </Col>
            <Col>
            </Col>
          </Row>
          <h6>Welcome sentence when it's a known customer with identified advisor</h6>
          <Alert className="mb-4 p-2" variant='secondary'>
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configurationState.welcomeKnownContact))) }} />
          </Alert>
          <h6>Welcome sentence when it's an unknown customer</h6>
          <Alert className="mb-4 p-2" variant='secondary'>
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configurationState.welcomeUnknownContact))) }} />
          </Alert>
          <h6>Sentence when the advisor decline the call</h6>
          <Alert className="mb-4 p-2" variant='secondary'>
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configurationState.agentBusyAnswer))) }} />
          </Alert>
          <h6>Sentence when it's a customer with unidentified advisor</h6>
          <Alert className="mb-4 p-2" variant='secondary'>
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(addCodeTag(String(configurationState.agentNotFoundAnswer))) }} />
          </Alert>
          {
            isEditable ? <Button variant="warning" onClick={toggleConfigurationForm} >Edit</Button> : null
          }
        </Card.Body>
      </Card>
    </>
  )
}

export default ConfigurationSection;