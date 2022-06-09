import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { IConversation } from "../Types";

export const ConversationContext = createContext<{
  conversationList: IConversation[];
  deleteAllHandler?: () => void;
}>({
  conversationList: []
});

const ConversationProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const { getConversation, deleteAllConversation } = useApi();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [conversationList, setConversationList] = useState<IConversation[]>([]);


  useEffect(() => {

    let isMounted = true;

    getConversation().then((data) => {
      if (isMounted) {
        setConversationList(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getConversation]);

  const deleteAllHandler = useCallback(() => {

    setIsLoading(true);

    deleteAllConversation().then(() => {
      setConversationList([]);
      setIsLoading(false);
    })

  }, [deleteAllConversation])

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Conversation...</h3>
      </div>
    )
  }

  return (
    <ConversationContext.Provider value={{
      conversationList: conversationList,
      deleteAllHandler: deleteAllHandler
    }}>
      {children}
    </ConversationContext.Provider>
  );

}

export default ConversationProvider;