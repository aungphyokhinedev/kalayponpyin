import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Container, Content, List, ListItem, Body, Left, Text, Icon, 
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Header from './Header';
import Spacer from './Spacer';
const changeLng = false;
const Profile = ({ member, logout }) => (
  <Container>
    <Content>


          <List>
            {(member && member.email)
              ? (
                <View>
                  <Content padder>
                    <Header
                      title={`Hi ${member.firstName},`}
                      content={`You are currently logged in as ${member.email}`}
                    />
                  </Content>

                  <ListItem onPress={Actions.updateProfile} icon>
                    <Body>
                      <Text>
                        Update My Profile
                  </Text>
                    </Body>
                  </ListItem>
                  <ListItem onPress={logout} icon>
                    <Body>
                      <Text>
                        Logout
                  </Text>
                    </Body>
                  </ListItem>
                </View>
              )
              : (
                <View>

                  <Spacer size={25} />
                  <ListItem onPress={Actions.login} icon>
                    <Body>
                      <Text>
                        Login
                  </Text>
                    </Body>
                  </ListItem>
                  <ListItem onPress={Actions.signUp} icon>
                    <Body>
                      <Text>
                        Sign Up
                  </Text>
                    </Body>
                  </ListItem>
                  <ListItem onPress={Actions.forgotPassword} icon>
                    <Body>
                      <Text>
                        Forgot Password
                  </Text>
                    </Body>
                  </ListItem>
                </View>
              )
            }
          {/*
                <ListItem onPress={Actions.locale} icon>
                  <Body>
                    <Text>
                      Change Language
                </Text>
                  </Body>
                </ListItem>
          */}  
            
          </List>
  
    </Content>
  </Container>
);

Profile.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  member: {},
};

export default Profile;
