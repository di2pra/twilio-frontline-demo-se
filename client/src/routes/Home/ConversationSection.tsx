import { useContext } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
import { UserContext } from "../../SecureLayout";
import { MdDelete } from 'react-icons/md';
import { IClaim, IConversation } from "../../Types";

type Props = {
  claim?: IClaim;
  conversationList: IConversation[];
  deleteAllHandler?: () => void;
}

const ConversationSection = ({ claim, conversationList, deleteAllHandler }: Props) => {

  const { loggedInUser } = useContext(UserContext);

  if (conversationList.length === 0) {
    return (
      <Card className="mb-3">
        <Card.Header as="h3">Conversations</Card.Header>
        <Card.Body>
          <Alert className="mb-0">No Conversation</Alert>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="mb-3">
      <Card.Header as="h3">Conversations</Card.Header>
      <Card.Body>
        <Table striped bordered>
          <thead>
            <tr>
              <th>SID</th>
              <th>Friendly Name</th>
              <th>Created</th>
              <th>Last Updated</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {
              conversationList.map((item, index) => {
                return (<tr key={index}>
                  <td>{item.sid}</td>
                  <td>{item.friendlyName}</td>
                  <td>{`${(new Date(item.dateCreated)).toLocaleDateString()} ${(new Date(item.dateCreated)).toLocaleTimeString()}`}</td>
                  <td>{`${(new Date(item.dateUpdated)).toLocaleDateString()} ${(new Date(item.dateUpdated)).toLocaleTimeString()}`}</td>
                  <td>{item.state}</td>
                </tr>)
              })
            }
          </tbody>
        </Table>
        {
          (claim != null && claim.ended_at === null && (claim.user === loggedInUser?.email)) ? <Button className="btn-with-icon" variant="danger" onClick={deleteAllHandler}><MdDelete /><span>Delete All</span></Button> : null
        }
      </Card.Body>
    </Card>
  )
}

export default ConversationSection;