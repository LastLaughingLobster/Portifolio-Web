export const COLOR_POSITIONS = {
    UP: 'white',
    DOWN: 'yellow',
    LEFT: 'green',
    RIGHT: 'blue',
    FRONT: 'red',
    BACK: 'orange'
};

export const COLORS = {
    WHITE: 'white',
    YELLOW: 'yellow',
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    ORANGE: 'orange'
};

export const STICKERS = {
    UP: `${process.env.PUBLIC_URL}/images/colors/white.jpg`,
    DOWN: `${process.env.PUBLIC_URL}/images/colors/yellow.jpg`,
    LEFT: `${process.env.PUBLIC_URL}/images/colors/green.jpg`,
    RIGHT: `${process.env.PUBLIC_URL}/images/colors/blue.jpg`,
    FRONT: `${process.env.PUBLIC_URL}/images/colors/red.jpg`,
    BACK: `${process.env.PUBLIC_URL}/images/colors/orange.jpg`,
    BLACK: `${process.env.PUBLIC_URL}/images/colors/black.jpg`
};

export type WholeFaceStickers = {
    [key: string]: string;
  };
  

export const WHOLE_FACE_STICKERS : WholeFaceStickers = {
    RED: `${process.env.PUBLIC_URL}/images/cubeFaces/red/white_face_sticker.png`,
    GREEN: `${process.env.PUBLIC_URL}/images/cubeFaces/green/white_face_sticker.png`,
    BLUE: `${process.env.PUBLIC_URL}/images/cubeFaces/blue/white_face_sticker.png`,
    YELLOW: `${process.env.PUBLIC_URL}/images/cubeFaces/yellow/white_face_sticker.png`,
    WHITE: `${process.env.PUBLIC_URL}/images/cubeFaces/white/white_face_sticker.png`,
    ORANGE: `${process.env.PUBLIC_URL}/images/cubeFaces/orange/white_face_sticker.png`,
}

