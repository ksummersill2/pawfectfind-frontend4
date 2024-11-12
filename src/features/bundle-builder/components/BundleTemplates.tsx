```typescript
// Previous imports remain the same...

const BundleTemplates: React.FC<BundleTemplatesProps> = ({ onSelect }) => {
  const templates: BundleTemplate[] = [
    {
      id: 'new-puppy',
      name: 'New Puppy Welcome Pack',
      description: 'Everything needed for your new family member',
      categories: [
        { id: 'food', name: 'Puppy Food & Nutrition', required: true, maxItems: 2, icon: 'bone' },
        { id: 'toys', name: 'Puppy Toys', required: true, maxItems: 2, icon: 'ball' },
        { id: 'training', name: 'Training Essentials', required: true, maxItems: 1, icon: 'brain' },
        { id: 'health', name: 'Health & Care', required: true, maxItems: 2, icon: 'heart' }
      ],
      minTotal: 80,
      maxTotal: 150,
      discount: 15
    },
    {
      id: 'spa-day',
      name: 'Luxury Spa Day Bundle',
      description: 'Premium grooming and wellness products',
      categories: [
        { id: 'grooming', name: 'Premium Grooming', required: true, maxItems: 2, icon: 'bath' },
        { id: 'health', name: 'Wellness Products', required: true, maxItems: 2, icon: 'heart' },
        { id: 'accessories', name: 'Spa Accessories', required: false, maxItems: 1, icon: 'star' }
      ],
      minTotal: 100,
      maxTotal: 200,
      discount: 20
    },
    {
      id: 'training',
      name: 'Training Success Kit',
      description: 'Essential tools for effective training',
      categories: [
        { id: 'food', name: 'Training Treats', required: true, maxItems: 2, icon: 'bone' },
        { id: 'toys', name: 'Training Toys', required: true, maxItems: 2, icon: 'brain' },
        { id: 'training', name: 'Training Tools', required: true, maxItems: 2, icon: 'baby' }
      ],
      minTotal: 70,
      maxTotal: 150,
      discount: 15
    },
    {
      id: 'comfort',
      name: 'Comfort & Care Package',
      description: 'Premium comfort items for your pet',
      categories: [
        { id: 'bedding', name: 'Premium Bedding', required: true, maxItems: 1, icon: 'bed' },
        { id: 'accessories', name: 'Comfort Accessories', required: true, maxItems: 2, icon: 'heart' },
        { id: 'grooming', name: 'Grooming Essentials', required: false, maxItems: 1, icon: 'bath' }
      ],
      minTotal: 90,
      maxTotal: 180,
      discount: 15
    },
    {
      id: 'seasonal',
      name: 'Seasonal Special',
      description: 'Seasonal products and accessories',
      categories: [
        { id: 'seasonal', name: 'Seasonal Items', required: true, maxItems: 2, icon: 'sun' },
        { id: 'accessories', name: 'Seasonal Accessories', required: true, maxItems: 2, icon: 'star' },
        { id: 'toys', name: 'Seasonal Toys', required: false, maxItems: 1, icon: 'gift' }
      ],
      minTotal: 50,
      maxTotal: 120,
      discount: 10
    },
    {
      id: 'health',
      name: 'Health & Wellness Package',
      description: 'Complete health and wellness essentials',
      categories: [
        { id: 'health', name: 'Health Products', required: true, maxItems: 2, icon: 'heart' },
        { id: 'food', name: 'Health Foods', required: true, maxItems: 1, icon: 'bone' },
        { id: 'grooming', name: 'Wellness Grooming', required: false, maxItems: 1, icon: 'bath' }
      ],
      minTotal: 85,
      maxTotal: 170,
      discount: 15
    }
  ];

  // Rest of the component remains the same...
};
```