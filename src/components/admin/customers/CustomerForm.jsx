import { useForm, Controller } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const CustomerForm = ({ customer, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      firstName: customer?.firstName || '',
      lastName: customer?.lastName || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      isActive: customer?.isActive ?? true,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">
            {customer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
            />
            
            <Input
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
            />
            
            <Input
              label="Email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email'
                }
              })}
              error={errors.email?.message}
            />
            
            <Input
              label="Phone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
          
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active customer
              </label>
            </div>
          </div>
        </Card.Content>
        
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
              {customer ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default CustomerForm;