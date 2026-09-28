async function inspectBodyHTML() {
  const res = await fetch("http://localhost:8080/dashboard");
  const html = await res.text();
  const bodyIdx = html.indexOf("<body");
  console.log("=== SSR BODY CONTENT ===");
  console.log(html.slice(bodyIdx));
}
inspectBodyHTML();
