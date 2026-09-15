import { CSSProperties } from 'react';

type Props = {
  name: string;
  hex: string;
  imagePath: string | null;
  tall?: boolean;
  wide?: boolean;
};

export default function ProductVisual({ name, hex, imagePath, tall, wide }: Props) {
  const variant = wide ? ' lux-visual--wide' : tall ? ' lux-visual--tall' : '';
  return (
    <div className={`lux-visual${variant}`} style={{ '--c': hex } as CSSProperties}>
      <span className="lux-visual__tint" />
      {imagePath ? (
        <img src={imagePath} alt={name} />
      ) : (
        <>
          <span className="lux-visual__frame" />
          <span className="lux-visual__ph">
            <svg className="lux-visual__motif" viewBox="0 0 140 140" fill="none" stroke="currentColor" strokeWidth="0.9" aria-hidden="true">
              <circle cx="70" cy="70" r="46" />
              <circle cx="70" cy="70" r="33" opacity=".55" />
              <path d="M70 32c11 16 11 60 0 76-11-16-11-60 0-76z" opacity=".7" />
              <path d="M32 70c16-11 60-11 76 0-16 11-60 11-76 0z" opacity=".4" />
            </svg>
            <span className="lux-visual__mark">Lumiéra</span>
          </span>
        </>
      )}
    </div>
  );
}
