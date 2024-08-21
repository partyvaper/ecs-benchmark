import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: 1 });
    }

    const withA = world.with("A");
    const withB = world.with("B");

    return () => {
        for (const entity of withA.entities) {
            world.add({ B: 1 });
        }

        for (let i = withB.entities.length; i > 0; i--) {
            const entity = withB.entities[i - 1];
            world.remove(entity);
        }
    };
};
