export async function sendSms(to: string, message: string) {
  const { AT_USERNAME = "sandbox", AT_API_KEY } = process.env;
  if (!AT_API_KEY) return console.log(`[SMS demo] ${to}: ${message}`);
  const host = AT_USERNAME === "sandbox" ? "api.sandbox.africastalking.com" : "api.africastalking.com";
  await fetch(`https://${host}/version1/messaging`, { method: "POST",
    headers: { apiKey: AT_API_KEY, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ username: AT_USERNAME, to, message }) });
}
