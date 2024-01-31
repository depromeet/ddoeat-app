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
  const {storeTokenFromWeb, getTokenFromStorage} = useWebToken();
  const [uri, setUri] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const webViewRef = useRef<WebView>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onGetMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.accessToken && data.refreshToken) {
        await storeTokenFromWeb(data.accessToken, 'accessToken');
        await storeTokenFromWeb(data.refreshToken, 'refreshToken');
      }
      return console.warn('Invalid data format');
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

        // TODO: 배포 시 배포 url로 변경하기
        const newUri =
          BASE_URL +
          `?fromApp=true&accessToken=${accessToken}&refreshToken=${refreshToken}`;

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
              onMessage={onGetMessage}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HomeScreen;
