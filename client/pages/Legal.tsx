import React from 'react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';

interface LegalProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  pageType: 'terms' | 'privacy' | 'cookies' | 'data-processing';
}

export const Legal: React.FC<LegalProps> = ({ onNavigate, onEnterApp, pageType }) => {
  const getPageContent = () => {
    switch (pageType) {
      case 'terms':
        return {
          title: "Terms of Service",
          lastUpdated: "May 30, 2026",
          content: (
            <div className="space-y-6 text-slate-600 dark:text-zinc-400">
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                <p>By accessing or using the Starset Intelligence platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. The Service is operated by Starset Intelligence Inc.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Contributor Obligations</h2>
                <p>As a contributor, you agree to provide accurate, honest, and high-quality data submissions. You acknowledge that:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>You are at least 18 years of age.</li>
                  <li>You will not use automated scripts, bots, or AI to complete tasks.</li>
                  <li>You will maintain the confidentiality of any proprietary data or information you encounter during tasks.</li>
                  <li>Your submitted data is original and you have the right to submit it.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Compensation and Payouts</h2>
                <p>Starset Intelligence compensates contributors based on successfully validated tasks. Payment is calculated per task or per hour as indicated on the task brief. We reserve the right to reject submissions that do not meet our quality standards, and such submissions will not be compensated.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Intellectual Property</h2>
                <p>Upon submission and acceptance of a task, you assign all rights, title, and interest, including intellectual property rights, in and to the submitted data to Starset Intelligence. You waive any moral rights you may have in the submitted data.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Termination</h2>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Quality control failures or fraudulent activity will result in immediate termination.</p>
              </section>
            </div>
          )
        };
      case 'privacy':
        return {
          title: "Privacy Policy",
          lastUpdated: "May 30, 2026",
          content: (
            <div className="space-y-6 text-slate-600 dark:text-zinc-400">
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
                <p>When you register as a contributor on Starset Intelligence, we collect personal information including but not limited to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Name, email address, and demographic information.</li>
                  <li>Payment details (UPI ID, Bank Account details) for compensation.</li>
                  <li>Device and browser information, IP address, and platform usage data.</li>
                  <li>Data you actively submit as part of tasks (e.g., audio recordings, images).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Your Information</h2>
                <p>We use the collected information for various purposes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>To provide and maintain our Service.</li>
                  <li>To notify you about changes to our Service.</li>
                  <li>To process compensation payments.</li>
                  <li>To verify your identity and prevent fraudulent activity.</li>
                  <li>To train and improve artificial intelligence models (only using data submitted explicitly for tasks).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Data Sharing and Disclosure</h2>
                <p>We do not sell your personal data to third parties. We may share your data with trusted partners and service providers who assist us in operating our platform, conducting our business, or processing payments, so long as those parties agree to keep this information confidential.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Security</h2>
                <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
              </section>
            </div>
          )
        };
      case 'cookies':
        return {
          title: "Cookie Policy",
          lastUpdated: "May 30, 2026",
          content: (
            <div className="space-y-6 text-slate-600 dark:text-zinc-400">
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. What Are Cookies</h2>
                <p>Cookies are small files that are placed on your computer, mobile device or any other device by a website, containing the details of your browsing history on that website among its many uses.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Cookies</h2>
                <p>Starset Intelligence uses cookies for several reasons:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required to authenticate users and prevent fraudulent use of user accounts.</li>
                  <li><strong>Preference Cookies:</strong> Used to remember information that changes the way the platform behaves or looks, such as your "remember me" functionality.</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our platform by collecting and reporting information anonymously.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Your Choices Regarding Cookies</h2>
                <p>If you prefer to avoid the use of cookies on the Website, first you must disable the use of cookies in your browser and then delete the cookies saved in your browser associated with this website. You may use this option for preventing the use of cookies at any time. However, this may downgrade or 'break' certain elements of the platform's functionality.</p>
              </section>
            </div>
          )
        };
      case 'data-processing':
        return {
          title: "Data Processing Agreement",
          lastUpdated: "May 30, 2026",
          content: (
            <div className="space-y-6 text-slate-600 dark:text-zinc-400">
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Scope and Applicability</h2>
                <p>This Data Processing Agreement ("DPA") applies to the processing of personal data by Starset Intelligence in the context of providing the platform to you and collecting training data for Artificial Intelligence models.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Nature of Processing</h2>
                <p>The processing of data consists of collecting, recording, organizing, structuring, storing, adapting, retrieving, and transmitting data specifically for the purpose of training, fine-tuning, and evaluating machine learning and AI models.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Anonymization and De-identification</h2>
                <p>Starset Intelligence is committed to minimizing the processing of personally identifiable information (PII). Any data submitted as part of a task that contains accidental PII will undergo automated and manual de-identification processes before being utilized in model training pipelines.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Sub-processors</h2>
                <p>You agree that Starset Intelligence may engage third-party sub-processors (such as cloud hosting providers and payment processors) to process data on our behalf. We ensure that such sub-processors are bound by written agreements that require them to provide at least the level of data protection required by this DPA.</p>
              </section>
            </div>
          )
        };
      default:
        return {
          title: "Legal Information",
          lastUpdated: "",
          content: <div>Information not available.</div>
        };
    }
  };

  const page = getPageContent();

  return (
    <PublicLayout currentPage={pageType} onNavigate={onNavigate} onEnterApp={onEnterApp}>
      <div className="pt-32 pb-24 relative overflow-hidden min-h-screen">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 dark:bg-blue-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 dark:bg-indigo-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{page.title}</h1>
            <p className="text-slate-500 dark:text-zinc-400">Last Updated: {page.lastUpdated}</p>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
            {page.content}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
