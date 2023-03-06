import './style.css'
import * as THREE from 'three';
//orbitcotntroll allows us to move arround the scene
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


const scene = new THREE.Scene();

/* 75:  feild of view
window.innerWidth / window.innerHeight : get the users browser window
0.1, 1000: view frustum to controle which view in visibile relitive to 
the camera. 0.1,1000 show everything form the camera lens
*/
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

/*
renders the object in the sceen
*/ 
const renderer = new THREE.WebGLRenderer({
  /*rendereer needs to know which DOM element to use 
  which can be the canvas*/
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
//to make it a full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
//to position the camera
camera.position.setZ(30);

//calling the rendere render method the show the sceen
/////////////renderer.render(scene, camera);

//steps to add an object

const geometry = new THREE.TorusGeometry(10, 3, 16, 100) //define the shape
//const material = new THREE.MeshBasicMaterial({color:0xFF6347, wireframe: true});//set materials/ MeshBasicMaterial dosnt need lithing to show
const material = new THREE.MeshStandardMaterial({color:0xFF6347});//set materials/ MeshStandardMaterial requires lithing

const torus = new THREE.Mesh(geometry, material);//creating amesh by comb the geometry and the material

scene.add(torus) //adding torus to the scene

//adding a light
const pointLight = new THREE.PointLight(0xffffff)//pointLinght is used when we want to focus on a spesific point
pointLight.position.set(5,5,5) //(x,y,z)
const ambientLight = new THREE.AmbientLight(0xffffff) // lights the entire sceene
//positioning the light
//adding light to the scene
scene.add(pointLight, ambientLight)

//light helper shows the position of a pointlight
const lightHelper = new THREE.PointLightHelper(pointLight)
//gridHelper draws a 2d grid
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

//creating a functiong  to populate outer space
function addStar(){
const geometry = new THREE.SphereGeometry(0.25, 24,24); //0.25 = radius
const material = new THREE.MeshStandardMaterial({color: 0xffffff})
//randomly position stars
const star = new THREE.Mesh(geometry, material)
const [x, y ,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100))// randFloatSpread: generatates a rendom number btw -100 and 100
star.position.set(x,y,z)
scene.add(star)
}
//amount of starts we want to add
Array(200).fill().forEach(addStar)

//adding bg image
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//adding car textrures
const carTexture = new THREE.TextureLoader().load('download.png');
const car = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: carTexture})
);
scene.add(car)

//adding moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);
scene.add(moon)

moon.position.z=30;
moon.position.setX(-10)


//move camerea on scroll
function moveCamera(){
//counting where the user scrolls to
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  car.rotation.y += 0.01
  car.rotation.z += 0.01

  camera.position.z = t*-0.01
  camera.position.x = t*-0.0002
  camera.position.y = t*-0.0002
}
document.body.onscroll= moveCamera


//to not call the render multiple time we need to set a function 
function animate(){
  requestAnimationFrame(animate);
  //animating the shape
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update()

  renderer.render(scene, camera);
}

animate()
