import { useCallback, useState } from "react";
import { Alert, Button, Card, Col, Row, Spinner, Table } from "react-bootstrap";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import sanitizeHtml from 'sanitize-html';
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import { ITemplate } from "../../Types";
import TemplateModal from "../modals/TemplateModal";

const TemplateSection = ({ templateList, isEditable, refreshData }: { templateList: ITemplate[], isEditable: boolean, refreshData: () => void }) => {

  const { deleteContentFromTemplate } = useApi();

  const { isShowing: isTemplateFormShowed, toggle: toggleTemplateForm } = useModal();

  const [selectedIndex, setSelectedIndex] = useState<number>();

  const [templateListState, setTemplateListState] = useState<ITemplate[]>(templateList);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const deleteContentFromTemplateHandler = useCallback((index: number, contentSid: string) => {

    setIsProcessing(true);

    deleteContentFromTemplate({
      index: index,
      contentSid: contentSid
    })
      .then((data: ITemplate[]) => setTemplateListState(data))
      .catch((error) => setError(error.message))
      .finally(() => setIsProcessing(false));

  }, [deleteContentFromTemplate]);

  const updateCallback = useCallback((data: ITemplate[]) => {
    setTemplateListState(data);
  }, []);

  if (isProcessing) {
    return (
      <Card className="mb-3">
        <Card.Header as="h3">Templates</Card.Header>
        <Card.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner className="mb-3" animation="border" variant="danger" />
            <h3>Processing...</h3>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="mb-3">
      <TemplateModal updateCallback={updateCallback} selectedIndex={selectedIndex} isShowing={isTemplateFormShowed} hide={toggleTemplateForm} />
      <Card.Header as="h3">Templates</Card.Header>
      <Card.Body>
        {
          error ? <Row><Col><Alert variant="danger">{error}</Alert></Col></Row> : null
        }
        {
          templateListState.map((templateCat, templateCatKey) => {
            return (
              <div key={templateCatKey}>
                <Row>
                  <Col>
                    <h5>{templateCat.display_name}</h5>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Table bordered>
                      <thead>
                        <tr>
                          <td style={{ width: '50%' }} ><strong>Content</strong></td>
                          <td className="text-center" style={{ width: '30%' }} ><strong>Variables</strong></td>
                          <td className="text-center" style={{ width: '20%' }} ><strong>WhatsApp Approved ?</strong></td>
                          {
                            isEditable ? <td></td> : null
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          templateCat.templates.map((template, templateKey) => {

                            let formattedBody = template.body.replace(/{{\s*[\w.]+\s*}}/g, (t1) => {
                              return `<code>${t1}</code>`
                            });

                            return (
                              <tr key={templateKey}>
                                <td>
                                  <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(formattedBody) }} />
                                </td>
                                <td>
                                  <Table className="mb-0" borderless>
                                    <tbody>
                                      {
                                        Object.keys(template.variables).map((variable, variableKey) => {
                                          return (
                                            <tr key={variableKey}>
                                              <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{${variable}}}</code>`) }} /></td>
                                              <td className="text-center">{template.variables[variable]}</td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </tbody>
                                  </Table>
                                </td>
                                <WhatsAppStatusCell whatsAppStatus={template.whatsappStatus} />
                                {
                                  isEditable ? <td><Button variant="danger" onClick={() => { deleteContentFromTemplateHandler(templateCatKey, template.contentApiSid) }}>Delete</Button></td> : null
                                }
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                {
                  isEditable ? <Row className="mb-4"><Col><Button onClick={() => { setSelectedIndex(templateCatKey); toggleTemplateForm(); }}>Add new Content</Button></Col></Row> : null
                }
              </div>
            )
          })
        }
      </Card.Body>
    </Card>
  )
}

function WhatsAppStatusCell({ whatsAppStatus }: { whatsAppStatus: string | null }) {

  if (whatsAppStatus) {
    return (
      <td className={`text-center ${whatsAppStatus === "pending" ? null : (whatsAppStatus === "approved" ? 'text-success' : 'text-danger')}`} style={{ 'verticalAlign': 'middle', fontSize: '1.5rem' }}>
        {whatsAppStatus === "pending" ? <AiOutlineClockCircle /> : (whatsAppStatus === "approved" ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />)}
      </td>
    )
  }

  return (<td className="text-center" style={{ 'verticalAlign': 'middle' }} >N/A</td>)

}

export default TemplateSection;