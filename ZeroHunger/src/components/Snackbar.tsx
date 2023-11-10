import React, { useEffect, useState } from "react";
import { Snackbar, Text } from "react-native-paper";
import { useAlert } from "../context/Alert";

const SnackBar = () => {
    const { alert, dispatch } = useAlert();
    const [alertSyle, setAlertStyle] = useState({
        backgroundColor: 'blue',
    });

    useEffect(() => {
        switch (!!alert && alert.alertType || 'default') {
            case "info":
                setAlertStyle({
                    backgroundColor: 'blue',
                });
                break;
            case "error":
                setAlertStyle({
                    backgroundColor: 'red',
                });
                break;
            case "success":
                setAlertStyle({
                    backgroundColor: 'green',
                });
                break;
            default:
                setAlertStyle({
                    backgroundColor: 'purple',
                });
        }
    }, [alert]);

    const closeMe = () => {
        dispatch!({ type: "close" });
    };

    return (
        <>
            {!!alert && alert.open && (
                <Snackbar
                    style={alertSyle}
                    visible
                    onDismiss={closeMe}
                    action={{
                        label: "Ok",
                        onPress: closeMe,
                    }}
                    duration={3000}
                    wrapperStyle={{ maxWidth: 700, alignSelf: 'center' }}
                >
                    <Text style={{ color: 'white' }}>{!!alert && alert.message}</Text>
                </Snackbar>
            )}
        </>
    );
};

export default SnackBar;
