import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createWalls } from "./walls.js";
import { createPaintings } from "./paintings.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const mainGalleryEl = document.querySelector(".main-gallery");
// const returnBtn = document.querySelector(".return-btn");
const infoCardEl = document.querySelector(".info-card");
const paintingTitleEl = document.querySelector(".painting-title");
const descriptionEl = document.querySelector(".description");
const featuresEl = document.querySelector(".features-list");
const builtWithEl = document.querySelector(".built-with-list");
let focusedPainting = null;

//loading renderer/scene info
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(mainGalleryEl.clientWidth, mainGalleryEl.clientHeight);
renderer.shadowMap.enabled = true;
renderer.setPixelRatio();
mainGalleryEl.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  1,
  1000
);
camera.position.z = 115;
camera.position.y = 25;
scene.add(camera);

// let ambientLight = new THREE.AmbientLight("", 0.2);
// scene.add(ambientLight);

let pointLight = new THREE.PointLight("", 0.3);
scene.add(pointLight);
pointLight.position.y = 25;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

onmousemove = (e) => onPointerMove(e);

onmouseleave = (e) => {
  pointer.x = -50000;
  pointer.y = -50000;
};

new OrbitControls(camera, renderer.domElement);

new TTFLoader().load("./fonts/VictorMono-Medium.ttf", (json) => {
  let victorMonoFont = new FontLoader().parse(json);
  let textGeometry = new TextGeometry("FrontendMentor 3-d Gallery", {
    font: victorMonoFont,
    size: 3,
    height: 1,
  });
  let textMaterial = new THREE.MeshLambertMaterial({ emissive: "blue" });
  let textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.y = 15;
  textMesh.position.x = -30;
  textMesh.position.z = -25;
  let textLight = new THREE.SpotLight();
  let tlHelper = new THREE.SpotLightHelper(textLight);
  // scene.add(tlHelper);
  let lightTarget = new THREE.Object3D();
  lightTarget.position.set(-15, 25, -25);
  textLight.position.set(15, 45, -65);
  textLight.rotation.z = -Math.PI * 0.2;
  scene.add(lightTarget);
  textLight.target = lightTarget;
  scene.add(textLight);
  scene.add(textMesh);
});

let spaceTexture = new THREE.TextureLoader().load("./textures/space.jpg");
let spaceGeo = new THREE.SphereGeometry(165);
let spaceMaterial = new THREE.MeshBasicMaterial({
  map: spaceTexture,
  side: THREE.DoubleSide,
});
let spaceSphere = new THREE.Mesh(spaceGeo, spaceMaterial);
scene.add(spaceSphere);

function animation() {
  renderer.render(scene, camera);
  TWEEN.update();

  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  resetLightsToDefault(scene);
  focusedPainting = null;
  if (intersects.length && intersects[0].object.userData.painting) {
    // console.log(intersects[0].object.parent);
    // adjustLight(intersects[0].object.parent)
    intersects[0].object.parent.children.forEach((child) => {
      if (child.isLight) {
        child.intensity = 1;
        child.distance = 300;
      }
      focusedPainting = intersects[0].object;
    });
  }
  if (focusedPainting == null) {
    infoCardEl.classList.add("hide-info");
  }

  spaceSphere.rotation.y += 0.001;
  requestAnimationFrame(animation);
}

createWalls(scene);
createPaintings(scene);

onresize = (e) => {
  renderer.setSize(mainGalleryEl.clientWidth, mainGalleryEl.clientHeight);
  renderer.setPixelRatio();
};

animation();

function resetLightsToDefault(scene) {
  scene.children.forEach((child) => {
    if (child.type == "Group") {
      // console.log(child);
      child.children.forEach((child) => {
        if (child.isLight) {
          // console.log("change to normal", child);
          child.distance = 15;
          child.intensity = 1;
          // child.range = 3;
        }
      });
    }
  });
}

onclick = (e) => {
  if (e.target.classList == "return-btn") {
    restoreCamera();
    return;
  }

  if (focusedPainting) {
    console.log("FocusedPainting", focusedPainting);
    tweenCameraToPainting(focusedPainting);
  } else {
    console.log("no painting in focus!!");
  }
};

function tweenCameraToPainting(painting) {
  console.log(painting.userData.cameraPOS, camera.position);

  new TWEEN.Tween(camera.position)
    .to(painting.userData.cameraPOS, 1000)
    .start()
    .onUpdate(() => {
      camera.position.x = camera.position.x;
      camera.position.y = camera.position.y;
      camera.position.z = camera.position.z;
    })
    .onComplete(() => {
      rotateCameraToPainting(painting);
      renderDOM(painting);
    });
}

function rotateCameraToPainting(painting) {
  console.log(painting.userData.cameraPOS, camera.rotation);

  new TWEEN.Tween(camera.rotation)
    .to(painting.userData.cameraRotation, 1000)
    .start()
    .onUpdate(() => {
      camera.rotation.x = camera.rotation.x;
      camera.rotation.y = camera.rotation.y;
      camera.rotation.z = camera.rotation.z;
    })
    .onComplete(() => {
      // rotateCameraToPainting(painting)
    });
}

function restoreCamera() {
  new TWEEN.Tween(camera.position)
    .to({ x: 0, y: 20, z: 105 }, 1000)
    .start()
    .onUpdate(() => {
      camera.position.x = camera.position.x;
      camera.position.y = camera.position.y;
      camera.position.z = camera.position.z;
    })
    .onComplete(() => {
      new TWEEN.Tween(camera.rotation)
        .to({ x: 0, y: 0, z: 0 }, 1000)
        .start()
        .onUpdate(() => {
          camera.rotation.x = camera.rotation.x;
          camera.rotation.y = camera.rotation.y;
          camera.rotation.z = camera.rotation.z;
        })
        .onComplete(() => {
          // rotateCameraToPainting(painting)
        });
    });
}

function renderDOM(painting) {
  infoCardEl.classList.remove("hide-info");

  paintingTitleEl.innerHTML = painting.userData.painting;
  descriptionEl.innerHTML = painting.userData.description;

  // featuresEl
  // builtWithEl
  var builtWithHTML = "";
  var featuresHTML = "";
  painting.userData.builtWith.forEach((item) => {
    builtWithHTML += `<li>${item}</li>`;
  });
  painting.userData.features.forEach((item) => {
    featuresHTML += `<li>${item}</li>`;
  });

  builtWithEl.innerHTML = builtWithHTML;
  featuresEl.innerHTML = featuresHTML;
}
