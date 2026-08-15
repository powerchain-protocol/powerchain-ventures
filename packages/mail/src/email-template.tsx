import type { ReactNode } from "react";

export function EmailTemplate({
  eyebrow,
  title,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <html>
      <body style={{
        margin: 0,
        background: "#f5f7f8",
        color: "#101820",
        fontFamily: "Inter, Arial, sans-serif",
      }}>
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ padding: "32px 16px" }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    maxWidth: 620,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 18,
                    overflow: "hidden",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ padding: "32px 34px 18px" }}>
                        <div style={{
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#52606d",
                        }}>
                          {eyebrow}
                        </div>
                        <h1 style={{
                          margin: "10px 0 0",
                          fontSize: 30,
                          lineHeight: 1.12,
                          letterSpacing: "-0.03em",
                        }}>
                          {title}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: "0 34px 34px",
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "#46515c",
                      }}>
                        {children}
                      </td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: "20px 34px",
                        borderTop: "1px solid #e5e7eb",
                        background: "#fafbfc",
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "#7b8794",
                      }}>
                        {footer ?? "PowerChain Launchpad™ · Secure Solana token-sale infrastructure"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        marginTop: 18,
        padding: "12px 18px",
        borderRadius: 10,
        background: "#111827",
        color: "#ffffff",
        textDecoration: "none",
        fontWeight: 700,
      }}
    >
      {children}
    </a>
  );
}
