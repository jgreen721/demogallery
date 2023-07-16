import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

const loadingOverlayEl = document.querySelector(".loading-overlay");

//loading renderer/scene info
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(loadingOverlayEl.clientWidth, loadingOverlayEl.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio();
loadingOverlayEl.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  1,
  100
);
camera.position.z = 35;
camera.position.y = 3;
scene.add(camera);

let ambientLight = new THREE.AmbientLight("", 0.2);
scene.add(ambientLight);

let spotLight = new THREE.SpotLight("", 1.5, 200.0, 1.5);
spotLight.castShadow = true;
scene.add(spotLight);
spotLight.position.z = 15;
spotLight.position.y = 15;

let gltfScene;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./glb/portfoliointrobackdrop.glb", (img) => {
  scene.add(img.scene);
  img.scene.rotation.y = -Math.PI * 0.35;
  img.scene.position.y = -2;
  gltfScene = img.scene;
});

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass();
bloomPass.strength = 0.18;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
let loaderAnimation;
let isCancel;

function animation() {
  // renderer.render(scene, camera);
  TWEEN.update();
  composer.render(scene, camera);
  if (gltfScene) {
    gltfScene.rotation.y += -0.01;
  }

  loaderAnimation = requestAnimationFrame(animation);
  // console.log("isCancel", isCancel);

  if (isCancel) {
    cancelAnimationFrame(loaderAnimation);
  }
}

onresize = (e) => {
  renderer.setSize(loadingOverlayEl.clientWidth, loadingOverlayEl.clientHeight);
  renderer.setPixelRatio();
};

animation();

function loader() {
  setTimeout(() => {
    let initPOS = { y: 0 };
    new TWEEN.Tween(initPOS)
      .to({ y: 100 }, 1500)
      .start()
      .onUpdate(() => {
        // console.log(initPOS.y);
        loadingOverlayEl.style.top = `${initPOS.y}%`;
      })
      .onComplete(() => {
        document.querySelector(".app").removeChild(loadingOverlayEl);
        // cancelAnimationFrame(loaderAnimation);
        isCancel = true;
      });
  }, 2500);
}

loader();
