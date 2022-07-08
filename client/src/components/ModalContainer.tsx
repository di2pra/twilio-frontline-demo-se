import { Modal, ModalProps } from "react-bootstrap";
import { createPortal } from "react-dom";

type Props = {
  isShowing: boolean;
  title: string;
  children: React.ReactNode;
  size: ModalProps["size"];
}

const ModalContainer = ({ isShowing, title, children, size }: Props) =>
  isShowing
    ? createPortal(
      <>
        <Modal backdrop="static" size={size} show>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          {children}
        </Modal>
      </>,
      document.body
    )
    : null;

export default ModalContainer;