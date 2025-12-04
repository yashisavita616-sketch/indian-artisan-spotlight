import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Artisan } from '@/types/database';

type ArtisanCardProps = {
  artisan: Artisan;
};

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face';

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const location = [artisan.city, artisan.state].filter(Boolean).join(', ');

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="mb-4 h-24 w-24 ring-4 ring-sage-light">
            <AvatarImage src={artisan.avatar_url || PLACEHOLDER_AVATAR} alt={artisan.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getInitials(artisan.name)}
            </AvatarFallback>
          </Avatar>

          <h3 className="mb-1 font-display text-xl font-semibold text-foreground">
            {artisan.name}
          </h3>

          {location && (
            <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          )}

          {artisan.rating !== null && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-gold text-gold" />
              <span className="font-medium">{artisan.rating.toFixed(1)}</span>
            </div>
          )}

          <Badge variant={artisan.is_phone_verified ? 'verified' : 'pending'} className="mb-4">
            {artisan.is_phone_verified ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Phone Verified
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Not Verified
              </>
            )}
          </Badge>

          {artisan.bio && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {artisan.bio}
            </p>
          )}

          <Button asChild variant="outline" className="w-full">
            <Link to={`/artisans/${artisan.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
