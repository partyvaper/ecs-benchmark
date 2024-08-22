import { World } from "miniplex";

export default (count) => {
    const world = new World();

    const entityTemplate = { Data: 1 };

    const components = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    for (let i = 0; i < count; i++) {
        for (const component of components) {
            const entity = { ...entityTemplate, [component]: 1 };
            world.add(entity);
        }
    }

    const withZ = world.with("Z");
    const withData = world.with("Data");

    return () => {
        const zEntities = withZ.entities;
        for (let i = 0, len = zEntities.length; i < len; i++) {
            zEntities[i].Z *= 2;
        }
        const dataEntities = withData.entities;
        for (let i = 0, len = dataEntities.length; i < len; i++) {
            dataEntities[i].Data *= 2;
        }
    };
};
