import React, { useState } from 'react';
import { Layout } from '../shared/components/Layout';
import { GlassCard } from '../shared/components/GlassCard';
import { PremiumInput } from '../shared/components/PremiumInput';
import { LuxuryButton } from '../shared/components/LuxuryButton';
import { useAuth } from '../providers/AuthProvider';
import { useToast } from '../providers/ToastProvider';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    newPassword: '',
    phoneNumber: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // First Name - no numbers or special characters
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name should not contain numbers or special characters';
    }

    // Last Name - no numbers or special characters
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name should not contain numbers or special characters';
    }

    // Email - must be valid @gmail.com format
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.emailId)) {
      newErrors.emailId = 'Email must be a valid @gmail.com address (e.g. abc@gmail.com)';
    }

    // Password - min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        // Confirm Password
    if (!formData.newPassword) {
      newErrors.newPassword = 'Please confirm your password';
    } else if (formData.password !== formData.newPassword) {
      newErrors.newPassword = 'Passwords do not match';
    }

    // Phone Number - exactly 10 digits, starting with 6-9, block input beyond 10
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9][0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid 10-digit Indian mobile number starting with 6-9';
    }

    // Address - must not be null or empty
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 6) {
      newErrors.address = 'Address must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({
        emailId: formData.emailId,
        name: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
        newPassword: formData.newPassword,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      });
      showToast('Membership secured. Please login to enter.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast(err.response?.data?.errorMessage || 'Registration failed.', 'error');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' }); // clear error on change
  };

  return (
    <Layout>
      <div className="container py-5 d-flex justify-content-center align-items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-100"
          style={{ maxWidth: '550px' }}
        >
          <GlassCard className="p-5 border-0 soft-shadow text-center">
            <span className="sub-heading mb-3 d-block">Membership Application</span>
            <h2 className="mb-5">Join the Collection</h2>

            <form onSubmit={handleSubmit}>
              {/* Name Row */}
              <div className="row">
                <div className="col-md-6">
                  <PremiumInput
                    label="First Name"
                    placeholder="Alexander"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <PremiumInput
                    label="Last Name"
                    placeholder="Vanguard"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <PremiumInput
                label="Email Address"
                type="email"
                placeholder="alexander@vanguard.com"
                value={formData.emailId}
                onChange={handleChange('emailId')}
                required
              />

              {/* Password */}
              <PremiumInput
                label="Secure Passphrase"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange('password')}
                required
              />

              {/* Confirm Password */}
              <PremiumInput
                label="Confirm Passphrase"
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                required
              />
              {errors.newPassword && (
                <p className="text-danger small text-start mt-1">{errors.newPassword}</p>
              )}

              {/* Phone Number */}
              <PremiumInput
                label="Phone Number"
                type="tel"
                placeholder="9876543210"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                required
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="text-danger small text-start mt-1">{errors.phoneNumber}</p>
              )}

              {/* Address */}
              <div className="mb-3 text-start">
                <label className="form-label small fw-semibold">Delivery Address</label>
                <textarea
                  className="form-control"
                  placeholder="123 Luxury Lane, Mumbai"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange('address')}
                  required
                  minLength={6}
                  maxLength={200}
                />
                {errors.address && (
                  <p className="text-danger small mt-1">{errors.address}</p>
                )}
              </div>

              {/* Terms */}
              <div className="mb-4 text-start">
                <div className="form-check small">
                  <input className="form-check-input" type="checkbox" id="terms" required />
                  <label className="form-check-label text-secondary" htmlFor="terms">
                    I accept the <a href="#" className="text-dark">terms of boutique service</a>
                  </label>
                </div>
              </div>

              <LuxuryButton variant="gold" className="w-100 py-3 mb-4" type="submit">
                Complete Application
              </LuxuryButton>
            </form>

            <p className="text-secondary small">
              Already a member?{' '}
              <Link to="/login" className="text-gold fw-bold text-decoration-none">
                Access Account
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;