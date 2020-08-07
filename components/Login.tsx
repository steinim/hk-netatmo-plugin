import React, { useState } from 'react';
import { Text, View, Button } from 'native-base';
import { NetatmoContext, useNetatmo } from '../NetatmoProvider';
import { Dimensions, Modal, StyleSheet, TextInput } from 'react-native';
import material from '../../../native-base-theme/variables/material';

const styles = StyleSheet.create({
  modal: {
    marginTop: Dimensions.get('window').height / 3,
    padding: 25,
    backgroundColor: material.modalBackground,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: material.borderRadiusBase * 3,
  },
  modalBackground: {
    backgroundColor: material.loadingModalOverlayBackground,
    height: '100%',
  },
});
export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage] = useState('');

  const { handleLogin, isLoggedIn } = useNetatmo();

  const dummyToken = {
    accessToken: 'i_am_a_dummy_token',
    expiresIn: 3600,
    expires: Date(),
    tokenType: 'token_type',
    refreshToken: 'i_am_a_dummy_refresh_token',
  };

  const login = () => {
        handleLogin(dummyToken);
  };

  return (
    <NetatmoContext.Consumer>
      {() => (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isLoggedIn() === undefined || isLoggedIn() === false}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modal}>
              <Text style={{paddingBottom: 10}}>Brukernavn</Text>
              <TextInput
                style={{
                  height: 40,
                  width: 150,
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
                onChangeText={(text) => setUsername(text)}
                value={username}
              />
              <Text style={{paddingBottom: 10}}>Passord</Text>
              <TextInput
                secureTextEntry={true}
                style={{
                  height: 40,
                  width: 150,
                  borderColor: 'gray',
                  borderWidth: 1,
                }}
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
              <View style={{paddingTop: 20}}>
              <Button color={material.kraftBla} onPress={login}>
                <Text>Logg inn {isLoggedIn()} </Text>
              </Button>
              </View>
              {errorMessage !== '' && (
                <Text>Feil brukernavn eller passord. {errorMessage}</Text>
              )}
            </View>
          </View>
        </Modal>
      )}
    </NetatmoContext.Consumer>
  );
};

export default Login;