import { Card, Col, Row, Table } from "react-bootstrap";
import { ITemplate } from "../../../Types";
import sanitizeHtml from 'sanitize-html';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';


const TemplateRow = ({ templateCategory }: {
  templateCategory: ITemplate
}) => {

  return (
    <Row>
      <Col>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{templateCategory.display_name}</Card.Title>
            <Table bordered>
              <thead>
                <tr>
                  <td style={{ width: '60%' }} >Content</td>
                  <td className="text-center" style={{ width: '20%' }} >WhatsApp Approved ?</td>
                </tr>
              </thead>
              <tbody>
                {
                  templateCategory.templates.map((item, index) => {

                    let newContent = item.content.replace(/{{\s*[\w.]+\s*}}/g, (t1) => {
                      return `<code>${t1}</code>`
                    });

                    return (
                      <tr key={index}>
                        <td style={{ 'verticalAlign': 'middle' }}>
                          <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeHtml(newContent) }} />
                        </td>
                        <td className={item.whatsAppApproved ? 'text-center text-success' : 'text-center text-danger'} style={{ 'verticalAlign': 'middle', fontSize: '1.5rem' }}>{item.whatsAppApproved ? <AiOutlineCheckCircle /> : <AiOutlineCloseCircle />}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default TemplateRow;