import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Upload, Bell, Shield, CreditCard, Globe } from 'lucide-react';
import Card from '@/components/admin/ui/Card';
import Button from '@/components/admin/ui/Button';
import Input from '@/components/admin/ui/Input';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const { register: registerGeneral, handleSubmit: handleGeneralSubmit } = useForm({
    defaultValues: {
      storeName: 'Bam & Bosey',
      storeDescription: 'Premium fashion and lifestyle brand',
      contactEmail: 'contact@bambosey.com',
      supportEmail: 'support@bambosey.com',
      phone: '+1 (403) 850-4260',
      address: 'Calgary, AB',
      timezone: 'Mountain Time, Canada',
      currency: 'CAD',
    }
  });

  const { register: registerNotifications, handleSubmit: handleNotificationsSubmit } = useForm({
    defaultValues: {
      orderNotifications: true,
      lowStockAlerts: true,
      customerSignups: true,
      paymentAlerts: true,
      emailFrequency: 'daily',
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const onGeneralSubmit = async (data) => {
    setLoading(true);
    try {
      // API call to update general settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const onNotificationsSubmit = async (data) => {
    setLoading(true);
    try {
      // API call to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit(onGeneralSubmit)} className="space-y-6">
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-medium text-gray-900">Store Information</h3>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Store Name"
                      {...registerGeneral('storeName')}
                    />
                    <Input
                      label="Contact Email"
                      type="email"
                      {...registerGeneral('contactEmail')}
                    />
                    <Input
                      label="Support Email"
                      type="email"
                      {...registerGeneral('supportEmail')}
                    />
                    <Input
                      label="Phone Number"
                      {...registerGeneral('phone')}
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Description
                      </label>
                      <textarea
                        {...registerGeneral('storeDescription')}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        {...registerGeneral('address')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      <select
                        {...registerGeneral('timezone')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        {...registerGeneral('currency')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                      </select>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button type="submit" loading={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </Card.Footer>
              </Card>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit(onNotificationsSubmit)} className="space-y-6">
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Order Notifications</h4>
                        <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                      </div>
                      <input
                        type="checkbox"
                        {...registerNotifications('orderNotifications')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Low Stock Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified when products are running low</p>
                      </div>
                      <input
                        type="checkbox"
                        {...registerNotifications('lowStockAlerts')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">New Customer Signups</h4>
                        <p className="text-sm text-gray-500">Get notified when new customers register</p>
                      </div>
                      <input
                        type="checkbox"
                        {...registerNotifications('customerSignups')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Payment Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified about payment issues</p>
                      </div>
                      <input
                        type="checkbox"
                        {...registerNotifications('paymentAlerts')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Frequency
                      </label>
                      <select
                        {...registerNotifications('emailFrequency')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="immediate">Immediate</option>
                        <option value="daily">Daily Digest</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button type="submit" loading={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </Card.Footer>
              </Card>
            </form>
          )}

          {activeTab === 'payments' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Stripe</p>
                            <p className="text-sm text-gray-500">Credit cards, digital wallets</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                          Connected
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Tax Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Default Tax Rate (%)" defaultValue="8.25" />
                      <Input label="Tax ID Number" defaultValue="123-45-6789" />
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">SMS Authentication</p>
                        <p className="text-sm text-gray-500">Receive codes via SMS</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">API Keys</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Public API Key</p>
                          <p className="text-sm text-gray-500 font-mono">pk_live_****1234</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Session Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="autoLogout"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoLogout" className="ml-2 text-sm text-gray-900">
                          Auto-logout after 30 minutes of inactivity
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="singleSession"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="singleSession" className="ml-2 text-sm text-gray-900">
                          Limit to single active session
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}