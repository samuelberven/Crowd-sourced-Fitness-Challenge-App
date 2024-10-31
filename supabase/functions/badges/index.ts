import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// Fetches data
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

// Handles requests
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();

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
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Handlers for different HTTP methods
// GET
const getBadges = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/badges`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET by id
const getBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST
const createBadge = async (body: { name: string; description: string }) => {
  if (!body.name || !body.description) {
    return new Response(
      JSON.stringify({ error: "You must enter a badge name and description" }),
      { status: 400 }
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
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Case: response is empty (but operation is successful)
    return new Response(
      JSON.stringify({ message: "Badge created successfully." }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }
};

// PATCH
const updateBadge = async (
  id: string | undefined,
  body: { name: string; description: string }
) => {
  if (!body.name && !body.description) {
    return new Response(
      JSON.stringify({
        error: "You must provide at least a name or description to update",
      }),
      { status: 400 }
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
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ message: "Badge updated successfully." }),
      { status: 200 }
    );
  }
};

// DELETE
const deleteBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204 });
};

// Start the server
Deno.serve(handleRequest);

// REMOVE THIS BLOCK WHEN DEPLOYING
// // Start the server
// const port = 8000; // or any port of your choice
// Deno.serve({ port }, handler);
// console.log(`Server running on http://localhost:${port}`);
