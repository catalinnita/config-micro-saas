
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "plpgsql_check" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";

CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

ALTER TYPE "public"."pricing_type" OWNER TO "postgres";

CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid'
);

ALTER TYPE "public"."subscription_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_public_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$-- declare

begin
  -- select teams_uuid into auth_teams_uuid
  --   from teams_users 
  --     where user_uuid = auth.uid();

  -- insert into teams_users
  --   (user_uuid, teams_uuid, role) values
  --   (new.id, auth_teams_uuid, 'member');

end;$$;

ALTER FUNCTION "public"."handle_new_public_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$  begin
    insert into public.users 
      (id, full_name, avatar_url) values 
        (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');

    return new;
  end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."teams_uuid_by_user_id"("user_uuid" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$declare 
 r_teams_uuid uuid;
 
begin
  select teams_users.teams_uuid into r_teams_uuid
  from teams_users
  where (teams_users.user_uuid = teams_uuid_by_user_id.user_uuid);

  return r_teams_uuid;
end;$$;

ALTER FUNCTION "public"."teams_uuid_by_user_id"("user_uuid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_exists_in_team"("auth_user_uuid" "uuid", "user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$declare 
  selected_teams_uuid uuid;
  user_id uuid;
begin
  selected_teams_uuid = teams_uuid_by_user_id(user_exists_in_team.auth_user_uuid);

  select teams_users.user_uuid into user_id
  from teams_users
  where (teams_users.teams_uuid = selected_teams_uuid)
  and (teams_users.user_uuid = user_exists_in_team.user_uuid);

  return user_id = user_exists_in_team.user_uuid;
end;$$;

ALTER FUNCTION "public"."user_exists_in_team"("auth_user_uuid" "uuid", "user_uuid" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_teams_uuid"("user_uuid" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$declare 
 teams_uuid uuid;
begin
  select teams.uuid into teams_uuid
  from teams, teams_users
  where (teams.uuid = teams_users.teams_uuid)
    and (teams_users.user_uuid = user_teams_uuid.user_uuid);

  return teams_uuid;
end;$$;

ALTER FUNCTION "public"."user_teams_uuid"("user_uuid" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" NOT NULL,
    "stripe_customer_id" "text",
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "product_id" "text",
    "active" boolean,
    "description" "text",
    "unit_amount" bigint,
    "currency" "text",
    "type" "public"."pricing_type",
    "interval" "public"."pricing_plan_interval",
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" "jsonb",
    CONSTRAINT "prices_currency_check" CHECK (("char_length"("currency") = 3))
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean,
    "name" "text",
    "description" "text",
    "image" "text",
    "metadata" "jsonb"
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."projects" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "description" "text",
    "color" character varying,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "status" character varying DEFAULT 'draft'::character varying,
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "teams_uuid" "uuid",
    CONSTRAINT "projects_created_at_check" CHECK (("created_at" <> NULL::timestamp with time zone))
);

ALTER TABLE "public"."projects" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."refresh_tokens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" character varying,
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."refresh_tokens" OWNER TO "postgres";

ALTER TABLE "public"."refresh_tokens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."sections" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying,
    "description" "text",
    "status" character varying DEFAULT 'draft'::character varying,
    "projects_uuid" "uuid",
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."sections" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."settings" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "name" character varying,
    "type" character varying DEFAULT 'string'::character varying,
    "value" "text",
    "status" character varying DEFAULT 'draft'::character varying,
    "sections_uuid" "uuid",
    "projects_uuid" "uuid",
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."settings" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."subscription_status",
    "metadata" "jsonb",
    "price_id" "text",
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "cancel_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "canceled_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."teams" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying,
    "description" "text"
);

ALTER TABLE "public"."teams" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."teams_users" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "teams_uuid" "uuid",
    "user_uuid" "uuid",
    "role" character varying,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."teams_users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."tokens" (
    "uuid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" character varying,
    "teams_uuid" "uuid"
);

ALTER TABLE "public"."tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "billing_address" "jsonb",
    "payment_method" "jsonb"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "projects_categories_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "projects_settings_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."teams_users"
    ADD CONSTRAINT "teams_users_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("uuid");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_key" UNIQUE ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "new_public_user" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_public_user"();

ALTER TABLE "public"."users" DISABLE TRIGGER "new_public_user";

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_projects_uuid_fkey" FOREIGN KEY ("projects_uuid") REFERENCES "public"."projects"("uuid");

ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_projects_uuid_fkey" FOREIGN KEY ("projects_uuid") REFERENCES "public"."projects"("uuid");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_sections_uuid_fkey" FOREIGN KEY ("sections_uuid") REFERENCES "public"."sections"("uuid");

ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

ALTER TABLE ONLY "public"."teams_users"
    ADD CONSTRAINT "teams_users_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."teams_users"
    ADD CONSTRAINT "teams_users_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_teams_uuid_fkey" FOREIGN KEY ("teams_uuid") REFERENCES "public"."teams"("uuid");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");

CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

CREATE POLICY "Can only view own subs data." ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own user data." ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));

CREATE POLICY "Enable delete based on teams_uuid" ON "public"."projects" FOR DELETE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable delete based on teams_uuid" ON "public"."sections" FOR DELETE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable delete based on teams_uuid" ON "public"."settings" FOR DELETE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable insert based on teams_uuid" ON "public"."projects" FOR INSERT WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable insert based on teams_uuid" ON "public"."sections" FOR INSERT WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable insert based on teams_uuid" ON "public"."settings" FOR INSERT WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable read access based on teams_uuid" ON "public"."projects" FOR SELECT USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable read access based on teams_uuid" ON "public"."sections" FOR SELECT USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable read access based on teams_uuid" ON "public"."settings" FOR SELECT USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT TO "authenticated" USING ("public"."user_exists_in_team"("auth"."uid"(), "id"));

CREATE POLICY "Enable update for users based on teams_uuid" ON "public"."projects" FOR UPDATE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"()))) WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable update for users based on teams_uuid" ON "public"."sections" FOR UPDATE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"()))) WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Enable update for users based on teams_uuid" ON "public"."settings" FOR UPDATE USING (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"()))) WITH CHECK (("teams_uuid" = "public"."user_teams_uuid"("auth"."uid"())));

CREATE POLICY "Only allowed to manage own team based on teams_uuid" ON "public"."teams" USING (("uuid" = "public"."teams_uuid_by_user_id"("auth"."uid"()))) WITH CHECK (("uuid" = "public"."teams_uuid_by_user_id"("auth"."uid"())));

CREATE POLICY "can delete their own entries" ON "public"."users" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "id"));

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delete same team users" ON "public"."teams_users" FOR DELETE USING (("teams_uuid" = "public"."teams_uuid_by_user_id"("auth"."uid"())));

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sections" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select users from same team based on teams_uuid" ON "public"."teams_users" FOR SELECT USING (true);

ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams_users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "update same team users list" ON "public"."teams_users" FOR UPDATE USING (("teams_uuid" = "public"."teams_uuid_by_user_id"("auth"."uid"()))) WITH CHECK (("teams_uuid" = "public"."teams_uuid_by_user_id"("auth"."uid"())));

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "extensions"."__plpgsql_show_dependency_tb"("funcoid" "regprocedure", "relid" "regclass") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."__plpgsql_show_dependency_tb"("name" "text", "relid" "regclass") TO "postgres" WITH GRANT OPTION;

REVOKE ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."armor"("bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."crypt"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."dearmor"("text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."digest"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."digest"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."gen_random_uuid"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."gen_salt"("text", integer) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "temp_blk_read_time" double precision, OUT "temp_blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric, OUT "jit_functions" bigint, OUT "jit_generation_time" double precision, OUT "jit_inlining_count" bigint, OUT "jit_inlining_time" double precision, OUT "jit_optimization_count" bigint, OUT "jit_optimization_time" double precision, OUT "jit_emission_count" bigint, OUT "jit_emission_time" double precision) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "extensions"."plpgsql_check_function"("funcoid" "regprocedure", "relid" "regclass", "format" "text", "fatal_errors" boolean, "other_warnings" boolean, "performance_warnings" boolean, "extra_warnings" boolean, "security_warnings" boolean, "oldtable" "name", "newtable" "name", "anyelememttype" "regtype", "anyenumtype" "regtype", "anyrangetype" "regtype", "anycompatibletype" "regtype", "anycompatiblerangetype" "regtype", "without_warnings" boolean, "all_warnings" boolean, "use_incomment_options" boolean, "incomment_options_usage_warning" boolean) TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_check_function"("name" "text", "relid" "regclass", "format" "text", "fatal_errors" boolean, "other_warnings" boolean, "performance_warnings" boolean, "extra_warnings" boolean, "security_warnings" boolean, "oldtable" "name", "newtable" "name", "anyelememttype" "regtype", "anyenumtype" "regtype", "anyrangetype" "regtype", "anycompatibletype" "regtype", "anycompatiblerangetype" "regtype", "without_warnings" boolean, "all_warnings" boolean, "use_incomment_options" boolean, "incomment_options_usage_warning" boolean) TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_check_function_tb"("funcoid" "regprocedure", "relid" "regclass", "fatal_errors" boolean, "other_warnings" boolean, "performance_warnings" boolean, "extra_warnings" boolean, "security_warnings" boolean, "oldtable" "name", "newtable" "name", "anyelememttype" "regtype", "anyenumtype" "regtype", "anyrangetype" "regtype", "anycompatibletype" "regtype", "anycompatiblerangetype" "regtype", "without_warnings" boolean, "all_warnings" boolean, "use_incomment_options" boolean, "incomment_options_usage_warning" boolean) TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_check_function_tb"("name" "text", "relid" "regclass", "fatal_errors" boolean, "other_warnings" boolean, "performance_warnings" boolean, "extra_warnings" boolean, "security_warnings" boolean, "oldtable" "name", "newtable" "name", "anyelememttype" "regtype", "anyenumtype" "regtype", "anyrangetype" "regtype", "anycompatibletype" "regtype", "anycompatiblerangetype" "regtype", "without_warnings" boolean, "all_warnings" boolean, "use_incomment_options" boolean, "incomment_options_usage_warning" boolean) TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_check_pragma"(VARIADIC "name" "text"[]) TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_coverage_branches"("funcoid" "regprocedure") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_coverage_branches"("name" "text") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_coverage_statements"("funcoid" "regprocedure") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_coverage_statements"("name" "text") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_function_statements_tb"("funcoid" "regprocedure") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_function_statements_tb"("name" "text") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_function_tb"("funcoid" "regprocedure") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_function_tb"("name" "text") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_functions_all"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_install_fake_queryid_hook"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_remove_fake_queryid_hook"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_reset"("funcoid" "regprocedure") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_profiler_reset_all"() TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_show_dependency_tb"("funcoid" "regprocedure", "relid" "regclass") TO "postgres" WITH GRANT OPTION;

GRANT ALL ON FUNCTION "extensions"."plpgsql_show_dependency_tb"("fnname" "text", "relid" "regclass") TO "postgres" WITH GRANT OPTION;

REVOKE ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."url_decode"("data" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v4"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_nil"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_dns"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_oid"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_url"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."uuid_ns_x500"() FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";

REVOKE ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") FROM "postgres";
GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "postgres" WITH GRANT OPTION;
GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";

GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "graphql_public"."graphql"("operationName" "text", "query" "text", "variables" "jsonb", "extensions" "jsonb") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_decrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_encrypt"("message" "bytea", "additional" "bytea", "key_uuid" "uuid", "nonce" "bytea") TO "service_role";

GRANT ALL ON FUNCTION "pgsodium"."crypto_aead_det_keygen"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_public_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_public_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_public_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."teams_uuid_by_user_id"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."teams_uuid_by_user_id"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."teams_uuid_by_user_id"("user_uuid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."user_exists_in_team"("auth_user_uuid" "uuid", "user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_exists_in_team"("auth_user_uuid" "uuid", "user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_exists_in_team"("auth_user_uuid" "uuid", "user_uuid" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."user_teams_uuid"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_teams_uuid"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_teams_uuid"("user_uuid" "uuid") TO "service_role";

REVOKE ALL ON TABLE "extensions"."pg_stat_statements" FROM "postgres";
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";

REVOKE ALL ON TABLE "extensions"."pg_stat_statements_info" FROM "postgres";
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "postgres" WITH GRANT OPTION;
GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";

GRANT ALL ON TABLE "pgsodium"."decrypted_key" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "pgsodium"."masking_rule" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "pgsodium"."mask_columns" TO "pgsodium_keyholder";

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";

GRANT ALL ON TABLE "public"."refresh_tokens" TO "anon";
GRANT ALL ON TABLE "public"."refresh_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."refresh_tokens" TO "service_role";

GRANT ALL ON SEQUENCE "public"."refresh_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."refresh_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."refresh_tokens_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";

GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON TABLE "public"."teams_users" TO "anon";
GRANT ALL ON TABLE "public"."teams_users" TO "authenticated";
GRANT ALL ON TABLE "public"."teams_users" TO "service_role";

GRANT ALL ON TABLE "public"."tokens" TO "anon";
GRANT ALL ON TABLE "public"."tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."tokens" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
