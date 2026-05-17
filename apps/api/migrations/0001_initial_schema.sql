-- effect-db:up
create schema if not exists "public";
create type "public"."external_connection_provider" as enum ('plaid');
create table "public"."account_holders" ("id" uuid not null, primary key ("id"));
create table "public"."external_connections" ("id" uuid not null, "accountHolderId" uuid not null, "externalId" text not null, "provider" external_connection_provider not null, primary key ("id"), foreign key ("accountHolderId") references "public"."account_holders" ("id"), unique ("externalId", "provider"));
create table "public"."external_entity_references" ("localEntityId" text not null, "localEntityType" text not null, "externalEntityId" text not null, "externalConnectionId" uuid not null, primary key ("localEntityId", "localEntityType", "externalEntityId"), foreign key ("externalConnectionId") references "public"."external_connections" ("id"));
create table "public"."syncronization-cursors" ("id" uuid not null, "externalConnectionId" uuid not null, "value" text not null, "lastSyncronizationAt" timestamp not null, primary key ("id"), foreign key ("externalConnectionId") references "public"."external_connections" ("id"));
-- effect-db:down
drop table "public"."syncronization-cursors";
drop table "public"."external_entity_references";
drop table "public"."external_connections";
drop table "public"."account_holders";
drop type "public"."external_connection_provider";
drop schema if exists "public" cascade;
