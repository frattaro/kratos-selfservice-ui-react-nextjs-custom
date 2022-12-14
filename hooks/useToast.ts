import { AlertColor } from "@mui/material";
import { useContext } from "react";

import { ToastContext } from "../contexts/ToastProvider";

const useToast = () => {
  const { addMessage } = useContext(ToastContext);

  const show = (message: string, options: { severity: AlertColor }) => {
    addMessage({ message, ...options, key: new Date().getTime() });
  };

  return {
    show,
    info(message: string) {
      show(message, { severity: "info" });
    },
    success(message: string) {
      show(message, { severity: "success" });
    },
    warning(message: string) {
      show(message, { severity: "warning" });
    },
    error(message: string) {
      show(message, { severity: "error" });
    }
  };
};

export default useToast;
