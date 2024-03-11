import { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";

export const metadata: Metadata = {
  title: "SCRRAP-LAB",
  description: "TALM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <PublicEnvScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
