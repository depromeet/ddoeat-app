/* eslint-disable import/namespace */
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

// TODO: 현재는 AOS 로직만 추가한 상태
export const checkLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const locationPermission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    try {
      const result = await check(locationPermission);

      if (result === RESULTS.GRANTED) {
        return true;
      } else {
        // NOTE: 위치 권한이 없는 경우 권한 요청
        const permissionResult = await request(locationPermission);

        if (permissionResult === RESULTS.GRANTED) {
          return true;
        } else {
          // NOTE: 권한 요청이 거부된 경우
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  } else {
    console.error('Unsupported platform:', Platform.OS);
    return false;
  }
};
