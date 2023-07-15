let scene, camera, renderer;
let sphere1, sphere2, light, ambientLight, lightning;
let lightningTimer = 0;

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

  // Create the rolling sphere
  let geometry2 = new THREE.SphereGeometry(0.5, 32, 32);
  let material2 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  sphere2 = new THREE.Mesh(geometry2, material2);
  sphere2.position.x = 2;
  scene.add(sphere2);

  // Add an ambient light
  ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // Add a point light
  light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 0, 2);
  scene.add(light);

  // Add a "lightning" strike
  let lightningPoints = [];
  lightningPoints.push(new THREE.Vector3(-1, 3, 0));
  lightningPoints.push(new THREE.Vector3(1, -3, 0));
  let lightningGeometry = new THREE.BufferGeometry().setFromPoints(
    lightningPoints
  );
  let lightningMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
  });
  lightning = new THREE.Line(lightningGeometry, lightningMaterial);
  lightning.visible = false; // initially invisible
  scene.add(lightning);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  // Make sphere2 orbit around sphere1 in 3D
  sphere2.position.x = Math.sin(Date.now() * 0.001) * 2;
  sphere2.position.y = Math.cos(Date.now() * 0.001) * 2;
  sphere2.position.z = Math.sin(Date.now() * 0.001) * 2;

  // rotate the camera around the origin
  camera.position.x = Math.cos(Date.now() * 0.0005) * 5;
  camera.position.y = Math.sin(Date.now() * 0.0005) * 5;
  camera.lookAt(scene.position);

  // Lightning effect
  if (lightningTimer > 0) {
    lightningTimer -= 1;
  } else if (Math.random() < 0.01) {
    // 1% chance per frame
    // randomly place the lightning in the scene
    lightning.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );
    light.position.copy(lightning.position);
    lightning.visible = true;
    light.visible = true;
    lightningTimer = 10;
  } else {
    lightning.visible = false;
    light.visible = false;
  }

  renderer.render(scene, camera);
}

init();
