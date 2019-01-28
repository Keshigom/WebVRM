//  ポーズ制御

class Skeleton {
    constructor(scene, json) {
        this._boneMap = this._createBoneMap(scene, json);
    }

    _createBoneMap(scene, json) {

        let boneMap = new Map();
        //VRM規格の標準ボーン
        const standardBone = ["hips", "leftUpperLeg", "rightUpperLeg", "leftLowerLeg", "rightLowerLeg", "leftFoot", "rightFoot", "spine", "chest", "neck", "head", "leftShoulder", "rightShoulder", "leftUpperArm", "rightUpperArm", "leftLowerArm", "rightLowerArm", "leftHand", "rightHand", "leftToes", "rightToes", "leftEye", "rightEye", "jaw", "leftThumbProximal", "leftThumbIntermediate", "leftThumbDistal", "leftIndexProximal", "leftIndexIntermediate", "leftIndexDistal", "leftMiddleProximal", "leftMiddleIntermediate", "leftMiddleDistal", "leftRingProximal", "leftRingIntermediate", "leftRingDistal", "leftLittleProximal", "leftLittleIntermediate", "leftLittleDistal", "rightThumbProximal", "rightThumbIntermediate", "rightThumbDistal", "rightIndexProximal", "rightIndexIntermediate", "rightIndexDistal", "rightMiddleProximal", "rightMiddleIntermediate", "rightMiddleDistal", "rightRingProximal", "rightRingIntermediate", "rightRingDistal", "rightLittleProximal", "rightLittleIntermediate", "rightLittleDistal", "upperChest"];
        const humanoid = new Object();
        humanoid.humanBones = json.extensions.VRM.humanoid.humanBones;
        standardBone.forEach(key => {
            const target = humanoid.humanBones.find(
                humanBone => humanBone.bone === key
            );
            if (target != undefined) {
                boneMap.set(key,
                    {
                        name: json.nodes[target.node].name,
                        bone: scene.getObjectByName(json.nodes[target.node].name, true)
                    });
            }

        });

        return boneMap;
    }

    // ボーンの角度を設定　setRotation("head",{x:0,y:0,z:1})
    // key   必須
    // x,y,z 指定したもののみ反映
    setRotation(key, angle) {
        if (angle.x != undefined)
            this._boneMap.get(key).bone.rotation.x = angle.x;

        if (angle.y != undefined)
            this._boneMap.get(key).bone.rotation.y = angle.y;

        if (angle.z != undefined)
            this._boneMap.get(key).bone.rotation.z = angle.z;
    }

    getBoneName(key) {
        return this._boneMap.get(key).bone.name;
    }
}