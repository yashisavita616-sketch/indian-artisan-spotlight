export type Artisan = {
  id: string;
  user_id: string | null;
  name: string;
  city: string | null;
  state: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_phone_verified: boolean;
  rating: number | null;
  created_at: string;
};

export type Product = {
  id: string;
  artisan_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  rating: number | null;
  reviews_cnt: number | null;
  in_stock: boolean | null;
  created_at: string;
};

export type SellerVerification = {
  id: string;
  user_id: string;
  artisan_id: string | null;
  document_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export type ArtisanInsert = {
  user_id?: string | null;
  name: string;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  is_phone_verified?: boolean;
  rating?: number | null;
};

export type SellerVerificationInsert = {
  user_id: string;
  artisan_id?: string | null;
  document_url?: string | null;
  status?: 'pending' | 'approved' | 'rejected';
  notes?: string | null;
};

export type Database = {
  public: {
    Tables: {
      artisans: {
        Row: Artisan;
        Insert: ArtisanInsert;
        Update: Partial<ArtisanInsert>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      seller_verifications: {
        Row: SellerVerification;
        Insert: SellerVerificationInsert;
        Update: Partial<SellerVerificationInsert>;
      };
    };
  };
};
