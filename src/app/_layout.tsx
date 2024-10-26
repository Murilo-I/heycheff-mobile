import { ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { Loading } from '@/components/loading';
import { tokenCache } from '@/storage/tokenCache';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

export default function Layout() {
    const [fontsLoaded] = useFonts({
        'Consolas-Bold': require('../../assets/fonts/Consolas-Bold.ttf'),
        'Sunshine': require('../../assets/fonts/Sunshine.otf')
    });

    if (!fontsLoaded) {
        return <Loading />
    }

    return (
        <View style={{ flex: 1 }}>
            <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
                <PaperProvider>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="transparent"
                        translucent
                    />
                    <Slot />
                </PaperProvider>
            </ClerkProvider>
        </View>
    );
}