-- Drop existing objects if they exist to allow re-running
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.estimates CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table (maps to company info for a user)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    website TEXT,
    tax_id TEXT,
    domain TEXT,
    logo TEXT, -- Store URL to logo in storage
    default_tax_rate NUMERIC(5,2) DEFAULT 0,
    default_currency TEXT DEFAULT 'USD',
    default_notes TEXT,
    default_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create clients table
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    website TEXT,
    tax_id TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clients." ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients." ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients." ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients." ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Create items table
CREATE TABLE public.items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    rate NUMERIC DEFAULT 0 NOT NULL,
    sku TEXT,
    category TEXT,
    unit TEXT DEFAULT 'pcs' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items." ON public.items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items." ON public.items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items." ON public.items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items." ON public.items FOR DELETE USING (auth.uid() = user_id);

-- Create invoices table
-- Note: sender, client, and items are stored as JSONB to preserve historical snapshots at the time of invoice creation
CREATE TABLE public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT NOT NULL,
    po_number TEXT,
    date_issued TIMESTAMP WITH TIME ZONE NOT NULL,
    date_due TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    sender JSONB NOT NULL,
    client JSONB NOT NULL,
    items JSONB NOT NULL,
    tax_rate NUMERIC(5,2) DEFAULT 0 NOT NULL,
    discount NUMERIC DEFAULT 0 NOT NULL,
    shipping NUMERIC DEFAULT 0 NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invoices." ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices." ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices." ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices." ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Create estimates table
-- Note: sender, client, and items are stored as JSONB as well
CREATE TABLE public.estimates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    estimate_number TEXT NOT NULL,
    reference_number TEXT,
    date_issued TIMESTAMP WITH TIME ZONE NOT NULL,
    date_valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL,
    sender JSONB NOT NULL,
    client JSONB NOT NULL,
    items JSONB NOT NULL,
    tax_rate NUMERIC(5,2) DEFAULT 0 NOT NULL,
    discount NUMERIC DEFAULT 0 NOT NULL,
    shipping NUMERIC DEFAULT 0 NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for estimates
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own estimates." ON public.estimates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own estimates." ON public.estimates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own estimates." ON public.estimates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own estimates." ON public.estimates FOR DELETE USING (auth.uid() = user_id);

-- Set up storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for logos (public read, authenticated users can insert their own logos)
CREATE POLICY "Public access to logos" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Authenticated users can upload logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own logos" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.uid() = owner);
CREATE POLICY "Users can delete own logos" ON storage.objects FOR DELETE USING (bucket_id = 'logos' AND auth.uid() = owner);

-- Create payments table
CREATE TABLE public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    payment_method TEXT,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments." ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments." ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments." ON public.payments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payments." ON public.payments FOR DELETE USING (auth.uid() = user_id);

-- Document History Table
CREATE TABLE public.document_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL,
    document_id UUID NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.document_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own document history." ON public.document_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own document history." ON public.document_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own document history." ON public.document_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own document history." ON public.document_history FOR DELETE USING (auth.uid() = user_id);

-- Create tax_rates table
CREATE TABLE public.tax_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    rate NUMERIC(5,2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tax rates." ON public.tax_rates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tax rates." ON public.tax_rates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tax rates." ON public.tax_rates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tax rates." ON public.tax_rates FOR DELETE USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    payee TEXT,
    description TEXT,
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expenses." ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses." ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses." ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses." ON public.expenses FOR DELETE USING (auth.uid() = user_id);
