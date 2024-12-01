import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate env variables
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
  const headers = {
    ...options.headers,
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });
  return response;
};

// Utility function handling responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(errorData);
  }
  return await response.json();
};

// Handle OPTIONS requests for CORS pre-flight
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Main request handler
const handleRequest = async (req: Request) => {
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS preflight");
    return handleOptions(); // Respond to preflight OPTIONS request
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id)) ? await getTag(id) : await getTags();

      case "POST":
        const body = await req.json();
        return await createTag(body);

      case "PATCH":
        const patchBody = await req.json();
        return await updateTag(id, patchBody);

      case "DELETE":
        return await deleteTag(id);

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

// Handlers for different HTTP methods
// GET
const getTags = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/tags`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

// GET by id
const getTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

// POST
const createTag = async (body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must enter a tag name" }),
      { status: 400, headers: corsHeaders }
    );
  }

  console.log("Request Body:", JSON.stringify(body));

  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/tags`, {
    method: "POST",
    body: JSON.stringify({ name: body.name }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 201,
      headers: corsHeaders,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Tag created successfully." }),
      { status: 201, headers: corsHeaders }
    );
  }
};

// PATCH
const updateTag = async (id: string | undefined, body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must provide a name to update" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name: body.name }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: corsHeaders,
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Tag updated successfully." }),
      { status: 200, headers: corsHeaders }
    );
  }
};

// DELETE
const deleteTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Start the server
Deno.serve(handleRequest);
