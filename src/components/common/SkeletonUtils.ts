import {
    AnimationClip,
    AnimationMixer,
    Bone,
    Matrix4,
    Object3D,
    Quaternion,
    QuaternionKeyframeTrack,
    Skeleton,
    SkeletonHelper,
    SkinnedMesh,
    Vector3,
    VectorKeyframeTrack
} from 'three';

/**
 * @module SkeletonUtils
 * @three_import import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
 */

interface RetargetOptions {
    getBoneName?: (bone: Bone) => string;
    names?: Record<string, string>;
    preserveBoneMatrix?: boolean;
    preserveBonePositions?: boolean;
    useTargetMatrix?: boolean;
    hip?: string;
    hipInfluence?: Vector3;
    scale?: number;
    localOffsets?: Record<string, Matrix4>;
    hipPosition?: Vector3;
    useFirstFramePosition?: boolean;
    fps?: number;
    trim?: [number, number];
}

function getBoneName(bone: Bone, options: RetargetOptions): string | undefined {
    if (options.getBoneName !== undefined) {
        return options.getBoneName(bone);
    }

    return options.names?.[bone.name];
}

/**
 * Retargets the skeleton from the given source 3D object to the
 * target 3D object.
 *
 * @param {Object3D} target - The target 3D object.
 * @param {Object3D} source - The source 3D object.
 * @param {RetargetOptions} options - The options.
 */
function retarget(target: Object3D | Skeleton, source: Object3D | Skeleton, options: RetargetOptions = {}): void {
    const quat = new Quaternion();
    const scale = new Vector3();
    const relativeMatrix = new Matrix4();
    const globalMatrix = new Matrix4();

    options.preserveBoneMatrix = options.preserveBoneMatrix !== undefined ? options.preserveBoneMatrix : true;
    options.preserveBonePositions = options.preserveBonePositions !== undefined ? options.preserveBonePositions : true;
    options.useTargetMatrix = options.useTargetMatrix !== undefined ? options.useTargetMatrix : false;
    options.hip = options.hip !== undefined ? options.hip : 'hip';
    options.hipInfluence = options.hipInfluence !== undefined ? options.hipInfluence : new Vector3(1, 1, 1);
    options.scale = options.scale !== undefined ? options.scale : 1;
    options.names = options.names || {};

    const sourceBones = source instanceof Object3D ? (source as SkinnedMesh).skeleton.bones : getBones(source);
    const bones = target instanceof Object3D ? (target as SkinnedMesh).skeleton.bones : getBones(target);

    let bone: Bone;
    let name: string | undefined;
    let boneTo: Bone | undefined;
    let bonesPosition: Vector3[] = [];

    // reset bones

    if (target instanceof Object3D) {
        (target as SkinnedMesh).skeleton.pose();
    } else {
        options.useTargetMatrix = true;
        options.preserveBoneMatrix = false;
    }

    if (options.preserveBonePositions) {
        bonesPosition = [];

        for (let i = 0; i < bones.length; i++) {
            bonesPosition.push(bones[i].position.clone());
        }
    }

    if (options.preserveBoneMatrix && target instanceof Object3D) {
        // reset matrix

        target.updateMatrixWorld();

        target.matrixWorld.identity();

        // reset children matrix

        for (let i = 0; i < target.children.length; ++i) {
            target.children[i].updateMatrixWorld(true);
        }
    }

    for (let i = 0; i < bones.length; ++i) {
        bone = bones[i];
        name = getBoneName(bone, options);

        boneTo = getBoneByName(name, sourceBones);

        globalMatrix.copy(bone.matrixWorld);

        if (boneTo) {
            boneTo.updateMatrixWorld();

            if (options.useTargetMatrix) {
                relativeMatrix.copy(boneTo.matrixWorld);
            } else if (target instanceof Object3D) {
                relativeMatrix.copy(target.matrixWorld).invert();
                relativeMatrix.multiply(boneTo.matrixWorld);
            }

            // ignore scale to extract rotation

            scale.setFromMatrixScale(relativeMatrix);
            relativeMatrix.scale(scale.set(1 / scale.x, 1 / scale.y, 1 / scale.z));

            // apply to global matrix

            globalMatrix.makeRotationFromQuaternion(quat.setFromRotationMatrix(relativeMatrix));

            if (target instanceof Object3D) {
                if (options.localOffsets) {
                    if (options.localOffsets[bone.name]) {
                        globalMatrix.multiply(options.localOffsets[bone.name]);
                    }
                }
            }

            globalMatrix.copyPosition(relativeMatrix);
        }

        if (name === options.hip) {
            globalMatrix.elements[12] *= options.scale! * options.hipInfluence!.x;
            globalMatrix.elements[13] *= options.scale! * options.hipInfluence!.y;
            globalMatrix.elements[14] *= options.scale! * options.hipInfluence!.z;

            if (options.hipPosition !== undefined) {
                globalMatrix.elements[12] += options.hipPosition.x * options.scale!;
                globalMatrix.elements[13] += options.hipPosition.y * options.scale!;
                globalMatrix.elements[14] += options.hipPosition.z * options.scale!;
            }
        }

        if (bone.parent) {
            bone.matrix.copy(bone.parent.matrixWorld).invert();
            bone.matrix.multiply(globalMatrix);
        } else {
            bone.matrix.copy(globalMatrix);
        }

        bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);

        bone.updateMatrixWorld();
    }

    if (options.preserveBonePositions) {
        for (let i = 0; i < bones.length; ++i) {
            bone = bones[i];
            name = getBoneName(bone, options) || bone.name;

            if (name !== options.hip) {
                bone.position.copy(bonesPosition[i]);
            }
        }
    }

    if (options.preserveBoneMatrix && target instanceof Object3D) {
        // restore matrix

        target.updateMatrixWorld(true);
    }
}

/**
 * Retargets the animation clip of the source object to the
 * target 3D object.
 *
 * @param {Object3D} target - The target 3D object.
 * @param {Object3D} source - The source 3D object.
 * @param {AnimationClip} clip - The animation clip.
 * @param {RetargetOptions} options - The options.
 * @return {AnimationClip} The retargeted animation clip.
 */
function retargetClip(
    target: Object3D,
    source: Object3D | Skeleton,
    clip: AnimationClip,
    options: RetargetOptions = {}
): AnimationClip {
    options.useFirstFramePosition = options.useFirstFramePosition !== undefined ? options.useFirstFramePosition : false;

    // Calculate the fps from the source clip based on the track with the most frames, unless fps is already provided.
    options.fps = options.fps !== undefined ? options.fps : (Math.max(...clip.tracks.map(track => track.times.length)) / clip.duration);
    options.names = options.names || {};

    if (!(source instanceof Object3D)) {
        source = getHelperFromSkeleton(source);
    }

    const numFrames = Math.round(clip.duration * (options.fps / 1000) * 1000);
    const delta = clip.duration / (numFrames - 1);
    const convertedTracks: (VectorKeyframeTrack | QuaternionKeyframeTrack)[] = [];
    const mixer = new AnimationMixer(source);
    const bones = getBones((target as SkinnedMesh).skeleton);
    const boneDatas: Array<{
        bone: Bone;
        pos?: { times: Float32Array; values: Float32Array };
        quat?: { times: Float32Array; values: Float32Array };
    } | undefined> = [];

    let positionOffset: Vector3 | undefined;
    let bone: Bone;
    let boneTo: Bone | undefined;
    let boneData: typeof boneDatas[number];
    let name: string | undefined;

    mixer.clipAction(clip).play();

    // trim

    let start = 0;
    let end = numFrames;

    if (options.trim !== undefined) {
        start = Math.round(options.trim[0] * options.fps);
        end = Math.min(Math.round(options.trim[1] * options.fps), numFrames) - start;

        mixer.update(options.trim[0]);
    } else {
        mixer.update(0);
    }

    source.updateMatrixWorld();

    //

    for (let frame = 0; frame < end; ++frame) {
        const time = frame * delta;

        retarget(target, source, options);

        for (let j = 0; j < bones.length; ++j) {
            bone = bones[j];
            name = getBoneName(bone, options) || bone.name;
            boneTo = getBoneByName(name, (source as SkinnedMesh).skeleton);

            if (boneTo) {
                boneData = boneDatas[j] = boneDatas[j] || { bone: bone };

                if (options.hip === name) {
                    if (!boneData.pos) {
                        boneData.pos = {
                            times: new Float32Array(end),
                            values: new Float32Array(end * 3)
                        };
                    }

                    if (options.useFirstFramePosition) {
                        if (frame === 0) {
                            positionOffset = bone.position.clone();
                        }

                        bone.position.sub(positionOffset!);
                    }

                    boneData.pos.times[frame] = time;

                    bone.position.toArray(boneData.pos.values, frame * 3);
                }

                if (!boneData.quat) {
                    boneData.quat = {
                        times: new Float32Array(end),
                        values: new Float32Array(end * 4)
                    };
                }

                boneData.quat.times[frame] = time;

                bone.quaternion.toArray(boneData.quat.values, frame * 4);
            }
        }

        if (frame === end - 2) {
            // last mixer update before final loop iteration
            // make sure we do not go over or equal to clip duration
            mixer.update(delta - 0.0000001);
        } else {
            mixer.update(delta);
        }

        source.updateMatrixWorld();
    }

    for (let i = 0; i < boneDatas.length; ++i) {
        boneData = boneDatas[i];

        if (boneData) {
            if (boneData.pos) {
                convertedTracks.push(new VectorKeyframeTrack(
                    '.bones[' + boneData.bone.name + '].position',
                    boneData.pos.times,
                    boneData.pos.values
                ));
            }

            convertedTracks.push(new QuaternionKeyframeTrack(
                '.bones[' + boneData.bone.name + '].quaternion',
                boneData.quat!.times,
                boneData.quat!.values
            ));
        }
    }

    mixer.uncacheAction(clip);

    return new AnimationClip(clip.name, -1, convertedTracks);
}

/**
 * Clones the given 3D object and its descendants, ensuring that any `SkinnedMesh` instances are
 * correctly associated with their bones. Bones are also cloned, and must be descendants of the
 * object passed to this method. Other data, like geometries and materials, are reused by reference.
 *
 * @param {Object3D} source - The 3D object to clone.
 * @return {Object3D} The cloned 3D object.
 */
function clone(source: Object3D): Object3D {
    const sourceLookup = new Map<Object3D, Object3D>();
    const cloneLookup = new Map<Object3D, Object3D>();

    const cloned = source.clone();

    parallelTraverse(source, cloned, function (sourceNode: Object3D, clonedNode: Object3D) {
        sourceLookup.set(clonedNode, sourceNode);
        cloneLookup.set(sourceNode, clonedNode);
    });

    cloned.traverse(function (node: Object3D) {
        if (!(node as SkinnedMesh).isSkinnedMesh) return;

        const clonedMesh = node as SkinnedMesh;
        const sourceMesh = sourceLookup.get(node) as SkinnedMesh;
        const sourceBones = sourceMesh.skeleton.bones;

        clonedMesh.skeleton = sourceMesh.skeleton.clone();
        clonedMesh.bindMatrix.copy(sourceMesh.bindMatrix);

        clonedMesh.skeleton.bones = sourceBones.map(function (bone: Bone) {
            return cloneLookup.get(bone) as Bone;
        });

        clonedMesh.bind(clonedMesh.skeleton, clonedMesh.bindMatrix);
    });

    return cloned;
}

// internal helper

function getBoneByName(name: string | undefined, skeleton: Bone[] | Skeleton): Bone | undefined {
    if (!name) return undefined;

    for (let i = 0, bones = getBones(skeleton); i < bones.length; i++) {
        if (name === bones[i].name) {
            return bones[i];
        }
    }

    return undefined;
}

function getBones(skeleton: Bone[] | Skeleton): Bone[] {
    return Array.isArray(skeleton) ? skeleton : skeleton.bones;
}

function getHelperFromSkeleton(skeleton: Skeleton): SkeletonHelper & { skeleton: Skeleton } {
    const source = new SkeletonHelper(skeleton.bones[0]) as SkeletonHelper & { skeleton: Skeleton };
    source.skeleton = skeleton;

    return source;
}

function parallelTraverse(a: Object3D, b: Object3D, callback: (a: Object3D, b: Object3D) => void): void {
    callback(a, b);

    for (let i = 0; i < a.children.length; i++) {
        parallelTraverse(a.children[i], b.children[i], callback);
    }
}

export {
    retarget,
    retargetClip,
    clone,
};

export type { RetargetOptions };
