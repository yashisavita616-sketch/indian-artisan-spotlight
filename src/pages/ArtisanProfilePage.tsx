import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, CheckCircle, XCircle, MessageCircle, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { toast } from 'sonner';
import type { Artisan, Product } from '@/types/database';

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face';

export default function ArtisanProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingArtisan, setLoadingArtisan] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [artisanError, setArtisanError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtisan() {
      if (!id) return;
      try {
        setLoadingArtisan(true);
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setArtisan(data);
      } catch (err) {
        setArtisanError(err instanceof Error ? err.message : 'Failed to load artisan');
      } finally {
        setLoadingArtisan(false);
      }
    }

    async function fetchProducts() {
      if (!id) return;
      try {
        setLoadingProducts(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('artisan_id', id);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setProductsError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchArtisan();
    fetchProducts();
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFollow = () => {
    toast.success('Following artisan! (UI only)');
  };

  const handleMessage = () => {
    toast.info('Message feature coming soon!');
  };

  if (loadingArtisan) {
    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="mb-8">
            <Skeleton className="h-8 w-32" />
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 text-center md:text-left">
                  <Skeleton className="mx-auto mb-2 h-8 w-48 md:mx-0" />
                  <Skeleton className="mx-auto mb-4 h-4 w-32 md:mx-0" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (artisanError || !artisan) {
    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="rounded-lg bg-destructive/10 p-8 text-center">
            <p className="text-destructive">{artisanError || 'Artisan not found'}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/artisans">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Artisans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const location = [artisan.city, artisan.state].filter(Boolean).join(', ');

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Back Link */}
        <Link
          to="/artisans"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Artisans
        </Link>

        {/* Artisan Profile Card */}
        <Card className="mb-12 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/30 to-accent/20" />
          <CardContent className="relative px-8 pb-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
              <Avatar className="-mt-16 h-32 w-32 border-4 border-card shadow-lg">
                <AvatarImage src={artisan.avatar_url || PLACEHOLDER_AVATAR} alt={artisan.name} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {getInitials(artisan.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col items-center gap-3 md:flex-row">
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {artisan.name}
                  </h1>
                  <Badge variant={artisan.is_phone_verified ? 'verified' : 'pending'}>
                    {artisan.is_phone_verified ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        Not Verified
                      </>
                    )}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  {location && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {location}
                    </span>
                  )}
                  {artisan.rating !== null && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-gold text-gold" />
                      <span className="font-medium">{artisan.rating.toFixed(1)}</span>
                    </span>
                  )}
                  {artisan.phone && artisan.is_phone_verified && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {artisan.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleFollow}>
                  <Heart className="mr-2 h-4 w-4" />
                  Follow
                </Button>
                <Button onClick={handleMessage}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>

            {artisan.bio && (
              <div className="mt-6 rounded-lg bg-muted/50 p-6">
                <h3 className="mb-2 font-display text-lg font-semibold">About</h3>
                <p className="text-muted-foreground">{artisan.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Section */}
        <div>
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Products by {artisan.name}
          </h2>

          {loadingProducts ? (
            <ProductSkeletonGrid count={6} />
          ) : productsError ? (
            <div className="rounded-lg bg-destructive/10 p-8 text-center">
              <p className="text-destructive">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg bg-muted p-12 text-center">
              <p className="text-muted-foreground">
                This artisan hasn't listed any products yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
