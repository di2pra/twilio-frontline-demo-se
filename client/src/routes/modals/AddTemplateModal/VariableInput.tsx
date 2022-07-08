import { Col, Form, Table } from "react-bootstrap";
import { AddTemplateFormValue } from ".";

function VariableInput({ formValue, isLoading, onVariableChangeHandler }: { formValue: AddTemplateFormValue, isLoading: boolean, onVariableChangeHandler: (key: string, value: string) => void }) {

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
                        <option value={`companyUrl`}>Company Url</option>
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

export default VariableInput;