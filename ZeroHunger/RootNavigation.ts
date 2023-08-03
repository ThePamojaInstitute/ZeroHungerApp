import { createNavigationContainerRef } from '@react-navigation/native';

type RootStackParamList = {
    LoginScreen: undefined;
    HomeScreen: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}