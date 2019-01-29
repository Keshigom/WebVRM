// 初期化
init = (targetCanvas) => {
    initThree(targetCanvas);
    initStats();
    //TODO:消す
    addTestObject();
    //loadModel(`../asset/MonoPub.vrm`);
    loadModel(`https://dl.dropboxusercontent.com/s/tnpy4wpnk90ezz2/6539860143134222801.vrm`)
    //描画開始
    update();
}


let stats, controls;
let camera, scene, renderer;
const initThree = (canvas) => {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(0, 1.5, - 1);

    controls = new THREE.OrbitControls(camera, canvas);
    controls.target.set(0, 1.5, 0);
    controls.update();

    scene = new THREE.Scene();
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    scene.add(light);

    initRenderer(canvas);

}

// レンダラー設定
const initRenderer = (canvas) => {
    renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    renderer.shadowMap.autoUpdate = false;
    canvas.appendChild(renderer.domElement);
}

//FPS表示
const initStats = () => {
    stats = new Stats();
    stats.dom.style.position = "relative"
    stats.dom.style.top = "5px";
    stats.dom.style.margin = "auto";
    document.getElementById("debugWindow").appendChild(stats.dom);
}

// ウィンドウサイズ変更
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener(`resize`, onWindowResize, false);


const addTestObject = () => {
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshNormalMaterial();
    const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    threeCube.position.set(0, -0.5, 0);
    scene.add(threeCube);
}

const setUp = () => {
    setBoneMenu();
    setExpressionMenu();
}

const setBoneMenu = () => {
    const boneKeys = avatar.getBoneKeys();
    boneSelector = document.getElementById("boneSelector");
    for (const key of boneKeys) {
        const element = document.createElement("option");
        element.value = key;
        element.innerHTML = key;
        boneSelector.appendChild(element);
    }
}

const setExpressionMenu = () => {
    const expressionKeys = avatar.getExpressionKeys();
    boneSelector = document.getElementById("expressionSelector");
    for (const key of expressionKeys) {
        const element = document.createElement("option");
        element.value = key;
        element.innerHTML = key;
        boneSelector.appendChild(element);
    }
}

const changeBoneAngle = (axis, value) => {
    key = document.getElementById("boneSelector").value;

    if (key === "default") return;

    let vector = {};
    vector[axis] = (value / 180) * Math.PI;
    avatar.setBoneRotation(key, vector);
}

const changeExpression = (value) => {
    key = document.getElementById("expressionSelector").value;

    if (key === "default") return;

    avatar.setExpression(key, value / 100);
}

//モデル読み込み
const loadModel = (modelURL) => {
    avatar = new WebVRM(modelURL, scene, setUp);
}



// 描画更新処理
const update = () => {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    stats.update();
}


