/* eslint-disable import/no-unresolved */
/* eslint-disable import/named */
// eslint-disable-next-line import/namespace
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AnimatedLottieView from 'lottie-react-native';
import React from 'react';

import splashLottie from '../assets/splash_full.json';
import {MainNavigatorParamsType} from '../navigation/MainNavigator';

interface Props {
  navigation: NativeStackNavigationProp<MainNavigatorParamsType>;
}

const SplashScreen = ({navigation}: Props) => {
  const onSplashFinish = () => {
    navigation.replace('Home');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <AnimatedLottieView
        source={splashLottie}
        autoPlay
        loop={false}
        onAnimationFinish={onSplashFinish}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

export default SplashScreen;
