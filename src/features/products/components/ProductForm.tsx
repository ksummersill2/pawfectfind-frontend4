import React from 'react';
import { Product } from '../types';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Product) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // Implementation here
  return <div>Product Form</div>;
};

export default ProductForm;