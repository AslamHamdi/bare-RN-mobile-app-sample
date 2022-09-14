import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Card, ListItem, Button, Icon, Input } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const apiRouter = require('../routers/apiRouter')

export default function NewForm() {
  const FORM_DATA = {
    name: "",
    icNum: "",
    email: ""
  }

  const [formData, setFormData] = useState(FORM_DATA)
  const [name, setName] = useState("")
  const [formList, setFormList] = useState([])

  const onSubmitForm = async () => {
    //await apiRouter.deleteAllReport()
    await apiRouter.addNewReport(formData)
    let data = await apiRouter.getAllReport()
    
    setFormData({name: "", icNum: "", email: ""})
    setFormList(data)
    console.log("FOrm data: ", formList)
  }

  const TestButton = () => {
    Alert.alert('Testing')
    {text: 'OK'}
  }

  return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>New Form</Text>
            <Text style={styles.description}>lorem ipsum dolor sit amet</Text>
          </View>
        </View>
        <View style={styles.content}>
        <KeyboardAwareScrollView extraHeight={120} enableOnAndroid keyboardShouldPersistTaps='handled'>
          <View style={styles.mainContent}>
          <Card borderRadius={15}>
            <Card.Title>Please fill in all details</Card.Title>
            <Card.Divider/>

            <Text style={styles.inputlabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name.toString()}
              onChangeText={(val) => setFormData({
                ...formData,
                name: val
              })}
              placeholder="John Doe"
            />
            <Text style={styles.inputlabel}>IC No.</Text>
            <TextInput
              style={styles.input}
              value={formData.icNum.toString()}
              onChangeText={(val) => setFormData({
                ...formData,
                icNum: val
              })}
              placeholder="1234"
              keyboardType="numeric"/>

            <Text style={styles.inputlabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(val) => setFormData({
                ...formData,
                email: val
              })}
              placeholder="john.doe@gmail.com"
              keyboardType="email-address"
            />

            <Button
                icon={<MaterialCommunityIcons name="file-upload" size={19} color="#1565C0" />}
                buttonStyle={{borderRadius: 10, marginLeft: 110, marginRight: 110, marginBottom: 0, marginTop: 15, backgroundColor:'#E4F4F3', borderWidth: 2,}}
                title='Submit' 
                titleStyle={{ marginLeft: 10, color: "#1565C0" }}
                size="sm"
                onPress={onSubmitForm}/>
          </Card>
          </View>
        </KeyboardAwareScrollView>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1565C0',
    height: 150,
    paddingTop: 38,
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
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
    flex: 1,
    maxHeight: "72%",
  },
  mainContent: {
    flex: 1,
    marginBottom: 20,
  },
  input: {
    height: 45,
    margin: 12,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    padding: 10,
  },
  inputlabel: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray'
  }
});