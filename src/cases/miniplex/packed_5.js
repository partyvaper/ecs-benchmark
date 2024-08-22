import { World } from "miniplex";

export default (count) => {
    const world = new World();

    for (let i = 0; i < count; i++) {
        world.add({ A: 1, B: 1, C: 1, D: 1, E: 1 });
    }

    const queryA = world.with("A");
    const queryB = world.with("B");
    const queryC = world.with("C");
    const queryD = world.with("D");
    const queryE = world.with("E");

    return () => {
        const queryAentities = queryA.entities;
        for (let i = 0, len = queryAentities.length; i < len; i++) {
            queryAentities[i].A *= 2;
        }

        const queryBentities = queryB.entities;
        for (let i = 0, len = queryBentities.length; i < len; i++) {
            queryBentities[i].B *= 2;
        }

        const queryCentities = queryC.entities;
        for (let i = 0, len = queryCentities.length; i < len; i++) {
            queryCentities[i].C *= 2;
        }

        const queryDentities = queryD.entities;
        for (let i = 0, len = queryDentities.length; i < len; i++) {
            queryDentities[i].D *= 2;
        }

        const queryEentities = queryE.entities;
        for (let i = 0, len = queryEentities.length; i < len; i++) {
            queryEentities[i].E *= 2;
        }
    };
};
