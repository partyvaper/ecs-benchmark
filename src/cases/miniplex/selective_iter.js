import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: count, B: i % 2, C: 0 });
    }
    
    const qB = world.with("A", "B", "C");
    const withBZero = qB.where(({ B }) => B === 0);
    const withBOne = qB.where(({ B }) => B === 1);

    return () => {
        for (const entityZero of withBZero.entities) {
            for (const entityOne of withBOne.entities) {
                entityZero.C = entityOne.B;
                entityOne.C = entityZero.B;
            }
        }
    };
};
