import PropTypes from 'prop-types';
import React from 'react';
import { Image, View, BackHandler, Button, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Left, Right } from 'native-base';
import { WebBrowser, AdMobInterstitial } from 'expo';
import { Ionicons, EvilIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Colors from '../../../../constants/Colors';


import { ReviewCard } from './components';

const CardAnimatable = Animatable.createAnimatableComponent(Card);

class SelectedResturant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadReviews: false,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.showInterstitial = this.showInterstitial.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  componentDidMount() {
    // AdMobInterstitial.setAdUnitID('ca-app-pub-9853377618487988/7006321979');

    // AdMobInterstitial.addEventListener(
    //   'interstitialDidClose',
    //   () => {
    //     this.setState({
    //       loadReviews: true,
    //     });
    //   },
    // );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AdMobInterstitial.removeAllListeners();
  }

  showInterstitial() {
    this.setState({
      loadReviews: true,
    });
    AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  }

  handleBackButtonClick() {
    const { deselect } = this.props;

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    deselect();
    return true;
  }

  render() {
    const { selectedPlace } = this.props;
    const { loadReviews } = this.state;

    let openingHoursContent = null;

    if (selectedPlace.opening_hours) {
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
        );
    } else {
      openingHoursContent = null;
    }

    const photosContent = selectedPlace.photos
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
              height: 200,
              width: null,
              flex: 1,
            }}
            source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedPlace.photos && selectedPlace.photos[0] && selectedPlace.photos[0].photo_reference}&key=AIzaSyAnwalUtTFmSsNgnBiMW7gF2aUX9wlX7jg` }}
          />
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
            height: 200,
            width: null,
            flex: 1,
          }}
            source={{ uri: selectedPlace.locationImage }}
          />
        </CardItem>
      );

    const locationImageContent = selectedPlace.photos &&
    <CardItem
      style={{
        borderRadius: 7,
      }}
    >
      <Image
        borderRadius={7}
        style={{
            borderRadius: 7,
            height: 200,
            width: null,
            flex: 1,
          }}
        source={{ uri: selectedPlace.locationImage }}
      />
    </CardItem>;


    const phoneNumberContent = selectedPlace.formatted_phone_number &&
      <CardItem>
        <Left>
          <Ionicons size={28} style={{ marginLeft: 7 }} color="rgba(0,0,0,.4)" name="ios-call-outline" />
          <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>{selectedPlace.formatted_phone_number}</Text>
        </Left>
      </CardItem>;


    return (
      <View style={{ flex: 1 }}>
        <CardAnimatable
          animation="fadeInLeft"
          ref={(ref) => { this.selectedRef = ref; }}
          style={{
            borderColor: 'transparent',
            borderWidth: 0,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 3,
            paddingBottom: 90,
            elevation: 0,
          }}
        >
          {photosContent}
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
          {phoneNumberContent}
          <CardItem>
            <Left>
              <EvilIcons size={28} color="rgba(0,0,0,.4)" name="star" />
              <Text style={{ fontSize: 10, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>{selectedPlace.rating}</Text>
            </Left>
          </CardItem>
          {openingHoursContent}
          {locationImageContent}
          {/* {!loadReviews &&
          <TouchableOpacity
            style={{
              borderColor: 'transparent',
              borderWidth: 0,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 3,
              elevation: 0,
              padding: 20,
              backgroundColor: Colors.tintColor,
            }}
            onPress={() => this.showInterstitial()}
          >
            <Text style={{
              fontFamily: 'nunito',
              fontSize: 20,
              color: 'white',
              textAlign: 'center',
            }}
            >Prikaži recenzije
            </Text>
          </TouchableOpacity>} */}
          {selectedPlace.reviews.map(review => (
            <ReviewCard
              key={Math.random()}
              review={review}
            />
          ))}
        </CardAnimatable>
      </View>
    );
  }
}

SelectedResturant.propTypes = {
  selectedPlace: PropTypes.shape({}).isRequired,
  deselect: PropTypes.func.isRequired,
};

export default SelectedResturant;
