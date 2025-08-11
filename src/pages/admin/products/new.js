import { useRouter } from 'next/router';
import { useCreateProduct } from '@/hooks/useProducts';
import ProductForm from '@/components/admin/products/ProductForm';
import { toast } from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (data) => {
    try {
      await createProductMutation.mutateAsync(data);
      router.push('/products');
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Create a new product in your catalog</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={createProductMutation.isLoading}
      />
    </div>
  );
}
