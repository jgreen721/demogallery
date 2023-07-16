import * as THREE from "three";

export const createPaintings = (scene) => {
  let textureLoader = new THREE.TextureLoader();
  fetch("data.json")
    .then((res) => res.json())
    .then((res) => {
      console.log("res", res);
      res.paintings.forEach((painting) => {
        let paintingGroup = new THREE.Group();
        let frameGeo = new THREE.BoxGeometry(
          painting.size.x,
          painting.size.y,
          painting.size.z / 2
        );
        let frameMaterial = new THREE.MeshLambertMaterial({ color: "tan" });
        let frame = new THREE.Mesh(frameGeo, frameMaterial);
        paintingGroup.add(frame);
        let paintingTexture = textureLoader.load(painting.image);
        let paintingGeo = new THREE.BoxGeometry(
          painting.size.x - 2,
          painting.size.y - 1,
          painting.size.z / 2
        );
        let paintingMaterial = new THREE.MeshLambertMaterial({
          map: paintingTexture,
        });
        let paintingMesh = new THREE.Mesh(paintingGeo, paintingMaterial);
        paintingGroup.add(paintingMesh);
        paintingMesh.userData.painting = painting.title;
        paintingMesh.userData.description = painting.description;
        paintingMesh.userData.builtWith = painting.builtWith;
        paintingMesh.userData.features = painting.features;
        paintingMesh.userData.site = painting.site;
        paintingMesh.userData.cameraPOS = painting.cameraPOS;
        paintingMesh.userData.cameraRotation = painting.cameraROT;
        // scene.add(frame, paintingMesh);
        //rotate painting for left/right walls
        if (Math.abs(painting.pos.x) == 25) {
          frame.rotation.y = Math.PI * 0.5;
          paintingMesh.rotation.y = Math.PI * 0.5;
        }
        frame.position.set(painting.pos.x, 2, painting.pos.z);
        //offset the difference to avoid mesh collision (frame/painting)
        paintingMesh.position.set(
          painting.pos.x > 0 ? painting.pos.x - 0.5 : painting.pos.x + 0.5,
          2,
          painting.pos.z < -23 ? painting.pos.z + 1 : painting.pos.z
        );
        if (painting.pos.z < -23) {
          paintingMesh.position.x = painting.pos.x;
        }

        let spotLight = new THREE.SpotLight("", 0.8, 15, 0.6, 0.1, 1);
        let slHelper = new THREE.SpotLightHelper(spotLight);
        let paintingTarget = new THREE.Object3D();
        paintingTarget.position.set(
          painting.pos.x,
          painting.size.y - 6,
          painting.pos.z
        );
        paintingGroup.add(paintingTarget);
        // scene.add(paintingTarget);
        // scene.add(slHelper);
        //determine lights offset position
        let lightingPosX =
          painting.pos.x > 23
            ? (painting.pos.x -= 2)
            : painting.pos.x < -23
            ? (painting.pos.x += 2)
            : painting.pos.x;
        let lightingPosZ =
          painting.pos.z < -23 ? (painting.pos.z += 2) : painting.pos.z;
        spotLight.position.set(lightingPosX, 14, lightingPosZ);
        spotLight.target = paintingTarget;
        // spotLight.rotation.set(-0.7, 0, -Math.PI * 0.75);
        // scene.add(spotLight);
        paintingGroup.add(spotLight);
        scene.add(paintingGroup);
      });
    });
};
