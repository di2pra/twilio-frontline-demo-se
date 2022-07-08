import { useCallback, useContext, useState } from "react";
import { Alert, Button, Card, Spinner, Table } from "react-bootstrap";
import { MdDelete } from 'react-icons/md';
import useApi from "../../hooks/useApi";
import { UserContext } from "../../SecureLayout";
import { IClaim, IConversation } from "../../Types";

type Props = {
  claim?: IClaim;
  conversationList: IConversation[];
}

const ConversationSection = ({ claim, conversationList }: Props) => {

  const { deleteAllConversation } = useApi();

  const [conversationListState, setConversationListState] = useState<IConversation[]>(conversationList);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { loggedInUser } = useContext(UserContext);

  const deleteAllHandler = useCallback(() => {

    setIsProcessing(true);

    deleteAllConversation()
      .then(() => setConversationListState([]))
      .catch((error) => setError(error.message))
      .finally(() => setIsProcessing(false));

  }, [deleteAllConversation]);



  if (isProcessing) {
    return (
      <Card className="mb-3">
        <Card.Header as="h3">Conversations</Card.Header>
        <Card.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner className="mb-3" animation="border" variant="danger" />
            <h3>Processing...</h3>
          </div>
        </Card.Body>
      </Card>
    )
  }

  if (error) {

    return (
      <Card className="mb-3">
        <Card.Header as="h3">Conversations</Card.Header>
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    )

  }

  if (conversationListState.length === 0) {
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
              conversationListState.map((item, index) => {
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