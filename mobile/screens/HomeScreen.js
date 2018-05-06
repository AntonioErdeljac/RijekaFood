import axios from 'axios';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Input, Item } from 'native-base';
import { WebBrowser } from 'expo';
import { Ionicons, EvilIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import call from 'react-native-phone-call'
import ActionButton from 'react-native-action-button';
CardAnimatable = Animatable.createAnimatableComponent(Card);
ContentAnimatable = Animatable.createAnimatableComponent(Content);



import Colors from '../constants/Colors';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      search: '',
      searchResults: [],
      selectedPlace: null,
    };

    this.content = {}

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);
  }

  componentDidMount() {
    axios('https://maps.googleapis.com/maps/api/place/textsearch/json?query=food+in+Rijeka&type=restaurant&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA')
      .then((response) => this.setState({ results: response.data.results }));
  }

  handleSelect(result) {
    this.content[result.id].fadeOutRight(500)
      .then(() => {
        axios(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${result.place_id}&key=AIzaSyAnwalUtTFmSsNgnBiMW7gF2aUX9wlX7jg`)
          .then((response) => {
            this.setState({
              selectedPlace: {
                ...result,
                formatted_phone_number: response.data.result.formatted_phone_number,
                weekday_text: response.data.result.opening_hours && response.data.result.opening_hours.weekday_text,
                reviews: response.data.result.reviews,
                locationImage: `https://maps.googleapis.com/maps/api/staticmap?zoom=17&size=600x600&maptype=roadmap&markers=color:red%7Clabel:%7C${result.geometry.location.lat},${result.geometry.location.lng}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`
              },
            });
          })
        })
  }

  handleSearch(text) {
    const { results } = this.state;

    this.setState({
      search: text,
    }, () => {
      axios(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.state.search}+in+Rijeka&type=restaurant&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`)
        .then((response) => this.setState({ searchResults: response.data.results }), () => {
          this.setState({
            searchResults: this.searchResults,
          });
        });
    })
  }

  handleDeselect() {
    const { selectedPlace } = this.state;
    this.selectedRef.fadeOutLeft(500)
      .then(() => {
        this.setState({
          tempSelectedPlace: selectedPlace,
          selectedPlace: null,
        }, () => {
          if(this.content[this.state.tempSelectedPlace.id]) {
            this.content[this.state.tempSelectedPlace.id].fadeInRight(500)
              .then(() => {
                this.setState({
                  tempSelectedPlace: null,
                })
              })
          } else {
            this.setState({
              tempSelectedPlace: null,
            })
          }
        });
      })
  }

  render() {
    const { results, search, searchResults, selectedPlace } = this.state;

    let content = <ActivityIndicator size="large" color={Colors.tintColor} />;

    if(!selectedPlace && results && search === '') {
      content = results.map((result, i) => {
        if(result) {

        let image = result.icon;
        if(result.photos && result.photos[0]) {
          image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`;
        }
          return (
            <TouchableWithoutFeedback
              key={Math.random()}
              onPress={() => this.handleSelect(result)}
            >
              <CardAnimatable
                ref = {ref => this.content[result.id] = ref}
                style={{
                  height: 90,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  marginLeft: 10,
                  marginRight: 10,
                  borderRadius: 3, marginBottom: i + 1 === results.length ? 50 : 5,
                  elevation: 0,
                  }}>
                <CardItem style={{ borderRadius: 10 }}>
                  <Left>
                    <Thumbnail style={{ borderRadius: 5 }} source={{uri: image}} />
                    <Body>
                      <Text style={{ fontFamily: 'nunito' }}>{result.name}</Text>
                      <Text note style={{ fontFamily: 'nunito', fontSize: 10 }}>{result.formatted_address}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </CardAnimatable>
            </TouchableWithoutFeedback>
          )
        }
      });
    }

    if(!selectedPlace && results && searchResults && search !== '') {
      content = searchResults.map((result, i) => {
        let image = result.icon;
        if(result.photos && result.photos[0]) {
          image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`;
        }
        return (
        <TouchableWithoutFeedback
          key={Math.random()}
          onPress={() => this.handleSelect(result)}
        >
          <CardAnimatable
            key={Math.random()}
            ref = {ref => this.content[result.id] = ref}
            style={{
              height: 90,
              borderColor: 'transparent',
              borderWidth: 0,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 3, marginBottom: i + 1 === searchResults.length ? 50 : 5,
              elevation: 0,
              }}>
            <CardItem style={{ borderRadius: 10 }}>
              <Left>
                <Thumbnail style={{ borderRadius: 5 }} source={{uri: image}} />
                <Body>
                  <Text style={{ fontFamily: 'nunito' }}>{result.name}</Text>
                  <Text note style={{ fontFamily: 'nunito', fontSize: 10 }}>{result.formatted_address}</Text>
                </Body>
              </Left>
            </CardItem>
          </CardAnimatable>
        </TouchableWithoutFeedback>
        )
      })
    }

    if(selectedPlace) {
      let openingHoursContent = null;
      if(selectedPlace.opening_hours) {
        openingHoursContent = selectedPlace.opening_hours.open_now
          ? (
              <CardItem>
                <Left>
                  <EvilIcons size={28} color="rgba(0,0,0,.4)" name="check" />
                  <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>Open now</Text>
                </Left>
              </CardItem>
            )
          : (
            <CardItem>
              <Left>
                <EvilIcons size={28} color="rgba(0,0,0,.4)" name="close-o" />
                <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>Closed now</Text>
              </Left>
            </CardItem>
            )
        } else {
          openingHoursContent = null;
        }

      content = (
        <CardAnimatable
          ref={ref => this.selectedRef = ref}
          animation="fadeInLeftBig"
          style={{
            borderColor: 'transparent',
            borderWidth: 0,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 3,
            paddingBottom: 90,
            elevation: 0,
            }}>
            {selectedPlace.photos
              ? (
                <CardItem
                style={{
                  borderRadius: 7,
                }}
              >
                <Image
                borderRadius={7}
                style={{
                  borderRadius: 7,
                }}
                source={{uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedPlace.photos && selectedPlace.photos[0] && selectedPlace.photos[0].photo_reference}&key=AIzaSyAnwalUtTFmSsNgnBiMW7gF2aUX9wlX7jg`}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              )
              : (
                <CardItem
                style={{
                  borderRadius: 7,
                }}
              >
                <Image
                borderRadius={7}
                style={{
                  borderRadius: 7,
                }}
                source={{uri: selectedPlace.locationImage}} style={{height: 200, width: null, flex: 1}}/>
              </CardItem>
              )
            }
          <CardItem>
            <Left>
              <Text style={{ fontSize: 18, fontFamily: 'nunito', color: 'rgba(0,0,0,.8)' }}>{selectedPlace.name}</Text>
            </Left>
          </CardItem>
          <CardItem button onPress={() => WebBrowser.openBrowserAsync(`https://www.google.com/maps?q=${selectedPlace.formatted_address}`)}>
            <Left>
              <EvilIcons size={28} color="rgba(0,0,0,.4)" name="location" />
              <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>{selectedPlace.formatted_address}</Text>
            </Left>
            <Right>
              <EvilIcons
                size={28}
                color="rgba(0,0,0,.4)"
                name="arrow-right"
                />
            </Right>
          </CardItem>
            {selectedPlace.formatted_phone_number &&
            <CardItem>
              <Left>
                <Ionicons size={28} style={{ marginLeft: 7 }} color="rgba(0,0,0,.4)" name="ios-call-outline" />
                <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>{selectedPlace.formatted_phone_number}</Text>
              </Left>
            </CardItem>
          }
          <CardItem>
            <Left>
              <EvilIcons size={28} color="rgba(0,0,0,.4)" name="star" />
              <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>{selectedPlace.rating}</Text>
            </Left>
          </CardItem>
          {openingHoursContent}
          {selectedPlace.photos &&
            <CardItem
              style={{
                borderRadius: 7,
              }}
            >
              <Image
              borderRadius={7}
              style={{
                borderRadius: 7,
              }}
              source={{uri: selectedPlace.locationImage}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
          }
          {selectedPlace.reviews.map((review) => {
            return (
              <Card key={Math.random()} style={{
                borderColor: 'rgba(0,0,0,.3)',
                borderWidth: 1,
                marginLeft: 10,
                marginRight: 10,
                borderRadius: 7,
                paddingBottom: 20,
                elevation: 0,
                }}>
            <CardItem style={{ borderRadius: 7 }}>
              <Left>
                <Thumbnail source={{uri: review.profile_photo_url }} />
                <Body>
                  <Text style={{ fontFamily: 'nunito' }}>{review.author_name}</Text>
                  <Text style={{ fontFamily: 'nunito' }} note>Ocjena: {review.rating}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Text style={{ fontFamily: 'nunito', fontSize: 14 }}>{review.text}</Text>
            </CardItem>
          </Card>
            )
          })}
        </CardAnimatable>
      )
    }

    return (
      <Container style={{ backgroundColor: '#fff'}}>
        <Animatable.View animation="slideInDown" style={{ elevation: 1, backgroundColor: Colors.tintColor, height: 170, display: 'flex', justifyContent: 'flex-start', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 20, paddingTop: 20 }}>
          <View style={{ paddingBottom: 20, marginTop: 30 }}>
            <Text style={{ color: '#fff', fontFamily: 'nexa', fontSize: 30, textAlign: 'center' }}>
              <MaterialCommunityIcons
                name={'food-fork-drink'}
                size={28}
                style={{ marginBottom: -3, width: 25 }}
                color={'#fff'}
              />
              &nbsp;RijekaFood
            </Text>
          </View>
            <Item style={{ backgroundColor: '#fff', marginRight: 20, marginLeft: 20, borderRadius: 30, paddingLeft: 30, padding: 0 }}>
              <EvilIcons name='search' size={28} color={Colors.tintColor} />
              <Input value={search} onChangeText={text => this.handleSearch(text)} placeholder='Pretraga' placeholderTextColor="rgba(0,0,0,.4)" style={{ fontSize: 15, fontFamily: 'nunito', color: 'rgba(0,0,0,.7)', borderRadius: 30, borderWidth: 0 }}/>
            </Item>
        </Animatable.View>
      <Content
        style={{ paddingTop: 30, backgroundColor: '#fff' }}>
        {content}
      </Content>
      {selectedPlace &&
        <ActionButton
          buttonColor={Colors.tintColor}
          onPress={this.handleDeselect}
          renderIcon = { () => (
              <Feather size={19} name="arrow-left" color="#fff" />
            )
          }
        >
        </ActionButton>
      }
    </Container>
    );
  }
}

const styles = StyleSheet.create({
  searchInput: {
    marginLeft: 10,
    marginRight: 10,
  },
  headerContainer: {
    justifyContent: 'space-around',
    backgroundColor: Colors.tintColor,
    height: 150,
    paddingTop: 80,
    flexDirection: 'row',
  },
  headerText: {
    color: '#fff',
    flex: 1,
    fontFamily: 'nunito',
    fontSize: 30,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: 'rgba(0,0,0,.01)',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
