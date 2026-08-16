
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SERVICES
CREATE TABLE public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'legal',
  short_description text not null default '',
  long_description text not null default '',
  icon text not null default 'scale',
  lawyer text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published services" ON public.services FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SITE CONTENT
CREATE TABLE public.site_content (
  key text primary key,
  value text not null default '',
  label text not null default '',
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage content" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- OFFICES
CREATE TABLE public.offices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  phones text not null default '',
  email text not null default '',
  website text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.offices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offices TO authenticated;
GRANT ALL ON public.offices TO service_role;
ALTER TABLE public.offices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read offices" ON public.offices FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage offices" ON public.offices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER offices_updated BEFORE UPDATE ON public.offices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONSULTATION REQUESTS
CREATE TABLE public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  city text,
  service_required text,
  case_type text,
  description text,
  preferred_date date,
  preferred_time text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.consultation_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit consultation" ON public.consultation_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage consultations" ON public.consultation_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- CASE INQUIRIES
CREATE TABLE public.case_inquiries (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  contact_number text not null,
  email text,
  city text,
  court_tribunal text,
  case_type text,
  case_reference text,
  case_details text,
  required_service text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.case_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_inquiries TO authenticated;
GRANT ALL ON public.case_inquiries TO service_role;
ALTER TABLE public.case_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit inquiry" ON public.case_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins manage inquiries" ON public.case_inquiries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- SEED SERVICES
INSERT INTO public.services (slug, title, category, short_description, long_description, icon, lawyer, sort_order) VALUES
('civil','Civil Law','legal','Civil litigation, disputes, property matters, contracts and recovery proceedings.','Civil legal services including civil litigation, disputes, property-related matters, contracts, recovery matters and other civil proceedings.','scale','Kamran Abro, Advocate',1),
('criminal','Criminal Law','legal','Criminal litigation, bail matters, defence and criminal proceedings.','Professional legal representation and assistance in criminal matters, including criminal litigation, bail matters, defence, complaints, criminal proceedings and related legal proceedings.','gavel','Kamran Abro, Advocate',2),
('banking','Banking Law','legal','Banking matters, financial disputes, recovery and documentation.','Legal consultancy and representation relating to banking matters, financial disputes, recovery matters, banking documentation and related proceedings.','landmark',NULL,3),
('family','Family Law','legal','Matrimonial disputes, maintenance, custody and succession matters.','Legal assistance in family matters, matrimonial disputes, maintenance, custody, succession-related family matters and other family proceedings.','users',NULL,4),
('cyber','Cyber Law','legal','Cybercrime, online offences, digital disputes and electronic evidence.','Legal consultancy and assistance relating to cybercrime, online offences, digital disputes, electronic evidence, social-media-related legal issues and applicable cyber laws.','shield',NULL,5),
('tribunal','Tribunal Matters','legal','Representation before tribunals and quasi-judicial forums.','Representation and legal consultancy before relevant tribunals and quasi-judicial forums.','building',NULL,6),
('public-litigation','Public Litigation','legal','Public-interest and public-law litigation representation.','Legal representation and consultancy concerning public-interest and public-law litigation.','megaphone',NULL,7),
('research','Legal Research','legal','Case-law research, statutory research and legal opinions.','Professional legal research, case-law research, statutory research, legal opinions and preparation of legal research material.','bookopen',NULL,8),
('company','Company Services','corporate','Company formation, corporate documentation and compliance support.','Company formation, corporate documentation, compliance support and legal consultancy for businesses.','briefcase',NULL,9),
('firm','Firm / Business Consultancy','corporate','Consultancy for firms, businesses, entrepreneurs and organizations.','Legal consultancy for firms, businesses, entrepreneurs and organizations.','handshake',NULL,10),
('corporate-legal','Corporate Legal Services','corporate','Corporate agreements, contracts, business disputes and advisory.','Corporate agreements, contracts, business disputes, corporate documentation and legal advisory.','filetext',NULL,11),
('income-tax','Income Tax','taxation','Legal and consultancy services relating to income-tax matters.','Legal and consultancy services relating to income-tax matters.','receipt',NULL,12),
('sales-tax','Sales Tax','taxation','Legal and consultancy services relating to sales-tax matters.','Legal and consultancy services relating to sales-tax matters.','calculator',NULL,13),
('customs','Customs','taxation','Consultancy and assistance relating to customs matters and proceedings.','Legal consultancy and assistance relating to customs matters, disputes and proceedings.','ship',NULL,14),
('visa','Visa','immigration','Visa-related legal consultancy and assistance.','Visa-related legal consultancy and assistance for individuals and organizations.','plane',NULL,15),
('nationality','Nationality','immigration','Legal consultancy regarding nationality and related matters.','Legal consultancy regarding nationality and related matters.','globe',NULL,16),
('ipo','IPO','ip','Intellectual Property Office-related services.','Intellectual Property Office-related services, filings and consultancy.','badgecheck',NULL,17),
('patent','Patent','ip','Patent-related legal consultancy and assistance.','Patent-related legal consultancy and assistance.','lightbulb',NULL,18),
('ngo-npo','NGO / NPO','other','Establishment, registration, documentation and compliance.','Legal and consultancy services relating to establishment, registration, documentation, compliance and related legal matters for NGOs and NPOs.','heart',NULL,19),
('weboc','WEBOC','other','WEBOC, customs and online trade documentation assistance.','Legal and consultancy assistance relating to WEBOC, customs and online trade-related documentation and matters.','globe2',NULL,20),
('other','Other Services','other','Other legal and consultancy services on request.','Other legal and consultancy services provided by the firm on request.','plus',NULL,21);

INSERT INTO public.offices (name, address, phones, email, website, sort_order) VALUES
('Quetta Office','Office # T1 KFK Business Center, Manan Chowk, Quetta.','0304-8440932, 0306-3020227','iilf404@gmail.com','www.iilf.pk',1),
('Islamabad Office','Chamber # 2, Football Ground Street # 6, Anwar Block, F-8, Islamabad.','0311-1005727','iilf404@gmail.com','www.iilf.pk',2);

INSERT INTO public.site_content (key, value, label) VALUES
('hero_title','IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY','Hero title'),
('hero_subtitle','Professional Legal & Consultancy Services','Hero subtitle'),
('hero_description','We provide reliable legal representation, litigation support, consultancy and business-related legal services for individuals, companies, organizations and institutions.','Hero description'),
('about_heading','About the Firm','About heading'),
('about_body','IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY provides legal representation, consultancy, litigation and advisory services across multiple areas of law and business. The firm serves individuals, companies, organizations and institutions with professional, confidential and structured legal support.','About body'),
('ceo_name','H D AZAD','CEO name'),
('ceo_title','CEO','CEO title'),
('ceo_bio','H D AZAD leads IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY and oversees the firm''s legal representation, consultancy and advisory practice.','CEO profile'),
('advocate_name','Kamran Abro, Advocate','Advocate name'),
('advocate_bio','Kamran Abro, Advocate handles Civil Law and Criminal Law matters for the firm, including litigation, bail matters, defence, disputes, property matters and related proceedings.','Advocate profile'),
('firm_registration','Firm Reg. No. RF/ICT/2871 of 2017 — NTN No. 5558740','Registration line'),
('disclaimer','The information provided on this website is for general informational purposes only and does not by itself constitute legal advice or create an advocate-client relationship. Please contact the firm for advice on your specific matter.','Legal disclaimer'),
('social_facebook','','Facebook URL'),
('social_linkedin','','LinkedIn URL'),
('social_whatsapp','','WhatsApp link');
