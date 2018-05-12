import axios from 'axios';
import React from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import { Container, Content, Text, Input, Item, CardItem, Left } from 'native-base';
import { EvilIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { AdMobBanner, AdMobRewarded } from 'expo';
import ActionButton from 'react-native-action-button';
import * as Animatable from 'react-native-animatable';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Places from '../../constants/Places';

import { ResturantCard, SelectedResturant, Contact } from './components';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      results: Places.places,
      search: '',
      searchResults: [],
      selectedPlace: null,
      showContact: false,
    };

    this.content = {};
    this.selectedRef = {};
    this.contactRef = {};

    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);
  }

  // componentDidMount() {
  //   axios('https://maps.googleapis.com/maps/api/place/textsearch/json?query=food+in+Rijeka&type=restaurant&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA')
  //     .then(response => this.setState({ results: response.data.results }));
  // }

  componentWillUnmount() {
    AdMobRewarded.removeAllListeners();
  }

  handleSelect(result) {
    this.content[result.id].fadeOutRight(300)
      .then(() => {
        axios(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${result.place_id}&key=AIzaSyAnwalUtTFmSsNgnBiMW7gF2aUX9wlX7jg`)
          .then((response) => {
            this.setState({
              selectedPlace: {
                ...result,
                formatted_phone_number: response.data.result.formatted_phone_number,
                weekday_text: response.data.result.opening_hours
                  && response.data.result.opening_hours.weekday_text,
                reviews: response.data.result.reviews,
                locationImage: `https://maps.googleapis.com/maps/api/staticmap?zoom=17&size=600x600&maptype=roadmap&markers=color:red%7Clabel:%7C${result.geometry.location.lat},${result.geometry.location.lng}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`,
              },
            });
          });
      });
  }

  handleSearch(text) {
    this.setState({
      search: text,
    }, () => {
      axios(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.state.search}+in+Rijeka&type=restaurant&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`)
        .then(response => this.setState({ searchResults: response.data.results }), () => {
          this.setState({
            searchResults: this.searchResults,
          });
        });
    });
  }

  handleDeselect() {
    this.selectedRef.fadeOutLeft(300)
      .then(() => {
        this.setState({
          showContact: false,
          selectedPlace: null,
        });
      });
  }

  render() {
    const {
      results, search, searchResults, selectedPlace, showContact,
    } = this.state;

    let content = <ActivityIndicator size="large" color={Colors.tintColor} />;

    if (!selectedPlace && results && search === '' && !showContact) {
      content = results.map((result, i) => {
        let image = result.icon;
        if (result.photos && result.photos[0]) {
          image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`;
        }
        return (
          <ResturantCard
            key={Math.random()}
            handleSelect={this.handleSelect}
            i={i}
            content={this.content}
            results={results}
            result={result}
            image={image}
          />
        );
      });
    }

    if (!selectedPlace && results && searchResults && search !== '' && !showContact) {
      content = searchResults.map((result, i) => {
        let image = result.icon;
        if (result.photos && result.photos[0]) {
          image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${result.photos[0].photo_reference}&key=AIzaSyA1PIA1uULQ0nGyuoDZSyMHi3lQj3hG3xA`;
        }
        return (
          <ResturantCard
            key={Math.random()}
            handleSelect={this.handleSelect}
            i={i}
            content={this.content}
            results={searchResults}
            result={result}
            image={image}
          />
        );
      });
    }

    let backButtonContent = null;

    if (selectedPlace || showContact) {
      backButtonContent =
      (<ActionButton
        buttonColor={Colors.tintColor}
        onPress={this.handleDeselect}
        renderIcon={() => (
          <Feather size={19} name="arrow-left" color="#fff" />
        )
      }
      />);
    }


    if (selectedPlace && !showContact) {
      content = (
        <Animatable.View ref={(ref) => { this.selectedRef = ref; }} >
          <SelectedResturant
            selectedPlace={selectedPlace}
            deselect={this.handleDeselect}
          />
        </Animatable.View>
      );
    }

    if (showContact) {
      content = (
        <Animatable.View ref={(ref) => { this.selectedRef = ref; }} >
          <Contact
            deselect={this.handleDeselect}
          />
        </Animatable.View>
      );
    }

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Animatable.View
          animation="slideInDown"
          style={{
            elevation: 1,
            backgroundColor: Colors.tintColor,
            height: 170,
            display: 'flex',
            justifyContent: 'flex-start',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingBottom: 20,
            paddingTop: 20,
          }}
        >
          <View style={{ paddingBottom: 20, marginTop: 30 }}>
            <Text
              onPress={this.showRewarded}
              style={{
              color: '#fff',
              fontFamily: 'nexa',
              fontSize: 30,
              textAlign: 'center',
            }}
            >
              <MaterialCommunityIcons
                name="food-fork-drink"
                size={28}
                style={{ marginBottom: -3, width: 25 }}
                color="#fff"
              />
              &nbsp;RijekaFood
            </Text>
          </View>
          <Item style={{
            backgroundColor: '#fff',
            marginRight: 20,
            marginLeft: 20,
            borderRadius: 30,
            paddingLeft: 30,
            padding: 0,
          }}
          >
            <EvilIcons name="search" size={28} color={Colors.tintColor} />
            <Input
              value={search}
              onChangeText={text => this.handleSearch(text)}
              placeholder="Pretraga"
              placeholderTextColor="rgba(0,0,0,.4)"
              style={{
                fontSize: 15,
                fontFamily: 'nunito',
                color: 'rgba(0,0,0,.7)',
                borderRadius: 30,
                borderWidth: 0,
              }}
            />
          </Item>
        </Animatable.View>
        <Content
          style={{ paddingTop: 30, backgroundColor: '#fff' }}
        >
          {content}
        </Content>
        {backButtonContent}
        <ActionButton
          buttonColor={Colors.tintColor}
          position={selectedPlace || showContact ? 'left' : 'right'}
          renderIcon={() => <Feather size={19} name="info" color="#fff" />}
        >
          <ActionButton.Item buttonColor={Colors.tintColor} title="Želim dodati svoj obrt" onPress={() => this.setState({ showContact: true })}>
            <Feather size={19} name="plus" color="#fff" />
          </ActionButton.Item>
          <ActionButton.Item buttonColor={Colors.tintColor} title="Kontakt" onPress={() => this.setState({ showContact: true })}>
            <Feather size={19} name="mail" color="#fff" />
          </ActionButton.Item>
        </ActionButton>
        {/* <AdMobBanner
          bannerSize="smartBannerLandscape"
          adUnitID="ca-app-pub-9853377618487988/2231178453"
          didFailToReceiveAdWithError={() => console.log('error')}
        /> */}
      </Container>
    );
  }
}

// const styles = StyleSheet.create({
//   searchInput: {
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   headerContainer: {
//     justifyContent: 'space-around',
//     backgroundColor: Colors.tintColor,
//     height: 150,
//     paddingTop: 80,
//     flexDirection: 'row',
//   },
//   headerText: {
//     color: '#fff',
//     flex: 1,
//     fontFamily: 'nunito',
//     fontSize: 30,
//     textAlign: 'center',
//   },
//   container: {
//     flex: 1,
//     paddingTop: 80,
//     backgroundColor: 'rgba(0,0,0,.01)',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
