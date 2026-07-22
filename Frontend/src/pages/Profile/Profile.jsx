import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react';
import clsx from 'clsx';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Input from '@/components/forms/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

const TABS = [
  { value: 'info', label: 'Profile Info' },
  { value: 'addresses', label: 'Addresses' },
];

function Profile() {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [addresses, setAddresses] = useState([]);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        setAddresses(res.data.data.addresses || []);
      } catch (error) {
        toast.error('Could not load addresses');
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: ROUTES.PROFILE }} replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-16">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="flex flex-col lg:flex-row gap-6">
        <DashboardSidebar />

        <div className="flex-1 min-w-0">
          <div className="flex gap-2 mb-5 border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={clsx(
                  'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === tab.value
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'info' ? (
            <ProfileInfoForm user={user} updateUser={updateUser} />
          ) : (
            <AddressesTab
              addresses={addresses}
              setAddresses={setAddresses}
              loading={loadingAddresses}
              formOpen={addressFormOpen}
              setFormOpen={setAddressFormOpen}
              editingAddressId={editingAddressId}
              setEditingAddressId={setEditingAddressId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileInfoForm({ user, updateUser }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await authService.updateProfile(formData);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 max-w-lg">
      <div className="relative">
        <User size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
        <Input label="Full name" className="pl-10" error={errors.name} {...register('name', { required: 'Name is required' })} />
      </div>

      <div className="relative">
        <Mail size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
        <Input label="Email address" value={user?.email || ''} disabled className="pl-10 bg-gray-50 text-gray-500" />
      </div>

      <div className="relative">
        <Phone size={16} className="absolute left-3.5 top-[42px] text-gray-400" />
        <Input
          label="Phone number"
          type="tel"
          className="pl-10"
          error={errors.phone}
          {...register('phone', { pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' } })}
        />
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  );
}

function AddressesTab({ addresses, setAddresses, loading, formOpen, setFormOpen, editingAddressId, setEditingAddressId }) {
  const editingAddress = addresses.find((a) => a._id === editingAddressId);

  const handleDelete = async (addressId) => {
    try {
      const res = await authService.deleteAddress(addressId);
      setAddresses(res.data.data);
      toast.success('Address removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete address');
    }
  };

  const handleSetDefault = async (address) => {
    try {
      const res = await authService.updateAddress(address._id, { isDefault: true });
      setAddresses(res.data.data);
    } catch (error) {
      toast.error('Could not update default address');
    }
  };

  if (formOpen) {
    return (
      <AddressForm
        initialData={editingAddress}
        onSaved={(updated) => {
          setAddresses(updated);
          setFormOpen(false);
          setEditingAddressId(null);
        }}
        onCancel={() => {
          setFormOpen(false);
          setEditingAddressId(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus size={15} /> Add New Address
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-400">Loading addresses…</div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <MapPin size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">{addr.label}</span>
                {addr.isDefault && <Badge variant="success">Default</Badge>}
              </div>
              <p className="text-sm text-gray-600">{addr.fullName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-gray-500 mt-1">Phone: {addr.phone}</p>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                <button
                  onClick={() => {
                    setEditingAddressId(addr._id);
                    setFormOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-[var(--color-primary)]"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-red-500"
                >
                  <Trash2 size={13} /> Delete
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-[var(--color-primary)] ml-auto"
                  >
                    <Check size={13} /> Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ initialData, onSaved, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialData || { label: 'Home' } });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = initialData
        ? await authService.updateAddress(initialData._id, formData)
        : await authService.addAddress(formData);
      onSaved(res.data.data);
      toast.success(initialData ? 'Address updated' : 'Address added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save address');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 max-w-lg">
      <h3 className="font-semibold text-gray-900">{initialData ? 'Edit Address' : 'Add New Address'}</h3>

      <Input label="Label (e.g. Home, Work)" error={errors.label} {...register('label', { required: 'Required' })} />
      <Input label="Full name" error={errors.fullName} {...register('fullName', { required: 'Required' })} />
      <Input
        label="Phone number"
        type="tel"
        error={errors.phone}
        {...register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number' } })}
      />
      <Input label="Address line 1" error={errors.line1} {...register('line1', { required: 'Required' })} />
      <Input label="Address line 2 (optional)" {...register('line2')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" error={errors.city} {...register('city', { required: 'Required' })} />
        <Input label="State" error={errors.state} {...register('state', { required: 'Required' })} />
      </div>
      <Input
        label="Pincode"
        error={errors.pincode}
        {...register('pincode', { required: 'Required', pattern: { value: /^[0-9]{6}$/, message: 'Enter a valid 6-digit pincode' } })}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Address'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default Profile;