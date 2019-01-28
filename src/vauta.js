
var VAUTA = VAUTA || {};
(function (global) {

    // 初期化
    VAUTA.init = (targetCanvas) => {
        initThree(targetCanvas);
        initStats();
        //TODO:消す
        addTestObject();
        VAUTA.loadModel(`../asset/MonoPub.vrm`);
        //描画開始
        VAUTA.update();
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
        scene.add(threeCube);
    }

    //モデル読み込み
    VAUTA.loadModel = (modelURL) => {
        VAUTA.avatar = new WebVRM(modelURL, scene);
    }



    // 描画更新処理
    VAUTA.update = () => {
        requestAnimationFrame(VAUTA.update);
        renderer.render(scene, camera);
        stats.update();
    }

}(this));