import { useState } from 'react';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useForm } from 'react-hook-form';

const ProductVariants = ({ variants, onUpdate, onDelete, onAdd, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    reset(variant);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingVariant(null);
    reset({ color: '', size: '', price: '', stock: '', sku: '' });
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock)
    };

    if (editingVariant) {
      onUpdate(editingVariant.id, formData);
    } else {
      onAdd(formData);
    }
    
    setIsModalOpen(false);
    setEditingVariant(null);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockVariant = (stock) => {
    if (stock === 0) return 'danger';
    if (stock <= 5) return 'warning';
    return 'success';
  };

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </Card.Header>
        <Card.Content className="p-0">
          {variants && variants.length > 0 ? (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>SKU</Table.Head>
                  <Table.Head>Color</Table.Head>
                  <Table.Head>Size</Table.Head>
                  <Table.Head>Price</Table.Head>
                  <Table.Head>Stock</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head className="w-24">Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {variants.map((variant) => (
                  <Table.Row key={variant.id}>
                    <Table.Cell>
                      <span className="font-mono text-sm">{variant.sku}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        {variant.color?.hexCode && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: variant.color.hexCode }}
                          />
                        )}
                        <span>{variant.color?.name || 'N/A'}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{variant.size?.name || 'N/A'}</Table.Cell>
                    <Table.Cell>{formatCurrency(variant.price)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{variant.inventory?.quantity || 0}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={getStockVariant(variant.inventory?.quantity || 0)}>
                        {getStockStatus(variant.inventory?.quantity || 0)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(variant)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(variant.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No variants</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new variant.
              </p>
              <div className="mt-6">
                <Button onClick={handleAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Variant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVariant ? 'Edit Variant' : 'Add Variant'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Color"
              {...register('color', { required: 'Color is required' })}
              error={errors.color?.message}
            />
            <Input
              label="Size"
              {...register('size', { required: 'Size is required' })}
              error={errors.size?.message}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required' })}
              error={errors.price?.message}
            />
            <Input
              label="Stock"
              type="number"
              {...register('stock', { required: 'Stock is required' })}
              error={errors.stock?.message}
            />
          </div>
          
          <Input
            label="SKU"
            {...register('sku', { required: 'SKU is required' })}
            error={errors.sku?.message}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingVariant ? 'Update' : 'Add'} Variant
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProductVariants;