import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: true });
    }

    return () => {
        for (const entity of world.entities) {
            world.addComponent(entity, { B: true });
        }

        for (const entity of world.entities) {
            world.removeComponent(entity, "B");
        }
    };
};
