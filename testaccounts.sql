--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6
-- Dumped by pg_dump version 16.6

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: budget; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.budget (
    id uuid NOT NULL,
    financial_planner_id_id uuid,
    event_id uuid NOT NULL,
    organization_id uuid,
    per_user_total integer NOT NULL,
    last_modified timestamp(0) without time zone NOT NULL,
    created_date timestamp(0) without time zone NOT NULL
);


ALTER TABLE public.budget OWNER TO app;

--
-- Name: COLUMN budget.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.budget.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN budget.financial_planner_id_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.budget.financial_planner_id_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN budget.event_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.budget.event_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN budget.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.budget.organization_id IS '(DC2Type:uuid)';


--
-- Name: change_logging; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.change_logging (
    id uuid NOT NULL,
    created_date timestamp(0) without time zone NOT NULL,
    operation_type character varying(255) NOT NULL,
    modified_by character varying(255) NOT NULL,
    before_change json NOT NULL,
    after_change json NOT NULL,
    changes json NOT NULL
);


ALTER TABLE public.change_logging OWNER TO app;

--
-- Name: COLUMN change_logging.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.change_logging.id IS '(DC2Type:uuid)';


--
-- Name: event; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.event (
    id uuid NOT NULL,
    organization_id uuid,
    event_title character varying(55) NOT NULL,
    start_date_time timestamp(0) without time zone NOT NULL,
    end_date_time timestamp(0) without time zone NOT NULL,
    start_flight_booking timestamp(0) without time zone NOT NULL,
    end_flight_booking timestamp(0) without time zone NOT NULL,
    location character varying(55) NOT NULL,
    max_attendees integer NOT NULL,
    last_modified timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    created_date timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    invite_code character varying(255) DEFAULT NULL::character varying,
    budgetid uuid
);


ALTER TABLE public.event OWNER TO app;

--
-- Name: COLUMN event.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.event.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN event.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.event.organization_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN event.budgetid; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.event.budgetid IS '(DC2Type:uuid)';


--
-- Name: flight; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.flight (
    id uuid NOT NULL,
    event_id uuid,
    user_id uuid,
    flight_cost integer NOT NULL,
    departure_date_time timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    arrival_date_time timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    departure_location character varying(255) DEFAULT NULL::character varying,
    arrival_location character varying(255) DEFAULT NULL::character varying,
    flight_number character varying(255) DEFAULT NULL::character varying,
    last_modified timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    created_date timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.flight OWNER TO app;

--
-- Name: COLUMN flight.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.flight.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN flight.event_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.flight.event_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN flight.user_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.flight.user_id IS '(DC2Type:uuid)';


--
-- Name: organization; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.organization (
    id uuid NOT NULL,
    name character varying(55) NOT NULL,
    description character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    industry character varying(55) NOT NULL,
    last_modified timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    created_date timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.organization OWNER TO app;

--
-- Name: COLUMN organization.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organization.id IS '(DC2Type:uuid)';


--
-- Name: organization_invite; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.organization_invite (
    id uuid NOT NULL,
    invited_user_id uuid,
    organization_id uuid NOT NULL,
    accepted boolean NOT NULL,
    expected_email character varying(255) NOT NULL,
    invite_type character varying(255) NOT NULL
);


ALTER TABLE public.organization_invite OWNER TO app;

--
-- Name: COLUMN organization_invite.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organization_invite.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN organization_invite.invited_user_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organization_invite.invited_user_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN organization_invite.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organization_invite.organization_id IS '(DC2Type:uuid)';


--
-- Name: organizations_admins; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.organizations_admins (
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL
);


ALTER TABLE public.organizations_admins OWNER TO app;

--
-- Name: COLUMN organizations_admins.user_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_admins.user_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN organizations_admins.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_admins.organization_id IS '(DC2Type:uuid)';


--
-- Name: organizations_event_admins; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.organizations_event_admins (
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL
);


ALTER TABLE public.organizations_event_admins OWNER TO app;

--
-- Name: COLUMN organizations_event_admins.user_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_event_admins.user_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN organizations_event_admins.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_event_admins.organization_id IS '(DC2Type:uuid)';


--
-- Name: organizations_finance_admins; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.organizations_finance_admins (
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL
);


ALTER TABLE public.organizations_finance_admins OWNER TO app;

--
-- Name: COLUMN organizations_finance_admins.user_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_finance_admins.user_id IS '(DC2Type:uuid)';


--
-- Name: COLUMN organizations_finance_admins.organization_id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.organizations_finance_admins.organization_id IS '(DC2Type:uuid)';


--
-- Name: user_event; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.user_event (
    id uuid NOT NULL,
    status character varying(255) NOT NULL,
    userid uuid,
    eventid uuid NOT NULL
);


ALTER TABLE public.user_event OWNER TO app;

--
-- Name: COLUMN user_event.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.user_event.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN user_event.userid; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.user_event.userid IS '(DC2Type:uuid)';


--
-- Name: COLUMN user_event.eventid; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.user_event.eventid IS '(DC2Type:uuid)';


--
-- Name: users; Type: TABLE; Schema: public; Owner: app
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name character varying(255) DEFAULT NULL::character varying,
    last_name character varying(255) DEFAULT NULL::character varying,
    email character varying(255) NOT NULL,
    email_verified boolean NOT NULL,
    offer_ids text,
    phone_number character varying(13) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    birthday timestamp(0) without time zone NOT NULL,
    title character varying(4) NOT NULL,
    gender character varying(5) NOT NULL,
    created_on timestamp(0) without time zone NOT NULL,
    super_admin boolean NOT NULL,
    otp_secret character varying(255) DEFAULT NULL::character varying,
    passenger_id character varying(255) DEFAULT NULL::character varying
);


ALTER TABLE public.users OWNER TO app;

--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.users.id IS '(DC2Type:uuid)';


--
-- Name: COLUMN users.offer_ids; Type: COMMENT; Schema: public; Owner: app
--

COMMENT ON COLUMN public.users.offer_ids IS '(DC2Type:simple_array)';


--
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.budget (id, financial_planner_id_id, event_id, organization_id, per_user_total, last_modified, created_date) FROM stdin;
\.


--
-- Data for Name: change_logging; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.change_logging (id, created_date, operation_type, modified_by, before_change, after_change, changes) FROM stdin;
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.event (id, organization_id, event_title, start_date_time, end_date_time, start_flight_booking, end_flight_booking, location, max_attendees, last_modified, created_date, invite_code, budgetid) FROM stdin;
\.


--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.flight (id, event_id, user_id, flight_cost, departure_date_time, arrival_date_time, departure_location, arrival_location, flight_number, last_modified, created_date) FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.organization (id, name, description, address, industry, last_modified, created_date) FROM stdin;
fcef2452-5925-49b6-904d-992f18e962b8	Spelunkers	Blanditiis fuga minus eum amet architecto qui ut ut eveniet voluptas suscipit qui.	363 Von Stravenue Apt. 214\nNew Lester, NH 35148-4773	facere	2025-03-27 16:28:22	2025-03-27 16:28:22
\.


--
-- Data for Name: organization_invite; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.organization_invite (id, invited_user_id, organization_id, accepted, expected_email, invite_type) FROM stdin;
\.


--
-- Data for Name: organizations_admins; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.organizations_admins (user_id, organization_id) FROM stdin;
23a072b4-815d-4e7c-b509-05184b5d373e	fcef2452-5925-49b6-904d-992f18e962b8
\.


--
-- Data for Name: organizations_event_admins; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.organizations_event_admins (user_id, organization_id) FROM stdin;
24ef0593-a7ee-4305-8ca4-acaf0f05b903	fcef2452-5925-49b6-904d-992f18e962b8
\.


--
-- Data for Name: organizations_finance_admins; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.organizations_finance_admins (user_id, organization_id) FROM stdin;
b6b81ec1-35c6-40bd-8eb0-82818de3a97e	fcef2452-5925-49b6-904d-992f18e962b8
\.


--
-- Data for Name: user_event; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.user_event (id, status, userid, eventid) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: app
--

COPY public.users (id, first_name, last_name, email, email_verified, offer_ids, phone_number, hashed_password, birthday, title, gender, created_on, super_admin, otp_secret, passenger_id) FROM stdin;
1e6d6d01-12d4-485b-bcdb-6615e466021a	Spleunkers	user	user@rit.edu	t	\N	+44440810420	$2y$13$bPQjpQyEIqbOPHHTLYc6vutEJP2nxWlsal2f8EuGJaWGVVTq7o62e	1925-04-08 05:48:24	mr	m	2025-03-27 16:28:22	f	G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ	\N
b6b81ec1-35c6-40bd-8eb0-82818de3a97e	Spleunkers	budgetAdmin	budgetadmin@rit.edu	t	\N	+02808503503	$2y$13$vNQKbHkoNIjxtUKqahRPhuoDb1DJ28FjEypmmsQTRi.b8G0tr/UoO	1968-04-28 05:28:06	mr	m	2025-03-27 16:28:23	f	G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ	\N
23a072b4-815d-4e7c-b509-05184b5d373e	Spleunkers	orgAdmin	orgadmin@rit.edu	t	\N	+04824560937	$2y$13$Spfqqf9CqYDYgjrBXjh2HOLy9//0Mrmenx1CbudBf6tjqfDm4VZOC	1952-07-23 01:13:43	ms	m	2025-03-27 16:28:23	f	G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ	\N
24ef0593-a7ee-4305-8ca4-acaf0f05b903	Spleunkers	eventAdmin	eventadmin@rit.edu	t	\N	+27188852962	$2y$13$zPbn1D/BcdNaGSIerViSI.ARqPtB3.dait2yqiTOJoWZSadLn8h3.	1990-02-04 00:10:31	dr	f	2025-03-27 16:28:24	f	G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ	\N
9f3f1020-0afd-4c27-ae9d-cef465163e97	Spleunkers	superadmin	superadmin@rit.edu	t	\N	+58644992116	$2y$13$m5jYQW9.4yIZs48fIWYsluu4fMcK2tz3RVU8rLeoCbGq.mwgtdFjq	1979-09-14 20:49:01	mr	f	2025-03-27 16:28:24	t	G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ	\N
\.


--
-- Name: budget budget_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pkey PRIMARY KEY (id);


--
-- Name: change_logging change_logging_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.change_logging
    ADD CONSTRAINT change_logging_pkey PRIMARY KEY (id);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (id);


--
-- Name: organization_invite organization_invite_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organization_invite
    ADD CONSTRAINT organization_invite_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organizations_admins organizations_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_admins
    ADD CONSTRAINT organizations_admins_pkey PRIMARY KEY (user_id, organization_id);


--
-- Name: organizations_event_admins organizations_event_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_event_admins
    ADD CONSTRAINT organizations_event_admins_pkey PRIMARY KEY (user_id, organization_id);


--
-- Name: organizations_finance_admins organizations_finance_admins_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_finance_admins
    ADD CONSTRAINT organizations_finance_admins_pkey PRIMARY KEY (user_id, organization_id);


--
-- Name: user_event user_event_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.user_event
    ADD CONSTRAINT user_event_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_30c31e9132c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_30c31e9132c8a3de ON public.organizations_event_admins USING btree (organization_id);


--
-- Name: idx_30c31e91a76ed395; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_30c31e91a76ed395 ON public.organizations_event_admins USING btree (user_id);


--
-- Name: idx_38d80dd632c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_38d80dd632c8a3de ON public.organizations_admins USING btree (organization_id);


--
-- Name: idx_38d80dd6a76ed395; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_38d80dd6a76ed395 ON public.organizations_admins USING btree (user_id);


--
-- Name: idx_3bae0aa732c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_3bae0aa732c8a3de ON public.event USING btree (organization_id);


--
-- Name: idx_73f2f77b32c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_73f2f77b32c8a3de ON public.budget USING btree (organization_id);


--
-- Name: idx_73f2f77b75d31c14; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_73f2f77b75d31c14 ON public.budget USING btree (financial_planner_id_id);


--
-- Name: idx_b673946032c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_b673946032c8a3de ON public.organizations_finance_admins USING btree (organization_id);


--
-- Name: idx_b6739460a76ed395; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_b6739460a76ed395 ON public.organizations_finance_admins USING btree (user_id);


--
-- Name: idx_c257e60e71f7e88b; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_c257e60e71f7e88b ON public.flight USING btree (event_id);


--
-- Name: idx_c257e60ea76ed395; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_c257e60ea76ed395 ON public.flight USING btree (user_id);


--
-- Name: idx_c26cc02232c8a3de; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_c26cc02232c8a3de ON public.organization_invite USING btree (organization_id);


--
-- Name: idx_c26cc022c58dad6e; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_c26cc022c58dad6e ON public.organization_invite USING btree (invited_user_id);


--
-- Name: idx_d96cf1ff10409ba4; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_d96cf1ff10409ba4 ON public.user_event USING btree (eventid);


--
-- Name: idx_d96cf1ff5fd86d04; Type: INDEX; Schema: public; Owner: app
--

CREATE INDEX idx_d96cf1ff5fd86d04 ON public.user_event USING btree (userid);


--
-- Name: uniq_1483a5e9e7927c74; Type: INDEX; Schema: public; Owner: app
--

CREATE UNIQUE INDEX uniq_1483a5e9e7927c74 ON public.users USING btree (email);


--
-- Name: uniq_3bae0aa76f21f112; Type: INDEX; Schema: public; Owner: app
--

CREATE UNIQUE INDEX uniq_3bae0aa76f21f112 ON public.event USING btree (invite_code);


--
-- Name: uniq_3bae0aa7fec1d74a; Type: INDEX; Schema: public; Owner: app
--

CREATE UNIQUE INDEX uniq_3bae0aa7fec1d74a ON public.event USING btree (budgetid);


--
-- Name: uniq_73f2f77b71f7e88b; Type: INDEX; Schema: public; Owner: app
--

CREATE UNIQUE INDEX uniq_73f2f77b71f7e88b ON public.budget USING btree (event_id);


--
-- Name: organizations_event_admins fk_30c31e9132c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_event_admins
    ADD CONSTRAINT fk_30c31e9132c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: organizations_event_admins fk_30c31e91a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_event_admins
    ADD CONSTRAINT fk_30c31e91a76ed395 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: organizations_admins fk_38d80dd632c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_admins
    ADD CONSTRAINT fk_38d80dd632c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: organizations_admins fk_38d80dd6a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_admins
    ADD CONSTRAINT fk_38d80dd6a76ed395 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: event fk_3bae0aa732c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT fk_3bae0aa732c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id);


--
-- Name: event fk_3bae0aa7fec1d74a; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT fk_3bae0aa7fec1d74a FOREIGN KEY (budgetid) REFERENCES public.budget(id) ON DELETE SET NULL;


--
-- Name: budget fk_73f2f77b32c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT fk_73f2f77b32c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id);


--
-- Name: budget fk_73f2f77b71f7e88b; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT fk_73f2f77b71f7e88b FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- Name: budget fk_73f2f77b75d31c14; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT fk_73f2f77b75d31c14 FOREIGN KEY (financial_planner_id_id) REFERENCES public.users(id);


--
-- Name: organizations_finance_admins fk_b673946032c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_finance_admins
    ADD CONSTRAINT fk_b673946032c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: organizations_finance_admins fk_b6739460a76ed395; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organizations_finance_admins
    ADD CONSTRAINT fk_b6739460a76ed395 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: flight fk_c257e60e71f7e88b; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT fk_c257e60e71f7e88b FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- Name: flight fk_c257e60ea76ed395; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT fk_c257e60ea76ed395 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: organization_invite fk_c26cc02232c8a3de; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organization_invite
    ADD CONSTRAINT fk_c26cc02232c8a3de FOREIGN KEY (organization_id) REFERENCES public.organization(id);


--
-- Name: organization_invite fk_c26cc022c58dad6e; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.organization_invite
    ADD CONSTRAINT fk_c26cc022c58dad6e FOREIGN KEY (invited_user_id) REFERENCES public.users(id);


--
-- Name: user_event fk_d96cf1ff10409ba4; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.user_event
    ADD CONSTRAINT fk_d96cf1ff10409ba4 FOREIGN KEY (eventid) REFERENCES public.event(id);


--
-- Name: user_event fk_d96cf1ff5fd86d04; Type: FK CONSTRAINT; Schema: public; Owner: app
--

ALTER TABLE ONLY public.user_event
    ADD CONSTRAINT fk_d96cf1ff5fd86d04 FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

