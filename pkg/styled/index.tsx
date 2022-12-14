import { Button } from "@mui/material";

export interface DocsButtonProps {
  title: string;
  href?: string;
  onClick?: () => void;
  testid: string;
  disabled?: boolean;
  unresponsive?: boolean;
}

export const DocsButton = ({
  title,
  href,
  onClick,
  testid,
  disabled,
  unresponsive
}: DocsButtonProps) => (
  <div>
    <Button
      variant="text"
      onClick={onClick}
      disabled={disabled}
      data-testid={testid}
      href={href}
    >
      {title}
    </Button>
  </div>
);
