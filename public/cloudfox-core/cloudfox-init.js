import { initialize } from "./cloudfox-core.js";
import { getTimestamp } from "./cloudfox-utils.js";

console.info(`[${getTimestamp()}][INFO] Initializing Cloudfox service.`);
initialize();
console.info(`[${getTimestamp()}][INFO] Finished initializing Cloudfox service.`);