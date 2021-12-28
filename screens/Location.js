import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';

import axios from "axios";
import { API_URL } from "@env";

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';

//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';

const Location = ({ route }) => {

  const [deviceId, setDeviceId] =
    useState('');
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState('');
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState('');
  const [
    locationStatus,
    setLocationStatus
  ] = useState('');
  const axiosConfig = (token) => {
    return { headers: { Authorization: `${token}` } };
  };

  useEffect(() => {
    console.log(route.params.token);
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getdeviceId();
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          const idGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
            {
              title: 'State Access Required',
              message: 'This App needs to Access your state',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED && idGranted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getdeviceId();
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    getdeviceId();
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('Device details');

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);

        const url = `${API_URL}/positions/create`;
        const config = axiosConfig(route.params.token);


        if (deviceId.length > 0) {
          axios.post(url, {
            user: route.params.username,
            terminalId: deviceId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }, config)
            .then((response) => {
              //console.log(response);
            })
            .catch((error) => {
              console.log(error);
              if (error.response.status === 401) {
                setModal({
                  isOpen: true,
                  message: "Invalid credentials!"
                })
              } else {
                setModal({
                  isOpen: true,
                  message: "Something went wrong!"
                })
              }
            });
        }

      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    getdeviceId();
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('Device details');
        console.log(position);

        //getting the Longitude from the location json        
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);

        const url = `${API_URL}/positions/create`;
        const config = axiosConfig(route.params.token);

        console.log({
          user: route.params.username,
          terminalId: deviceId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        if (deviceId.length > 0) {
          axios.post(url, {
            user: route.params.username,
            terminalId: deviceId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }, config)
            .then((response) => {
              //console.log(response);
            })
            .catch((error) => {
              console.log(error);
              if (error.response.status === 401) {
                setModal({
                  isOpen: true,
                  message: "Invalid credentials!"
                })
              } else {
                setModal({
                  isOpen: true,
                  message: "Something went wrong!"
                })
              }
            });
        }

      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setDeviceId(uniqueId);
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            source={{
              uri:
                'https://raw.githubusercontent.com/AboutReact/sampleresource/master/location.png',
            }}
            style={{ width: 100, height: 100 }}
          />
          <Text style={styles.boldText}>
            {locationStatus}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
              color: 'black'
            }}>
            DeviceId: {deviceId}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
              color: 'black'
            }}>
            Longitude: {currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16,
              color: 'black'
            }}>
            Latitude: {currentLatitude}
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              title="Button"
              onPress={getOneTimeLocation}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
});

export default Location;