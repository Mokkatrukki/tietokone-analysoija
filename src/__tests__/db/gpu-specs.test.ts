import { Database } from 'sqlite3';
import { createGpuTables, insertGpuSpec, linkCpuToGpu, getIntegratedGpuForCpu } from '../../db/gpu-specs';
import { createCpuTable, insertCpuSpec } from '../../db/cpu-specs';
