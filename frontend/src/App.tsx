import { useEffect, useState } from "react";
import { getGoogleLoginUrl, fetchEmails } from "./api";

function App() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmails() {
      try {
        const data = await fetchEmails();
        setEmails(data); // backend returns {emails: [...]}, already extracted in api.ts
      } catch (err) {
        console.error("Failed to load emails:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEmails();
  }, []);

  const handleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading emails...</p>;

  if (emails.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No emails found 😕</h2>
        <button onClick={handleLogin}>Try logging in again</button>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>📥 InboxGenie</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
      <ul>
        {emails.map((email, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <strong>From:</strong> {email.from} <br />
            <strong>Subject:</strong> {email.subject} <br />
            <strong>Date:</strong> {email.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
