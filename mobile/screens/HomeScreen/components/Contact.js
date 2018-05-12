import PropTypes from 'prop-types';
import React from 'react';
import { View, BackHandler } from 'react-native';
import { Card, CardItem, Text, Left, Right } from 'native-base';
import { AdMobInterstitial } from 'expo';
import { EvilIcons, Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const CardAnimatable = Animatable.createAnimatableComponent(Card);

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    AdMobInterstitial.removeAllListeners();
  }

  handleBackButtonClick() {
    const { deselect } = this.props;

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    deselect();
    return true;
  }

  render() {
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
          <CardItem>
            <Text style={{ fontSize: 25, fontFamily: 'nunito', color: 'rgba(0,0,0,.8)' }}>Kontakt</Text>
          </CardItem>
          <CardItem>
            <Left>
              <Feather size={24} color="rgba(0,0,0,.4)" name="mail" />
              <Text style={{ fontSize: 16, fontFamily: 'nunito', color: 'rgba(0,0,0,.4)' }}>erdeljacapps@gmail.com</Text>
            </Left>
          </CardItem>
        </CardAnimatable>
      </View>
    );
  }
}

Contact.propTypes = {
  deselect: PropTypes.func.isRequired,
};

export default Contact;
