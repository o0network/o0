document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("threejs");
  if (!container) return;

  const isMobilePlatform = /Mobi|Android/i.test(navigator.userAgent);

  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const uniformData = {
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    u_time: { value: 0.0 },
    u_mouse: { value: new THREE.Vector2(0.0, 0.0) },
    u_orientation: { value: new THREE.Vector2(0.0, 0.0) },
    u_is_mobile: { value: isMobilePlatform ? 1.0 : 0.0 },
  };

  const planeGeometry = new THREE.PlaneGeometry(2, 2);

  const shaderMaterial = new THREE.ShaderMaterial({
    fragmentShader: `
      #ifdef GL_ES
      precision mediump float;
      #endif

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec2 u_orientation;
      uniform float u_is_mobile;

      vec3 rainbowColor(float position, float time) {
        vec3 palette[8] = vec3[](
          vec3(0.9490, 0.0000, 1.0000),
          vec3(0.9608, 0.1961, 0.8627),
          vec3(0.9804, 0.2353, 0.7255),
          vec3(0.9882, 0.2745, 0.5686),
          vec3(0.9961, 0.3137, 0.3922),
          vec3(1.0000, 0.4706, 0.2549),
          vec3(1.0000, 0.6275, 0.1176),
          vec3(1.0000, 0.7843, 0.0000)
        );

        float pattern = fract(position * 0.5 + time * 0.1);
        float index = pattern * 8.0;
        int i0 = int(floor(index));
        int i1 = int(ceil(index));
        float t = fract(index);

        i0 = i0 % 8;
        i1 = i1 % 8;

        return mix(palette[i0], palette[i1], t);
      }

      float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        st.x *= aspect;

        vec2 influence = mix(u_mouse, u_orientation, u_is_mobile);
        influence.y *= -1.0;
        influence *= 2.0;

        float base_pattern = 0.0;
        base_pattern += sin(st.x * 10.0 + u_time * 0.5 + influence.x * 0.5) * 0.5 + 0.5;
        base_pattern += cos(st.y * 10.0 + u_time * 0.3 + influence.y * 0.5) * 0.5 + 0.5;

        float noise_val = noise(st * 5.0 + u_time * 0.2 + influence * 0.1) * 0.5;

        float combined_pattern = base_pattern * 0.7 + noise_val * 0.3;

        vec2 distorted_st = st + vec2(
          cos(combined_pattern * 3.14159 * 2.0 + influence.x * 0.5) * 0.05,
          sin(combined_pattern * 3.14159 * 2.0 + influence.y * 0.5) * 0.05
        );

        float color_intensity = 0.0;
        color_intensity += sin(distorted_st.x * 8.0 + cos(u_time * 0.5 + distorted_st.y * 10.0 + sin(distorted_st.x * 12.0 + u_time * 1.0))) * 0.8;
        color_intensity += cos(distorted_st.y * 8.0 + sin(u_time * 0.3 + distorted_st.x * 10.0 + cos(distorted_st.y * 12.0 + u_time * 1.0))) * 0.8;

        vec3 final_color = rainbowColor(color_intensity * 0.5 + 0.5, u_time * 0.5);

        gl_FragColor = vec4(final_color, 1.0);
      }
    `,
    uniforms: uniformData,
  });

  const mesh = new THREE.Mesh(planeGeometry, shaderMaterial);
  scene.add(mesh);

  const clock = new THREE.Clock();

  // Declare mousePosition before using it
  const mousePosition = { x: 0, y: 0 };

  const animate = () => {
    shaderMaterial.uniforms.u_time.value = clock.getElapsedTime();

    if (isMobilePlatform) {
      shaderMaterial.uniforms.u_orientation.value.set(
        deviceOrientation.gamma * 0.01,
        deviceOrientation.beta * 0.01
      );
    } else {
      shaderMaterial.uniforms.u_mouse.value.set(
        mousePosition.x,
        mousePosition.y
      );
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  const handleResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    shaderMaterial.uniforms.u_resolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
  };

  window.addEventListener("resize", handleResize);

  const handleMouseMove = (event) => {
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  if (!isMobilePlatform) {
    window.addEventListener("mousemove", handleMouseMove);
  }

  const deviceOrientation = { beta: 0, gamma: 0 };
  if (isMobilePlatform) {
    window.addEventListener("deviceorientation", (event) => {
      deviceOrientation.beta = event.beta || 0;
      deviceOrientation.gamma = event.gamma || 0;
    });
  }
});
