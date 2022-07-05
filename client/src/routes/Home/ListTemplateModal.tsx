import { useCallback, useEffect, useState } from "react";
import { Form, Button, Col, Table, Modal, Alert, Spinner } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import { IContentListResponse } from "../../Types";
import sanitizeHtml from 'sanitize-html';

const ListTemplateModal = () => {

  const { getContentList } = useApi();

  const [show, setShow] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [validated, setValidated] = useState(false);

  const [data, setData] = useState<IContentListResponse>();


  useEffect(() => {

    getContentList().then(data => {
      setData(data);
    }).finally(() => {
      setIsLoading(false);
    });

  }, [])


  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  if (isLoading) {
    return (
      <Modal backdrop="static" size="xl" show={show}>
        <Form noValidate validated={validated} >
          <Modal.Header>
            <Modal.Title>Select an existing Template</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Spinner className="mb-3" animation="border" variant="danger" />
              <h3>Loading...</h3>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }

  if (data) {
    return (
      <Modal backdrop="static" size="xl" show={show}>
        <Form noValidate validated={validated} >
          <Modal.Header>
            <Modal.Title>Select an existing Template</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table className="mb-0" bordered>
              <thead>
                <tr>
                  <th>Friendly Name</th>
                  <th>Content</th>
                  <th>Variables</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>

                {
                  data.contents.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td>{item.friendly_name}</td>
                        <td>{item.types['twilio/text'].body}</td>
                        <td><VariableColumn variables={item.variables} /></td>
                        <td><Button variant="secondary" type="button">Select</Button></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    )
  }

  return null;


}

function VariableColumn({ variables }: {
  variables: {
    [key: string]: string;
  }
}) {
  return (
    <Table className="mb-0" borderless>
      <tbody>
        {
          Object.entries(variables).map(([varKey, varValue], index) => {
            return (
              <tr key={index}>
                <td className="text-center"><p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(`<code>{{${varKey}}}</code>`) }} /></td>
                <td className="text-center">{varValue}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  )
}

export default ListTemplateModal;