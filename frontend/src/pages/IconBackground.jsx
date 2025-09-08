import { useEffect, useState } from "react";
import { 
  LibraryBig, 
  GraduationCap, 
  Notebook, 
  Lightbulb, 
  Brain, 
  Laptop, 
  Pencil 
} from "lucide-react";

export default function IconBackground() {
  const icons = [LibraryBig, GraduationCap, Notebook, Lightbulb, Brain, Laptop, Pencil];

  const [grid, setGrid] = useState({ rows: 6, cols: 6 }); // default mobile

  useEffect(() => {
    const updateGrid = () => {
      if (window.innerWidth < 768) {
        // mobile
        setGrid({ rows: 6, cols: 6 });
      } else {
        // tablet and up
        setGrid({ rows: 12, cols: 12 });
      }
    };

    updateGrid(); // run once at start
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  return (
    <div
      className="absolute inset-0 -z-10 h-screen w-screen grid gap-4 opacity-10"
      style={{
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      }}
    >
      {Array.from({ length: grid.rows * grid.cols }).map((_, i) => {
        const Icon = icons[i % icons.length];
        return (
          <Icon
            key={i}
            className="w-10 h-10 text-seven animate-spin-custom"
          />
        );
      })}
    </div>
  );
}
