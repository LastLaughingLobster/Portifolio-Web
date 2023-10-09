const fragmentShader = `
uniform vec2 resolution;

varying vec2 vUv;

void main() {
    
    vec2 uv = vUv;
  
    float gridSize = 200.0; 
    vec2 gridUV = uv * gridSize;
    float scale = 3.0;
    float numLayers = 3.0;
    float gridMod = 1.0 * pow(scale, numLayers - 1.0);
    
    vec3 color = vec3(1.0, 0.997, 0.957);
    
    for (int i = 0; i < int(numLayers); ++i) {
        if (i==2) continue;
        float lineWidth = 0.1 / pow(2.0, float(i));
        bool isLine = mod(gridUV.x, gridMod) < lineWidth || mod(gridUV.y, gridMod) < lineWidth;

        if (isLine) {
            color = vec3(1.0, 0.997, 0.957) * 0.7;
            break;
        }

        gridMod /= scale;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`

const fragmentShaderno = `
uniform vec2 resolution;
uniform float time; // Elapsed time

varying vec2 vUv;

// Pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vUv;
  
    float gridSize = 200.0; 
    vec2 gridUV = uv * gridSize;
    float scale = 3.0;
    float numLayers = 3.0;
    float gridMod = 1.0 * pow(scale, numLayers - 1.0);
    
    // Define the colors
    vec3 colors[6];
    colors[0] = vec3(1.0, 0.997, 0.957); // white
    colors[1] = vec3(1.0, 1.0, 0.0);    // yellow
    colors[2] = vec3(0.0, 0.0, 1.0);    // blue
    colors[3] = vec3(0.0, 1.0, 0.0);    // green
    colors[4] = vec3(1.0, 0.5, 0.0);    // orange
    colors[5] = vec3(1.0, 0.0, 0.0);    // red
    
    vec3 color = colors[0]; // Default to white
    
    for (int i = 0; i < int(numLayers); ++i) {
        if (i==2) continue;
        float lineWidth = 0.15 / pow(2.0, float(i));
        bool isLine = mod(gridUV.x, gridMod) < lineWidth || mod(gridUV.y, gridMod) < lineWidth;

        if (isLine) {
            color = vec3(1.0, 0.997, 0.957) * 0.7;
            break;
        }

        gridMod /= scale;
    }
    
    // Calculate cell age based on time and randomness
    float cellAge = mod(time + random(floor(gridUV)) * 10.0, 20.0); // Adjust the multipliers to control rate and duration

    // If the fragment is not part of a line and its age is within a range, assign a random color
    if (color == colors[0] && cellAge > 5.0 && cellAge < 15.0) {
        float rand = random(floor(gridUV + time));
        int index = int(rand * 6.0);
        color = colors[index];
    }
    
    gl_FragColor = vec4(color, 1.0);
}

`

export default fragmentShader
