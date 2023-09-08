export type Axis = 'X' | 'Y' | 'Z';
export type Direction = 1 | -1;
export type Layer = -1 | 0 | 1;

export type RotationState = {
    axis: Axis | null;
    direction: Direction;
    layer: Layer | null;
};
