import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar, View } from 'react-native';

import { Loading } from '@/components/loading';
import '@/styles/global.css';

export default function Layout() {
    const [fontsLoaded] = useFonts({
        'Consolas-Bold': require('../../assets/fonts/Consolas-Bold.ttf'),
        'Sunshine': require('../../assets/fonts/Sunshine.otf')
    });

    if (!fontsLoaded) {
        return <Loading />
    }

    return (
        <View className='flex-1 bg-yellowOrange-10'>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Slot />
        </View>
    );
}