import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Worker } from "node:worker_threads";
import { table } from "table";
import chalk from "chalk";

const OBJ = "obj";
const SOA = "soa";

const LIBRARIES = [
    { kind: SOA, name: "bitecs" },
    { kind: SOA, name: "harmony-ecs" },
    { kind: SOA, name: "piecs" },
    // // { kind: SOA, name: "wolf-ecs" },
    // // { kind: OBJ, name: "becsy" },
    // { kind: OBJ, name: "ecsy" },
    // { kind: OBJ, name: "geotic" },
    { kind: OBJ, name: "goodluck" },
    // { kind: OBJ, name: "javelin-ecs" },
    { kind: OBJ, name: "miniplex" },
    // { kind: OBJ, name: "perform-ecs" },
    // { kind: OBJ, name: "picoes" },
    // { kind: OBJ, name: "tiny-ecs" },
    // { kind: OBJ, name: "uecs" },
];

const ITER_SCALE = 1;

const BENCHMARKS = {
    packed_5: 1_000 * ITER_SCALE,
    simple_iter: 1_000 * ITER_SCALE,
    selective_iter: 1_000 * ITER_SCALE,
    frag_iter: 100 * ITER_SCALE,
    entity_cycle: 1_000 * ITER_SCALE,
    add_remove: 1_000 * ITER_SCALE,
};

let libraries;
let args = process.argv.slice(2);
if (args.length > 0) {
    let filtered_libraries = [];
    for (let arg of args) {
        if (arg[0] === "@") {
            filtered_libraries.push(...LIBRARIES.filter((lib) => lib.kind === arg.slice(1)));
        } else {
            let lib = LIBRARIES.find((lib) => lib.name === arg);
            if (lib) {
                filtered_libraries.push(lib);
            } else {
                console.warn(`${lib} is not supported`);
            }
        }
    }
    libraries = Array.from(new Set(filtered_libraries));
} else {
    libraries = LIBRARIES;
}

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const RESULTS = [];

for (let lib of libraries) {
    let results = [];
    RESULTS.push(results);
    console.log(lib.name);
    for (let name in BENCHMARKS) {
        let log = `  ${name} ${" ".repeat(14 - name.length)}`;
        let path = resolve(CURRENT_DIR, `./cases/${lib.name}/${name}.js`);
        if (!existsSync(path)) {
            results.push("TODO");
            console.log(`${log} TODO`);
            continue;
        }
        try {
            let config = BENCHMARKS[name];
            let result = await run_bench(path, config);
            results.push(result);
            console.log(`${log} ${Math.floor(result.hz).toLocaleString()} op/s`);
        } catch (err) {
            if (err instanceof Error) {
                results.push(err.code ?? "ERROR");
                console.log(`${log} ${err.code ?? "ERROR"}`);
                console.log(err.stack);
            } else {
                results.push("ERROR");
                console.log(`${log} ERROR`);
                console.log(err);
            }
        }
    }
    console.log();
}

// console.log(BENCHMARKS);
// console.log(libraries);
// console.log(RESULTS);

const minMax = Object.keys(BENCHMARKS).map((bench, i) => {
    const values = RESULTS.filter((r) => r !== "TODO").map((r) => r[i].hz).sort((a, b) => a - b);
    const min = values[0];
    const secondMax = values[values.length - 2];
    const max = values[values.length - 1];

    return [min, secondMax, max];
});

const header = ["ops/sec", ...Object.keys(BENCHMARKS)];
const body = libraries.map((library, i) => {
    const title = `(${library.kind}) ${library.name}`;
    const results = RESULTS[i].map((result, ri) => {
        if (result === "TODO") {
            return `${chalk.cyan(result)}`;
        }
        const [min, secondMax, max] = minMax[ri];
        const val = result.hz;
        const color =
            val === min ? chalk.red : val === max ? chalk.green : val === secondMax ? chalk.yellow : chalk.reset;
        return `${color(Math.floor(val).toLocaleString())}`; // ops/sec
        // return `${Math.floor(result.ms).toLocaleString()}`; // ms/op
    });
    return [title, ...results];
});
const tableData = [header, ...body];

console.log(table(tableData));

function run_bench(path, config) {
    let worker_file = resolve(CURRENT_DIR, "bench_worker.js");

    return new Promise((resolve, reject) => {
        let worker = new Worker(worker_file, {
            workerData: {
                path,
                config,
            },
        });

        worker.on("message", resolve);
        worker.on("error", reject);
    });
}
