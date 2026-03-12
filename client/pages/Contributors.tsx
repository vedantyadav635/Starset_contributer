import React, { useEffect, useRef } from 'react';
import { Users, Award, Globe, CheckCircle2, IndianRupee, Smartphone, ArrowRight, Zap, Clock, Shield } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { useInView } from 'framer-motion';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Contributors: React.FC<PageProps> = ({ onNavigate, onEnterApp, isDark, toggleTheme }) => {
  return (
    <PublicLayout
      currentPage="contributors"
      onNavigate={onNavigate}
      onEnterApp={onEnterApp}
      isDark={isDark}
      toggleTheme={toggleTheme}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <Zap className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Our goal is to join 100,000+ contributors worldwide
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Work on
                <span className="block mt-2 text-gray-600 dark:text-gray-400">
                  Your Terms
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Turn your spare time into income. Complete simple tasks from anywhere,
                get paid instantly. No experience required.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onEnterApp}
                  className="bg-gray-900 dark:bg-white text-white dark:text-white-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-8 py-4 text-lg font-semibold group"
                >
                  Start Earning Now
                  <ArrowRight className="w-5 h-5 ml-2 text-white group-hover:translate-x-1 transition-transform" />
                </Button>

                <button
                  onClick={() => onNavigate('about')}
                  className="px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Learn More
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <CountUpStat end={1} suffix="K+" label="Paid to contributors" prefix="₹" />
                <div className="h-12 w-px bg-gray-300 dark:bg-gray-700" />
                <CountUpStat end={4.8} suffix="★" label="Average rating" decimals={1} />
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <StatCard
                    icon={IndianRupee}
                    value="₹50-100"
                    label="Per hour average"
                  />

                  <StatCard
                    icon={Clock}
                    value="2-5 min"
                    label="Typical task time"
                  />
                </div>

                <div className="space-y-4 pt-8">
                  <StatCard
                    icon={Smartphone}
                    value="Mobile"
                    label="Friendly platform"
                  />

                  <StatCard
                    icon={Shield}
                    value="Secure"
                    label="Payment system"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Contributors Choose Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Flexible work that fits your lifestyle. Simple tasks, transparent pay, instant earnings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Anywhere, Anytime",
                desc: "Work from your phone while waiting for the bus or from your laptop at home. Complete tasks in minutes whenever you have spare time."
              },
              {
                icon: IndianRupee,
                title: "Clear Pay Rates",
                desc: "See exactly what you'll earn before starting. No hidden fees, no surprises. Track your earnings in real-time."
              },
              {
                icon: Globe,
                title: "Everyone Welcome",
                desc: "We value diverse perspectives from all backgrounds and languages. Your unique viewpoint helps make AI better for everyone."
              }
            ].map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From signup to earning in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Create Account",
                desc: "Sign up in 30 seconds. It's completely free and no credit card required.",
                icon: Users
              },
              {
                num: "02",
                title: "Pick a Task",
                desc: "Browse available tasks in Audio, Image, or Text categories. Choose what interests you.",
                icon: CheckCircle2
              },
              {
                num: "03",
                title: "Do the Work",
                desc: "Follow simple instructions like 'Read this sentence' or 'Describe this image'.",
                icon: Award
              },
              {
                num: "04",
                title: "Get Paid",
                desc: "Money goes to your wallet instantly after approval. Cash out anytime.",
                icon: IndianRupee
              }
            ].map((step, idx) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24 bg-gray-900/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of contributors making money on their own schedule.
          </p>

          <div>
            <Button
              onClick={onEnterApp}
              className="bg-white text-white-900 hover:bg-gray-100 px-10 py-5 text-lg font-semibold group"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            No credit card required • Get started in under 1 minute
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

// Reusable Components

const CountUpStat: React.FC<{
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ end, label, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 2000;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(end * easeOutQuart);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, end]);

  return (
    <div ref={ref}>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">
        {prefix}{count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
}> = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 transition-transform hover:scale-110">
        <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
};

const FeatureCard: React.FC<{
  feature: {
    icon: React.ElementType;
    title: string;
    desc: string;
  };
}> = ({ feature }) => {
  return (
    <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-white/20 transition-all cursor-pointer hover:-translate-y-2">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6 transition-transform hover:scale-110">
        <feature.icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {feature.desc}
      </p>
    </div>
  );
};

const StepCard: React.FC<{
  step: {
    num: string;
    title: string;
    desc: string;
    icon: React.ElementType;
  };
}> = ({ step }) => {
  return (
    <div className="relative">
      <div className="flex flex-col h-full">
        <div className="text-5xl font-bold text-gray-200 dark:text-gray-800 mb-4 opacity-50">
          {step.num}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-6 transition-transform hover:scale-110">
          <step.icon className="w-7 h-7 text-white dark:text-gray-900" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {step.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {step.desc}
        </p>
      </div>
    </div>
  );
};