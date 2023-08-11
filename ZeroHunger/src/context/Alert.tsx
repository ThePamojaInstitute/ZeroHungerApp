import React, { useReducer, createContext, Dispatch, useContext } from "react";

export type AlertContextFields = {
    type: string;
    open: boolean;
    alertType: string;
    message?: string;
};

const initialState: AlertContextFields = {
    type: "close",
    open: false,
    alertType: "info",
};

export type AlertContextType = {
    alert?: AlertContextFields;
    dispatch?: Dispatch<any>;
};

function reducer(state: any, action: any): AlertContextFields {
    switch (action.type) {
        case "close":
            return {
                ...initialState,
            };
        case "open":
            return {
                ...state,
                open: true,
                alertType: action.alertType,
                message: action.message,
            };
        default:
            throw new Error(`unknown action from state: ${JSON.stringify(action)}`);
    }
}

export const AlertContext = createContext<AlertContextType>({});

type AlertProviderProps = {
    children?: JSX.Element
}

export function AlertProvider({ children }: AlertProviderProps) {
    const [alert, dispatch] = useReducer(reducer, initialState);

    return (
        <AlertContext.Provider value={{ alert, dispatch }}>
            {children}
        </AlertContext.Provider>
    )
}

// Hook to access the context easily
export function useAlert() {
    return useContext(AlertContext);
}
