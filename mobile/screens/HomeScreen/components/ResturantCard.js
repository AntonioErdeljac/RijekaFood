import PropTypes from 'prop-types';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';
import * as Animatable from 'react-native-animatable';

const CardAnimatable = Animatable.createAnimatableComponent(Card);


const ResturantCard = (props) => {
  const {
    result,
    handleSelect,
    results,
    image,
    i,
    content,
  } = props;

  return (
    <TouchableWithoutFeedback
      key={Math.random()}
      onPress={() => handleSelect(result)}
    >
      <CardAnimatable
        ref={(ref) => { content[result.id] = ref; }}
        style={{
          height: 90,
          borderColor: 'transparent',
          borderWidth: 0,
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 3,
          marginBottom: i + 1 === results.length ? 150 : 5,
          elevation: 0,
        }}
      >
        <CardItem style={{ borderRadius: 10 }}>
          <Left>
            <Thumbnail style={{ borderRadius: 5 }} source={{ uri: image }} />
            <Body>
              <Text style={{ fontFamily: 'nunito' }}>{result.name}</Text>
              <Text note style={{ fontFamily: 'nunito', fontSize: 10 }}>{result.formatted_address}</Text>
            </Body>
          </Left>
        </CardItem>
      </CardAnimatable>
    </TouchableWithoutFeedback>
  );
};

ResturantCard.defaultProps = {
  image: undefined,
};

ResturantCard.propTypes = {
  result: PropTypes.shape({}).isRequired,
  handleSelect: PropTypes.func.isRequired,
  results: PropTypes.instanceOf(Array).isRequired,
  image: PropTypes.string,
  i: PropTypes.number.isRequired,
  content: PropTypes.shape({}).isRequired,
};

export default ResturantCard;
