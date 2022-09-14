import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { ListItem, Button, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Card from './card'
const earthImg = require("../assets/earth.png")

const apiRouter = require('../routers/apiRouter')

export default class FormList extends React.Component {

  state = {
    reportList: []
  }
  componentDidMount() {
    //apiRouter.deleteAllReport()
    this.getReportList()
  }

  getReportList = async () => {
    let data = await apiRouter.getAllReport()
    this.setState({ reportList: data.rows._array}, () => {
    }); 
    console.log("REPORT LIST: ", this.state.reportList)
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Form List</Text>
            <Text style={styles.description}>lorem ipsum dolor sit amet</Text>
          </View>
        </View>
        <View style={styles.content}>
            <View style={styles.mainContent}>
              <ScrollView>
                {this.state.reportList.map((o, i) => {
                  return (
                    <Card 
                      key={i}
                      type="danger" 
                      header={o.full_name} 
                      content={o.email}
                      subHeader="IC num"
                      subHeaderContent={o.ic_num}
                      image={earthImg} />
                  )
                })}
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
    flex: 1
  },
  mainContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: "105%",
    maxHeight: "87%",
  },
});
