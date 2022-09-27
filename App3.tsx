import React, { Component, useState } from 'react';
import { View, Animated, Text, PanResponder, StyleSheet, Image, Dimensions, ScrollView, AppRegistry, Platform, processColor, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview'
import { ListItem, Button, Icon, Input } from 'react-native-elements'
import _ from 'lodash';

import Expo from 'expo'
import {Scene, Mesh, MeshBasicMaterial, PerspectiveCamera, BoxGeometry} from 'three'
import ExpoTHREE, { Renderer, TextureLoader, loadObjAsync, loadTextureAsync, THREE } from 'expo-three';
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl'

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			pan: new Animated.ValueXY(),
			mouse: new THREE.Vector2(-10, -10), // -10 is to force the start position to be OFF the screen so the user isn't automatically ontop of something
		};
		// Turn off extra warnings
		THREE.suppressExpoWarnings(true);
		// hide warnings yellow box in ios
		console.disableYellowBox = true;
	}

	UNSAFE_componentWillMount() {
		this._val = { x: 0, y: 0 };
		this.state.pan.addListener((value) => (this._val = value));

		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (e, gesture) => true,
			onPanResponderGrant: (e, gesture) => {
				this.state.pan.setOffset({
					x: this._val.x,
					y: this._val.y,
				});
				this.state.pan.setValue({ x: -10, y: -10 });
			},
			onPanResponderMove: ({ nativeEvent }, gestureState) => {
				if (this.state.gl) {
          console.log("SINI")
					// ratio of mouse position to the width of the screen
					this.state.mouse.x =
						(nativeEvent.locationX / width) * 2 - 1;
					this.state.mouse.y =
						-(nativeEvent.locationY / height) * 2 + 1;
				}else{
          console.log("SANA")
          this.state.mouse.x =
          (nativeEvent.locationX / width) * 2 - 1;
        this.state.mouse.y =
          -(nativeEvent.locationY / height) * 2 + 1;
        }
        console.log("MOUSE: ", this.state.mouse)
			},
			onPanResponderRelease: ({ nativeEvent }, gestureState) => {
        //console.log("MOUSE: ", this.state.mouse)
				this.state.mouse.x = -10;
				this.state.mouse.y = -10;
        //console.log("MOUSE: ", this.state.mouse)
			},
		});
	}

	_onGLContextCreate = async (gl) => {
		const renderer = new ExpoTHREE.Renderer({ gl, depth: false });
		renderer.setPixelRatio(window.pixelRatio || 1);
		renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
		renderer.setClearColor(0x000000, 1.0);
		const camera = new THREE.PerspectiveCamera(
			100,
			gl.drawingBufferWidth / gl.drawingBufferHeight,
			0.1,
			20000,
		);
		camera.position.set(0, 0, 1.0).multiplyScalar(20);
		const raycaster = new THREE.Raycaster();
		const scene = new THREE.Scene();

    const geometry = new BoxGeometry(1,1,1)
    const material = new MeshBasicMaterial({
      color: 'red'
    })

		const yourMesh = new Mesh(geometry, material)
		scene.add(yourMesh);

    scene.scale.x = 5
    scene.scale.y = 5
    scene.scale.z = 5
		let intersects;

		const over = () => {
      console.log("OEVRR")
		};
		const out = () => {
      //console.log("OUTTT")
		};
    console.log(scene.children)

    let childron;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        //console.log("KEYS", Object.keys(child))
        
        childron = child
        // console.log("POINTER: ", this.state.pointer)
        // let intersects = raycaster.intersectObjects( child ); 
        // console.log("INTERSERCTS: ", intersects)
          // here you can make what you want with the children of object
      }
      console.log(`CHIILD ${child.name} :`, child);
    })


		const animate = (p) => {
			requestAnimationFrame(animate);
      yourMesh.rotation.x += 0.01
      yourMesh.rotation.y += 0.01

			camera.updateMatrixWorld();

			raycaster.setFromCamera(this.state.mouse, camera);
			intersects = raycaster.intersectObjects(scene.children, true);
      //console.log("INTERSET: ", intersects)

			if (intersects.length > 0) {
				// OVER
        console.log("INTERSET: ", intersects)
                over()
			} else {
				// NOT OVER
                out()
			}

			renderer.render(scene, camera);

			gl.endFrameEXP();
		};

		animate();
	};

	render() {
		const { height, width } = Dimensions.get("window");
		return (
			<View
				{...this.panResponder.panHandlers}
				style={[
					{
						width,
						height,
					},
				]}>
				<GLView
					style={{ flex: 1 }}
					onContextCreate={this._onGLContextCreate}
				/>
			</View>
		);
	}

}