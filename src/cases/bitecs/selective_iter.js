import { defineComponent, Types, createWorld, addEntity, addComponent, pipe, defineQuery } from "bitecs";

export default (count) => {
    const world = createWorld();

    const A = defineComponent({ value: Types.i32 });
    const B = defineComponent({ value: Types.i32 });
    const C = defineComponent({ value: Types.i32 });

    for (let i = 0; i < count; i++) {
        const eid = addEntity(world);
        addComponent(world, A, eid);
        A.value[eid] = count;
        addComponent(world, B, eid);
        B.value[eid] = i % 2;
        addComponent(world, C, eid);
        C.value[eid] = 0;
    }

    const qB = defineQuery([A, B, C]);
    const withBZero = qB(world).filter((eid) => B.value[eid] === 0);
    const withBOne = qB(world).filter((eid) => B.value[eid] === 1);

    const system = (world) => {
        for (let i = 0, len = withBZero.length; i < len; i++) {
            const eidZero = withBZero[i];
            for (let j = 0, len2 = withBOne.length; j < len2; j++) {
                const eidOne = withBOne[j];
                C.value[eidZero] = B.value[eidOne];
                C.value[eidOne] = B.value[eidZero];
            }
        }
        return world;
    };

    return () => {
        system(world);
    };
};
