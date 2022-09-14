import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, AppRegistry, Platform, processColor } from 'react-native';
import { ListItem, Button, Icon, Input } from 'react-native-elements'
import _ from 'lodash';

export default class PlayGround extends React.Component {
  constructor(props) {
    super(props);
  }

    
  render(){
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Playground</Text>
            <Text style={styles.description}>lorem ipsum dolor sit amet</Text>
          </View>
        </View>
         <View style={styles.content}>
          <View style={styles.mainContent}>
            <ScrollView>

            </ScrollView>
          </View>
        </View> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1565C0',
    height: 150,
    paddingTop: 38,
  },
  headerContent: {
    marginLeft: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingBottom: 20
  },
  description: {
    fontSize: 15,
    color: 'white'
  },
  content: {
    backgroundColor: '#34448B',
    flex: 1
  },
  mainContent: {
    flex: 1,
    width: "104%",
    maxHeight: "87%",
  },
  chart: {
    flex: 1
  }
});

AppRegistry.registerComponent('ReactNativeFusionCharts', () => PlayGround);