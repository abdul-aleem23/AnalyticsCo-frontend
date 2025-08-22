import React from 'react'
import { ShieldCheckIcon, EyeIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-1">
                QR Analytics Platform - Data Processing Information
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            🛡️ Your Privacy at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <EyeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Anonymous Tracking</p>
                <p className="text-xs text-blue-700">No personal identification possible</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">30-Day Retention</p>
                <p className="text-xs text-blue-700">Automatic data anonymization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="space-y-8">
          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. What Data We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">When You Scan a QR Code:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li><strong>Timestamp:</strong> When you scanned the code</li>
                  <li><strong>City Location:</strong> Your approximate city (not precise address)</li>
                  <li><strong>Device Type:</strong> Mobile, desktop, or tablet</li>
                  <li><strong>Anonymous ID:</strong> A random identifier (not linked to you personally)</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>✅ We DO NOT collect:</strong> Your name, email, phone number, precise location, 
                  browsing history, or any personally identifiable information.
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Why We Collect This Data
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Legitimate Interest (GDPR Article 6(1)(f))</h3>
              <p className="text-gray-600 mb-3">
                We process this data to provide marketing analytics for physical advertising campaigns. 
                This helps businesses understand the effectiveness of their flyers, posters, and QR code campaigns.
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>Track campaign performance and ROI</li>
                <li>Understand geographic reach of marketing materials</li>
                <li>Analyze device preferences for better campaign optimization</li>
                <li>Provide anonymous analytics to marketing agencies and businesses</li>
              </ul>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. How We Protect Your Privacy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Anonymous Processing</h3>
                    <p className="text-sm text-gray-600">
                      Your data is processed without any personal identifiers. We cannot trace activities back to individuals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Data Retention</h3>
                    <p className="text-sm text-gray-600">
                      Data is automatically anonymized after 30 days and deleted after campaign completion.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <EyeIcon className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Limited Geolocation</h3>
                    <p className="text-sm text-gray-600">
                      We only collect city-level location data, never your precise address or coordinates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-800">Secure Processing</h3>
                    <p className="text-sm text-gray-600">
                      All data is encrypted and processed on secure servers with industry-standard protection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Your Rights Under GDPR
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Even though our data collection is anonymous, you still have rights regarding data processing:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Right to Information</h3>
                  <p className="text-sm text-blue-700">
                    This policy explains how your data is processed
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Right to Object</h3>
                  <p className="text-sm text-green-700">
                    You can opt out of future tracking by avoiding QR codes
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">Right to Erasure</h3>
                  <p className="text-sm text-purple-700">
                    Data is automatically deleted after campaigns end
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-medium text-orange-900 mb-2">Right to Portability</h3>
                  <p className="text-sm text-orange-700">
                    Request export of any data associated with you
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Contact & Data Requests
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Data Protection Officer</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Email:</strong> privacy@yourmarketingagency.com</p>
                <p><strong>Response Time:</strong> Within 30 days of request</p>
                <p><strong>Available Requests:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Data access requests</li>
                  <li>Data deletion requests</li>
                  <li>Data export requests</li>
                  <li>Processing objection requests</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Due to the anonymous nature of our data collection, 
                  we may not be able to identify specific data belonging to you without additional information.
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Updates to This Policy
            </h2>
            <p className="text-gray-600 mb-4">
              This privacy policy was last updated on {new Date().toLocaleDateString()}. 
              We may update this policy periodically to reflect changes in our practices or legal requirements.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Current Version:</strong> 1.0 - Initial GDPR-compliant policy
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>QR Analytics Platform - Privacy-First Marketing Analytics</p>
            <p className="mt-2">
              Questions about this policy? Contact us at: privacy@yourmarketingagency.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy