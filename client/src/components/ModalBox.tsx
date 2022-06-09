import { useCallback, useImperativeHandle, useState, forwardRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";

const modalElement = document.getElementById('modal-root')!;

const ModalBox = ({ title, children, defaultOpened = false, callback }: { title: string, children: React.ReactNode, defaultOpened?: boolean, callback?: (confirmation: boolean) => void }, ref : React.Ref<unknown>) => {

  const [showModal, setShowModal] = useState(defaultOpened);

  useImperativeHandle(ref, () => ({
    open: () => setShowModal(true)
  }), []);

  const closeModal = useCallback((confirmation: boolean) => {

    if(callback) {
      callback(confirmation);
    }
    
    setShowModal(false)
  }, [callback]);
 
  if (showModal) {
    return createPortal(
      <Modal backdrop="static" show onHide={() => closeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeModal(false)}>No</Button>
          <Button variant="primary" onClick={() => closeModal(true)}>Yes</Button>
        </Modal.Footer>
      </Modal>,
      modalElement
    )
  }

  return null


}

export default forwardRef(ModalBox);