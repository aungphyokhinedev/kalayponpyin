import React from 'react';
import {
  Container, Content, Text, H2, H3,
} from 'native-base';
import { Font } from 'expo';
import {
  Image, StyleSheet, View,
} from 'react-native';
import Spacer from './Spacer';
import Loading from './Loading';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  cover: {
    flex: 1,
    width: null,
    height: null
  },
});

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,
    };
  }

  componentDidMount = () => {
    (async () => {
      await Font.loadAsync({
        unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
  }

  render = () => {
    const {
      fontLoaded,
    } = this.state;
    if (!fontLoaded) {
      return <Loading />;
    }

    return (
      <Container style={{ backgroundColor: '#3f51b5', flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20 }}>
            <View>
              <Text>
                {' '}
              </Text>
            </View>
         
            <Image resizeMode="contain" source={require('../../assets/logob.png')} style={styles.cover} />          
 
            <View style={{  flexDirection: 'column',}}>
            <Text style={{ fontFamily: 'unicode', color: '#fffd', textAlign: 'center', padding: 15 }}>
            ကလေးများ အတွက် ပုံပြင် ကဗျာများကို ပုံမှန်ထည့်သွင်းပေးသွားပါမည်။ ဂရပ်ဖစ် ပုံများမှာ freepik.com မှရယူထားပါသည်။
            {' '}
            </Text>
            <Image resizeMode="contain" source={require('../../assets/logoc.png')} style={{height:19,width:null}} />          
            <Spacer size={40} />
            </View>

      </Container>
    );
  }
}



export default About;
