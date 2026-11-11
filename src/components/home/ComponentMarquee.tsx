import React from 'react';
import { COMPONENT_REGISTRY } from '../../registry/components';
import './ComponentMarquee.css';

interface ComponentMarqueeProps {
  onNavigate: (path: string) => void;
}

/**
 * Endless index of every component in the library.
 * Pauses on hover/focus; hovering a name dims the rest so it reads like a list.
 */
export const ComponentMarquee: React.FC<ComponentMarqueeProps> = ({ onNavigate }) => {
  const items = COMPONENT_REGISTRY.filter((c) => c.status === 'published');
  const list = items.length ? items : COMPONENT_REGISTRY;

  const renderTrack = (hidden: boolean) => (
    <ul className="modui-marquee-track" aria-hidden={hidden || undefined}>
      {list.map((comp) => (
        <li key={`${hidden ? 'b' : 'a'}-${comp.slug}`} className="modui-marquee-item">
          <a
            href={`/components/${comp.slug}`}
            tabIndex={hidden ? -1 : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/components/${comp.slug}`);
            }}
          >
            {comp.name}
          </a>
          <span className="modui-marquee-glyph" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <section className="modui-marquee" aria-label="All components">
      <div className="modui-marquee-viewport" style={{ '--marquee-duration': `${list.length * 3.2}s` } as React.CSSProperties}>
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </section>
  );
};

export default ComponentMarquee;
