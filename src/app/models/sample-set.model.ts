import { Sample } from './sample.model';

export interface SampleSet {
  setId: number;
  sampleNames: string[];
  samples: Sample[][] | string[][];
  seed: number;
}
