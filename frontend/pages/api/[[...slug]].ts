import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, string>>
) {
  // get the incoming request URL, e.g. 'posts?limit=10&offset=0&order=id.asc'
  const requestUrl = req.url?.substring("/api/".length);
  // build the CRUD request based on the incoming request
  const url = `${process.env.SUPABASE_URL}/rest/v1/${requestUrl}`;
  console.log(url);
  const options = {
    method: req.method,
    headers: {
      prefer: req.headers["prefer"] ?? "",
      accept: req.headers["accept"] ?? "application/json",
      ["content-type"]: req.headers["content-type"] ?? "application/json",
      // supabase authentication
      apiKey: process.env.SUPABASE_SERVICE_ROLE,
    },
    body: req.body ? JSON.stringify(req.body) : undefined,
  };

  // call the CRUD API
  const response = await fetch(url, options as any);
  // send the response back to the client
  res.setHeader("Content-Range", response.headers.get("content-range") ?? "");
  res.end(await response.text());
}
