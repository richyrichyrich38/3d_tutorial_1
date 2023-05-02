import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'


const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

// injects canvas element into the page by using appendChild function
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(9);
scene.add(axesHelper)

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box)

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  wireframe: false,
  
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 10, 0)
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);


// // directional light camera
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// // shifted the bottom of the camera so we can see all of the sphere shadow
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper)


// spotlight camera
const spotLight = new THREE.SpotLight(0xffffff);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
// brings the angle of the spotlight in so the shadow does't look pixelated
spotLight.angle = 0.15

const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper);
// adds a fog the further you move away from the scene
// scene.fog = new THREE.Fog(0xffffff, 0, 200)
// adds an exponential fog so it happens more rapidly
scene.fog = new THREE.FogExp2(0xffffff, 0.01)

// sets the surrounding color
// renderer.setClearColor(0xffea00)

// 2d background texture
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(stars)

// 3d cube background texture 6 sides
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars
]);

//  floating box
const boxGeometry2 = new THREE.BoxGeometry(4, 4, 4);
const boxMaterial2 = new THREE.MeshStandardMaterial({
  map: textureLoader.load(nebula)
})
const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);
scene.add(box2)

box2.position.set(0, 15, 10)

const gui = new dat.GUI();

const options = {
  sphereColor: '#0000ff',
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 1
}

gui.addColor(options, 'sphereColor').onChange(function(e) {
  sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e) {
  sphere.material.wireframe = e
})

gui.add(options, 'speed', 0, 1 )
gui.add(options, 'angle', 0, 1 )
gui.add(options, 'penumbra', 0, 1 )
gui.add(options, 'intensity', 0, 1 )


let step = 0;

const gltfLoader = new GLTFLoader();

let car;
gltfLoader.load('../assets/mclaren_elva/scene.gltf', function(gltf) {
  const model = gltf.scene;
  scene.add(model)
  car = model
  model.scale.set(3,3,3)
  model.position.set(-12, 0, 10)
}, undefined, function(error) {
  console.error(error)
})



function animate(time) {
  if(car)
    car.rotation.y = - time / 3000

  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  // updates the spot light helper every time we update the above properties
  sLightHelper.update()

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
