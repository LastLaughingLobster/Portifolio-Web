export type Axis = 'X' | 'Y' | 'Z';

export type RotationState = {
    axis: Axis | null;
    direction: number;
    layer: number;
};
