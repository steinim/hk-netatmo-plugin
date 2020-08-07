import React from 'react';
import { Text, View, Button } from 'native-base';
import { NetatmoContext, useNetatmo } from '../NetatmoProvider';

export const Logout = () => {
  const { handleLogout, isLoggedIn } = useNetatmo();
  const logout = () => {
    handleLogout();
  };
  return (
    <NetatmoContext.Consumer>
      {() => (
        <View>
          {isLoggedIn() && (
            <View>
              <Button onPress={logout}>
                <Text>Logg ut</Text>
              </Button>
            </View>
          )}
        </View>
      )}
    </NetatmoContext.Consumer>
  );
};

export default Logout;