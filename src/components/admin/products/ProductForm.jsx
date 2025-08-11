import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Save, X, Plus, Trash2, Upload } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useProductCategories } from '@/hooks/useProducts';

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [images, setImages] = useState(product?.images || []);
  const { data: categories } = useProductCategories();
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      sku: product?.sku || '',
      price: product?.price || '',
      compareAtPrice: product?.compareAtPrice || '',
      categoryId: product?.categoryId || '',
      status: product?.status || 'draft',
      variants: product?.variants || [{ color: '', size: '', price: '', stock: '' }],
      tags: product?.tags?.join(', ') || '',
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to your server/CDN
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      images,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      price: parseFloat(data.price),
      compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
      variants: data.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        stock: parseInt(variant.stock)
      }))
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                {...register('name', { required: 'Product name is required' })}
                error={errors.name?.message}
              />
            </div>
            
            <Input
              label="SKU"
              {...register('sku', { required: 'SKU is required' })}
              error={errors.sku?.message}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                {...register('categoryId', { required: 'Category is required' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
              )}
            </div>
            
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required' })}
              error={errors.price?.message}
            />
            
            <Input
              label="Compare at Price"
              type="number"
              step="0.01"
              {...register('compareAtPrice')}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Product description..."
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Tags (comma separated)"
                {...register('tags')}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Product Images */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload images
                    </span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Product Variants */}
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ color: '', size: '', price: '', stock: '' })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
                <Input
                  label="Color"
                  {...register(`variants.${index}.color`)}
                  placeholder="Red, Blue, etc."
                />
                <Input
                  label="Size"
                  {...register(`variants.${index}.size`)}
                  placeholder="S, M, L, etc."
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  {...register(`variants.${index}.price`)}
                />
                <Input
                  label="Stock"
                  type="number"
                  {...register(`variants.${index}.stock`)}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* SEO Settings */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <Input
              label="SEO Title"
              {...register('seoTitle')}
              placeholder="Search engine optimized title"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                {...register('seoDescription')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Search engine optimized description"
              />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Form Actions */}
      <Card>
        <Card.Footer>
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="h-4 w-4 mr-2" />
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default ProductForm;