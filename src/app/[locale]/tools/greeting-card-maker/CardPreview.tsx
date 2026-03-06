'use client';
import React, { forwardRef, CSSProperties } from 'react';
import type { CardTemplate } from './templates';

interface CardState {
  recipientName: string;
  greeting: string;
  message: string;
  senderName: string;
  fontFamily: string;
  colorOverride?: string;
}

function getPatternCSS(pattern: CardTemplate['decorPattern'], color: string): CSSProperties {
  const c = color + '18'; // low opacity hex
  const c2 = color + '10';
  switch (pattern) {
    case 'dots':
      return { backgroundImage: `radial-gradient(circle, ${c} 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' };
    case 'stars':
      return { backgroundImage: `radial-gradient(circle, ${c} 2px, transparent 2px), radial-gradient(circle, ${c2} 1px, transparent 1px)`, backgroundSize: '30px 30px, 15px 15px', backgroundPosition: '0 0, 7px 7px' };
    case 'hearts':
      return { backgroundImage: `radial-gradient(circle, ${c} 3px, transparent 3px)`, backgroundSize: '28px 28px' };
    case 'confetti':
      return { backgroundImage: `radial-gradient(circle, ${color}20 2px, transparent 2px), radial-gradient(circle, ${color}15 3px, transparent 3px), radial-gradient(circle, ${color}10 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px, 25px 25px, 60px 60px', backgroundPosition: '0 0, 12px 18px, 30px 5px' };
    case 'floral':
      return { backgroundImage: `radial-gradient(ellipse, ${c} 4px, transparent 4px)`, backgroundSize: '50px 50px' };
    case 'waves':
      return { backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${c} 10px, ${c} 12px)` };
    case 'diamonds':
      return { backgroundImage: `linear-gradient(45deg, ${c} 25%, transparent 25%), linear-gradient(-45deg, ${c} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${c} 75%), linear-gradient(-45deg, transparent 75%, ${c} 75%)`, backgroundSize: '30px 30px', backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0' };
    case 'circles':
      return { backgroundImage: `radial-gradient(circle, transparent 40%, ${c} 41%, ${c} 44%, transparent 45%)`, backgroundSize: '40px 40px' };
    default:
      return {};
  }
}

export const CardPreview = forwardRef<HTMLDivElement, { template: CardTemplate; state: CardState; scale?: number }>(
  function CardPreview({ template, state, scale = 1 }, ref) {
    const accent = state.colorOverride || template.accentColor;
    const font = state.fontFamily || template.fontFamily;
    const titleFont = state.fontFamily || template.titleFontFamily;
    const patternStyles = getPatternCSS(template.decorPattern, accent);

    const containerStyle: CSSProperties = {
      width: 600,
      minHeight: 400,
      position: 'relative',
      background: template.background,
      borderRadius: template.borderRadius,
      boxShadow: template.shadow,
      padding: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
    };

    const cardStyle: CSSProperties = {
      width: '100%',
      minHeight: 352,
      background: template.cardBg,
      border: template.borderStyle.replace(template.accentColor, accent),
      borderRadius: template.borderRadius,
      padding: '36px 32px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      ...patternStyles,
    };

    const greeting = state.greeting || template.defaultGreeting;
    const message = state.message || template.defaultMessage;

    return (
      <div ref={ref} data-card style={containerStyle}>
        <div style={cardStyle}>
          {/* Top Emoji */}
          {template.decorEmoji && (
            <div style={{ fontSize: 36, marginBottom: 8, lineHeight: 1 }}>
              {template.decorEmoji}
            </div>
          )}

          {/* Greeting / Title */}
          <div style={{
            fontFamily: titleFont,
            fontSize: template.titleSize || '28px',
            fontWeight: 700,
            color: state.colorOverride || template.titleColor,
            marginBottom: 16,
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}>
            {greeting}
          </div>

          {/* Recipient Name */}
          {state.recipientName && (
            <div style={{
              fontFamily: font,
              fontSize: '15px',
              color: template.messageColor,
              marginBottom: 8,
              fontStyle: 'italic',
            }}>
              Dear {state.recipientName},
            </div>
          )}

          {/* Message Body */}
          <div style={{
            fontFamily: font,
            fontSize: '14px',
            color: template.messageColor,
            lineHeight: 1.7,
            maxWidth: 440,
            marginBottom: 20,
          }}>
            {message}
          </div>

          {/* Sender */}
          {state.senderName && (
            <div style={{
              fontFamily: font,
              fontSize: '14px',
              color: state.colorOverride || template.senderColor,
              fontWeight: 600,
            }}>
              <span style={{ fontWeight: 400, fontStyle: 'italic', opacity: 0.7 }}>With love, </span>
              {state.senderName}
            </div>
          )}

          {/* Bottom Emoji */}
          {template.decorEmojiBottom && (
            <div style={{ fontSize: 28, marginTop: 12, lineHeight: 1, opacity: 0.7 }}>
              {template.decorEmojiBottom}
            </div>
          )}

          {/* Accent line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            right: '15%',
            height: 3,
            background: accent,
            borderRadius: '3px 3px 0 0',
            opacity: 0.5,
          }} />
        </div>
      </div>
    );
  }
);
