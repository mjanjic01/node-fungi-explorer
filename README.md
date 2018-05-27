### Requirements
- node 8+
- npm 5+ or yarn
- redis 4+
- postgres 9.4.1

### Setup
#### Database
Create `ormconfig.json` in project root with database connection parameters:
```
{
  "type": "dbType",
  "host": "hostname",
  "port": port,
  "username": "username",
  "password": "password",
  "database": "databaseName",
  "synchronize": false,
  "logging": false,
  "entities": [
    "src/dataAccess/mapping/**/*.ts"
  ],
  "migrations": [
    "src/dataAccess/migrations/**/*.ts"
  ],
  "cli": {
    "migrationsDir": "src/dataAccess/migrations"
  }
}

```

Run:
```
yarn typeorm schema:sync

// for npm:
npm run typeorm schema:sync
````

#### Server
Make sure your database and redis are running.

I using yarn:
```
yarn
yarn dev // for development
```
I using npm:
```
npm install
npm run dev // for development
```

### Additional database settings (PostgreSQL)

Create tsvector function, trigger and index:
```
CREATE FUNCTION fungi_weighted_tsv_trigger() RETURNS trigger
  LANGUAGE plpgsql
  AS $$

  DECLARE
    species varchar := (SELECT name FROM "public"."Species" WHERE id = new."speciesId");
    genus varchar := (SELECT "Genus"."name" FROM "public"."Genus" JOIN "public"."Species" ON "public"."Genus".id = "public"."Species"."genusId" WHERE "public"."Species".id = new."speciesId");

  BEGIN
    new."weightedTsv" :=
      setweight(to_tsvector(coalesce(new.name,'')), 'A') ||
      setweight(to_tsvector(coalesce(new.variant,'')), 'B') ||
      setweight(to_tsvector(coalesce(species,'')), 'C') ||
      setweight(to_tsvector(coalesce(genus,'')), 'D');

    return new;

  END

$$;

CREATE TRIGGER upd_tsvector BEFORE INSERT OR UPDATE
  ON "public"."Fungi"
  FOR EACH ROW EXECUTE PROCEDURE fungi_weighted_tsv_trigger();

CREATE INDEX weighted_tsv_idx ON "public"."Fungi" USING GIST("weightedTsv");
```

Drop tsvector function and trigger:
```
DROP TRIGGER upd_tsvector ON "public"."Fungi";
DROP FUNCTION fungi_weighted_tsv_trigger();
DROP INDEX weighted_tsv_idx;
```
