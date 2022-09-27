import React, { useState, useEffect } from 'react';
import { View, Animated, PanResponder, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, Dimensions, } from 'react-native';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { resolveAsync } from 'expo-asset-utils';
import * as FileSystem from 'expo-file-system';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { decode } from 'base64-arraybuffer';
import { Renderer, TextureLoader, loadObjAsync, loadTextureAsync, THREE } from 'expo-three';
import OrbitControlsView from 'expo-three-orbit-controls';
import { useFrame, Canvas } from '@react-three/fiber/native'
import { useGLTF, Environment } from '@react-three/drei/native'
import { Asset } from 'expo-asset'
import {
  AmbientLight,
  HemisphereLight,
  OrthographicCamera,
  BoxGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  Camera,
  RayCaster,
  MeshBasicMaterial,
  SceneUtils,
  DirectionalLight
} from 'three';
import {loadModel} from './utils/3d.js';
import _ from 'lodash';

const modelObj = {
  house: {
    type: 'obj',
    name: 'house',
    model: require('../assets/3D/delonghi-kettle/source/house/house.obj'),
    textures: [
      {
        name: 'satu',
        image: require('../assets/3D/delonghi-kettle/source/house/textures/house.xpng'),
      }
    ],
    scale: {
      x: 0.8,
      y: 0.8,
      z: 0.8,
    },
  }
}

const modelGLB = {
  donut: {
    type: 'obj',
    name: 'donut',
    isometric: false,
    model: require('../assets/3D/donut-20/source/donut_2.0.obj'),
    textures: [
      // {
      //   name: 'Colour page',
      //   image: require('../assets/3D/donut-20/textures/Colour_page.xpng'),
      // },
      {
        name: 'donut Base Color',
        image: require('../assets/3D/donut-20/textures/donut_Base_Color.xpng'),
      },
      // {
      //   name: 'Donut normal',
      //   image: require('../assets/3D/donut-20/textures/Donut_normal.xpng'),
      // },
      
    ],
    scale: {
      x: 10,
      y: 10,
      z: 10,
    },
    // position: {
    //   x: 0,
    //   y: 0,
    //   z: -2,
    // },
  },
};

const { height, width } = Dimensions.get("window");

const ThreeDTwo = () => {
  //let camera2;
  //let scene2;
  const [camera2, setCamera2] = useState<Camera | null>(null);
  const [scene2, setScene2] = useState(new THREE.Scene())
  const [gl2, setGl2] = useState(null);
  const [pan, setPan] = useState(new Animated.ValueXY())
  const [mouse, setMouse] = useState(new THREE.Vector2(-10, -10)) 
  const [val, setVal] = useState({ x: 0, y: 0 });

  // Turn off extra warnings
  THREE.suppressExpoWarnings(true);
  // hide warnings yellow box in ios
  console.disableYellowBox = true;
  const handleMouse = (val) => {
    mouse.x = val.x
    mouse.y = val.y
    console.log("PARENT MOUSE: ", mouse)
  }

  const panResponder = React.useMemo(() =>  PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => true,
    onPanResponderGrant: (e, gesture) => {
      pan.setOffset({
        x: val.x,
        y: val.y,
      });
      pan.setValue({ x: -10, y: -10 });
    },
    onPanResponderMove: ({ nativeEvent }, gestureState) => {
      if (gl2) {
        console.log("SINI")
        // ratio of mouse position to the width of the screen
        mouse.x =
          (nativeEvent.locationX / width) * 2 - 1;
        mouse.y =
          -(nativeEvent.locationY / height) * 2 + 1;
      }else{
        //console.log("SANA")
        mouse.x =
        (nativeEvent.locationX / width) * 2 - 1;
      mouse.y =
        -(nativeEvent.locationY / height) * 2 + 1;
      }
      //console.log("MOUSE: ", mouse)
    },
    onPanResponderRelease: ({ nativeEvent }, gestureState) => {
      //console.log("MOUSE: ", this.state.mouse)
      mouse.x = -10;
      mouse.y = -10;
      //console.log("MOUSE: ", this.state.mouse)
    },
  }), []);

  useEffect(() => {
    pan.addListener((value) => (setVal(value) ));

  }, []);

  
  const over = () => {
    console.log("OVERR")
  };
  const out = () => {
    //console.log("OUT")
  };

  const raycastMethod = async () => {
    camera2.updateMatrixWorld();
    const raycaster = new THREE.Raycaster();
    let intersects;
    raycaster.setFromCamera(mouse, camera2);
    intersects = raycaster.intersectObjects(scene2.children, true);
    if (intersects.length > 0) {
      // OVER
      console.log("INTERSECT: ", intersects[0].object.name)
      if (intersects[0].object instanceof THREE.Mesh) {
        // here you can make what you want with the children of object
        intersects[0].object.material.color.setHex( 0xf0000);
      }
      console.log("KEYS", Object.keys(intersects[0]))
      over()
    } else {
      // NOT OVER
      out()
    }
  }

  let foo = () => {
    console.log("HELLO")
  };

  const onContextCreate = async (gl: ExpoWebGLRenderingContext, data: any) => {
    const selected = data;
    const sceneColor = 0xabd2c3;
    setGl2(gl)
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({gl});
    renderer.setPixelRatio(window.pixelRatio || 1);
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(sceneColor);

    const camera = new THREE.PerspectiveCamera(
			100,
			gl.drawingBufferWidth / gl.drawingBufferHeight,
			0.1,
			20000,
		);
    camera.position.set(0, 0, 1.0).multiplyScalar(20);

		const scene = new THREE.Scene();
    scene.fog = new Fog(sceneColor, 1, 10000);

    const isModelArray = selected?.models && Array.isArray(selected.models);

    const ambientLight = new AmbientLight(0xB1B1B1, 1.5);
    scene.add(ambientLight);
    
    const light = new DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add(light);
  
    let models = [];
    let obj;
  
    if (isModelArray) {
      for (let i = 0; i < selected.models.length; i++) {
        const modelItem = selected.models[i];
        obj = await loadModel(modelItem);
        scene.add(obj);
        models.push(obj);
      }
    } else {
      console.log("SINI")
      obj = await loadModel(selected);
      scene.add(obj);
      models.push(obj);
    }

    scene.scale.x = 5
    scene.scale.y = 5
    scene.scale.z = 5
  
    let childron;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // here you can make what you want with the children of object
        childron = child
      }
    })

    const raycastMethod = (s, c, m) => {
      console.log("RAYCASTT")
      camera.updateMatrixWorld();
      const raycaster = new THREE.Raycaster();
      let intersects;
      raycaster.setFromCamera(mouse, camera);
      //console.log("SCENE 2: ", scene2)
      intersects = raycaster.intersectObjects(scene.children, true);
  
      if (intersects.length > 0) {
        // OVER
        console.log("INTERSECT: ", intersects[0].object.name)
        if (intersects[0].object instanceof THREE.Mesh) {
          // here you can make what you want with the children of object
          intersects[0].object.material.color.setHex( 0xf0000);
        }
        console.log("KEYS", Object.keys(intersects[0]))
        over()
      } else {
        // NOT OVER
        out()
      }
    }

    foo = raycastMethod
    console.log("FOO: ", foo)

    camera.lookAt(obj.position);
    setCamera2(camera)
    setScene2(scene)

  
    const animate = (p) => {
			requestAnimationFrame(animate);
      if(mouse.x != -10 && mouse.y != -10){
        raycastMethod(scene, camera, mouse)
      }
      renderer.render(scene, camera);

			gl.endFrameEXP();
		};

    animate();
  };
  console.log("FOO AGAIN: ", foo)

    const { height, width } = Dimensions.get("window");
    return (
        <OrbitControlsView       
        style={{flex: 1}} camera={camera2}>
            <GLView
              style={{flex: 1}}
              onContextCreate={gl => {
                onContextCreate(gl, modelGLB.donut);
              }}
              handleMouse={handleMouse}
              handleRayCast={foo}
            />
        </OrbitControlsView> 
  
    );
  
};

export default ThreeDTwo;
