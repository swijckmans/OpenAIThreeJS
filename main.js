let scene, camera, renderer;
let sphere1,
  sphere2,
  sphere3,
  light,
  ambientLight,
  lightningBolts = [];
let lightningTimer = 0;
let FLASH_DURATION = 3; // duration of the flash effect (in frames)

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("canvas-container").appendChild(renderer.domElement);

  // Create the stationary sphere
  let geometry1 = new THREE.SphereGeometry(1, 32, 32);
  let material1 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  sphere1 = new THREE.Mesh(geometry1, material1);
  scene.add(sphere1);

  // Create the first rolling sphere
  let geometry2 = new THREE.SphereGeometry(0.5, 32, 32);
  let material2 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  sphere2 = new THREE.Mesh(geometry2, material2);
  sphere2.position.x = 2;
  scene.add(sphere2);

  // Create the second rolling sphere
  let geometry3 = new THREE.SphereGeometry(0.25, 32, 32);
  let material3 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  sphere3 = new THREE.Mesh(geometry3, material3);
  sphere3.position.x = -2;
  scene.add(sphere3);

  // Add an ambient light
  ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Add a point light
  light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 2);
  scene.add(light);

  // Add resize event listener
  window.addEventListener("resize", onWindowResize, false);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Make sphere2 and sphere3 orbit around sphere1 in 3D
  sphere2.position.x = Math.sin(Date.now() * 0.001) * 2;
  sphere2.position.y = Math.cos(Date.now() * 0.001) * 2;
  sphere2.position.z = Math.sin(Date.now() * 0.001) * 2;

  sphere3.position.x = Math.sin(Date.now() * 0.001 + Math.PI) * 2; // offset by PI to orbit on the opposite side
  sphere3.position.y = Math.cos(Date.now() * 0.001 + Math.PI) * 2;
  sphere3.position.z = Math.sin(Date.now() * 0.001 + Math.PI) * 2;

  // rotate the camera around the origin
  camera.position.x = Math.cos(Date.now() * 0.0005) * 5;
  camera.position.y = Math.sin(Date.now() * 0.0005) * 5;
  camera.lookAt(scene.position);

  // Lightning effect
  if (lightningTimer > 0) {
    lightningTimer -= 1;
    if (lightningTimer < FLASH_DURATION) {
      // decrease intensity of the flash as time passes
      renderer.setClearColor(0x000000, 1 - lightningTimer / FLASH_DURATION);
      ambientLight.intensity = 0.8 * (lightningTimer / FLASH_DURATION);
    }
  } else if (Math.random() < 0.01) {
    // 1% chance per frame
    // randomly place the lightning in the scene
    let lightningPosition = new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    light.position.copy(lightningPosition);
    light.visible = true;
    lightningTimer = 20;
    // create a bunch of lightning bolts
    for (let i = 0; i < 10; i++) {
      let boltStart = lightningPosition;
      let boltEnd = new THREE.Vector3(
        boltStart.x + (Math.random() - 0.5) * 2,
        boltStart.y + (Math.random() - 0.5) * 2,
        boltStart.z + (Math.random() - 0.5) * 2
      );
      let lightningGeometry = new THREE.BufferGeometry().setFromPoints([
        boltStart,
        boltEnd,
      ]);
      let lightningMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      });
      let bolt = new THREE.Line(lightningGeometry, lightningMaterial);
      lightningBolts.push(bolt);
      scene.add(bolt);
    }
    // create a flash effect
    renderer.setClearColor(0xffffff, 1);
    ambientLight.intensity = 2;
  } else {
    light.visible = false;
    // remove the old lightning bolts
    for (let bolt of lightningBolts) {
      scene.remove(bolt);
    }
    lightningBolts = [];
  }

  renderer.render(scene, camera);
}

init();
