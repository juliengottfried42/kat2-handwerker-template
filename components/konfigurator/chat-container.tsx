"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChatState,
  ChatStep,
  createBotMessage,
  createUserMessage,
  findStep,
  getInitialState,
  getNextStepOrder,
} from "./chat-engine";
import { ChatMessageBubble, TypingIndicator } from "./chat-message";
import { ChatOptions } from "./chat-options";
import { ChatPhotoUpload } from "./chat-photo-upload";
import { ChatCalendar } from "./chat-calendar";
import { ChatContactForm } from "./chat-contact-form";

interface ChatContainerProps {
  steps: ChatStep[];
  services: { title: string; price_from: number | null }[];
}

const CONTACT_STEP = 9999;

export function ChatContainer({ steps, services }: ChatContainerProps) {
  const [state, setState] = useState<ChatState>(getInitialState);
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Show first question on mount
  useEffect(() => {
    setState((s) => ({ ...s, isTyping: true }));
    const timer = setTimeout(() => {
      const firstStep = findStep(steps, 1);
      if (!firstStep) return;
      setState((s) => ({
        ...s,
        isTyping: false,
        messages: [...s.messages, createBotMessage(firstStep.question)],
        currentStep: 1,
      }));
    }, 800);
    return () => clearTimeout(timer);
  }, [steps]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isTyping]);

  function advanceToStep(stepOrder: number) {
    setState((s) => ({ ...s, isTyping: true }));
    setTimeout(() => {
      if (stepOrder === CONTACT_STEP) {
        setState((s) => ({
          ...s,
          isTyping: false,
          currentStep: CONTACT_STEP,
          messages: [
            ...s.messages,
            createBotMessage("Super! Bitte hinterlassen Sie Ihre Kontaktdaten und wir melden uns bei Ihnen."),
          ],
        }));
        return;
      }

      const nextStep = findStep(steps, stepOrder);
      if (!nextStep) {
        // No more steps — go to contact form
        setState((s) => ({
          ...s,
          isTyping: false,
          currentStep: CONTACT_STEP,
          messages: [
            ...s.messages,
            createBotMessage("Super! Bitte hinterlassen Sie Ihre Kontaktdaten und wir melden uns bei Ihnen."),
          ],
        }));
        return;
      }

      setState((s) => ({
        ...s,
        isTyping: false,
        currentStep: nextStep.step_order,
        messages: [...s.messages, createBotMessage(nextStep.question)],
      }));
    }, 1000);
  }

  function handleOptionSelect(value: string, label: string) {
    const currentStep = findStep(steps, state.currentStep);
    if (!currentStep) return;

    const nextStepOrder = getNextStepOrder(currentStep, value);

    setState((s) => ({
      ...s,
      answers: { ...s.answers, [currentStep.id]: label },
      messages: [...s.messages, createUserMessage(label)],
    }));

    advanceToStep(nextStepOrder ?? CONTACT_STEP);
  }

  function handlePhotoUpload(urls: string[]) {
    const currentStep = findStep(steps, state.currentStep);
    const nextStepOrder = currentStep ? getNextStepOrder(currentStep) : null;

    setState((s) => ({
      ...s,
      photos: [...s.photos, ...urls],
      messages: [...s.messages, createUserMessage(`${urls.length} Foto(s) hochgeladen`)],
    }));

    advanceToStep(nextStepOrder ?? CONTACT_STEP);
  }

  function handlePhotoSkip() {
    const currentStep = findStep(steps, state.currentStep);
    const nextStepOrder = currentStep ? getNextStepOrder(currentStep) : null;

    setState((s) => ({
      ...s,
      messages: [...s.messages, createUserMessage("Keine Fotos")],
    }));

    advanceToStep(nextStepOrder ?? CONTACT_STEP);
  }

  function handleDateSelect(date: string) {
    const currentStep = findStep(steps, state.currentStep);
    const nextStepOrder = currentStep ? getNextStepOrder(currentStep) : null;

    // Find price estimate based on first answer
    const firstAnswer = Object.values(state.answers)[0];
    const matchedService = services.find((s) => s.title === firstAnswer);
    const priceMsg = matchedService?.price_from
      ? `Geschätzter Preis ab CHF ${matchedService.price_from}.–`
      : null;

    const dateFormatted = new Date(date).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    setState((s) => {
      const newMessages = [...s.messages, createUserMessage(dateFormatted)];
      if (priceMsg) {
        newMessages.push(createBotMessage(priceMsg));
      }
      return {
        ...s,
        preferredDate: date,
        messages: newMessages,
      };
    });

    advanceToStep(nextStepOrder ?? CONTACT_STEP);
  }

  async function handleContactSubmit(data: {
    name: string;
    phone: string;
    email: string;
    message?: string;
  }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          answers: state.answers,
          photos: state.photos,
          preferred_date: state.preferredDate,
        }),
      });

      if (res.ok) {
        setState((s) => ({
          ...s,
          isComplete: true,
          messages: [
            ...s.messages,
            createBotMessage(
              "Vielen Dank! Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden bei Ihnen."
            ),
          ],
        }));
      } else {
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            createBotMessage(
              "Es tut uns leid, da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an."
            ),
          ],
        }));
      }
    } catch {
      setState((s) => ({
        ...s,
        messages: [
          ...s.messages,
          createBotMessage(
            "Es tut uns leid, da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an."
          ),
        ],
      }));
    } finally {
      setSubmitting(false);
    }
  }

  const currentStep = findStep(steps, state.currentStep);
  const isContactStep =
    state.currentStep === CONTACT_STEP ||
    (currentStep &&
      !currentStep.show_upload &&
      !currentStep.show_calendar &&
      currentStep.options.length === 0 &&
      currentStep.next_step === null);
  const showContactForm = isContactStep && !state.isComplete;

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="bg-warm-50 rounded-2xl p-4 min-h-[400px] flex flex-col gap-4">
        {/* Messages */}
        <div className="flex flex-col gap-3" aria-live="polite" aria-relevant="additions">
          {state.messages.map((msg) => (
            <ChatMessageBubble key={msg.id} type={msg.type} text={msg.text} />
          ))}
          {state.isTyping && <TypingIndicator />}
        </div>

        {/* Controls */}
        {!state.isTyping && !state.isComplete && (
          <div className="mt-2">
            {showContactForm ? (
              <ChatContactForm onSubmit={handleContactSubmit} submitting={submitting} />
            ) : currentStep?.show_calendar ? (
              <ChatCalendar onSelect={handleDateSelect} />
            ) : currentStep?.show_upload ? (
              <ChatPhotoUpload onUpload={handlePhotoUpload} onSkip={handlePhotoSkip} />
            ) : currentStep?.options && currentStep.options.length > 0 ? (
              <ChatOptions options={currentStep.options} onSelect={handleOptionSelect} />
            ) : null}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
