// SwipeCards.js
'use strict';

import autobind from 'autobind-decorator'
import React, { Component } from 'react';
import {
  StyleSheet, 
  Text, 
  View, 
  Image} from 'react-native';

import SwipeCards from 'react-native-swipe-cards';
import tipjson from 'racepal-app/datastructures/tip.json'
import {Icon, Divider} from 'react-native-elements'
import {Theme} from 'racepal-app/src/components'
import { PlaceTradeComponent } from 'racepal-app/src/components'
import { Button } from 'react-native-elements'
import moment from 'moment'

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={[styles.card]}>
        <View style={styles.cardHeader}> 
          <Text style={styles.headerText}> {this.props.meetingDate}</Text>
          <Icon name='bookmark' color={'black'} size={20} containerStyle={{position: 'absolute', top: 0, left: -95}} />
          <Icon name='close' onPress={() => this.props.cardRemoved(this.props.index)} size={20} containerStyle={{position: 'absolute', top: 0, right: -95}} />
        </View>
        <View style={styles.cardBody}> 
          <Text style={[Theme.typography.header3, {textAlign:'center'}]}> {this.props.trackName} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center'}]}> {this.props.eventName} {this.props.eventNumber} </Text>
          <Divider style={{top:4}} />
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Horse Name: {this.props.horse.name} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Horse Age: {this.props.horse.age} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Horse Colour: {this.props.horse.colour} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Horse Sex: {this.props.horse.sex} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Trainer: {this.props.horse.trainer.name} </Text>
          <Text style={[Theme.typography.small, {textAlign:'center', top:4}]}> Jockey: {this.props.horse.jockey.name} </Text>
        </View>
      </View>
    )
  }
}

class NoMoreCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.nofMoreCardsText}>No more tips</Text>
      </View>
    )
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    let events = tipjson.map((item, index) => Object.assign({}, item, {index}))
    let cards = []
    events
      .filter(e => e.meeting.events.event.horses !== undefined && 
        e.meeting.events.event.horses.horse.length > 0
        ).forEach(event => {
          event.meeting.events.event.horses.horse.forEach(horse => {
           cards.push({
              horse: {...horse},
              meetingDate: event.meeting.date,
              trackName: event.meeting.track.name,
              club: event.meeting.track.club,
              trackSurface:event.meeting.track.track_surface,
              location:event.meeting.track.location,
              country:event.meeting.track.location,
              eventName:event.meeting.events.event.name,
              eventNumber:event.meeting.events.event.number

          })
       })
      })
    this.state = {
      cards
      
    };
  }

  @autobind
  handleYup (card) {
    this.setState({
      event: card.horse,
      showPlaceTrade:true
    })
  }
  @autobind
  handleNope (card) {
    console.log(`Nope for ${card}`)
  }
  @autobind
  handleMaybe (card) {
    console.log(`Maybe for ${card.text}`)
  }
  @autobind
  cardRemoved (index) {
    console.log(`The index is ${index} cards length is ${this.state.cards.length}`);

    let CARD_REFRESH_LIMIT = 0

    if (this.state.cards.length - index <= CARD_REFRESH_LIMIT + 1) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);

      if (!this.state.outOfCards) {

        this.setState({
          cards: this.state.cards.filter((card, i) => i!==index),
          outOfCards: true
        })
      }

    }

  }
  render() {
    // If you want a stack of cards instead of one-per-one view, activate stack mode
    // stack={true}
    //console.log(this.state.showPlaceTrade)
    //console.log(`event ${this.state.event}`)
    console.log(SwipeCards.propTypes)
    return (
      <View>
        {this.state.showPlaceTrade ? 
          <PlaceTradeComponent event={this.state.event} /> 
        : <SwipeCards
          cards={this.state.cards}
          renderCard={(cardData) => <Card cardRemoved={this.cardRemoved} {...cardData} />}
          renderNoMoreCards={() => <NoMoreCards />}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
          handleMaybe={this.handleMaybe}
          cardRemoved = {this.cardRemoved}
          showYup = {this.state.event !== undefined}
          hasMaybeAction
        /> }

       
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    backgroundColor:'white',
    alignItems: 'center',
    marginTop:20,
    width: 300,
    height: 300,
  },
  noMoreCardsText: {
    fontSize: 22,
  },
  cardHeader: {
    marginTop:-100,
  },
  headerText: {
    color:'red',
    fontSize:20,
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center'
  },
  headerLeft: {
    width:20,
    height:20
  },
  cardBody: {
    top:20
  },
  button: {marginTop:400, width:120, marginLeft:115}
})