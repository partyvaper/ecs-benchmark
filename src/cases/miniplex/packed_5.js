import { World } from "miniplex";

export default async (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: 1, B: 1, C: 1, D: 1, E: 1 });
    }

    const withA = world.with("A");
    const withB = world.with("B");
    const withC = world.with("C");
    const withD = world.with("D");
    const withE = world.with("E");

    return () => {
        for (const entity of withA.entities) {
            entity.A *= 2;
        }

        for (const entity of withB.entities) {
            entity.B *= 2;
        }

        for (const entity of withC.entities) {
            entity.C *= 2;
        }

        for (const entity of withD.entities) {
            entity.D *= 2;
        }

        for (const entity of withE.entities) {
            entity.E *= 2;
        }
    };
};
