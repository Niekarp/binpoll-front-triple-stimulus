import { Sample } from './sample.model';

export interface SampleSet {
  id: number;
  sampleNames: string[];
  samples: Sample[][] | string[][];
  seed: number;
}
