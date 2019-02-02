import React from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableHighlight, Dimensions, StyleSheet,
} from 'react-native';
import {
  Font, Audio, KeepAwake, PublisherBanner,
} from 'expo';
import {
  Container, Content, Card, CardItem, Body, List, ListItem, Text, Button,
} from 'native-base';
import Slider from 'react-native-slider';
import { MaterialIcons } from '@expo/vector-icons';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';
import Loading from './Loading';

const BUFFERING_STRING = 'Buffering...';
const AUDIO_ITEM_COLOR = '#000';
const DISABLED_OPACITY = 0.5;
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const FONT_SIZE = 14;

class RecipeView extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    recipeId: PropTypes.string.isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.state = {
      fontLoaded: false,
      mounted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isEnded: false,
      isError: false,
      rate: 1.0,
      volume: 1.0,
      recipe: null,
    };
  }

  componentDidMount = () => {
    const {
      recipeId, recipes,
    } = this.props;
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    (async () => {
      await Font.loadAsync({
        unicode: require('../../assets/fonts/Tharlon-Regular.ttf'),
      });
      this.setState({ fontLoaded: true });
    })();
    if (recipeId && recipes) {
      const recipe = recipes.find(item => parseInt(item.id, 10) === parseInt(recipeId, 10));
      this.setState({ recipe }, () => {
        this.loadNewPlaybackInstance(true);
      });
    }
  }

  componentWillUnmount = async () => {
    this.setState({ mounted: false });
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
  }

  onPlaybackStatusUpdate = (status) => {
    const {
      mounted,
    } = this.state;
    if (status.isLoaded && mounted) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        volume: status.volume,
      });
      if (status.didJustFinish) {
        this.updatePlaybackInstanceForIndex(false);
      }
    } else if (status.error) {
      console.log(`FATAL PLAYER ERROR: ${status.error}`);
    }
  };


  onPlayPause = () => {
    const {
      isPlaying,
    } = this.state;
    if (this.playbackInstance != null) {
      if (isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  onStop = () => {
    (async () => {
      this.playbackInstance.stopAsync();
    })();
  };

  onReplay = () => {
    (async () => {
      this.playbackInstance.replayAsync();
    })();
  };

  getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return `0${string}`;
      }
      return string;
    };
    return `${padWithZero(minutes)}:${padWithZero(seconds)}`;
  }

  getTimestamp = () => {
    const {
      playbackInstancePosition,
      playbackInstanceDuration,
    } = this.state;
    if (
      this.playbackInstance != null
      && playbackInstancePosition != null
      && playbackInstanceDuration != null
    ) {
      return `${this.getMMSSFromMillis(
        playbackInstancePosition,
      )} / ${this.getMMSSFromMillis(
        playbackInstanceDuration,
      )}`;
    }
    return BUFFERING_STRING;
  }

  getSeekSliderPosition() {
    const {
      playbackInstancePosition,
      playbackInstanceDuration,
    } = this.state;
    if (
      this.playbackInstance != null
      && playbackInstancePosition != null
      && playbackInstanceDuration != null
    ) {
      return (
        playbackInstancePosition
        / playbackInstanceDuration
      );
    }
    return 0;
  }

  updatePlaybackInstanceForIndex = async (playing) => {
    this.loadNewPlaybackInstance(playing);
  }

  loadNewPlaybackInstance = async (playing) => {
    try {
      const {
        rate,
        volume,
        recipe,
      } = this.state;
      console.log(recipe.sound);
      if (recipe.sound) {
        if (this.playbackInstance != null) {
          await this.playbackInstance.unloadAsync();
          this.playbackInstance.setOnPlaybackStatusUpdate(null);
          this.playbackInstance = null;
        }
        const source = { uri: recipe.sound };
        const initialStatus = {
          shouldPlay: playing,
          rate,
          volume,
        };
        const { sound } = await Audio.Sound.create(
          source,
          initialStatus,
          this.onPlaybackStatusUpdate,
        );
        this.playbackInstance = sound;
        this.setState({ mounted: true });
      }
    } catch (e) {
      console.log(e);
    }
  }

  onSeekSliderValueChange = () => {
    const {
      shouldPlay,
    } = this.state;
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  }

  onSeekSliderSlidingComplete = async (value) => {
    const {
      playbackInstanceDuration,
    } = this.state;
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  }

  render = () => {
    const {
      error,
    } = this.props;
    const {
      fontLoaded,
      recipe,
      isPlaying,
      isBuffering,
      isLoading,
    } = this.state;

    if (!fontLoaded) {
      return <Loading />;
    }

    // Error
    if (error) return <Error content={error} />;

    // Get this Recipe from all recipes

    // Recipe not found
    if (!recipe) return <Error content={ErrorMessages.recipe404} />;


    const styles = StyleSheet.create({
      unicodeText: {
        fontFamily: 'unicode',
      },
      title: {
        fontFamily: 'unicode',
        fontSize: 20,
      },
      bodyText: {
        lineHeight: 25,
      },
      thumb: {
        width: 20,
        height: 20,
      },
      track: {
        height: 2,
        backgroundColor: '#00000020',
      },
      container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'stretch',
        padding: 20,
      },
      playbackContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      playbackSlider: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
      },
      text: {
        fontSize: FONT_SIZE,
        minHeight: FONT_SIZE,
      },
      buttonsContainerBase: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
      buttonsContainerTopRow: {
        minWidth: DEVICE_WIDTH / 3.0,
        maxWidth: DEVICE_WIDTH / 3.0,
      },
      buttonsContainerMiddleRow: {
        maxHeight: 40,
        alignSelf: 'stretch',
        paddingRight: 20,
      },
    });


    // tutorial https://hackernoon.com/experimenting-with-react-native-expos-audio-api-6f13eeb729be
    return (
      <Container padder>
        <PublisherBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-2053424925474556/4122021146" // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={this.bannerError}
          onAdMobDispatchAppEvent={this.adMobEvent}
        />
        <KeepAwake />
        <Content padder>
          <View style={styles.container}>
            <Text style={styles.title}>
              {recipe.title}
            </Text>
            <Text>
              {isBuffering ? (
                recipe.sound ? BUFFERING_STRING : 'No Sound...'
              ) : (
                this.getTimestamp()
              )}
              {
                recipe.slug
              }

            </Text>
            {recipe.sound ? (
              <View
                style={[
                  styles.buttonsContainerBase,
                  {
                    opacity: isLoading
                      ? DISABLED_OPACITY
                      : 1.0,
                  },
                ]}
              >
                <TouchableHighlight
                  underlayColor="#00000022"
                  onPress={this.onPlayPause}
                  disabled={isLoading}
                >
                  {isBuffering ? (
                      <View>
                        <MaterialIcons
                          name="audiotrack"
                          size={40}
                          color={AUDIO_ITEM_COLOR}
                        />
                      </View>
                     ) : (
                    <View>
                      {isPlaying ? (
                        <MaterialIcons
                          name="pause-circle-outline"
                          size={40}
                          color={AUDIO_ITEM_COLOR}
                        />
                      ) : (
                        <MaterialIcons
                          name="play-circle-outline"
                          size={40}
                          color={AUDIO_ITEM_COLOR}
                        />
                      )}
                    </View>
                  )
              }

                </TouchableHighlight>
              </View>


            ) : null}
            {recipe.sound ? (


              <Slider
                style={styles.playbackSlider}
                value={this.getSeekSliderPosition()}
                onValueChange={this.onSeekSliderValueChange}
                onSlidingComplete={this.onSeekSliderSlidingComplete}
                thumbTintColor={AUDIO_ITEM_COLOR}
                minimumTrackTintColor={AUDIO_ITEM_COLOR}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
              />

            ) : null}

          </View>

         
              <Text style={[styles.unicodeText, styles.bodyText]}>
                {recipe.body}
                {'\n'}
                {recipe.author}
              </Text>

        
          <Spacer size={20} />
        </Content>
      </Container>
    );
  }
}

export default RecipeView;
