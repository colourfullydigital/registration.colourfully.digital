--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

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

--
-- Name: gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public.gender OWNER TO postgres;

--
-- Name: programs_statuses; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.programs_statuses AS ENUM (
    'draft',
    'scheduled',
    'active',
    'completed',
    'postponed',
    'cancelled',
    'archived'
);


ALTER TYPE public.programs_statuses OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'basic'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: check_instructor_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_instructor_role() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = NEW.instructor_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only users with admin role can be instructors';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.check_instructor_role() OWNER TO postgres;

--
-- Name: create_user(character varying, character varying, character varying, character varying, public.user_role, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user(a_name character varying, a_email character varying, a_phone character varying, a_pref_moc character varying, a_role public.user_role, a_hashed_pword character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare new_user_id int; 
begin
insert into users (name, email, phone_number, preferred_method_of_contact, role)
values (a_name, a_email, a_phone, a_pref_moc, a_role) returning id into new_user_id;
insert into login_information (user_id , hashed_password) values (new_user_id, a_hashed_pword);
END; $$;


ALTER FUNCTION public.create_user(a_name character varying, a_email character varying, a_phone character varying, a_pref_moc character varying, a_role public.user_role, a_hashed_pword character varying) OWNER TO postgres;

--
-- Name: create_user(character varying, character varying, character varying, character varying, character varying, public.user_role, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user(a_f_name character varying, a_l_name character varying, a_email character varying, a_phone character varying, a_pref_moc character varying, a_role public.user_role, a_hashed_pword character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare new_user_id int; 
begin
insert into users (first_name, last_name, email, phone_number, preferred_method_of_contact, role)
values (a_f_name, a_l_name, a_email, a_phone, a_pref_moc, a_role) returning id into new_user_id;
insert into login_information (user_id , hashed_password) values (new_user_id, a_hashed_pword);
END; $$;


ALTER FUNCTION public.create_user(a_f_name character varying, a_l_name character varying, a_email character varying, a_phone character varying, a_pref_moc character varying, a_role public.user_role, a_hashed_pword character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: dependents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dependents (
    id integer NOT NULL,
    user_id integer,
    birthday date NOT NULL,
    gender public.gender DEFAULT 'other'::public.gender,
    first_name character varying(50) NOT NULL,
    last_name character varying(100) NOT NULL
);


ALTER TABLE public.dependents OWNER TO postgres;

--
-- Name: dependents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dependents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dependents_id_seq OWNER TO postgres;

--
-- Name: dependents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dependents_id_seq OWNED BY public.dependents.id;


--
-- Name: login_information; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.login_information (
    id integer NOT NULL,
    user_id integer,
    hashed_password character varying(255) NOT NULL
);


ALTER TABLE public.login_information OWNER TO postgres;

--
-- Name: login_information_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.login_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.login_information_id_seq OWNER TO postgres;

--
-- Name: login_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.login_information_id_seq OWNED BY public.login_information.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id integer NOT NULL,
    name character varying(80),
    email character varying(255),
    phone character varying(15),
    website character varying(150)
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organizations_id_seq OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    organization_id integer,
    name character varying(100) NOT NULL,
    description text,
    capacity integer DEFAULT 40,
    num_registered integer DEFAULT 0,
    utc_start_date timestamp without time zone NOT NULL,
    utc_end_date timestamp without time zone NOT NULL,
    location text,
    instructor_id integer,
    status public.programs_statuses,
    utc_creation_time timestamp without time zone DEFAULT (now() AT TIME ZONE 'UTC'::text) NOT NULL
);


ALTER TABLE public.programs OWNER TO postgres;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programs_id_seq OWNER TO postgres;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(15),
    preferred_method_of_contact character varying(50),
    role public.user_role DEFAULT 'basic'::public.user_role,
    first_name character varying(50) NOT NULL,
    last_name character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: dependents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependents ALTER COLUMN id SET DEFAULT nextval('public.dependents_id_seq'::regclass);


--
-- Name: login_information id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_information ALTER COLUMN id SET DEFAULT nextval('public.login_information_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: dependents dependents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependents
    ADD CONSTRAINT dependents_pkey PRIMARY KEY (id);


--
-- Name: login_information login_information_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_information
    ADD CONSTRAINT login_information_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: programs enforce_instructor_role; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER enforce_instructor_role BEFORE INSERT OR UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.check_instructor_role();


--
-- Name: dependents dependents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependents
    ADD CONSTRAINT dependents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: login_information login_information_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.login_information
    ADD CONSTRAINT login_information_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: programs programs_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(id);


--
-- Name: programs programs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- PostgreSQL database dump complete
--

