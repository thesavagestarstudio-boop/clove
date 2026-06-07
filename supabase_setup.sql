-- ==========================================
-- SUPABASE DATABASE SETUP FOR CLOVE KITCHEN
-- ==========================================
-- Copy and run these queries in your Supabase SQL Editor (https://supabase.com)

-- 1. Create the `cart_items` table for saving shopping cart items
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    qty INTEGER NOT NULL CHECK (qty > 0),
    img TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Prevent duplicate entries of the same item for a single user
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id)
);

-- Enable RLS for `cart_items`
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for `cart_items`
CREATE POLICY "Users can insert their own cart items" 
    ON public.cart_items FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own cart items" 
    ON public.cart_items FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
    ON public.cart_items FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
    ON public.cart_items FOR DELETE 
    USING (auth.uid() = user_id);


-- 2. Create the `orders` table to log past orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    tax NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    pickup_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for `orders`
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS policies for `orders`
CREATE POLICY "Users can insert their own orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own order history" 
    ON public.orders FOR SELECT 
    USING (auth.uid() = user_id);
