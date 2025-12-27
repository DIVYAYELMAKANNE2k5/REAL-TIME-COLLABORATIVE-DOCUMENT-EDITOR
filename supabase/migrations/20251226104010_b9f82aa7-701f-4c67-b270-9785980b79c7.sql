-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create folders table
CREATE TABLE public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on folders
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view their own folders"
  ON public.folders FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own folders"
  ON public.folders FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own folders"
  ON public.folders FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own folders"
  ON public.folders FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled',
  content TEXT DEFAULT '',
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create document_shares table for sharing permissions
CREATE TABLE public.document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  shared_with_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(document_id, shared_with_id)
);

-- Enable RLS on document_shares
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;

-- Document shares policies
CREATE POLICY "Users can view shares for their documents"
  ON public.document_shares FOR SELECT
  TO authenticated
  USING (
    document_id IN (SELECT id FROM public.documents WHERE owner_id = auth.uid())
    OR shared_with_id = auth.uid()
  );

CREATE POLICY "Document owners can create shares"
  ON public.document_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    document_id IN (SELECT id FROM public.documents WHERE owner_id = auth.uid())
  );

CREATE POLICY "Document owners can delete shares"
  ON public.document_shares FOR DELETE
  TO authenticated
  USING (
    document_id IN (SELECT id FROM public.documents WHERE owner_id = auth.uid())
  );

-- Documents policies (owner or shared)
CREATE POLICY "Users can view their own or shared documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT document_id FROM public.document_shares WHERE shared_with_id = auth.uid())
  );

CREATE POLICY "Users can create their own documents"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own or editable shared documents"
  ON public.documents FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT document_id FROM public.document_shares WHERE shared_with_id = auth.uid() AND permission = 'edit')
  );

CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for documents (for collaborative editing)
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;