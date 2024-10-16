"use client";

import Navbar from "@/components/Navbar";
import ProjectModal from "@/components/ProjectModal";
import React, { useState } from "react";
import Image from "next/image";
import { Project, projects } from "@/types/const";

const Card: React.FC<Project & { onClick: () => void }> = ({
  name,
  projectLogoUrl,
  projectCoverUrl,
  description,
  network,
  onClick,
}) => {
  return (
    <div
      className="rounded-xl bg-white shadow-lg overflow-hidden w-full transition-all duration-300 hover:shadow-2xl hover:scale-102 cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={projectCoverUrl}
          alt="Project Banner"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute -bottom-6 left-4 w-20 h-20">
          <Image
            src={projectLogoUrl}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
        <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
          {network}
        </span>
      </div>
      <div className="p-6 pt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

const ProjectsIndex: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // const [cartItems, setCartItems] = useState<
  //   { id: string; name: string; amount: number }[]
  // >([]);
  // const [isCartOpen, setIsCartOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // const addToCart = (project: Project) => {
  //   setCartItems((prevItems) => {
  //     const existingItem = prevItems.find((item) => item.id === project.id);
  //     if (existingItem) {
  //       return prevItems.map((item) =>
  //         item.id === project.id ? { ...item, amount: item.amount + 1 } : item
  //       );
  //     }
  //     return [...prevItems, { id: project.id, name: project.name, amount: 1 }];
  //   });
  //   setIsCartOpen(true);
  // };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Explore Projects
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                {...project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProjectsIndex;
