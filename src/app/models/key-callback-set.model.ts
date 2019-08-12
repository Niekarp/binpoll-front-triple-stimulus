export interface KeyCallbackSet {
  goCondition: () => boolean;
  onGoConditionOK: () => void;
  onGoConditionFail: () => void;
  navigate: () => void;
}