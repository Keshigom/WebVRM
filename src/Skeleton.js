//  ポーズ制御

class Skeleton {

    constructor(scene, json) {
        this._boneMap = this._createBoneMap(scene, json);
    }

    //=======================================================
    //  private method
    //=======================================================

    _createBoneMap(scene, json) {

        let boneMap = new Map();
        //VRM規格の標準ボーン名がkeyになっている
        const humanBones = json.extensions.VRM.humanoid.humanBones;
        for (const key in humanBones) {
            const target = humanBones[key];
            boneMap.set(target.bone,
                {
                    name: json.nodes[target.node].name,
                    bone: scene.getObjectByName(json.nodes[target.node].name, true)
                });
        }

        return boneMap;
    }


    //=======================================================
    //  public method
    //=======================================================

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

    //MapIteratorを返す
    getKeysIterator() {
        return this._boneMap.keys();
    }
}