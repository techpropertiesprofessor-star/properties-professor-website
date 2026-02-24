import { Navigation } from '@/components/Navigation';
import { Footer } from '@/sections/Footer';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-r from-[#1E3A5F] to-[#2d4a6f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/80">Last updated: February 12, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              At Properties Professor, we are committed to protecting your privacy. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <p className="text-gray-600 mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Register on the website</li>
              <li>Express interest in obtaining information about us or our products and services</li>
              <li>Participate in activities on the website</li>
              <li>Contact us for inquiries or support</li>
            </ul>
            <p className="text-gray-600 mb-6">
              This information may include: name, email address, phone number, address, payment information, and 
              property preferences.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">We automatically collect certain information when you visit our website:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring/exit pages</li>
              <li>Clickstream data</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service, updates, and marketing purposes</li>
              <li>Process your transactions and send related information</li>
              <li>Find and prevent fraud and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-600 mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li><strong>Property Owners and Agents:</strong> When you express interest in a property</li>
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
              <li><strong>Business Partners:</strong> With your consent for joint marketing purposes</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-6">
              We use cookies and similar tracking technologies to track activity on our service and store certain 
              information. Cookies are files with a small amount of data which may include an anonymous unique identifier. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Privacy Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Third-Party Links</h2>
            <p className="text-gray-600 mb-6">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices 
              or content of these third-party sites. We encourage you to review their privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
              information from children under 18. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
              Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have any questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>Email: propertiesproffer@gmail.com</li>
              <li>Phone: +91 91563 01600</li>
              <li>Address: Pune, Maharashtra, India</li>
            </ul>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Your Data is Safe With Us</h3>
                  <p className="text-gray-600 text-sm">
                    We employ industry-standard security measures to protect your personal information and regularly 
                    update our security protocols to ensure your data remains secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
