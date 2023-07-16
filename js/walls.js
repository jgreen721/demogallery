import * as THREE from "three";

export const createWalls = (scene) => {
  const textureLoader = new THREE.TextureLoader();
  let floorTexture = textureLoader.load("./textures/woodenfloorimg.webp");

  const floorGeo = new THREE.BoxGeometry(50, 50, 0.5);
  const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });
  const floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.rotation.x = Math.PI * 0.5;
  floor.position.y = -12.25;

  const wallGeo = new THREE.BoxGeometry(50, 25, 1);
  const backWallGeo = new THREE.BoxGeometry(52, 25, 1);
  const wallMaterial = new THREE.MeshLambertMaterial({ color: "white" });
  const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
  backWall.position.z = -25.5;
  //   backWall.position.y = 12.25;

  const leftWall = new THREE.Mesh(wallGeo, wallMaterial);
  leftWall.rotation.y = Math.PI * 0.5;
  leftWall.position.x = 25.5;
  //   leftWall.position.y = 12.25;

  const rightWall = new THREE.Mesh(wallGeo, wallMaterial);
  rightWall.rotation.y = Math.PI * 0.5;

  rightWall.position.x = -25.5;
  //   rightWall.position.y = 12.25;
  //   floor.rotation.x = Math.PI * 0.5;

  scene.add(backWall, floor, leftWall, rightWall);
};
