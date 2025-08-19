'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { Business, BusinessCategory } from '../../types/localbase';
import { LocalBaseAPI } from '../../services/api';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';

interface EditBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  business: Business;
}

export function EditBusinessModal({ isOpen, onClose, onSuccess, business }: EditBusinessModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('services');
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [priceRange, setPriceRange] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  // Hours
  const [hours, setHours] = useState({
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' },
    wednesday: { open: '09:00', close: '18:00' },
    thursday: { open: '09:00', close: '18:00' },
    friday: { open: '09:00', close: '18:00' },
    saturday: { open: '09:00', close: '18:00' },
    sunday: { open: '09:00', close: '18:00' },
  });

  // Social links
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: ''
  });

  const { isConnected, address } = useAccount();

  // Initialize form with business data
  useEffect(() => {
    if (business && isOpen) {
      setBusinessName(business.name || '');
      setBusinessDescription(business.description || '');
      setBusinessCategory(business.category || 'services');
      setBusinessAddress(business.address || '');
      setPhoneNumber(business.phoneNumber || '');
      setEmail(business.email || '');
      setWebsite(business.website || '');
      setPriceRange(business.priceRange || '$$');
      setAvatarUrl(business.avatarUrl || '');
      setCoverUrl(business.coverUrl || '');
      const defaultHours = {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' },
      };
      setHours(business.hours ? { ...defaultHours, ...business.hours } : defaultHours);
      const defaultSocialLinks = {
        instagram: '',
        twitter: '',
        facebook: '',
        linkedin: ''
      };
      setSocialLinks(business.socialLinks ? { ...defaultSocialLinks, ...business.socialLinks } : defaultSocialLinks);
      setError(null);
    }
  }, [business, isOpen]);

  const categories: Array<{ id: BusinessCategory; label: string; icon: string }> = [
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'fun', label: 'Fun', icon: '🎬' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'beauty', label: 'Beauty', icon: '💄' },
  ];

  const validateForm = () => {
    if (!businessName.trim()) return 'Business name is required';
    if (!businessDescription.trim()) return 'Business description is required';
    if (!businessAddress.trim()) return 'Business address is required';
    if (email && !email.includes('@')) return 'Please enter a valid email address';
    if (website && !website.startsWith('http')) return 'Website must start with http:// or https://';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      setError('Please connect your wallet');
      return;
    }

    if (address !== business.owner) {
      setError('Only the business owner can edit this business');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedBusiness: Business = {
        ...business,
        name: businessName.trim(),
        description: businessDescription.trim(),
        category: businessCategory,
        address: businessAddress.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        priceRange,
        avatarUrl: avatarUrl.trim() || undefined,
        coverUrl: coverUrl.trim() || undefined,
        hours,
        socialLinks: {
          instagram: socialLinks.instagram.trim() || undefined,
          twitter: socialLinks.twitter.trim() || undefined,
          facebook: socialLinks.facebook.trim() || undefined,
          linkedin: socialLinks.linkedin.trim() || undefined,
        }
      };

      await LocalBaseAPI.updateBusiness(updatedBusiness);
      
      console.log('✅ Business updated successfully');
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Failed to update business:', error);
      setError(error instanceof Error ? error.message : 'Failed to update business');
    } finally {
      setLoading(false);
    }
  };

  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Business</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value as BusinessCategory)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value as '$' | '$$' | '$$$' | '$$$$')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="$">$ - Budget</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Expensive</option>
                      <option value="$$$$">$$$$ - Very Expensive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Images */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Images</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400 or emoji ☕"
                      disabled={loading}
                    />
                    {avatarUrl && (
                      <div className="mt-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {avatarUrl.startsWith('http') ? (
                            <Image src={avatarUrl} alt="Avatar preview" className="w-full h-full rounded-lg object-cover" width={64} height={64} />
                          ) : (
                            <span className="text-2xl">{avatarUrl}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"
                      disabled={loading}
                    />
                    {coverUrl && (
                      <div className="mt-2">
                        <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                          <Image src={coverUrl} alt="Cover preview" className="w-full h-full object-cover" fill sizes="(max-width: 768px) 100vw, 50vw" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Social Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://instagram.com/yourbusiness"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X (Twitter)
                    </label>
                    <input
                      type="url"
                      value={socialLinks.twitter}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://x.com/yourbusiness"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={socialLinks.facebook}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://facebook.com/yourbusiness"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={socialLinks.linkedin || ''}
                      onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/company/yourbusiness"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Business Hours</h3>
                
                <div className="space-y-3">
                  {Object.entries(hours).map(([day, dayHours]) => (
                    <div key={day} className="grid grid-cols-3 gap-2 items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                      <input
                        type="time"
                        value={dayHours.open}
                        onChange={(e) => updateHours(day, 'open', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                      <input
                        type="time"
                        value={dayHours.close}
                        onChange={(e) => updateHours(day, 'close', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
