import React from 'react';
import { KineticText } from '../../components/ui/motion/KineticText';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function KineticTextDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');


  return (
    <>
      <div className="modui-canvas-stage">
        <div className="modui-detail-kinetic-wrap">
                        <KineticText
                          as="h2"
                          text="Crafted with kinetic physics & precision motion."
                          interactiveWave={true}
                        />
                        <p style={{ marginTop: '1rem', color: '#71717a', fontSize: '0.85rem' }}>
                          Hover cursor across letters to test real-time GSAP wave stagger.
                        </p>
                      </div>
      </div>


    </>
  );
}
