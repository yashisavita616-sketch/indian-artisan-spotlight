import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, ShoppingBag, Award, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { ArtisanCard } from '@/components/ArtisanCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { ArtisanSkeletonGrid } from '@/components/ArtisanSkeleton';
import type { Product, Artisan } from '@/types/database';

const categories = [
  { name: 'Textiles', image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&h=300&fit=crop', count: 120 },
  { name: 'Pottery', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=300&h=300&fit=crop', count: 85 },
  { name: 'Jewelry', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop', count: 200 },
  { name: 'Woodwork', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop', count: 64 },
  { name: 'Paintings', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=300&fit=crop', count: 150 },
  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop', count: 95 },
];

const stats = [
  { icon: Users, value: '2,500+', label: 'Artisans' },
  { icon: ShoppingBag, value: '15,000+', label: 'Products' },
  { icon: Award, value: '50+', label: 'States' },
  { icon: Heart, value: '100,000+', label: 'Happy Customers' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingArtisans, setLoadingArtisans] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [artisanError, setArtisanError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setProductError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    }

    async function fetchArtisans() {
      try {
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .order('rating', { ascending: false })
          .limit(6);

        if (error) throw error;
        setArtisans(data || []);
      } catch (err) {
        setArtisanError(err instanceof Error ? err.message : 'Failed to load artisans');
      } finally {
        setLoadingArtisans(false);
      }
    }

    fetchProducts();
    fetchArtisans();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-terracotta-light via-background to-secondary/30 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--terracotta-light))_0%,transparent_50%)] opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-slide-up font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Discover India's Finest{' '}
              <span className="text-primary">Handmade Treasures</span>
            </h1>
            <div className="mt-6 animate-slide-up space-y-2 text-lg text-muted-foreground md:text-xl [animation-delay:100ms]">
              <p>Welcome to Handmade Haven — a home for authentic, handcrafted artistry.</p>
              <p>Our creations are inspired by nature, life, and imagination.</p>
              <p>We craft with heart so you can decorate with soul.</p>
            </div>
            <div className="mt-8 flex animate-slide-up flex-col justify-center gap-4 sm:flex-row [animation-delay:200ms]">
              <Button asChild variant="hero">
                <Link to="/products">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="hero-outline">
                <Link to="/become-seller">Become a Seller</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Explore Categories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find handcrafted treasures across diverse art forms
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                    <h3 className="font-display text-lg font-semibold text-card">
                      {category.name}
                    </h3>
                    <p className="text-sm text-card/80">{category.count} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Best Selling Products
              </h2>
              <p className="mt-2 text-muted-foreground">
                Most loved by our customers
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingProducts ? (
            <ProductSkeletonGrid count={8} />
          ) : productError ? (
            <div className="rounded-lg bg-destructive/10 p-8 text-center">
              <p className="text-destructive">{productError}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg bg-muted p-8 text-center">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Artisans */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Top Artisans
              </h2>
              <p className="mt-2 text-muted-foreground">
                Meet the masters behind the craft
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/artisans">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingArtisans ? (
            <ArtisanSkeletonGrid count={6} />
          ) : artisanError ? (
            <div className="rounded-lg bg-destructive/10 p-8 text-center">
              <p className="text-destructive">{artisanError}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : artisans.length === 0 ? (
            <div className="rounded-lg bg-muted p-8 text-center">
              <p className="text-muted-foreground">No artisans available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Share Your Craft With the World
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Join thousands of artisans who have found their audience on Handmade Haven.
            Start selling your handcrafted creations today.
          </p>
          <Button asChild variant="secondary" size="xl" className="mt-8">
            <Link to="/become-seller">
              Become a Seller
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
