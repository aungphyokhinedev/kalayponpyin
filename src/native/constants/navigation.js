import Colors from '../../../native-base-theme/variables/commonColor';

export default {
  navbarProps: {
    navigationBarStyle: { backgroundColor: '#3f51b5' },
    titleStyle: {
      color: '#fffd',
      alignSelf: 'center',
      letterSpacing: 2,
      fontSize: Colors.fontSizeBase,
    },
    backButtonTintColor: '#fffd',
  },

  tabProps: {
    swipeEnabled: false,
    activeBackgroundColor: 'rgba(170,170,170,0.1)',
    inactiveBackgroundColor: '#3f51b5',
    inactiveTintColor: '#ccc',
    tabBarStyle: { backgroundColor: '#3f51b5' },
  },

  icons: {
    style: { color: '#fffd', height: 30, width: 30 },
  },
};
