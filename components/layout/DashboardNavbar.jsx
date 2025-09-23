'use client'

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpenIcon, InfoIcon, LifeBuoyIcon } from "lucide-react";

import Logo from "../navbar-components/logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ModeToggle from '../ModeToggle';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/dashboard", label: "Overview" },
  {
    label: "Features",
    submenu: true,
    type: "description",
    items: [
      {
        href: "/dashboard/checkins",
        label: "Check-ins",
        description: "Track team wellness through regular check-ins.",
      },
      {
        href: "/dashboard/analytics",
        label: "Analytics",
        description: "View detailed analytics and insights.",
      },
      {
        href: "/dashboard/insights",
        label: "Insights",
        description: "Get AI-powered insights about your team.",
      },
    ],
  },
  {
    label: "Team",
    submenu: true,
    type: "simple",
    items: [
      { href: "/dashboard/teams", label: "Team Management" },
      { href: "/dashboard/members", label: "Team Members" },
      { href: "/dashboard/roles", label: "Roles & Permissions" },
    ],
  },
  {
    label: "Help",
    submenu: true,
    type: "icon",
    items: [
      { href: "#", label: "Getting Started", icon: "BookOpenIcon" },
      { href: "#", label: "Support", icon: "LifeBuoyIcon" },
      { href: "#", label: "About", icon: "InfoIcon" },
    ],
  },
];

export default function DashboardNavbar({
  logoHref = "#",
  userName,
  userEmail,
  userAvatar,
  notificationCount = 3,
  onNavItemClick,
  onInfoItemClick,
  onNotificationItemClick,
  onUserItemClick,
  onMenuToggle,
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Determine current page type
  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/auth';
  const isDashboardPage = pathname?.startsWith('/dashboard');

  const handleNavItemClick = (href) => {
    if (onNavItemClick) {
      onNavItemClick(href);
    } else {
      router.push(href);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header
      className={`${
        isDashboardPage
          ? "w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6"
          : "w-full mt-4"
      }`}
    >
      <div
        className={`${
          isDashboardPage
            ? "flex h-16 items-center justify-between gap-4"
            : "mx-auto w-[70%] flex h-16 items-center justify-between gap-4 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-2xl"
        }`}
      >
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger - only show on dashboard */}
          {isDashboardPage && onMenuToggle && (
            <Button
              className="group size-8 lg:hidden"
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
            >
              <svg
                className="pointer-events-none"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 12L20 12" />
                <path d="M4 6L20 6" />
                <path d="M4 18L20 18" />
              </svg>
            </Button>
          )}

          {/* Main nav */}
          <div className="flex items-center gap-6">
            <a
              href={logoHref}
              className="text-primary hover:text-primary/90"
              onClick={() => router.push(logoHref)}
            >
              <Logo />
            </a>

            {/* Navigation menu - only show on dashboard */}
            {isDashboardPage && (
              <NavigationMenu viewport={false} className="max-md:hidden">
                <NavigationMenuList className="gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      {link.submenu ? (
                        <>
                          <NavigationMenuTrigger className="text-muted-foreground hover:text-primary bg-transparent px-2 py-1.5 font-medium *:[svg]:-me-0.5 *:[svg]:size-3.5">
                            {link.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                            <ul
                              className={cn(
                                link.type === "description"
                                  ? "min-w-64"
                                  : "min-w-48"
                              )}
                            >
                              {link.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <NavigationMenuLink
                                    href={item.href}
                                    className="py-1.5"
                                    onClick={() => handleNavItemClick(item.href)}
                                  >
                                    {/* Display icon if present */}
                                    {link.type === "icon" && "icon" in item && (
                                      <div className="flex items-center gap-2">
                                        {item.icon === "BookOpenIcon" && (
                                          <BookOpenIcon
                                            size={16}
                                            className="text-foreground opacity-60"
                                            aria-hidden="true"
                                          />
                                        )}
                                        {item.icon === "LifeBuoyIcon" && (
                                          <LifeBuoyIcon
                                            size={16}
                                            className="text-foreground opacity-60"
                                            aria-hidden="true"
                                          />
                                        )}
                                        {item.icon === "InfoIcon" && (
                                          <InfoIcon
                                            size={16}
                                            className="text-foreground opacity-60"
                                            aria-hidden="true"
                                          />
                                        )}
                                        <span>{item.label}</span>
                                      </div>
                                    )}

                                    {/* Display label with description if present */}
                                    {link.type === "description" &&
                                    "description" in item ? (
                                      <div className="space-y-1">
                                        <div className="font-medium">
                                          {item.label}
                                        </div>
                                        <p className="text-muted-foreground line-clamp-2 text-xs">
                                          {item.description}
                                        </p>
                                      </div>
                                    ) : (
                                      // Display simple label if not icon or description type
                                      !link.type ||
                                      (link.type !== "icon" &&
                                        link.type !== "description" && (
                                          <span>{item.label}</span>
                                        ))
                                    )}
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={link.href}
                          className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                          onClick={() => handleNavItemClick(link.href)}
                        >
                          {link.label}
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Landing Page Actions */}
          {isLandingPage && !user && (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/auth">Sign In</a>
              </Button>
              <Button asChild size="sm" className="text-sm">
                <a href="/auth">Get Started</a>
              </Button>
            </>
          )}

          {/* Auth Page Actions */}
          {isAuthPage && (
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <a href="/">← Back to Home</a>
            </Button>
            )}

          {/* Dashboard Actions */}
          {isDashboardPage && user && (
            <>
              <Button asChild variant="ghost" size="sm" className="text-sm">
                <a href="/dashboard/profile">Profile</a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

