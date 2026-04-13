import { clsx } from 'clsx';
import patentSvg from '../../pictures/patent.svg';
import trademarkSvg from '../../pictures/trademark.svg';
import copyrightSvg from '../../pictures/copyright.svg';

export function LogoCloud({ className }) {
  return (
    <div
      className={clsx(
        className,
        'flex justify-between max-sm:mx-auto max-sm:max-w-md max-sm:flex-wrap max-sm:justify-evenly max-sm:gap-x-4 max-sm:gap-y-4',
      )}
    >
      <img
        alt="Patent"
        src={patentSvg}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Trademark"
        src={trademarkSvg}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
      <img
        alt="Copyright"
        src={copyrightSvg}
        className="h-9 max-sm:mx-auto sm:h-8 lg:h-12"
      />
    </div>
  );
}
