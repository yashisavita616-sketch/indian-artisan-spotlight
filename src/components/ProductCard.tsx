import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import type { Product } from '@/types/database';

type ProductCardProps = {
  product: Product;
};

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop';

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
        <Badge variant="category" className="absolute left-3 top-3">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 line-clamp-2 font-display text-lg font-medium leading-tight text-foreground">
          {product.name}
        </h3>
        
        {product.rating !== null && (
          <div className="mb-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            {product.reviews_cnt !== null && product.reviews_cnt > 0 && (
              <span className="text-sm text-muted-foreground">
                ({product.reviews_cnt} reviews)
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
