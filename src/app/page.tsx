"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  AtomIcon, 
  SparklesIcon, 
  TrendingUpIcon,
  FlaskConicalIcon,
  DatabaseIcon,
  NetworkIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
  ZapIcon,
  ShieldCheckIcon,
  BrainCircuitIcon,
  MicroscopeIcon,
  RocketIcon,
  GraduationCapIcon,
  LineChartIcon
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (session) {
      router.push("/model");
    }
  }, [session, router]);

  useEffect(() => {
    // GSAP animations for hero section
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-cta",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.4, ease: "back.out(1.7)" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <BrainCircuitIcon className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description: "Leverage cutting-edge NVIDIA MolMIM technology to generate novel molecular structures with unprecedented accuracy.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <DatabaseIcon className="w-8 h-8" />,
      title: "Massive Database",
      description: "Access 50,000+ compounds with comprehensive bioactivity data from PubChem and proprietary sources.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <LineChartIcon className="w-8 h-8" />,
      title: "Bioactivity Analysis",
      description: "Analyze compound bioactivity with real-time data visualization and predictive modeling capabilities.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <NetworkIcon className="w-8 h-8" />,
      title: "Research Collaboration",
      description: "Connect with researchers worldwide, share findings, and accelerate discovery through collaboration.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance to pharmaceutical research standards and regulations.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <ZapIcon className="w-8 h-8" />,
      title: "Real-time Processing",
      description: "Experience lightning-fast molecular generation and analysis with our optimized cloud infrastructure.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Molecules Generated", icon: <AtomIcon className="w-6 h-6" /> },
    { value: "94.2%", label: "Success Rate", icon: <TrendingUpIcon className="w-6 h-6" /> },
    { value: "500+", label: "Active Researchers", icon: <UsersIcon className="w-6 h-6" /> },
    { value: "15+", label: "Countries Worldwide", icon: <GraduationCapIcon className="w-6 h-6" /> }
  ];

  const benefits = [
    "Accelerate drug discovery by up to 10x",
    "Reduce research costs significantly",
    "Access state-of-the-art AI models",
    "Collaborate with global research community",
    "Real-time bioactivity predictions",
    "Comprehensive molecular visualization"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-gradient-shift"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50"></div>
        <div className="relative container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <AtomIcon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Atomica
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI Drug Discovery</p>
              </div>
            </motion.div>
            
            {/* Desktop Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center space-x-1"
            >
              <a href="#features" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Features
              </a>
              <a href="#benefits" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Benefits
              </a>
              <a href="#pricing" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Pricing
              </a>
              <a href="#about" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                About
              </a>
              <a href="#contact" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Contact
              </a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <Link href="/auth-page/signin" className="hidden sm:block">
                <button className="px-5 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth-page/signup">
                <button className="group relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105">
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-24"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-300 dark:border-purple-700">
              <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Powered by NVIDIA AI & PubChem
              </span>
            </div>
          </motion.div>

          <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              Revolutionize
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              Drug Discovery
            </span>
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI to generate novel molecules, analyze bioactivity, and accelerate pharmaceutical research at unprecedented speed.
          </p>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link href="/auth-page/signup">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
              <MicroscopeIcon className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Floating Animation Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative mx-auto w-full max-w-3xl mt-16"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="relative w-full h-auto rounded-3xl shadow-2xl shadow-purple-500/20"
              >
                <source src="/images/floating_animation.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <RocketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Powerful Features
              </span>
            </div>
          </motion.div>
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Innovate</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools designed for modern pharmaceutical research and drug discovery
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              ></div>
              <div className="h-full p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-2xl">
                <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Why Choose Atomica?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join the revolution in pharmaceutical research with our cutting-edge platform that combines AI, big data, and collaborative tools.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircleIcon className="w-6 h-6 text-green-300 flex-shrink-0" />
                    <span className="text-white text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-2xl text-gray-900 shadow-xl">
                  94.2%
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Success Rate</h3>
                <p className="text-purple-100 mb-6">
                  Our AI models achieve industry-leading accuracy in molecular generation and bioactivity prediction.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Model Accuracy</span>
                    <span className="text-white font-bold">94.2%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full" style={{ width: "94.2%" }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">User Satisfaction</span>
                    <span className="text-white font-bold">98.5%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full" style={{ width: "98.5%" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Transform Your Research?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of researchers accelerating drug discovery with Atomica's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/auth-page/signup">
                <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </Link>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black text-white py-16 border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-lg opacity-50"></div>
                  <AtomIcon className="w-10 h-10 text-white relative" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Atomica
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                AI-powered drug discovery platform accelerating pharmaceutical research through innovative molecular generation and bioactivity analysis.
              </p>
              <div className="flex space-x-3">
                <a href="https://github.com/krishna25092005" target="_blank" rel="noopener noreferrer" 
                   className="w-11 h-11 bg-gray-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="w-11 h-11 bg-gray-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-11 h-11 bg-gray-800/80 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></span>
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/model" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    <span>Molecule Generation</span>
                  </Link>
                </li>
                <li>
                  <Link href="/molecule-bank" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    <span>Molecule Bank</span>
                  </Link>
                </li>
                <li>
                  <Link href="/model?tab=bioactivity" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    <span>Bioactivity Analysis</span>
                  </Link>
                </li>
                <li>
                  <Link href="/research" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    <span>Research Hub</span>
                  </Link>
                </li>
                <li>
                  <Link href="/message" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                    <span>Messages</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></span>
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>Documentation</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>API Reference</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>Research Papers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>Case Studies</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    <span>Support Center</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full mr-3"></span>
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    <span>Careers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    <span>Blog</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    <span>Contact</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group">
                    <ArrowRightIcon className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform" />
                    <span>Partners</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-gray-300 text-sm">
                © 2025 Atomica. Built with <span className="text-red-500">❤️</span> for the scientific community. All rights reserved.
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a href="#" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  Privacy Policy
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  Terms of Service
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  Cookie Policy
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-all duration-300">
                  License
                </a>
              </div>
            </div>

            {/* Credits */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800/50 to-gray-800/30 rounded-full border border-gray-700/50">
                <span className="text-gray-400 text-sm">Powered by</span>
                <span className="text-purple-400 font-semibold text-sm">NVIDIA AI</span>
                <span className="text-gray-600">•</span>
                <span className="text-blue-400 font-semibold text-sm">PubChem</span>
                <span className="text-gray-600">•</span>
                <span className="text-green-400 font-semibold text-sm">RDKit</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, 50px); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
