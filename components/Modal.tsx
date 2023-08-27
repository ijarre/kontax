import React, { useRef } from "react";
import cn from "classnames";
import { useOnClickOutside } from "usehooks-ts";
type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  disableClickOutside?: boolean;
  onClose(): void;
};

const Modal = ({ children, isOpen, onClose, disableClickOutside }: Props) => {
  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (!disableClickOutside) {
      onClose();
    }
  });
  return (
    <div className={modalClass}>
      <div className="modal-box" ref={ref}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
