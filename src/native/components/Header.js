import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from 'native-base';
import Spacer from './Spacer';

const Header = ({ title, content }) => (
  <View style={{margin:15}}>
    <Spacer size={15} />
    <Text style={{fontSize: 25}}>
      {title}
    </Text>
    {!!content && (
      <View>
        <Spacer size={5} />
        <Text style={{ fontFamily: 'unicode' }}>
          {content}
        </Text>
      </View>
    )}
  </View>
);

Header.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

Header.defaultProps = {
  title: 'Missing title',
  content: '',
};

export default Header;
