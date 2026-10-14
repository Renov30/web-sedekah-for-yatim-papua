import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#0d2218",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#dcf2e4",
          fontWeight: 800,
          letterSpacing: "-0.5px",
          borderRadius: 4,
          border: "1px solid #267f4c",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}

