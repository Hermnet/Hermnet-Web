import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const c = {
  bg: "#0d111b",
  surface: "#141927",
  elevated: "#1e2d4a",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  text: "#ffffff",
  muted: "#a0aec0",
  dim: "#64748b",
  danger: "#fca5a5",
  success: "#16a34a",
  pattern: "#2a3654",
};

const fit = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const scenes = [
  {
    start: 18,
    end: 190,
    kicker: "Cada app te pide algo",
    title: "tu número, tus contactos, tus rutinas.",
    body: "Y poco a poco, alguien aprende cómo vives.",
  },
  {
    start: 192,
    end: 365,
    kicker: "La pregunta incómoda",
    title: "¿sabes qué hacen con todo eso?",
    body: "Tus datos no son ruido. Son un perfil.",
  },
  {
    start: 368,
    end: 548,
    kicker: "Hermnet empieza distinto",
    title: "identidad local. Sin teléfono.",
    body: "Comparte tu identidad por QR o hash público, no por datos personales.",
  },
  {
    start: 552,
    end: 725,
    kicker: "Antes de tocar el servidor",
    title: "el mensaje ya está cifrado.",
    body: "Hermnet transporta paquetes. No entrega tus conversaciones.",
  },
] as const;

const exposed = ["teléfono", "ubicación", "contactos", "fotos", "horarios", "compras"];
const protectedItems = ["HNET-ID", "QR", "hash público", "PIN", "backup cifrado", "Matrix"];

const AppLogo: React.FC<{ large?: boolean }> = ({ large }) => (
  <div style={{ display: "flex", alignItems: "center", gap: large ? 28 : 16 }}>
    <Img
      src={staticFile("hermnet-mark.png")}
      style={{
        width: large ? 170 : 68,
        height: large ? 170 : 68,
        objectFit: "contain",
        filter: "drop-shadow(0 0 28px rgba(96,165,250,.34))",
      }}
    />
    <div
      style={{
        color: c.text,
        fontSize: large ? 92 : 42,
        fontWeight: 920,
      }}
    >
      Hermnet
    </div>
  </div>
);

const BackgroundPattern: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 32 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -260 + random(`line-x-${i}`) * 2300,
            top: 40 + random(`line-y-${i}`) * 980,
            width: 720,
            height: 2,
            background: c.pattern,
            opacity: 0.12,
            transform: `rotate(${-24 + random(`line-r-${i}`) * 48}deg) translateX(${
              (frame * (0.35 + random(`line-s-${i}`))) % 280
            }px)`,
          }}
        />
      ))}
      {Array.from({ length: 26 }).map((_, i) => {
        const pulse = (Math.sin(frame / 24 + i) + 1) / 2;
        return (
          <div
            key={`node-${i}`}
            style={{
              position: "absolute",
              left: 260 + random(`node-x-${i}`) * 1500,
              top: 110 + random(`node-y-${i}`) * 820,
              width: 7 + pulse * 7,
              height: 7 + pulse * 7,
              borderRadius: 999,
              background: i % 6 === 0 ? c.danger : c.accentLight,
              boxShadow: `0 0 ${18 + pulse * 24}px ${
                i % 6 === 0 ? c.danger : c.accentLight
              }`,
              opacity: 0.16 + pulse * 0.26,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const SceneText: React.FC<(typeof scenes)[number]> = ({
  start,
  end,
  kicker,
  title,
  body,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const motion = spring({
    frame: frame - start,
    fps,
    config: { damping: 18, stiffness: 92 },
  });
  const opacity = fit(frame, [start, start + 22], [0, 1]) * fit(frame, [end - 26, end], [1, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 94,
        top: 230,
        width: 860,
        opacity,
        zIndex: 20,
        transform: `translateY(${interpolate(motion, [0, 1], [38, 0])}px)`,
      }}
    >
      <div
        style={{
          color: c.accentLight,
          fontSize: 32,
          fontWeight: 900,
          textTransform: "uppercase",
          marginBottom: 22,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          color: c.text,
          fontSize: title.length > 34 ? 76 : 88,
          lineHeight: 1.02,
          fontWeight: 950,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: c.muted,
          fontSize: 34,
          lineHeight: 1.24,
          fontWeight: 630,
          marginTop: 28,
          maxWidth: 760,
        }}
      >
        {body}
      </div>
    </div>
  );
};

const DataCards: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {exposed.map((word, index) => {
        const show = fit(frame, [30 + index * 10, 98 + index * 10], [0, 1]) *
          fit(frame, [330, 415], [1, 0]);
        return (
          <div
            key={word}
            style={{
              position: "absolute",
              right: 120 + (index % 2) * 360,
              top: 150 + index * 108,
              height: 68,
              minWidth: 260,
              borderRadius: 18,
              background: "rgba(20,25,39,.9)",
              border: "1px solid rgba(252,165,165,.28)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 22px",
              opacity: show,
              transform: `translateY(${interpolate(show, [0, 1], [30, 0])}px)`,
              zIndex: 8,
            }}
          >
            <div
              style={{
                width: 13,
                height: 13,
                borderRadius: 999,
                background: c.danger,
                boxShadow: `0 0 18px ${c.danger}`,
              }}
            />
            <div style={{ color: c.text, fontSize: 26, fontWeight: 820 }}>{word}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ProfileSilhouette: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = fit(frame, [170, 230], [0, 1]) * fit(frame, [360, 430], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        right: 230,
        top: 182,
        width: 520,
        height: 620,
        opacity,
        zIndex: 9,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 30,
          width: 200,
          height: 200,
          borderRadius: 999,
          background: "rgba(252,165,165,.18)",
          border: "1px solid rgba(252,165,165,.32)",
          boxShadow: "0 0 80px rgba(252,165,165,.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 260,
          width: 344,
          height: 260,
          borderRadius: "46% 46% 28px 28px",
          background: "rgba(252,165,165,.14)",
          border: "1px solid rgba(252,165,165,.28)",
        }}
      />
      {exposed.map((word, i) => (
        <div
          key={word}
          style={{
            position: "absolute",
            left: 18 + (i % 2) * 300,
            top: 74 + i * 82,
            color: c.danger,
            fontSize: 22,
            fontWeight: 820,
            opacity: 0.58,
            transform: `translateX(${Math.sin(frame / 28 + i) * 18}px)`,
          }}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

const IdentityShield: React.FC = () => {
  const frame = useCurrentFrame();
  const show = fit(frame, [360, 430], [0, 1]) * fit(frame, [548, 600], [1, 0]);
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 368, fps, config: { damping: 16, stiffness: 80 } });

  return (
    <div
      style={{
        position: "absolute",
        right: 130,
        top: 120,
        width: 760,
        height: 760,
        opacity: show,
        transform: `scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 80,
          borderRadius: 48,
          background: "rgba(20,25,39,.74)",
          border: "1px solid rgba(96,165,250,.22)",
          boxShadow: "0 0 110px rgba(59,130,246,.18)",
        }}
      />
      <Img
        src={staticFile("hermnet-mark.png")}
        style={{
          position: "absolute",
          left: 230,
          top: 120,
          width: 300,
          height: 300,
          objectFit: "contain",
          filter: "drop-shadow(0 0 36px rgba(96,165,250,.28))",
        }}
      />
      {protectedItems.map((item, i) => {
        const angle = (Math.PI * 2 * i) / protectedItems.length - Math.PI / 2;
        const x = 380 + Math.cos(angle) * 285;
        const y = 410 + Math.sin(angle) * 235;
        return (
          <div
            key={item}
            style={{
              position: "absolute",
              left: x - 88,
              top: y - 28,
              width: 176,
              height: 56,
              borderRadius: 18,
              background: c.elevated,
              color: c.text,
              display: "grid",
              placeItems: "center",
              fontSize: 20,
              fontWeight: 850,
              boxShadow: "0 18px 40px rgba(0,0,0,.2)",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

const EncryptedFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const show = fit(frame, [548, 612], [0, 1]) * fit(frame, [725, 760], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        right: 110,
        top: 150,
        width: 820,
        height: 640,
        opacity: show,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 210,
          width: 200,
          height: 180,
          borderRadius: 36,
          background: c.surface,
          border: "1px solid rgba(255,255,255,.1)",
          display: "grid",
          placeItems: "center",
          color: c.text,
          fontSize: 28,
          fontWeight: 900,
          zIndex: 3,
        }}
      >
        móvil
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 210,
          width: 230,
          height: 180,
          borderRadius: 36,
          background: c.surface,
          border: "1px solid rgba(255,255,255,.1)",
          display: "grid",
          placeItems: "center",
          color: c.text,
          fontSize: 28,
          fontWeight: 900,
          zIndex: 3,
        }}
      >
        servidor
      </div>
      <div
        style={{
          position: "absolute",
          left: 230,
          right: 280,
          top: 290,
          height: 4,
          borderRadius: 999,
          background: "rgba(96,165,250,.26)",
        }}
      />
      {Array.from({ length: 5 }).map((_, i) => {
        const travel = (frame * 8 + i * 120) % 430;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 250 + travel,
              top: 258,
              width: 74,
              height: 68,
              borderRadius: 18,
              background: c.accent,
              color: c.text,
              display: "grid",
              placeItems: "center",
              fontSize: 20,
              fontWeight: 900,
              boxShadow: "0 0 28px rgba(59,130,246,.42)",
              zIndex: 1,
            }}
          >
            ███
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 290,
          right: 290,
          top: 410,
          height: 86,
          borderRadius: 24,
          background: "rgba(22,163,74,.12)",
          border: "1px solid rgba(22,163,74,.28)",
          color: c.success,
          display: "grid",
          placeItems: "center",
          fontSize: 25,
          fontWeight: 880,
        }}
      >
        contenido ilegible para el servidor
      </div>
    </div>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 742, fps, config: { damping: 17, stiffness: 86 } });

  return (
    <AbsoluteFill
      style={{
        zIndex: 30,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        opacity: fit(frame, [725, 760], [0, 1]),
        transform: `scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      <AppLogo large />
      <div
        style={{
          color: c.text,
          fontSize: 66,
          lineHeight: 1.04,
          fontWeight: 950,
          maxWidth: 1180,
          marginTop: 44,
        }}
      >
        No tienes que regalar tu vida para estar conectado.
      </div>
      <div
        style={{
          color: c.accentLight,
          fontSize: 34,
          lineHeight: 1.2,
          fontWeight: 800,
          marginTop: 24,
        }}
      >
        Hermnet. Mensajería privada con identidad local y cifrado extremo a extremo.
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const dangerPulse = fit(frame, [170, 240], [0, 1]) * fit(frame, [330, 395], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 70% 35%, ${c.elevated} 0%, ${c.bg} 46%, #070b14 100%)`,
        overflow: "hidden",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <BackgroundPattern />
      <DataCards />
      <ProfileSilhouette />
      <IdentityShield />
      <EncryptedFlow />
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 72,
          zIndex: 25,
          opacity: fit(frame, [0, 24], [0, 1]) * fit(frame, [710, 740], [1, 0]),
        }}
      >
        <AppLogo />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(252,165,165,${dangerPulse * 0.12})`,
          zIndex: 4,
        }}
      />
      {scenes.map((scene) => (
        <SceneText key={scene.start} {...scene} />
      ))}
      <Final />
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 160px rgba(0,0,0,.58)",
          zIndex: 40,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
