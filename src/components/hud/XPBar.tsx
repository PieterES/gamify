"use client";

interface XPBarProps {
  xp: number;
  level: number;
  levelName: string;
  progress: number; // 0-100
  nextLevelXP?: number;
}

export function XPBar({ xp, level, levelName, progress, nextLevelXP }: XPBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-cyber-accent font-semibold">Lv.{level} {levelName}</span>
        <span className="text-cyber-muted font-mono">{xp.toLocaleString()} XP</span>
      </div>
      <div className="w-full h-2 bg-cyber-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-accent to-cyber-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {nextLevelXP && (
        <div className="text-right text-xs text-cyber-muted font-mono">{nextLevelXP.toLocaleString()} XP to next</div>
      )}
    </div>
  );
}
