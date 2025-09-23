'use client'
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import BlurText from '../components/ui/BlurText';
import styles from './LandingPage.module.css';
import {
  Sparkles,
  BarChart3,
  Rocket,
  Link,
  TrendingUp,
  Play
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { value: "94%", label: "Team Happiness" },
    { value: "87%", label: "Energy Level" },
    { value: "12/14", label: "Participation" },
    { value: "Low", label: "Burnout Risk" }
  ];

  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "AI-Powered Insights",
      description: "Advanced sentiment analysis and machine learning recommendations",
      color: "var(--primary)"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Real-Time Analytics",
      description: "Live dashboards with beautiful visualizations and trends",
      color: "var(--accent)"
    },
    {
      icon: <Rocket size={24} />,
      title: "Quick Check-ins",
      description: "Submit daily mood and energy in seconds with voice or text",
      color: "var(--positive)"
    },
    {
      icon: <Link size={24} />,
      title: "Team Collaboration",
      description: "Real-time collaboration tools and team presence tracking",
      color: "var(--negative)"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroIcon}
          >
            <Sparkles size={40} />
          </motion.div>

          <BlurText
            text="Transform Your Team's Wellness Journey"
            delay={150}
            animateBy="words"
            direction="top"
            className={styles.heroTitle}
          />

          <BlurText
            text="Illuminate your team's wellness with light, clarity, and subtle energy. Experience the weightless, transparent UI that makes insights glow."
            delay={50}
            animateBy="words"
            direction="bottom"
            className={styles.heroSubtitle}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className={styles.heroActions}
          >
            <Button onClick={onGetStarted} size="lg" className={styles.primaryButton}>
              <Rocket size={20} />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className={styles.secondaryButton}>
              <Play size={20} />
              Watch Demo
            </Button>
          </motion.div>
        </div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className={styles.heroStats}
        >
          <div className={styles.statsCard}>
            <div className={styles.statsHeader}>
              <TrendingUp size={20} className={styles.statsIcon} />
              <h3>Live Team Metrics</h3>
            </div>
            <div className={styles.statsContent}>
              <motion.div
                key={currentStat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.statValue}
              >
                {stats[currentStat].value}
              </motion.div>
              <div className={styles.statLabel}>{stats[currentStat].label}</div>
            </div>
            <div className={styles.statsIndicator}>
              {stats.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.indicator} ${
                    index === currentStat ? styles.active : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <BlurText
            text="Everything you need for team wellness"
            delay={100}
            animateBy="words"
            className={styles.featuresTitle}
          />
          <BlurText
            text="Comprehensive tools designed to keep your team healthy, happy, and productive"
            delay={80}
            animateBy="words"
            className={styles.featuresSubtitle}
          />
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={styles.featureCard}
            >
              <div
                className={styles.featureIcon}
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <div className={styles.featureLink}>
                Learn more →
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={styles.ctaCard}
        >
          <BlurText
            text="Ready to illuminate your team's potential?"
            delay={100}
            animateBy="words"
            className={styles.ctaTitle}
          />
          <BlurText
            text="Join thousands of teams already using Team Pulse to create healthier, more productive workplaces."
            delay={60}
            animateBy="words"
            className={styles.ctaSubtitle}
          />
          <Button
            onClick={onGetStarted}
            size="lg"
            className={styles.ctaButton}
          >
            <Sparkles size={20} />
            Start Your Journey
          </Button>
        </motion.div>
      </section>
    </div>
  );
}