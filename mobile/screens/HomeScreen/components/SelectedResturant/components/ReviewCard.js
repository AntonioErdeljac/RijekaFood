import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardItem, Thumbnail, Text, Left, Body } from 'native-base';

const ReviewCard = (props) => {
  const { review } = props;

  return (
    <Card
      style={{
        borderColor: 'rgba(0,0,0,.3)',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 7,
        paddingBottom: 20,
        elevation: 0,
      }}
    >
      <CardItem style={{ borderRadius: 7 }}>
        <Left>
          <Thumbnail source={{ uri: review.profile_photo_url }} />
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
  );
};

ReviewCard.propTypes = {
  review: PropTypes.shape({}).isRequired,
};

export default ReviewCard;
