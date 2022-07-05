import { useCallback, useContext, useState } from "react";
import { Card, Form, FormCheck, Alert, Button, Col, Row, Table } from "react-bootstrap";
import { UserContext } from "../../SecureLayout";
import { IClaim, ITemplate } from "../../Types";
import sanitizeHtml from 'sanitize-html';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import AddTemplateModal from "./AddTemplateModal";
import ListTemplateModal from "./ListTemplateModal";

type FormValue = {
  content: string;
  variables: {
    [key: string]: string
  }
}

const TemplateSectionNew = () => {

  const [formValue, setFormValue] = useState<FormValue>({
    content: "",
    variables: {}
  });

  const onContentChangeHandler = useCallback((event: any) => {

    const newContent = event.target.value;

    const regexp = /{{[0-9]+}}/g;

    const variableKey = [...newContent.matchAll(regexp)].map(item => item[0]);

    setFormValue(prevState => {

      let newVariables = {};

      for (let i = 0; i < variableKey.length; i++) {

        const key = variableKey[i];

        newVariables = { ...newVariables, ...{ [key]: prevState.variables[key] || '' } }
      }

      return { ...prevState, content: newContent, variables: newVariables }
    });
  }, [])

  return (
    <Card className="mb-3">
      <ListTemplateModal />
      <AddTemplateModal />
      <Card.Header as="h3">Templates</Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <h5>Démarrer une conversation</h5>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="mb-0" bordered>
              <thead>
                <tr>
                  <td style={{ width: '50%' }} ><strong>Content</strong></td>
                  <td className="text-center" style={{ width: '30%' }} ><strong>Variables</strong></td>
                  <td className="text-center" style={{ width: '20%' }} ><strong>WhatsApp Approved ?</strong></td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml("Bonjour <code>{{1}}</code>, je suis <code>{{2}}</code>, votre conseiller chez <code>{{3}}</code>, je me permets de vous contacter pour qu'on puisse discuter de votre contrat. Envoyez moi un message dès que vous êtes disponible. Merci.") }} />
                  </td>
                  <td>
                    <Table className="mb-0" borderless>
                      <tbody>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{1}}</code>`) }} /></td>
                          <td className="text-center">Customer Firstname</td>
                        </tr>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{2}}</code>`) }} /></td>
                          <td className="text-center">Agent Firstname</td>
                        </tr>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{3}}</code>`) }} /></td>
                          <td className="text-center">Company Name</td>
                        </tr>
                      </tbody>
                    </Table>
                  </td>
                  <td className='text-center text-success' style={{ 'verticalAlign': 'middle', fontSize: '1.5rem' }}><AiOutlineCheckCircle /></td>
                </tr>
                <tr>
                  <td>
                    <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml("Bonjour <code>{{1}}</code>, je suis <code>{{2}}</code>, votre conseiller chez <code>{{3}}</code>, je me permets de vous contacter pour qu'on puisse discuter de votre contrat. Envoyez moi un message dès que vous êtes disponible. Merci.") }} />
                  </td>
                  <td>
                    <Table className="mb-0" borderless>
                      <tbody>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{1}}</code>`) }} /></td>
                          <td className="text-center">Customer Firstname</td>
                        </tr>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{2}}</code>`) }} /></td>
                          <td className="text-center">Agent Firstname</td>
                        </tr>
                        <tr>
                          <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{3}}</code>`) }} /></td>
                          <td className="text-center">Company Name</td>
                        </tr>
                      </tbody>
                    </Table>
                  </td>
                  <td className={'text-center text-success'} style={{ 'verticalAlign': 'middle', fontSize: '1.5rem' }}><AiOutlineCheckCircle /></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default TemplateSectionNew;