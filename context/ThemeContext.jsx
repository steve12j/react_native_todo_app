import { createContext, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

export const ThemeContext = createContext({});

export default ThemeProvider = ({ children }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    return <ThemeContext.Provider value={{ theme, colorScheme, setColorScheme }}>
        {children}
    </ThemeContext.Provider>
}