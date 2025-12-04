import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const categories = [
  'Textiles',
  'Pottery',
  'Jewelry',
  'Woodwork',
  'Paintings',
  'Home Decor',
  'Metalwork',
  'Leather',
  'Other',
];

const steps = [
  { id: 1, title: 'Personal Details', description: 'Tell us about yourself' },
  { id: 2, title: 'Your Craft', description: 'Describe your artistry' },
  { id: 3, title: 'Verification', description: 'Upload documents' },
];

type FormData = {
  name: string;
  city: string;
  state: string;
  phone: string;
  bio: string;
  category: string;
  documentFile: File | null;
};

type FormErrors = {
  name?: string;
  city?: string;
  state?: string;
  phone?: string;
  bio?: string;
  category?: string;
  documentFile?: string;
};

export default function BecomeSellerPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    city: '',
    state: '',
    phone: '',
    bio: '',
    category: '',
    documentFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const updateFormData = (field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    if (step === 2) {
      if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
      if (!formData.category) newErrors.category = 'Category is required';
    }

    if (step === 3) {
      if (!formData.documentFile) newErrors.documentFile = 'Document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      updateFormData('documentFile', file);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);

    try {
      // For demo purposes, use a placeholder user_id
      // In production, you would get this from auth.user
      const placeholderUserId = crypto.randomUUID();

      // 1. Upload document to storage
      let documentUrl = '';
      if (formData.documentFile) {
        const fileExt = formData.documentFile.name.split('.').pop();
        const filePath = `${placeholderUserId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('seller-docs')
          .upload(filePath, formData.documentFile);

        if (uploadError) throw uploadError;
        documentUrl = filePath;
      }

      // 2. Insert artisan
      const { data: artisan, error: artisanError } = await supabase
        .from('artisans')
        .insert({
          user_id: placeholderUserId,
          name: formData.name.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          phone: formData.phone.trim(),
          bio: formData.bio.trim(),
          is_phone_verified: false,
          rating: 5,
        } as any)
        .select()
        .single();

      if (artisanError) throw artisanError;
      if (!artisan) throw new Error('Failed to create artisan profile');

      const artisanId = (artisan as any).id;

      // 3. Insert seller verification
      const { error: verificationError } = await supabase
        .from('seller_verifications')
        .insert({
          user_id: placeholderUserId,
          artisan_id: artisanId,
          document_url: documentUrl,
          status: 'pending',
        } as any);

      if (verificationError) throw verificationError;

      setIsComplete(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <Card className="mx-auto max-w-lg">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Check className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Thank You!
              </h2>
              <p className="mt-4 text-muted-foreground">
                Your application has been submitted successfully. We'll review your
                documents and get back to you within 2-3 business days.
              </p>
              <Button className="mt-8" onClick={() => navigate('/')}>
                Return Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Become a Seller
            </h1>
            <p className="mt-2 text-muted-foreground">
              Join our community of skilled artisans and reach customers worldwide
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        currentStep >= step.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 hidden text-center sm:block">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded ${
                        currentStep > step.id ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-destructive">{errors.name as string}</p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className={errors.city ? 'border-destructive' : ''}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-destructive">{errors.city as string}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="Enter your state"
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        className={errors.state ? 'border-destructive' : ''}
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-destructive">{errors.state as string}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-destructive">{errors.phone as string}</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Your Craft */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label htmlFor="bio">About Your Craft *</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about your craft, experience, and what makes your work unique..."
                      rows={5}
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      className={errors.bio ? 'border-destructive' : ''}
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-destructive">{errors.bio as string}</p>
                    )}
                  </div>
                  <div>
                    <Label>Main Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => updateFormData('category', value)}
                    >
                      <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select your primary craft category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-destructive">{errors.category as string}</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <>
                  <div>
                    <Label>Verification Document *</Label>
                    <p className="mb-3 text-sm text-muted-foreground">
                      Please upload a government-issued ID (Aadhaar, PAN, Voter ID) or
                      business registration document for verification.
                    </p>
                    <div
                      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        formData.documentFile
                          ? 'border-primary bg-primary/5'
                          : errors.documentFile
                          ? 'border-destructive'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {formData.documentFile
                          ? formData.documentFile.name
                          : 'Click or drag to upload (max 5MB)'}
                      </p>
                    </div>
                    {errors.documentFile && (
                      <p className="mt-1 text-sm text-destructive">{errors.documentFile}</p>
                    )}
                  </div>

                  {/* Review Summary */}
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-3 font-medium">Review Your Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd>{formData.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Location:</dt>
                        <dd>
                          {formData.city}, {formData.state}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Phone:</dt>
                        <dd>{formData.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category:</dt>
                        <dd>{formData.category}</dd>
                      </div>
                    </dl>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
