import React from 'react';
import { Badge } from '../../components/ui/badge';

export interface DemoProps {
  theme?: 'light' | 'dark';
}

export default function BadgeDemo({ theme }: DemoProps) {
  const isDark = theme ? theme === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');


  return (
    <>
      <div className="modui-canvas-stage">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                        <Badge variant="accent" dot pulse>
                          Live Radar Pulse
                        </Badge>
                      </div>
      </div>


    </>
  );
}
