import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const CATEGORIES = ['Technology', 'Business', 'Sports', 'Medicine', 'Science', 'WorldNews'];

export default function RegisterForm({ onBackToLogin }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    interests: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInterestToggle = (category) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(category)
        ? prev.interests.filter(i => i !== category)
        : [...prev.interests, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      setStep(2);
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    try {
      await register(formData.email, formData.name, formData.password, formData.interests);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold mb-2 bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            INFOBYTE
          </h1>
          <p className="text-gray-400">Join your personalized news feed</p>
        </div>

        <div className="bg-navy-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">
            {step === 1 ? 'Create Account' : 'Choose Your Interests'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-navy-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent-blue transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-400 text-sm mb-4">
                  Select categories you're interested in to personalize your feed
                </p>
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleInterestToggle(category)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      formData.interests.includes(category)
                        ? 'border-accent-blue bg-accent-blue/10 text-white'
                        : 'border-gray-600 bg-navy-700 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating Account...' : step === 1 ? 'Next' : 'Complete Registration'}
              </Button>
            </div>
          </form>

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={onBackToLogin}
                  className="text-accent-blue hover:text-blue-400 font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}