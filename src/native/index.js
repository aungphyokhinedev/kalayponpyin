import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { Font } from 'expo';
import { Provider } from 'react-redux';
import { Router, Stack } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/es/integration/react';
import PropTypes from 'prop-types';
import { Root, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import theme from '../../native-base-theme/variables/commonColor';

import Routes from './routes/index';
import Loading from './components/Loading';

// Hide StatusBar on Android as it overlaps tabs
if (Platform.OS === 'android') StatusBar.setHidden(true);

class App extends React.Component {
  state = {
    fontLoaded: false,
  };

  static propTypes = {
    store: PropTypes.shape({}).isRequired,
    persistor: PropTypes.shape({}).isRequired,
  }

  async componentDidMount() {
    await Font.loadAsync({
      unicode: require('../assets/fonts/Tharlon-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    const {
      store, persistor,
    } = this.props;
    const {
      fontLoaded,
    } = this.state;
    if (!fontLoaded) {
      return <Loading />;
    }
    return (
      <Root>
        <Provider store={store}>
          <PersistGate
            loading={<Loading />}
            persistor={persistor}
          >
            <StyleProvider style={getTheme(theme)}>
              <Router>
                <Stack style={{ fontFamily: 'unicode', fontSize: 16 }} key="root">
                  {Routes}
                </Stack>
              </Router>
            </StyleProvider>
          </PersistGate>
        </Provider>
      </Root>
    );
  }
}

export default App;
