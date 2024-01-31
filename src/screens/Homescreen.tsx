/* eslint-disable import/named */
/* eslint-disable import/namespace */
/* eslint-disable import/no-unresolved */
import React, {useEffect, useRef, useState} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useWebToken} from '../hooks/useWebToken';
import BASE_URL from '../constants/baseUrl';
import {checkLocationPermission} from '../utils/checkLocationPermission';

const HomeScreen = () => {
  const {storeTokenFromWeb, getTokenFromStorage, clearTokenFromStorage} =
    useWebToken();
  const [uri, setUri] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const webViewRef = useRef<WebView>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onGetMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      await clearTokenFromStorage();

      if (data.accessToken && data.refreshToken) {
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;

        await storeTokenFromWeb(accessToken, 'accessToken');
        await storeTokenFromWeb(refreshToken, 'refreshToken');
        return;
      } else {
        return;
      }
    } catch (error) {
      console.warn('Error in receiving data');
    }
  };

  useEffect(() => {
    const checkAndHandleLocationPermission = async () => {
      await checkLocationPermission();
    };

    checkAndHandleLocationPermission();
  }, []);

  useEffect(() => {
    const updateUri = async () => {
      try {
        const accessToken = await getTokenFromStorage('accessToken');
        const refreshToken = await getTokenFromStorage('refreshToken');
        let newUri;

        // NOTE: 앱에 저장된 토큰들이 없는 경우와 있는 경우 uri 분리
        if (accessToken == null || refreshToken === null) {
          newUri = BASE_URL + '?fromApp=true';
        } else {
          newUri =
            BASE_URL +
            `?fromApp=true&accessToken=${accessToken}&refreshToken=${refreshToken}`;
        }

        setUri(newUri);
      } catch (error) {
        console.error('Error updating URI:', error);
      }
    };
    updateUri();
  }, [getTokenFromStorage]);

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
                uri: uri,
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
              onMessage={onGetMessage}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
