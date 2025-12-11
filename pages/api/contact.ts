// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Data =
  | { success: true }
  | { success: false; error: string };

const DIRECTUS_URL =
  process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "";
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
    console.error("Missing Directus configuration");
    return res
      .status(500)
      .json({ success: false, error: "Server misconfiguration" });
  }

  const { lang, name, email, company, message, consent } = req.body || {};

  // Basic validation
  if (!name || !email || !message || consent !== true) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields or consent" });
  }

  try {
    const payload = {
      language_code: lang || "en",
      name,
      email,
      company: company || null,
      message,
      consent_given: true,
    };

    const response = await fetch(
      `${DIRECTUS_URL.replace(/\/$/, "")}/items/contact_requests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Directus error:", response.status, text);
      return res
        .status(500)
        .json({ success: false, error: "Failed to save contact request" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Unexpected server error" });
  }
}
