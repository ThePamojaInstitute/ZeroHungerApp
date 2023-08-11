import * as Font from 'expo-font';


const useFonts = async () => {
    await Font.loadAsync({
        'PublicSans_Regular': require('../../assets/PublicSans-Regular.ttf'),
        'PublicSans_Medium': require('../../assets/PublicSans-Medium.ttf'),
        'PublicSans_SemiBold': require('../../assets/PublicSans-SemiBold.ttf'),
    });
};

export default useFonts;