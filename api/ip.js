import fetch from "node-fetch";

export default async function handler(req, res) {
  const {
    query: { ip },
  } = req; // Ambil IP dari query parameter

  const targetUrl = ip
    ? `http://ip-api.com/json/${ip}` // Jika ada parameter IP
    : `http://ip-api.com/json/`; // Jika tidak, fetch public IP

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    res.status(200).json(data); // Kirim response ke client
  } catch (error) {
    res.status(500).json({ error: "Error fetching IP details" });
  }
}
