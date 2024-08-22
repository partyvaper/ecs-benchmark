import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: 1 });
    }

    const aEntities = world.with("A");
    const bEntities = world.with("B");

    return () => {
        for (const entity of aEntities) {
            world.add({ B: 1 });
        }

        for (const entity of bEntities) {
            world.remove(entity);
        }

        // for (let i = bEntities.entities.length; i > 0; i--) {
        //     const entity = bEntities.entities[i - 1];
        //     world.remove(entity);
        // }
    };
};
