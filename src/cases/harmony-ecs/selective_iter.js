import { Entity, Format, Query, Schema, World } from "harmony-ecs";

export default (count) => {
    const world = World.make(count);
    const A = Schema.makeBinary(world, Format.float64);
    const B = Schema.makeBinary(world, Format.float64);
    const C = Schema.makeBinary(world, Format.float64);
    const qB = Query.make(world, [A, B, C]);

    for (let i = 0; i < count; i++) {
        Entity.make(world, [A, B, C], [count, i % 2, 0]);
    }

    return () => {
        for (const [entities, [a, b, c]] of qB) {
            for (let i = 0, len = entities.length; i < len; i++) {
                // b zero
                if (b[i] !== 0) {
                    continue;
                }
                for (let j = 0, len2 = entities.length; j < len2; j++) {
                    // b one
                    if (b[i] !== 1) {
                        continue;
                    }
                    c[i] = b[j];
                    c[j] = b[i];
                }
            }
        }
    };
};