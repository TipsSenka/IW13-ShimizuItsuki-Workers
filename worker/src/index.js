const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "Content-Type",
};

const courses = [
  { id: "cloudflare-basics", title: "Cloudflare Workers入門", level: "beginner" },
  { id: "api-design", title: "API設計と運用", level: "intermediate" },
  { id: "pages-deploy", title: "Pagesデプロイ実践", level: "beginner" },
];

const events = [
  { id: "workers-workshop", title: "Workersハンズオン", date: "2026-09-19", place: "オンライン" },
  { id: "api-meetup", title: "API開発ミートアップ", date: "2026-10-03", place: "東京" },
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json; charset=UTF-8" },
  });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "GET") return json({ error: "Method Not Allowed" }, 405);

    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname === "/api/") {
      return json({ name: "senka-api", status: "ok", endpoints: ["course", "hello", "fortune", "events"] });
    }
    if (url.pathname === "/api/course") return json({ courses });
    if (url.pathname === "/api/events") return json({ events });
    if (url.pathname === "/api/hello") {
      const value = url.searchParams.get("name")?.trim();
      if (!value) return json({ error: "name is required" }, 400);
      return json({ message: `こんにちは、${value}さん！`, name: value });
    }
    if (url.pathname === "/api/fortune") {
      const fortunes = ["大吉", "中吉", "小吉", "吉"];
      const fortune = fortunes[new Date().getUTCDate() % fortunes.length];
      return json({ fortune, message: "小さな一歩が流れを変える日です。" });
    }
    return json({ error: "Not Found" }, 404);
  },
};