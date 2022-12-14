import { AlertColor } from "@mui/material";
import { Alert, Snackbar, SnackbarProps } from "@mui/material";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface ToastMessage {
  message: string;
  severity: AlertColor;
  key: number;
}

type ToastStyle = Omit<
  SnackbarProps,
  "TransitionProps" | "onClose" | "open" | "children" | "message"
>;

type ToastProps = {
  message: ToastMessage;
  onExited: () => void;
} & ToastStyle;

// https://mui.com/material-ui/react-snackbar/#consecutive-snackbars
const Toast: FC<ToastProps> = ({
  message,
  onExited,
  autoHideDuration,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      key={message.key}
      open={open}
      onClose={handleClose}
      TransitionProps={{ onExited }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={autoHideDuration ?? 5000}
      {...props}
    >
      <Alert severity={message.severity}>{message.message}</Alert>
    </Snackbar>
  );
};

export const ToastContext = createContext<{
  addMessage: (message: ToastMessage) => void;
}>(null as never);

const ToastProvider: FC<{ children: ReactNode } & ToastStyle> = ({
  children,
  ...props
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeMessage = (key: number) =>
    setMessages((arr) => arr.filter((m) => m.key !== key));

  return (
    <ToastContext.Provider
      value={{
        addMessage(message) {
          setMessages((arr) => [...arr, message]);
        }
      }}
    >
      {children}
      {messages.map((m) => (
        <Toast
          key={m.key}
          message={m}
          onExited={() => removeMessage(m.key)}
          {...props}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
