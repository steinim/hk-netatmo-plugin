import React from 'react';
import { View, Container } from 'native-base';
import { Image, StyleSheet } from 'react-native';
import { NetatmoProvider } from '../NetatmoProvider';
import Login from '../components/Login';
import HomeList from '../components/HomeList';
import Logout from '../components/Logout';
import variable from '../../../native-base-theme/variables/material';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 172,
    height: 50,
  },
});

export const Netatmo = () => {
  const logo = require ('../assets/NetatmoLogo.png');
  return (
    <NetatmoProvider>
      <Login></Login>
      <Container>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>
          <View style={{ borderBottomColor: variable.kraftCyan, borderBottomWidth: 1, paddingTop: 10}} />
          <HomeList />
        </View>
      </Container>
      <Logout></Logout>
    </NetatmoProvider>
  );
};

export default Netatmo;
