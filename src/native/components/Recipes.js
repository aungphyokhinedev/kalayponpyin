import React from 'react';
import PropTypes from 'prop-types';
import { Font, PublisherBanner } from 'expo';
import {
  FlatList, TouchableOpacity, RefreshControl, Image, ImageBackground, View, StyleSheet
} from 'react-native';
import {
  Container, Content, Card, CardItem, Body, Text,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';

class RecipeListing extends React.Component {
  state = {
    fontLoaded: false,
  };

  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    reFetch: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    reFetch: null,
  };

  componentDidMount = () => {
    (async () => {
      await Font.loadAsync({
        unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
  }

  render() {
    const {
      error, reFetch, recipes, loading,
    } = this.props;
    const {
      fontLoaded,
    } = this.state;

    if (!fontLoaded) {
      return <Loading />;
    }

    if (loading) return <Loading />;

    // Error
    if (error) return <Error content={error} />;

    const keyExtractor = item => item.id.toString();

    const onPress = item => Actions.recipe({ match: { params: { id: String(item.id) } } });
    const styles = StyleSheet.create({
      unicodeText: {
        fontFamily: 'unicode',
      }
    });

    return (
      <Container padder>
        <Content padder>
          <PublisherBanner
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-2053424925474556/4122021146" // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            onDidFailToReceiveAdWithError={this.bannerError}
            onAdMobDispatchAppEvent={this.adMobEvent}
          />
          <FlatList
            numColumns={1}
            data={recipes}
            renderItem={({ item }) => (
              <Card transparent>
                <CardItem cardBody>
                  <TouchableOpacity onPress={() => onPress(item)} style={{ flex: 1 }}>
                    <ImageBackground
                      source={{ uri: item.image }}
                      style={{
                        height: 150,
                        width: null,
                        flex: 1,
                        borderRadius: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <View style={{
                        flex: 1,
                        height: 150,
                        width: null,
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                      >

                        <Image
                          resizeMode="contain"
                          style={{ flex: 1, height: 100, width: 100 }}
                          source={require('../../assets/play-button.png')}
                         />

                      </View>
                    </ImageBackground>

                  </TouchableOpacity>
                </CardItem>
                <CardItem padder>
                  <Body>
                    <Text style={styles.unicodeText}>
                      {item.title} 
                      {' ('}
                      {item.author}
                      {') '}
                    </Text>

                  </Body>
                </CardItem>
              </Card>
            )}
            keyExtractor={keyExtractor}
            refreshControl={(
              <RefreshControl
                refreshing={loading}
                onRefresh={reFetch}
              />
            )}
          />

          <Spacer size={20} />
        </Content>
      </Container>
    );
  }
}

export default RecipeListing;
