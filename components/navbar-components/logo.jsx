import Image from 'next/image';
import TeamPulseLogo from '../asset/team-pulse.svg';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center">
        <Image
          src={TeamPulseLogo}
          alt="Team Pulse Logo"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <span className="font-bold">Team Pulse</span>
    </div>
  );
}
