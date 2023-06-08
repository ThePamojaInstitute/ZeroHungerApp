jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn()
};

jest.mock('@expo/vector-icons/Ionicons', () => 'Icon')

jest.mock('@react-native-community/datetimepicker', () => {
    const React = require('react')
    const RealComponent = jest.requireActual(
        '@react-native-community/datetimepicker'
    )

    class Picker extends React.Component {
        render() {
            return React.createElement('Picker', this.props, this.props.children)
        }
    }

    Picker.propTypes = RealComponent.propTypes
    return Picker
})

require("@shopify/flash-list/jestSetup");