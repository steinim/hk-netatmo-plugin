import React, { useState, useEffect } from 'react';
import { Text, ListItem, View } from 'native-base';
import { NetatmoContext, useNetatmo } from '../NetatmoProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { typography } from '../../../src/styles';
import variable from '../../../native-base-theme/variables/material';

export const HomeList = () => {

  const { homes, setHomes } = useNetatmo();
  const [shouldRefresh, setShouldRefresh] = useState(0);
  const [fetching, setShouldFetch] = useState(false);

  const homesList = [
    {
      id: '5ed13c0a04743714cb43b1ce',
      name: 'Fiskåholmen',
      altitude: 5,
      coordinates: [
          5.5242229,
          59.4334612,
      ],
      country: 'NO',
      timezone: 'Europe/Oslo',
      modules: [
          {
              id: '70:ee:50:3b:f7:a8',
              type: 'NAMain',
              name: 'Innendørs',
              setup_date: 1554128663,
              modules_bridged: [
                  '02:00:00:3b:fb:ea',
                  '06:00:00:03:5f:f2',
                  '05:00:00:05:fa:c8',
              ],
          },
          {
              id: '02:00:00:3b:fb:ea',
              type: 'NAModule1',
              name: 'Utendørs',
              setup_date: 1554128688,
              bridge: '70:ee:50:3b:f7:a8',
          },
          {
              id: '06:00:00:03:5f:f2',
              type: 'NAModule2',
              name: 'Vindmåler',
              setup_date: 1567859367,
              bridge: '70:ee:50:3b:f7:a8',
          },
          {
              id: '05:00:00:05:fa:c8',
              type: 'NAModule3',
              name: 'Regnmåler',
              setup_date: 1567859694,
              bridge: '70:ee:50:3b:f7:a8',
          },
      ],
    },
  ];

  const fetchHomes = async () => {
    setHomes(homesList);
    setShouldFetch(true);
    setTimeout(function () {
      console.log('Fetching homes...');
      setShouldFetch(false);
  }, 2000);
  };

  const onRefresh = () => {
    // Increment number just to trigger a refresh
    const increment = shouldRefresh + 1;
    setShouldRefresh(increment);
    fetchHomes();
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const styles = StyleSheet.create({
    loading: {
      justifyContent: 'center',
      alignSelf: 'center',
    },
    textLarge: {
      fontSize: 18,
    },
    textSmall: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    header: {
      paddingTop: 20,
    },
    scrollview: {
      paddingBottom: 160,
    },
    icon: {
      color: variable.kraftCyan,
      fontSize: 16,
      marginLeft: -2,
      marginRight: 10,
      marginTop: 4,
    },
  });

  return (
    <NetatmoContext.Consumer>
      {() => (
        <View>
          {fetching &&
          <View style={styles.loading}>
            <Text>{'\n'}</Text>
            <ActivityIndicator size = "large" color = {variable.kraftCyan}/>
            <Text>{'\n'}Henter dine hjem...</Text>
          </View>
          }
          {!fetching && homes() && homes().length > 0 &&
          <View>
          <Text style={[typography.textBold, styles.textLarge, styles.header]}>Dine hjem</Text>
          <ScrollView contentContainerStyle={styles.scrollview}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="transparent" colors={[ 'transparent' ]}/>
            }
          >
            {homes().map((item, key) => (
                  <ListItem key={key} accessibilityLabel={item.id + ' item'}>
                    <Icon name="home" style={styles.icon} /><Text style={[typography.textLight, styles.textSmall]}>{item.name}</Text>
                  </ListItem>
                ))}
          </ScrollView>
          </View>
          }
        </View>
      )}
    </NetatmoContext.Consumer>
  );
};

export default HomeList;
