import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type RequestBody = {
  accessToken?: string;
  avatarType?: "small" | "normal" | "large";
};

const textEncoder = new TextEncoder();

const toHex = (bytes: ArrayBuffer) =>
  Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

const createAppSecretProof = async (accessToken: string, appSecret: string) => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(accessToken));
  return toHex(signature);
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { accessToken, avatarType = "large" } = (await req.json()) as RequestBody;
    const appSecret = Deno.env.get("ZALO_APP_SECRET");
    const appId = Deno.env.get("ZALO_APP_ID");

    if (!accessToken) {
      return json({ error: "Missing accessToken" }, 400);
    }
    if (!appSecret || !appId) {
      return json({ error: "Missing ZALO_APP_SECRET or ZALO_APP_ID" }, 500);
    }

    const appsecretProof = await createAppSecretProof(accessToken, appSecret);
    const fields = [
      "id",
      "name",
      "user_id_by_oa",
      "is_sensitive",
      `picture.type(${avatarType})`,
    ].join(",");
    const url = new URL("https://graph.zalo.me/v2.0/me");
    url.searchParams.set("fields", fields);
    url.searchParams.set("miniapp_id", appId);
    url.searchParams.set("access_token", accessToken);
    url.searchParams.set("appsecret_proof", appsecretProof);

    const response = await fetch(url, {
      headers: {
        access_token: accessToken,
      },
    });
    const profile = await response.json();

    if (!response.ok || (profile.error !== undefined && profile.error !== 0)) {
      return json(profile, response.ok ? 400 : response.status);
    }

    return json({
      userInfo: {
        id: profile.id,
        name: profile.name ?? "",
        avatar: profile.picture?.data?.url ?? "",
        idByOA: profile.user_id_by_oa,
        followedOA: Boolean(profile.is_follower),
        isSensitive: profile.is_sensitive,
      },
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
