import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArtisanCard } from '@/components/ArtisanCard';
import { ArtisanSkeletonGrid } from '@/components/ArtisanSkeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Artisan } from '@/types/database';

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchArtisans() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('artisans')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArtisans(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artisans');
      } finally {
        setLoading(false);
      }
    }

    fetchArtisans();
  }, []);

  const filteredArtisans = artisans.filter((artisan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      artisan.name.toLowerCase().includes(query) ||
      artisan.city?.toLowerCase().includes(query) ||
      artisan.state?.toLowerCase().includes(query) ||
      artisan.bio?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Our Artisans
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Meet the talented craftspeople behind every handmade treasure. Each artisan
            brings generations of skill and passion to their work.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search artisans by name, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <ArtisanSkeletonGrid count={9} />
        ) : error ? (
          <div className="rounded-lg bg-destructive/10 p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredArtisans.length === 0 ? (
          <div className="rounded-lg bg-muted p-12 text-center">
            <p className="text-lg text-muted-foreground">
              {searchQuery
                ? 'No artisans found matching your search.'
                : 'No artisans available yet.'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {filteredArtisans.length} artisan{filteredArtisans.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArtisans.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
