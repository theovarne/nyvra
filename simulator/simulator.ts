import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateHistory } from './blocks.js';
import { GENESIS_TIMESTAMP } from './events.js';
import type { Transition } from '../core/transition.js';

interface Options { start: number; count: number; seed: number; json: boolean; help: boolean }
export function parseArgs(args: string[]): Options {
  const options: Options = { start: 421, count: 10, seed: 0, json: false, help: false };
  const seen = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (seen.has(arg)) throw new Error(`Duplicate argument: ${arg}`);
    seen.add(arg);
    if (arg === '--json') options.json = true;
    else if (arg === '--help') options.help = true;
    else if (['--start', '--count', '--seed'].includes(arg)) {
      const raw = args[++i];
      if (raw === undefined || !/^\d+$/.test(raw)) throw new Error(`Expected unsigned integer after ${arg}`);
      const key = arg.slice(2) as 'start' | 'count' | 'seed';
      const value = Number(raw), max = key === 'seed' ? 4_294_967_295 : key === 'count' ? 1000 : 10_000;
      if (!Number.isSafeInteger(value) || value < (key === 'seed' ? 0 : 1) || value > max) throw new Error(`${arg} is out of range (max ${max}).`);
      options[key] = value;
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}
export function formatTransition(t: Transition): string {
  return `BLOCK ${String(t.sequence).padStart(5, '0')} · ${new Date(t.timestamp).toISOString()}\n\nOBSERVE\n  state hash: ${t.observation.stateHash}\nDECIDE\n  ${t.decision}\nPROVE\n  simulation checksum: VALID (not a ZK proof)\nAPPEND\n  transition committed: ${t.blockHash}\n`;
}
export function run(args = process.argv.slice(2)): void {
  const options = parseArgs(args);
  if (options.help) { console.log('NYVRA / SIMULATION\nUsage: npm run simulate -- [--start 421] [--count 10] [--seed 0] [--json]\nUse node build/simulator/simulator.js --json for clean machine-readable output.'); return; }
  const history = generateHistory(options.start + options.count - 1, options.seed);
  const transitions = history.slice(options.start - 1);
  if (options.json) {
    console.log(JSON.stringify({ mode: 'SIMULATION', seed: options.seed, genesisTimestamp: GENESIS_TIMESTAMP, checkpoint: options.start === 1 ? null : { sequence: options.start - 1, blockHash: history[options.start - 2]!.blockHash }, transitions }, null, 2));
  } else {
    console.log('NYVRA / SIMULATION\nOBSERVE → DECIDE → PROVE → APPEND\nOff-chain reference. No trades, signatures, ZK proofs or Solana transactions.\n');
    if (options.start > 1) console.log(`Reconstructed ${options.start - 1} preceding blocks from genesis.\n`);
    for (const transition of transitions) console.log(formatTransition(transition) + '\n--------------------\n');
    console.log(`Displayed: ${transitions.length} | HOLD: ${transitions.filter(t => t.decision === 'HOLD').length} | STRIKE: ${transitions.filter(t => t.decision === 'STRIKE').length}`);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
