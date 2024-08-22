import { createEntitySystem, World } from "piecs/dist/index.mjs";

export default function createSelectiveIter(count) {
    const world = new World();
    const A = {
        id: world.createComponentId(),
        arr: new Uint32Array(count).fill(count),
    };
    const B = {
        id: world.createComponentId(),
        arr: Uint32Array.from({ length: count }, (_, i) => i % 2),
    };
    const C = {
        id: world.createComponentId(),
        arr: new Uint32Array(count).fill(0),
    };

    const prefab = world.prefabricate([A, B, C]);

    world
        .registerSystem(
            createEntitySystem(
                function system(entities) {
                    for (let i = 0, l = entities.length; i < l; i++) {
                        const entityZero = entities[i];
                        if (B.arr[entityZero] !== 0) {
                            continue;
                        }
                        for (let j = 0, l2 = entities.length; j < l2; j++) {
                            const entityOne = entities[j];
                            if (B.arr[entityOne] !== 1) {
                                continue;
                            }
                            C.arr[entityZero] = B.arr[entityOne];
                            C.arr[entityOne] = B.arr[entityZero];
                        }
                    }
                },
                (q) => q.every(A, B),
            ),
        )
        .initialize();

    for (let i = 0; i < count; i++) {
        world.createEntity(prefab);
    }

    return function simpleIter() {
        world.update();
    };
}
