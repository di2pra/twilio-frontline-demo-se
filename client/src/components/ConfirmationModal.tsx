import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { IBootstrapVariant } from "../Types";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type IModalButton<T> = {
  label: string;
  variant: IBootstrapVariant;
  value: T;
}

type Props<T> = {
  title: string,
  children: React.ReactNode,
  defaultOpened?: boolean,
  buttons: IModalButton<T>[],
  callback?: (value: T) => void
}

function ConfirmationModal<T>({ title, children, defaultOpened = false, buttons, callback }: Props<T>, ref: React.Ref<unknown>) {

  const [showModal, setShowModal] = useState(defaultOpened);

  useImperativeHandle(ref, () => ({
    open: () => setShowModal(true)
  }), []);

  const closeModal = useCallback((value: T) => {

    if (callback) {
      callback(value);
    }

    setShowModal(false)
  }, [callback]);

  if (showModal) {
    return createPortal(
      <Modal backdrop="static" show>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          {
            buttons.map((btn, key) => <Button key={key} variant={btn.variant} onClick={() => closeModal(btn.value)}>{btn.label}</Button>)
          }
        </Modal.Footer>
      </Modal>,
      document.body
    )
  }

  return null


}

export default forwardRef(ConfirmationModal);