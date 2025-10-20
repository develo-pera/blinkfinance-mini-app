"use client";

import { useState, useRef, useEffect } from "react";
import { ModeToggle } from "./common/toggle-mode";
import Image from "next/image";
import CONSTANTS from "@/lib/consts";

const Onboarding = ({ setShowOnboarding }: { setShowOnboarding: (show: boolean) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 1,
      title: "Welcome to Blink Finance",
      content: "A place where you can get cash loans for your business in a blink of an eye.",
      image: "/miniapp-logo.jpg"
    },
    {
      id: 2,
      title: "Improve your cash flow",
      content: "Create a company profile, upload invoices and receive stablecoins in your wallet.",
      image: "/dollar3.jpg"
    },
    {
      id: 3,
      title: "Secure & Fast",
      content: "Built on Base for fast, secure transactions.",
      image: "/base-square.svg"
    }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - startX;
    setDragOffset(deltaX);
    setCurrentX(touchX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaX = currentX - startX;
    const threshold = 50; // Minimum drag distance to trigger slide

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentStep > 0) {
        // Swipe right - go to previous
        setCurrentStep(currentStep - 1);
      } else if (deltaX < 0 && currentStep < steps.length - 1) {
        // Swipe left - go to next
        setCurrentStep(currentStep + 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const mouseX = e.clientX;
    const deltaX = mouseX - startX;
    setDragOffset(deltaX);
    setCurrentX(mouseX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const deltaX = currentX - startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else if (deltaX < 0 && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToEnd = () => {
    setCurrentStep(steps.length - 1);
  };

  const getStarted = () => {
    localStorage.setItem(CONSTANTS.localStorageKeys.BFOnboadingCompleted, "true");
    setShowOnboarding(false);
  };

  // Add mouse event listeners for desktop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const mouseX = e.clientX;
      const deltaX = mouseX - startX;
      setDragOffset(deltaX);
      setCurrentX(mouseX);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging) return;

      const deltaX = currentX - startX;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && currentStep > 0) {
          setCurrentStep(currentStep - 1);
        } else if (deltaX < 0 && currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }

      setIsDragging(false);
      setDragOffset(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startX, currentX, currentStep]);

  return (
    <div className="h-screen p-4">
      <div className="flex flex-col items-center justify-between bg-background rounded-lg p-2 h-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <button
            onClick={skipToEnd}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
          <div className="flex items-center justify-between">
            <ModeToggle />
          </div>
        </div>

        {/* Slider Container */}
        <div
          ref={containerRef}
          className="flex-1 w-full overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            ref={sliderRef}
            className="flex h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(-${currentStep * 100}% + ${dragOffset}px))`,
              width: `100%`
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4"
                style={{ width: `100%` }}
              >
                <div className="text-center space-y-6">
                  <div className="relative">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={120}
                      height={120}
                      className="mx-auto rounded-lg"
                      priority={index === 0}
                    />
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground text-center max-w-sm">
                      {step.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full space-y-6">
          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                  ? 'bg-primary w-8'
                  : 'bg-muted hover:bg-muted-foreground'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentStep === 0
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-primary hover:bg-primary/10'
                }`}
            >
              Previous
            </button>

            <button
              onClick={currentStep === steps.length - 1 ? getStarted : nextStep}
              className={`px-6 py-2 rounded-sm font-medium transition-all duration-200 ${currentStep === steps.length - 1
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'text-primary hover:bg-primary/10'
                }`}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;