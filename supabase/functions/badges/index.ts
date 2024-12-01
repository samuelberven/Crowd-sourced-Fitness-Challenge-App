import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables

// const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace '*' with frontend URL once deployed
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

// Helper function for making requests to Supabase API
const supabaseFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

// Utility function -> Handles responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

// Handles CORS preflight requests (OPTIONS)
const handleOptions = () => {
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders, // Return the CORS headers
  });
};

// Handles the main request
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();

  // Handle OPTIONS request for CORS pre-flight
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS preflight");
    return handleOptions(); // Respond to preflight OPTIONS request
  }

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id))
          ? await getBadge(id)
          : await getBadges();

      case "POST":
        return await createBadge(await req.json());

      case "PATCH":
        return await updateBadge(id, await req.json());

      case "DELETE":
        return await deleteBadge(id);

      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// GET - Get all badges
const getBadges = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/badges`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

// GET by id - Get a specific badge by ID
const getBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

// POST - Create a new badge
const createBadge = async (body: { name: string; description: string }) => {
  if (!body.name || !body.description) {
    return new Response(
      JSON.stringify({ error: "You must enter a badge name and description" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/badges`, {
    method: "POST",
    body: JSON.stringify({ name: body.name, description: body.description }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  const jsonData = dataText ? JSON.parse(dataText) : {};
  return new Response(JSON.stringify(jsonData), {
    status: 201,
    headers: corsHeaders,
  });
};

// PATCH - Update an existing badge
const updateBadge = async (
  id: string | undefined,
  body: { name: string; description: string }
) => {
  if (!body.name && !body.description) {
    return new Response(
      JSON.stringify({
        error: "You must provide at least a name or description to update",
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name: body.name, description: body.description }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  const jsonData = dataText ? JSON.parse(dataText) : {};
  return new Response(JSON.stringify(jsonData), {
    status: 200,
    headers: corsHeaders,
  });
};

// DELETE - Delete a badge
const deleteBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Start the server (Supabase Edge function)
Deno.serve(handleRequest);
