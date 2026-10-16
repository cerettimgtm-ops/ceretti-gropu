"use client";

import { useRef, memo } from "react";
import { projects } from "@/lib/constant";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

// Tipado de props para el componente de la tarjeta
interface ProjectCardProps {
  data: (typeof projects)[number];
  index: number;
  isClone?: boolean;
  leftCurtainX: MotionValue<string>;
  rightCurtainX: MotionValue<string>;
}

// 1. Tarjeta memoizada para evitar re-renders y duplicación de JSX
const ProjectCard = memo(function ProjectCard({
  data,
  index,
  isClone = false,
  leftCurtainX,
  rightCurtainX,
}: ProjectCardProps) {
  // Solo aplicamos prioridad de carga a las primeras 2 imágenes visibles del bloque principal
  const isPriority = !isClone && index < 2;

  return (
    <div className="group relative w-[27rem] sm:w-[34rem] md:w-[42rem] aspect-[1080/1350] shrink-0 transition-transform duration-500 hover:-translate-y-1 will-change-transform">
      <div className="relative h-full w-full overflow-hidden bg-ink">
        <Image
          src={data.img}
          alt={`Proyecto ${data.name}`}
          fill
          sizes="(max-width: 640px) 27rem, (max-width: 768px) 34rem, 42rem"
          priority={isPriority}
          loading={isPriority ? undefined : "lazy"}
          quality={85}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <motion.div
          style={{ x: leftCurtainX }}
          className="absolute inset-y-0 left-0 w-1/2 bg-ink z-10"
        />
        <motion.div
          style={{ x: rightCurtainX }}
          className="absolute inset-y-0 right-0 w-1/2 bg-ink z-10"
        />
      </div>
    </div>
  );
});

export function ProjectsScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftCurtainX = useTransform(
    scrollYProgress,
    [0, 0.22, 0.8, 1],
    ["0%", "-101%", "-101%", "0%"]
  );

  const rightCurtainX = useTransform(
    scrollYProgress,
    [0, 0.22, 0.8, 1],
    ["0%", "101%", "101%", "0%"]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.8, 1],
    [0.82, 1, 1, 0.82]
  );

  return (
    <div ref={sectionRef} className="w-full overflow-hidden">
      <motion.div style={{ scale }} className="origin-center">
        <div
          className="flex w-max items-center gap-6 md:gap-8 animate-marquee py-2 hover:[animation-play-state:paused]"
          style={{ animationDuration: "22s" }}
        >
          {/* Loop limpio: Renderizamos el bloque original (false) y el clon (true) */}
          {[false, true].map((isClone) => (
            <div
              key={isClone ? "clone-block" : "orig-block"}
              className="flex items-center gap-6 md:gap-8 shrink-0"
              aria-hidden={isClone ? "true" : undefined}
            >
              {projects.map((data, index) => (
                <ProjectCard
                  key={`${isClone ? "clone" : "orig"}-${index}`}
                  data={data}
                  index={index}
                  isClone={isClone}
                  leftCurtainX={leftCurtainX}
                  rightCurtainX={rightCurtainX}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
