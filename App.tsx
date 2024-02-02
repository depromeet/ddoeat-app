/* eslint-disable import/namespace */
import React, {useEffect, useRef} from 'react';
import {BackHandler, Platform} from 'react-native';
import 'react-native-url-polyfill/auto';

// eslint-disable-next-line import/no-unresolved
import MainNavigator from './src/navigation/MainNavigator';

function App(): React.JSX.Element {
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

  return <MainNavigator />;
}

export default App;
