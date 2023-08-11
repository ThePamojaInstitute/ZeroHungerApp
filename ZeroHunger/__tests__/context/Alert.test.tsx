import React from "react";
import { Text, View, Button } from "react-native";
import { render, act, fireEvent } from "@testing-library/react-native";
import { AlertProvider, useAlert } from "../../src/context/Alert";

describe("AlertContext", () => {
    it("initializes with default values", () => {
        const TestComponent = () => {
            const { alert } = useAlert()
            return (
                <View>
                    <Text testID="alertType">{alert?.alertType}</Text>
                    <Text testID="open">{alert?.open.toString()}</Text>
                </View>
            )
        }

        const { getByTestId } = render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        )

        expect(getByTestId("alertType").props.children).toBe("info")
        expect(getByTestId("open").props.children).toBe("false")
    })

    test("updates alert state when 'open' action is dispatched", () => {
        const TestComponent = () => {
            const { alert, dispatch } = useAlert()

            const openAlert = () => {
                dispatch && dispatch({ type: "open", alertType: "success", message: "Alert message" });
            }

            return (
                <View>
                    <Button testID="openAlert" onPress={openAlert} title="Open Alert" />
                    <Text testID="alertType">{alert?.alertType}</Text>
                    <Text testID="open">{alert?.open.toString()}</Text>
                </View>
            )
        }

        const { getByTestId } = render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        )

        const alertTypeElement = getByTestId("alertType")
        const openElement = getByTestId("open")

        expect(alertTypeElement.props.children).toBe("info")
        expect(openElement.props.children).toBe("false")

        act(() => {
            fireEvent.press(getByTestId('openAlert'))
        })

        expect(alertTypeElement.props.children).toBe("success")
        expect(openElement.props.children).toBe("true")
    })

    it("resets alert state when 'close' action is dispatched", () => {
        const TestComponent = () => {
            const { alert, dispatch } = useAlert()

            const openAlert = () => {
                dispatch && dispatch({ type: "open", alertType: "success", message: "Alert message" })
            }

            const closeAlert = () => {
                dispatch && dispatch({ type: "close" })
            }

            return (
                <View>
                    <Button testID="openAlert" onPress={openAlert} title="Open Alert" />
                    <Button testID="closeAlert" onPress={closeAlert} title="Close Alert" />
                    <Text testID="alertType">{alert?.alertType}</Text>
                    <Text testID="open">{alert?.open.toString()}</Text>
                </View>
            )
        }

        const { getByTestId } = render(
            <AlertProvider>
                <TestComponent />
            </AlertProvider>
        )

        const alertTypeElement = getByTestId("alertType")
        const openElement = getByTestId("open")

        expect(alertTypeElement.props.children).toBe("info")
        expect(openElement.props.children).toBe("false")

        act(() => {
            fireEvent.press(getByTestId('openAlert'))
        })

        expect(alertTypeElement.props.children).toBe("success")
        expect(openElement.props.children).toBe("true")

        act(() => {
            fireEvent.press(getByTestId('closeAlert'))
        })

        expect(alertTypeElement.props.children).toBe("info")
        expect(openElement.props.children).toBe("false")
    })
})
