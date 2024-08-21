import { World } from "miniplex";

export default (count) => {
    const world = new World();

    Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").forEach((component) => {
        for (let i = 0; i < count; i++) {
            world.add({ [component]: 1, Data: 1 });
        }
    });

    const withZ = world.with("Z");
    const withData = world.with("Data");

    return () => {
        for (const entity of withZ.entities) {
            entity.Z *= 2;
        }

        for (const entity of withData.entities) {
            entity.Data *= 2;
        }
    };
};
