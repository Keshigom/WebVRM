/*
必須
Three.js
GLTFLoder.js
VRMLoder.js
*/

class WebVRM {

    constructor(
        avatarFileURL,
        targetScene,
        callBackReady = () => {
            console.log("Avatar Ready")
        }
    ) {
        this._vrm;
        this._skeleton;
        this._blendShape;
        this.isReady = false;
        this._loadVRM(avatarFileURL, targetScene, callBackReady);
    }

    //=======================================================
    //  private method
    //=======================================================

    _loadVRM(avatarFileURL, targetScene, callBackReady) {
        // model
        const loader = new THREE.VRMLoader();
        let loadModel;
        loader.load(avatarFileURL, (vrm) => {
            vrm.scene.name = "VRM";
            // VRMLoader doesn't support VRM Unlit extension yet so
            // converting all materials to MeshBasicMaterial here as workaround so far.
            //マテリアルの変換（Unlit -> MeshBasicMaterial ）
            vrm.scene.traverse((object) => {

                if (object.material) {

                    if (Array.isArray(object.material)) {

                        for (var i = 0, il = object.material.length; i < il; i++) {

                            var material = new THREE.MeshBasicMaterial();
                            THREE.Material.prototype.copy.call(material, object.material[i]);
                            material.color.copy(object.material[i].color);
                            material.map = object.material[i].map;
                            material.lights = false;
                            material.skinning = object.material[i].skinning;
                            material.morphTargets = object.material[i].morphTargets;
                            material.morphNormals = object.material[i].morphNormals;
                            object.material[i] = material;

                        }

                    } else {

                        var material = new THREE.MeshBasicMaterial();
                        THREE.Material.prototype.copy.call(material, object.material);
                        material.color.copy(object.material.color);
                        material.map = object.material.map;
                        material.lights = false;
                        material.skinning = object.material.skinning;
                        material.morphTargets = object.material.morphTargets;
                        material.morphNormals = object.material.morphNormals;
                        object.material = material;

                    }

                }

            });
            this._vrm = vrm;
            targetScene.add(vrm.scene);
            this._initAvatar(vrm);
            this.isReady = true;
            callBackReady();
        });
    }

    _initAvatar(vrm) {
        this._skeleton = new Skeleton(vrm.scene, vrm.parser.json);
        this._blendShape = new BlendShape(vrm.scene, vrm.parser.json);
    }


    //=======================================================
    //  public method
    //=======================================================

    getScene() {
        if (this._vrm === undefined) {
            console.log("Loading is incomplete");
        }
        return this._vrm.scene;
    }

    setBoneRotation(key, angle) {
        this._skeleton.setRotation(key, angle);
    }
    setExpression(key, value) {
        this._blendShape.setExpression(key, value);
    }

    getBoneKeys() {
        return this._skeleton.getKeysIterator();
    }
    getExpressionKeys() {
        return this._blendShape.getKeysIterator();
    }
}