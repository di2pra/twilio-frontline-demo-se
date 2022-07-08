import { Table } from "react-bootstrap";
import sanitizeHtml from 'sanitize-html';

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

export default VariableColumn;