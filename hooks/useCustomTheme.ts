import { useContext } from "react";

import { CustomThemeContext } from "../contexts/CustomThemeProvider";

const useCustomTheme = () => useContext(CustomThemeContext);

export default useCustomTheme;
