import { useCallback, useContext, useState } from "react";
import { Card, Form, FormCheck, Alert, Button, Col, Row, Table } from "react-bootstrap";
import { ClaimContext } from "../../../providers/ClaimProvider";
import { TemplateContext } from "../../../providers/TemplateProvider";
import { UserContext } from "../../../SecureLayout";
import { ITemplate } from "../../../Types";
import TemplateRow from "./TemplateRow";

const TemplateSection = () => {

  const { template, updateTemplate } = useContext(TemplateContext);

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [editableTemplate, setEditableTemplate] = useState<ITemplate[]>([]);

  const { claim } = useContext(ClaimContext);
  const { loggedInUser } = useContext(UserContext);

  const handleEditBtn = useCallback(() => {
    setEditableTemplate(template);
    setIsEditable(true);
  }, [template])

  const handleClose = () => {
    setEditableTemplate(template);
    setIsEditable(false);
  };

  const processUpdateTemplate = useCallback(() => {
    if (updateTemplate && editableTemplate) {
      updateTemplate(editableTemplate);
    }
  }, [updateTemplate, editableTemplate]);

  const handleOnChange = useCallback((event: any, name: string, catKey: number, tempKey?: number) => {

    let newTemplate: ITemplate[] = [];

    switch (name) {
      case 'cat':

        newTemplate = editableTemplate.map((cat, key) => {
          if (key === catKey) {
            return {
              ...cat,
              display_name: event.target.value
            }
          }
          return cat;
        })

        break;
      case 'temp_content':

        newTemplate = editableTemplate.map((cat, ckey) => {
          if (ckey === catKey) {
            return {
              ...cat,
              templates: cat.templates.map((temp, tkey) => {

                if (tkey === tempKey) {
                  return {
                    ...temp,
                    content: event.target.value
                  }
                }

                return temp;
              })
            }
          }
          return cat;
        })

        break;
      case 'temp_wa':

        newTemplate = editableTemplate.map((cat, ckey) => {
          if (ckey === catKey) {
            return {
              ...cat,
              templates: cat.templates.map((temp, tkey) => {

                if (tkey === tempKey) {
                  return {
                    ...temp,
                    whatsappApproved: event.target.checked
                  }
                }

                return temp;
              })
            }
          }
          return cat;
        })

        break;
    }

    setEditableTemplate(newTemplate);

  }, [editableTemplate]);

  const deleteCategory = useCallback((catKey: number) => {

    setEditableTemplate(prevState => prevState.filter((_, ckey) => ckey !== catKey));

  }, []);

  const deleteTemplate = useCallback((catKey: number, tempKey: number) => {

    setEditableTemplate(prevState => prevState.map((cat, ckey) => {

      if (ckey === catKey) {
        return {
          ...cat,
          templates: cat.templates.filter((_, tkey) => tkey !== tempKey)
        }
      }
      return cat;
    }));

  }, []);

  const addTemplate = useCallback((catKey: number) => {

    setEditableTemplate(prevState => prevState.map((cat, ckey) => {

      if (ckey === catKey) {
        return {
          ...cat,
          templates: [...cat.templates, {
            content: "",
            whatsappApproved: false
          }]
        }
      }
      return cat;
    }));

  }, []);

  const addCategory = useCallback(() => {

    setEditableTemplate(prevState => {
      return [...prevState, {
        display_name: "",
        templates: []
      }]
    });

  }, []);

  if (isEditable) {
    return (
      <>
        <Card className="mb-3">
          <Card.Header as="h3">Templates</Card.Header>
          <Card.Body>
            {
              editableTemplate.map((cat, catKey) =>
                <Card key={catKey} className="mb-3">
                  <Card.Body>
                    <Row>
                      <Form.Group xs={6} as={Col} controlId={`cat-${catKey}`}>
                        <Form.Control type="text" name={`cat-${catKey}`} placeholder="Category Name" value={cat.display_name} onChange={(e) => { handleOnChange(e, "cat", catKey) }} />
                      </Form.Group>
                      <Col>
                        <Button className="float-end" variant="link" type="button" onClick={() => { deleteCategory(catKey) }} >Delete Category</Button>
                      </Col>
                    </Row>
                    <Table>
                      <thead>
                        <tr>
                          <td style={{ width: '60%' }} >Content</td>
                          <td className="text-center" style={{ width: '20%' }} >WhatsApp Approved ?</td>
                          <td className="text-center" style={{ width: '10%' }}></td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          cat.templates.map((temp, tempKey) => {
                            return (
                              <tr key={tempKey}>
                                <td style={{ 'verticalAlign': 'middle' }}>
                                  <Form.Group controlId={`cat-${catKey}-temp-content-${tempKey}`}>
                                    <Form.Control as="textarea" rows={2} name={`cat-${catKey}-temp-content-${tempKey}`} placeholder="Content" value={temp.content} onChange={(e) => { handleOnChange(e, "temp_content", catKey, tempKey) }} />
                                  </Form.Group>
                                </td>
                                <td className="text-center">
                                  <Form.Group controlId={`cat-${catKey}-temp-wa-${tempKey}`}>
                                    <Form.Check type="switch">
                                      <FormCheck.Input name={`cat-${catKey}-temp-wa-${tempKey}`} checked={Boolean(temp.whatsappApproved)} onChange={(e) => { handleOnChange(e, "temp_wa", catKey, tempKey) }} />
                                    </Form.Check>
                                  </Form.Group>
                                </td>
                                <td>
                                  <Button variant="link" type="button" onClick={() => { deleteTemplate(catKey, tempKey) }} >Delete</Button>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    <Button variant="link" type="button" onClick={() => { addTemplate(catKey) }} >Add Template</Button>
                  </Card.Body>
                </Card>
              )
            }
            <Button variant="link" type="button" onClick={() => { addCategory() }} >Add Category</Button>
            <Alert className="mt-3" variant="success">
              <Alert.Heading as="h6">Available variables :</Alert.Heading>
              <hr />
              <div className="ms-2 me-auto">
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{customerFirstname}}`}</code> : Customer Firstname</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{customerLastname}}`} :</code> Customer Last Name</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{agentFirstname}}`} :</code> Agent Firstname</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{agentLastname}}`} :</code> Agent Lastname</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{companyNameShort}}`} :</code> Company Name Short</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{companyNameLong}}`} :</code> Company Name Long</p>
                <p className="m-0" style={{ fontSize: '0.8rem' }}><code>{`{{companyUrl}}`} :</code> Company Name Long</p>
              </div>
            </Alert>
            <Row>
              <Col>
                <Button variant="danger" type="button" onClick={handleClose}>Cancel</Button>
                <Button className="float-end" variant="primary" type="button" onClick={processUpdateTemplate}>Save</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Header as="h3">Templates</Card.Header>
        <Card.Body>
          {
            (template || []).map((templateCategory, templateCategoryKey) => {
              return <TemplateRow key={templateCategoryKey} templateCategory={templateCategory} />
            })
          }
          {
            (claim != null && claim.ended_at === null && (claim.user === loggedInUser?.email)) ? <Button variant="warning" onClick={() => { handleEditBtn() }} >Edit</Button> : null
          }
        </Card.Body>
      </Card>
    </>
  )
}

export default TemplateSection;