import type { RegionId } from "../anatomy/regions.js";
import type { CognitiveProcessKind } from "./processes.js";

export type SensoryModality = "visual" | "auditory" | "somatosensory" | "olfactory" | "gustatory" | "vestibular" | "visceral";
export type NeuralEvent =
  | { readonly type: "sensory-input"; readonly modality: SensoryModality; readonly source: RegionId; readonly payload: unknown; readonly occurredAt: number }
  | { readonly type: "regional-signal"; readonly source: RegionId; readonly target: RegionId; readonly signalClass: "excitatory" | "inhibitory" | "modulatory" | "unspecified"; readonly payload?: unknown; readonly occurredAt: number }
  | { readonly type: "cognitive-process"; readonly process: CognitiveProcessKind; readonly participants: readonly RegionId[]; readonly payload?: unknown; readonly occurredAt: number }
  | { readonly type: "motor-command"; readonly source: RegionId; readonly target: RegionId; readonly effector: "skeletal-muscle" | "eye" | "autonomic" | "other"; readonly payload?: unknown; readonly occurredAt: number }
  | { readonly type: "behavioral-output"; readonly source: RegionId; readonly behavior: string; readonly occurredAt: number };
