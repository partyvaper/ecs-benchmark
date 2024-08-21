import { World } from "miniplex";

export default async (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: count, B: i % 2, C: 0 });
    }

    const withBZero = world.with("A", "B", "C").where(({ B }) => B === 0);
    const withBOne = world.with("A", "B", "C").where(({ B }) => B === 1);

    return () => {
        for (const entityZero of withBZero.entities) {
            for (const entityOne of withBOne.entities) {
                entityZero.C = entityOne.B;
                entityOne.C = entityZero.B;
            }
        }
    };
};
