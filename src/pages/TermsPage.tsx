import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-white/80">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-6">
              By accessing and using Properties Professor's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access the materials (information or software) on Properties Professor's 
              website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer 
              of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on Properties Professor's website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Property Listings</h2>
            <p className="text-gray-600 mb-6">
              All property listings on Properties Professor are provided by property owners, builders, and real estate agents. 
              While we strive to ensure the accuracy of information, Properties Professor does not guarantee the accuracy, 
              completeness, or reliability of any property listing. Users are advised to verify all information independently.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Conduct</h2>
            <p className="text-gray-600 mb-4">Users agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and identification</li>
              <li>Not post false, misleading, or fraudulent listings</li>
              <li>Not engage in any activity that interferes with or disrupts the services</li>
              <li>Not use the service for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Payment Terms</h2>
            <p className="text-gray-600 mb-6">
              Properties Professor is a free listing platform. However, premium services and featured listings may be 
              available for a fee. All fees are non-refundable unless otherwise stated. Payment processing is handled 
              through secure third-party payment gateways.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 mb-6">
              The service and its original content, features, and functionality are and will remain the exclusive property 
              of Properties Professor and its licensors. The service is protected by copyright, trademark, and other laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              Properties Professor shall not be liable for any indirect, incidental, special, consequential, or punitive 
              damages resulting from your access to or use of, or inability to access or use the service. We do not warrant 
              that the service will be uninterrupted, timely, secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
            <p className="text-gray-600 mb-6">
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any 
              reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its 
              conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of courts in 
              Pune, Maharashtra.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
              provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change 
              will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>Email: propertiesproffer@gmail.com</li>
              <li>Phone: +91 91563 01600</li>
              <li>Address: Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
