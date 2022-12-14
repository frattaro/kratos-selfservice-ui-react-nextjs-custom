import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormControlLabel
} from "@mui/material";
import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled
}: NodeInputProps) {
  // Render a checkbox.s
  return (
    <FormControl
      variant="standard"
      error={Boolean(node.messages.find(({ type }) => type === "error"))}
    >
      <FormControlLabel
        control={
          <Checkbox
            name={attributes.name}
            defaultChecked={attributes.value === true}
            onChange={(e) => setValue(e.target.checked)}
            disabled={attributes.disabled || disabled}
          />
        }
        label={getNodeLabel(node)}
      />
      <FormHelperText>
        {node.messages.map(({ text }) => text).join("\n")}
      </FormHelperText>
    </FormControl>
  );
}
