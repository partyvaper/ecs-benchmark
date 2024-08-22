import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: true });
    }

    return () => {
        const entities = world.entities;
        for (let i = 0, len = entities.length; i < len; i++) {
            world.addComponent(entities[i], { B: true });
        }

        for (let i = 0, len = entities.length; i < len; i++) {
            world.removeComponent(entities[i], "B");
        }
    };
};
