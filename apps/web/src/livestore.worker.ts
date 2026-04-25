import { schema } from "@hafnium/livestore-schema";
import { makeWorker } from "@livestore/adapter-web/worker";

makeWorker({ schema });
