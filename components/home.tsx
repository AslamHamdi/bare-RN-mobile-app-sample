import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, AppRegistry, Platform, processColor } from 'react-native';
import { ListItem, Button, Icon, Input } from 'react-native-elements'
//import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import Expo from 'expo'
import {Scene, Mesh, MeshBasicMaterial, PerspectiveCamera, BoxGeometry} from 'three'
import ExpoTHREE, {Renderer} from 'expo-three'
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl'
import axios from 'axios'
import {LineChart, BarChart, PieChart} from 'react-native-charts-wrapper';
import update from 'immutability-helper';

const COLOR_PURPLE = processColor('#697dfb');

import _ from 'lodash';

let onContextCreate = async (gl) => {
  const scene = new Scene()
  const camera = new PerspectiveCamera(
    74, 
    gl.drawingBufferWidth/gl.drawingBufferHeight,
    0.1,
    1000
  )
  gl.canvas = {width:gl.drawingBufferWidth, height: gl.drawingBufferHeight}
  camera.position.z = 2
  
  const renderer = new Renderer({gl})
  renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
  
  const geometry = new BoxGeometry(1,1,1)
  const material = new MeshBasicMaterial({
    color: 'red'
  })
  const cube = new Mesh(geometry, material)
  scene.add(cube)

  const render = () => {
    requestAnimationFrame(render)
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
    gl.endFrameEXP()
  }

  render()
}

export default class Home extends React.Component {

  constructor() {
    super();

    this.state = {
      lineChart: {},
      barChart: {
        legend: {
          textColor: processColor('white'),
          enabled: true,
          textSize: 14,
          form: "SQUARE",
          formSize: 14,
          xEntrySpace: 10,
          yEntrySpace: 5,
          wordWrapEnabled: true
        },
        data: {
          dataSets: [{
            values: [5, 40, 77, 81, 43],
            label: 'Company A',
            config: {
              drawValues: false,
              colors: [processColor('red')],
            }
          }, {
            values: [40, 5, 50, 23, 79],
            label: 'Company B',
            config: {
              drawValues: false,
              colors: [processColor('blue')],
            }
          }, {
            values: [10, 55, 35, 90, 82],
            label: 'Company C',
            config: {
              drawValues: false,
              colors: [processColor('green')],
            }
          }],
          config: {
            barWidth: 0.2,
            group: {
              fromX: 0,
              groupSpace: 0.1,
              barSpace: 0.1,
            },
          }
        },
        xAxis: {
          textColor: processColor('white'),
          valueFormatter: ['1990', '1991', '1992', '1993', '1994'],
          granularityEnabled: true,
          granularity: 1,
          axisMaximum: 5,
          axisMinimum: 0,
          centerAxisLabels: true
        },
        marker: {
          enabled: true,
          markerColor: processColor('#F0C0FF8C'),
          textColor: processColor('white'),
          markerFontSize: 14,
        },
      },
      pieChart: {
        legend: {
          enabled: true,
          textSize: 15,
          form: 'CIRCLE',
          textColor: processColor('white'),
          horizontalAlignment: "RIGHT",
          verticalAlignment: "CENTER",
          orientation: "VERTICAL",
          wordWrapEnabled: true
        },
        data: {
          dataSets: [{
            values: [{value: 45, label: 'Sandwiches'},
              {value: 21, label: 'Salads'},
              {value: 15, label: 'Soup'},
              {value: 9, label: 'Beverages'},
              {value: 15, label: 'Desserts'}],
            label: 'Pie dataset',
            config: {
              colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'), processColor('#FF8C9D')],
              valueTextSize: 10,
              valueTextColor: processColor('green'),
              sliceSpace: 5,
              selectionShift: 13,
              // xValuePosition: "OUTSIDE_SLICE",
              // yValuePosition: "OUTSIDE_SLICE",
              valueFormatter: "#.#'%'",
              valueLineColor: processColor('green'),
              valueLinePart1Length: 0.5
            }
          }],
        },
        highlights: [{x:2}],
        description: {
          text: 'This is Pie chart description',
          textSize: 12,
          textColor: processColor('darkgray'),
  
        }
      }
    };
  }

  componentDidMount() {
    this.getData()
    const valueRange = 100;
    const size = 30;

    this.setState(
      update(this.state, {
        lineChart: {
          xAxis: {
            $set: {
              textColor: processColor('white'),
              textSize: 12,
              gridColor: processColor('white'),
              gridLineWidth: 1,
              axisLineColor: processColor('white'),
              axisLineWidth: 1.5,
              gridDashedLine: {
                lineLength: 10,
                spaceLength: 10
              },
              avoidFirstLastClipping: true,
              position: 'BOTTOM'
            }
          },
          yAxis: {
            $set: {
              left: {
                textColor: processColor('white'),
                textSize: 12,
                gridColor: processColor('white'),
                drawGridLines: false
              },
              right: {
                enabled: false
              }
            }
          },
          data: {
            $set: {
              dataSets: [{
                values: this._randomYValues(valueRange, size),
                label: '',
                config: {
                  valueTextColor: processColor('white'),
                  valueTextSize: 8,
                  lineWidth: 1.5,
                  drawCircles: false,
                  drawCubicIntensity: 0.3,
                  drawCubic: true,
                  drawHighlightIndicators: false,
                  color: COLOR_PURPLE,
                  drawFilled: true,
                  fillColor: COLOR_PURPLE,
                  fillAlpha: 90
                }
              }],
            }
          }
        },
      })
    );

    this.setState({...this.state.barChart, highlights: [{x: 1, y:40}, {x: 2, y:50}]})
  }

  _randomYValues(range: number, size: number) {
    const nextValueMaxDiff = 0.2;
    let lastValue = range / 2;

    return _.times(size, () => {
      let min = lastValue * (1 - nextValueMaxDiff);
      let max = lastValue * (1 + nextValueMaxDiff);
      return {y: Math.random() * (max - min) + min};
    });
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }

    console.log(event.nativeEvent)
  }


  getData = async () => {
    try {
      let response = await axios.get('https://api.publicapis.org/entries').then((resp) => {
        console.log("RESPONSE: ", resp.data.entries[0])
      })

    } catch (error) {
      console.log("ERROR: ", error)
    }
    
  }

  render(){
    return (
      <View style={{flex: 1}}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.description}>lorem ipsum dolor sit amet</Text>
          </View>
        </View>
         <View style={styles.content}>
          <View style={styles.mainContent}>
            <ScrollView>
              <View>
                <View style={{
                  width: '95%',
                }}>
                  <View style={{

                  }}>
                      <View
                        style={{
                          paddingVertical: 100,
                          backgroundColor: '#34448B',
                          flex: 1,
                        }}>
                        <View
                          style={{
                            margin: 20,
                            padding: 16,
                            borderRadius: 20,
                            backgroundColor: '#232B5D',
                          }}>
                          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            Line Chart
                          </Text>
                          <View style={{padding: 20, alignItems: 'center'}}>
                          <LineChart
                            style={styles.chart}
                            data={this.state.lineChart.data}
                            chartDescription={{text: ''}}
                            xAxis={this.state.lineChart.xAxis}
                            yAxis={this.state.lineChart.yAxis}
                            legend={{enabled: false}}
                            onSelect={this.handleSelect.bind(this)}
                            onChange={(event) => console.log(event.nativeEvent)}
                          />
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          paddingVertical: 100,
                          backgroundColor: '#34448B',
                          flex: 1,
                        }}>
                        <View
                          style={{
                            margin: 20,
                            padding: 16,
                            borderRadius: 20,
                            backgroundColor: '#232B5D',
                          }}>
                          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            Bar Chart
                          </Text>
                          <View style={{padding: 20, alignItems: 'center'}}>
                            <BarChart
                              style={styles.chart}
                              yAxis={this.state.barChart.yAxis}
                              xAxis={this.state.barChart.xAxis}
                              data={this.state.barChart.data}
                              legend={this.state.barChart.legend}
                              drawValueAboveBar={false}
                              onSelect={this.handleSelect.bind(this)}
                              onChange={(event) => console.log(event.nativeEvent)}
                              highlights={this.state.barChart.highlights}
                              marker={this.state.barChart.marker}
                            />
                          </View>
                        </View>
                      </View>
                      <View
                        style={{
                          paddingVertical: 100,
                          backgroundColor: '#34448B',
                          flex: 1,
                        }}>
                        <View
                          style={{
                            margin: 20,
                            padding: 16,
                            borderRadius: 20,
                            backgroundColor: '#232B5D',
                          }}>
                          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            Pie Chart
                          </Text>
                          <View style={{padding: 20, alignItems: 'center'}}>
                            <PieChart
                              style={styles.chart}
                              logEnabled={true}
                              //chartBackgroundColor={processColor('pink')}
                              chartDescription={this.state.pieChart.description}
                              data={this.state.pieChart.data}
                              legend={this.state.pieChart.legend}
                              highlights={this.state.pieChart.highlights}

                              extraOffsets={{left: 5, top: 5, right: 5, bottom: 5}}

                              entryLabelColor={processColor('green')}
                              entryLabelTextSize={10}
                              entryLabelFontFamily={'HelveticaNeue-Medium'}
                              drawEntryLabels={true}

                              rotationEnabled={true}
                              rotationAngle={45}
                              usePercentValues={true}
                              styledCenterText={{text:'Pie center text!', color: processColor('black'), fontFamily: 'HelveticaNeue-Medium', size: 10}}
                              centerTextRadiusPercent={100}
                              holeRadius={40}
                              holeColor={processColor('#f0f0f0')}
                              transparentCircleRadius={45}
                              transparentCircleColor={processColor('#f0f0f088')}
                              maxAngle={350}
                              onSelect={this.handleSelect.bind(this)}
                              onChange={(event) => console.log(event.nativeEvent)}
                            />
                          </View>
                        </View>
                      </View>
                      {/* 3D */}
                      <View
                        style={{
                          paddingVertical: 100,
                          backgroundColor: '#34448B',
                          flex: 1,
                        }}>
                        <View
                          style={{
                            margin: 20,
                            padding: 16,
                            borderRadius: 20,
                            backgroundColor: '#232B5D',
                          }}>
                          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                            3D Three
                          </Text>
                          <View style={{padding: 20, alignItems: 'center'}}>
                            
                            <GLView
                              onContextCreate={onContextCreate}
                              style={{width: 500, height: 500}}
                            />

                          </View>
                        </View>
                      </View>
                    </View>
                </View>
              </View>
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
    flex: 1,
    height: 300,
    width: 300
  }
});
