DROP TABLE IF EXISTS public.users;
CREATE TABLE IF NOT EXISTS public.users (
	id serial NOT NULL,
	"username" varchar(100) NOT NULL,
	email varchar(30) NOT NULL UNIQUE,
	"role" varchar(10) NOT NULL,
	"password" varchar(100) NOT NULL,
	organization int4 NOT NULL references public.users(id),
	"address" varchar(50) NULL,
	created_at timestamp DEFAULT now(),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
ALTER SEQUENCE users_id_seq RESTART WITH 100;

DROP TABLE IF EXISTS public.keytokens;
CREATE TABLE IF NOT EXISTS public.keytokens (
    id serial NOT NULL,
    refresh_token varchar(100) NOT NULL,
    refresh_tokens_used varchar(100)[] DEFAULT array[]::varchar(100)[],
    private_key varchar(255) NOT NULL,
    public_key varchar(255) NOT NULL,
    CONSTRAINT keytoken_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.balances;
CREATE TABLE IF NOT EXISTS public.balances (
	user_id int4 NOT NULL references public.users(id),
	reward_token int4 NULL,
	reputation_token int4 NULL,
	penalty_token int4 NULL,
	CONSTRAINT balances_pkey PRIMARY KEY (user_id)
);

DROP TABLE IF EXISTS public.reasons;
CREATE TABLE IF NOT EXISTS  public.reasons(
	id serial NOT NULL, 
	title varchar(200),
    "description" text,
	"value" int
);

DROP TABLE IF EXISTS public.swags;
CREATE TABLE IF NOT EXISTS public.swags(
	id serial NOT NULL, 
	"name" varchar(200),
    "description" text,
	"value" int, 
	CONSTRAINT swags_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS public.requests;
CREATE TABLE IF NOT EXISTS public.requests(
	id serial NOT NULL, 
	member_id int NOT NULL references public.users(id),
	amount int NOT NULL,
	completed_at timestamp,
	"type" varchar(50),
	swag_id int NULL references public.swags(id),
	receiver_id int NULL references public.users(id),
	is_completed BOOLEAN,
	created_at timestamp DEFAULT now(),
	CONSTRAINT request_pkey PRIMARY KEY (id)
);
