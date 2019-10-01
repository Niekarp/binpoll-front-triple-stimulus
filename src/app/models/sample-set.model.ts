import { Sample } from './sample.model';

export interface SampleSet {
  sampleNames: string[];
  samples: Sample[][] | string[][];
  seed: number;
}
