import React, { useEffect, useRef } from 'react';
import { Users, Award, Globe, CheckCircle2, IndianRupee, Smartphone, ArrowRight, Zap, Clock, Shield } from 'lucide-react';
import { PublicLayout, PublicPageType } from '../components/PublicLayout';
import { Button } from '../components/Button';
import { useInView } from 'framer-motion';

interface PageProps {
  onNavigate: (page: PublicPageType) => void;
  onEnterApp: () => void;
}

export const Contributors: React.FC<PageProps> = ({ onNavigate, onEnterApp }) => {
  return (
    <PublicLayout
      currentPage="contributors"
      onNavigate={onNavigate}
      onEnterApp={onEnterApp}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">


              <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                <span className="text-slate-900 dark:text-white">Work on </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">
                  Your Terms.
                </span>
              </h1>

              <p className="text-xl text-zinc-400 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                Turn your spare time into income. Complete simple digital tasks from anywhere,
                get paid instantly. <span className="text-white font-bold">No experience required.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button
                  onClick={onEnterApp}
                  variant="glow"
                  className="px-10 py-4 text-lg font-bold group h-16 rounded-2xl"
                >
                  Start Earning Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  onClick={() => onNavigate('about')}
                  variant="ghost"
                  className="px-10 py-4 text-lg font-bold text-zinc-300 hover:text-white transition-all h-16 rounded-2xl border-2 border-white/10"
                >
                  Learn More
                </Button>
              </div>

              <div className="mt-16 flex items-center justify-center lg:justify-start gap-12">
                <CountUpStat end={1} suffix="K+" label="Paid to contributors" prefix="₹" />
                <div className="h-12 w-px bg-white/10" />
                <CountUpStat end={4.8} suffix="★" label="Average rating" decimals={1} />
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="space-y-6">
                  <StatCard
                    icon={IndianRupee}
                    value="₹50-100"
                    label="Per hour average"
                    color="emerald"
                  />

                  <StatCard
                    icon={Clock}
                    value="2-5 min"
                    label="Typical task time"
                    color="blue"
                  />
                </div>

                <div className="space-y-6 pt-12">
                  <StatCard
                    icon={Smartphone}
                    value="Mobile"
                    label="Friendly platform"
                    color="purple"
                  />

                  <StatCard
                    icon={Shield}
                    value="Secure"
                    label="Payment system"
                    color="indigo"
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
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Why Contributors Choose Us
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Flexible work that fits your lifestyle. Simple tasks, <span className="text-blue-400">transparent pay</span>, instant earnings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Anywhere, Anytime",
                desc: "Work from your phone while waiting for the bus or from your laptop at home. Complete tasks in minutes whenever you have spare time.",
                color: "blue"
              },
              {
                icon: IndianRupee,
                title: "Clear Pay Rates",
                desc: "See exactly what you'll earn before starting. No hidden fees, no surprise deductions. Track your earnings in real-time.",
                color: "emerald"
              },
              {
                icon: Globe,
                title: "Everyone Welcome",
                desc: "We value diverse perspectives from all backgrounds and languages. Your unique viewpoint helps make AI safer and smarter.",
                color: "purple"
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
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-zinc-400 font-medium">
              From signup to earning in under <span className="text-blue-400 font-bold">5 minutes</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Create Account",
                desc: "Sign up in 30 seconds. It's completely free and no credit card required.",
                icon: Users,
                color: "indigo"
              },
              {
                num: "02",
                title: "Pick a Task",
                desc: "Browse available tasks in Audio, Image, or Text categories. Choose what fits you.",
                icon: CheckCircle2,
                color: "blue"
              },
              {
                num: "03",
                title: "Do the Work",
                desc: "Follow simple instructions like 'Read this sentence' or 'Label this object'.",
                icon: Award,
                color: "purple"
              },
              {
                num: "04",
                title: "Get Paid",
                desc: "Money goes to your wallet instantly after approval. Cash out immediately via UPI.",
                icon: IndianRupee,
                color: "emerald"
              }
            ].map((step, idx) => (
              <StepCard key={step.num} step={step} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-24 bg-slate-50/50 dark:bg-zinc-950/50 backdrop-blur-md border-y border-slate-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-7xl font-black mb-8 leading-tight tracking-tighter">
            <span className="text-slate-900 dark:text-white">Ready to Start </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 dark:from-blue-600 dark:via-blue-500 dark:to-blue-600 animate-shimmer drop-shadow-md">Earning?</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-12 font-medium">
            Join thousands of contributors making money on their own schedule without any hassle.
          </p>

          <div>
            <Button
              onClick={onEnterApp}
              variant="glow"
              className="px-14 py-6 text-2xl font-black group rounded-2xl shadow-xl"
            >
              Create Free Account
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>

          <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em] mt-8">
            No credit card • Instant start • Free forever
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
      <div className="text-3xl font-bold text-white">
        {prefix}{count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  color: 'blue' | 'emerald' | 'purple' | 'indigo';
}> = ({ icon: Icon, value, label, color }) => {
  const colorStyles = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40',
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40'
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-all duration-300 group hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colorStyles[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
};

const FeatureCard: React.FC<{
  feature: {
    icon: React.ElementType;
    title: string;
    desc: string;
    color: string;
  };
}> = ({ feature }) => {
  const colorMap: any = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-white/10',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-white/10',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-white/10',
  };

  return (
    <div className={`bg-white dark:bg-zinc-900/50 backdrop-blur-md p-10 rounded-[2.5rem] border shadow-sm dark:shadow-none ${colorMap[feature.color] || 'border-slate-200 dark:border-white/10'} transition-all duration-500 hover:-translate-y-2 group`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${colorMap[feature.color] || 'bg-slate-50 dark:bg-white/5'}`}>
        <feature.icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
        {feature.title}
      </h3>
      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
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
    color: string;
  };
}> = ({ step }) => {
  return (
    <div className="relative group">
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none">
        <div className="text-5xl font-black text-black dark:text-white/10 mb-6 tracking-tighter">
          {step.num}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 border border-slate-200 dark:border-white/10">
          <step.icon className={`w-7 h-7 ${step.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : step.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
          {step.title}
        </h3>

        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
          {step.desc}
        </p>
      </div>
    </div>
  );
};
