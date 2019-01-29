// 表情制御
// TODO:マテリアルの切り替えに対応する

class BlendShape {

    constructor(scene, json) {
        this._blendShapeMap = this._createShapeMap(scene, json);
    }

    //=======================================================
    //  private method
    //=======================================================

    _createShapeMap(scene, json) {
        const blendShapeGroups = json.extensions.VRM.blendShapeMaster.blendShapeGroups;
        let shapeMap = new Map();
        blendShapeGroups.forEach(
            (blendShapeObj) => {
                if (blendShapeObj.presetName != "unknown") {
                    const name = blendShapeObj.name;
                    let targetsObj = this._getTargets(blendShapeObj.binds, json.meshes, scene);
                    shapeMap.set(blendShapeObj.presetName, {
                        name: name,
                        targets: targetsObj
                    });
                }
                else {

                }
            }
        );
        return shapeMap;
    }

    _getTargets(binds, meshes, scene) {
        let targets = [];
        binds.forEach((bind, index) => {
            let target = {};
            const meshName = meshes[bind.mesh].name
            target["meshName"] = meshName;
            target["weight"] = bind.weight;
            target["index"] = bind.index;
            target["morphTargetInfluences"] = this._getMorphTarget(meshName.replace(".baked", ""), scene);

            targets[index] = target;

        });
        return targets;
    }

    _getMorphTarget(name, scene) {
        const targetObj = scene.getObjectByName(name);
        if (targetObj != undefined) {
            if (targetObj.morphTargetInfluences != undefined) {
                return targetObj.morphTargetInfluences;

            }
            else if (targetObj.children != undefined) {
                let morphTarget;
                targetObj.children.forEach(function (child) {
                    if (child.morphTargetInfluences != undefined) {
                        morphTarget = child.morphTargetInfluences;
                    }
                });
                return morphTarget;
            }
        }
    }



    //=======================================================
    //  public method
    //=======================================================

    //FIXME:複数の表情を同時に設定するとモデルが破綻する
    //a-oのリップシンクとblink_l,r の瞬きは干渉しないものとしている。
    setExpression(key, value) {
        this._blendShapeMap.get(key).targets.forEach((target) => {
            if ((target.index != undefined) && (target.morphTargetInfluences != undefined))
                target.morphTargetInfluences[target.index] = value * target.weight * 0.01;
        });
    }

    //MapIteratorを返す
    getKeysIterator() {
        return this._blendShapeMap.keys();
    }
};