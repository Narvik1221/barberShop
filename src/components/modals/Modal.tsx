// components/Modal.tsx
import React from "react";
import styles from "./Modal.module.scss";
import { Button } from "../Button/Button";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {children}
        <div className={styles.modalActions}>
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
