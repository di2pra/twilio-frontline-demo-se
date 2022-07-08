import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Modal, Pagination, Row, Spinner, Table } from "react-bootstrap";
import ModalContainer from "../../../components/ModalContainer";
import useApi from "../../../hooks/useApi";
import { IContentListResponse, ITemplate } from "../../../Types";
import VariableColumn from "./VariableColumn";

type Props = {
  isShowing: boolean;
  hide: () => void;
  updateCallback: (data: ITemplate[]) => void
  selectedIndex?: number;
}

const pageSize = 50;

const TemplateModal = ({ isShowing, hide, selectedIndex, updateCallback }: Props) => {

  const { getContentList, addContentToTemplate } = useApi();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  const [data, setData] = useState<IContentListResponse>();


  useEffect(() => {

    let isMounted = true;

    getContentList({ pageSize: pageSize })
      .then(data => {
        if (isMounted) {
          setData(data);
        }
      }).finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    }

  }, [getContentList])


  const handleClose = useCallback(() => {
    hide()
  }, [hide]);

  const selectTemplateHandler = useCallback((sid: string) => {

    if (typeof selectedIndex != "undefined") {
      setIsLoading(true);

      addContentToTemplate({ index: selectedIndex, contentSid: sid })
        .then((data) => {
          updateCallback(data);
          hide();
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false))
    }

  }, [selectedIndex, addContentToTemplate, hide, updateCallback]);

  const goPageUrl = useCallback((url: string | null) => {

    if (url) {

      setIsLoading(true);

      getContentList({
        pageUrl: url
      })
        .then((data) => {
          console.log(data);
          setData(data)
        })
        .finally(() => setIsLoading(false))
    }


  }, [getContentList]);

  if (isLoading) {
    return (
      <ModalContainer size="xl" title="Add Content to template" isShowing={isShowing} >
        <Modal.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner className="mb-3" animation="border" variant="danger" />
            <h3>Loading...</h3>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </ModalContainer>
    )
  }

  if (data) {
    return (
      <ModalContainer size="xl" title="Add Content to template" isShowing={isShowing} >
        <Modal.Body>
          {
            error ? <Alert variant="danger">{error}</Alert> : null
          }
          <Row className="mb-3">
            <Col>
              <Button>Create New Content</Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Table style={{ 'fontSize': '13px' }} className="mb-0" bordered>
                <thead>
                  <tr>
                    <th>Friendly Name</th>
                    <th>Lang</th>
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
                          <td className="text-center">{item.language}</td>
                          <td>{item.types['twilio/text'].body}</td>
                          <td><VariableColumn variables={item.variables} /></td>
                          <td><Button className="m-2" variant="secondary" type="button" onClick={() => { selectTemplateHandler(item.sid) }}>Select</Button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <Pagination>
                <Pagination.Prev onClick={() => { goPageUrl(data.meta.previous_page_url) }} disabled={data.meta.previous_page_url === null} />
                <Pagination.Next onClick={() => { goPageUrl(data.meta.next_page_url) }} disabled={data.meta.next_page_url === null} />
              </Pagination>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="button" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </ModalContainer>
    )
  }

  return null;


}

export default TemplateModal;