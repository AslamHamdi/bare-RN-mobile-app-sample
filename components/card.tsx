import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


const Card = (props) => {
  return (
    <View style={{
    borderLeftColor: 'red',
    ...styles.cardStyle
    }}>
      <View style={{
        flexDirection:'row', 
        flexWrap:'wrap'
      }}>
        <View //image
        style={{
          width: '20%',
          height: 100
        }}>
          <Image
            style={{
              width: '95%',
              height: '95%'
            }}
            source={props.image}
          />
        </View>
        <View //content
        style={{
          width: '80%',
          height: 100
        }}>
          <View //title and content
          style={{
            height: '65%',
          }}>
            <Text style={{ 
              fontSize: 15,
              fontWeight :"bold",
              color: '#565656'
            }}>
              {props.header}
            </Text>
            <Text style={{ 
              fontSize: 15,
              color: '#A9A9A9'
            }}>
              {props.content}
            </Text>
          </View>
          <View //date and button
          style={{
            height: '35%',
            flexDirection:'row', 
            flexWrap:'wrap'
          }}>
            <View //Date
            style={{
              height: '100%',
              width: '60%'
            }}>
              <Text style={{ 
                fontSize: 12,
                color: '#A9A9A9'
              }}>
                {props.subHeader}
              </Text>
              <Text style={{ 
                fontSize: 13,
                fontWeight :"bold",
                color: '#565656'
              }}>
                {props.subHeaderContent}
              </Text>
            </View>
            <View //Button
            style={{
              height: '100%',
              width: '40%',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View 
              style={{
                borderWidth: 2,
                borderRadius: 10,
                width: "80%",
                height: "90%",
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:'#F5DADF',
                borderColor: 'red'
              }}>
                <Text style={{
                  color: 'red'
                }}>Urgent</Text>
              </View>
            </View>
            
          </View>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  cardStyle: {
      marginTop: 10,
      marginBottom: 1,
      borderLeftWidth: 3,
      borderRadius: 10,
      backgroundColor: 'white',
      height: 120,
      width: '95%',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 10,
    }
})

export default Card;
