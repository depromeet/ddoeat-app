/* eslint-disable import/namespace */
/* eslint-disable import/no-unresolved */
import React, {useEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {
  BackHandler,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {IP_ADDRESS_AOS} from '@env';
// import BASE_URL from '../constants/baseUrl';

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const webViewRef = useRef(null);
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current?.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="default" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{height: Dimensions.get('window').height}}>
          <View style={{flex: 1}}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />
            <WebView
              source={{
                // uri: BASE_URL,
                uri: `http://${
                  Platform.OS === 'android' ? IP_ADDRESS_AOS : 'localhost'
                }:3000/auth?fromApp=true`,
                flex: 1,
              }}
              ref={webViewRef}
              javaScriptEnabled
              scalesPageToFit={false}
              allowsBackForwardNavigationGestures
              textZoom={100}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              originWhitelist={['http://*', 'https://*', 'intent:*']}
              decelerationRate="normal"
              webviewDebuggingEnabled={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
