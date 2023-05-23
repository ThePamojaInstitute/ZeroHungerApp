jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

global.console = {
    ...console,
    log: jest.fn(),
};

jest.mock('@expo/vector-icons/Ionicons', () => 'Icon')