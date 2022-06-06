CREATE TABLE "claim" (
	"id" serial PRIMARY KEY,
	"user"	VARCHAR(255) NOT NULL,
	"started_at" timestamptz NOT NULL,
	"ended_at" timestamptz NULL
);

CREATE TABLE "language" (
	"id" serial PRIMARY KEY,
	"lang"	VARCHAR(255) NOT NULL,
	"friendly_name" VARCHAR(255) NOT NULL,
	"setting" json NOT NULL,
	"configuration" json NOT NULL,
	"template" json NOT NULL,
	"updated_on" timestamptz NOT NULL,
	"updated_by" VARCHAR(255) NOT NULL
);