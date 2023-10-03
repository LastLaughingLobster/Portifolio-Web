// iconMapping.ts

type IconData = {
    image: string;
    name: string;
    grade: 1 | 2 | 3;
};

type ColorIconMapping = {
    [color: string]: IconData[];
};

export const colorToIconsMapping: ColorIconMapping = {
    red: [
        {
            image: "path_to_image_1",
            name: "Skill 1",
            grade: 3
        },
        // ... add up to 9 icons for red
    ],
    green: [
        // ... icons for green
    ],
    blue: [
        // ... icons for blue
    ],
    yellow: [
        // ... icons for yellow
    ],
    white: [
        // ... icons for white
    ],
    orange: [
        // ... icons for orange
    ],
};
